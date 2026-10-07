// Editions are snapshots of completed league fixtures, never invented stories.
const dayMs=86400000;
const dateOf=d=>new Date(d+'T12:00:00Z');
function table(clubs,results){const rows=new Map(clubs.map(c=>[c.id,{id:c.id,P:0,Pts:0,GF:0,GA:0}]));for(const f of results){const h=rows.get(f.home),a=rows.get(f.away);if(!h||!a)continue;h.P++;a.P++;h.GF+=f.homeGoals;h.GA+=f.awayGoals;a.GF+=f.awayGoals;a.GA+=f.homeGoals;h.Pts+=f.homeGoals>f.awayGoals?3:f.homeGoals===f.awayGoals?1:0;a.Pts+=f.awayGoals>f.homeGoals?3:f.homeGoals===f.awayGoals?1:0}return [...rows.values()].sort((a,b)=>b.Pts-a.Pts||(b.GF-b.GA)-(a.GF-a.GA)||b.GF-a.GF||a.id.localeCompare(b.id))}
export function makeLeagueEdition({date,season,clubs,results,reports=[],players=[],clubId,names={}}){
 if(dateOf(date).getUTCDay()!==1)return null;
 const from=new Date(dateOf(date).getTime()-7*dayMs).toISOString().slice(0,10),played=results.filter(f=>f.date<date&&Number.isFinite(f.homeGoals)&&Number.isFinite(f.awayGoals)),week=played.filter(f=>f.date>=from);
 if(!week.length)return null;
 const name=id=>names[id]||clubs.find(c=>c.id===id)?.name||id,now=table(clubs,played),before=table(clubs,played.filter(f=>f.date<from)),rank=id=>before.findIndex(c=>c.id===id),lead=now[0],runner=now[1];
 const headline=lead.id!==before[0]?.id?`${name(lead.id)} move to the top`:`${name(lead.id)} lead the Premier Division`;
 const stories=[{title:'At the top',text:`${name(lead.id)} have ${lead.Pts} points from ${lead.P} matches, ${lead.Pts-runner.Pts} ahead of ${name(runner.id)}. ${lead.P<3?'The season is still taking shape.':'Results this week continue to shape the standings.'}`}];
 const biggest=[...week].sort((a,b)=>Math.abs(b.homeGoals-b.awayGoals)-Math.abs(a.homeGoals-a.awayGoals))[0];
 stories.push({title:'Result of the week',text:`${name(biggest.home)} ${biggest.homeGoals}–${biggest.awayGoals} ${name(biggest.away)}. ${biggest.homeGoals===biggest.awayGoals?'Honours even.':`${name(biggest.homeGoals>biggest.awayGoals?biggest.home:biggest.away)} take the points${Math.abs(biggest.homeGoals-biggest.awayGoals)>=3?' with a convincing win':''}.`}`});
 const surprise=week.find(f=>{const winner=f.homeGoals>f.awayGoals?f.home:f.awayGoals>f.homeGoals?f.away:null,loser=winner===f.home?f.away:f.home;return winner&&before.find(c=>c.id===winner).P>=3&&rank(winner)-rank(loser)>=4});
 if(surprise)stories.push({title:'Against the standings',text:`${name(surprise.homeGoals>surprise.awayGoals?surprise.home:surprise.away)} beat a side that began the week at least four places above them: ${name(surprise.home)} ${surprise.homeGoals}–${surprise.awayGoals} ${name(surprise.away)}.`});
 const runs=now.map(c=>{const games=played.filter(f=>f.home===c.id||f.away===c.id).slice(-5);let wins=0;for(const f of [...games].reverse()){if((f.home===c.id?f.homeGoals>f.awayGoals:f.awayGoals>f.homeGoals))wins++;else break}return {...c,wins}}).sort((a,b)=>b.wins-a.wins);
 if(runs[0].wins>=3)stories.push({title:'In form',text:`${name(runs[0].id)} have won ${runs[0].wins} consecutive league matches${runs[0].wins===5?' (at least)':''}.`});
 const ours=week.filter(f=>f.home===clubId||f.away===clubId),current=now.find(c=>c.id===clubId),old=before.findIndex(c=>c.id===clubId),pos=now.findIndex(c=>c.id===clubId);
 if(ours.length)stories.push({title:`${name(clubId)} notebook`,text:`${ours.map(f=>`${name(f.home)} ${f.homeGoals}–${f.awayGoals} ${name(f.away)}`).join('; ')}. Your club sits ${pos+1} of ${clubs.length}${before.find(c=>c.id===clubId).P?`, ${pos<old?'up '+(old-pos):pos>old?'down '+(pos-old):'unchanged'} since last week`:''}, with ${current.Pts} points.`});
 const performances=reports.filter(r=>r.date>=from&&r.date<date).flatMap(r=>(r.performances||[]).filter(p=>Number.isFinite(p.rating)&&p.minutes>=30).map(p=>({...p,name:p.name||players.find(x=>x.id===p.id)?.name||'Player',date:r.date}))).sort((a,b)=>b.rating-a.rating);
 if(performances.length)stories.push({title:'Your standout performance',text:`${performances[0].name} earned ${performances[0].rating.toFixed(1)}/10 in your match on ${performances[0].date}.`});
 return {date,from,season,headline,stories,results:week.map(f=>({date:f.date,home:name(f.home),away:name(f.away),homeGoals:f.homeGoals,awayGoals:f.awayGoals}))};
}
