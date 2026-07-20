import type { Scene } from 'phaser';
import { SPRITE_SHEETS, type SpriteSheetConfig } from '../sprites/sheets';

/** Phaser.Textures.FilterMode — avoid default-importing Phaser (ESM has no default). */
const FILTER_NEAREST = 0;
const FILTER_LINEAR = 1;

/** Looping or one-shot clip driven by FPS on a spritesheet. */
export interface AnimationClip {
  id: string;
  sheetKey: string;
  /**
   * Frame indices to play (0-based). Omit to play every frame in sheet order.
   * Length is resolved at runtime from the loaded texture when omitted.
   */
  frames?: number[];
  /** Playback rate in frames per second. */
  fps: number;
  loop: boolean;
}

/**
 * Jump visual:
 * - `sheet`: play a dedicated jump clip (own FPS / loop).
 * - `frame`: freeze on one frame of a sheet (e.g. run frame 4) until landing.
 */
export type JumpAnimConfig =
  | { type: 'sheet'; clipId: string }
  | { type: 'frame'; sheetKey: string; frame: number };

/** Visual + hitbox setup for a spawned actor (player, NPCs later). */
export interface ActorSpriteConfig {
  /** Display scale (1 = native pixel size). */
  scale: number;
  /** Override sheet pixelArt; default true. */
  pixelArt?: boolean;
  runClipId: string;
  jump: JumpAnimConfig;
  /**
   * Arcade body size in **unscaled** texture pixels.
   * Defaults to full frame width/height.
   */
  bodyWidth?: number;
  bodyHeight?: number;
}

export const CLIPS: Record<string, AnimationClip> = {
  'oldman-run': {
    id: 'oldman-run',
    sheetKey: 'oldman-walk',
    fps: 10,
    loop: true,
  },
  // Example dedicated jump clip (wire a jump sheet + set player.jump = { type: 'sheet', clipId: 'oldman-jump' }).
  // 'oldman-jump': { id: 'oldman-jump', sheetKey: 'oldman-jump', fps: 12, loop: false },
};

export function clipMsPerFrame(clip: AnimationClip): number {
  return 1000 / Math.max(0.01, clip.fps);
}

export function resolveClipFrames(
  clip: AnimationClip,
  scene: Scene,
): number[] {
  if (clip.frames && clip.frames.length > 0) {
    return clip.frames;
  }
  const tex = scene.textures.get(clip.sheetKey);
  const total = tex.frameTotal > 0 ? tex.frameTotal : 1;
  // Phaser includes __BASE; frameTotal counts named frames. Prefer getFrameNames.
  const names = tex.getFrameNames();
  if (names.length > 0) {
    return names.map((_, i) => i);
  }
  return Array.from({ length: Math.max(1, total - 1) }, (_, i) => i);
}

export function sheetsForActor(actor: ActorSpriteConfig): SpriteSheetConfig[] {
  const keys = new Set<string>();
  const run = CLIPS[actor.runClipId];
  if (run) {
    keys.add(run.sheetKey);
  }
  if (actor.jump.type === 'frame') {
    keys.add(actor.jump.sheetKey);
  } else {
    const jumpClip = CLIPS[actor.jump.clipId];
    if (jumpClip) {
      keys.add(jumpClip.sheetKey);
    }
  }
  return [...keys].map((k) => SPRITE_SHEETS[k]).filter(Boolean) as SpriteSheetConfig[];
}

export function preloadActorSheets(scene: Scene, actor: ActorSpriteConfig): void {
  for (const sheet of sheetsForActor(actor)) {
    if (scene.textures.exists(sheet.key)) {
      continue;
    }
    scene.load.spritesheet(sheet.key, sheet.path, {
      frameWidth: sheet.frameWidth,
      frameHeight: sheet.frameHeight,
    });
  }
}

/** Apply nearest-neighbor (or linear) filters after textures are in the cache. */
export function applySheetFilters(scene: Scene, sheets: SpriteSheetConfig[]): void {
  for (const sheet of sheets) {
    if (!scene.textures.exists(sheet.key)) {
      continue;
    }
    const nearest = sheet.pixelArt !== false;
    scene.textures
      .get(sheet.key)
      .setFilter(nearest ? FILTER_NEAREST : FILTER_LINEAR);
  }
}
