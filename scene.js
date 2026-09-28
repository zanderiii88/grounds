const safe = value => String(value || '').replace(/[^#a-zA-Z0-9(),.% -]/g, '');
const poly = (pts, fill, stroke = '#24353d', extra = '') => `<polygon points="${pts.map(p=>p.join(',')).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="2" ${extra}/>`;
const ring = (outer, inner, color) => outer.map((p,i)=>poly([p,outer[(i+1)%4],inner[(i+1)%4],inner[i]],color,'#182d33')).join('');
const diamond = (cx,cy,rx,ry) => [[cx,cy-ry],[cx+rx,cy],[cx,cy+ry],[cx-rx,cy]];

export function sceneSvg(club, site='city') {
 const colour=safe(club?.colour||'#a23545');
 const capacity=club?.capacity||39000;
 const variant=Number(String(club?.id||'C05').slice(1))||5;
 const depth=capacity>=47000?1.08:capacity>=33000?1:0.91;
 const outer=diamond(530,340,370*depth,155*depth);
 const upper=diamond(530,340,326*depth,134*depth);
 const lower=diamond(530,340,292*depth,115*depth);
 const pitch=diamond(530,340,252*depth,88*depth);
 const theme={city:['#294154','#1c303a','#b2b3a9'],harbour:['#244c5e','#204958','#b3b9b0'],university:['#374252','#35413f','#b5a99c'],gardens:['#3a514e','#275047','#b7b3a7'],rail:['#343e4d','#32373d','#9b9d99']}[site]||['#294154','#1c303a','#b2b3a9'];
 const buildings=site==='harbour' ? `<path d="M0 110L260 155 84 230 0 211Z" fill="#2a6677" opacity=".55"/><path d="M0 128L240 165" stroke="#a5ced3" stroke-width="3" opacity=".5"/>`:
 site==='gardens' ? `<g fill="#315e52"><circle cx="108" cy="167" r="35"/><circle cx="184" cy="204" r="26"/><circle cx="934" cy="151" r="32"/><circle cx="1074" cy="255" r="28"/></g>`:
 site==='rail' ? `<path d="M30 80L350 170M20 91L340 181M840 145L1100 214M835 154L1100 223" stroke="#a9a49b" stroke-width="5" opacity=".48"/>`:
 site==='university' ? `<g fill="#8e8d85"><path d="M32 96l150 42v78L32 174z"/><path d="M863 102l160-42v111l-160 43z"/></g><path d="M32 96l75-42 150 39-75 45zM863 102l75-45 160-42-75 45z" fill="#53545a"/>`:
 `<g fill="#66777b"><path d="M18 115l150 42v75L18 189z"/><path d="M887 115l168-50v115l-168 48z"/></g><path d="M18 115l75-43 150 42-75 43zM887 115l80-52 168-51-80 53z" fill="#42525a"/>`;
 const ribs=Array.from({length:9},(_,i)=>{
  const t=(i+1)/10;
  const leftX=outer[3][0]+(outer[0][0]-outer[3][0])*t;
  const leftY=outer[3][1]+(outer[0][1]-outer[3][1])*t;
  const rightX=outer[1][0]+(outer[2][0]-outer[1][0])*t;
  const rightY=outer[1][1]+(outer[2][1]-outer[1][1])*t;
  return `<path d="M${leftX} ${leftY}l21 12M${rightX} ${rightY}l-21 12" stroke="#ecedf099" stroke-width="2" opacity=".65"/>`;
 }).join('');
 const upperRing=outer.map((p,i)=>poly([p,outer[(i+1)%4],upper[(i+1)%4],upper[i]],i===variant%4?'#42515a':'#293e47','#182d33')).join('');
 const lowerRing=upper.map((p,i)=>poly([p,upper[(i+1)%4],lower[(i+1)%4],lower[i]],colour,'#182d33',i===variant%4?'opacity=".76"':'')).join('');
 const innerRing=ring(lower,pitch,'#52616a');
 const northRoof=poly([[530,172],[856,305],[826,318],[530,200]],'#465660','#a8bcc1');
 const southRoof=poly([[200,375],[530,502],[530,480],[234,361]],'#344a53','#9badb3');
 const westRoof=poly([[190,305],[530,172],[530,200],[220,320]],'#3b5058','#92abb2');
 const roofs=(capacity>=47000?northRoof+southRoof:variant%3===0?westRoof:variant%3===1?northRoof:southRoof);
 return `<svg viewBox="0 0 1100 650" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Isometric view of ${safe(club?.ground||'a football stadium')}">
 <defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="${theme[0]}"/><stop offset="1" stop-color="#12242b"/></linearGradient><linearGradient id="grass" x2="0" y2="1"><stop stop-color="#479068"/><stop offset="1" stop-color="#225a46"/></linearGradient><filter id="shadow"><feGaussianBlur stdDeviation="20"/></filter></defs>
 <rect width="1100" height="650" fill="url(#sky)"/><path d="M0 215L530 65 1100 214v435H0z" fill="${theme[1]}"/><path d="M0 331L536 146 1100 316v91L532 223 0 415Z" fill="${theme[2]}" opacity=".43"/><path d="M0 340L539 158 1100 329M0 396L538 214 1100 385" fill="none" stroke="#d9d7c6" stroke-width="2" stroke-dasharray="21 17" opacity=".47"/>
 ${buildings}<path d="M-40 536L470 357 1110 540v110H-40z" fill="#364644"/><path d="M0 551L470 386 1080 558" fill="none" stroke="#b8aa89" stroke-width="8" opacity=".54"/>
 <ellipse cx="530" cy="386" rx="395" ry="140" fill="#03090d" opacity=".5" filter="url(#shadow)"/>
 ${poly(outer,'#1b2c34','#0b1a20')}${upperRing}${lowerRing}${innerRing}${poly(pitch,'url(#grass)','#dbebd8')}
 <path d="M530 252L530 428M350 340L710 340" stroke="#e5f3da" stroke-width="2" opacity=".73" transform="scale(1 ${88*depth/(115*depth)}) translate(0 120)"/>
 <ellipse cx="530" cy="340" rx="45" ry="15" fill="none" stroke="#e5f3da" stroke-width="2" opacity=".7"/>
 ${ribs}${roofs}
 <g fill="#e9eef0" opacity=".68"><circle cx="409" cy="324" r="2"/><circle cx="518" cy="348" r="2"/><circle cx="607" cy="310" r="2"/><circle cx="560" cy="385" r="2"/><circle cx="470" cy="300" r="2"/></g>
 <path d="M108 511L232 467M815 476l161 48" stroke="#eedbad" stroke-width="4" opacity=".35"/><circle cx="949" cy="221" r="4" fill="#f3dfad"/><circle cx="140" cy="282" r="4" fill="#f3dfad"/>
 </svg>`;
}
