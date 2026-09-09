import { useState } from 'react'
import LineChart from './components/LineChart.jsx'
import StatCard from './components/StatCard.jsx'
import SourceList from './components/SourceList.jsx'
import BarCompare from './components/BarCompare.jsx'
import CausesSection from './CausesSection.jsx'
import StackedBar, { StackedLegend, SupervisionTable } from './components/StackedBar.jsx'
import GapCard from './components/GapCard.jsx'
import MoneySpendTrend from './components/MoneySpendTrend.jsx'
import ScoreVsBudgetTrend from './components/ScoreVsBudgetTrend.jsx'
import { PISA, TIMSS, EXPENDITURE, SOURCES, RESEARCH_METRICS } from './data/educationData.js'
import { MONEY_VS_ACHIEVEMENT } from './data/moneyVsAchievementData.js'
import { BUDGET_BY_YEAR, PISA_MEAN_BY_YEAR, BUDGET_SOURCES } from './data/budgetTrendData.js'
import {
  MEITZAV_HERO,
  MEITZAV_DISTRIBUTION,
  MEITZAV_SUPERVISION_MATH,
  MEITZAV_SUPERVISION_ENGLISH,
  MEITZAV_GENDER_GAPS,
  MEITZAV_SES_GAP,
  MEITZAV_ENGLISH_SUPERVISION_GAP,
  MEITZAV_TIMELINE,
  MEITZAV_METHODOLOGY_NOTE,
  MEITZAV_SOURCES_FOOTER,
} from './data/meitzavData.js'
import './dashboard.css'

const SUBJECT_LABELS = { math: 'מתמטיקה', reading: 'קריאה', science: 'מדעים' }
const SUBJECT_COLORS = { math: '#3d7ea6', reading: '#c9793d', science: '#3d9668' }

function PisaSection() {
  const [activeSubjects, setActiveSubjects] = useState({ math: true, reading: false, science: false })

  const toggleSubject = (key) => {
    setActiveSubjects((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      // Keep at least one subject active
      if (!Object.values(next).some(Boolean)) return prev
      return next
    })
  }

  const selectedKeys = Object.keys(SUBJECT_LABELS).filter((key) => activeSubjects[key])
  const primarySubject = selectedKeys[0] ?? 'math'
  const primaryIsraelVals = PISA.israel[primarySubject]
  const first = primaryIsraelVals[0]
  const last = primaryIsraelVals[primaryIsraelVals.length - 1]
  const delta = last - first
  const oecdVals = PISA.oecd[primarySubject]

  const series = selectedKeys.flatMap((key) => [
    { label: `ישראל · ${SUBJECT_LABELS[key]}`, values: PISA.israel[key], color: SUBJECT_COLORS[key] },
    { label: `OECD · ${SUBJECT_LABELS[key]}, 2022`, values: PISA.oecd[key], color: SUBJECT_COLORS[key], refLine: true },
  ])

  return (
    <section className="dash-section" id="pisa">
      <div className="dash-section-head">
        <h2>PISA — הישגי תלמידים בגיל 15, ישראל מול ה-OECD</h2>
        <span className="dash-section-note">{PISA.years[0]}–{PISA.years[PISA.years.length - 1]}</span>
      </div>

      <div className="tabs">
        {Object.keys(SUBJECT_LABELS).map((key) => (
          <button
            key={key}
            className={`tab-btn ${activeSubjects[key] ? 'active' : ''}`}
            onClick={() => toggleSubject(key)}
            type="button"
            aria-pressed={activeSubjects[key]}
          >
            {SUBJECT_LABELS[key]}
          </button>
        ))}
      </div>

      <div className="stat-grid" style={{ marginBottom: 20 }}>
        <StatCard
          value={last}
          direction={delta < 0 ? 'down' : 'up'}
          title={`ציון ${SUBJECT_LABELS[primarySubject]}, 2025`}
          note={`${delta > 0 ? '+' : ''}${delta} נק' לעומת ${PISA.years[0]}`}
        />
        <StatCard
          value={`#${PISA.ranks2025[primarySubject]}`}
          direction="down"
          title="דירוג עולמי, 2025"
          note="מתוך מדינות ה-OECD/מפותחות"
        />
        <StatCard
          value={oecdVals[oecdVals.length - 1] ?? '—'}
          direction="up"
          title="ממוצע OECD, 2022"
          note={`ישראל: ${PISA.israel[primarySubject][5]} (2022)`}
        />
      </div>

      <div className="dash-card">
        <LineChart years={PISA.years} series={series} />
      </div>

      <div className="dash-section-note" style={{ marginTop: 8, fontSize: 12, lineHeight: 1.6 }}>
        קו ה-OECD מוצג כרף קבוע (2022 בלבד) ולא כמגמה: לרוב השנים האחרות אין ערך OECD ממוצע מאומת ועקבי במקור אחד — שינויים בהרכב חברות ה-OECD ובשיטת הניקוד בין מחזורים הופכים השוואה ישירה בין שנים ללא מקור אחיד למטעה.
      </div>

      <div className="callout" style={{ marginTop: 16 }}>
        <b>{PISA.ranks2025.note}</b>
      </div>

      <SourceList sources={[...SOURCES.pisaIsrael, ...SOURCES.pisa2025, ...SOURCES.pisaOecd2022]} />
    </section>
  )
}

