# Demo Loop — review 2 handoff

## Outcome

Independent adversarial review completed without modifying product code.
The result is **FAIL**; see `.factory/review-2.md` for four active findings.

## Review work completed

- Opened the deployed product in fresh 390 × 844 and 1440 × 900 Chromium
  contexts before scrolling.
- Exercised the live one-click demo, WebM and PNG exports, Reset demo, and
  Start for real after seeding a separate real IndexedDB recording.
- Confirmed that the live demo export flow made same-origin requests only and
  that reset/exit removed only `demo:demo-loop-local`.
- Ran every registered claim selector from a clean clone:
  `npm run test:e2e -- --grep @claim:` reported 17 passed and 17 intentional
  mobile skips.
- Ran the clean-clone suite and build. Playwright's recorded result is passed
  with no failed tests; `npm run build` produced `dist/`.
- Checked live titles, descriptions, canonicals, one-h1/main/lang structure,
  focus and announcements on navigation/back, 404, security headers, sitemap,
  robots, link targets, and serious/critical axe findings.

## Active gaps

1. **BLOCKING F-1-1:** `/demo` seeds a sample but places the actual sample
   video and controls below the first mobile and desktop viewport.
2. **BLOCKING F-1-6:** several landing and README privacy, paid-plan, export,
   and browser-support promises are unlisted or proved by weaker claims tests.
3. **MAJOR F-2-1:** the footer's `https://www.sociobot.in/` link has a
   certificate-name failure; `https://sociobot.in/` works.
4. **MINOR F-2-2:** “New recording” and “Open” do not state the action result.

## Repository changes

Only these reviewer artifacts were written:

- `.factory/review-2.md`
- `.factory/handoff.md`

No product implementation, dependencies, or deployment configuration was
changed.
