export type TileGap = number | (() => number);

export interface ParallaxLayerConfig {
  key: string;
  path: string;
  scrollPxPerStep: number;
  depth: number;
  /** Vertical shift in screen px (positive = down). Defaults to 0. */
  yOffset?: number;
  /** When true, repeat the texture horizontally. */
  tile?: boolean;
  /**
   * Gap between repeated tiles (only when `tile` is true).
   * Number = fixed px; function = evaluated per gap (e.g. randomize).
   * Omit or 0 for seamless TileSprite tiling.
   */
  tileGap?: TileGap;
}

export function resolveTileGap(gap: TileGap | undefined): number {
  if (gap === undefined) {
    return 0;
  }
  return typeof gap === 'function' ? gap() : gap;
}

/** World-space floor segment: left edge `x` and `width`. Surface Y is level.floorY. */
export interface FloorSegment {
  x: number;
  width: number;
}

export interface ObstacleSizeConfig {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
}

export interface LevelSpawnConfig {
  minGap: number;
  maxGap: number;
  minWidth: number;
  maxWidth: number;
  /** Thickness of the solid top collider (visual fills to screen bottom). */
  surfaceHeight: number;
  /** Chance a floor segment is followed by a pit (else next floor abuts). */
  gapChance: number;
  /** Chance to place a block obstacle on a spawned floor. */
  obstacleChance: number;
  obstacles: ObstacleSizeConfig;
}

export interface LevelConfig {
  id: string;
  displayName: string;
  layers: ParallaxLayerConfig[];
  gravity: number;
  jumpVelocity: number;
  scrollSpeed: number;
  /** Top of the floor surface, in screen Y (≈ 2/3 down = 1/3 up from bottom). */
  floorY: number;
  platformColor: number;
  obstacleColor: number;
  /** Starter floors in world space (`x` = left edge). */
  floors: FloorSegment[];
  ambientKey?: string;
  musicCues?: { atMs: number; key: string }[];
  spawn: LevelSpawnConfig;
}

/** Approximate horizontal gap the player can clear while airborne (runner scroll). */
export function jumpReachPx(level: LevelConfig): number {
  const airTimeSec = (2 * Math.abs(level.jumpVelocity)) / level.gravity;
  return airTimeSec * level.scrollSpeed;
}

/** Max gap with a safety margin so gaps stay jumpable. */
export function maxSafeGapPx(level: LevelConfig): number {
  return Math.floor(jumpReachPx(level) * 0.9);
}

/** Jump apex height in px (for sizing jumpable obstacles). */
export function jumpPeakPx(level: LevelConfig): number {
  const v = Math.abs(level.jumpVelocity);
  return (v * v) / (2 * level.gravity);
}
