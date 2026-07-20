import { query } from 'bitecs';
import type { GameWorld } from '../world';

export function parallaxSystem(world: GameWorld): void {
  const { ParallaxLayer } = world.components;
  const dxBase = world.level.scrollSpeed * (world.delta / 1000);

  for (const eid of query(world, [ParallaxLayer])) {
    const tile = world.handles.parallax.get(eid);
    if (!tile) {
      continue;
    }
    const factor = ParallaxLayer.scrollPxPerStep[eid] ?? 0;
    tile.tilePositionX += dxBase * factor;
  }
}
