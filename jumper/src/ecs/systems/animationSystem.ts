import { query } from 'bitecs';
import {
  CLIPS,
  clipMsPerFrame,
  resolveClipFrames,
  type ActorSpriteConfig,
} from '../../animation/types';
import type { GameWorld } from '../world';
import type { GameObjects } from 'phaser';

function applyFrame(
  sprite: GameObjects.Sprite,
  sheetKey: string,
  frameIndex: number,
): void {
  if (sprite.texture.key !== sheetKey) {
    sprite.setTexture(sheetKey, frameIndex);
  } else {
    sprite.setFrame(frameIndex);
  }
}

function advanceClip(
  world: GameWorld,
  eid: number,
  clipId: string,
  sprite: GameObjects.Sprite,
): void {
  const clip = CLIPS[clipId];
  if (!clip) {
    return;
  }
  const { AnimState } = world.components;
  const frames = resolveClipFrames(clip, sprite.scene);
  if (frames.length === 0) {
    return;
  }

  const ms = clipMsPerFrame(clip);
  AnimState.elapsedInFrame[eid] = (AnimState.elapsedInFrame[eid] ?? 0) + world.delta;

  while (AnimState.elapsedInFrame[eid] >= ms) {
    AnimState.elapsedInFrame[eid] -= ms;
    AnimState.frameIndex[eid] = (AnimState.frameIndex[eid] ?? 0) + 1;
    if (AnimState.frameIndex[eid] >= frames.length) {
      AnimState.frameIndex[eid] = clip.loop ? 0 : frames.length - 1;
    }
  }

  const idx = Math.max(0, Math.min(frames.length - 1, AnimState.frameIndex[eid] ?? 0));
  applyFrame(sprite, clip.sheetKey, frames[idx]!);
}

/**
 * Drive run / jump visuals from ActorSpriteConfig.
 * Jump may be a full clip (`type: 'sheet'`) or a frozen frame (`type: 'frame'`).
 */
export function animationSystem(world: GameWorld): void {
  const { AnimState, Player, Grounded } = world.components;
  const actor: ActorSpriteConfig | undefined = world.level.player;
  if (!actor) {
    return;
  }

  for (const eid of query(world, [AnimState, Player])) {
    const sprite = world.handles.sprites.get(eid);
    if (!sprite || !('setFrame' in sprite)) {
      continue;
    }
    const spr = sprite as GameObjects.Sprite;
    const grounded = Boolean(Grounded[eid]);

    if (!grounded) {
      if (actor.jump.type === 'frame') {
        applyFrame(spr, actor.jump.sheetKey, actor.jump.frame);
      } else {
        // Entering air: reset jump clip once.
        if (world.animAirborneEid !== eid) {
          world.animAirborneEid = eid;
          AnimState.frameIndex[eid] = 0;
          AnimState.elapsedInFrame[eid] = 0;
        }
        advanceClip(world, eid, actor.jump.clipId, spr);
      }
      continue;
    }

    // Landed — resume run.
    if (world.animAirborneEid === eid) {
      world.animAirborneEid = null;
      AnimState.frameIndex[eid] = 0;
      AnimState.elapsedInFrame[eid] = 0;
    }
    advanceClip(world, eid, actor.runClipId, spr);
  }
}
