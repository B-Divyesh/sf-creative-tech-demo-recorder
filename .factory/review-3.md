# Adversarial first-read review 3 — Demo Loop

**Work order:** `creative-tech-demo-recorder-review-3`

**Candidate:** `64b35440a1daf3ccf803e8ffe480b904e6e30d0b`

**Live URL:** <https://creative-tech-demo-recorder.sociobot.in>

**Date:** 2026-08-28

**Verdict: FAIL**

The core recording flow, one-click demo, storage isolation, offline reload, and
all 17 registered claim commands work. The release still has seven findings.
Three are blocking because previous claims/structure findings remain only
partly verified.

## First 30 seconds

### Cold mobile, 390 × 844, before scrolling

- **What it does:** records a browser-prototype interaction for a portfolio.
- **For whom:** creative-technology students.
- **What to click first:** **Try it with sample data**. The adjacent sentence
  says it opens a finished recording, poster, and marked beat.

The exact first-screen text is:

> “Record a portfolio interaction demo”
>
> “For creative-technology students who need a short video of a browser
> prototype working.”
>
> “Try it with sample data”
>
> “Opens a finished recording, poster, and marked beat.”

All three plain facts are also visible before the 844 px fold. The first-read
test passes.

### Cold desktop, 1440 × 900, before scrolling

The same job, audience, action, action result, and three facts are visible.
The original two-ink risograph artwork fills the other half of the viewport.
The visual identity is product-specific and is not a generic SaaS template.

## Findings

### F-1-3 — BLOCKING — reopened in round 3 as F-3-1: two claim tests do not prove the registered outcome

**Exact claims/locations:**

- `.factory/claims.json`, `poster-export`: **“Exports the marked frame as a
  PNG poster.”** The matching test at `tests/claims.spec.ts:102` checks only the
  filename and that Sharp can decode a PNG. It never moves the beat or checks
  that the exported pixels came from that frame.
- `.factory/claims.json`, `capture-length-options`: **“Users can choose a 20,
  30, or 45 second recording limit.”** The matching test at
  `tests/claims.spec.ts:63` changes the select and checks only the displayed
  timeline label. It never confirms that recording stops at the selected
  limit.

**Why this fails:** Both commands pass, but either implementation could ignore
the selected beat or duration and still pass. The claims contract requires the
observable promised result, not the presence of a control or label. This leaves
the earlier claims-test finding half-fixed.

**Concrete fix:** Use synthetic video whose frames change at known times. For
`poster-export`, set the beat to two known times, export, decode the images, and
assert the expected frame pixels and printed time. For
`capture-length-options`, run a short clock-controlled capture for each choice
and assert automatic stop at its selected limit. Keep one tagged test per claim.

### F-1-6 — BLOCKING — reopened in round 3 as F-3-2: customer-facing commercial and privacy claims are unlisted

**Exact claims/locations:**

| Location | Exact unlisted claim | Gap and concrete fix |
| --- | --- | --- |
| Landing payment note and README | “Sociobot/Dodo is the merchant of record.” | `live-checkout` proves a 303 redirect to a Dodo-hosted checkout, `$9`, and “One-time unlock.” It does not prove the legal merchant-of-record role. Add an authoritative observable assertion and a matching claim, or rewrite to “Checkout opens on Sociobot and Dodo.” |
| `/terms` | “It handles refunds.” | No claim entry or test establishes who accepts or decides refund requests. Add a tested refund-policy source/link, or remove the sentence. |
| `/privacy` | “Demo Loop stores your license token and cached verdict locally.” | `license-restore` asserts the token key but does not assert the cached-verdict key or register this privacy statement. Register and test both local keys, or narrow the copy to the tested token behavior. |

**Why this fails:** Payment and data-storage statements are facts a visitor may
rely on. They are outside the exact wording and assertions in
`.factory/claims.json`. This is the same unlisted-claims defect as F-1-6.

