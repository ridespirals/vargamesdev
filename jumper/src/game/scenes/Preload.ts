import { Scene } from 'phaser';
import { mountainDuskLevel } from '../../levels/mountain-dusk';

export class Preload extends Scene {
  constructor() {
    super('Preload');
  }

  preload(): void {
    const label = this.add.text(512, 360, 'Loading…', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.load.on('progress', (value: number) => {
      label.setText(`Loading… ${Math.floor(value * 100)}%`);
    });

    this.load.on('loaderror', (file: { key: string; src?: string }) => {
      console.error('Asset load error', file);
      label.setText(`Load error: ${file.key}`);
    });

    this.load.on('complete', () => {
      label.setText('Starting…');
    });

    for (const layer of mountainDuskLevel.layers) {
      this.load.image(layer.key, layer.path);
    }
  }

  create(): void {
    this.scene.start('Play');
  }
}
