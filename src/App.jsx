import {
  DashboardHeader,
  DashboardFooter,
  PisaSection,
  TimssSection,
  MeitzavSection,
  ExpenditureSection,
  MoneyVsAchievementSection,
  ResearchFindingsSection,
} from './Dashboard.jsx'
import CausesSection from './CausesSection.jsx'
import TrendsPage from './TrendsPage.jsx'
import ClassSizePage from './ClassSizePage.jsx'
import TeacherSalaryPage from './TeacherSalaryPage.jsx'
import ChatBot from './components/ChatBot.jsx'
import Admin from './Admin.jsx'
import AccessibilityStatement from './AccessibilityStatement.jsx'
import AccessibilityWidget from './components/AccessibilityWidget.jsx'
import CookieConsent from './components/CookieConsent.jsx'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { useEffect } from 'react'
import { auth } from './firebase'
import { useAuth } from './lib/useAuth'
import { track, identify, clearIdentity } from './lib/analytics'
import './dashboard.css'

const SECTION_LINKS = [
  { to: '/pisa', label: 'PISA' },
  { to: '/timss', label: 'TIMSS' },
  { to: '/meitzav', label: 'מיצ״ב' },
  { to: '/expenditure', label: 'הוצאה לחינוך' },
  { to: '/money', label: 'כסף מול הישגים' },
  { to: '/causes', label: 'גורמים לירידה' },
  { to: '/class-size', label: 'צפיפות כיתות' },
  { to: '/teacher-salary', label: 'שכר מורים' },
  { to: '/trends', label: 'מגמות' },
]

function DashboardPage({ children }) {
  return (
    <div className="dash-root">
      <div className="dash-wrap">
        <DashboardHeader />
        {children}
        <DashboardFooter />
      </div>
    </div>
  )
}

// Signed-out (and still-loading) users are bounced to the דשבורד — /admin
// has nothing to show them anyway, so skip the "no permission" flash.
function RequireAuth({ children }) {
  const user = useAuth()
  if (user === undefined) return null
  if (!user) return <Navigate to="/" replace />
  return children
}

function NavBar() {
  const user = useAuth()
  const location = useLocation()
  return <nav className="app-nav" dir="rtl">
    <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={() => track('nav_click', { to: '/' })}>דשבורד</Link>
    {SECTION_LINKS.map((link) => (
      <Link
        key={link.to}
        to={link.to}
        className={location.pathname === link.to ? 'active' : ''}
        onClick={() => track('nav_click', { to: link.to, label: link.label })}
      >
        {link.label}
      </Link>
    ))}
    {user?.isAdmin && <Link to="/admin" onClick={() => track('nav_click', { to: '/admin' })}>ניהול</Link>}
    {user && (
      <span className="app-nav-user">
        {user.email}
        {user.isAdmin && <span className="app-nav-badge">מנהל</span>}
        <button type="button" className="app-nav-signout" onClick={() => { track('sign_out', { source: 'navbar' }); signOut(auth) }}>
          התנתק
        </button>
      </span>
    )}
  </nav>
}

function usePageviewTracking() {
  const location = useLocation()
  useEffect(() => {
    track('page_view', { page_path: location.pathname })
  }, [location.pathname])
}

function AuthIdentity() {
  const user = useAuth()
  useEffect(() => {
    if (user) identify(user.uid, { is_admin: user.isAdmin ? 'true' : 'false' })
    else if (user === null) clearIdentity()
  }, [user])
  return null
}

function AppRoutes() {
  usePageviewTracking()
  return (
    <Routes>
      <Route path="/" element={<><Navigate to="/pisa" replace /><ChatBot /></>} />
      <Route path="/pisa" element={<><DashboardPage><PisaSection /></DashboardPage><ChatBot /></>} />
      <Route path="/timss" element={<><DashboardPage><TimssSection /></DashboardPage><ChatBot /></>} />
      <Route path="/meitzav" element={<><DashboardPage><MeitzavSection /></DashboardPage><ChatBot /></>} />
      <Route path="/expenditure" element={<><DashboardPage><ExpenditureSection /><ResearchFindingsSection /></DashboardPage><ChatBot /></>} />
      <Route path="/money" element={<><DashboardPage><MoneyVsAchievementSection /></DashboardPage><ChatBot /></>} />
      <Route path="/causes" element={<><DashboardPage><CausesSection /></DashboardPage><ChatBot /></>} />
      <Route path="/class-size" element={<><ClassSizePage /><ChatBot /></>} />
      <Route path="/teacher-salary" element={<><TeacherSalaryPage /><ChatBot /></>} />
      <Route path="/trends" element={<><TrendsPage /><ChatBot /></>} />
      <Route path="/admin" element={<RequireAuth><Admin /></RequireAuth>} />
      <Route path="/נגישות" element={<AccessibilityStatement />} />
      <Route path="*" element={<Navigate to="/pisa" replace />} />
    </Routes>
  )
}

function App() {
  return <BrowserRouter>
    <a href="#main-content" className="skip-link">דילוג לתוכן</a>
    <AuthIdentity />
    <NavBar />
    <main id="main-content" tabIndex={-1}>
      <AppRoutes />
    </main>
    <AccessibilityWidget />
    <CookieConsent />
  </BrowserRouter>
}

export default App