function TimssSection() {
  return (
    <section className="dash-section" id="timss">
      <div className="dash-section-head">
        <h2>TIMSS — מתמטיקה ומדעים, כיתה ח׳</h2>
        <span className="dash-section-note">{TIMSS.years[0]} → {TIMSS.years[TIMSS.years.length - 1]} (25 שנה)</span>
      </div>

      <div className="stat-grid" style={{ marginBottom: 20 }}>
        <StatCard
          value={TIMSS.israel.math[TIMSS.years.length - 1]}
          direction="down"
          title="מתמטיקה, 2023"
          note={`ירידה מ-${TIMSS.israel.math[TIMSS.years.length - 2]} ב-2019`}
        />
        <StatCard
          value={TIMSS.israel.science[TIMSS.years.length - 1]}
          direction="down"
          title="מדעים, 2023"
          note={`ירידה מ-${TIMSS.israel.science[TIMSS.years.length - 2]} ב-2019`}
        />
        <StatCard
          value={`#${TIMSS.ranks.math2023}`}
          direction="down"
          title="דירוג עולמי, מתמטיקה"
          note={`צניחה של ${TIMSS.ranks.mathDrop} מקומות`}
        />
      </div>

      <div className="dash-card">
        <LineChart
          years={TIMSS.years}
          yMin={440}
          yMax={540}
          series={[
            { label: 'ישראל · מתמטיקה', values: TIMSS.israel.math, color: SUBJECT_COLORS.math, flaggedYears: Object.keys(TIMSS.caveats).map(Number) },
            { label: 'ישראל · מדעים', values: TIMSS.israel.science, color: SUBJECT_COLORS.science, flaggedYears: Object.keys(TIMSS.caveats).map(Number) },
            { label: 'מרכז הסולם הבינלאומי (500)', values: TIMSS.international.math, color: 'var(--world)' },
          ]}
        />
      </div>

      <div className="dash-section-note" style={{ marginTop: 8, fontSize: 12, lineHeight: 1.6 }}>
        ○ נקודות חלולות = שנים עם הסתייגות מדגם רשמית (NCES/IEA): ב-2003 המדגם לא עמד בהנחיות הבינלאומיות; ב-2007/2011/2015 כיסוי אוכלוסיית היעד הלאומית עמד על 77%–90% בלבד. הציונים מתפרסמים ומשמשים במגמות רשמיות חרף ההסתייגות.
      </div>

      <div className="callout" style={{ marginTop: 16 }}>
        <b>שפל של 25 שנה:</b> ישראל צנחה ממקום 9 למקום 23 במתמטיקה, ולמקום 25 במדעים — הירידה החדה ביותר שנמדדה במבחן זה בישראל מאז 1999.
      </div>

      <div className="dash-section-head" style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 16 }}>מתמטיקה 2023 — ישראל מול מדינות נבחרות</h2>
      </div>
      <BarCompare rows={TIMSS.comparators2023} field="math" max={620} highlightLabel="ישראל" />

      <SourceList sources={SOURCES.timss} />
    </section>
  )
}

