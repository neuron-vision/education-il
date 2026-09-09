// נתוני "גורמים אפשריים" לירידה בהישגי החינוך בישראל — מבוסס מחקר עם מקורות מצוטטים.

export const CAUSES = [
  {
    id: 'class-size',
    q: 'האם גודל הכיתות הוא גורם מרכזי לירידה בהישגים?',
    stat: '27',
    statLabel: 'תלמידים בכיתה יסודית (2023, ישראל — ללא שינוי מ-2013)',
    compare: '21',
    compareLabel: 'ממוצע ה-OECD (מדינות עם פחות מ-25 בממוצע)',
    answer:
      'ישראל היא בעלת הכיתות הצפופות ביותר ב-OECD אחרי צ׳ילה (יחד עם יפן ובריטניה). כיתה יסודית ממוצעת עומדת על 27 תלמידים — ללא שינוי מ-2013 — לעומת ממוצע OECD של 21. כיתות חטיבת ביניים דווקא גדלו: מ-28 תלמידים (2013) ל-30 (2023). עם זאת, מחקר של מרכז טאוב טוען שיחס תלמיד-מורה הכולל (לא רק צפיפות הכיתה הפיזית) קרוב לממוצע ה-OECD — כלומר הבעיה היא צפיפות פיזית בכיתה, לא בהכרח מצבת כוח אדם כוללת.',
    verdict: 'תומך חלקית',
    verdictColor: 'midhigh',
    sources: [
      { label: 'OECD — Education at a Glance 2025', url: 'https://www.oecd.org/en/publications/2025/09/education-at-a-glance-2025_c58fc9ae/full-report/how-do-student-teacher-ratios-and-class-sizes-vary-across-education-levels-up-to-upper-secondary-education_76b87b21.html' },
      { label: 'Times of Israel — 2nd most crowded classrooms', url: 'https://www.timesofisrael.com/israel-has-2nd-most-crowded-classrooms-but-pupils-get-above-average-hours-oecd/' },
    ],
  },
  {
    id: 'teacher-shortage',
    q: 'האם מחסור במורים ונשירה מהמקצוע משפיעים על ההישגים?',
    stat: '14,283',
    statLabel: 'אנשי צוות הוראה ללא הסמכה מלאה (2025-26)',
    compare: '~25%',
    compareLabel: 'ממנהלי בתי הספר מדווחים על מחסור מורים משמעותי — גבוה בהרבה מממוצע ה-OECD (השוואה מדויקת לא אותרה)',
    answer:
      'כרבע ממנהלי בתי הספר בישראל מדווחים על מחסור מורים משמעותי, לפי OECD ו-JPost — גבוה בהרבה מהממוצע הבינלאומי (הערך המדויק להשוואה לא אותר במחקר זה). מספר המורים החדשים שנכנסו למערכת (מגמת 15,000→11,500, 2025) לא אומת ישירות בסבב בדיקה זה. יש מחלוקת מקצועית: מרכז טאוב טוען שהמחסור "מדומה" משום שיחס תלמיד-מורה הגולמי דומה לממוצע ה-OECD — הבעיה עשויה להיות התפלגות לא אחידה (מקצועות/אזורים) ולא מחסור כולל.',
    verdict: 'תומך חלקית — שנוי במחלוקת',
    verdictColor: 'midlow',
    sources: [
      { label: 'Ynet — נתוני מחסור במורים', url: 'https://www.ynet.co.il/news/article/yokra14673652' },
      { label: 'מרכז המחקר והמידע של הכנסת (PDF)', url: 'https://fs.knesset.gov.il/globaldocs/MMM/6e2f65ad-4a40-f011-a85f-005056aa9911/2_6e2f65ad-4a40-f011-a85f-005056aa9911_11_21429.pdf' },
    ],
  },
  {
    id: 'screens',
    q: 'האם מסכים ורשתות חברתיות פוגעים בהישגים?',
    stat: '15',
    statLabel: 'נק׳ הפרש במתמטיקה בין תלמידים מוסחים תדיר לבין לא-מוסחים (OECD)',
    compare: '1 מתוך 3',
    compareLabel: 'תלמידים ב-OECD מוסחים ממכשיר דיגיטלי ברוב/כל שיעורי המתמטיקה',
    answer:
      'לא נמצא נתון ישראלי ייעודי, אך PISA 2022 (המבחן ששימש כאמת מידה בינלאומית) מצא של-65% מהתלמידים יש הסחת דעת עצמית ממכשיר דיגיטלי, ול-59% הסחה מהמכשירים של חברים לכיתה. תלמידים מוסחים תדיר קיבלו ציון נמוך ב-15 נקודות במתמטיקה. זהו גורם בינלאומי מוכח בעוצמה בינונית — לא ספציפי-ישראלי אך רלוונטי.',
    verdict: 'תומך (בינלאומי, לא ספציפי-ישראלי)',
    verdictColor: 'midhigh',
    sources: [
      { label: 'OECD — Students, Digital Devices and Success (PDF)', url: 'https://www.oecd.org/content/dam/oecd/en/publications/reports/2024/05/students-digital-devices-and-success_621829ff/9e4c0624-en.pdf' },
    ],
  },
  {
    id: 'covid',
    q: 'מה השפעת הקורונה על ההישגים?',
    stat: '41%',
    statLabel: 'שיעור ימי הלימוד שנסגרו בישראל (2020-21)',
    compare: '47%',
    compareLabel: 'ממוצע ה-OECD',
    answer:
      'בניגוד לאינטואיציה, ישראל סגרה בתי ספר פחות מהממוצע ב-OECD, ואיבדה כ-16 שבועות לימוד (כ-0.46 משנת לימודים) — נמוך-בינוני יחסית לעולם. ישראל דורגה בשליש העליון ב-OECD במהירות התגובה המדיניות למגפה. הממצא הזה מחליש את הקורונה כהסבר המרכזי לירידה החדה והספציפית-ישראלית בהישגים, לעומת מדינות אחרות.',
    verdict: 'לא תומך (השפעה נמוכה מהממוצע העולמי)',
    verdictColor: 'high',
    sources: [
      { label: 'PubMed — ניתוח השוואתי בינלאומי', url: 'https://pubmed.ncbi.nlm.nih.gov/36717901/' },
      { label: 'Nature — COVID ו-PISA, עדויות גלובליות', url: 'https://www.nature.com/articles/s41539-025-00297-3' },
    ],
  },
  {
    id: 'teacher-pay',
    q: 'האם שכר והכשרת מורים נמוכים גורמים לירידה?',
    stat: '↓',
    statLabel: 'שכר מורים בישראל נמוך מממוצע ה-OECD (מגמה כללית מאושרת; הסכום המדויק שנוי במחלוקת בין מקורות)',
    compare: '↑',
    compareLabel: 'קצב עליית השכר בישראל גבוה יחסית ל-OECD בשנים האחרונות',
    answer:
      'הכיוון הכללי מאושר: שכר המורים בישראל נמוך מהממוצע ב-OECD במונחים מוחלטים, למרות שהוצאת ישראל לחינוך כאחוז מהתוצר גבוהה מהממוצע. עם זאת, הסכומים המדויקים בדולרים שנויים במחלוקת בין מקורות שונים (מקור אחד ציין כ-31 אלף $, מקור אחר כ-42 אלף $ מול 46 אלף $ ב-OECD) — לכן אין להסתמך על מספר בודד. גורם מבלבל נוסף: כ-92% מהמורים בשנה הראשונה עובדים במשרה חלקית, מה שמטה כלפי מטה את נתוני השכר הגולמי הממוצע.',
    verdict: 'מעורב/לא חד-משמעי — נתוני $ מדויקים שנויים במחלוקת',
    verdictColor: 'midlow',
    sources: [
      { label: 'Times of Israel — שכר מורים נמוך', url: 'https://www.timesofisrael.com/liveblog_entry/israeli-schools-have-among-largest-class-sizes-lowest-teacher-salaries-oecd-report-finds/' },
      { label: 'Shoresh Institute — Teachers Wages (PDF)', url: 'https://backend.shoresh.institute/downloads/press-release-eng-Ben-David-TeachersWages.pdf' },
    ],
  },
  {
    id: 'composition',
    q: 'האם שינוי הרכב האוכלוסייה (חרדים) "מוריד" את הממוצע הארצי?',
    stat: '20%',
    statLabel: 'מהתלמידים במערכת הם תלמידים חרדים (2023-24)',
    compare: '23% / 37% / 40%',
    compareLabel: '% ברמה גבוהה במתמטיקה: חרדי / ממ״ד / ממלכתי (מיצ״ב)',
    answer:
      'האוכלוסייה החרדית גדלה בכ-4.2% בשנה וצפויה להגיע ל-16% מכלל האוכלוסייה עד 2030 — התלמידים החרדים כבר מהווים חמישית מכלל התלמידים. פער ההישגים בין המגזרים ממשי וגדול (ראו מיצ״ב). פער סוציו-אקונומי ב-PISA 2022 במתמטיקה: 124 נקודות בין תלמידים מבוססים לחלשים (מול ממוצע OECD של 93 נק׳) — ישראל בין קבוצת המדינות עם הפער הרחב ביותר (יחד עם רומניה, סלובקיה והונגריה, לא בהכרח במקום הראשון). עם זאת, לא נמצא מחקר שמכמת בדיוק כמה מהירידה הארצית הכוללת נובעת משינוי הרכב לעומת ירידה בתוך כל מגזר בנפרד.',
    verdict: 'תומך חלקית — כימות מדויק חסר',
    verdictColor: 'midlow',
    sources: [
      { label: 'המכון הישראלי לדמוקרטיה — דוח סטטיסטי חרדי 2024', url: 'https://en.idi.org.il/haredi/2025/?chapter=63076' },
      { label: 'OECD — PISA 2022 Results, Equity in education', url: 'https://www.oecd.org/en/publications/pisa-2022-results-volume-i_53f23881-en/full-report/equity-in-education-in-pisa-2022_4008c06e.html' },
    ],
  },
  {
    id: 'war',
    q: 'האם מלחמת "חרבות ברזל" השפיעה על ההישגים שנמדדו?',
    stat: '~10,000',
    statLabel: 'תלמידים מפונים ללא שיבוץ לימודי, 7 חודשים לתוך המלחמה',
    compare: '72%',
    compareLabel: 'מבתי הספר דיווחו על מחסור במכשירי קצה ללמידה מרחוק',
    answer:
      'לא נמצא נתון רשמי כולל של "ימי לימוד שאבדו" בכל הארץ, אך דוח מבקר המדינה מצא ש-27% מהתלמידים המפונים עדיין ללא שיבוץ לימודי כעבור 7 חודשים; 31% מתלמידי החינוך המיוחד המפונים ו-28% מתלמידי התיכון המפונים ללא שיבוץ. חלק מהתלמידים המפונים למדו בחדרים ללא חלונות או בכיתות של 60 ילדים ללא הפרדה (אילת, ים המלח). זהו גורם משמעותי אך ממוקד גיאוגרפית (יישובי עוטף עזה והצפון) ולא ארצי גורף.',
    verdict: 'תומך — ממוקד גיאוגרפית',
    verdictColor: 'midhigh',
    sources: [
      { label: 'מבקר המדינה — דוח מפונים (PDF)', url: 'https://library.mevaker.gov.il/sites/DigitalLibrary/Documents/2026/Evacuation/2026-Evacuation-209.pdf' },
      { label: 'דבר — 10,000 תלמידים מפונים ללא שיבוץ', url: 'https://www.davar1.co.il/655760/' },
    ],
  },
  {
    id: 'curriculum',
    q: 'האם תוכנית הלימודים עמוסה/מיושנת יחסית למדינות מובילות?',
    stat: '>25%',
    statLabel: 'מזמן ההוראה מוקדש לקריאה/כתיבה/ספרות בישראל — קבוצת ההקצאה הגבוהה ביותר',
    compare: '≤12%',
    compareLabel: 'קבוצת ההקצאה הנמוכה ביותר: פינלנד, יפן, שוודיה, אירלנד — ומשיגות תוצאות מעל ממוצע ה-OECD',
    answer:
      'לפי OECD Education at a Glance, ישראל (יחד עם יוון ואיטליה) מקצה יותר מ-25% מזמן ההוראה לקריאה/כתיבה/ספרות — בקבוצת ההקצאה הגבוהה ביותר, לא הנמוכה. במקביל, מדינות כמו פינלנד, יפן ושוודיה מקצות פחות מ-12% ועדיין משיגות תוצאות מעל ממוצע ה-OECD. כלומר "יותר שעות" אינו הפתרון — ואם כבר, ישראל כבר משקיעה זמן הוראה רב יחסית בתחום הזה בלי שזה מתורגם להישגים גבוהים; מבנה תוכנית הלימודים וכיצד מנוצל הזמן חשובים יותר מכמות השעות.',
    verdict: 'לא תומך (ישראל כבר בקבוצת ההקצאה הגבוהה, לא הנמוכה)',
    verdictColor: 'high',
    sources: [
      { label: 'OECD — Education at a Glance 2025, זמן כיתה', url: 'https://www.oecd.org/en/publications/education-at-a-glance-2025_1c0d9c79-en/full-report/how-much-time-do-students-spend-in-the-classroom_5ae440db.html' },
    ],
  },
  {
    id: 'discipline',
    q: 'האם אלימות/משמעת בכיתות קשורה לירידה בהישגים?',
    stat: '28%',
    statLabel: 'תלמידים בישראל: "לא מצליחים לעבוד היטב ברוב/כל השיעורים"',
    compare: '23%',
    compareLabel: 'ממוצע ה-OECD',
    answer:
      'לפי מדד האקלים המשמעתי של PISA 2022: 28% מהתלמידים בישראל מדווחים שאינם מצליחים לעבוד היטב ברוב השיעורים (מול 23% ב-OECD) — פער מתון. בשאר המדדים (הקשבה למורה, הסחת דעת ממכשירים אישיים/של חברים) ישראל כמעט זהה לממוצע ה-OECD. כלומר זהו גורם עם השפעה מתונה בלבד, לא "מנוע" מרכזי לירידה.',
    verdict: 'תומך חלקית — השפעה מתונה',
    verdictColor: 'midlow',
    sources: [
      { label: 'OECD — PISA 2022 Country Notes: Israel', url: 'https://www.oecd.org/en/publications/pisa-2022-results-volume-i-and-ii-country-notes_ed6fbcc5-en/israel_056c6cf0-en.html' },
    ],
  },
  {
    id: 'centralization',
    q: 'האם ריכוזיות משרד החינוך פוגעת בהישגים?',
    stat: '—',
    statLabel: 'מדד אוטונומיה בית-ספרית של ישראל',
    compare: '—',
    compareLabel: 'לא אותר במחקר זה',
    answer:
      'ל-OECD יש נושא מדידה ייעודי ל"אוטונומיה בית-ספרית", אך סבב המחקר הנוכחי לא איתר את הערך הספציפי של ישראל במדד זה או השוואה מול ממוצע ה-OECD/מדינות מובילות. נדרש שליפה ישירה מפרופיל המדינה של ישראל באתר gpseducation.oecd.org או מפרק האוטונומיה בדוח Education at a Glance 2025.',
    verdict: 'לא נמצא מידע מספק',
    verdictColor: 'low',
    sources: [
      { label: 'OECD Education GPS — פרופיל ישראל', url: 'https://gpseducation.oecd.org/CountryProfile?primaryCountry=ISR&treshold=10&topic=PI' },
    ],
  },
]
