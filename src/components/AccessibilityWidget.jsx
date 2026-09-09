import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './AccessibilityWidget.css'

const STORAGE_KEY = 'a11y_prefs_v1'
const FONT_STEPS = [100, 115, 130, 150]
const DEFAULT_PREFS = {
  fontStep: 0,
  highContrast: false,
  underlineLinks: false,
  readableFont: false,
  extraSpacing: false,
  readingGuide: false,
}

function loadPrefs() {
  try {
    return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) }
  } catch {
    return DEFAULT_PREFS
  }
}

// Implements the visible accessibility affordances required alongside WCAG
// 2.1 AA under Israel's תקנות נגישות (2013) / ת"י 5568: adjustable text size,
// a high-contrast mode, reading aids for dyslexia/low-vision users (readable
// font, extra spacing, a reading-guide ruler), and a link to the mandatory
// accessibility statement.
export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false)
  const [prefs, setPrefs] = useState(loadPrefs)
  const guideRef = useRef(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    document.documentElement.style.fontSize = `${FONT_STEPS[prefs.fontStep]}%`
    document.documentElement.classList.toggle('a11y-contrast', prefs.highContrast)
    document.documentElement.classList.toggle('a11y-underline', prefs.underlineLinks)
    document.documentElement.classList.toggle('a11y-readable-font', prefs.readableFont)
    document.documentElement.classList.toggle('a11y-spacing', prefs.extraSpacing)
  }, [prefs])

  // Reading guide: a highlighted strip that tracks the pointer, so a line of
  // text stays easy to follow — helps with dyslexia and low vision alike.
  useEffect(() => {
    if (!prefs.readingGuide) return
    function onMove(e) {
      if (guideRef.current) guideRef.current.style.top = `${e.clientY - 18}px`
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [prefs.readingGuide])

  function update(patch) {
    setPrefs((p) => ({ ...p, ...patch }))
  }

  return (
    <div className="a11y-root" dir="rtl">
      {open && (
        <div className="a11y-panel" role="dialog" aria-label="הגדרות נגישות">
          <div className="a11y-panel-title">הגדרות נגישות</div>

          <div className="a11y-row">
            <span>גודל טקסט</span>
            <div className="a11y-btn-group">
              <button type="button" onClick={() => update({ fontStep: Math.max(0, prefs.fontStep - 1) })} aria-label="הקטן טקסט">א-</button>
              <button type="button" onClick={() => update({ fontStep: Math.min(FONT_STEPS.length - 1, prefs.fontStep + 1) })} aria-label="הגדל טקסט">א+</button>
            </div>
          </div>

          <label className="a11y-row a11y-toggle">
            <span>ניגודיות גבוהה</span>
            <input type="checkbox" checked={prefs.highContrast} onChange={(e) => update({ highContrast: e.target.checked })} />
          </label>

          <label className="a11y-row a11y-toggle">
            <span>הדגשת קישורים</span>
            <input type="checkbox" checked={prefs.underlineLinks} onChange={(e) => update({ underlineLinks: e.target.checked })} />
          </label>

          <div className="a11y-divider" />
          <div className="a11y-panel-subtitle">עזרי קריאה</div>

          <label className="a11y-row a11y-toggle">
            <span>גופן קריא (נוח לדיסלקציה)</span>
            <input type="checkbox" checked={prefs.readableFont} onChange={(e) => update({ readableFont: e.target.checked })} />
          </label>

          <label className="a11y-row a11y-toggle">
            <span>ריווח שורות מוגדל</span>
            <input type="checkbox" checked={prefs.extraSpacing} onChange={(e) => update({ extraSpacing: e.target.checked })} />
          </label>

          <label className="a11y-row a11y-toggle">
            <span>סרגל קריאה עוקב עכבר</span>
            <input type="checkbox" checked={prefs.readingGuide} onChange={(e) => update({ readingGuide: e.target.checked })} />
          </label>

          <button type="button" className="a11y-reset" onClick={() => update(DEFAULT_PREFS)}>
            איפוס הגדרות
          </button>

          <Link to="/נגישות" className="a11y-statement-link" onClick={() => setOpen(false)}>הצהרת נגישות</Link>
        </div>
      )}
      <button type="button" className="a11y-bubble" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="הגדרות נגישות">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="7.2" r="1.7" fill="currentColor" />
          <path
            d="M6.2 10.1c3.9 1.3 7.7 1.3 11.6 0M12 10.6v3.1m0 0-2.6 6m2.6-6 2.6 6"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {prefs.readingGuide && <div ref={guideRef} className="a11y-reading-guide" aria-hidden="true" />}
    </div>
  )
}
