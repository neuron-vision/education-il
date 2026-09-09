import { DashboardHeader, DashboardFooter } from './Dashboard.jsx'
import ClassSizeVsScoreTrend from './components/ClassSizeVsScoreTrend.jsx'
import SourceList from './components/SourceList.jsx'
import { CLASS_SIZE_VS_SCORE, CLASS_SIZE_SOURCES } from './data/classSizeData.js'

export default function ClassSizePage() {
  return (
    <div className="dash-root">
      <div className="dash-wrap">
        <DashboardHeader />
        <section className="dash-section" id="class-size">
          <div className="dash-section-head">
            <h2>צפיפות הכיתות מול הישגים — השוואה בינלאומית</h2>
            <span className="dash-section-note">OECD · PISA 2022</span>
          </div>
          <ClassSizeVsScoreTrend data={CLASS_SIZE_VS_SCORE} />
          <ul className="bullets" style={{ marginTop: 24 }}>
            <li>
              <b>אין קשר ליניארי חד-משמעי:</b> יפן ודרום קוריאה משיגות מהציונים הגבוהים ביותר ב-PISA (533, 527) עם
              כיתות גדולות יחסית (כ-24–28 תלמידים), בעוד לטביה וליטא משיגות ציונים דומים או נמוכים יותר עם כיתות
              קטנות בהרבה (16–18 תלמידים) — כך שגודל הכיתה לבדו אינו מנבא הישג.
            </li>
            <li>
              <b>ישראל בקצה הכיתות הגדולות:</b> עם ממוצע של כ-27 תלמידים לכיתה יסודית, ישראל נמצאת בין המדינות עם
              הכיתות הגדולות ביותר במדגם, לצד ציון PISA ממוצע (452) נמוך מהממוצע — אך חברות עם כיתות גדולות עוד
              יותר (יפן) משיגות תוצאות טובות בהרבה.
            </li>
            <li>
              <b>קו המגמה שלילי אך חלש:</b> הרגרסיה הליניארית על פני המדגם מראה מגמה קלה של ירידה בציון ככל שהכיתה
              גדלה, אך הפיזור הרחב סביב הקו מרמז שגורמים אחרים (הכשרת מורים, תקציב, הרכב סוציו-אקונומי) משפיעים
              הרבה יותר על ההישג מאשר גודל הכיתה עצמו.
            </li>
          </ul>
          <SourceList sources={CLASS_SIZE_SOURCES} />
        </section>
        <DashboardFooter />
      </div>
    </div>
  )
}
