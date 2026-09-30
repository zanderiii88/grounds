// League-wide search uses current ownership and saved career availability.
export const playerValue=p=>Math.round((p.overall-55)**2*4500+Math.max(0,p.potential-p.overall)*22000);
export const blankTransferFilters=()=>({name:'',listed:'all',position:'all',valueMin:'',valueMax:'',ageMin:'',ageMax:'',ratingMin:'',ratingMax:'',hotOnly:false,sort:'rating'});
export function searchLeaguePlayers(players,career,filters){
 const f={...blankTransferFilters(),...filters},listed=new Set(career.transferList||[]),hot=new Set(career.hotList||[]),text=f.name.trim().toLocaleLowerCase('en-GB');
 const within=(n,min,max)=>(min===''||min==null||n>=Number(min))&&(max===''||max==null||n<=Number(max));
 const groups={defence:['LB','RB','CB'],midfield:['DM','CM','AM'],attack:['LW','RW','ST']};
 const result=players.filter(p=>{
  if(career.players?.[p.id]?.retired||career.players?.[p.id]?.unregistered)return false;
  if(text&&!p.name.toLocaleLowerCase('en-GB').includes(text))return false;
  if(f.listed==='listed'&&!listed.has(p.id)||f.listed==='unlisted'&&listed.has(p.id))return false;
  if(f.hotOnly&&!hot.has(p.id))return false;
  if(f.position!=='all'&&!(groups[f.position]||[f.position]).some(pos=>p.primary===pos||(p.positions?.[pos]||0)>=p.overall*.75))return false;
  return within(playerValue(p),f.valueMin,f.valueMax)&&within(p.age,f.ageMin,f.ageMax)&&within(p.overall,f.ratingMin,f.ratingMax);
 });
 return result.sort((a,b)=>{let order=f.sort==='name'?a.name.localeCompare(b.name,'en-GB'):f.sort==='age'?a.age-b.age:f.sort==='value'?playerValue(b)-playerValue(a):b.overall-a.overall;return order||a.name.localeCompare(b.name,'en-GB')});
}
