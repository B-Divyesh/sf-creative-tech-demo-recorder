# Adversarial first-read review 1 — Demo Loop

**URL reviewed:** `https://creative-tech-demo-recorder.sociobot.in`  
**Date:** 2026-08-28  
**Verdict: FAIL**

## First 30 seconds

### Cold mobile (390 × 844) and desktop observation

The same first screen loaded in fresh Chromium contexts at 390 × 844 and
1440 × 900. It rendered without console errors and used only same-origin
requests for the document, app JS/CSS, fonts, and hero image.

My best inference is: this records a browser interaction and makes a short
video plus poster. I cannot tell from the first screen that it is specifically
for creative-technology students, and "fragile interaction" does not explain
what kind of work is captured. I would click **“Make a demo”**, because it is
the only prominent action, but it does not say what happens next.

That inference is insufficient for a cold visitor. The exact text that fails
the first-read check is:

> “Capture the cause. Show the effect.”
>
> “Turn a fragile interaction into a credible 20–45 second proof—video,
> marked beat, caption, and poster—without sending your work to a cloud.”
>
> “Make a demo”

The headline is a slogan rather than the job, the description does not name
the audience or the capture surface, and the action neither names a result nor
states what follows. The print/risograph presentation is distinct and fits the
recorded visual thesis; this review does **not** find it to be a generic SaaS
template.

## Findings

### F-1-1 — BLOCKING — No one-click sample-data demo exists

**Location/evidence:** The landing action labelled **“Make a demo”** is
`href="#recorder"`. In a fresh 390px context it only changed the URL to
`/#recorder` and scrolled to the empty form, headed **“One clean take, three
moves.”** It did not load a recording, poster, caption, or marked beat.
`/?demo=1` and `/demo` render the same empty home screen. Neither has text
matching “Demo — sample data, nothing is saved”, “Reset demo”, or “Start for
real”.

**Why this fails:** A visitor cannot try the result without screen-capture
permission, a runnable prototype, and a manual recording. The required first
screen after one click is not already a realistic product result.

**Concrete fix:** Make the hero action **“Try it with sample data”** and route
it to `/demo` (and support `?demo=1`). Seed a realistic creative-technology
take: a 20–30 second example recording of a controller changing a visual,
with an already-marked interaction beat, caption, poster, and take-shelf card.
Keep a persistent **“Demo — sample data, nothing is saved”** banner with
**“Reset demo”** and **“Start for real”** controls. Add a Playwright test that
opens `/demo` from a fresh context and asserts that result before any user
setup.

### F-1-2 — BLOCKING — Demo mode cannot isolate data from real storage

**Location/evidence:** There is no demo branch in the shipped code. The only
take database is `DB_NAME = 'demo-loop-local'` in `src/db.ts`; every
`wireRecorder()` session calls `listTakes()` and writes through `putTake()`.
Opening `/?demo=1` has no behavioral effect.

**Why this fails:** Since there is no separate `demo:` namespace, the reviewer
cannot verify that sample actions never read or write a visitor's actual takes.
The required reset behavior and safe exit to real mode are absent.

**Concrete fix:** Pass an explicit demo state through all data access and use
a separate namespace, for example `demo:demo-loop-local` / `demo:` local
storage keys. In demo mode never open the real database or license keys. Reset
must clear only that namespace; Start for real must discard it (or offer an
explicit one-time copy). Test real take preservation before, during, and after
a demo run.

### F-1-3 — BLOCKING — Claims registry and claim tests are missing

**Location/evidence:** `.factory/claims.json` does not exist. A repository
search found no `@claim:` tags. Consequently there were no listed claim tests
to run from a clean clone.

**Why this fails:** The landing page and README make claims about browser
capture, 20–45-second lengths, local storage, no uploads, offline operation,
exports, pricing, browser support, persistence, and billing. None has the
required claim entry, sandbox description, and observable tagged test. The
normal suite passing is not a replacement for the required claims contract.

**Concrete fix:** Add `.factory/claims.json` and exactly one independently
runnable `@claim:<id>` test for every retained claim. At minimum cover
`offline-reload`, `local-only-network`, `webm-export`, `poster-export`,
`sample-demo-isolated`, `capture-length-options`, and each paid entitlement
claim. Use a fresh `/demo` context and request logging for privacy claims.
Remove any claim that cannot be tested.

### F-1-4 — BLOCKING — The advertised production purchase is broken (regression of previous P1)

