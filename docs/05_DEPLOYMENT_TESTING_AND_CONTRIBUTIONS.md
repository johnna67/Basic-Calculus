# Deployment, Testing, and Contribution Plan

## GitHub repository setup

```bash
git init
git add .
git commit -m "Complete Infinite Loop calculus game"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

## Local verification

```bash
npm ci
npm run check
npm run build
npm run preview
```

Expected output:

- TypeScript passes
- All automated tests pass
- `dist/index.html` is generated
- The production preview opens without console errors

## GitHub Pages

1. Open the repository on GitHub.
2. Go to **Settings > Pages**.
3. Select **GitHub Actions**.
4. Push to `main` or run the workflow manually.
5. The workflow installs, tests, builds, and uploads `dist/`.

The final URL will normally be:

```text
https://USERNAME.github.io/REPOSITORY-NAME/
```

The game uses relative paths and a single-file build, so a repository-specific Vite base path is not required.

## Hosting limits and privacy

- Saves are local to the current browser and device.
- There are no accounts or global leaderboard.
- No API key is placed in the browser.
- No database or server is required.
- Keep `package-lock.json` committed so GitHub installs the tested versions.

## Automated test result

```text
Test files: 3 passed
Tests: 17 passed
TypeScript check: passed
Production build: passed
```

The tests verify:

- Integer, decimal, fraction, and negative-number input
- Rejection of malformed numeric input
- Multiple-choice validation
- Five rooms and seventeen questions
- Lessons 1–12 coverage
- Six limits examples
- Complete hints, solutions, and explanations
- Maximum score of 3,800
- First-attempt bonus removal after a mistake
- Hint charged only once
- Entity capture reset and time penalty
- True Escape, Hollow Escape, and Lost Soul

## Browser quality assurance

A browser walkthrough verified:

- Content warning loads
- New Game opens the introduction
- Skip opens Room 1
- Phaser canvas renders
- `E` opens the first puzzle
- Numeric answer `4` is accepted
- Score becomes 150 on the first attempt
- Worked solution renders through KaTeX
- The Split Corridor exposes one interaction hotspot
- Infinity choices render as `+∞` and `−∞`
- Full room names appear in the HUD, side panel, and map
- Room 2 remains visible after its transition
- Removed journal controls and hotspots do not appear
- No browser console or page errors

Viewports tested:

| Viewport | Result |
|---|---|
| 1440 × 900 | Passed |
| 1280 × 720 | Passed; no document overflow |

## Manual final test checklist

- [ ] Chrome/Chromium desktop
- [ ] Safari or Edge desktop
- [ ] New Game
- [ ] Continue after refresh
- [ ] Keyboard-only navigation
- [ ] Mouse-only navigation
- [ ] Incorrect-answer retry
- [ ] Hint deduction
- [ ] Spirit rescue and leave
- [ ] All room transitions
- [ ] True Escape
- [ ] Hollow Escape
- [ ] Lost Soul and checkpoint resume
- [ ] Reduced motion
- [ ] High contrast
- [ ] Larger text
- [ ] Volume at zero and above zero
- [ ] Fullscreen

## Responsibility matrix

| Member | Role | Final deliverables |
|---|---|---|
| Banal, Elyssa Mae | Project Lead | Roadmap, Issue assignment, integration approval, submission |
| Causo, Staccie Norrainne | Game Writer | Intro, room narration, dialogue, endings |
| De Veyra, Jaden Arabella | Game Developer | TypeScript/Phaser, saves, input, deployment, fixes |
| Esperanza, Princess Johnna | Game Designer | Question flow, scoring, pressure, difficulty, testing |
| Guino, Sophia Francesca | Creative Director | Art bible, concept-art review, palette, visual QA |
| All members | Shared | Calculus verification, playtests, evidence, demonstration |

## Updated schedule

### Week 8 — June 29 to July 3

- Finalize title, concept, audience, topics, and roles
- Select browser deployment

### Week 9 — July 6 to July 10

- Finalize room flow and question bank
- Define scoring, spirits, achievements, and endings
- Establish visual direction

### Week 10 — July 13 to July 17

- Implement title, Room 1, puzzle engine, KaTeX, score, timer, pressure, and saves
- Create the first GitHub Pages deployment
- Conduct the first playtest

### Week 11 — July 20 to July 24

- Complete Rooms 2–5
- Integrate spirits, achievements, endings, accessibility, and audio
- Conduct mathematical and technical review

### Week 12 — July 27 to July 31

- Resolve bugs and layout issues
- Test keyboard and mouse completion
- Capture evidence
- Complete documentation and member contribution records
- Submit the repository, public game link, and final report

## Contribution log template

| Date | Start–End | Member | Issue / Task | Work completed | Evidence | Reviewer |
|---|---|---|---|---|---|---|
| YYYY-MM-DD | 00:00–00:00 | Name | #Issue | Specific change | Commit / PR / screenshot | Name |

A task is complete only when it exists, has been tested by another member, has mathematical review when applicable, and has evidence attached.