### F-1-7 — BLOCKING — reopened in round 3 as F-3-3: the 404 and Apple icon remain only partly compliant

**Exact locations/evidence:**

- A cold request to `/missing-review-3` returns **HTTP 200**, although the
  client renders **“Page not found.”** The `navigationFallback` in
  `public/staticwebapp.config.json` masks the missing route before a 404 status
  reaches `responseOverrides`.
- Every route links `rel="apple-touch-icon"` to
  `/icons/icon-192.png`. The only Apple candidate is confirmed as **192 × 192**;
  the required 180 px Apple touch icon is absent.

**Why this fails:** A designed error screen is present, but an unknown URL is
not a real HTTP 404 and can be indexed as valid content. The icon set also does
not match the stated route-metadata contract. The earlier routes/metadata
finding is therefore not fully closed.

**Concrete fix:** Configure known SPA routes explicitly and let unknown paths
return status 404 while rewriting to the designed `404.html`. Add an original
180 × 180 PNG and point `apple-touch-icon` to it. Test the unknown response
status and decoded icon dimensions.

### F-3-4 — MAJOR — mobile navigation and text links miss the 44 px touch-target baseline

**Exact locations/evidence:** At 390 px, Playwright measured the header links
**Demo** at 34.1 × 22.1 px, **Record** at 51.1 × 22.1 px, and **Privacy** at
59.6 × 22.1 px. Footer links are also 22.1 px tall. The inline **Terms** link
beside checkout is 30 × 13 px, and **Record an interaction ↑** is 230 × 24.8
px. The brand link is 42 px tall.

**Why this fails:** These controls are easy to miss or activate incorrectly
on the phone used for this review. Axe reports no automated violations, but the
attached accessibility contract requires every touch target to be at least
44 px.

**Concrete fix:** Give every link a minimum 44 × 44 px hit area with padding or
a positioned pseudo-element, including header, footer, inline legal, brand,
and empty-state links. Add a 390 px Playwright test over every visible
interactive element, not only the record button.

### F-3-5 — MINOR — required first-screen facts and helper copy contradict the recorded type system

**Exact locations/evidence:** `.factory/design.md` says **“body never below
16px.”** `src/styles.css` renders `.hero-facts` at 12 px and `.action-note` at
13 px. Other usable text, including support, status, saved-recording metadata,
license text, and footer text, ranges from 10 to 14 px.

**Why this fails:** The small sizes include the facts and action explanation a
phone visitor must scan in 30 seconds. The implemented system does not match
its source-of-truth typography.

**Concrete fix:** Set informational and interactive text to at least 16 px.
If tiny decorative type is intentionally retained, revise the design contract
to name only those nonessential exceptions and keep required facts at 16 px.

### F-3-6 — MINOR — the 404 retains an information-free metaphor label

**Exact quote/location:** `/404`, above the h1: **“404 / MISSED FRAME.”**

**Why this fails:** “Missed frame” is brand mood, not recovery information. It
adds no fact beyond the clear **“Page not found”** h1 and conflicts with the
plain-words rule against metaphor labels.

**Concrete fix:** Delete the label or change it to the literal **“ERROR 404.”**

### F-3-7 — MINOR — README privacy copy uses implementation jargon

**Exact quote/location:** README, Privacy and ownership:
**“Recordings, captions, posters, and beat markers stay in the selected storage
namespace.”**

**Why this fails:** A visitor cannot tell what a “selected storage namespace”
is. The useful fact is which browser workspace holds the files.

**Concrete rewrite:** **“Recordings, captions, posters, and beat markers stay
in the browser workspace you opened.”**

## Copy audit

Counts treat a hyphenated term, number, URL, or filename as one word. No
sentence exceeds 22 words. No banned marketing adjective appears, terminology
is consistent, and all action buttons name an outcome. The only copy findings
are F-3-6 and F-3-7.

### Landing page: every sentence, heading, and actionable label

