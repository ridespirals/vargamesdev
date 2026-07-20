# Jumper

Infinite runner/jumper built with **Phaser 4**, **TypeScript**, and **bitECS**. Gameplay state is entity-component; Phaser hosts scenes, Arcade Physics, input, and rendering.

Play locally at `http://localhost:8080`. On GitHub Pages (after `dist` is committed and merged): `/jumper/dist/`.

## Quick start

```bash
cd jumper
npm install
npm run dev-nolog
```

| Command | Description |
|---------|-------------|
| `npm run dev-nolog` | Dev server (no Phaser telemetry) |
| `npm run build-nolog` | Production build → `dist/` |
| `npm run dev` / `build` | Same, with template telemetry (`log.js`) |

## How it works

```
Boot → Preload → Play ⇄ GameOver
```

- **Play** creates a bitECS world and runs systems each frame.
- **Levels** are data configs (`src/levels/`) plus curated art under `public/assets/levels/`.
- **Jump** is the only action: Space or gamepad face button.
- **Score** comes from a count-up run timer.
- **Parallax** layers are configured per level (count and scroll rate).
- **AudioBus** supports ambient / stings / SFX; missing files are skipped until assets are added.
- **Dev toolbar** (upper-right): Clipping, Flatland, Forever — persisted in `localStorage`.

Design details and decisions live in [`PLAN/`](PLAN/README.md). Agent handoff: [`AGENTS.md`](AGENTS.md).

## Config highlights

Phaser game size: 1024×768, `Scale.FIT`. Arcade gravity and jump velocity come from the active `LevelConfig`. World scroll speed drives platforms and parallax.

First level: **mountain-dusk** (Mountain Dusk version A layers). Player is **oldman-walk** (scale 2, pixel-perfect). Full environment packs live in `assets-source/Environments/`; character sheets in `assets-source/Spritesheets/` (runtime copies under `public/assets/sprites/`).

## Deploy

1. `npm run build-nolog`
2. Commit source and `dist/` (agents do not commit)
3. Merge to the GitHub Pages branch
4. Open `/jumper/dist/`

See [`PLAN/deploy.md`](PLAN/deploy.md).

## Development plan

Staged checklist: [`PLAN/stages.md`](PLAN/stages.md). Feature docs are split under [`PLAN/`](PLAN/README.md).

## Stack

- [Phaser 4](https://github.com/phaserjs/phaser)
- [bitECS](https://github.com/NateTheGreatt/bitECS)
- Vite 6 + TypeScript 5.7

Based on the Phaser Vite TypeScript template; game code and docs are project-specific.
