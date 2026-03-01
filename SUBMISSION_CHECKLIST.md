# PetLog — Submission Checklist

## Build
- [x] Vite build passes (`npm run build` — 0 errors)
- [x] AAB generated (`android/app/build/outputs/bundle/release/app-release.aab`)
- [x] Capacitor synced with Android platform

## A1 — Self QA
- [x] Error boundary wraps entire app
- [x] aria-labels on all interactive elements (12+ files)
- [x] Zero console.log statements in production code
- [x] Zero hardcoded API keys or secrets
- [x] Onboarding flow implemented (3 screens, skippable)
- [x] Premium gates enforced (2 pet limit, photo journal, auto-repeat reminders)
- [x] 44px+ tap targets on all interactive elements
- [x] Dark mode with system detection

## A3 — Code Audit
- [x] **Security:** All data stored locally via IndexedDB (Dexie). No network calls. No external APIs. No credentials stored.
- [x] **Data integrity:** Dexie transactions for all writes. Pet deletion cascades to activities, vet visits, and reminders.
- [x] **Performance:** Lazy queries with `useLiveQuery`. Activities limited to 50/100 per view. No unnecessary re-renders.
- [x] **Premium gates:** `canAddPet()` checks pet count vs limit. Photo journal locked behind premium check. Auto-repeat reminders gated. Premium banner shown at 2 pets.
- [x] **Input validation:** Name required for pet creation. Date required for vet visits and reminders. Max length on text inputs.
- [x] **Accessibility:** aria-labels, aria-required, role attributes, prefers-reduced-motion support, color independence (icons + text + color for status).

## A4 — Submission Prep
- [x] STORE_LISTING.md — complete with title, descriptions, keywords, screenshots list
- [x] PRIVACY_POLICY.md — complete, covers local-only data storage
- [x] SUBMISSION_CHECKLIST.md — this file
- [x] AAB built with `JAVA_HOME=/opt/homebrew/opt/openjdk@21`
- [x] App version: 1.0.0
- [x] Package: com.loopspur.petlog

## Remaining for Scott
- [ ] Generate app screenshots (8 required per DESIGN_SPEC)
- [ ] Upload AAB to Google Play Console
- [ ] Set up RevenueCat for real premium IAP ($2.99)
- [ ] Apple Developer Account for iOS build