| Location | Exact copy | Words | Result |
| --- | --- | ---: | --- |
| Brand/navigation | Demo Loop / Demo / Record / Privacy | 2 / 1 / 1 / 1 | Pass |
| Hero label | Portfolio tool / browser recorder | 4 | Pass |
| H1 | Record a portfolio interaction demo | 5 | Pass |
| Hero sentence | For creative-technology students who need a short video of a browser prototype working. | 12 | Pass |
| Primary action | Try it with sample data | 5 | Pass |
| Action result | Opens a finished recording, poster, and marked beat. | 8 | Pass |
| Hero fact | Media stays in this browser | 5 | Pass; claimed |
| Hero fact | Nothing is uploaded | 3 | Pass; claimed |
| Hero fact | Choose 20, 30, or 45 seconds | 6 | Pass; claimed |
| Art caption | Input / visible response | 3 | Pass |
| Recorder label | Record your interaction | 3 | Pass |
| Recorder h2 | Record, mark the beat, and export | 6 | Pass |
| Recorder sentence | Select a tab or window. | 5 | Pass |
| Recorder sentence | Mark the response while recording, then export the video and poster. | 11 | Pass |
| Step labels | 01 Record / 02 Mark the beat / 03 Export | 2 / 4 / 2 | Pass |
| Field labels | Recording name / One-line caption / Maximum length | 2 / 2 / 2 | Pass |
| Duration choices | 20 seconds / 30 seconds / 45 seconds | 2 / 2 / 2 | Pass; claimed |
| Microphone control | Add microphone / Requested after screen access | 2 / 4 | Pass; claimed |
| Record action | Choose a tab and record | 6 | Pass |
| Permission sentence | Screen permission starts only after this button. | 7 | Pass; claimed |
| Privacy sentence | Media does not leave the browser. | 6 | Pass; claimed |
| Empty stage | Ready / no signal | 3 | Pass |
| Empty sentence | Your selected tab appears here. | 5 | Pass |
| Empty instruction | Show the input before the response. | 6 | Pass |
| Timeline/status | Start / Beat — not marked / Ready to record. | 1 / 3 / 4 | Pass |
| Method label | How it works | 3 | Pass |
| Method h2 | Show an interaction clearly | 4 | Pass |
| Method h3/sentence | Show the control / Keep the cursor, hand, or control visible before the action. | 3 / 10 | Pass |
| Method h3/sentences | Mark the response / Press M when it happens. / That frame becomes the poster. | 3 / 5 / 5 | Claim test gap: F-1-3 |
| Method h3/sentence | Hold the result / Wait a few seconds so a reviewer can read the change. | 3 / 11 | Pass |
| Recordings label/h2 | Saved recordings / Recent recordings | 2 / 2 | Pass |
| Backup actions | Export JSON backup / Import JSON backup | 3 / 3 | Pass; claimed |
| Empty sentence | No recordings yet. | 3 | Pass |
| Empty sentence/action | Your next recording will appear here. / Record an interaction ↑ | 6 / 3 | Pass |
| Limits label/h2 | Privacy and limits / What Demo Loop does not do | 3 / 6 | Pass |
| Limit | It does not upload recordings. | 5 | Pass; claimed |
| Limit | It does not replace an archival video editor. | 8 | Pass |
| Link | Read the privacy details | 4 | Pass |
| Paid label/h2 | Loop Pass / one-time / Loop Pass removes the three-recording limit | 3 / 6 | Pass |
| Paid sentence | The free plan saves three recordings. | 6 | Pass; claimed |
| Paid sentence | WebM, PNG, and JSON exports remain available. | 7 | Pass; claimed |
| Paid sentence | Loop Pass costs $9 once. | 5 | Pass; claimed |
| Paid sentence | It saves more than three recordings and exports 1920-pixel posters from large sources. | 12 | Pass; claimed |
| Paid facts | $9 one-time checkout through Sociobot / Restore the license on another device / No three-recording limit after verification | 5 / 6 / 5 | Pass; claimed |
| Purchase/action | $9 USD one time / Buy Loop Pass | 4 / 3 | Pass; claimed |
| License controls | No license on this browser. / Have a license? / Verify license | 5 / 3 / 2 | Pass |
| Payment note | Sociobot/Dodo is the merchant of record. | 6 | Unlisted claim: F-1-6 |
| Footer | Record browser interactions for a portfolio. | 6 | Pass |
| Footer | Build 1.2.0. | 2 | Pass |
| Art credit | Original AI-assisted illustration. | 3 | Pass; provenance documented |

