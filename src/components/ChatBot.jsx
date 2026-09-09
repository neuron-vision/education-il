import { useEffect, useRef, useState } from 'react'
import { signInWithPopup, signOut } from 'firebase/auth'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import toast, { Toaster } from 'react-hot-toast'
import { getToken } from 'firebase/app-check'
import { auth, appCheck, googleProvider } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../lib/useAuth'
import { track } from '../lib/analytics'
import { RESEARCH_CONTEXT } from '../data/educationData.js'
import './ChatBot.css'

// Mirrors UNAUTHORIZED_USE_KEY in functions/chatPolicy.js. The server already strips this
// sentinel out of every streamed reply before it ever reaches the client (see index.js), so
// this check should never actually fire — it exists as defense in depth in case a bug or a
// future model/server change lets it leak through, in which case the chat still locks itself
// client-side rather than silently displaying the raw key to the user.
const UNAUTHORIZED_USE_KEY = '__EDUIL_LOCK_9f3a2e__'

const CHAT_FUNCTION_URL =
  import.meta.env.VITE_USE_EMULATORS === 'true'
    ? 'http://127.0.0.1:15501/education-il/us-central1/chat'
    : 'https://us-central1-education-il.cloudfunctions.net/chat'

// gemini-flash-latest pricing per 1M tokens (USD) — update if the model in functions/index.js changes.
const PRICE_PER_M_INPUT = 0.075
const PRICE_PER_M_OUTPUT = 0.30
const MAX_MESSAGE_CHARS = 2000

// Module-level (not component state) so it survives widget close/reopen and
// only fires once per page load — our proxy for "once per session".
let firstMessageSentThisSession = false

function pageText() {
  return document.body.innerText.replace(/\s+/g, ' ').trim()
}

