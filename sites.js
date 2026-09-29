// One placement catalogue shared by setup, the renderer and prerendered menus.
// Coordinates are measured on the 830 × 1895 artwork. Placement and rotation stay fixed.
export const SITES=[
 {id:'town',name:'Town Quarter',origin:[430,1210]},
 {id:'riverside',name:'Riverside City',origin:[425,1210]},
 {id:'beach',name:'Beach Resort',origin:[427,1250]},
 {id:'rural',name:'Woodland Station',origin:[420,1156]},
 {id:'aberdeen',name:'Granite Harbour',origin:[430,1210],night:true},
 {id:'glasgow',name:'Sandstone Viaduct',origin:[390,1150],night:true},
 {id:'newcastle',name:'Tyne Quarter',origin:[415,1230],night:true}
].map(s=>({...s,art:'clubline-'+s.id,limit:75000,east:[7.2,4.2],south:[-7.35,4.2]}));
export const SHOWCASE_SITES=['aberdeen','glasgow','newcastle','town','riverside','beach','rural'];
export const siteById=id=>SITES.find(s=>s.id===id)||SITES[0];