### README: every sentence and list item

| Section | Exact copy | Words | Result |
| --- | --- | ---: | --- |
| Opening | Record a selected browser tab or window for 20, 30, or 45 seconds. | 13 | Pass; claimed |
| Opening | Mark one interaction beat, then export a WebM and PNG poster. | 10 | Claim test gap: F-1-3 |
| Opening | Demo Loop is for creative-technology students preparing portfolio work. | 9 | Pass |
| Opening | Recordings stay in browser storage and remain after a reload. | 9 | Pass; claimed |
| Links | Live: [URL] / Sample demo: [URL] | 2 / 3 | Pass |
| Demo | Open `/demo` or `/?demo=1`. | 3 | Pass |
| Demo | It loads a 24-second controller recording, marked beat, caption, poster, and saved-recording card. | 13 | Pass; claimed |
| Demo | The yellow banner identifies demo mode. | 6 | Pass |
| Demo | Reset restores the sample. | 4 | Pass; claimed |
| Demo | Start for real deletes demo storage without reading or changing real recordings. | 12 | Pass; claimed |
| Demo | See `.factory/demo.md` for the storage contract and verification details. | 9 | Pass |
| Capability | Requests screen access only after you choose to record. | 9 | Pass; claimed |
| Capability | Adds microphone audio when selected and available. | 7 | Pass; claimed |
| Capability | Offers 20, 30, and 45 second recording limits. | 8 | Claim test gap: F-1-3 |
| Capability | Marks one response with the M key and ends early with S. | 12 | Pass; claimed |
| Capability | Exports WebM video, a PNG poster, and a complete JSON backup. | 10 | Pass; claimed |
| Capability | Imports a JSON backup and keeps saved recordings in IndexedDB. | 10 | Pass; technical context |
| Capability | Works offline after its first visit. | 6 | Pass; claimed |
| Capability | Respects reduced-motion settings and supports keyboard operation. | 7 | Pass; claimed |
| Caveat | Browser capture, screen audio, and WebM codecs vary by browser and device. | 12 | Pass |
| Plan | The free plan saves three recordings. | 6 | Pass; claimed |
| Plan | WebM, PNG, and JSON exports remain available. | 7 | Pass; claimed |
| Plan | Loop Pass costs $9 once. | 5 | Pass; claimed |
| Plan | It saves more than three recordings and exports 1920-pixel posters from sources that are large enough. | 15 | Pass; claimed |
| Billing | Purchase and verification use only `https://api.sociobot.in`. | 6 | Pass; claimed |
| Billing | Sociobot/Dodo is the merchant of record. | 6 | Unlisted claim: F-1-6 |
| License | Returned `?license=` tokens are stored under `sb_license:creative-tech-demo-recorder`, removed from the address, and verified. | 11 | Pass; claimed |
| License | Buyers can also paste a token on another device. | 9 | Pass; claimed |
| Local run | Use Node.js 22 or newer. | 6 | Pass; setup instruction |
| Local run | Open the printed local URL. | 5 | Pass |
| Local run | Browser capture requires a secure context, and browsers treat `localhost` as secure. | 11 | Pass; setup explanation |
| Tests | The test suite covers unit, browser, mobile, accessibility, privacy, payment, route, offline, and every registered claim. | 15 | Pass; verified in this review |
| Tests | Each entry in `.factory/claims.json` includes its independent command. | 8 | Pass; verified |
| Tests | The production build is written to `dist/`. | 7 | Pass; verified |
| Deploy | The static work order runs this command. | 7 | Pass |
| Deploy | Deploy `dist/` without modifying it. | 5 | Pass |
| Deploy | `staticwebapp.config.json` supplies routing, the designed 404, MIME types, caching, CSP, and permissions policy. | 11 | Partly false for real 404 status: F-1-7 |
| Privacy | Recordings, captions, posters, and beat markers stay in the selected storage namespace. | 11 | Jargon: F-3-7 |
| Privacy | The demo and real workspaces use separate IndexedDB databases. | 9 | Pass; claimed |
| Privacy | The sample export flow sends requests only to the Demo Loop origin. | 12 | Pass; claimed |
| Privacy | See the live privacy page. | 5 | Pass |
| License | MIT © 2026 Sociobot (Param Factory). | 5 | Pass |

