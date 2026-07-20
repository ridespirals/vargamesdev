import type { EntityId } from 'bitecs';
import type { GameObjects, Physics } from 'phaser';

/** Side tables for Phaser object refs (TypedArrays cannot hold them). */
export class HandleTables {
  sprites = new Map<EntityId, GameObjects.Rectangle | GameObjects.Sprite>();
  bodies = new Map<EntityId, Physics.Arcade.Body>();
  platforms = new Map<EntityId, GameObjects.Rectangle>();
  parallax = new Map<EntityId, GameObjects.TileSprite>();

  clear(): void {
    for (const s of this.sprites.values()) {
      s.destroy();
    }
    for (const p of this.platforms.values()) {
      p.destroy();
    }
    for (const layer of this.parallax.values()) {
      layer.destroy();
    }
    this.sprites.clear();
    this.bodies.clear();
    this.platforms.clear();
    this.parallax.clear();
  }
}
