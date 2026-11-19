/* Last Contract: Ultimate Edition campaign data. Loaded before the original game engine. */
(function () {
  'use strict';
  const W = 36, H = 16;
  function makeMap(seed, boss = false) {
    const floor = ['.', ';', ',', '~'][seed % 4];
    const g = Array.from({ length: H }, (_, y) => Array.from({ length: W }, (_, x) =>
      (x === 0 || y === 0 || x === W - 1 || y === H - 1) ? '#' : floor));
    // Distinct room structure with multiple lanes and openings.
    for (let y = 2; y < 14; y++) {
      if (![4, 10].includes(y)) g[y][11] = '#';
      if (![5, 11].includes(y)) g[y][24] = '#';
    }
    for (let x = 3; x < 33; x++) {
      if (![6, 18, 29].includes(x)) g[7][x] = '#';
    }
    const put = (x, y, ch) => { if (g[y] && g[y][x] && g[y][x] !== '#') g[y][x] = ch; };
    put(2, 2, 'P'); put(33, 14, 'E');
    // Cover, explosive hazards, pickups, alarms and lighting are varied by floor.
    [[6,3,'c'],[8,11,'c'],[15,4,'c'],[20,10,'c'],[28,3,'c'],[30,12,'c'],[17,12,'x'],[7,8,'x']].forEach(a=>put(...a));
    [[9,2,'A'],[26,13,'A'],[5,13,'a'],[13,3,'m'],[21,13,'v'],[18,2,'n'],[5,5,'L'],[29,5,'T'],[16,13,'Y']].forEach(a=>put(...a));
    const enemies = [
      [7,5,'g'],[9,12,'k'],[15,2,'u'],[17,5,'h'],[21,3,'s'],[28,8,'q'],[30,10,'o'],[19,13,'g'],[4,10,'h']
    ];
    enemies.forEach(a=>put(...a));
    if (boss) { put(30, 9, 'B'); put(27, 10, 'q'); put(28, 11, 'h'); }
    return g.map(row => row.join(''));
  }
  const themes = {
    blacksite: {floor:';',top:'#252a35',face:'#10141d',edge:'#536079',trim:'#ff2e88',dark:0.88,music:'drone',rain:false,voidT:'water'},
    reactor:   {floor:'~',top:'#26383a',face:'#0e1b1d',edge:'#4b8581',trim:'#2de2d0',dark:0.86,music:'drone',rain:false,voidT:'water'},
    deadcity:  {floor:';',top:'#30303b',face:'#15151d',edge:'#66677c',trim:'#ff2e88',dark:0.88,music:'rain',rain:true,voidT:'drop'},
    embassy:   {floor:',',top:'#39302d',face:'#1d1717',edge:'#88705c',trim:'#f2c14e',dark:0.83,music:'drone',rain:false,voidT:'water'},
    blackmarket:{floor:'~',top:'#351e35',face:'#1a1020',edge:'#80527e',trim:'#2de2d0',dark:0.86,music:'club',rain:false,voidT:'water'}
  };
  const acts = ['Act V: The Ghost Protocol', 'Act VI: The Final Judgment'];
  const definitions = [
    [4,'Blacksite','blacksite','Clear the blacksite and recover the erased personnel file.', 'clear'],
    [4,'The Interrogation','office','Reach the informant before the extraction team closes in.', 'survive'],
    [4,'Cold Storage','warehouse','A private weapons lab is hiding behind the cold-storage wing.', 'clear'],
    [4,'The Reactor','reactor','Disable the security team guarding the reactor control room.', 'clear'],
    [4,'Project Zero','blacksite','The Warden was built to erase witnesses. End the program.', 'boss','The Warden',78],
    [5,'Dead City','deadcity','A city-wide lockdown has turned every street into a kill zone.', 'survive'],
    [5,'The Embassy','embassy','The diplomatic quarter is a fortress. Get through it.', 'clear'],
    [5,'The Black Market','blackmarket','Destroy the weapons exchange and cut off the final supply line.', 'clear'],
    [5,'The Last Stand','tower','The Architect has sent every remaining crew to stop you.', 'boss','The Auditor',92],
    [5,'Final Contract','penthouse','One last floor. One last name. Close the contract.', 'boss','The Architect',125]
  ];
  const levels = definitions.map((d, i) => {
    const boss = d[4] === 'boss';
    const obj = d[4] === 'survive' ? {type:'survive',time:75 + i*4} : boss ? {type:'target'} : {type:'clear'};
    const level = {act:d[0],name:d[1],theme:d[2],par:175 + i*8,obj,brief:d[3],map:makeMap(i+1,boss)};
    if (boss) level.boss = {name:d[5],hp:d[6],kind:'boss',grenades:true};
    return level;
  });
  const story = {
    act4:{k:'Act V: The Ghost Protocol',lines:['The Chairman was only the public face.','A classified program erased the people who signed the contracts.','The Warden is waiting inside the blacksite.','Find the source code. End the program.']},
    act5:{k:'Act VI: The Final Judgment',lines:['The city is sealed. Every exit is watched.','The remaining crews have been paid in advance.','The Auditor knows what happened to the old network.','The Architect is the last name on the list.']}
  };
  window.LCExpansion = {acts, themes, levels, story};
})();
