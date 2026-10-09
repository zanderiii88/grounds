const queuedTrees=[];function queueTree(x,y,r=1.05,options={}){queuedTrees.push([x,y,r,options]);}
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {streetKit} from './street-kit.mjs';
import {sceneSvg} from './scene.js';
import {SITES} from './sites.js';
import {SECTIONS,defaultLayout} from './stadium-model.js';
import {groundsStand} from './grounds-geometry.js';
const sharp=createRequire(import.meta.url)('sharp'),out=new URL('./review/',import.meta.url);
const club=JSON.parse(fs.readFileSync(new URL('./data/league.json',import.meta.url))).clubs[0];
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
ground.push(rect(-140,-140,350,350,'url(#grass)'));
// Larger landscape masses are drawn before the street network.
ground.push(poly([[-65,-45],[-28,-45],[-25,-18],[-40,8],[-25,29],[-31,58],[-60,88]],'url(#grassDark)'));
ground.push(rect(-55,79,81,48,'url(#grassDark)'),rect(100,-55,45,181,'url(#grassDark)'));
// District boundaries: remove the repeated short cross streets of Study 3.
const plans=[
 [-120,5,360,3.0,'Highfield Road'],[-120,52,360,3.2,'Station Road'],
 [0,-95,2.4,265,'Ground Lane'],[63.5,-95,2.8,265,'Eastgate Road'],
 [-43,-13,45.4,2.6,'West Back Lane'],[63.5,-13,62.3,2.6,'East Back Lane'],[-43,-34,109.3,2.6,'Upper Mason Street'],[63.5,-36.5,62.3,2.6,'East Upper Mason Street'],
 [-20,-34,2.5,89.2,'Mill Lane'],[-43,27,25.5,2.6,'Mill Street'],[-20,30.2,22.4,2.6,'Ground Lane approach'],
 [123,-34,2.8,129,'Railway Approach'],
 [-43,91,109.3,2.6,'West Park Road'],[63.5,94,62.3,2.6,'East Park Road'],[-43,-62,168.8,2.6,'North continuation'],
 [-43,108,168.8,2.6,'South continuation']
];
for(const [x,y,w,d,name] of plans){const r={x,y,w,d,name,pavement:.6};r.full={x:x-.6,y:y-.6,w:w+1.2,d:d+1.2};if(overlap(r.full,reserve))throw Error('Road reserve '+name);roads.push(r);}
for(const r of roads)ground.push(rect(r.full.x,r.full.y,r.full.w,r.full.d,'url(#paving)'));
for(const r of roads)ground.push(rect(r.x,r.y,r.w,r.d,'url(#asphalt)'));
for(const r of roads.filter(r=>r.w>100||r.d>100)){
 const along=r.w>r.d,L=along?r.w:r.d;
 for(let i=1;i<L-1;i+=2.9){const a={x:along?r.x+i:r.x+r.w/2-.055,y:along?r.y+r.d/2-.055:r.y+i,w:along?1.15:.11,d:along?.11:1.15};if(roads.some(q=>q!==r&&overlap(a,q.full)))continue;ground.push(rect(a.x,a.y,a.w,a.d,'#dcd8bd',.01));}
}
const record=(kind,x,y,w,d)=>decor.push({kind,x,y,w,d});
function plot(x,y,w,d,c='url(#grass)'){ground.push(rect(x,y,w,d,c));record('plot',x,y,w,d);}
function fence(kit,x,y,w,d,options){kit.fence(x,y,w,d,options);record('fence',Math.min(x,x+w)-.025,Math.min(y,y+d)-.025,Math.abs(w)+.05,Math.abs(d)+.05);}
function terraceBlock(name,x,top,n,bottom,theme=0){
 const kit=kits[theme],width=n*2.45;blocks.push({name,type:'back-to-back terraces',x,y:top,w:width,d:bottom-top});
 const north=top+.7,southY=bottom-4.0,backN=north+3.2,backS=southY;
 const alley=(backN+backS)/2-.4;
 plot(x-.2,top,width+.4,bottom-top,'#828368');
 plot(x,alley,width,.8,'url(#gravel)');
 for(let i=0;i<n;i++){
  const xx=x+i*2.45,kit=kits[(theme+(Math.floor(i/6)%3===1?1:0))%3];
  const a=kit.terrace(xx,north,{front:'north',first:i===0,last:i===n-1,variant:i,height:4.4+Math.floor(i/3)%3*.45});
  kit.terrace(xx,southY,{front:'south',first:i===0,last:i===n-1,variant:i+theme,height:4.65+Math.floor(i/4)%2*.55});
  if(i%3===0){gardenTrees.push([xx+1.2,backN+(alley-backN)*.5,.65,6.5],[xx+1.2,alley+.8+(backS-alley-.8)*.6,.7,7.3]);}
  ground.push(rect(xx,backN,2.45,.7,'url(#paving)'),rect(xx,backN+.7,2.45,alley-backN-.7,i%4===0?'#8d8966':'url(#grass)'),rect(xx,alley+.8,2.45,backS-alley-.8,'url(#grass)'),rect(xx,backS-.65,2.45,.65,'url(#paving)'),rect(xx,southY+3.6,2.45,.4,'url(#paving)'));
  fence(kit,xx,backN,0,alley-backN);fence(kit,xx,alley+.8,0,backS-alley-.8);
  for(const yy of [alley-.04,alley+.84]){fence(kit,xx,yy,1.85,0);fence(kit,xx+1.85,yy,.5,0,{height:.45});fence(kit,xx+2.35,yy,.1,0);}
  if(alley-backN>2.1){if(i%3===1)kit.smallBuilding('extension',xx+1.2,backN,1,.7,{h:1.6,parent:a.id});else kit.smallBuilding('shed',xx+.15,alley-1.1,.85,.85,{h:1.25});}
  if(backS-alley>.8+1.6&&i%3!==1)kit.smallBuilding('shed',xx+.15,alley+1.08,.85,.85,{h:1.25});
  kit.bin(xx+.18,backN+.16);kit.bin(xx+1.9,backS-.45);
  if(alley-backN>2.8&&i%3===0){kit.washing(xx+.35,backN+1.35,1.0);record('washing',xx+.35,backN+1.35,1.0,.08);}
  if(i%4===2&&backS-alley>3)kit.shrubs(xx+1.4,alley+1.1,.75,.7);
 }
}
// Compact cottages have individual gables and a shared street frontage.
function cottageRow(name,x,y,n,{front='south',theme=1,step=2.7,w=2.25,d=3.0,garden=3.3,height=4.2}={}){
 blocks.push({name,type:'gable cottages',x,y,w:n*step,d:d+garden+1});
 for(let i=0;i<n;i++){
  const xx=x+i*step,kit=kits[(i%5===0?(theme+1)%3:theme)];
  kit.building('gable',xx,y,w,d,{axis:'y',front,height:height+Math.floor(i/3)%3*.35,variant:i});
  const gy=front==='south'?y-garden:y+d;
  plot(xx-.12,gy,step-.15,garden,'url(#grass'+(i%4===1?'Light':'')+')');
  if(garden>2&&i%3===1)ground.push(rect(xx+.6,gy+.3,w-.8,garden*.4,'url(#soil)'));
  ground.push(rect(xx,y+(front==='south'?d:-.65),w,.6,'url(#paving)'),rect(xx+.15,gy+.15,.35,garden-.3,'url(#gravel)'));
  fence(kit,xx-.1,gy,0,garden,{height:.6});
  if(garden>2.2&&i%3!==1)kit.smallBuilding('shed',xx+.9,front==='south'?gy+.25:gy+garden-1.2,.9,.9,{h:1.25});
  kit.bin(xx+.12,front==='south'?y-.45:y+d+.22);if(i%3===0)gardenTrees.push([xx+w*.5,gy+garden*.6,.62,6.4]);
 }
}
// A dense northern residential district: broad paired rows, not little road cells.
// Shared rear lanes stay narrow; the main streets run across the entire district.
for(const [label,top,bottom] of [['Mason',-29.7,-15.2],['Highfield',-9.2,3.7]]){
 terraceBlock(label+' west brick rows',-40,top,7,bottom,2);
 terraceBlock(label+' west cream rows',-15.7,top,5,bottom,1);
 // Central housing is laid out below with short runs and corner returns.
 // Eastgate is a neighbouring district of paired and detached homes.
}
// The older central neighbourhood has individual block plans. Short terrace
// groups step in height and leave cross passages connecting street and rear lane.
const passages=[];
function passage(name,x,y,w,d){plot(x,y,w,d,'url(#gravel)');passages.push({name,x,y,w,d});}
function terraceRun(name,x,y,n,{front='south',theme=0,height=4.7,rearLane}={}){
 const kit=kits[theme];blocks.push({name,type:'short terrace group',x,y,w:n*2.45,d:3.53,height});
 for(let i=0;i<n;i++){
  const xx=x+i*2.45;
  kit.terrace(xx,y,{front,first:i===0,last:i===n-1,variant:i,height});
  const gy=front==='north'?y+3.2:rearLane+.9;
  const gd=front==='north'?rearLane-gy:y-gy;
  ground.push(rect(xx,gy,2.45,gd,i%3===0?'url(#gravel)':'url(#grass)'),rect(xx+.1,gy,.35,gd,'url(#paving)'));
  fence(kit,xx,gy,0,gd);
  if(gd>1.8&&i%3!==1)kit.smallBuilding('shed',xx+1.25,front==='north'?rearLane-1.15:gy+.2,.85,.8,{h:1.25});
  kit.bin(xx+.55,front==='north'?gy+.3:y-.4);if(i%3===1&&gd>2)gardenTrees.push([xx+1.2,gy+gd*.6,.6,6.8]);
  fence(kit,xx,rearLane+(front==='north'?-.03:.93),1.7,0,{height:.65});
 }
}
function returnHomes(name,x,ys,{theme=0,front='east'}={}){
 blocks.push({name,type:'houses facing the side street',x,y:ys[0],w:3.1,d:ys.at(-1)-ys[0]+3.4});
 ys.forEach((y,i)=>kits[(theme+i%2)%3].building(i===1?'house':'gable',x,y,3.0,i===1?3.1:3.4,{axis:'y',front,height:[5.3,4.4,5.0][i]}));
}
// Mason's north and south rows differ in length; their passages do not all line up.
plot(4,-30,57,15.1,'url(#grass)');
passage('Mason rear lane',7.8,-22.6,48.7,.9);
passage('Mason western side passage',7.6,-30,.55,15.1);
passage('Mason eastern side passage',55.2,-30,.55,15.1);
for(const [x,y,n,theme,height] of [[8.5,-29.0,6,2,4.6],[25.0,-28.7,6,0,5.15],[42.0,-29.0,3,2,4.6]])
 terraceRun('Mason north frontage',x,y,n,{front:'north',theme,height,rearLane:-22.6});
