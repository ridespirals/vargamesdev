# ECS (bitECS)

## Split of responsibilities

- **bitECS:** entities, components, queries, system logic (intent, timers, animation clocks, spawn rules, score).
- **Phaser:** GameObjects, Arcade bodies, textures, sound, keyboard/gamepad plugins, scene lifecycle.

Scenes create a world and call systems each `update(time, delta)`.

## Component catalog (v1)

| Component | Purpose |
|-----------|---------|
| `Position` | x, y (synced from/to Arcade body) |
| `Velocity` | vx, vy mirror |
| `Player` | tag |
| `Grounded` | on-floor flag |
| `JumpIntent` | edge-triggered jump request |
| `SpriteRef` | index into a Phaser sprite handle table |
| `AnimState` | clip id, frame index, elapsed ms in frame |
| `ParallaxLayer` | scroll rate, layer index |
| `Platform` | tag for floor surface colliders |
| `Obstacle` | tag for jump-over block hazards |
| `RunTimer` | elapsed ms while run active |
| `Score` | derived points |
| `Dead` | tag when run ended |

Phaser object handles (sprites, bodies, tileSprites) live in **side tables** keyed by entity or by a `SpriteRef` index — TypedArrays cannot hold object refs.

## System order (PlayScene)

1. InputSystem  
2. JumpSystem  
3. PhysicsSyncSystem (ECS ↔ Arcade)  
4. GroundedSystem  
5. TimerScoreSystem  
6. InfiniteSpawnSystem  
7. ParallaxSystem  
8. AnimationSystem  
9. AudioSystem  
10. HudSystem  

## World lifecycle

`createGameWorld()` on Play enter; destroy/reset entities and side tables on restart or leave.
