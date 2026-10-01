import {playerValue,blankTransferFilters,searchLeaguePlayers} from './transfer-search.js?v=1.26.0';
import {pitchPlayers} from './stadium-life.js?v=1.26.0';
import {syncStadiumLife,disposeStadiumLife} from './match-life.js?v=1.26.0';
import {ensureMatchStats,recordPossession,recordShot,possessionPercent} from './match-stats.js?v=1.26.0';
import {constructionQuote,startConstruction,advanceConstruction,usableCapacity} from './construction.js?v=1.26.0';
import {SITES as SITE_CATALOGUE,SHOWCASE_SITES} from './sites.js?v=1.26.0';
import {initialiseDevelopment,promoteProspect,developmentDay,rolloverDevelopment,squadSpace,canRegister,youthLevel,estimatedStars} from './development.js?v=1.26.0';
import {sceneSvg,stadiumProfile} from './scene.js?v=1.26.0';
import {SECTIONS,STANDS,ROOFS,REARS,FINISHES,defaultLayout,normaliseLayout,capacity,changeCost} from './stadium-model.js?v=1.26.0';

const APP_VERSION='1.26.0';
const SAVE_KEY='clubline-career-r1';
const SITES=SITE_CATALOGUE.map(s=>[s.id,s.name,s.limit]);
const availableSites=c=>SITES.filter(([, ,limit])=>c.capacity<=limit);
const siteLimit=id=>SITES.find(([key])=>key===id)?.[2]||75000;
const firstMenuScene=Math.floor(Math.random()*(SHOWCASE_SITES.length*2));
let titleSceneIndex=firstMenuScene,titleSceneTimer=null;
const COLOURS=['#862e43','#de414b','#e17837','#e7bd63','#257b5e','#1b8189','#3a6cbc','#633d8d','#edf0e9','#252c38'];
const FORMATIONS={
 '4-3-3':[['LW','ST','RW'],['CM','DM','CM'],['LB','CB','CB','RB'],['GK']],
 '4-2-3-1':[['ST'],['LW','AM','RW'],['DM','DM'],['LB','CB','CB','RB'],['GK']],
 '4-4-2':[['ST','ST'],['LW','CM','CM','RW'],['LB','CB','CB','RB'],['GK']],
 '3-5-2':[['ST','ST'],['LB','CM','DM','CM','RB'],['CB','CB','CB'],['GK']],
 '4-1-4-1':[['ST'],['LW','CM','CM','RW'],['DM'],['LB','CB','CB','RB'],['GK']],
 '4-3-2-1':[['ST'],['AM','AM'],['CM','DM','CM'],['LB','CB','CB','RB'],['GK']],
 '3-4-3':[['LW','ST','RW'],['LB','CM','CM','RB'],['CB','CB','CB'],['GK']],
 '5-3-2':[['ST','ST'],['CM','DM','CM'],['LB','CB','CB','CB','RB'],['GK']],
 '4-1-2-1-2':[['ST','ST'],['AM'],['CM','CM'],['DM'],['LB','CB','CB','RB'],['GK']]
};
const STYLES=['Balanced','High press','Possession','Direct','Counter'];
const ORDERS=['Standard','Attack','Protect lead'];
const PLAYER_ORDERS=['Standard','Get forward','Hold position','Press more','Stay wide','Cut inside'];
const MOODS=[['😠','Very unhappy'],['🙁','Unhappy'],['😐','Okay'],['🙂','Happy'],['😄','Very happy']];
const html=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stars=(n,label)=>`<span class="stars" aria-label="${label}: ${n} of 5 stars">${'★'.repeat(n)}<span>${'☆'.repeat(5-n)}</span></span>`;
const fmtMoney=n=>'£'+Math.round(n||0).toLocaleString('en-GB');
const fmtDate=s=>new Date(s+'T12:00:00Z').toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
const addDays=(s,n)=>new Date(Date.parse(s+'T12:00:00Z')+86400000*n).toISOString().slice(0,10);
const rand=(arr)=>arr[Math.floor(Math.random()*arr.length)];
let lastScrollSection=null;
let dateFlashUntil=0,postMatchTable=false,benchExpanded=true,reservesExpanded=false,tickerTimer=null,tickerIndex=0;
let dragGhost=null,dragTarget=null,activeDrag=null,suppressDragClick=false,autoResumeTimer=null;
let editing=null,selectedStand='N4',selectedStands=new Set(['N4']),opponentOpen=false,instructionAnchorType='shirt-slot',fixtureCursor=null,reportIndex=null;
let saveWarning='',source,career=null,view='title',section='hub',sub='lineup',setup={clubId:'C01',site:'aberdeen',names:{},colour:null},selectedPlayer=null,selectedSlot=null,instructionPlayer=null,statsScope='club',statsSort='goals',statsDescending=true,match=null,timer=null,notice='',updateMessage='',availableVersion=null,checkingUpdate=false;
const root=document.getElementById('app');

try {source=await (await fetch('./data/league.json?v=1.26.0',{cache:'no-store'})).json();}
catch(error){root.innerHTML='<main class="app-shell"><div class="shell-content"><h1>Clubline</h1><p>Could not load the league data. Open the game through a web server or GitHub Pages.</p></div></main>';throw error;}
const originalLeague=structuredClone(source);
const ambitiousIds=new Set(source.clubs.map(c=>source.players.filter(p=>p.clubId===c.id).sort((a,b)=>a.overall-b.overall).slice(0,6).sort((a,b)=>b.potential-a.potential)[0]?.id));
const menuScenes=[false,true].flatMap(evening=>SHOWCASE_SITES.map((site,i)=>({club:source.clubs[(i+(evening?5:0))%source.clubs.length],site,evening}))); 
const menuFrame=i=>`<div class="scene menu-scene"><picture><source media="(max-width:850px) and (orientation:portrait)" srcset="assets/menu/scene-${i}-mobile.webp?v=${APP_VERSION}"><img src="assets/menu/scene-${i}-desktop.webp?v=${APP_VERSION}" alt="" decoding="async"></picture></div>`;
const club=id=>source.clubs.find(c=>c.id===id);
const player=id=>source.players.find(p=>p.id===id);
const owner=id=>career?.owners?.[id]||player(id)?.clubId;
const squadPlayers=id=>source.players.filter(p=>owner(p.id)===id&&!career?.players?.[p.id]?.retired&&!career?.players?.[p.id]?.unregistered);
const transferValue=playerValue;
let transferFilters=blankTransferFilters(),transferLimit=50;
const myClub=()=>club(career?.clubId||setup.clubId);
const clubName=id=>career?.names?.[id]||setup.names?.[id]||club(id)?.name||id;
const myColour=()=>career?.colour||setup.colour||myClub()?.colour||'#e5484f';
const playerFitness=id=>career?.players?.[id]?.fitness??player(id)?.fitness??80;
const ratingRole=p=>{const peers=squadPlayers(owner(p.id)).filter(x=>x.primary===p.primary||x.secondary===p.primary).sort((a,b)=>b.overall-a.overall);const index=peers.findIndex(x=>x.id===p.id);return index===0?'Starter':index<=2?'Rotation':'Fringe'};
const playerState=id=>career?.players?.[id]||{};
const moodLevel=id=>Math.max(0,Math.min(4,Math.floor((playerState(id).happiness??67)/20)));
const moodButton=(id)=>{if(!id)return '';const [face,label]=MOODS[moodLevel(id)];return `<button type="button" class="slot-tool mood mood-${moodLevel(id)}" data-action="player-happiness" data-player="${id}" title="${label}" aria-label="${html(player(id).name)}: ${label}">${face}</button>`};
const injuryLength=days=>days>=28?`${Math.ceil(days/30)}M`:`${Math.ceil(days/7)}W`;
const injuryBadge=id=>{const days=playerState(id).injuryDays||0;return days?`<span class="injury-badge" title="${html(playerState(id).injuryType||'Injury')} · ${days} days remaining"><span class="med-cross">✚</span>${injuryLength(days)}</span>`:''};
const INJURIES=[['Knock',2,5,0.43],['Muscle strain',6,14,0.32],['Ankle sprain',12,28,0.20],['Ligament injury',35,70,0.05]];
function applyInjury(id,context){
 const state=career.players[id],roll=Math.random();let acc=0,chosen=INJURIES.at(-1);
 for(const injury of INJURIES){acc+=injury[3];if(roll<acc){chosen=injury;break}}
 const recovery=career.medical?.recovery||0;
 state.injuryType=chosen[0];state.injuryDays=Math.max(1,Math.round((chosen[1]+Math.floor(Math.random()*(chosen[2]-chosen[1]+1)))*(1-recovery*.12)));
 career.news.push({date:career.date,text:`${context}: ${player(id).name} has a ${state.injuryType.toLowerCase()} and is expected out ${injuryLength(state.injuryDays)}.`});
}
const positionRatio=(p,pos)=>pos===p.primary?1:(p.positions[pos]||0)/p.overall;
const positionTier=(p,pos)=>positionRatio(p,pos)>=.9?'natural':positionRatio(p,pos)>=.75?'comfortable':'unfamiliar';
const effectivePosition=(p,pos)=>positionTier(p,pos)==='unfamiliar'?Math.round(p.overall*.6):p.positions[pos];
const positionLabel=(p,pos)=>`${pos} ${Math.round(positionRatio(p,pos)*100)}%${pos===p.primary?' · Native':''}`;
const playerTraits=p=>{const traits=[...(p.traits||[])];if(p.potential-p.overall>=8)traits.push('High potential');if(p.risk<=3)traits.push('Durable');if(p.risk>=7)traits.push('Injury prone');if(Object.keys(p.positions).filter(pos=>positionRatio(p,pos)>=.75).length>=3)traits.push('Versatile');if(p.primary==='ST'&&p.overall>=82)traits.push('Clinical finisher');if(['AM','LW','RW'].includes(p.primary)&&p.overall>=82)traits.push('Creative');if(['CB','DM','GK'].includes(p.primary)&&p.overall>=82)traits.push('Defensive leader');return traits.length?traits:['Steady squad player']};
const instructionButton=id=>id?`<button type="button" class="slot-tool instructions" data-action="player-instructions" data-player="${id}" title="Individual instructions" aria-label="Instructions for ${html(player(id).name)}">↗</button>`:'';
const slotsFor=f=>FORMATIONS[f||'4-3-3'].flat();
const opposition=(fixture,me)=>fixture.home===me?fixture.away:fixture.home;

