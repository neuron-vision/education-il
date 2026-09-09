import { initializeApp } from 'firebase/app'
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

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })
