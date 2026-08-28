# Demo Loop — polish round 1 handoff

## Outcome

All findings in `.factory/review-1.md` and the earlier `.factory/verification.md` are resolved. The repaired static PWA is deployed at <https://creative-tech-demo-recorder.sociobot.in>.

The distinct risograph field-notebook identity remains. The product now explains its job on the first screen and opens a finished, isolated sample in one click.

## Shipped

- `/demo` and `/?demo=1` seed a real 24-second WebM, poster, caption, 00:09 beat, and saved-recording card.
- Demo data uses `demo:demo-loop-local`; real data stays in `demo-loop-local`. Reset and exit delete only demo data.
- Production checkout and verification use only `https://api.sociobot.in/api/v1`.
- Returned licenses are saved under `sb_license:creative-tech-demo-recorder`, removed from the URL, and verified.
- The free plan keeps three recordings. A valid Loop Pass allows more and exports 1920-pixel posters from large sources.
- Home, demo, privacy, terms, and 404 views have their own title, description, canonical, focus target, and announcement.
- The release includes robots, sitemap, social card, manifest MIME mapping, response-header CSP, Permissions-Policy, and a designed 404.
- JS and CSS filenames are content-hashed and receive immutable caching. The service worker precaches the generated names.
- `.factory/claims.json`, `.factory/demo.md`, `.factory/copy-audit.md`, `.factory/catalog-description.txt`, and `.factory/polish-1.md` are complete.

## Verification evidence

Clean-clone verification:

```sh
npm ci
npm test
npm run build
```

- `npm ci`: 138 packages, 0 vulnerabilities.
- `npm test`: 2 Vitest tests passed. Playwright reported 34 passed and 16 intentional project skips.
- Every command in `.factory/claims.json` passed independently from `/tmp/demo-loop-clean-WaiBdi` at implementation commit `54613be`.
- The final cache-hardening change passed the complete suite again.
- `npm run build`: JS 31.45 KB raw/11.66 KB gzip; CSS 20.19 KB raw/5.36 KB gzip; fonts 56.05 KB total; mobile hero 73.89 KB.
- Lighthouse 12.8.2 mobile: Performance 99, Accessibility 100, Best Practices 100; FCP 0.9s, LCP 2.1s, TBT 20ms, CLS 0.
- Axe found no serious or critical issues on `/`, `/demo`, `/privacy`, `/terms`, or `/404`.
- The factory URL verifier found one h1, `lang="en"`, a main landmark, no missing alt text, no unlabeled buttons, and no console errors.
- Desktop and 390×844 screenshots are under `.factory/evidence/`. Both widths have no horizontal overflow.
- Offline Playwright verification reloaded `/demo` with the seeded recording visible.

Production verification:

- Azure Static Web Apps production deploy completed successfully.
- Cold home and demo checks returned HTTP 200 with the correct titles and zero browser console errors.
- `/robots.txt`, `/sitemap.xml`, `/404`, `/demo`, `/privacy`, `/terms`, and `/assets/social-card.jpg` returned HTTP 200.
- Production responses include CSP, Permissions-Policy, HSTS, nosniff, strict referrer policy, and frame denial.
- The production manifest is served as `application/manifest+json`.
- `https://api.sociobot.in/api/v1/products/creative-tech-demo-recorder/checkout` returned HTTP 303 to hosted `checkout.dodopayments.com` content showing `$9`.
- The live verification endpoint returned `{ "valid": false, "reason": "invalid", "expires_at": null }` for a synthetic invalid token.
- Recorded valid and revoked verdict fixtures verify returned-token, paste-to-restore, paid limit, paid poster, and revocation behavior without making a charge.

Key artifacts: [.factory/polish-1.md](polish-1.md), [.factory/claims.json](claims.json), and [.factory/evidence/live-demo/screenshot-mobile.png](evidence/live-demo/screenshot-mobile.png).

## Known gaps

None. A real card charge was intentionally not made; the live hosted checkout redirect and price were verified, while returned-license behavior uses the documented recorded verdict fixture required by the claims contract.
