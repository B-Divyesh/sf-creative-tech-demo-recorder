# Adversarial first-read review 2 — Demo Loop

**URL reviewed:** <https://creative-tech-demo-recorder.sociobot.in>  
**Date:** 2026-08-28  
**Verdict: FAIL**

## First 30 seconds

### Cold visit, before scrolling

Fresh Chromium contexts at **390 × 844** and **1440 × 900** showed the same
first screen, without console errors or off-origin requests. The first screen
answers the three first-read questions:

- **What it does:** records a short browser-prototype interaction and exports a
  video and poster.
- **For whom:** creative-technology students preparing a portfolio.
- **What to click first:** **“Try it with sample data”**; it says that it opens
  a finished recording, poster, and marked beat.

The exact copy is clear and within the first viewport:

> “Record a portfolio interaction demo”
>
> “For creative-technology students who need a short video of a browser
> prototype working.”
>
> “Try it with sample data”
>
> “Opens a finished recording, poster, and marked beat.”

The ink, halftone, registration-mark, and letterpress treatment is distinct,
matches `.factory/design.md`, and is not a generic SaaS template.

## Findings

### F-1-1 — BLOCKING — reopened: the sample result is not on the first demo screen

**Location/evidence:** This is the same acceptance condition as review-1
finding F-1-1. The home action opens `/demo`, and `/demo` does seed a finished
sample after loading. Its banner correctly says **“Demo — sample data, nothing
is saved”** and includes **“Reset demo”** and **“Start for real.”**

However, the initial 390 × 844 screen contains only the banner, the heading
**“Review a sample interaction recording”**, its explanatory paragraph, and
the start of the ordinary recorder form. The actual sample video and the
already-active export controls are below the fold. In a fresh mobile context
the video began at y=1,605 px; in a fresh desktop 1440 × 900 context it began
at y=978 px. A live 390px screenshot confirms that no sample video, marked
beat, poster, or saved-recording card is visible before scrolling.

**Why this fails:** The demo is seeded but not demonstrated. The required
one-click path says that the *first screen after clicking* must already show
the product being used with realistic sample data. A visitor sees another
setup form before seeing the promised result.

**Concrete fix:** Give `/demo` a demo-specific first viewport: put the seeded
video/poster, `SAMPLE RECORDING / ISOLATED`, 00:09 beat, caption, and export
controls above the fold, ahead of or beside any recording setup. Keep the
banner persistent. Add a mobile Playwright assertion that the sample video and
at least one sample-result control have bounding boxes within the 844px
viewport immediately after `/demo` becomes ready.

### F-1-6 — BLOCKING — reopened: several visitor claims remain unlisted or are weaker than their tests

**Location/evidence:** The claim registry and its 17 registered tests now
exist, so the original missing-registry defect is repaired. It is nevertheless
only a partial repair of F-1-6: the following live landing-page and README
claims do not have a matching `claims.json` claim with an observable test.

| Location | Exact claim | Gap | Concrete fix |
| --- | --- | --- | --- |
| Landing, privacy-and-limits list | “It does not add analytics or advertising.” | `local-only-network` only asserts that the demo export flow uses the product origin. It does not establish this broader no-analytics/no-advertising claim. | Remove this sentence, or register a narrowly testable network claim and test the complete flow against an allow-list. |
| Landing h2 and paid paragraph | “Loop Pass: unlimited saved recordings”; “It saves unlimited recordings…” | `paid-unlimited` proves only that a fourth recording saves: its registered text says “more than three,” not “unlimited.” | Change both to “saves more than three recordings” / “has no three-recording limit,” or add an observable entitlement test whose assertion matches the retained copy. |
| Landing paid list | “One payment with no recurring fee” | `live-checkout` asserts a $9 hosted checkout, but not billing frequency. | Assert the one-time/no-subscription checkout state, or remove the phrase. |
| Landing paid copy/list | “It exports every video, poster, and backup”; “Core exports remain free” | `free-save-limit` asserts only WebM and PNG controls after three saves. `backup-roundtrip` does not test the free-cap condition. | Add a free-cap JSON-backup download assertion, or say only “WebM and PNG exports remain available,” which is what the existing test proves. |
| README, compatibility | “Current desktop Chrome, Edge, and Firefox support the intended workflow.” | No browser-compatibility claim or cross-browser test is registered. | Remove the support statement, or register and run the stated workflow in each named browser. |
| README, privacy | “The repository has no analytics, advertising, CDN scripts, or direct payment-provider code.” | No listed claim tests this complete source/network statement. | Remove the statement from visitor copy, or replace it with individually tested, user-observable network/privacy language. |

