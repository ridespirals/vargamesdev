export interface ParallaxLayerConfig {
  key: string;
  path: string;
  scrollPxPerStep: number;
  depth: number;
  tile?: boolean;
}

export interface LevelSpawnConfig {
  minGap: number;
  maxGap: number;
  minWidth: number;
  maxWidth: number;
  yMin: number;
  yMax: number;
  height: number;
}

export interface LevelConfig {
  id: string;
  displayName: string;
  layers: ParallaxLayerConfig[];
  gravity: number;
  jumpVelocity: number;
  scrollSpeed: number;
  platformColor: number;
  ambientKey?: string;
  musicCues?: { atMs: number; key: string }[];
  spawn: LevelSpawnConfig;
}
