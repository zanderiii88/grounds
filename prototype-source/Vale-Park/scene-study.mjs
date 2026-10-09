const queuedTrees=[];function queueTree(x,y,r=1.05,options={}){queuedTrees.push([x,y,r,options]);}
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {streetKit} from './street-kit.mjs';
import {sceneSvg} from './scene.js';
import {SITES} from './sites.js';
import {SECTIONS,defaultLayout} from './stadium-model.js';
import {groundsStand} from './grounds-geometry.js';
const sharp=createRequire(import.meta.url)('sharp'),out=new URL('./review/',import.meta.url);
const club=JSON.parse(fs.readFileSync(new URL('./data/league.json',import.meta.url))).clubs[1];
const origin=[900,710],east=[10.8,6.3],south=[-11.025,6.3],zStep=3.825;
Object.assign(SITES[0],{artWidth:1100,artHeight:1400,origin,east,south,scale:1.5,background:null});
const shifted=[origin[0]-36*east[0]-30*south[0],origin[1]-36*east[1]-30*south[1]];
const kits=['brick','render','red'].map(theme=>streetKit({origin:shifted,east,south,zStep,theme}));
const gardenTrees=[];
const k=kits[0],{P,rect,line,poly}=k,ground=[],roads=[],blocks=[],decor=[],counts={},groundUses=[],driveways=[];
const overlap=(a,b)=>a.x<b.x+b.w-1e-6&&a.x+a.w>b.x+1e-6&&a.y<b.y+b.d-1e-6&&a.y+a.d>b.y+1e-6;
const layout=defaultLayout(club),growthAllowance=1.0,clearance=.8;
const depths={};for(const side of ['N','S','W','E'])depths[side]=Math.max(...SECTIONS.filter(s=>s.side===side).map(s=>{const c=layout.sections[s.id];return (groundsStand(c.stand)?.roofRearV||0)+({compact:0,concourse:1.2,amenities:2,hospitality:2.6}[c.rear]||0); }));
const reserve={x:20-depths.W-growthAllowance-clearance,y:20-depths.N-growthAllowance-clearance,w:32+depths.W+depths.E+2*(growthAllowance+clearance),d:20+depths.N+depths.S+2*(growthAllowance+clearance)};
const oldReserve={x:1.39,y:1.39,w:69.22,d:57.22};
const colours={grass:['#60862e','#7c9c41','#426d28'],grassDark:['#4e782c','#628b36','#3b642c'],grassLight:['#829546','#a1ad60','#688638'],asphalt:['#676b65','#81857a','#575e59'],paving:['#bbb8a7','#d4cdb8','#999f90'],gravel:['#a19777','#c1b497','#8c8569'],soil:['#776347','#99805a','#5b513b']};
const defs=Object.entries(colours).map(([id,c])=>`<pattern id="${id}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="matrix(10.8 6.3 -11.025 6.3 0 0)"><rect width="6" height="6" fill="${c[0]}"/>${Array.from({length:170},(_,i)=>`<rect x="${((i*53)%179)/30}" y="${((i*37)%173)/29}" width="${i%3===0?.18:.08}" height="${i%3===0?.11:.06}" fill="${c[1+i%2]}"/>`).join('')}${id==='paving'?'<path d="M0 0H6V6M0 1H6M0 2H6M0 3H6M0 4H6M0 5H6M1 0V6M2 0V6M3 0V6M4 0V6M5 0V6" fill="none" stroke="#979f90" stroke-width=".03"/>':''}</pattern>`).join('');
// Vale Park: compact city housing and a distinct wooded park.
const passages=[],forecourtDetails=[],corridors=[],crossings=[],middleFrontages=[];
ground.push(rect(-140,-140,350,350,'url(#grass)'));
const plans=[
 [-85,5,231,2.8,'North Ground Road'],[-1,5,2.4,53,'Trinity Approach'],
 [66,-65,3.0,217,'East Ground Lane'],[-85,55,231,3,'Park Road'],
 [-35,5,2.8,147,'West Park Road'],[-85,-31,154,2.7,'Upper Vale Street'],[-85,-12.8,154,2.2,'Garden Lane'],
 [-43,-60,2.5,67,'Chapel Street'],[21,-31,2.6,38,'Short Vale Lane'],
 [-35,120,104,3,'South Park Road'],[107,-31,2.5,183,'East neighbourhood road'],
 [66,27,80,2.6,'Church Street'],[66,80.5,80,1.5,'Parkside side street'],[66,101,80,1.6,'Lower Parkside Lane'],[-90,148,236,2.8,'Southern city street'],[5,120,2.4,30,'Southern mews approach'],[143,5,2.6,145.8,'Outer city street'],[-35,34,36.4,1.6,'Trinity cross lane']
];
for(const [x,y,w,d,name] of plans){const r={x,y,w,d,name,pavement:.6};r.full={x:x-.6,y:y-.6,w:w+1.2,d:d+1.2};if(overlap(r.full,reserve))throw Error('Road reserve '+name);roads.push(r);}
for(const r of roads)ground.push(rect(r.full.x,r.full.y,r.full.w,r.full.d,'url(#paving)'));
for(const r of roads)ground.push(rect(r.x,r.y,r.w,r.d,'url(#asphalt)'));
for(const r of roads.filter(r=>r.w>100||r.d>100))for(let i=1;i<(r.w>r.d?r.w:r.d)-1;i+=3){
 const along=r.w>r.d,f={x:along?r.x+i:r.x+r.w/2-.05,y:along?r.y+r.d/2-.05:r.y+i,w:along?1.2:.1,d:along?.1:1.2};
 if(!roads.some(q=>q!==r&&overlap(f,q.full)))ground.push(rect(f.x,f.y,f.w,f.d,'#cfcbb5'));
}
const record=(kind,x,y,w,d)=>decor.push({kind,x,y,w,d});
function plot(x,y,w,d,c='url(#grass)'){ground.push(rect(x,y,w,d,c));record('plot',x,y,w,d);}
function fence(kit,x,y,w,d,options){kit.fence(x,y,w,d,options);record('fence',Math.min(x,x+w)-.025,Math.min(y,y+d)-.025,Math.abs(w)+.05,Math.abs(d)+.05);}
function passage(name,x,y,w,d){ground.push(rect(x,y,w,d,'url(#gravel)'));record('path',x,y,w,d);passages.push({name,x,y,w,d});}
function entry(name,x,y,w,d){ground.push(rect(x,y,w,d,'url(#asphalt)'));driveways.push({name,x,y,w,d});}
function terraceGroup(name,x,top,originalN,bottom,theme=0){
 const footprintW=originalN*2.45,w=1.75,n=Math.floor(footprintW/w),d=3.2,h=bottom-top;
 // The same plot gains narrower homes and a third occupied mews row where
 // its depth permits. No world expansion is used to claim higher density.
 const ys=h>=16?[top+.8,top+h/2-1.6,bottom-3.8]:[top+.8,bottom-3.8];
 blocks.push({name,type:'compact residential mews',x,y:top,w:footprintW,d:h,homes:n*ys.length,rows:ys.length,frontage:w,previousHomes:originalN*2});
 plot(x-.2,top,footprintW+.4,h,'url(#grass)');
 const kit=kits[theme];
 for(let row=0;row<ys.length;row++)for(let i=0;i<n;i++){
  const front=row===0||(ys.length===3&&row===1)?'north':'south',themeLocal=(theme+Math.floor(i/5)%2)%3,use=kits[themeLocal],xx=x+i*w;
  if(i%9===4&&i+1<n){const a=use.building('semi',xx+.14,ys[row],2*w-.3,d,{front,height:5.0+(row%2)*.5});a.residentialUnits=2;i++;}
  else use.terrace(xx,ys[row],{w,d,front,first:i===0,last:i===n-1,height:4.4+Math.floor(i/4)%3*.4+(row%2)*.2});
 }
 if(ys.length===3)for(let i=0;i<n;i++)middleFrontages.push({block:name,x:x+i*w,y:ys[1],w,d,front:'north'});
 for(let row=0;row<ys.length-1;row++){
  const rear=ys[row]+d+.40,next=ys[row+1]-.2,lane=(rear+next)/2-.35;
  passage(name+' mews '+row,x,lane,n*w,.7);
  for(let i=0;i<n;i++){
   const xx=x+i*w;
   const before=Math.max(0,lane-rear),after=Math.max(0,next-lane-.75);
   if(before>.05){fence(kit,xx,rear,0,before,{height:.6});ground.push(rect(xx+.08,rear,w-.16,Math.min(.5,before),'url(#paving)'));}
   if(after>.05){fence(kit,xx,lane+.75,0,after,{height:.6});ground.push(rect(xx+.08,next-Math.min(.5,after),w-.16,Math.min(.5,after),'url(#paving)'));}
   if(before>1.4&&i%3===0)kit.smallBuilding('shed',xx+.12,rear+.55,.7,.6,{h:1.2});
   if(before>.5)kit.bin(xx+1.35,rear+.1);if((i+row)%3===0&&before>1.7)gardenTrees.push([xx+.85,rear+before*.5,.6,6.7]);if(i%4===1&&after>1.7)gardenTrees.push([xx+.85,lane+.75+after*.55,.65,7]);
   if(after>.6&&i%3===1)ground.push(rect(xx+.15,lane+.85,.8,Math.min(.7,after-.2),'url(#soil)'));
  }
 }
 ground.push(rect(x,top+.12,n*w,.42,'url(#paving)'),rect(x,bottom-.5,n*w,.3,'url(#paving)'));
}
// Compact old streets: shorter gardens, unequal row lengths and end houses.
terraceGroup('Chapel Street upper rows',-38,-56,7,-34.8,2);
terraceGroup('Upper Vale brick block',-38,-26,6,-15.8,0);
terraceGroup('Vale Street brick block',-16,-26,9,-15.8,2);
terraceGroup('North-east old streets',29,-26,7,-15.8,0);
terraceGroup('Outer eastern neighbourhood',73,-26,11,-15.8,2);
terraceGroup('Far west neighbourhood',-70,-26,9,-15.8,0);
// Smaller side-facing villas and substantial brick homes close the row ends.
for(const [x,y,w,d,theme,h] of [[-22,-19,4,3.4,0,5.2],[-22,-7,4,3.4,2,5.7],[53,-19,7,4,2,6.1],[54,-7,6,4,0,5.6],[101,-19,4,3.5,0,5.4],[101,-7,4,3.5,2,5.1]])kits[theme].building('gable',x,y,w,d,{axis:'y',height:h,bay:false});
// Occupied northern residential plots replace the former scattered homes.
terraceGroup('Northern Victorian mews west',-16,-57,14,-34.5,0);
terraceGroup('Northern Victorian mews east',27,-57,13,-34.5,2);
terraceGroup('South of Garden Lane west',-70,-8.5,9,2.6,2);
terraceGroup('South of Garden Lane chapel',-38,-8.5,6,2.6,0);
terraceGroup('South of Garden Lane vale',-16,-8.5,9,2.6,2);
terraceGroup('South of Garden Lane east',29,-8.5,7,2.6,0);
terraceGroup('South of Garden Lane outer',73,-8.5,11,2.6,2);
// Dense homes sit immediately behind the pub and shops, with a short lane.
plot(-30,10,26,6,'url(#paving)');
k.cornerPub(-28,10,6,4.5);kits[2].building('shop',-19,10,5,4,{height:5.3,sign:'VALE STORES'});
kits[0].building('gable',-11,11,5,4,{height:5.6});
terraceGroup('Trinity back street',-30,18,10,32,0);
terraceGroup('Trinity lower old houses',-30,38,10,51.5,2);
entry('West service court entry',-4,29,3,3);
// A smaller eastern car park and school share the northern street edge.
plot(72,10,31,14,'url(#asphalt)');
for(let i=0;i<10;i++){const x=74+i*2.5;ground.push(line([[x,11,.02],[x,14,.02]],'#d4d0b9',.6));if(i%3)k.car(x+.4,11.5,{axis:'y',colour:['#8e4239','#b6bead','#405f78'][i%3]});}
kits[2].building('flats',74,18,9,4.5,{height:5});
k.building('workshop',88,18,12,4.5,{height:3.8});
entry('East parking entrance',69,14,3,3);
blocks.push({name:'North-east parking and school',type:'parking office and community rooms',x:72,y:10,w:31,d:14});
// Church precinct and houses give the park edge a distinct landmark.
plot(73,32,30,19,'url(#grassLight)');k.church(78,33);
passage('Church approach',87,34,2,19);
kits[1].building('gable',92,35,7,5,{height:5});
k.smallBuilding('garage',93,43,6,3,{h:1.8});
entry('Church entrance',89,29.6,3,2.4);
blocks.push({name:'Church precinct',type:'church lawn and older vicarage',x:73,y:32,w:30,d:19});
// One connected mature park, with the manor within its centre.
plot(-22,61,86,56,'url(#grassDark)');
k.heritageHall(10,82);
plot(11,95,18,4,'url(#paving)');
// Axis-aligned branching paths skirt the hall and join all park entrances.
passage('North park approach',-17,61,1.3,16);
passage('Upper woodland walk',-20,77,60,1.3);
passage('Eastern park spine',40,61,1.4,56);
passage('Manor east approach',30.2,88,9.8,1.3);
passage('Manor front approach',19,94.2,1.4,4.8);
passage('Lower park crossing',0,99,41.4,1.3);
passage('South park walk',-20.7,115.8,84.7,1.2);
passage('West garden walk',0,78.3,1.3,37.5);
passage('East grove branch',41.4,72,21.6,1.2);
passage('Pavilion approach',41.4,110,19.6,1.2);
for(const [x,y,w,d] of [[12,96,4,2],[24,96,4,2],[32,84,5,2],[32,92,5,2]]){plot(x,y,w,d,'url(#soil)');for(let xx=x+.3;xx<x+w;xx+=.7)ground.push(rect(xx,y+.3,.28,.25,'#b79863'));}
// Sports facilities occupy one corner, screened by groves from the hall.
plot(-18,100,16,13,'#7b8670');
for(const x of [-17,-9.5]){ground.push(rect(x,101,6.3,11,'#a78964'));ground.push(line([[x+.5,101.6,.02],[x+5.8,101.6,.02],[x+5.8,111.4,.02],[x+.5,111.4,.02],[x+.5,101.6,.02]],'#ddd7ba',.65));ground.push(line([[x+.5,106.5,.8],[x+5.8,106.5,.8]],'#d3d0b6',.7));}
plot(5,103,12,10,'url(#grassLight)');fence(k,5,103,12,0,{height:.5});
k.smallBuilding('park-pavilion',52,106,8,3,{h:2.1});
entry('Park south entry',20,117,4,3);
entry('Park north entry',-17,58,3,3);
blocks.push({name:'Vale Hall wooded public park',type:'central manor branching walks groves lawns and sports',x:-22,y:61,w:86,d:56});
// The residential city continues beside the park; compact street-facing rows
// vary in length, material and height, with taller houses at the ends.
terraceGroup('Parkside brick street',73,62,7,79.5,2);
terraceGroup('Parkside small block',73,83,6,99.5,0);
terraceGroup('South-east city continuation',73,103,10,120,2);
for(const [x,y,w,d,h] of [[91,64,9,5,6.7],[90,74,7,4.5,5.9],[89,85,6,4.5,6.3],[97,90,6,4.5,5.4]])kits[0].building('gable',x,y,w,d,{height:h,bay:true,dormer:h>6});
kits[2].building('shop',90,96,8,4,{height:5.6,sign:'CORNER SHOP'});
// Western city blocks include a shop frontage and small repair court.
terraceGroup('West city street',-73,10,12,28,2);
terraceGroup('West city lower street',-73,32,10,51.5,0);
terraceGroup('West park city',-73,62,10,80.5,2);
terraceGroup('West park lower city',-73,84,8,102,0);
kits[2].building('shop',-50,91,8,4,{height:5.2,sign:'BAKERY'});
k.building('workshop',-47,65,6,6,{height:3.5});
kits[0].building('gable',-47,76,6,4.5,{height:6.4,bay:true});
// Urban continuation fills the former unassigned foreground grass.
terraceGroup('Southern city west block',-26,127,11,144,2);
terraceGroup('Southern city short mews',10,127,7,144,0);
terraceGroup('Southern city varied frontage',33,127,10,144,2);
kits[0].building('shop',-31.3,128,4.5,5,{height:5.8,sign:'NEWS'});
kits[2].building('gable',-31.3,138,4.5,5,{height:6,bay:false});
// Streets and smaller blocks continue beyond the eastern neighbourhood.
terraceGroup('Outer eastern north street',112.5,10,10,24,0);
terraceGroup('Outer eastern church street',112.5,32,12,51,2);
terraceGroup('Outer eastern park street',112.5,62,12,78.5,0);
terraceGroup('Outer eastern lower block',112.5,84,9,99.5,2);
terraceGroup('Outer eastern southern street',112.5,105,12,122,0);
terraceGroup('Outer eastern southern continuation',112.5,127,12,144,2);
kits[2].building('flats',137,85,4,7,{height:7.4});
kits[0].building('shop',137,94,4,5,{height:5.5,sign:'SHOP'});
// Infill the larger end-of-block plots with Victorian houses and their yards.
for(const [x,y,w,d,h,theme] of [[10,-24,7,5.5,6.2,0],[10,-7,7,5,5.8,2],[54,-25,6,4,6.1,0],[57,0,4,3.4,5.3,2]]){
 plot(x-.5,y-.4,w+1,d+.9,'url(#paving)');kits[theme].building('gable',x,y,w,d,{height:h,bay:false,dormer:h>6});
}
k.smallBuilding('garage',10,-16,3,1.8,{h:1.7});
fence(k,8.5,-25,0,10.5,{brick:true,height:.7});fence(k,19,-25,0,10.5,{height:.65});
// Current stadium hardstanding follows this club's stand extents, not Highfield's.
const current={x:20-depths.W,y:20-depths.N,w:32+depths.W+depths.E,d:20+depths.N+depths.S};
const access=[
 {name:'north stand rear apron',x:20,y:8.4,w:32,d:current.y-8.4},
 {name:'south stand rear apron',x:20,y:current.y+current.d,w:32,d:51.4-current.y-current.d},
 {name:'west stand rear walk',x:2.5,y:20,w:current.x-2.5,d:20},
 {name:'east stand rear walk',x:current.x+current.w,y:20,w:63.4-current.x-current.w,d:20},
 {name:'northwest entrance court',x:2.5,y:8.4,w:17.5,d:11.6},
 {name:'northeast entrance court',x:52,y:8.4,w:11.4,d:11.6},
 {name:'southwest entrance court',x:2.5,y:40,w:17.5,d:11.4},
 {name:'southeast entrance court',x:52,y:40,w:11.4,d:11.4}
];
for(const [i,a] of access.entries())ground.push(rect(a.x,a.y,a.w,a.d,i%3===0?'url(#asphalt)':'url(#paving)'));
groundUses.push(...access);
// Irregular groves, a partial avenue and scattered mature edge trees.
const allBounds=()=>kits.flatMap((kit,j)=>kit.bounds.map(b=>({...b,id:j+':'+b.id,parent:b.parent?j+':'+b.parent:null})));
const mewsConnections=[];
for(const path of passages.filter(p=>p.name.includes(' mews '))){
 const block=blocks.find(b=>path.name.startsWith(b.name+' mews '));
 const clear=f=>!overlap(f,reserve)&&!allBounds().some(b=>b.kind!=='tree'&&overlap(f,b))&&!roads.some(r=>overlap(f,r));
 const candidates=[];
 for(const road of roads){
  if(road.d>road.w&&path.y>=road.full.y&&path.y+path.d<=road.full.y+road.full.d){
   if(road.x+road.w<=path.x){const f={x:road.x+road.w,y:path.y,w:path.x-road.x-road.w+.02,d:path.d};if(clear(f))candidates.push([f]);}
   if(road.x>=path.x+path.w){const f={x:path.x+path.w-.02,y:path.y,w:road.x-path.x-path.w+.02,d:path.d};if(clear(f))candidates.push([f]);}
  }
  if(road.w>road.d)for(const side of [-1,1]){
   const xx=side===-1?block.x-.9:block.x+block.w+.35,ww=.55;
   if(xx<road.x||xx+ww>road.x+road.w)continue;
   const yy=road.y+road.d<=block.y?road.y+road.d:road.y>=block.y+block.d?road.y:NaN;if(!Number.isFinite(yy))continue;
   const a={x:Math.min(xx,path.x),y:path.y,w:Math.max(xx+ww,path.x+path.w)-Math.min(xx,path.x),d:path.d};
   const b={x:xx,y:Math.min(yy,path.y),w:ww,d:Math.max(yy,path.y+path.d)-Math.min(yy,path.y)};
   if(clear(a)&&clear(b))candidates.push([a,b]);
  }
 }
 candidates.sort((a,b)=>a.reduce((n,f)=>n+f.w+f.d,0)-b.reduce((n,f)=>n+f.w+f.d,0));
 if(!candidates.length)throw Error('No clear mews exit '+path.name);
 for(const [i,f] of candidates[0].entries()){const name=path.name+' street connection '+i;passage(name,f.x,f.y,f.w,f.d);mewsConnections.push({lane:path.name,name});}
}
for(const b of blocks.filter(b=>b.type==='compact residential mews'))for(const offset of [2.5,b.d*.5,b.d-2.2]){gardenTrees.push([b.x+b.w+1.5,b.y+offset,.65,7.5],[b.x-2,b.y+offset,.7,7]);}
const treeSites=[...gardenTrees];
// Separate, uneven groves: dense park edges, smaller clumps and open clearings.
for(const [cx,cy,rx,ry,n] of [[-10,67,9,5,16],[17,66,16,5,24],[-12,89,8,9,21],[53,83,8,8,22],[52,99,8,4,12],[27,109,8,4,11]])for(let i=0;i<n;i++){
 const angle=i*2.3999,rho=Math.sqrt((i+.5)/n),x=cx+Math.cos(angle)*rx*rho,y=cy+Math.sin(angle)*ry*rho;
 treeSites.push([x,y,.85+(i%4)*.14,7+(i%5)*.7]);
}
for(const [x,y] of [[-21,65],[-21,74],[-21,81],[-21,95],[60,64],[61,114],[4,89],[7,91],[33,77],[37,95],[78,49],[95,49]])treeSites.push([x,y,.85,7]);
for(const [x,y,r,h] of treeSites){const f={x:x-r-.3,y:y-r-.3,w:2*(r+.3),d:2*(r+.3)};if(!allBounds().some(b=>b.kind==='tree'?Math.hypot(b.x+b.w/2-x,b.y+b.d/2-y)<1.7:overlap(b,f))&&!roads.some(q=>overlap(q.full,f))&&!passages.some(q=>overlap(q,f))&&!overlap(f,reserve))queueTree(x,y,r,{height:h,tone:Math.abs(Math.round(x+y))%3});}
for(const [x,y] of [[10,4.2],[35,4.2],[55,4.2],[65.4,9.5],[19,54.3],[39,54.3]]){const f={x,y,w:.48,d:.48};if(!roads.some(r=>overlap(r,f))&&!overlap(f,reserve))k.streetFurniture('lamp',x,y);}
for(const [x,y,r,options] of [...gardenTrees.map(([x,y,r,h])=>[x,y,r,{height:h,tone:Math.abs(Math.round(x+y))%3}]),...queuedTrees]){
 const det=east[0]*south[1]-south[0]*east[1],rx=r*(east[0]-south[0]),ry=rx*.8,bx=Math.max(r+.3,Math.hypot(south[1]*rx,south[0]*ry)/Math.abs(det)),by=Math.max(r+.3,Math.hypot(east[1]*rx,east[0]*ry)/Math.abs(det)),f={x:x-bx,y:y-by,w:bx*2,d:by*2};
 if(overlap(f,reserve)||roads.some(a=>overlap(f,a.full))||passages.some(a=>overlap(f,a))||driveways.some(a=>overlap(f,a))||allBounds().some(a=>a.kind==='tree'?Math.hypot(x-a.x-a.w/2,y-a.y-a.d/2)<1.3:overlap(f,a)))continue;
 k.tree(x,y,r,options);
}
const bounds=allBounds(),permanent=bounds.filter(a=>a.kind!=='car');
for(const f of [...bounds,...decor,...roads.map(a=>a.full)])if(overlap(f,reserve))throw Error('Reserve intrusion '+JSON.stringify(f));
for(const f of decor)for(const r of roads)if(overlap(f,r))throw Error('Decor asphalt intrusion '+JSON.stringify(f)+' '+r.name);
for(const f of permanent)for(const r of roads)if(overlap(f,f.pavement?r:r.full))throw Error('Road asset overlap '+JSON.stringify(f)+' '+r.name);
let attachments=0,canopyOverlaps=0;for(let i=0;i<permanent.length;i++)for(let j=i+1;j<permanent.length;j++){const a=permanent[i],b=permanent[j];if(overlap(a,b)){if(a.kind==='tree'&&b.kind==='tree'){canopyOverlaps++;continue;}if(a.parent===b.id||b.parent===a.id){attachments++;continue;}throw Error('Asset collision '+JSON.stringify([a,b]));}}
for(const path of passages)for(const f of permanent)if(overlap(path,f))throw Error('Blocked passage '+JSON.stringify(f)+' '+path.name);
for(const drive of driveways)for(const f of permanent)if(overlap(drive,f))throw Error('Blocked driveway '+JSON.stringify(f));
for(const corridor of corridors)for(const f of [...bounds,...decor])if(overlap(f,corridor)&&!(f.kind==='footbridge'&&corridor.kind==='rail'))throw Error('Corridor collision '+JSON.stringify(f)+' '+corridor.name);
for(const b of bounds)counts[b.kind]=(counts[b.kind]||0)+1;
const raw=sceneSvg(club,'aberdeen',false,false,true),stadiumFrame=raw.match(/data-title-frame="([^"]+)"/)[1].split(' ').map(Number);
const stadium=raw.replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'').replace(/<image\b[^>]*\/>/g,'');
const objects=kits.flatMap(a=>a.objects);objects.push({depth:66,svg:`<g id="actual-stadium">${stadium}</g>`});objects.sort((a,b)=>a.depth-b.depth);
const outline=rect(reserve.x,reserve.y,reserve.w,reserve.d,'#ffda4f').replace('/>','fill-opacity=".12" stroke="#ffda4f" stroke-width="2"/>');
const body=ground.join('')+objects.map(o=>o.svg).join('')+`<g id="reserve" style="display:none">${outline}</g>`;
const frames={overview:{box:'-660 -175 3100 2070',width:1550,height:1035},landscape:{box:'-260 140 2050 1220',width:1464,height:872},portrait:{box:'365 -100 1060 1550',width:848,height:1240},detail:{box:'500 -50 1650 1200',width:1320,height:960}};
const svg=f=>`<svg xmlns="http://www.w3.org/2000/svg" width="${f.width}" height="${f.height}" viewBox="${f.box}" preserveAspectRatio="xMidYMid meet"><defs>${defs}</defs>${body}</svg>`;
for(const [name,f] of Object.entries(frames)){const s=svg(f);fs.writeFileSync(new URL(`vale-${name}.svg`,out),s);await sharp(Buffer.from(s)).flatten({background:'#60862e'}).jpeg({quality:95}).toFile(new URL(`vale-${name}.jpg`,out).pathname);}
await sharp(Buffer.from(svg(frames.landscape).replace('id="reserve" style="display:none"','id="reserve"'))).jpeg({quality:94}).toFile(new URL('clearance-review.jpg',out).pathname);
const manifest={middleFrontages,mewsConnections,club:club.name,projection:{origin,east,south,zStep},reserve,oldReserve,currentDepths:depths,currentEnvelope:current,growthAllowance,clearance,areaReduction:1-reserve.w*reserve.d/(oldReserve.w*oldReserve.d),roads,blocks,bounds,decor,access,groundUses,driveways,passages,forecourtDetails,corridors,crossings,counts,attachments,canopyOverlaps,stadiumFrame,frames};
fs.writeFileSync(new URL('scene-layout.json',out),JSON.stringify(manifest,null,2));
const html=`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Clubline — Vale-Park parkland study 5</title><style>body{margin:0;background:#102637;color:#eef0db;font:14px system-ui}header{padding:8px 10px}h1{font-size:17px;margin:0 0 5px}button{font-size:12px;padding:7px;margin:2px;color:#eef0db;background:#254942;border:1px solid #839995}#scene{height:calc(100dvh - 100px);min-height:200px}svg{height:100%;width:100%;display:block}</style><header><h1>CLUBLINE 99 — Vale-Park parkland study 5</h1><button onclick="frame('portrait')">Portrait</button><button onclick="frame('landscape')">Landscape</button><button onclick="frame('overview')">Wider town</button><button onclick="frame('detail')">Street detail</button><button onclick="automatic=true;adapt()">Auto</button><button onclick="const r=document.getElementById('reserve');r.style.display=r.style.display==='none'?'':'none'">Clearance</button></header><div id="scene">${svg(frames.landscape)}</div><script>const frames=${JSON.stringify(frames)};let automatic=true;function frame(k){automatic=false;document.querySelector('#scene svg').setAttribute('viewBox',frames[k].box)}function adapt(){if(automatic){if(innerWidth>innerHeight){const el=document.getElementById('scene'),ratio=el.clientWidth/el.clientHeight,h=790,w=Math.max(1440,h*ratio);document.querySelector('#scene svg').setAttribute('viewBox',(870-w/2)+' '+(620-h/2)+' '+w+' '+h)}else frame('portrait');automatic=true}}addEventListener('resize',adapt);adapt();</script>`;
fs.writeFileSync(new URL('CLUBLINE-Vale-Park-Parkland-Study-5.html',out),html);
console.log(JSON.stringify({counts,blocks:blocks.length,roads:roads.length,reserve,areaReduction:manifest.areaReduction,canopyOverlaps}));
