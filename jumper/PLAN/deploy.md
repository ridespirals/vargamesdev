# Deploy

## Model

GitHub Pages serves the repo statically. The game is published by **committing** the Vite production build at `jumper/dist/`.

Live path (after merge to the Pages branch, typically `main`):

`https://vargames.dev/jumper/dist/`

Vite `base: './'` keeps asset URLs relative so subdirectory hosting works.

## Workflow

1. `cd jumper && npm install`
2. Develop: `npm run dev-nolog`
3. Build: `npm run build-nolog`
4. Commit source **and** `dist/` (humans only — agents never commit)
5. Merge/push to the branch GitHub Pages uses

## gitignore

`dist` is **not** ignored so the build can be tracked. `node_modules` remains ignored.

## Out of scope

Root portfolio `index.html` link to the game — add later if desired. Agents do not edit outside `jumper/`.
