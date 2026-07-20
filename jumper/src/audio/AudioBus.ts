import type { Scene } from 'phaser';

/**
 * Thin audio facade. Missing keys are skipped so the game runs without assets.
 */
export class AudioBus {
  private ambientKey: string | null = null;

  constructor(private readonly scene: Scene) {}

  playAmbient(key: string): void {
    if (!this.scene.cache.audio.exists(key)) {
      return;
    }
    this.stopAmbient();
    this.scene.sound.play(key, { loop: true, volume: 0.5 });
    this.ambientKey = key;
  }

  playMusic(key: string, loop = false): void {
    if (!this.scene.cache.audio.exists(key)) {
      return;
    }
    this.scene.sound.play(key, { loop, volume: 0.6 });
  }

  playSfx(key: string): void {
    if (!this.scene.cache.audio.exists(key)) {
      return;
    }
    this.scene.sound.play(key, { volume: 0.8 });
  }

  stopAmbient(): void {
    if (this.ambientKey && this.scene.sound.get(this.ambientKey)) {
      this.scene.sound.stopByKey(this.ambientKey);
    }
    this.ambientKey = null;
  }
}