function bestLineup(clubId,formation){
 const pool=squadPlayers(clubId);
 const remaining=pool.filter(p=>!(career?.clubId===clubId&&career?.players?.[p.id]?.injuryDays>0));
 const slots=slotsFor(formation);
 const lineup=slots.map(pos=>{
  remaining.sort((a,b)=>(effectivePosition(b,pos)+(b.primary===pos?3:0)+(playerFitness(b.id)-80)*.05)-(effectivePosition(a,pos)+(a.primary===pos?3:0)+(playerFitness(a.id)-80)*.05));
  const choice=remaining.shift();return choice?.id||null;
 });
 remaining.sort((a,b)=>(b.overall+(playerFitness(b.id)-80)*.08)-(a.overall+(playerFitness(a.id)-80)*.08));
 const bench=pickBalancedBench(remaining,7);
 return {lineup,bench};
}
function pickBalancedBench(pool,count=7){
 const remaining=pool.filter(p=>!(career?.clubId===owner(p.id)&&playerState(p.id).injuryDays>0));
 const picks=[];for(const group of [['GK'],['CB','LB','RB'],['CM','DM','AM'],['ST','LW','RW']]){
  const candidates=remaining.filter(p=>group.some(pos=>positionRatio(p,pos)>=.75)).sort((a,b)=>b.overall-a.overall);
  const chosen=candidates[0];if(chosen){picks.push(chosen.id);remaining.splice(remaining.indexOf(chosen),1)}
 }
 remaining.sort((a,b)=>b.overall-a.overall);picks.push(...remaining.slice(0,Math.max(0,count-picks.length)).map(p=>p.id));return picks.slice(0,count)
}
function scheduleSeason(startYear=2026){
 const ids=source.clubs.map(c=>c.id),rotation=[...ids],rounds=[];
 for(let cycle=0;cycle<2;cycle++) for(let r=0;r<11;r++){
  const fixtures=[];
  for(let i=0;i<6;i++){
   const a=rotation[i],b=rotation[11-i],reverse=(r%2===0) !== (cycle===0);
   fixtures.push({home:reverse?b:a,away:reverse?a:b,kickoff:['15:00','17:30','19:45'][(r+i+cycle)%3],homeGoals:null,awayGoals:null});
  }
  rounds.push({date:addDays(`${startYear}-08-15`,rounds.length*7),fixtures});
  rotation.splice(1,0,rotation.pop());
 }
 return rounds;
}
function newCareer(){
 try{
 source=structuredClone(originalLeague);
 postMatchTable=false;archivedReport=null;benchExpanded=true;reservesExpanded=false;tickerIndex=0;career=null;
 const c=club(setup.clubId),choice=bestLineup(c.id,c.formation);
 career={version:1,clubId:c.id,names:{...setup.names},colour:setup.colour||c.colour,site:setup.site,construction:[],date:'2026-08-13',time:'09:00',balance:c.budget*5,formation:c.formation,style:c.style,order:'Standard',lineup:choice.lineup,bench:choice.bench,players:Object.fromEntries(source.players.map(p=>[p.id,{fitness:p.fitness,form:[],happiness:64+(p.number*7)%25,ambitious:ambitiousIds.has(p.id),instruction:'Standard',reason:'Content with their squad role.'}])),stats:{},loans:{},owners:{},transferList:[],hotList:[],offers:[],stadium:defaultLayout(c),schedule:scheduleSeason(),reports:[],news:[],medical:{prevention:0,recovery:0},ui:{benchExpanded:true,reservesExpanded:false},kit:{home:'solid',away:'stripes'}};
 initialiseDevelopment(career,source);developmentDay(career,source,nextFixture());view='career';section='hub';sub='lineup';const saved=save();render();
 if(!saved)toast('The season is open, but this device could not save it. Free storage before reloading.');
 }catch(error){
  console.error('Could not start the season',error);
  career=null;match=null;view='setup';
  render();toast('Could not start the season. Use Check for updates on the main menu and try again.');
 }
}
function save(){
 if(!career)return true;
 const data=JSON.stringify({career,match});
 try{localStorage.setItem(SAVE_KEY,data);saveWarning='';return true}
 catch(error){
  // An old GROUNDS career shares this origin. It is no longer needed for Clubline.
  if(error?.name==='QuotaExceededError'||error?.code===22||error?.code===1014){
   try{localStorage.removeItem('grounds-career-v2');localStorage.setItem(SAVE_KEY,data);saveWarning='';return true}catch{}
  }
  saveWarning='Device storage is unavailable. This career may be lost if you close or reload the game.';
  return false;
 }
}
function load(){try{const saved=JSON.parse(localStorage.getItem(SAVE_KEY));if(saved?.career?.version===1){postMatchTable=false;career=saved.career;career.construction??=[];advanceConstruction(career);source=structuredClone(originalLeague);initialiseDevelopment(career,source);career.ui??={benchExpanded:true,reservesExpanded:false};benchExpanded=career.ui.benchExpanded;reservesExpanded=career.ui.reservesExpanded;career.owners??={};career.transferList??=[];career.hotList=Array.isArray(career.hotList)?career.hotList:[];career.offers??=[];career.stats??={};career.loans??={};career.medical??={prevention:0,recovery:0};career.medical.prevention??=0;career.medical.recovery??=0;for(const p of source.players){const state=career.players[p.id]??(career.players[p.id]={fitness:p.fitness,form:[]});state.happiness??=70;state.ambitious??=ambitiousIds.has(p.id);state.instruction??='Standard';state.reason??='Content with their squad role.';if(state.injuryDays&&!state.injuryType)state.injuryType='Knock'}career.stadium=normaliseLayout(career.stadium,club(career.clubId));if(career.clubId==='C10'&&!career.cornerRevision){for(const id of ['NW','NE','SW','SE']){const x=career.stadium.sections[id];if(x.stand==='d1'&&x.roof==='continuous'&&x.rear==='compact'&&x.finish==='metal')x.stand='s1'}career.cornerRevision=124;}if(!SITES.some(([id])=>id===career.site))career.site='aberdeen';match=saved.match||null;if(match)match.kickoff??='15:00';return true}}catch{}return false}
const hasSave=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY))?.career?.version===1}catch{return false}};
function nextFixture(){if(!career)return null;for(const round of career.schedule){const f=round.fixtures.find(x=>(x.home===career.clubId||x.away===career.clubId)&&x.homeGoals===null);if(f)return {...f,date:round.date,round}}return null}
function allResults(){return career.schedule.flatMap(r=>r.fixtures.filter(f=>f.homeGoals!==null).map(f=>({...f,date:r.date})))}
function standings(){
 const table=Object.fromEntries(source.clubs.map(c=>[c.id,{id:c.id,P:0,W:0,D:0,L:0,GF:0,GA:0,Pts:0}]));
 for(const f of allResults()){
  const h=table[f.home],a=table[f.away];h.P++;a.P++;h.GF+=f.homeGoals;h.GA+=f.awayGoals;a.GF+=f.awayGoals;a.GA+=f.homeGoals;
  if(f.homeGoals>f.awayGoals){h.W++;a.L++;h.Pts+=3}else if(f.homeGoals<f.awayGoals){a.W++;h.L++;a.Pts+=3}else{h.D++;a.D++;h.Pts++;a.Pts++}
 }
 return Object.values(table).sort((a,b)=>b.Pts-a.Pts||(b.GF-b.GA)-(a.GF-a.GA)||b.GF-a.GF||clubName(a.id).localeCompare(clubName(b.id)));
}
function recordStats(id,{start=false,minutes=0,goals=0,assists=0,conceded=0,cleanSheet=false,rating=null}={}){
 if(!id||minutes<=0)return;
 const s=career.stats[id]??(career.stats[id]={appearances:0,starts:0,minutes:0,goals:0,assists:0,conceded:0,cleanSheets:0,ratingTotal:0,ratedMinutes:0});
 s.appearances++;s.starts+=Number(start);s.minutes+=minutes;s.goals+=goals;s.assists+=assists;
 if(player(id)?.primary==='GK'){s.conceded+=conceded;s.cleanSheets+=Number(cleanSheet)}
 if(rating!==null){s.ratingTotal+=rating*minutes;s.ratedMinutes+=minutes}
}
function recordSimulatedTeam(clubId,goals,conceded){
 const picks=bestLineup(clubId,club(clubId).formation),lineup=picks.lineup.filter(Boolean),subs=picks.bench.filter(id=>id&&player(id).primary!=='GK').slice(0,3);
 const attackers=lineup.filter(id=>['ST','LW','RW','AM','CM'].includes(player(id).primary));
 const scorers=attackers.length?attackers:lineup.filter(id=>player(id).primary!=='GK');
 const goalsBy={},assistsBy={};
 for(let g=0;g<goals;g++){const scorer=rand(scorers);if(!scorer)break;goalsBy[scorer]=(goalsBy[scorer]||0)+1;const creator=rand(attackers.filter(id=>id!==scorer));if(creator&&Math.random()<.74)assistsBy[creator]=(assistsBy[creator]||0)+1}
 const replaced=lineup.filter(id=>player(id).primary!=='GK').slice(-subs.length);
 for(const id of lineup)recordStats(id,{start:true,minutes:replaced.includes(id)?75:90,goals:goalsBy[id]||0,assists:assistsBy[id]||0,conceded,cleanSheet:conceded===0,rating:Math.max(5.2,Math.min(9.4,6.3+(goalsBy[id]||0)*.75+(assistsBy[id]||0)*.4+(Math.random()-.5)*1.2))});
 for(const id of subs)recordStats(id,{minutes:15,conceded:0,rating:6.1+Math.random()*.8});
}
function updateHappiness(){
 const minutes=Object.fromEntries(Object.entries(match.participants).map(([id,p])=>[id,Math.max(1,(p.end??90)-p.start)]));
 for(const p of squadPlayers(career.clubId)){
  const state=career.players[p.id],role=ratingRole(p),played=minutes[p.id]||0;
  let delta=0,reason='Content with their squad role.';
  if(played>=45){delta=role==='Starter'?3:7;reason='Pleased with recent playing time.';state.unusedMatches=0}
  else if(played>0){delta=state.ambitious?7:4;reason='A substitute appearance helped.';state.unusedMatches=0}
  else{state.unusedMatches=(state.unusedMatches||0)+1;delta=role==='Starter'?-4:role==='Rotation'?-1:state.ambitious?-3:0;
   reason=role==='Fringe'&&!state.ambitious?'Accepts a fringe role.':role==='Starter'?'Disappointed to miss a start.':state.ambitious?'Wants more playing time.':'Would like more minutes.'}
  state.happiness=Math.max(5,Math.min(96,(state.happiness??70)+delta));state.reason=reason;
  if(state.happiness<25&&state.unusedMatches>=3&&!state.request){state.request=state.happiness<15?'transfer':'loan';state.reason=state.request==='loan'?'Requests a loan for playing time.':'Requests a transfer after limited playing time.';career.news.push({date:career.date,text:`${p.name} has asked to ${state.request==='loan'?'go out on loan':'be transfer listed'}. Review their happiness in Starting XI.`})}
  if(state.happiness<15&&state.request==='loan'&&state.unusedMatches>=6){state.request='transfer';state.reason='Requests a transfer after a long spell without playing.';career.news.push({date:career.date,text:`${p.name} now asks to be transfer listed.`})}
  if(state.happiness>=45)state.request=null;
 }
}
function attentionList(){const unhappy=squadPlayers(career.clubId).filter(p=>career.players[p.id]?.request||moodLevel(p.id)<=1||career.players[p.id]?.injuryDays>0),offers=career.offers.filter(o=>o.status==='new'||o.status==='counter');return `<div class="glass panel attention"><span class="eyebrow">Today / Pay attention</span>${offers.length?`<button class="attention-item" data-action="open-offers">${offers.length} transfer proposal${offers.length===1?'':'s'} to review →</button>`:''}${unhappy.slice(0,3).map(p=>`<button class="attention-item" data-action="focus-player" data-player="${p.id}">${html(p.name)} · ${html(career.players[p.id].injuryDays?`Injured ${injuryLength(career.players[p.id].injuryDays)} — ${career.players[p.id].injuryType||'Knock'}`:career.players[p.id].reason)} →</button>`).join('')}${!offers.length&&!unhappy.length?'<span class="muted">No urgent squad matters today.</span>':''}</div>`}
function toast(message){notice=message;document.querySelector('.toast')?.remove();const div=document.createElement('div');div.className='toast';div.textContent=message;document.body.appendChild(div);setTimeout(()=>div.remove(),3500)}
function scene(current,site,open=false,crowd=false,evening=false,wide=false){const layout=career?.clubId===current.id?career.stadium:null;const active=career?.clubId===current.id,motion=active?{ambient:true,phase:match?.home===career.clubId&&['choice','confirm'].includes(match.phase)?'prematch':match?.home===career.clubId&&match.phase==='live'?'live':'idle'}:null;return `<div class="scene ${open?'open':''} ${wide?'menu-scene':''}">${sceneSvg(current,site,crowd,evening,wide?'menu':open,layout,null,motion,active?career.construction||[]:[])}${wide?sceneSvg(current,site,crowd,evening,'menu-mobile',layout):''}</div>`}
function logo(small=false){return `<img class="logo ${small?'small':''}" src="assets/clubline-logo.svg?v=${APP_VERSION}" alt="Clubline">`}
function titleView(){const shot=menuScenes[titleSceneIndex],c=shot.club,paint=career?.clubId===c.id?career.colour:c.colour;return `<div class="app-shell title-screen" style="--club:${paint}"><div class="title-backdrop">${menuFrame(titleSceneIndex)}</div><div class="menu-scene-label" data-menu-scene-label>${html(c.name)} · ${html(c.ground)} · ${html(SITES.find(x=>x[0]===shot.site)?.[1])} · ${shot.evening?'Evening':'Day'}</div><div class="shell-content"><div class="menu-hero"><div class="hero-copy glass">${logo()}<p class="title-tagline">Your club. Your call.</p><div class="hero-actions"><button class="btn primary arrow wide" data-action="new-game">New career</button>${hasSave()?'<button class="btn wide" data-action="continue">Continue</button>':''}</div><small>12 clubs · Premier Division · 22 fixtures</small><div class="update-area"><button class="btn ghost slim" data-action="check-update" ${checkingUpdate?'disabled':''}>${checkingUpdate?'Checking…':'↻ Check for updates'}</button><span class="build-label">v${APP_VERSION}</span>${availableVersion?'<button class="btn slim primary" data-action="load-update">Load update</button>':''}${updateMessage?`<p role="status">${html(updateMessage)}</p>`:''}</div></div></div></div></div>`}
async function checkForUpdates(){
 if(checkingUpdate)return;
 checkingUpdate=true;updateMessage='';availableVersion=null;render();
 try{
  const response=await fetch(`./version.json?check=${Date.now()}`,{cache:'no-store'});
  if(!response.ok)throw new Error('Version unavailable');
  const data=await response.json();
  if(!/^\d+\.\d+\.\d+$/.test(data.version))throw new Error('Invalid version');
  const current=APP_VERSION.split('.').map(Number),remote=data.version.split('.').map(Number);
  const newer=remote.some((n,i)=>n>current[i]&&remote.slice(0,i).every((v,j)=>v===current[j]));
  if(newer){availableVersion=data.version;updateMessage=`Clubline v${data.version} is ready.`}
  else updateMessage=`You're up to date (v${APP_VERSION}).`;
 }catch{updateMessage="Couldn't check for updates. Try again when online."}
 checkingUpdate=false;if(view==='title')render();
}
function setupView(){
 const c=club(setup.clubId),name=setup.names[c.id]||c.name,col=setup.colour||c.colour;
 return `<div class="app-shell" style="--club:${col}">${scene({...c,colour:col},setup.site,true)}<div class="shell-content"><header class="topbar">${logo(true)}<button class="btn ghost" data-action="back-title">← Back</button></header><div class="setup-layout"><div class="glass setup-card"><span class="eyebrow">01 / Choose your club</span><h2>Premier Division</h2><div class="setup-list">${source.clubs.map(x=>`<button class="club-choice ${x.id===c.id?'active':''}" data-action="choose-club" data-id="${x.id}"><strong>${html(setup.names[x.id]||x.name)}</strong><span>ATT ${x.attack} &nbsp; DEF ${x.defence} &nbsp; ${Math.round(x.capacity/1000)}k seats · Facilities ${x.facilities}★ · Youth ${x.youth}★</span></button>`).join('')}</div><p class="muted" style="margin:14px 0 0;font-size:.75rem">All club names can be changed before kick-off.</p></div><div class="glass setup-detail"><span class="eyebrow">02 / Make it yours</span><h2>${html(name)}</h2><div class="stat-pair"><div class="stat-block"><small>Attack</small><strong>${c.attack}</strong></div><div class="stat-block"><small>Defence</small><strong>${c.defence}</strong></div><div class="stat-block"><small>Seats</small><strong>${(c.capacity/1000).toFixed(0)}k</strong></div></div><div class="detail-row"><span>Starting style</span><b>${html(c.style)}</b></div><div class="detail-row"><span>Home ground</span><b>${html(c.ground)}</b></div><div class="detail-row"><span>Ground character</span><b>${html(stadiumProfile(c).name)}</b></div><div class="detail-row"><span>Opening funds</span><b>${fmtMoney(c.budget*5)}</b></div><div class="detail-row"><span>Club facilities</span>${stars(c.facilities,'Club facilities')}</div><div class="detail-row"><span>Youth programme</span>${stars(c.youth,'Youth programme')}</div><label class="field">Your club name<input id="clubRename" maxlength="32" value="${html(name)}"></label><button class="btn slim" data-action="rename-all">${setup.showNames?'Hide division names':'Rename any club'}</button>${setup.showNames?`<div class="list" style="max-height:150px;overflow:auto;margin-top:9px">${source.clubs.map(x=>`<label class="field" style="margin:3px 0">${html(x.name)}<input data-rename="${x.id}" maxlength="32" value="${html(setup.names[x.id]||x.name)}"></label>`).join('')}</div>`:''}<label class="field">Primary colour, locked for your home kit</label><div class="swatches">${COLOURS.map(x=>`<button class="swatch ${col===x?'on':''}" style="background:${x}" data-action="colour" data-colour="${x}" aria-label="Choose ${x}"></button>`).join('')}<input type="color" id="customColour" aria-label="Custom primary colour" value="${col}" style="width:40px;height:32px;padding:0;border:0;background:transparent"></div><label class="field">Home location</label><div class="site-options">${availableSites(c).map(([key,label,limit])=>`<button class="btn ${setup.site===key?'selected':''}" data-action="site" data-site="${key}">${label} · up to ${(limit/1000).toFixed(0)}k</button>`).join('')}</div><div class="setup-ground-preview" aria-label="Preview of selected home ground">${sceneSvg({...c,colour:col},setup.site,false,false,true)}<span>${html(c.ground)} · ${c.capacity.toLocaleString('en-GB')} seats</span></div><div class="setup-footer"><button class="btn club arrow" data-action="start-season">Start season</button></div></div></div></div></div>`;
}

function clubFixtures(){return career.schedule.flatMap(r=>r.fixtures.filter(f=>f.home===career.clubId||f.away===career.clubId).map(f=>({...f,date:r.date})))}
function topbar(){const next=nextFixture(),rank=standings().findIndex(t=>t.id===career.clubId)+1;return `<header class="topbar career-topbar"><button class="brand-home" data-action="menu" aria-label="Clubline main menu">${logo(true)}</button><div class="league-rank">Premier Division <b>#${rank} / 12</b></div><div class="top-pill date-pill ${Date.now()<dateFlashUntil?'date-flash':''}"><small>Date / time</small><b>${fmtDate(career.date)} · ${career.time}</b></div><div class="top-pill"><small>Club balance</small><b class="money">${fmtMoney(career.balance)}</b></div><button class="top-pill next-match-pill" data-action="opponent"><small>Fixtures ⓘ</small><b>${next?`${next.home===career.clubId?'H':'A'} ${next.kickoff||'15:00'} · ${html(clubName(opposition(next,career.clubId)))}`:'Season complete'}</b></button></header>`}
function opponentPanel(){if(!opponentOpen)return '';const list=clubFixtures(),nextIndex=list.findIndex(f=>f.homeGoals===null),current=nextIndex<0?list.length-1:nextIndex,at=fixtureCursor??current,f=list[at],id=opposition(f,career.clubId),c=club(id),results=allResults().filter(x=>x.home===id||x.away===id).slice(-5).reverse(),past=f.homeGoals!==null;return `<div class="overlay" role="dialog" aria-modal="true" aria-label="Season fixture"><div class="modal opponent-modal"><button class="panel-close" data-action="close-opponent" aria-label="Close fixture details">×</button><span class="eyebrow">Fixture ${at+1} of ${list.length} · ${past?'Played':f.date===career.date?'Today':'Upcoming'} / ${f.home===career.clubId?'Home':'Away'}</span><h2>${html(clubName(id))}</h2><p>${fmtDate(f.date)} · ${f.kickoff||'15:00'} · ${html(c.ground)}</p><div class="fixture-switch"><button class="btn slim" data-action="fixture-step" data-step="-1" ${at===0?'disabled':''}>← Previous</button><strong>${past?`${html(clubName(f.home))} ${f.homeGoals}–${f.awayGoals} ${html(clubName(f.away))}`:'vs '+html(clubName(id))}</strong><button class="btn slim" data-action="fixture-step" data-step="1" ${at===list.length-1?'disabled':''}>Next →</button></div>${past?`<button class="btn primary" data-action="open-report" data-index="${at}">View match report</button>`:`<div class="opponent-stats"><div><small>Attack</small><b>${c.attack}</b></div><div><small>Defence</small><b>${c.defence}</b></div><div><small>Style</small><b>${html(c.style)}</b></div><div><small>Ground</small><b>${c.capacity.toLocaleString('en-GB')} seats</b></div></div><h3>Recent results</h3><div class="list">${results.map(x=>`<div class="row"><span>${html(clubName(x.home))} ${x.homeGoals}–${x.awayGoals} ${html(clubName(x.away))}</span><small>${fmtDate(x.date)}</small></div>`).join('')||'<p class="muted">No matches played yet.</p>'}</div>`}<button class="btn slim" data-action="close-opponent">Close</button></div></div>`}
function reportHistoryPanel(){if(reportIndex===null&&!archivedReport)return '';const f=clubFixtures()[reportIndex],r=archivedReport||career.reports.find(x=>x.date===f?.date);if(!r)return '';return `<div class="overlay history-overlay" role="dialog" aria-modal="true" aria-label="Previous match report"><div class="modal history-modal"><button class="panel-close" data-action="close-history" aria-label="Close match report">×</button><span class="eyebrow">Match report / ${fmtDate(r.date)}</span><h2>${html(clubName(career.clubId))} ${r.us}–${r.them} ${html(clubName(r.opponent))}</h2>${reportHeadline(r)}${reportStatistics(r)}<p>${r.home?'Home · '+html(myClub().ground):'Away'} · Attendance ${r.attendance?r.attendance.toLocaleString('en-GB'):'—'} · Tickets ${fmtMoney(r.tickets)} · Food & drink ${fmtMoney(r.concessions)} · Club shop ${fmtMoney(r.shop)} · Operational costs ${fmtMoney(r.operating||0)} · Net income ${fmtMoney(r.income)}</p><div class="match-columns"><div><h3>Player ratings</h3><div class="report-list list">${r.performances.slice().sort((a,b)=>b.rating-a.rating).map(x=>`<div class="row"><span>${html(player(x.id)?.name)}<small style="display:block">${x.minutes} min · ${x.goals||0} goals · ${x.assists||0} assists · Fit ${x.fitness}%${x.injuryDays?' · Injured':''}</small></span><b>${x.rating}</b></div>`).join('')}</div></div><div><h3>Key moments</h3><div class="commentary paused">${r.events.filter(e=>['goal','yellow','red','injury','chance'].includes(e.type)).map(e=>`<div class="comment ${e.type}">${clockLabel(e.minute)} ${html(e.text)}</div>`).join('')||'A quiet game.'}</div></div></div></div></div>`}
function tickerItems(){const items=career.news.filter(n=>n.date===career.date).map(n=>n.text);const round=career.schedule.find(r=>r.date===career.date&&r.fixtures.every(f=>f.homeGoals!==null));if(round)items.push(...round.fixtures.map(f=>`${clubName(f.home)} ${f.homeGoals}–${f.awayGoals} ${clubName(f.away)}`));return items}
function resultsTicker(){const items=tickerItems();if(!items.length)return '';return `<div class="results-ticker" aria-label="Today's league news"><span class="ticker-label">CLUBLINE LIVE</span><div class="ticker-window"><span data-ticker-text>${html(items[tickerIndex%items.length])}</span></div></div>`}
function homeHub(){const latest=career.reports.at(-1),head=latest?`${latest.us>latest.them?'Victory':latest.us<latest.them?'Defeat':'A point'} against ${html(clubName(latest.opponent))}`:'A new season begins';return `<span class="eyebrow">Clubline / News hub</span><h2>${head}</h2><p>${latest?`${html(clubName(career.clubId))} ${latest.us}–${latest.them} ${html(clubName(latest.opponent))}. ${latest.home?'Your home ground hosted the match.':'The team returns from an away fixture.'}`:'Set your starting eleven and prepare for the first Premier Division fixture.'}</p>${developmentHub()}<h3>Your club</h3><div class="list">${career.news.filter(n=>n.kind||n.text.includes(clubName(career.clubId))||squadPlayers(career.clubId).some(p=>n.text.includes(p.name))).slice(-5).reverse().map(n=>`<div class="row"><span>${html(n.text)}${newsAction(n)}</span><small>${fmtDate(n.date)}</small></div>`).join('')||'<div class="empty-note">Your club news will appear here.</div>'}</div><h3>Around the league</h3><div class="list">${career.news.slice(-8).reverse().map(n=>`<div class="row"><span>${html(n.text)}${newsAction(n)}</span><small>${fmtDate(n.date)}</small></div>`).join('')||'<div class="empty-note">The Premier Division is about to kick off.</div>'}</div>`}
function leagueTableMarkup(before){const table=standings();return `<div class="table-wrap"><table class="league-table"><thead><tr><th>#</th><th>Club</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>Pts</th></tr></thead><tbody>${table.map((t,i)=>{const old=before?.[t.id],movement=old===undefined?'':old>i+1?'<span class="rank-up" aria-label="Moved up">▲</span>':old<i+1?'<span class="rank-down" aria-label="Moved down">▼</span>':'';return `<tr class="${t.id===career.clubId?'mine':''}"><td>${i+1} ${movement}</td><td>${html(clubName(t.id))}</td><td>${t.P}</td><td>${t.W}</td><td>${t.D}</td><td>${t.L}</td><td>${t.GF}</td><td>${t.GA}</td><td><b>${t.Pts}</b></td></tr>`}).join('')}</tbody></table></div>`}
function postMatchPanel(){if(!postMatchTable)return '';const report=career.reports.at(-1);return `<div class="overlay" role="dialog" aria-modal="true" aria-label="Premier Division table after matchday"><div class="modal post-table"><span class="eyebrow">After matchday / Premier Division</span><h2>League table</h2>${leagueTableMarkup(report?.tableBefore)}<div class="modal-actions"><button class="btn primary arrow" data-action="close-table">Go to news hub</button></div></div></div>`}

