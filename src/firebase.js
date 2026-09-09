import { initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase web config is not a secret — it identifies the project to the
// client SDK; access is enforced by Auth + the Cloud Function's token check,
// not by hiding this object.
const firebaseConfig = {
  apiKey: 'AIzaSyDUB3pngoHk9gaZSUjdaF1boNGMaeuI6zU',
  authDomain: 'education-il.firebaseapp.com',
  projectId: 'education-il',
  storageBucket: 'education-il.firebasestorage.app',
  messagingSenderId: '908045528681',
  appId: '1:908045528681:web:64777711f7fe7312e3bcf8',
  measurementId: 'G-LS5Y3R329X',
}

// reCAPTCHA Enterprise site key — also a public client-side identifier, not a secret.
const RECAPTCHA_SITE_KEY = '6LcsyrItAAAAAN1FAKCsLOiDrOMTau9wYczZvHpy'

export const app = initializeApp(firebaseConfig)

// Proves requests to the `chat` Cloud Function come from this registered app,
// not a scraped/forked copy hammering the shared Gemini key.
export const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider(RECAPTCHA_SITE_KEY),
  isTokenAutoRefreshEnabled: true,
})

export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })
