// תקציב משרד החינוך הכולל (מיליארדי ש"ח, תקציב מאושר אלא אם צוין אחרת) מול ציון PISA ממוצע.
// נתונים חלקיים בלבד — כוסו רק שנים עם מקור ישיר ומאומת; פערים (2006–2010, 2012–2014, 2017–2018)
// לא נכללו כי לא אותר מקור ראשוני אמין לסכום הכולל באותן שנים.

// אוכלוסיית ישראל (מיליונים, סוף שנה / אמצע שנה), הלמ"ס — לצורך נרמול תקציב לנפש.
const POPULATION_MILLIONS_BY_YEAR = {
  2011: 7.84,
  2015: 8.46,
  2016: 8.59,
  2019: 9.14,
  2022: 9.66,
  2023: 9.85,
  2024: 9.9,
  2025: 10.03,
}

export const BUDGET_BY_YEAR = [
  { year: 2011, budgetBillionNis: 37.5, note: 'תקציב מאושר' },
  { year: 2015, budgetBillionNis: 48.9, note: 'תקציב רגיל, ללא המועצה להשכלה גבוהה' },
  { year: 2016, budgetBillionNis: 50.9, note: 'תקציב רגיל' },
  { year: 2019, budgetBillionNis: 59, note: 'תקציב מאושר, ללא תקציב פיתוח כיתות' },
  { year: 2022, budgetBillionNis: 67.8, note: 'תקציב מאושר' },
  { year: 2023, budgetBillionNis: 77.8, note: 'תקציב מאושר' },
  { year: 2024, budgetBillionNis: 82.9, note: 'תקציב מאושר' },
  { year: 2025, budgetBillionNis: 90.7, note: 'ביצוע בפועל' },
].map((d) => ({
  ...d,
  populationMillions: POPULATION_MILLIONS_BY_YEAR[d.year],
  budgetPerCapitaNis: Math.round((d.budgetBillionNis * 1e9) / (POPULATION_MILLIONS_BY_YEAR[d.year] * 1e6)),
}))

// ציון PISA ממוצע (מתמטיקה+קריאה+מדעים)/3, מחושב מתוך PISA.israel ב-educationData.js
export const PISA_MEAN_BY_YEAR = [
  { year: 2006, meanScore: 445.0 },
  { year: 2009, meanScore: 458.7 },
  { year: 2012, meanScore: 474.0 },
  { year: 2015, meanScore: 472.0 },
  { year: 2018, meanScore: 465.0 },
  { year: 2022, meanScore: 465.7 },
  { year: 2025, meanScore: 437.0 },
]

export const BUDGET_SOURCES = [
  { label: 'Globes — תקציב החינוך הוכפל בתוך עשור', url: 'https://www.globes.co.il/news/article.aspx?did=1001488780' },
  { label: 'Calcalist — תקציב החינוך הוכפל בעשור, ההישגים פחתו', url: 'https://www.calcalist.co.il/local_news/article/rkaoxaiwf' },
  { label: 'Ynet — תקציב המדינה 2019: מה יקבל כל משרד', url: 'https://www.ynet.co.il/articles/0,7340,L-5099324,00.html' },
  { label: 'BudgetKey (obudget.org) — תקציב משרד החינוך 2025–2026', url: 'https://next.obudget.org/i/budget/0020/2026' },
  { label: 'Ynetnews — Government approves Israel\'s 2025 state budget', url: 'https://www.ynetnews.com/article/rkclobm11je' },
  { label: 'מרכז המחקר והמידע של הכנסת — תיאור וניתוח הצעת תקציב משרד החינוך 2021–2022', url: 'https://fs.knesset.gov.il/globaldocs/MMM/5b0f90fb-bf21-ec11-813f-00155d0401c3/2_5b0f90fb-bf21-ec11-813f-00155d0401c3_11_18185.pdf' },
  { label: 'הלשכה המרכזית לסטטיסטיקה — אומדני אוכלוסיית ישראל', url: 'https://www.cbs.gov.il/he/subjects/Pages/%D7%90%D7%95%D7%9B%D7%9C%D7%95%D7%A1%D7%99%D7%99%D7%94.aspx' },
]
