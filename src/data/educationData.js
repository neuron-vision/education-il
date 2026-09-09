// נתוני PISA / TIMSS / הוצאה לחינוך — ישראל מול העולם
// מקורות מפורטים במערך SOURCES למטה.
// ערכים המסומנים null אינם מאומתים/לא נמצאו במחקר.

export const PISA = {
  years: [2006, 2009, 2012, 2015, 2018, 2022, 2025],
  israel: {
    math: [442, 447, 466, 470, 463, 458, 433],
    reading: [439, 474, 486, 479, 470, 474, 436],
    science: [454, 455, 470, 467, 462, 465, 442],
  },
  oecd: {
    // רק 2022 מאומת ישירות; שאר השנים ידועות כקרובות ל-490-500 אך לא אומתו במחקר זה
    math: [null, null, null, null, null, 472, null],
    reading: [null, null, null, null, null, 476, null],
    science: [null, null, null, null, null, 485, null],
  },
  ranks2025: {
    math: 43,
    reading: 37,
    science: 44,
    note: 'מתוך 91 מדינות וכלכלות שהשתתפו ב-PISA 2025 (דירוג עולמי כללי: מקום 43; מקום 33 מתוך מדינות מפותחות); ישראל רשמה את אחת הירידות החדות בעולם (שנייה בגודלה אחרי לטביה)',
  },
}

export const TIMSS = {
  years: [1999, 2003, 2007, 2011, 2015, 2019, 2023],
  israel: {
    math: [468, 496, 463, 516, 511, 519, 487],
    science: [466, 488, 468, 516, 507, 513, 481],
  },
  // הסתייגויות מדגם רשמיות (NCES/IEA) לשנים המסומנות
  caveats: {
    2003: 'לא עמדה בדרישות המדגם/הנחיות הבינלאומיות (NCES)',
    2007: 'כיסוי אוכלוסיית יעד לאומית 77%–90% בלבד (NCES/IEA)',
    2011: 'כיסוי אוכלוסיית יעד לאומית 77%–90% בלבד (NCES/IEA)',
    2015: 'כיסוי אוכלוסיית יעד לאומית 77%–90% בלבד (NCES/IEA)',
  },
  international: {
    // 500 = מרכז הסולם הבינלאומי הקבוע (עוגן מתודולוגי); ל-2023 מדווח גם ממוצע מדינות משתתפות בפועל של כ-478
    math: [500, 500, 500, 500, 500, 500, 478],
    science: [500, 500, 500, 500, 500, 500, 478],
  },
  ranks: {
    math2023: 23,
    science2023: 25,
    mathDrop: 14, // מקומות שירדה ישראל במתמטיקה
    scienceDrop: 9,
  },
  comparators2023: [
    { country: 'סינגפור', math: 605, science: 606 },
    { country: 'דרום קוריאה', math: 596, science: 545 },
    { country: 'ישראל', math: 487, science: 481 },
    { country: 'פינלנד', math: 504, science: 531 },
    { country: 'ארה״ב', math: 488, science: 513 },
  ],
}

export const EXPENDITURE = {
  israelPctGDP: 6.1,
  oecdAvgPctGDP: 4.7,
  note: 'ישראל בין המדינות המובילות בהוצאה לחינוך כאחוז מהתוצר (עם איסלנד, נורווגיה ובריטניה) — אך זאת בעיקר בגלל שיעור הנוער הגבוה באוכלוסייה (43.1% גילאי 0–24 מול 29.7% בממוצע ה-OECD). ההוצאה לתלמיד בפועל נמוכה מהממוצע ברוב השלבים.',
}

export const RESEARCH_METRICS = {
  pisaProficiency: [
    { country: 'מתמטיקה · ישראל', value: 63 }, { country: 'מתמטיקה · OECD', value: 69 },
    { country: 'קריאה · ישראל', value: 70 }, { country: 'קריאה · OECD', value: 74 },
    { country: 'מדעים · ישראל', value: 68 }, { country: 'מדעים · OECD', value: 76 },
  ],
  spendingPerStudent: [
    { country: 'ישראל · יסודי', value: 11327 }, { country: 'ישראל · תיכון', value: 10464 },
    { country: 'ישראל · שלישוני', value: 12239 }, { country: 'OECD · כלל השלבים', value: 14209 },
  ],
  teacherRatios: [
    { country: 'יסודי · ישראל', value: 15 }, { country: 'יסודי · OECD', value: 14 },
    { country: 'חטיבה · ישראל', value: 13 }, { country: 'חטיבה · OECD', value: 13 },
    { country: 'תיכון · ישראל', value: 11 }, { country: 'תיכון · OECD', value: 13 },
  ],
}

export const RESEARCH_CONTEXT = `מקורות מחקר: OECD PISA 2022: ישראל 63% מתמטיקה, 70% קריאה, 68% מדעים ברמה 2 ומעלה; OECD 69%, 74%, 76%. OECD Education at a Glance 2024: הוצאה 6.1% תמ"ג בישראל מול 4.9% OECD; הוצאה ממוצעת לתלמיד 11,111$ PPP מול 14,209$; שעות הוראה חטיבה 692 מול 706; תלמידים למורה 15/13/11 בישראל מול 14/13/13 OECD. רפורמות: אופק חדש מ-2008, עוז לתמורה מ-2011/12, תקצוב דיפרנציאלי מ-2014/15, למידה משמעותית 2014-17. לוח שנה: פתיחה כללית 1 בספטמבר; סיום יסודי 30 ביוני ותיכון 20 ביוני, עם חריגים ולוחות חגים לפי מגזר. יש להבחין בין נתון רשמי, הערכה, יעד רפורמה וטענה סיבתית.`

