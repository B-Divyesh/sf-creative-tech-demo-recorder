# Adversarial first-read review 4 — Demo Loop

**URL reviewed:** <https://creative-tech-demo-recorder.sociobot.in>  
**Date:** 2026-08-28  
**Verdict: FAIL**

## First 30 seconds

Fresh Chromium contexts at **390 × 844** and **1440 × 900**, before scrolling,
gave the same usable answer:

- **What it does:** records a browser-prototype interaction and exports a
  video and a poster.
- **For whom:** creative-technology students making portfolio work.
- **What to click first:** **“Try it with sample data.”** The adjacent text
  says it opens a finished recording, poster, and marked beat.

The exact first-screen copy is:

> “Record a browser interaction for your portfolio”
>
> “For creative-technology students who need a 20–45 second video of a
> prototype working.”
>
> “Try it with sample data”
>
> “Opens a finished recording, poster, and marked beat.”

All three required facts were visible on the phone: “Media stays in this
browser,” “Nothing is uploaded,” and “Choose 20, 30, or 45 seconds.” The
risograph artwork, registration marks, ink palette, mono timecodes, and
letterpress controls are distinct from a generic SaaS layout and match the
recorded visual thesis.

## Findings

### F-4-1 — MINOR — README exposes storage implementation jargon

**Exact quotes/location:** README, *What it does*:

> “Imports a JSON backup and keeps saved recordings in IndexedDB.”

README, *Privacy and ownership*:

> “The demo and real workspaces use separate IndexedDB databases.”

**Why this fails:** “IndexedDB” names a browser implementation, not a useful
outcome for a creative-technology student deciding whether their recordings are
safe. The plain-language requirement applies to README copy. It is a leftover
of the earlier storage-namespace repair: the reader needs to know the browser
keeps the workspaces separate, not which API implements that behavior.

**Concrete fix:** Rewrite the first sentence as **“Imports a JSON backup and
keeps saved recordings in browser storage.”** Rewrite the second as
**“The demo and real workspaces store recordings separately in your browser.”**

## Demo and sandbox verification

The home action opened `/demo` in one click. In a fresh 390 px context, the
first screen showed the persistent **“Demo — sample data, nothing is saved”**
banner, **Reset demo**, **Start for real**, the seeded *Kinetic type
controller* video (top 468 px), its marked beat, and a fully visible **Export
WebM** action (bottom 806 px).

Direct `/demo` created only `demo:demo-loop-local`; no real database was
created. Reset restored the sample. The WebM and PNG downloads were named
`kinetic-type-controller.webm` and `kinetic-type-controller-poster.png`.
During the entire demo export flow, the browser requested only
`https://creative-tech-demo-recorder.sociobot.in`. After service-worker setup,
an offline reload retained the sample and displayed the Offline notice. No
console errors occurred.

## Claims and clean-clone checks

A fresh local clone at `/tmp/demo-loop-review4-aIz5Xl` was installed with
`npm ci`. `npm test` passed, and `npm run build` passed and produced `dist/`
(31.55 kB JS / 11.56 kB gzip; 22.89 kB CSS / 5.78 kB gzip).

Every exact command listed in `.factory/claims.json` was then run separately
from that clone. All 17 passed:

| Claim | Result |
| --- | --- |
| sample-demo-isolated | Pass |
| local-only-network | Pass |
| offline-reload | Pass |
| capture-length-options | Pass |
| explicit-capture | Pass |
| keyboard-motion | Pass |
| microphone-mix | Pass |
| webm-export | Pass |
| poster-export | Pass |
| local-persistence | Pass |
| backup-roundtrip | Pass |
| free-save-limit | Pass |
| paid-unlimited | Pass |
| paid-poster | Pass |
| license-restore | Pass |
| license-revocation | Pass |
| live-checkout | Pass |

The duration test advances a recording clock through 20, 30, and 45 seconds
and checks automatic stopping. The poster test exports at 00:02 and 00:15,
decodes both images, verifies changed source-frame pixels, and observes both
printed beat times. These two checks close the earlier proof gaps.

All claim-like landing and README product statements map to the registry:
capture, microphone, recording lengths, keyboard controls, WebM/PNG/JSON
exports, persistence, demo isolation, offline behavior, storage, payment,
license restoration/revocation, free limit, and paid poster size. The remaining
README setup and browser-compatibility caveats are instructions or cautions,
not promises of product behavior.

## Copy audit

