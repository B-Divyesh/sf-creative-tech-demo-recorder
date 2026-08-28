# Demo Loop — perfection loop round 3

Released candidate `64b35440a1daf3ccf803e8ffe480b904e6e30d0b` was repaired from review commit `fd7c1b43e1ecb8ddc58449f453f0792259e5dd1f`. The deployed implementation is `daf8b0a581b5`.

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the one-click `/demo` and `/?demo=1` entry, then tightened its heading so the seeded video, 00:09 beat, caption, and Export WebM action still fit in the first 390 × 844 viewport after the type-size repair. The banner retains Reset demo and Start for real. | `demo result and export action are visible in the first viewport`; `query-string demo entry opens the same isolated sample controls`; [live mobile demo](evidence/polish-3-live-demo/screenshot-mobile.png); live `/?demo=1` export ends at y=805.9 px. |
| F-1-2 | Preserved separate `demo:demo-loop-local` and `demo-loop-local` databases. Direct demo entry does not open the real database or read license keys; reset and exit discard only demo data. | `@claim:sample-demo-isolated`; [live audit](evidence/polish-3-live-audit.json) records direct-demo databases as only `demo:demo-loop-local`, reset restoration, demo deletion, and real-recording preservation. |
| F-1-3 / F-3-1 | Replaced label-only proof for duration limits with clock-controlled recordings that remain active just before 20, 30, and 45 seconds and stop at each limit. The poster claim now moves the beat to 00:02 and 00:15, decodes both PNGs, checks known source-frame pixels, and observes both printed time strings. | `@claim:capture-length-options`; `@claim:poster-export`; all 17 exact claim commands passed independently in clean clone `/tmp/demo-loop-polish3-final-CxpDia`. |
| F-1-4 / previous P1 | Kept production checkout and verification on `https://api.sociobot.in/api/v1`. The live link returns 303 to Dodo and its page proves `$9` plus `One-time unlock`. | `@claim:live-checkout`; `@claim:license-restore`; [live link crawl](evidence/polish-3-live-links.json). |
| F-1-5 | Rewrote the h1 to “Record a browser interaction for your portfolio” and the audience line to name creative-technology students, the 20–45 second result, and a working prototype. The sample action and its outcome remain adjacent. | `home is clear, keyboard reachable, and accessible`; [cold live mobile home](evidence/polish-3-live-home/screenshot-mobile.png); live h1/action/facts all end above y=709 px. |
| F-1-6 / F-3-2 | Removed merchant-of-record and refund assertions. Checkout copy now states only the tested Sociobot-to-Dodo transition. Privacy copy says the token and latest verification result stay in this browser, and the claim test asserts both exact local keys. | `@claim:license-restore`; `@claim:live-checkout`; live `/privacy` and `/terms`; [live link crawl](evidence/polish-3-live-links.json). |
| F-1-7 / F-3-3 | Removed the catch-all navigation fallback, declared the five known app routes, and left unknown requests to the designed 404 override. Added a 180 × 180 Apple touch icon and route metadata reference. | `unknown paths render the designed 404 with recovery links`; `deployment config routes known pages and leaves unknown paths to the 404 override`; `metadata points to a real 180-pixel Apple touch icon`; live `/missing-polish-3` returned 404; [404 screenshot](evidence/polish-3-live-404.png). |
| F-1-8 / previous P3 | Retained response-header CSP, Permissions-Policy, frame denial, nosniff, and referrer policy. The local integration server now applies the same policy while testing the production bundle. | Both `verify-url.sh` runs report zero console errors; live response-header check; [home verification](evidence/polish-3-live-home/verify.json). |
| F-1-9 | Retained `.factory/demo.md` with both URLs, sample inventory, separate database names, reset/exit behavior, and the isolation claim command. | [.factory/demo.md](demo.md); `@claim:sample-demo-isolated`; live direct-demo audit. |
| F-1-10 | Kept recording, beat, poster, and demo terminology. Replaced the remaining 404 metaphor with literal “ERROR 404.” | [.factory/copy-audit.md](copy-audit.md); [live 404](evidence/polish-3-live-404.png). |
| F-1-11 | Replaced README’s “storage namespace” jargon with “browser workspace you opened,” updated the first-screen wording, and kept every audited sentence within 22 words. | [.factory/copy-audit.md](copy-audit.md); README privacy section; catalog description is a verb-first 89 characters excluding its newline. |
| F-1-12 / previous P2 | Preserved the small bundle after the readability and routing work. | [live Lighthouse](evidence/lighthouse-polish-3-live.json): Performance 99, Accessibility 100, Best Practices 100, SEO 100, LCP 1.7 s, TBT 110 ms, CLS 0. Built JS 31.55 KB raw / 11.56 KB gzip; CSS 22.89 KB raw / 5.78 KB gzip. |
| F-2-1 | Retained the valid `https://sociobot.in/` factory destination and limited the external reachability check to one browser project to avoid duplicate network races. | `factory footer uses the reachable canonical destination`; [live link crawl](evidence/polish-3-live-links.json) records HTTP 200. |
| F-2-2 | Retained “Record another interaction,” recording-specific Review, and recording-specific Delete actions. | `demo result and export action are visible in the first viewport`; [live mobile demo](evidence/polish-3-live-demo/screenshot-mobile.png). |
| F-3-4 | Gave header, footer, inline legal, empty-state, button, range, and other effective touch targets at least 44 × 44 CSS pixels. | `mobile routes keep every visible control at least 44 pixels`; [live audit](evidence/polish-3-live-audit.json) reports no failures across `/`, `/demo`, `/privacy`, `/terms`, or `/404`. |
| F-3-5 | Raised every informational and interactive text style to at least 16px. Documented 12–14px exceptions only for decorative print labels and keycap hints. | `essential helper and status copy stays at 16 pixels or larger`; [.factory/design.md](design.md); [live mobile home](evidence/polish-3-live-home/screenshot-mobile.png). |
| F-3-6 | Replaced “404 / MISSED FRAME” with literal “ERROR 404.” | `unknown paths render the designed 404 with recovery links`; [live 404](evidence/polish-3-live-404.png). |
| F-3-7 | Rewrote README privacy text to “Recordings, captions, posters, and beat markers stay in the browser workspace you opened.” | README privacy section; [.factory/copy-audit.md](copy-audit.md). |

## Final verification

- Clean clone `/tmp/demo-loop-polish3-final-CxpDia` at `daf8b0a581b5`: `npm ci` reported zero vulnerabilities; all 17 claim commands passed independently.
- In the same clean clone, `npm test` passed 2 unit and 46 browser tests with 20 intentional cross-project skips; `npm run build` produced `dist/`.
- Exact work-order command `npm ci && npm test && npm run build` passed again before deployment.
- Azure Static Web Apps production deployment: `e3e9b3dc-132f-4589-8726-2eaaa23111ee`.
- Live Playwright Axe scans returned zero violations on `/`, `/demo`, `/privacy`, `/terms`, and `/404`.
- Live sample WebM/PNG export, reset, real-data preservation, direct-demo isolation, same-origin request log, offline reload, focus restoration, 44px targets, metadata, asset dimensions, link crawl, and real 404 status all passed.

No finding remains open.
