// שכר שנתי ממוצע למורה בבית ספר יסודי, בשלב אמצע הסולם (15 שנות ותק, $ PPP, OECD Education at a
// Glance 2024, Table D3.1) מול ציון PISA 2022 ממוצע (מתמטיקה+קריאה+מדעים)/3. מדינות נבחרו לפי
// זמינות נתוני שכר יסודי במקור.
// מקור: OECD, Education at a Glance 2024 — Table D3.1 (Teachers' salaries); PISA 2022 Results Volume I.

export const TEACHER_SALARY_VS_SCORE = [
  { country: 'קולומביה', code: 'COL', salaryUsdPpp: 19700, meanScore: 402.0 },
  { country: 'מקסיקו', code: 'MEX', salaryUsdPpp: 23300, meanScore: 405.0 },
  { country: 'צ׳ילה', code: 'CHL', salaryUsdPpp: 27200, meanScore: 424.0 },
  { country: 'הונגריה', code: 'HUN', salaryUsdPpp: 27600, meanScore: 480.0 },
  { country: 'לטביה', code: 'LVA', salaryUsdPpp: 28700, meanScore: 480.0 },
  { country: 'סלובקיה', code: 'SVK', salaryUsdPpp: 29900, meanScore: 464.0 },
  { country: 'טורקיה', code: 'TUR', salaryUsdPpp: 31100, meanScore: 465.0 },
  { country: 'צ׳כיה', code: 'CZE', salaryUsdPpp: 32300, meanScore: 492.0 },
  { country: 'איטליה', code: 'ITA', salaryUsdPpp: 37600, meanScore: 475.0 },
  { country: 'ישראל', code: 'ISR', salaryUsdPpp: 39500, meanScore: 465.7 },
  { country: 'שוודיה', code: 'SWE', salaryUsdPpp: 40800, meanScore: 480.0 },
  { country: 'צרפת', code: 'FRA', salaryUsdPpp: 41600, meanScore: 478.0 },
  { country: 'פינלנד', code: 'FIN', salaryUsdPpp: 42900, meanScore: 490.0 },
  { country: 'פולין', code: 'POL', salaryUsdPpp: 43500, meanScore: 507.0 },
  { country: 'ספרד', code: 'ESP', salaryUsdPpp: 44300, meanScore: 474.0 },
  { country: 'בלגיה', code: 'BEL', salaryUsdPpp: 51600, meanScore: 490.0 },
  { country: 'אוסטרליה', code: 'AUS', salaryUsdPpp: 52700, meanScore: 487.0 },
  { country: 'אנגליה', code: 'GBR', salaryUsdPpp: 53200, meanScore: 495.0 },
  { country: 'ארה״ב', code: 'USA', salaryUsdPpp: 55100, meanScore: 470.0 },
  { country: 'הולנד', code: 'NLD', salaryUsdPpp: 58400, meanScore: 480.0 },
  { country: 'קנדה', code: 'CAN', salaryUsdPpp: 59300, meanScore: 508.0 },
  { country: 'אוסטריה', code: 'AUT', salaryUsdPpp: 61200, meanScore: 484.0 },
  { country: 'דרום קוריאה', code: 'KOR', salaryUsdPpp: 62400, meanScore: 527.0 },
  { country: 'גרמניה', code: 'DEU', salaryUsdPpp: 82600, meanScore: 480.0 },
  { country: 'שווייץ', code: 'CHE', salaryUsdPpp: 91300, meanScore: 502.0 },
  { country: 'יפן', code: 'JPN', salaryUsdPpp: 49600, meanScore: 533.0 },
]

export const TEACHER_SALARY_SOURCES = [
  { label: 'OECD — Education at a Glance 2024, Table D3.1 (Teachers\' salaries)', url: 'https://www.oecd.org/en/publications/education-at-a-glance-2024_c00cad36-en.html' },
  { label: 'OECD — PISA 2022 Results Volume I', url: 'https://www.oecd.org/en/publications/pisa-2022-results-volume-i_53f23881-en.html' },
]
