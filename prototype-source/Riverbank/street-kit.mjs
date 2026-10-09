// Reusable original projected assets. Ground axes match the retained stadium.
export const THEMES={
 sandstone:{wall:'#c5b89c',side:'#958d78',mortar:'#c9bda4',trim:'#e4decc',roof:'#454d50',roofLight:'#687378',door:'#3d4f49',paving:'#b7b3a5'},
 brick:{wall:'#c09460',side:'#89613d',mortar:'#c3a279',trim:'#f0e9ce',roof:'#55473b',roofLight:'#7a6b53',door:'#35524c',paving:'#b7b3a5'},
 render:{wall:'#ebe7d6',side:'#b6b4a0',mortar:'#d2cbb8',trim:'#fff7e5',roof:'#5c5149',roofLight:'#8b7b66',door:'#655242',paving:'#b7b3a5'},
 red:{wall:'#b37148',side:'#794b35',mortar:'#bb916b',trim:'#eee8d4',roof:'#424b4e',roofLight:'#687579',door:'#334c55',paving:'#b7b3a5'}
};
export function streetKit({origin=[680,150],east=[10.8,6.3],south=[-11.025,6.3],zStep=3.825,theme='brick'}={}){
 const t=THEMES[theme],ground=[],objects=[],bounds=[];
 const P=(x,y,z=0)=>[origin[0]+x*east[0]+y*south[0],origin[1]+x*east[1]+y*south[1]-z*zStep];
 const points=a=>a.map(p=>P(...p).map(v=>v.toFixed(2)).join(',')).join(' ');
 const poly=(a,c,extra='')=>`<polygon points="${points(a)}" fill="${c}" ${extra}/>`;
 const line=(a,c,w=.65)=>`<polyline points="${points(a)}" fill="none" stroke="${c}" stroke-width="${w}"/>`;
 const rect=(x,y,w,d,c,z=0)=>poly([[x,y,z],[x+w,y,z],[x+w,y+d,z],[x,y+d,z]],c);
 const object=(kind,x,y,w,d,svg,{eave=0,pavement=false,parent=null}={})=>{const bound={id:'A'+bounds.length,kind,x:x-eave,y:y-eave,w:w+2*eave,d:d+2*eave,pavement,parent};bounds.push(bound);objects.push({depth:x+y+w+d,svg});return bound;};
 function box(x,y,w,d,h,light,dark){return poly([[x+w,y,0],[x+w,y+d,0],[x+w,y+d,h],[x+w,y,h]],dark)+poly([[x,y+d,0],[x+w,y+d,0],[x+w,y+d,h],[x,y+d,h]],light)+rect(x,y,w,d,light,h);}
 function roof(x,y,w,d,h,rise,{hip=false,eave=.11,left=true,right=true,colour=t.roof}={}){
  const xa=x-(left?eave:0),xb=x+w+(right?eave:0),ya=y-eave,yb=y+d+eave,mid=y+d/2,z=h+rise;
  let s='';if(hip){const inset=Math.min(w*.2,d*.4);s+=poly([[xa,ya,h],[xa,yb,h],[xa+inset,mid,z]],t.roofLight);s+=poly([[xa,ya,h],[xb,ya,h],[xb-inset,mid,z],[xa+inset,mid,z]],t.roofLight);s+=poly([[xb,ya,h],[xb,yb,h],[xb-inset,mid,z]],colour);s+=poly([[xa,yb,h],[xb,yb,h],[xb-inset,mid,z],[xa+inset,mid,z]],colour);}
  else{s+=poly([[x+w,y,h],[x+w,y+d,h],[x+w,mid,z]],t.side);s+=poly([[xa,ya,h],[xb,ya,h],[xb,mid,z],[xa,mid,z]],t.roofLight);s+=poly([[xa,yb,h],[xb,yb,h],[xb,mid,z],[xa,mid,z]],colour);}
  // Small courses give texture without turning the assets into realistic renders.
  for(let v=mid+.22;v<yb;v+=.29){const zz=h+rise*(yb-v)/(yb-mid);s+=line([[xa,v,zz+.015],[xb,v,zz+.015]],t.roofLight,.36);}
  s+=line([[xa,yb,h],[xb,yb,h]],'#454d4d',.85);s+=line([[xa,mid,z+.025],[xb,mid,z+.025]],'#9a9b88',.65);
  for(let i=0;i<Math.floor(w*d*2);i++){const u=((i*37+Math.round(x*11))%101+101)%101/101,v=((i*53+Math.round(y*13))%103+103)%103/103;
   const xx=x+.2+u*(w-.4),yy=mid+.15+v*(d*.5-.35),ww=.08+(i%3)*.035,dd=.09;
   if(hip&&(xx<x+w*.23||xx+ww>x+w*.77))continue;
   const heightAt=vv=>h+rise*(yb-vv)/(yb-mid)+.015;
   s+=poly([[xx,yy,heightAt(yy)],[xx+ww,yy,heightAt(yy)],[xx+ww,yy+dd,heightAt(yy+dd)],[xx,yy+dd,heightAt(yy+dd)]],i%3===0?'#4b4740':t.roofLight);
  }
  return s;
 }
 function windowSouth(x,y,z,w=.48,h=.92){let s=poly([[x,y,z],[x+w,y,z],[x+w,y,z+h],[x,y,z+h]],t.trim);s+=poly([[x+.065,y+.01,z+.09],[x+w-.065,y+.01,z+.09],[x+w-.065,y+.01,z+h-.1],[x+.065,y+.01,z+h-.1]],'#40535b');s+=line([[x+.06,y+.02,z+h*.51],[x+w-.06,y+.02,z+h*.51]],t.trim,.65);s+=line([[x,y+.04,z-.035],[x+w,y+.04,z-.035]],'#dfd9c3',.9);return s;}
 function windowEast(x,y,z,w=.48,h=.92){let s=poly([[x,y,z],[x,y+w,z],[x,y+w,z+h],[x,y,z+h]],t.trim);s+=poly([[x+.01,y+.07,z+.09],[x+.01,y+w-.07,z+.09],[x+.01,y+w-.07,z+h-.1],[x+.01,y+.07,z+h-.1]],'#40535b');s+=line([[x+.02,y+.06,z+h*.51],[x+.02,y+w-.06,z+h*.51]],t.trim,.6);return s;}
 function chimney(x,y,z){let s=poly([[x,y,z-1.5],[x+.28,y,z-1.5],[x+.28,y,z],[x,y,z]],'#977358')+poly([[x+.28,y,z-1.5],[x+.28,y+.3,z-1.5],[x+.28,y+.3,z],[x+.28,y,z]],'#72543e');s+=rect(x-.03,y-.03,.34,.36,'#c4b194',z);for(const xx of [x+.06,x+.19])s+=poly([[xx,y+.2,z],[xx+.08,y+.2,z],[xx+.08,y+.2,z+.25],[xx,y+.2,z+.25]],'#815238');return s;}
 function terrace(x,y,{w=2.45,d=3.2,front='south',first=false,last=false,variant=0,height=4.7}={}){
  const h=height,hip=false;let s=box(x,y,w,d,h,t.wall,t.side);
  for(let z=.35;z<h;z+=.38){s+=line([[x,y+d+.008,z],[x+w,y+d+.008,z]],t.mortar,.24);s+=line([[x+w+.008,y,z],[x+w+.008,y+d,z]],t.mortar,.23);}
  // Rear sash windows are deliberately quieter than the street-facing bay.
  for(const z of [1.1,3.3])for(const xx of [x+.37,x+w-1])s+=windowSouth(xx,y+d+.02,z,.48,.88);
  for(const z of [1.15,3.3])s+=windowEast(x+w+.02,y+.85,z,.48,.88);
  if(front==='south'){
   const bx=x+.25,by=y+d,bw=Math.min(1.05,w*.4),bd=.30,bh=1.7;
   s+=poly([[bx,by,0],[bx+bw,by,0],[bx+bw,by+bd,0],[bx,by+bd,0]],'#a6967e');
   s+=box(bx,by,bw,bd,bh,t.wall,t.side);s+=windowSouth(bx+.15,by+bd+.012,.55,bw-.3,.85);s+=rect(bx-.04,by-.02,bw+.08,bd+.06,t.roof,bh+.04);
   const dx=x+w-.78; s+=poly([[dx,y+d+.025,0],[dx+.45,y+d+.025,0],[dx+.45,y+d+.025,1.82],[dx,y+d+.025,1.82]],variant%3===0?'#754a38':t.door);
   s+=windowSouth(dx+.07,y+d+.04,1.4,.29,.23);s+=rect(dx-.04,y+d+.02,.53,.22,'#aaa594',.1);
   s+=line([[x,y+d+.025,2.55],[x+w,y+d+.025,2.55]],t.trim,.75);
  }
  s+=roof(x,y,w,d,h,2.3,{left:first,right:last,hip});
  // Chimney body starts above the roof, rather than repainting the facade.
  const cx=x+w-.42,cy=y+d*.44,z=h+2.8;s+=poly([[cx,cy,h+1.6],[cx+.24,cy,h+1.6],[cx+.24,cy,z],[cx,cy,z]],'#9e7455');s+=poly([[cx+.24,cy,h+1.6],[cx+.24,cy+.25,h+1.6],[cx+.24,cy+.25,z],[cx+.24,cy,z]],'#78573f');s+=rect(cx-.02,cy-.02,.28,.29,'#d2b995',z);s+=line([[cx+.06,cy+.18,z],[cx+.06,cy+.18,z+.22]],'#86553c',1.2);
  const left=first?.11:0,right=last?.11:0;
  return object('terrace',x-left,y-.11,w+left+right,d+.22+(front==='south'?.33:0),s);
 }
 function smallBuilding(kind,x,y,w,d,{colour='#9b7c5b',h=1.65,parent=null}={}){let s=box(x,y,w,d,h,colour,'#6f624e');s+=roof(x,y,w,d,h,.6,{colour:'#64685c'});s+=poly([[x+w*.15,y+d+.02,0],[x+w*.85,y+d+.02,0],[x+w*.85,y+d+.02,h*.85],[x+w*.15,y+d+.02,h*.85]],kind==='garage'?'#7e8c84':'#786e56');if(kind==='garage')for(let z=.2;z<h*.85;z+=.25)s+=line([[x+w*.16,y+d+.03,z],[x+w*.84,y+d+.03,z]],'#adb0a0',.4);return object(kind,x,y,w,d,s,{eave:.11,parent});}
 function cornerPub(x,y,w=4.8,d=4.1,name='THE LOCAL ARMS'){let s=box(x,y,w,d,5.4,'#c4b48d','#928665');for(const z of [3.6]){for(let xx=x+.4;xx<x+w-.2;xx+=1.2)s+=windowSouth(xx,y+d+.03,z,.64,1.0);for(let yy=y+.5;yy<y+d-.2;yy+=1.3)s+=windowEast(x+w+.03,yy,z,.6,1.0);}
  s+=poly([[x+.2,y+d+.03,.4],[x+w-.2,y+d+.03,.4],[x+w-.2,y+d+.03,2.15],[x+.2,y+d+.03,2.15]],'#324f49');for(let xx=x+.5;xx<x+w-.3;xx+=1.05)s+=windowSouth(xx,y+d+.05,.67,.7,1.15);
  s+=poly([[x+w+.04,y+.2,.4],[x+w+.04,y+d-.2,.4],[x+w+.04,y+d-.2,2.15],[x+w+.04,y+.2,2.15]],'#324f49');
  const a=P(x+.2,y+d+.08,2.55),b=P(x+w-.2,y+d+.08,2.55),dx=b[0]-a[0],dy=b[1]-a[1];s+=poly([[x,y+d+.08,2.25],[x+w,y+d+.08,2.25],[x+w,y+d+.08,2.9],[x,y+d+.08,2.9]],'#30483f');s+=`<text transform="matrix(1 ${dy/dx} 0 1 ${a[0]} ${a[1]})" fill="#e3d6ac" font-family="serif" font-size="3.5" letter-spacing=".4">${name}</text>`;
  s+=roof(x,y,w,d,5.4,2.5,{hip:true,colour:'#675d4c'});s+=chimney(x+.7,y+1.8,8.6);object('corner-pub',x,y,w,d,s,{eave:.12});
 }
 function fence(x,y,w,d,{height=.65,gate=false,brick=false}={}){let s=poly([[x,y,0],[x+w,y+d,0],[x+w,y+d,height],[x,y,height]],brick?'#96785b':'#8b8168');const length=Math.max(w,d),steps=Math.ceil(length/.22);if(!brick)for(let i=0;i<=steps;i++){const f=i/steps;s+=line([[x+w*f,y+d*f,0],[x+w*f,y+d*f,height]],'#67624d',.4);}else for(const z of [.2,.4])s+=line([[x,y,z],[x+w,y+d,z]],'#b59b7c',.35);objects.push({depth:x+y+w+d,svg:s});}
 function bin(x,y){let s=box(x,y,.22,.25,.48,'#40564a','#283c32')+rect(x-.02,y-.02,.26,.29,'#596b57',.5);object('bin',x,y,.22,.25,s,{eave:.025});}
 function shrubs(x,y,w,d){let s=box(x,y,w,d,.55,'#547345','#35593c');for(let i=0;i<Math.ceil(w*d*16);i++){const xx=x+((i*13)%31)/31*w,yy=y+((i*7)%23)/23*d;s+=rect(xx,yy,.09,.08,i%2?'#6f8a4f':'#456b39',.57);}object('hedge',x,y,w,d,s,{eave:.1});}
 function tree(x,y,r=1.05,{height=6.2,tone=0}={}){
  let s=poly([[x-.1,y,0],[x+.1,y,0],[x+.1,y,height-.2],[x-.1,y,height-.2]],'#725637');
  const [cx,cy]=P(x,y,height),rx=r*(east[0]-south[0]),ry=rx*.8;
  const canopy=[[-.95,.1],[-.8,-.55],[-.45,-.7],[-.3,-.95],[.2,-1],[.45,-.8],[.75,-.7],[.95,-.25],[1,.3],[.65,.7],[.3,.9],[-.15,.8],[-.55,.65],[-.9,.5]];
  s+=`<polygon points="${canopy.map(([u,v])=>(cx+u*rx).toFixed(2)+','+(cy+v*ry).toFixed(2)).join(' ')}" fill="${['#28612c','#3b6c34','#486f32'][tone%3]}"/>`;
  for(let i=0;i<82;i++){const angle=i*2.3999,radius=Math.sqrt(((i*43)%83)/83)*.9,xx=Math.cos(angle)*radius*rx,yy=Math.sin(angle)*radius*ry;
   const size=3+i%4,c=['#3c792e','#4d8b33','#659c3e','#2f6b2c'][((i*7)%11)%4];s+=`<rect x="${(cx+xx).toFixed(2)}" y="${(cy+yy).toFixed(2)}" width="${size}" height="${size*.8}" fill="${c}"/>`;}
  // Inverse-project the full ellipse at canopy height, rather than checking just the trunk.
  const det=east[0]*south[1]-south[0]*east[1],bx=Math.max(r+.3,Math.hypot(south[1]*rx,south[0]*ry)/Math.abs(det)),by=Math.max(r+.3,Math.hypot(east[1]*rx,east[0]*ry)/Math.abs(det));
  object('tree',x-bx,y-by,bx*2,by*2,s);
 }
 function washing(x,y,w){let s=line([[x,y,0],[x,y,1.45]],'#76765f',.8)+line([[x+w,y,0],[x+w,y,1.45]],'#76765f',.8)+line([[x,y,1.4],[x+w,y,1.4]],'#938c74',.5);for(let i=0;i<3;i++){const xx=x+.2+i*.38;s+=poly([[xx,y,1.35],[xx+.24,y,1.35],[xx+.24,y,.95],[xx,y,.95]],['#e0ddcd','#b3bdbe','#d9c7bb'][i]);}objects.push({depth:x+y+w,svg:s});}
 function car(x,y,{axis='x',colour='#7b3d36'}={}){
  const w=axis==='x'?1.7:.78,d=axis==='x'?.78:1.7;
  let s=box(x,y,w,d,.72,colour,'#495453');
  const cx=x+(axis==='x'?.42:.06),cy=y+(axis==='x'?.06:.4),cw=axis==='x'?.86:.66,cd=axis==='x'?.66:.87;
  s+=box(cx,cy,cw,cd,1.65,colour,'#4c5e62');
  s+=poly([[cx+.06,cy+cd+.012,.87],[cx+cw-.06,cy+cd+.012,.87],[cx+cw-.06,cy+cd+.012,1.46],[cx+.06,cy+cd+.012,1.46]],'#304c5a');
  s+=poly([[cx+cw+.015,cy+.06,.87],[cx+cw+.015,cy+cd-.06,.87],[cx+cw+.015,cy+cd-.06,1.46],[cx+cw+.015,cy+.06,1.46]],'#819d9e');
  s+=rect(cx+.08,cy+.08,cw-.16,cd-.16,colour,1.68);
  const wheels=axis==='x'?[[x+.28,y+d],[x+w-.28,y+d]]:[[x+w,y+.28],[x+w,y+d-.28]];
  for(const [xx,yy] of wheels){const [px,py]=P(xx,yy,.25);s+=`<circle cx="${px}" cy="${py}" r="1.65" fill="#253330"/><circle cx="${px}" cy="${py}" r=".55" fill="#b2b9a7"/>`;}
  return object('car',x,y,w,d,s,{pavement:true,eave:.02});
 }
 function van(x,y,{colour='#d6d2bd'}={}){
  let s=box(x,y,2.3,1,.7,colour,'#7d857e')+box(x+.16,y+.06,1.75,.87,1.25,colour,'#858c84');
  s+=poly([[x+1.94,y+.98,.5],[x+2.22,y+.98,.5],[x+2.22,y+.98,1.15],[x+1.94,y+.98,1.15]],'#3e555c');
  for(const xx of [x+.42,x+1.96]){const [px,py]=P(xx,y+1,.16);s+=`<circle cx="${px}" cy="${py}" r="1.6" fill="#253432"/>`;}
  return object('van',x,y,2.3,1,s);
 }
 function streetFurniture(kind,x,y){let s='';if(kind==='phone-box'){s=box(x,y,.48,.48,1.85,'#9d302b','#6c2225');for(const z of [.6,1,1.4])s+=windowSouth(x+.08,y+.49,z,.32,.3);s+=roof(x,y,.48,.48,1.85,.12,{colour:'#9c312b'});}else if(kind==='lamp'){s=line([[x,y,0],[x,y,3.5],[x+.24,y,3.5]],'#ddd9c6',.8)+line([[x+.17,y,3.48],[x+.36,y,3.48]],'#3f4d4f',1.3);}else{const [px,py]=P(x,y,2.6);s=line([[x,y,0],[x,y,3]],'#727b75',1)+`<rect x="${px-3}" y="${py-6}" width="6" height="6" fill="#b75c39"/><rect x="${px-2}" y="${py-5}" width="4" height="2" fill="#e2ddd0"/>`;}
  object(kind,x,y,.48,.48,s,{pavement:true,eave:kind==='phone-box'?.11:0});}
 function building(kind,x,y,w,d,{axis='x',variant=0,front=null,height=null,bay=false,dormer=false,awning=false,sign=null}={}){
  const industrial=['warehouse','workshop'].includes(kind),retail=kind==='retail',flat=kind==='flats'||kind==='brickwarehouse'||retail,h=height??(flat?7.5:industrial?3.9:4.5);
  const light=industrial?'#a59c83':t.wall,dark=industrial?'#7f826e':t.side;
  let s=box(x,y,w,d,h,light,dark);
  for(let z=.4;z<h;z+=.42)s+=line([[x,y+d+.01,z],[x+w,y+d+.01,z]],t.mortar,.24);
  if(flat){s+=rect(x-.12,y-.12,w+.24,d+.24,'#646b66',h+.18);s+=rect(x+.3,y+.3,w-.6,d-.6,'#7f867a',h+.2);}
  else if(axis==='x')s+=roof(x,y,w,d,h,industrial?1.1:2.0,{hip:kind==='semi',colour:industrial?'#737970':t.roof});
  else{
   const mid=x+w/2,rise=industrial?1.1:2.0;
   s+=poly([[x,y+d,h],[x+w,y+d,h],[mid,y+d,h+rise]],light);
   s+=poly([[x-.11,y-.11,h],[mid,y-.11,h+rise],[mid,y+d+.11,h+rise],[x-.11,y+d+.11,h]],t.roofLight);
   s+=poly([[mid,y-.11,h+rise],[x+w+.11,y-.11,h],[x+w+.11,y+d+.11,h],[mid,y+d+.11,h+rise]],t.roof);
   for(let xx=mid+.2;xx<x+w+.1;xx+=.3){const z=h+rise*(x+w+.11-xx)/(w/2+.11);s+=line([[xx,y-.11,z],[xx,y+d+.11,z]],t.roofLight,.36);}
   s+=line([[mid,y-.11,h+rise],[mid,y+d+.11,h+rise]],'#969988',.6);
  }
  if(kind==='brickwarehouse'){s+=poly([[x+.7,y+d+.04,0],[x+3.1,y+d+.04,0],[x+3.1,y+d+.04,2.4],[x+.7,y+d+.04,2.4]],'#475650');}
  if(retail){
   // Low retail roofs have modest rooflights and plant, within the footprint.
   for(const yy of [y+2.1,y+d*.63]){
    s+=rect(x+1.3,yy,Math.max(1,w*.55),.65,'#a6b2ad',h+.24);
    for(let xx=x+1.3;xx<x+1.3+w*.55;xx+=1.15)s+=line([[xx,yy,h+.26],[xx,yy+.65,h+.26]],'#758681',.6);
   }
   s+=rect(x+w-2.0,y+1.0,.95,.85,'#858d85',h+.35);
  }
  if(industrial){
   for(let xx=x+1;xx<x+w-2.5;xx+=5.2){
    s+=poly([[xx,y+d+.04,0],[xx+2.5,y+d+.04,0],[xx+2.5,y+d+.04,2.4],[xx,y+d+.04,2.4]],'#53625a');
    for(let z=.25;z<2.4;z+=.3)s+=line([[xx,y+d+.05,z],[xx+2.5,y+d+.05,z]],'#a2a797',.45);
   }
   if(axis==='x'&&w>15)for(let xx=x+2;xx<x+w-2;xx+=5)s+=poly([[xx,y+d*.63,h+.8],[xx+2.4,y+d*.63,h+.8],[xx+2.4,y+d*.76,h+.53],[xx,y+d*.76,h+.53]],'#b5c1b6');
   s+=poly([[x+w+.025,y+.3,0],[x+w+.025,y+d-.3,0],[x+w+.025,y+d-.3,2.8],[x+w+.025,y+.3,2.8]],'#59685f');
   for(let z=.3;z<2.8;z+=.35)s+=line([[x+w+.03,y+.3,z],[x+w+.03,y+d-.3,z]],'#a2a797',.45);
   for(let xx=x+.4;xx<x+w-.5;xx+=1.0)s+=windowSouth(xx,y+d+.03,2.8,.65,.5);
  }else{
   for(let z=1.1;z<h-1;z+=2.1){for(let xx=x+.35;xx<x+w-.65;xx+=1.1)s+=windowSouth(xx,y+d+.03,z,.55,.85);for(let yy=y+.4;yy<y+d-.55;yy+=1.1)s+=windowEast(x+w+.03,yy,z,.5,.85);}
   if(axis==='y'&&front==='west'){/* Street entrance is on the face away from the camera. */}
   else if(axis==='y'&&front!=='south'){s+=poly([[x+w+.04,y+d-.8,0],[x+w+.04,y+d-.35,0],[x+w+.04,y+d-.35,1.8],[x+w+.04,y+d-.8,1.8]],t.door);}
   else if(kind!=='semi')s+=poly([[x+w-.7,y+d+.04,0],[x+w-.25,y+d+.04,0],[x+w-.25,y+d+.04,1.8],[x+w-.7,y+d+.04,1.8]],t.door);
   if(kind==='semi'){for(const dx of [x+w*.5-.65,x+w*.5+.2])s+=poly([[dx,y+d+.04,0],[dx+.42,y+d+.04,0],[dx+.42,y+d+.04,1.8],[dx,y+d+.04,1.8]],t.door);s+=line([[x+w*.5,y+d+.045,0],[x+w*.5,y+d+.045,h]],t.mortar,.55);}
   if(kind==='gable')s+=windowSouth(x+w*.5-.2,y+d+.035,h+.3,.4,.6);
   if(kind==='shop'||retail){const c=['#355b4c','#954e37','#435b71'][variant%3];s+=poly([[x+.15,y+d+.05,.4],[x+w-.15,y+d+.05,.4],[x+w-.15,y+d+.05,2.1],[x+.15,y+d+.05,2.1]],'#40575a');s+=poly([[x,y+d+.06,2.25],[x+w,y+d+.06,2.25],[x+w,y+d+.06,2.8],[x,y+d+.06,2.8]],c);s+=line([[x+.2,y+d+.07,2.55],[x+w-.2,y+d+.07,2.55]],'#e0d4b4',1.0);}
   if(bay){const bx=x+.25,by=y+d,bw=Math.min(1.35,w*.46);s+=box(bx,by,bw,.34,1.8,light,dark)+windowSouth(bx+.12,by+.355,.6,bw-.24,.9)+rect(bx-.035,by-.03,bw+.07,.4,t.roof,1.84);}
   if(dormer&&!flat&&axis==='x'){const xx=x+w*.48,yy=y+d*.68,zz=h+1.02;s+=poly([[xx,yy+.48,zz],[xx+.72,yy+.48,zz],[xx+.72,yy+.48,zz+.7],[xx,yy+.48,zz+.7]],t.wall)+windowSouth(xx+.1,yy+.49,zz+.1,.52,.48);s+=roof(xx,yy,.72,.48,zz+.7,.32,{colour:t.roof});}
   if(awning&&kind==='shop'){const c=['#355b4c','#994d35','#405b76'][variant%3];s+=poly([[x+.08,y+d+.03,2.24],[x+w-.08,y+d+.03,2.24],[x+w-.08,y+d+.38,1.95],[x+.08,y+d+.38,1.95]],c);for(let xx=x+.14;xx<x+w-.2;xx+=.38)s+=poly([[xx,y+d+.04,2.24],[xx+.12,y+d+.04,2.24],[xx+.12,y+d+.39,1.95],[xx,y+d+.39,1.95]],'#e6dcc0');}
   if(sign&&(kind==='shop'||retail)){const [px,py]=P(x+.2,y+d+.07,2.56);s+=`<text transform="matrix(1 ${south[1]/east[0]} 0 1 ${px} ${py})" fill="#f3e5c2" font-family="serif" font-size="2.6" letter-spacing=".12">${sign}</text>`;}
   if(!flat)s+=chimney(x+w*.4,y+d*.4,h+2.6);
  }
  return object(kind,x,y,w,d+((bay||awning)?.4:0),s,{eave:.13});
 }
 function container(x,y,w=6,d=2,{colour='#7c8c87',stack=1,topColour=null}={}){
  const shade=(hex,f)=>'#'+hex.slice(1).match(/../g).map(v=>Math.round(parseInt(v,16)*f).toString(16).padStart(2,'0')).join('');
  function unit(c,z=0){let s=box(x,y,w,d,2.5,c,shade(c,.68));
   for(let xx=x+.25;xx<x+w;xx+=.45)s+=line([[xx,y+d+.02,.12],[xx,y+d+.02,2.35]],shade(c,.73),.65);
   s+=rect(x+.1,y+.1,w-.2,d-.2,shade(c,1.12),2.53);
   // End doors and locking bars distinguish storage containers from trailers.
   s+=line([[x+w+.03,y+d/2,.15],[x+w+.03,y+d/2,2.35]],'#c0baa0',.65);
   for(const yy of [y+.4,y+d-.4])s+=line([[x+w+.035,yy,.23],[x+w+.035,yy,2.2]],'#b0b5a1',.65);
   return z?`<g transform="translate(0 ${-z*zStep})">${s}</g>`:s;
  }
  const s=unit(colour)+(stack>1?unit(topColour||colour,2.58):'');
  return object('container',x,y,w,d,s,{eave:.04});
 }
 function truck(x,y,{colour='#aeb7ae',cargo='#c5c4ae'}={}){
  let s=box(x,y,5.4,1.55,.42,'#414b49','#303d3b');
  s+=box(x+.08,y+.04,3.82,1.47,3.7,cargo,'#858b7c');
  s+=line([[x+.18,y+1.53,.55],[x+3.85,y+1.53,.55]],'#e5dfc7',.7);
  s+=box(x+4.05,y+.1,1.28,1.35,3.35,colour,'#596f70');
  s+=poly([[x+4.17,y+1.46,1.75],[x+4.87,y+1.46,1.75],[x+4.87,y+1.46,3.04],[x+4.17,y+1.46,3.04]],'#304b58');
  s+=poly([[x+5.34,y+.22,1.75],[x+5.34,y+1.31,1.75],[x+5.34,y+1.31,2.95],[x+5.34,y+.22,2.95]],'#8fa8a5');
  s+=line([[x+5.35,y+.2,.49],[x+5.35,y+1.35,.49]],'#e1dbc4',1.2);
  for(const xx of [x+.65,x+3.0,x+3.46,x+4.75]){const [px,py]=P(xx,y+1.56,.2);s+=`<circle cx="${px}" cy="${py}" r="2.8" fill="#23302e"/><circle cx="${px}" cy="${py}" r=".85" fill="#a2a89b"/>`;}
  return object('truck',x,y,5.4,1.58,s,{eave:.04});
 }
 function trailer(x,y,{colour='#b4b3a2'}={}){
  let s=box(x,y,4.6,1.6,3.7,colour,'#777f75');
  for(const xx of [x+.7,x+1.1]){const [px,py]=P(xx,y+1.62,.18);s+=`<circle cx="${px}" cy="${py}" r="2.7" fill="#273632"/>`;}
  s+=line([[x+4.2,y+1.5,0],[x+4.2,y+1.5,.5]],'#414d46',1.2);
  return object('trailer',x,y,4.6,1.65,s,{eave:.03});
 }
 function pallets(x,y,{w=1.4,d=1.2,crates=true}={}){
  let s=box(x,y,w,d,.24,'#b5a074','#776949');
  for(let xx=x+.12;xx<x+w;xx+=.24)s+=line([[xx,y,.26],[xx,y+d,.26]],'#6e6245',.55);
  if(crates){s+=box(x+.08,y+.08,w-.16,d-.16,1.05,'#b5a486','#837a61');s+=line([[x+.08,y+d-.07,.55],[x+w-.08,y+d-.07,.55]],'#686c57',.65);}
  return object('pallets',x,y,w,d,s,{eave:.02});
 }
 function skip(x,y,{colour='#aa853c'}={}){
  let s=box(x,y,2.0,1.25,.8,colour,'#75652f');
  s+=rect(x+.15,y+.15,1.7,.95,'#3c493f',.83);
  for(let i=0;i<7;i++)s+=rect(x+.23+(i%4)*.35,y+.22+(i%3)*.23,.3,.18,['#8b8d77','#b2a889','#646f60'][i%3],.86);
  return object('skip',x,y,2,1.25,s,{eave:.03});
 }
 function heritageHall(x,y){
  let s=box(x+3,y,14,6.5,7.8,'#aa6044','#754932');
  s+=roof(x+3,y,14,6.5,7.8,2.7,{colour:'#534d43'});
  for(const xx of [x,x+16]){s+=box(xx,y+1,4,11,7.1,'#ad6848','#784d38');s+=roof(xx,y+1,4,11,7.1,2.4,{colour:'#585347'});s+=chimney(xx+1,y+4,10.7);}
  for(let xx=x+4;xx<x+16;xx+=2)for(const z of [1.3,4.5])s+=windowSouth(xx,y+6.53,z,.8,1.4);
  for(const xx of [x+.5,x+16.5])for(const z of [1.2,4.4])for(const dx of [0,1.6])s+=windowSouth(xx+dx,y+12.03,z,.8,1.3);
  s+=poly([[x+9,y+6.55,0],[x+11,y+6.55,0],[x+11,y+6.55,2.8],[x+9,y+6.55,2.8]],'#414c40');
  return object('heritage-hall',x,y,20,12,s,{eave:.15});
 }
 function marketStall(x,y,{colour='#356961',produce=0}={}){
  const w=3.8,d=2.2,h=2.3;
  let s=box(x+.2,y+.25,w-.4,1.3,.85,'#9a8967','#706a56');
  for(let j=0;j<5;j++)s+=rect(x+.35+j*.62,y+.45,.5,.7,['#a15736','#79924a','#c4a85a'][(j+produce)%3],.88);
  for(const xx of [x,x+w])for(const yy of [y,y+d])s+=line([[xx,yy,0],[xx,yy,h]],'#727d73',.8);
  s+=poly([[x-.1,y-.1,h+.28],[x+w+.1,y-.1,h+.28],[x+w+.1,y+d+.1,h],[x-.1,y+d+.1,h]],colour);
  for(let xx=x+.15;xx<x+w;xx+=.6)s+=poly([[xx,y-.1,h+.28],[xx+.22,y-.1,h+.28],[xx+.22,y+d+.1,h],[xx,y+d+.1,h]],'#e1d8bd');
  return object('market-stall',x,y,w,d,s,{eave:.1});
 }
 function marketHall(x,y,w,d,{roof:colour='#71837f'}={}){
  const h=3.3;let s=rect(x,y,w,d,'#a8a897');
  for(let xx=x+.3;xx<x+w;xx+=4)for(const yy of [y+.2,y+d-.2])s+=line([[xx,yy,0],[xx,yy,h]],'#85908b',1.1);
  // Open frontage and produce counters sit under a simple low metal canopy.
  for(let xx=x+.5;xx<x+w-2;xx+=3.1){s+=box(xx,y+d-1.5,2.4,1,.85,'#a19573','#6e7767');for(let j=0;j<3;j++)s+=rect(xx+.2+j*.65,y+d-1.3,.5,.6,['#a16d43','#849249','#baa454'][j],.88);}
  s+=rect(x-.1,y-.1,w+.2,d+.2,colour,h);
  for(let xx=x+.3;xx<x+w;xx+=1.2)s+=line([[xx,y-.1,h+.015],[xx,y+d+.1,h+.015]],'#a0aaa1',.55);
  s+=poly([[x-.1,y+d+.1,h],[x+w+.1,y+d+.1,h],[x+w+.1,y+d+.1,h-.3],[x-.1,y+d+.1,h-.3]],'#5a6d67');
  s+=poly([[x+w+.1,y-.1,h],[x+w+.1,y+d+.1,h],[x+w+.1,y+d+.1,h-.3],[x+w+.1,y-.1,h-.3]],'#4b625b');
  return object('market-hall',x,y,w,d,s,{eave:.1});
 }
 function church(x,y){
  let s=box(x+2,y,6,12,5.8,'#b59e73','#817956')+roof(x+2,y,6,12,5.8,3.2,{colour:'#626254'});
  s+=box(x,y+9,4.5,4.5,13,'#b6a37a','#827554');
  for(const xx of [x+.4,x+1.7,x+3])s+=box(xx,y+9, .6,.6,13.8,'#c0ae8b','#8d8062');
  s+=windowSouth(x+1.5,y+13.53,9,1.1,2.3);s+=windowEast(x+4.53,y+10.5,9,1.1,2.3);
  for(const yy of [y+1.3,y+4.2,y+7.2])s+=windowEast(x+8.03,yy,2.1,1.1,2.2);
  return object('church',x,y,8,13.5,s,{eave:.15});
 }
 function dockCrane(x,y){
 let s=box(x+1,y+.7,2.2,2.2,1.3,'#8e8e7b','#666f64');
 for(const xx of [x+1.2,x+3])for(const yy of [y+.9,y+2.7])s+=line([[xx,yy,1.3],[x+2.1,y+1.8,19]],'#b59342',2.2);
 s+=`<g transform="translate(0 ${-18*zStep})">`+box(x+.7,y+1.1,3.3,1.3,1.4,'#aa8a3e','#756d3f')+'</g>';
 s+=poly([[x,y+1.1,20],[x+12.6,y+1.1,20],[x+12.6,y+2.3,20],[x,y+2.3,20]],'#b89a4b');
 for(let xx=x+.4;xx<x+12;xx+=1.1)s+=line([[xx,y+2.3,20],[xx+.55,y+2.3,21.2],[xx+1.1,y+2.3,20]],'#796d3e',.8);
 s+=line([[x+11.5,y+1.8,20],[x+11.5,y+1.8,3.5]],'#58645a',.8);
 return object('dock-crane',x,y,13,4,s);
}
function storageTank(x,y,w=8,d=8,{height=7}={}){
 const pts=Array.from({length:16},(_,i)=>[x+w/2+Math.cos(i*Math.PI/8)*w/2,y+d/2+Math.sin(i*Math.PI/8)*d/2]);let s='';
 for(const i of Array.from({length:16},(_,i)=>i).sort((a,b)=>(pts[a][0]+pts[a][1]+pts[(a+1)%16][0]+pts[(a+1)%16][1])-(pts[b][0]+pts[b][1]+pts[(b+1)%16][0]+pts[(b+1)%16][1]))){const a=pts[i],b=pts[(i+1)%16];s+=poly([[...a,0],[...b,0],[...b,height],[...a,height]],i<4?'#bcbcac':'#8d9689');}
 s+=poly(pts.map(p=>[...p,height]),'#d0cdb8');s+=line([...pts,pts[0]].map(p=>[...p,height]),'#89978b',.9);
 for(const z of [height*.33,height*.66])s+=line(pts.slice(0,9).map(p=>[...p,z]),'#8d9587',.6);
 return object('storage-tank',x,y,w,d,s);
}
function grave(x,y,{height=1}={}){const w=.48,d=.34;let s=box(x,y,w,d,height,'#b8b7a1','#898e81');s+=line([[x+.12,y+d+.02,height*.5],[x+w-.12,y+d+.02,height*.5]],'#81897e',.5);return object('grave-marker',x,y,w,d,s);}
 return {dockCrane,storageTank,grave,marketHall,marketStall,P,poly,line,rect,ground,objects,bounds,box,building,terrace,smallBuilding,cornerPub,fence,bin,shrubs,tree,washing,car,van,truck,container,trailer,pallets,skip,heritageHall,church,streetFurniture};
}