**Why this fails:** Privacy, payment, export access, and browser support are
facts a visitor could rely on. The claims contract requires each retained
claim to have a matching entry and sandbox proof; broad labels such as
`local-only-network` cannot silently cover different promises.

### F-2-1 — MAJOR — The required factory footer link is dead

**Location/evidence:** Every route renders **“Built by Param Factory”** as
`https://www.sociobot.in/` (`src/main.ts:42`). A fresh browser navigation
failed with `net::ERR_CERT_COMMON_NAME_INVALID`; curl likewise returned status
`000` because the certificate does not cover `www.sociobot.in`. The non-`www`
address, `https://sociobot.in/`, returned 200.

**Why this fails:** The standard footer exposes a link that a visitor cannot
open. This also fails the required link crawl.

**Concrete fix:** Change the footer destination to the certificate-valid
canonical `https://sociobot.in/` (or repair the `www` certificate/redirect),
then add that external destination to the link-crawl test.

### F-2-2 — MINOR — Two recording actions do not name their result

**Location/evidence:** The review control button is **“New recording”** and
each saved-recording card has a bare **“Open”** button (`src/main.ts:97` and
`src/main.ts:214`). “New recording” is a noun phrase; “Open” does not say what
will open. These are especially unclear when a screen reader presents the
buttons out of surrounding visual context.

**Concrete fix:** Use **“Record another interaction”** and **“Review
recording”** (or a name-specific **“Review Kinetic type controller”**).

## Copy audit

Word counts treat a hyphenated term, a number, and a short technical filename
as one word. All reviewed landing and README sentences are listed below.
No sentence exceeds 22 words. `WebM`, `PNG`, and `IndexedDB` are necessary
technical names here; the flagged copy is covered by F-1-6 or F-2-2.

### Landing page

| Location | Sentence or text | Words | Result |
| --- | --- | ---: | --- |
| Hero label | PORTFOLIO TOOL / BROWSER RECORDER | 4 | Pass |
| H1 | Record a portfolio interaction demo | 5 | Pass |
| Hero lede | For creative-technology students who need a short video of a browser prototype working. | 12 | Pass |
| Primary action | Try it with sample data | 5 | Pass |
| Action note | Opens a finished recording, poster, and marked beat. | 8 | Pass |
| Facts | Media stays in this browser; Nothing is uploaded; Choose 20, 30, or 45 seconds | 5; 3; 6 | Pass; registered |
| Art caption | INPUT; VISIBLE RESPONSE | 1; 2 | Pass |
| Recorder label/H2 | RECORD YOUR INTERACTION; Record, mark the beat, and export | 3; 6 | Pass |
| Recorder description | Select a tab or window. Mark the response while recording, then export the video and poster. | 6; 11 | Pass |
| Steps | 01 RECORD; 02 MARK THE BEAT; 03 EXPORT | 2; 4; 2 | Pass |
| Form/control labels | RECORDING NAME; ONE-LINE CAPTION; MAXIMUM LENGTH; 20/30/45 seconds; Add microphone; Requested after screen access | 2; 2; 2; 2 each; 2; 4 | Pass |
| Record action | Choose a tab and record | 6 | Pass |
| Permission note | Screen permission starts only after this button. Media does not leave the browser. | 7; 6 | Pass; registered |
| Initial stage | READY / NO SIGNAL; Your selected tab appears here. Show the input before the response. START; BEAT — NOT MARKED; 00:30; Ready to record. | 3; 5; 5; 1; 3; 1; 3 | Pass |
| Method label/H2 | HOW IT WORKS; Show an interaction clearly | 3; 4 | Pass |
| Method 1 | INPUT; Show the control; Keep the cursor, hand, or control visible before the action. | 1; 3; 10 | Pass |
| Method 2 | BEAT; Mark the response; Press M when it happens. That frame becomes the poster. | 1; 3; 5; 5 | Pass |
| Method 3 | RESULT; Hold the result; Wait a few seconds so a reviewer can read the change. | 1; 3; 11 | Pass |
| Recordings | SAVED RECORDINGS; Recent recordings; Export JSON backup; Import JSON backup; No recordings yet. Your next recording will appear here. Record an interaction | 2; 2; 3; 3; 3; 6; 3 | Pass |
| Limits | PRIVACY AND LIMITS; What Demo Loop does not do; It does not upload recordings. | 3; 6; 5 | Pass; registered |
| Limits | It does not add analytics or advertising. | 7 | **F-1-6** |
| Limits | It does not replace an archival video editor. Read the privacy details | 8; 4 | Pass |
| Paid label/H2 | LOOP PASS / ONE-TIME; Loop Pass: unlimited saved recordings | 3; 5 | **F-1-6** for unlimited |
| Paid sentences | The free plan saves three recordings. It exports every video, poster, and backup. | 6; 8 | Second sentence **F-1-6** |
| Paid sentences | Loop Pass costs $9 once. It saves unlimited recordings and exports full-width posters. | 5; 8 | First registered; second **F-1-6** |
| Paid list | One payment with no recurring fee; Restore the license on another device; Core exports remain free | 6; 6; 4 | First/third **F-1-6**; restore registered |
| Purchase | $9 USD ONE TIME; Buy Loop Pass; No license on this browser.; Have a license?; Sociobot/Dodo is the merchant of record. | 4; 3; 5; 3; 6 | Pass; price/restore registered |
| Footer | Record browser interactions for a portfolio. Built by Param Factory. Build 0a6399d. Original AI-assisted illustration. | 6; 4; 2; 3 | Factory link **F-2-1**; otherwise pass |

