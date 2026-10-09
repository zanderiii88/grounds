const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Rows run from forwards to goalkeeper. Opponents are rotated to attack the other goal.
export function formationMarkers(rows,lineup,opponent=false){
 let at=0;
 return rows.flatMap((row,i)=>row.map((role,j)=>{
  const x=5+(j+1)*100/(row.length+1),y=97+i*58/(rows.length-1);
  return {role,id:lineup[at++],x:opponent?110-x:x,y:opponent?170-y:y};
 }));
}
export function formationPitch(own,opponent){
 const markers=(team,side)=>formationMarkers(team.rows,team.lineup,side==='opponent').map(m=>{
  const p=team.players[m.id],label=p?`${p.name} · ${m.role} · ${p.rating}${side==='opponent'?' estimated ability':' OVR'}`:`Vacant · ${m.role}`;
  return `<g class="formation-marker" data-team="${side}" data-role="${m.role}" data-player="${escape(m.id||'')}" transform="translate(${m.x} ${m.y})"><title>${escape(label)}</title>${p?`<image href="${escape(m.role==='GK'?team.keeperKit:team.kit)}" x="-7" y="-8" width="14" height="14"/><text y="1" class="board-number">${escape(p.number)}</text>`:'<circle r="5" fill="#4d5d63" stroke="white"/>'}<text y="10" class="board-role">${m.role}</text></g>`;
 }).join('');
 return `<svg class="formation-pitch" viewBox="0 0 110 170" role="img" aria-label="${escape(own.name)} selected ${escape(own.shape)} against ${escape(opponent.name)} projected ${escape(opponent.shape)}"><rect width="110" height="170" rx="2" fill="#286647"/>${Array.from({length:8},(_,i)=>`<rect x="5" y="${5+i*20}" width="100" height="20" fill="${i%2?'#2d704d':'#286647'}"/>`).join('')}<g fill="none" stroke="#eef2df" stroke-width=".65"><rect x="5" y="5" width="100" height="160"/><path d="M5 85H105"/><circle cx="55" cy="85" r="10"/><path d="M24 5V31H86V5 M39 5V15H71V5 M24 165V139H86V165 M39 165V155H71V165 M49 5V1H61V5 M49 165V169H61V165 M45 31Q55 39 65 31 M45 139Q55 131 65 139"/><path d="M5 8Q8 8 8 5 M102 5Q102 8 105 8 M5 162Q8 162 8 165 M102 165Q102 162 105 162"/></g><g fill="#eef2df"><circle cx="55" cy="85" r=".7"/><circle cx="55" cy="23" r=".7"/><circle cx="55" cy="147" r=".7"/></g>${markers(opponent,'opponent')}${markers(own,'own')}</svg>`;
}
