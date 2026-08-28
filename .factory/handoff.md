# Demo Loop handoff — perfection loop round 2

## Outcome

All findings in `.factory/review-1.md`, `.factory/review-2.md`, and the prior verification/polish record are resolved. Demo Loop remains a static, offline-capable PWA with its original risograph print-room visual system.

The deployed application is <https://creative-tech-demo-recorder.sociobot.in>. The deployed implementation commit is `850041fdece1eab1726dbe85baf9f0f3027421f7`; Azure deployment ID is `3ece3380-d456-4621-9e71-49957b91a827`.

## What changed

- Put the finished sample video, caption, 00:09 beat, and exports in the first `/demo` viewport on desktop and 390×844 mobile.
- Kept `/demo` and `/?demo=1` isolated in `demo:demo-loop-local`, with persistent Reset demo and Start for real controls.
- Narrowed every disputed privacy, entitlement, compatibility, and export statement to match observable tests.
- Extended the free-plan claim test to download and inspect its JSON backup and the checkout test to assert one-time purchase copy.
- Replaced the dead factory footer URL and named recording actions by their result.
- Fixed the review action’s foreground color after visual inspection found light text on a light button.
- Updated the manifest/service-worker version, catalog description, copy audit, screenshots, and cumulative finding map.

## Verification evidence

### Clean clone and claims

At `/tmp/demo-loop-polish2-jsQwm6`, cloned from implementation commit `850041f`:

- `npm ci`: 138 packages installed, zero vulnerabilities.
- All 17 exact commands in `.factory/claims.json`: passed independently; each ran its tagged desktop claim once with one intentional mobile-project skip.
- `npm run build`: passed and produced `dist/index.html`.

### Full local gate

The exact work-order command passed:

```sh
npm ci && npm test && npm run build
```

- Vitest: 2 passed.
- Playwright: 41 passed, 17 intentional claim skips in the duplicate mobile project.
- Axe integration: no serious or critical findings on `/`, `/demo`, `/privacy`, `/terms`, or `/404`.
- TypeScript/build: passed.
- Output: JS 31.56 KB raw / 11.60 KB gzip; CSS 22.35 KB raw / 5.72 KB gzip.
- Fonts: 56.05 KB total; mobile hero WebP: 73.89 KB.

### Performance

- Local mobile Lighthouse: Performance 99, Accessibility 100, Best Practices 100; LCP 2.1s, TBT 10ms, CLS 0.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100; FCP 0.9s, LCP 1.7s, TBT 0ms, CLS 0.
- Reports: [.factory/evidence/lighthouse-polish-2-home.json](evidence/lighthouse-polish-2-home.json) and [.factory/evidence/lighthouse-polish-2-live.json](evidence/lighthouse-polish-2-live.json).

### Cold production audit

- `verify-url.sh` passed for `/` and `/?demo=1`: HTTPS 200, one h1, `lang="en"`, main landmark, no missing alt text, no unnamed buttons, and zero console errors.
- `@axe-core/cli` 4.13.0 found zero violations on all five routes: `/`, `/demo`, `/privacy`, `/terms`, and `/404`.
- At 390×844, the sample video and Export WebM control both ended inside the first viewport. The caption and `BEAT — 00:09` were visible.
- A real IndexedDB recording survived demo deletion and Reset demo. Start for real removed only `demo:demo-loop-local`.
- WebM and PNG sample exports triggered downloads; every observed request stayed on `https://creative-tech-demo-recorder.sociobot.in`.
- A service-worker-controlled `/?demo=1` reload retained the complete sample after the browser went offline.
- Privacy navigation and browser Back moved focus to the new h1. An unknown route rendered the designed Page not found screen.
- CSP, Permissions-Policy, nosniff, and referrer-policy headers were present. `robots.txt`, `sitemap.xml`, and `https://sociobot.in/` returned 200.
- Screenshots and verifier output: [live home](evidence/polish-2-live-home/screenshot-mobile.png), [live demo](evidence/polish-2-live-demo/screenshot-mobile.png), [home report](evidence/polish-2-live-home/verify.json), and [demo report](evidence/polish-2-live-demo/verify.json).

## Run and verify

```sh
npm ci
npm test
npm run build
```

To rerun a claim, copy its exact `test` command from `.factory/claims.json`. The deployable site is `dist/`.

## Known gaps and next steps

No review finding or release gap is open. Browser-provided screen audio and codec availability still vary by browser and capture surface; the product states this as a limitation rather than promising unsupported compatibility.
