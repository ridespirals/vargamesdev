# Parallax

## Config

Each level lists `layers[]`:

```ts
type TileGap = number | (() => number);

interface ParallaxLayerConfig {
  key: string;             // loaded texture key
  scrollPxPerStep: number; // relative scroll factor vs world scroll (0 = static)
  depth: number;
  yOffset?: number;        // screen Y shift in px (positive = down), default 0
  tile?: boolean;          // horizontal repeat
  tileGap?: TileGap;       // gaps between tiles when `tile` is true
}
```

### Tiling modes

- `tile: true` without `tileGap` — seamless Phaser `TileSprite`
- `tile: true` with `tileGap` — discrete images with spacing; `tileGap` may be a fixed number or a function evaluated per gap (e.g. random)

Scroll each frame:

`offset += scrollSpeed * (scrollPxPerStep) * (delta/1000)`

Continuous layers use `tilePositionX`. Gapped layers move/recycle individual images and spawn ahead of the view.

## First level

Mountain Dusk: sky, far-clouds, near-clouds, far-mountains, mountains (`tileGap` random 100–800), trees.