for(const [x,y,n,theme,height] of [[8.5,-19.1,4,2,4.6],[19.8,-18.9,8,1,4.9],[41.1,-19.1,5,0,5.3]])
 terraceRun('Mason south frontage',x,y,n,{theme,height,rearLane:-22.6});
for(const [x,y,w,d] of [[23.45,-30,1.0,7.4],[40.05,-30,1.05,7.4],[18.55,-22.6,.9,7.7],[39.65,-22.6,.95,7.7]])
 passage('Mason cross passage',x,y,w,d);
returnHomes('Mason western return',4.25,[-28.9,-24.6,-20.2],{theme:0,front:'west'});
kits[1].building('flats',50.5,-29.0,4.1,5.4,{height:7.7});
returnHomes('Mason eastern return',57.05,[-28.5,-24.1,-19.7],{theme:2});
// Highfield has a corner shop, shorter cottages and a taller late terrace group.
plot(4,-11.8,57,15.5,'url(#grass)');
passage('Highfield rear lane',7.8,-4.5,48.7,.9);
passage('Highfield western side passage',7.6,-11.8,.55,15.5);
for(const [x,y,n,theme,height] of [[8.5,-10.7,5,1,4.35],[22.8,-10.4,8,2,5.25],[44.0,-10.7,4,0,4.65]])
 terraceRun('Highfield rear frontage',x,y,n,{front:'north',theme,height,rearLane:-4.5});
