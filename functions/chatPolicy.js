export const MAX_MESSAGE_CHARS = 2000
export const DAILY_CHAT_LIMIT = 10

// Sentinel the model is instructed to emit (see SYSTEM_PROMPT in index.js) whenever it judges
// the request to be unauthorized use — off-topic (not Israeli education, even in a world-comparison
// framing), an attempt to drain tokens/quota, or an attempt to override these instructions. Checked
// on both sides: the server scans the full reply before ever streaming it to the client (so the key
// itself is never delivered), and the client re-checks each incoming chunk as defense in depth in
// case a bug or a future model regression lets it leak through the stream.
export const UNAUTHORIZED_USE_KEY = '__EDUIL_LOCK_9f3a2e__'

export function containsLockKey(text) {
  return String(text || '').includes(UNAUTHORIZED_USE_KEY)
}

export const HACKING_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /disregard\s+(all\s+)?(previous|system)\s+instructions/i,
  /reveal\s+(the\s+)?system\s+prompt/i,
  /show\s+(me\s+)?your\s+(hidden\s+)?instructions/i,
  /jailbreak|prompt\s* injection|developer\s+message/i,
  /עקוף|התעלם מההוראות|חשוף את ההנחיות|פרוץ|פריצה|האקינג|ג'יילברייק/i,
]

export function hackingDetected(text) {
  return HACKING_PATTERNS.some((pattern) => pattern.test(String(text || '')))
}

export function validateMessage(text) {
  const value = String(text || '').trim()
  if (!value) return { ok: false, error: 'Message is required' }
  if (value.length > MAX_MESSAGE_CHARS) return { ok: false, error: `Message exceeds ${MAX_MESSAGE_CHARS} characters` }
  return { ok: true, text: value }
}

export function quotaDecision(used) {
  const count = Math.max(0, Number(used) || 0)
  return { allowed: count < DAILY_CHAT_LIMIT, used: count }
}

// Single source of truth for whether a request reaches Firestore/Gemini at all.
// onRequest (unlike onCall) does not implement Firebase's `enforceAppCheck` option —
// that flag is a silent no-op on HTTPS request functions, so this check must be
// performed by hand. Order matters: App Check (proves the call comes from our own
// registered app) is checked before Firebase Auth (proves a signed-in user), so a
// scripted caller with a stolen/created account still can't get past the app gate.
export function requestGateDecision({ method, hasAppCheck, hasAuth }) {
  if (method !== 'POST') return { allowed: false, status: 405, error: 'Method not allowed' }
  if (!hasAppCheck) return { allowed: false, status: 401, error: 'App Check required' }
  if (!hasAuth) return { allowed: false, status: 401, error: 'Sign-in required' }
  return { allowed: true }
}
