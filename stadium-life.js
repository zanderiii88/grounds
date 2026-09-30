// Decorative match movement shares the stadium projection; it does not alter results.
const at=(x,y,z=0)=>({x,y,z});
export function exteriorPeople(project,phase,bounds){
 const n=phase==='prematch'?100:phase==='live'?12:28;
 const {left,right,top,bottom}=bounds,routes=[[at(left,top),at(right,top),at(right,bottom),at(left,bottom),at(left,top)]];
 const far=[],near=[];
 for(let i=0;i<n;i++){
  const lane=.35+(i%3)*.24,route=routes[0].map(p=>at(p.x+(p.x<36?-lane:lane),p.y+(p.y<30?-lane:lane),.1));
  if(i%2)route.reverse();const slot=(i/n)*4,segment=Math.floor(slot),t=slot-segment,a=route[segment],b=route[segment+1],start=at(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,.1);const lap=[start,...Array.from({length:4},(_,k)=>route[(segment+1+k)%4]),start];const points=lap.map(project),first=points[0];
  const colours=['#bc6845','#437a92','#d8ba73','#754a79','#6f987a'];
  const person=`<g class="stadium-walker" transform="translate(${first.x.toFixed(1)} ${first.y.toFixed(1)})"><animateTransform attributeName="transform" type="translate" values="${points.map(p=>p.x.toFixed(1)+' '+p.y.toFixed(1)).join(';')}" dur="${72+(i%7)*5}s" begin="-${i*7.31}s" repeatCount="indefinite"/><g transform="scale(1.8)"><ellipse cy="2.7" rx="1.4" ry=".5" fill="#14252b66"/><path d="M-.7 1L-.9 2.5M.7 1L.9 2.5" stroke="#27353d" stroke-width=".7"/><rect x="-1" y="-1.1" width="2" height="2.4" rx=".4" fill="${colours[i%colours.length]}"/><circle cy="-1.8" r=".7" fill="#e2ba95"/></g></g>`;
  // Each route traverses the perimeter; stadium geometry occludes walkers behind it.
  far.push(person);
 }
 return {far:far.join(''),near:near.join('')};
}
export function pitchPlayers(project,colour,awayColour,motion){
 const hex=s=>[1,3,5].map(i=>parseInt((s||'#ffffff').slice(i,i+2),16));const a=hex(colour),b=hex(awayColour),similar=a.reduce((n,v,i)=>n+Math.abs(v-b[i]),0)<150;const teamColours=[colour,similar?'#eee5d7':awayColour||'#eee5d7'];
 const routes=[0,1].map(team=>Array.from({length:11},(_,i)=>{
  if(i===0)return Array.from({length:7},(_,k)=>at(team?49:23,30+Math.sin(k*Math.PI/3)*2,.25));
  return Array.from({length:7},(_,k)=>{const t=k===6?0:k;return at(25+((i*3+team*7+t*4)%22),23+((i*5+team*3+t*2)%14),.25)});
 }));
  let out='';
 for(let team=0;team<2;team++)for(let i=0;i<(team?motion.awayCount??11:motion.homeCount??11);i++){
  const route=routes[team][i],q=project(route[0]),scoring=motion.scoringTeam===team;
  const routeData=JSON.stringify(route.map(project)),cornerData=JSON.stringify(project(at(team?49:23,team?38:22,.25)));
  out+=`<g data-player-route='${routeData}' data-corner='${cornerData}' data-team="${team}" data-index="${i}" class="pitch-player ${team?'away':'home'}" transform="translate(${q.x.toFixed(1)} ${q.y.toFixed(1)})"><g transform="scale(4.0)"><ellipse cy="3" rx="1.8" ry=".55" fill="#10252a77"/><path d="M-1.6 -.5L-2.3 .5L-1.5 1L-1.1 .6V1.9H1.1V.6L1.5 1L2.3 .5L1.6 -.5Z" fill="${i===0?(team?'#9281c3':'#d8ae4a'):teamColours[team]}" stroke="#172830" stroke-width=".35"/><path d="M-.7 1.8L-1 3M.7 1.8L1 3" stroke="#172830" stroke-width=".7"/><circle cy="-1.45" r=".8" fill="${i%3?'#e2bb98':'#a47557'}"/></g></g>`;
 }
 const ballRoute=Array.from({length:7},(_,k)=>routes[k%2][1+(k*3)%Math.max(1,((k%2?motion.awayCount:motion.homeCount)??11)-1)][k]);ballRoute[6]=ballRoute[0];const q=project(ballRoute[0]);
 out+=`<circle class="visible-match-ball" cx="0" cy="0" r="4.4" fill="#fff" stroke="#17252d" stroke-width="1.4" transform="translate(${q.x} ${q.y})"/>`;
 return `<g class="pitch-action" ${motion.paused&&!Number.isInteger(motion.scoringTeam)?'data-paused="true"':''}>${out}</g>`;
}
