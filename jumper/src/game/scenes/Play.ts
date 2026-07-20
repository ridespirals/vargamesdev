import { Scene } from 'phaser';
import { deleteWorld } from 'bitecs';
import { AudioBus } from '../../audio/AudioBus';
import { JumpInput } from '../../input/JumpInput';
import { createGameWorld, type GameWorld } from '../../ecs/world';
import {
  spawnParallaxLayers,
  spawnPlayer,
  spawnFloor,
  spawnObstacle,
  spawnRunState,
} from '../../ecs/spawn';
import { tickSystems } from '../../ecs/systems';
import { handleObstacleContact } from '../../ecs/systems/infiniteSpawnSystem';
import { mountainDuskLevel } from '../../levels/mountain-dusk';
import { getDevSettings } from '../../dev/settings';

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
      this.world.obstacleGroup = this.physics.add.group({
        allowGravity: false,
        immovable: true,
      });

      spawnParallaxLayers(this.world, this, level);
      spawnRunState(this.world);

      this.world.scrollX = 0;
      if (getDevSettings().flatland) {
        const width = Math.max(this.scale.width * 5, 4000);
        spawnFloor(this.world, this, width / 2, width);
        this.world.nextPlatformX = width;
      } else {
        let farthestRight = 0;
        for (const floor of level.floors) {
          const centerX = floor.x + floor.width / 2;
          spawnFloor(this.world, this, centerX, floor.width);
          farthestRight = Math.max(farthestRight, floor.x + floor.width);

          if (floor.width >= 500) {
            const obsW = 44;
            const obsH = 30;
            const obsWorldCenter = floor.x + floor.width * 0.55;
            spawnObstacle(
              this.world,
              this,
              obsWorldCenter - this.world.scrollX,
              obsW,
              obsH,
            );
          }
        }
        this.world.nextPlatformX =
          Math.max(farthestRight, this.scale.width) + level.spawn.minGap;
      }

      const playerY = level.floorY - 22;
      spawnPlayer(this.world, this, 220, playerY);

      this.events.once('shutdown', () => this.shutdown());

      const playerSprite = this.world.handles.sprites.get(this.world.playerEid);
      if (playerSprite && this.world.platformGroup && this.world.obstacleGroup) {
        this.physics.add.collider(playerSprite, this.world.platformGroup);
        this.physics.add.collider(
          playerSprite,
          this.world.obstacleGroup,
          () => {
            handleObstacleContact(
              this.world,
              playerSprite as Phaser.Types.Physics.Arcade.GameObjectWithBody,
            );
          },
        );
      }

      this.world.hud = {
        timeText: this.add
          .text(16, 12, 'Time 0:00.0', {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
          })
          .setDepth(100)
          .setScrollFactor(0),
        scoreText: this.add
          .text(16, 36, 'Score 0', {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
          })
          .setDepth(100)
          .setScrollFactor(0),
      };

      this.add
        .text(512, 12, level.displayName, {
          fontFamily: 'monospace',
          fontSize: '16px',
          color: '#e8e0d0',
        })
        .setOrigin(0.5, 0)
        .setDepth(100)
        .setScrollFactor(0);

      this.world.onPlayerDeath = (score, elapsedMs) => {
        if (this.ending) {
          return;
        }
        this.ending = true;
        if (getDevSettings().forever) {
          this.time.delayedCall(150, () => {
            this.scene.start('Play');
          });
          return;
        }
        this.time.delayedCall(400, () => {
          this.scene.start('GameOver', { score, elapsedMs });
        });
      };
    } catch (err) {
      console.error('Play.create failed', err);
      this.add
        .text(512, 384, `Play error:\n${String(err)}`, {
          fontFamily: 'monospace',
          fontSize: '16px',
          color: '#ff6666',
          align: 'center',
        })
        .setOrigin(0.5);
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