### README

| Location | Sentence or list item | Words | Result |
| --- | --- | ---: | --- |
| Opening | Record a selected browser tab or window for 20, 30, or 45 seconds. | 13 | Registered |
| Opening | Mark one interaction beat, then export a WebM and PNG poster. | 10 | Registered |
| Opening | Demo Loop is for creative-technology students preparing portfolio work. | 9 | Pass |
| Opening | Recordings stay in browser storage and remain after a reload. | 9 | Registered |
| Demo | Open `/demo` or `/?demo=1`. | 3 | Pass |
| Demo | It loads a 24-second controller recording, marked beat, caption, poster, and saved-recording card. | 11 | Pass, but see **F-1-1** for initial viewport |
| Demo | The yellow banner identifies demo mode. Reset restores the sample. Start for real deletes demo storage without reading or changing real recordings. | 7; 4; 12 | Registered |
| Capability list | Requests screen access only after you choose to record. | 9 | Registered |
| Capability list | Adds microphone audio when selected and available. | 7 | Registered |
| Capability list | Offers 20, 30, and 45 second recording limits. | 8 | Registered |
| Capability list | Marks one response with the M key and ends early with S. | 12 | Registered |
| Capability list | Exports WebM video, a PNG poster, and a complete JSON backup. | 10 | Registered |
| Capability list | Imports a JSON backup and keeps saved recordings in IndexedDB. | 10 | Registered |
| Capability list | Works offline after its first visit. | 6 | Registered |
| Capability list | Respects reduced-motion settings and supports keyboard operation. | 7 | Registered |
| Compatibility | Browser capture, screen audio, and WebM codecs vary. | 8 | Pass as a caveat |
| Compatibility | Current desktop Chrome, Edge, and Firefox support the intended workflow. | 10 | **F-1-6** |
| Free plan | The free plan saves three recordings. WebM, PNG, and JSON exports remain available. | 6; 8 | Second sentence **F-1-6** for free JSON |
| Paid plan | Loop Pass costs $9 once. It saves more than three recordings and exports 1920-pixel posters from sources that are large enough. | 5; 15 | Registered |
| Billing | Purchase and verification use only `https://api.sociobot.in`. Sociobot/Dodo is the merchant of record. | 6; 6 | Registered by checkout/restore flows |
| License | Returned `?license=` tokens are stored under `sb_license:creative-tech-demo-recorder`, removed from the address, and verified. | 11 | Registered |
| License | Buyers can also paste a token on another device. | 9 | Registered |
| Run | Use Node.js 22 or newer. Open the printed local URL. | 6; 5 | Pass |
| Run | Browser capture requires a secure context, and browsers treat `localhost` as secure. | 11 | Pass |
| Tests | The test suite covers unit, browser, mobile, accessibility, privacy, payment, route, offline, and every registered claim. | 15 | Pass |
| Tests | Each entry in `.factory/claims.json` includes its independent command. The production build is written to `dist/`. | 8; 7 | Pass |
| Deploy | The static work order runs this command. Deploy `dist/` without modifying it. | 8; 5 | Pass |
| Deploy | `staticwebapp.config.json` supplies routing, the designed 404, MIME types, caching, CSP, and permissions policy. | 11 | Pass |
| Privacy | Recordings, captions, posters, and beat markers stay in the selected storage namespace. | 11 | Registered |
| Privacy | The demo and real workspaces use separate IndexedDB databases. | 9 | Registered |
| Privacy | The repository has no analytics, advertising, CDN scripts, or direct payment-provider code. | 10 | **F-1-6** |
| Privacy | See the live privacy page. | 5 | Pass |
| License | MIT © 2026 Sociobot (Param Factory). | 5 | Pass |

