import { getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'

const uid = process.argv[2]
if (!uid) {
  console.error('Usage: GOOGLE_APPLICATION_CREDENTIALS=... node scripts/populate-lock.mjs <firebase-user-uid> [days]')
  process.exit(1)
}
if (!getApps().length) initializeApp()
const db = getFirestore()
const now = new Date()
const days = Number(process.argv[3] || 3)
const releaseAt = new Date(now.getTime() + days * 86400000)
const key = now.toISOString().slice(0, 10)
await db.collection('users').doc(uid).collection('locks').doc(key).set({
  reason: 'Test lock created by populate-lock.mjs',
  lockedAt: Timestamp.fromDate(now),
  releaseAt: Timestamp.fromDate(releaseAt),
  updatedAt: Timestamp.fromDate(now),
})
console.log(JSON.stringify({ uid, lockId: key, releaseAt: releaseAt.toISOString() }, null, 2))