for(const [x,y,n,theme,height] of [[8.5,-.45,6,1,4.35],[24.4,-.75,5,0,4.85],[38.1,-.45,6,2,5.2]])
 terraceRun('Highfield Road terrace groups',x,y,n,{theme,height,rearLane:-4.5});
for(const [x,y,w,d] of [[21.2,-11.8,.95,7.3],[42.85,-11.8,.85,7.3],[23.5,-4.5,.7,8.2],[37.05,-4.5,.7,8.2]])
 passage('Highfield cross passage',x,y,w,d);
returnHomes('Highfield western return',4.25,[-10.5,-6.2,-1.7],{theme:1,front:'west'});
kits[2].building('shop',56.8,-.5,3.65,3.3,{height:5.7,sign:'CORNER',awning:true});
returnHomes('Highfield eastern return',57.05,[-10.5,-6.2],{theme:0});
// A small service court interrupts the eastern end rather than another house.
plot(54.25,-3.4,2.0,3.1,'url(#paving)');k.smallBuilding('garage',54.5,-3.1,1.35,2.1,{h:1.6});
// Eastgate is visibly a different housing district, with larger individual plots.
function villaDistrict(name,top,bottom){
 blocks.push({name,type:'semis detached homes and side gardens',x:68.4,y:top,w:53,d:bottom-top});
 const lane=(top+bottom)/2-.45;

 const lots=[
  {x:68.7,w:6.8,kind:'semi',bw:4.7,theme:1,h:4.6},
  {x:76.2,w:6.3,kind:'gable',bw:3.4,theme:0,h:5.1},
  {x:83.3,w:7.5,kind:'semi',bw:5.0,theme:2,h:4.5},
  {x:91.6,w:6.6,kind:'house',bw:3.8,theme:1,h:5.4},
  {x:99.0,w:7.8,kind:'semi',bw:5.1,theme:0,h:4.9},
  {x:107.6,w:8.6,kind:'gable',bw:4.1,theme:2,h:5.0}
 ];
 for(let i=0;i<lots.length;i++){
  const a=lots[i],kit=kits[a.theme];plot(a.x-.15,top,a.w,bottom-top,'url(#grass'+(i%3===1?'Light':'')+')');
  for(const north of [true,false]){
   const y=north?top+.8+(i%3)*.2:bottom-4.0-(i%2)*.35,d=north?3.0+(i%2)*.3:3.1;
   const xx=a.x+(north?.15:.45),kind=north?a.kind:(i===1?'house':a.kind);
   kit.building(kind,xx,y,a.bw,d,{axis:kind==='gable'?'y':'x',front:north?'north':'south',height:a.h+(north?0:.25),bay:!north&&kind!=='semi',dormer:i===3});
   const gy=north?y+d:lane+.9,gd=north?lane-gy:y-gy;
   ground.push(rect(xx,gy,a.bw,gd,'url(#grass)'),rect(a.x+a.w-1.15,north?top:lane+.9,.75,north?lane-top:bottom-lane-.9,'url(#gravel)'));
   fence(kit,a.x-.15,gy,0,gd,{height:.6});
   if(i%3===0&&gd>1.4)kit.smallBuilding('shed',xx+.25,north?lane-1.1:lane+1.15,.85,.8,{h:1.2});
   kit.bin(xx+.2,north?y+d+.2:y-.45);
  }
  // Garages occupy side plots, not the street or rear access lane.
  if(i===1||i===3||i===5)kit.smallBuilding('garage',a.x+a.bw+.6,top+1.0,1.5,2.0,{h:1.6});
  else queueTree(a.x+a.bw+1.7,top+4.0,.55);
  kit.shrubs(a.x+a.bw+1.0,bottom-1.0,1.0,.4);gardenTrees.push([a.x+a.w*.55,lane+2.2,.7,7.2]);
 }
 passage(name+' rear access',68.4,lane,48.3,.9);
 // Houses turn to face Railway Approach at the district's end.
 returnHomes(name+' eastern corner homes',118.0,[top+1.0,top+4.9,bottom-4.2],{theme:1});
 passage(name+' side access',116.65,top,.8,bottom-top);
}
villaDistrict('Upper Eastgate villas',-32.3,-15.2);
villaDistrict('Highfield Eastgate villas',-9.2,3.7);
passage('Central residential service lane',3.0,-13.3,59.9,1.1);
// Continue the residential mass into the distance, beyond the close stadium frame.
for(const [x,n,theme] of [[-40,7,0],[-15.7,5,2],[4.1,23,1]])
 terraceBlock('Northern residential continuation',x,-58.7,n,-37.2,theme);