**Location/evidence:** Earlier `.factory/verification.md` and
`.factory/handoff.md` reported this as P1. It remains unfixed in both live
site and source: `src/license.ts` hard-codes
`https://pilot-api.sociobot.in/api/v1`; the live **“Buy Loop Pass”** link is
`https://pilot-api.sociobot.in/api/v1/products/creative-tech-demo-recorder/checkout`.
A fresh `curl -I` on 2026-08-28 returned **HTTP 404**.

**Why this fails:** The visitor is invited to pay **“$9 USD ONE TIME”** for a
product that cannot be purchased or restored in production. This is a real
job failure, not merely a checkout cosmetic issue.

**Concrete fix:** Register the live product, change checkout and verification
to `https://api.sociobot.in/api/v1`, deploy, then test a checkout redirect and
a valid returned-license/restore flow from a clean browser. Do not retain the
$9 claim or Buy button until that test passes.

### F-1-5 — MAJOR — The first screen does not say the job, audience, and first action plainly

**Location/evidence:** Hero `h1`, lede, and primary link quoted in “First 30
seconds” above. The h1 is **“Capture the cause. Show the effect.”** and the
primary link is **“Make a demo”**.

**Why this fails:** The slogan does not say “record a selected tab/window”,
does not name creative-technology students, and “Make a demo” does not name a
result. The only viable first action is unclear until the visitor scrolls.

**Concrete fix:** Replace the first screen with, for example:

> **Record a portfolio interaction demo**
>
> For creative-technology students who need a short video proof of a fragile
> browser prototype.
>
> **Try it with sample data** — opens a finished example recording, poster,
> and marked interaction beat.

Keep the three facts beside it as short lines: **Local media**, **No upload**,
and **20, 30, or 45 seconds** (only after their claim tests exist).

### F-1-6 — MAJOR — All visitor-facing claims are unlisted

**Location/evidence:** Because F-1-3's registry is missing, every following
claim-like sentence has no claims entry. These are individual unlisted claims,
not copy-only statements:

| Source | Exact unlisted claim |
| --- | --- |
| Landing hero | “Turn a fragile interaction into a credible 20–45 second proof—video, marked beat, caption, and poster—without sending your work to a cloud.” |
| Landing recorder | “Select a tab, mark the interaction as it happens, then export. Screen permission is requested only when you start.” |
| Landing recorder | “Nothing is uploaded. Chrome, Edge, and Firefox provide the strongest WebM support.” |
| Landing shelf | “Your first capture will wait here—even after you close the tab.” |
| Landing paid section | “Demo Loop is useful for free: record, keep 3 local takes, and export every video, poster, or backup. A $9 Loop Pass adds unlimited local take history and full-width poster output.” |
| Landing paid list | “One payment, no recurring fee”; “Restore your license on another device”; “Core exports always stay free.” |
| Landing footer | “Your media stays in this browser.” |
| README opening | “It records a selected tab or window for 20–45 seconds, optionally mixes microphone audio, marks one cause-and-effect beat, and exports a WebM plus a captioned PNG poster.” |
| README opening | “Everything media-related stays in the browser. There is no upload, account, analytics, or cloud project store. The PWA works offline after its first visit.” |
| README v1 list | Each capability bullet, including capture, duration, keyboard shortcuts, marker, exports, IndexedDB persistence, paid limits, offline shell, reduced motion, and 390px responsiveness. |
| README compatibility | “Chrome, Edge, and Firefox on desktop provide the strongest capture support.” |
| README privacy/billing | “Recordings, posters, captions, and beat markers are stored locally in IndexedDB.”; “Purchase checkout and daily license verification use only the Sociobot billing API.” |

**Why this fails:** A prospective user is asked to rely on privacy, offline,
storage, export, compatibility, and purchase promises that have no verifier
proof.

**Concrete fix:** Add the claims and tests specified in F-1-3, or delete each
statement until it is provable. The request-log test must cover the whole demo
flow, not merely initial page load.

### F-1-7 — MAJOR — Required routes, metadata, and route focus are incomplete

**Location/evidence:**

- `/404` returns HTTP 200 and renders the home hero rather than a designed
  not-found page. `/robots.txt` and `/sitemap.xml` return HTTP 404.
- The source and live document contain no canonical link, Open Graph tags,
  Twitter tags, `robots.txt`, sitemap, or `staticwebapp.config.json`.
- The home title is **“Demo Loop — Capture the cause. Show the effect.”**, a
  slogan rather than plain “what it does”. `/privacy` is titled
  **“Privacy, in plain ink — Demo Loop”**; the h1 is the same mood heading,
  not “Privacy”. Its reused home description is also inaccurate for that
  route.
