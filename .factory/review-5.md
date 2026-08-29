# Adversarial first-read review 5 — Demo Loop

**Work order:** `creative-tech-demo-recorder-review-5`  
**Candidate:** `fb644f0c0beb339432af3ed975e7731f1d3e28c2`  
**Live URL:** <https://creative-tech-demo-recorder.sociobot.in>  
**Date:** 2026-08-29  
**Verdict: PASS**

## Findings

None. There are zero blocking, major, or minor findings, and no untested
claim.

## First 30 seconds

Fresh Chromium contexts at **390 × 844** and **1440 × 900** were opened without
scrolling.

- **What it does:** records a short browser-prototype interaction and exports
  the recording and a poster frame for a portfolio.
- **For whom:** creative-technology students who need to show a prototype
  working.
- **What to click first:** **“Try it with sample data.”** The adjacent sentence
  says it opens a finished recording, poster, and marked beat.

The exact first-screen copy was:

> “Record a browser interaction for your portfolio”
>
> “For creative-technology students who need a 20–45 second video of a
> prototype working.”
>
> “Try it with sample data”
>
> “Opens a finished recording, poster, and marked beat.”

The three facts—“Media stays in this browser,” “Nothing is uploaded,” and
“Choose 20, 30, or 45 seconds”—also fit fully inside both initial viewports.
The first-read check passes.

## Copy audit

Counts use whitespace-delimited words. Hyphenated terms, routes, URLs, and
file names count as one word. The landing table includes every initial
sentence, heading, label, and action; compact control values are grouped. No
item exceeds 22 words, uses a banned marketing adjective, changes a core term,
or relies on a metaphor or mood heading. Every action names its result.

### Landing page

| Location | Exact copy | Words | Result |
| --- | --- | ---: | --- |
| Brand and navigation | Demo Loop / Demo / Record / Privacy | 2 / 1 / 1 / 1 | Pass |
| Hero label | Portfolio tool / browser recorder | 4 | Pass |
| H1 | Record a browser interaction for your portfolio | 7 | Pass |
| Hero sentence | For creative-technology students who need a 20–45 second video of a prototype working. | 13 | Pass |
| Primary action | Try it with sample data | 5 | Pass |
| Action result | Opens a finished recording, poster, and marked beat. | 8 | Pass |
| Hero facts | Media stays in this browser / Nothing is uploaded / Choose 20, 30, or 45 seconds | 5 / 3 / 6 | Pass; registered claims |
| Art caption | Input / visible response | 3 | Pass |
| Recorder label and h2 | Record your interaction / Record, mark the beat, and export | 3 / 6 | Pass |
| Recorder sentences | Select a tab or window. / Mark the response while recording, then export the video and poster. | 5 / 11 | Pass |
| Step labels | 01 Record / 02 Mark the beat / 03 Export | 2 / 4 / 2 | Pass |
| Field labels | Recording name / One-line caption / Maximum length | 2 / 2 / 2 | Pass |
| Caption placeholder | Turning the dial bends the projected type. | 7 | Pass |
| Duration choices | 20 seconds / 30 seconds / 45 seconds | 2 / 2 / 2 | Pass; registered claim |
| Microphone control | Add microphone / Requested after screen access | 2 / 4 | Pass; registered claim |
| Record action | Choose a tab and record | 6 | Pass |
| Capture notes | Screen permission starts only after this button. / Media does not leave the browser. | 7 / 6 | Pass; registered claims |
| Empty recorder | Ready / no signal / Your selected tab appears here. / Show the input before the response. | 3 / 5 / 6 | Pass |
| Timeline and status | Start / Beat — not marked / Ready to record. | 1 / 3 / 3 | Pass |
| Method label and h2 | How it works / Show an interaction clearly | 3 / 4 | Pass |
| Method step 1 | Input / Show the control / Keep the cursor, hand, or control visible before the action. | 1 / 3 / 10 | Pass |
| Method step 2 | Beat / Mark the response / Press M when it happens. / That frame becomes the poster. | 1 / 3 / 5 / 5 | Pass |
| Method step 3 | Result / Hold the result / Wait a few seconds so a reviewer can read the change. | 1 / 3 / 11 | Pass |
| Recordings heading and actions | Saved recordings / Recent recordings / Export JSON backup / Import JSON backup | 2 / 2 / 3 / 3 | Pass; actions name results |
| Empty recordings | No recordings yet. / Your next recording will appear here. / Record an interaction | 3 / 6 / 3 | Pass |
| Recording actions | Record another interaction / Review [recording name] / Delete [recording name] | 3 / 3+ / 3+ | Pass |
| Limits label and h2 | Privacy and limits / What Demo Loop does not do | 3 / 6 | Pass |
| Limit sentences | It does not upload recordings. / It does not replace an archival video editor. | 5 / 8 | Pass |
| Limits action | Read the privacy details | 4 | Pass |
| Paid label and h2 | Loop Pass / one-time / Loop Pass removes the three-recording limit | 2 / 1 / 6 | Pass |
| Paid sentences | The free plan saves three recordings. / WebM, PNG, and JSON exports remain available. | 6 / 7 | Pass; registered claims |
| Paid sentences | Loop Pass costs $9 once. / It saves more than three recordings and exports 1920-pixel posters from large sources. | 5 / 13 | Pass; registered claims |
| Paid facts | $9 one-time checkout through Sociobot / Restore the license on another device / No three-recording limit after verification | 5 / 6 / 5 | Pass; registered claims |
| Purchase controls | $9 USD one time / Buy Loop Pass / No license on this browser. / Have a license? / Verify license | 4 / 3 / 5 / 3 / 2 | Pass |
| Checkout sentence | Checkout starts on Sociobot and opens a Dodo payment page. | 10 | Pass; registered claim |
| Footer | Record browser interactions for a portfolio. / Privacy / Terms / Built by Param Factory | 6 / 1 / 1 / 4 | Pass |
| Build and provenance | Build 1.3.1 / Original AI-assisted illustration. | 2 / 3 | Pass; provenance is documented in `.factory/design.md` and `assets/src/hero-risograph.png.json` |

