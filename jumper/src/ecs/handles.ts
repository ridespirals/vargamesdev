import type { EntityId } from 'bitecs';
import type { GameObjects, Physics } from 'phaser';

/** Side tables for Phaser object refs (TypedArrays cannot hold them). */
export class HandleTables {
  sprites = new Map<EntityId, GameObjects.Rectangle | GameObjects.Sprite>();
  bodies = new Map<EntityId, Physics.Arcade.Body>();
  /** Thin top colliders for floors. */
  platforms = new Map<EntityId, GameObjects.Rectangle>();
  /** Tall visuals from floor surface to screen bottom. */
  floorVisuals = new Map<EntityId, GameObjects.Rectangle>();
  /** Block obstacles sitting on the floor. */
  obstacles = new Map<EntityId, GameObjects.Rectangle>();
  parallax = new Map<EntityId, GameObjects.TileSprite>();

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
      layer.destroy();
    }
    this.sprites.clear();
    this.bodies.clear();
    this.platforms.clear();
    this.floorVisuals.clear();
    this.obstacles.clear();
    this.parallax.clear();
  }
}
