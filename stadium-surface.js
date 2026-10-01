// Cache immutable stand geometry, retaining moving supporters with the same
// roof/wall occlusion as the original SVG. Editable scenes remain SVG.
const jobs=new WeakMap();let serial=0;
const ns='http://www.w3.org/2000/svg';
async function raster(markup,width,height,black=false){
 const url=URL.createObjectURL(new Blob([markup],{type:'image/svg+xml'}));
 try{const source=new Image();source.src=url;await source.decode();const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d');ctx.drawImage(source,0,0);if(black){ctx.globalCompositeOperation='source-in';ctx.fillStyle='#000';ctx.fillRect(0,0,width,height);}const href=canvas.toDataURL('image/png'),ready=new Image();ready.src=href;await ready.decode();return href;}finally{URL.revokeObjectURL(url)}
}
function node(tag,attrs={}){const el=document.createElementNS(ns,tag);for(const [key,value]of Object.entries(attrs))el.setAttribute(key,value);return el}
export function prepareStadiumSurface(svg){
 if(!svg||jobs.has(svg))return jobs.get(svg);
 const job=(async()=>{for(const layer of svg.querySelectorAll('[data-stadium-layer]')){
  if(layer.dataset.baked)continue;
  const box=layer.getBBox(),pad=12,x=box.x-pad,y=box.y-pad,w=box.width+pad*2,h=box.height+pad*2;if(!w||!h)continue;
  const clone=layer.cloneNode(true),fans=[...layer.querySelectorAll('.stand-fan')];clone.querySelectorAll('.stand-fan').forEach(n=>n.remove());
  const scale=Math.min(2,1500/w),width=Math.ceil(w*scale),height=Math.ceil(h*scale),wrap=content=>`<svg xmlns="${ns}" width="${width}" height="${height}" viewBox="${x} ${y} ${w} ${h}">${content}</svg>`;
  const href=await raster(wrap(new XMLSerializer().serializeToString(clone)),width,height);
  const bitmap=node('image',{x,y,width:w,height:h,href,'data-stadium-bitmap':layer.dataset.stadiumLayer});
  const blockers=[...clone.querySelectorAll('[data-fan-occluder="true"]')].map(n=>new XMLSerializer().serializeToString(n)).join('');
  const blocked=await raster(wrap(blockers),width,height,true);
  if(!svg.isConnected)return;
  const id=`supporter-visibility-${++serial}`,defs=node('defs'),mask=node('mask',{id,maskUnits:'userSpaceOnUse',maskContentUnits:'userSpaceOnUse',x,y,width:w,height:h,'mask-type':'luminance'});
  mask.append(node('rect',{x,y,width:w,height:h,fill:'#fff'}),node('image',{x,y,width:w,height:h,href:blocked,'data-supporter-occlusion':layer.dataset.stadiumLayer}));defs.append(mask);
  const crowd=node('g',{'data-visible-supporters':layer.dataset.stadiumLayer,mask:`url(#${id})`});crowd.append(...fans);
  // Swap only after both decoded surfaces are ready. The SVG and animations stay mounted.
  layer.replaceChildren(bitmap,defs,crowd);layer.dataset.baked='true';
 }})().catch(error=>console.warn('Stadium surface retained as SVG:',error.message));jobs.set(svg,job);return job;
}
