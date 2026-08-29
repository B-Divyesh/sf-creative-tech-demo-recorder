# Demo Loop handoff — perfection loop round 4

## Outcome

All findings from reviews 1–4 are closed. Round 4 replaces the final two README implementation terms with plain browser-storage wording and adds a regression test. The released PWA keeps its existing recording, sample-demo, export, offline, payment, routing, mobile, accessibility, privacy, and risograph behavior.

- Implementation repair: `95e5fe866c66d125402bda1552e82133e9f5ea3d`
- Production: <https://creative-tech-demo-recorder.sociobot.in>
- Sample: <https://creative-tech-demo-recorder.sociobot.in/?demo=1>
- Deployment: `cb8424e3-8bb4-4625-8486-3705793330ef`

## Changes

- Replaced README’s two `IndexedDB` phrases with “browser storage” and separate-workspace wording.
- Added `src/docs.test.ts` checks for the README wording and the verb-first, 120-character catalog limit.
- Updated `.factory/catalog-description.txt` to a 93-character verb-first sentence.
- Updated `.factory/copy-audit.md` and added the complete finding-to-evidence map in `.factory/polish-4.md`.
- Added `tools/audit-live.mjs`, a repeatable production audit for routes, focus, metadata, Axe, touch targets, demo isolation, exports, privacy, offline use, links, checkout, headers, and console errors.

## Clean-clone verification

- Clone: `/tmp/demo-loop-polish4-final-J9MC1C/repo`
- Commit: `95e5fe866c66d125402bda1552e82133e9f5ea3d`

```sh
npm ci
# Each exact `test` command in .factory/claims.json was then run separately.
npm test
npm run build
```

Results:

- `npm ci`: 138 packages, zero vulnerabilities.
- Claims: 17/17 independent commands passed.
- Unit: 3 passed in the clean clone; the final catalog guard also passed before handoff.
- Browser/integration: 46 passed; 20 intentional mobile-project skips.
- Build: `dist/index.html` produced.
- JS: 31.55 kB raw / 11.56 kB gzip.
- CSS: 22.89 kB raw / 5.78 kB gzip.
- The exact work-order command `npm ci && npm test && npm run build` passed again in `/work/repo` before deployment.
- After the evidence files and catalog guard were added, the final tree passed 4 unit tests, 46 browser tests, and `npm run build` again.

## Post-deploy verification

```sh
/opt/fleet/lib/verify-url.sh https://creative-tech-demo-recorder.sociobot.in/ .factory/evidence/polish-4-live-home
/opt/fleet/lib/verify-url.sh 'https://creative-tech-demo-recorder.sociobot.in/?demo=1' .factory/evidence/polish-4-live-demo
node tools/audit-live.mjs https://creative-tech-demo-recorder.sociobot.in .factory/evidence/polish-4-live-audit.json
```

- Cold home and demo loads returned HTTPS 200 with the correct titles, `lang="en"`, one h1, one main, complete image alt text, labeled buttons, and zero console errors.
- `/missing-polish-4` returned HTTP 404 and the designed recovery page.
- `/`, `/demo`, `/privacy`, `/terms`, and `/404` had route-specific metadata and zero serious or critical Axe findings.
- Privacy navigation and browser Back moved focus to the replacement h1.
- Every visible mobile control on those routes had an effective target of at least 44 × 44 CSS pixels; no route overflowed at 390 px.
- Direct `/?demo=1` created only `demo:demo-loop-local`, read no license key, and showed the video plus Export WebM inside 844 px.
- WebM and PNG downloads worked. The full sample flow requested only `https://creative-tech-demo-recorder.sociobot.in`.
- Reset restored the bundled caption. Start for real deleted demo storage and preserved a seeded real recording.
- A service-worker-controlled reload kept the sample available offline and showed the Offline notice.
- Internal pages, robots, sitemap, manifest, social card, Apple icon, factory link, and live Sociobot-to-Dodo checkout redirect responded correctly.
- Response headers included CSP, Permissions-Policy, nosniff, referrer policy, and frame denial.

Evidence: [live audit](evidence/polish-4-live-audit.json), [home verify](evidence/polish-4-live-home/verify.json), [demo verify](evidence/polish-4-live-demo/verify.json), [home mobile](evidence/polish-4-live-home/screenshot-mobile.png), and [demo mobile](evidence/polish-4-live-demo/screenshot-mobile.png).

Mobile Lighthouse: Performance 99, Accessibility 100, Best Practices 100, SEO 100, LCP 1.7 s, TBT 20 ms, CLS 0. Evidence: [lighthouse-polish-4-live.json](evidence/lighthouse-polish-4-live.json).

## Run and deploy

```sh
npm ci
npm test
npm run build
/opt/fleet/lib/deploy-static.sh creative-tech-demo-recorder dist
```

Deploy the generated `dist/` directory without modification.

## Known gaps

None.
