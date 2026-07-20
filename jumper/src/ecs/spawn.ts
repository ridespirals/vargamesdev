import { addComponent, addEntity, query } from 'bitecs';
import type { Scene } from 'phaser';
import type { GameWorld } from './world';
import type { LevelConfig } from '../levels/types';

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

export function spawnPlayer(world: GameWorld, scene: Scene, x: number, y: number): void {
  const { Position, Velocity, Player, Grounded, JumpIntent, AnimState } = world.components;
  const eid = addEntity(world);
  addComponent(world, eid, Position);
  addComponent(world, eid, Velocity);
  addComponent(world, eid, Player);
  addComponent(world, eid, Grounded);
  addComponent(world, eid, JumpIntent);
  addComponent(world, eid, AnimState);

  Position.x[eid] = x;
  Position.y[eid] = y;
  Velocity.x[eid] = 0;
  Velocity.y[eid] = 0;
  Grounded[eid] = 0;
  JumpIntent[eid] = 0;
  AnimState.clipId[eid] = 0;
  AnimState.frameIndex[eid] = 0;
  AnimState.elapsedInFrame[eid] = 0;

  const rect = scene.add.rectangle(x, y, 28, 36, 0xf0c040);
  rect.setDepth(20);
  scene.physics.add.existing(rect);
  const body = rect.body as Phaser.Physics.Arcade.Body;
  body.setCollideWorldBounds(false);
  body.setMaxVelocity(600, 1000);
  body.setSize(28, 36);

  world.handles.sprites.set(eid, rect);
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

    const tile = scene.add.tileSprite(0, 0, w, h, layer.key);
    tile.setOrigin(0, 0);
    tile.setDepth(layer.depth);
    tile.setScrollFactor(0);
    const tex = scene.textures.get(layer.key).getSourceImage() as HTMLImageElement;
    if (tex?.height) {
      const scale = h / tex.height;
      tile.setTileScale(scale, scale);
    }
    world.handles.parallax.set(eid, tile);
  }
}

export function spawnPlatform(
  world: GameWorld,
  scene: Scene,
  x: number,
  y: number,
  width: number,
  height: number,
): void {
  const { Position, Platform } = world.components;
  const eid = addEntity(world);
  addComponent(world, eid, Position);
  addComponent(world, eid, Platform);
  Position.x[eid] = x;
  Position.y[eid] = y;

  const rect = scene.add.rectangle(x, y, width, height, world.level.platformColor);
  rect.setDepth(15);
  scene.physics.add.existing(rect);
  const body = rect.body as Phaser.Physics.Arcade.Body;
  body.setAllowGravity(false);
  body.setImmovable(true);
  body.setVelocityX(-world.level.scrollSpeed);
  body.moves = true;

  world.handles.platforms.set(eid, rect);
  world.platformGroup?.add(rect);
}

export function getPlayerEid(world: GameWorld): number | null {
  const players = query(world, [world.components.Player]);
  return players.length ? players[0]! : null;
}
