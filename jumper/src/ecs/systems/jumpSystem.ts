import { hasComponent } from 'bitecs';
import type { GameWorld } from '../world';

export function jumpSystem(world: GameWorld): void {
  const eid = world.playerEid;
  const { JumpIntent, Grounded, Dead } = world.components;
  if (hasComponent(world, eid, Dead)) {
    return;
  }
  if (JumpIntent[eid] && Grounded[eid]) {
    const body = world.handles.bodies.get(eid);
    if (body) {
      body.setVelocityY(world.level.jumpVelocity);
      Grounded[eid] = 0;
      world.audio.playSfx('sfx-jump');
    }
  }
  JumpIntent[eid] = 0;
}