terraceBlock('North Eastgate older terraces',68.3,-58.7,12,-39.2,2);
plot(100.0,-58.0,21.0,18.8,'url(#paving)');
kits[0].building('flats',101.0,-57.0,7.8,6.0,{height:8.5});
kits[1].building('gable',112.4,-54.8,4.4,4.1,{axis:'y',height:5.8});
kits[2].building('shop',101.2,-43.5,4.5,3.3,{height:5.0,sign:'STORES'});
k.building('workshop',107.1,-44.0,7.8,4.2,{height:3.6});
k.smallBuilding('garage',116.3,-43.3,3.7,2.6,{h:1.7});
// West residential lanes have long garden backs and fewer junctions.
function sideHomes(name,x,y,n,theme=0){
 blocks.push({name,type:'continuous housing with rear gardens',x,y,w:15.4,d:n*3.1});
 for(let i=0;i<n;i++){
  const yy=y+i*3.1,kit=kits[(i%5===0?(theme+1)%3:theme)];
  kit.building('house',x+11,yy,3.5,2.6,{axis:'y',height:i%4===2?3.9:4.5});
  kit.building('house',x+.4,yy,3.2,2.6,{axis:'y',height:4.2});
  plot(x+3.8,yy,7,2.8,'url(#grass'+(i%4===1?'Light':'')+')');
  ground.push(rect(x+9.9,yy,.9,2.6,'url(#paving)'));
  fence(kit,x+3.7,yy,7.1,0);if(i%2===0)kit.smallBuilding('shed',x+5.1,yy+.5,1.1,1);
  kit.bin(x+9.4,yy+.25);if(i%2===0)gardenTrees.push([x+7,yy+1.4,.75,7.4]);
 }
}
sideHomes('Ground Lane northern frontage',-17,10.6,5,1);
// A mixed edge: individual homes share the street with a small working yard.
blocks.push({name:'Ground Lane mixed housing and yard',type:'houses workshop and service access',x:-17,y:34.4,w:14.5,d:15.7});
plot(-17,34.4,14.5,15.7,'url(#grass)');
kits[1].building('gable',-16.3,34.8,3.5,3.5,{axis:'y',height:4.8});
kits[2].building('house',-6.0,34.5,3.5,3.1,{axis:'y',height:4.3});
plot(-16.5,39.6,13.9,5.2,'url(#gravel)');
k.building('workshop',-16.0,40.2,6.8,4.3,{axis:'y',height:3.6});
k.van(-8.5,41.6,{colour:'#aaa89b'});
ground.push(rect(-3.2,40.0,3.2,2.0,'url(#asphalt)'));
driveways.push({name:'Ground Lane repair yard entrance',x:-3.2,y:40,w:3.2,d:2.0});
kits[0].building('gable',-6.8,45.5,4.0,3.6,{axis:'y',height:5.6});
k.smallBuilding('garage',-16.0,46.4,3.5,2.1,{h:1.8});
fence(k,-17,38.8,7.6,0,{height:.65});
fence(k,-17,45.1,7.6,0,{height:.65});
sideHomes('Mill Lane northern frontage',-40,10.6,5,2);
// A school occupies an unequal compound rather than another identical housing row.
blocks.push({name:'Mill Lane school and playground',type:'school wings and play yard',x:-40,y:31.0,w:17,d:19});
plot(-40,31,17,19,'url(#paving)');
kits[2].building('school',-39,32,9.0,5.0,{height:4.9});
kits[2].building('school',-39,38.0,5.0,8.0,{axis:'y',height:4.1});
plot(-32.5,39,8.7,9.8,'url(#asphalt)');
ground.push(rect(-36,29.6,2.8,2,'url(#paving)'));
driveways.push({name:'School entry from Mill Street',x:-36,y:29.6,w:2.8,d:2});
for(const y of [41,43.4,45.8])ground.push(line([[-31.5,y,.02],[-24.9,y,.02]],'#d8ce9e',.6));
fence(k,-40,49.9,17,0,{height:.85});
fence(k,-23.05,31.0,0,18.9,{height:.85});
// The commercial district is one substantial frontage across Station Road.
blocks.push({name:'Station Road larger-building frontage',type:'shops tenements pub and service yards',x:4,y:57,w:117,d:10});
const frontage=[
 [4.2,7,5.5,'flats',8.3,0],[12.4,6,4.4,'shop',6.4,2],
 [19.5,6.4,5.0,'flats',9.4,1],
 [68.5,7.5,4.9,'shop',6.0,1],
 [88.2,6.1,4.6,'shop',6.8,0],[95.4,8.5,5.1,'flats',8.2,1]
];
for(let i=0;i<frontage.length;i++){
 const [x,w,d,kind,h,theme]=frontage[i],y=57+[.1,.65,.2,.35,.9,.15][i%6];
 plot(x-.25,56.6,w+.5,9.1,'url(#paving)');
 kits[theme].building(kind,x,y,w,d,{front:'north',height:h,variant:i});
 ground.push(rect(x+.15,y+d+.3,w-.3,2.3,i%3===0?'url(#gravel)':'url(#asphalt)'));
 if(i%4===1)k.van(x+.7,y+d+.65,{colour:'#c1bd9e'});
 else if(i%3===0)k.car(x+1,y+d+.65,{colour:'#455c66'});
 fence(k,x-.15,65.5,w+.3,0,{brick:true,height:.65});
}
// A short residential group interrupts the larger commercial frontage.
blocks.push({name:'Station Road surviving terrace',type:'homes between shops and flats',x:77.1,y:56.6,w:10.0,d:9});
plot(77.1,56.6,10.0,9,'url(#grass)');
for(let i=0;i<4;i++){
 const xx=77.4+i*2.45;
 kits[2].terrace(xx,57.3,{front:'north',first:i===0,last:i===3,height:4.65});
 fence(k,xx,60.6,0,4.7,{height:.6});
 if(i%2===0)k.smallBuilding('shed',xx+.3,63.7,.85,.85,{h:1.2});
 kits[2].bin(xx+1.7,61.0);
}
// An L-shaped shopping centre takes several ordinary plots, with its own
// forecourt, customer parking, delivery apron and a smaller side shop.
blocks.push({name:'Station shopping centre',type:'large stepped retail site',x:28,y:56.6,w:33.5,d:32});
plot(28,56.6,33.5,20.9,'url(#paving)');plot(28,77.5,24.4,10.5,'url(#asphalt)');
plot(52.4,77.5,9.1,6.5,'url(#paving)');
kits[1].building('retail',32.1,62,19.6,10.0,{height:4.2,sign:'HIGHFIELD CENTRE'});
kits[0].building('retail',52.7,62,7.9,14.8,{height:3.7});
kits[2].building('shop',53.2,79,6.8,4.0,{height:3.2,sign:'CAFE'});
ground.push(rect(28,55.2,3.1,24.1,'url(#asphalt)'),rect(32.1,56.6,28.5,4.4,'url(#asphalt)'));
driveways.push({name:'Shopping centre entry from Station Road',x:28,y:55.2,w:3.1,d:24.1});
k.van(54.8,58,{colour:'#c4c3ad'});
for(const y of [78.5,84.2])for(let i=0;i<8;i++){
 const x=33.0+i*2.2;ground.push(line([[x,y,.02],[x,y+2.8,.02]],'#d8d5c1',.6));
 if(i%3!==1)k.car(x+.4,y+.55,{axis:'y',colour:['#647881','#bfbdb0','#8b4740'][i%3]});
}
groundUses.push({name:'Shopping centre parking',x:28,y:77.5,w:24.4,d:10.5});
plot(53.0,84.2,8.5,4.6,'url(#grassLight)');
// One planted corner belongs to the retail site, not a repeated street strip.
queueTree(57.4,86.5,.9,{height:5.2,tone:1});
// A taller end building and small courtyard terminate the eastern frontage.
plot(105.3,57.0,15.8,10.4,'url(#paving)');
kits[0].building('flats',106.0,58.0,9.8,6.1,{height:15.8});
k.smallBuilding('garage',117.2,58.4,2.7,4.2,{h:2.0});
// A small western parade belongs to the same street rather than a separate cell.
for(let i=0;i<4;i++)kits[i%3].building('shop',-15.5+i*3.2,57,2.9,4.2,{height:5.2+i%2,sign:['NEWS','BAKERY','GROCER','CAFE'][i]});
k.cornerPub(-38.8,57,6.3,5.1);kits[2].building('flats',-30.9,57,7.5,5.7,{height:8});
// The lower edge has short terraces, detached homes and a larger community hall.
for(const [x,n,theme] of [[-40,7,2],[-15.7,5,0],[4.1,8,1]])
 terraceBlock('West Park Road short residential edge',x,95.9,n,105.9,theme);