Counts treat a hyphenated word, number, URL, and file format as one word.
Technical file-format and configuration names are retained where they name an
actual export or deployment input. No sentence is over 22 words. The two
`IndexedDB` instances are the sole unexplained visitor-facing jargon and are
F-4-1. No banned marketing adjective, inconsistent core term, mood-only
heading, or non-result-naming button was found.

### Landing page

| Location | Copy | Words | Check |
| --- | --- | ---: | --- |
| Hero label | Portfolio tool / browser recorder | 4 | Pass |
| H1 | Record a browser interaction for your portfolio | 7 | Pass |
| Hero sentence | For creative-technology students who need a 20–45 second video of a prototype working. | 13 | Pass |
| Primary action | Try it with sample data | 5 | Pass |
| Action result | Opens a finished recording, poster, and marked beat. | 8 | Pass |
| Facts | Media stays in this browser / Nothing is uploaded / Choose 20, 30, or 45 seconds | 5 / 3 / 6 | Pass |
| Art caption | Input / visible response | 3 | Pass |
| Recorder label and h2 | Record your interaction / Record, mark the beat, and export | 3 / 6 | Pass |
| Recorder sentences | Select a tab or window. / Mark the response while recording, then export the video and poster. | 5 / 11 | Pass |
| Steps | Record / Mark the beat / Export | 1 / 3 / 1 | Pass |
| Fields | Recording name / One-line caption / Maximum length / 20 seconds / 30 seconds / 45 seconds | 2 / 2 / 2 / 2 / 2 / 2 | Pass |
| Mic control | Add microphone / Requested after screen access | 2 / 4 | Pass |
| Capture action | Choose a tab and record | 6 | Pass |
| Capture notes | Screen permission starts only after this button. / Media does not leave the browser. | 7 / 6 | Pass |
| Empty recorder | Your selected tab appears here. / Show the input before the response. / Ready to record. | 5 / 6 / 4 | Pass |
| Method heading | How it works / Show an interaction clearly | 3 / 4 | Pass |
| Method copy | Keep the cursor, hand, or control visible before the action. / Press M when it happens. / That frame becomes the poster. / Wait a few seconds so a reviewer can read the change. | 10 / 5 / 5 / 11 | Pass |
| Recordings heading/actions | Saved recordings / Recent recordings / Export JSON backup / Import JSON backup | 2 / 2 / 3 / 3 | Pass |
| Empty recordings | No recordings yet. / Your next recording will appear here. / Record an interaction | 3 / 6 / 3 | Pass |
| Recording actions | Record another interaction / Review [recording name] / Delete [recording name] | 3 / 3+ / 3+ | Pass |
| Limits heading/copy | Privacy and limits / What Demo Loop does not do / It does not upload recordings. / It does not replace an archival video editor. | 3 / 6 / 5 / 8 | Pass |
| Limits action | Read the privacy details | 4 | Pass |
| Paid heading | Loop Pass / one-time / Loop Pass removes the three-recording limit | 2 / 1 / 6 | Pass |
| Paid copy | The free plan saves three recordings. / WebM, PNG, and JSON exports remain available. / Loop Pass costs $9 once. / It saves more than three recordings and exports 1920-pixel posters from large sources. | 6 / 7 / 5 / 12 | Pass |
| Paid facts | $9 one-time checkout through Sociobot / Restore the license on another device / No three-recording limit after verification | 5 / 6 / 5 | Pass |
| Purchase controls | Buy Loop Pass / No license on this browser. / Have a license? / Verify license | 3 / 5 / 3 / 2 | Pass |
| Checkout note | Checkout starts on Sociobot and opens a Dodo payment page. / Terms / Privacy | 10 / 1 / 1 | Pass |
| Footer | Record browser interactions for a portfolio. / Privacy / Terms / Built by Param Factory / Build 1.3.0 / Original AI-assisted illustration. | 6 / 1 / 1 / 4 / 2 / 3 | Pass |

### README

