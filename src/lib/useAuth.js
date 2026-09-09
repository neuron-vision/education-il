import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase'

export function useAuth() {
  const [user, setUser] = useState(undefined) // undefined = loading, null = signed out
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => onAuthStateChanged(auth, (nextUser) => {
    setUser(nextUser)
    if (nextUser) {
      setDoc(doc(db, 'users', nextUser.uid), {
        email: nextUser.email || '',
        displayName: nextUser.displayName || '',
        lastSeenAt: serverTimestamp(),
      }, { merge: true }).catch(() => {})

      nextUser.getIdTokenResult()
        .then((token) => setIsAdmin(token.claims.admin === true))
        .catch(() => setIsAdmin(false))
    } else {
      setIsAdmin(false)
    }
  }), [])

  return user === undefined ? user : user === null ? null : Object.assign(user, { isAdmin })
}
