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

Floors are often long (variable width); gaps are uncommon (`gapChance`). Block **obstacles** sit on the floor surface and are jumpable; side contact kills.

## Grounded

Set from Arcade `body.blocked.down` / `touching.down` each frame after physics step.

## Runner framing

Player roughly fixed in X; world/floors scroll left at `scrollSpeed`. Falling below the view sets `Dead` and transitions to GameOver.
