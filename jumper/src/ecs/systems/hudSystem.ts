import type { GameWorld } from '../world';

function formatTime(ms: number): string {
  const totalSec = ms / 1000;
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  const t = Math.floor((ms % 1000) / 100);
  return `${m}:${s.toString().padStart(2, '0')}.${t}`;
}

export function hudSystem(world: GameWorld): void {
  if (!world.hud) {
    return;
  }
  const { RunTimer, Score } = world.components;
  const elapsed = RunTimer.elapsedMs[world.runEid] ?? 0;
  const score = Score.value[world.runEid] ?? 0;
  world.hud.timeText.setText(`Time ${formatTime(elapsed)}`);
  world.hud.scoreText.setText(`Score ${score}`);
}
