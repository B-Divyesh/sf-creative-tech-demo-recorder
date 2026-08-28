# Demo Loop — build handoff

## Shipped

- A finished Vite + TypeScript local-first recorder for the researched job: selected tab/window capture, optional mic mixing, 20/30/45-second limits, keyboard and button controls, one interaction beat, caption, review, WebM export, and generated poster export.
- IndexedDB take shelf with delete confirmation, three free saved slots, unlimited Loop Pass history, complete JSON backup/import, and storage persistence request.
- One-time $9 Loop Pass contract: pilot Sociobot checkout, returned-license capture, local token storage, optimistic cached unlock, at-most-daily verification, invalid/revoked fallback, and paste-to-restore. Core capture, exports, backups, privacy, and accessibility remain free.
- Installable PWA manifest, 192/512/maskable icons, versioned service-worker caches, app-shell precache, cache-first same-origin assets, navigation fallback, offline notice, and update toast.
- Physical `/privacy` and `/terms` static route entries, plus honest local-storage, capture, refund, codec, and non-archival language.
- Product-specific dithered/halftone print system with two self-hosted font files, responsive layout, designed focus states, reduced-motion handling, and an original generated risograph hero. Source, prompt, derivatives, and provenance are recorded in `.factory/design.md` and `assets/src/`.

## Verification

Run from a clean clone:

```sh
npm ci
npm test
npm run build
```

- `npm test`: **12 passed** (2 Vitest unit tests; 10 Playwright tests across desktop Chromium and 390×844 mobile).
- Browser coverage includes: synthetic real `MediaRecorder` capture → mark → finish → local save → export controls; denied permission recovery; keyboard skip link; zero serious/critical axe findings; privacy/terms; service-worker-controlled offline reload.
- `npm run build`: passes TypeScript and emits `dist/index.html`; initial JS **27.82 KB / 10.63 KB gzip**, CSS **17.76 KB / 4.88 KB gzip**, fonts **56 KB total**.
- Original hero derivatives: AVIF **107 KB**, 768px WebP **73 KB**, 1280px WebP **238 KB**; all stay below the 300 KB hero budget.
- Lighthouse 12.8.2, mobile preset against the production preview: **Performance 95, Accessibility 100, Best Practices 100**; LCP **2.1 s**, CLS **0**, TBT **240 ms**.
- Manual visual inspection completed at 1440px and 390px; the generated hero was checked for anatomy, text/brand artifacts, seams, and palette fit.
- No console errors appeared in the clean-load browser test. No runtime CDN, analytics, secrets, direct payment-provider script, or upload path is present.

## Known limits and release notes

- Browser screen-audio availability depends on the chosen share surface and browser. Safari/WebKit WebM behavior remains inconsistent; the UI recommends current Chrome, Edge, or Firefox. Mobile browsers that omit `getDisplayMedia` receive a direct compatibility error.
- Export is a clean WebM plus a separately captioned poster; this is intentionally not a transcoder or archival-quality pipeline.
- Large JSON backups embed video as data URLs and can be memory-heavy. Individual WebM/PNG exports remain the preferred long-term copies.
- The factory still needs to register the test/live paid product and switch `pilot-api.sociobot.in` to the production Sociobot API at release. No product ID is hardcoded.
- Field-testing across physical Windows/macOS microphone + tab-audio combinations is the next useful verification step.
