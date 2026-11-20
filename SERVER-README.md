# Multiplayer Server — Lobby Alpha

The backend is `server.js` in this same folder. Run `npm install`, configure `.env`, then run `npm start`.

Supported protocol messages: `set_name`, `list_rooms`, `create_room`, `join_room`, `ready`, `start_match`, `leave_room`, `ping`.

Server events include: `welcome`, `profile`, `room_created`, `room_state`, `room_list`, `match_starting`, `left_room`, `pong`, `heartbeat`, `error`.

This is room/lobby infrastructure only. It does not implement authoritative combat simulation, movement synchronization, hit validation, enemy synchronization, persistent accounts, reconnect/resume, or match result persistence. Use for development/closed alpha only.
