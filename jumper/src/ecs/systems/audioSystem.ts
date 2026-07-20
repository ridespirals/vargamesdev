import type { GameWorld } from '../world';

export function audioSystem(world: GameWorld): void {
  const cues = world.level.musicCues;
  if (!cues?.length) {
    return;
  }
  const elapsed = world.components.RunTimer.elapsedMs[world.runEid] ?? 0;
  for (const cue of cues) {
    if (elapsed >= cue.atMs && !world.firedMusicCues.has(cue.atMs)) {
      world.firedMusicCues.add(cue.atMs);
      world.audio.playMusic(cue.key);
    }
  }
}
