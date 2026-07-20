import type { Scene } from 'phaser';
import type { GameWorld } from '../world';
import { inputSystem } from './inputSystem';
import { jumpSystem } from './jumpSystem';
import { physicsSyncSystem } from './physicsSyncSystem';
import { groundedSystem } from './groundedSystem';
import { timerScoreSystem } from './timerScoreSystem';
import { infiniteSpawnSystem } from './infiniteSpawnSystem';
import { parallaxSystem } from './parallaxSystem';
import { animationSystem } from './animationSystem';
import { audioSystem } from './audioSystem';
import { hudSystem } from './hudSystem';

export function tickSystems(world: GameWorld, scene: Scene, delta: number): void {
  world.delta = delta;
  world.elapsed += delta;

  inputSystem(world);
  jumpSystem(world);
  physicsSyncSystem(world);
  groundedSystem(world);
  timerScoreSystem(world);
  infiniteSpawnSystem(world, scene);
  parallaxSystem(world, scene);
  animationSystem(world);
  audioSystem(world);
  hudSystem(world);
}
