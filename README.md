# Last Contract: Ultimate Edition

A modular browser-based neo-noir top-down action shooter. The original campaign remains in place and is extended from 14 to 24 floors across six acts. Existing campaign save data continues to use the original `lastContract.save.v2` key; the new XP and skill-tree data is stored separately.

## Run locally

Open `index.html` in a modern browser. For service-worker/offline testing, serve this folder over localhost (for example `python -m http.server 8080`) and open `http://localhost:8080`.

## GitHub Pages

Upload the complete folder contents to the repository root, then enable GitHub Pages from `main` / root. This GitHub-ready package is intentionally flat to match a repository where files are uploaded directly into the root. Upload every file in this ZIP to the repository root and allow GitHub to replace files with the same names. If you publish from a `/repository-name/` project URL, keep all files together in the root.

## Structure

- `index.html` – application shell
- `game.css` – original game styling
- `game.js` – original game engine and campaign logic
- `campaign-expansion.js` – five new floors in each of Acts V and VI, new themes and story beats
- `progression.js` – XP, player levels, skill points and persistent skill tree
- `manifest.webmanifest` – installable web-app metadata
- `sw.js` – versioned offline cache
- `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` – app icons

## New content

- Floors 15–24: Blacksite, The Interrogation, Cold Storage, The Reactor, Project Zero, Dead City, The Embassy, The Black Market, The Last Stand and Final Contract.
- New bosses: The Warden, The Auditor and The Architect.
- New Acts V and VI with story transitions.
- Persistent XP and player levels; eliminations and cleared floors grant XP.
- Spend skill points on Vitality (+10 max health/rank), Deadeye (+5% weapon damage/rank) and Scavenger (+10% cash/rank).

## Existing systems retained

The original 14 floors, difficulty settings, weapons, grenades, flashbangs, perks, permanent shop upgrades, suits, achievements, daily challenge, Boss Rush, Endless mode, touch controls, settings and local campaign save remain in the original game engine.

## Save compatibility

The existing campaign save key is unchanged. The new progression system uses `lastContract.progression.v1`, so adding it does not overwrite existing stars, unlocked floors, cash, purchases, suits or settings. Back up browser local storage before testing any major game update.

## Validation and release smoke test

The source is split into classic browser scripts to preserve the original engine's global event handlers. Static checks and campaign-map integrity checks are documented in `TEST-REPORT.md`. A full interactive browser run could not be completed in the build environment, so manually verify the deployed game before announcing it as fully tested: load the homepage, start a new campaign, clear a floor, continue to the next floor, open and spend a skill point, refresh to confirm save persistence, test touch controls on a phone, and reload once offline to check the service-worker cache.
