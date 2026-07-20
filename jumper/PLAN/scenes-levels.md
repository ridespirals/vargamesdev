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
interface FloorSegment {
  x: number;      // world-space left edge
  width: number;
}

interface LevelConfig {
  id: string;
  displayName: string;
  layers: ParallaxLayerConfig[];
  gravity: number;
  jumpVelocity: number;
  scrollSpeed: number;
  floorY: number;            // surface Y (~2/3 down the screen)
  platformColor: number;
  floors: FloorSegment[];    // starter layout (x = left, width)
  obstacleColor: number;
  ambientKey?: string;
  musicCues?: { atMs: number; key: string }[];
  spawn: {
    minGap: number;
    maxGap: number;          // clamped to jump reach
    minWidth: number;        // can be very long
    maxWidth: number;
    surfaceHeight: number;   // thin top collider
    gapChance: number;       // most segments abut (few pits)
    obstacleChance: number;
    obstacles: { minWidth; maxWidth; minHeight; maxHeight };
  };
}
```

Floors render as boxes from `floorY` to the bottom of the screen (covering parallax below the surface). Block **obstacles** sit on the floor and block the player (jump over or get pushed left until fully off-screen). A future foreground layer can sit in front of the floor fill.

First level: `mountain-dusk` — see `src/levels/mountain-dusk.ts`.
