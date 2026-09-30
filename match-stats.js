// Statistics are recorded by the simulation, shared by watched and quick matches.
export function ensureMatchStats(match){
 if(match.stats)return match.stats;
 const stats=match.stats={home:{shots:0,onTarget:0,yellow:0,red:0},away:{shots:0,onTarget:0,yellow:0,red:0},possession:[]};
 // When continuing an older in-progress match, recover observable events.
 // Earlier possession was not recorded; never fabricate a retrospective share.
 if(match.minute>0){stats.possessionStartMinute=match.minute+1;for(const e of match.events||[]){const team=stats[e.team===match.home?'home':'away'];if(['goal','chance'].includes(e.type)){team.shots++;if(e.type==='goal'||/\bsav(?:ed|e|es)\b/i.test(e.text||''))team.onTarget++}if(e.type==='yellow')team.yellow++;if(e.type==='red')team.red++}}
 return stats;
}
export function recordPossession(stats,minute,powerDifference,style,homeIsUs,random=Math.random){
 const styleBias=style==='Possession'?(homeIsUs?5:-5):0;
 const share=Math.max(25,Math.min(75,50+powerDifference*.35+styleBias+(random()-.5)*30));
 stats.possession.push({minute,home:share});
}
export function recordShot(stats,home,onTarget){const team=stats[home?'home':'away'];team.shots++;if(onTarget)team.onTarget++}
export function possessionPercent(stats,window=null){const end=stats.possession.at(-1)?.minute||0,samples=stats.possession.filter(s=>window===null||s.minute>end-window);return samples.length?Math.round(samples.reduce((n,s)=>n+s.home,0)/samples.length):50}
