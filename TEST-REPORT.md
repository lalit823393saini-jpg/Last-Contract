# Test report — Ultimate Edition release audit

## Passed

- `node --check game.js`
- `node --check campaign-expansion.js`
- `node --check progression.js`
- HTML has no duplicate IDs; all direct `$('id')` references in the game engine resolve to an element in the page.
- All local stylesheet, script, manifest and icon references exist.
- Expansion data loads: 2 added acts, 10 added floors and 5 added themes.
- All 10 added maps are 36 × 16, use supported tile symbols, contain exactly one player start and one exit, and have a reachable exit using the game's walkable-tile rules.
- Manifest parses as JSON and uses relative `start_url` and `scope`, suitable for a GitHub Pages project subpath.
- Every service-worker precache entry exists in the package.
- Service-worker activation only removes older caches prefixed `last-contract-`; it no longer deletes unrelated caches on the shared `username.github.io` origin.
- Original campaign difficulty progression is preserved for the original 14 floors; the added floors use the capped endgame difficulty.
- Original campaign save key `lastContract.save.v2` remains unchanged. New progression uses `lastContract.progression.v1`.

## Not verified in this environment

A full interactive browser run was attempted with the available headless Chromium binary, but Chromium did not complete startup within the test timeout. Therefore actual combat, all floor transitions, boss behavior, visual rendering, audio, touch controls, installation and offline operation have not been verified in a real browser/device session. Static checks cannot prove the game is free of runtime or gameplay bugs.

## Release recommendation

The package passes the available static and data-integrity checks and is structured for GitHub Pages when the complete folder is published. Before announcing it as fully tested, perform the short manual smoke test in `README.md` on the deployed GitHub Pages URL, including at least one desktop browser and one phone. Keep the backup of the original single-file build.
