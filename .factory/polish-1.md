# Demo Loop — perfection loop round 1

Candidate `8e63643135af93ae4c396a15152da98973ff77f7` was repaired from review commit `7cbdcc389307ed8f8db61a77a7d587ae1e15e623`.

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | The first-screen action is “Try it with sample data”. `/demo` and `/?demo=1` open a finished 24-second controller recording, caption, beat, poster, and saved card. The banner includes Reset demo and Start for real. | `@claim:sample-demo-isolated`; [.factory/evidence/live-demo/screenshot-mobile.png](evidence/live-demo/screenshot-mobile.png); <https://creative-tech-demo-recorder.sociobot.in/demo> |
| F-1-2 | Real recordings use `demo-loop-local`; samples use `demo:demo-loop-local`. Demo code never reads real storage or license keys. Reset and exit delete only the demo database. | `@claim:sample-demo-isolated`; [.factory/demo.md](demo.md); live `/demo` reset and exit check |
| F-1-3 | Added `.factory/claims.json` with one tagged browser test for each of 17 retained claims. | All 17 listed commands passed independently in a clean clone; `npm test` passed |
| F-1-4 | Checkout and verification now use only `https://api.sociobot.in/api/v1`. Returned tokens are stored, stripped from the URL, and verified. | `@claim:live-checkout`, `@claim:paid-unlimited`, `@claim:license-restore`, `@claim:license-revocation`; [checkout screenshot](evidence/checkout-live.png); [live cold audit](evidence/live-cold-audit.json); live endpoint returned 303 to `checkout.dodopayments.com` |
| F-1-5 | Replaced the slogan with “Record a portfolio interaction demo”, named creative-technology students and browser prototypes, and explained the demo action beside it. | [cold mobile home](evidence/live-home/screenshot-mobile.png); live `/` first-read check |
| F-1-6 | Rewrote or removed old claims and registered every retained privacy, capture, duration, export, persistence, backup, offline, accessibility, and paid statement. | `.factory/claims.json`; `@claim:*` clean-clone run; `.factory/copy-audit.md` |
| F-1-7 | Added route-specific titles/descriptions/canonicals/OG/Twitter metadata, a 1200×630 social card, `/demo`, `/privacy`, `/terms`, designed `/404`, robots, sitemap, history routing, focus transfer, announcements, and complete header/footer links. | `demo and legal routes have their own titles, metadata, focus, and landmarks`; `unknown paths render the designed 404`; [404 screenshot](evidence/not-found.png); live URLs all returned 200 |
| F-1-8 | Added executable response-header CSP and Permissions-Policy through `staticwebapp.config.json`. Added correct MIME types and hashed JS/CSS with immutable caching. | Live response includes CSP, Permissions-Policy, nosniff, referrer policy, and frame protection; hashed asset cache check |
| F-1-9 | Added `.factory/demo.md` with entry points, sample inventory, namespaces, reset/exit behavior, and verification command. README links it. | [.factory/demo.md](demo.md) |
| F-1-10 | Replaced every cited slogan/metaphor with task language and standardized on “recording”, “beat”, and “poster”. | `.factory/copy-audit.md`; [cold desktop home](evidence/live-home/screenshot-desktop.png) |
| F-1-11 | Split long sentences, removed vague wording, and kept landing sentences at 22 words or fewer. README uses the same terms. | `.factory/copy-audit.md` has no flagged sentence; catalog line is 98 characters plus newline |
| F-1-12 | Reduced initial work and retained small assets. Hashed production JS is 31.45 KB raw/11.66 KB gzip; CSS is 20.19 KB raw/5.36 KB gzip. | Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100; LCP 2.1s, TBT 20ms, CLS 0; [.factory/evidence/lighthouse-home.json](evidence/lighthouse-home.json) |
| Previous P1 | Production billing regression fixed and live mapping checked. | Same evidence as F-1-4 |
| Previous P2 | Mobile performance now exceeds 90. | Same evidence as F-1-12 |
| Previous P3 | CSP, Permissions-Policy, hashed bundle caching, and manifest MIME type now ship from production. | Same evidence as F-1-8 |

## Additional acceptance evidence

- `npm test`: 2 Vitest tests passed; Playwright reported 36 passed and 18 intentional cross-project skips across desktop and 390×844 projects.
- Axe: no serious or critical findings on `/`, `/demo`, `/privacy`, `/terms`, or `/404`.
- Mobile: no horizontal overflow; primary controls are at least 44 CSS pixels; primary navigation remains visible.
- Offline: `/demo` reloaded with its sample recording after the browser context went offline.
- Cold production checks: home and demo each had one h1, `lang="en"`, a main landmark, complete image alt text, labeled buttons, and zero console errors.
- Visual identity: the original ink, coral, cyan, yellow, halftone, registration-mark, and letterpress system remains intact.

No review finding remains open.