plot(26.0,95.8,35.4,10.8,'url(#grass)');
kits[1].building('semi',27.2,96.3,5.3,3.4,{height:4.7});
kits[2].building('gable',35.4,96.8,4.0,3.5,{axis:'y',height:5.1});
k.smallBuilding('garage',40.3,96.6,2.5,2.1,{h:1.8});
kits[0].building('hall',47.0,98.0,13.1,6.0,{height:6.5});
plot(45.8,96.0,15.3,1.3,'url(#paving)');
fence(k,26,102.1,16.5,0,{height:.65});
for(const [x,n,theme] of [[69,8,1],[97.0,8,0]]){
 cottageRow('East Park Road cottages',x,103.2,n,{garden:2.1,theme,step:2.7,d:2.9});
 for(let i=0;i<3;i++)kits[(theme+i)%3].building('semi',x+i*7.4,98.1,5.0,2.6,{height:4.4+i*.3});
}
// Ground-only stadium forecourts occupy strips around the current stand envelope.
const current={x:20-depths.W,y:20-depths.N,w:32+depths.W+depths.E,d:20+depths.N+depths.S};
// Separate hardstanding patches follow the stands and exposed corners.
// Ground surfaces may occupy the reserve; permanent scenery still may not.
const access=[
 {name:'north entrance apron',x:20,y:8.6,w:32,d:current.y-8.6},
 {name:'south entrance apron',x:20,y:current.y+current.d,w:32,d:51.4-current.y-current.d},
 {name:'west rear walkway',x:3.0,y:20,w:current.x-3.0,d:20},
 {name:'east rear walkway',x:current.x+current.w,y:20,w:62.9-current.x-current.w,d:20},
 {name:'northwest corner forecourt',x:3,y:8.6,w:17,d:11.4},
 {name:'northeast corner forecourt',x:52,y:8.6,w:10.9,d:11.4},
 {name:'southwest corner forecourt',x:3,y:40,w:17,d:11.4},
 {name:'southeast corner forecourt',x:52,y:40,w:10.9,d:11.4}
];
for(const [i,a] of access.entries()){
 ground.push(rect(a.x,a.y,a.w,a.d,i===4||i===7?'url(#asphalt)':'url(#paving)'));
 if(i>=4)for(let xx=a.x+.8;xx<a.x+a.w;xx+=2.2)ground.push(line([[xx,a.y+.2,.01],[xx,a.y+a.d-.2,.01]],'#9c9f94',.35));
}
groundUses.push(...access);
const forecourtDetails=[
 {name:'west service surface',x:3.8,y:41.0,w:9.4,d:3.4,fill:'#8f9189'},
 {name:'west entrance repairs',x:13.8,y:46.0,w:5.1,d:3.0,fill:'#aaa99a'},
 {name:'east entrance resurfacing',x:53.2,y:42.0,w:7.9,d:6.2,fill:'#717871'},
 {name:'north service bay',x:4.5,y:10.0,w:3.2,d:5.7,fill:'#727873'}
];
for(const f of forecourtDetails){
 ground.push(poly([[f.x,f.y],[f.x+f.w*.82,f.y],[f.x+f.w,f.y+.8],[f.x+f.w,f.y+f.d],[f.x+.5,f.y+f.d],[f.x,f.y+f.d*.6]],f.fill,'fill-opacity=".5"'));
}
// Ground markings distinguish service access and turnstile approaches.
for(const x of [4.8,7.3])ground.push(line([[x,10.4,.02],[x,15.3,.02]],'#b8b39a',.7));
for(const [x,y,w] of [[21.5,50.0,7],[34.5,50.0,5],[46.0,50.0,4]])ground.push(rect(x,y,w,.25,'#c6bfb0'));

