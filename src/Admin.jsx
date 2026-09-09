import { useEffect, useState } from 'react'
import { collection, collectionGroup, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from './firebase'
import { useAuth } from './lib/useAuth'
import './admin.css'

export default function Admin() {
  const user = useAuth()
  const [allowed, setAllowed] = useState(null)
  const [users, setUsers] = useState([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [selected, setSelected] = useState(null)
  const [sessions, setSessions] = useState([])
  const [conversation, setConversation] = useState(null)
  const [error, setError] = useState('')
  const [myChats, setMyChats] = useState([])
  const [myChatsError, setMyChatsError] = useState('')
  const [myConversation, setMyConversation] = useState(null)

  useEffect(() => {
    if (!user) return setAllowed(false)
    // Force-refresh: a token minted before an admin claim was granted won't
    // carry it, and the SDK caches tokens — without force:true a user who
    // was just granted admin would keep seeing "no permission" until their
    // token happens to expire on its own.
    user.getIdTokenResult(true).then((token) => setAllowed(token.claims.admin === true)).catch(() => setAllowed(false))
  }, [user])

  // Every signed-in user (admin or not) can see their own chat history —
  // this only touches users/{uid}/chats, which the rules always allow for
  // uid === request.auth.uid, so it never depends on the admin claim above.
  useEffect(() => {
    if (!user) return
    getDocs(query(collection(db, 'users', user.uid, 'chats'), orderBy('updatedAt', 'desc'), limit(50)))
      .then((snap) => setMyChats(snap.docs.map((item) => ({ id: item.id, ...item.data() }))))
      .catch((e) => setMyChatsError(e.message))
  }, [user])

  useEffect(() => {
    if (!allowed) return
    Promise.all([
      getDocs(collection(db, 'users')),
      getDocs(query(collectionGroup(db, 'chats'), orderBy('updatedAt', 'desc'), limit(500))),
    ]).then(([userSnap, chatSnap]) => {
      setTotalUsers(userSnap.size)
      const counts = new Map()
      chatSnap.forEach((item) => {
        const uid = item.ref.parent.parent.id
        counts.set(uid, [...(counts.get(uid) || []), { id: item.id, ...item.data() }])
      })
      setUsers(userSnap.docs.map((item) => ({ id: item.id, ...item.data(), sessions: counts.get(item.id) || [] }))
        .sort((a, b) => b.sessions.length - a.sessions.length).slice(0, 5))
    }).catch((e) => setError(e.message))
  }, [allowed])

  if (user === undefined || allowed === null) return <main className="admin-page"><p>טוען…</p></main>

  const openUser = (item) => { setSelected(item); setSessions(item.sessions.slice(0, 3)); setConversation(null) }

  const myChatsSection = user && (
    <section className="admin-card">
      <h2>השיחות שלי</h2>
      {myChatsError && <p className="admin-error">{myChatsError}</p>}
      {!myChatsError && myChats.length === 0 && <p>עדיין אין היסטוריית שיחות.</p>}
      {myChats.map((session) => (
        <button className="session-row" key={session.id} onClick={() => setMyConversation(session)}>
          {session.id} · {session.messages?.length || 0} הודעות
        </button>
      ))}
      {myConversation && (
        <div className="conversation">
          {myConversation.messages?.map((message, i) => (
            <p key={i}><b>{message.role === 'user' ? 'משתמש' : 'עוזר'}:</b> {message.text}</p>
          ))}
        </div>
      )}
    </section>
  )

  if (!user || !allowed) {
    return <main className="admin-page" dir="rtl">
      {user ? myChatsSection : <><h1>אין הרשאה</h1><p>יש להתחבר כדי לצפות בשיחות שלך.</p></>}
    </main>
  }

  return <main className="admin-page" dir="rtl">
    <h1>ניהול המערכת</h1>
    <div className="admin-stats"><div><b>{totalUsers}</b><span>משתמשים רשומים</span></div><div><b>{users.reduce((n, u) => n + u.sessions.length, 0)}</b><span>סשנים שנטענו</span></div></div>
    {error && <p className="admin-error">{error}</p>}
    <section className="admin-card"><h2>5 משתמשי הצ׳אט המובילים</h2><table><thead><tr><th>משתמש</th><th>סשנים</th><th>פעולה</th></tr></thead><tbody>{users.map((item) => <tr key={item.id}><td>{item.email || item.displayName || item.id}</td><td>{item.sessions.length}</td><td><button onClick={() => openUser(item)}>הצג סשנים</button></td></tr>)}</tbody></table></section>
    {selected && <section className="admin-card"><h2>3 הסשנים האחרונים · {selected.email}</h2>{sessions.map((session) => <button className="session-row" key={session.id} onClick={() => setConversation(session)}>{session.id} · {session.messages?.length || 0} הודעות</button>)}</section>}
    {conversation && <section className="admin-card"><h2>שיחה</h2><div className="conversation">{conversation.messages?.map((message, i) => <p key={i}><b>{message.role === 'user' ? 'משתמש' : 'עוזר'}:</b> {message.text}</p>)}</div></section>}
    {myChatsSection}
  </main>
}
