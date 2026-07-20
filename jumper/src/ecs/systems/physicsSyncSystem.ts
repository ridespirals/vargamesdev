import { hasComponent } from 'bitecs';
import type { GameWorld } from '../world';
import { getDevSettings } from '../../dev/settings';

/** Screen X the runner tries to hold — a goal, not a hard lock. */
export const PLAYER_GOAL_X = 220;

/**
 * How fast the player walks back toward PLAYER_GOAL_X when free (px/sec).
 * Keep this well below scrollSpeed so repeated obstacle shoves can still
 * push the runner off the left edge before they fully recover.
 */
export const PLAYER_CATCH_UP_SPEED = 55;

/**
 * Sync Arcade bodies ↔ Position/Velocity.
 *
 * X framing: PLAYER_GOAL_X is the target. Each frame we nudge a little toward
 * it (not a snap), unless an obstacle is currently shoving. Catch-up is slow
 * on purpose so multiple hits stack pressure toward the left edge.
 *
 * Do not full-`setPosition` after the physics step — Arcade `postUpdate` applies
 * (position - prevFrame) onto the Game Object. Nudging `body.x` while leaving
 * `prevFrame` alone lets that delta carry the catch-up onto the sprite.
 */
export function physicsSyncSystem(world: GameWorld): void {
  const eid = world.playerEid;
  const { Position, Velocity, Dead } = world.components;
  const body = world.handles.bodies.get(eid);
  const sprite = world.handles.sprites.get(eid);
  if (!body || !sprite || hasComponent(world, eid, Dead)) {
    return;
  }

  if (getDevSettings().clipping) {
    body.enable = false;
    body.setAllowGravity(false);
    body.stop();
    body.reset(PLAYER_GOAL_X, sprite.y);
    Position.x[eid] = sprite.x;
    Position.y[eid] = sprite.y;
    Velocity.x[eid] = 0;
    Velocity.y[eid] = 0;
    return;
  }

  if (!body.enable) {
    body.enable = true;
  }
  body.setAllowGravity(true);

  const centerX = body.x + body.halfWidth;
  const shoved = body.blocked.right || body.touching.right;
  const error = PLAYER_GOAL_X - centerX;

  // Clear intentional horizontal velocity; catch-up is applied as a position nudge.
  body.velocity.x = 0;

  if (!shoved && Math.abs(error) > 0.05) {
    const maxStep = PLAYER_CATCH_UP_SPEED * (world.delta / 1000);
    const step = Math.sign(error) * Math.min(maxStep, Math.abs(error));
    // Leave prevFrame alone so postUpdate includes this nudge in the sprite delta.
    body.x += step;
    body.updateCenter();
  }

  Position.x[eid] = body.x + body.halfWidth;
  Position.y[eid] = body.y + body.halfHeight;
  Velocity.x[eid] = body.velocity.x;
  Velocity.y[eid] = body.velocity.y;
}
