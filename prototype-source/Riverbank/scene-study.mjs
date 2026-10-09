import fs from 'node:fs';
import {createRequire} from 'node:module';
import {streetKit} from './street-kit.mjs';
import {sceneSvg} from './scene.js';
import {SITES} from './sites.js';
import {SECTIONS,defaultLayout} from './stadium-model.js';
import {groundsStand} from './grounds-geometry.js';
const sharp=createRequire(import.meta.url)('sharp'),out=new URL('./review/',import.meta.url);
const club=JSON.parse(fs.readFileSync(new URL('./data/league.json',import.meta.url))).clubs[12];
const origin=[900,710],east=[10.8,6.3],south=[-11.025,6.3],zStep=3.825;
Object.assign(SITES[0],{artWidth:1100,artHeight:1400,origin,east,south,scale:1.5,background:null});
const shifted=[origin[0]-36*east[0]-30*south[0],origin[1]-36*east[1]-30*south[1]];
const themes=['brick','render','red'];
const kits=themes.map(theme=>streetKit({origin:shifted,east,south,zStep,theme}));
// Swapping the ground basis rotates the house footprint, never its verticals.
const rotated=themes.map(theme=>streetKit({origin:shifted,east:south,south:east,zStep,theme}));
const frontages=[],gardenTrees=[];
const stone=streetKit({origin:shifted,east,south,zStep,theme:'sandstone'});
const k=kits[0],{P,rect,line,poly}=k,ground=[],roads=[],blocks=[],decor=[],counts={},groundUses=[],driveways=[];
const overlap=(a,b)=>a.x<b.x+b.w-1e-6&&a.x+a.w>b.x+1e-6&&a.y<b.y+b.d-1e-6&&a.y+a.d>b.y+1e-6;
const layout=defaultLayout(club),growthAllowance=1.0,clearance=.8;
const depths={};for(const side of ['N','S','W','E'])depths[side]=Math.max(...SECTIONS.filter(s=>s.side===side).map(s=>{const c=layout.sections[s.id];return (groundsStand(c.stand)?.roofRearV||0)+({compact:0,concourse:1.2,amenities:2,hospitality:2.6}[c.rear]||0); }));
const reserve={x:20-depths.W-growthAllowance-clearance,y:20-depths.N-growthAllowance-clearance,w:32+depths.W+depths.E+2*(growthAllowance+clearance),d:20+depths.N+depths.S+2*(growthAllowance+clearance)};
const oldReserve={x:1.39,y:1.39,w:69.22,d:57.22};
const colours={grass:['#60862e','#7c9c41','#426d28'],grassDark:['#4e782c','#628b36','#3b642c'],grassLight:['#829546','#a1ad60','#688638'],asphalt:['#676b65','#81857a','#575e59'],paving:['#bbb8a7','#d4cdb8','#999f90'],gravel:['#a19777','#c1b497','#8c8569'],soil:['#776347','#99805a','#5b513b']};
const defs=Object.entries(colours).map(([id,c])=>`<pattern id="${id}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="matrix(10.8 6.3 -11.025 6.3 0 0)"><rect width="6" height="6" fill="${c[0]}"/>${Array.from({length:170},(_,i)=>`<rect x="${((i*53)%179)/30}" y="${((i*37)%173)/29}" width="${i%3===0?.18:.08}" height="${i%3===0?.11:.06}" fill="${c[1+i%2]}"/>`).join('')}${id==='paving'?'<path d="M0 0H6V6M0 1H6M0 2H6M0 3H6M0 4H6M0 5H6M1 0V6M2 0V6M3 0V6M4 0V6M5 0V6" fill="none" stroke="#979f90" stroke-width=".03"/>':''}</pattern>`).join('');
// Original approximate setting informed by supplied visual references.
const passages=[],forecourtDetails=[],corridors=[],crossings=[];
ground.push(rect(-140,-140,350,350,'url(#grass)'));
const plans=[[-100,5,216,2.8,'North ground approach'],[5,-17.8,2.4,174.6,'West ground road'],[66,-17.8,3,174.6,'East ground road'],[-100,53,216,2.8,'South ground road'],[-100,-17.8,286.2,2.8,'Dockside road'],[-100,-64,286.2,2.8,'Far bank service road'],[-100,154,286.2,2.8,'Southern boundary road'],[-86,-80,2.2,87.8,'West river bridge road'],[132,-80,2.2,236.8,'East river bridge road'],[-34,5,2.2,50.8,'West car park road']];
const water=[{kind:'river',name:'Western river reach',x:-100,y:-42,w:13.4,d:18},{kind:'river',name:'Main dock river',x:-83.2,y:-42,w:214.6,d:18},{kind:'river',name:'Eastern river reach',x:134.8,y:-42,w:51.4,d:18}];corridors.push(...water);
for(const v of water){ground.push(rect(v.x,v.y,v.w,v.d,'#557e84'));for(let xx=v.x+3;xx<v.x+v.w-3;xx+=11)ground.push(line([[xx,v.y+7,0],[xx+4,v.y+7,0]],'#8da8a5',.6));}
const parcels=[];
function district(name,left,right,bands,edges){
 // Each strip has its own short streets and junctions. Offsets connect through
 // the cross streets; the scene is not filled by uninterrupted world-wide lines.
 const width=2.2;
 for(let j=0;j<bands.length-1;j++){
  const top=bands[j],bottom=bands[j+1],xs=edges[j].flatMap((x,i,a)=>i<a.length-1&&a[i+1]-x>(name.includes('Works')?60:34)?[x,(x+a[i+1])/2]:[x]);
  for(const x of xs)if(!(x===5||x===66))plans.push([x,top,width,bottom-top+2.8,`${name} lane ${j}-${x}`]);
  for(let i=0;i<xs.length-1;i++)parcels.push({name:`${name} ${j+1}-${i+1}`,x:xs[i]+(xs[i]===66?3:xs[i]===5?2.4:width),y:top+2.8,w:xs[i+1]-xs[i]-(xs[i]===66?3:xs[i]===5?2.4:width),d:bottom-top-2.8,orientation:(name==='South city'&&j%2===1)||(name==='West city'&&j%3===1)||(name==='Far west'&&j%3===0)?'horizontal':'vertical',theme:(i+j)%3});
 }
 for(const y of bands.slice(1))if(y!==5&&(y!==53||right>116)&&y!==-62)plans.push([left,y,right-left+2.2,2.8,`${name} cross street ${y}`]);
}
district('West city',-100,-34,[5,29,53],[[-100,-78,-55,-34],[-100,-76,-53,-34]]);
district('West edge',-100,5,[53,86,120,154],[[-100,-75,-49,-24,5],[-100,-78,-52,-27,5],[-100,-74,-48,-23,5]]);
district('Quay west homes',-100,5,[-17.8,5],[[-100,-86,-63,-40,-18,5]]);
district('North Works',-86,132,[-80,-64,-47],[[-86,-50,-14,22,58,94,132],[-86,-50,-14,22,58,94,132]]);
district('East Works',66,116,[-17.8,5,30,53,88,122,154],[[66,116],[66,116],[66,116],[66,116],[66,116],[66,116]]);
district('Far east',140,184,[-17.8,5,30,53,88,122,154],[[140,162,184],[140,162,184],[140,161,184],[140,161,184],[140,160,184],[140,160,184]]);
district('South city',5,66,[53,84,118,154],[[5,28,48,66],[5,24,44,66],[5,28,49,66]]);
// Where a perpendicular block would have excessive rear depth, give its
// additional rows their own short public street instead of hiding them inside.
for(let i=parcels.length-1;i>=0;i--){const p=parcels[i];if(p.orientation==='horizontal'&&p.d>=24){const mid=p.y+(p.d-1.6)/2;plans.push([p.x-2.2,mid,p.w+4.4,1.6,p.name+' short cross street']);parcels.splice(i,1,{...p,name:p.name+' north',d:mid-p.y},{...p,name:p.name+' south',y:mid+1.6,d:p.y+p.d-mid-1.6});}}
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
function streetBlock(p,index){
 const {name,x,y,w,d,orientation,theme}=p;
 const inset=1.18,depth=3.2+(index%3)*.18,bay=1.75+(index%4)*.10,kit=kits[theme],rkit=rotated[theme];
 plot(x+.61,y+.61,w-1.22,d-1.22,'url(#paving)');
 const block={name,mixed:Boolean(p.mixed),type:'street-facing residential block',x,y,w,d,homes:0,orientation,frontage:bay};blocks.push(block);
 const returnRow=orientation==='vertical'&&index%4===1&&d>20;
 const along=orientation==='vertical'?d:w,cross=orientation==='vertical'?w:d;
 // Both opposite rows face the public streets. A connected alley separates
 // their rear yards. There is no inaccessible third row inside the block.
 const start=returnRow?inset+depth+.7:inset;
 const n=Math.floor((along-start-inset)/bay);
 for(let side=0;side<2;side++){
  const facing=orientation==='vertical'?(side===0?'west':'east'):(side===0?'north':'south');
  const c=side===0?inset:cross-inset-depth;
  const row={block:name,front:facing,homes:[],accessStreet:null};
  for(let i=0;i<n;i++){
   const v=start+i*bay,xx=orientation==='vertical'?x+c:x+v,yy=orientation==='vertical'?y+v:y+c;
   // Variation is by short runs, not a random facade on every individual home.
   if(p.mixed&&i%8===3&&i+1<n){
    const semiWidth=2*bay-.34,xx2=orientation==='vertical'?xx:xx+.16,yy2=orientation==='vertical'?yy+.16:yy;
    const kind=index%5===0?'gable':'semi';
    const use=orientation==='vertical'?rotated[theme]:kits[theme];
    const asset=orientation==='vertical'?use.building(kind,yy2,xx2,semiWidth,depth,{height:5.1+(index%3)*.5,front:side===0?'north':'south'}):use.building(kind,xx2,yy2,semiWidth,depth,{height:5.1+(index%3)*.5,front:side===0?'north':'south'});
    asset.residential=true;
    row.homes.push({x:xx2,y:yy2,w:orientation==='vertical'?depth:semiWidth,d:orientation==='vertical'?semiWidth:depth,units:kind==='semi'?2:1,assetKind:kind});block.homes+=kind==='semi'?2:1;i++;continue;
   }
   const localTheme=(theme+(Math.floor(i/6)%2===0?0:2))%3;
   const use=orientation==='vertical'?rotated[localTheme]:kits[localTheme];
   if(orientation==='vertical')use.terrace(yy,xx,{w:bay,d:depth,front:side===0?'north':'south',first:i===0,last:i===n-1,height:4.35+(index%3)*.35+Math.floor(i/4)%2*.45+(p.tall?1.5:0),variant:index%3});
   else use.terrace(xx,yy,{w:bay,d:depth,front:side===0?'north':'south',first:i===0,last:i===n-1,height:4.35+(index%3)*.35+Math.floor(i/4)%2*.45+(p.tall?1.5:0),variant:index%3});
   row.homes.push({x:xx,y:yy,w:orientation==='vertical'?depth:bay,d:orientation==='vertical'?bay:depth});block.homes++;
  }
  frontages.push(row);
 }
 const mid=cross/2,alley=.7,al=orientation==='vertical'?{x:x+mid-alley/2,y:y+.4,w:alley,d:d-.8}:{x:x+.4,y:y+mid-alley/2,w:w-.8,d:alley};
 if(returnRow){al.y=y+inset+depth+.6;al.d=y+d-.4-al.y;}
 passage(name+' connected rear alley',al.x,al.y,al.w,al.d);
 if(returnRow){const row={block:name,front:'north',homes:[],accessStreet:null};const count=Math.floor((w-2*inset)/bay);for(let i=0;i<count;i++){const xx=x+inset+i*bay,yy=y+inset;kits[(theme+1)%3].terrace(xx,yy,{w:bay,d:depth,front:'north',first:i===0,last:i===count-1,height:5.0});row.homes.push({x:xx,y:yy,w:bay,d:depth});block.homes++;}frontages.push(row);block.returnRow=true;}
 // Separate rear courts and short return lanes connect directly to pavements
 // at both block ends. Yards are paved in this dense inner-city district.
 for(let i=0;i<n;i++){
  const v=start+i*bay;
  for(let side=0;side<2;side++){
   const rear=side===0?inset+depth+.45:mid+.45;
   const end=side===0?mid-.45:cross-inset-depth-.2;
   if(end-rear>.15){
    const courtyard=orientation==='vertical'?{x:x+rear+.08,y:y+v+.08,w:end-rear-.15,d:bay-.16}:{x:x+v+.08,y:y+rear+.08,w:bay-.16,d:end-rear-.15};
    ground.push(rect(courtyard.x,courtyard.y,courtyard.w,courtyard.d,i%5===0?'url(#paving)':i%7===3?'url(#gravel)':'url(#grassDark)'));
    if((i+index+side)%3===0&&end-rear>2.0)gardenTrees.push([courtyard.x+courtyard.w*.5,courtyard.y+courtyard.d*.5,.62+((i+index)%4)*.12,6.2+(i%5)*.8]);
    if(orientation==='vertical')fence(kit,x+rear,y+v,end-rear,0,{height:1.0,brick:i%5===0});
    else fence(kit,x+v,y+rear,0,end-rear,{height:1.0,brick:i%5===0});
    if(i%5===1&&end-rear>1.2){if(orientation==='vertical')kit.smallBuilding('shed',x+rear+.2,y+v+.2,.7,.6,{h:1.1});else kit.smallBuilding('shed',x+v+.2,y+rear+.2,.7,.6,{h:1.1});}
   }
  }
 }
 // Mature corner planting interrupts a few street frontages where full canopy clearance allows it.
 if(index%3===0)gardenTrees.push([x+w*.3,y+d-1.5,.85,8.3]);
 // Short walls leave an individual gate opening at every doorstep.
 for(let i=0;i<n;i++){
  const v=start+i*bay;
  if(orientation==='vertical'){fence(kit,x+.85,y+v,0,bay-.7,{height:.45});fence(kit,x+w-.85,y+v,0,bay-.7,{height:.45});}
  else {fence(kit,x+v,y+.85,bay-.7,0,{height:.45});fence(kit,x+v,y+d-.85,bay-.7,0,{height:.45});}
 }

}
function commercialBlock(p,index){
 const {x,y,w,d,name}=p;
 plot(x+.65,y+.65,w-1.3,d-1.3,'url(#paving)');
 blocks.push({...p,type:'mixed city block with service alley'});
 const depth=Math.min(6.2,(d-3.8)/2),gap=.30,frontage=3.1;
 // City frontages have larger, taller premises mixed within short runs.
 // Opposing facades still belong to streets and have a shared rear route.
 const n=Math.floor((w-2.4)/(frontage+gap));
 for(let side=0;side<2;side++)for(let i=0;i<n;i++){
  const xx=x+1.2+i*(frontage+gap),yy=side===0?y+1.2:y+d-1.2-depth;
  const theme=(index+i)%3,kind=(i+index)%4===0?'flats':'shop';
  kits[theme].building(kind,xx,yy,frontage,depth,{height:6.6+(i%3)*1.05+(side===0?.3:0),variant:(i+index)%3,sign:side===1?['NEWS','RECORDS','CAFE','BOOKS','CHEMIST'][i%5]:null});
 }
 const laneY=y+d/2-.45;
 const court={x:x+1.1,y:y+1.2+depth+.16,w:w-2.2,d:d-2.4-2*depth-.32};
 if(court.d>0)ground.push(rect(court.x,court.y,court.w,court.d,index%3===0?'url(#gravel)':'url(#asphalt)'));
 passage(name+' city rear route',x+.4,laneY,w-.8,.9);
 // Rear stores sit off the access lane where the parcel is deep enough.
 if(d>23&&laneY-(y+1.2+depth) > 2.6){for(let i=0;i<Math.floor(w/6);i++)k.smallBuilding('workshop-store',x+1.5+i*6,y+1.2+depth+.45,4.0,1.7,{h:2.4+(i%2)*.7});}
 if(court.d>2.7&&index%4===0)k.car(x+w-3.4,laneY+1.2,{colour:index%2?'#566671':'#783e37'});
}
const parking=[];
function cityParking(p){const {x,y,w,d,name}=p;const lot={kind:'parking',name,x:x+.7,y:y+.7,w:w-1.4,d:d-1.4};parking.push(lot);groundUses.push(lot);plot(lot.x,lot.y,lot.w,lot.d,'url(#asphalt)');blocks.push({...p,type:'city parking and ticket office'});
 k.smallBuilding('ticket-office',x+1.1,y+1.1,2.4,2.0,{h:2});
 entry(name+' vehicle gate',x+w-4,y,2.4,.7);
 for(let j=0;j<Math.floor((d-7)/2.3);j++)for(let side=0;side<2;side++){const xx=side===0?x+1.3:x+w-4.1,yy=y+5+j*2.3;ground.push(line([[xx,yy,0],[xx+2.5,yy,0],[xx+2.5,yy+1.9,0]],'#cbc6b1',.7));if((j+side)%3!==1)k.car(xx+.2,yy+.5,{colour:['#633d3a','#bdbdae','#445b69','#555e4a'][j%4]});}
 if(w>26)for(let col=0,xx=x+8;xx<x+w-8;col++,xx+=6.2)for(let j=0;j<Math.floor((d-7)/2.3);j++){
  const yy=y+5+j*2.3;ground.push(line([[xx,yy,0],[xx+2.5,yy,0],[xx+2.5,yy+1.9,0]],'#cbc6b1',.7));if((j+col)%4===0)k.car(xx+.2,yy+.5,{colour:['#526578','#a7ada0','#813f36','#49654f'][(j+col)%4]});
 }
}
function towerCourt(p,index){
 const {x,y,w,d,name}=p;plot(x+.7,y+.7,w-1.4,d-1.4,'url(#grassDark)');blocks.push({...p,type:'apartment court with mixed heights'});
 k.building('flats',x+2,y+2,6,5,{height:24+(index%2)*4});kits[1].building('flats',x+w-8,y+d-8,5.7,6,{height:11.5});
 passage(name+' apartment entrance',x+.4,y+d/2,w-.8,1.0);entry(name+' apartment street gate',x,y+d/2,1.2,1.0);
 for(let i=0;i<12;i++)gardenTrees.push([x+2+(i%4)*(w-4)/4,y+9+Math.floor(i/4)*3,.6+(i%2)*.1,5.2+i%4*.5]);
}
function workingYard(p,index){
 const {x,y,w,d,name}=p;plot(x+.7,y+.7,w-1.4,d-1.4,index%2?'url(#asphalt)':'url(#gravel)');blocks.push({...p,type:'warehouse and loading yard'});
 const depth=Math.min(10,d*.42),bw=index%3===0?w*.61:w-3;
 k.building(index%3===0?'brickwarehouse':'warehouse',x+1.4,y+1.4,bw,depth,{height:4.5+(index%4)*1.2});
 if(index%3===0)kits[1].building('workshop',x+bw+2.7,y+1.4,w-bw-4.1,depth,{height:4});
 k.container(x+1.5,y+d-5,6,2,{colour:['#456a7b','#8a4237','#58785c','#a88b43'][index%4],stack:index%3===0?2:1,topColour:'#a68e45'});
 k.truck(x+w-7,y+d-5,{colour:index%2?'#a9b6b5':'#b9b8a8',cargo:'#bfc0aa'});
 passage(name+' loading lane',x+.4,y+d-2,w-.8,1.1);entry(name+' yard gate',x,y+d-2,1.3,1.1);
 if(index%4===1)k.pallets(x+w/2,y+d-5,{w:2,d:1.6});
}
const networkGroups={},lake=[];
cityParking({name:'North matchday car park',x:8,y:-15,w:57,d:20});cityParking({name:'West matchday car park',x:-31.8,y:7.8,w:36.5,d:45.2});
plot(70,-23.5,46,4.8,'url(#paving)');blocks.push({name:'Dock cranes and quay',x:70,y:-23.5,w:46,d:4.8,type:'dock quay with original cranes'});k.dockCrane(76,-23.4);k.dockCrane(102,-23.4);
passage('Dock quay service walk',70,-18.7,44,0.8);entry('Dock quay street gate',70,-18.7,1.2,.9);networkGroups.quay=['Dock quay service walk'];
plot(120,8,10,28,'url(#gravel)');k.storageTank(121,10,8,8,{height:7});k.storageTank(121,23,8,8,{height:8.3});entry('Tank yard service gate',130,18,2,1.2);blocks.push({name:'Utility tank yard',x:120,y:8,w:10,d:28,type:'storage tanks and service gate'});
for(const [index,p] of parcels.entries()){
 if(p.name.includes('Works')){workingYard(p,index);continue;}
 if(p.name==='Far east 2-1'){towerCourt(p,index);continue;}
 if(p.name==='South city 1-1'){commercialBlock(p,index);continue;}
 else streetBlock({...p,mixed:index%3===0},index);
}
// Verify front doors belong to a public street on the correct side. Store the
// complete doorstep route so independent checks catch internal orphan rows.
for(const row of frontages){
 const first=row.homes[0],vertical=row.front==='west'||row.front==='east';
 const edge=row.front==='west'?first.x:row.front==='east'?first.x+first.w:row.front==='north'?first.y:first.y+first.d;
 const candidates=roads.filter(r=>vertical?r.d>r.w:r.w>r.d);
 row.accessStreet=candidates.find(r=>{
  const roadEdge=row.front==='west'?r.x+r.w:row.front==='east'?r.x:row.front==='north'?r.y+r.d:r.y;
  const gap=row.front==='west'||row.front==='north'?edge-roadEdge:roadEdge-edge;
  return gap>=.6&&gap<=1.3&&row.homes.every(h=>vertical?h.y>=r.y&&h.y+h.d<=r.y+r.d:h.x>=r.x&&h.x+h.w<=r.x+r.w);
 })?.name;
 if(!row.accessStreet)throw Error('Orphan house frontage '+row.block+' '+row.front);
}
// Current stadium hardstanding follows this club's stand extents, not Highfield's.
const current={x:20-depths.W,y:20-depths.N,w:32+depths.W+depths.E,d:20+depths.N+depths.S};
const access=[
 {name:'north stand rear apron',x:20,y:8.4,w:32,d:current.y-8.4},
 {name:'south stand rear apron',x:20,y:current.y+current.d,w:32,d:52.4-current.y-current.d},
 {name:'west stand rear walk',x:8,y:20,w:current.x-8,d:20},
 {name:'east stand rear walk',x:current.x+current.w,y:20,w:65.4-current.x-current.w,d:20},
 {name:'northwest entrance court',x:8,y:8.4,w:12,d:11.6},
 {name:'northeast entrance court',x:52,y:8.4,w:13.4,d:11.6},
 {name:'southwest entrance court',x:8,y:40,w:12,d:12.4},
 {name:'southeast entrance court',x:52,y:40,w:13.4,d:12.4}
];
for(const [i,a] of access.entries())ground.push(rect(a.x,a.y,a.w,a.d,i%3===0?'url(#asphalt)':'url(#paving)'));
groundUses.push(...access);
// Irregular groves, a partial avenue and scattered mature edge trees.
const allKits=[...kits,...rotated,stone];
const allBounds=()=>allKits.flatMap((kit,j)=>kit.bounds.map(b=>({...b,...(j>=3&&j<6?{x:b.y,y:b.x,w:b.d,d:b.w}:{}),id:j+':'+b.id,parent:b.parent?j+':'+b.parent:null})));
const treeSites=[...gardenTrees];
for(const [x,y,r,h] of treeSites){const canopyR=Math.max(r+.3,1.75*r),f={x:x-canopyR,y:y-canopyR,w:2*canopyR,d:2*canopyR};if(!allBounds().some(b=>b.kind==='tree'?Math.hypot(b.x+b.w/2-x,b.y+b.d/2-y)<1.3:overlap(b,f))&&!roads.some(q=>overlap(q.full,f))&&!lake.some(q=>overlap(q,f))&&!corridors.some(q=>overlap(q,f))&&!driveways.some(q=>overlap(q,f))&&!passages.some(q=>overlap(q,f))&&!overlap(f,reserve))k.tree(x,y,r,{height:h,tone:Math.abs(Math.round(x+y))%3});}
for(const [x,y] of [[10,4.2],[35,4.2],[55,4.2],[65.4,9.5],[19,52.2],[39,52.2]]){const f={x,y,w:.48,d:.48};if(!roads.some(r=>overlap(r,f))&&!overlap(f,reserve)&&!passages.some(p=>overlap(p,f))&&!allBounds().some(b=>overlap(b,f)))k.streetFurniture('lamp',x,y);}
for(const water of lake)for(const f of [...allBounds(),...decor.filter(d=>d.kind==='path')])if(overlap(water,f))throw Error('Lake obstruction');
const bounds=allBounds(),permanent=bounds.filter(a=>a.kind!=='car');
for(const f of [...bounds,...decor,...roads.map(a=>a.full)])if(overlap(f,reserve))throw Error('Reserve intrusion '+JSON.stringify(f));
for(const f of decor)for(const r of roads)if(overlap(f,r))throw Error('Decor asphalt intrusion '+JSON.stringify(f)+' '+r.name);
for(const f of permanent)for(const r of roads)if(overlap(f,f.pavement?r:r.full))throw Error('Road asset overlap '+JSON.stringify(f)+' '+r.name);
let attachments=0,canopyOverlaps=0;for(let i=0;i<permanent.length;i++)for(let j=i+1;j<permanent.length;j++){const a=permanent[i],b=permanent[j];if(overlap(a,b)){if(a.kind==='tree'&&b.kind==='tree'){canopyOverlaps++;continue;}if(a.parent===b.id||b.parent===a.id){attachments++;continue;}throw Error('Asset collision '+JSON.stringify([a,b]));}}
for(const path of passages)for(const f of permanent)if(overlap(path,f))throw Error('Blocked passage '+JSON.stringify(f)+' '+path.name);
for(const drive of driveways)for(const f of permanent)if(overlap(drive,f))throw Error('Blocked driveway '+JSON.stringify(f));
for(const corridor of corridors)for(const f of [...bounds,...decor])if(overlap(f,corridor)&&!(f.kind==='footbridge'&&corridor.kind==='rail'))throw Error('Corridor collision '+JSON.stringify(f)+' '+corridor.name);
for(const corridor of corridors)for(const road of roads)if(overlap(corridor,road.full))throw Error('Road corridor intrusion '+road.name);
for(const b of bounds)counts[b.kind]=(counts[b.kind]||0)+1;
const raw=sceneSvg(club,'aberdeen',false,false,true),stadiumFrame=raw.match(/data-title-frame="([^"]+)"/)[1].split(' ').map(Number);
const stadium=raw.replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'').replace(/<image\b[^>]*\/>/g,'');
const objects=allKits.flatMap(a=>a.objects);objects.push({depth:66,svg:`<g id="actual-stadium">${stadium}</g>`});objects.sort((a,b)=>a.depth-b.depth);
const outline=rect(reserve.x,reserve.y,reserve.w,reserve.d,'#ffda4f').replace('/>','fill-opacity=".12" stroke="#ffda4f" stroke-width="2"/>');
const body=ground.join('')+objects.map(o=>o.svg).join('')+`<g id="reserve" style="display:none">${outline}</g>`;
const frames={overview:{box:'-660 -175 3100 2070',width:1550,height:1035},landscape:{box:'-260 140 2050 1220',width:1464,height:872},portrait:{box:'365 -140 1060 1550',width:848,height:1240},detail:{box:'500 -50 1650 1200',width:1320,height:960}};
const svg=f=>`<svg xmlns="http://www.w3.org/2000/svg" width="${f.width}" height="${f.height}" viewBox="${f.box}" preserveAspectRatio="xMidYMid meet"><defs>${defs}</defs>${body}</svg>`;
for(const [name,f] of Object.entries(frames)){const s=svg(f);fs.writeFileSync(new URL(`riverbank-${name}.svg`,out),s);await sharp(Buffer.from(s)).flatten({background:'#60862e'}).jpeg({quality:95}).toFile(new URL(`riverbank-${name}.jpg`,out).pathname);}
await sharp(Buffer.from(svg(frames.landscape).replace('id="reserve" style="display:none"','id="reserve"'))).jpeg({quality:94}).toFile(new URL('clearance-review.jpg',out).pathname);
const manifest={networkGroups,parking,frontages,club:club.name,projection:{origin,east,south,zStep},reserve,oldReserve,currentDepths:depths,currentEnvelope:current,growthAllowance,clearance,areaReduction:1-reserve.w*reserve.d/(oldReserve.w*oldReserve.d),roads,blocks,bounds,decor,access,groundUses,driveways,passages,forecourtDetails,corridors,crossings,counts,attachments,canopyOverlaps,stadiumFrame,frames};
fs.writeFileSync(new URL('scene-layout.json',out),JSON.stringify(manifest,null,2));
const html=`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Clubline — Riverbank surroundings study 1</title><style>body{margin:0;background:#102637;color:#eef0db;font:14px system-ui}header{padding:8px 10px}h1{font-size:17px;margin:0 0 5px}button{font-size:12px;padding:7px;margin:2px;color:#eef0db;background:#254942;border:1px solid #839995}#scene{height:calc(100dvh - 100px);min-height:200px}svg{height:100%;width:100%;display:block}</style><header><h1>CLUBLINE 99 — Riverbank surroundings study 1</h1><button onclick="frame('portrait')">Portrait</button><button onclick="frame('landscape')">Landscape</button><button onclick="frame('overview')">Wider town</button><button onclick="frame('detail')">Street detail</button><button onclick="automatic=true;adapt()">Auto</button><button onclick="const r=document.getElementById('reserve');r.style.display=r.style.display==='none'?'':'none'">Clearance</button></header><div id="scene">${svg(frames.landscape)}</div><script>const frames=${JSON.stringify(frames)};let automatic=true;function frame(k){automatic=false;document.querySelector('#scene svg').setAttribute('viewBox',frames[k].box)}function adapt(){if(automatic){if(innerWidth>innerHeight){const el=document.getElementById('scene'),ratio=el.clientWidth/el.clientHeight,h=790,w=Math.max(1440,h*ratio);document.querySelector('#scene svg').setAttribute('viewBox',(870-w/2)+' '+(620-h/2)+' '+w+' '+h)}else frame('portrait');automatic=true}}addEventListener('resize',adapt);adapt();</script>`;
fs.writeFileSync(new URL('CLUBLINE-Riverbank-Study-1.html',out),html);
console.log(JSON.stringify({counts,blocks:blocks.length,roads:roads.length,reserve,areaReduction:manifest.areaReduction,canopyOverlaps}));
