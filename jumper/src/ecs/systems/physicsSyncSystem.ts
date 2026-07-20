import { hasComponent } from 'bitecs';
import type { GameWorld } from '../world';
import { getDevSettings } from '../../dev/settings';

/** Sync Arcade bodies ↔ Position/Velocity; keep player X locked unless blocked by an obstacle. */
export function physicsSyncSystem(world: GameWorld): void {
  const eid = world.playerEid;
  const { Position, Velocity, Dead } = world.components;
  const body = world.handles.bodies.get(eid);
  const sprite = world.handles.sprites.get(eid);
  if (!body || !sprite || hasComponent(world, eid, Dead)) {
    return;
  }

  const lockX = 220;

  if (getDevSettings().clipping) {
    body.enable = false;
    body.setAllowGravity(false);
    body.setVelocity(0, 0);
    sprite.setPosition(lockX, sprite.y);
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

  const blockedByObstacle = body.blocked.right || body.touching.right;
  if (!blockedByObstacle) {
    // Runner framing: hold X unless an obstacle is shoving the player left.
    body.x = lockX - body.halfWidth;
    body.velocity.x = 0;
  }

  sprite.setPosition(body.x + body.halfWidth, body.y + body.halfHeight);

  Position.x[eid] = sprite.x;
  Position.y[eid] = sprite.y;
  Velocity.x[eid] = body.velocity.x;
  Velocity.y[eid] = body.velocity.y;
}
