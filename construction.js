import {fixedSiteError} from './fixed-surroundings.js';
import {SECTIONS,STANDS,capacity,changeCost} from './stadium-model.js';
const daysAfter=(date,n)=>new Date(Date.parse(date+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
const units=(s,c)=>STANDS[c.stand].tiers.reduce((n,t)=>n+t[0]*s.bays*(s.corner?.55:1),0);
export const closedSections=career=>new Set((career.construction||[]).flatMap(job=>Object.keys(job.sections)));
export function usableCapacity(career,club,extra=[]){const closed=new Set([...closedSections(career),...extra]);const all=SECTIONS.reduce((n,s)=>n+units(s,career.stadium.sections[s.id]),0),open=SECTIONS.reduce((n,s)=>n+(closed.has(s.id)?0:units(s,career.stadium.sections[s.id])),0);return all?Math.max(0,Math.floor(capacity(career.stadium,club)*open/all)):0}
export function constructionQuote(career,club,draft){
 const changed=SECTIONS.filter(s=>changeCost(career.stadium.sections[s.id],draft.sections[s.id])>0);
 const cost=changed.reduce((n,s)=>n+changeCost(career.stadium.sections[s.id],draft.sections[s.id]),0);
 const structural=changed.some(s=>career.stadium.sections[s.id].stand!==draft.sections[s.id].stand),roof=changed.some(s=>career.stadium.sections[s.id].roof!==draft.sections[s.id].roof),rear=changed.some(s=>career.stadium.sections[s.id].rear!==draft.sections[s.id].rear);
 const tiers=Math.max(0,...changed.map(s=>STANDS[draft.sections[s.id].stand].tiers.length));
 const days=changed.length?Math.min(120,(structural?28+tiers*7:roof?21:rear?18:7)+Math.floor((changed.length-1)/4)*3):0;
 const opens=daysAfter(career.date,days),affected=(career.schedule||[]).flatMap(r=>r.fixtures.map(f=>({...f,date:r.date}))).filter(f=>f.home===career.clubId&&f.homeGoals==null&&f.date>=career.date&&f.date<opens);
 const during=usableCapacity(career,club,changed.map(s=>s.id));
 return {cost,days,opens,during,closed:usableCapacity(career,club)-during,affected,sections:Object.fromEntries(changed.map(s=>[s.id,{...draft.sections[s.id]}]))};
}
export function startConstruction(career,club,draft){
 const siteError=fixedSiteError(club,draft);if(siteError)return siteError;
 if(career.construction?.length)return 'Finish the current stadium project first.';
 const quote=constructionQuote(career,club,draft);if(!quote.cost)return 'No changes to build.';if(quote.cost>career.balance)return 'Insufficient club funds.';
 career.balance-=quote.cost;career.construction=[{...quote,started:career.date}];
 career.news.push({date:career.date,kind:'stadium',text:`Stadium works started: ${Object.keys(quote.sections).length} sections closed. Expected opening ${quote.opens}; ${quote.during.toLocaleString('en-GB')} seats remain available.`});return null;
}
export function advanceConstruction(career){
 career.construction??=[];
 const ready=career.construction.filter(job=>job.opens<=career.date);
 for(const job of ready){Object.assign(career.stadium.sections,job.sections);career.news.push({date:career.date,kind:'stadium',text:'Stadium works completed. The refurbished sections are now open.'});}
 career.construction=career.construction.filter(job=>job.opens>career.date);return ready.length;
}
