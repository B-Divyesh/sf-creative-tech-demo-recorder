# Demo Loop sample workspace

## Entry points

- Live: `https://creative-tech-demo-recorder.sociobot.in/demo`
- Equivalent query path: `https://creative-tech-demo-recorder.sociobot.in/?demo=1`
- Local: `http://127.0.0.1:4173/demo`

The home action “Try it with sample data” opens the demo in one click.

## Included sample

The demo seeds “Kinetic type controller”, a 24-second WebM of a physical dial changing a projected shape field. It includes a caption, a beat at 00:09, a PNG poster, and a saved-recording card.

## Isolation and reset

Real recordings use IndexedDB `demo-loop-local`. Demo recordings use IndexedDB `demo:demo-loop-local`.

Demo mode never opens the real database or reads license storage. Reset demo deletes only the demo database and recreates the sample. Start for real deletes the demo database and opens `/`; it never copies demo data.

## Verification

`npm run test:e2e -- --grep @claim:sample-demo-isolated` seeds private real data, exercises the demo, resets it, exits, and checks that real data remains unchanged.

All other claim commands are recorded in `.factory/claims.json`. Offline, export, backup, and privacy claims start from the demo entry point.
