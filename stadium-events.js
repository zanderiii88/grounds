// Original reusable code-native assets, projected through the modular stadium's ground axes.
const at=(x,y,z=0)=>({x,y,z});
export function eventInstallation(project,type,seed=1,figureScale=1){
 let n=seed>>>0;const random=()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296};
 const coord=p=>{const q=project(p);return `${q.x.toFixed(2)},${q.y.toFixed(2)}`};
 const poly=(points,fill,extra='')=>`<polygon points="${points.map(coord).join(' ')}" fill="${fill}" ${extra}/>`;
 const surface=(x,y,w,d,z,fill)=>poly([at(x,y,z),at(x+w,y,z),at(x+w,y+d,z),at(x,y+d,z)],fill);
 const line=(a,b,colour,width=1)=>`<path d="M${coord(a)}L${coord(b)}" stroke="${colour}" stroke-width="${width}"/>`;
 const box=(x,y,w,d,h,fill,base=0)=>surface(x,y,w,d,base+h,fill)+poly([at(x,y+d,base),at(x+w,y+d,base),at(x+w,y+d,base+h),at(x,y+d,base+h)],'#324354')+poly([at(x+w,y,base),at(x+w,y+d,base),at(x+w,y+d,base+h),at(x+w,y,base+h)],'#172635');
 const colours=['#b25a70','#387e99','#d3bc6e','#c5cbd0','#437159','#544175','#384e7d'];
 const people=(count,x,y,w,d)=>{
  const points=Array.from({length:count},()=>at(x+random()*w,y+random()*d,.1)).sort((a,b)=>a.x+a.y-b.x-b.y);
  return points.map((p,i)=>{const q=project(p),size=figureScale*1.6,colour=colours[i%colours.length];return `<g class="event-visitor" transform="translate(${q.x.toFixed(2)} ${q.y.toFixed(2)}) scale(${size})"><ellipse rx="1.2" ry=".45" fill="#162d3d66"/><g>${type==='concert'&&i%6===0?`<animateTransform attributeName="transform" type="translate" values="0 0;0 -.6;0 0" dur="${1.1+i%5*.15}s" begin="-${i*.13}s" repeatCount="indefinite"/>`:''}<path d="M-.6 -1L-.7 .2M.6 -1L.7 .2" stroke="#28313c" stroke-width=".7"/><rect x="-1" y="-3.2" width="2" height="2.3" rx=".2" fill="${colour}"/><circle cy="-4" r=".65" fill="#d8ae85"/></g></g>`}).join('');
 };
 const truck=(x,y)=>{const wheels=[[x+.7,y+1.5],[x+3,y+1.5]].map(([a,b])=>{const q=project(at(a,b,.28));return `<circle cx="${q.x}" cy="${q.y}" r="${1.35*figureScale}" fill="#18202b"/>`}).join('');return `<g data-event-asset="service-truck">${box(x,y,3.7,1.5,1.5,'#b7bdc1',.3)}${box(x+3.7,y,.9,1.5,1.05,'#337691',.3)}${poly([at(x+4.61,y+.2,.7),at(x+4.61,y+1.3,.7),at(x+4.61,y+1.3,1.2),at(x+4.61,y+.2,1.2)],'#9cb8c7')}${wheels}</g>`};
 let art='';
 if(type==='concert'){
  art+=surface(22,22,9,16,.13,'#59616a');
  art+=surface(30.3,24.1,5.4,2.1,.15,'#67747b');
  art+=truck(30.6,24.4);
  art+=box(25,24,5,12,.8,'#727987');
  art+=poly([at(25.2,25,1),at(25.2,35,1),at(25.2,35,8),at(25.2,25,8)],'#243b67','data-event-asset="stage-screen"');
  art+=poly([at(25.24,26,1.4),at(25.24,34,1.4),at(25.24,34,7.5),at(25.24,26,7.5)],'#685999','class="concert-screen-glow"');
  for(const y of [23.7,35.7]){art+=line(at(29,y,.8),at(29,y,8.5),'#8b9baa',1.3);art+=box(30,y-.2,.8,.65,3,'#283340',.8)}
  art+=line(at(29,23.7,8.5),at(29,35.7,8.5),'#a8b6c1',1.5);
  for(const y of [25,28,31,34]){const q=project(at(29,y,8.4));art+=`<circle cx="${q.x}" cy="${q.y}" r="${1.25*figureScale}" fill="${y%2?'#e39bc5':'#8cd9dc'}" class="concert-lamp"/>`}
  art+=surface(25,23.7,4.6,12.6,8.6,'#283747');
  art+=poly([at(29,25,8.4),at(42,24,.3),at(38,30,.3)],'#6e9bd526','class="concert-beam"');
  art+=poly([at(29,34,8.4),at(41,30,.3),at(44,37,.3)],'#ba779e26','class="concert-beam"');
  art+=people(12,27,25.5,2,8);
  art+=people(180,36,22.5,12,14.5);
  art+=line(at(31,22.5,.7),at(31,37,.7),'#b2b5b4',1);
 }else if(type==='community'){
  for(const [x,y,colour] of [[24,23,'#b45058'],[24,33,'#4f8297'],[45,23,'#bc9b58']]){art+=box(x,y,3,2,1.3,colour);art+=surface(x-.2,y-.2,3.4,2.4,1.6,colour)}
  for(const x of [32,37,42])for(const y of [25,29,33])art+=box(x,y,.2,.2,.35,'#df9a45');
  art+=people(65,28,24,17,12);
 }else{
  art+=surface(27,25,16,10,.12,'#60726b');
  for(const x of [30,35,40])for(const y of [27,31])art+=box(x,y,1.5,1.5,.5,'#d3cec1');
  art+=people(28,29,26,12,7);
 }
 return `<g data-stadium-event="${type}" aria-label="${type==='concert'?'Concert stage, visitors and service truck':type==='community'?'Community day stalls and visitors':'Corporate event tables and visitors'}">${art}</g>`;
}
