/** Runtime sprite sheet definitions (loaded via Phaser spritesheet loader). */
export interface SpriteSheetConfig {
  key: string;
  path: string;
  frameWidth: number;
  frameHeight: number;
  /**
   * When true (default), use nearest-neighbor filtering for crisp pixel art.
   * Set false for smoothly filtered art.
   */
  pixelArt?: boolean;
}

export const SPRITE_SHEETS: Record<string, SpriteSheetConfig> = {
  'oldman-walk': {
    key: 'oldman-walk',
    path: 'assets/sprites/oldman-walk.png',
    frameWidth: 34,
    frameHeight: 42,
    pixelArt: true,
  },
  'oldman-idle': {
    key: 'oldman-idle',
    path: 'assets/sprites/oldman-idle.png',
    frameWidth: 34,
    frameHeight: 42,
    pixelArt: true,
  },
  'bearded-walk': {
    key: 'bearded-walk',
    path: 'assets/sprites/bearded-walk.png',
    frameWidth: 40,
    frameHeight: 47,
    pixelArt: true,
  },
  'bearded-idle': {
    key: 'bearded-idle',
    path: 'assets/sprites/bearded-idle.png',
    frameWidth: 40,
    frameHeight: 47,
    pixelArt: true,
  },
  'hat-man-walk': {
    key: 'hat-man-walk',
    path: 'assets/sprites/hat-man-walk.png',
    frameWidth: 39,
    frameHeight: 52,
    pixelArt: true,
  },
  'hat-man-idle': {
    key: 'hat-man-idle',
    path: 'assets/sprites/hat-man-idle.png',
    frameWidth: 39,
    frameHeight: 52,
    pixelArt: true,
  },
  'woman-walk': {
    key: 'woman-walk',
    path: 'assets/sprites/woman-walk.png',
    frameWidth: 37,
    frameHeight: 46,
    pixelArt: true,
  },
  'woman-idle': {
    key: 'woman-idle',
    path: 'assets/sprites/woman-idle.png',
    frameWidth: 37,
    frameHeight: 46,
    pixelArt: true,
  },
};

export function sheetFrameCount(sheet: SpriteSheetConfig, imageWidth: number): number {
  return Math.floor(imageWidth / sheet.frameWidth);
}