export default function ChatBot() {
  const user = useAuth()
  const [open, setOpen] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [usage, setUsage] = useState({ inputTokens: 0, outputTokens: 0 })
  const [lock, setLock] = useState(null)
  const [clock, setClock] = useState(Date.now())
  const scrollRef = useRef(null)
  const gotFirstValidResponse = useRef(false)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, open])

  useEffect(() => {
    if (!user) { setLock(null); return undefined }
    let cancelled = false
    async function loadLock() {
      const snapshot = await getDocs(collection(db, 'users', user.uid, 'locks'))
      const active = snapshot.docs.map((item) => item.data()).map((data) => ({
        ...data,
        releaseAt: data.releaseAt?.toDate?.() || new Date(data.releaseAt),
      })).filter((item) => item.releaseAt > new Date()).sort((a, b) => b.releaseAt - a.releaseAt)[0]
      if (!cancelled && active) setLock(active)
    }
    loadLock().catch(() => {})
    return () => { cancelled = true }
  }, [user])

  useEffect(() => {
    if (!lock) return undefined
    const timer = setInterval(() => {
      setClock(Date.now())
      if (lock.releaseAt <= new Date()) setLock(null)
    }, 1000)
    return () => clearInterval(timer)
  }, [lock])

  function countdown() {
    if (!lock) return ''
    const seconds = Math.max(0, Math.ceil((lock.releaseAt - clock) / 1000))
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${days} ימים ${hours} שעות ${minutes} דקות ${secs} שניות`
  }

  async function signIn() {
    try {
      await signInWithPopup(auth, googleProvider)
      track('chatbot_sign_in')
    } catch (e) {
      track('chatbot_sign_in_error', { message: e.message })
      setMessages((prev) => [...prev, { role: 'assistant', text: `שגיאת התחברות: ${e.message}` }])
    }
  }

  async function send(overrideText) {
    const text = (overrideText ?? input).trim()
    if (!text || busy || !user || lock || text.length > MAX_MESSAGE_CHARS) return
    setInput('')
    setBusy(true)
    track('chatbot_send_message', { message_length: text.length, is_suggested: overrideText !== undefined })
    if (!firstMessageSentThisSession) {
      firstMessageSentThisSession = true
      track('chatbot_first_message_session')
    }

    const history = [...messages, { role: 'user', text }]
    setMessages([...history, { role: 'assistant', text: '' }])

    try {
      const token = await user.getIdToken()
      const appCheckToken = await getToken(appCheck)
      // One doc per sign-in session — stable for the lifetime of this login,
      // shared by every message so the chat function can append to one row.
      const sessionId = user.metadata.lastSignInTime
      const res = await fetch(CHAT_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Firebase-AppCheck': appCheckToken.token,
        },
        body: JSON.stringify({ messages: history, sessionId, pageText: `${RESEARCH_CONTEXT}\n${pageText()}` }),
      })

      if (res.status === 423) {
        const yaml = await res.text()
        const release = yaml.match(/release_at:\s*"([^"]+)"/)?.[1]
        setLock({ releaseAt: release ? new Date(release) : new Date(Date.now() + 3 * 86400000), reason: yaml })
        toast.error('שימוש לא מאושר ונחסם', { className: 'cb-toast-blocked' })
        track('chatbot_locked')
        throw new Error('הצ׳אט ננעל. ניתן לראות את הספירה לאחור בחלון הצ׳אט.')
      }
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({}))
        track('chatbot_error', { status: res.status })
        throw new Error(err.error || `שגיאת שרת (${res.status})`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let assistantText = ''

      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop()
        for (const line of lines) {
          const payload = line.replace(/^data: /, '').trim()
          if (!payload || payload === '[DONE]') continue
          const { text: chunk, error, usage: chunkUsage } = JSON.parse(payload)
          if (error) throw new Error(error)
          if (chunkUsage) {
            setUsage((u) => ({
              inputTokens: u.inputTokens + chunkUsage.inputTokens,
              outputTokens: u.outputTokens + chunkUsage.outputTokens,
            }))
            track('chatbot_response_complete', chunkUsage)
            continue
          }
          assistantText += chunk
          if (assistantText.includes(UNAUTHORIZED_USE_KEY)) {
            toast.error('שימוש לא מאושר ונחסם', { className: 'cb-toast-blocked' })
            setMessages((prev) => {
              const next = [...prev]
              next[next.length - 1] = { role: 'assistant', text: 'הבקשה זוהתה כשימוש לא מאושר. הצ׳אט נחסם.' }
              return next
            })
            setLock({ releaseAt: new Date(Date.now() + 3 * 86400000), reason: 'unauthorized use (client-side catch)' })
            await reader.cancel().catch(() => {})
            return
          }
          setMessages((prev) => {
            const next = [...prev]
            next[next.length - 1] = { role: 'assistant', text: assistantText }
            return next
          })
          if (!gotFirstValidResponse.current) {
            gotFirstValidResponse.current = true
            track('chatbot_first_valid_response')
          }
        }
      }
    } catch (e) {
      setMessages((prev) => {
        const next = [...prev]
        next[next.length - 1] = { role: 'assistant', text: `שגיאה: ${e.message}` }
        return next
      })
    } finally {
      setBusy(false)
    }
  }

  const SUGGESTED = ['מה המקורות לנתונים באתר?', 'מה המגמה המרכזית בתקציב החינוך?']

  return (
    <div className="cb-root" dir="rtl">
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'cb-toast-blocked',
          duration: 6000,
          style: { background: '#b8433d', color: '#fff', fontWeight: 700, fontSize: '14px' },
          iconTheme: { primary: '#fff', secondary: '#b8433d' },
        }}
      />
      {open && (
        <div className={`cb-window${maximized ? ' cb-window-maximized' : ''}`}>
          <div className="cb-header">
            <span>🤖 שאל על נתוני החינוך</span>
            <div className="cb-header-actions">
              {user && (
                <button type="button" onClick={() => { setMessages([]); setUsage({ inputTokens: 0, outputTokens: 0 }) }} title="נקה">↺</button>
              )}
              <button type="button" onClick={() => setMaximized((m) => !m)} title={maximized ? 'שחזור' : 'הגדלה'}>
                {maximized ? '⤡' : '⤢'}
              </button>
              <button type="button" onClick={() => setOpen(false)} title="סגור">✕</button>
            </div>
          </div>

          {user?.isAdmin && (usage.inputTokens > 0 || usage.outputTokens > 0) && (
            <div className="cb-usage">
              {usage.inputTokens}↑ / {usage.outputTokens}↓ טוקנים · $
              {(
                (usage.inputTokens * PRICE_PER_M_INPUT + usage.outputTokens * PRICE_PER_M_OUTPUT) /
                1_000_000
              ).toFixed(4)}
            </div>
          )}

          {user === undefined ? (
            <div className="cb-gate"><p>טוען…</p></div>
          ) : !user ? (
            <div className="cb-gate">
              <p>יש להתחבר עם חשבון Google כדי להשתמש בעוזר, למניעת שימוש יתר.</p>
              <button type="button" onClick={signIn}>התחבר עם Google</button>
            </div>
          ) : (
            <>
              {lock && <div className="cb-lock" role="alert">הצ׳אט נעול.<br />שחרור בעוד: {countdown()}</div>}
              <div className="cb-messages" ref={scrollRef}>
                {messages.length === 0 && (
                  <div className="cb-suggestions">
                    {SUGGESTED.map((s) => (
                      <button key={s} type="button" onClick={() => send(s)}>{s}</button>
                    ))}
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`cb-msg cb-msg-${m.role}`}>
                    <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                      {m.text || '…'}
                    </Markdown>
                  </div>
                ))}
              </div>
              {!lock && <div className="cb-input-row">
                <textarea
                  value={input}
                  maxLength={MAX_MESSAGE_CHARS}
                  onPaste={(e) => {
                    const pasted = e.clipboardData.getData('text')
                    if (pasted.length > MAX_MESSAGE_CHARS) e.preventDefault()
                  }}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      send()
                    }
                  }}
                  placeholder="שאל שאלה..."
                  disabled={busy}
                />
                <span className="cb-char-count">{input.length}/{MAX_MESSAGE_CHARS}</span>
                <button type="button" onClick={() => send()} disabled={busy || !input.trim()}>שלח</button>
              </div>}
              <button type="button" className="cb-signout" onClick={() => { track('sign_out', { source: 'chatbot' }); signOut(auth) }}>
                התנתק ({user.displayName}
                {user.isAdmin && <span className="cb-admin-badge">מנהל</span>})
              </button>
            </>
          )}
        </div>
      )}
      <button
        type="button"
        className="cb-bubble"
        onClick={() => {
          const next = !open
          setOpen(next)
          track(next ? 'chatbot_open' : 'chatbot_close')
        }}
      >
        {open ? '✕' : '🤖'}
      </button>
    </div>
  )
}
