## Purpose
Help AI coding agents quickly become productive in this repository by describing the app architecture, developer workflows, project conventions, integration points, and concrete file examples.

## Big picture
- Single-repo static web app (no build step): frontend-only code served as ES modules. Serve with a local HTTP server (Live Server, `npx serve .`, or `python -m http.server`). See `README.md`.
- Two main UX surfaces: the POS client (`index.html` + `app.js`) and the Admin dashboard (`manage.html` + `admin.js`). Shared data layer is `data.js` which talks to Firestore.
- Auth and persistence: authentication + Firestore are provided by Firebase via `firebase-config.js`. The app expects a Firebase project configured in that file.

## Key files and responsibilities (quick map)
- `index.html` / `app.js`: POS UI and cart flow; calls `window.DataManager.getMenu()`, `app.addToCart()`, `app.initiatePayment()`.
- `manage.html` / `admin.js`: Admin UI for CRUD on menu and sales reporting; uses `admin.saveItem()`, `admin.downloadCSV()` and `admin.switchTab()`.
- `data.js`: Single source of truth for data — `DataManager.init()`, `getMenu()`, `addMenuItem()`, `updateMenuItem()`, `deleteMenuItem()`, `saveOrder()`, `subscribeOrders()` and `formatCurrency()`.
- `firebase-config.js`: Firebase SDK imports from CDN and exports `auth`, `db` and helper functions used across the app.

## Important runtime patterns & conventions
- ES module usage: scripts are loaded with `type="module"`. Keep `import` syntax and `type="module"` when editing or adding scripts.
- Global singletons: modules expose objects on `window` for simplicity: `window.DataManager`, `window.app`, `window.admin`. Use these when linking UI handlers (many HTML onclicks call global functions).
- Auth gating: `onAuthStateChanged(auth, ..)` is used to redirect unauthenticated users to `login.html`. Data initialization is deferred until the user is confirmed.
- Real-time updates: `data.js` uses Firestore `onSnapshot` for menu and orders. UI re-renders are triggered from these listeners (see `DataManager.init()` and its onSnapshot callbacks).
- Seeding: `data.js` attempts to seed a `DEFAULT_MENU_SEED` if the `menu` collection is empty. This may silently fail if Firestore rules block writes — check rules during debugging.

## Developer workflows (how to run & debug)
- Local server (required because of ES modules):
  - VS Code Live Server: right-click `login.html` -> Open with Live Server
  - Node: `npx serve .`
  - Python: `python -m http.server`
- Debugging tips:
  - Open browser DevTools console for runtime logs and Firestore errors (the app logs `DataManager` and auth events).
  - If menu is empty, check Firestore rules and the `DEFAULT_MENU_SEED` logic in `data.js`.
  - Network/console errors often point to missing Firebase credentials in `firebase-config.js` or blocked CDN imports.

## Editing guidance (what to preserve/change carefully)
- Keep `type="module"` on `<script>` tags in HTML when adding or refactoring modules.
- If refactoring `DataManager`, preserve the public API used by UI: `init()`, `getMenu()`, `addMenuItem()`, `updateMenuItem()`, `deleteMenuItem()`, `saveOrder()`, `subscribeOrders()`, `formatCurrency()`.
- Many HTML elements depend on global `window.app` / `window.admin` handlers (onclick attributes). If moving to event listeners, update the HTML accordingly.
- `firebase-config.js` currently imports Firebase from CDN (no bundler). If switching to a bundler, ensure you update all import paths and `type="module"` handling.

## Security & secrets
- `firebase-config.js` contains client-side Firebase config (normal for web apps). Do NOT store server secrets or service account keys in this repo.
- Firestore rules may prevent writes (affecting seeding and admin actions); mention this in PR descriptions when changing data-write logic.

## Concrete examples to reference
- Data flow: `index.html` -> `app.js` (calls) -> `window.DataManager.getMenu()` -> `data.js` (onSnapshot of `menu` collection).
- Admin flow: `manage.html` -> `admin.js` -> `DataManager.addMenuItem()` / `updateMenuItem()` -> Firestore.
- Auth flow: `login.html` uses `signInWithEmailAndPassword` from `firebase-config.js` and relies on `onAuthStateChanged` redirect.

## What to avoid / common pitfalls
- Don’t open HTML files directly (file://). ES modules require an HTTP server.
- Don’t remove `window` exposures without updating HTML `onclick` handlers.
- Remember seeding may be permission-sensitive; code assumes permissive writes during local testing.

If anything here is unclear or you want emphasis on a different area (tests, CI, or migration to bundler), tell me which section and I will refine the instructions.