export const SOURCES = {
  pisaIsrael: [
    { label: 'TheGlobalEconomy.com — PISA Math', url: 'https://www.theglobaleconomy.com/Israel/pisa_math_scores/' },
    { label: 'TheGlobalEconomy.com — PISA Reading', url: 'https://www.theglobaleconomy.com/Israel/pisa_reading_scores/' },
    { label: 'TheGlobalEconomy.com — PISA Science', url: 'https://www.theglobaleconomy.com/Israel/pisa_science_scores/' },
  ],
  pisa2025: [
    { label: 'Times of Israel — Israel plummets to worst-ever PISA scores', url: 'https://www.timesofisrael.com/israel-plummets-to-worst-ever-oecd-education-scores-in-math-reading-science/' },
    { label: 'Israel Hayom — Israeli students plunge to historic lows', url: 'https://www.israelhayom.com/2026/09/08/israeli-students-plunge-to-historic-lows-in-reading-math-and-science' },
    { label: 'כלכליסט — קריסה מוחלטת במבחן PISA', url: 'https://www.calcalist.co.il/local_news/article/skzrby2uzl' },
  ],
  pisaOecd2022: [
    { label: 'OECD — PISA 2022 Results Volume I', url: 'https://www.oecd.org/en/publications/pisa-2022-results-volume-i_53f23881-en.html' },
  ],
  timss: [
    { label: 'Ynet — צניחה דרמטית בהישגי תלמידי ישראל', url: 'https://www.ynet.co.il/news/article/hjxquypmjl' },
    { label: 'כלכליסט — ישראל מתרסקת במבחני TIMSS', url: 'https://www.calcalist.co.il/local_news/article/s1kvxqa7jg' },
    { label: 'JNS — Israeli students show major drop in math skills', url: 'https://www.jns.org/israeli-students-show-major-drop-in-math-skills/' },
    { label: 'Times of Israel — Steep decline in TIMSS scores', url: 'https://www.timesofisrael.com/steep-decline-in-israeli-students-international-math-and-science-test-scores/' },
    { label: 'ראמ״ה — דוח TIMSS 2023 (PDF)', url: 'https://meyda.education.gov.il/files/Rama/TIMSS-report-23.pdf' },
    { label: 'Wikipedia — TIMSS (comparator country scores)', url: 'https://en.wikipedia.org/wiki/Trends_in_International_Mathematics_and_Science_Study' },
    { label: 'NCES — TIMSS 1999 Results (grade 8)', url: 'https://nces.ed.gov/timss/results99_1.asp' },
    { label: 'NCES — TIMSS 2003 Tables (Israel sampling footnote)', url: 'https://nces.ed.gov/timss/timss03tables.asp' },
    { label: 'NCES — TIMSS 2007 Table 1 (Math)', url: 'https://nces.ed.gov/timss/table07_1.asp' },
    { label: 'NCES — TIMSS 2007 Table 3 (Science)', url: 'https://nces.ed.gov/timss/table07_3.asp' },
    { label: 'NCES — TIMSS 2011 Table 3 (Math)', url: 'https://nces.ed.gov/timss/table11_3.asp' },
    { label: 'NCES — TIMSS 2011 Table 5 (Science)', url: 'https://nces.ed.gov/timss/table11_5.asp' },
    { label: 'NCES — TIMSS 2015 Table 2 (Math)', url: 'https://nces.ed.gov/timss/timss2015/timss2015_table02.asp' },
    { label: 'NCES — TIMSS 2015 Table 24 (Science)', url: 'https://nces.ed.gov/timss/timss2015/timss2015_table24.asp' },
  ],
  expenditure: [
    { label: 'OECD — Education at a Glance 2025, Israel', url: 'https://www.oecd.org/en/publications/education-at-a-glance-2025_1a3543e2-en/israel_4b1e0baf-en.html' },
    { label: 'Adva Center — הוצאה לתלמיד בישראל מול ה-OECD', url: 'https://adva.org/en/education-spending-israel-oecd/' },
    { label: 'Times of Israel — Israel among highest in education expenditure', url: 'https://www.timesofisrael.com/israel-among-highest-in-education-expenditure-as-measured-against-gdp-study/' },
  ],
  meitzav: [
    { label: 'Ynet — דרמה לילית: שר החינוך חשף בהפתעה את תוצאות המיצ״ב', url: 'https://www.ynet.co.il/news/article/bkdv7yaugg' },
  ],
  moneyVsAchievement: [
    { label: 'OECD — PISA 2022 Results Volume I, Full Report', url: 'https://oecd-ilibrary.org/sites/53f23881-en/1/3/5/index.html' },
    { label: 'Brookings — Why money matters for improving education', url: 'https://www.brookings.edu/blog/up-front/2016/07/21/why-money-matters-for-improving-education/' },
    { label: 'Fraser Institute — International Student Assessment Performance and Spending', url: 'https://www.fraserinstitute.org/sites/default/files/international-student-assessment.pdf' },
  ],
}