function ExpenditureSection() {
  return (
    <section className="dash-section" id="expenditure">
      <div className="dash-section-head">
        <h2>הוצאה לחינוך כאחוז מהתוצר</h2>
        <span className="dash-section-note">נתוני OECD, 2025</span>
      </div>

      <div className="dash-card">
        <div className="metric">
          <div className="metric-top">
            <span className="name">ישראל</span>
            <span className="figure">{EXPENDITURE.israelPctGDP}%</span>
          </div>
          <div className="bar">
            <div className="high" style={{ width: `${(EXPENDITURE.israelPctGDP / 8) * 100}%` }} />
          </div>
        </div>
        <div className="metric">
          <div className="metric-top">
            <span className="name">ממוצע OECD</span>
            <span className="figure">{EXPENDITURE.oecdAvgPctGDP}%</span>
          </div>
          <div className="bar">
            <div className="midhigh" style={{ width: `${(EXPENDITURE.oecdAvgPctGDP / 8) * 100}%` }} />
          </div>
        </div>
      </div>

      <ul className="bullets" style={{ marginTop: 16 }}>
        <li>
          <b>ישראל בין המדינות המובילות בהוצאה לחינוך כאחוז מהתוצר</b> — לצד איסלנד, נורווגיה ובריטניה.
        </li>
        <li>
          אך זה נובע בעיקר משיעור הנוער הגבוה באוכלוסייה: <b>43.1%</b> גילאי 0–24 בישראל מול <b>29.7%</b> בממוצע ה-OECD.
        </li>
        <li>
          ההוצאה <b>לתלמיד בפועל</b> נמוכה מהממוצע ברוב שלבי הלימוד — כלומר "האחוז מהתוצר" הגבוה לא מתורגם בהכרח להשקעה גבוהה יותר לילד.
        </li>
      </ul>

      <SourceList sources={SOURCES.expenditure} />
    </section>
  )
}

function MeitzavSection() {
  return (
    <section className="dash-section" id="meitzav">
      <div className="dash-section-head">
        <h2>מיצ״ב תשפ״ה — התמונה המלאה</h2>
        <span className="dash-section-note">ראמ״ה, 9.9.2026</span>
      </div>

      <div className="stat-grid" style={{ marginBottom: 28 }}>
        {MEITZAV_HERO.map((h) => (
          <StatCard key={h.label} value={`${h.value}%`} direction={h.value < 50 ? 'down' : 'up'} title={h.label} note={h.note} />
        ))}
      </div>

      <div className="dash-section-head" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 14 }}>
        <h3 style={{ fontSize: 15, margin: 0 }}>התפלגות רמות ביצוע לפי מקצוע</h3>
        <span className="dash-section-note">אחוז תלמידים בכל רמה</span>
      </div>
      <StackedLegend />
      <div className="dash-card" style={{ marginBottom: 28 }}>
        {MEITZAV_DISTRIBUTION.map((row) => (
          <StackedBar key={row.name} name={row.name} levels={row.levels} />
        ))}
      </div>

      <div className="meitzav-two-col">
        <div>
          <div className="dash-section-head" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 12 }}>
            <h3 style={{ fontSize: 14, margin: 0 }}>מתמטיקה כיתה ו׳ — לפי סוג פיקוח</h3>
          </div>
          <div className="dash-card">
            <SupervisionTable rows={MEITZAV_SUPERVISION_MATH} />
          </div>
        </div>
        <div>
          <div className="dash-section-head" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 12 }}>
            <h3 style={{ fontSize: 14, margin: 0 }}>אנגלית כיתה ו׳ — לפי סוג פיקוח</h3>
          </div>
          <div className="dash-card">
            <SupervisionTable rows={MEITZAV_SUPERVISION_ENGLISH} />
          </div>
        </div>
      </div>

      <div className="dash-section-head" style={{ borderBottom: 'none', paddingBottom: 0, marginTop: 28, marginBottom: 14 }}>
        <h3 style={{ fontSize: 15, margin: 0 }}>פערים מגדריים ופער חברתי-כלכלי</h3>
        <span className="dash-section-note">מתמטיקה/אנגלית כיתה ו׳ — % ברמה גבוהה / ציון ממוצע לפי מקצוע</span>
      </div>
      <div className="gap-grid">
        {MEITZAV_GENDER_GAPS.map((g) => (
          <GapCard key={g.title} title={g.title} rows={[{ tag: g.tag, value: g.value, pct: g.pct, color: g.color }]} />
        ))}
      </div>
      <div className="gap-grid" style={{ marginTop: 16 }}>
        <GapCard title={MEITZAV_SES_GAP.title} rows={MEITZAV_SES_GAP.rows} />
        <GapCard title={MEITZAV_ENGLISH_SUPERVISION_GAP.title} rows={MEITZAV_ENGLISH_SUPERVISION_GAP.rows} />
      </div>

      <div className="dash-section-head" style={{ borderBottom: 'none', paddingBottom: 0, marginTop: 28, marginBottom: 14 }}>
        <h3 style={{ fontSize: 15, margin: 0 }}>קו זמן: שלושה מבחנים, אותה תמונה</h3>
      </div>
      <div className="timeline">
        {MEITZAV_TIMELINE.map((item) => (
          <div className="tl-item" key={item.date}>
            <div className="tl-date">{item.date}</div>
            <div className="tl-title">{item.title}</div>
            <div className="tl-body">{item.body}</div>
          </div>
        ))}
      </div>

      <div className="callout" style={{ marginTop: 20 }}>
        <b>הערת מתודולוגיה:</b> {MEITZAV_METHODOLOGY_NOTE}
      </div>

      <p className="dash-section-note" style={{ marginTop: 14 }}>{MEITZAV_SOURCES_FOOTER}</p>
      <SourceList sources={SOURCES.meitzav} />
    </section>
  )
}

