import { query } from 'bitecs';
import { clipsById, placeholderIdleClip } from '../../animation/types';
import type { GameWorld } from '../world';

const CLIP_IDS = [placeholderIdleClip.id];

export function animationSystem(world: GameWorld): void {
  const { AnimState, Player } = world.components;

  for (const eid of query(world, [AnimState, Player])) {
    const clipName = CLIP_IDS[AnimState.clipId[eid] ?? 0] ?? placeholderIdleClip.id;
    const clip = clipsById[clipName] ?? placeholderIdleClip;
    AnimState.elapsedInFrame[eid] = (AnimState.elapsedInFrame[eid] ?? 0) + world.delta;

    while (AnimState.elapsedInFrame[eid] >= clip.msPerFrame) {
      AnimState.elapsedInFrame[eid] -= clip.msPerFrame;
      AnimState.frameIndex[eid] = (AnimState.frameIndex[eid] ?? 0) + 1;
      if (AnimState.frameIndex[eid] >= clip.frames.length) {
        AnimState.frameIndex[eid] = clip.loop ? 0 : clip.frames.length - 1;
      }
    }

    // Placeholder pulse — alpha only. Never setScale on the physics Game Object:
    // Arcade rebuilds the body from transform scale and warps jump/grounding.
    const sprite = world.handles.sprites.get(eid);
    if (sprite) {
      sprite.setAlpha(AnimState.frameIndex[eid] % 2 === 0 ? 1 : 0.85);
    }
  }
}
