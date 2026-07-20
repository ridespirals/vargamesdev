import { addComponent, addEntity, query } from 'bitecs';
import type { Scene } from 'phaser';
import type { GameWorld } from './world';
import type { LevelConfig } from '../levels/types';
import { resolveTileGap } from '../levels/types';
import type { GappedParallaxHandle } from './handles';
import { CLIPS } from '../animation/types';
import { SPRITE_SHEETS } from '../sprites/sheets';

/** Phaser.Textures.FilterMode.NEAREST */
const FILTER_NEAREST = 0;

export function spawnRunState(world: GameWorld): void {
  const { RunTimer, Score } = world.components;
  const eid = addEntity(world);
  addComponent(world, eid, RunTimer);
  addComponent(world, eid, Score);
  RunTimer.elapsedMs[eid] = 0;
  RunTimer.active[eid] = 1;
  Score.value[eid] = 0;
  world.runEid = eid;
}

export function spawnPlayer(world: GameWorld, scene: Scene, x: number): void {
  const { Position, Velocity, Player, Grounded, JumpIntent, AnimState } = world.components;
  const eid = addEntity(world);
  addComponent(world, eid, Position);
  addComponent(world, eid, Velocity);
  addComponent(world, eid, Player);
  addComponent(world, eid, Grounded);
  addComponent(world, eid, JumpIntent);
  addComponent(world, eid, AnimState);

  const visual = world.level.player;
  const runClip = CLIPS[visual.runClipId];
  const sheetKey = runClip?.sheetKey ?? 'oldman-walk';
  const sheet = SPRITE_SHEETS[sheetKey] ?? SPRITE_SHEETS['oldman-walk']!;
  const scale = visual.scale;
  const bodyW = visual.bodyWidth ?? sheet.frameWidth;
  const bodyH = visual.bodyHeight ?? sheet.frameHeight;
  const displayH = sheet.frameHeight * scale;
  const y = world.level.floorY - displayH / 2;

  Position.x[eid] = x;
  Position.y[eid] = y;
  Velocity.x[eid] = 0;
  Velocity.y[eid] = 0;
  Grounded[eid] = 0;
  JumpIntent[eid] = 0;
  AnimState.clipId[eid] = 0;
  AnimState.frameIndex[eid] = 0;
  AnimState.elapsedInFrame[eid] = 0;

  const sprite = scene.add.sprite(x, y, sheetKey, 0);
  sprite.setDepth(20);
  sprite.setScale(scale);
  if (visual.pixelArt !== false && sheet.pixelArt !== false) {
    sprite.texture.setFilter(FILTER_NEAREST);
  }

  scene.physics.add.existing(sprite);
  const body = sprite.body as Phaser.Physics.Arcade.Body;
  body.setCollideWorldBounds(false);
  body.setMaxVelocity(600, 900);
  body.setSize(bodyW, bodyH);
  body.setOffset(
    (sheet.frameWidth - bodyW) / 2,
    sheet.frameHeight - bodyH,
  );

  world.handles.sprites.set(eid, sprite);
  world.handles.bodies.set(eid, body);
  world.playerEid = eid;
}

