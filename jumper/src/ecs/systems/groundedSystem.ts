import { hasComponent } from 'bitecs';
import type { GameWorld } from '../world';

export function groundedSystem(world: GameWorld): void {
  const eid = world.playerEid;
  const { Grounded, Dead } = world.components;
  if (hasComponent(world, eid, Dead)) {
    return;
  }
  const body = world.handles.bodies.get(eid);
  if (!body) {
    return;
  }
  const grounded = body.blocked.down || body.touching.down ? 1 : 0;
  if (grounded && !world.wasGrounded) {
    world.audio.playSfx('sfx-land');
  }
  world.wasGrounded = Boolean(grounded);
  Grounded[eid] = grounded;
}
