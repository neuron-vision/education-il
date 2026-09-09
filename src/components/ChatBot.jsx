import { useEffect, useRef, useState } from 'react'
import { signInWithPopup, signOut } from 'firebase/auth'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { auth, googleProvider } from '../firebase'
import { useAuth } from '../lib/useAuth'
import './ChatBot.css'

const CHAT_FUNCTION_URL = 'https://us-central1-education-il.cloudfunctions.net/chat'

// gemini-flash-latest pricing per 1M tokens (USD) — update if the model in functions/index.js changes.
const PRICE_PER_M_INPUT = 0.075
const PRICE_PER_M_OUTPUT = 0.30

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
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, open])

  async function signIn() {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'assistant', text: `שגיאת התחברות: ${e.message}` }])
    }
  }

  async function send(overrideText) {
    const text = (overrideText ?? input).trim()
    if (!text || busy || !user) return
    setInput('')
    setBusy(true)

    const history = [...messages, { role: 'user', text }]
    setMessages([...history, { role: 'assistant', text: '' }])

    try {
      const token = await user.getIdToken()
      // One doc per sign-in session — stable for the lifetime of this login,
      // shared by every message so the chat function can append to one row.
      const sessionId = user.metadata.lastSignInTime
      const res = await fetch(CHAT_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messages: history, sessionId, pageText: pageText() }),
      })

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({}))
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
            continue
          }
          assistantText += chunk
          setMessages((prev) => {
            const next = [...prev]
            next[next.length - 1] = { role: 'assistant', text: assistantText }
            return next
          })
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
              <div className="cb-input-row">
                <textarea
                  value={input}
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
                <button type="button" onClick={() => send()} disabled={busy || !input.trim()}>שלח</button>
              </div>
              <button type="button" className="cb-signout" onClick={() => signOut(auth)}>
                התנתק ({user.displayName}
                {user.isAdmin && <span className="cb-admin-badge">מנהל</span>})
              </button>
            </>
          )}
        </div>
      )}
      <button type="button" className="cb-bubble" onClick={() => setOpen((o) => !o)}>
        {open ? '✕' : '🤖'}
      </button>
    </div>
  )
}
