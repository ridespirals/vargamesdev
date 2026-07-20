import type { LevelConfig } from './types';

const base = 'assets/levels/mountain-dusk';

export const mountainDuskLevel: LevelConfig = {
  id: 'mountain-dusk',
  displayName: 'Mountain Dusk',
  gravity: 1200,
  jumpVelocity: -420,
  scrollSpeed: 180,
  platformColor: 0x5a4632,
  layers: [
    { key: 'md-sky', path: `${base}/sky.png`, scrollPxPerStep: 0.05, depth: 0, tile: true },
    { key: 'md-far-clouds', path: `${base}/far-clouds.png`, scrollPxPerStep: 0.15, depth: 1, tile: true },
    { key: 'md-far-mountains', path: `${base}/far-mountains.png`, scrollPxPerStep: 0.3, depth: 2, tile: true },
    { key: 'md-mountains', path: `${base}/mountains.png`, scrollPxPerStep: 0.5, depth: 3, tile: true },
    { key: 'md-near-clouds', path: `${base}/near-clouds.png`, scrollPxPerStep: 0.7, depth: 4, tile: true },
    { key: 'md-trees', path: `${base}/trees.png`, scrollPxPerStep: 0.95, depth: 5, tile: true },
  ],
  spawn: {
    minGap: 80,
    maxGap: 180,
    minWidth: 100,
    maxWidth: 220,
    yMin: 480,
    yMax: 620,
    height: 24,
  },
};