## Demo and sandbox

- The home action opens `/demo` in one click.
- At 390 × 844, the sample video occupies y=503–676 and **Export WebM**
  occupies y=753–802. Both are fully visible before scrolling.
- At 1440 × 900, the video and **Export WebM** are also visible immediately.
- The persistent banner says **“Demo — sample data, nothing is saved”** and
  exposes **Reset demo** and **Start for real**.
- A direct fresh `/demo` context created only `demo:demo-loop-local`; it did
  not create or open the real database.
- After changing the sample caption, Reset demo restored **“Turning the dial
  stretches the projected letters.”**
- A live real recording named **Private review 3** remained after deleting and
  resetting the sample. Start for real removed the demo database and displayed
  the real recording.
- WebM and PNG downloads worked. The complete request log contained only the
  product origin and same-origin `blob:` URLs.
- After service-worker installation, a live offline reload retained the sample
  and displayed the Offline notice without console errors.

The demo itself passes. Its claim-test gaps are listed separately in F-1-3.

## Registered claims

All commands were run independently after `npm ci` in the clean clone
`/tmp/demo-loop-review3-3ZBbBh` at candidate `64b3544`.

| Claim id | Exact command result | Review status |
| --- | --- | --- |
| `sample-demo-isolated` | Pass | Observable isolation also confirmed live |
| `local-only-network` | Pass | Same-origin request log confirmed live |
| `offline-reload` | Pass | Offline reload also confirmed live |
| `capture-length-options` | Command passes | **Insufficient assertion; F-1-3** |
| `explicit-capture` | Pass | Verified |
| `keyboard-motion` | Pass | Verified |
| `microphone-mix` | Pass | Verified |
| `webm-export` | Pass | Verified |
| `poster-export` | Command passes | **Insufficient assertion; F-1-3** |
| `local-persistence` | Pass | Verified |
| `backup-roundtrip` | Pass | Verified |
| `free-save-limit` | Pass | Verified |
| `paid-unlimited` | Pass | Verified |
| `paid-poster` | Pass | Verified |
| `license-restore` | Pass | Cached-verdict privacy wording remains outside the assertion; F-1-6 |
| `license-revocation` | Pass | Verified |
| `live-checkout` | Pass | Merchant/refund wording remains outside the assertion; F-1-6 |

No command returned a failing exit status. The review still treats the two
non-proving tests as untested outcomes, as required by the claims contract.

## History: every earlier finding rechecked

