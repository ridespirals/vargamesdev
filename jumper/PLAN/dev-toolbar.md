# Dev toolbar

Upper-right DOM overlay (`#dev-toolbar`) that stays visible across all Phaser scenes, including Game Over.

## Toggles

| Toggle | Default | Effect |
|--------|---------|--------|
| Clipping | off | World still scrolls; player has no gravity or collision (layer-tuning mode) |
| Flatland | off | No gaps or obstacles (continuous floors) |
| Forever | off | On death, skip Game Over and restart Play |

## Persistence

Stored in `localStorage` under `jumper.devSettings` via [`src/dev/settings.ts`](../src/dev/settings.ts).

## Wiring

- Clipping: `physicsSyncSystem` + skip fall death in `infiniteSpawnSystem`
- Flatland: gap/obstacle spawn skipped; starter obstacles skipped
- Forever: `Play` death handler restarts Play instead of GameOver
