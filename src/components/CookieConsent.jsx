import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { track } from '../lib/analytics'
import './CookieConsent.css'

const STORAGE_KEY = 'cookie_consent_v1'

export default function CookieConsent() {
  const [choice, setChoice] = useState(() => localStorage.getItem(STORAGE_KEY))

  useEffect(() => {
    if (choice) localStorage.setItem(STORAGE_KEY, choice)
  }, [choice])

  if (choice) return null

  return (
    <div className="cc-banner" dir="rtl" role="dialog" aria-label="הודעת עוגיות">
      <p>
        אתר זה משתמש בעוגיות (cookies) חיוניות לצורך התחברות (Google Sign-In) ותפעול תקין של האתר.
        בהמשך הגלישה הנך מסכים/ה לשימוש זה. פרטים נוספים ב
        <Link to="/נגישות">הצהרת הנגישות</Link>.
      </p>
      <div className="cc-actions">
        <button type="button" className="cc-accept" onClick={() => { track('cookie_consent_accepted'); setChoice('accepted') }}>הבנתי, אישור</button>
      </div>
    </div>
  )
}
