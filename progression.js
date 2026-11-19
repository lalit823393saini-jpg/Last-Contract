/* Persistent player progression. Stored separately so the original campaign save is untouched. */
(function () {
  'use strict';
  const KEY = 'lastContract.progression.v1';
  const defaults = {xp:0,level:1,points:0,skills:{vitality:0,damage:0,salvage:0}};
  let data = load();
  function load(){ try { const saved=JSON.parse(localStorage.getItem(KEY)||'{}')||{}; return {...defaults,...saved,skills:{...defaults.skills,...(saved.skills||{})}}; } catch { return {...defaults,skills:{...defaults.skills}}; } }
  function save(){ try { localStorage.setItem(KEY,JSON.stringify(data)); } catch(e) { console.warn('[Last Contract] Progression save failed',e); } render(); }
  function nextXP(){ return 140 + (data.level-1)*65; }
  function award(amount, reason='Contract') {
    const before=data.level; data.xp += Math.max(0,Math.round(amount));
    while(data.xp >= nextXP()){ data.xp -= nextXP(); data.level++; data.points++; }
    save();
    if(data.level>before) toast('LEVEL UP',`Level ${data.level} · ${data.points} skill point${data.points===1?'':'s'} available`);
    return data.level-before;
  }
  function toast(kicker,title){
    const el=document.createElement('div'); el.className='lc-toast'; el.innerHTML=`<small>${kicker}</small><b>${title}</b>`; document.body.appendChild(el);
    requestAnimationFrame(()=>el.classList.add('show')); setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.remove(),350);},2600);
  }
  const skills = {
    vitality:{name:'Vitality',desc:'+10 maximum health per rank.',max:3},
    damage:{name:'Deadeye',desc:'+5% weapon damage per rank.',max:3},
    salvage:{name:'Scavenger',desc:'+10% cash earned per rank.',max:3}
  };
  function spend(id){ if(!skills[id]||data.points<1||data.skills[id]>=skills[id].max)return; data.points--; data.skills[id]++; save(); }
  function open(){ const el=document.getElementById('lcProgression'); if(el){el.classList.add('open');render();} }
  function close(){document.getElementById('lcProgression')?.classList.remove('open');}
  function render(){
    const hud=document.getElementById('lcProgressHud');
    if(hud) hud.textContent=`LV ${data.level} · ${data.xp}/${nextXP()} XP`;
    const info=document.getElementById('lcProgressInfo'); if(info) info.textContent=`Level ${data.level} · ${data.points} skill point${data.points===1?'':'s'}`;
    const list=document.getElementById('lcSkillList'); if(!list)return;
    if(!document.getElementById('lcProgression')?.classList.contains('open')) return;
    list.innerHTML='';
    Object.entries(skills).forEach(([id,s])=>{
      const rank=data.skills[id]||0, row=document.createElement('div'); row.className='lc-skill';
      const copy=document.createElement('div'); copy.innerHTML=`<b>${s.name} <span>${rank}/${s.max}</span></b><small>${s.desc}</small>`;
      const btn=document.createElement('button'); btn.textContent=rank>=s.max?'MAX':'Upgrade'; btn.disabled=data.points<1||rank>=s.max; btn.addEventListener('click',()=>spend(id));
      row.append(copy,btn); list.append(row);
    });
  }
  function mount(){
    const grid=document.querySelector('#menu .menugrid');
    if(grid&&!document.getElementById('lcSkillTreeBtn')){const b=document.createElement('button');b.id='lcSkillTreeBtn';b.className='ghost';b.textContent='Skill Tree';b.addEventListener('click',open);grid.append(b);}
    const hud=document.getElementById('hud');
    if(hud&&!document.getElementById('lcProgressHud')){const p=document.createElement('div');p.id='lcProgressHud';hud.append(p);}
    if(!document.getElementById('lcProgression')){
      const modal=document.createElement('div'); modal.id='lcProgression'; modal.innerHTML=`<section class="lc-panel"><div class="lc-kicker">Operator development</div><h2>Skill Tree</h2><p id="lcProgressInfo"></p><div id="lcSkillList"></div><button id="lcSkillClose" class="ghost">Return to game</button></section>`; document.body.append(modal);
      modal.addEventListener('click',e=>{if(e.target===modal)close();}); modal.querySelector('#lcSkillClose').addEventListener('click',close);
    }
    render();
  }
  window.LCProgression = {
    award, onKill(enemy,how){award(enemy?.isBoss?120:how==='takedown'?30:20, 'Elimination');},
    onFloorClear(){award(90,'Floor cleared');},
    damageMultiplier(){return 1+(data.skills.damage||0)*0.05;},
    healthBonus(){return (data.skills.vitality||0)*10;},
    cashMultiplier(){return 1+(data.skills.salvage||0)*0.10;},
    snapshot(){return JSON.parse(JSON.stringify(data));}, open, close, render
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
