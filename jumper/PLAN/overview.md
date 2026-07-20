# Overview

## Vision

Web-based infinite runner/jumper built with **Phaser 4**, **TypeScript**, and **bitECS**. Gameplay state lives in an Entity-Component-System; Phaser hosts rendering, scenes, Arcade Physics bodies, input devices, and audio playback.

## Locked decisions

| Decision | Choice |
|----------|--------|
| ECS | bitECS (not OOP entity hierarchies) |
| Physics | Phaser Arcade Physics, synced to ECS components |
| Deploy | Commit Vite `dist/`; serve at `/jumper/dist/` on GitHub Pages |
| Repo scope | All work under `jumper/` (including `dist`) |
| Git | Agents never commit; suggest messages only |
| First level art | Mountain Dusk version A parallax + country-platform tiles |
| Player art (v1) | Placeholder rectangle until character sprites exist |
| Audio assets (v1) | AudioBus API with silent fallbacks |

## Non-goals (v1)

- Double jump, run/duck, multiplayer
- Full character art pipeline
- Shipping entire Environments tree (PSD/Aseprite/previews) in dist
- Editing the root portfolio site unless explicitly requested
- GitHub Actions deploy (manual committed dist instead)
