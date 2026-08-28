# Independent verification — FAIL

**Work order:** `creative-tech-demo-recorder-verify-1`  
**Candidate:** `8e63643135af93ae4c396a15152da98973ff77f7` (`test: verify capture offline and accessibility flows`)  
**Live URL:** <https://creative-tech-demo-recorder.sociobot.in>  
**Run:** 2026-08-28, clean checkout in `/work/repo`

## Decision

**FAIL — do not release this candidate as the paid production product.** The live deployment is an exact byte-for-byte match for the candidate, so the broken production checkout is in the candidate rather than a deployment mismatch. The free local recorder flow is otherwise substantially working.

## Release-blocking defect

| Severity | Evidence | Required resolution |
| --- | --- | --- |
| P1 / high | The live Buy Loop Pass URL and license verification request are `https://pilot-api.sociobot.in/api/v1/products/creative-tech-demo-recorder/...`. A fresh `curl -IL` of the checkout URL returned **HTTP 404**, with no redirect. The production Sociobot verification endpoint returns the expected 200 invalid-token response, but the app does not use it. The one-time paid unlock cannot be bought or verified in production. | Register/configure the live product and build/redeploy with `https://api.sociobot.in/api/v1` for checkout and verification. Re-test checkout redirect and a valid returned-license flow. |

## Non-blocking defects / deviations

| Severity | Evidence | Recommended resolution |
| --- | --- | --- |
| P2 / medium | Fresh local-preview Lighthouse 12.8.2 mobile run: **Performance 89**, Accessibility 100, Best Practices 100; FCP 1.0s, LCP 2.1s, TBT 400ms, CLS 0. This misses the supplied PWA performance gate of >=90, although the build-size budgets pass. | Investigate main-thread work/TBT under the mobile profile and re-run Lighthouse until >=90. |
| P3 / low | Live responses include HSTS, `Referrer-Policy: strict-origin-when-cross-origin`, and `X-Content-Type-Options: nosniff`, but no `Content-Security-Policy` or `Permissions-Policy`. Static HTML/JS/CSS also use `Cache-Control: public, must-revalidate, max-age=30`; the deployed file names are not content-hashed. | Add an appropriate CSP and a least-privilege permissions policy that still permits intentional display-capture/microphone use. Configure versioned/hashed static assets with immutable caching, or document the short revalidation policy. |

## Clean local quality gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 138 packages installed; npm audit reported 0 vulnerabilities. |
| `npm test` | PASS — 2 Vitest tests and 10 Playwright tests (desktop Chromium plus 390x844 mobile) completed successfully. |
| Type/lint checks available | PASS — `npm run build` runs `tsc --noEmit`; no separate lint script is defined. |
| Exact production build | PASS — `npm run build` produced `dist/` successfully. |
| Build budgets | PASS — app JS 27,824 B / 10,619 B gzip (<200 KB); CSS 17,755 B / 4,859 B gzip (<50 KB); local fonts 56,052 B total (<120 KB); mobile hero WebP 73,890 B (<300 KB). |

## Independent browser exercise

- Normal desktop synthetic `MediaRecorder` run: keyboard-focused Start (`Enter`) -> mark (`M`) -> finish (`S`) produced a locally saved take, WebM `boundary-take.webm`, and PNG `boundary-take-poster.png`. The take remained after reload in IndexedDB. No page or console errors.
- Boundary checks: textarea enforced 90 characters; selecting 20 seconds updated the endpoint to `00:20`; blank/unsafe title export normalized to the safe file name; review poster controls were available.
- Recovery checks: denied display permission showed “Nothing was recorded…” and restored the enabled retry button; missing `mediaDevices` showed the compatibility message; malformed JSON import surfaced a parse error without crashing.
- Desktop and 390px mobile: inspected at 1440px and 390x844. At 390px there was no horizontal overflow, primary record control measured 318x49.7 CSS px, navigation intentionally collapsed, and the recorder stacked cleanly.
- Keyboard/focus: skip link was first focus target and received the designed yellow 4px outline plus ink halo; no keyboard trap encountered in the recorder flow.
- Reduced motion: under `prefers-reduced-motion: reduce`, button transition duration computed to `0.00001s`; the mobile layout remained usable.
- Accessibility: axe-core serious/critical findings were empty on `/`, `/privacy`, and `/terms`. Live smoke test also found one `h1`, a `main`, `lang="en"`, meaningful hero alt text, and no errors.

## Privacy, PWA, deployment, and network evidence

- Fresh home-page browser load requested only `https://creative-tech-demo-recorder.sociobot.in`; source review found no analytics, advertising, CDN font/script, upload, or direct payment-provider integration. Both fonts and all media assets are same-origin.
- License restoration made exactly the expected (but wrongly environmented) request to `pilot-api.sociobot.in`; invalid-token recovery stayed in the free state with “License no longer active. Free tools still work.”
- Live PWA was service-worker controlled with `demo-loop-v1-shell` and `demo-loop-v1-runtime` caches. After installation, an offline reload rendered the home heading and visible Offline notice. A controlled local worker-update simulation using the candidate worker changed `sw.js` and displayed “Fresh ink is ready. Update app” without console errors.
- SHA-256 comparisons of the live and candidate build matched for `index.html`, app JS/CSS, manifest, service worker, offline page, both fonts, all hero derivatives, all three PNG icons, and `/privacy`/`/terms` entries. The deployment therefore matches candidate `8e63643135af93ae4c396a15152da98973ff77f7` exactly.
- Live headers: HTTPS/HSTS, nosniff, and referrer policy present; document/app/worker cache response is 30 seconds as noted above. Manifest is served as `application/octet-stream` rather than a manifest MIME type, but Chromium accepted it and installed the worker.

## Reproduction commands

```sh
npm ci
npm test
npm run build
npm run preview -- --port 4173
curl -sSIL https://pilot-api.sociobot.in/api/v1/products/creative-tech-demo-recorder/checkout
```

No product code was modified by this verification. Only this report and `.factory/handoff.md` are part of the verifier handoff.