- Clicking Privacy leaves focus on `BODY#`; no live route announcement is
  emitted. Back also leaves focus on `BODY#`. This was verified in a fresh
  mobile context.
- The footer lacks the required **“Built by Param Factory”** and version/build
  identifier. The header has no Privacy link.

**Why this fails:** Shared URLs have no correct metadata or recoverable 404
experience. Keyboard and screen-reader users are not placed at the changed
page's h1.

**Concrete fix:** Add a physical/designed `/404` with an explicit return link;
`robots.txt`, `sitemap.xml`, and a valid Static Web Apps config with a 404
rewrite and navigation fallback. Provide per-route plain titles, descriptions,
canonical and OG/Twitter metadata, including a 1200×630 product image. On
every navigation set focus to a temporary-focusable h1 and announce the route
through a polite live region. Make the header/footer skeleton complete on all
routes.

### F-1-8 — MAJOR — Required platform hardening is absent (regression of previous P3)

**Location/evidence:** The live home response includes HSTS, nosniff, and a
referrer policy but has no `Content-Security-Policy` or
`Permissions-Policy`. The repository has no `staticwebapp.config.json`.
Earlier verification reported the same P3 and the deployed source still lacks
the configuration.

**Why this fails:** The product deliberately requests display capture and
optional microphone access, but it does not ship the requested least-privilege
browser policy or an executable CSP.

**Concrete fix:** Configure response headers in `staticwebapp.config.json`:
a CSP matching same-origin local assets and the intentional Sociobot API call,
plus a least-privilege Permissions-Policy that preserves intentional
display-capture/microphone behavior. Verify no CSP console violations on all
routes.

### F-1-9 — MAJOR — Required demo documentation is missing

**Location/evidence:** `.factory/demo.md` is absent, as are any `/demo` or
`?demo=1` instructions in README. README's verification instructions only
exercise the normal application.

**Why this fails:** A catalog, reviewer, or future maintainer has no stable
demo URL, sample-data inventory, reset instructions, or storage-isolation
description.

**Concrete fix:** Add `.factory/demo.md` documenting `/demo`, the exact sample
recording/poster/caption, reset and Start-for-real behavior, the isolated
storage namespace, and the claim tests that use it. Link it from README.

### F-1-10 — MINOR — Landing copy uses slogan/metaphor headings and vague language

**Location/evidence and concrete rewrites:**

| Exact copy | Problem | Proposed rewrite |
| --- | --- | --- |
| “Capture the cause. Show the effect.” | Mood slogan; no job or audience. | “Record a portfolio interaction demo” |
| “Make a demo” | Button is not a result-naming verb. | “Try it with sample data” |
| “THE RECORDING BENCH” | Metaphor heading. | “Record your interaction” |
| “One clean take, three moves.” | Metaphor and the adjective “clean”; section name is unclear out of context. | “Record, mark the beat, and export” |
| “WHY IT WORKS” / “A demo is a tiny argument.” | The latter is a metaphor and does not name the section. | “How to show an interaction clearly” |
| “LOCAL TAKE SHELF” / “Your recent proofs” | “Shelf” and “proofs” change the domain terms. | “Saved recordings” |
| “Keep the whole process, not another subscription.” | Marketing slogan; no entitlement named. | “Loop Pass: unlimited saved recordings” |
| “fragile interaction”, “credible”, “One clean take” | Vague/marketing adjectives. | “browser prototype”, “short portfolio recording”, and delete “clean”. |

### F-1-11 — MINOR — Copy exceeds the 22-word cap and README has inconsistent terms

**Location/evidence:** The landing paid sentence is 31 words:

> “Demo Loop is useful for free: record, keep 3 local takes, and export every
> video, poster, or backup. A $9 Loop Pass adds unlimited local take history
> and full-width poster output.”

README's 27-word opening capability sentence also exceeds the cap:

> “It records a selected tab or window for 20–45 seconds, optionally mixes
> microphone audio, marks one cause-and-effect beat, and exports a WebM plus a
> captioned PNG poster.”

The reader is variously offered “proof”, “demo”, “take”, “recording”, and
“portfolio interaction” for the same recording. The product should choose one
term; “recording” is the clearest.

**Concrete fix:** Rewrite the landing paid copy as two usable sentences:
“The free plan saves three recordings. It exports every video, poster, and
backup.” “Loop Pass costs $9 once. It saves unlimited recordings and exports
full-width posters.” Rewrite README similarly: “Record a selected tab or
window for 20, 30, or 45 seconds. Add microphone audio, mark one beat, and
export a WebM and PNG poster.” Use **recording** throughout.

