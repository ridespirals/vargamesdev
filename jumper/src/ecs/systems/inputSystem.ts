import { hasComponent } from 'bitecs';
import type { GameWorld } from '../world';

export function inputSystem(world: GameWorld): void {
  if (hasComponent(world, world.playerEid, world.components.Dead)) {
    return;
  }
  if (world.jumpInput.consumedJumpPress()) {
    world.components.JumpIntent[world.playerEid] = 1;
  }
}
