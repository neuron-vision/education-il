import Dashboard from './Dashboard.jsx'
import ChatBot from './components/ChatBot.jsx'
import Admin from './Admin.jsx'
import AccessibilityStatement from './AccessibilityStatement.jsx'
import AccessibilityWidget from './components/AccessibilityWidget.jsx'
import CookieConsent from './components/CookieConsent.jsx'
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from './firebase'
import { useAuth } from './lib/useAuth'

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
  return <nav className="app-nav" dir="rtl">
    <Link to="/">דשבורד</Link>
    {user?.isAdmin && <Link to="/admin">ניהול</Link>}
    {user && (
      <span className="app-nav-user">
        {user.email}
        {user.isAdmin && <span className="app-nav-badge">מנהל</span>}
        <button type="button" className="app-nav-signout" onClick={() => signOut(auth)}>
          התנתק
        </button>
      </span>
    )}
  </nav>
}

function App() {
  return <BrowserRouter>
    <a href="#main-content" className="skip-link">דילוג לתוכן</a>
    <NavBar />
    <main id="main-content" tabIndex={-1}>
      <Routes>
        <Route path="/" element={<><Dashboard /><ChatBot /></>} />
        <Route path="/admin" element={<RequireAuth><Admin /></RequireAuth>} />
        <Route path="/נגישות" element={<AccessibilityStatement />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
    <AccessibilityWidget />
    <CookieConsent />
  </BrowserRouter>
}

export default App
