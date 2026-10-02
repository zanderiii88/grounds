// Fictional Premier Division rules. Suspensions are served by club fixtures, not dates.
export const SUBSTITUTION_LIMIT=3;
export const YELLOW_LIMIT=5;
export const availableForMatch=state=>!(state?.injuryDays>0||state?.suspensionMatches>0);
export function completeDisciplineFixture(career,ids,events,key){
 career.disciplineFixtures??=[];
 if(career.disciplineFixtures.includes(key))return [];
 const members=new Set(ids),banned=new Map();
 for(const id of members){const s=career.players[id]??={};s.seasonYellows??=0;s.suspensionMatches=Math.max(0,(s.suspensionMatches||0)-1);}
 for(const e of events){if(!members.has(e.playerId)||!['yellow','red'].includes(e.type))continue;
  const s=career.players[e.playerId];
  // A second-yellow dismissal includes the second caution; a straight red does not.
  if(e.type==='yellow'||e.secondYellow){s.seasonYellows++;if(s.seasonYellows%YELLOW_LIMIT===0)banned.set(e.playerId,`${s.seasonYellows} seasonal yellow cards`);}
  if(e.type==='red')banned.set(e.playerId,e.secondYellow?'Second yellow card':'Red card');
 }
 for(const [id,reason] of banned){career.players[id].suspensionMatches=Math.max(1,career.players[id].suspensionMatches);career.players[id].suspensionReason=reason;}
 career.disciplineFixtures.push(key);
 return [...banned].map(([id,reason])=>({id,reason}));
}
export function resetSeasonCards(career){for(const s of Object.values(career.players))s.seasonYellows=0;}
export function simulatedCards(ids,random=Math.random){
 const events=[],counts=new Map(),sentOff=new Set();
 for(let minute=1;minute<=74;minute++){if(random()>=.033)continue;const pool=ids.filter(id=>!sentOff.has(id));if(!pool.length)break;const playerId=pool[Math.min(pool.length-1,Math.floor(random()*pool.length))],secondYellow=counts.has(playerId),red=secondYellow||random()<.07;
  events.push({minute,playerId,type:red?'red':'yellow',secondYellow:red&&secondYellow});counts.set(playerId,1);if(red)sentOff.add(playerId);
 }
 return events;
}