## Claims and sandbox results

All commands below were run from a fresh clone at
`/tmp/demo-loop-review2-HZECaR` after `npm ci`.

| Check | Result | Evidence |
| --- | --- | --- |
| Every registered claim command | Pass | Aggregate execution of the 17 exact `@claim:` selectors: 17 passed, 17 intentional mobile skips. |
| `npm test` | Pass | 2 Vitest tests and the Playwright suite; `test-results/.last-run.json` reports `status: passed`, no failed tests. |
| `npm run build` | Pass | `dist/` produced; app JS 31.44 kB raw / 11.66 kB gzip and CSS 20.19 kB raw / 5.36 kB gzip. |
| Demo isolation | Pass | On live production, a seeded real `demo-loop-local` recording remained after demo delete, Reset demo, and Start for real. The demo database was removed on exit. |
| Demo privacy | Pass for registered scope | The live demo loaded and exported WebM/PNG with requests only to `https://creative-tech-demo-recorder.sociobot.in`. |
| Offline | Pass | The registered clean-clone `@claim:offline-reload` test passed. |
| Claim coverage | **Fail** | F-1-6 lists surviving customer claims that are absent or weaker than their registry proof. No registered test itself failed. |

## History and structure checks

| Earlier finding/check | Live and code confirmation |
| --- | --- |
| F-1-1 demo result | **Half-fixed; reopened as BLOCKING F-1-1.** Sample data, banner, reset, and isolation exist, but the result is below the initial demo viewport. |
| F-1-2 isolated storage | Fixed: `demo:demo-loop-local` is separate from real storage; live reset/exit left the seeded real recording unchanged. |
| F-1-3 registry/tests | Fixed: `claims.json` exists and all 17 listed tests pass. |
| F-1-4 checkout | Fixed: live Sociobot checkout returned HTTP 303 to a Dodo session. |
| F-1-5 first-screen clarity | Fixed at mobile and desktop. |
| F-1-6 all claim coverage | **Half-fixed; reopened as BLOCKING F-1-6.** See exact unlisted/weaker promises above. |
| F-1-7 routes/metadata/focus | Fixed: `/`, `/demo`, `/privacy`, `/terms`, `/404`, and a missing route each rendered one h1, main, route title/description/canonical; Privacy navigation and Back moved focus to h1 and announced it. |
| F-1-8 CSP/policy | Fixed: live response has CSP, Permissions-Policy, nosniff, referrer policy, and frame denial; no CSP console errors occurred. |
| F-1-9 demo docs | Fixed: `.factory/demo.md` documents entry points, sample, namespace, reset, and exit. |
| F-1-10/F-1-11 copy | The cited slogans, long copy, and terminology conflicts are fixed. F-2-2 identifies two newly remaining vague action labels. |
| F-1-12 performance | No regression evident: the deployed hashed bundle is the 31.44 kB raw artifact recorded by the repaired build. |
| Prior verification P1/P2/P3 | P1 checkout and P3 headers are confirmed live; P2 is supported by the deployed lightweight bundle and the prior recorded mobile measurement. |
| Link crawl | All product routes, robots, sitemap, manifest, and social card returned 200; checkout returned 303. The sole failure is `https://www.sociobot.in/` (F-2-1). |
| Accessibility | Live axe serious/critical checks were empty on `/`, `/demo`, `/privacy`, `/terms`, and `/404`. |
| Missed leverage / AI | No finding. The brief already includes the implied exports, import/backup, and local persistence. An AI feature would be decorative rather than an obviously useful step for this capture-and-export task. |

## What would make this perfect

Make the first `/demo` viewport visibly contain the finished sample result,
not merely a description of it. Bring every privacy, billing, export, and
browser-support promise into exact sandbox-backed claims (or remove it), fix
the factory footer destination, and name every action by its result. Then the
product would be clear, tryable, honest, and have no open review findings.
