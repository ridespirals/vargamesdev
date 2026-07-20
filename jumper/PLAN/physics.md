# Physics

## Approach

Phaser **Arcade Physics** handles gravity, collision, and jump impulse. ECS mirrors intent and readable state.

## Jump

- Single jump when `Grounded` and `JumpIntent` is set.
- Impulse = `LevelConfig.jumpVelocity` (negative Y in Phaser).
- Tuned for a **low apex with extra hang**: gravity and jump impulse are scaled together so peak height stays similar while airtime lasts longer. Scroll speed is unchanged.
- Clear `JumpIntent` after consumption.
- No double-jump in v1.

## Jump reach vs gaps

Approximate clearable gap while airborne:

`reach ≈ 2 * |jumpVelocity| / gravity * scrollSpeed`

Spawn clamps `maxGap` to `0.75 * reach` via `maxSafeGapPx()` so gaps stay jumpable.

## Floors / collision

Floors use a tall **visual** (surface → screen bottom) plus a **thin top collider**. The collider only enables `checkCollision.up` so the player does not clip into the sides of the fill.

Floors are often long (variable width); gaps are uncommon (`gapChance`). Block **obstacles** sit on the floor and **block** the player (no instant kill); being shoved off the left edge of the screen ends the run.

## Grounded

Set from Arcade `body.blocked.down` / `touching.down` each frame after physics step.

## Runner framing

Player holds a fixed X unless blocked on the right by an obstacle (then physics can push them left). Death when the player is **fully** off-screen left (`right edge < 0`) or falls through a pit below the view.

Lock X by writing the Arcade **body** position (and `prev` / `prevFrame`) when already at the lock so `postUpdate` does not double-apply motion. After a shove, recover toward lock with **velocity** (not a teleport) so obstacles still block. Never full-`sprite.setPosition` after the physics step on a moving body.

Placeholder anim must not `setScale` the physics Game Object — Arcade derives body size/offset from transform scale and it warps jump feel.