function bottomNav(){const items=[['hub','Home'],['squad','Squad'],['facilities','Facilities'],['finances','Finances'],['organiser','Organiser']];return `<nav class="bottom-nav" aria-label="Club navigation">${items.map(([id,label])=>`<button class="${section===id?'active':''}" data-action="section" data-section="${id}">${label}</button>`).join('')}<button class="bottom-advance" data-action="advance">${career.date===nextFixture()?.date?'Matchday':'Advance'} <span aria-hidden="true">↗</span></button></nav>`}
function dashboard(){const c=myClub(),next=nextFixture(),homeMatch=match&&match.home===career.clubId;return `<div class="app-shell career-screen" style="--club:${myColour()}">${scene({...c,colour:myColour()},career.site,false,homeMatch,!!(match&&match.kickoff>='17:30'))}<div class="shell-content">${topbar()}<div class="dash-grid"><div><div class="glass panel welcome"><span class="eyebrow">${html(c.ground)} / ${usableCapacity(career,c).toLocaleString('en-GB')} seats</span><h1>${html(clubName(c.id))}</h1><div class="next-line">${next?`Next: ${next.home===c.id?'at home to':'away at'} ${html(clubName(opposition(next,c.id)))} · ${fmtDate(next.date)} · ${next.kickoff||'15:00'}`:'The league season is complete.'}</div></div>${saveWarning?`<div class="save-warning" role="alert">${html(saveWarning)}</div>`:''}${attentionList()}<nav class="section-nav" aria-label="Club sections">${[['hub','Home'],['squad','Squad'],['facilities','Facilities'],['finances','Finances'],['organiser','Organiser']].map(([id,label])=>`<button class="btn ${section===id?'active':''}" data-action="section" data-section="${id}">${label}</button>`).join('')}</nav></div><div class="glass panel section-content">${sectionContent()}</div></div><div class="advance-dock"><button class="btn primary arrow" data-action="advance">${next&&career.date===next.date?'Matchday':'Advance time'}</button><span>${next?`${next.date===career.date?'Kick-off event ahead':'Next fixture '+fmtDate(next.date)}`:'Season finished'}</span></div></div>${playerPanel()}${resultsTicker()}${bottomNav()}${opponentPanel()}${reportHistoryPanel()}${postMatchPanel()}${match?matchOverlay():''}${career.offers?.some(o=>o.status==='new')?`<button class="offer-alert" data-action="open-offers">Transfer offer received · Review →</button>`:''}</div>`}

function sectionContent(){return section==='hub'?homeHub():section==='squad'?squadSection():section==='facilities'?facilitiesSection():section==='finances'?financesSection():organiserSection()}

function tabBar(items){return `<div class="tabs">${items.map(([key,label])=>`<button class="btn ${sub===key?'selected':''}" data-action="sub" data-sub="${key}">${label}</button>`).join('')}</div>`}
let archivedReport=null;
function newsAction(n){const action=n.kind==='development'?'open-development':n.kind==='youth'?'open-youth':n.kind==='conversation'?'open-conversations':null;return action?`<button class="btn slim ghost" data-action="${action}">View →</button>`:''}
function abilityStars(value,label){const stars=estimatedStars(value);return `<span class="youth-stars" aria-label="Estimated ${label}: ${stars} of 5 stars">${'★'.repeat(Math.floor(stars))}${stars%1?'½':''}${'☆'.repeat(5-Math.ceil(stars))} <small>${stars}/5</small></span>`}
function youthSection(){const space=squadSpace(career,source),held=source.players.filter(p=>owner(p.id)===career.clubId&&playerState(p.id).unregistered&&!playerState(p.id).retired);return `<h3>Youth squad · leading prospects</h3><p>Coaches estimate current ability and potential. Exact overall is revealed after promotion; youth form is a guide, not a guarantee of senior success.</p><div class="squad-capacity">Senior ${space.senior}/24 · Under-20 development ${space.development}/5 · Youth system ${youthLevel(career,source).toFixed(1)}/5</div>${held.map(p=>`<div class="youth-card"><b>${html(p.name)} · Age ${p.age}</b><p>${career.developmentIds.includes(p.id)&&p.age<20?'An under-20 development':'A senior'} place is required before they can play.</p><button class="btn slim" data-action="register-senior" data-id="${p.id}">Register in squad</button><button class="btn slim" data-action="focus-player" data-player="${p.id}">Player details / loan</button></div>`).join('')}<div class="youth-grid">${career.prospects.map(p=>`<article class="youth-card"><h3>${html(p.name)}</h3><small>Age ${p.age} · ${p.primary}${p.secondary?' / '+p.secondary:''} · ${html(p.personality)}</small><div class="youth-rating"><span>Current ability</span>${abilityStars(p.overall,'current ability')}</div><div class="youth-rating"><span>Potential</span>${abilityStars(p.potential,'potential')}</div><p>${html(p.report)}</p><small>Traits: ${p.traits.map(html).join(' · ')}</small><p class="muted">${p.form>=7.3?'Youth form: impressing':p.form>=6.5?'Youth form: steady':'Youth form: inconsistent'}</p>${p.promoted?`<span class="badge">Promoted · ${player(p.id).overall} OVR</span>`:`<button class="btn slim primary" data-action="promote-youth" data-id="${p.id}" ${space.development>=5?'disabled':''}>Promote to first team</button>`}</article>`).join('')||'<p>No prospects awaiting assessment.</p>'}</div><p class="muted">Standout reports arrive every three weeks when someone merits attention. Retained youngsters compete with each new annual intake for the five featured places.</p>`}
function developmentSection(){const report=career.developmentReports.at(-1);return `<h3>Squad development</h3><p>A report is prepared three days before each fixture. Ability changes gradually through age, coaching and match experience; one poor performance will not immediately lower attributes.</p>${report?`<span class="eyebrow">${fmtDate(report.date)} · Before ${fmtDate(report.fixture)}</span><div class="development-list">${report.rows.map(row=>`<div class="development-row"><span><b>${html(row.name)}</b><small>${row.position} · Overall ${row.rating}</small><small>${html(row.reason)}</small>${row.positionChanges?.length?`<small>${row.positionChanges.map(html).join(' · ')}</small>`:''}</span><b class="${row.delta>0?'rank-up':row.delta<0?'rank-down':''}">${row.delta>0?'↑ +'+row.delta:row.delta<0?'↓ '+row.delta:'—'}</b></div>`).join('')}</div><details><summary>Previous development reports</summary>${career.developmentReports.slice(0,-1).reverse().map(r=>`<details><summary>${fmtDate(r.date)}</summary>${r.rows.map(x=>`<p>${html(x.name)} · ${x.position} · ${x.delta>0?'+':''}${x.delta} · Overall ${x.rating}</p>`).join('')}</details>`).join('')||'<p>No earlier reports.</p>'}</details>`:'<p>Your first report will be available three days before the next match.</p>'}`}
function conversationSection(){return `<h3>Player conversations</h3><p>Discuss retirement plans and opportunities to develop in another position. Trials improve positional confidence gradually through minutes in the chosen position.</p><div class="list">${career.conversations.slice().reverse().map(c=>{const p=player(c.id);return `<article class="youth-card"><b>${html(p.name)} · Age ${p.age} · ${p.primary}</b><small>${fmtDate(c.date)}</small><p>“${html(c.text)}”</p>${c.status==='new'?c.type==='retirement'?`<button class="btn slim" data-action="conversation-reply" data-key="${c.key}" data-reply="acknowledge">Acknowledge plans</button>`:`<button class="btn slim primary" data-action="conversation-reply" data-key="${c.key}" data-reply="agree">Agree positional trial</button> <button class="btn slim" data-action="conversation-reply" data-key="${c.key}" data-reply="decline">Keep current role</button>`:`<small>${c.status==='agree'?'Trial agreed':c.status==='decline'?'Current role retained':'Plans acknowledged'}</small>`}</article>`}).join('')||'<p>No conversations waiting.</p>'}</div>`}
function youthFinance(){return `<h3>Youth development funding</h3><p>Monitoring and promotion are in Squad → Youth. Investment improves coaching and the quality of future intakes; exceptional talent remains rare.</p><div class="detail-row"><span>Additional funding</span><b>Level ${career.youthFunding}/3</b></div><button class="btn slim" data-action="youth-invest" ${career.youthFunding>=3||youthLevel(career,source)>=5||career.balance<(career.youthFunding+1)*100000?'disabled':''}>${youthLevel(career,source)>=5?'Youth system fully funded':'Invest '+fmtMoney((career.youthFunding+1)*100000)}</button>`}
function developmentHub(){const waiting=career.conversations.filter(c=>c.status==='new').length,space=squadSpace(career,source);return `<div class="development-hub"><h3>Squad development · Season ${career.season}</h3><p>Senior ${space.senior}/24 · Under-20 development ${space.development}/5</p><div class="hero-actions"><button class="btn slim" data-action="open-youth">Youth prospects</button><button class="btn slim" data-action="open-development">Development report</button><button class="btn slim" data-action="open-conversations">Conversations${waiting?' · '+waiting:''}</button></div>${squadPlayers(career.clubId).filter(p=>career.developmentIds.includes(p.id)&&p.age===19).map(p=>`<p class="muted">${html(p.name)} turns 20 next season and will need a senior place.</p>`).join('')}${!nextFixture()?'<p>The season is complete. Review the final table before starting a new season.</p><button class="btn primary" data-action="new-season">Begin next season / youth intake</button>':''}</div>`}

