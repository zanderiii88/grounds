const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const TYPES={
 youth:{field:'youthFunding',base:'youth',title:'Youth academy',stages:['Youth programme','Academy foundation','Youth academy','Advanced academy','Elite academy'],basePrice:100000,stepPrice:35000},
 training:{field:'trainingFunding',base:'facilities',title:'Training facilities',stages:['Basic training ground','Club training centre','Modern training centre','Advanced training centre','Elite training centre'],basePrice:180000,stepPrice:50000}
};
export function facilityLevel(c,league){return investmentStatus(c,league,'training').level}
export function investmentStatus(c,league,kind){
 const type=TYPES[kind];if(!type)throw new Error('Unknown club investment');
 const club=league.clubs.find(x=>x.id===c.clubId),base=clamp(Number(club?.[type.base])||1,1,5),funding=c[type.field]||0,level=clamp(base+funding*.5,1,5),target=Math.min(5,level+.5),complete=level>=5;
 const scale=clamp(.8+(club?.budget||0)/10000000,.8,1.25),cost=complete?0:Math.round((type.basePrice+target*target*type.stepPrice)*scale/10000)*10000;
 return {kind,field:type.field,title:type.title,base,level,target,complete,cost,stage:type.stages[Math.floor(level)-1],nextStage:type.stages[Math.floor(target)-1],remaining:Math.ceil((5-level)*2),affordable:!complete&&c.balance>=cost};
}
export function investInClub(c,league,kind){
 const q=investmentStatus(c,league,kind);if(q.complete)return {error:'Already at the five-star limit.'};if(!q.affordable)return {error:'Insufficient club funds.'};
 c.balance-=q.cost;c[q.field]=(c[q.field]||0)+1;c.news??=[];c.news.push({date:c.date,kind:'funding',action:'finances',text:`${q.title} investment: ${q.level} → ${q.target} stars, costing £${q.cost.toLocaleString('en-GB')}. ${kind==='youth'?'Youth coaching improves now; future intakes benefit from next season.':'Improved facilities support gradual development of young registered players.'}`});
 return {quote:q};
}
