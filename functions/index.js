import { onRequest } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import { initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { GoogleGenerativeAI } from '@google/generative-ai'

initializeApp()

const GEMINI_KEY = defineSecret('GOOGLE_GENAI_API_KEY')
const MODEL_NAME = 'gemini-flash-latest'

const SYSTEM_PROMPT = `You are the assistant embedded in a public dashboard about the state of
education in Israel (education-il). Answer questions about the site's data, charts, and sources
using general knowledge of the topic when the exact figure isn't given. Cite concrete numbers
where possible. Reply in Hebrew by default; switch to English only if the user writes in English.
Keep replies concise and use Markdown (tables/lists) where helpful.`

// Only signed-in Google users may call this function — verifies the Firebase
// ID token sent as "Authorization: Bearer <token>" and rejects anything else,
// so the shared Gemini key behind it can't be hammered by anonymous traffic.
async function requireUser(req) {
  const authHeader = req.get('Authorization') || ''
  const match = authHeader.match(/^Bearer (.+)$/)
  if (!match) return null
  try {
    return await getAuth().verifyIdToken(match[1])
  } catch {
    return null
  }
}

export const chat = onRequest(
  { cors: true, secrets: [GEMINI_KEY], region: 'us-central1' },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    const decoded = await requireUser(req)
    if (!decoded) {
      res.status(401).json({ error: 'Sign-in required' })
      return
    }
    // Google Sign-In on the client is the only enabled provider, but check
    // explicitly in case that ever changes.
    const isGoogleUser = (decoded.firebase?.sign_in_provider === 'google.com')
    if (!isGoogleUser) {
      res.status(403).json({ error: 'Google sign-in required' })
      return
    }

    const { messages, sessionId } = req.body || {}
    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'messages array required' })
      return
    }
    // One doc per login session, keyed by the client-supplied login timestamp;
    // falls back to "unknown" so a malformed session id can't crash logging.
    const chatDocRef = getFirestore()
      .collection('users').doc(decoded.uid)
      .collection('chats').doc(String(sessionId || 'unknown'))

    const lastUserMessage = messages[messages.length - 1]
    await chatDocRef.set({
      messages: FieldValue.arrayUnion({
        role: 'user',
        type: 'text',
        text: String(lastUserMessage?.text ?? ''),
        ts: Date.now(),
      }),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true })

    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.text ?? '') }],
    }))

    const genAI = new GoogleGenerativeAI(GEMINI_KEY.value())
    const model = genAI.getGenerativeModel({ model: MODEL_NAME })

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    let fullReply = ''
    try {
      const result = await model.generateContentStream({
        contents,
        systemInstruction: { role: 'system', parts: [{ text: SYSTEM_PROMPT }] },
      })

      for await (const chunk of result.stream) {
        const text = chunk.text()
        if (text) {
          fullReply += text
          res.write(`data: ${JSON.stringify({ text })}\n\n`)
        }
      }
      res.write('data: [DONE]\n\n')
    } catch (e) {
      res.write(`data: ${JSON.stringify({ error: e.message })}\n\n`)
    } finally {
      res.end()
      if (fullReply) {
        await chatDocRef.set({
          messages: FieldValue.arrayUnion({
            role: 'assistant',
            type: 'text',
            text: fullReply,
            ts: Date.now(),
          }),
          updatedAt: FieldValue.serverTimestamp(),
        }, { merge: true }).catch(() => {})
      }
    }
  },
)
