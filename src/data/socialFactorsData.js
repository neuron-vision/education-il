// בידוד חברתי, רשתות חברתיות ושימוש במכשירים ניידים מול הישגים לימודיים.
// חלק מהנתונים חלקיים/לא ניתנים להשוואה בין-מדינתית מלאה — מצוין בפירוש בכל טבלה.

// "תחושת שייכות" בבית הספר (PISA 2022) — טבלה חלקית, נאספה מדוחות מדינה בודדים
// (לא נמצא טבלה מלאה אחת של OECD לכל המדינות בסבב מחקר זה).
export const BELONGING_VS_SCORE = [
  { country: 'יפן', code: 'JPN', belonging: 86, meanScore: 536 },
  { country: 'שווייץ', code: 'CHE', belonging: 79, meanScore: 508 },
  { country: 'ישראל', code: 'ISR', belonging: 76, meanScore: 458 },
  { country: 'ממוצע OECD', code: 'OECD', belonging: 75, meanScore: 472 },
  { country: 'אוסטרליה', code: 'AUS', belonging: 70, meanScore: 487 },
  { country: 'פולין', code: 'POL', belonging: 64, meanScore: 489 },
]

export const BELONGING_SOURCES = [
  { label: 'OECD — PISA 2022 Country Note: Israel', url: 'https://www.oecd.org/en/publications/pisa-2022-results-volume-i-and-ii-country-notes_ed6fbcc5-en/israel_056c6cf0-en.html' },
  { label: 'OECD — PISA 2022 Results Volume II', url: 'https://www.oecd.org/en/publications/pisa-2022-results-volume-ii_a97db61c-en.html' },
]

// רשתות חברתיות: אין טבלה בין-מדינתית תואמת (ישראל לא נכללה בדוח HBSC 2021/22 הבינלאומי —
// הנתונים הגיעו באיחור). מוצגים נתון ישראלי מקומי מול קו-בסיס בינלאומי (HBSC), ללא השוואה ישירה.
export const SOCIAL_MEDIA_FACTS = {
  israel: {
    stat: '28.7%',
    label: 'מבני נוער בישראל מדווחים על 6+ שעות מסך ביום מחוץ לבית הספר',
    source: { label: 'אוניברסיטת בר-אילן עם משרדי החינוך והבריאות (WHO/Europe, 2023)', url: 'https://www.who.int/europe/news/item/26-07-2023-new-report-highlights-mental-distress-among-young-people-in-israel' },
  },
  international: {
    stat: '36%',
    label: 'מהמתבגרים ב-44 מדינות/אזורים מדווחים על קשר מקוון רציף עם חברים (עולה ל-44% בקרב בנות בנות 15)',
    source: { label: 'HBSC — WHO Study, Health Behaviour in School-aged Children', url: 'https://hbsc.org/' },
  },
  note: 'ישראל לא נכללה בדוח HBSC הבינלאומי 2021/22 (נתוניה הגיעו באיחור) — לכן אין נקודת השוואה ישירה בין הנתון הישראלי לנתון הבינלאומי; שני המספרים ממקורות ושיטות שונות ומוצגים זה לצד זה להקשר בלבד.',
}

// שימוש במכשירים ניידים לפנאי דיגיטלי מחוץ לבית הספר (זווית שונה מ"הסחת דעת בכיתה" שכבר מופיעה בעמוד הגורמים).
// אין אישור לנתון ישראלי (gpseducation.oecd.org חסום לגישה אוטומטית) — מוצגות רק נקודות שאומתו ישירות.
export const DEVICE_LEISURE_POINTS = [
  { country: 'יפן', code: 'JPN', hoursPerDay: 1.0, meanScore: 536 },
  { country: 'אסטוניה', code: 'EST', hoursPerDay: 3.7, meanScore: 510 },
  { country: 'פולין', code: 'POL', hoursPerDay: null, meanScore: 489, note: '40%+ מעל 4 שעות/יום (ערך מדויק לא אותר)' },
  { country: 'ממוצע OECD', code: 'OECD', hoursPerDay: 2.67, meanScore: 472 },
]

export const DEVICE_LEISURE_SOURCES = [
  { label: 'OECD — Digital leisure outside school (dashboard)', url: 'https://www.oecd.org/en/data/dashboards/pisa-education-and-skills/digital-leisure-outside-school.html' },
  { label: 'OECD — Finite Time to Learn and Play', url: 'https://www.oecd.org/en/publications/finite-time-to-learn-and-play_e1794c9c-en.html' },
]
