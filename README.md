# Last Contract

A top-down neo-noir action shooter that runs in any modern browser, on desktop and on phones.

A story told across four acts and fourteen floors. Five bosses with cinematic intros, alarm panels that call in reinforcements, enemies that talk and reload, a soundtrack that rises with the fight, grenades and flashbangs, perks, a shop with permanent upgrades, unlockable suits, achievements, a daily challenge with a new modifier every day, a boss rush, and an endless survival mode. No install, no build step: it is one HTML file.

## Play

Once GitHub Pages is on (see below), the game lives at:

```
https://YOUR-USERNAME.github.io/REPO-NAME/
```

On a phone, open that link, then use **Add to Home Screen** (Safari share menu on iPhone, or the browser menu on Android). It then opens fullscreen like an app and works offline.

## Controls

| Desktop | Phone | Action |
|---|---|---|
| WASD | Touch and drag anywhere on the left | Move |
| Mouse + click | Drag the pink stick (tap it for a quick shot) | Aim and shoot |
| Space | Roll | Combat roll, can’t be hit mid-roll |
| E or right click | Strike | Melee; unaware, stunned or blinded enemies go down in one |
| Shift | Focus (tap to toggle) | Slow time |
| G / F | Frag / Flash (drag to aim, tap to auto-target) | Throw a grenade or flashbang |
| R | Reload | Reload |
| 1 2 3 4 / wheel | Swap (shows gun and ammo) | Pistol, shotgun, rifle, SMG |
| Esc | Pause | Pause |

On phones you can change the touch button size and switch to a left-handed layout in Settings.

## Publish it on GitHub Pages

1. Create a new **public** repository on github.com (for example `last-contract`).
2. Click **Add file → Upload files** and drag in everything from this folder: `index.html`, `manifest.webmanifest`, `sw.js`, `README.md` and the `icons` folder. Commit.
3. Go to **Settings → Pages**. Under **Build and deployment**, set **Source** to *Deploy from a branch*, choose the `main` branch and the `/ (root)` folder, then **Save**.
4. Wait a minute or two. The page shows your live link at the top: `https://YOUR-USERNAME.github.io/last-contract/`.

To update the game later, upload the new `index.html` over the old one. If players still see the old version, bump `CACHE` in `sw.js` (for example to `last-contract-v2`) in the same commit.

## Files

- `index.html` – the whole game (HTML, CSS and JavaScript in one file)
- `manifest.webmanifest` – lets phones install it as an app
- `sw.js` – caches the game for fast loading and offline play
- `icons/` – app icons

Progress, stars, perks, settings, achievements and endless-mode records are saved in the player’s browser.

## Performance

Graphics quality adjusts itself automatically (Settings → Graphics: Auto, High, Medium, Low). Old bodies are painted into the floor, dropped items despawn and effects are capped, so long sessions stay smooth.
