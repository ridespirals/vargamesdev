import { hasComponent } from 'bitecs';
import type { GameWorld } from '../world';

/** Sync Arcade bodies ↔ Position/Velocity; keep player X locked for runner framing. */
export function physicsSyncSystem(world: GameWorld): void {
  const eid = world.playerEid;
  const { Position, Velocity, Dead } = world.components;
  const body = world.handles.bodies.get(eid);
  const sprite = world.handles.sprites.get(eid);
  if (!body || !sprite || hasComponent(world, eid, Dead)) {
    return;
  }

  const lockX = 220;
  // Lock runner X on the body; copy physics Y onto the display object.
  body.x = lockX - body.halfWidth;
  sprite.setPosition(lockX, body.y + body.halfHeight);

  Position.x[eid] = sprite.x;
  Position.y[eid] = sprite.y;
  Velocity.x[eid] = body.velocity.x;
  Velocity.y[eid] = body.velocity.y;
}
