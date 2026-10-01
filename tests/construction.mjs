import assert from 'node:assert/strict';import fs from 'node:fs';
import {defaultLayout,normaliseLayout,capacity,SECTIONS} from '../stadium-model.js';
import {constructionQuote,startConstruction,advanceConstruction,usableCapacity,closedSections} from '../construction.js';
import {sceneSvg} from '../scene.js';import {SITES} from '../sites.js';
const club=JSON.parse(fs.readFileSync(new URL('../data/league.json',import.meta.url))).clubs[0];
const career={clubId:club.id,date:'2026-08-13',balance:1e8,stadium:defaultLayout(club),news:[],schedule:[{date:'2026-08-15',fixtures:[{home:club.id,away:'C02',homeGoals:null}]},{date:'2026-08-22',fixtures:[{home:club.id,away:'C03',homeGoals:null}]}]};
const old=structuredClone(career.stadium),draft=normaliseLayout(old,club);draft.sections.N1={stand:'t2',roof:'continuous',rear:'hospitality',finish:'dark'};
const q=constructionQuote(career,club,draft);assert(q.days>=28);assert.equal(q.affected.length,2);assert(q.during<capacity(old,club));const money=career.balance;
assert.equal(startConstruction(career,club,draft),null);assert.equal(career.balance,money-q.cost);assert.deepEqual(career.stadium,old);assert.equal(closedSections(career).size,1);
assert(startConstruction(career,club,draft));const saved=JSON.parse(JSON.stringify(career));assert.equal(usableCapacity(saved,club),q.during);
career.date=new Date(Date.parse(q.opens+'T12:00:00Z')-86400000).toISOString().slice(0,10);assert.equal(advanceConstruction(career),0);assert.deepEqual(career.stadium,old);
for(const site of SITES){for(const team of [null,0,1]){const svg=sceneSvg(club,site,true,false,true,career.stadium,null,{phase:'live',ambient:true,scoringTeam:team,homeCount:10,awayCount:11},career.construction);assert(!/NaN|undefined/.test(svg));assert(svg.includes('closed for construction'));assert.equal((svg.match(/class="pitch-player home"/g)||[]).length,10);assert.equal((svg.match(/class="pitch-player away"/g)||[]).length,11);assert(svg.includes('visible-match-ball'));}}
const idle=sceneSvg(club,'town',false,false,true,old,null,{phase:'idle',ambient:true}),pre=sceneSvg(club,'town',false,false,true,old,null,{phase:'prematch',ambient:true}),live=sceneSvg(club,'town',true,false,true,old,null,{phase:'live',ambient:true});
const walkers=svg=>(svg.match(/class="stadium-walker"/g)||[]).length;assert(walkers(pre)>walkers(idle)*4);assert(walkers(live)<walkers(idle));assert(walkers(live)<=12);assert(!idle.includes('stand-fan'));assert(live.includes('stand-fan'));assert(pre.includes('matchday-stall'));assert(live.includes('matchday-stall'));

career.date=q.opens;assert.equal(advanceConstruction(career),1);assert.deepEqual(career.stadium.sections.N1,draft.sections.N1);assert.equal(usableCapacity(career,club),capacity(career.stadium,club));assert.equal(advanceConstruction(career),0);
const all=normaliseLayout(career.stadium,club);for(const s of SECTIONS)all.sections[s.id].finish=all.sections[s.id].finish==='dark'?'metal':'dark';assert.equal(constructionQuote(career,club,all).during,0);
const poor={...career,balance:0,construction:[]};assert(startConstruction(poor,club,all));assert.equal(poor.balance,0);
console.log('Construction quote, home-fixture disruption, closures, finance, save persistence, opening dates, zero-capacity works, seven-site animations and team counts passed');
