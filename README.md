# Healthopedia

Free-access, static educational herbal reference by NDN Analytics. No accounts, payments, dispensing, medical diagnosis or prescribing features.

## Run locally

From this directory, run `python -m http.server 4173 --bind 127.0.0.1 --directory dist`, then open http://127.0.0.1:4173. You can also open `dist/index.html` directly, although browser local-storage behaviour may differ for local files.

## Features

- 28 WHO monograph summaries, indexed by condition or traditional indication, with 14 preparation guides and 14 reference-only entries.
- All 3,000 numbered entries from the supplied remedy index, grouped into 601 unique herb/ailment source claims for fast browsing and search.
- Search across plant names, ingredients, traditional indications and patient-style ailment terms such as diarrhea, period pain, UTI, ED, fertility, pink eye, piles and worms; topic and entry-type filters.
- Device-local saved collection, resilient to unavailable or malformed local storage.
- Ingredient roles, evidence limitations, specific safety cautions and source page references.
- Keyboard-accessible native dialogs, mobile layout and print/save-to-PDF sheets.
- Three source assessments explaining review coverage and excluded instructions.

## Content boundary

This is an editorial educational prototype, not independently clinically reviewed. Traditional use is not proof of clinical benefit. Preparation methods are not administration instructions; batch weights are not doses. High-risk applications and unsupported cancer or pediatric protocols are not reproduced. See `sources/README.md` for provenance and limitations.

Raw PDFs are deliberately excluded from Git and the distributable. Only original summaries are included in `dist`. No external scripts, fonts or analytics are loaded. External references open only when clicked.

## Verify

Run `node scripts/verify.mjs` for data-integrity and safety-boundary checks, and `node scripts/verify-storage.mjs` for malformed/blocked-storage plus ailment-synonym regression checks. Syntax checks: `node --check dist/app.js` and `node --check dist/data.js`.

Browser checks completed: combined search/topic/type filters, empty results, saving in a detail dialog, reload persistence, removal from a filtered collection, About and source views, Escape-to-close, reference-only Datura without recipe steps, and home navigation. Layouts were inspected at 1365px and 390px viewport widths; neither produced horizontal overflow, including the mobile detail dialog. No browser console errors or warnings were observed. Print styling is implemented; native printer/PDF output was not end-to-end verified.

## Hosting

Firebase project: `healthopedia-eb29f`. Web app: `1:752701892749:web:4ae441c35e04fecd4b5ac4`.

Firebase Hosting serves `dist` at https://healthopedia-eb29f.web.app (also https://healthopedia-eb29f.firebaseapp.com). GitHub Pages remains a separate deployment at https://dnkefua.github.io/healthopedia/.

The modular Firebase SDK is bundled locally into `dist/firebase.js`; the browser does not load a remote SDK. Its public app configuration is in `src/firebase-config.js`. Firebase initialization is independent of library rendering, so the library and local collections continue working if initialization fails. No Analytics, Authentication, Firestore, Storage uploads or cloud collection syncing is enabled by this setup. The SDK app container is available as `window.healthopediaFirebase.app` for future integrations. Its initialized project and status are also exposed as `data-firebase-project` and `data-firebase-status` on the HTML element for diagnostics.

To rebuild and publish (with Node.js and the Firebase CLI installed):

```sh
npm ci
npm run build
npm test
firebase login
firebase deploy --only hosting --project healthopedia-eb29f
```

On Windows PowerShell with restricted script execution, use `npm.cmd` and `firebase.cmd`. `npm run deploy:firebase` combines the build, checks and Hosting deployment. The hosting-only deployment does not change database rules, authentication providers, billing or other Firebase services. `.firebaserc` selects the project and `firebase.json` explicitly selects its Hosting site. The historical `.openai/hosting.json` is retained but is not used for Firebase deployment.

Never commit Firebase CLI login tokens, service-account private keys or Admin SDK credentials. Firebase browser configuration is public by design; any future database access must be protected by authentication and server-enforced security rules.
