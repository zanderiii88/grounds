const safe = value => String(value || '').replace(/[^#a-zA-Z0-9(),.% -]/g, '');
const SITE_ART={
 city:'top-city-redevelopment',harbour:'top-city-redevelopment',gardens:'top-civic-gardens',rail:'top-rail-district',university:'mid-university-district',oldtown:'mid-market-town-aligned'
};
const xy=(x,y)=>`${x.toFixed(1)},${y.toFixed(1)}`;
const points=a=>a.map(p=>xy(...p)).join(' ');
const poly=(a,fill,extra='')=>`<polygon points="${points(a)}" fill="${fill}" ${extra}/>`;
const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
const diamond=(x,y,rx,ry)=>[[x,y-ry],[x+rx,y],[x,y+ry],[x-rx,y]];
const edge=(ring,i)=>[ring[i],ring[(i+1)%4]];
const presets=[
 {name:'The Grand Bowl',roof:[0,1,2,3],tiers:2,corners:true,lights:'corners'},
 {name:'Four Stands',roof:[0,1,2,3],tiers:2,corners:false,lights:'towers'},
 {name:'East Arena',roof:[0,1,2],tiers:2,corners:true,lights:'corners'},
 {name:'Foundry Ground',roof:[0,2],tiers:2,corners:false,lights:'towers'},
 {name:'Thistle Park',roof:[0,1,2],tiers:2,corners:false,lights:'corners'},
 {name:'Civic Bowl',roof:[0,1,2,3],tiers:1,corners:true,lights:'corners'},
 {name:'Albion Terrace',roof:[0,2],tiers:2,corners:false,lights:'towers'},
 {name:'Dockside',roof:[0,1],tiers:1,corners:false,lights:'corners'},
 {name:'Town End',roof:[0,2],tiers:1,corners:false,lights:'towers'},
 {name:'Valley Ground',roof:[0,1,2],tiers:1,corners:true,lights:'corners'},
 {name:'Rath Park',roof:[1,3],tiers:1,corners:false,lights:'towers'},
 {name:'Open Terrace',roof:[0],tiers:1,corners:false,lights:'towers'}
];
export function sceneSvg(club,site='city',crowd=false,evening=false,close=false){
 const colour=safe(club?.colour||'#a23545'),id=Math.max(1,Math.min(12,Number(String(club?.id||'C05').slice(1))||5)),preset=presets[id-1];
 const capacity=club?.capacity||39000,scale=.83+(capacity-20000)/35000*.16;
 const x=550,y=255,outer=diamond(x,y,282*scale,112*scale),upper=diamond(x,y,245*scale,98*scale),mid=diamond(x,y,214*scale,86*scale),lower=diamond(x,y,185*scale,74*scale),pitch=[[x-74*scale,y-59*scale],[x+151*scale,y],[x+74*scale,y+59*scale],[x-151*scale,y]];
 const siteId=SITE_ART[site]||SITE_ART.city,sitePath=`assets/sites/${siteId}-${evening?'night':'day'}.webp`;
 const side=(out,inside,i,fill,extra='')=>poly([out[i],out[(i+1)%4],inside[(i+1)%4],inside[i]],fill,extra);
 const standFaces=[0,1,2,3].map(i=>{
  const upperSeat=side(outer,upper,i,preset.tiers===2?colour:(i%2?'#3f6260':'#426665'),'stroke="#23363b" stroke-width="2" opacity=".82"');
  const upperRows=preset.tiers===2?[.28,.49,.7].map(t=>{const [a,b]=edge(outer,i),[c,d]=edge(upper,i);return `<path d="M${xy(...lerp(a,c,t))}L${xy(...lerp(b,d,t))}" stroke="${t===.49?'#d4d2c5':'#acc1c2'}" stroke-width="2.3" opacity=".75"/>`}).join(''):'';
  const concourse=side(upper,mid,i,'#263b40','stroke="#9baeb0" stroke-width="2"');
  const seating=side(mid,lower,i,colour,'stroke="#e4dad1" stroke-width="2"');
  const lowerRows=[.22,.43,.64,.84].map(t=>{const [a,b]=edge(mid,i),[c,d]=edge(lower,i);return `<path d="M${xy(...lerp(a,c,t))}L${xy(...lerp(b,d,t))}" stroke="#ead9cc" stroke-width="2" opacity=".62"/>`}).join('');
  const aisles=[.24,.51,.77].map(t=>{const a=lerp(mid[i],mid[(i+1)%4],t),b=lerp(lower[i],lower[(i+1)%4],t);return `<path d="M${xy(...a)}L${xy(...b)}" stroke="#e4e1d1" stroke-width="3" opacity=".83"/>`}).join('');
  const crowdSeats=crowd?Array.from({length:17},(_,j)=>{const t=(j+.5)/17,a=lerp(mid[i],mid[(i+1)%4],t),b=lerp(lower[i],lower[(i+1)%4],t),p=lerp(a,b,j%3===0?.38:.7);return `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${j%3===0?2.2:1.7}" fill="${j%5===0?'#fae9c4':j%2?'#e1d9d5':'#c1d9da'}"/>`}).join(''):'';
  const [a,b]=edge(outer,i);const wall=(i===1||i===2)?poly([a,b,[b[0],b[1]+37+(preset.tiers===2?13:0)],[a[0],a[1]+37+(preset.tiers===2?13:0)]],i===1?'#324850':'#263940','stroke="#172a30" stroke-width="2"'):'';
  const pillars=(i===1||i===2)?[.15,.35,.55,.75,.94].map(t=>{const p=lerp(a,b,t);return `<path d="M${xy(...p)}v${37+(preset.tiers===2?13:0)}" stroke="#759098" stroke-width="3" opacity=".6"/>`}).join(''):'';
  const roof=preset.roof.includes(i)?(()=>{const a1=lerp(outer[i],upper[i],.08),b1=lerp(outer[(i+1)%4],upper[(i+1)%4],.08),a2=lerp(outer[i],upper[i],.31),b2=lerp(outer[(i+1)%4],upper[(i+1)%4],.31);return poly([a1,b1,b2,a2],i%2?'#536b70':'#40595f','stroke="#c0cdd0" stroke-width="2"')+Array.from({length:8},(_,j)=>{const t=(j+1)/9;return `<path d="M${xy(...lerp(a1,b1,t))}L${xy(...lerp(a2,b2,t))}" stroke="#9db0b1" stroke-width="1.4"/>`}).join('')})():'';
  return `<g>${wall}${pillars}${upperSeat}${upperRows}${concourse}${seating}${lowerRows}${aisles}${crowdSeats}${roof}</g>`;
 }).join('');
 const floodlights=preset.lights==='towers'?[[310,120],[790,120],[300,420],[800,420]]:[[300,128],[800,128],[300,420],[800,420]];
 const lamps=floodlights.map(([a,b])=>`<g><path d="M${a} ${b}v-62" stroke="#576b71" stroke-width="5"/><path d="M${a-17} ${b-66}h34v-11h-34z" fill="${evening?'#fff4c6':'#adb8ae'}"/>${evening?`<ellipse cx="${a}" cy="${b}" rx="26" ry="8" fill="#fff0ad" opacity=".28"/>`:''}</g>`).join('');
 const cx=x,cy=y;
 const playing=poly(pitch,'url(#grass)','stroke="#e7eedb" stroke-width="3"');
 const stripe=Array.from({length:7},(_,i)=>{const t=(i+1)/8;return poly([lerp(pitch[0],pitch[1],t-.045),lerp(pitch[0],pitch[1],t+.045),lerp(pitch[3],pitch[2],t+.045),lerp(pitch[3],pitch[2],t-.045)],'#edf8dd','opacity=".055"')}).join('');
 const midline=`<path d="M${xy(...lerp(pitch[0],pitch[1],.5))}L${xy(...lerp(pitch[3],pitch[2],.5))}" stroke="#f1f1df" stroke-width="2"/><ellipse cx="${cx}" cy="${cy}" rx="25" ry="11" transform="rotate(18 ${cx} ${cy})" fill="none" stroke="#f1f1df" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="2" fill="#f1f1df"/>`;
 const box=(right=false,small=false)=>{const t=small?.095:.21,top=right?pitch[1]:pitch[0],bottom=right?pitch[2]:pitch[3],otherTop=right?pitch[0]:pitch[1],otherBottom=right?pitch[3]:pitch[2],q=lerp(top,otherTop,t),r=lerp(bottom,otherBottom,t),a=lerp(top,bottom,small?.3:.16),b=lerp(top,bottom,small?.7:.84),d=lerp(q,r,small?.3:.16),e=lerp(q,r,small?.7:.84);return `<path d="M${xy(...a)}L${xy(...d)}L${xy(...e)}L${xy(...b)}" fill="none" stroke="#f1f1df" stroke-width="2"/>`};
 const goals=[false,true].map(right=>{const a=right?pitch[1]:pitch[0],b=right?pitch[2]:pitch[3],middle=lerp(a,b,.5),postA=lerp(a,b,.41),postB=lerp(a,b,.59),offset=right?[9,3]:[-9,-3];return `<path d="M${xy(...postA)}L${xy(postA[0]+offset[0],postA[1]+offset[1])}L${xy(postB[0]+offset[0],postB[1]+offset[1])}L${xy(...postB)}" fill="none" stroke="#f4f3e7" stroke-width="2"/><circle cx="${middle[0]}" cy="${middle[1]}" r="1.5" fill="#f4f3e7"/>`}).join('');
 const viewBox=close?'230 22 640 454':'0 0 1100 550';
 const gapMask=!preset.corners?`<mask id="openCorners"><rect width="1100" height="550" fill="white"/>${outer.map(([a,b])=>`<circle cx="${a}" cy="${b}" r="${id>=8?25:17}" fill="black"/>`).join('')}</mask>`:'';
 return `<svg viewBox="${viewBox}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${safe(preset.name)} at ${safe(club?.ground||'the club ground')}, ${evening?'evening':'day'}"><defs><linearGradient id="grass" x2="0" y2="1"><stop stop-color="${evening?'#459c67':'#4c9b68'}"/><stop offset="1" stop-color="${evening?'#24724e':'#2b7850'}"/></linearGradient><filter id="groundShadow"><feGaussianBlur stdDeviation="14"/></filter>${gapMask}</defs><image href="${sitePath}" x="0" y="0" width="1100" height="550" preserveAspectRatio="none"/><ellipse cx="550" cy="295" rx="${305*scale}" ry="${118*scale}" fill="#071719" opacity=".42" filter="url(#groundShadow)"/>${lamps}<g ${preset.corners?'':'mask="url(#openCorners)"'}>${standFaces}</g>${poly(lower,'#37584c')}${playing}${stripe}${evening?poly(pitch,'#fff4b1','opacity=".09"'):''}${midline}${box(false)}${box(false,true)}${box(true)}${box(true,true)}${goals}</svg>`;
}
