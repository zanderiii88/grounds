import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {SECTIONS,defaultLayout} from './stadium-model.js';
import {groundsStand} from './grounds-geometry.js';
const read=f=>fs.readFileSync(new URL(f,import.meta.url),'utf8');
const d=JSON.parse(read('./review/scene-layout.json'));
const overlap=(a,b)=>a.x<b.x+b.w-1e-6&&a.x+a.w>b.x+1e-6&&a.y<b.y+b.d-1e-6&&a.y+a.d>b.y+1e-6;
for(const f of [...d.bounds,...d.decor,...d.roads.map(r=>r.full)])assert(!overlap(f,d.reserve),'Reserve collision '+JSON.stringify(f));
for(const b of d.bounds.filter(b=>b.kind!=='car'))for(const r of d.roads)assert(!overlap(b,b.pavement?r:r.full),'Road/pavement intrusion');
for(const f of d.decor.filter(f=>f.kind!=='rail-corridor'))for(const r of d.roads)assert(!overlap(f,r),'Decor covers asphalt');
for(const apron of d.access){assert(!overlap(apron,{x:20,y:20,w:32,d:20}),'Hardstanding covers pitch');for(const road of d.roads)assert(!overlap(apron,road),'Forecourt covers asphalt road');}
for(const f of d.forecourtDetails)assert(d.access.some(a=>f.x>=a.x&&f.y>=a.y&&f.x+f.w<=a.x+a.w&&f.y+f.d<=a.y+a.d),'Forecourt detail outside hardstanding');
const fixed=d.bounds.filter(b=>b.kind!=='car');for(let i=0;i<fixed.length;i++)for(let j=i+1;j<fixed.length;j++){const a=fixed[i],b=fixed[j];assert(!overlap(a,b)||a.parent===b.id||b.parent===a.id||(a.kind==='tree'&&b.kind==='tree'),'Solid overlap');}
for(const path of d.passages)for(const b of fixed)assert(!overlap(path,b),'Blocked residential passage');
for(const drive of d.driveways){
 assert(d.roads.some(r=>((drive.x<r.x+r.w&&drive.x+drive.w>r.x)&&(Math.abs(drive.y-(r.y+r.d))<1e-6||Math.abs(drive.y+drive.d-r.y)<1e-6))||((drive.y<r.y+r.d&&drive.y+drive.d>r.y)&&(Math.abs(drive.x-(r.x+r.w))<1e-6||Math.abs(drive.x+drive.w-r.x)<1e-6))),'Driveway must meet street');
 for(const b of fixed)assert(!overlap(drive,b),'Blocked driveway');
}
// Verify asphalt connectivity, rather than merely adjoining pavements.
const seen=new Set([0]);let size=-1;while(size!==seen.size){size=seen.size;for(let i=0;i<d.roads.length;i++)if(!seen.has(i)&&[...seen].some(j=>overlap(d.roads[i],d.roads[j])))seen.add(i);}
assert.equal(seen.size,d.roads.length);
const club=JSON.parse(read('./data/league.json')).clubs[0],layout=defaultLayout(club);
for(const side of ['N','S','W','E']){
 const expected=Math.max(...SECTIONS.filter(s=>s.side===side).map(s=>{const c=layout.sections[s.id];return (groundsStand(c.stand)?.roofRearV||0)+({compact:0,concourse:1.2,amenities:2,hospitality:2.6}[c.rear]||0);}));
 assert.equal(d.currentDepths[side],expected);
}
assert.equal(d.growthAllowance,1);assert.equal(d.clearance,.8);
assert.ok(d.areaReduction>.38&&d.areaReduction<.39);
assert.ok(d.currentEnvelope.x>=d.reserve.x&&d.currentEnvelope.y>=d.reserve.y);
assert.ok(d.currentEnvelope.x+d.currentEnvelope.w<=d.reserve.x+d.reserve.w);
assert.ok(d.currentEnvelope.y+d.currentEnvelope.d<=d.reserve.y+d.reserve.d);
const trees=d.bounds.filter(a=>a.kind==='tree');for(let i=0;i<trees.length;i++)for(let j=i+1;j<trees.length;j++){const a=trees[i],b=trees[j];assert(Math.hypot(a.x+a.w/2-b.x-b.w/2,a.y+a.d/2-b.y-b.d/2)>=1.2-1e-6,'Tree trunk spacing');}
const probes=[{x:d.reserve.x-3,y:20,w:4,d:4},{x:20,y:d.reserve.y-3,w:4,d:4},{x:d.reserve.x+d.reserve.w-.2,y:20,w:4,d:4}];for(const p of probes)assert(overlap(p,d.reserve),'Full-width edge regression');
const nodes={scene:{clientWidth:844,clientHeight:285},'actual-stadium':{style:{display:''}},reserve:{style:{display:'none'}}};let view;
const ctx=vm.createContext({innerWidth:390,innerHeight:844,document:{querySelector:()=>({setAttribute:(key,value)=>view=value}),getElementById:id=>nodes[id]},addEventListener:()=>{}});
const html=read('./review/CLUBLINE-Highfield-Neighbourhood-Study-8.html');vm.runInContext(html.match(/<script>([\s\S]*)<\/script>/)[1],ctx);assert.equal(view,d.frames.portrait.box);
ctx.innerWidth=844;ctx.innerHeight=390;vm.runInContext('adapt()',ctx);const auto=view.split(' ').map(Number);assert.equal(auto[3],790);assert.ok(auto[2]>2000);assert.ok(auto[1]<310&&auto[1]+auto[3]>930);
for(const frame of Object.keys(d.frames)){vm.runInContext(`frame('${frame}')`,ctx);assert.equal(view,d.frames[frame].box);}
const click=label=>{const button=html.match(new RegExp('<button onclick="([^"]+)">'+label+'<\\/button>'));assert(button);vm.runInContext("(function(){"+button[1]+"})()",ctx);};
click('Clearance');assert.equal(nodes.reserve.style.display,'');click('Clearance');assert.equal(nodes.reserve.style.display,'none');click('Auto');assert.equal(view.split(' ').map(Number)[3],790);
assert.deepEqual(d.projection.east,[10.8,6.3]);assert.deepEqual(d.projection.south,[-11.025,6.3]);
console.log(JSON.stringify({result:'PASS',assets:d.bounds.length,connectedStreetSegments:seen.size,reserveAreaReduction:d.areaReduction,frames:Object.keys(d.frames),controls:'script harness; real browser not tested'}));
