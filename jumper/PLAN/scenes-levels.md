# Scenes and levels

## Phaser scene flow

```
Boot → Preload → Play ⇄ GameOver
```

| Scene | Role |
|-------|------|
| Boot | Minimal setup, start Preload |
| Preload | Load level + shared assets |
| Play | Create ECS world, run systems |
| GameOver | Show score; Space/pad → Play |

## LevelConfig

Levels are **data**, not subclasses:

```ts
interface LevelConfig {
  id: string;
  displayName: string;
  assets: { key: string; path: string }[];
  layers: ParallaxLayerConfig[];
  gravity: number;
  jumpVelocity: number;
  scrollSpeed: number;       // world px/sec to the left
  platformTileKey?: string;
  ambientKey?: string;       // optional until audio assets exist
  musicCues?: { atMs: number; key: string }[];
  spawn: {
    minGap: number;
    maxGap: number;
    minWidth: number;
    maxWidth: number;
    yMin: number;
    yMax: number;
  };
}
```

First level: `mountain-dusk` — see `src/levels/mountain-dusk.ts`.
