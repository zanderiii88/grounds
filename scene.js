import {SECTIONS,STANDS,normaliseLayout,defaultLayout} from './stadium-model.js';
// GROUNDS' registered district images and 28 × 18 pitch datum are shared by all views.
const SITE={
 city:{art:'top-city-redevelopment',origin:[867,482],tile:[6.162,3.382]},harbour:{art:'top-city-redevelopment',origin:[867,482],tile:[6.162,3.382]},
 gardens:{art:'top-civic-gardens',origin:[862,484],tile:[6.265,3.412]},rail:{art:'top-rail-district',origin:[868,482],tile:[6.176,3.382]},
 university:{art:'mid-university-district',origin:[904,452],tile:[6.37,3.667]},oldtown:{art:'mid-market-town-aligned',origin:[898,454],tile:[6.296,3.444]}
};
const at=(x,y,z=0)=>({x,y,z}),mix=(a,b,t)=>at(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,a.z+(b.z-a.z)*t);
const safe=s=>String(s??'').replace(/[&<>"']/g,'');
export const stadiumProfile=club=>({name:defaultLayout(club).name});
export function sceneSvg(club,site='city',crowd=false,evening=false,close=false,layout=null){
 const map=SITE[site]||SITE.city,model=normaliseLayout(layout,club),colour=/^#[0-9a-f]{6}$/i.test(club?.colour||'')?club.colour:'#a03948';
 const px=1100/1774,py=550/887,zStep=7.5*map.tile[0]/24*px;
 // A uniform stadium-only visual scale uses the spare apron in the site art.
 // Every pitch line, stand and roof shares the same centre and grid axes.
 const scale=1.16;
 const project=p=>{const x=36+(p.x-36)*scale,y=30+(p.y-30)*scale,z=(p.z||0)*scale;return {x:(map.origin[0]+((x-y)-6)*map.tile[0])*px,y:(map.origin[1]+((x+y)-66)*map.tile[1])*py-z*zStep}};
 const coord=p=>{const q=project(p);return `${q.x.toFixed(2)},${q.y.toFixed(2)}`};
 const poly=(pts,fill,extra='')=>`<polygon points="${pts.map(coord).join(' ')}" fill="${fill}" ${extra}/>`;
 const path=(pts,stroke,width=1,extra='')=>`<path d="M${pts.map(coord).join('L')}" fill="none" stroke="${stroke}" stroke-width="${width}" ${extra}/>`;
 const rect=(x1,y1,x2,y2,z,fill,extra='')=>poly([at(x1,y1,z),at(x2,y1,z),at(x2,y2,z),at(x1,y2,z)],fill,extra);
 const field=[];
 field.push(rect(20,19,52,41,.015,'#4e8149'));
 for(let i=0;i<28;i+=3)field.push(rect(22+i,21,Math.min(50,22+i+3),39,.04,(i/3)%2?'#368c53':'#40965b'));
 const white='#edf4e6',lw=1.12;
 field.push(path([at(22,21,.09),at(50,21,.09),at(50,39,.09),at(22,39,.09),at(22,21,.09)],white,lw));
 field.push(path([at(36,21,.09),at(36,39,.09)],white,lw));
 for(const end of [22,50]){
  const dir=end===22?1:-1;
  for(const [depth,inset] of [[4.6,3.25],[1.8,6.15]])field.push(path([at(end,21+inset,.09),at(end+dir*depth,21+inset,.09),at(end+dir*depth,39-inset,.09),at(end,39-inset,.09)],white,lw));
  field.push(poly([at(end,28.5,.08),at(end-dir*.8,28.5,.08),at(end-dir*.8,31.5,.08),at(end,31.5,.08)],'none',`stroke="${white}" stroke-width="1"`));
  const spot=project(at(end+dir*3.55,30,.1));field.push(`<circle cx="${spot.x.toFixed(2)}" cy="${spot.y.toFixed(2)}" r=".7" fill="${white}"/>`);
 }
 const circle=Array.from({length:65},(_,i)=>at(36+Math.cos(i/64*Math.PI*2)*2.45,30+Math.sin(i/64*Math.PI*2)*2.45,.1));field.push(path(circle,white,lw));
 const centre=project(at(36,30,.1));field.push(`<circle cx="${centre.x.toFixed(2)}" cy="${centre.y.toFixed(2)}" r=".8" fill="${white}"/>`);
 function world(s,u,v,z){
  if(s.corner){const a=u/4*Math.PI/2,orig={NW:[20,20,-1,-1],NE:[52,20,1,-1],SW:[20,40,-1,1],SE:[52,40,1,1]}[s.id];return at(orig[0]+orig[2]*v*Math.cos(a),orig[1]+orig[3]*v*Math.sin(a),z)}
  const U=s.i*s.bays+u;
  if(s.side==='N')return at(20+U,20-v,z);
  if(s.side==='S')return at(20+U,40+v,z);
  if(s.side==='W')return at(20-v,20+U,z);
  return at(52+v,20+U,z);
 }
 const face=(s,points,fill,extra='')=>poly(points.map(v=>world(s,...v)),fill,extra);
 const edge=(s,points,stroke,width=1,extra='')=>path(points.map(v=>world(s,...v)),stroke,width,extra);
 function sectionSvg(s){
  const cfg=model.sections[s.id],spec=STANDS[cfg.stand];
  if(cfg.stand==='empty')return '';
  const L=s.bays,corner=!!s.corner,steps=corner?12:1,small=spec.depth<4;
  const d=spec.depth,rear=small?0:({compact:0,concourse:1.1,amenities:1.8,hospitality:2.2}[cfg.rear]||0);
  const endZ=Math.max(...spec.tiers.map(t=>t[1]+(t[0]-1)*t[2]));
  const wall=endZ+(small?.3:1.1),roofZ=wall+(small?1.25:2.2),shellTop=cfg.roof==='none'?wall:roofZ+.55;
  const mat=cfg.finish==='brick'?['#50443e','#78685a','#af9882']:cfg.finish==='dark'?['#263740','#40525c','#8aa0aa']:['#344951','#62767e','#a4bcc2'];
  const seat=cfg.stand==='grass'?'#608a4c':cfg.stand.startsWith('terrace')?'#aab2a9':colour;
  const near=(()=>{const a=world(s,L/2,1,0),b=world(s,L/2,2,0);return b.x+b.y>a.x+a.y})();
  const shell=[],tiers=[],concourse=[],caps=[],roof=[];
  // Outer perimeter and rear building are continuous solids; individual bays
  // contribute facade detail, without exposing the inside of every section.
  for(let k=0;k<steps;k++){
   const a=k*L/steps,b=(k+1)*L/steps,back=d+rear;
   shell.push(face(s,[[a,back,0],[b,back,0],[b,back,shellTop],[a,back,shellTop]],mat[0],`stroke="#273942" stroke-width=".32"`));
   if(rear){
    shell.push(face(s,[[a,d,wall-.2],[b,d,wall-.2],[b,back,shellTop],[a,back,shellTop]],mat[1]));
    shell.push(face(s,[[a,d,0],[b,d,0],[b,d,wall-.2],[a,d,wall-.2]],mat[1]));
   }
  }
  if(!corner){
   for(let u=.42;u+.58<L;u+=1.08){
    for(let z=2.2;z+1.15<shellTop-1.1;z+=3.35)
     shell.push(face(s,[[u,d+rear+.035,z],[u+.58,d+rear+.035,z],[u+.58,d+rear+.035,z+1.15],[u,d+rear+.035,z+1.15]],evening?'#dfb46f':mat[2],`opacity=".88"`));
   }
   shell.push(face(s,[[L/2-.37,d+rear+.05,.05],[L/2+.37,d+rear+.05,.05],[L/2+.37,d+rear+.05,2.5],[L/2-.37,d+rear+.05,2.5]],'#1b3038'));
   for(let u=1;u<L;u++)shell.push(edge(s,[[u,d+rear+.06,0],[u,d+rear+.06,shellTop-.35]],mat[1],.35,'opacity=".42"'));
   for(let ti=1;ti<spec.tiers.length;ti++){
    const z=spec.tiers[ti][1]-1.15;
    shell.push(face(s,[[.04,d+rear+.075,z-1.15],[L-.04,d+rear+.075,z-1.15],[L-.04,d+rear+.075,z],[.04,d+rear+.075,z]],'#172d38',`stroke="${mat[2]}" stroke-width=".48"`));
    for(let u=.75;u<L;u+=.85)shell.push(edge(s,[[u,d+rear+.08,z-1.12],[u,d+rear+.08,z]],mat[2],.55));
   }
  }
  // GROUNDS section end caps are exposed only at open gaps or the outside
  // perimeter. Drawing one on every bay made the stadium look inside out.
  if(!corner){
   for(const [u,adjacent] of [[0,s.i-1],[L,s.i+1]]){
    const count=s.side==='N'||s.side==='S'?8:4;
    const other=adjacent>=0&&adjacent<count?model.sections[`${s.side}${adjacent+1}`]:model.sections[{N:[s.i===0?'NW':'NE'],S:[s.i===0?'SW':'SE'],E:[s.i===0?'NE':'SE'],W:[s.i===0?'NW':'SW']}[s.side][0]];
    const otherTop=other&&other.stand!=='empty'?Math.max(...STANDS[other.stand].tiers.map(t=>t[1]+(t[0]-1)*t[2])):0;
    if(otherTop<wall-2)caps.push(face(s,[[u,.22,1.15],[u,d+rear,0],[u,d+rear,shellTop],[u,d,wall],[u,.22,1.5]],mat[1],`stroke="#30434b" stroke-width=".45"`));
   }
  }
  const starts=spec.tiers.map((_,ti)=>ti===0?.42:ti===1?(spec.deck==='overhang'?1.72:3.08):spec.deck==='triple'?4.9:4.0);
  const tierIndices=spec.tiers.map((_,i)=>i);
  if(!near)tierIndices.reverse();
  for(const ti of tierIndices){
   const t=spec.tiers[ti],start=starts[ti];
   let end=d-.18;
   if(ti<spec.tiers.length-1){end=spec.deck==='overhang'&&ti===0?Math.min(d-.2,3.75):Math.min(d-.2,starts[ti+1]-.22)}
   const rowPitch=Math.max(.2,(end-start)/t[0]);
   const rows=Array.from({length:t[0]},(_,j)=>j);if(!near)rows.reverse();
   for(const j of rows){
    const v=start+j*rowPitch,next=Math.min(d-.07,v+rowPitch),z=t[1]+j*t[2];
    for(let k=0;k<steps;k++){
     const a=k*L/steps,b=(k+1)*L/steps;
     tiers.push(face(s,[[a,v,z-.52],[b,v,z-.52],[b,v,z],[a,v,z]],seat,`stroke="#24333b" stroke-width=".23"`));
     tiers.push(face(s,[[a,v,z],[b,v,z],[b,next,z],[a,next,z]],seat,`stroke="#b1c3be" stroke-width=".22"`));
    }
    if(!corner&&j%2===0){for(const u of [L/3,2*L/3])tiers.push(face(s,[[u-.08,v,z+.025],[u+.08,v,z+.025],[u+.08,next,z+.025],[u-.08,next,z+.025]],'#cbd2c8'))}
    if(crowd&&j%2===0)for(let u=.35;u<L;u+=.7){const q=project(world(s,u,v+.07,z+.21));tiers.push(`<circle cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r=".48" fill="${(j+Math.floor(u*2))%3===0?'#f0d3ae':'#d6e2e0'}"/>`)}
   }
   // Real split tiers have an occupied deck, deep soffit and lit concourse.
   if(ti>0){
    const v=spec.deck==='overhang'?Math.max(.9,start-.15):start-.4,z=t[1]-1.1;
    const deck=face(s,[[0,v,z],[L,v,z],[L,Math.min(d,v+1.1),z],[0,Math.min(d,v+1.1),z]],'#576971');
    const fascia=face(s,[[0,v,z-.95],[L,v,z-.95],[L,v,z],[0,v,z]],'#1d2e37',`stroke="#a2aeb0" stroke-width=".6"`);
    const rail=edge(s,[[0,v,z+.05],[L,v,z+.05]],'#e0dbcf',.85);
    const pillars=corner?'':[.7,L/2,L-.7].map(u=>face(s,[[u-.055,v+.03,z-1.0],[u+.055,v+.03,z-1.0],[u+.055,v+.03,z-.13],[u-.055,v+.03,z-.13]],'#899a9f')).join('');
    concourse.push(deck,fascia,rail,pillars);
   }
  }
  if(cfg.roof!=='none'){
   const front=cfg.roof==='cantilever'?.55:cfg.roof==='full'?1.15:.3,back=d+rear+.15;
   const tint=cfg.roof==='continuous'?'#63828b':cfg.finish==='brick'?'#687a7d':'#566d78';
   for(let k=0;k<steps;k++){
    const a=k*L/steps,b=(k+1)*L/steps;
    roof.push(face(s,[[a,front,roofZ],[b,front,roofZ],[b,back,roofZ+1.1],[a,back,roofZ+1.1]],tint,`stroke="#9eb2b4" stroke-width=".4" opacity="${near?'.90':'.96'}"`));
    roof.push(face(s,[[a,front,roofZ-.33],[b,front,roofZ-.33],[b,front,roofZ],[a,front,roofZ]],'#a4b2b2'));
   }
   if(cfg.roof==='truss'||cfg.roof==='cantilever')for(let u=.1;u<L;u+=Math.max(1,L/2)){
    roof.push(edge(s,[[u,front,roofZ+.1],[u,back,roofZ+1.45]],mat[2],.75));
    roof.push(edge(s,[[u,front,roofZ+.1],[u,back,roofZ+1.08]],mat[2],.65));
   }
   if(cfg.roof==='continuous')roof.push(face(s,[[0,front,roofZ+.02],[L,front,roofZ+.02],[L,front+.6,roofZ+.16],[0,front+.6,roofZ+.16]],'#a8c8cc','opacity=".75"'));
   if(evening)roof.push(edge(s,[[.08,front,roofZ-.31],[L-.08,front,roofZ-.31]],'#fff2b0',1.6,'opacity=".92"'));
  }
  // Far sections reveal the seating bowl; near sections show the solid facade.
  const surfaces=near?[...tiers,...concourse,...shell,...caps,...roof]:[...shell,...tiers,...concourse,...caps,...roof];
  return `<g data-section="${s.id}" aria-label="${s.id}: ${safe(spec.label)}">${surfaces.join('')}</g>`;
 }
 const ordered=SECTIONS.map(s=>({s,depth:(()=>{const q=world(s,s.bays/2,3,0);return q.x+q.y})()})).sort((a,b)=>a.depth-b.depth);
 const far=ordered.filter(x=>x.depth<66).map(x=>sectionSvg(x.s)).join(''),near=ordered.filter(x=>x.depth>=66).map(x=>sectionSvg(x.s)).join('');
 const lights=[[16,15],[56,15],[56,45],[16,45]].map(([x,y],i)=>{const p=project(at(x,y,15)),q=project(at(x,y));return `<path d="M${q.x},${q.y}L${p.x},${p.y}" stroke="#77878b" stroke-width="1.1"/><rect x="${p.x-3.2}" y="${p.y-1.5}" width="6.4" height="2.8" fill="${evening?'#fff3ad':'#aab7b5'}"/>`}).join('');
 const art=`assets/sites/${map.art}-${evening?'night':'day'}.webp`,cx=map.origin[0]*px,cy=map.origin[1]*py;
 const viewBox=close==='menu'?`${(cx-381).toFixed(1)} ${(cy-154).toFixed(1)} 550 308`:close==='menu-mobile'?`${(cx-215).toFixed(1)} ${(cy-395).toFixed(1)} 430 560`:close?`${(cx-182).toFixed(1)} ${(cy-118).toFixed(1)} 364 236`:'0 0 1100 550';
 return `<svg xmlns="http://www.w3.org/2000/svg" class="${close==='menu'?'desktop-scene':close==='menu-mobile'?'mobile-scene':''}" viewBox="${viewBox}" preserveAspectRatio="xMidYMid ${close==='menu'?'slice':'meet'}" role="img" aria-label="${safe(club?.ground||'Clubline ground')}, ${safe(model.name)}, ${evening?'evening':'day'}"><image href="${art}" x="0" y="0" width="1100" height="550" preserveAspectRatio="none"/>${far}${field.join('')}${near}${lights}</svg>`;
}
