import {SECTIONS,STANDS,normaliseLayout,defaultLayout} from './stadium-model.js';
import {groundsStand} from './grounds-geometry.js';
// Fixed site plots share the stadium grid. No stadium translation or rotation is exposed.
import {siteById} from './sites.js';
const ART_WIDTH=830,ART_HEIGHT=1895,SCENE_WIDTH=1100,SCENE_HEIGHT=ART_HEIGHT*SCENE_WIDTH/ART_WIDTH;
const at=(x,y,z=0)=>({x,y,z}),mix=(a,b,t)=>at(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,a.z+(b.z-a.z)*t);
const safe=s=>String(s??'').replace(/[&<>"']/g,'');
export const stadiumProfile=club=>({name:defaultLayout(club).name});
export function sceneSvg(club,site='town',crowd=false,evening=false,close=false,layout=null,selection=null,motion=null){
 const map=siteById(site),model=normaliseLayout(layout,club),colour=/^#[0-9a-f]{6}$/i.test(club?.colour||'')?club.colour:'#a03948';
 const px=SCENE_WIDTH/ART_WIDTH,py=SCENE_HEIGHT/ART_HEIGHT,zStep=2.55*px;
 // All game objects use the same two ground-plane vectors. This keeps the
 // pitch, tiers, designer hit regions and match animation in one site frame.
 const project=p=>{const dx=p.x-36,dy=p.y-30,z=p.z||0;return {x:(map.origin[0]+dx*map.east[0]+dy*map.south[0])*px,y:(map.origin[1]+dx*map.east[1]+dy*map.south[1])*py-z*zStep}};
 const coord=p=>{const q=project(p);return `${q.x.toFixed(2)},${q.y.toFixed(2)}`};
 const poly=(pts,fill,extra='')=>`<polygon points="${pts.map(coord).join(' ')}" fill="${fill}" ${extra}/>`;
 const path=(pts,stroke,width=1,extra='')=>`<path d="M${pts.map(coord).join('L')}" fill="none" stroke="${stroke}" stroke-width="${width}" ${extra}/>`;
 const rect=(x1,y1,x2,y2,z,fill,extra='')=>poly([at(x1,y1,z),at(x2,y1,z),at(x2,y2,z),at(x1,y2,z)],fill,extra);
 const field=[];
 field.push(rect(21.4,20.4,50.6,39.6,.015,'#4e8149'));
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
  const cfg=model.sections[s.id],base=STANDS[cfg.stand],spec=groundsStand(cfg.stand);
  const cornerLinks={NW:['W1','N1'],NE:['E1','N8'],SW:['W4','S1'],SE:['E4','S8']};
  if(!spec){
   if(!s.corner)return '';
   // Open seating corners still need a low continuous perimeter, with a
   // concourse behind it. This closes the exposed floor and wall ends while
   // keeping the club's intentionally open corner silhouette.
   const neighbours=cornerLinks[s.id].map(id=>groundsStand(model.sections[id].stand)).filter(Boolean);
   const depth=Math.max(2.6,Math.min(5.3,...neighbours.map(x=>x.depth))),h=2.6;
   const pieces=[];
   for(let i=0;i<12;i++){
    const a=i*s.bays/12,b=(i+1)*s.bays/12,inner=depth-.95;
    pieces.push(poly([world(s,a,depth,0),world(s,b,depth,0),world(s,b,depth,h),world(s,a,depth,h)],'#394a4d'));
    pieces.push(poly([world(s,a,inner,h),world(s,b,inner,h),world(s,b,depth,h),world(s,a,depth,h)],'#7e8e89',`stroke="#a5b3a8" stroke-width=".25"`));
    pieces.push(path([world(s,a,inner,h),world(s,b,inner,h)],'#cad0be',.45));
   }
   return `<g data-section="${s.id}" aria-label="Open corner concourse">${pieces.join('')}</g>`;
  }
  const L=s.bays,corner=!!s.corner,segments=corner?12:1,D=spec.depth;
  const linked=corner?cornerLinks[s.id].map(id=>({cfg:model.sections[id],spec:groundsStand(model.sections[id].stand)})):null;
  const endpoint=(u)=>{
   if(!corner)return null;
   const t=Math.max(0,Math.min(1,u/L)),a=linked[0].spec||spec,b=linked[1].spec||spec;
   const lerp=(key)=>a[key]+(b[key]-a[key])*t;
   return {depth:lerp('depth'),wallH:lerp('wallH'),frontZ:lerp('roofFrontZ'),rearZ:lerp('roofRearZ'),rearV:lerp('roofRearV'),frontV:(linked[0].cfg.roof==='full'?1.1:linked[0].cfg.roof==='cantilever'?.55:.42)*(1-t)+(linked[1].cfg.roof==='full'?1.1:linked[1].cfg.roof==='cantilever'?.55:.42)*t};
  };
  const point=(u,v,z)=>{const e=endpoint(u);return world(s,u,e?v*e.depth/D:v,e?z*e.wallH/spec.wallH:z)};
  const localFace=(verts,fill,extra='')=>poly(verts.map(([u,v,z])=>point(u,v,z)),fill,extra);
  const localEdge=(verts,stroke,width=1,extra='')=>path(verts.map(([u,v,z])=>point(u,v,z)),stroke,width,extra);
  const rear=corner?0:({compact:0,concourse:1.2,amenities:2,hospitality:2.6}[cfg.rear]||0);
  const mat=cfg.finish==='brick'?['#51443e','#78685a','#ac9983']:cfg.finish==='dark'?['#263740','#40525c','#8aa0aa']:['#344951','#62767e','#a4bcc2'];
  const seat=cfg.stand==='grass'?'#709652':cfg.stand.startsWith('terrace')?'#b9c1b7':colour;
  const near=(()=>{const a=world(s,L/2,1,0),b=world(s,L/2,2,0);return b.x+b.y>a.x+a.y})();
  const back=[],bowl=[],facade=[],roof=[],ends=[];
  const panel=(out,verts,fill,extra='')=>{for(let k=0;k<segments;k++){
   const a=k*L/segments,b=(k+1)*L/segments;
   out.push(localFace(verts.map(([u,v,z])=>[u===0?a:u===L?b:a+(b-a)*u/L,v,z]),fill,extra));
  }};
  // GROUNDS paints the outward rear wall behind far seating and after near seating.
  // The facade belongs at the back of the bowl, never across a tier opening.
  panel(back,[[0,D,0],[L,D,0],[L,D,spec.wallH],[0,D,spec.wallH]],mat[0]);
  if(corner){
   const rearAt=u=>{const t=u/L,depth=x=>({compact:0,concourse:1.2,amenities:2,hospitality:2.6}[x.cfg.rear]||0);return depth(linked[0])*(1-t)+depth(linked[1])*t};
   for(let k=0;k<segments;k++){
    const a=k*L/segments,b=(k+1)*L/segments,ea=endpoint(a),eb=endpoint(b);
    const innerA=ea.depth,innerB=eb.depth,outerA=innerA+rearAt(a),outerB=innerB+rearAt(b);
    if(rearAt(a)+rearAt(b)<.02)continue;
    back.push(poly([world(s,a,outerA,0),world(s,b,outerB,0),world(s,b,outerB,eb.wallH),world(s,a,outerA,ea.wallH)],mat[0]));
    back.push(poly([world(s,a,innerA,ea.wallH),world(s,b,innerB,eb.wallH),world(s,b,outerB,eb.wallH),world(s,a,outerA,ea.wallH)],mat[1]));
   }
  }
  if(rear){
   panel(back,[[0,D+rear,0],[L,D+rear,0],[L,D+rear,spec.wallH],[0,D+rear,spec.wallH]],mat[0]);
   panel(back,[[0,D,spec.wallH],[L,D,spec.wallH],[L,D+rear,spec.wallH+.15],[0,D+rear,spec.wallH+.15]],mat[1]);
  }
  if(!corner){
   // Cladding ribs and glazed entry canopies stay on the outward facade.
   // They never span the seating or change the stand's ground footprint.
   for(let u=.1;u<L;u+=.8){
    facade.push(localEdge([[u,D+rear+.04,.25],[u,D+rear+.04,spec.wallH-.25]],mat[1],.7));
   }
   for(let u=.45;u+.6<L;u+=1.05){
    for(let z=2.4;z+1.1<spec.wallH-.5;z+=3.4)
     facade.push(localFace([[u,D+rear+.02,z],[u+.53,D+rear+.02,z],[u+.53,D+rear+.02,z+1.1],[u,D+rear+.02,z+1.1]],evening?'#d6ae73':mat[2],'opacity=".75"'));
   }
   // Repeating glazed turnstile bays and a continuous fascia give the outer
   // concourse a readable scale without putting a wall across the seats.
   for(const u of [L*.22,L*.5,L*.78]){
    facade.push(localFace([[u-.36,D+rear+.035,.02],[u+.36,D+rear+.035,.02],[u+.36,D+rear+.035,2.55],[u-.36,D+rear+.035,2.55]],'#172e38'));
    facade.push(localEdge([[u,D+rear+.04,.2],[u,D+rear+.04,2.4]],'#7c969b',.5));
    facade.push(localFace([[u-.48,D+rear+.04,2.7],[u+.48,D+rear+.04,2.7],[u+.48,D+rear+.38,2.58],[u-.48,D+rear+.38,2.58]],mat[2]));
    if(evening)facade.push(localEdge([[u-.42,D+rear+.39,2.56],[u+.42,D+rear+.39,2.56]],'#ffe0a0',.85));
   }
   facade.push(localEdge([[.06,D+rear+.05,3],[L-.06,D+rear+.05,3]],mat[2],.75));
  }
  // Treads and risers use GROUNDS' actual start, pitch, rise and depth.
  // Each deck follows its specified setback or raked overhang profile.
  for(let ti=0;ti<spec.tiers.length;ti++){
   const t=spec.tiers[ti],rows=Array.from({length:t.rows},(_,i)=>near?t.rows-1-i:i);
   for(const i of rows){
    const v=t.startV+i*t.rowPitch,v1=v+t.rowPitch,z=t.startZ+i*t.rise;
    const low=i===0?Math.max(.8,z-.5):z-t.rise;
    panel(bowl,[[0,v,low],[L,v,low],[L,v,z],[0,v,z]],'#504b4b');
    panel(bowl,[[0,v,z],[L,v,z],[L,v1,z],[0,v1,z]],seat,`stroke="#8fa6a3" stroke-width=".2"`);
    // Discrete seat backs make seating read as a crowd bowl, not flat stripes.
    if(!cfg.stand.startsWith('terrace')&&cfg.stand!=='grass'){
     for(let u=.25;u<L-.12;u+=.34){
      if(!corner&&[L/3,2*L/3].some(aisle=>Math.abs(u-aisle)<.25))continue;
      bowl.push(localEdge([[u,v1-.05,z+.04],[u,v1-.05,z+.24]],'#182c36',.48,'opacity=".60"'));
     }
    }
    if(!corner)for(const u of [L/3,2*L/3]){
     bowl.push(localFace([[u-.13,v,z+.03],[u+.13,v,z+.03],[u+.13,Math.min(v1,v+t.tread),z+.03],[u-.13,Math.min(v1,v+t.tread),z+.03]],'#5c6a6b'));
     if(i%2===0)bowl.push(localEdge([[u-.12,v,z+.08],[u-.12,Math.min(v1,v+t.tread),z+.08]],'#d5d0bd',.35));
    }
    if(crowd&&i%2===0)for(let u=.35;u<L;u+=.7){const q=project(point(u,v+.06,z+.16));bowl.push(`<circle class="spectator ${(i+Math.round(u*10))%9===0?'spectator-active':''}" style="--delay:${((i+Math.round(u*10))%12)*-.15}s" cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r=".43" fill="${(i+Math.floor(u*2))%3===0?'#e6c3a9':'#dce4dc'}"/>`)}
   }
   if(!corner){
    const endV=t.startV+t.rows*t.rowPitch,endZ=t.startZ+(t.rows-1)*t.rise;
    // Aisles climb the rake, rather than appearing as loose marks on each row.
    for(const u of [L/3,2*L/3]){
     bowl.push(localEdge([[u-.14,t.startV,t.startZ+.08],[u-.14,endV,endZ+.08]],'#d8d8c3',.5));
     bowl.push(localEdge([[u+.14,t.startV,t.startZ+.08],[u+.14,endV,endZ+.08]],'#d8d8c3',.5));
    }
    bowl.push(localEdge([[.04,endV,endZ+.14],[L-.04,endV,endZ+.14]],'#c4c9c1',.6));
   }
   const d=spec.decks[ti];
   if(d){
    if(d.style==='setback'){
     panel(bowl,[[0,d.frontV,d.topZ],[L,d.frontV,d.topZ],[L,d.backV,d.topZ],[0,d.backV,d.topZ]],'#79868a');
     panel(bowl,[[0,d.backV,d.baseZ],[L,d.backV,d.baseZ],[L,d.backV,d.topZ],[0,d.backV,d.topZ]],'#333f45');
     panel(bowl,[[0,d.backV+.015,d.baseZ+.1],[L,d.backV+.015,d.baseZ+.1],[L,d.backV+.015,d.topZ-.1],[0,d.backV+.015,d.topZ-.1]],'#172a32');
    }else{
     const upper=spec.tiers[ti+1],bend=upper.startV+upper.rowPitch,backV=upper.startV+upper.rows*upper.rowPitch;
     const soffit=d.baseZ+Math.max(0,backV-bend)*upper.rise/upper.rowPitch;
     panel(bowl,[[0,d.frontV,d.baseZ],[L,d.frontV,d.baseZ],[L,bend,d.baseZ],[0,bend,d.baseZ]],'#27343a');
     panel(bowl,[[0,bend,d.baseZ],[L,bend,d.baseZ],[L,backV,soffit],[0,backV,soffit]],'#303b42');
     panel(bowl,[[0,d.frontV,d.baseZ],[L,d.frontV,d.baseZ],[L,d.frontV,d.topZ],[0,d.frontV,d.topZ]],'#607078');
     panel(bowl,[[0,d.frontV,d.topZ],[L,d.frontV,d.topZ],[L,upper.startV,d.topZ],[0,upper.startV,d.topZ]],'#89969a');
    }
    bowl.push(localEdge([[.06,d.frontV,d.topZ+.38],[L-.06,d.frontV,d.topZ+.38]],'#d8deda',.75));
    for(let u=.18;u<L;u+=.65)bowl.push(localEdge([[u,d.frontV,d.topZ],[u,d.frontV,d.topZ+.38]],'#b6c4c6',.45));
    if(!corner)for(const u of [L*.19,L*.5,L*.81]){
     bowl.push(localFace([[u-.34,d.backV+.02,d.baseZ+.12],[u+.34,d.backV+.02,d.baseZ+.12],[u+.34,d.backV+.02,d.topZ-.1],[u-.34,d.backV+.02,d.topZ-.1]],'#102730'));
     bowl.push(localEdge([[u,d.backV+.04,d.baseZ+.12],[u,d.backV+.04,d.topZ-.1]],'#70888d',.45));
    }
   }
  }
  // Only the part of an end profile taller than its neighbour is exposed.
  // Draw the thin stepped cheek instead of a full rectangular wall across the bowl.
  const profile=(sp,v)=>{
   if(!sp)return 0;
   let h=0;
   for(const t of sp.tiers)for(let i=0;i<t.rows;i++){const x=t.startV+i*t.rowPitch;if(v>=x-.0001&&v<x+t.rowPitch-.0001)h=Math.max(h,t.startZ+i*t.rise)}
   for(const d of sp.decks)if(v>=d.frontV&&v<d.backV)h=Math.max(h,d.topZ);
   const rearSeat=Math.max(0,...sp.tiers.map(t=>t.startV+t.rows*t.rowPitch));
   if(v>=rearSeat-.0001&&v<=sp.depth+.01)h=Math.max(h,sp.wallH);
   return h;
  };
  const adjacent=(u)=>{
   if(corner){const id=cornerLinks[s.id][u===0?0:1];return model.sections[id]}
   const i=u===0?s.i-1:s.i+1,count=s.side==='N'||s.side==='S'?8:4;
   if(i>=0&&i<count)return model.sections[`${s.side}${i+1}`];
   const endCorner={N:i<0?'NW':'NE',S:i<0?'SW':'SE',W:i<0?'NW':'SW',E:i<0?'NE':'SE'}[s.side];return model.sections[endCorner];
  };
  for(const u of [0,L]){
   const other=groundsStand(adjacent(u)?.stand),endDepth=corner?endpoint(u).depth:D;
   const toPhysical=v=>corner?v*endDepth/D:v;
   const otherV=v=>other?toPhysical(v)*other.depth/endDepth:0;
   const cuts=[0,D,...spec.tiers.flatMap(t=>Array.from({length:t.rows+1},(_,i)=>t.startV+i*t.rowPitch)),...spec.decks.flatMap(d=>[d.frontV,d.backV])];
   if(other){for(const t of other.tiers)for(let i=0;i<=t.rows;i++)cuts.push((t.startV+i*t.rowPitch)/other.depth*D);for(const d of other.decks)cuts.push(d.frontV/other.depth*D,d.backV/other.depth*D)}
   const sorted=[...new Set(cuts.filter(v=>v>=0&&v<=D).map(v=>Math.round(v*10000)/10000))].sort((a,b)=>a-b);
   for(let i=0;i<sorted.length-1;i++){
    const v=sorted[i],next=sorted[i+1],middle=(v+next)/2;
    if(next-v<.005)continue;
    const heightScale=corner?endpoint(u).wallH/spec.wallH:1;
    const selfH=profile(spec,middle)*heightScale,covered=other?profile(other,otherV(middle)):0;
    if(selfH<=covered+.18)continue;
    const bottom=covered/heightScale,top=selfH/heightScale;
    ends.push(localFace([[u,v,bottom],[u,next,bottom],[u,next,top],[u,v,top]],mat[1]));
   }
   if(!other&&rear)ends.push(localFace([[u,D,0],[u,D+rear,0],[u,D+rear,spec.wallH],[u,D,spec.wallH]],mat[1]));
  }
  if(cfg.roof!=='none'){
   // Full canopies cover the bowl; truss and cantilever roofs expose the
   // lower rake. The former hard-coded front at .42 hid almost every row.
   const roofFront=(c,sp)=>c.roof==='full'?sp.partialFrontV*.60:c.roof==='cantilever'?sp.partialFrontV*.69:c.roof==='continuous'?sp.partialFrontV*.84:sp.partialFrontV;
   const v0=roofFront(cfg,spec),v1=spec.roofRearV+rear;
   const fz=spec.roofFrontZ,rz=spec.roofRearZ+.15;
   const tint=cfg.roof==='continuous'?'#63828b':cfg.finish==='brick'?'#687a7d':'#566d78';
   if(corner){
    const roofEnd=(u)=>{const t=u/L,a=linked[0],b=linked[1],mix=(key)=>{
     const left=a.spec||spec,right=b.spec||spec;return left[key]*(1-t)+right[key]*t;
    };const rearDepth=x=>({compact:0,concourse:1.2,amenities:2,hospitality:2.6}[x.cfg.rear]||0);
    return {front:roofFront(a.cfg,a.spec||spec)*(1-t)+roofFront(b.cfg,b.spec||spec)*t,back:mix('roofRearV')+rearDepth(a)*(1-t)+rearDepth(b)*t,fz:mix('roofFrontZ'),rz:mix('roofRearZ')+.15}};
    const cornerRoof=(u,back=false,offset=0)=>{const e=roofEnd(u);return world(s,u,back?e.back:e.front,(back?e.rz:e.fz)+offset)};
    for(let k=0;k<segments;k++){const a=k*L/segments,b=(k+1)*L/segments;
     roof.push(poly([cornerRoof(a),cornerRoof(b),cornerRoof(b,true),cornerRoof(a,true)],tint,`stroke="#94a9ad" stroke-width=".28" opacity="${near?'.9':'.96'}"`));
     roof.push(poly([cornerRoof(a,false,-.22),cornerRoof(b,false,-.22),cornerRoof(b),cornerRoof(a)],'#98aaab'));
     roof.push(path([cornerRoof(a),cornerRoof(a,true)],'#92a6ad',.42));
    }
    if(evening)roof.push(path(Array.from({length:segments+1},(_,k)=>cornerRoof(k*L/segments,false,-.2)),'#fff0b1',1.35));
   }else{
    panel(roof,[[0,v0,fz],[L,v0,fz],[L,v1,rz],[0,v1,rz]],tint,`stroke="#94a9ad" stroke-width=".32" opacity="${near?'.9':'.96'}"`);
    panel(roof,[[0,v0,fz-.22],[L,v0,fz-.22],[L,v0,fz],[0,v0,fz]],'#98aaab');
    for(let u=1;u<L;u++)roof.push(localEdge([[u,v0,fz+.01],[u,v1,rz+.01]],'#91a5ad',.44));
    roof.push(localEdge([[.03,v1,rz+.04],[L-.03,v1,rz+.04]],mat[2],.7));
    for(const u of [L*.25,L*.5,L*.75])roof.push(localEdge([[u,v0,fz-.17],[u,v1,rz+.04]],'#b1c1c1',.75));
    if(cfg.roof==='truss'||cfg.roof==='cantilever')for(const u of [0,L/2,L]){
     roof.push(localEdge([[u,v0,fz+.05],[u,v1,rz+.9]],mat[2],.75));
     roof.push(localEdge([[u,v0,fz+.05],[u,v1,rz+.04],[u,(v0+v1)/2,(fz+rz)/2+.45],[u,v0,fz+.05]],'#bac7c7',.45));
    }
    if(evening)roof.push(localEdge([[.08,v0,fz-.2],[L-.08,v0,fz-.2]],'#fff0b1',1.35));
   }
  }
  const surfaces=near?[...bowl,...back,...facade,...ends,...roof]:[...back,...facade,...ends,...bowl,...roof];
  return `<g data-section="${s.id}" aria-label="${s.id}: ${safe(base.label)}">${surfaces.join('')}</g>`;
 }
 const ordered=SECTIONS.map(s=>({s,depth:(()=>{const q=world(s,s.bays/2,3,0);return q.x+q.y})()})).sort((a,b)=>a.depth-b.depth);
 const far=ordered.filter(x=>x.depth<66).map(x=>sectionSvg(x.s)).join(''),near=ordered.filter(x=>x.depth>=66).map(x=>sectionSvg(x.s)).join('');
 const lights=[[16,15],[56,15],[56,45],[16,45]].map(([x,y],i)=>{const p=project(at(x,y,15)),q=project(at(x,y));return `<path d="M${q.x},${q.y}L${p.x},${p.y}" stroke="#77878b" stroke-width="1.1"/><rect x="${p.x-3.2}" y="${p.y-1.5}" width="6.4" height="2.8" fill="${evening?'#fff3ad':'#aab7b5'}"/>`}).join('');
 const hull=points=>{const sorted=points.sort((a,b)=>a.x-b.x||a.y-b.y),cross=(a,b,c)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x),lo=[],hi=[];for(const p of sorted){while(lo.length>1&&cross(lo.at(-2),lo.at(-1),p)<=0)lo.pop();lo.push(p)}for(const p of [...sorted].reverse()){while(hi.length>1&&cross(hi.at(-2),hi.at(-1),p)<=0)hi.pop();hi.push(p)}return lo.slice(0,-1).concat(hi.slice(0,-1))};
 const targets=selection===null?'':SECTIONS.map(s=>{const cfg=model.sections[s.id],spec=groundsStand(cfg.stand),d=spec?.depth||2.3,h=spec?.wallH||1.8,points=[];for(const u of [0,s.bays])for(const v of [0,d])for(const z of [0,h])points.push(project(world(s,u,v,z)));const outline=hull(points).map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');return `<polygon class="designer-hit ${selection.has(s.id)?'is-selected':''}" data-action="toggle-stand" data-id="${s.id}" role="button" tabindex="0" aria-label="${s.id}: ${safe(STANDS[cfg.stand].label)}" aria-pressed="${selection.has(s.id)}" points="${outline}"/>`}).join('');
 const athletes=motion?`<g class="match-athletes ${motion.celebrate?'celebrating':''}">${[0,1].map(team=>Array.from({length:11},(_,i)=>{
  const row=Math.floor(i/4),col=i%4,baseX=team?45-row*3.6:27+row*3.6,baseY=23+col*4.25+(row%2)*1.2;
  const variation=(i%3-1)*.8,route=[[0,0],[team?-2.4:2.4,variation+1.5],[team?1.8:-1.8,variation-1.4],[team?-1.2:1.2,variation+.4],[0,0]].map(([dx,dy])=>{const q=project(at(baseX+dx,baseY+dy,.28));return `${q.x.toFixed(1)} ${q.y.toFixed(1)}`});
  const q=route[0];return `<g class="match-athlete ${team?'away':'home'}" transform="translate(${q})"><animateTransform attributeName="transform" type="translate" values="${route.join(';')}" keyTimes="0;.25;.55;.78;1" dur="${(5.2+(i%4)*.7).toFixed(1)}s" begin="-${((i*7+team*3)%11)*.47}s" repeatCount="indefinite"/><g transform="scale(.78)"><ellipse cy="4.1" rx="2.5" ry=".7" fill="#10252a99"/><path d="M-2 -1L-3 .5L-2 1.2L-1.5 .7L-1.4 2.3H1.4L1.5 .7L2 1.2L3 .5L2 -1Z" fill="${team?'#f4e9dc':colour}" stroke="#10242b" stroke-width=".45"/><path d="M-1.1 2.2L-1.4 3.8M1.1 2.2L1.4 3.8" stroke="#172532" stroke-width=".85"/><circle cy="-2" r="1.15" fill="#e7c4a4" stroke="#172532" stroke-width=".3"/></g></g>`
 }).join('')).join('')}${(()=>{const route=[[36,30],[42,25],[32,34],[27,26],[36,30]].map(([x,y])=>project(at(x,y,.35)));return `<circle class="match-ball" cx="${route[0].x.toFixed(1)}" cy="${route[0].y.toFixed(1)}" r="1" fill="white"><animate attributeName="cx" values="${route.map(q=>q.x.toFixed(1)).join(';')}" dur="8.5s" repeatCount="indefinite"/><animate attributeName="cy" values="${route.map(q=>q.y.toFixed(1)).join(';')}" dur="8.5s" repeatCount="indefinite"/></circle>`})()}</g>`:'';

 const crowdMotion='';
 const art=`assets/sites/${map.art}-${evening&&map.night?'evening':'day'}.webp?v=1.18.0`,cy=map.origin[1]*py;
 const viewBox=close==='menu'?`0 ${(cy-410).toFixed(1)} 1100 840`:close==='menu-mobile'?`0 0 1100 ${SCENE_HEIGHT.toFixed(1)}`:close?`0 ${(cy-380).toFixed(1)} 1100 760`:`0 ${(cy-480).toFixed(1)} 1100 960`;
 return `<svg xmlns="http://www.w3.org/2000/svg" class="${close==='menu'?'desktop-scene':close==='menu-mobile'?'mobile-scene':''} ${motion?.celebrate?'goal-scene':''} ${motion?'crowd-motion':''}" viewBox="${viewBox}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${safe(club?.ground||'Clubline ground')}, ${safe(model.name)}, ${evening?'evening':'day'}"><image href="${art}" x="0" y="0" width="${SCENE_WIDTH}" height="${SCENE_HEIGHT.toFixed(1)}" preserveAspectRatio="none" ${evening&&!map.night?'style="filter:brightness(.60) saturate(.9)"':''}/>${far}${field.join('')}${athletes}${near}${lights}${crowdMotion}${targets}</svg>`;
}
