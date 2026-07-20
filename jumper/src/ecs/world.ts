import { createWorld, type EntityId, type World } from 'bitecs';
import type { LevelConfig } from '../levels/types';
import type { AudioBus } from '../audio/AudioBus';
import type { JumpInput } from '../input/JumpInput';
import { HandleTables } from './handles';

export type GameComponents = {
  Position: { x: number[]; y: number[] };
  Velocity: { x: number[]; y: number[] };
  Player: number[];
  Grounded: number[];
  JumpIntent: number[];
  Platform: number[];
  Obstacle: number[];
  ParallaxLayer: { scrollPxPerStep: number[]; depth: number[] };
  AnimState: { clipId: number[]; frameIndex: number[]; elapsedInFrame: number[] };
  RunTimer: { elapsedMs: number[]; active: number[] };
  Score: { value: number[] };
  Dead: number[];
};

export type GameWorldContext = {
  components: GameComponents;
  handles: HandleTables;
  level: LevelConfig;
  playerEid: EntityId;
  runEid: EntityId;
  scrollX: number;
  nextPlatformX: number;
  wasGrounded: boolean;
  firedMusicCues: Set<number>;
  jumpInput: JumpInput;
  audio: AudioBus;
  onPlayerDeath?: (score: number, elapsedMs: number) => void;
  hud?: {
    timeText: Phaser.GameObjects.Text;
    scoreText: Phaser.GameObjects.Text;
  };
  platformGroup?: Phaser.Physics.Arcade.Group;
  obstacleGroup?: Phaser.Physics.Arcade.Group;
  /** Entity currently playing airborne jump anim (null when grounded). */
  animAirborneEid: EntityId | null;
  delta: number;
  elapsed: number;
};

export type GameWorld = World<GameWorldContext>;

export function createGameWorld(
  level: LevelConfig,
  jumpInput: JumpInput,
  audio: AudioBus,
): GameWorld {
  return createWorld({
    components: {
      Position: { x: [], y: [] },
      Velocity: { x: [], y: [] },
      Player: [] as number[],
      Grounded: [] as number[],
      JumpIntent: [] as number[],
      Platform: [] as number[],
      Obstacle: [] as number[],
      ParallaxLayer: { scrollPxPerStep: [], depth: [] },
      AnimState: { clipId: [], frameIndex: [], elapsedInFrame: [] },
      RunTimer: { elapsedMs: [], active: [] },
      Score: { value: [] },
      Dead: [] as number[],
    },
    handles: new HandleTables(),
    level,
    playerEid: 0 as EntityId,
    runEid: 0 as EntityId,
    scrollX: 0,
    nextPlatformX: 0,
    wasGrounded: false,
    firedMusicCues: new Set<number>(),
    jumpInput,
    audio,
    animAirborneEid: null,
    delta: 0,
    elapsed: 0,
  });
}
