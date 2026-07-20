import type { EntityId } from 'bitecs';
import type { GameObjects, Physics } from 'phaser';
import type { TileGap } from '../levels/types';

/** Seamless full-viewport TileSprite layer. */
export type ContinuousParallaxHandle = {
  kind: 'continuous';
  sprite: GameObjects.TileSprite;
};

/** Discrete tiled images with gaps between them. */
export type GappedParallaxHandle = {
  kind: 'gapped';
  sprites: GameObjects.Image[];
  key: string;
  scale: number;
  tileWidth: number;
  y: number;
  depth: number;
  /** World/screen X where the next tile's left edge should spawn. */
  nextX: number;
  tileGap: TileGap;
};

export type ParallaxHandle = ContinuousParallaxHandle | GappedParallaxHandle;

/** Side tables for Phaser object refs (TypedArrays cannot hold them). */
export class HandleTables {
  sprites = new Map<EntityId, GameObjects.Sprite | GameObjects.Rectangle>();
  bodies = new Map<EntityId, Physics.Arcade.Body>();
  /** Thin top colliders for floors. */
  platforms = new Map<EntityId, GameObjects.Rectangle>();
  /** Tall visuals from floor surface to screen bottom. */
  floorVisuals = new Map<EntityId, GameObjects.Rectangle>();
  /** Block obstacles sitting on the floor. */
  obstacles = new Map<EntityId, GameObjects.Rectangle>();
  parallax = new Map<EntityId, ParallaxHandle>();

  clear(): void {
    for (const s of this.sprites.values()) {
      s.destroy();
    }
    for (const p of this.platforms.values()) {
      p.destroy();
    }
    for (const v of this.floorVisuals.values()) {
      v.destroy();
    }
    for (const o of this.obstacles.values()) {
      o.destroy();
    }
    for (const layer of this.parallax.values()) {
      if (layer.kind === 'continuous') {
        layer.sprite.destroy();
      } else {
        for (const img of layer.sprites) {
          img.destroy();
        }
      }
    }
    this.sprites.clear();
    this.bodies.clear();
    this.platforms.clear();
    this.floorVisuals.clear();
    this.obstacles.clear();
    this.parallax.clear();
  }
}
