# Demo Loop handoff — perfection loop round 4 retry

## Outcome

All findings from reviews 1–4 are closed on the deployed PWA. The retry keeps the required plain-language README text, removes the fixed-port build failure, strengthens direct query-demo isolation proof, and prevents unverified returned licenses from enabling paid features.

- Repair commits: `b14b70a`, `94e915a`
- Production: <https://creative-tech-demo-recorder.sociobot.in>
- Sample: <https://creative-tech-demo-recorder.sociobot.in/?demo=1>
- Deployment: `035f8898-0c92-4faa-b2ed-f198d0b7c5a0`
- Product build: 1.3.1

## What changed

- Browser tests now allocate a free local port for every run and refuse to reuse stale servers.
- The exact factory command no longer fails when another preview occupies port 4173.
- The direct `/?demo=1` claim test now proves only demo storage opens, no license key is read, and real data survives reset and exit.
- Returned license tokens stay locked until the production Sociobot verification call succeeds.
- A regression test keeps every registered claim paired with exactly one independently runnable `@claim:` test.
- A mobile test keeps the job, audience, sample action, result, and three facts inside the first 390 × 844 viewport.
- The catalog description is now: “Record a browser interaction, mark its response, and export a portfolio video and poster.”
- The README retains “browser storage” and “store recordings separately in your browser”; `IndexedDB` remains absent from visitor README copy.
- The service-worker cache and visible build number advanced to 1.3.1 without changing the risograph visual system.

## Build-failure reproduction and repair

At base `58511a7`, starting `npm run preview:test` and then running the work-order command reproduced the controller failure:

```text
Error: http://127.0.0.1:4173 is already used, make sure that nothing is running on the port/url
```

The root cause was Playwright’s fixed test port with `reuseExistingServer: false`. Reusing the port would risk testing stale output. `tools/run-e2e.mjs` now allocates a free port and passes it to the test server and Playwright configuration. The full suite passed while a separate server deliberately remained on 4173.

## Clean-clone verification

Clean clone: `/tmp/demo-loop-polish4-retry-claims-2DQOVh/repo` at `94e915a3360f37c94ef80def89e0389f65904fbc`.

- `npm ci`: 138 packages; zero vulnerabilities.
- Every exact command in `.factory/claims.json`: 17/17 passed independently.
- Exact work-order command `npm ci && npm test && npm run build`: passed twice.
- Each full run: 6 unit/contract tests passed; 48 browser/integration tests passed; 22 intentional mobile-project skips.
- Accessibility: Playwright Axe found no serious or critical issue on `/`, `/demo`, `/privacy`, `/terms`, or `/404` in desktop and mobile projects.
- Privacy: the full sample export flow requested only the product origin.
- Offline: a service-worker-controlled `/demo` reload retained the sample and showed the Offline notice.
- Build: `dist/index.html` produced; JS 31.51 kB raw / 11.55 kB gzip; CSS 22.89 kB raw / 5.78 kB gzip.

## Post-deploy verification

```sh
/opt/fleet/lib/verify-url.sh https://creative-tech-demo-recorder.sociobot.in/ .factory/evidence/polish-4-retry-live-home
/opt/fleet/lib/verify-url.sh 'https://creative-tech-demo-recorder.sociobot.in/?demo=1' .factory/evidence/polish-4-retry-live-demo
node tools/audit-live.mjs https://creative-tech-demo-recorder.sociobot.in .factory/evidence/polish-4-retry-live-audit.json
```

- Home and direct query-demo loads returned HTTPS 200 with correct titles, `lang="en"`, one h1, one main, alt text, labelled buttons, and zero console errors.
- The live audit passed 12 groups across `/`, `/demo`, `/privacy`, `/terms`, `/404`, and an unknown URL.
- The 390 × 844 first screen contains the complete job, audience, action, result, and three facts.
- Direct `/?demo=1` opened only `demo:demo-loop-local` and read no license key.
- Reset restored the sample. Start for real removed demo storage and preserved a seeded real recording.
- Live WebM and PNG downloads worked and the full demo flow stayed on the product origin.
- A controlled offline reload retained the sample and displayed the Offline notice.
- Route titles, descriptions, canonicals, social metadata, h1 focus, browser Back, legal links, the 180 px Apple icon, and the real HTTP 404 all passed.
- All visible mobile controls measured at least 44 × 44 CSS pixels, no route overflowed, and live Axe found no serious or critical issue.
- CSP, Permissions-Policy, nosniff, referrer policy, and frame denial were present.
- Checkout returned 303 to Dodo. A returned token stayed locked until a mocked Sociobot verdict completed.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.7 s, TBT 50 ms, CLS 0.

Evidence: [live audit](evidence/polish-4-retry-live-audit.json), [home verification](evidence/polish-4-retry-live-home/verify.json), [demo verification](evidence/polish-4-retry-live-demo/verify.json), [home mobile](evidence/polish-4-retry-live-home/screenshot-mobile.png), [demo mobile](evidence/polish-4-retry-live-demo/screenshot-mobile.png), [404 mobile](evidence/polish-4-retry-live-404.png), and [Lighthouse](evidence/lighthouse-polish-4-retry-live.json).

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
