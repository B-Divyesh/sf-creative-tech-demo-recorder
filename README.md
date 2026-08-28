# Demo Loop

Demo Loop turns a fragile browser prototype into a compact, credible proof of interaction. It records a selected tab or window for 20–45 seconds, optionally mixes microphone audio, marks one cause-and-effect beat, and exports a WebM plus a captioned PNG poster. It is built for creative-technology students preparing portfolio work without a video-editing detour.

Everything media-related stays in the browser. There is no upload, account, analytics, or cloud project store. The PWA works offline after its first visit.

Live: <https://creative-tech-demo-recorder.sociobot.in>

## What v1 includes

- Explicit tab/window capture with optional microphone and WebM codec fallback
- 20, 30, or 45 second cap, early finish, M/S keyboard shortcuts, and live timecode
- One interaction-beat marker with adjustable poster frame
- WebM and PNG exports, plus full JSON backup/import
- IndexedDB take shelf that survives refresh and install
- Free core workflow with three saved takes; $9 one-time Loop Pass for unlimited history and full-width posters
- Installable offline shell, privacy and terms pages, reduced motion, and responsive 390px layout

Chrome, Edge, and Firefox on desktop provide the strongest capture support. Screen audio depends on the browser and surface selected in its share prompt. Safari/WebKit codec support varies. Demo Loop is for portfolio evidence, not archival recording.

## Run locally

Requires Node.js 22+.

```sh
npm ci
npm run dev
```

Open the printed local URL. Screen capture requires a secure context; `localhost` is considered secure by browsers.

## Test and build

```sh
npm test
npm run build
```

`npm test` runs unit tests and Playwright against desktop Chromium and a 390×844 mobile viewport. It covers the capture/export journey with a synthetic media stream, permission denial, axe accessibility, legal routes, and explicit offline reload.

The reproducible deployment command is exactly `npm run build`. Static output lands in `dist/`, with `dist/index.html`, physical `privacy/` and `terms/` route entries, the service worker, manifest, and local assets.

## Privacy and billing

Recordings, posters, captions, and beat markers are stored locally in IndexedDB. A complete backup can be exported from the take shelf. Purchase checkout and daily license verification use only the Sociobot billing API; Dodo is the merchant of record. The repository contains no product ID or payment-provider integration. Staging uses `pilot-api.sociobot.in`; the factory replaces that base URL at release.

See [the opportunity brief](.factory/brief.json), [visual system and asset provenance](.factory/design.md), and [build handoff](.factory/handoff.md).

## License

MIT © 2026 Sociobot (Param Factory).
