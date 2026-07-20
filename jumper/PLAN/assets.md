# Assets

## Source library

`assets-source/Environments/` holds third-party environment packs (~3.1MB). Includes parallax layers, tilesets, PSD/Aseprite sources, and previews. It is **not** under `public/`, so it is not published to `dist`.

**Missing for v1:** music, SFX. Player sprites: `assets-source/Spritesheets/` → `public/assets/sprites/` (oldman, bearded, hat-man, woman idle/walk).

## Packs useful for parallax

Mountain Dusk (A/B/C/Old), night-town, ships-graveyard, HauntedForest, Rocky Pass, Junk Wastelands, mist-forest, Underwater Fantasy, country-platform, caverns, forest-road, lava.

## Packs useful for platforms/tiles

country-platform, mist-forest, HauntedForest, Gothic packs, Rocky Beach/Pass, caverns, Modular-tileset, grunge, Day-Platformer.

## Curation rule

Copy **only runtime PNGs** into:

```
public/assets/levels/<levelId>/
public/assets/sprites/   # character sheets (curated from assets-source/Spritesheets)
public/assets/audio/     (later)
```

The full pack library lives in `assets-source/Environments/` and character sources in `assets-source/Spritesheets/` (not under `public/`, so Vite does not copy the whole tree into `dist`). Do not ship PSD, Aseprite, or preview images in published level folders.

## First level files

Mountain Dusk version A layers → `public/assets/levels/mountain-dusk/`  
country-platform tileset → same folder (or referenced path) for platforms.
