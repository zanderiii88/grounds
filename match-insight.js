// Derive match performance from recorded actions; never invent pass/tackle totals.
export function playerMatchInsight(match,id,teamId,position,baseCondition=100){
 const p=match.participants?.[id];
 const end=p?.end??match.events.find(e=>e.playerId===id&&['red','injury'].includes(e.type))?.minute??match.minute;
 const elapsed=Math.max(0,end-(p?.start??0));
 const events=(match.events||[]).filter(e=>e.playerId===id);
 const shots=events.filter(e=>['goal','chance'].includes(e.type)).length;
 const goals=match.goalCounts?.[id]||0,assists=match.assistCounts?.[id]||0;
 const onTarget=events.filter(e=>e.type==='goal'||e.type==='chance'&&(e.onTarget===true||e.onTarget===undefined&&/\bsav(?:ed|e|es)\b/i.test(e.text||''))).length;
 const saves=(match.events||[]).filter(e=>e.keeperId===id&&e.type==='chance'&&e.onTarget).length;
 const red=events.some(e=>e.type==='red'),yellow=events.some(e=>e.type==='yellow'||e.secondYellow),injured=events.some(e=>e.type==='injury');
 const conceded=(match.events||[]).filter(e=>e.type==='goal'&&e.team!==teamId&&e.minute>=(p?.start??0)&&e.minute<=end).length;
 const rating=elapsed===0?null:Math.round(Math.max(4,Math.min(10,6.5+goals*1.1+assists*.5+Math.max(0,onTarget-goals)*.12+saves*.15-(position==='GK'?conceded*.35:conceded*.06)-(yellow ? .25 : 0)-(red?1:0)))*10)/10;
 return {minutes:elapsed,shots,onTarget,goals,assists,saves,red,yellow,injured,rating,status:rating===null?'neutral':rating>=7?'good':rating>=6?'steady':'poor',condition:Math.max(0,Math.round(baseCondition-elapsed*.16)),shotSuccess:shots?Math.round(goals/shots*100):null};
}
export const MATCH_PACES=[4,2,1,.5];
export function paceLevel(speed){return Math.max(0,MATCH_PACES.indexOf(speed))}
export function stepPace(speed,step){return MATCH_PACES[Math.max(0,Math.min(3,paceLevel(speed)+step))]}
