# Parallax

## Config

Each level lists `layers[]`:

```ts
interface ParallaxLayerConfig {
  key: string;             // loaded texture key
  scrollPxPerStep: number; // relative scroll factor vs world scroll (0 = static)
  depth: number;
  tile?: boolean;          // TileSprite horizontal repeat
}
```

Layer count is dynamic per level. Scroll each frame:

`offset += scrollSpeed * (scrollPxPerStep) * (delta/1000)`

Applied as TileSprite `tilePositionX` (or x for non-tiled).

## First level

Mountain Dusk version A (back → front): sky, far-clouds, far-mountains, mountains, near-clouds, trees — increasing `scrollPxPerStep`.
