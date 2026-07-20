import { addComponent, hasComponent, query, removeComponent, removeEntity } from 'bitecs';
import type { Scene } from 'phaser';
import type { GameWorld } from '../world';
import { spawnPlatform } from '../spawn';

function randBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function killPlayer(world: GameWorld): void {
  const { Dead, RunTimer, Score } = world.components;
  const eid = world.playerEid;
  if (hasComponent(world, eid, Dead) && Dead[eid]) {
    return;
  }
  if (!hasComponent(world, eid, Dead)) {
    addComponent(world, eid, Dead);
  }
  Dead[eid] = 1;
  RunTimer.active[world.runEid] = 0;

  const body = world.handles.bodies.get(eid);
  body?.setVelocity(0, 0);
  body?.setAllowGravity(false);

  world.audio.playSfx('sfx-die');
  world.onPlayerDeath?.(Score.value[world.runEid] ?? 0, RunTimer.elapsedMs[world.runEid] ?? 0);
}

export function infiniteSpawnSystem(world: GameWorld, scene: Scene): void {
  if (hasComponent(world, world.playerEid, world.components.Dead)
    && world.components.Dead[world.playerEid]) {
    return;
  }

  const dt = world.delta / 1000;
  world.scrollX += world.level.scrollSpeed * dt;

  const { spawn } = world.level;
  const viewRight = world.scrollX + scene.scale.width + 100;

  while (world.nextPlatformX < viewRight) {
    const width = randBetween(spawn.minWidth, spawn.maxWidth);
    const y = randBetween(spawn.yMin, spawn.yMax);
    const worldX = world.nextPlatformX + width / 2;
    // Convert world-space spawn X into current screen space.
    const screenX = worldX - world.scrollX;
    spawnPlatform(world, scene, screenX, y, width, spawn.height);
    world.nextPlatformX += width + randBetween(spawn.minGap, spawn.maxGap);
  }

  const { Platform, Position } = world.components;
  for (const eid of [...query(world, [Platform, Position])]) {
    const rect = world.handles.platforms.get(eid);
    if (!rect) {
      continue;
    }
    Position.x[eid] = rect.x;
    Position.y[eid] = rect.y;

    const body = rect.body as Phaser.Physics.Arcade.Body | null;
    if (body) {
      body.setVelocityX(-world.level.scrollSpeed);
    }

    if (rect.x + rect.width / 2 < -40) {
      world.handles.platforms.delete(eid);
      world.platformGroup?.remove(rect, true, true);
      rect.destroy();
      removeComponent(world, eid, Platform);
      removeComponent(world, eid, Position);
      removeEntity(world, eid);
    }
  }

  const playerSprite = world.handles.sprites.get(world.playerEid);
  if (playerSprite && playerSprite.y > scene.scale.height + 40) {
    killPlayer(world);
  }
}
