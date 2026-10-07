// Football order is deliberately independent of alphabetical position names.
export const POSITION_ORDER=['GK','LB','CB','RB','LWB','RWB','DM','CM','LM','RM','AM','LW','RW','CF','ST'];
export const positionRank=pos=>{const i=POSITION_ORDER.indexOf(pos);return i<0?99:i};
export const comparePositions=(a,b)=>positionRank(a.primary)-positionRank(b.primary)||b.overall-a.overall||a.name.localeCompare(b.name);
const after=(s,n)=>new Date(Date.parse(s+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
export function seasonSchedule(ids,year=2026,season=1){
 if(ids.length!==12||new Set(ids).size!==12)throw new Error('Premier Division requires 12 clubs');
 const rotation=[...ids],legs=[];
 for(let r=0;r<11;r++){
  legs.push(Array.from({length:6},(_,i)=>[rotation[i],rotation[11-i]]));
  rotation.splice(1,0,rotation.pop());
 }
 let start=`${year}-08-15`;start=after(start,(6-new Date(start+'T12:00:00Z').getUTCDay()+7)%7);
 // Thirty-three Saturdays across August–May, including a winter break.
 const breaks=new Set([6,12,18,19,25,30,35]);let week=0;
 return Array.from({length:33},(_,round)=>{
  while(breaks.has(week))week++;
  const cycle=Math.floor(round/11),r=round%11,date=after(start,week++*7);
  return {date,fixtures:legs[r].map(([a,b],i)=>{
   let reverse=(r%2===0)!==(cycle===0);
   if(cycle===2){const ia=ids.indexOf(a),ib=ids.indexOf(b),d=(ib-ia+12)%12;const aHome=d<6||(d===6&&ia<ib);reverse=!aHome;if(season%2===0)reverse=!reverse;}
   return {home:reverse?b:a,away:reverse?a:b,kickoff:['15:00','17:30','19:45'][(r+i+cycle)%3],homeGoals:null,awayGoals:null};
  })};
 });
}
export function extendSeason(career,ids){
 if(career.schedule?.length!==22)return false;
 const counts=new Map();for(const r of career.schedule)for(const f of r.fixtures){const k=[f.home,f.away].sort().join(':');counts.set(k,(counts.get(k)||0)+1)}
 if(counts.size!==66||[...counts.values()].some(n=>n!==2))return false;
 const year=Number((career.seasonStart||career.schedule[0].date).slice(0,4));
 const extra=seasonSchedule(ids,year,career.season||1).slice(22);
 // Preserve every existing fixture/date/result, including an active match.
 let latest=[career.date,career.schedule.at(-1).date].sort().at(-1);
 for(const round of extra){if(round.date<=latest)round.date=after(latest,7);latest=round.date;}
 career.schedule.push(...extra);return true;
}
export function monthDays(month){
 const first=new Date(month+'-01T12:00:00Z'),offset=(first.getUTCDay()+6)%7;
 const days=new Date(Date.UTC(first.getUTCFullYear(),first.getUTCMonth()+1,0)).getUTCDate();
 return Array.from({length:Math.ceil((offset+days)/7)*7},(_,i)=>after(month+'-01',i-offset));
}
export function shiftMonth(month,delta){const d=new Date(month+'-01T12:00:00Z');d.setUTCMonth(d.getUTCMonth()+delta);return d.toISOString().slice(0,7)}
export function calendarEvents(career){
 const events=new Map(),add=(date,event)=>{if(!date)return;if(!events.has(date))events.set(date,[]);events.get(date).push(event)};
 let index=0;
 for(const r of career.schedule)for(const f of r.fixtures)if(f.home===career.clubId||f.away===career.clubId)add(r.date,{kind:'fixture',fixture:f,index:index++});
 for(const n of career.news||[])if(['development','youth','scouting','training','wages','stadium'].includes(n.kind))add(n.date,{kind:n.kind==='wages'?'wages':n.kind==='stadium'?'stadium':'report',news:n});
 for(const job of career.construction||[])add(job.opens,{kind:'stadium',opening:true});
 const first=career.schedule[0]?.date,last=career.schedule.at(-1)?.date;
 if(first&&last)for(let date=first;date<=last;date=after(date,1))if(date>=career.date&&new Date(date+'T12:00:00Z').getUTCDay()===1&&!events.get(date)?.some(e=>e.kind==='wages'))add(date,{kind:'wages',planned:true});
 return events;
}