### F-1-12 — MINOR — Previous mobile performance failure remains unresolved

**Location/evidence:** Earlier independent verification measured mobile
Lighthouse Performance **89**, below its stated >=90 gate. It reported the
candidate was byte-for-byte deployed and later commits are documentation-only;
the live asset paths and source are unchanged. A repeat Lighthouse attempt in
this review could not connect its CLI launcher to the supplied Playwright
browser, so this review does not claim a new score.

**Why this remains a finding:** There is no new passing measurement or product
change that could establish a fix.

**Concrete fix:** Profile mobile LCP/TBT, reduce the remaining main-thread
work, then record a repeatable >=90 mobile Lighthouse result in the handoff.

## Copy audit

Word counts use visible words; a number/range such as `20–45` counts as one.
Labels and headings are included because a cold visitor hears them as part of
the experience. Flagged items are covered by F-1-10 or F-1-11.

### Landing page

| Location | Copy | Words |
| --- | --- | ---: |
| Brand | Demo Loop | 2 |
| Hero label | NEW TAKE / PORTFOLIO PROOF TOOL | 5 |
| Hero h1 | Capture the cause. | 3 |
| Hero h1 | Show the effect. | 3 |
| Hero lede | Turn a fragile interaction into a credible 20–45 second proof—video, marked beat, caption, and poster—without sending your work to a cloud. | 21 |
| Primary link | Make a demo | 3 |
| Hero fact | LOCAL ONLY | 2 |
| Hero fact | NO UPLOAD | 2 |
| Hero art caption | INPUT / VISIBLE RESPONSE | 3 |
| Recorder label | THE RECORDING BENCH | 3 |
| Recorder h2 | One clean take, three moves. | 5 |
| Recorder description | Select a tab, mark the interaction as it happens, then export. Screen permission is requested only when you start. | 19 |
| Steps | Capture / Mark the beat / Export | 6 |
| Form labels | Take name / One-line caption / Maximum length | 7 |
| Duration choices | 20 seconds / 30 seconds / 45 seconds | 6 |
| Mic label | Add microphone / Requested after screen access | 5 |
| Record button | Choose a tab & record | 5 |
| Support note | Nothing is uploaded. Chrome, Edge, and Firefox provide the strongest WebM support. | 12 |
| Empty state | Your selected tab will appear here | 7 |
| Empty-state tip | Tip: rehearse the single cause-and-effect moment first. | 7 |
| Status | Ready when you are. | 4 |
| Method label | WHY IT WORKS | 3 |
| Method h2 | A demo is a tiny argument. | 6 |
| Method step | Show the input / Keep the cursor, hand, or control visible before the action. | 13 |
| Method step | Mark the moment / Press M when it happens. That exact frame becomes your poster. | 14 |
| Method step | Hold the result / Leave a few seconds after the change so a reviewer can read it. | 16 |
| Shelf label/h2 | LOCAL TAKE SHELF / Your recent proofs | 6 |
| Backup actions | Export backup / Import backup | 4 |
| Empty shelf | No takes yet. Your first capture will wait here—even after you close the tab. Record the first one. | 20 |
| Paid label | LOOP PASS / ONE-TIME | 4 |
| Paid h2 | Keep the whole process, not another subscription. | 8 |
| Paid description | Demo Loop is useful for free: record, keep 3 local takes, and export every video, poster, or backup. A $9 Loop Pass adds unlimited local take history and full-width poster output. | 31 |
| Paid facts | One payment, no recurring fee / Restore your license on another device / Core exports always stay free | 16 |
| Price/action | $9 USD ONE TIME / Buy Loop Pass | 6 |
| License state | No license on this browser. / Have a license? / Verify & unlock | 13 |
| Legal/payment note | Checkout by Sociobot/Dodo. Terms. Privacy. | 5 |
| Footer | Demo Loop. Your media stays in this browser. | 9 |
| Art credit | AI-assisted original illustration, made for Demo Loop. | 7 |

### README

