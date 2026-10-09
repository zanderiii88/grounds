// Clubline's editable section plan uses the 32-section GROUNDS pitch datum and
// its stand families. Each section keeps its own structural and roof choices.
export const STANDS={
 h1:{label:"Historic balcony double",tiers:[[10,1.3,1.05],[8,10.6,1.35]],depth:7.7,deck:"overhang"},
 empty:{label:'Open corner / gap',tiers:[],depth:0},
 grass:{label:'Grass standing bank',tiers:[[1,.1,.1]],depth:1.7},
 terrace3:{label:'Three-step terrace',tiers:[[3,.4,.4]],depth:2.1},
 terrace5:{label:'Five-step terrace',tiers:[[5,.4,.44]],depth:3.0},
 bleacher3:{label:'Three-row bleachers',tiers:[[3,.65,.62]],depth:2.1},
 bleacher5:{label:'Five-row bleachers',tiers:[[5,.65,.62]],depth:3.0},
 s1:{label:'Standard single',tiers:[[8,1.05,.92]],depth:4.6},
 s2:{label:'Steep single',tiers:[[8,1.05,2.05]],depth:4.6},
 l1:{label:'Large single',tiers:[[11,1.05,1.05]],depth:6.1},
 l2:{label:'Tall large single',tiers:[[11,1.05,1.78]],depth:6.1},
 d1:{label:'Setback double',tiers:[[5,1.05,.78],[6,6.15,1.24]],depth:5.25,deck:'setback'},
 d2:{label:'Overhang double',tiers:[[6,1.05,.76],[7,7.25,1.30]],depth:5.2,deck:'overhang'},
 d3:{label:'Tall setback double',tiers:[[5,1.05,.92],[7,7.15,1.82]],depth:5.25,deck:'setback'},
 d4:{label:'Tall overhang double',tiers:[[6,1.05,.90],[7,8.2,2.02]],depth:5.2,deck:'overhang'},
 d5:{label:'Large setback double',tiers:[[7,1.05,.92],[8,7.65,1.55]],depth:6.25,deck:'setback'},
 d6:{label:'Large overhang double',tiers:[[7,1.05,.90],[9,8.65,1.72]],depth:6.1,deck:'overhang'},
 t1:{label:'Triple setback',tiers:[[5,1.05,.82],[5,5.85,1.05],[7,11.35,1.52]],depth:6.85,deck:'triple'},
 t2:{label:'Triple overhang',tiers:[[6,1.05,.88],[6,7.05,1.18],[8,13.25,1.85]],depth:6.75,deck:'triple'}
};
export const ROOFS={none:'Uncovered',full:'Traditional canopy',truss:'Steel truss',cantilever:'Rear cantilever',continuous:'Continuous roof',pitched:'Pitched historic roof',columns:'Column-supported canopy',boxtruss:'Deep box-truss cantilever'};
export const REARS={compact:'Compact shell',concourse:'Concourse',amenities:'Amenities block',hospitality:'Hospitality frontage'};
export const FINISHES={brick:'Red brick',metal:'Grey metal',dark:'Dark cladding'};
export const SECTIONS=[...Array.from({length:8},(_,i)=>[{id:`N${i+1}`,side:'N',i,bays:4},{id:`S${i+1}`,side:'S',i,bays:4}]).flat(),...Array.from({length:4},(_,i)=>[{id:`W${i+1}`,side:'W',i,bays:5},{id:`E${i+1}`,side:'E',i,bays:5}]).flat(),...['NW','NE','SW','SE'].map(id=>({id,side:id,bays:4,corner:true}))];
const patterns=[
 {sides:['d5','d2','l2','t1'],corners:'d1',finish:'brick',roof:'truss',open:[]},
 {sides:['t2','s2','l1','d6'],corners:'empty',finish:'dark',roof:'cantilever',open:[]},
 {sides:['d3','d1','l2','d2'],corners:'d1',finish:'metal',roof:'continuous',open:[]},
 {sides:['d4','l1','s2','l1'],corners:'empty',finish:'brick',roof:'truss',open:[]},
 {sides:['d3','d3','l1','d3'],corners:'d1',finish:'metal',roof:'truss',open:[]},
 {sides:['d1','d1','d2','d1'],corners:'d1',finish:'dark',roof:'continuous',open:[]},
 {sides:['l2','s1','d2','s1'],corners:'empty',finish:'brick',roof:'truss',open:[]},
 {sides:['l1','s1','s2','s1'],corners:'empty',finish:'metal',roof:'cantilever',open:[]},
 {sides:['s2','s2','s2','s2'],corners:'empty',finish:'brick',roof:'truss',open:[]},
 {sides:['l1','s1','l1','s1'],corners:'s1',finish:'metal',roof:'continuous',open:[]},
 {sides:['s1','l1','s1','l1'],corners:'empty',finish:'brick',roof:'cantilever',open:['E4']},
 {sides:['s1','s1','s1','s1'],corners:'empty',finish:'brick',roof:'full',open:['W4','E4']}
];
const sideIndex={N:0,E:1,S:2,W:3};
export function defaultLayout(club){
 if(club?.stadium?.sections)return structuredClone(club.stadium);
 const idx=Math.max(0,Math.min(11,(Number(String(club?.id||'C01').slice(1))||1)-1)),p=patterns[idx];
 return {name:['Grand Main Stand','High City Side','Wall of Sound','Foundry Four','Three High Sides','Celyn Canopy','Heritage End','Harbour Four','Close Quarters','Valley Bowl','Rath Mix','Four Open Stands'][idx],baseCapacity:club.capacity,sections:Object.fromEntries(SECTIONS.map(s=>{
  const stand=s.corner?p.corners:p.open.includes(s.id)?'empty':p.sides[sideIndex[s.side]];
  const roof=stand==='empty'?'none':idx===11&&s.side==='S'?'none':p.roof;
  return [s.id,{stand,roof,rear:s.corner?'compact':s.side==='N'?'hospitality':idx%3===0?'amenities':'concourse',finish:p.finish}];
 }))};
}
export function normaliseLayout(layout,club){
 const baseline=defaultLayout(club),input=layout?.sections||{};
 return {name:baseline.name,baseCapacity:club.capacity,sections:Object.fromEntries(SECTIONS.map(s=>{
  const x=input[s.id],initial=baseline.sections[s.id];
  return [s.id,{stand:STANDS[x?.stand]?x.stand:initial.stand,roof:Object.hasOwn(ROOFS,x?.roof)?x.roof:initial.roof,rear:Object.hasOwn(REARS,x?.rear)?x.rear:initial.rear,finish:Object.hasOwn(FINISHES,x?.finish)?x.finish:initial.finish,frontage:["plain","brickwindows","artdeco","towers"].includes(x?.frontage)?x.frontage:initial.frontage||"plain",frontage:['plain','brickwindows','artdeco','towers'].includes(x?.frontage)?x.frontage:'plain'}];
 }))};
}
const units=(section,config)=>STANDS[config.stand].tiers.reduce((n,t)=>n+t[0]*section.bays*(section.corner?.55:1),0);
export function capacity(layout,club){const base=defaultLayout(club),origin=SECTIONS.reduce((n,s)=>n+units(s,base.sections[s.id]),0);const now=SECTIONS.reduce((n,s)=>n+units(s,layout.sections[s.id]),0);return Math.round(club.capacity*now/origin/50)*50;}
export function changeCost(oldConfig,newConfig){if(['stand','roof','rear','finish','frontage'].every(key=>(oldConfig[key]??(key==='frontage'?'plain':null))===(newConfig[key]??(key==='frontage'?'plain':null))))return 0;const a=STANDS[oldConfig.stand].tiers.reduce((n,t)=>n+t[0],0),b=STANDS[newConfig.stand].tiers.reduce((n,t)=>n+t[0],0);return Math.max(10000,Math.round((Math.max(0,b-a)*44000+(oldConfig.stand===newConfig.stand?16000:45000)+(oldConfig.roof!==newConfig.roof?65000:0)+(oldConfig.rear!==newConfig.rear?30000:0))/1000)*1000);}
