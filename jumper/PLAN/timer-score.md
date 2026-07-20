# Timer and score

## RunTimer

- Accumulates real `delta` ms while the player is alive.
- Freezes when `Dead` is set.

## Score

- v1: `score = floor(elapsedMs / 100)` (10 points per second).
- HUD shows elapsed time (mm:ss.t) and score.
- Final score passed to GameOver scene data.
