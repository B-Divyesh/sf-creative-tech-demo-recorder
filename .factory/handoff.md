# Demo Loop handoff — perfection loop round 3

## Outcome

All findings from reviews 1–3 are resolved and the repaired static PWA is live at <https://creative-tech-demo-recorder.sociobot.in>. The deployed implementation is `daf8b0a581b5`; Azure deployment ID `e3e9b3dc-132f-4589-8726-2eaaa23111ee` completed successfully.

## What changed

- Rewrote the first screen around the literal job: record a browser interaction for a portfolio.
- Preserved the risograph/halftone print identity while raising useful text to 16px and every effective mobile target to at least 44 × 44px.
- Strengthened the duration-limit claim with clock-controlled automatic-stop checks at 20, 30, and 45 seconds.
- Strengthened the poster claim with decoded 00:02/00:15 frame pixels and observed poster time text.
- Narrowed checkout, refund, and license-storage copy to facts covered by exact tests. License restoration now asserts both local keys.
- Replaced catch-all SPA fallback with explicit known routes, a true HTTP 404 response, literal 404 wording, and a 180 × 180 Apple touch icon.
- Updated the service-worker cache, PWA version, README, design contract, copy audit, claim sandboxes, and verb-first 89-character catalog description.

The complete finding map is in [.factory/polish-3.md](polish-3.md).

## Verification

Clean clone: `/tmp/demo-loop-polish3-final-CxpDia` at `daf8b0a581b5`.

```sh
npm ci
# Every exact test command in .factory/claims.json, run independently
npm test
npm run build
```

Results:

- 17/17 independent claim commands passed.
- `npm test`: 2 unit tests and 46 browser tests passed; 20 intentional project-specific runs skipped.
- `npm run build`: passed and produced `dist/index.html`.
- Output: JS 31.55 KB raw / 11.56 KB gzip; CSS 22.89 KB raw / 5.78 KB gzip.
- Exact work-order command `npm ci && npm test && npm run build`: passed before deployment.
- Live Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1.7 s, TBT 110 ms, CLS 0.
- Live Playwright Axe: zero violations on `/`, `/demo`, `/privacy`, `/terms`, and `/404`.
- `verify-url.sh`: home and `/?demo=1` each have one h1, `lang="en"`, one main, complete alt text, labelled buttons, and zero console errors.
- Live `/missing-polish-3`: HTTP 404 with the designed recovery page.
- Live direct `/?demo=1`: only `demo:demo-loop-local` exists and no license key is read.
- Live reset/exit: sample restored, demo database deleted, and seeded real recording remained.
- Live sample export flow: WebM and decoded PNG succeeded; every request stayed on the product origin.
- Live offline reload: the sample and Offline notice remained available.
- Live mobile audit: no horizontal overflow, first-screen facts and demo result fit within 390 × 844, and no visible effective target is below 44px.
- Live route navigation and Back both focus the new h1; all discovered links responded with 200 or the expected checkout 303.

Evidence:

- [Live audit](evidence/polish-3-live-audit.json)
- [Live link crawl](evidence/polish-3-live-links.json)
- [Lighthouse report](evidence/lighthouse-polish-3-live.json)
- [Home screenshots and verifier output](evidence/polish-3-live-home/verify.json)
- [Demo screenshots and verifier output](evidence/polish-3-live-demo/verify.json)
- [Designed live 404](evidence/polish-3-live-404.png)

## Known gaps

None within the researched brief, cumulative review findings, or factory product contract.
