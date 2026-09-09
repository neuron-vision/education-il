# education-il

An interactive dashboard comparing Israeli education outcomes (PISA, TIMSS, Meitzav) against OECD benchmarks, with an authenticated Gemini-powered chatbot for exploring the data.

Live site: [education-il.web.app](https://education-il.web.app)

## Stack

- React + Vite (frontend)
- Firebase Hosting, Auth, Firestore, Cloud Functions (backend)
- Google Gemini (`gemini-flash-latest`) via a Cloud Function, gated behind Firebase Auth + App Check

## Getting started

```bash
npm install
npm run dev
```

`npm run dev` runs `scripts/dev.mjs`, which starts the Firebase emulators (Functions + Hosting) and Vite together, and opens the emulated hosting URL. This is the normal way to develop locally — it does not touch the production Firebase project's data.

Other scripts:

```bash
npm run build        # production build (also generates favicon/OG assets)
npm test             # unit tests for functions/chatPolicy.js
npm run test:cloud   # end-to-end test against the deployed chat function (needs real credentials, see below)
npm run deploy       # build + deploy hosting and functions to Firebase
```

## Firebase project setup

This repo is wired to a specific Firebase project (`education-il`, see `.firebaserc`). To run your own instance:

1. Create a Firebase project with Firestore, Authentication (Google sign-in only — see below), and Cloud Functions (Blaze plan — required for outbound network calls from Functions).
2. Update `.firebaserc` and the `firebaseConfig` object in `src/firebase.js` with your project's values (the web config is a public identifier, not a secret).
3. Set the Gemini API key as a Cloud Functions secret (never commit it):
   ```bash
   firebase functions:secrets:set GOOGLE_GENAI_API_KEY
   ```
4. Set up [Firebase App Check](https://firebase.google.com/docs/app-check) with reCAPTCHA Enterprise for your web app, and update the `RECAPTCHA_SITE_KEY` in `src/firebase.js`. **Note:** `enforceAppCheck` on `onRequest` functions is a no-op in `firebase-functions` v6 — it only works on `onCall`. This project verifies the `X-Firebase-AppCheck` header by hand in `functions/index.js` (see `verifyAppCheck`); don't rely on the option alone.
5. Deploy Firestore rules (`firestore.rules`) — they default-deny everything except a user's own `users/{uid}` document, chat log, and lock records.
6. **Set a GCP billing budget alert** on your project before enabling public traffic (Billing → Budgets & alerts in the Google Cloud Console). Gemini and Firestore usage is pay-as-you-go.

### Sign-in providers

Only **Google sign-in** is enabled for end users — Email/Password is disabled in Firebase Auth. It existed only as a way to authenticate test accounts, but since sign-up is a public endpoint (Firebase's Identity Toolkit REST API, not just this app's UI), leaving it enabled let anyone self-register and use the Gemini-backed chat with zero friction. Google sign-in still requires clicking through a real Google account, which is a meaningfully higher bar and is what the chatbot's UI offers.

Automated tests do **not** use a sign-up flow at all — see below.

### Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `GOOGLE_GENAI_API_KEY` | Cloud Functions secret | Gemini API key, used server-side only |
| `VITE_USE_EMULATORS` | local dev (set by `scripts/dev.mjs`) | Points the client at the Firebase emulators instead of production |
| `FIREBASE_WEB_API_KEY` | `functions/mint_test_credentials.mjs`, `npm run test:cloud` | Used only to exchange an Admin-SDK-minted custom token for an ID token — not a sign-up credential |
| `FIREBASE_WEB_APP_ID` | `functions/mint_test_credentials.mjs` | Defaults to the app ID already in `src/firebase.js`; override for a different project |
| `BAD_USER_UID`, `GOOD_USER_UID` | `npm run test:cloud` | Arbitrary UIDs for the two test identities (no account creation happens) |
| `CHAT_FUNCTION_URL` | `npm run test:cloud` | Override the deployed chat function URL, e.g. to point at the emulator |

### Test accounts, without a public sign-up surface

`functions/mint_test_credentials.mjs` mints a real Firebase ID token and a real App Check token for an arbitrary test UID, entirely through the Admin SDK (`createCustomToken` + `getAppCheck().createToken()`) — no client-facing sign-up flow is used or needs to exist:

```bash
node functions/mint_test_credentials.mjs test-good-user
```

`npm run test:cloud` uses this to exercise the deployed `chat` function end-to-end (hacking lockout, quota, App-Check rejection) without ever touching a public registration endpoint.

To grant an existing Google-sign-in user the `admin` claim (for the admin dashboard), use `functions/set_username_and_password_with_claims.mjs <email> '{"admin":true}'` — the user must already exist (i.e. have signed in with Google at least once).

## Abuse controls on the chat function

The `chat` Cloud Function (`functions/index.js`) sits in front of a shared, billed Gemini API key, so it layers several protections:

- **Auth required** — only requests with a valid Firebase ID token are accepted.
- **App Check required** — requests must carry a valid `X-Firebase-AppCheck` token from the registered web app, verified by hand via `getAppCheck().verifyToken()` (not the `enforceAppCheck` option — see note above). Blocks scripted/forked-frontend traffic that never goes through the real UI.
- **Google sign-in only** — no public email/password self-registration; a real Google account is required.
- **Daily quota** — 10 messages/user/day (`functions/chatPolicy.js`).
- **Prompt-injection lockout** — messages matching known jailbreak patterns lock the user's chat for 3 days.
- **Message length cap** — 2000 characters.

None of this stops a determined human from signing in with a real Gmail account and using their 10 free messages/day — the daily quota and the billing budget alert are what bound that cost, not App Check or the auth requirement.

## License

MIT — see [LICENSE](LICENSE).
