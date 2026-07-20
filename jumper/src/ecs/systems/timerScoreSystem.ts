import { hasComponent } from 'bitecs';
import type { GameWorld } from '../world';

export function timerScoreSystem(world: GameWorld): void {
  const eid = world.runEid;
  const { RunTimer, Score, Dead } = world.components;
  if (!RunTimer.active[eid] || hasComponent(world, world.playerEid, Dead)) {
    RunTimer.active[eid] = 0;
    return;
  }
  RunTimer.elapsedMs[eid] += world.delta;
  Score.value[eid] = Math.floor(RunTimer.elapsedMs[eid] / 100);
}
