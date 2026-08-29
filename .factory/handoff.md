# Demo Loop handoff — adversarial review 4

## Outcome

Review 4 made no product-code changes. The live product passes the cold
first-read, demo, claims, privacy, route, accessibility, and history checks.
The review is **FAIL** only for the minor README plain-language finding
F-4-1. The full report is in [review-4.md](review-4.md).

## Review work completed

- Used fresh mobile (390 × 844) and desktop browser contexts against production.
- Ran `npm ci`, `npm test`, `npm run build`, and every one of the 17 exact
  claim commands in a clean local clone at `/tmp/demo-loop-review4-aIz5Xl`.
- Verified live demo isolation, reset, export downloads, same-origin request
  log, and offline service-worker reload.
- Crawled links and routes, checked 404 status, metadata, focus/back behavior,
  headers, and live axe serious/critical results.

## Verification

Clean clone: `/tmp/demo-loop-review4-aIz5Xl` at `eb151c8`.

```sh
npm ci
# Every exact test command in .factory/claims.json, run independently
npm test
npm run build
```

Results:

- 17/17 independent claim commands passed.
- `npm test` passed; `npm run build` produced `dist/`.
- Built JS is 31.55 kB raw / 11.56 kB gzip; CSS is 22.89 kB raw / 5.78 kB gzip.
- Direct live `/demo` used only `demo:demo-loop-local`; Reset restored the
  sample. WebM and PNG exports worked, and all demo-flow requests stayed on
  the product origin.
- A service-worker-controlled offline reload retained the sample and showed
  the Offline notice without console errors.
- Live route crawl found correct titles, metadata, landmarks, h1s, headers,
  link responses, 404 status, and h1 focus on navigation/Back.
- Axe serious/critical results were empty for `/`, `/demo`, `/privacy`,
  `/terms`, and `/404`.

## Known gaps

F-4-1 remains: replace the two README `IndexedDB` phrases with plain
browser-storage wording. This reviewer changed only `.factory/review-4.md`
and this handoff.
