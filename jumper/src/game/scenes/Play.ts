import { Scene } from 'phaser';
import { deleteWorld } from 'bitecs';
import { AudioBus } from '../../audio/AudioBus';
import { JumpInput } from '../../input/JumpInput';
import { createGameWorld, type GameWorld } from '../../ecs/world';
import { spawnParallaxLayers, spawnPlayer, spawnPlatform, spawnRunState } from '../../ecs/spawn';
import { tickSystems } from '../../ecs/systems';
import { mountainDuskLevel } from '../../levels/mountain-dusk';

export class Play extends Scene {
  private world!: GameWorld;
  private ending = false;

  constructor() {
    super('Play');
  }

  create(): void {
    try {
      this.ending = false;
      const level = mountainDuskLevel;

      this.physics.world.gravity.y = level.gravity;
      this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height + 200);

      const jumpInput = new JumpInput(this);
      const audio = new AudioBus(this);
      this.world = createGameWorld(level, jumpInput, audio);

      if (level.ambientKey) {
        audio.playAmbient(level.ambientKey);
      }

      this.world.platformGroup = this.physics.add.group({
        allowGravity: false,
        immovable: true,
      });
      spawnParallaxLayers(this.world, this, level);
      spawnRunState(this.world);

      const startY = 560;
      this.world.scrollX = 0;
      spawnPlatform(this.world, this, 300, startY, 500, level.spawn.height);
      spawnPlatform(this.world, this, 700, 520, 180, level.spawn.height);
      spawnPlatform(this.world, this, 980, 580, 160, level.spawn.height);
      this.world.nextPlatformX = this.scale.width + 80;

      spawnPlayer(this.world, this, 220, startY - 40);

      this.events.once('shutdown', () => this.shutdown());

      const playerSprite = this.world.handles.sprites.get(this.world.playerEid);
      if (playerSprite) {
        this.physics.add.collider(playerSprite, this.world.platformGroup);
      }

      this.world.hud = {
        timeText: this.add.text(16, 12, 'Time 0:00.0', {
          fontFamily: 'monospace',
          fontSize: '18px',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 3,
        }).setDepth(100).setScrollFactor(0),
        scoreText: this.add.text(16, 36, 'Score 0', {
          fontFamily: 'monospace',
          fontSize: '18px',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 3,
        }).setDepth(100).setScrollFactor(0),
      };

      this.add.text(512, 12, level.displayName, {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#e8e0d0',
      }).setOrigin(0.5, 0).setDepth(100).setScrollFactor(0);

      this.world.onPlayerDeath = (score, elapsedMs) => {
        if (this.ending) {
          return;
        }
        this.ending = true;
        this.time.delayedCall(400, () => {
          this.scene.start('GameOver', { score, elapsedMs });
        });
      };
    } catch (err) {
      console.error('Play.create failed', err);
      this.add.text(512, 384, `Play error:\n${String(err)}`, {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#ff6666',
        align: 'center',
      }).setOrigin(0.5);
    }
  }

  update(_time: number, delta: number): void {
    if (!this.world || this.ending) {
      return;
    }
    try {
      tickSystems(this.world, this, delta);
    } catch (err) {
      console.error('tickSystems failed', err);
    }
  }

  shutdown(): void {
    this.world?.audio.stopAmbient();
    this.world?.handles.clear();
    if (this.world) {
      deleteWorld(this.world);
    }
  }
}