### README

All section headings are literal and make sense independently: “Try the
isolated demo,” “What it does,” “Free plan and Loop Pass,” “Run locally,”
“Test and build,” “Deploy,” “Privacy and ownership,” and “License.”

| Section | Exact sentence or item | Words | Result |
| --- | --- | ---: | --- |
| Opening | Record a selected browser tab or window for 20, 30, or 45 seconds. | 13 | Pass; registered claim |
| Opening | Mark one interaction beat, then export WebM video and that frame as a PNG poster. | 15 | Pass; registered claims |
| Opening | Demo Loop is for creative-technology students preparing portfolio work. | 9 | Pass |
| Opening | Recordings stay in browser storage and remain after a reload. | 9 | Pass; registered claim |
| Links | Live: [production URL] / Sample demo: [demo URL] | 2 / 3 | Pass |
| Demo | Open `/demo` or `/?demo=1`. | 4 | Pass |
| Demo | It loads a 24-second controller recording, marked beat, caption, poster, and saved-recording card. | 13 | Pass; confirmed live |
| Demo | The yellow banner identifies demo mode. | 6 | Pass |
| Demo | Reset restores the sample. | 4 | Pass; registered claim |
| Demo | Start for real deletes demo storage without reading or changing real recordings. | 12 | Pass; registered claim |
| Demo | See `.factory/demo.md` for the storage contract and verification details. | 9 | Pass |
| Capability | Requests screen access only after you choose to record. | 9 | Pass; registered claim |
| Capability | Adds microphone audio when selected and available. | 7 | Pass; registered claim |
| Capability | Offers 20, 30, and 45 second recording limits. | 8 | Pass; registered claim |
| Capability | Marks one response with the M key and ends early with S. | 12 | Pass; registered claim |
| Capability | Exports WebM video, a PNG poster, and a complete JSON backup. | 11 | Pass; registered claims |
| Capability | Imports a JSON backup and keeps saved recordings in browser storage. | 11 | Pass; registered claims |
| Capability | Works offline after its first visit. | 6 | Pass; registered claim |
| Capability | Respects reduced-motion settings and supports keyboard operation. | 7 | Pass; registered claim |
| Caveat | Browser capture, screen audio, and WebM codecs vary by browser and device. | 12 | Pass; caution, not a promise |
| Plan | The free plan saves three recordings. | 6 | Pass; registered claim |
| Plan | WebM, PNG, and JSON exports remain available. | 7 | Pass; registered claim |
| Plan | Loop Pass costs $9 once. | 5 | Pass; registered claim |
| Plan | It saves more than three recordings and exports 1920-pixel posters from sources that are large enough. | 16 | Pass; registered claims |
| Billing | Purchase and verification use only `https://api.sociobot.in`. | 6 | Pass; registered claims |
| Billing | Checkout starts on Sociobot and opens a Dodo payment page. | 10 | Pass; registered claim |
| License | Returned `?license=` tokens are stored under `sb_license:creative-tech-demo-recorder`, removed from the address, and verified. | 13 | Pass; registered claim |
| License | Buyers can also paste a token on another device. | 9 | Pass; registered claim |
| Local run | Use Node.js 22 or newer. | 5 | Pass; setup instruction |
| Local run | Open the printed local URL. | 5 | Pass; setup instruction |
| Local run | Browser capture requires a secure context, and browsers treat `localhost` as secure. | 12 | Pass; setup explanation |
| Test/build | The test suite covers unit, browser, mobile, accessibility, privacy, payment, route, offline, and every registered claim. | 16 | Pass; confirmed in clean clone |
| Test/build | Each entry in `.factory/claims.json` includes its independent command. | 8 | Pass; confirmed by registry contract test |
| Test/build | The production build is written to `dist/`. | 7 | Pass; confirmed in clean clone |
| Deploy | The static work order runs this command. | 7 | Pass |
| Deploy | Deploy `dist/` without modifying it. | 5 | Pass |
| Deploy | `staticwebapp.config.json` supplies routing, the designed 404, MIME types, caching, CSP, and permissions policy. | 13 | Pass; confirmed in source and live headers |
| Privacy | Recordings, captions, posters, and beat markers stay in the browser workspace you opened. | 13 | Pass; registered claims |
| Privacy | The demo and real workspaces store recordings separately in your browser. | 11 | Pass; registered claim |
| Privacy | The sample export flow sends requests only to the Demo Loop origin. | 12 | Pass; registered claim |
| Privacy | See the live privacy page. | 5 | Pass |
| License | MIT © 2026 Sociobot (Param Factory). | 6 | Pass |

