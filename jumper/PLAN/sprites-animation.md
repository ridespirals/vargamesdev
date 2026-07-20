# Sprite animation

## Design

Animation advances on an **animation clock** (elapsed real time / clip FPS), **not** the physics fixed-step count. Clips with different frame counts or rates stay independent of sim rate.

## Sprite sheets

Source art: `assets-source/Spritesheets/`  
Runtime copies: `public/assets/sprites/`

Defined in `src/sprites/sheets.ts` (`frameWidth` / `frameHeight`, optional `pixelArt`).

## Clip config

```ts
interface AnimationClip {
  id: string;
  sheetKey: string;
  frames?: number[];  // 0-based; omit = all frames
  fps: number;        // playback rate
  loop: boolean;
}

type JumpAnimConfig =
  | { type: 'sheet'; clipId: string }                    // full jump clip
  | { type: 'frame'; sheetKey: string; frame: number };  // freeze until land
```

`msPerFrame = 1000 / fps`. Tune `fps` on the clip (e.g. `oldman-run` at 10).

## Actor / player visual

```ts
interface ActorSpriteConfig {
  scale: number;
  pixelArt?: boolean;   // nearest-neighbor when true (default)
  runClipId: string;
  jump: JumpAnimConfig;
  bodyWidth?: number;   // unscaled texture px
  bodyHeight?: number;
}
```

Per-level via `LevelConfig.player`. Mountain Dusk uses **oldman-walk** run + jump **frame 4** (0-based).

## AnimState + system

- `clipId`, `frameIndex`, `elapsedInFrame`
- Grounded → run clip; airborne → jump sheet clip or frozen frame
- Never `setScale` every frame for “pulse” — that warps Arcade bodies. Scale is set once at spawn.

## Pixel art

Character sheets use `texture.setFilter(NEAREST)`. Global `pixelArt` stays off so parallax layers can filter smoothly; `roundPixels: true` keeps positions crisp.
