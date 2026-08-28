# Demo Loop

Record a selected browser tab or window for 20, 30, or 45 seconds. Mark one interaction beat, then export a WebM and PNG poster.

Demo Loop is for creative-technology students preparing portfolio work. Recordings stay in browser storage and remain after a reload.

Live: <https://creative-tech-demo-recorder.sociobot.in>

Sample demo: <https://creative-tech-demo-recorder.sociobot.in/demo>

## Try the isolated demo

Open `/demo` or `/?demo=1`. It loads a 24-second controller recording, marked beat, caption, poster, and saved-recording card.

The yellow banner identifies demo mode. Reset restores the sample. Start for real deletes demo storage without reading or changing real recordings.

See [.factory/demo.md](.factory/demo.md) for the storage contract and verification details.

## What it does

- Requests screen access only after you choose to record.
- Adds microphone audio when selected and available.
- Offers 20, 30, and 45 second recording limits.
- Marks one response with the M key and ends early with S.
- Exports WebM video, a PNG poster, and a complete JSON backup.
- Imports a JSON backup and keeps saved recordings in IndexedDB.
- Works offline after its first visit.
- Respects reduced-motion settings and supports keyboard operation.

Browser capture, screen audio, and WebM codecs vary by browser and device.

## Free plan and Loop Pass

The free plan saves three recordings. WebM, PNG, and JSON exports remain available.

Loop Pass costs $9 once. It saves more than three recordings and exports 1920-pixel posters from sources that are large enough.

Purchase and verification use only `https://api.sociobot.in`. Sociobot/Dodo is the merchant of record.

Returned `?license=` tokens are stored under `sb_license:creative-tech-demo-recorder`, removed from the address, and verified. Buyers can also paste a token on another device.

## Run locally

Use Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open the printed local URL. Browser capture requires a secure context, and browsers treat `localhost` as secure.

## Test and build

```sh
npm test
npm run build
```

The test suite covers unit, browser, mobile, accessibility, privacy, payment, route, offline, and every registered claim.

Each entry in [.factory/claims.json](.factory/claims.json) includes its independent command. The production build is written to `dist/`.

## Deploy

The static work order runs this command:

```sh
npm ci && npm test && npm run build
```

Deploy `dist/` without modifying it. `staticwebapp.config.json` supplies routing, the designed 404, MIME types, caching, CSP, and permissions policy.

## Privacy and ownership

Recordings, captions, posters, and beat markers stay in the selected storage namespace. The demo and real workspaces use separate IndexedDB databases.

The sample export flow sends requests only to the Demo Loop origin. See the live [privacy page](https://creative-tech-demo-recorder.sociobot.in/privacy).

## License

MIT © 2026 Sociobot (Param Factory).
