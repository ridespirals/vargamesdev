# Sprite animation

## Design

Animation advances on an **animation clock** (elapsed real time / clip frame durations), **not** the physics fixed-step count. Clips with different frame counts or rates stay independent of sim rate.

## Clip config

```ts
interface AnimationClip {
  id: string;
  frames: string[];      // texture frame keys, or single texture + frame indices
  msPerFrame: number;    // or per-frame durations later
  loop: boolean;
}
```

## AnimState component

- `clipId`, `frameIndex`, `elapsedInFrame`
- AnimationSystem adds `delta`, advances frames, wraps or holds on last frame.
- Render sync applies the current frame to the Phaser sprite.

## v1 player

Placeholder colored rect (no sheet). Animation system still runs so clips can attach when art arrives; optional idle “pulse” via scale or tint if useful for proving the clock.