function squadSection(){
 const tabs=[['lineup','Starting XI'],['profiles','Player profiles'],['youth','Youth'],['development','Development'],['conversations','Conversations'],['transfers','Transfers'],['statistics','Statistics'],['form','Form charts']];
 let content='';
 if(sub==='lineup') content=lineupEditor(false);
 if(sub==='profiles') content=playerProfiles();
 if(sub==='youth') content=youthSection();
 if(sub==='development') content=developmentSection();
 if(sub==='conversations') content=conversationSection();
 if(sub==='transfers') content=transfersSection();
 if(sub==='statistics') content=statisticsSection();
 if(sub==='form') content=`<p>Recent league results and the players who have stood out.</p><div class="list">${career.reports.slice(-5).reverse().map(r=>`<div class="row"><span>${fmtDate(r.date)} · ${html(clubName(r.opponent))}</span><b>${r.us}-${r.them}</b></div>`).join('')||'<div class="empty-note">No games played yet.</div>'}</div><div class="divider"></div><div class="list">${career.lineup.map(id=>{const p=player(id),form=career.players[id].form;return `<div class="row"><span>${html(p.name)} <small>${p.primary}</small></span><b>${form.length?(form.reduce((a,b)=>a+b,0)/form.length).toFixed(1):'—'}</b></div>`}).join('')}</div>`;
 return `<span class="eyebrow">Football / Squad</span><h2>Shape your eleven</h2>${tabBar(tabs)}${content}`;
}
function playerProfiles(){return `<p>Player attributes, traits and positional confidence. Green is 90% or more, orange is 75–89%; all other positions play at 60% capability.</p><div class="profile-grid">${squadPlayers(career.clubId).sort((a,b)=>b.overall-a.overall).map(p=>`<button class="profile-row" data-action="focus-player" data-player="${p.id}">${shirt(p,true)}<span><b>${html(p.name)}</b><small>${p.primary} · ${p.overall} OVR · ${p.age} years · ${playerFitness(p.id)}% fit</small><small>${playerTraits(p).join(' · ')}</small></span><span>View ↗</span></button>`).join('')}</div>`}
function statisticsSection(){
 const entries=(statsScope==='club'?squadPlayers(career.clubId):source.players).map(p=>({p,s:career.stats[p.id]||{}}));
 const value=(x,key)=>key==='overall'?x.s.ratedMinutes?(x.s.ratingTotal/x.s.ratedMinutes):0:(x.s[key]||0);
 entries.sort((a,b)=>(value(b,statsSort)-value(a,statsSort))*(statsDescending?1:-1)||value(b,'appearances')-value(a,'appearances')||a.p.name.localeCompare(b.p.name));
 const columns=[['appearances','Apps'],['starts','Starts'],['minutes','Minutes'],['goals','Goals'],['assists','Assists'],['overall','Match OVR'],['conceded','GK conceded'],['cleanSheets','Clean sheets']];
 const head=([key,label])=>`<th><button class="stat-sort ${statsSort===key?'active':''}" data-action="stats-sort" data-sort="${key}" aria-label="Sort by ${label}">${label}${statsSort===key?(statsDescending?' ↓':' ↑'):''}</button></th>`;
 return `<div class="stats-intro"><p>Season player statistics. Appearances include starts and substitute appearances; goalkeeper goals conceded count while they play.</p><div class="tabs"><button class="btn ${statsScope==='club'?'selected':''}" data-action="stats-scope" data-scope="club">Your club</button><button class="btn ${statsScope==='league'?'selected':''}" data-action="stats-scope" data-scope="league">Premier Division</button></div></div><div class="table-wrap"><table class="league-table player-stats"><thead><tr><th>Player</th><th>Club</th>${columns.map(head).join('')}</tr></thead><tbody>${entries.map(({p,s})=>`<tr class="${owner(p.id)===career.clubId?'mine':''}"><td><b>${html(p.name)}</b><small>${p.primary}</small></td><td>${html(clubName(owner(p.id)))}</td><td>${s.appearances||0}</td><td>${s.starts||0}</td><td>${s.minutes||0}</td><td>${s.goals||0}</td><td>${s.assists||0}</td><td>${s.ratedMinutes?(s.ratingTotal/s.ratedMinutes).toFixed(1):'—'}</td><td>${p.primary==='GK'?(s.conceded||0):'—'}</td><td>${p.primary==='GK'?(s.cleanSheets||0):'—'}</td></tr>`).join('')}</tbody></table></div>`;
}
function transferResults(){
 const found=searchLeaguePlayers(source.players,career,transferFilters),rows=found.slice(0,transferLimit);
 return {count:found.length,markup:rows.map(p=>{const own=owner(p.id)===career.clubId,loan=!!career.loans[p.id];return `<div class="transfer-row league-player-row" data-result-player="${p.id}"><label class="hot-list-check"><input type="checkbox" data-hot-player="${p.id}" aria-label="Hot list: ${html(p.name)}" ${career.hotList.includes(p.id)?'checked':''}><span>Hot list</span></label><span><b>${html(p.name)}</b><small>${html(clubName(owner(p.id)))} · Age ${p.age} · ${p.primary} · ${p.overall} OVR</small><small>${fmtMoney(transferValue(p))} · ${career.transferList.includes(p.id)?'Transfer listed':'Not listed'}${loan?' · On loan':''}</small></span><div class="league-player-actions">${own?'<small>Your player</small>':loan?'<small>On loan</small>':`<button class="btn slim" data-action="inquire" data-id="${p.id}">Inquire</button><button class="btn slim primary" data-action="bid" data-id="${p.id}">Bid</button>`}</div></div>`}).join('')||'<div class="empty-note">No players match these filters.</div>'};
}
function transferSearchPanel(){
 const f=transferFilters,results=transferResults();
 const number=(key,label)=>`<label class="field">${label}<input class="input" type="number" min="0" step="${key.startsWith('value')?'1000':'1'}" data-transfer-filter="${key}" value="${html(f[key])}"></label>`;
 const options=(items,value)=>items.map(([id,label])=>`<option value="${id}" ${value===id?'selected':''}>${label}</option>`).join('');
 return `<section class="league-search"><h3>League player search</h3><p class="muted">Search every registered player in the division. Tick players to save them to your hot list.</p><div class="transfer-filters"><label class="field">Name<input class="input" type="search" data-transfer-filter="name" value="${html(f.name)}" placeholder="Player name"></label><label class="field">Transfer status<select class="select" data-transfer-filter="listed">${options([['all','All players'],['listed','Transfer listed'],['unlisted','Not listed']],f.listed)}</select></label><label class="field">Position<select class="select" data-transfer-filter="position">${options([['all','Any position'],['GK','Goalkeeper'],['defence','Defence'],['midfield','Midfield'],['attack','Attack'],...['LB','CB','RB','DM','CM','AM','LW','RW','ST'].map(pos=>[pos,pos])],f.position)}</select></label>${number('valueMin','Minimum value (£)')}${number('valueMax','Maximum value (£)')}${number('ageMin','Minimum age')}${number('ageMax','Maximum age')}${number('ratingMin','Minimum rating')}${number('ratingMax','Maximum rating')}<label class="field">Sort by<select class="select" data-transfer-filter="sort">${options([['rating','Highest rating'],['value','Highest value'],['age','Youngest'],['name','Name A–Z']],f.sort)}</select></label></div><div class="transfer-search-tools"><label class="hot-only"><input type="checkbox" data-transfer-filter="hotOnly" ${f.hotOnly?'checked':''}>Show hot list only</label><button class="btn slim ghost" data-action="reset-transfer-filters">Clear filters</button><span class="muted" id="transfer-result-count">${results.count} players</span></div><div class="transfer-list" id="league-search-results">${results.markup}</div><button class="btn slim" data-action="more-transfer-results" ${results.count<=transferLimit?'hidden':''}>Show more players</button></section>`;
}
function refreshTransferResults(){
 const target=root.querySelector('#league-search-results');if(!target)return;
 const results=transferResults();target.innerHTML=results.markup;root.querySelector('#transfer-result-count').textContent=`${results.count} players`;
 root.querySelector('[data-action="more-transfer-results"]').hidden=results.count<=transferLimit;
}
function handleTransferFilter(el){if(!el.dataset.transferFilter)return false;transferFilters[el.dataset.transferFilter]=el.type==='checkbox'?el.checked:el.value;transferLimit=50;refreshTransferResults();return true}
function transferProfile(p){const state=playerState(p.id),stats=career.stats[p.id]||{},form=state.form||[];return `${p.primary} · ${p.overall} OVR · ${ratingRole(p)} · ${stats.starts||0} starts / ${stats.appearances||0} apps · Form ${form.length?(form.reduce((a,b)=>a+b,0)/form.length).toFixed(1):'—'} · ${MOODS[moodLevel(p.id)][1]} · ${html(state.reason||'Content with their squad role.')} · Contract ${p.contract||1} years · Wage ${fmtMoney(p.wage)}/week`}
function transfersSection(){
 career.hotList??=[];
 const my=squadPlayers(career.clubId).sort((a,b)=>b.overall-a.overall);
 return `<p>Scout the division, inquire about availability, and negotiate a fee. Clubs can accept, reject or counter an offer.</p><h3>Transfer proposals</h3><div class="list">${career.offers.filter(o=>o.status==='new'||o.status==='counter').map(o=>`<div class="transfer-row"><span><b>${html(player(o.id).name)}</b><small>${o.incoming?'Your bid to '+html(clubName(o.clubId)):html(clubName(o.clubId))+' bid'} · ${fmtMoney(o.fee)} ${o.status==='counter'?'counteroffer':'offer'}</small><small class="proposal-profile">${transferProfile(player(o.id))}</small></span><button class="btn slim primary" data-action="accept-offer" data-id="${o.id}" data-club="${o.clubId}">Accept</button><button class="btn slim" data-action="counter-offer" data-id="${o.id}" data-club="${o.clubId}">${o.incoming?'Wait':'Counter'}</button><button class="btn slim ghost" data-action="reject-offer" data-id="${o.id}" data-club="${o.clubId}">Reject</button></div>`).join('')||'<div class="empty-note">No proposals waiting.</div>'}</div><h3>Your squad · ${my.length} players</h3><div class="transfer-list">${my.map(p=>`<div class="transfer-row"><span><b>${html(p.name)}</b><small>${p.primary} · ${p.overall} OVR · value ${fmtMoney(transferValue(p))}</small></span><button class="btn slim ${career.transferList.includes(p.id)?'selected':''}" data-action="list-player" data-id="${p.id}">${career.transferList.includes(p.id)?'Listed ✓':'List'}</button></div>`).join('')}</div>${transferSearchPanel()}`;
}
function shirt(p,compact=false){return `<span class="shirt ${compact?'shirt-small':''}" style="--shirt:${p?.primary==='GK'?'#d3a548':myColour()}"><b>${p?html(p.number):'–'}</b></span>`}
function playerPanel(){
 if(!instructionPlayer||owner(instructionPlayer)!==career.clubId)return '';
 const p=player(instructionPlayer),state=playerState(p.id),role=ratingRole(p),[face,label]=MOODS[moodLevel(p.id)];
 return `<div class="player-panel" role="dialog" aria-label="${html(p.name)} instructions"><button class="panel-close" data-action="close-player-panel" aria-label="Minimise player details">−</button><span class="eyebrow">Player / ${html(role)}</span><h3>${html(p.name)} · ${p.primary} · ${p.overall} OVR</h3><span class="player-age">${p.age} years old</span>${state.retirementAfterSeason?`<p class="muted">Plans to retire after season ${state.retirementAfterSeason}.</p>`:''}${state.positionTrial?`<p class="muted">Positional trial: ${state.positionTrial} · ${state.trialMinutes||0} minutes in that role.</p>`:''}<p>${face} ${label}: ${html(state.reason||'Content with their squad role.')} ${state.ambitious&&role==='Fringe'?'Wants more playing time.':''}</p>${state.injuryDays?`<p class="medical-note"><span class="med-cross">✚</span> ${html(state.injuryType||'Injury')} · ${state.injuryDays} days remaining (${injuryLength(state.injuryDays)})</p>`:''}<label class="field">Individual instruction<select class="select" data-player-order="${p.id}">${PLAYER_ORDERS.map(x=>`<option value="${x}" ${state.instruction===x?'selected':''}>${x}</option>`).join('')}</select></label><div class="profile-attributes"><div><b>Attributes</b><p>Age ${p.age} · Overall ${p.overall} · Potential ${p.potential} · Fitness ${playerFitness(p.id)}% · Injury risk ${p.risk}/10</p><p>Traits: ${playerTraits(p).map(html).join(' · ')}</p></div><div><b>Positions</b><div class="position-list">${Object.keys(p.positions).filter(pos=>positionRatio(p,pos)>=.75||pos===p.primary).sort((a,b)=>positionRatio(p,b)-positionRatio(p,a)).map(pos=>`<span class="fit-${positionTier(p,pos)}">${positionLabel(p,pos)} · ${effectivePosition(p,pos)} effective</span>`).join('')}</div><small>Other positions: 60% of overall ability.</small></div></div><p class="muted">Substitute appearances usually help players asking for minutes. Individual instructions affect the match plan.</p>${!career.loans[p.id]?`<button class="btn slim" data-action="offer-loan" data-player="${p.id}">Offer outgoing loan</button>`:''}${state.request==='loan'?'<span class="badge warning">Requests a loan</span>':state.request==='transfer'?`<button class="btn slim" data-action="list-player" data-id="${p.id}">Transfer list player</button>`:''}</div>`;
}
function lineupEditor(inModal=false){
 const pool=squadPlayers(career.clubId).filter(p=>!career.lineup.includes(p.id)&&!career.bench.includes(p.id)).sort((a,b)=>b.overall-a.overall);
 const tile=(id,pos,index,compact=false)=>{const p=player(id);return `<div role="button" tabindex="0" class="slot shirt-slot ${!p?'empty':''} ${selectedSlot===index?'selected':''}" data-action="slot" data-index="${index}" data-drop-slot="${index}" data-player="${id||''}" draggable="${!!p}" aria-label="${pos}: ${p?html(p.name)+', rated '+p.overall+', condition '+playerFitness(id)+' percent':'Empty'}">${shirt(p,compact)}<span class="slot-name">${p?html(p.name.split(' ').at(-1)):'Select'}</span><span class="slot-stats">${pos} · ${p?effectivePosition(p,pos):'—'} fit · ${p?playerFitness(id)+'%':'—'}</span>${instructionButton(id)}${moodButton(id)}${injuryBadge(id)}</div>`};
 let idx=0;
 const listCard=(p,place,index=null)=>`<div role="button" tabindex="0" draggable="true" ${index!==null?`data-drop-slot="${index}"`:`data-drop-player="${p.id}"`} class="player-card ${selectedPlayer===p.id?'active':''}" data-action="select-player" data-player="${p.id}">${shirt(p,true)}<span class="player-card-copy"><strong>${html(p.name)}</strong><span class="meta">${p.primary}${p.secondary?' / '+p.secondary:''} · ${p.overall} OVR · Age ${p.age} · ${playerFitness(p.id)}% condition</span><span class="meta">${place} · ${ratingRole(p)}</span></span>${instructionButton(p.id)}${moodButton(p.id)}${injuryBadge(p.id)}${index!==null?`<button class="bench-target" data-action="slot" data-index="${index}" data-drop-slot="${index}" aria-label="Swap into bench place ${index-10}">↔</button>`:''}</div>`;
 const pitch=FORMATIONS[career.formation].map(line=>`<div class="pitch-line">${line.map(pos=>tile(career.lineup[idx],pos,idx++)).join('')}</div>`).join('');
 return `<div class="squad-toolbar"><label class="field">Formation<select class="select" data-squad-formation>${Object.keys(FORMATIONS).map(f=>`<option value="${f}" ${f===career.formation?'selected':''}>${f}</option>`).join('')}</select></label><label class="field">Play style<select class="select" data-squad-style>${STYLES.map(x=>`<option value="${x}" ${career.style===x?'selected':''}>${x}</option>`).join('')}</select></label><label class="field">Team orders<select class="select" data-squad-order>${ORDERS.map(x=>`<option value="${x}" ${career.order===x?'selected':''}>${x}</option>`).join('')}</select></label><button class="btn slim" data-action="auto-lineup">Auto pick XI</button><button class="btn slim" data-action="auto-subs">Auto Pick Subs</button></div><div class="formation-pitch">${formationMarkings()}${pitch}</div><small>Tap or drag a reserve onto a substitute to swap them. You can also swap anyone into the XI.</small>${career.lineup.some(id=>career.players[id]?.injuryDays>0)?`<div class="decision-alert">An injured starter cannot play. Choose a fit player from your bench or reserves, or use Auto pick to replace them.</div>`:''}<button class="squad-list-heading collapse-toggle" data-action="toggle-squad-list" data-list="bench" aria-expanded="${benchExpanded}">Substitutes · ${career.bench.filter(Boolean).length} <span>${benchExpanded?'−':'+'}</span></button><div class="player-list bench-list ${benchExpanded?'':'collapsed'}">${career.bench.map((id,i)=>id?listCard(player(id),'Bench',11+i):`<button class="empty-bench" data-action="slot" data-index="${11+i}" data-drop-slot="${11+i}">Empty bench place ${i+1}</button>`).join('')}</div><button class="squad-list-heading collapse-toggle" data-action="toggle-squad-list" data-list="reserves" aria-expanded="${reservesExpanded}">Reserves · ${pool.length} <span>${reservesExpanded?'−':'+'}</span></button><div class="player-list reserve-list ${reservesExpanded?'':'collapsed'}">${pool.map(p=>listCard(p,'Reserve')).join('')||'<p class="muted">No additional squad players.</p>'}</div>${inModal?'<div class="modal-actions"><button class="btn primary" data-action="confirm-lineup">Confirm lineup</button></div>':''}`;
}
function constructionStatus(){const job=career.construction?.[0];return job?`<div class="construction-notice"><b>Stadium work in progress</b><p>${Object.keys(job.sections).length} sections closed · Expected opening ${fmtDate(job.opens)} · ${usableCapacity(career,myClub()).toLocaleString('en-GB')} seats available.</p></div>`:''}
function constructionPreview(q){return `<div class="construction-notice"><b>Construction estimate · ${q.days} days</b><p>Expected opening ${fmtDate(q.opens)}. ${q.closed.toLocaleString('en-GB')} seats will close; ${q.during.toLocaleString('en-GB')} remain available.</p><p>${q.affected.length} home fixture${q.affected.length===1?'':'s'} before reopening.${q.affected.length>=2?' Consider waiting until nearer the end of the season to reduce disruption.':''}</p>${q.during===0?'<p>The whole stadium will be closed: home fixtures will have no paying attendance during works.</p>':''}</div>`}
function stadiumEditor(){
 const c=myClub(),draft=editing||normaliseLayout(career.stadium,c),chosen=draft.sections[selectedStand]||draft.sections.N4;
 const cost=SECTIONS.reduce((sum,x)=>sum+changeCost(career.stadium.sections[x.id],draft.sections[x.id]),0);
 const current=capacity(career.stadium,c),proposed=capacity(draft,c),quote=constructionQuote(career,c,draft);
 const field=(label,key,options)=>`<label class="field">${label}<select class="select" data-stadium-field="${key}">${Object.entries(options).map(([id,value])=>`<option value="${id}" ${chosen[key]===id?'selected':''}>${value.label||value}</option>`).join('')}</select></label>`;
 const buttons=[['N','North side'],['E','East end'],['S','South side'],['W','West end'],['corners','Corners'],['all','Whole ground']];
 return `<span class="eyebrow">Facilities / Stadium designer</span><h2>Build ${html(c.ground)}</h2><p>Tap stands on the ground to select one or several. Selected sections glow red; use the shortcuts to choose a whole side.</p><div class="designer-preview interactive">${sceneSvg({...c,colour:myColour()},career.site,false,false,'designer',draft,selectedStands,{ambient:true,phase:'idle'},career.construction||[])}<span>${proposed.toLocaleString('en-GB')} capacity ${proposed!==current?`· ${proposed>current?'+':''}${(proposed-current).toLocaleString('en-GB')} seats`:''}</span></div><div class="designer-shortcuts">${buttons.map(([id,label])=>`<button class="btn slim" data-action="select-scope" data-scope="${id}">${label}</button>`).join('')}</div><div class="designer-selection"><b>${selectedStands.size} section${selectedStands.size===1?'':'s'} selected</b><small>${[...selectedStands].join(' · ')}</small></div><h3>${selectedStands.size===1?`${selectedStand} · ${STANDS[chosen.stand].label}`:'Apply to selected sections'}</h3><div class="designer-fields">${field('Stand and tiers','stand',STANDS)}${field('Roof','roof',ROOFS)}${field('Rear building','rear',REARS)}${field('Exterior','finish',FINISHES)}</div><div class="designer-quote"><span>Current capacity <b>${current.toLocaleString('en-GB')}</b></span><span>Proposed <b>${proposed.toLocaleString('en-GB')}</b></span><span>Build cost <b>${fmtMoney(cost)}</b></span><span>Club cash <b>${fmtMoney(career.balance)}</b></span></div>${constructionStatus()}${cost?constructionPreview(quote):''}<div class="designer-actions"><button class="btn primary" data-action="commit-stadium" ${career.construction?.length||cost===0||cost>career.balance||proposed>siteLimit(career.site)||proposed<10000?'disabled':''}>Start construction</button><button class="btn" data-action="cancel-stadium">Discard preview</button></div>${proposed>siteLimit(career.site)||proposed<10000?`<p class="badge warning">This location can hold 10,000–${(siteLimit(career.site)/1000).toFixed(0)}k.</p>`:''}${cost>career.balance?'<p class="badge warning">Insufficient club funds.</p>':''}`;
}

