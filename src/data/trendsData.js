// נתוני עמוד "מגמות" — סדרות זמן מאוחדות + ציר אירועים לצורך זיהוי קורלציות אפשריות.
// כל סדרה: { key, label, color, unit, points: [{year, value}] } — שנים לא רציפות מותרות.
// כל אירוע: { year, label, kind } — kind קובע צבע/סמל בציר האירועים.

export const TIMELINE_SERIES = [
  {
    key: 'pisaMath',
    label: 'PISA · מתמטיקה',
    color: '#3d7ea6',
    unit: '',
    points: [
      { year: 2006, value: 442 }, { year: 2009, value: 447 }, { year: 2012, value: 466 },
      { year: 2015, value: 470 }, { year: 2018, value: 463 }, { year: 2022, value: 458 },
      { year: 2025, value: 433 },
    ],
  },
  {
    key: 'pisaReading',
    label: 'PISA · קריאה',
    color: '#c9793d',
    unit: '',
    points: [
      { year: 2006, value: 439 }, { year: 2009, value: 474 }, { year: 2012, value: 486 },
      { year: 2015, value: 479 }, { year: 2018, value: 470 }, { year: 2022, value: 474 },
      { year: 2025, value: 436 },
    ],
  },
  {
    key: 'pisaScience',
    label: 'PISA · מדעים',
    color: '#3d9668',
    unit: '',
    points: [
      { year: 2006, value: 454 }, { year: 2009, value: 455 }, { year: 2012, value: 470 },
      { year: 2015, value: 467 }, { year: 2018, value: 462 }, { year: 2022, value: 465 },
      { year: 2025, value: 442 },
    ],
  },
  {
    key: 'timssMath',
    label: 'TIMSS · מתמטיקה',
    color: '#9d5fb0',
    unit: '',
    points: [
      { year: 1999, value: 468 }, { year: 2003, value: 496 }, { year: 2007, value: 463 },
      { year: 2011, value: 516 }, { year: 2015, value: 511 }, { year: 2019, value: 519 },
      { year: 2023, value: 487 },
    ],
  },
  {
    key: 'timssScience',
    label: 'TIMSS · מדעים',
    color: '#c94d6b',
    unit: '',
    points: [
      { year: 1999, value: 466 }, { year: 2003, value: 488 }, { year: 2007, value: 468 },
      { year: 2011, value: 516 }, { year: 2015, value: 507 }, { year: 2019, value: 513 },
      { year: 2023, value: 481 },
    ],
  },
  {
    key: 'expenditurePctGdp',
    label: 'הוצאה לחינוך (% תוצר)',
    color: '#d4b64b',
    unit: '%',
    dashed: true,
    points: [
      { year: 2013, value: 5.9 }, { year: 2018, value: 6.0 }, { year: 2022, value: 6.1 }, { year: 2025, value: 6.1 },
    ],
  },
]

// אירועים לציר הזמן — kind: 'test' | 'reform' | 'crisis'
export const TIMELINE_EVENTS = [
  { year: 2008, label: 'רפורמת אופק חדש', kind: 'reform' },
  { year: 2011, label: 'רפורמת עוז לתמורה', kind: 'reform' },
  { year: 2014, label: 'תקצוב דיפרנציאלי + למידה משמעותית', kind: 'reform' },
  { year: 2020, label: 'קורונה — סגרים והוראה מרחוק', kind: 'crisis' },
  { year: 2023, label: 'תוצאות TIMSS — שפל 17 שנה', kind: 'test' },
  { year: 2023.7, label: '7.10 ומלחמת "חרבות ברזל"', kind: 'crisis' },
  { year: 2025.6, label: 'תוצאות PISA — הירידה הגדולה בתולדות המדינה', kind: 'test' },
  { year: 2025.7, label: 'מיצ״ב תשפ״ה — אישוש מקומי', kind: 'test' },
]

export const EVENT_KIND_LABELS = {
  test: 'תוצאות מבחן',
  reform: 'רפורמה/מדיניות',
  crisis: 'משבר/אירוע חיצוני',
}

export const EVENT_KIND_COLORS = {
  test: '#3d7ea6',
  reform: '#3d9668',
  crisis: '#c9483d',
}
