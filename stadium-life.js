// Decorative match movement shares the stadium projection; it does not alter results.
const at=(x,y,z=0)=>({x,y,z});
const random=seed=>{let n=seed>>>0;return ()=>{n=(1664525*n+1013904223)>>>0;return n/4294967296}};
// Local wandering routes stay in a clear band beyond the actual stand backs.
// Curves stay in the registered clear circulation area; arrivals approach entrances.
export function exteriorPeople(project,phase,bounds,figureScale=1){
 const matchday=['prematch','live','postmatch'].includes(phase);
 const n=phase==='prematch'?156:phase==='live'?6:phase==='postmatch'?112:24;
 const {left,right,top,bottom}=bounds,far=[],near=[];
 const position=(side,t,d)=>side===0?at(left+(right-left)*t,top-d,.1):side===1?at(right+d,top+(bottom-top)*t,.1):side===2?at(left+(right-left)*t,bottom+d,.1):at(left-d,top+(bottom-top)*t,.1);
 const colours=['#bc6845','#437a92','#d8ba73','#754a79','#6f987a','#c3cbd0','#283e63'];
 const glyph=(i)=>`<g transform="scale(${2.2*figureScale})"><ellipse cy="0" rx="1.4" ry=".5" fill="#14252b66"/><g class="walker-body" transform="translate(0 -2.7)" style="--walk-delay:-${i%9*.1}s"><path d="M-.7 1L-.9 2.5M.7 1L.9 2.5" stroke="#27353d" stroke-width=".7"/><rect x="-1" y="-1.1" width="2" height="2.4" rx=".4" fill="${colours[i%colours.length]}"/><circle cy="-1.8" r=".7" fill="#e2ba95"/></g></g>`;
 for(let i=0;i<n;i++){
  const side=i%4,rng=random(107+i*61),centre=.10+rng()*.80,span=.06+rng()*.14,worldPoints=[],approach=(phase==='prematch'||phase==='postmatch')&&i%3===0;
  // Friends share a neighbourhood, while changing depth and direction individually.
  for(let k=0;k<6;k++)worldPoints.push(position(side,Math.max(.06,Math.min(.94,centre+(rng()-.5)*span*2)),.22+rng()*(matchday?.63:1.18)));
  if(approach){const entrance=centre<.33?.18:centre>.67?.82:.5;for(let k=2;k<6;k++)worldPoints[k]=position(side,centre+(entrance-centre)*(k-1)/4,.65-(k-1)*.30);if(phase==='postmatch')worldPoints.reverse();}
  const points=worldPoints.map(project);
  const start={x:(points[5].x+points[0].x)/2,y:(points[5].y+points[0].y)/2};
  let route=`M0,0`;
  points.forEach((q,k)=>{const r=points[(k+1)%points.length];route+=`Q${(q.x-start.x).toFixed(2)},${(q.y-start.y).toFixed(2)} ${((q.x+r.x)/2-start.x).toFixed(2)},${((q.y+r.y)/2-start.y).toFixed(2)}`});
  const group=`<g class="stadium-walker" data-exterior-role="visitor" data-walk-side="${side}" data-walk-points='${JSON.stringify(worldPoints)}' data-walk-kind="${approach?phase==='prematch'?'arrival':'departure':'wander'}" transform="translate(${start.x.toFixed(2)} ${start.y.toFixed(2)})"><g><animateMotion path="${route}Z" dur="${35+i%11*4}s" begin="-${i*3.73}s" keyPoints="0;.18;.18;.52;.76;.76;1" keyTimes="0;.16;.23;.50;.70;.79;1" calcMode="linear" repeatCount="indefinite"/>${approach?`<animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;.08;.65;.82;1" dur="${35+i%11*4}s" begin="-${i*3.73}s" repeatCount="indefinite"/>`:""}${glyph(i)}</g></g>`;
  (side===0||side===3?far:near).push(group);
 }
 if(matchday){
  // Four pairs of small stalls, set back from entrance gaps and circulation paths.
  for(let side=0;side<4;side++)for(let j=0;j<2;j++){
   const t=j?.73:.27,base=position(side,t,1.35),u=side===0||side===2?at(1.5,0):at(0,1.5),v=side===0||side===2?at(0,.6):at(.6,0),q=(a,b,z)=>at(base.x+u.x*a+v.x*b,base.y+u.y*a+v.y*b,z);
   const polygon=(points,fill)=>`<polygon points="${points.map(p=>{const w=project(p);return w.x.toFixed(2)+','+w.y.toFixed(2)}).join(' ')}" fill="${fill}"/>`,shade=j?'#446e85':'#a64c46';
   let stall=polygon([q(-1,-.5,0),q(1,-.5,0),q(1,.5,0),q(-1,.5,0)],'#27343a55');
   stall+=polygon([q(-1,.5,0),q(1,.5,0),q(1,.5,5.0),q(-1,.5,5.0)],'#9b805d');
   stall+=polygon([q(1,-.5,0),q(1,.5,0),q(1,.5,5.0),q(1,-.5,5.0)],'#685d4c');
   stall+=polygon([q(-1,-.7,5.2),q(1,-.7,5.2),q(1,.7,5.2),q(-1,.7,5.2)],shade);
   for(let stripe=0;stripe<4;stripe++)stall+=polygon([q(-1+stripe*.5,-.7,5.21),q(-.75+stripe*.5,-.7,5.21),q(-.75+stripe*.5,.7,5.21),q(-1+stripe*.5,.7,5.21)],'#e6debd');
   stall+=polygon([q(-.85,.52,2.2),q(.85,.52,2.2),q(.85,.52,3.4),q(-.85,.52,3.4)],'#263b40');
   const label=project(q(0,.53,2.8));stall+=`<text x="${label.x}" y="${label.y}" text-anchor="middle" fill="#ffedb6" font-size="${3.7*figureScale}" font-family="Arial" font-weight="bold">${j?'CLUB SHOP':'PIES'}</text>`;
   const vendor=project(position(side,t,.95));stall+=`<g data-exterior-role="vendor" transform="translate(${vendor.x} ${vendor.y})">${glyph(side*2+j)}</g>`;
   (side===0||side===3?far:near).push(`<g class="matchday-stall" data-stall-id="${side}-${j}">${stall}</g>`);
   if(phase!=='live')for(let k=0;k<(phase==='prematch'?5:3);k++){const q=project(position(side,t+.012*(k-2),.55+(k%2)*.22));(side===0||side===3?far:near).push(`<g class="stadium-queue" data-exterior-role="queue" transform="translate(${q.x} ${q.y})">${glyph(k+side*9)}</g>`)}
  }
 }
 return {far:far.join(''),near:near.join('')};
}
export function pitchPlayers(project,colour,awayColour,motion,figureScale=1){
 const hex=s=>[1,3,5].map(i=>parseInt((s||'#ffffff').slice(i,i+2),16));const a=hex(colour),b=hex(awayColour),similar=a.reduce((n,v,i)=>n+Math.abs(v-b[i]),0)<150;const teamColours=[colour,similar?'#eee5d7':awayColour||'#eee5d7'];
 const attack=[[28,26],[37,31],[44,34],[38,25],[27,29],[32,36],[28,26]];
 const routes=[0,1].map(team=>Array.from({length:11},(_,i)=>{
  if(i===0)return attack.map((_,k)=>at(team?49:23,30+Math.sin(k*Math.PI/3)*1.8,.25));
  const baseX=i<=4?28:i<=7?34:42,baseY=24+(i%4)*4;
  return attack.map(([x,y],k)=>{const frame=k===6?0:k,follow=.22+(i%3)*.1,ownX=team?72-baseX:baseX;return at(Math.max(24,Math.min(48,ownX+(x-36)*.48+Math.sin(frame*1.7+i)*1.5)),Math.max(22,Math.min(38,baseY+(y-baseY)*follow+Math.sin(frame+i)*.8)),.25)});
 }));
  let out='';
 for(let team=0;team<2;team++)for(let i=0;i<(team?motion.awayCount??11:motion.homeCount??11);i++){
  const route=routes[team][i],q=project(route[0]),scoring=motion.scoringTeam===team;
  const routeData=JSON.stringify(route.map(project)),cornerData=JSON.stringify(project(at(team?49:23,team?38:22,.25)));
  out+=`<g data-player-route='${routeData}' data-corner='${cornerData}' data-team="${team}" data-index="${i}" class="pitch-player ${team?'away':'home'}" transform="translate(${q.x.toFixed(1)} ${q.y.toFixed(1)})"><g transform="scale(${4*figureScale})"><ellipse cy="3" rx="1.8" ry=".55" fill="#10252a77"/><path d="M-1.6 -.5L-2.3 .5L-1.5 1L-1.1 .6V1.9H1.1V.6L1.5 1L2.3 .5L1.6 -.5Z" fill="${i===0?(team?'#9281c3':'#d8ae4a'):teamColours[team]}" stroke="#172830" stroke-width=".35"/><path d="M-.7 1.8L-1 3M.7 1.8L1 3" stroke="#172830" stroke-width=".7"/><circle cy="-1.45" r=".8" fill="${i%3?'#e2bb98':'#a47557'}"/></g></g>`;
 }
 const ballRoute=Array.from({length:7},(_,k)=>routes[k%2][1+(k*3)%Math.max(1,((k%2?motion.awayCount:motion.homeCount)??11)-1)][k]);ballRoute[6]=ballRoute[0];const q=project(ballRoute[0]);
 out+=`<circle class="visible-match-ball" data-foot-offset="${10*figureScale}" cx="0" cy="0" r="${4.4*figureScale}" fill="#fff" stroke="#17252d" stroke-width="${1.4*figureScale}" transform="translate(${q.x} ${q.y})"/>`;
 return `<g class="pitch-action" ${motion.paused&&!Number.isInteger(motion.scoringTeam)?'data-paused="true"':''}>${out}</g>`;
}