function facilitiesSection(){const c=myClub();return sub==='designer'?stadiumEditor():`<span class="eyebrow">Club / Facilities</span><h2>${html(c.ground)}</h2><p>Your ${usableCapacity(career,c).toLocaleString('en-GB')}-seat ground is the club’s visible home. Edit individual stands and see them on the menu, around the club and at home matches.</p><div class="designer-preview compact">${sceneSvg({...c,colour:myColour()},career.site,false,false,true,career.stadium,null,{ambient:true,phase:'idle'},career.construction||[])}</div><div class="detail-row"><span>Location</span><b>${html(SITES.find(x=>x[0]===career.site)?.[1])}</b></div><div class="detail-row"><span>Seat colour</span><b><span style="display:inline-block;width:15px;height:15px;background:${myColour()};vertical-align:middle"></span> ${html(myColour().toUpperCase())}</b></div><div class="detail-row"><span>Capacity</span><b>${usableCapacity(career,c).toLocaleString('en-GB')}</b></div>${constructionStatus()}<button class="btn primary" data-action="open-designer">Design stadium</button>`}
function financesSection(){const home=career.reports.filter(r=>r.home),income=home.reduce((n,r)=>n+r.income,0),med=career.medical||{prevention:0,recovery:0};return `<span class="eyebrow">Club / Finances</span><h2>Club balance</h2><div class="stat-pair"><div class="stat-block"><small>Available cash</small><strong style="font-size:1.7rem">${fmtMoney(career.balance)}</strong></div><div class="stat-block"><small>Net home income</small><strong style="font-size:1.7rem">${fmtMoney(income)}</strong></div></div><p>Match reports show ticket, food and shop revenue, operational costs and the net result.</p><div class="detail-row"><span>Weekly squad wages</span><b>${fmtMoney(squadPlayers(career.clubId).reduce((n,p)=>n+p.wage,0))}</b></div>${youthFinance()}<h3>Medical investment</h3><p>One season of funding per level. Prevention lowers the chance of new injuries; recovery shortens new injuries and speeds existing recoveries.</p><div class="medical-invest"><div><b>Prevention · Level ${med.prevention}/3</b><small>${med.prevention*20}% fewer training and match injuries</small><button class="btn slim" data-action="medical-invest" data-kind="prevention" ${med.prevention>=3||career.balance<(med.prevention+1)*150000?'disabled':''}>Invest ${fmtMoney((med.prevention+1)*150000)}</button></div><div><b>Recovery · Level ${med.recovery}/3</b><small>${med.recovery*12}% shorter new injuries; extra recovery day every ${med.recovery?4-med.recovery:'—'} days</small><button class="btn slim" data-action="medical-invest" data-kind="recovery" ${med.recovery>=3||career.balance<(med.recovery+1)*120000?'disabled':''}>Invest ${fmtMoney((med.recovery+1)*120000)}</button></div></div><div class="detail-row"><span>Matchday pricing</span><b>Standard for the league</b></div>`}

function organiserSection(){
 const table=standings(),next=nextFixture(),fixtureLines=clubFixtures();
 return `<span class="eyebrow">Season / Organiser</span><h2>Premier Division</h2>${tabBar([['table','Table'],['calendar','Calendar'],['news','League news']])}${sub==='calendar'?`<div class="list">${career.archives.map((a,i)=>`<details><summary>Season ${a.season} · Previous match reports</summary>${a.reports.map((r,j)=>`<button class="btn slim" data-action="archived-report" data-season="${i}" data-report="${j}">${fmtDate(r.date)} · ${html(clubName(r.opponent))} · ${r.us}–${r.them}</button>`).join('')}</details>`).join('')}${fixtureLines.map(f=>`<button class="row fixture-row" data-action="calendar-fixture" data-index="${fixtureLines.indexOf(f)}"><span>${fmtDate(f.date)}<br><small>${f.home===career.clubId?'Home':'Away'} · ${html(clubName(opposition(f,career.clubId)))}</small></span><b>${f.homeGoals!==null?`${f.homeGoals}–${f.awayGoals} · Report ↗`:(f.kickoff||'15:00')+' · Preview ↗'}</b></button>`).join('')||'<div class="empty-note">All league fixtures have been played.</div>'}</div>`:sub==='news'?`<div class="list">${career.news.slice(-12).reverse().map(n=>`<div class="row"><span>${html(n.text)}${newsAction(n)}</span><small>${fmtDate(n.date)}</small></div>`).join('')||'<div class="empty-note">The season is just beginning. Results and injuries will appear here.</div>'}</div>`:`<div class="table-wrap"><table class="league-table"><thead><tr><th>#</th><th>Club</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>Pts</th></tr></thead><tbody>${table.map((t,i)=>`<tr class="${t.id===career.clubId?'mine':''}"><td>${i+1}</td><td>${html(clubName(t.id))}</td><td>${t.P}</td><td>${t.W}</td><td>${t.D}</td><td>${t.L}</td><td>${t.GF}</td><td>${t.GA}</td><td><b>${t.Pts}</b></td></tr>`).join('')}</tbody></table></div><p style="margin-top:14px">${next?'Next round '+fmtDate(next.date):'Season complete'}</p>`}`;
}

function positionPlayerPanel(){const panel=document.querySelector('.player-panel');if(!panel)return;const candidates=[...document.querySelectorAll(`.${instructionAnchorType}[data-player="${instructionPlayer}"]`)];const anchor=candidates.find(el=>{const r=el.getBoundingClientRect();return r.height&&r.bottom>0&&r.top<innerHeight})||candidates[0];if(!anchor)return;const rect=anchor.getBoundingClientRect(),width=Math.min(370,innerWidth-24),height=Math.min(panel.scrollHeight,innerHeight*.7);panel.style.width=`${width}px`;panel.style.left=`${Math.max(12,Math.min(innerWidth-width-12,rect.left+rect.width/2-width/2))}px`;panel.style.top=`${Math.max(12,Math.min(innerHeight-height-12,rect.top-height-10>=12?rect.top-height-10:rect.bottom+10))}px`}
function advanceTitleScene(){
 if(view!=='title')return;
 const nextIndex=(titleSceneIndex+1)%menuScenes.length;
 const backdrop=document.querySelector('.title-backdrop');
 if(!backdrop)return;
 const previous=backdrop.querySelector('.scene.is-visible');
 backdrop.insertAdjacentHTML('beforeend',menuFrame(nextIndex));
 const incoming=backdrop.lastElementChild,img=incoming.querySelector('img');
 img.decode().then(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{
  if(view!=='title'||!incoming.isConnected)return;
  titleSceneIndex=nextIndex;
  const shot=menuScenes[nextIndex],c=shot.club,label=backdrop.parentElement.querySelector('[data-menu-scene-label]');
  incoming.classList.add('is-visible');previous?.classList.remove('is-visible');
  if(label)label.textContent=`${c.name} · ${c.ground} · ${SITES.find(x=>x[0]===shot.site)?.[1]||shot.site} · ${shot.evening?'Evening':'Day'}`;
  setTimeout(()=>{if(previous?.parentElement===backdrop)previous.remove()},1800);
 }))).catch(()=>incoming.remove());
 titleSceneTimer=setTimeout(advanceTitleScene,14000);titleSceneTimer?.unref?.();
}

function render(){if(view==='career'&&match?.phase==='live'&&document.querySelector('.live-modal [data-live-minute]')){refreshLiveInterface();return}disposeStadiumLife();const scrollKey=view==='career'?section+'/'+sub:null,scrollTop=lastScrollSection===scrollKey?(document.querySelector('.dash-grid')?.scrollTop||0):0;clearInterval(tickerTimer);tickerTimer=null;clearInterval(timer);timer=null;clearTimeout(titleSceneTimer);titleSceneTimer=null;root.innerHTML=view==='title'?titleView():view==='setup'?setupView():dashboard();const scrollArea=document.querySelector('.dash-grid');if(scrollArea)scrollArea.scrollTop=scrollTop;lastScrollSection=scrollKey;positionPlayerPanel();document.querySelectorAll('.pitch-action[data-paused]').forEach(g=>g.ownerSVGElement?.pauseAnimations?.());if(view==='career'&&tickerItems().length>1){tickerTimer=setInterval(()=>{const items=tickerItems(),textEl=document.querySelector('[data-ticker-text]');if(!textEl||!items.length)return;tickerIndex=(tickerIndex+1)%items.length;textEl.textContent=items[tickerIndex];textEl.style.animation='none';void textEl.offsetWidth;textEl.style.animation=''},8500);tickerTimer?.unref?.()}if(view==='title'){document.querySelector('.title-backdrop .scene')?.classList.add('is-visible');titleSceneTimer=setTimeout(advanceTitleScene,14000);titleSceneTimer?.unref?.()}if(match?.phase==='live'){syncLiveScene();if(!match.paused)startClock()}}

