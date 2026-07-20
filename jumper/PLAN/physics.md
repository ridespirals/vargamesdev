# Physics

## Approach

Phaser **Arcade Physics** handles gravity, collision, and jump impulse. ECS mirrors intent and readable state.

## Jump

- Single jump when `Grounded` and `JumpIntent` is set.
- Impulse = `LevelConfig.jumpVelocity` (negative Y in Phaser).
- Clear `JumpIntent` after consumption.
- No double-jump in v1.

## Grounded

Set from Arcade `body.blocked.down` / `touching.down` each frame after physics step.

## Runner framing

Player roughly fixed in X; world/platforms scroll left at `scrollSpeed`. Falling below the view sets `Dead` and transitions to GameOver.