| Location | Sentence or list item | Words |
| --- | --- | ---: |
| Opening | Demo Loop turns a fragile browser prototype into a compact, credible proof of interaction. | 14 |
| Opening | It records a selected tab or window for 20–45 seconds, optionally mixes microphone audio, marks one cause-and-effect beat, and exports a WebM plus a captioned PNG poster. | 27 |
| Opening | It is built for creative-technology students preparing portfolio work without a video-editing detour. | 13 |
| Privacy | Everything media-related stays in the browser. | 6 |
| Privacy | There is no upload, account, analytics, or cloud project store. | 10 |
| Privacy | The PWA works offline after its first visit. | 8 |
| v1 list | Explicit tab/window capture with optional microphone and WebM codec fallback | 8 |
| v1 list | 20, 30, or 45 second cap, early finish, M/S keyboard shortcuts, and live timecode | 13 |
| v1 list | One interaction-beat marker with adjustable poster frame | 6 |
| v1 list | WebM and PNG exports, plus full JSON backup/import | 8 |
| v1 list | IndexedDB take shelf that survives refresh and install | 8 |
| v1 list | Free core workflow with three saved takes; $9 one-time Loop Pass for unlimited history and full-width posters | 17 |
| v1 list | Installable offline shell, privacy and terms pages, reduced motion, and responsive 390px layout | 12 |
| Compatibility | Chrome, Edge, and Firefox on desktop provide the strongest capture support. | 10 |
| Compatibility | Screen audio depends on the browser and surface selected in its share prompt. | 13 |
| Compatibility | Safari/WebKit codec support varies. | 4 |
| Compatibility | Demo Loop is for portfolio evidence, not archival recording. | 9 |
| Run | Requires Node.js 22+. | 3 |
| Run | Open the printed local URL. | 5 |
| Run | Screen capture requires a secure context; localhost is considered secure by browsers. | 12 |
| Tests | npm test runs unit tests and Playwright against desktop Chromium and a 390×844 mobile viewport. | 14 |
| Tests | It covers the capture/export journey with a synthetic media stream, permission denial, axe accessibility, legal routes, and explicit offline reload. | 18 |
| Build | The reproducible deployment command is exactly npm run build. | 9 |
| Build | Static output lands in dist/, with dist/index.html, physical privacy/ and terms/ route entries, the service worker, manifest, and local assets. | 19 |
| Privacy/billing | Recordings, posters, captions, and beat markers are stored locally in IndexedDB. | 11 |
| Privacy/billing | A complete backup can be exported from the take shelf. | 10 |
| Privacy/billing | Purchase checkout and daily license verification use only the Sociobot billing API; Dodo is the merchant of record. | 18 |
| Privacy/billing | The repository contains no product ID or payment-provider integration. | 9 |
| Privacy/billing | Staging uses pilot-api.sociobot.in; the factory replaces that base URL at release. | 11 |

## Claims, sandbox, history, and structure checks

| Check | Result | Evidence |
| --- | --- | --- |
| Clean local commands | Pass, but insufficient | `npm ci`, `npm test` (2 unit + 10 Playwright), and `npm run build` passed. |
| Claim tests | Fail | Required `claims.json` and tags are absent. |
| Demo entry | Fail | `/demo` and `?demo=1` are empty normal mode. |
| Demo storage isolation | Fail | One real `demo-loop-local` IndexedDB namespace; no demo branch. |
| Privacy request log | Inconclusive/fail | A cold home load used only same-origin requests, but no demo flow exists to verify. |
| Earlier P1 checkout | Unfixed | Live pilot checkout returned 404; source hard-codes pilot API. |
| Earlier P2 performance | Unfixed/not re-proven | Existing 89 score has no superseding passing result. |
| Earlier P3 headers | Unfixed | No live CSP or Permissions-Policy. |
| Title/lang/main/h1/alt | Mixed | `lang`, main, one h1, favicon and meaningful hero alt pass. Titles are slogan/mood titles. |
| Canonical/OG/Twitter | Fail | None present. |
| 404, robots, sitemap | Fail | No designed 404; robots and sitemap are 404. |
| Route focus/announcement | Fail | Privacy navigation left focus on body; no route announcement. |
| Link crawl | Fail | Live checkout is 404; internal Privacy/Terms are 200. |
| Header/footer skeleton | Fail | Missing header Privacy and footer factory/build line. |
| Visual identity | Pass | Original print-system art and control treatment are visibly product-specific. |
| Missed leverage | No additional finding | Import/export is present. The brief does not imply an AI task, so adding AI would be decorative rather than useful. |

## What would make this perfect

Ship a real `/demo` whose first screen already contains a believable finished
interaction recording, mark, poster, and isolated resettable data; prove each
promise from that state; replace all slogans with direct recording language;
restore a working $9 checkout; and complete the standard route/metadata,
404, security-header, focus, and documentation contract. Then a first-time
student could immediately understand the tool, try it safely, and decide
whether to trust it.