function formationMarkings(){return `<svg class="formation-markings" viewBox="0 0 300 460" preserveAspectRatio="none" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 12H288V448H12ZM12 230H288M62 12V80H238V12M110 12V38H190V12M62 448V380H238V448M110 448V422H190V448"/><circle cx="150" cy="230" r="34"/><path d="M124 80a34 34 0 0 0 52 0M124 380a34 34 0 0 1 52 0M12 18a6 6 0 0 0 6-6M282 12a6 6 0 0 0 6 6M12 442a6 6 0 0 1 6 6M282 448a6 6 0 0 1 6-6"/></g><g fill="currentColor"><circle cx="150" cy="230" r="2"/><circle cx="150" cy="60" r="2"/><circle cx="150" cy="400" r="2"/></g></svg>`}
function validLineup(){const ids=[...career.lineup,...career.bench];return career.lineup.length===11&&career.bench.length===7&&ids.every(Boolean)&&new Set(ids).size===18&&career.lineup.some((id,i)=>slotsFor(career.formation)[i]==='GK'&&player(id).primary==='GK')&&career.lineup.every(id=>!(career.players[id]?.injuryDays>0))}
function advance(){
 if(match||postMatchTable){toast('Finish matchday first.');return}
 const next=nextFixture();
 if(!next){toast('The season is complete. Start the next season from the Home hub.');return}
 if(career.date===next.date&&career.time==='09:00'){dateFlashUntil=Date.now()+1400;career.time=next.kickoff?`${String(Math.floor((Number(next.kickoff.slice(0,2))*60+Number(next.kickoff.slice(3))-15)/60)).padStart(2,'0')}:${String((Number(next.kickoff.slice(0,2))*60+Number(next.kickoff.slice(3))-15)%60).padStart(2,'0')}`:'14:45';match={phase:'choice',fixtureDate:next.date,kickoff:next.kickoff||'15:00',home:next.home,away:next.away,homeGoals:0,awayGoals:0,minute:0,added:2,events:[],paused:false,speed:2,subCount:0,ratings:{},goalCounts:{},assistCounts:{},cardCounts:{},injured:[],participants:{},lineup:[...career.lineup],bench:[...career.bench]};save();render();return}
 dateFlashUntil=Date.now()+1400;career.date=addDays(career.date,1);career.time='09:00';tickerIndex=0;advanceConstruction(career);
 for(const p of squadPlayers(career.clubId)){
  const state=career.players[p.id];if(state.injuryDays>0){state.injuryDays=Math.max(0,state.injuryDays-1-((career.medical?.recovery||0)&&new Date(career.date+'T12:00:00Z').getUTCDate()%(4-career.medical.recovery)===0?1:0));if(!state.injuryDays){career.news.push({date:career.date,text:`${p.name} has recovered from a ${(state.injuryType||'knock').toLowerCase()} and is available again.`});state.injuryType=null}}
  state.fitness=Math.min(100,state.fitness+(state.injuryDays?1:Math.max(2,Math.round((100-state.fitness)*.18))));
 }
 if(Math.random()<.012*(1-.2*(career.medical?.prevention||0))&&squadPlayers(career.clubId).filter(p=>career.players[p.id].injuryDays>0).length<2){const fit=squadPlayers(career.clubId).filter(p=>!career.players[p.id].injuryDays);const p=rand(fit);if(p){applyInjury(p.id,'Training injury')}}
 if(new Date(career.date+'T12:00:00Z').getUTCDay()===1){const wages=squadPlayers(career.clubId).reduce((n,p)=>n+p.wage,0);career.balance-=wages;career.news.push({date:career.date,text:`Weekly wages paid: ${fmtMoney(wages)}.`})}
 for(const o of career.offers.filter(x=>x.status==='pending')){if(Math.random()<.55){o.status=Math.random()<.55?'new':'rejected';career.news.push({date:career.date,text:`${clubName(o.clubId)} ${o.status==='new'?'agreed to discuss':'declined'} your counter proposal for ${player(o.id).name}.`});}}
 if(Math.random()<.10&&career.offers.filter(o=>o.status==='new').length<2){const candidate=rand(squadPlayers(career.clubId).filter(p=>!career.offers.some(o=>o.id===p.id&&['new','pending'].includes(o.status))&&(p.primary!=='GK'||squadPlayers(career.clubId).filter(x=>x.primary==='GK').length>2)));const buyer=rand(source.clubs.filter(c=>c.id!==career.clubId));if(candidate){career.offers.push({id:candidate.id,clubId:buyer.id,fee:Math.round(transferValue(candidate)*(career.transferList.includes(candidate.id)?1.12:.85)/10000)*10000,status:'new'});career.news.push({date:career.date,text:`${clubName(buyer.id)} offered for ${candidate.name}. Review the proposal in Squad → Transfers.`});}}
 developmentDay(career,source,nextFixture());section='hub';save();render();
}
function resolveTransfer(id,newClub,fee){
 const p=player(id),oldClub=owner(id);if(!p||!oldClub||oldClub===newClub||playerState(id).retired)return;
 if(career.loans[id]){toast('A season loan must finish before a permanent transfer.');return}if(newClub===career.clubId&&!canRegister(career,source,p)){toast('All 24 senior squad places are occupied.');return}
 career.owners[id]=newClub;career.transferList=career.transferList.filter(x=>x!==id);
 career.offers=career.offers.filter(o=>o.id!==id);
 career.balance+=newClub===career.clubId?-fee:fee;
 if(oldClub===career.clubId||newClub===career.clubId){const picks=bestLineup(career.clubId,career.formation);career.lineup=picks.lineup;career.bench=picks.bench}
 career.news.push({date:career.date,text:`Transfer: ${p.name} moves from ${clubName(oldClub)} to ${clubName(newClub)} for ${fmtMoney(fee)}.`});save();render();
}
function beginMatch(mode){
 if(mode==='simulate'&&!validLineup()){toast('The saved lineup needs changes. Use Auto pick or confirm a watched lineup.');return}
 match.assistant=mode==='simulate'?true:!!match.assistant;match.phase=mode==='watch'?'confirm':'live';match.lineup=[...career.lineup];match.bench=[...career.bench];
 match.oppLineup=bestLineup(opposition(match,career.clubId),club(opposition(match,career.clubId)).formation).lineup;match.oppStarters=[...match.oppLineup];ensureMatchStats(match);
 match.events.push({minute:0,type:'info',text:`Kick-off approaches: ${clubName(match.home)} v ${clubName(match.away)}.`});
 if(mode==='simulate'){match.participants=Object.fromEntries(match.lineup.map(id=>[id,{start:0,end:null}]));while(match&&match.phase==='live'&&match.minute<96)tickMatch(true);if(match?.phase!=='report')finishMatch();}
 save();render();
}
function startClock(){if(!match||match.phase!=='live'||match.paused)return;const duration=match.speed*60*1000/45;timer=setInterval(()=>tickMatch(false),duration)}
function clockLabel(n){return n>90?`90+${n-90}′`:`${n}′`}
function teamIds(id){return id===career.clubId?match.lineup:match.oppLineup}
function onPitch(id,roles){const all=teamIds(id).map(x=>player(x)).filter(Boolean),narrow=all.filter(p=>roles.includes(p.primary));return rand(narrow.length?narrow:all)}
function teamPower(id,phase){
 const c=club(id),base=phase==='attack'?c.attack:c.defence;
 if(id!==career.clubId)return base;
 const positions=slotsFor(career.formation),active=match?.phase==='live'?match.lineup:career.lineup;
 const chosen=active.map((pid,i)=>pid?effectivePosition(player(pid),match?.slotOverrides?.[i]||positions[i]):0);
 const fitness=active.reduce((n,pid)=>n+(pid?playerFitness(pid):40),0)/11;
 let modifier=(chosen.reduce((n,x)=>n+x,0)/11-77)*.48+(fitness-85)*.08;
 for(const pid of active){const instruction=career.players[pid]?.instruction;
  if(instruction==='Get forward')modifier+=phase==='attack'?.55:-.18;
  if(instruction==='Hold position')modifier+=phase==='defence'?.55:-.16;
  if(instruction==='Press more')modifier+=phase==='attack'?.25:-.12;
  if(instruction==='Stay wide')modifier+=phase==='attack'?.28:0;
  if(instruction==='Cut inside')modifier+=phase==='attack'?.33:-.12;
 }
 if(phase==='attack'&&career.order==='Attack')modifier+=5;
 if(phase==='defence'&&(match?.phase==='live'&&match.orderOverride||career.order)==='Protect lead')modifier+=5;
 if(career.style==='High press')modifier+=phase==='attack'?3:-2;
 if(career.style==='Counter')modifier+=phase==='defence'?2:-1;
 if(career.style==='Possession')modifier+=phase==='attack'?1:1;
 return base+modifier;
}
function addMoment(moment,important=false){match.events.push(moment);if(important){match.paused=true;match.pauseReason=moment.type;match.flash=moment;}}
function chanceEvent(attackerId){
 const defenderId=attackerId===match.home?match.away:match.home;
 const attacker=onPitch(attackerId,['ST','LW','RW','AM','CM']);const creator=onPitch(attackerId,['CM','AM','LW','RW']);const keeper=onPitch(defenderId,['GK']);
 const atk=teamPower(attackerId,'attack'),def=teamPower(defenderId,'defence');
 const conversion=Math.max(.12,Math.min(.37,.22+(atk-def)*.008));
 const time=clockLabel(match.minute);
 const goal=Math.random()<conversion,onTarget=goal||Math.random()<.48;recordShot(ensureMatchStats(match),attackerId===match.home,onTarget);
 if(goal){
  if(attackerId===match.home)match.homeGoals++;else match.awayGoals++;
  match.goalCounts[attacker.id]=(match.goalCounts[attacker.id]||0)+1;
  if(creator.id!==attacker.id&&Math.random()<.83){match.assistCounts??={};match.assistCounts[creator.id]=(match.assistCounts[creator.id]||0)+1}
  const descriptions=[`${creator.name} slips a pass into the area and ${attacker.name} finishes beyond ${keeper.name}.`,`${attacker.name} meets a cross at the far post and beats ${keeper.name}.`,`${attacker.name} drives forward and finds the corner despite ${keeper.name}'s dive.`,`${creator.name} wins the ball high up the pitch. ${attacker.name} makes the chance count.`];
  addMoment({minute:match.minute,type:'goal',team:attackerId,playerId:attacker.id,text:`GOAL! ${attacker.name} ${time}. ${rand(descriptions)}`},true);
 }else{
  const descriptions=[`${attacker.name} goes close with a looping header. Saved by ${keeper.name}.`,`${creator.name} finds ${attacker.name} in space, but the shot skims wide.`,`${attacker.name} strikes from the edge of the box. ${keeper.name} gets down to save.`,`${attacker.name} reaches a deep cross and sends the effort over the bar.`];
  addMoment({minute:match.minute,type:'chance',team:attackerId,playerId:attacker.id,text:`Chance for ${clubName(attackerId)}: ${onTarget?rand([descriptions[0],descriptions[2]]):rand([descriptions[1],descriptions[3]])}`});
 }
}
function assistantSubstitute(index,reason){
 if(match.subCount>=5||index<0)return false;
 const role=match.slotOverrides?.[index]||slotsFor(career.formation)[index],eligible=match.bench.filter(id=>id&&!career.players[id]?.injuryDays);
 if(!eligible.length)return false;
 eligible.sort((a,b)=>effectivePosition(player(b),role)-effectivePosition(player(a),role));
 const id=eligible[0],out=match.lineup[index];match.bench.splice(match.bench.indexOf(id),1);
 if(out&&match.participants[out])match.participants[out].end=match.minute;
 match.lineup[index]=id;match.participants[id]={start:match.minute,end:null};match.subCount++;
 match.events.push({minute:match.minute,type:'info',text:`Assistant: ${player(id).name} ${out?'replaces '+player(out).name:'fills the vacant '+role+' slot'} — ${reason}.`});return true
}
function assistantDecision(type,at){
 if(!match.assistant)return;
 if(type==='injury'){
  if(!assistantSubstitute(at,'injury replacement'))match.events.push({minute:match.minute,type:'info',text:'Assistant: no eligible substitute remains. The team continues a player short.'});
 }else if(type==='red'){
  const role=slotsFor(career.formation)[at];match.orderOverride='Protect lead';
  if(['GK','CB','LB','RB','DM'].includes(role)){
   const i=match.lineup.findIndex((id,index)=>id&&index!==at&&slotsFor(career.formation)[index]!=='GK'&&positionRatio(player(id),role)>=.75);
   if(i>=0){match.lineup[at]=match.lineup[i];match.lineup[i]=null;match.events.push({minute:match.minute,type:'info',text:`Assistant: ${player(match.lineup[at]).name} drops into ${role}. The side regroups with ten players.`})}
   else match.events.push({minute:match.minute,type:'info',text:'Assistant: the side drops into a compact shape with ten players.'});
  }else match.events.push({minute:match.minute,type:'info',text:'Assistant: the side drops into a compact shape with ten players.'});
 }
 if(match.phase==='live')match.paused=true;
}
function cardEvent(teamId){const offender=onPitch(teamId,['CB','DM','CM','LB','RB']);const time=clockLabel(match.minute),previous=match.cardCounts[offender.id]||0;match.cardCounts[offender.id]=previous+1;const red=previous>0||Math.random()<.07;
 ensureMatchStats(match)[teamId===match.home?'home':'away'][red?'red':'yellow']++;
 addMoment({minute:match.minute,type:red?'red':'yellow',team:teamId,playerId:offender.id,text:`${red?'RED':'YELLOW'} CARD! ${offender.name} ${time}. ${rand(['Late challenge near the touchline.','The referee punishes a mistimed tackle.','A foul stops a promising move.'])}`},true);
 if(red&&teamId===career.clubId){const vacantAt=match.lineup.indexOf(offender.id);match.lineup=match.lineup.map(id=>id===offender.id?null:id);if(match.participants[offender.id])match.participants[offender.id].end=match.minute;career.news.push({date:career.date,text:`${offender.name} was sent off against ${clubName(opposition(match,career.clubId))}.`});assistantDecision('red',vacantAt)}
 if(red&&teamId!==career.clubId)match.oppLineup=match.oppLineup.map(id=>id===offender.id?null:id);
}
function injuryEvent(teamId){if(teamId===career.clubId&&(squadPlayers(career.clubId).filter(p=>career.players[p.id].injuryDays>0).length>=2||Math.random()<.2*(career.medical?.prevention||0)))return;const injured=onPitch(teamId,['ST','LW','RW','CM','CB','LB','RB']);const time=clockLabel(match.minute);match.injured.push(injured.id);
 addMoment({minute:match.minute,type:'injury',team:teamId,playerId:injured.id,text:`INJURY! ${injured.name} ${time}. Play stops while ${injured.name} receives treatment.`},true);
 if(teamId===career.clubId){const vacantAt=match.lineup.indexOf(injured.id);applyInjury(injured.id,'Match injury');match.lineup=match.lineup.map(id=>id===injured.id?null:id);if(match.participants[injured.id])match.participants[injured.id].end=match.minute;assistantDecision('injury',vacantAt)}
}
function tickMatch(quick){
 if(!match||match.phase!=='live'||(match.paused&&!quick))return;
 match.paused=false;match.flash=null;
 if(match.minute===45&&!quick&&!match.halfTimeTaken){match.halfTimeTaken=true;match.paused=true;match.pauseReason='half';match.events.push({minute:45,type:'info',text:`Half-time. ${clubName(match.home)} ${match.homeGoals}–${match.awayGoals} ${clubName(match.away)}.`});save();render();return}
 match.minute++;
 const m=match.minute;if(m===46)match.halfTimeTaken=true;
 if(m>90+match.added){finishMatch();save();render();return}
 recordPossession(ensureMatchStats(match),m,teamPower(match.home,'attack')-teamPower(match.away,'attack'),career.style,match.home===career.clubId);
 if(m===90)match.events.push({minute:m,type:'info',text:`${match.added} minutes of added time.`});
 {
  const chosen=Math.random()<.5?match.home:match.away;
  const pressure=(teamPower(chosen,'attack')-teamPower(opposition(match,chosen),'defence'))*.003;
  if(Math.random()<Math.max(.035,.085+pressure))chanceEvent(chosen);
  else if(Math.random()<.021)cardEvent(chosen);
  else if(Math.random()<.0025)injuryEvent(chosen);
  else if(m%15===0)match.events.push({minute:m,type:'info',text:`${clockLabel(m)} The contest remains finely balanced.`});
  if(match.assistant&&m>=64&&m<90&&m%13===0&&match.subCount<5){const options=match.lineup.map((id,i)=>({id,i,score:id?playerFitness(id)+effectivePosition(player(id),slotsFor(career.formation)[i])*.12:999})).filter(x=>x.id&&slotsFor(career.formation)[x.i]!=='GK').sort((a,b)=>a.score-b.score);const target=options.find(x=>match.bench.some(pid=>pid&&positionRatio(player(pid),slotsFor(career.formation)[x.i])>=.75));if(target)assistantSubstitute(target.i,'fresh legs')};
 }
 if(!quick){
  save();if(match?.paused)render();else updateLiveMatch();
  if(match?.paused&&(['goal','yellow'].includes(match.pauseReason)||match.assistant&&['red','injury'].includes(match.pauseReason))){
   const pausedAt=match.minute,reason=match.pauseReason;
   clearTimeout(autoResumeTimer);
   autoResumeTimer=setTimeout(()=>{if(match?.phase==='live'&&match.paused&&match.minute===pausedAt&&match.pauseReason===reason){match.paused=false;match.flash=null;save();render()}},reason==='goal'?3500:1800);
  }
 }
}

function quickScore(home,away){const baseH=1.25+(club(home).attack-club(away).defence)*.024+.2,baseA=1.12+(club(away).attack-club(home).defence)*.024;const poisson=mean=>{let n=0,p=1,threshold=Math.exp(-Math.max(.2,mean));do{n++;p*=Math.random()}while(p>threshold);return n-1};return [poisson(baseH),poisson(baseA)]}
function finishMatch(){
 if(!match||match.phase==='report')return;
 const tableBefore=Object.fromEntries(standings().map((t,i)=>[t.id,i+1]));
 const round=career.schedule.find(r=>r.date===match.fixtureDate);
 const fixture=round.fixtures.find(f=>f.home===match.home&&f.away===match.away);
 fixture.homeGoals=match.homeGoals;fixture.awayGoals=match.awayGoals;
 for(const f of round.fixtures)if(f.homeGoals===null)[f.homeGoals,f.awayGoals]=quickScore(f.home,f.away);
 for(const f of round.fixtures){if(f.home!==career.clubId&&f.home!==opposition(match,career.clubId))recordSimulatedTeam(f.home,f.homeGoals,f.awayGoals);if(f.away!==career.clubId&&f.away!==opposition(match,career.clubId))recordSimulatedTeam(f.away,f.awayGoals,f.homeGoals)}
 const home=match.home===career.clubId,us=home?match.homeGoals:match.awayGoals,them=home?match.awayGoals:match.homeGoals;
 const venueCapacity=home?usableCapacity(career,myClub()):club(opposition(match,career.clubId)).capacity;
 const attendance=Math.round(venueCapacity*(.51+Math.random()*.35));
 const tickets=home?attendance*22:0,concessions=home?Math.round(attendance*5.5):0,shop=home?Math.round(attendance*1.6):0;
 const operating=home?Math.round((tickets+concessions+shop)*.46):0;
 const income=tickets+concessions+shop-operating;
 career.balance+=income;
 const performances=[];
 for(const [id,participation] of Object.entries(match.participants)){
  const p=player(id),minutes=Math.max(1,(participation.end??90)-participation.start),goals=match.goalCounts[id]||0,assists=match.assistCounts?.[id]||0,cards=match.cardCounts[id]||0;
  let rating=Math.max(4.5,Math.min(9.9,6.2+Math.random()*1.5+(us-them)*.17+goals*1.1-cards*.25));
  rating=Math.round(rating*10)/10;career.players[id].form=[...career.players[id].form.slice(-4),rating];
  career.players[id].fitness=Math.max(34,career.players[id].fitness-Math.max(3,Math.round((12+Math.floor(Math.random()*9))*minutes/90)));
  recordStats(id,{start:participation.start===0,minutes,goals,assists,conceded:Math.round(them*minutes/90),cleanSheet:them===0,rating});
  if(career.players[id].positionTrial&&slotsFor(career.formation)[match.lineup.indexOf(id)]===career.players[id].positionTrial)career.players[id].trialMinutes=(career.players[id].trialMinutes||0)+minutes;
  performances.push({id,rating,minutes,goals,assists,cards,fitness:career.players[id].fitness,injuryDays:career.players[id].injuryDays||0});
 }
 const opponentId=opposition(match,career.clubId),opponentPerformances=[];
 const opponentPlayers=[...new Set([...(match.oppStarters||match.oppLineup||[]),...match.events.filter(e=>e.playerId&&owner(e.playerId)===opponentId).map(e=>e.playerId)])].filter(Boolean);
 for(const id of opponentPlayers){const off=match.events.find(e=>e.playerId===id&&['red','injury'].includes(e.type)),minutes=off?off.minute:90,goals=match.goalCounts[id]||0,assists=match.assistCounts?.[id]||0,cards=match.cardCounts[id]||0;
  const rating=Math.round(Math.max(4.5,Math.min(9.9,6.2+Math.random()*1.5+(them-us)*.17+goals*1.1-cards*.25))*10)/10;
  recordStats(id,{start:true,minutes,goals,assists,conceded:Math.round(us*minutes/90),cleanSheet:us===0,rating});opponentPerformances.push({id,rating,minutes,goals,assists,cards});
 }
 const playerOfMatch=[...performances,...opponentPerformances].sort((a,b)=>b.rating-a.rating)[0];
 updateHappiness();
 const report={playerOfMatch:playerOfMatch?{id:playerOfMatch.id,rating:playerOfMatch.rating,clubId:owner(playerOfMatch.id)}:null,opponentPerformances,stats:structuredClone(ensureMatchStats(match)),homeId:match.home,awayId:match.away,usableCapacity:venueCapacity,date:career.date,opponent:opposition(match,career.clubId),home,us,them,attendance,tickets,concessions,shop,operating,income,tableBefore,performances,events:[...match.events]};
 career.reports.push(report);career.news.push({date:career.date,text:`${clubName(match.home)} ${match.homeGoals}–${match.awayGoals} ${clubName(match.away)}.`});
 if(allResults().length===132){for(const [id,loan] of Object.entries(career.loans)){career.owners[id]=loan.parent;career.players[id].reason='Returned from a season loan.';career.news.push({date:career.date,text:`${player(id).name} returns from a loan at ${clubName(loan.to)}.`})}career.loans={}}
 match.phase='report';match.paused=true;career.time='17:15';save();
}

function awayPitchSvg(){const project=p=>({x:12+(p.x-22)*376/28,y:9+(p.y-21)*127/18});return `<svg viewBox="0 0 400 145" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Animated away match pitch"><rect width="400" height="145" fill="#276d4a"/><path d="M12 9H388V136H12ZM200 9V136M200 53a20 20 0 1 0 0 40a20 20 0 1 0 0 -40M12 45H52V100H12M388 45H348V100H388" stroke="#d9efdf" fill="none" stroke-width="1.4"/>${pitchPlayers(project,club(match.home)?.colour,myColour(),{homeCount:match.oppLineup?.filter(Boolean).length??11,awayCount:match.lineup.filter(Boolean).length})}</svg>`}

