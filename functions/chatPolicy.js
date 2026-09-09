export const MAX_MESSAGE_CHARS = 2000
export const DAILY_CHAT_LIMIT = 10

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
