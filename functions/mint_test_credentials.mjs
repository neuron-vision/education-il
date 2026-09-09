import { initializeApp } from 'firebase-admin/app'
import { getAppCheck } from 'firebase-admin/app-check'
import { getAuth } from 'firebase-admin/auth'

// Mints a real Firebase ID token + App Check token for a test UID, entirely
// via the Admin SDK. This is how automated tests authenticate now that public
// email/password sign-up is disabled on the project — no client-facing sign-up
// surface is needed or exists for this.
const [uid, appIdArg] = process.argv.slice(2)
// Matches the appId in src/firebase.js — a public client identifier, not a secret.
const DEFAULT_APP_ID = '1:908045528681:web:64777711f7fe7312e3bcf8'
const appId = process.env.FIREBASE_WEB_APP_ID || appIdArg || DEFAULT_APP_ID

if (!uid) {
  console.error('Usage: node mint_test_credentials.mjs <uid> [app-id]')
  process.exit(1)
}

initializeApp({ projectId: 'education-il' })

const customToken = await getAuth().createCustomToken(uid)
const apiKey = process.env.FIREBASE_WEB_API_KEY
if (!apiKey) throw new Error('Set FIREBASE_WEB_API_KEY to exchange the custom token for an ID token.')

const exchange = await fetch(
  `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`,
  {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ token: customToken, returnSecureToken: true }),
  },
)
const exchangeBody = await exchange.json()
if (!exchange.ok) throw new Error(`custom token exchange failed: ${exchangeBody.error?.message || exchange.status}`)

const appCheckToken = await getAppCheck().createToken(appId)

console.log(JSON.stringify({
  idToken: exchangeBody.idToken,
  appCheckToken: appCheckToken.token,
}))
