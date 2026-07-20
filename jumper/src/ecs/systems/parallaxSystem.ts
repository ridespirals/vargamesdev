import { query } from 'bitecs';
import type { Scene } from 'phaser';
import type { GameWorld } from '../world';
import { resolveTileGap } from '../../levels/types';
import type { GappedParallaxHandle } from '../handles';

function spawnGappedTile(scene: Scene, layer: GappedParallaxHandle, x: number): void {
  const img = scene.add.image(x, layer.y, layer.key);
  img.setOrigin(0, 0);
  img.setScale(layer.scale);
  img.setDepth(layer.depth);
  img.setScrollFactor(0);
  layer.sprites.push(img);
}

export function parallaxSystem(world: GameWorld, scene: Scene): void {
  const { ParallaxLayer } = world.components;
  const dxBase = world.level.scrollSpeed * (world.delta / 1000);
  const viewRight = scene.scale.width + 64;

  for (const eid of query(world, [ParallaxLayer])) {
    const handle = world.handles.parallax.get(eid);
    if (!handle) {
      continue;
    }
    const factor = ParallaxLayer.scrollPxPerStep[eid] ?? 0;
    const dx = dxBase * factor;

    if (handle.kind === 'continuous') {
      handle.sprite.tilePositionX += dx;
      continue;
    }

    // Move existing tiles left.
    for (const img of handle.sprites) {
      img.x -= dx;
    }
    handle.nextX -= dx;

    // Despawn fully off-screen left.
    handle.sprites = handle.sprites.filter((img) => {
      if (img.x + handle.tileWidth < 0) {
        img.destroy();
        return false;
      }
      return true;
    });

    // Spawn ahead until we cover past the right edge.
    while (handle.nextX < viewRight) {
      spawnGappedTile(scene, handle, handle.nextX);
      handle.nextX += handle.tileWidth + resolveTileGap(handle.tileGap);
    }
  }
}