function MoneyVsAchievementSection() {
  return (
    <section className="dash-section" id="money">
      <div className="dash-section-head">
        <h2>האם כסף = הישגים?</h2>
        <span className="dash-section-note">מחקר בינלאומי</span>
      </div>
      <MoneySpendTrend data={MONEY_VS_ACHIEVEMENT} />
      <ul className="bullets" style={{ marginTop: 24 }}>
        <li>
          <b>תיקון עובדתי:</b> קוריאה אינה דוגמה ל"תוצאות גבוהות בהוצאה נמוכה" — היא מוציאה מעל הממוצע: כ-25,267$ לתלמיד תיכון, פי 1.8 מממוצע ה-OECD. חלק מהישגי קוריאה, סינגפור, יפן וטייוואן מיוחס גם ל"חינוך צללים" (שיעורים פרטיים בתשלום הורים) שאינו נכלל בתקציב הממשלתי. קטאר כן מוציאה הרבה יחסית ולא משיגה תוצאות בהתאם — דוגמה תקפה לחוסר קשר בהוצאה גבוהה.
        </li>
        <li>
          ישראל בין המדינות עם <b>הפער הסוציו-אקונומי הרחב ביותר בהישגים</b> (עם רומניה, סלובקיה והונגריה): פער של 124 נק' במתמטיקה בין תלמידים מבוססים לחלשים, מול ממוצע OECD של 93 נק'. כלומר: איך מחלקים את הכסף חשוב לפחות כמו כמה מוציאים.
        </li>
      </ul>
      <SourceList sources={[...SOURCES.moneyVsAchievement, { label: 'OECD — Education at a Glance 2025, Korea', url: 'https://www.oecd.org/en/publications/education-at-a-glance-2025_1a3543e2-en/korea_252c9ed2-en.html' }]} />

      <div className="dash-section-head" style={{ marginTop: 40 }}>
        <h2>ציון PISA מול תקציב החינוך בישראל — לאורך שנים</h2>
        <span className="dash-section-note">2006–2025</span>
      </div>
      <ScoreVsBudgetTrend
        scoreData={PISA_MEAN_BY_YEAR}
        budgetData={BUDGET_BY_YEAR}
        sources={BUDGET_SOURCES}
      />
    </section>
  )
}

