import assert from 'node:assert/strict';import fs from 'node:fs';
import {sceneSvg} from '../scene.js';import {SITES} from '../sites.js';import {defaultLayout,SECTIONS,STANDS} from '../stadium-model.js';import {groundsStand} from '../grounds-geometry.js';
const clubs=JSON.parse(fs.readFileSync(new URL('../data/league.json',import.meta.url))).clubs;
for(const c of clubs)for(const site of SITES){const svg=sceneSvg(c,site,true,false,'match',null,null,{phase:'live',ambient:true,homeCount:11,awayCount:11});assert(!/NaN|undefined/.test(svg));assert.equal((svg.match(/data-player-route=/g)||[]).length,22);assert(svg.indexOf('data-section="N8"')<svg.indexOf('visible-match-ball'));assert(svg.indexOf('data-section="S1"')>svg.indexOf('visible-match-ball'));}
for(const id of Object.keys(STANDS).filter(id=>id!=='empty')){const c=clubs[0],layout=defaultLayout(c);for(const s of SECTIONS)layout.sections[s.id]={stand:id,roof:'none',rear:'hospitality',finish:'metal'};const svg=sceneSvg(c,'town',false,false,true,layout);assert(!/NaN|undefined/.test(svg));assert.equal((svg.match(/data-section=/g)||[]).length,28);const spec=groundsStand(id);assert(spec.depth>=Math.max(...spec.tiers.map(t=>t.startV+t.rows*t.rowPitch)));}
for(const id of Object.keys(STANDS).filter(id=>id!=='empty')){const c=clubs[0],layout=defaultLayout(c),spec=groundsStand(id);assert(spec.depth>0,'Positive engine footprint: '+id);for(const roof of ['full','truss','cantilever','continuous']){for(const section of SECTIONS)layout.sections[section.id]={stand:id,roof: id==='grass'?'none':roof,rear:'hospitality',finish:'metal'};assert(!/NaN|undefined|Infinity/.test(sceneSvg(c,'town',true,false,'match',layout)),'All roof types: '+id+' '+roof)}}
console.log('Twelve layouts across '+SITES.length+' maps, pitch occlusion order, finite geometry, figure counts and all stand families passed');

assert.equal(groundsStand('t1').tiers[0].rowPitch,.53,'Approved setback spacing must not be compressed');
assert(groundsStand('t1').depth>14,'Triple setback requires its actual deeper plot');
for(const c of clubs){const svg=sceneSvg(c,'town');assert(!svg.includes('Open corner access apron'),'No detached open-corner platform');}

// A chosen corner keeps its own mesh when neighbouring tiers change.
const independentCorner=layout=>sceneSvg(clubs[0],'town',false,false,false,layout).match(/<g data-section="NW"[^>]*>[\s\S]*?<\/g>/)[0];
const one=defaultLayout(clubs[0]),two=defaultLayout(clubs[0]);
for(const layout of [one,two])layout.sections.NW={stand:'d1',roof:'truss',rear:'concourse',finish:'metal'};
one.sections.N1.stand='t1';one.sections.W1.stand='d6';
two.sections.N1.stand='s1';two.sections.W1.stand='s2';
assert.equal(independentCorner(one),independentCorner(two),'Corner mesh must not morph to neighbours');
assert(sceneSvg(clubs[1],'town').includes('data-structure="rear-return"'),'Exposed rear concourses must have closed returns');
console.log('Independent corner geometry and solid rear returns passed');
