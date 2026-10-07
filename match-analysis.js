// Short, factual advice from recorded events and known squad availability.
export function touchlineAdvice({minute,ours,theirs,players=[],bench=[],subsLeft=0,missing=0}){
 if(missing)return {key:'short',text:`You are playing with ${11-missing} players. Review the vacant positions and your formation.`,target:'manage'};
 if(subsLeft>0&&minute>=45){for(const p of [...players].sort((a,b)=>a.condition-b.condition)){if(p.condition>=75)break;const cover=bench.filter(b=>b.available&&b.condition>=p.condition+8&&(b.suitability[p.position]||0)>=.75&&((p.position==='GK')===(b.position==='GK'))).sort((a,b)=>b.condition-a.condition)[0];if(cover)return {key:'fresh:'+p.id,text:`${p.name} is at ${p.condition}% condition. ${cover.name} offers fresh cover at ${p.position}.`,target:'manage'};}}
 if(minute>=20&&ours.shots===0)return {key:'no-shots',text:'No shots yet. Consider changing your attacking approach or team orders.',target:'manage'};
 if(minute>=20&&theirs.shots-ours.shots>=3)return {key:'outshot',text:`The opposition leads shots ${theirs.shots}–${ours.shots}. Review your formation and defensive cover.`,target:'manage'};
 if(minute>=55&&ours.shots>=4&&ours.onTarget<=1)return {key:'accuracy',text:`Only ${ours.onTarget} of ${ours.shots} shots are on target. Review your attacking personnel.`,target:'manage'};
 return {key:'steady',text:minute<20?'Let the opening exchanges develop; ratings and statistics will update as events occur.':'No urgent change suggested. Keep an eye on condition and the balance of chances.',target:null};
}
export function matchReview(report){
 const stats=report.stats,ours=stats?.[report.home?'home':'away'],theirs=stats?.[report.home?'away':'home'];
 const summary=ours&&theirs?`You created ${ours.shots} shots (${ours.onTarget} on target); your opponents had ${theirs.shots} (${theirs.onTarget} on target). ${ours.shots>theirs.shots?'You produced more attempts.':ours.shots<theirs.shots?'Your opponents produced more attempts.':'Attempts were level.'}`:'Detailed shot statistics were not recorded for this match.';
 const standouts=[...(report.performances||[])].sort((a,b)=>b.rating-a.rating||b.goals-a.goals).slice(0,3);
 const changes=(report.substitutions||[]).map(s=>({...s,performance:report.performances.find(p=>p.id===s.in)}));
 return {summary,standouts,changes,recorded:report.analysisVersion>=149};
}
