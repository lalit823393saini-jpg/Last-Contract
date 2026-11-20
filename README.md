# Last Contract v5 — Tactical Arsenal (Single-Folder Package)

All project files are placed directly in this one folder. There are no nested asset or server folders.

## Run the browser game locally

The game is a static browser client. From this folder, start a static server, for example:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## GitHub Pages

Upload the contents of this folder directly into the root of your GitHub repository. GitHub Pages hosts the static browser client. The Node.js multiplayer server files are included in this folder for convenience, but GitHub Pages does not execute them.

## Multiplayer lobby backend (separate deployment)

This package includes `server.js`, `package.json`, `Dockerfile` and `.env.example` in the same folder as the game files.

Requirements: Node.js 20 or newer.

```bash
npm install
```

Copy `.env.example` to `.env`, then set `ALLOWED_ORIGINS` to the exact origin of your deployed GitHub Pages site (for example `https://OWNER.github.io`). Do not leave the example value unchanged.

Start the backend:

```bash
npm start
```

Health endpoint: `/health`. Deploy the backend to a Node.js host that supports persistent WebSocket connections and TLS/WSS. Configure the game's multiplayer server URL to the deployed `wss://` endpoint.

## Important multiplayer limitation

The included backend is a lobby/room-management alpha. It supports Co-op and PvP room types, room codes, readiness, host-only match start and heartbeat. It does NOT yet synchronize real-time player movement, aiming, shooting, enemy AI, damage, projectiles, mission state or match results. Co-op/PvP combat is therefore not yet playable online. Rooms are in-memory and are lost when the server restarts.

## Existing game and saves

The original campaign and local save keys are retained. New weapon and multiplayer files are part of this package. Browser saves remain on each player's device; this package does not provide cloud saves.

## Weapon notes

The expanded arsenal uses the existing combat pipeline. Burst Rifle is not yet a true three-round burst implementation. Flamethrower does not yet apply persistent burn damage. Weapon values require playtesting for balance.

## Files

- `index.html` — game page
- `game.css` — styling
- `game.js` — game engine
- `campaign-expansion.js` — campaign expansion
- `progression.js` — player progression
- `multiplayer-client.js` — multiplayer lobby client
- `server.js` — Node.js WebSocket lobby backend
- `package.json` — backend dependencies and scripts
- `Dockerfile` — backend container build
- `.env.example` — backend configuration example
- `manifest.webmanifest`, `sw.js`, icons — PWA assets
- `TEST-REPORT.md` — package checks and known limitations
- `SERVER-README.md` — backend protocol and deployment notes