// One large stadium car park with an industrial edge, rather than two small cells.
plot(68.5,10.0,53.0,39.6,'url(#asphalt)');
blocks.push({name:'Eastgate parking and works district',type:'large parking area and industrial frontage',x:68.5,y:10,w:53,d:39.6});
groundUses.push({name:'Eastgate matchday car park',x:68.5,y:10,w:53,d:39.6});
// Entry meets Highfield Road; wide aisles connect all bay runs inside the site.
ground.push(rect(93.5,8,3.2,9,'url(#asphalt)'));
driveways.push({name:'Car park entry from Highfield Road',x:93.5,y:8,w:3.2,d:9});
for(const y of [18.0,29.0,40.0])for(let i=0;i<24;i++){
 const x=69.5+i*2.1;
 ground.push(line([[x,y,.02],[x,y+3.2,.02]],'#d7d2bc',.65));
 if(i%5!==0&&!(y===18&&i>10&&i<14))k.car(x+.45,y+.55,{axis:'y',colour:['#b8c0b8','#8b3434','#c9c1a4','#2e4c65','#c7c7b8','#5b6859'][i%6]});
}
for(const y of [18,29,40])ground.push(line([[69.5,y+3.2,.02],[120,y+3.2,.02]],'#d7d2bc',.55));
k.building('warehouse',69.5,10.8,12,5.0,{height:4.0});
k.building('workshop',83,10.8,8.5,4.7,{height:3.5});
k.building('warehouse',98.5,10.8,13.8,5.0,{height:4.6});
k.smallBuilding('garage',114,10.8,6.2,4.0,{h:2.2});
k.van(85,16.3,{colour:'#bfbda6'});
fence(k,68.5,49.6,53,0,{height:.75});
fence(k,121.5,10,0,39.6,{height:.75});
// Railway and stream continue beyond the crop, giving the town a wider setting.
ground.push(rect(128,-70,4.5,215,'url(#gravel)'));record('rail-corridor',128,-70,4.5,215);
for(const x of [129.2,131.0])ground.push(line([[x,-70,.02],[x,145,.02]],'#4b504c',1));for(let y=-69;y<145;y+=.65)ground.push(line([[128.6,y,.01],[131.6,y,.01]],'#716653',1.2));
const stream=[[-68,-43],[-34,-43],[-34,-40],[-5,-40],[-5,-45],[29,-45],[29,-49],[96,-49],[96,-45],[126,-45]];ground.push(line(stream,'#677f3d',6),line(stream,'#467f98',3.1));
// Two short bridges carry the continuing streets over the stream.
for(const [x,y,w] of [[0,-45,2.4],[63.5,-49,2.8]]){ground.push(rect(x-.6,y-1.0,w+1.2,2.0,'url(#paving)'),rect(x,y-1.0,w,2.0,'url(#asphalt)'));ground.push(line([[x-.3,y-1,0],[x-.3,y+1,0]],'#d5d2bb',.8),line([[x+w+.3,y-1,0],[x+w+.3,y+1,0]],'#d5d2bb',.8));}
// Street furniture stays beside the main frontages.
for(const [x,y,axis,c] of [[-11,5.2,'x','#923e33'],[28,5.2,'x','#b4b4a4'],[42,54,'x','#355568'],[5,52.3,'x','#a8b6b2'],[64,21,'y','#773e34'],[.3,38,'y','#9ca793'],[124,45,'y','#d0c9b7']])k.car(x,y,{axis,colour:c});
k.streetFurniture('phone-box',60.6,55.5);k.streetFurniture('bus-stop',25.2,55.5);
for(const x of [-14,6,19,29,43,56,71,86,103,116])for(const y of [4.45,55.25]){const f={x,y,w:.48,d:.48};if(!roads.some(r=>overlap(f,r))&&!driveways.some(r=>overlap(f,r)))k.streetFurniture('lamp',x,y);}
const allBounds=()=>kits.flatMap((kit,j)=>kit.bounds.map(b=>({...b,id:j+':'+b.id,parent:b.parent?j+':'+b.parent:null})));
let seed=1998;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
// Canopies overlap in woods; every canopy still clears all streets and buildings.
function woods(name,x,y,w,d,n){groundUses.push({name,x,y,w,d});for(let i=0;i<n;i++){const tx=x+1.5+random()*(w-3),ty=y+1.5+random()*(d-3),r=.85+random()*.65,f={x:tx-r-.3,y:ty-r-.3,w:2*(r+.3),d:2*(r+.3)};if(overlap(f,reserve)||roads.some(a=>overlap(f,a.full))||passages.some(a=>overlap(f,a))||driveways.some(a=>overlap(f,a))||allBounds().some(a=>a.kind!=='tree'&&overlap(f,a))||allBounds().some(a=>a.kind==='tree'&&Math.hypot(tx-(a.x+a.w/2),ty-(a.y+a.d/2))<1.2))continue;queueTree(tx,ty,r,{height:4.8+random()*3.0,tone:Math.floor(random()*3)});}}
// Unequal park spaces: open lawn, a shaded grove, garden paths and a small kiosk.
plot(4,67,22.5,21.7,'url(#grassLight)');
groundUses.push({name:'Station pocket park',x:4,y:67,w:22.5,d:21.7});
for(const [x,y,w,d] of [[4,71.2,8.4,1],[11.4,71.2,1,11.8],[11.4,82,15.1,1]])passage('Pocket park walk',x,y,w,d);
kits[1].building('shop',17.0,84.0,4.7,3.7,{height:2.8,sign:'PARK KIOSK'});
woods('Pocket park shaded corner',4.4,74.0,6.0,14,13);
woods('Pocket park northern group',15.0,67.4,10.5,10.0,14);
// The eastern park is deeper at one end and is not three parallel tree rows.
plot(68.0,66.5,36.5,25.4,'url(#grassDark)');plot(104.5,69.0,17.0,22.9,'url(#grass)');
groundUses.push({name:'East Station park and open lawn',x:68,y:66.5,w:53.5,d:25.4});
for(const [x,y,w,d] of [[68,72,12.0,1.1],[78.9,72,1.1,13.6],[78.9,84.5,28.1,1.1],[105.9,76.8,1.1,15.1]])passage('East park walk',x,y,w,d);
woods('East park northwest grove',68.3,66.7,9.6,22,20);
woods('East park northern grove',83.0,67.0,21,10.0,32);
woods('East park eastern grove',110.0,71.0,11.2,19.8,24);
woods('East park southern small group',84,87,18,4.6,9);
// A few isolated trees leave the central lawn open.
for(const [x,y,r,h] of [[88.5,80.4,.8,5.4],[97.8,80.0,1.1,7.1],[102.7,78.8,.7,4.7]])queueTree(x,y,r,{height:h,tone:1});
plot(-40,67,37,21.7,'url(#grass)');
passage('West neighbourhood green walk',-39,79.5,35,1.0);
woods('West green mature grove',-39,67.3,16.0,10.8,22);
woods('West green southern grove',-23,82.3,19,6.1,16);
woods('West woodland edge',-64,-9,20,112,190);
woods('Northern stream belt',-50,-52,173,15,160);
woods('Railway woodland',134,9,13,116,125);
for(const [x,y,r,options] of [...gardenTrees.map(([x,y,r,h])=>[x,y,r,{height:h,tone:Math.abs(Math.round(x+y))%3}]),...queuedTrees]){
 const det=east[0]*south[1]-south[0]*east[1],rx=r*(east[0]-south[0]),ry=rx*.8,bx=Math.max(r+.3,Math.hypot(south[1]*rx,south[0]*ry)/Math.abs(det)),by=Math.max(r+.3,Math.hypot(east[1]*rx,east[0]*ry)/Math.abs(det)),f={x:x-bx,y:y-by,w:bx*2,d:by*2};
 if(overlap(f,reserve)||roads.some(a=>overlap(f,a.full))||passages.some(a=>overlap(f,a))||driveways.some(a=>overlap(f,a))||allBounds().some(a=>a.kind==='tree'?Math.hypot(x-a.x-a.w/2,y-a.y-a.d/2)<1.3:overlap(f,a)))continue;
 k.tree(x,y,r,options);
}
const bounds=allBounds(),permanent=bounds.filter(a=>a.kind!=='car');
for(const f of [...bounds,...decor,...roads.map(a=>a.full)])if(overlap(f,reserve))throw Error('Reserve intrusion '+JSON.stringify(f));
for(const f of decor.filter(a=>a.kind!=='rail-corridor'))for(const r of roads)if(overlap(f,r))throw Error('Decor asphalt intrusion '+JSON.stringify(f)+' '+r.name);
for(const f of permanent)for(const r of roads)if(overlap(f,f.pavement?r:r.full))throw Error('Road asset overlap '+JSON.stringify(f)+' '+r.name);
let attachments=0,canopyOverlaps=0;for(let i=0;i<permanent.length;i++)for(let j=i+1;j<permanent.length;j++){const a=permanent[i],b=permanent[j];if(overlap(a,b)){if(a.kind==='tree'&&b.kind==='tree'){canopyOverlaps++;continue;}if(a.parent===b.id||b.parent===a.id){attachments++;continue;}throw Error('Asset collision '+JSON.stringify([a,b]));}}
for(const path of passages)for(const f of permanent)if(overlap(path,f))throw Error('Blocked passage '+JSON.stringify(f)+' '+path.name);
for(const drive of driveways)for(const f of permanent)if(overlap(drive,f))throw Error('Blocked driveway '+JSON.stringify(f));
for(const b of bounds)counts[b.kind]=(counts[b.kind]||0)+1;
const raw=sceneSvg(club,'aberdeen',false,false,true),stadiumFrame=raw.match(/data-title-frame="([^"]+)"/)[1].split(' ').map(Number);
const stadium=raw.replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'').replace(/<image\b[^>]*\/>/g,'');
const objects=kits.flatMap(a=>a.objects);objects.push({depth:66,svg:`<g id="actual-stadium">${stadium}</g>`});objects.sort((a,b)=>a.depth-b.depth);
const outline=rect(reserve.x,reserve.y,reserve.w,reserve.d,'#ffda4f').replace('/>','fill-opacity=".12" stroke="#ffda4f" stroke-width="2"/>');
const body=ground.join('')+objects.map(o=>o.svg).join('')+`<g id="reserve" style="display:none">${outline}</g>`;
const frames={overview:{box:'-660 -175 3100 2070',width:1550,height:1035},landscape:{box:'-40 140 1830 1220',width:1464,height:976},portrait:{box:'365 -100 1060 1550',width:848,height:1240},detail:{box:'-100 720 1570 900',width:1413,height:810}};
const svg=f=>`<svg xmlns="http://www.w3.org/2000/svg" width="${f.width}" height="${f.height}" viewBox="${f.box}" preserveAspectRatio="xMidYMid meet"><defs>${defs}</defs>${body}</svg>`;
for(const [name,f] of Object.entries(frames)){const s=svg(f);fs.writeFileSync(new URL(`highfield-${name}.svg`,out),s);await sharp(Buffer.from(s)).flatten({background:'#60862e'}).jpeg({quality:95}).toFile(new URL(`highfield-${name}.jpg`,out).pathname);}
await sharp(Buffer.from(svg(frames.landscape).replace('id="reserve" style="display:none"','id="reserve"'))).jpeg({quality:94}).toFile(new URL('clearance-review.jpg',out).pathname);
const manifest={club:club.name,projection:{origin,east,south,zStep},reserve,oldReserve,currentDepths:depths,currentEnvelope:current,growthAllowance,clearance,areaReduction:1-reserve.w*reserve.d/(oldReserve.w*oldReserve.d),roads,blocks,bounds,decor,access,groundUses,driveways,passages,forecourtDetails,counts,attachments,canopyOverlaps,stadiumFrame,frames};
fs.writeFileSync(new URL('scene-layout.json',out),JSON.stringify(manifest,null,2));
const html=`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Clubline — Highfield neighbourhood study 8</title><style>body{margin:0;background:#102637;color:#eef0db;font:14px system-ui}header{padding:8px 10px}h1{font-size:17px;margin:0 0 5px}button{font-size:12px;padding:7px;margin:2px;color:#eef0db;background:#254942;border:1px solid #839995}#scene{height:calc(100dvh - 100px);min-height:200px}svg{height:100%;width:100%;display:block}</style><header><h1>CLUBLINE 99 — Highfield neighbourhood study 8</h1><button onclick="frame('portrait')">Portrait</button><button onclick="frame('landscape')">Landscape</button><button onclick="frame('overview')">Wider town</button><button onclick="frame('detail')">Street detail</button><button onclick="automatic=true;adapt()">Auto</button><button onclick="const r=document.getElementById('reserve');r.style.display=r.style.display==='none'?'':'none'">Clearance</button></header><div id="scene">${svg(frames.landscape)}</div><script>const frames=${JSON.stringify(frames)};let automatic=true;function frame(k){automatic=false;document.querySelector('#scene svg').setAttribute('viewBox',frames[k].box)}function adapt(){if(automatic){if(innerWidth>innerHeight){const el=document.getElementById('scene'),ratio=el.clientWidth/el.clientHeight,h=790,w=Math.max(1440,h*ratio);document.querySelector('#scene svg').setAttribute('viewBox',(870-w/2)+' '+(620-h/2)+' '+w+' '+h)}else frame('portrait');automatic=true}}addEventListener('resize',adapt);adapt();</script>`;
fs.writeFileSync(new URL('CLUBLINE-Highfield-Neighbourhood-Study-8.html',out),html);
console.log(JSON.stringify({counts,blocks:blocks.length,roads:roads.length,reserve,areaReduction:manifest.areaReduction,canopyOverlaps}));
