import { DashboardHeader, DashboardFooter } from './Dashboard.jsx'
import TeacherSalaryVsScoreTrend from './components/TeacherSalaryVsScoreTrend.jsx'
import SourceList from './components/SourceList.jsx'
import { TEACHER_SALARY_VS_SCORE, TEACHER_SALARY_SOURCES } from './data/teacherSalaryData.js'

export default function TeacherSalaryPage() {
  return (
    <div className="dash-root">
      <div className="dash-wrap">
        <DashboardHeader />
        <section className="dash-section" id="teacher-salary">
          <div className="dash-section-head">
            <h2>שכר מורים מול הישגים — השוואה בינלאומית</h2>
            <span className="dash-section-note">OECD · PISA 2022</span>
          </div>
          <TeacherSalaryVsScoreTrend data={TEACHER_SALARY_VS_SCORE} />
          <ul className="bullets" style={{ marginTop: 24 }}>
            <li>
              <b>מגמה חיובית אך לא חד-משמעית:</b> קו הרגרסיה מראה עלייה מתונה בציון PISA ככל ששכר המורים גבוה יותר,
              אך יפן משיגה את הציון הגבוה ביותר במדגם (533) עם שכר בינוני-נמוך יחסית (כ-49,600$), בעוד גרמניה
              ושווייץ משלמות פי 1.5–2 ומשיגות ציונים דומים או נמוכים ממדינות עם שכר נמוך בהרבה.
            </li>
            <li>
              <b>ישראל בתחתית הטווח:</b> שכר המורה הישראלי הממוצע (כ-39,500$ PPP) נמוך מרוב מדינות ה-OECD במדגם,
              לצד ציון PISA נמוך מהממוצע (452) — ישראל נמצאת קרוב לתחילת הקו, שם גם השכר וגם הציון נוטים להיות
              נמוכים יותר.
            </li>
            <li>
              <b>שכר לבדו אינו מספיק:</b> הפיזור הרחב סביב קו המגמה — קולומביה ומקסיקו בתחתית השכר עם ציונים
              נמוכים, מול יפן ודרום קוריאה שמשיגות תוצאות מהגבוהות ביותר בעולם עם שכר בינוני — מרמז ששכר הוא
              משתנה חשוב אך לא הגורם הבלעדי המסביר הבדלי הישג בין מדינות.
            </li>
          </ul>
          <SourceList sources={TEACHER_SALARY_SOURCES} />
        </section>
        <DashboardFooter />
      </div>
    </div>
  )
}
