# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Public repo — no secrets

This repository is public. Never commit API keys, service account credentials, `.env` files, or other secrets. The Firebase web config in `src/firebase.js` and the reCAPTCHA Enterprise site key are public client-side identifiers by design, not secrets — but the Gemini API key must stay a Cloud Functions secret (`GOOGLE_GENAI_API_KEY`), never hardcoded or logged.

## Project

React + Vite dashboard comparing Israeli education outcomes (PISA, TIMSS, Meitzav) to OECD benchmarks, with a Firebase Auth-gated Gemini chatbot. See `README.md` for setup and the abuse controls on the `chat` Cloud Function.
