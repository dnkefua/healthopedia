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

The existing Sites project is recorded in `.openai/hosting.json`. The current connector reports `Sites project not found` for that exact ID, so this revision has not been published. Do not replace the project ID or claim a live URL without reconnecting the existing project and confirming a successful deployment. The self-contained distributable is the `dist` directory.
