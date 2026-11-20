import http from 'node:http';
import { randomBytes, randomUUID } from 'node:crypto';
import { WebSocketServer, WebSocket } from 'ws';

const PORT = Number(process.env.PORT || 2567);
const ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').map(x => x.trim()).filter(Boolean);
const rooms = new Map();
const clients = new Map();
const MAX_ROOMS = Number(process.env.MAX_ROOMS || 100);
const MAX_MESSAGE = 4096;
const code = () => randomBytes(3).toString('hex').toUpperCase();
const send = (ws, type, data={}) => { if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({type, ...data})); };
const publicRoom = r => ({code:r.code, mode:r.mode, players:r.players.size, maxPlayers:r.maxPlayers, status:r.status});
function broadcast(room, type, data={}) { for (const p of room.players.values()) send(p.ws, type, data); }
function roomState(room) { return {room:publicRoom(room), players:[...room.players.values()].map(p=>({id:p.id,name:p.name,ready:p.ready,host:p.id===room.hostId}))}; }
function leave(ws) {
  const c=clients.get(ws); if (!c) return;
  clients.delete(ws);
  if (!c.roomCode) return;
  const r=rooms.get(c.roomCode); if (!r) return;
  r.players.delete(c.id);
  if (!r.players.size) rooms.delete(r.code);
  else { if (r.hostId===c.id) r.hostId=r.players.keys().next().value; broadcast(r,'room_state',roomState(r)); }
}
const server=http.createServer((req,res)=>{
  if(req.url==='/health') {res.writeHead(200,{'content-type':'application/json','access-control-allow-origin':'*'});res.end(JSON.stringify({ok:true,service:'last-contract-multiplayer',rooms:rooms.size,uptime:Math.round(process.uptime())}));return;}
  res.writeHead(404,{'content-type':'application/json'});res.end('{"error":"not_found"}');
});
const wss=new WebSocketServer({server,maxPayload:MAX_MESSAGE,verifyClient:({origin},done)=>{ if(origin && ORIGINS.includes(origin)) done(true); else done(false,403,'Origin not allowed; configure ALLOWED_ORIGINS'); }});
wss.on('connection',ws=>{
  const client={id:randomUUID(),name:'Operative',roomCode:null,lastMessage:Date.now()}; clients.set(ws,client);
  send(ws,'welcome',{playerId:client.id,protocol:1});
  ws.on('message',raw=>{
    let msg; try { msg=JSON.parse(raw.toString()); } catch { send(ws,'error',{code:'BAD_JSON'}); return; }
    if(!msg||typeof msg.type!=='string') return send(ws,'error',{code:'BAD_MESSAGE'});
    client.lastMessage=Date.now();
    if(msg.type==='set_name') { const n=String(msg.name||'').trim().replace(/[<>\x00-\x1f]/g,'').slice(0,18); if(n) client.name=n; send(ws,'profile',{name:client.name}); return; }
    if(msg.type==='list_rooms') { send(ws,'room_list',{rooms:[...rooms.values()].filter(r=>r.status==='waiting').map(publicRoom)}); return; }
    if(msg.type==='create_room') {
      if(client.roomCode) return send(ws,'error',{code:'ALREADY_IN_ROOM'});
      if(rooms.size>=MAX_ROOMS) return send(ws,'error',{code:'SERVER_FULL'});
      const mode=msg.mode==='pvp'?'pvp':msg.mode==='coop'?'coop':null;
      if(!mode) return send(ws,'error',{code:'INVALID_MODE'});
      const maxPlayers=Math.max(2,Math.min(8,Number(msg.maxPlayers)||4));
      let roomCode; do {roomCode=code();} while(rooms.has(roomCode));
      const room={code:roomCode,mode,maxPlayers,status:'waiting',hostId:client.id,players:new Map()};
      room.players.set(client.id,{id:client.id,name:client.name,ready:true,ws}); rooms.set(roomCode,room); client.roomCode=roomCode;
      send(ws,'room_created',roomState(room)); return;
    }
    if(msg.type==='join_room') {
      if(client.roomCode) return send(ws,'error',{code:'ALREADY_IN_ROOM'});
      const r=rooms.get(String(msg.code||'').toUpperCase());
      if(!r) return send(ws,'error',{code:'ROOM_NOT_FOUND'});
      if(r.status!=='waiting'||r.players.size>=r.maxPlayers) return send(ws,'error',{code:'ROOM_FULL_OR_STARTED'});
      r.players.set(client.id,{id:client.id,name:client.name,ready:false,ws}); client.roomCode=r.code;
      broadcast(r,'room_state',roomState(r)); return;
    }
    const r=client.roomCode&&rooms.get(client.roomCode); if(!r) return send(ws,'error',{code:'NOT_IN_ROOM'});
    if(msg.type==='leave_room') { leave(ws); send(ws,'left_room'); return; }
    if(msg.type==='ready') { if(r.status!=='waiting') return send(ws,'error',{code:'MATCH_ALREADY_STARTED'}); const p=r.players.get(client.id); if(!p) return send(ws,'error',{code:'NOT_IN_ROOM'}); p.ready=!!msg.ready; broadcast(r,'room_state',roomState(r)); return; }
    if(msg.type==='start_match') {
      if(r.status!=='waiting') return send(ws,'error',{code:'MATCH_ALREADY_STARTED'});
      if(r.hostId!==client.id) return send(ws,'error',{code:'HOST_ONLY'});
      if(r.players.size<2) return send(ws,'error',{code:'NEED_TWO_PLAYERS'});
      if([...r.players.values()].some(p=>!p.ready)) return send(ws,'error',{code:'PLAYERS_NOT_READY'});
      r.status='starting'; broadcast(r,'match_starting',{mode:r.mode,roomCode:r.code,players:roomState(r).players}); return;
    }
    if(msg.type==='ping') send(ws,'pong',{time:Date.now()});
    else send(ws,'error',{code:'UNKNOWN_ACTION'});
  });
  ws.on('close',()=>leave(ws)); ws.on('error',()=>leave(ws));
});
const heartbeat=setInterval(()=>{ for(const [ws,c] of clients){ if(Date.now()-c.lastMessage>45000){ws.terminate();leave(ws);} else send(ws,'heartbeat'); } },15000);
server.listen(PORT,'0.0.0.0',()=>console.log(`Last Contract lobby server listening on :${PORT}`));
process.on('SIGTERM',()=>{clearInterval(heartbeat);wss.close();server.close();});
