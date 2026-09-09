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

1. Create a Firebase project with Firestore, Authentication (Email/Password + Google sign-in), and Cloud Functions (Blaze plan — required for outbound network calls from Functions).
2. Update `.firebaserc` and the `firebaseConfig` object in `src/firebase.js` with your project's values (the web config is a public identifier, not a secret).
3. Set the Gemini API key as a Cloud Functions secret (never commit it):
   ```bash
   firebase functions:secrets:set GOOGLE_GENAI_API_KEY
   ```
4. Set up [Firebase App Check](https://firebase.google.com/docs/app-check) with reCAPTCHA Enterprise for your web app, and update the `RECAPTCHA_SITE_KEY` in `src/firebase.js`. This is what stops someone else's frontend from hammering your Gemini quota — see `functions/index.js`'s `enforceAppCheck: true`.
5. Deploy Firestore rules (`firestore.rules`) — they default-deny everything except a user's own `users/{uid}` document, chat log, and lock records.
6. **Set a GCP billing budget alert** on your project before enabling public traffic (Billing → Budgets & alerts in the Google Cloud Console). Gemini and Firestore usage is pay-as-you-go.

### Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `GOOGLE_GENAI_API_KEY` | Cloud Functions secret | Gemini API key, used server-side only |
| `VITE_USE_EMULATORS` | local dev (set by `scripts/dev.mjs`) | Points the client at the Firebase emulators instead of production |
| `FIREBASE_USER_PASSWORD` | one-off script | Used by `functions/set_username_and_password_with_claims.mjs` to create/update a test user |
| `FIREBASE_TEST_PASSWORD`, `FIREBASE_WEB_API_KEY`, `CHAT_FUNCTION_URL`, `GOOD_USER_EMAIL`, `BAD_USER_EMAIL` | `npm run test:cloud` | Credentials/config for the live end-to-end chat test — never commit real values |

## Abuse controls on the chat function

The `chat` Cloud Function (`functions/index.js`) sits in front of a shared, billed Gemini API key, so it layers several protections:

- **Auth required** — only requests with a valid Firebase ID token are accepted.
- **App Check required** (`enforceAppCheck: true`) — requests must come from the registered web app, not an arbitrary script or forked frontend.
- **Daily quota** — 10 messages/user/day (`functions/chatPolicy.js`).
- **Prompt-injection lockout** — messages matching known jailbreak patterns lock the user's chat for 3 days.
- **Message length cap** — 2000 characters.

## License

MIT — see [LICENSE](LICENSE).
