import type { LevelConfig } from './types';
import { jumpPeakPx, maxSafeGapPx } from './types';

const base = 'assets/levels/mountain-dusk';

/** Screen height is 768; 1/3 up from bottom ≈ y = 512. */
const FLOOR_Y = 700;

const levelBase = {
  id: 'mountain-dusk',
  displayName: 'Mountain Dusk',
  // ~40px apex, 0.7s hang: airtime = 2|v|/g, peak = v²/(2g).
  gravity: 650,
  jumpVelocity: -228,
  scrollSpeed: 160,
  floorY: FLOOR_Y,
  platformColor: 0x3d2e22,
  obstacleColor: 0x8b4518,
  player: {
    scale: 2,
    pixelArt: true,
    runClipId: 'oldman-run',
    // Freeze mid-stride (0-based frame 4) while airborne; swap to { type: 'sheet', clipId: '...' } for a jump sheet.
    jump: { type: 'frame' as const, sheetKey: 'oldman-walk', frame: 4 },
    bodyWidth: 14,
    bodyHeight: 30,
  },
  layers: [
    {
      key: 'md-sky',
      path: `${base}/sky.png`,
      scrollPxPerStep: 0.02,
      depth: 0,
      yOffset: 0,
      tile: true
    },
    {
      key: 'md-far-clouds',
      path: `${base}/far-clouds.png`,
      scrollPxPerStep: 0.05,
      depth: 1,
      yOffset: 0,
      tile: true
    },
    {
      key: 'md-near-clouds',
      path: `${base}/near-clouds.png`,
      scrollPxPerStep: 0.07,
      depth: 2,
      yOffset: 0,
      tile: true
    },
    {
      key: 'md-far-mountains',
      path: `${base}/far-mountains.png`,
      scrollPxPerStep: 0.08,
      depth: 3,
      yOffset: 0,
      tile: true
    },
    {
      key: 'md-mountains',
      path: `${base}/mountains.png`,
      scrollPxPerStep: 0.095,
      depth: 4,
      yOffset: 0,
      tile: true,
      tileGap: () => 100 + Math.random() * 700,
    },
    {
      key: 'md-trees',
      path: `${base}/trees.png`,
      scrollPxPerStep: 0.1,
      depth: 5,
      yOffset: 0,
      tile: true
    },
  ],
  // Opening floors with a fallible pit between them.
  floors: [
    { x: 0, width: 1100 },
    { x: 1200, width: 800 },
  ],
  spawn: {
    // Wider than the player (~28px) so missing a jump drops you through.
    minGap: 72,
    maxGap: 110,
    minWidth: 320,
    maxWidth: 1000,
    surfaceHeight: 22,
    gapChance: 0.22,
    obstacleChance: 0.4,
    obstacles: {
      minWidth: 28,
      maxWidth: 72,
      minHeight: 24,
      maxHeight: 36,
    },
  },
} satisfies LevelConfig;

const peak = jumpPeakPx(levelBase);
const safeGap = maxSafeGapPx(levelBase);
const maxObstacleH = Math.floor(peak * 0.75);

/** Clamp gaps to jump reach; clamp obstacle height to jump apex. */
export const mountainDuskLevel: LevelConfig = {
  ...levelBase,
  spawn: {
    ...levelBase.spawn,
    maxGap: Math.min(levelBase.spawn.maxGap, safeGap),
    obstacles: {
      ...levelBase.spawn.obstacles,
      maxHeight: Math.min(levelBase.spawn.obstacles.maxHeight, maxObstacleH),
    },
  },
};
