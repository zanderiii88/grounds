import {exteriorPeople,pitchPlayers} from './stadium-life.js';
import {SECTIONS,STANDS,normaliseLayout,defaultLayout} from './stadium-model.js';
import {groundsStand} from './grounds-geometry.js';
// Fixed site plots share the stadium grid. No stadium translation or rotation is exposed.
import {siteById} from './sites.js';
const SCENE_WIDTH=1100;
const at=(x,y,z=0)=>({x,y,z});
const safe=s=>String(s??'').replace(/[&<>"']/g,'');
export const stadiumProfile=club=>({name:defaultLayout(club).name});
export function sceneSvg(club,site='aberdeen',crowd=false,evening=false,close=false,layout=null,selection=null,motion=null,works=[],preview=false){
 const map=siteById(site),model=normaliseLayout(layout,club),colour=/^#[0-9a-f]{6}$/i.test(club?.colour||'')?club.colour:'#a03948';
 const ART_WIDTH=map.artWidth||830,ART_HEIGHT=map.artHeight||1895,SCENE_HEIGHT=ART_HEIGHT*SCENE_WIDTH/ART_WIDTH;
 const figureScale=((map.scale||1)*830/ART_WIDTH)/0.6137143383204945;
 const px=SCENE_WIDTH/ART_WIDTH,py=SCENE_HEIGHT/ART_HEIGHT,zStep=2.55*px*(map.scale||1);
 // All game objects use the same two ground-plane vectors. This keeps the
 // pitch, tiers, designer hit regions and match animation in one site frame.
 const frame={left:Infinity,right:-Infinity,top:Infinity,bottom:-Infinity};
 const project=p=>{const dx=p.x-36,dy=p.y-30,z=p.z||0;const q={x:(map.origin[0]+dx*map.east[0]+dy*map.south[0])*px,y:(map.origin[1]+dx*map.east[1]+dy*map.south[1])*py-z*zStep};frame.left=Math.min(frame.left,q.x);frame.right=Math.max(frame.right,q.x);frame.top=Math.min(frame.top,q.y);frame.bottom=Math.max(frame.bottom,q.y);return q};
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
 const nearLayers={farEnds:[],support:[],bowl:[],back:[],facade:[],ends:[],roof:[]};
 function sectionSvg(s){
  const cfg=model.sections[s.id],base=STANDS[cfg.stand];let spec=groundsStand(cfg.stand);
  const work=works.find(job=>job.sections[s.id]);
  if(work){
   const future=groundsStand(work.sections[s.id].stand),D=Math.max(spec?.depth||2,future?.depth||2),H=Math.max(spec?.wallH||2,future?.wallH||2),L=s.bays,parts=[];
   parts.push(face(s,[[0,0,.8],[L,0,.8],[L,D,H],[0,D,H]],'#bcc7c6','opacity=".92"'));
   parts.push(face(s,[[0,D,0],[L,D,0],[L,D,H],[0,D,H]],'#819a9f','opacity=".95"'));
   for(let u=0;u<=L;u+=.7)parts.push(edge(s,[[u,0,.5],[u,D,H+.6]],'#50636b',.65));
   for(let z=2;z<H;z+=3){parts.push(edge(s,[[0,D,z],[L,D,z]],'#d5d5c0',.7));for(let u=0;u+.7<L;u+=.7)parts.push(edge(s,[[u,D,z],[u+.7,D,Math.min(H,z+3)]],'#465963',.5));}
   parts.push(edge(s,[[0,0,.9],[L,0,.9]],'#e6ba5e',1.4));
   return `<g class="construction-section" data-section="${s.id}" aria-label="${s.id}: closed for construction until ${work.opens}">${parts.join('')}</g>`;
  }
  const cornerLinks={NW:['W1','N1'],NE:['E1','N8'],SW:['W4','S1'],SE:['E4','S8']};
  if(!spec){
   // Empty corners stay open; no detached quarter-circle platform.
   return '';
  }
  if(cfg.stand==='grass'){
   const L=s.bays,D=spec.depth,h=.55;
   return `<g data-section="${s.id}">${face(s,[[0,.12,0],[L,.12,0],[L,D,h],[0,D,h]],'#719852')}${face(s,[[0,D,0],[L,D,0],[L,D,h],[0,D,h]],'#526943')}${face(s,[[L,.12,0],[L,D,0],[L,D,h]],'#647348')}</g>`;
  }
  const L=s.bays,corner=!!s.corner,segments=corner?16:1;
  // A corner is the curved form of its own chosen stand, not a morph
  // between adjoining profiles. Heights and tier counts remain independent.
  const D=spec.depth;
  const point=(u,v,z)=>world(s,u,v,z);
  const localFace=(verts,fill,extra='')=>poly(verts.map(([u,v,z])=>point(u,v,z)),fill,extra);
  const localEdge=(verts,stroke,width=1,extra='')=>path(verts.map(([u,v,z])=>point(u,v,z)),stroke,width,extra);
  const rear=cfg.stand.startsWith('terrace')||cfg.stand.startsWith('bleacher')?0:({compact:0,concourse:1.2,amenities:2,hospitality:2.6}[cfg.rear]||0);
  const mat=cfg.finish==='brick'?['#51443e','#78685a','#ac9983']:cfg.finish==='dark'?['#263740','#40525c','#8aa0aa']:['#344951','#62767e','#a4bcc2'];
  const seat=cfg.stand.startsWith('terrace')?'#b9c1b7':cfg.stand.startsWith('bleacher')?'#afb7ba':colour;
  const near=(()=>{const a=world(s,L/2,1,0),b=world(s,L/2,2,0);return b.x+b.y>a.x+a.y})();
  const back=[],support=[],bowl=[],facade=[],roof=[],ends=[],farEnds=[];
  const panel=(out,verts,fill,extra='')=>{for(let k=0;k<segments;k++){
   const a=k*L/segments,b=(k+1)*L/segments;
   out.push(localFace(verts.map(([u,v,z])=>[u===0?a:u===L?b:a+(b-a)*u/L,v,z]),fill,extra));
  }};
  // GROUNDS paints the outward rear wall behind far seating and after near seating.
  // The facade belongs at the back of the bowl, never across a tier opening.
  panel(back,[[0,D,0],[L,D,0],[L,D,spec.wallH],[0,D,spec.wallH]],mat[0]);
  if(rear){
   panel(back,[[0,D,.04],[L,D,.04],[L,D+rear,.04],[0,D+rear,.04]],'#536773');
   panel(back,[[0,D+rear,0],[L,D+rear,0],[L,D+rear,spec.wallH],[0,D+rear,spec.wallH]],mat[0]);
   panel(back,[[0,D,spec.wallH],[L,D,spec.wallH],[L,D+rear,spec.wallH+.15],[0,D+rear,spec.wallH+.15]],mat[1]);
  }
  {
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
   if(spec.wallH>4)for(const u of [L*.22,L*.5,L*.78]){
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
   const t=spec.tiers[ti],rows=Array.from({length:t.rows},(_,i)=>near?i:t.rows-1-i);
   for(const i of rows){
    const v=t.startV+i*t.rowPitch,v1=v+t.rowPitch,z=t.startZ+i*t.rise;
    const low=i===0?Math.max(0,z-.5):z-t.rise;
    panel(bowl,[[0,v,low],[L,v,low],[L,v,z],[0,v,z]],'#504b4b');
    panel(bowl,[[0,v,z],[L,v,z],[L,v1,z],[0,v1,z]],seat,`stroke="#8fa6a3" stroke-width=".2"`);
    // Discrete seat backs make seating read as a crowd bowl, not flat stripes.
    if(!cfg.stand.startsWith('terrace')&&!cfg.stand.startsWith('bleacher')&&cfg.stand!=='grass'){
     for(let u=.25;u<L-.12;u+=.34){
      if(!corner&&[L/3,2*L/3].some(aisle=>Math.abs(u-aisle)<.25))continue;
      bowl.push(localFace([[u-.1,v1-.07,z+.06],[u+.1,v1-.07,z+.06],[u+.1,v1-.07,z+.38],[u-.1,v1-.07,z+.38]],seat,`stroke="#542c38" stroke-width=".18"`));
     }
    }
    if(cfg.stand.startsWith('bleacher')){
     panel(bowl,[[0,v+.08,z+.28],[L,v+.08,z+.28],[L,v+.30,z+.28],[0,v+.30,z+.28]],'#c6c7bc');
     for(let u=.18;u<L;u+=.65)bowl.push(localEdge([[u,v+.18,z],[u,v+.18,z+.28]],'#334d5b',.65));
    }
    if(!corner)for(const u of [L/3,2*L/3]){
     bowl.push(localFace([[u-.13,v,z+.03],[u+.13,v,z+.03],[u+.13,Math.min(v1,v+t.tread),z+.03],[u-.13,Math.min(v1,v+t.tread),z+.03]],'#5c6a6b'));
     if(i%2===0)bowl.push(localEdge([[u-.12,v,z+.08],[u-.12,Math.min(v1,v+t.tread),z+.08]],'#d5d0bd',.35));
    }
    if(crowd&&i%2===0)for(let u=.28;u<L;u+=.44){
     const q=project(point(u,v+.08,z+.18)),seed=i*17+Math.round(u*19)+s.id.charCodeAt(0),jump=motion?.scoringTeam===0;
     bowl.push(`<g class="stand-fan" transform="translate(${q.x.toFixed(1)} ${q.y.toFixed(1)})"><g transform="scale(${figureScale})"><g class="fan-body" style="--jump-duration:${.48+seed%7*.07}s;--jump-delay:-${seed%17*.053}s"><rect x="-2.05" y="-.5" width="4.1" height="4.5" rx=".2" fill="${seed%4===0?colour:['#b9d0d5','#e1d9b5','#536979'][seed%3]}"/><circle cy="-1.5" r="1.35" fill="${seed%3?'#e8c3a1':'#a47758'}"/></g></g></g>`);
    }
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
   const front=spec.tiers[ti];
   panel(bowl,[[0,front.startV,Math.max(0,front.startZ-.55)],[L,front.startV,Math.max(0,front.startZ-.55)],[L,front.startV,front.startZ],[0,front.startV,front.startZ]],mat[1]);
   panel(bowl,[[0,front.startV,Math.max(0,front.startZ-.7)],[L,front.startV,Math.max(0,front.startZ-.7)],[L,front.startV,front.startZ],[0,front.startV,front.startZ]],'#c2c9c8');
   bowl.push(localEdge([[.03,front.startV,front.startZ+.65],[L-.03,front.startV,front.startZ+.65]],'#e2e6dd',1.05));
   for(let u=.1;u<L;u+=.5)bowl.push(localEdge([[u,front.startV,front.startZ],[u,front.startV,front.startZ+.65]],'#bac8cc',.65));
   const d=spec.decks[ti];
   if(d){
    if(d.style==='setback'){
     const lower=spec.tiers[ti],lv=lower.startV+lower.rows*lower.rowPitch,lz=lower.startZ+(lower.rows-1)*lower.rise;
     panel(bowl,[[0,lv,lz],[L,lv,lz],[L,d.frontV,d.topZ],[0,d.frontV,d.topZ]],'#5f7077');
     panel(bowl,[[0,d.frontV,d.topZ],[L,d.frontV,d.topZ],[L,d.backV,d.topZ],[0,d.backV,d.topZ]],'#79868a');
     panel(bowl,[[0,d.backV,d.baseZ],[L,d.backV,d.baseZ],[L,d.backV,d.topZ],[0,d.backV,d.topZ]],'#333f45');
     panel(bowl,[[0,d.backV+.015,d.baseZ+.1],[L,d.backV+.015,d.baseZ+.1],[L,d.backV+.015,d.topZ-.1],[0,d.backV+.015,d.topZ-.1]],'#172a32');
    }else{
     const upper=spec.tiers[ti+1],bend=upper.startV+upper.rowPitch,backV=upper.startV+upper.rows*upper.rowPitch;
     const soffit=d.baseZ+Math.max(0,backV-bend)*upper.rise/upper.rowPitch;
     panel(support,[[0,d.frontV,d.baseZ],[L,d.frontV,d.baseZ],[L,bend,d.baseZ],[0,bend,d.baseZ]],'#27343a');
     panel(support,[[0,bend,d.baseZ],[L,bend,d.baseZ],[L,backV,soffit],[0,backV,soffit]],'#303b42');
     panel(support,[[0,d.frontV,d.baseZ],[L,d.frontV,d.baseZ],[L,d.frontV,d.topZ],[0,d.frontV,d.topZ]],'#607078');
     panel(bowl,[[0,d.frontV,d.topZ],[L,d.frontV,d.topZ],[L,upper.startV,d.topZ],[0,upper.startV,d.topZ]],'#89969a');
    }
    bowl.push(localEdge([[.06,d.frontV,d.topZ+.38],[L-.06,d.frontV,d.topZ+.38]],'#d8deda',.75));
    for(let u=.18;u<L;u+=.65)bowl.push(localEdge([[u,d.frontV,d.topZ],[u,d.frontV,d.topZ+.38]],'#b6c4c6',.45));
    if(!corner&&d.style==='setback')for(const u of [L*.19,L*.5,L*.81]){
     bowl.push(localFace([[u-.34,d.backV+.02,d.baseZ+.12],[u+.34,d.backV+.02,d.baseZ+.12],[u+.34,d.backV+.02,d.topZ-.1],[u-.34,d.backV+.02,d.topZ-.1]],'#102730'));
     bowl.push(localEdge([[u,d.backV+.04,d.baseZ+.12],[u,d.backV+.04,d.topZ-.1]],'#70888d',.45));
    }
   }
  }
  const lastTier=spec.tiers.at(-1),seatEnd=lastTier.startV+lastTier.rows*lastTier.rowPitch,seatHeight=lastTier.startZ+(lastTier.rows-1)*lastTier.rise;
  if(D>seatEnd)panel(bowl,[[0,seatEnd,seatHeight],[L,seatEnd,seatHeight],[L,D,spec.wallH],[0,D,spec.wallH]],mat[1]);
  const adjacent=(u)=>{
   if(corner){const id=cornerLinks[s.id][u===0?0:1];return model.sections[id]}
   const i=u===0?s.i-1:s.i+1,count=s.side==='N'||s.side==='S'?8:4;
   if(i>=0&&i<count)return model.sections[`${s.side}${i+1}`];
   const endCorner={N:i<0?'NW':'NE',S:i<0?'SW':'SE',W:i<0?'NW':'SW',E:i<0?'NE':'SE'}[s.side];return model.sections[endCorner];
  };
  // Exposed ends show separate stepped concrete decks, not a floor-to-roof wall.
  // Identical adjoining modules share an open interior with no cheek panels.
  for(const u of [0,L]){
   const next=adjacent(u),sideEnd=!corner&&(u===0&&s.i===0||u===L&&s.i===(['N','S'].includes(s.side)?7:3));
   if(next?.stand===cfg.stand&&next?.rear===cfg.rear)continue;
   const nextSpec=groundsStand(next?.stand);
   const out=corner||sideEnd&&nextSpec?farEnds:u===0?farEnds:ends;
   for(let ti=0;ti<spec.tiers.length;ti++){
    const t=spec.tiers[ti],thickness=ti===0?Math.min(.85,t.startZ-.04):1.15,front=t.startV,rearV=t.startV+t.rows*t.rowPitch,rearZ=t.startZ+(t.rows-1)*t.rise;
    const rearBottom=ti===0?rearZ-thickness:t.startZ+2.1;
    const shape=[[u,front,t.startZ-thickness],[u,front,t.startZ]];
    for(let i=0;i<t.rows;i++){const v=front+i*t.rowPitch,z=t.startZ+i*t.rise;shape.push([u,v,z],[u,v+t.rowPitch,z]);if(i<t.rows-1)shape.push([u,v+t.rowPitch,z+t.rise]);}
    shape.push([u,D,rearZ],[u,D,rearBottom]);
    out.push(localFace(shape,'#526874',`stroke="#425963" stroke-width=".55"`));
    if(ti===0)out.push(localFace([[u,front,0],[u,rearV,0],[u,rearV,rearZ-thickness],[u,front,t.startZ-thickness]],'#526874'));
    // The underside is enclosed; the space below it remains open at the end.
    panel(support,[[0,front,t.startZ-thickness],[L,front,t.startZ-thickness],[L,D,rearBottom],[0,D,rearBottom]],'#253b49');
   }
   // Close the rear concourse block to its full height, separately from
   // the stepped seating supports in front. No hollow visible end bays.
   if(rear)out.push(localFace([[u,D,0],[u,D+rear,0],[u,D+rear,spec.wallH],[u,D,spec.wallH]],mat[1],`data-structure="rear-return" stroke="${mat[0]}" stroke-width=".4"`));
   const postV=D-.28;
   out.push(localFace([[u,postV,0],[u,D+.22,0],[u,D+.22,spec.wallH],[u,postV,spec.wallH]],'#5b737e',`stroke="#40535e" stroke-width=".4"`));
  }
  if(cfg.roof!=='none'){
   // Full canopies cover the bowl; truss and cantilever roofs expose the
   // lower rake. The former hard-coded front at .42 hid almost every row.
   const roofFront=(c,sp)=>sp.partialFrontV*({full:.60,cantilever:.69,truss:1,continuous:.84}[c.roof]??1);
   const roofStyle={full:{depth:.95,front:-.25,slope:.42,top:'#dddeda',edge:'#b3bcbe',underside:'#64777f'},cantilever:{depth:1.55,front:.05,slope:1.2,top:'#bac6ca',edge:'#7c929c',underside:'#3b5363'},truss:{depth:.45,front:.50,slope:.70,top:'#738d99',edge:'#b2c0c5',underside:'#415867'},continuous:{depth:.35,front:1.05,slope:.40,top:'#a2b6ba',edge:'#6f898f',underside:'#4a626b'}}[cfg.roof];
   const v0=roofFront(cfg,spec),v1=spec.roofRearV+rear;
   const fz=spec.wallH+1.1,rz=fz+roofStyle.slope;
   const tint=roofStyle.top,thickness=roofStyle.depth;
   {
    // Closed canopy: underside, skin, fascia and end thickness share one profile.
    panel(roof,[[0,v0,fz-thickness],[L,v0,fz-thickness],[L,v1,rz-thickness],[0,v1,rz-thickness]],roofStyle.underside);
    panel(roof,[[0,v0,fz],[L,v0,fz],[L,v1,rz],[0,v1,rz]],tint,`stroke="#7c969d" stroke-width=".3"`);
    panel(roof,[[0,v0,fz-thickness],[L,v0,fz-thickness],[L,v0,fz],[0,v0,fz]],roofStyle.edge);
    for(const u of [0,L]){
     const neighbour=adjacent(u);
     if(neighbour?.stand!==cfg.stand||neighbour?.roof!==cfg.roof||neighbour?.rear!==cfg.rear)roof.push(localFace([[u,v0,fz-thickness],[u,v1,rz-thickness],[u,v1,rz],[u,v0,fz]],roofStyle.edge,`data-structure="roof-end-cap" stroke="#627a85" stroke-width=".25"`));
     // The roof visibly meets the rear structural spine.
     roof.push(localEdge([[u,v1,spec.wallH],[u,v1,rz-thickness]],'#536a76',1.1));
    }
    for(let u=.25;u<L;u+=.42){
     roof.push(localEdge([[u,v0,fz+.015],[u,v1,rz+.015]],cfg.roof==='full'?'#b8c4c7':'#819ca8',.35));
     if(cfg.roof==='full')roof.push(localEdge([[u,v0,fz-thickness],[u,v0,fz]],'#8499a2',.45));
    }
    if(cfg.roof==='cantilever')for(const u of [0,L]){
     roof.push(localFace([[u,v0,fz-thickness],[u,v1,rz-2.2],[u,v1,rz-thickness]],'#607985'));
    }
    if(cfg.roof==='truss')for(const u of [0,L/2,L]){
     const mid=(v0+v1)/2;
     roof.push(localEdge([[u,v0,fz+.10],[u,mid,(fz+rz)/2+1.35],[u,v1,rz+.1]],'#d2d9d5',1.0));
     roof.push(localEdge([[u,v0,fz+.10],[u,v1,rz+.1]],'#d2d9d5',.7));
     for(let k=1;k<5;k++){const v=v0+(v1-v0)*k/5,z=fz+(rz-fz)*k/5,peak=z+1.25*(1-Math.abs(k/5*2-1));roof.push(localEdge([[u,v,z],[u,v,peak]],'#c1cdd0',.65));}
    }
    if(evening)roof.push(localEdge([[.08,v0,fz-thickness],[L-.08,v0,fz-thickness]],'#fff0b1',1.35));
   }
  }
  if(near){for(const [key,parts] of Object.entries({farEnds,support,bowl,back,facade,ends,roof}))nearLayers[key].push(`<g ${key==='bowl'?`data-section="${s.id}"`:''} data-stand-layer="${key}" data-stand-type="${cfg.stand}">${parts.join('')}</g>`);return '';}
  const surfaces=near?[...farEnds,...support,...bowl,...back,...facade,...ends,...roof]:[...back,...support,...facade,...farEnds,...bowl,...ends,...roof];
  return `<g data-section="${s.id}" data-stand-type="${cfg.stand}" aria-label="${s.id}: ${safe(base.label)}">${surfaces.join('')}</g>`;
 }
 const ordered=SECTIONS.map(s=>({s,depth:(()=>{const q=world(s,s.bays/2,3,0);return q.x+q.y})()})).sort((a,b)=>a.depth-b.depth);
 const closed=id=>works.some(job=>job.sections[id]);
 const layer=near=>{const list=ordered.filter(x=>(['S','E'].includes(x.s.side)||x.s.id==='SE')===near);const result=[...list.filter(x=>!closed(x.s.id)),...list.filter(x=>closed(x.s.id))].map(x=>sectionSvg(x.s)).join('');return near?Object.values(nearLayers).flat().join('')+result:result};
 const far=layer(false),near=layer(true);
 const stadiumFrame={...frame};
 const lights=[[16,15],[56,15],[56,45],[16,45]].map(([x,y],i)=>{const p=project(at(x,y,15)),q=project(at(x,y));return `<path d="M${q.x},${q.y}L${p.x},${p.y}" stroke="#77878b" stroke-width="1.1"/><rect x="${p.x-3.2}" y="${p.y-1.5}" width="6.4" height="2.8" fill="${evening?'#fff3ad':'#aab7b5'}"/>`}).join('');
 const hull=points=>{const sorted=points.sort((a,b)=>a.x-b.x||a.y-b.y),cross=(a,b,c)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x),lo=[],hi=[];for(const p of sorted){while(lo.length>1&&cross(lo.at(-2),lo.at(-1),p)<=0)lo.pop();lo.push(p)}for(const p of [...sorted].reverse()){while(hi.length>1&&cross(hi.at(-2),hi.at(-1),p)<=0)hi.pop();hi.push(p)}return lo.slice(0,-1).concat(hi.slice(0,-1))};
 const targets=selection===null?'':SECTIONS.map(s=>{const cfg=model.sections[s.id],spec=groundsStand(cfg.stand),d=spec?.depth||2.3,h=spec?.wallH||1.8,points=[];for(const u of [0,s.bays])for(const v of [0,d])for(const z of [0,h])points.push(project(world(s,u,v,z)));const outline=hull(points).map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');return `<polygon class="designer-hit ${selection.has(s.id)?'is-selected':''}" data-action="toggle-stand" data-id="${s.id}" role="button" tabindex="0" aria-label="${s.id}: ${safe(STANDS[cfg.stand].label)}" aria-pressed="${selection.has(s.id)}" points="${outline}"/>`}).join('');
 const athletes=motion?.phase==='live'?pitchPlayers(project,colour,motion.awayColour,motion,figureScale):'';
 const specs=SECTIONS.filter(s=>!s.corner).map(s=>({s,cfg:model.sections[s.id],sp:groundsStand(model.sections[s.id].stand)}));
 const depth=side=>Math.max(3,...specs.filter(x=>x.s.side===side).map(x=>{const next=works.find(j=>j.sections[x.s.id])?.sections[x.s.id],sp=next?groundsStand(next.stand):null,rear=c=>({compact:0,concourse:1.2,amenities:2,hospitality:2.6}[c?.rear]||0);return Math.max((x.sp?.depth||0)+rear(x.cfg),(sp?.depth||0)+rear(next));}))+1.1;
 const pedestrians=motion?.ambient?exteriorPeople(project,motion.phase||'idle',{left:20-depth('W'),right:52+depth('E'),top:20-depth('N'),bottom:40+depth('S')},figureScale):{far:'',near:''};
 const crowdMotion='';
 const art=`assets/sites/${map.art}-${evening&&map.night?'evening':'day'}.webp?v=1.27.0`,cy=map.origin[1]*py;
 // Frame the actual layout, not the entire maximum plot. Zoom moves map,
 // stadium and people together, preserving their relative proportions.
 const fw=stadiumFrame.right-stadiumFrame.left,fh=stadiumFrame.bottom-stadiumFrame.top,cx=(stadiumFrame.left+stadiumFrame.right)/2,fy=(stadiumFrame.top+stadiumFrame.bottom)/2;
 const fitted=`${(stadiumFrame.left-24).toFixed(1)} ${(stadiumFrame.top-24).toFixed(1)} ${(fw+48).toFixed(1)} ${(fh+48).toFixed(1)}`;
 const menuWidth=Math.max(640,fw+80);
 const backgroundTop=map.background?Math.max(map.background[5],map.background[5]+map.background[1]*ART_WIDTH)*px:0;
 const backgroundBottom=map.background?(map.background[5]+map.background[3]*ART_HEIGHT+Math.min(0,map.background[1]*ART_WIDTH))*px:SCENE_HEIGHT;
 // Portrait title crops stay inside the painted city, even for large grounds.
 const mobileWidth=Math.min(menuWidth,(backgroundBottom-backgroundTop)*830/1895),mobileHeight=mobileWidth*1895/830;
 const mobileTop=Math.min(backgroundBottom-mobileHeight,Math.max(backgroundTop,fy-mobileHeight*.70));
 const mobileLeft=Math.max(0,Math.min(SCENE_WIDTH-mobileWidth,cx-mobileWidth/2));
 const designerWidth=Math.max(800,fw+120,(fh+220)*1.28),designerHeight=designerWidth/1.28;
 const designerFrame=`${(cx-designerWidth/2).toFixed(1)} ${(fy-designerHeight*.62).toFixed(1)} ${designerWidth.toFixed(1)} ${designerHeight.toFixed(1)}`;
 const viewBox=close==='designer'?designerFrame:close==='menu-mobile'?`${mobileLeft.toFixed(1)} ${mobileTop.toFixed(1)} ${mobileWidth.toFixed(1)} ${mobileHeight.toFixed(1)}`:close==='menu'?`${(cx-menuWidth/2).toFixed(1)} ${(fy-menuWidth*.40).toFixed(1)} ${menuWidth.toFixed(1)} ${(menuWidth*1069/1400).toFixed(1)}`:close?fitted:`${(cx-450).toFixed(1)} ${(fy-400).toFixed(1)} 900 900`;
 const backgroundTransform=map.background?`transform="matrix(${map.background.map((v,i)=>i>=4?v*px:v).join(' ')})"`:'';

 // Ground exists only beneath the current modules and the narrow pitch surround.
 // No maximum-plot polygon is painted over the city image.
 const groundColour=evening?'#676a6a':'#b6b09c';
 const ground=[rect(20,20,52,40,0,groundColour)];
 const rearDepth=cfg=>({compact:0,concourse:1.2,amenities:2,hospitality:2.6}[cfg?.rear]||0);
 for(const section of SECTIONS){
  const cfg=model.sections[section.id],spec=groundsStand(cfg.stand),job=works.find(x=>x.sections[section.id]),future=job?.sections[section.id],next=groundsStand(future?.stand);
  if(!spec&&!job)continue;
  const d=job?Math.max(spec?.depth||2,next?.depth||2)+Math.max(rearDepth(cfg),rearDepth(future)):(spec.depth+(cfg.stand==='grass'?0:rearDepth(cfg)));
  const segments=section.corner?16:1;
  for(let i=0;i<segments;i++){const a=section.bays*i/segments,b=section.bays*(i+1)/segments;
   ground.push(face(section,[[a,0,0],[b,0,0],[b,d,0],[a,d,0]],groundColour,`data-ground-section="${section.id}"`));
  }
 }
 const stadiumGround=`<g data-stadium-ground="current-layout">${ground.join('')}</g>`;
 const careerFrame=close==='career'?`data-career-frame="${cx} ${fy} ${fw} ${fh} ${backgroundTop} ${backgroundBottom}"`:'';

 return `<svg xmlns="http://www.w3.org/2000/svg" ${careerFrame} class="${close==='menu'?'desktop-scene':close==='menu-mobile'?'mobile-scene':''} ${motion?.scoringTeam===0?'goal-scene':''} ${motion?'crowd-motion':''}" viewBox="${viewBox}" preserveAspectRatio="${close&&close!=='menu'&&close!=='menu-mobile'?'xMidYMid meet':'xMidYMid slice'}" role="img" aria-label="${safe(club?.ground||'Clubline ground')}, ${safe(model.name)}, ${evening?'evening':'day'}">${preview?'':`<image ${backgroundTransform} href="${art}" x="0" y="0" width="${SCENE_WIDTH}" height="${SCENE_HEIGHT.toFixed(1)}" preserveAspectRatio="none" ${evening&&!map.night?'style="filter:brightness(.60) saturate(.9)"':''}/>`}${preview?'':stadiumGround}${pedestrians.far}${far}${preview?'':field.join('')}${athletes}${near}${preview?'':lights}${pedestrians.near}${crowdMotion}${targets}</svg>`;
}
