import { Scene } from 'phaser';

export class Boot extends Scene {
  constructor() {
    super('Boot');
  }

  preload(): void {
    // Intentionally empty — Preload loads level assets.
  }

  create(): void {
    this.scene.start('Preload');
  }
}
