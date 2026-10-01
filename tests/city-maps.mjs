import assert from 'node:assert/strict';import fs from 'node:fs';import {SITES} from '../sites.js';import {sceneSvg} from '../scene.js';import {groundsStand} from '../grounds-geometry.js';import {STANDS,defaultLayout,SECTIONS} from '../stadium-model.js';
const club=JSON.parse(fs.readFileSync(new URL('../data/league.json',import.meta.url))).clubs[0],cities=SITES.filter(s=>s.plot);assert.equal(cities.length,6);assert.equal(SITES.length,6);
const depth=Math.max(...Object.keys(STANDS).map(id=>groundsStand(id)?.depth||0));assert(depth<=14.79+1e-6,'Measured maximum stand depth');
const bounds=[[2.21,2.21],[69.79,2.21],[69.79,57.79],[2.21,57.79]];
function inside(p,poly){return poly.every((a,i)=>{const b=poly[(i+1)%4];return ((b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]))/Math.hypot(b[0]-a[0],b[1]-a[1])>=15})}
const layout=defaultLayout(club);for(const section of SECTIONS)layout.sections[section.id]={stand:'t1',roof:'continuous',rear:'hospitality',finish:'metal'};
for(const s of cities){assert(s.night);assert.equal(s.scale,cities[0].scale);assert(Math.abs(s.east[1]/s.east[0]-4.2/7.2)<1e-12);assert(Math.abs(s.south[1]/s.south[0]+4.2/7.35)<1e-12);for(const [x,y] of bounds)assert(inside([s.origin[0]+(x-36)*s.east[0]+(y-30)*s.south[0],s.origin[1]+(x-36)*s.east[1]+(y-30)*s.south[1]],s.plot),'Maximum ground clearance '+s.id);
for(const evening of [false,true]){const art=new URL('../assets/sites/'+s.art+'-'+(evening?'evening':'day')+'.webp',import.meta.url);assert(fs.statSync(art).size>10000);const svg=sceneSvg(club,s.id,true,evening,'match',layout,null,{phase:'live',ambient:true,homeCount:11,awayCount:11});assert(svg.includes(s.art+'-'+(evening?'evening':'day')+'.webp'));assert(!/NaN|undefined|Infinity/.test(svg));assert.equal((svg.match(/data-player-route=/g)||[]).length,22);}}
console.log('Six day/night city assets, fixed shared scale/axis directions, maximum clear plots and finite live overlays passed');
assert.deepEqual(SITES.map(s=>s.id),['aberdeen','liverpool','manchester','cardiff','dublin','birmingham']);
const welsh={...club,id:'C10'};for(const id of ['NW','NE','SW','SE'])assert.equal(defaultLayout(welsh).sections[id].stand,'s1','Welsh corners remain single-tier');
for(const s of SITES){assert.equal(s.background[2],0,'Background verticals stay upright');const normal=sceneSvg(club,s.id,false,false,true),max=sceneSvg(club,s.id,false,false,true,layout);const box=svg=>svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);assert(box(normal)[2]<box(max)[2],'Camera follows actual layout '+s.id);assert(normal.includes('preserveAspectRatio="xMidYMid meet"'));}
console.log('Only six city choices, single-tier Welsh corners, upright map correction and adaptive layout camera passed');

// Figure glyphs follow projection changes, preserving their size relative to stands.
for(const site of SITES){assert.equal(site.artWidth,1200);const k=(site.scale*830/site.artWidth)/0.6137143383204945;const svg=sceneSvg(club,site.id,true,false,'match',null,null,{phase:'live',ambient:true,homeCount:11,awayCount:11});assert(svg.includes('scale('+4*k+')'));assert(svg.includes('scale('+2.2*k+')'));assert(svg.includes('r="'+4.4*k+'"'));assert(svg.includes('<g transform="scale('+k+')"><g class="fan-body"'));}
console.log('Player, ball, pedestrian and supporter proportions preserved across all maps');

// Plot/apron edges are generated from the same two axes as every stand.
for(const site of SITES)for(const key of ['plot','apron']){const poly=site[key];for(let i=0;i<4;i++){const a=poly[i],b=poly[(i+1)%4],dx=b[0]-a[0],dy=b[1]-a[1],axis=i%2?site.south:site.east;assert(Math.abs(dx*axis[1]-dy*axis[0])<1e-8,site.id+' '+key+' edge '+i);}assert(Math.abs(poly[0][0]+poly[2][0]-poly[1][0]-poly[3][0])<1e-8);assert(Math.abs(poly[0][1]+poly[2][1]-poly[1][1]-poly[3][1])<1e-8);}
console.log('All four plot and apron edges exactly parallel to engine axes in every city');

for(const site of SITES){assert(Math.abs(site.scale-0.87*1.45)<1e-12);const svg=sceneSvg(club,site.id,false,false,'designer');assert(!svg.includes('data-engine-apron'));assert(svg.includes('data-stadium-ground="current-layout"'));assert(svg.includes('data-ground-section="N1"'));const view=svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number),close=sceneSvg(club,site.id,false,false,true).match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);assert(view[2]>close[2],'Designer includes city context');assert(Math.abs(view[2]/view[3]-1.28)<.001);}
console.log('Approved scale, ground beneath actual stands without whole-plot carpet, wider designer framing passed');

for(const site of SITES){const px=1100/site.artWidth,top=Math.max(site.background[5],site.background[5]+site.background[1]*site.artWidth)*px,bottom=(site.background[5]+site.background[3]*site.artHeight+Math.min(0,site.background[1]*site.artWidth))*px;for(const c of JSON.parse(fs.readFileSync(new URL('../data/league.json',import.meta.url))).clubs){const view=sceneSvg(c,site.id,false,false,'menu-mobile').match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);assert(view[0]>=-.11&&view[0]+view[2]<=1100.11);assert(view[1]>=top-.11&&view[1]+view[3]<=bottom+.11,'Title crop stays inside artwork '+site.id+' '+c.id);}}
console.log('All 72 club/location portrait title cameras stay within the city artwork');

// Empty and partially developed grounds do not paint the maximum upgrade plot.
const sparse=defaultLayout(club);for(const section of SECTIONS)sparse.sections[section.id]={stand:'empty',roof:'none',rear:'compact',finish:'metal'};
const ground=svg=>svg.match(/<g data-stadium-ground="current-layout">([\s\S]*?)<\/g>/)[1];
for(const site of SITES){assert.equal((ground(sceneSvg(club,site.id,false,false,'designer',sparse)).match(/<polygon/g)||[]).length,1);sparse.sections.N1={stand:'s1',roof:'none',rear:'concourse',finish:'metal'};let g=ground(sceneSvg(club,site.id,false,false,'designer',sparse));assert.equal((g.match(/<polygon/g)||[]).length,2);assert.equal((g.match(/data-ground-section=/g)||[]).length,1);assert(g.includes('data-ground-section="N1"'));sparse.sections.N1={stand:'empty',roof:'none',rear:'compact',finish:'metal'};}
console.log('Empty gaps stay unpainted; a single stand adds only its own ground polygon');
