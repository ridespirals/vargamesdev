import { addComponent, hasComponent, query, removeComponent, removeEntity } from 'bitecs';
import type { Scene } from 'phaser';
import type { GameWorld } from '../world';
import { spawnFloor, spawnObstacle } from '../spawn';
import { maxSafeGapPx } from '../../levels/types';
import { getDevSettings } from '../../dev/settings';

function randBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function killPlayer(world: GameWorld): void {
  if (getDevSettings().clipping) {
    return;
  }

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

function maybeSpawnObstacleOnFloor(
  world: GameWorld,
  scene: Scene,
  floorLeftWorld: number,
  floorWidth: number,
): void {
  if (getDevSettings().flatland) {
    return;
  }

  const { spawn } = world.level;
  if (Math.random() > spawn.obstacleChance) {
    return;
  }
  if (floorWidth < 180) {
    return;
  }

  const { minWidth, maxWidth, minHeight, maxHeight } = spawn.obstacles;
  const width = randBetween(minWidth, maxWidth);
  const height = randBetween(minHeight, maxHeight);
  const margin = Math.max(48, width);
  const minLeft = floorLeftWorld + margin;
  const maxLeft = floorLeftWorld + floorWidth - margin - width;
  if (maxLeft <= minLeft) {
    return;
  }

  const worldLeft = randBetween(minLeft, maxLeft);
  const screenCenterX = worldLeft + width / 2 - world.scrollX;
  spawnObstacle(world, scene, screenCenterX, width, height);
}

export function infiniteSpawnSystem(world: GameWorld, scene: Scene): void {
  if (hasComponent(world, world.playerEid, world.components.Dead)
    && world.components.Dead[world.playerEid]) {
    return;
  }

  const dt = world.delta / 1000;
  world.scrollX += world.level.scrollSpeed * dt;

  const { spawn } = world.level;
  const flatland = getDevSettings().flatland;
  const safeMaxGap = Math.min(spawn.maxGap, maxSafeGapPx(world.level));
  const viewRight = world.scrollX + scene.scale.width + 160;

  while (world.nextPlatformX < viewRight) {
    const width = randBetween(spawn.minWidth, spawn.maxWidth);
    const worldLeft = world.nextPlatformX;
    const screenCenterX = worldLeft + width / 2 - world.scrollX;
    spawnFloor(world, scene, screenCenterX, width);
    maybeSpawnObstacleOnFloor(world, scene, worldLeft, width);

    const gap =
      flatland || Math.random() >= spawn.gapChance
        ? 0
        : randBetween(spawn.minGap, safeMaxGap);
    world.nextPlatformX = worldLeft + width + gap;
  }

  const { Platform, Position, Obstacle } = world.components;

  for (const eid of [...query(world, [Platform, Position])]) {
    const collider = world.handles.platforms.get(eid);
    const visual = world.handles.floorVisuals.get(eid);
    if (!collider) {
      continue;
    }

    Position.x[eid] = collider.x;
    Position.y[eid] = world.level.floorY;

    const body = collider.body as Phaser.Physics.Arcade.Body | null;
    if (body) {
      body.setVelocityX(-world.level.scrollSpeed);
    }
    if (visual) {
      visual.x = collider.x;
      visual.y = world.level.floorY;
    }

    if (collider.x + collider.width / 2 < -40) {
      world.handles.platforms.delete(eid);
      world.handles.floorVisuals.delete(eid);
      world.platformGroup?.remove(collider, true, true);
      visual?.destroy();
      collider.destroy();
      removeComponent(world, eid, Platform);
      removeComponent(world, eid, Position);
      removeEntity(world, eid);
    }
  }

  for (const eid of [...query(world, [Obstacle, Position])]) {
    const rect = world.handles.obstacles.get(eid);
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
      world.handles.obstacles.delete(eid);
      world.obstacleGroup?.remove(rect, true, true);
      rect.destroy();
      removeComponent(world, eid, Obstacle);
      removeComponent(world, eid, Position);
      removeEntity(world, eid);
    }
  }

  if (getDevSettings().clipping) {
    return;
  }

  const playerSprite = world.handles.sprites.get(world.playerEid);
  if (playerSprite && playerSprite.y > scene.scale.height + 40) {
    killPlayer(world);
  }
}

/** Side-hit against an obstacle ends the run; landing on top is allowed. */
export function handleObstacleContact(
  world: GameWorld,
  playerGO: Phaser.Types.Physics.Arcade.GameObjectWithBody,
): void {
  if (getDevSettings().clipping) {
    return;
  }
  const body = playerGO.body as Phaser.Physics.Arcade.Body;
  const sideHit =
    body.touching.left ||
    body.touching.right ||
    body.blocked.left ||
    body.blocked.right;
  if (sideHit) {
    killPlayer(world);
  }
}
