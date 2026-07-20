import { hasComponent } from 'bitecs';
import type { GameWorld } from '../world';
import { getDevSettings } from '../../dev/settings';

export const PLAYER_LOCK_X = 220;

/**
 * Sync Arcade bodies ↔ Position/Velocity; keep player X locked unless blocked by an obstacle.
 *
 * Never full-`setPosition` the sprite after the physics step — Arcade `postUpdate` applies
 * (position - prevFrame) onto the Game Object and would double-move it.
 *
 * When recovering from a shove, move toward the lock with velocity (not a teleport) so
 * obstacles can still block and we do not clip through.
 */
export function physicsSyncSystem(world: GameWorld): void {
  const eid = world.playerEid;
  const { Position, Velocity, Dead } = world.components;
  const body = world.handles.bodies.get(eid);
  const sprite = world.handles.sprites.get(eid);
  if (!body || !sprite || hasComponent(world, eid, Dead)) {
    return;
  }

  if (getDevSettings().clipping) {
    body.enable = false;
    body.setAllowGravity(false);
    body.stop();
    body.reset(PLAYER_LOCK_X, sprite.y);
    Position.x[eid] = sprite.x;
    Position.y[eid] = sprite.y;
    Velocity.x[eid] = 0;
    Velocity.y[eid] = 0;
    return;
  }

  if (!body.enable) {
    body.enable = true;
  }
  body.setAllowGravity(true);

  const centerX = body.x + body.halfWidth;
  const shoved = body.blocked.right || body.touching.right;
  const dx = PLAYER_LOCK_X - centerX;

  if (shoved) {
    // Obstacle owns horizontal separation this frame; don't fight it.
    if (body.velocity.x > 0) {
      body.velocity.x = 0;
    }
  } else if (dx <= 0.5) {
    // At (or slightly past) the lock — pin body X and zero postUpdate delta-X.
    body.velocity.x = 0;
    const lockedBodyX = PLAYER_LOCK_X - body.halfWidth;
    body.x = lockedBodyX;
    body.prev.x = lockedBodyX;
    body.prevFrame.x = lockedBodyX;
    body.updateCenter();
    sprite.x = PLAYER_LOCK_X;
  } else {
    // Displaced left: ease back with velocity so colliders can still block.
    const recover = Math.min(world.level.scrollSpeed * 2, dx * 12);
    body.velocity.x = recover;
  }

  Position.x[eid] = body.x + body.halfWidth;
  Position.y[eid] = body.y + body.halfHeight;
  Velocity.x[eid] = body.velocity.x;
  Velocity.y[eid] = body.velocity.y;
}
