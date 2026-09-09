import { Link } from 'react-router-dom'
import './dashboard.css'

export default function AccessibilityStatement() {
  return (
    <div className="dash-root">
      <div className="dash-wrap" style={{ maxWidth: 720 }}>
        <header className="dash-header">
          <div className="dash-kicker">נגישות</div>
          <h1 className="dash-title" style={{ fontSize: 28 }}>הצהרת נגישות</h1>
          <nav className="dash-nav">
            <Link to="/">חזרה לדשבורד</Link>
          </nav>
        </header>

        <section className="dash-section">
          <p className="dash-sub" style={{ maxWidth: 'none' }}>
            אתר זה פועל להנגשת התכנים והשירותים הניתנים בו לכלל הציבור, לרבות אנשים עם מוגבלות,
            ומיישם את הוראות <b>תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות),
            התשע״ג-2013</b>, שהותקנו מכוח <b>חוק שוויון זכויות לאנשים עם מוגבלות, התשנ״ח-1998</b>,
            ואת <b>תקן ישראלי ת״י 5568</b> — התאמת התקן הישראלי להנחיות הנגישות הבינלאומיות
            <b> WCAG 2.1 ברמת AA</b> (Web Content Accessibility Guidelines).
          </p>
        </section>

        <section className="dash-section">
          <div className="dash-section-head"><h2>התאמות הנגישות באתר</h2></div>
          <ul className="bullets">
            <li>אפשרות <b>להגדיל/להקטין את גודל הטקסט</b> באמצעות תפריט הנגישות (סמל ♿ בפינת המסך).</li>
            <li>מצב <b>ניגודיות גבוהה</b> להקלה על משתמשים עם לקויות ראייה.</li>
            <li>אפשרות <b>להדגשת קישורים</b> בקו תחתי.</li>
            <li>ניגודיות צבעים בטקסט הרגיל עומדת בדרישות WCAG AA (יחס ניגודיות של 4.5:1 ומעלה).</li>
            <li><b>סדר דפדוף (Tab) הגיוני</b> העוקב אחר סדר התצוגה הלוגי של העמוד, עם מסגרת מיקוד (focus) גלויה על כל האלמנטים האינטראקטיביים.</li>
            <li>קישור &quot;דילוג לתוכן&quot; בתחילת העמוד עבור משתמשי מקלדת וקוראי מסך.</li>
            <li>מבנה סמנטי (כותרות, רשימות, טבלאות) התומך בקוראי מסך.</li>
            <li><b>עזרי קריאה</b>: גופן קריא נוח לדיסלקציה, ריווח שורות ומילים מוגדל, וסרגל קריאה עוקב-עכבר להקלה על מעקב אחר שורות טקסט.</li>
          </ul>
        </section>

        <section className="dash-section">
          <div className="dash-section-head"><h2>רכיבי צד שלישי</h2></div>
          <p className="cause-answer">
            חלק מהתרשימים והנתונים באתר מוצגים כגרפיקה וקטורית (SVG); אנו שואפים לספק חלופה טקסטואלית
            לנתונים המוצגים בתרשימים. עוזר הצ׳אט באתר מיועד למשתמשים מחוברים בלבד ואינו מהווה תחליף
            לקריאת התוכן המלא בעמוד.
          </p>
        </section>

        <section className="dash-section">
          <div className="dash-section-head"><h2>פניות ותקלות נגישות</h2></div>
          <p className="cause-answer">
            נתקלתם בבעיית נגישות באתר? נשמח לקבל פנייתכם ולטפל בה בהקדם.
          </p>
          <ul className="bullets">
            <li>רכז נגישות: ishay@magicmirrorsecurity.com</li>
            <li>תאריך עדכון הצהרה זו: 09.09.2026</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
