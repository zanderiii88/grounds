// Portable career data only. Device audio/notification preferences are independent.
export function createBackup(save,appVersion){return {format:'clubline-career-backup',formatVersion:1,appVersion,exportedAt:new Date().toISOString(),save:structuredClone(save)}}
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
export function parseBackup(text,league,formations,styles){
 const fail=()=>{throw Error('This is not a compatible Clubline career backup.')};
 if(typeof text!=='string'||text.length>5*1024*1024)fail();let data;try{data=JSON.parse(text)}catch{throw Error('Could not read the JSON backup.')}
 const walk=(x,depth=0)=>{if(depth>80)fail();if(x&&typeof x==='object')for(const [k,v]of Object.entries(x)){if(['__proto__','prototype','constructor'].includes(k))fail();walk(v,depth+1)}};walk(data);
 if(data?.format!=='clubline-career-backup'||data.formatVersion!==1||!object(data.save)||!object(data.save.career))fail();
 const save=structuredClone(data.save),c=save.career,clubs=new Set(league.clubs.map(c=>c.id));
 if(c.version!==1||!clubs.has(c.clubId)||!Number.isFinite(c.balance)||!/^\d{4}-\d{2}-\d{2}$/.test(c.date)||!Number.isFinite(Date.parse(c.date))||!formations.includes(c.formation)||!styles.includes(c.style)||!object(c.players)||!object(c.stadium)||!Array.isArray(c.reports)||!Array.isArray(c.news)||!Array.isArray(c.schedule)||!c.schedule.length)fail();
 const ids=new Set(league.players.map(p=>p.id));
 if(c.generatedPlayers!==undefined&&!Array.isArray(c.generatedPlayers))fail();for(const p of c.generatedPlayers||[]){if(!object(p)||typeof p.id!=='string'||ids.has(p.id)||typeof p.name!=='string'||!clubs.has(p.clubId)||!Number.isFinite(p.overall)||!Number.isFinite(p.wage)||!object(p.positions))fail();ids.add(p.id)}
 const selection=(x,length)=>{if(!Array.isArray(x)||length!==undefined&&x.length!==length||x.some(id=>id!==null&&!ids.has(id)))fail()};selection(c.lineup,11);selection(c.bench,7);if(new Set([...c.lineup,...c.bench].filter(Boolean)).size!==[...c.lineup,...c.bench].filter(Boolean).length)fail();
 for(const id of ids){const p=c.players[id];if(!object(p)||!Number.isFinite(p.fitness)||!Array.isArray(p.form)||p.form.some(n=>!Number.isFinite(n)))fail()}
 for(const r of c.schedule){if(!object(r)||typeof r.date!=='string'||!Array.isArray(r.fixtures)||r.fixtures.some(f=>!object(f)||!clubs.has(f.home)||!clubs.has(f.away)||f.home===f.away||![f.homeGoals,f.awayGoals].every(g=>g===null||Number.isInteger(g)&&g>=0)))fail()}
 for(const team of Object.values(c.owners||{}))if(!clubs.has(team))fail();for(const o of c.offers||[])if(!object(o)||!ids.has(o.id)||!clubs.has(o.clubId)||!Number.isFinite(o.fee)||o.fee<0)fail();
 if(save.match){const m=save.match;if(!object(m)||!['choice','confirm','live','report'].includes(m.phase)||!clubs.has(m.home)||!clubs.has(m.away)||m.home===m.away)fail();if(m.lineup)selection(m.lineup,11);if(m.bench)selection(m.bench);if(m.oppLineup)selection(m.oppLineup,11);if(m.phase==='live'&&(!Number.isFinite(m.minute)||!Array.isArray(m.events)||!m.lineup||!m.bench))fail()}
 return save;
}
