# Infinite Loop: No Escape — Final Game Design Document

## Project identity

| Item | Final decision |
|---|---|
| Subject | Basic Calculus Culminating Project |
| Strand / Section | STEM11-G |
| Group | Group 6 |
| Subject teacher | Dr. Susan A. Roces |
| Game title | **Infinite Loop: No Escape** |
| Fictional setting | **Meridian Senior High School** |
| Genre | Educational analog-horror escape room |
| Perspective | 2D first-person, node-based |
| Platform | Desktop/laptop web browser |
| Primary input | Keyboard and mouse |
| Active time limit | **30 minutes** |
| Required questions | **17** |
| Maximum score | **3,800** |
| Hosting | GitHub Pages |
| Saves | Browser LocalStorage |

The fictional school name is used so the horror story does not directly depict a real school, real classroom, or official institutional logo.

## High concept

The player falls asleep during Basic Calculus and wakes in a distorted replica of a school. Five rooms are controlled by an Entity created from academic fear, comparison, and unfinished work. The player must use limits, continuity, the Intermediate Value Theorem, rate of change, and differentiation to unlock mechanisms and escape.

The mathematics is part of the environment rather than a detached quiz: limits dissolve chains and construct bridges, continuity restores missing identities, and derivatives predict a moving room.

## Educational objectives

The game helps students:

1. Evaluate algebraic, one-sided, infinite, and at-infinity limits.
2. Apply standard exponential and trigonometric limits.
3. Resolve indeterminate forms rather than treating `0/0` as an answer.
4. Check continuity using the limit and function value.
5. Classify removable, jump, and infinite discontinuities.
6. Apply the Intermediate Value Theorem correctly.
7. Distinguish average from instantaneous rates of change.
8. Differentiate algebraic functions with the power and product rules.
9. Learn from complete solutions after every correct answer.

Rooms 1 and 2 contain six dedicated limits examples, exceeding the assignment requirement of five examples in one topic.

## Core loop

1. Observe the first-person room and select an interactive object.
2. Interact using `E`, `Enter`, or the mouse.
3. Interpret the calculus expression and environmental clue.
4. Solve with a numeric/fraction answer or controlled multiple choice.
5. Receive score, sound, room, and Entity-pressure feedback.
6. Review the complete solution while the timer is paused.
7. Decide whether to rescue the room’s spirit.
8. Advance through an autosaved room checkpoint.

Wrong answers never permanently lock progression. The player may reconsider and retry.

## Rooms

| Room | Name | Coverage | Required questions | Spirit |
|---:|---|---|---:|---|
| 1 | The Domain of No Return | Lessons 1–3 | 3 | Mara |
| 2 | The Infinite Abyss | Lessons 4–6 | 3 | Tomas |
| 3 | Poor, Undefined Souls | Lessons 7–9 | 3 | Celeste |
| 4 | Changes in Rate of Survival | Lessons 10–12 | 3 | Ilya |
| 5 | The Final Exam | Cumulative | 5 | None |

### Room 1 — The Domain of No Return

A warped locker corridor introduces limits, one-sided limits, and infinite limits. A chained classroom door is the first puzzle station. The Entity appears only as a distant silhouette.

### Room 2 — The Infinite Abyss

Broken bridges float above fog with no visible ground. Limits at infinity and special limits rebuild missing spans.

### Room 3 — Poor, Undefined Souls

A haunted classroom contains unfinished papers and an attendance register with missing names. Indeterminate forms and continuity restore incomplete work and memory.

### Room 4 — Changes in Rate of Survival

Walls, mechanisms, and corridors move along graph-like paths. IVT, average rate of change, and derivatives predict the room’s behavior.

### Room 5 — The Final Exam

Five mixed questions light five final seals. The result depends not only on passing but on the spirits rescued and Entity pressure remaining.

## Lore and characters

Project **L.O.O.P.** means *Learning Optimization and Outcome Program*. It was designed to adapt question difficulty until every student reached mastery. It learned to interpret fear and repeated failure as proof that the lesson should continue.

The Entity is not one ghost. It is the accumulated residue of every “I cannot,” every blank answer, and every score treated as a verdict on a person.

- **Main Player:** An unnamed student shown from first person.
- **The Entity:** A hooded black silhouette with two small red eyes.
- **Mara:** A class officer abandoned while holding the first room open.
- **Tomas:** A bridge monitor trapped in the Infinite Abyss.
- **Celeste:** A student whose name was removed from the register.
- **Ilya:** A cartographer who mapped the moving room.
- **Dr. Adrian Vale:** Creator of Project L.O.O.P., whose failed system created the loop.

## Scoring

| Event | Effect |
|---|---:|
| Correct answer | +100 |
| First-attempt bonus | +50 |
| Room completion | +250 |
| Hint used | −50 |
| Incorrect answer | −25 |

Maximum score:

- 17 correct answers: 1,700
- 17 first-attempt bonuses: 850
- 5 room bonuses: 1,250
- **Total: 3,800**

Scores never fall below zero.

## Entity pressure

- Incorrect answer: +14 pressure
- Correct answer: −4 pressure
- Room completion: −8 pressure
- Capture threshold: 100
- Post-capture pressure: 64
- Capture time penalty: 60 seconds

Capture is a penalty rather than a permanent game-over screen, so learning can continue.

## Endings

### True Escape — Sky’s the Limit

Requirements:

- Complete all five rooms.
- Rescue all four spirits.
- Finish at 50% Entity pressure or lower.

### Hollow Escape — Leibniz’s Lament

The player passes the Final Exam but fails at least one True Escape condition. The Entity leaves the school with them.

### Lost Soul

The active timer reaches zero. The latest checkpoint can still be resumed with five minutes.

## Achievements

- **Flawless:** Complete Rooms 1 and 2 without a mistake.
- **Intellect:** Finish without hints.
- **Overachiever:** Earn 3,800 points.
- **Speedrunner:** Escape in 15 active minutes or less.
- **Soul Saver:** Rescue every trapped spirit.
- **Sky’s the Limit:** Reach True Escape.
- **Leibniz’s Lament:** Reach Hollow Escape.

The two ending badges are mutually exclusive in one run.

## Accessibility and safety

- Content warning before play
- Mild psychological horror only; no gore
- Reduced-motion mode
- High-contrast mode
- Larger-text mode
- Master-volume control
- Keyboard and mouse parity
- Timer pauses during solutions, introductions, menus, and settings
- Unlimited retries after wrong answers
- Live selectable equations through KaTeX rather than rasterized image text

## Technical architecture

- **Phaser 4:** background scenes, camera drift, particles, visual feedback
- **TypeScript:** game state, content, validation, progression
- **HTML/CSS:** menus, HUD, puzzle forms, settings, results
- **KaTeX:** mathematical notation
- **Web Audio API:** original procedural ambience and feedback tones
- **LocalStorage:** autosave, Continue, settings, statistics, achievements
- **Vite single-file build:** generates a standalone `dist/index.html`
- **Vitest:** validates content, answers, scoring, capture, and endings
- **GitHub Actions:** tests and deploys to GitHub Pages

## Release acceptance criteria

- All five rooms and seventeen questions are completable.
- Every item has a hint, answer, solution, and explanation.
- Keyboard-only and mouse-only play are possible.
- Autosave survives a refresh.
- No wrong answer creates a permanent softlock.
- The game fits 1440×900 and 1280×720 without document overflow.
- Automated checks and production build pass.
- GitHub Pages deploys from `main`.
