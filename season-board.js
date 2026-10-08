// Club expectations are fixed for a season; assessment is repeatable and contains no random rolls.
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function confidenceBand(score){return score>=75?{label:'Delighted',tone:'good',rank:3}:score>=50?{label:'Satisfied',tone:'good',rank:2}:score>=30?{label:'Concerned',tone:'watch',rank:1}:{label:'Under pressure',tone:'poor',rank:0}}
export function initialiseExpectations(c,league){
 c.boardReviews??=[];
 if(c.expectations?.season===c.season)return c.expectations;
 const ranked=[...league.clubs].sort((a,b)=>(b.attack+b.defence)-(a.attack+a.defence)||a.id.localeCompare(b.id)),rank=ranked.findIndex(x=>x.id===c.clubId)+1;
 c.expectations={season:c.season,strengthRank:rank,targetPosition:clamp(rank+2,4,league.clubs.length-2),expectedPointsPerGame:clamp(2.15-rank*(1.35/league.clubs.length),.8,1.9),openingBalance:c.balance,announced:false,lastBands:null,lastNewsMatch:-3,lastFinanceWarning:false};
 return c.expectations;
}
export function assessSeason(c,league,table){
 const plan=initialiseExpectations(c,league),row=table.find(x=>x.id===c.clubId)||{P:0,Pts:0},position=table.findIndex(x=>x.id===c.clubId)+1,played=row.P,complete=(c.schedule||[]).length>0&&c.schedule.every(r=>r.fixtures.filter(f=>f.home===c.clubId||f.away===c.clubId).every(f=>f.homeGoals!==null&&f.awayGoals!==null));
 const weekly=league.players.filter(p=>(c.owners?.[p.id]||p.clubId)===c.clubId&&!c.players?.[p.id]?.retired&&!c.players?.[p.id]?.unregistered).reduce((n,p)=>n+(p.wage||0),0),forecast=c.balance-(weekly-(league.clubs.find(x=>x.id===c.clubId)?.commercialWeekly||0))*4;
 const results=(c.reports||[]).filter(r=>!r.friendly),recent=results.slice(-5),recentPoints=recent.reduce((n,r)=>n+(r.us>r.them?3:r.us===r.them?1:0),0),expected=played*plan.expectedPointsPerGame;
 const performance=played?clamp((row.Pts-expected)*2,-28,28):0,positionEffect=played>=4?clamp((plan.targetPosition-position)*2,-12,12)*Math.min(1,played/12):0,financeEffect=c.balance<0?-25:forecast<0?-10:0;
 const board=Math.round(clamp(65+performance+positionEffect+financeEffect,5,95));
 const formEffect=recent.length?clamp((recentPoints-recent.length*plan.expectedPointsPerGame)*4,-24,24):0,goals=recent.length?clamp(recent.reduce((n,r)=>n+r.us-r.them,0),-6,6):0;
 const supporters=Math.round(clamp(60+formEffect+performance*.35+goals,5,95));
 const objectives=[{id:'league',title:`Finish in the top ${plan.targetPosition}`,detail:played?`Currently ${position} of ${table.length} · ${row.Pts} points from ${played} games`:'Assessment begins after matches are played.',status:complete?(position<=plan.targetPosition?'Achieved':'Missed'):played<4?'Early days':position<=plan.targetPosition?'On track':'Work to do',tone:complete?(position<=plan.targetPosition?'good':'poor'):played<4?'neutral':position<=plan.targetPosition?'good':'watch'},
 {id:'finance',title:'Finish with a positive club balance',detail:`Current balance: £${Math.round(c.balance).toLocaleString('en-GB')}`,status:complete?(c.balance>0?'Achieved':'Missed'):c.balance<0?'Below target':forecast<0?'Payroll risk':'On track',tone:c.balance<0?'poor':forecast<0&&!complete?'watch':'good'}];
 const boardReasons=[played?`${row.Pts} points from ${played} games; season expectations reflect your club’s starting strength.`:'The board is giving you time to establish the team.',played>=4?`League position ${position}; target is top ${plan.targetPosition}.`:'League position is not judged during the first three matches.',c.balance<0?'The club balance is below zero.':forecast<0?'Current cash does not cover four weeks of net payroll after commercial income.':'Current cash covers four weeks of net payroll after commercial income.'];
 const supporterReasons=[recent.length?`${recentPoints} points from the last ${recent.length} matches.`:'Supporters are looking forward to the new season.',recent.length?`Recent goal difference: ${goals>=0?'+':''}${recent.reduce((n,r)=>n+r.us-r.them,0)}.`:'Results and goals will shape their mood.'];
 return {season:c.season,board,supporters,boardBand:confidenceBand(board),supporterBand:confidenceBand(supporters),boardReasons,supporterReasons,objectives,played,position,points:row.Pts,complete,forecast,weekly};
}
export function updateExpectations(c,league,table,{announce=true}={}){
 const a=assessSeason(c,league,table),plan=c.expectations;
 if(!plan.announced&&announce){c.news.push({date:c.date,kind:'board',text:`Season ${c.season} expectations: finish in the top ${plan.targetPosition} and keep a positive club balance.`,action:'expectations'});plan.announced=true}
 const bands=[a.boardBand.rank,a.supporterBand.rank],old=plan.lastBands;let changed=false;
 if(announce&&old&&a.played>=3&&a.played-plan.lastNewsMatch>=3){for(let i=0;i<2;i++)if(old[i]!==bands[i]){const board=i===0,band=board?a.boardBand:a.supporterBand;c.news.push({date:c.date,kind:board?'board':'supporters',important:bands[i]<old[i]&&bands[i]<=1,text:`${board?'Board confidence':'Supporter mood'}: ${band.label.toLowerCase()}. ${board?a.boardReasons[0]:a.supporterReasons[0]}`,action:'expectations'});plan.lastNewsMatch=a.played;changed=true}}
 const financialRisk=c.balance<0||a.forecast<0;
 if(announce&&financialRisk&&!plan.lastFinanceWarning)c.news.push({date:c.date,kind:'board',important:true,text:c.balance<0?'The board asks you to address the negative club balance.':'The board warns that current cash will not cover four weeks of net payroll after commercial income. Review spending before further investment.',action:'finances'});
 if(changed||!old||!announce||a.played-plan.lastNewsMatch>=3)plan.lastBands=bands;plan.lastFinanceWarning=financialRisk;
 if(a.complete&&!c.boardReviews.some(r=>r.season===c.season)){
  c.boardReviews.push(structuredClone({...a,date:c.date,balance:c.balance}));
  if(announce)c.news.push({date:c.date,kind:'season-review',important:true,text:`Season ${c.season} review: finished ${a.position}, ${a.points} points. ${a.objectives.filter(o=>o.status==='Achieved').length}/${a.objectives.length} objectives achieved.`,action:'expectations'});
 }
 return a;
}