| Location | Sentence or item | Words | Check |
| --- | --- | ---: | --- |
| Opening | Record a selected browser tab or window for 20, 30, or 45 seconds. | 13 | Pass; claimed |
| Opening | Mark one interaction beat, then export WebM video and that frame as a PNG poster. | 15 | Pass; claimed |
| Opening | Demo Loop is for creative-technology students preparing portfolio work. | 9 | Pass |
| Opening | Recordings stay in browser storage and remain after a reload. | 9 | Pass; claimed |
| Demo | Open `/demo` or `/?demo=1`. | 3 | Pass |
| Demo | It loads a 24-second controller recording, marked beat, caption, poster, and saved-recording card. | 13 | Pass; documented sample |
| Demo | The yellow banner identifies demo mode. / Reset restores the sample. / Start for real deletes demo storage without reading or changing real recordings. | 6 / 4 / 12 | Pass; claimed |
| Demo | See `.factory/demo.md` for the storage contract and verification details. | 9 | Pass |
| Capability | Requests screen access only after you choose to record. / Adds microphone audio when selected and available. / Offers 20, 30, and 45 second recording limits. | 9 / 7 / 8 | Pass; claimed |
| Capability | Marks one response with the M key and ends early with S. / Exports WebM video, a PNG poster, and a complete JSON backup. | 12 / 10 | Pass; claimed |
| Capability | Imports a JSON backup and keeps saved recordings in IndexedDB. / Works offline after its first visit. / Respects reduced-motion settings and supports keyboard operation. | 10 / 6 / 7 | First sentence F-4-1; remainder pass |
| Caveat | Browser capture, screen audio, and WebM codecs vary by browser and device. | 12 | Pass; caveat |
| Plans | The free plan saves three recordings. / WebM, PNG, and JSON exports remain available. | 6 / 7 | Pass; claimed |
| Plans | Loop Pass costs $9 once. / It saves more than three recordings and exports 1920-pixel posters from sources that are large enough. | 5 / 15 | Pass; claimed |
| Billing | Purchase and verification use only `https://api.sociobot.in`. / Checkout starts on Sociobot and opens a Dodo payment page. | 6 / 10 | Pass; claimed |
| License | Returned `?license=` tokens are stored under `sb_license:creative-tech-demo-recorder`, removed from the address, and verified. / Buyers can also paste a token on another device. | 11 / 9 | Pass; claimed |
| Local run | Use Node.js 22 or newer. / Open the printed local URL. / Browser capture requires a secure context, and browsers treat `localhost` as secure. | 6 / 5 / 11 | Pass |
| Test/build | The test suite covers unit, browser, mobile, accessibility, privacy, payment, route, offline, and every registered claim. / Each entry in `.factory/claims.json` includes its independent command. / The production build is written to `dist/`. | 15 / 8 / 7 | Pass |
| Deploy | The static work order runs this command. / Deploy `dist/` without modifying it. / `staticwebapp.config.json` supplies routing, the designed 404, MIME types, caching, CSP, and permissions policy. | 7 / 5 / 11 | Pass |
| Privacy | Recordings, captions, posters, and beat markers stay in the browser workspace you opened. / The demo and real workspaces use separate IndexedDB databases. / The sample export flow sends requests only to the Demo Loop origin. / See the live privacy page. | 11 / 9 / 12 / 5 | Second sentence F-4-1; remainder pass |
| License | MIT © 2026 Sociobot (Param Factory). | 5 | Pass |

## History and structure

Every finding in `review-1.md`, `review-2.md`, `review-3.md`, the three
polish reports, and the prior handoff was rechecked against live behavior and
source. F-1-1 through F-1-12, F-2-1, F-2-2, and F-3-1 through F-3-7 are fixed;
none is merely marked fixed. F-4-1 is a new README copy finding, not a
regression of an unfixed earlier item.

- The real checkout endpoint returns **303** to a Dodo checkout and the
  registered live-checkout test confirms the $9 one-time state.
- Unknown `/missing-review-4` returns **404** and renders the designed recovery
  page. The Apple touch icon returns 200 and is the required 180 px asset.
- Header/footer, Privacy, Terms, and the factory link are consistent. Crawled
  internal routes returned 200, the checkout returned 303, and
  `https://sociobot.in/` returned 200.
- `/`, `/demo`, `/privacy`, `/terms`, and `/404` each have route-specific
  plain titles, descriptions, canonical and social-card metadata, one h1,
  `<main>`, and `lang="en"`. Privacy navigation and Back put focus on the
  replacement h1.
- Live headers include CSP, Permissions-Policy, nosniff, referrer policy, and
  frame denial. No console errors appeared during the route crawl.
- Axe reported no serious or critical issue on any of those five routes at
  390 px.

## Missed leverage

No additional feature is required by the brief. The expected capture,
marked-beat review, WebM/PNG export, JSON backup/import, local persistence,
offline operation, and one-click isolated sample are present. AI would be
decorative for this local recording task, so no AI feature is expected.

## What would make this perfect

Replace the two `IndexedDB` phrases with their plain browser-storage outcomes.
Then keep the sample route isolated, keep each visitor promise tied to a
clean-sandbox test, and rerun the mobile route and claim checks whenever
recording, payment, or routing changes.
