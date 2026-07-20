# Input

## Jump only (v1)

| Device | Binding |
|--------|---------|
| Keyboard | Space |
| Gamepad | A / Cross / bottom face button (`buttons[0]`) |

## Behavior

- Edge-triggered: fire `JumpIntent` on press, not while held.
- JumpInput reads Phaser keyboard + gamepad plugins each frame and writes to the player entity.
