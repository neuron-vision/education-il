import { initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const [email, passwordArg, claimsArg] = process.argv.slice(2)
const password = process.env.FIREBASE_USER_PASSWORD || passwordArg
const claimsJson = process.env.FIREBASE_USER_PASSWORD ? (claimsArg || passwordArg || '{}') : (claimsArg || '{}')

if (!email || !password) {
  console.error('Usage: FIREBASE_USER_PASSWORD=... node set_username_and_password_with_claims.mjs <email> [claims-json]')
  process.exit(1)
}

let claims
try {
  claims = JSON.parse(claimsJson)
} catch {
  console.error('claims-json must be valid JSON')
  process.exit(1)
}

if (!claims || Array.isArray(claims) || typeof claims !== 'object') {
  console.error('claims-json must be a JSON object')
  process.exit(1)
}

initializeApp({ projectId: 'education-il' })
const auth = getAuth()

let user
try {
  user = await auth.getUserByEmail(email)
  user = await auth.updateUser(user.uid, { password })
  console.log(`Updated password for ${user.email}`)
} catch (error) {
  if (error.code !== 'auth/user-not-found') throw error
  user = await auth.createUser({ email, password })
  console.log(`Created user ${user.email}`)
}

await auth.setCustomUserClaims(user.uid, claims)
console.log(`Set custom claims for ${user.email}: ${JSON.stringify(claims)}`)