Terminology is consistent: **recording** is the media item, **beat** is the
marked response, **poster** is the still export, **demo** is the isolated
sample, and **Loop Pass** is the paid license.

## Demo and sandbox

The home action opened `/demo` in one click. On the first 390 × 844 screen,
the persistent banner, **Reset demo**, **Start for real**, sample title,
caption, video, 00:09 beat, and **Export WebM** were visible without scrolling.
Desktop showed the same completed result plus the setup form.

The live browser audit confirmed:

- direct `/?demo=1` opened only `demo:demo-loop-local` and read no
  `sb_license:` key;
- the sample is the realistic 24-second **Kinetic type controller** recording;
- WebM and PNG exports downloaded non-empty files;
- changing the caption and choosing **Reset demo** restored the bundled sample;
- a seeded real recording survived demo reset and **Start for real**;
- leaving demo removed `demo:demo-loop-local` and retained `demo-loop-local`;
- the full sample/export request log contained only
  `https://creative-tech-demo-recorder.sociobot.in`;
- a service-worker-controlled demo reloaded offline with the sample and the
  **Offline** notice.

The demo and privacy checks pass.

## Claims

A local clone at `/tmp/demo-loop-review5-TxccsA/repo` was made from candidate
`fb644f0`. After `npm ci`, every exact command in `.factory/claims.json` was
run separately.

| Claim id | Result | Observable proof |
| --- | --- | --- |
| `sample-demo-isolated` | Pass | Direct query demo, demo-only database, no license read, reset/exit preserve real data |
| `local-only-network` | Pass | Complete sample WebM/PNG flow requests only the product origin |
| `offline-reload` | Pass | Service-worker-controlled sample reload succeeds offline |
| `capture-length-options` | Pass | Clock-controlled recordings continue before and stop at 20, 30, and 45 seconds |
| `explicit-capture` | Pass | Zero capture calls before the record action and one after it |
| `keyboard-motion` | Pass | Skip link, Enter/M/S operation, and reduced transition duration asserted |
| `microphone-mix` | Pass | Synthetic microphone audio track enters `MediaRecorder` |
| `webm-export` | Pass | Named, non-empty sample WebM downloads |
| `poster-export` | Pass | 00:02 and 00:15 exports contain different expected frame pixels and printed times |
| `local-persistence` | Pass | A real synthetic recording remains after reload |
| `backup-roundtrip` | Pass | Export embeds media; delete/import restores the recording |
| `free-save-limit` | Pass | Three saves persist and WebM, PNG, and JSON exports remain available |
| `paid-unlimited` | Pass | Verified license permits a fourth persisted recording |
| `paid-poster` | Pass | Verified license exports a 1920-pixel poster from a large source |
| `license-restore` | Pass | Production-origin verification stores token and verdict |
| `license-revocation` | Pass | Revoked verdict leaves paid features locked |
| `live-checkout` | Pass | Sociobot returns 303 to a Dodo page showing $9 and one-time unlock |

Every claim-like landing and README product statement maps to these entries:
demo/isolation, local network behavior, offline use, duration, capture timing,
keyboard/motion, microphone, WebM/PNG/JSON export, persistence, plan limits,
poster size, license handling, and checkout. The remaining README statements
are setup instructions, cautions, build facts verified in this review, or
documented artwork provenance. There is no unlisted product claim.

## Earlier findings rechecked

Every earlier review, polish report, verification report, and handoff was read.
Each finding was checked against both live behavior and current source.

