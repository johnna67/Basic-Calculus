# Start Here: Codex Handoff

This archive is arranged so that it extracts into one dedicated project folder. Open **this folder itself** as the Codex project root; do not open only `src/` or `dist/`.

## What is included

- Complete TypeScript and Phaser source code
- Locked dependency versions in `package-lock.json`
- Automated tests
- A prebuilt self-contained preview at `dist/index.html`
- GitHub Pages deployment workflow
- Teacher-facing design, mechanics, question-bank, testing, and submission documentation
- Original project proposal PDF
- Curated visual-development references
- Codex-specific repository guidance in `AGENTS.md`
- macOS/Linux and Windows setup scripts

`node_modules/` is intentionally excluded. Codex or the local machine should restore dependencies with `npm ci`.

## Required environment

- Node.js **22.12 or later**
- npm **10 or later**
- A current desktop browser

The repository includes `.nvmrc` with Node 22.

## Fastest setup

### macOS or Linux

```bash
cd infinite-loop-no-escape-codex
chmod +x scripts/*.sh
./scripts/codex-setup.sh
./scripts/run-dev.sh
```

### Windows PowerShell

```powershell
Set-Location infinite-loop-no-escape-codex
powershell -ExecutionPolicy Bypass -File .\scripts\codex-setup.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\run-dev.ps1
```

The development server uses port `4173` by default. Open the address displayed by Vite.

## Using the Codex desktop app or IDE extension

1. Extract the ZIP.
2. Select the extracted `infinite-loop-no-escape-codex` folder as the project folder.
3. Start a new Codex task from that folder.
4. Ask Codex to read `AGENTS.md` and this file before making changes.
5. Allow it to run the setup, test, and build commands inside this project directory.

## Using Codex CLI

From the folder containing the extracted project:

```bash
codex -C infinite-loop-no-escape-codex
```

Alternatively:

```bash
cd infinite-loop-no-escape-codex
codex
```

A ready-to-paste first task is stored in `CODEX_INITIAL_PROMPT.md`.

## Recommended Git checkpoint

Codex works best when changes can be reviewed and reverted. After extraction, create an initial repository checkpoint:

```bash
git init
git add .
git commit -m "Import Infinite Loop Codex handoff"
```

Then create a new commit after each focused task.

## Run and verify

Install dependencies and run every automated check:

```bash
npm ci
npm run check
npm run build
```

Start the editable development version:

```bash
npm run dev -- --host 0.0.0.0
```

Preview the production build:

```bash
npm run preview -- --host 0.0.0.0
```

The standalone build is at:

```text
dist/index.html
```

It can also be opened directly in a browser, although serving it through `npm run preview` gives behavior closest to GitHub Pages.

## Important project locations

| Goal | File or folder |
|---|---|
| Change game screens and flow | `src/App.ts` |
| Change room visuals | `src/VisualScene.ts`, `src/art.ts` |
| Change questions | `src/questions1.ts`, `src/questions2.ts` |
| Change scoring, answers, saves, or endings | `src/gameStore.ts` |
| Change story, spirits, achievements | `src/content.ts` |
| Change interface styling | `src/styles.css` |
| Change sound | `src/audio.ts` |
| Add tests | `tests/` |
| Review final rules and content | `docs/` |
| Review original requirements | `reference/BASCALC_Culminating_Project_Proposal.pdf` |
| Review visual direction | `reference/visuals/` and `docs/04_ART_BIBLE.md` |

## Deployment

The included workflow at `.github/workflows/deploy.yml` runs checks, builds the project, and deploys `dist/` to GitHub Pages after a push to `main`.

Deployment sequence:

1. Create a GitHub repository.
2. Push this project to the `main` branch.
3. Open **Settings → Pages** in GitHub.
4. Select **GitHub Actions** as the publishing source.
5. Wait for the workflow to finish.

No environment variables or API keys are required.

## Troubleshooting

### Node version is too old

Use Node 22 through a version manager, then rerun:

```bash
npm ci
```

### Port 4173 is already in use

```bash
npm run dev -- --host 0.0.0.0 --port 4174
```

### Dependencies are inconsistent

Delete the local dependency folder and reinstall from the lock file:

```bash
rm -rf node_modules
npm ci
```

PowerShell equivalent:

```powershell
Remove-Item -Recurse -Force node_modules
npm ci
```

### A change breaks game progression

Run the test suite, inspect `src/gameStore.ts`, then test New Game, Continue, room completion, wrong-answer retries, timeout, and all ending paths in the browser.
