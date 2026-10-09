import {bookingWindow} from './club-events.js?v=1.55.0';
// Football order is deliberately independent of alphabetical position names.
export const POSITION_ORDER=['GK','LB','CB','RB','LWB','RWB','DM','CM','LM','RM','AM','LW','RW','CF','ST'];
export const positionRank=pos=>{const i=POSITION_ORDER.indexOf(pos);return i<0?99:i};
export const comparePositions=(a,b)=>positionRank(a.primary)-positionRank(b.primary)||b.overall-a.overall||a.name.localeCompare(b.name);
const after=(s,n)=>new Date(Date.parse(s+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
export function seasonSchedule(ids,year=1998,season=1){
 if(ids.length<4||ids.length%2||new Set(ids).size!==ids.length)throw new Error('League requires an even number of unique clubs');
 const n=ids.length,rotation=[...ids],legs=[];
 for(let r=0;r<n-1;r++){
  legs.push(Array.from({length:n/2},(_,i)=>r%2?[rotation[n-1-i],rotation[i]]:[rotation[i],rotation[n-1-i]]));
  rotation.splice(1,0,rotation.pop());
 }
 let start=`${year}-08-15`;start=after(start,(6-new Date(start+'T12:00:00Z').getUTCDay()+7)%7);
 // Two meetings per opponent, with midweek rounds and international/holiday gaps.
 const offsets=[];for(let week=0;offsets.length<2*(n-1);week++){
  if([6,12,18,25,30,35].includes(week))continue;
  offsets.push(week*7);
  if([2,15,21,33].includes(week)&&offsets.length<2*(n-1))offsets.push(week*7+4);
 }
 return offsets.map((offset,round)=>({date:after(start,offset),fixtures:legs[round%(n-1)].map(([a,b])=>({home:round<n-1?a:b,away:round<n-1?b:a,kickoff:offset%7===0?'15:00':'19:45',homeGoals:null,awayGoals:null}))}));
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
 for(const booking of career.clubLife?.bookings||[])if(['accepted','completed'].includes(booking.status)){const window=bookingWindow(booking);for(let date=window.start;date<=window.end;date=after(date,1))add(date,{kind:'booking',booking,reserved:date!==booking.date})}
 return events;
}
