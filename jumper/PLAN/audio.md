# Audio

## AudioBus

Thin wrapper over `Phaser.Sound`:

- `playAmbient(key)` — looping BGM; replaces current ambient
- `playMusic(key)` — non-loop (or loop) sting/track at a cue time
- `playSfx(key)` — one-shot
- `stopAmbient()` / `mute` helpers

## Events

Systems/entities emit named cues: `jump`, `land`, `die`, plus level `musicCues` by elapsed ms.

## v1

No audio files yet. Bus no-ops (or skips) missing keys without throwing. Drop files under `public/assets/audio/` and register in Preload when available.
