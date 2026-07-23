# Codex Project Instructions

## Mission

Maintain and improve **Infinite Loop: No Escape**, a desktop-first, first-person, node-based calculus horror escape game. The project must remain a static browser application that can be built with Vite and deployed to GitHub Pages.

## Read before editing

1. `CODEX_START_HERE.md`
2. `README.md`
3. `HANDOFF_STATUS.md`
4. `docs/00_DOCUMENTATION_INDEX.md`
5. The relevant design, mechanics, question-bank, and art documents under `docs/`

The original approved proposal is stored at `reference/BASCALC_Culminating_Project_Proposal.pdf`.

## Standard commands

```bash
npm ci
npm run check
npm run build
npm run dev -- --host 0.0.0.0
```

Use `npm ci`, not `npm install`, for reproducible setup unless dependencies are intentionally being changed.

## Non-negotiable product requirements

- Preserve five playable rooms and the cumulative Final Exam.
- Preserve seventeen required calculus questions covering Lessons 1–12.
- Keep at least six dedicated limits examples across Rooms 1 and 2.
- Keep complete hints, answers, explanations, and worked solutions.
- Maintain full keyboard and mouse parity for every essential action.
- Wrong answers must not permanently softlock progression.
- Keep scoring, timer, Entity pressure, spirits, achievements, checkpoints, and multiple endings functional.
- Keep the game deployable as a static site with no backend, database, user account, or secret API key.
- Keep accessibility options functional: reduced motion, high contrast, larger text, and volume control.
- Do not bake critical equations or answer text into generated images; render math as live text/KaTeX.

## Architecture map

- `src/App.ts` — primary UI and game-flow orchestration
- `src/VisualScene.ts` — Phaser visual scene
- `src/art.ts` — procedural environment and visual helpers
- `src/content.ts` — rooms, story, spirits, and achievements
- `src/questions1.ts`, `src/questions2.ts` — question data
- `src/gameStore.ts` — state, scoring, saves, answer handling, and ending logic
- `src/audio.ts` — synthesized audio and volume control
- `src/styles.css` — interface and responsive styling
- `tests/` — answer, content, and state tests
- `docs/` — teacher-facing and production documentation
- `reference/visuals/` — curated visual-development references

## Engineering rules

- Plan broad changes before editing several systems.
- Prefer small, reviewable changes over rewrites.
- Keep content data separate from rendering and state logic.
- Add or update tests for scoring, answer validation, saves, progression, achievements, and endings when those systems change.
- Do not commit `node_modules/`.
- Preserve the single-file production output unless there is a documented reason to change deployment architecture.
- Optimize runtime images before adding them to `src/assets/`.
- Update the relevant document under `docs/` whenever rules, content, controls, or deployment behavior changes.

## Definition of done

A task is complete only when:

```bash
npm run check
npm run build
```

both pass, the affected flow has been manually exercised in a browser, keyboard and mouse behavior remain equivalent, documentation is current, and no progression-blocking bug was introduced.