function ResearchFindingsSection() {
  return (
    <section className="dash-section" id="research-findings">
      <div className="dash-section-head"><h2>מה אומרים הנתונים החדשים?</h2><span className="dash-section-note">OECD / מבקר המדינה / הכנסת</span></div>
      <div className="research-grid">
        <div><h3>מיומנות בסיסית ב-PISA 2022 (%)</h3><BarCompare rows={RESEARCH_METRICS.pisaProficiency} field="value" max={100} highlightLabel="ישראל" /></div>
        <div><h3>הוצאה לתלמיד בדולר PPP, 2021</h3><BarCompare rows={RESEARCH_METRICS.spendingPerStudent} field="value" max={16000} highlightLabel="ישראל" /></div>
        <div><h3>תלמידים למורה, 2022</h3><BarCompare rows={RESEARCH_METRICS.teacherRatios} field="value" max={18} highlightLabel="ישראל" /></div>
      </div>
      <ul className="bullets finding-list">
        <li><b>הוצאה גבוהה מה-OECD כאחוז מהתמ"ג</b> (6.1% לעומת 4.9%), אך הוצאה לתלמיד נמוכה יותר בממוצע.</li>
        <li><b>ב-PISA</b> ישראל מתחת לממוצע OECD במתמטיקה, קריאה ומדעים ברמת המיומנות הבסיסית; הפער החברתי-כלכלי גדול.</li>
        <li><b>כוח אדם:</b> 692 שעות הוראה חוזיות בחטיבה בישראל לעומת 706 ב-OECD; יחס תלמידים-מורים גבוה יותר ביסודי ונמוך יותר בתיכון.</li>
        <li><b>תקצוב דיפרנציאלי</b> הגדיל תוספות לפי מדד טיפוח, אך מבקר המדינה מצא פערי יישום ושקיפות והשפעה מוגבלת מעבר לפער שהיה קיים.</li>
        <li><b>רפורמות:</b> אופק חדש (2008), עוז לתמורה (2011–12), תקצוב דיפרנציאלי (2014–15) ולמידה משמעותית (2014–17) שינו תשומות ותהליכים; אין להסיק מהן לבדן סיבתיות לתוצאות.</li>
      </ul>
    </section>
  )
}

export {
  PisaSection,
  TimssSection,
  MeitzavSection,
  ExpenditureSection,
  MoneyVsAchievementSection,
  ResearchFindingsSection,
}

export function DashboardHeader() {
  return (
    <header className="dash-header">
      <div className="dash-kicker">חינוך · דשבורד נתונים · מעודכן 9.9.2026</div>
      <h1 className="dash-title">חינוך בישראל לאורך זמן — ומול העולם</h1>
      <p className="dash-sub">
        מבט נתוני על מגמות ההישגים במערכת החינוך הישראלית: PISA, TIMSS, מיצ״ב, והוצאה לחינוך —
        בהשוואה לממוצעי ה-OECD ולעולם.
      </p>
    </header>
  )
}

export function DashboardFooter() {
  return (
    <footer className="dash-footer">
          חלק מהנתונים ההיסטוריים (במיוחד ממוצעי OECD לשנים
          שלפני 2022 ו-TIMSS 2007–2015) לא אומתו ישירות מול מקור רשמי ומסומנים בהתאם. לשימוש אקדמי, יש
          לאמת מול{' '}
          <a href="https://www.oecd.org/pisa/" target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>
            OECD PISA
          </a>{' '}
          ו-
          <a href="https://timssandpirls.bc.edu/" target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>
            IEA TIMSS
          </a>
          .
          <br />
          Made by{' '}
          <a href="https://neuron.vision" target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>
            Neuron Vision LTD
          </a>
        </footer>
  )
}

export default function Dashboard() {
  return (
    <div className="dash-root">
      <div className="dash-wrap">
        <DashboardHeader />

        <PisaSection />
        <TimssSection />
        <MeitzavSection />
        <ExpenditureSection />
        <MoneyVsAchievementSection />
        <ResearchFindingsSection />
        <CausesSection />

        <DashboardFooter />
      </div>
    </div>
  )
}