export function spawnParallaxLayers(world: GameWorld, scene: Scene, level: LevelConfig): void {
  const { ParallaxLayer } = world.components;
  const w = scene.scale.width;
  const h = scene.scale.height;

  for (const layer of level.layers) {
    const eid = addEntity(world);
    addComponent(world, eid, ParallaxLayer);
    ParallaxLayer.scrollPxPerStep[eid] = layer.scrollPxPerStep;
    ParallaxLayer.depth[eid] = layer.depth;

    const y = layer.yOffset ?? 0;
    const tex = scene.textures.get(layer.key).getSourceImage() as HTMLImageElement;
    const scale = tex?.height ? h / tex.height : 1;
    const tileWidth = (tex?.width ?? w) * scale;
    const useGaps = Boolean(layer.tile && layer.tileGap !== undefined);

    if (useGaps) {
      const handle: GappedParallaxHandle = {
        kind: 'gapped',
        sprites: [],
        key: layer.key,
        scale,
        tileWidth,
        y,
        depth: layer.depth,
        nextX: 0,
        tileGap: layer.tileGap!,
      };
      // Initial fill across the viewport.
      while (handle.nextX < w + tileWidth) {
        const img = scene.add.image(handle.nextX, y, layer.key);
        img.setOrigin(0, 0);
        img.setScale(scale);
        img.setDepth(layer.depth);
        img.setScrollFactor(0);
        handle.sprites.push(img);
        handle.nextX += tileWidth + resolveTileGap(layer.tileGap);
      }
      world.handles.parallax.set(eid, handle);
      continue;
    }

    // Seamless continuous tiling (default).
    const tile = scene.add.tileSprite(0, y, w, h, layer.key);
    tile.setOrigin(0, 0);
    tile.setDepth(layer.depth);
    tile.setScrollFactor(0);
    if (tex?.height) {
      tile.setTileScale(scale, scale);
    }
    world.handles.parallax.set(eid, { kind: 'continuous', sprite: tile });
  }
}

/**
 * Spawn a floor segment at screen-space center X.
 * Visual fills from floorY to the bottom of the screen; physics is a thin top strip
 * that only collides on its upper face (avoids side-clipping).
 */
export function spawnFloor(
  world: GameWorld,
  scene: Scene,
  screenCenterX: number,
  width: number,
): void {
  const { Position, Platform } = world.components;
  const floorY = world.level.floorY;
  const surfaceH = world.level.spawn.surfaceHeight;
  const fillH = Math.max(surfaceH, scene.scale.height - floorY + 8);

  const eid = addEntity(world);
  addComponent(world, eid, Position);
  addComponent(world, eid, Platform);
  Position.x[eid] = screenCenterX;
  Position.y[eid] = floorY;

  const visual = scene.add.rectangle(
    screenCenterX,
    floorY,
    width,
    fillH,
    world.level.platformColor,
  );
  visual.setOrigin(0.5, 0);
  visual.setDepth(10);

  const collider = scene.add.rectangle(
    screenCenterX,
    floorY + surfaceH / 2,
    width,
    surfaceH,
    world.level.platformColor,
    0,
  );
  collider.setDepth(11);
  scene.physics.add.existing(collider);
  const body = collider.body as Phaser.Physics.Arcade.Body;
  body.setAllowGravity(false);
  body.setImmovable(true);
  body.setVelocityX(-world.level.scrollSpeed);
  body.moves = true;
  body.checkCollision.left = false;
  body.checkCollision.right = false;
  body.checkCollision.down = false;
  body.checkCollision.up = true;

  world.handles.platforms.set(eid, collider);
  world.handles.floorVisuals.set(eid, visual);
  world.platformGroup?.add(collider);
}

/** Solid block obstacle sitting on the floor surface (jump over or land on top). */
export function spawnObstacle(
  world: GameWorld,
  scene: Scene,
  screenCenterX: number,
  width: number,
  height: number,
): void {
  const { Position, Obstacle } = world.components;
  const floorY = world.level.floorY;
  const centerY = floorY - height / 2;

  const eid = addEntity(world);
  addComponent(world, eid, Position);
  addComponent(world, eid, Obstacle);
  Position.x[eid] = screenCenterX;
  Position.y[eid] = centerY;

  const rect = scene.add.rectangle(
    screenCenterX,
    centerY,
    width,
    height,
    world.level.obstacleColor,
  );
  rect.setDepth(16);
  scene.physics.add.existing(rect);
  const body = rect.body as Phaser.Physics.Arcade.Body;
  body.setAllowGravity(false);
  body.setImmovable(true);
  body.setVelocityX(-world.level.scrollSpeed);
  body.moves = true;

  world.handles.obstacles.set(eid, rect);
  world.obstacleGroup?.add(rect);
}

export function getPlayerEid(world: GameWorld): number | null {
  const players = query(world, [world.components.Player]);
  return players.length ? players[0]! : null;
}
