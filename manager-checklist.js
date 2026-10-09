// Career-owned review state; device visibility preferences live separately.
export function updateChecklist(career, items, destination=null){
 career.ui??={};
 if(!career.ui.managerChecklist||typeof career.ui.managerChecklist!=='object'||Array.isArray(career.ui.managerChecklist))career.ui.managerChecklist={};
 const state=career.ui.managerChecklist, before=JSON.stringify(state);
 for(const item of items){
  let entry=state[item.id];
  if(item.active){
   if(!entry||!entry.active||entry.signature!==item.signature)entry=state[item.id]={signature:item.signature,visited:false,checked:false,active:true,label:item.label};
   entry.active=true;entry.label=item.label;
   if(destination&&destination.section===item.section&&destination.sub===item.sub)entry.visited=true;
  }else if(entry){entry.active=false;entry.checked=true;entry.resolved=true;}
 }
 return before!==JSON.stringify(state);
}
export function checklistRows(career,items){return items.flatMap(item=>{const state=career.ui?.managerChecklist?.[item.id];return state?[{...item,label:state.active?item.label:state.label,status:state.checked?'checked':state.visited?'visited':'unvisited',active:!!state.active,resolved:!!state.resolved}]:[]})}
export function setChecklistChecked(career,id,checked){const entry=career.ui?.managerChecklist?.[id];if(!entry||!entry.active)return false;entry.checked=!!checked;return true}
