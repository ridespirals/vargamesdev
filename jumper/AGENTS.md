# AGENTS.md — Jumper handoff

Context for any agent working in this project. Keep this file updated when architecture or stage status changes.

## Hard rules

1. **Only modify files under `jumper/`** (including `jumper/dist`). Do not edit the root portfolio unless the user explicitly asks.
2. **Never `git commit` or `git push`.** After each work round, suggest a commit message.
3. Prefer ECS (bitECS components + systems) over OOP entity hierarchies.
4. Keep [`README.md`](README.md), this file, and [`PLAN/stages.md`](PLAN/stages.md) in sync when behavior or decisions change.
5. Do not edit Cursor plan files under `.cursor/plans/` unless asked.

## Stack

- Phaser **4.0.0**, Vite 6, TypeScript 5.7, **bitecs**
- Arcade Physics for collision/gravity; ECS for gameplay state
- Deploy: commit `dist/`; Pages URL `/jumper/dist/`

## Current stage

Stages 0–10 complete (playable mountain-dusk slice + committed-ready `dist/`). Next: Stage 11 polish / additional LevelConfigs. See [`PLAN/stages.md`](PLAN/stages.md).

## Architecture (short)

- Phaser scenes: `Boot` → `Preload` → `Play` ↔ `GameOver`
- `Play` owns a bitECS world and ticks systems each frame
- Phaser GameObjects/bodies live in **side tables** (not in TypedArray components)
- Levels are data: `src/levels/*.ts` + curated PNGs under `public/assets/levels/`

System order: Input → Jump → PhysicsSync → Grounded → TimerScore → InfiniteSpawn → Parallax → Animation → Audio → Hud

## Key paths

```
jumper/
  README.md AGENTS.md PLAN/
  public/assets/levels/     # curated runtime art
  assets-source/Environments/  # source library (not published to dist)
  src/game/main.ts          # Phaser config
  src/game/scenes/          # Boot Preload Play GameOver
  src/ecs/                  # world, components, systems, handles
  src/levels/               # LevelConfig
  src/animation/            # clip types
  src/audio/AudioBus.ts
  src/input/JumpInput.ts
  dist/                     # committed production build
```

## Commands

```bash
cd jumper
npm install
npm run dev-nolog      # http://localhost:8080
npm run build-nolog    # writes dist/
```

## Pitfalls

- TypedArrays cannot store object refs — use handle tables for sprites/bodies.
- Animation must use real-time ms, not physics step counts.
- `base: './'` is required for GitHub Pages subdirectory hosting.
- Environments includes PSD/Aseprite — copy only PNGs into `levels/`.
- No player sprites or audio files yet — placeholders / silent AudioBus.
- Floor visuals are tall fills; physics uses a thin top-only collider to avoid side clipping.
- Dev toolbar (Clipping / Flatland / Forever) persists in `localStorage` and stays visible across scenes.

## Docs map

Full plan index: [`PLAN/README.md`](PLAN/README.md)
