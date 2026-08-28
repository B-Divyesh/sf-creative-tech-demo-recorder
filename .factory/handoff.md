# Demo Loop handoff — adversarial review 3

## Outcome

Review 3 is recorded in `.factory/review-3.md` with verdict **FAIL**. No product
code was changed. The core live product and demo work, but seven contract-level
findings remain, including three reopened blocking findings.

## What was done

- Opened the live site cold in fresh 390 × 844 and 1440 × 900 Chromium
  contexts and recorded the first-screen interpretation before scrolling.
- Audited every landing-page and README sentence, heading, and action.
- Exercised the live one-click demo, WebM/PNG downloads, Reset demo, Start for
  real, real-data preservation, direct-demo database isolation, request log,
  and offline reload.
- Rechecked route metadata, h1/main/lang, route focus and Back behavior,
  internal and external links, response headers, 404 behavior, asset sizes,
  mobile touch targets, and Axe results.
- Read every earlier review, polish record, verification record, and handoff;
  the review contains a finding-by-finding history table.
- Ran all 17 exact `.factory/claims.json` commands independently from a clean
  clone of `64b3544`, then ran the full test and build gates.

## Verification

Clean clone: `/tmp/demo-loop-review3-3ZBbBh`

```sh
npm ci
# Run each `test` command from .factory/claims.json independently
npm test
npm run build
```

Results:

- 17/17 registered claim commands exited successfully.
- `npm test`: 2 unit tests and 41 browser tests passed; 17 duplicate
  mobile-project claim runs were intentionally skipped.
- `npm run build`: passed and produced `dist/`.
- Output JS: 31.56 KB raw / 11.60 KB gzip; CSS: 22.35 KB raw / 5.72 KB gzip.
- Live Axe scan: zero reported violations on `/`, `/demo`, `/privacy`,
  `/terms`, and `/404`.
- Live demo request log: only the Demo Loop origin and same-origin blob URLs.
- Live offline reload, reset, exit, and real-record preservation checks passed.

## Known gaps and next steps

See `.factory/review-3.md` for exact evidence and fixes. In summary:

- Strengthen the poster-frame and duration-limit claim tests so they prove the
  outcome, not only file format or labels.
- Register/test or narrow merchant-of-record, refund, and cached-verdict copy.
- Return HTTP 404 for unknown paths and provide a 180 × 180 Apple touch icon.
- Increase every mobile hit target to 44 × 44 px.
- Align informational text with the documented 16 px minimum.
- Remove the 404 metaphor label and rewrite the README storage jargon.

The tree remains buildable and contains documentation changes only.
