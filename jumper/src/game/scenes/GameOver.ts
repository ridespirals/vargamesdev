import { Input, Scene } from 'phaser';

type GameOverData = {
  score?: number;
  elapsedMs?: number;
};

function formatTime(ms: number): string {
  const totalSec = ms / 1000;
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  const t = Math.floor((ms % 1000) / 100);
  return `${m}:${s.toString().padStart(2, '0')}.${t}`;
}

export class GameOver extends Scene {
  private space?: Input.Keyboard.Key;
  private prevPadA = false;

  constructor() {
    super('GameOver');
  }

  create(data: GameOverData): void {
    const score = data.score ?? 0;
    const elapsedMs = data.elapsedMs ?? 0;

    this.add.rectangle(512, 384, 1024, 768, 0x101018, 0.85).setScrollFactor(0);

    this.add.text(512, 280, 'Game Over', {
      fontFamily: 'monospace',
      fontSize: '48px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.add.text(512, 360, `Score ${score}`, {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#f0c040',
    }).setOrigin(0.5);

    this.add.text(512, 410, `Time ${formatTime(elapsedMs)}`, {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#cccccc',
    }).setOrigin(0.5);

    this.add.text(512, 500, 'Space / A — play again', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#aaaaaa',
    }).setOrigin(0.5);

    this.space = this.input.keyboard?.addKey(Input.Keyboard.KeyCodes.SPACE);
    this.prevPadA = false;
  }

  update(): void {
    let restart = false;
    if (this.space && Input.Keyboard.JustDown(this.space)) {
      restart = true;
    }
    const pad = this.input.gamepad?.getPad(0);
    const padA = Boolean(pad?.A || pad?.buttons?.[0]?.pressed);
    if (padA && !this.prevPadA) {
      restart = true;
    }
    this.prevPadA = padA;

    if (restart) {
      this.scene.start('Play');
    }
  }
}
