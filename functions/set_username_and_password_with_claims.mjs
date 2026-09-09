import { initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

// Grants custom claims (e.g. { "admin": true }) to an existing user, looked up by
// email. The user must already exist — sign in via Google once first. Password
// auth was removed as a public attack surface; see functions/mint_test_credentials.mjs
// for how test scripts authenticate instead.
const [email, claimsArg] = process.argv.slice(2)
const claimsJson = claimsArg || '{}'

if (!email) {
  console.error('Usage: node set_username_and_password_with_claims.mjs <email> [claims-json]')
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

const user = await auth.getUserByEmail(email)
await auth.setCustomUserClaims(user.uid, claims)
console.log(`Set custom claims for ${user.email}: ${JSON.stringify(claims)}`)