function liveMatchBody(includeStage=true){const home=match.home===career.clubId,last=match.flash,decision=match.paused&&['red','injury'].includes(match.pauseReason),score=`${match.homeGoals} : ${match.awayGoals}`;
 const stage=!includeStage?'':home?sceneSvg({...myClub(),colour:myColour()},career.site,true,match.kickoff>='17:30','match',career.stadium,null,{ambient:true,phase:'live',paused:match.paused,awayColour:club(match.away)?.colour,homeCount:match.lineup.filter(Boolean).length,awayCount:match.oppLineup?.filter(Boolean).length||11,scoringTeam:last?.type==='goal'?(last.team===match.home?0:1):null},career.construction||[]):awayPitchSvg();
 return `<div class="live-head"><span class="eyebrow">${home?html(myClub().ground):'Away match'} · <span data-live-minute>${clockLabel(match.minute)}</span> <span data-live-status>${match.paused?'· Paused':''}</span></span><div class="scoreline"><span>${html(clubName(match.home))}</span><strong data-live-score>${score}</strong><span>${html(clubName(match.away))}</span></div></div><div class="live-stage ${last?.type==='goal'&&last.team===career.clubId&&home?'goal-celebration':''}">${stage}${last?`<div class="live-event ${last.type}">${last.type==='goal'?'GOAL!':last.type==='red'?'RED CARD':last.type==='injury'?'INJURY':last.type==='yellow'?'YELLOW CARD':'HALF-TIME'} · ${last.playerId?html(player(last.playerId).name):''} ${clockLabel(last.minute)}</div>`:''}</div>${possessionBar()}${decision&&!match.assistant?`<div class="decision-alert" role="alert">${match.pauseReason==='injury'?'An injury needs your decision.':'A player has been sent off.'} Review substitutions or tactics before resuming.</div>`:''}<div class="match-toolbar live-toolbar"><small>Match pace</small><button class="btn slim assistant-toggle ${match.assistant?'selected':''}" data-action="toggle-assistant">${match.assistant?'Take control':'Delegate to assistant'}</button>${[4,2,1].map(n=>`<button class="btn slim ${match.speed===n?'selected':''}" data-action="speed" data-speed="${n}">${n} min / half</button>`).join('')}${match.paused?'<button class="btn primary slim" data-action="resume-match">Continue ▶</button>':'<button class="btn slim" data-action="pause-match">Pause</button>'}<button class="btn slim" data-action="sim-next">Next event</button><button class="btn slim" data-action="sim-half">End of half</button><button class="btn slim" data-action="finish-sim">Sim match</button></div><div class="commentary live-commentary ${match.paused?'paused':''}" id="commentary" data-event-count="${match.events.length}">${match.events.slice(-40).map(e=>`<div class="comment ${e.type}"><small>${clockLabel(e.minute)} ${e.team?html(clubName(e.team)):''}</small><br>${html(e.text)}</div>`).join('')}</div><details class="live-decisions" ${decision&&!match.assistant?'open':''}><summary>Touchline decisions · ${match.subCount}/5 subs</summary><div class="live-decisions-body"><label>Formation<select class="select" data-match-setting="formation">${Object.keys(FORMATIONS).map(x=>`<option ${x===career.formation?'selected':''}>${x}</option>`).join('')}</select></label><label>Style<select class="select" data-match-setting="style">${STYLES.map(x=>`<option ${x===career.style?'selected':''}>${x}</option>`).join('')}</select></label><label>Orders<select class="select" data-match-setting="order">${ORDERS.map(x=>`<option ${x===career.order?'selected':''}>${x}</option>`).join('')}</select></label><div class="live-subs"><small>Select a bench player, then a player to replace.</small><div class="bench">${match.bench.filter(Boolean).map(id=>`<button class="btn slim ${selectedPlayer===id?'selected':''}" data-action="match-bench" data-player="${id}">${html(player(id).name.split(' ').at(-1))}</button>`).join('')}</div><div class="live-xi">${match.lineup.map((id,i)=>`<button class="btn slim" data-action="match-replace" data-index="${i}">${slotsFor(career.formation)[i]} · ${id?html(player(id).name.split(' ').at(-1)):'Vacant'}</button>`).join('')}</div></div></div></details>`;
}
function possessionBar(){const value=possessionPercent(ensureMatchStats(match),5);return `<div class="live-possession" aria-label="Possession over the last five match minutes"><small>${match.minute?'Possession · Last '+Math.min(5,match.minute)+' mins':'Possession · Awaiting play'}</small><div class="possession-labels"><span>${html(clubName(match.home))} <b data-pos-home>${value}%</b></span><span><b data-pos-away>${100-value}%</b> ${html(clubName(match.away))}</span></div><div class="possession-track"><span data-pos-fill style="width:${value}%;background:${club(match.home)?.colour||'#d4454d'}"></span><span style="flex:1;background:${club(match.away)?.colour||'#d8e2e9'}"></span></div></div>`}
function syncLiveScene(){const svg=document.querySelector('.live-stage svg');if(!svg)return;syncStadiumLife(svg,{paused:match.paused,minute:match.minute,speed:match.speed,homeCount:(match.home===career.clubId?match.lineup:match.oppLineup)?.filter(Boolean).length??11,awayCount:(match.away===career.clubId?match.lineup:match.oppLineup)?.filter(Boolean).length??11,goal:match.flash?.type==='goal'?{key:match.flash.minute+':'+match.flash.team,team:match.flash.team===match.home?0:1}:null});}
function refreshLiveInterface(){
 clearInterval(timer);timer=null;
 const holder=document.createElement('div');holder.innerHTML=liveMatchBody(false);
 const container=document.querySelector('.live-modal .modal-head>div');
 const oldDetails=container.querySelector('.live-decisions'),wasOpen=oldDetails?.open;
 for(const selector of ['.live-head','.live-possession','.live-toolbar','.live-commentary','.live-decisions']){
  const old=container.querySelector(selector),next=holder.querySelector(selector);if(old&&next)old.replaceWith(next);
 }
 const details=container.querySelector('.live-decisions');if(details)details.open=wasOpen||match.paused&&!match.assistant&&['red','injury'].includes(match.pauseReason);
 container.querySelector('.decision-alert')?.remove();const alert=holder.querySelector('.decision-alert');if(alert)container.querySelector('.live-toolbar').before(alert);
 const stage=container.querySelector('.live-stage');stage.querySelector('.live-event')?.remove();const event=holder.querySelector('.live-event');if(event)stage.append(event);
 // Event emphasis is a label, never a white screen flash.
 stage.classList.remove('goal-celebration');syncLiveScene();
 if(!match.paused)startClock();
}
function updateLiveMatch(){if(!match||match.phase!=='live')return;const minute=document.querySelector('[data-live-minute]');if(!minute)return;minute.textContent=clockLabel(match.minute);const score=document.querySelector('[data-live-score]');if(score)score.textContent=`${match.homeGoals} : ${match.awayGoals}`;const comments=document.querySelector('#commentary');if(comments&&Number(comments.dataset.eventCount)!==match.events.length){comments.dataset.eventCount=match.events.length;comments.innerHTML=match.events.slice(-40).map(e=>`<div class="comment ${e.type}"><small>${clockLabel(e.minute)} ${e.team?html(clubName(e.team)):''}</small><br>${html(e.text)}</div>`).join('');comments.scrollTop=comments.scrollHeight}const value=possessionPercent(ensureMatchStats(match),5);const label=document.querySelector('.live-possession>small');if(label)label.textContent=match.minute?'Possession · Last '+Math.min(5,match.minute)+' mins':'Possession · Awaiting kick-off';document.querySelector('[data-pos-home]').textContent=value+'%';document.querySelector('[data-pos-away]').textContent=(100-value)+'%';document.querySelector('[data-pos-fill]').style.width=value+'%';syncLiveScene();}
function reportStatistics(r){if(!r.stats)return '';const home=r.homeId|| (r.home?career.clubId:r.opponent),away=r.awayId||(r.home?r.opponent:career.clubId),h=r.stats.home,a=r.stats.away,pos=possessionPercent(r.stats);return `<div class="match-statistics"><h3>Match statistics</h3>${r.stats.possessionStartMinute?`<p class="muted">Possession recorded from ${clockLabel(r.stats.possessionStartMinute)} after updating this saved match.</p>`:''}<div class="stat-team-head"><b>${html(clubName(home))}</b><b>${html(clubName(away))}</b></div>${[[pos+'%','Possession',100-pos+'%'],[h.shots,'Shots',a.shots],[h.onTarget,'On target',a.onTarget],[r.home?r.us:r.them,'Goals',r.home?r.them:r.us],[h.yellow,'Yellow cards',a.yellow],[h.red,'Red cards',a.red]].map(([x,label,y])=>`<div class="stat-comparison"><b>${x}</b><span>${label}</span><b>${y}</b></div>`).join('')}</div>`}
function reportHeadline(r){const best=r.playerOfMatch||r.performances.slice().sort((a,b)=>b.rating-a.rating)[0];return `<p class="report-highlight">${best?(r.playerOfMatch?'Player of the match: ':'Your standout: ')+html(player(best.id)?.name)+(best.clubId?' ('+html(clubName(best.clubId))+')':'')+' · '+Number(best.rating).toFixed(1):''}${r.home?' · '+Math.round(r.attendance/(r.usableCapacity||myClub().capacity)*100)+'% of available seats filled':''}</p>`}
function matchOverlay(){
 const other=opposition(match,career.clubId),home=match.home===career.clubId;
 let body='';
 if(match.phase==='choice')body=`<span class="eyebrow date-pill ${Date.now()<dateFlashUntil?'date-flash':''}">Matchday / ${fmtDate(career.date)} · ${career.time}</span><h2>${home?'Home at '+html(myClub().ground):'Away fixture'}</h2><div class="scoreline"><span>${html(clubName(match.home))}</span><strong>v</strong><span>${html(clubName(match.away))}</span></div><p>Watch with live decisions, or simulate for a quick result. Choose whether your assistant handles injuries, sending offs and routine substitutions.</p><label class="assistant-choice"><input type="checkbox" data-assistant-choice ${match.assistant?'checked':''}> Delegate in-match decisions to assistant manager</label>${!validLineup()?'<div class="empty-note">Your saved XI needs a fit replacement. Auto pick a fit side or review it before kick-off.</div>':''}<div class="modal-actions"><button class="btn primary arrow" data-action="watch-match">Watch match</button><button class="btn" data-action="simulate-match" ${!validLineup()?'disabled':''}>Simulate result</button><button class="btn" data-action="auto-lineup">Auto pick fit XI</button><button class="btn ghost" data-action="close-choice">Back to club</button></div>`;
 if(match.phase==='confirm')body=`<span class="eyebrow">Matchday / Lineup confirmation</span><h2>Pick your eleven</h2><p>Set your formation, play style, team orders and player instructions here before kick-off.</p><label class="assistant-choice"><input type="checkbox" data-assistant-choice ${match.assistant?'checked':''}> Delegate substitutions and sending offs to assistant manager</label>${lineupEditor(true)}<button class="btn ghost" data-action="choice-back" style="margin-top:12px">← Match options</button>`;
 if(match.phase==='live')body=liveMatchBody();
 if(match.phase==='report'){
  const report=career.reports.at(-1);body=`<span class="eyebrow">Full-time / ${fmtDate(report.date)}</span><h2>Match report card</h2><div class="scoreline"><span>${html(clubName(match.home))}</span><strong>${match.homeGoals} : ${match.awayGoals}</strong><span>${html(clubName(match.away))}</span></div>${reportHeadline(report)}${reportStatistics(report)}<div class="report-grid"><div><small>Attendance</small><strong>${report.attendance.toLocaleString('en-GB')}</strong></div><div><small>Ticket sales</small><strong>${fmtMoney(report.tickets)}</strong></div><div><small>Food & drink</small><strong>${fmtMoney(report.concessions)}</strong></div><div><small>Club shop</small><strong>${fmtMoney(report.shop)}</strong></div></div><p>Gross revenue: ${fmtMoney(report.tickets+report.concessions+report.shop)} · Operational costs: ${fmtMoney(report.operating)} · Net club match income: ${fmtMoney(report.income)}</p><div class="match-columns"><div><h3>Your players</h3><div class="report-list list">${report.performances.sort((a,b)=>(b.rating||0)-(a.rating||0)).map(x=>`<div class="row"><span><b>${html(player(x.id).name)}</b><br><small>${player(x.id).primary} · ${x.minutes} min · ${x.goals?x.goals+' goal'+(x.goals>1?'s':'')+' · ':''}${x.assists?x.assists+' assist'+(x.assists>1?'s':'')+' · ':''}${x.cards?'Card · ':''}${x.injuryDays?'Injured · ':''}Fit ${x.fitness}%</small></span><strong>${x.rating??'—'}</strong></div>`).join('')}</div></div><div><h3>Key moments</h3><div class="commentary">${report.events.filter(e=>['goal','yellow','red','injury','chance'].includes(e.type)).map(e=>`<div class="comment ${e.type}"><small>${clockLabel(e.minute)}</small><br>${html(e.text)}</div>`).join('')||'<div class="muted">A quiet game.</div>'}</div></div></div><div class="modal-actions"><button class="btn primary arrow" data-action="close-report">Continue career</button></div>`;
 }
 return `<div class="overlay" role="dialog" aria-modal="true" aria-label="Matchday"><div class="modal ${match.phase==='live'?'live-modal':''}">${home&&match.phase!=='live'?`<div class="match-ground" aria-label="Crowd at ${html(myClub().ground)}">${sceneSvg({...myClub(),colour:myColour()},career.site,true,match.kickoff>='17:30',true,career.stadium,null,{ambient:true,phase:['choice','confirm'].includes(match.phase)?'prematch':'idle'},career.construction||[])}<span>${html(myClub().ground)} · ${usableCapacity(career,myClub()).toLocaleString('en-GB')} seats</span></div>`:''}<div class="modal-head"><div style="flex:1">${body}</div></div></div></div>`;
}

function swapPlayers(a,b){let target=career.lineup.indexOf(b)>=0?career.lineup.indexOf(b):career.bench.indexOf(b)>=0?11+career.bench.indexOf(b):-1;let incoming=a;if(target<0){target=career.lineup.indexOf(a)>=0?career.lineup.indexOf(a):career.bench.indexOf(a)>=0?11+career.bench.indexOf(a):-1;incoming=b}if(target<0)return false;swapLineup(target,incoming);return true}
function swapLineup(target,id){
 if(!id||!Number.isInteger(target)||target<0||target>=18||owner(id)!==career.clubId)return;
 const list=target<11?career.lineup:career.bench,offset=target<11?target:target-11;
 const old=list[offset];const oldXi=career.lineup.indexOf(id),oldBench=career.bench.indexOf(id);
 if(oldXi>=0)career.lineup[oldXi]=old;
 if(oldBench>=0)career.bench[oldBench]=old;
 list[offset]=id;selectedPlayer=null;selectedSlot=null;save();render();
}
function setFormation(shape){
 if(!FORMATIONS[shape]||!career)return;
 career.formation=shape;
 selectedPlayer=null;selectedSlot=null;save();render();
}
function skipMatch(kind){
 if(!match||match.phase!=='live')return;
 clearTimeout(autoResumeTimer);
 const startEvents=match.events.length,stop=match.minute<45||match.minute===45&&!match.halfTimeTaken?45:95;
 match.paused=false;match.flash=null;
 while(match?.phase==='live'&&match.minute<stop){
  tickMatch(true);
  if(kind==='next'&&match.events.length>startEvents&&['goal','yellow','red','injury','chance'].includes(match.events.at(-1).type))break;
 }
 if(match?.phase==='live'){
  const last=match.events.at(-1);match.paused=true;match.pauseReason=['red','injury'].includes(last?.type)?last.type:'skip';
  if(match.minute===45&&!match.halfTimeTaken){match.halfTimeTaken=true;match.pauseReason='half';match.events.push({minute:45,type:'info',text:`Half-time. ${clubName(match.home)} ${match.homeGoals}–${match.awayGoals} ${clubName(match.away)}.`});}
 }
 save();render();
}
function substitute(index){
 if(!match||match.phase!=='live'||!selectedPlayer)return;
 const id=selectedPlayer;if(!match.bench.includes(id)){toast('Choose a bench player first.');return}
 if(match.subCount>=5){toast('You have used all five substitutions.');return}
 const outgoing=match.lineup[index];match.bench.splice(match.bench.indexOf(id),1);
 if(outgoing&&match.participants[outgoing])match.participants[outgoing].end=match.minute;
 match.lineup[index]=id;match.subCount++;match.participants[id]={start:match.minute,end:null};
 match.events.push({minute:match.minute,type:'info',text:`Substitution: ${player(id).name} ${outgoing?'replaces '+player(outgoing).name:'comes on'}.`});
 selectedPlayer=null;save();render();
}

