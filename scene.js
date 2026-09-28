import {SECTIONS,STANDS,normaliseLayout,defaultLayout} from './stadium-model.js';
import {groundsStand} from './grounds-geometry.js';
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
  const cfg=model.sections[s.id],base=STANDS[cfg.stand],spec=groundsStand(cfg.stand);
  if(!spec)return '';
  const L=s.bays,corner=!!s.corner,segments=corner?12:1,D=spec.depth;
  const cornerLinks={NW:['W1','N1'],NE:['E1','N8'],SW:['W4','S1'],SE:['E4','S8']};
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
   for(let u=.45;u+.6<L;u+=1.05){
    for(let z=2.4;z+1.1<spec.wallH-.5;z+=3.4)
     facade.push(localFace([[u,D+rear+.02,z],[u+.53,D+rear+.02,z],[u+.53,D+rear+.02,z+1.1],[u,D+rear+.02,z+1.1]],evening?'#d6ae73':mat[2],'opacity=".75"'));
   }
   facade.push(localFace([[L/2-.37,D+rear+.03,.02],[L/2+.37,D+rear+.03,.02],[L/2+.37,D+rear+.03,2.55],[L/2-.37,D+rear+.03,2.55]],'#1d3138'));
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
    if(!corner&&i%2===0)for(const u of [L/3,2*L/3])
     bowl.push(localFace([[u-.07,v,z+.02],[u+.07,v,z+.02],[u+.07,Math.min(v1,v+t.tread),z+.02],[u-.07,Math.min(v1,v+t.tread),z+.02]],'#bbc4c0'));
    if(crowd&&i%2===0)for(let u=.35;u<L;u+=.7){const q=project(point(u,v+.06,z+.16));bowl.push(`<circle cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r=".43" fill="${(i+Math.floor(u*2))%3===0?'#e6c3a9':'#dce4dc'}"/>`)}
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
    bowl.push(localEdge([[.06,d.frontV,d.topZ+.24],[L-.06,d.frontV,d.topZ+.24]],'#cdd4d0',.65));
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
   const v0=cfg.roof==='full'?1.1:cfg.roof==='cantilever'?.55:.42,v1=spec.roofRearV+rear;
   const fz=spec.roofFrontZ,rz=spec.roofRearZ+.15;
   const tint=cfg.roof==='continuous'?'#63828b':cfg.finish==='brick'?'#687a7d':'#566d78';
   if(corner){
    const roofEnd=(u)=>{const t=u/L,a=linked[0],b=linked[1],mix=(key)=>{
     const left=a.spec||spec,right=b.spec||spec;return left[key]*(1-t)+right[key]*t;
    };const rearDepth=x=>({compact:0,concourse:1.2,amenities:2,hospitality:2.6}[x.cfg.rear]||0);
    return {front:((a.cfg.roof==='full'?1.1:a.cfg.roof==='cantilever'?.55:.42)*(1-t)+(b.cfg.roof==='full'?1.1:b.cfg.roof==='cantilever'?.55:.42)*t),back:mix('roofRearV')+rearDepth(a)*(1-t)+rearDepth(b)*t,fz:mix('roofFrontZ'),rz:mix('roofRearZ')+.15}};
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
    if(cfg.roof==='truss'||cfg.roof==='cantilever')for(let u of [0,L/2,L])roof.push(localEdge([[u,v0,fz+.05],[u,v1,rz+.9]],mat[2],.65));
    if(evening)roof.push(localEdge([[.08,v0,fz-.2],[L-.08,v0,fz-.2]],'#fff0b1',1.35));
   }
  }
  const surfaces=near?[...bowl,...back,...facade,...ends,...roof]:[...back,...facade,...ends,...bowl,...roof];
  return `<g data-section="${s.id}" aria-label="${s.id}: ${safe(base.label)}">${surfaces.join('')}</g>`;
 }
 const ordered=SECTIONS.map(s=>({s,depth:(()=>{const q=world(s,s.bays/2,3,0);return q.x+q.y})()})).sort((a,b)=>a.depth-b.depth);
 const far=ordered.filter(x=>x.depth<66).map(x=>sectionSvg(x.s)).join(''),near=ordered.filter(x=>x.depth>=66).map(x=>sectionSvg(x.s)).join('');
 const lights=[[16,15],[56,15],[56,45],[16,45]].map(([x,y],i)=>{const p=project(at(x,y,15)),q=project(at(x,y));return `<path d="M${q.x},${q.y}L${p.x},${p.y}" stroke="#77878b" stroke-width="1.1"/><rect x="${p.x-3.2}" y="${p.y-1.5}" width="6.4" height="2.8" fill="${evening?'#fff3ad':'#aab7b5'}"/>`}).join('');
 const art=`assets/sites/${map.art}-${evening?'night':'day'}.webp`,cx=map.origin[0]*px,cy=map.origin[1]*py;
 const viewBox=close==='menu'?`${(cx-381).toFixed(1)} ${(cy-154).toFixed(1)} 550 308`:close==='menu-mobile'?`${(cx-215).toFixed(1)} ${(cy-395).toFixed(1)} 430 560`:close?`${(cx-182).toFixed(1)} ${(cy-118).toFixed(1)} 364 236`:'0 0 1100 550';
 return `<svg xmlns="http://www.w3.org/2000/svg" class="${close==='menu'?'desktop-scene':close==='menu-mobile'?'mobile-scene':''}" viewBox="${viewBox}" preserveAspectRatio="xMidYMid ${close==='menu'?'slice':'meet'}" role="img" aria-label="${safe(club?.ground||'Clubline ground')}, ${safe(model.name)}, ${evening?'evening':'day'}"><image href="${art}" x="0" y="0" width="1100" height="550" preserveAspectRatio="none"/>${far}${field.join('')}${near}${lights}</svg>`;
}