| Earlier finding | Live and code result in round 3 |
| --- | --- |
| F-1-1 sample demo | Fixed: finished video, caption, beat, and Export WebM are in the first mobile and desktop viewport. |
| F-1-2 isolated storage | Fixed: direct demo uses only `demo:demo-loop-local`; reset/exit preserved a seeded real recording. |
| F-1-3 claims registry/tests | **Half-fixed and reopened:** registry exists and commands pass, but two tests do not prove their claim outcomes. |
| F-1-4 checkout | Fixed: live endpoint returns 303 to Dodo; the checkout test confirms $9 and one-time status. |
| F-1-5 first-screen clarity | Fixed on 390 px and desktop. |
| F-1-6 claim coverage | **Half-fixed and reopened:** merchant/refund and cached-verdict statements remain outside exact registry proof. |
| F-1-7 routes/metadata/focus | **Half-fixed and reopened:** designed route, titles, focus, canonical, OG, sitemap, and favicon exist; unknown URLs still return 200 and the Apple icon is 192 px. |
| F-1-8 response policies | Fixed: CSP, Permissions-Policy, nosniff, referrer policy, and frame denial are live with no console errors. |
| F-1-9 demo docs | Fixed: `.factory/demo.md` documents entry, sample, reset, exit, and namespaces. |
| F-1-10 landing copy | Fixed. The new 404 metaphor is separately F-3-6. |
| F-1-11 long/inconsistent copy | Fixed: no sentence exceeds 22 words and core terminology is consistent. README jargon is separately F-3-7. |
| F-1-12 performance | Fixed: current JS is 31.56 KB raw / 11.60 KB gzip; prior live Lighthouse evidence is 100. |
| Verification P1 checkout | Fixed live. |
| Verification P2 performance | Fixed by current bundle and recorded live run. |
| Verification P3 headers/cache | Fixed live. |
| F-2-1 factory footer link | Fixed: `https://sociobot.in/` returns 200. |
| F-2-2 action names | Fixed: result-specific review, delete, and record-again labels are present. |

## Structure, accessibility, and link checks

- `/`, `/demo`, `/privacy`, `/terms`, and `/404` return 200 and render their
  route-specific title, description, canonical, OG data, one h1, one main, and
  `lang="en"`.
- `/missing-review-3` renders the designed recovery screen, but returns 200;
  see F-1-7.
- Privacy navigation and browser Back both move focus to the new h1 and update
  the polite route announcer.
- Every discovered internal link, `robots.txt`, `sitemap.xml`, manifest, social
  card, SVG favicon, checkout endpoint, and factory link responded. Checkout
  returned the expected 303; all ordinary links returned 200.
- The social card is 1200 × 630. The Apple icon is 192 × 192; see F-1-7.
- Live Playwright/Axe scans found zero reported violations on `/`, `/demo`,
  `/privacy`, `/terms`, and `/404`. Manual target measurements still fail the
  supplied 44 px rule; see F-3-4.
- No horizontal overflow or console error was observed at 390 px or desktop.
- The risograph palette, halftone art, type pairing, registration marks, and
  letterpress controls match the intended identity. The small type-token
  divergence is F-3-5.

## Quality gates

From the clean clone:

- `npm ci`: passed; 138 packages, zero reported vulnerabilities.
- Every one of 17 claim commands: exited successfully; one desktop pass and
  one intentional mobile-project skip per command.
- `npm test`: passed; 2 unit tests, 41 browser tests, 17 intentional skips.
- `npm run build`: passed and produced `dist/`.
- Built JS: 31.56 KB raw / 11.60 KB gzip.
- Built CSS: 22.35 KB raw / 5.72 KB gzip.

## Missed leverage

No missed-leverage finding. The brief implies recording, marked-frame export,
poster export, local persistence, and import/export; all are present. A runtime
AI feature would add disclosure, connectivity, and cost to a task that already
works locally, so it would be decorative rather than useful.

## What would make this perfect

Make the two claim tests prove the selected frame and actual time limit. Bring
the merchant, refund, and cached-license wording under exact sandbox tests or
narrow it. Return a real 404 status, add the required 180 px Apple icon, make
every mobile target at least 44 px, align useful copy with the 16 px type rule,
and remove the remaining metaphor/jargon. Only then would this review have zero
findings.
