import { Boot } from './scenes/Boot';
import { Preload } from './scenes/Preload';
import { Play } from './scenes/Play';
import { GameOver } from './scenes/GameOver';
import { AUTO, Game, Scale, Types } from 'phaser';

const config: Types.Core.GameConfig = {
  type: AUTO,
  width: 1024,
  height: 768,
  parent: 'game-container',
  backgroundColor: '#1a1520',
  pixelArt: true,
  roundPixels: true,
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
  render: {
    antialias: true,
    pixelArt: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 1200 },
      debug: false,
    },
  },
  input: {
    gamepad: true,
  },
  scene: [Boot, Preload, Play, GameOver],
};

const StartGame = (parent: string) => {
  const game = new Game({ ...config, parent });
  (globalThis as unknown as { __jumperGame?: Game }).__jumperGame = game;
  return game;
};

export default StartGame;
