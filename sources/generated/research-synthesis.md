# Israel education system, 2006–2026: research synthesis

## Scope and method

This is a research handoff for a future web application. It covers school education, public finance, teaching staff, holidays/calendar, reforms, and measured outcomes, with international comparisons. “Current” means the latest source available in the research pass; historical comparisons use the relevant year and should not be read as a single consistent time series unless the source says so.

## Executive findings

1. Israel devotes an unusually large share of GDP to education, but this is partly demographic: Israel has a comparatively large school-age population. OECD comparisons therefore require both GDP shares and spending per student.
2. Israel has relatively high student–teacher ratios / large classes in some stages, while teachers’ contractual teaching time is near the OECD average. Staffing quantity, qualification and working conditions are as important as total spending.
3. PISA 2022 results were broadly stable versus 2018, better than Israel’s 2006 mathematics/reading results in some respects, but below OECD averages in mathematics, reading and science. The within-Israel socioeconomic gap is large.
4. Major reforms since 2006 changed teacher contracts, school-level support, assessment and resource allocation: Ofek Hadash (from 2008), Oz LeTmura (from 2011–12), differential budgeting (from 2014–15), Meaningful Learning (2014–17), and post-Mitzav assessment changes. The sources support describing implementation and evaluation results separately from causal claims.
5. Israel’s calendar is structured around 1 September–30 June for kindergartens/primary and generally 1 September–20 June for secondary schools, with Jewish, Muslim, Christian and Druze holiday calendars. Calendar comparisons must account for school days, weekly schedule and within-year holidays—not just nominal vacation days.
6. The most important comparison set for the app is not “Israel versus the world” as one ranking: use OECD average plus Singapore, Korea, Estonia/Finland, the United States, and selected demographic or regional comparators, while showing uncertainty and test-cycle effects.

## Evidence table

| Domain | Israel evidence | International benchmark / interpretation | App integration note |
|---|---|---|---|
| Spending | OECD 2024 country note and CBS provide national education-finance context; Knesset budget analysis documents major nominal budget growth during 2008–18. | OECD Education at a Glance supplies comparable spending, funding and resource definitions. | Store year, measure, price basis, education level and denominator separately. |
| Teachers | Israel lower-secondary teachers were contractually required to teach 692 hours annually versus OECD average 706; student/teacher ratios were 15 primary, 13 lower-secondary and 11 upper-secondary. | OECD warns that ratios trade off individual support against salary cost. | Do not equate student/teacher ratio with class size. |
| Outcomes | PISA 2022: about 70% reached Level 2+ in reading versus 74% OECD; 68% in science versus 76% OECD. Mathematics, reading and science were about unchanged from 2018. | OECD PISA country notes provide comparable scores, proficiency and trend definitions. | Keep score, proficiency share and rank as separate fields. |
| Equity | OECD PISA describes substantial socioeconomic and subgroup gaps; Israel’s socioeconomic mathematics gap is reported as wider than OECD average. | Use within-country gaps and distributional indicators, not only national means. | Segment by language sector, socioeconomic status, gender and immigrant background where sample rules permit. |
| Reforms | Ofek Hadash began in 2008 with teacher status/pay, small-group work, achievement/equity, climate and principal authority goals. Oz LeTmura began phased implementation in 2011–12, including a 40-hour teacher week and individual/support hours. | Reform evaluation is mixed and implementation-sensitive. | Add reform start, target mechanism, coverage, evaluation design and outcome fields. |
| Funding equity | State Comptroller 2023 reviewed differential budgeting introduced from 2014–15 and gaps across socioeconomic and sectoral groups. | Funding formulas are not equivalent to equal outcomes. | Represent allocation formula, transparency, implementation and observed achievement separately. |
| Calendar | Ministry calendar: primary/kindergarten usually end 30 June; secondary generally end 20 June; start 1 September, subject to year and holiday rules. | Cross-country comparisons require instructional days/hours and holiday definitions. | Model calendar by sector, school stage, year and holiday, not one national date range. |

## 2006–2026 policy timeline

- **2006–07:** baseline period for PISA trend comparisons and expansion of compulsory-education policy changes.
- **2008:** Ofek Hadash/New Horizon introduced progressively; objectives included teacher status and pay, small-group pedagogy, equity, climate and school leadership.
- **2011–12:** Oz LeTmura/Courage to Change began phased upper-secondary implementation. The State Comptroller describes a 40-hour work week, individual and support teaching hours, professional development/evaluation, and an estimated full-implementation annual cost of about NIS 3 billion.
- **2014–15:** differential budgeting for primary and junior-high schools began as an equity instrument; the 2023 State Comptroller review examined transparency, allocation gaps, achievement gaps and teacher quality.
- **2014–17:** Meaningful Learning reform changed teaching, learning and assessment. RAMA’s later evaluation reported no substantial improvement in most defined student outcome measures after the initial implementation period.
- **2020–22:** COVID-era disruption affected assessment cycles and learning conditions; PISA 2022 was delayed from 2021, so trend interpretation requires caution.
- **2023–24:** OECD PISA 2022 and Education at a Glance 2024 provide the principal international comparison baseline.
- **2025–26:** official Ministry/RAMA dashboards report current system inputs and a move toward a multi-layer assessment model; the 2026 calendar page documents current sector-specific holidays and school-year dates. Treat announcements as policy status, not evidence of impact.

## Comparison design for the future app

Use three layers: (1) inputs—budget, GDP, enrollment, teacher count, qualifications and hours; (2) processes—class size, instructional time, reform coverage, calendar and school climate; (3) outcomes—PISA/TIMSS/RAMA scores, proficiency and gaps. Every metric should carry source, publication date, reference year, unit, population, denominator, methodology and a confidence/status label (official statistic, evaluation finding, analysis, or media report).

Avoid causal language such as “spending caused scores” unless a source uses an identification strategy. OECD PISA is cross-sectional/trend assessment evidence, not a reform impact evaluation. Compare Israel to the OECD mean and a stable comparator set, and show distributions and gaps alongside averages.

## Limitations

The source library is strongest for 2014–2024 and current calendar information. A complete 20-year panel still needs harmonized historical extracts from OECD.Stat, IEA TIMSS/PIRLS, CBS annual education tables, annual Ministry budget books, teacher workforce series, and archived Ministry calendars. PISA 2025 claims in existing project materials should not be merged with this handoff without the official OECD release and technical documentation.

