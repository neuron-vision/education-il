import { DashboardHeader, DashboardFooter } from './Dashboard.jsx'
import SmallScatterTrend from './components/SmallScatterTrend.jsx'
import SourceList from './components/SourceList.jsx'
import {
  BELONGING_VS_SCORE,
  BELONGING_SOURCES,
  SOCIAL_MEDIA_FACTS,
  DEVICE_LEISURE_POINTS,
  DEVICE_LEISURE_SOURCES,
} from './data/socialFactorsData.js'

export default function SocialFactorsPage() {
  return (
    <div className="dash-root">
      <div className="dash-wrap">
        <DashboardHeader />

        <section className="dash-section" id="belonging">
          <div className="dash-section-head">
            <h2>בידוד חברתי — תחושת שייכות בבית הספר מול הישגים</h2>
            <span className="dash-section-note">OECD · PISA 2022</span>
          </div>
          <SmallScatterTrend
            data={BELONGING_VS_SCORE}
            xKey="belonging"
            xLabel="% תלמידים המדווחים על תחושת שייכות"
            yLabel="ציון PISA ממוצע"
            ariaLabel="תרשים: אחוז תלמידים המדווחים על תחושת שייכות בבית הספר מול ציון PISA ממוצע"
          />
          <ul className="bullets" style={{ marginTop: 24 }}>
            <li>
              <b>ישראל קרובה לממוצע ה-OECD בתחושת שייכות:</b> 76% מהתלמידים בישראל מדווחים על תחושת שייכות
              בבית הספר, לעומת 75% בממוצע ה-OECD — כמעט זהה, למרות ציון PISA נמוך יותר (458 מול 472).
            </li>
            <li>
              <b>אין קשר עקבי בין שייכות להישג:</b> יפן ושווייץ משלבות שייכות גבוהה עם ציונים גבוהים, אבל
              ישראל ופולין שוברות את התבנית — שייכות דומה או נמוכה יותר, עם ציונים שונים באופן ניכר. כלומר
              תחושת שייכות לבדה אינה מנבאת הישג לימודי.
            </li>
            <li>
              <b>מגבלת נתונים:</b> לא אותרה טבלת OECD מלאה לכל מדינות ה-OECD בסבב מחקר זה — הנתונים לעיל
              נאספו מדוחות מדינה בודדים ואינם מדגם מייצג מלא.
            </li>
          </ul>
          <SourceList sources={BELONGING_SOURCES} />
        </section>

        <section className="dash-section" id="social-media">
          <div className="dash-section-head">
            <h2>אימוץ רשתות חברתיות בקרב בני נוער</h2>
            <span className="dash-section-note">נתונים חלקיים — אין השוואה בין-מדינתית ישירה</span>
          </div>

          <div className="cause-stats">
            <div className="cause-stat">
              <div className="cause-stat-num">{SOCIAL_MEDIA_FACTS.israel.stat}</div>
              <div className="cause-stat-lbl">{SOCIAL_MEDIA_FACTS.israel.label}</div>
            </div>
            <div className="cause-stat cause-stat-compare">
              <div className="cause-stat-num compare">{SOCIAL_MEDIA_FACTS.international.stat}</div>
              <div className="cause-stat-lbl">{SOCIAL_MEDIA_FACTS.international.label}</div>
            </div>
          </div>

          <ul className="bullets" style={{ marginTop: 24 }}>
            <li>
              <b>ישראל חסרה מדוח ה-HBSC הבינלאומי 2021/22:</b> נתוני ישראל הגיעו באיחור ולא נכללו בהשוואה
              הבין-לאומית הרשמית של 44 מדינות/אזורים — לכן שני הנתונים כאן ממקורות ושיטות שונים ומוצגים
              להקשר בלבד, לא כהשוואה ישירה.
            </li>
            <li>{SOCIAL_MEDIA_FACTS.note}</li>
          </ul>

          <SourceList sources={[SOCIAL_MEDIA_FACTS.israel.source, SOCIAL_MEDIA_FACTS.international.source]} />
        </section>

        <section className="dash-section" id="device-leisure">
          <div className="dash-section-head">
            <h2>שימוש במכשירים ניידים לפנאי דיגיטלי מול הישגים</h2>
            <span className="dash-section-note">OECD — נתון ישראלי לא אומת</span>
          </div>
          <SmallScatterTrend
            data={DEVICE_LEISURE_POINTS.filter((d) => d.hoursPerDay != null)}
            xKey="hoursPerDay"
            xLabel="שעות פנאי דיגיטלי ביום"
            yLabel="ציון PISA ממוצע"
            ariaLabel="תרשים: שעות פנאי דיגיטלי ביום מול ציון PISA ממוצע, מדגם מדינות חלקי"
            highlightCode="ISR"
          />
          <ul className="bullets" style={{ marginTop: 24 }}>
            <li>
              <b>הקשר אינו ליניארי:</b> לפי ניתוח ה-OECD עצמו, 2-4 שעות פנאי דיגיטלי ביום דווקא מתואמות עם
              ציונים גבוהים יותר מפחות מ-2 שעות — רק מעבר ל-4 שעות ביום הקשר הופך לשלילי.
            </li>
            <li>
              <b>יפן בקצה הנמוך:</b> כשעה אחת ביום בממוצע לצד ציון PISA הגבוה ביותר במדגם (536) — אך אין
              מספיק נקודות נתון כדי לקבוע קשר סיבתי.
            </li>
            <li>
              <b>אין נתון ישראלי מאומת:</b> gpseducation.oecd.org חסום לגישה אוטומטית ומסמכי ה-PDF הרלוונטיים
              אינם ניתנים לחילוץ טקסט — נדרשת שליפה ידנית ישירה מה-OECD כדי לכלול את ישראל בהשוואה.
            </li>
          </ul>
          <SourceList sources={DEVICE_LEISURE_SOURCES} />
        </section>

        <DashboardFooter />
      </div>
    </div>
  )
}
