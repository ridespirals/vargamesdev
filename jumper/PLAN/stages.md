# Stages

Track progress here. Update status when a stage’s exit criteria are met.

| # | Stage | Status | Exit criteria |
|---|--------|--------|----------------|
| 0 | Docs scaffold | done | PLAN/*, AGENTS.md, README rewritten |
| 1 | Project baseline | done | bitecs installed; Arcade + Gamepad; demo cleared; dist trackable |
| 2 | ECS skeleton | done | World create/reset; PlayScene ticks systems |
| 3 | Input | done | Space/pad sets JumpIntent |
| 4 | Physics player | done | Grounded jump/fall; runner framing |
| 5 | Timer + score HUD | done | Count-up while alive; freeze on death |
| 6 | Parallax | done | Mountain Dusk LevelConfig with N scroll rates |
| 7 | Animation system | done | Time-based clip advance wired (placeholder pulse) |
| 8 | Infinite platforms | done | Spawn/despawn; fall → GameOver |
| 9 | Audio bus | done | API + event hooks; silent missing keys |
| 10 | Dist publish | done | `dist/` built; relative assets OK |
| 11 | Polish / more levels | later | Second theme via new LevelConfig only |

## Notes

- Platforms use immovable Arcade bodies with `-scrollSpeed` velocity (not static bodies).
- Player X is locked for runner framing; Y comes from the physics body.
- Asset paths are relative (`assets/...`) so `/jumper/dist/` on GitHub Pages works with Vite `base: './'`.
