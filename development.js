import {facilityLevel} from './club-investment.js?v=1.51.0';
import {trainingDevelopmentFactor} from './training.js?v=1.51.0';
// Career-owned youth and development data; saved with the existing career.
const POS=['GK','LB','CB','RB','DM','CM','AM','LW','RW','ST'];
const SECOND={LB:'CB',RB:'CB',CB:'DM',DM:'CM',CM:'AM',AM:'CM',LW:'RW',RW:'LW',ST:'AM'};
const FIRST=['Euan','Rory','Callum','Lewis','Rhys','Dylan','Cian','Finn','Owen','Max','Adam','Harris','Idris','Nico','Sam','Jamie','Aidan','Leon','Ben','Aaron','Kieran','Iwan','Ryan','Toby','Jude','Alex','Yusuf','Joel','Daniel','Cameron'];
const LAST=['MacLeod','Fraser','Robertson','Sinclair','Reid','Grant','Murray','Evans','Morgan','Davies','Williams','Hughes','O’Brien','Gallagher','Byrne','Walsh','Murphy','Kelly','Clarke','Bennett','Brooks','Walker','Turner','Patel','Ahmed','Campbell','Stewart','Baxter','Cole','Sutherland'];
const TRAITS=['Composed','Hard worker','Quick feet','Team player','Determined','Creative','Strong in the air'];
const PERSONAL=['Patient','Ambitious','Club loyal','Competitive','Quietly determined'];
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const elapsed=(a,b)=>Math.floor((Date.parse(b+'T12:00:00Z')-Date.parse(a+'T12:00:00Z'))/86400000);
const pick=(a,rng)=>a[Math.floor(rng()*a.length)];
function seeded(seed){let n=2166136261;for(const c of seed)n=Math.imul(n^c.charCodeAt(0),16777619);return ()=>{n+=0x6D2B79F5;let t=Math.imul(n^n>>>15,1|n);t^=t+Math.imul(t^t>>>7,61|t);return ((t^t>>>14)>>>0)/4294967296}}
export function youthLevel(c,league){return clamp((league.clubs.find(x=>x.id===c.clubId)?.youth||1)+(c.youthFunding||0)*.5,1,5)}
export function estimatedStars(rating){return rating>=90?5:Math.min(4.5,Math.round(clamp((rating-40)/10,.5,4.5)*2)/2)}
export function squadSpace(c,league){const active=league.players.filter(p=>(c.owners[p.id]||p.clubId)===c.clubId&&!c.players[p.id]?.retired&&!c.players[p.id]?.unregistered);const development=active.filter(p=>c.developmentIds.includes(p.id)&&p.age<20);return {senior:active.length-development.length,development:development.length,total:active.length}}
export function canRegister(c,league,p){const s=squadSpace(c,league);return c.developmentIds.includes(p.id)&&p.age<20?s.development<5:s.senior<24}
export function initialiseDevelopment(c,league){
 c.season??=1;c.seasonStart??=c.date||'1998-08-03';c.youthFunding??=0;c.trainingFunding??=0;c.generatedPlayers??=[];c.playerChanges??={};c.developmentIds??=[];c.prospects??=[];c.developmentReports??=[];c.conversations??=[];c.archives??=[];
 for(const p of c.generatedPlayers)if(!league.players.some(x=>x.id===p.id))league.players.push(structuredClone(p));
 for(const [id,changes]of Object.entries(c.playerChanges)){const p=league.players.find(x=>x.id===id);if(p)Object.assign(p,structuredClone(changes))}
 for(const p of league.players)c.players[p.id]??={fitness:p.fitness,form:[],happiness:70,instruction:'Standard',reason:'Content with their squad role.'};
 if(c.intakeSeason!==c.season)generateIntake(c,league);
 c.lastReportRatings??=Object.fromEntries(league.players.map(p=>[p.id,p.overall]));
 c.lastReportPositions??=Object.fromEntries(league.players.map(p=>[p.id,structuredClone(p.positions)]));
}
export function generateIntake(c,league){
 const rng=seeded(`${c.clubId}:${c.season}:${c.youthSeed??(c.youthSeed=Math.random().toString(36).slice(2))}`),level=youthLevel(c,league);
 const used=new Set([...league.players,...c.prospects].map(p=>p.name));
 // Retain last year's unpromoted prospects until age 20; show only the top five.
 const candidates=c.prospects.filter(p=>!p.promoted&&p.age<20);
 for(let i=0;i<8;i++){
  let name;do{name=pick(FIRST,rng)+' '+pick(LAST,rng)}while(used.has(name));used.add(name);
  const primary=pick(POS,rng),age=16+Math.floor(rng()*3),overall=Math.round(clamp(40+level*3+rng()*18+(age-16)*2,40,73));
  const exceptional=rng()<.004+level*.001,potential=Math.round(clamp(exceptional?90+rng()*4:overall+10+level*1.8+rng()*12,overall,exceptional?94:89));
  const secondary=SECOND[primary]||null,positions=Object.fromEntries(POS.map(pos=>[pos,pos===primary?overall:pos===secondary?Math.round(overall*.8):Math.round(overall*.45)]));
  candidates.push({id:`Y${c.clubId}-${c.season}-${i}`,clubId:c.clubId,name,age,primary,secondary,overall,potential,positions,risk:1+Math.floor(rng()*4),fitness:95,contract:3,wage:(100+overall*6),number:25+i,traits:[pick(TRAITS,rng)],personality:pick(PERSONAL,rng),academy:true,form:6.3+rng()*1.5,progress:0,intake:c.season,report:'New intake: assessment will improve as they play youth matches.'});
 }
 c.prospects=candidates.sort((a,b)=>(b.potential*.55+b.overall*.45)-(a.potential*.55+a.overall*.45)).slice(0,5);c.intakeSeason=c.season;
 c.news.push({date:c.date,kind:'youth',text:'Youth intake: your five leading prospects are ready for assessment in Squad → Youth.'});
}
export function promoteProspect(c,league,id){
 const prospect=c.prospects.find(p=>p.id===id);if(!prospect||prospect.promoted)return 'That prospect is no longer available.';
 const s=squadSpace(c,league);if(prospect.age<20?s.development>=5:s.senior>=24)return prospect.age<20?'All five under-20 development places are occupied.':'All 24 senior places are occupied.';
 const p=structuredClone(prospect);p.academy=false;p.promoted=true;p.number=Math.max(24,...league.players.filter(x=>(c.owners[x.id]||x.clubId)===c.clubId).map(x=>x.number||0))+1;
 prospect.promoted=true;c.generatedPlayers.push(p);league.players.push(structuredClone(p));if(p.age<20)c.developmentIds.push(id);
 c.players[id]={fitness:95,form:[],happiness:85,instruction:'Standard',reason:'Delighted to earn a first-team opportunity.'};
 c.news.push({date:c.date,kind:'youth',text:`${p.name} promoted to the first-team squad. Their confirmed overall is ${p.overall}.`});return null;
}
function persist(c,p){c.playerChanges[p.id]={...(c.playerChanges[p.id]||{}),age:p.age,overall:p.overall,potential:p.potential,positions:structuredClone(p.positions)}}
export function developmentDay(c,league,next){
 const days=elapsed(c.seasonStart,c.date),rng=seeded(c.clubId+':'+c.date+':progress');
 if(days>0&&days%7===0&&c.lastDevelopmentDay!==c.date){
  const trainingFactor=trainingDevelopmentFactor(c,league,next);
  c.lastDevelopmentDay=c.date;
  for(const p of league.players.filter(x=>(c.owners[x.id]||x.clubId)===c.clubId&&!c.players[x.id]?.retired)){
   const state=c.players[p.id],form=state.form.slice(-5),average=form.length?form.reduce((a,b)=>a+b,0)/form.length:6.5;
   const young=p.age<=24&&p.overall<p.potential;const change=young?(state.injuryDays||state.unregistered?0:(.04+facilityLevel(c,league)*.01+Math.max(0,average-6.4)*.055+(form.length?.025:0))*trainingFactor):p.age>=32?-.055-Math.max(0,6-average)*.035:0;
   state.developmentProgress=(state.developmentProgress||0)+change;
   if(Math.abs(state.developmentProgress)>=1){const delta=Math.sign(state.developmentProgress);p.overall=clamp(p.overall+delta,40,p.potential);for(const pos of POS)p.positions[pos]=pos===p.primary?p.overall:clamp(p.positions[pos]+delta,10,p.overall);state.developmentProgress-=delta;persist(c,p)}
   if(state.positionTrial){const pos=state.positionTrial,used=(state.trialMinutes||0)-(state.trialStartMinutes||0);if(used>=180){p.positions[pos]=Math.max(p.positions[pos],Math.min(Math.round(p.overall*.9),p.positions[pos]+1));state.trialStartMinutes=state.trialMinutes||0;persist(c,p)}}
  }
  for(const p of c.prospects.filter(x=>!x.promoted)){
   p.form=clamp(p.form+(rng()-.42)*.55,5,9);p.progress+=.08+youthLevel(c,league)*.015+Math.max(0,p.form-7)*.06;
   if(p.progress>=1&&p.overall<p.potential){p.overall++;p.positions[p.primary]=p.overall;p.progress-=1}
   p.report=p.form>=7.3?'Consistently strong youth performances. Worth monitoring for a first-team opportunity.':p.form>=6.5?'Developing steadily; continue assessing their readiness.':'Still finding consistency. More time in the youth side is advised.';
  }
 }
 if(days>0&&days%21===0&&c.lastYouthReport!==c.date){c.lastYouthReport=c.date;const standout=c.prospects.filter(p=>!p.promoted&&p.form>=7.3).sort((a,b)=>b.form-a.form)[0];if(standout)c.news.push({date:c.date,kind:'youth',text:`Youth watch: ${standout.name} (${standout.primary}) is playing well. The youth coaches recommend monitoring their progress in Squad → Youth.`})}
 if(next&&elapsed(c.date,next.date)===3&&!c.developmentReports.some(r=>r.fixture===next.date)){
  const rows=league.players.filter(p=>(c.owners[p.id]||p.clubId)===c.clubId&&!c.players[p.id]?.retired).sort((a,b)=>POS.indexOf(a.primary)-POS.indexOf(b.primary)).map(p=>{const previous=c.lastReportRatings?.[p.id]??p.overall;const delta=p.overall-previous;return {id:p.id,name:p.name,position:p.primary,rating:p.overall,delta,positionChanges:POS.filter(pos=>p.positions[pos]!==c.lastReportPositions?.[p.id]?.[pos]&&c.lastReportPositions?.[p.id]?.[pos]!==undefined).map(pos=>`${pos}: ${p.positions[pos]-c.lastReportPositions[p.id][pos]>0?'+':''}${p.positions[pos]-c.lastReportPositions[p.id][pos]}`),reason:delta>0?'Progress from age, coaching and match experience.':delta<0?'Gradual age-related regression; recent form also considered.':'No confirmed attribute change since the last report.'}});
  c.developmentReports.push({date:c.date,fixture:next.date,rows});c.developmentReports=c.developmentReports.slice(-24);c.lastReportRatings=Object.fromEntries(rows.map(r=>[r.id,r.rating]));c.lastReportPositions=Object.fromEntries(league.players.map(p=>[p.id,structuredClone(p.positions)]));
  c.news.push({date:c.date,kind:'development',text:'Squad development report available: review progress by position in Squad → Development.'});
 }
 if(days>0&&days%28===0&&c.lastConversationDay!==c.date){
  c.lastConversationDay=c.date;const active=league.players.filter(p=>(c.owners[p.id]||p.clubId)===c.clubId&&!c.players[p.id]?.retired);
  const veteran=active.find(p=>p.age>=33&&!c.players[p.id].retirementAfterSeason&&!c.conversations.some(x=>x.id===p.id&&x.type==='retirement'));
  const candidate=active.filter(p=>p.secondary&&p.positions[p.secondary]/p.overall<.9&&!c.players[p.id].positionTrial&&!c.conversations.some(x=>x.id===p.id&&x.type==='position'));
  const p=veteran||candidate[Math.floor(rng()*candidate.length)];if(p){const type=veteran?'retirement':'position';if(veteran)c.players[p.id].retirementAfterSeason=c.season+1;c.conversations.push({key:`${c.season}-${days}`,id:p.id,type,position:p.secondary,date:c.date,status:'new',text:veteran?'I plan to make next season my last before retiring.':'I would like a chance to develop in '+p.secondary+'. Could we try it over time?'});c.news.push({date:c.date,kind:'conversation',text:`${p.name} wants to speak about ${veteran?'retirement plans':'trying another position'}. Open Squad → Conversations.`})}
 }
}
export function rolloverDevelopment(c,league,newStart){
 c.archives.push({season:c.season,reports:structuredClone(c.reports),schedule:structuredClone(c.schedule)});
 for(const [id,loan]of Object.entries(c.loans)){c.owners[id]=loan.parent;}c.loans={};
 for(const p of league.players){p.age++;const state=c.players[p.id];if(state.retirementAfterSeason&&c.season>=state.retirementAfterSeason){state.retired=true;c.news.push({date:newStart,text:`${p.name} has retired after their final season.`})}persist(c,p)}
 // Registration is checked again after loans return and players age out.
 let senior=0,junior=0;
 const priority=new Set([...c.lineup,...c.bench]);
 const owned=league.players.filter(p=>(c.owners[p.id]||p.clubId)===c.clubId&&!c.players[p.id].retired).sort((a,b)=>Number(priority.has(b.id))-Number(priority.has(a.id)));
 for(const p of owned){const development=c.developmentIds.includes(p.id)&&p.age<20,available=development?junior<5:senior<24;c.players[p.id].unregistered=!available;if(available){if(development)junior++;else senior++}if(!available)c.news.push({date:newStart,text:`${p.name} needs a free ${development?'under-20 development':'senior'} place before they can play. Arrange a loan or free a place in the squad.`});else if(c.developmentIds.includes(p.id)&&p.age===20)c.news.push({date:newStart,text:`${p.name} has turned 20 and now occupies a senior squad place.`})}

 for(const p of c.prospects)if(!p.promoted)p.age++;
 c.season++;c.seasonStart=newStart;c.date=newStart;c.lastReportRatings=Object.fromEntries(league.players.map(p=>[p.id,p.overall]));c.lastReportPositions=Object.fromEntries(league.players.map(p=>[p.id,structuredClone(p.positions)]));c.stats={};for(const state of Object.values(c.players)){state.form=[];state.positionTrial=null;state.fitness=Math.max(90,state.fitness)}
 generateIntake(c,league);
}