root.addEventListener('click',event=>{
 if(suppressDragClick){suppressDragClick=false;return}
 const el=event.target.closest('[data-action]');if(!el)return;
 const action=el.dataset.action;
 if(action==='promote-youth'){const error=promoteProspect(career,source,el.dataset.id);if(error)toast(error);else{save();render();toast('Promoted to the first-team squad.')}}
 else if(action==='open-youth'){section='squad';sub='youth';render()}
 else if(action==='open-development'){section='squad';sub='development';render()}
 else if(action==='open-conversations'){section='squad';sub='conversations';render()}
 else if(action==='youth-invest'){const price=(career.youthFunding+1)*100000;if(career.youthFunding>=3||youthLevel(career,source)>=5||career.balance<price){toast('Funding is unavailable.');return}career.balance-=price;career.youthFunding++;career.news.push({date:career.date,kind:'youth',text:'Youth funding increased: stronger coaching now, with intake quality influenced next season.'});save();render()}
 else if(action==='conversation-reply'){const conversation=career.conversations.find(c=>c.key===el.dataset.key&&c.status==='new');if(!conversation)return;conversation.status=el.dataset.reply;if(conversation.type==='position'&&conversation.status==='agree'){career.players[conversation.id].positionTrial=conversation.position;career.players[conversation.id].trialMinutes=0;career.players[conversation.id].trialStartMinutes=0;career.players[conversation.id].reason='Pleased to have a trial in '+conversation.position+'.'}career.news.push({date:career.date,kind:'conversation',text:player(conversation.id).name+': '+(conversation.status==='agree'?'positional trial agreed.':conversation.status==='decline'?'positional request declined for now.':'retirement plans acknowledged.')});save();render()}
 else if(action==='register-senior'){const p=player(el.dataset.id);if(!p||!career.players[p.id].unregistered)return;if(!canRegister(career,source,p)){toast('Free an appropriate squad place first, for example by arranging a loan.');return}career.players[p.id].unregistered=false;save();render()}
 else if(action==='new-season'){if(nextFixture()||match||postMatchTable)return;const year=Number(career.seasonStart.slice(0,4))+1;rolloverDevelopment(career,source,year+'-08-13');advanceConstruction(career);career.schedule=scheduleSeason(year);career.reports=[];career.offers=[];career.time='09:00';career.transferList=career.transferList.filter(id=>!career.players[id]?.retired);const picks=bestLineup(career.clubId,career.formation);career.lineup=picks.lineup;career.bench=picks.bench;developmentDay(career,source,nextFixture());section='squad';sub='youth';save();render()}
 else if(action==='archived-report'){archivedReport=career.archives[Number(el.dataset.season)]?.reports[Number(el.dataset.report)];render()}
 else if(action==='new-game'){setup={clubId:'C01',site:'aberdeen',names:{},colour:null};view='setup';render()}
 else if(action==='continue'){if(load()){view='career';render()}}
 else if(action==='check-update')checkForUpdates();
 else if(action==='load-update'&&availableVersion){const url=new URL(location.href);url.searchParams.set('update',availableVersion);url.searchParams.set('t',Date.now());location.assign(url.href)}
 else if(action==='back-title'||action==='menu'){opponentOpen=false;instructionPlayer=null;view='title';render()}
 else if(action==='opponent'){opponentOpen=true;fixtureCursor=null;render()}
 else if(action==='close-opponent'){opponentOpen=false;render()}
 else if(action==='fixture-step'){const at=clubFixtures().findIndex(f=>f.homeGoals===null);fixtureCursor=Math.max(0,Math.min(clubFixtures().length-1,(fixtureCursor??(at<0?clubFixtures().length-1:at))+Number(el.dataset.step)));render()}
 else if(action==='calendar-fixture'){fixtureCursor=Number(el.dataset.index);if(clubFixtures()[fixtureCursor].homeGoals!==null)reportIndex=fixtureCursor;else opponentOpen=true;render()}
 else if(action==='open-report'){reportIndex=Number(el.dataset.index);opponentOpen=false;render()}
 else if(action==='close-history'){reportIndex=null;archivedReport=null;render()}
 else if(action==='choose-club'){setup.clubId=el.dataset.id;setup.colour=null;if(!availableSites(club(setup.clubId)).some(x=>x[0]===setup.site))setup.site='aberdeen';render()}
 else if(action==='rename-all'){setup.showNames=!setup.showNames;render()}
 else if(action==='colour'){setup.colour=el.dataset.colour;render()}
 else if(action==='site'){if(availableSites(club(setup.clubId)).some(x=>x[0]===el.dataset.site))setup.site=el.dataset.site;render()}
 else if(action==='start-season')newCareer();
 else if(action==='section'){section=el.dataset.section;sub=section==='organiser'?'table':'lineup';editing=null;instructionPlayer=null;opponentOpen=false;render()}
 else if(action==='open-designer'){editing=normaliseLayout(career.stadium,myClub());selectedStands=new Set([selectedStand]);sub='designer';render()}
 else if(action==='select-stand'){selectedStand=el.dataset.id;selectedStands=new Set([selectedStand]);render()}
 else if(action==='toggle-stand'){const id=el.dataset.id;if(selectedStands.has(id)){if(selectedStands.size>1)selectedStands.delete(id)}else selectedStands.add(id);selectedStand=selectedStands.has(id)?id:[...selectedStands][0];render()}
 else if(action==='select-scope'){const key=el.dataset.scope;selectedStands=new Set(SECTIONS.filter(s=>key==='all'||key==='corners'&&s.corner||s.side===key).map(s=>s.id));selectedStand=[...selectedStands][0];render()}
 else if(action==='cancel-stadium'){editing=null;sub='lineup';render()}
 else if(action==='commit-stadium'){if(!editing)return;const newCap=capacity(editing,myClub());if(newCap<10000||newCap>siteLimit(career.site)){toast('Check the proposed capacity first.');return}const error=startConstruction(career,myClub(),editing);if(error){toast(error);return}editing=null;sub='lineup';save();render();toast('Stadium work scheduled. Affected sections are closed until completion.')}

 else if(action==='sub'){sub=el.dataset.sub;instructionPlayer=null;render()}
 else if(action==='open-offers'){section='squad';sub='transfers';render()}
 else if(action==='reset-transfer-filters'){transferFilters=blankTransferFilters();transferLimit=50;render()}
 else if(action==='more-transfer-results'){transferLimit+=50;refreshTransferResults()}
 else if(action==='list-player'){const id=el.dataset.id;if(career.transferList.includes(id))career.transferList=career.transferList.filter(x=>x!==id);else{career.transferList.push(id);career.players[id].request=null}save();render()}
 else if(action==='player-instructions'||action==='player-happiness'||action==='focus-player'){instructionPlayer=el.dataset.player;instructionAnchorType=el.closest?.('.profile-row')?'profile-row':el.closest?.('.player-card')?'player-card':'shirt-slot';section='squad';if(sub!=='profiles')sub='lineup';render()}
 else if(action==='close-player-panel'){instructionPlayer=null;render()}
 else if(action==='offer-loan'){
  const id=el.dataset.player,p=player(id),dest=rand(source.clubs.filter(c=>c.id!==career.clubId&&squadPlayers(c.id).length<28));
  if(!p||owner(id)!==career.clubId||career.loans[id])return;
  if(squadPlayers(career.clubId).length<=18||!dest){toast('You need at least 18 players and an available loan club.');return}
  career.loans[id]={parent:career.clubId,to:dest.id,season:career.schedule.at(-1).date};career.owners[id]=dest.id;
  career.players[id].happiness=Math.min(95,career.players[id].happiness+18);career.players[id].request=null;career.players[id].reason=`Pleased to join ${clubName(dest.id)} on loan.`;
  career.transferList=career.transferList.filter(x=>x!==id);instructionPlayer=null;
  const picks=bestLineup(career.clubId,career.formation);career.lineup=picks.lineup;career.bench=picks.bench;
  career.news.push({date:career.date,text:`${p.name} joins ${clubName(dest.id)} on loan until the end of the season.`});save();render();toast(`${p.name} joins ${clubName(dest.id)} on loan.`)
 }
 else if(action==='stats-scope'){statsScope=el.dataset.scope;render()}
 else if(action==='stats-sort'){statsDescending=statsSort===el.dataset.sort?!statsDescending:true;statsSort=el.dataset.sort;render()}
 else if(action==='inquire'){const p=player(el.dataset.id);toast(`${clubName(owner(p.id))} value ${p.name} around ${fmtMoney(transferValue(p))}.`)}
 else if(action==='bid'){const p=player(el.dataset.id),fee=Math.round(transferValue(p)*1.1/10000)*10000;if(career.balance<fee){toast(`You need ${fmtMoney(fee)} to make this bid.`);return}if(!canRegister(career,source,p)){toast('All 24 senior squad places are occupied.');return}if(squadPlayers(owner(p.id)).length<=18){toast('That club needs to keep enough players for its matchday squad.');return}if(Math.random()<.65||career.transferList.includes(p.id)){resolveTransfer(p.id,career.clubId,fee);toast(`${p.name} joins your club for ${fmtMoney(fee)}.`)}else{career.offers.push({id:p.id,clubId:owner(p.id),fee:Math.round(fee*1.2/10000)*10000,status:'counter',incoming:true});career.news.push({date:career.date,text:`${clubName(owner(p.id))} countered your bid for ${p.name}.`});save();render();toast('The selling club has countered your offer.')}}
 else if(['accept-offer','counter-offer','reject-offer'].includes(action)){const id=el.dataset.id,clubId=el.dataset.club,o=career.offers.find(x=>x.id===id&&x.clubId===clubId&&(x.status==='new'||x.status==='counter'));if(!o)return;if(action==='reject-offer'){o.status='rejected';save();render();return}if(action==='counter-offer'){if(o.incoming){toast('The selling club is waiting on your decision.');return}o.fee=Math.round(o.fee*1.2/10000)*10000;o.status='pending';save();render();toast(`Counter proposal sent: ${fmtMoney(o.fee)}.`);return}if(o.incoming){if(career.balance<o.fee){toast('Your club cannot afford that fee.');return}if(!canRegister(career,source,player(id))){toast('All 24 senior squad places are occupied.');return}resolveTransfer(id,career.clubId,o.fee)}else{if(squadPlayers(career.clubId).length<=18){toast('Keep at least 18 players in your squad.');return}resolveTransfer(id,clubId,o.fee)}}
 else if(action==='medical-invest'){const kind=el.dataset.kind,level=career.medical[kind],cost=(level+1)*(kind==='prevention'?150000:120000);if(!['prevention','recovery'].includes(kind)||level>=3||career.balance<cost)return;career.balance-=cost;career.medical[kind]++;career.news.push({date:career.date,text:`Medical ${kind} funded to level ${career.medical[kind]} for ${fmtMoney(cost)}.`});save();render()}
 else if(action==='toggle-squad-list'){if(el.dataset.list==='bench')benchExpanded=!benchExpanded;else reservesExpanded=!reservesExpanded;career.ui={benchExpanded,reservesExpanded};save();render()}
 else if(action==='close-table'){postMatchTable=false;section='hub';save();render()}
 else if(action==='advance')advance();
 else if(action==='auto-lineup'){const picks=bestLineup(career.clubId,career.formation);career.lineup=picks.lineup;career.bench=picks.bench;save();render()}
 else if(action==='auto-subs'){career.bench=pickBalancedBench(squadPlayers(career.clubId).filter(p=>!career.lineup.includes(p.id)),7);save();render();toast('Substitutes picked with goalkeeper, defensive, midfield and attacking cover.')}
 else if(action==='formation'){setFormation(el.dataset.value)}
 else if(action==='style'){career.style=el.dataset.value;save();render()}
 else if(action==='order'){career.order=el.dataset.value;save();render()}
 else if(action==='select-player'){const id=el.dataset.player;if(selectedSlot!==null)swapLineup(selectedSlot,id);else if(selectedPlayer&&selectedPlayer!==id&&swapPlayers(selectedPlayer,id)){}else{selectedPlayer=id;render()}}
 else if(action==='slot'){const at=Number(el.dataset.index);if(selectedPlayer)swapLineup(at,selectedPlayer);else{selectedSlot=at;render()}}
 else if(action==='close-choice'){match=null;career.time='09:00';save();render()}
 else if(action==='choice-back'){match.phase='choice';save();render()}
 else if(action==='watch-match')beginMatch('watch');
 else if(action==='simulate-match')beginMatch('simulate');
 else if(action==='confirm-lineup'){if(!validLineup()){toast('Complete your XI and bench, including a fit goalkeeper.');return}match.lineup=[...career.lineup];match.bench=[...career.bench];match.participants=Object.fromEntries(match.lineup.map(id=>[id,{start:0,end:null}]));match.phase='live';ensureMatchStats(match);career.time=match.kickoff||'15:00';match.events.push({minute:0,type:'info',text:'Kick-off! The match is underway.'});save();render()}
 else if(action==='toggle-assistant'){if(!match||match.phase!=='live')return;match.assistant=!match.assistant;if(!match.assistant){clearTimeout(autoResumeTimer);if(match.paused&&['red','injury'].includes(match.pauseReason))match.pauseReason='manual';else match.paused=true}match.events.push({minute:match.minute,type:'info',text:match.assistant?'Assistant manager now handles substitutions and sending offs.':'You have taken control of match decisions.'});save();render()}
 else if(action==='speed'){match.speed=Number(el.dataset.speed);save();render()}
 else if(action==='sim-next')skipMatch('next');
 else if(action==='sim-half')skipMatch('half');
 else if(action==='pause-match'){clearTimeout(autoResumeTimer);match.paused=true;match.pauseReason='manual';save();render()}
 else if(action==='resume-match'){clearTimeout(autoResumeTimer);match.paused=false;match.flash=null;save();render()}
 else if(action==='finish-sim'){match.paused=false;while(match&&match.phase==='live'&&match.minute<96)tickMatch(true);if(match?.phase!=='report')finishMatch();save();render()}
 else if(action==='match-bench'){selectedPlayer=el.dataset.player;render()}
 else if(action==='match-replace')substitute(Number(el.dataset.index));
 else if(action==='close-report'){match=null;postMatchTable=true;save();render()}
});
root.addEventListener('input',event=>{if(event.target.matches('[data-transfer-filter]'))handleTransferFilter(event.target)});
root.addEventListener('change',event=>{
 const el=event.target;
 if(handleTransferFilter(el))return;
 if(el.dataset.hotPlayer){const id=el.dataset.hotPlayer;career.hotList??=[];career.hotList=el.checked?[...new Set([...career.hotList,id])]:career.hotList.filter(x=>x!==id);save();refreshTransferResults();return}
 if(el.dataset.stadiumField){if(!editing)return;for(const id of selectedStands){editing.sections[id][el.dataset.stadiumField]=el.value;if(editing.sections[id].stand==='empty')editing.sections[id].roof='none'}render()}
 else if(el.dataset.squadFormation!==undefined){setFormation(el.value)}
 else if(el.dataset.squadStyle!==undefined){career.style=el.value;save();render()}
 else if(el.dataset.squadOrder!==undefined){career.order=el.value;save();render()}
 else if(el.dataset.playerOrder){career.players[el.dataset.playerOrder].instruction=el.value;save();render()}
 else if(el.id==='clubRename'){setup.names[setup.clubId]=el.value.trim().slice(0,32)||club(setup.clubId).name;render()}
 else if(el.dataset.rename){setup.names[el.dataset.rename]=el.value.trim().slice(0,32)||club(el.dataset.rename).name;render()}
 else if(el.id==='customColour'){setup.colour=el.value;render()}
 else if(el.dataset.assistantChoice!==undefined){match.assistant=el.checked;save();render()}
 else if(el.dataset.matchSetting){if(el.dataset.matchSetting==='formation'){if(match?.phase==='live'){career.formation=el.value;save();render()}else setFormation(el.value);return}career[el.dataset.matchSetting]=el.value;save();render()}
});
root.addEventListener('dragstart',event=>{const card=event.target.closest('[data-player]');if(!card?.draggable)return;event.dataTransfer.setData('text/plain',card.dataset.player);const ghost=card.querySelector('.shirt')?.cloneNode(true);if(ghost){ghost.classList.add('drag-preview');document.body.appendChild(ghost);event.dataTransfer.setDragImage(ghost,20,20);setTimeout(()=>ghost.remove(),0)}});
root.addEventListener('dragover',event=>{const slot=event.target.closest('[data-drop-slot],[data-drop-player]');if(slot)event.preventDefault();if(dragTarget!==slot){dragTarget?.classList.remove('drop-highlight');dragTarget=slot;dragTarget?.classList.add('drop-highlight')}});
root.addEventListener('dragleave',event=>{if(!event.relatedTarget?.closest?.('[data-drop-slot],[data-drop-player]')){dragTarget?.classList.remove('drop-highlight');dragTarget=null}});
root.addEventListener('dragend',()=>{dragTarget?.classList.remove('drop-highlight');dragTarget=null});
root.addEventListener('drop',event=>{const slot=event.target.closest('[data-drop-slot],[data-drop-player]');dragTarget?.classList.remove('drop-highlight');dragTarget=null;if(!slot)return;event.preventDefault();const id=event.dataTransfer.getData('text/plain');if(slot.dataset.dropSlot!==undefined)swapLineup(Number(slot.dataset.dropSlot),id);else swapPlayers(id,slot.dataset.dropPlayer)});
root.addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&event.target.matches('.shirt-slot[role="button"],.player-card[role="button"],.designer-hit[role="button"]')){event.preventDefault();event.target.click()}});
root.addEventListener('pointerdown',event=>{if(event.target.closest('.slot-tool'))return;const card=event.target.closest('.player-card[data-player],.shirt-slot[data-player]');if(!card?.dataset.player)return;activeDrag={id:card.dataset.player,x:event.clientX,y:event.clientY,moved:false}});
document.addEventListener('pointermove',event=>{
 if(!activeDrag)return;
 if(!activeDrag.moved&&Math.hypot(event.clientX-activeDrag.x,event.clientY-activeDrag.y)<9)return;
 if(!activeDrag.moved&&Math.abs(event.clientY-activeDrag.y)>Math.abs(event.clientX-activeDrag.x)*1.5){activeDrag=null;return}
 event.preventDefault();
 activeDrag.moved=true;
 if(!dragGhost){dragGhost=document.createElement('div');dragGhost.className='touch-drag-ghost';dragGhost.innerHTML=shirt(player(activeDrag.id));document.body.appendChild(dragGhost)}
 dragGhost.style.left=`${event.clientX}px`;dragGhost.style.top=`${event.clientY}px`;
 const slot=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-drop-slot],[data-drop-player]');
 if(slot!==dragTarget){dragTarget?.classList.remove('drop-highlight');dragTarget=slot;dragTarget?.classList.add('drop-highlight')}
});
document.addEventListener('pointerup',()=>{
 if(!activeDrag)return;
 const slot=dragTarget,id=activeDrag.id,moved=activeDrag.moved;
 dragGhost?.remove();dragGhost=null;dragTarget?.classList.remove('drop-highlight');dragTarget=null;activeDrag=null;
 if(moved){suppressDragClick=true;setTimeout(()=>suppressDragClick=false,80);if(slot){if(slot.dataset.dropSlot!==undefined)swapLineup(Number(slot.dataset.dropSlot),id);else swapPlayers(id,slot.dataset.dropPlayer)}}
});

render();

if('serviceWorker' in navigator&&location.protocol==='https:')window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').then(reg=>reg.update()).catch(()=>{}));
