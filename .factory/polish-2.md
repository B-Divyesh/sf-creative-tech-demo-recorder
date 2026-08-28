# Demo Loop — perfection loop round 2

Released candidate `0a6399d1e45da7803aa5243eb3afd0f3725806d6` was repaired from review commit `3052774fa0983c3175512f4c5b3b16491d65f1fa`. The deployed implementation is commit `850041fdece1eab1726dbe85baf9f0f3027421f7`.

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Reordered `/demo` so its seeded video, caption, 00:09 beat, and export controls precede recording setup and fit inside the first 844px at 390px. `/demo` and `/?demo=1` retain the persistent banner, reset, and real-mode exit. | `demo result and export action are visible in the first viewport` passes in desktop and mobile; `query-string demo entry opens the same isolated sample controls`; [mobile screenshot](evidence/polish-2-live-demo/screenshot-mobile.png); live [query demo](https://creative-tech-demo-recorder.sociobot.in/?demo=1) cold check. |
| F-1-2 | Preserved separate `demo:demo-loop-local` and `demo-loop-local` databases. Reset touches only demo data; Start for real deletes the demo database and retains real recordings. | `@claim:sample-demo-isolated`; post-deploy cold audit seeded a real recording, deleted/reset the sample, exited, and found the real recording intact with the demo database gone. |
| F-1-3 | Retained `.factory/claims.json` with 17 claims and exactly one matching tagged test each. Updated claim wording and proof where round 2 found a mismatch. | Every registry command passed independently after `npm ci` in clean clone `/tmp/demo-loop-polish2-jsQwm6` at `850041f`; 17 passed and 17 intentional mobile-project skips. |
| F-1-4 / previous P1 | Production checkout and verification remain on `https://api.sociobot.in/api/v1`. Checkout now proves the $9 one-time state; return, paste, and revoked-license paths remain tested. | `@claim:live-checkout`, `@claim:paid-unlimited`, `@claim:license-restore`, `@claim:license-revocation`; live checkout returned 303 to `checkout.dodopayments.com` and displayed `$9` plus `One-time unlock`. |
| F-1-5 | Kept the direct first screen: “Record a portfolio interaction demo,” the creative-technology student audience, and the result-explaining sample action. | `home is clear, keyboard reachable, and accessible`; [cold live mobile home](evidence/polish-2-live-home/screenshot-mobile.png); live h1 and action check. |
| F-1-6 | Removed the unproved analytics, advertising, named-browser, unlimited, and broad “core exports” statements. Copy now says “more than three” and names WebM, PNG, and JSON. The free-limit test now downloads and inspects JSON; checkout asserts one-time status. | `.factory/claims.json`; `@claim:local-only-network`, `@claim:free-save-limit`, `@claim:paid-unlimited`, `@claim:live-checkout`; clean-clone execution of all 17 claims. |
| F-1-7 | Retained route-specific titles, descriptions, canonicals, OG/Twitter metadata, physical route entries, history navigation, h1 focus/announcement, designed 404, robots, sitemap, and complete legal links. | `demo and legal routes have their own titles, metadata, focus, and landmarks`; `unknown paths render the designed 404 with recovery links`; post-deploy focus/back audit; robots and sitemap returned 200. |
| F-1-8 / previous P3 | Retained executable response-header CSP, Permissions-Policy, nosniff, referrer policy, frame denial, MIME mappings, and immutable hashed bundle caching. | Cold production response contained all policies; both `verify-url.sh` runs logged zero console errors; app asset is hashed as `app-DGKoHVdr.js`. |
| F-1-9 | Retained `.factory/demo.md` with both entry points, sample inventory, storage namespaces, reset/exit behavior, and verification command. | [.factory/demo.md](demo.md); README links the contract. |
| F-1-10 | Retained direct task language and removed the remaining unsupported/vague compatibility wording. The print-room visual identity is unchanged. | [.factory/copy-audit.md](copy-audit.md); live home and demo screenshots. |
| F-1-11 | Updated the current copy audit, standardized “recording,” “beat,” “poster,” “Loop Pass,” and “demo,” and kept every audited sentence within 22 words. | `.factory/copy-audit.md` has no flags; catalog description is a verb-first 86-character sentence. |
| F-1-12 / previous P2 | Kept the small hashed bundle and measured the new production artifact under a mobile Lighthouse profile. | [live Lighthouse JSON](evidence/lighthouse-polish-2-live.json): Performance 100, Accessibility 100, Best Practices 100, LCP 1.7s, TBT 0ms, CLS 0. |
| F-2-1 | Changed the factory footer link from the invalid `www` host to `https://sociobot.in/`. | `factory footer uses the reachable canonical destination`; post-deploy HTTP check returned 200. |
| F-2-2 | Renamed actions to “Record another interaction,” “Review [recording name],” and “Delete [recording name].” Added explicit ink text color so the new review action is visibly readable. | `demo result and export action are visible in the first viewport` checks the label and contrasting computed colors; [live demo screenshot](evidence/polish-2-live-demo/screenshot-mobile.png). |

## Complete verification

- Exact work-order command `npm ci && npm test && npm run build`: passed; npm found zero vulnerabilities, Vitest passed 2 tests, and Playwright passed 41 tests with 17 intentional cross-project skips.
- Clean clone: each of the 17 `.factory/claims.json` commands passed independently before the final build.
- Build: `dist/index.html` exists; JS is 31.56 KB raw / 11.60 KB gzip and CSS is 22.35 KB raw / 5.72 KB gzip.
- Production accessibility: `@axe-core/cli` reported zero violations on `/`, `/demo`, `/privacy`, `/terms`, and `/404` after waiting for dynamic demo data.
- Production privacy/offline: the full sample export flow requested only the Demo Loop origin; the sample survived a service-worker-controlled offline reload.
- Production structure: `verify-url.sh` found one h1, `lang="en"`, a main landmark, complete image alt text, labelled buttons, and zero console errors on home and `/?demo=1`.
- Deployment: Azure Static Web Apps deployment `3ece3380-d456-4621-9e71-49957b91a827`; custom domain returned HTTPS 200.

No finding remains open.
