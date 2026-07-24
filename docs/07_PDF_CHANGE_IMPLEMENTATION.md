# PDF Change Implementation Log

## Source reviewed

- File: `CULMINATING PROJECT DOCUMENTATION.pdf`
- Reviewed: 2026-07-24
- Pages: 3
- SHA-256: `2a89a65343a03a79e2d23a3390148f82374475ad66e040b6c26dcf753a5cd7b0`

The PDF was extracted and every page was visually inspected before implementation.

## Request-to-change trace

| PDF annotation | Implementation | Evidence |
|---|---|---|
| Display complete room names | The HUD, side panel, transitions, and map now use each room’s full `name`; abbreviated `shortName` data was removed. | `08-full-room-names.png` |
| Two `E` interactions appear together | The journal hotspot was removed with the journal feature, leaving one context-sensitive interaction at every node. | `04-split-corridor-single-interaction.png` |
| `+infty` / `-infty` appears instead of ∞ | Choice-option LaTeX now preserves backslashes with `String.raw`, including the DNE text command. | `05-infinity-symbol.png` |
| Entity eyes are misaligned | The fixed CSS eye pair was removed. Each room’s Entity now uses only the eyes positioned in its procedural scene artwork; the pressure overlay is a vignette only. | `09-entity-eyes-aligned.png` |
| Room view turns black | Room texture changes now cancel stale tweens, swap immediately at 68% opacity, and fade upward to 100%; the scene never fades to zero. | `06-room-2-transition.png`, `07-room-2-visible.png` |
| Remove journals | Journal content, types, state methods, score event, controls, HUD items, hotspots, dialogs, ending requirements, tests, and documentation were removed. Maximum score is now 3,800. | Automated tests and browser DOM checks |
| Replace start page, credits, and introduction with Canva designs | Implemented with the approved `FrontPage and Loading Screen.jpeg` and `Credit Header.jpeg` exports. The Entity artwork now anchors the main menu and introduction; the title banner now anchors Project Credits. Live interface text and controls remain accessible HTML. | `src/assets/front-and-loading.jpeg`, `src/assets/credits-header.jpeg` |

## Verification performed

- `npm run check`: TypeScript passed; 3 test files and 17 tests passed.
- `npm run build`: production single-file build completed successfully.
- Browser walkthrough: content warning → new game → Room 1 → all three Room 1 questions → Mara rescue → Room 2.
- Infinity choices rendered as `+∞` and `−∞`.
- Split Corridor exposed exactly one hotspot button.
- Full names for all five rooms appeared in the map.
- Room 2 remained visible after the room transition.
- At 1280 × 720, document scroll size exactly matched the viewport.
- Browser console: no warnings or errors during the affected walkthrough.

## Screenshot evidence

- `screenshots/02-room-1-gameplay.png`
- `screenshots/03-solution-interface.png`
- `screenshots/04-split-corridor-single-interaction.png`
- `screenshots/05-infinity-symbol.png`
- `screenshots/06-room-2-transition.png`
- `screenshots/07-room-2-visible.png`
- `screenshots/08-full-room-names.png`
- `screenshots/09-entity-eyes-aligned.png`

## Canva asset handoff

The approved screen exports were received and integrated on 2026-07-24:

1. `front-and-loading.jpeg` — shared main-menu and introduction artwork
2. `credits-header.jpeg` — Project Credits header artwork

The source exports remain outside the runtime bundle. Optimized copies live under `src/assets/`, while all controls, credits, introductory copy, calculus equations, and answers remain live HTML or KaTeX rather than being embedded in the images.
