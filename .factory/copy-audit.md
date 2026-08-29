# Demo Loop copy audit

Audited 2026-08-29 against the rendered home and demo routes and the README. Counts treat a hyphenated term, filename, or number as one word.

## First screen

| Location | Sentence or label | Words | Result |
| --- | --- | ---: | --- |
| Hero label | Portfolio tool / browser recorder | 4 | Pass |
| H1 | Record a browser interaction for your portfolio | 7 | Pass |
| Hero description | For creative-technology students who need a 20–45 second video of a prototype working. | 13 | Pass |
| Primary action | Try it with sample data | 5 | Pass |
| Action note | Opens a finished recording, poster, and marked beat. | 8 | Pass |
| Fact | Media stays in this browser | 5 | Pass |
| Fact | Nothing is uploaded | 3 | Pass |
| Fact | Choose 20, 30, or 45 seconds | 6 | Pass |
| Art caption | Input / visible response | 3 | Pass |

The first screen states the job, audience, action, and result in one breath. Its three facts map to `local-only-network` and `capture-length-options`.

## Recorder and results

| Location | Sentence or label | Words | Result |
| --- | --- | ---: | --- |
| Recorder heading | Record, mark the beat, and export | 6 | Pass |
| Recorder description | Select a tab or window. | 5 | Pass |
| Recorder description | Mark the response while recording, then export the video and poster. | 11 | Pass |
| Record action | Choose a tab and record | 6 | Pass |
| Permission note | Screen permission starts only after this button. | 7 | Pass |
| Permission note | Media does not leave the browser. | 6 | Pass |
| Empty preview | Your selected tab appears here. | 5 | Pass |
| Empty preview | Show the input before the response. | 6 | Pass |
| Review action | Record another interaction | 3 | Pass |
| Saved action | Review [recording name] | 3+ | Pass |
| Delete action | Delete [recording name] | 3+ | Pass |
| Empty recordings | No recordings yet. | 3 | Pass |
| Empty recordings | Your next recording will appear here. | 6 | Pass |
| Empty action | Record an interaction | 3 | Pass |
| Permission error | Nothing was recorded. | 3 | Pass |
| Permission recovery | Choose Share in the browser prompt when ready. | 8 | Pass |
| Unsupported error | This browser cannot record a screen. | 6 | Pass |
| Unsupported recovery | Use a computer browser with screen capture and WebM support. | 10 | Pass |

## Explanation, limits, and payment

| Location | Sentence or label | Words | Result |
| --- | --- | ---: | --- |
| Method heading | Show an interaction clearly | 4 | Pass |
| Method | Keep the cursor, hand, or control visible before the action. | 10 | Pass |
| Method | Press M when it happens. | 5 | Pass |
| Method | That frame becomes the poster. | 5 | Pass |
| Method | Wait a few seconds so a reviewer can read the change. | 11 | Pass |
| Limits heading | What Demo Loop does not do | 6 | Pass |
| Limit | It does not upload recordings. | 5 | Pass |
| Limit | It does not replace an archival video editor. | 8 | Pass |
| Paid heading | Loop Pass removes the three-recording limit | 6 | Pass |
| Paid description | The free plan saves three recordings. | 6 | Pass |
| Paid description | WebM, PNG, and JSON exports remain available. | 7 | Pass |
| Paid description | Loop Pass costs $9 once. | 5 | Pass |
| Paid description | It saves more than three recordings and exports 1920-pixel posters from large sources. | 12 | Pass |
| Paid fact | $9 one-time checkout through Sociobot | 5 | Pass |
| Paid fact | Restore the license on another device | 6 | Pass |
| Paid fact | No three-recording limit after verification | 5 | Pass |
| License state | No license on this browser. | 5 | Pass |
| Checkout note | Checkout starts on Sociobot and opens a Dodo payment page. | 10 | Pass |
| Footer | Record browser interactions for a portfolio. | 6 | Pass |

## Demo route

| Location | Sentence or label | Words | Result |
| --- | --- | ---: | --- |
| Banner | Demo — sample data, nothing is saved | 6 | Pass |
| Banner detail | Changes stay in a separate demo workspace. | 7 | Pass |
| Demo H1 | Review a sample recording | 4 | Pass |
| Demo description | See the controller response at the marked beat. | 8 | Pass |
| Sample caption | Turning the dial stretches the projected letters. | 7 | Pass |
| Demo status | Sample ready. | 2 | Pass |
| Demo status | Play it, move the marked beat, or export both files. | 10 | Pass |

No audited sentence exceeds 22 words. No banned marketing word appears in visitor-facing copy.

## README storage wording

| Location | Sentence | Words | Result |
| --- | --- | ---: | --- |
| Capability | Imports a JSON backup and keeps saved recordings in browser storage. | 10 | Pass |
| Privacy | The demo and real workspaces store recordings separately in your browser. | 11 | Pass |

The README names the user-visible browser behavior. Implementation names remain in the maintainer-facing demo contract.

## Terminology

| Concept | Required term |
| --- | --- |
| Captured media item | recording |
| Marked response moment | beat |
| Still-image export | poster |
| Paid license | Loop Pass |
| Isolated example | demo |
