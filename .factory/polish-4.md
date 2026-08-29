# Demo Loop — perfection loop round 4

Released candidate `eb151c8907891f2dc4b3625e35850536433fb7b0` was repaired from review commit `ac51bc27dabfabbafdb167040e21d9aabb2f5ec8`. The implementation repair is `95e5fe866c66d125402bda1552e82133e9f5ea3d`.

## Finding map

| Finding | Change made or retained | Evidence |
| --- | --- | --- |
| F-1-1 | Retained the first-screen “Try it with sample data” action. `/demo` and `/?demo=1` immediately show the seeded video, 00:09 beat, caption, exports, banner, reset, and real-mode exit. | `demo result and export action are visible in the first viewport`; `query-string demo entry opens the same isolated sample controls`; `@claim:sample-demo-isolated`; [live mobile demo](evidence/polish-4-live-demo/screenshot-mobile.png); [live audit](evidence/polish-4-live-audit.json). |
| F-1-2 | Retained separate `demo:demo-loop-local` and `demo-loop-local` databases. Direct demo entry does not read license keys. Reset and exit remove only demo data. | `@claim:sample-demo-isolated`; live audit checks direct-demo databases, license reads, reset, demo deletion, and private-recording preservation. |
| F-1-3 | Retained `.factory/claims.json` with 17 claims and exactly one tagged observable test per claim. | Every exact registry command passed independently in clean clone `/tmp/demo-loop-polish4-final-J9MC1C/repo`; `npm test` passed. |
| F-1-4 | Retained the production Sociobot checkout and verification origin. | `@claim:live-checkout`, `@claim:license-restore`, and `@claim:license-revocation`; live audit confirms the checkout returns 303 to Dodo. |
| F-1-5 | Retained direct first-screen wording that names the job, audience, duration, action, and result. | `home is clear, keyboard reachable, and accessible`; live audit checks all required lines inside the 390 × 844 first viewport; [mobile home](evidence/polish-4-live-home/screenshot-mobile.png). |
| F-1-6 | Retained exact claim-backed privacy, export, free-limit, paid-limit, and checkout wording without broad analytics, compatibility, unlimited, merchant, or refund promises. | `.factory/claims.json`; 17/17 independent claim commands; `.factory/copy-audit.md`. |
| F-1-7 | Retained route-specific titles, descriptions, canonicals, social metadata, real known-route rewrites, h1 focus, announcements, legal links, sitemap, robots, and designed 404. | `demo and legal routes have their own titles, metadata, focus, and landmarks`; `unknown paths render the designed 404 with recovery links`; live audit checks all five routes, Back focus, and `/missing-polish-4` HTTP 404. |
| F-1-8 | Retained response-header CSP, Permissions-Policy, nosniff, referrer policy, and frame denial. | `deployment config routes known pages and leaves unknown paths to the 404 override`; live audit checks all five headers; both `verify-url.sh` reports contain zero console errors. |
| F-1-9 | Retained `.factory/demo.md` with entry URLs, sample inventory, database names, reset, exit, and verification command. | `.factory/demo.md`; `@claim:sample-demo-isolated`. |
| F-1-10 | Retained task-first headings, result-naming actions, and consistent recording, beat, poster, Loop Pass, and demo terms. | `.factory/copy-audit.md`; cold live home and demo screenshots. |
| F-1-11 | Retained sentences at 22 words or fewer and one term per concept. Round 4 also replaces the last README storage jargon. | `.factory/copy-audit.md`; `visitor documentation describes recording storage in plain browser language`. |
| F-1-12 | Retained the small production bundle and remeasured the deployed site under mobile Lighthouse. | [Lighthouse JSON](evidence/lighthouse-polish-4-live.json): Performance 99, Accessibility 100, Best Practices 100, SEO 100, LCP 1.7 s, TBT 20 ms, CLS 0. JS 31.55 kB raw / 11.56 kB gzip; CSS 22.89 kB raw / 5.78 kB gzip. |
| F-2-1 | Retained the certificate-valid factory link at `https://sociobot.in/`. | `factory footer uses the reachable canonical destination`; live audit receives HTTP 200. |
| F-2-2 | Retained result-naming actions: “Record another interaction,” recording-specific Review, and recording-specific Delete. | `demo result and export action are visible in the first viewport`; [live demo](evidence/polish-4-live-demo/screenshot-mobile.png). |
| F-3-1 | Retained outcome tests that advance the capture clock through 20, 30, and 45 seconds and compare poster pixels and printed times at 00:02 and 00:15. | `@claim:capture-length-options`; `@claim:poster-export`; both passed independently in the clean clone. |
| F-3-2 | Retained narrowed payment copy and exact local token plus verdict wording. Merchant-of-record and refund assertions remain removed. | `@claim:license-restore`; `@claim:live-checkout`; live `/privacy` and `/terms` Axe/route checks. |
| F-3-3 | Retained explicit known routes, a real 404 response, the designed recovery page, and a 180 × 180 Apple touch icon. | `unknown paths render the designed 404 with recovery links`; `metadata points to a real 180-pixel Apple touch icon`; live audit receives HTTP 404. |
| F-3-4 | Retained at least 44 × 44 CSS-pixel effective targets on all mobile routes. | `mobile routes keep every visible control at least 44 pixels`; repeated live for `/`, `/demo`, `/privacy`, `/terms`, and `/404`. |
| F-3-5 | Retained informational and interactive text at 16 px or larger, with only documented decorative print-label exceptions. | `essential helper and status copy stays at 16 pixels or larger`; `.factory/design.md`; mobile screenshots. |
| F-3-6 | Retained the literal “ERROR 404” label. | `unknown paths render the designed 404 with recovery links`; live `/missing-polish-4` check. |
| F-3-7 | Retained “browser workspace you opened” in README privacy copy. | `visitor documentation describes recording storage in plain browser language`; `.factory/copy-audit.md`. |
| F-4-1 | Replaced both README `IndexedDB` phrases with “browser storage” and “store recordings separately in your browser.” Added a regression test that rejects `IndexedDB` anywhere in README. | `visitor documentation describes recording storage in plain browser language`; `npm test`; README source review. |

## Verification and release evidence

- Clean clone `/tmp/demo-loop-polish4-final-J9MC1C/repo` at `95e5fe866c66d125402bda1552e82133e9f5ea3d`: `npm ci` reported zero vulnerabilities; every one of the 17 exact claim commands passed independently.
- The same clean clone passed `npm test`: 3 unit tests and 46 browser tests, with 20 intentional cross-project skips. `npm run build` produced `dist/`.
- The exact work-order command `npm ci && npm test && npm run build` passed again before deployment.
- The final documented tree passed 4 unit tests, 46 browser tests, and `npm run build` after the catalog guard and evidence were added.
- Azure Static Web Apps production deployment: `cb8424e3-8bb4-4625-8486-3705793330ef`.
- `verify-url.sh` passed on `/` and `/?demo=1`; [home evidence](evidence/polish-4-live-home/verify.json) and [demo evidence](evidence/polish-4-live-demo/verify.json) report zero console errors.
- The post-deploy audit used new browser contexts and passed 11 grouped checks covering all prior review findings. It exported the sample files, observed only the product origin, reset and exited demo mode, preserved seeded real data, reloaded offline, crawled routes and links, and checked security headers.

No finding remains open.
