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
 const project=p=>({x:(map.origin[0]+((p.x-p.y)-6)*map.tile[0])*px,y:(map.origin[1]+((p.x+p.y)-66)*map.tile[1])*py-(p.z||0)*zStep});
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
  const cfg=model.sections[s.id],spec=STANDS[cfg.stand];if(cfg.stand==='empty')return '';
  const endZ=Math.max(...spec.tiers.map(t=>t[1]+(t[0]-1)*t[2])),d=spec.depth,rear=cfg.rear==='compact'?0:cfg.rear==='concourse'?1.1:cfg.rear==='amenities'?1.8:2.2;
  const wall=endZ+(spec.depth<4?.3:1.1),roofZ=wall+2.2,sl=cfg.finish==='brick'?['#504843','#847061','#ba9c7b']:cfg.finish==='dark'?['#243640','#435561','#718790']:['#394a50','#687c82','#a0b8bd'];
  const small=['grass','terrace3','terrace5','bleacher3','bleacher5'].includes(cfg.stand);
  const seat=cfg.stand==='grass'?['#608a4c','#d4e3df','#23343b']:cfg.stand.startsWith('terrace')?['#a7b1a9','#d4e3df','#23343b']:[colour,'#d4e3df','#23343b'],parts=[],L=s.bays,steps=s.corner?12:1;
  // Solid shell, backing building and windows follow the GROUNDS modular footprint.
  for(let k=0;k<steps;k++){
   const a=k*L/steps,b=(k+1)*L/steps;
   parts.push(face(s,[[a,d,0],[b,d,0],[b,d,wall],[a,d,wall]],sl[0],`stroke="#24333a" stroke-width=".38"`));
   if(rear){parts.push(face(s,[[a,d+rear,0],[b,d+rear,0],[b,d+rear,wall+1.3],[a,d+rear,wall+1.3]],sl[0]));parts.push(face(s,[[a,d,wall],[b,d,wall],[b,d+rear,wall+1.3],[a,d+rear,wall+1.3]],sl[1]));}
   if(!s.corner&&k===0)for(let u=a+.45;u+.6<b;u+=1.18)for(let z=2.5;z<wall-1;z+=3.8)parts.push(face(s,[[u,d+rear+.025,z],[u+.62,d+rear+.025,z],[u+.62,d+rear+.025,z+1.2],[u,d+rear+.025,z+1.2]],evening?'#e6bd7a':sl[2],`opacity=".85"`));
  }
  // Each stand family keeps the actual number of GROUNDS rows and tier separations.
  spec.tiers.forEach((t,ti)=>{
   const startV=ti===0?.42:ti===1?(spec.deck==='overhang'?1.7:3.15):spec.deck==='triple'?4.8:4.0;
   const rowPitch=Math.max(.24,(d-startV-.24)/t[0]);
   for(let j=0;j<t[0];j++){
    const v=startV+j*rowPitch,z=t[1]+j*t[2],next=Math.min(d-.06,v+rowPitch);
    for(let k=0;k<steps;k++){
     const a=k*L/steps,b=(k+1)*L/steps;
     parts.push(face(s,[[a,v,z-.54],[b,v,z-.54],[b,v,z],[a,v,z]],seat[0],`stroke="#26343b" stroke-width=".24"`));
     parts.push(face(s,[[a,v,z],[b,v,z],[b,next,z],[a,next,z]],j%4===0?seat[0]:colour,`stroke="#22333a" stroke-width=".22"`));
    }
    if(!s.corner){for(let u=1;u<L;u+=Math.max(1,Math.floor(L/3)))parts.push(face(s,[[u-.08,v,z+.015],[u+.08,v,z+.015],[u+.08,next,z+.015],[u-.08,next,z+.015]],seat[1]));}
    if(crowd&&j%2===0){for(let u=.35;u<L;u+=.62){const q=project(world(s,u,v+.09,z+.23));parts.push(`<circle cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r=".45" fill="${u%1<.5?'#f7d5ad':'#d9e6e8'}"/>`);}}
   }
   if(ti<spec.tiers.length-1){const dz=spec.tiers[ti+1][1]-.6,v=spec.deck==='overhang'?1.6:Math.min(d-.6,startV+t[0]*rowPitch+.14);parts.push(face(s,[[0,v,dz-.8],[L,v,dz-.8],[L,v,dz],[0,v,dz]],'#b9c2c4'));parts.push(face(s,[[0,v,dz],[L,v,dz],[L,Math.min(d,v+.7),dz],[0,Math.min(d,v+.7),dz]],'#46575d'));}
  });
  // End cheeks close the section and reveal the tier profile from outside.
  if(!s.corner)for(const u of [0,L])parts.push(face(s,[[u,.18,0],[u,d,0],[u,d,wall],[u,.18,1.2]],sl[1],`opacity=".95" stroke="#24343b" stroke-width=".35"`));
  if(cfg.roof!=='none'){
   const front=cfg.roof==='cantilever'?.5:cfg.roof==='full'?1.45:.25,back=d+rear+.1;
   const roofFill=cfg.roof==='continuous'?'#63828b':cfg.finish==='brick'?'#687a7d':'#566d78';
   for(let k=0;k<steps;k++){
    const a=k*L/steps,b=(k+1)*L/steps;
    // Near-side canopies retain a visible opening onto the pitch.
    parts.push(face(s,[[a,front,roofZ],[b,front,roofZ],[b,back,roofZ+1.1],[a,back,roofZ+1.1]],roofFill,`stroke="#a4b5b3" stroke-width=".44" opacity="${s.side==='S'||s.side==='E'||s.id==='SE'?'.76':'.95'}"`));
    parts.push(face(s,[[a,front,roofZ-.4],[b,front,roofZ-.4],[b,front,roofZ],[a,front,roofZ]],'#a4b1b0'));
   }
   if(cfg.roof==='truss'||cfg.roof==='cantilever')for(let u=.1;u<L;u+=Math.max(1,L/2)){parts.push(edge(s,[[u,front,roofZ+.12],[u,back,roofZ+2]],sl[2],.8));parts.push(edge(s,[[u,front,roofZ+.12],[u,back,roofZ+1.12]],sl[2],.7));}
   if(cfg.roof==='continuous')parts.push(face(s,[[0,front,roofZ+.02],[L,front,roofZ+.02],[L,front+.65,roofZ+.17],[0,front+.65,roofZ+.17]],'#a3c8d0',`opacity=".75"`));
   if(evening)parts.push(edge(s,[[.1,front,roofZ-.24],[L-.1,front,roofZ-.24]],'#fff1ba',1.6,'opacity=".78"'));
  }
  return `<g data-section="${s.id}" aria-label="${s.id}: ${safe(spec.label)}">${parts.join('')}</g>`;
 }
 const ordered=SECTIONS.map(s=>({s,depth:(()=>{const q=world(s,s.bays/2,3,0);return q.x+q.y})()})).sort((a,b)=>a.depth-b.depth);
 const far=ordered.filter(x=>x.depth<66).map(x=>sectionSvg(x.s)).join(''),near=ordered.filter(x=>x.depth>=66).map(x=>sectionSvg(x.s)).join('');
 const lights=[[16,15],[56,15],[56,45],[16,45]].map(([x,y],i)=>{const p=project(at(x,y,15)),q=project(at(x,y));return `<path d="M${q.x},${q.y}L${p.x},${p.y}" stroke="#77878b" stroke-width="1.1"/><rect x="${p.x-3.2}" y="${p.y-1.5}" width="6.4" height="2.8" fill="${evening?'#fff3ad':'#aab7b5'}"/>`}).join('');
 const art=`assets/sites/${map.art}-${evening?'night':'day'}.webp`,cx=map.origin[0]*px,cy=map.origin[1]*py;
 const viewBox=close==='menu'?`${(cx-330).toFixed(1)} ${(cy-220).toFixed(1)} 660 440`:close?`${(cx-182).toFixed(1)} ${(cy-118).toFixed(1)} 364 236`:'0 0 1100 550';
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${safe(club?.ground||'Clubline ground')}, ${safe(model.name)}, ${evening?'evening':'day'}"><image href="${art}" x="0" y="0" width="1100" height="550" preserveAspectRatio="none"/>${far}${field.join('')}${near}${lights}</svg>`;
}
