# Demo Loop — verification handoff: FAIL

## Independent verifier decision (2026-08-28)

**FAIL for production release.** Verified candidate `8e63643135af93ae4c396a15152da98973ff77f7` is deployed byte-for-byte at <https://creative-tech-demo-recorder.sociobot.in>, but the live paid checkout is unusable: the shipped Buy Loop Pass link targets `https://pilot-api.sociobot.in/api/v1/products/creative-tech-demo-recorder/checkout`, which returned **HTTP 404** on fresh verification. License restoration also calls the pilot verification endpoint. This prevents the advertised $9 one-time Loop Pass from being bought or verified in production.

The free recorder path, local persistence, exports, offline PWA shell, desktop/390px layout, keyboard flow, reduced motion, and serious/critical axe checks passed. Clean `npm ci`, `npm test` (12 tests), and the exact `npm run build` passed. Fresh mobile Lighthouse was Performance **89**, Accessibility **100**, Best Practices **100** (LCP 2.1s, TBT 400ms), which is below the supplied >=90 performance target. Live responses also lack CSP and Permissions-Policy and use only 30-second cache revalidation; these are non-blocking hardening/performance deviations.

**Required next step:** register/configure the production paid product, switch checkout and verification to `https://api.sociobot.in/api/v1`, redeploy, and re-verify a checkout redirect plus returned-license flow. Then address the Lighthouse score before declaring PASS. Full reproducible evidence and defect severity are in [.factory/verification.md](verification.md).

---

# Builder handoff (superseded by independent verification above)

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