| Earlier finding | Round 5 result |
| --- | --- |
| F-1-1 one-click sample | Fixed: sample result and export are in the first demo viewport. |
| F-1-2 demo isolation | Fixed: separate database; reset/exit preserve real data and discard demo data. |
| F-1-3 claim registry/tests | Fixed: 17 entries, one outcome test each, all independently passing. |
| F-1-4 broken checkout | Fixed: production Sociobot endpoint returns 303 to the tested Dodo checkout. |
| F-1-5 first-screen clarity | Fixed: job, audience, action, result, and facts fit at both viewports. |
| F-1-6 unlisted claims | Fixed: broad unsupported statements are gone; retained product claims map to tests. |
| F-1-7 routes/metadata/focus | Fixed: route metadata, real 404, focus, Back, announcement, sitemap, and icons pass. |
| F-1-8 browser policies | Fixed: live CSP, Permissions-Policy, nosniff, referrer policy, and frame denial. |
| F-1-9 demo documentation | Fixed: `.factory/demo.md` documents URLs, sample, reset, exit, namespaces, and test. |
| F-1-10 metaphor/vague copy | Fixed: task headings and consistent recording/beat/poster terms remain. |
| F-1-11 long/inconsistent copy | Fixed: no landing or README sentence exceeds 22 words. |
| F-1-12 performance | Fixed: current JS is 31.51 kB raw/11.55 kB gzip; recorded live Lighthouse is 100. |
| F-2-1 dead factory link | Fixed: `https://sociobot.in/` returns 200. |
| F-2-2 vague recording actions | Fixed: record-again, named review, and named delete actions remain. |
| F-3-1 weak duration/poster proof | Fixed: tests assert stop times, source pixels, and printed beat times. |
| F-3-2 commercial/privacy claims | Fixed: copy is narrowed and token/verdict storage is asserted. |
| F-3-3 404 and Apple icon | Fixed: unknown URL returns 404; Apple icon is 180 × 180. |
| F-3-4 small touch targets | Fixed: live five-route scan finds no visible target below 44 × 44 CSS px. |
| F-3-5 small useful text | Fixed: useful text is at least 16 px; only documented print labels are smaller. |
| F-3-6 metaphor 404 label | Fixed: label is the literal “ERROR 404.” |
| F-3-7 README namespace jargon | Fixed: README says “browser workspace.” |
| F-4-1 README IndexedDB jargon | Fixed: README uses “browser storage” and contains no `IndexedDB`. |
| Verification P1/P2/P3 | Fixed: production billing, performance, response policies, MIME type, and hashed caching all pass. |

No earlier finding is unfixed, half-fixed, or regressed.

## Structure, accessibility, and links

- `/`, `/demo`, `/privacy`, `/terms`, and `/404` have route-specific titles,
  descriptions, canonicals, Open Graph/Twitter metadata, one h1, one main, and
  `lang="en"`. Titles follow the requested product/task or route/product form.
- `/missing-review-5` returns HTTP 404 and the designed recovery page with
  **Return home** and **Open sample demo**.
- Header and footer are consistent. Privacy, Terms, product routes, assets,
  checkout, and the factory link all respond; no dead link was found.
- Privacy navigation and browser Back focus the replacement h1. A polite live
  region announces route changes.
- The live Axe integration found no serious or critical violation on all five
  routes. The live URL verifier found complete alt text, labelled buttons, no
  console errors, and correct landmarks on home and direct demo entry.
- Mobile routes have no horizontal overflow and no visible target smaller than
  44 × 44 CSS px. Reduced motion is tested.
- `robots.txt`, `sitemap.xml`, the SVG favicon, 180 px Apple icon, manifest,
  1200 × 630 social card, security headers, and explicit static route rewrites
  are present and reachable.
- The two-ink risograph art, paper palette, registration marks, mono timecodes,
  and letterpress controls match `.factory/design.md`. The interface is not a
  generic SaaS template.

## Quality gates

From the clean clone:

- `npm ci`: passed; 138 packages installed and npm reported zero
  vulnerabilities.
- All 17 exact claim commands: passed independently.
- `npm test`: passed; 6 unit/contract tests and 48 browser tests, with 22
  intentional cross-project skips.
- `npm run build`: passed and produced `dist/`.
- Build output: JS 31.51 kB raw / 11.55 kB gzip; CSS 22.89 kB raw / 5.78 kB
  gzip.
- `verify-url.sh` passed for `/` and `/?demo=1`; the live grouped audit passed
  12 checks with zero console errors.

## Missed leverage

No missed-leverage finding. The brief implies capture, beat marking, WebM/PNG
export, local persistence, and backup import/export; all are present. A runtime
AI step would add network, disclosure, and cost to a local capture task without
improving the core job, so it would be decorative rather than expected.

## What would make this perfect

Nothing corrective remains from this review. Preserve the one-click isolated
sample, exact claim-to-test mapping, plain terminology, real 404 behavior, and
product-specific print identity when future recording or billing changes ship.
