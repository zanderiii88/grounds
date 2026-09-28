// Clubline stadium renderer. The pitch and site registration follow the GROUNDS
// 28 x 18 world-grid layout, so each ground stays on its illustrated plot.
const SITE={
 city:{art:'top-city-redevelopment',origin:[867,482],tile:[6.162,3.382]},
 harbour:{art:'top-city-redevelopment',origin:[867,482],tile:[6.162,3.382]},
 gardens:{art:'top-civic-gardens',origin:[862,484],tile:[6.265,3.412]},
 rail:{art:'top-rail-district',origin:[868,482],tile:[6.176,3.382]},
 university:{art:'mid-university-district',origin:[904,452],tile:[6.37,3.667]},
 oldtown:{art:'mid-market-town-aligned',origin:[898,454],tile:[6.296,3.444]}
};
const PROFILES=[
 {name:'Grand Main Stand',inspiration:'Anfield',h:[8,6,5.3,6],tiers:[2,2,1,2],roof:[1,1,1,1],corners:1,finish:'brick',roofType:'truss'},
 {name:'High City Side',inspiration:"St James' Park",h:[8.4,4.4,4.2,7.8],tiers:[2,1,1,2],roof:[1,1,1,1],corners:0,finish:'glass',roofType:'cantilever'},
 {name:'Wall of Sound',inspiration:'Tottenham Hotspur Stadium',h:[6.5,5.7,7.8,5.7],tiers:[2,2,1,2],roof:[1,1,1,1],corners:1,finish:'steel',roofType:'continuous'},
 {name:'Foundry Four',inspiration:'Ibrox',h:[7,4.9,4.6,4.6],tiers:[2,1,1,1],roof:[1,1,1,1],corners:0,finish:'brick',roofType:'truss'},
 {name:'Three High Sides',inspiration:'Celtic Park',h:[6.6,6.3,4.2,6.2],tiers:[2,2,1,2],roof:[1,1,1,1],corners:1,finish:'steel',roofType:'truss'},
 {name:'Celyn Canopy',inspiration:'Principality Stadium',h:[5.8,5.8,5.8,5.8],tiers:[2,2,2,2],roof:[1,1,1,1],corners:1,finish:'glass',roofType:'continuous'},
 {name:'Heritage End',inspiration:'Villa Park',h:[5.3,4.6,6.2,4.4],tiers:[2,1,1,1],roof:[1,1,1,1],corners:0,finish:'brick',roofType:'truss'},
 {name:'Harbour Four',inspiration:'Brentford Community Stadium',h:[4.8,4.6,4.1,4.4],tiers:[1,1,1,1],roof:[1,1,1,1],corners:0,finish:'steel',roofType:'cantilever'},
 {name:'Close Quarters',inspiration:'Tynecastle Park',h:[5.3,5.2,5.2,5.2],tiers:[1,1,1,1],roof:[1,1,1,1],corners:0,finish:'brick',roofType:'truss'},
 {name:'Valley Bowl',inspiration:'Swansea.com Stadium',h:[4.4,4.3,4.3,4.3],tiers:[1,1,1,1],roof:[1,1,1,1],corners:1,finish:'steel',roofType:'continuous'},
 {name:'Rath Mix',inspiration:'Windsor Park',h:[4,4.3,3.1,4.2],tiers:[1,1,1,1],roof:[1,1,1,1],corners:0,finish:'glass',roofType:'cantilever'},
 {name:'Four Open Stands',inspiration:'traditional Scottish grounds',h:[3.8,3.6,3.3,3.5],tiers:[1,1,1,1],roof:[1,1,0,1],corners:0,finish:'brick',roofType:'truss'}
];
const PITCH={x:22,y:21,w:28,h:18};
const safe=s=>String(s??'').replace(/[&<>"']/g,'');
const mix=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,z:(a.z||0)+((b.z||0)-(a.z||0))*t});
const at=(x,y,z=0)=>({x,y,z});
export const stadiumProfile=club=>PROFILES[Math.max(0,Math.min(11,(Number(String(club?.id||'C01').slice(1))||1)-1))];
export function sceneSvg(club,site='city',crowd=false,evening=false,close=false){
 const map=SITE[site]||SITE.city,profile=stadiumProfile(club),colour=/^#[0-9a-f]{6}$/i.test(club?.colour||'')?club.colour:'#a03948';
 const px=1100/1774,py=550/887,zStep=7.5*map.tile[0]/24*px;
 const project=p=>({x:(map.origin[0]+((p.x-p.y)-6)*map.tile[0])*px,y:(map.origin[1]+((p.x+p.y)-66)*map.tile[1])*py-(p.z||0)*zStep});
 const coord=p=>{const q=project(p);return `${q.x.toFixed(2)},${q.y.toFixed(2)}`};
 const poly=(pts,fill,extra='')=>`<polygon points="${pts.map(coord).join(' ')}" fill="${fill}" ${extra}/>`;
 const path=(pts,stroke,width=1,extra='')=>`<path d="M${pts.map(coord).join('L')}" fill="none" stroke="${stroke}" stroke-width="${width}" ${extra}/>`;
 const rect=(x1,y1,x2,y2,z,fill,extra='')=>poly([at(x1,y1,z),at(x2,y1,z),at(x2,y2,z),at(x1,y2,z)],fill,extra);
 const field=[];
 field.push(rect(20,19,52,41,.015,'#4e8149'));
 for(let i=0;i<PITCH.w;i+=3)field.push(rect(22+i,21,Math.min(50,22+i+3),39,.04,(i/3)%2?'#368c53':'#40965b'));
 const white='#edf4e6',lw=1.12;
 field.push(path([at(22,21,.09),at(50,21,.09),at(50,39,.09),at(22,39,.09),at(22,21,.09)],white,lw));
 field.push(path([at(36,21,.09),at(36,39,.09)],white,lw));
 for(const end of [22,50]){
  const dir=end===22?1:-1;
  for(const [depth,inset] of [[4.6,3.25],[1.8,6.15]])field.push(path([at(end,21+inset,.09),at(end+dir*depth,21+inset,.09),at(end+dir*depth,39-inset,.09),at(end,39-inset,.09)],white,lw));
  field.push(poly([at(end,28.5,.08),at(end-dir*.8,28.5,.08),at(end-dir*.8,31.5,.08),at(end,31.5,.08)],'none',`stroke="${white}" stroke-width="1"`));
  const spot=project(at(end+dir*3.55,30,.1));field.push(`<circle cx="${spot.x.toFixed(2)}" cy="${spot.y.toFixed(2)}" r=".7" fill="${white}"/>`);
 }
 const circle=Array.from({length:65},(_,i)=>at(36+Math.cos(i/64*Math.PI*2)*2.45,30+Math.sin(i/64*Math.PI*2)*2.45,.1));field.push(path(circle,white,lw));
 const centre=project(at(36,30,.1));field.push(`<circle cx="${centre.x.toFixed(2)}" cy="${centre.y.toFixed(2)}" r=".8" fill="${white}"/>`);
 const surfaces={brick:['#544e49','#756e63'],glass:['#344b55','#607780'],steel:['#37474c','#5c6d72']}[profile.finish];
 const sideGeometry=[
  {label:'North',front:[at(20.5,20),at(51.5,20)],back:[at(20.5,15.5),at(51.5,15.5)]},
  {label:'East',front:[at(51,20.5),at(51,39.5)],back:[at(55.5,20.5),at(55.5,39.5)]},
  {label:'South',front:[at(20.5,40),at(51.5,40)],back:[at(20.5,44.5),at(51.5,44.5)]},
  {label:'West',front:[at(21,20.5),at(21,39.5)],back:[at(16.5,20.5),at(16.5,39.5)]}
 ];
 const parts=sideGeometry.map((s,i)=>{
  const h=profile.h[i],front=s.front.map(p=>({...p,z:.8})),back=s.back.map(p=>({...p,z:h}));
  const face=poly([s.back[0],s.back[1],back[1],back[0]],surfaces[0],`stroke="#27383c" stroke-width=".7"`);
  const facade=Array.from({length:profile.finish==='brick'?8:12},(_,j)=>{
   const count=profile.finish==='brick'?8:12,t=(j+.5)/count,p=mix(s.back[0],s.back[1],t),a={...p,z:h*.24},b={...p,z:h*.58};
   return path([a,b],profile.finish==='glass'?'#a2bdc2':profile.finish==='brick'?'#aa9785':'#84999b',profile.finish==='glass'?1.25:.65,'opacity=".7"');
  }).join('');
  const double=profile.tiers[i]===2;
  const deck=poly([front[0],front[1],back[1],back[0]],colour,`stroke="#243639" stroke-width=".65"`);
  const upperDeck=double?poly([mix(front[0],back[0],.58),mix(front[1],back[1],.58),back[1],back[0]],colour,`stroke="#9caaa5" stroke-width=".8" opacity=".86"`):'';
  const rows=Array.from({length:double?10:7},(_,j)=>{
   const t=double?(j<5?(j+1)/12:.59+(j-4)*.07):(j+1)/8,a=mix(front[0],back[0],t),b=mix(front[1],back[1],t);
   return path([a,b],j%3===0?'#e7ddd5':'#9eafb1',j%3===0?.78:.5,`opacity="${j%3===0?'.8':'.62'}"`);
  }).join('');
  const aisle=[.22,.5,.78].map(t=>path([mix(front[0],front[1],t),mix(back[0],back[1],t)],'#dfded1',.72,'opacity=".87"')).join('');
  const concourse=double?(()=>{const a=mix(front[0],back[0],.49),b=mix(front[1],back[1],.49),c=mix(front[0],back[0],.57),d=mix(front[1],back[1],.57);return poly([a,b,d,c],'#26383d')+path([c,d],'#c8c5b8',.7)})():'';
  const crowdMarks=crowd?Array.from({length:23},(_,j)=>{const q=(j+.5)/23,t=.18+((j*7)%9)/12,p=mix(mix(front[0],front[1],q),mix(back[0],back[1],q),t),v=project(p);return `<circle cx="${v.x.toFixed(1)}" cy="${v.y.toFixed(1)}" r=".75" fill="${j%4===0?'#f4e6c6':j%3===0?'#f0caca':'#d9e2d9'}"/>`}).join(''):'';
  const roof=profile.roof[i]?(()=>{const t=profile.roofType==='cantilever'?.43:.63,lip=front.map((p,k)=>mix(p,back[k],t)),rear=back.map(p=>({...p,z:p.z+1.4})),lipHigh=lip.map(p=>({...p,z:h+1.05}));const braces=[.14,.38,.62,.86].map(q=>path([mix(lipHigh[0],lipHigh[1],q),mix(rear[0],rear[1],q)],profile.roofType==='truss'?'#d2d7d0':'#9eaaab',profile.roofType==='truss'?.85:.55,'opacity=".74"')).join('');return poly([lipHigh[0],lipHigh[1],rear[1],rear[0]],profile.roofType==='continuous'?'#566f71':profile.finish==='glass'?'#647f83':'#47595c',`stroke="#a5b7b6" stroke-width=".8" opacity=".92"`)+braces+(profile.roofType==='truss'?path([lipHigh[0],rear[1]],'#acb5b3',.5,'opacity=".62"'):'')})():'';
  const supports=[.08,.34,.66,.92].map(t=>{const p=mix(s.back[0],s.back[1],t),q={...p,z:h};return path([p,q],surfaces[1],1)}).join('');
  return {depth:(s.front[0].x+s.front[0].y+s.front[1].x+s.front[1].y)/2,svg:`<g aria-label="${s.label} stand">${face}${facade}${supports}${deck}${upperDeck}${rows}${aisle}${concourse}${crowdMarks}${roof}</g>`};
 }).sort((a,b)=>a.depth-b.depth).map(x=>x.svg).join('');
 const corners=profile.corners?[[18.5,17.7],[53.5,17.7],[53.5,42.3],[18.5,42.3]].map(([a,b],i)=>{
  const h=Math.min(profile.h[i],profile.h[(i+3)%4])*.64;
  return poly([at(a-1,b-1,h),at(a+1,b-1,h),at(a+1,b+1,h),at(a-1,b+1,h)],colour,'stroke="#8a9894" stroke-width=".6"');
 }).join(''):'';
 const lights=[[17.2,16.1],[54.8,16.1],[54.8,43.9],[17.2,43.9]].map(([a,b])=>{
  const top=project(at(a,b,evening?13:11)),base=project(at(a,b));return `<path d="M${base.x.toFixed(1)},${base.y.toFixed(1)}L${top.x.toFixed(1)},${top.y.toFixed(1)}" stroke="#53666a" stroke-width="1.6"/><rect x="${(top.x-4).toFixed(1)}" y="${(top.y-2).toFixed(1)}" width="8" height="3.4" fill="${evening?'#fff4ba':'#aab5ae'}"/>`;
 }).join('');
 const art=`assets/sites/${map.art}-${evening?'night':'day'}.webp`,cx=map.origin[0]*px,cy=map.origin[1]*py;
 const viewBox=close?`${(cx-190).toFixed(1)} ${(cy-128).toFixed(1)} 380 256`:'0 0 1100 550';
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${safe(club?.ground||'Clubline ground')}, ${safe(profile.name)}, ${evening?'evening':'day'}"><image href="${art}" x="0" y="0" width="1100" height="550" preserveAspectRatio="none"/>${field.join('')}${corners}${parts}${lights}</svg>`;
}
