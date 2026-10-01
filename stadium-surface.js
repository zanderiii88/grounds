// Rasterize only the immutable stand structure. People, supporters and football
// stay as SVG overlays, avoiding repeated painting of thousands of seat faces.
const jobs=new WeakMap();
export function prepareStadiumSurface(svg){
 if(!svg||jobs.has(svg))return jobs.get(svg);
 const job=(async()=>{for(const layer of svg.querySelectorAll('[data-stadium-layer]')){
  if(layer.dataset.baked)return;
  const box=layer.getBBox(),pad=3,x=box.x-pad,y=box.y-pad,w=box.width+pad*2,h=box.height+pad*2;if(!w||!h)continue;
  const clone=layer.cloneNode(true),fans=[...layer.querySelectorAll('.stand-fan')];clone.querySelectorAll('.stand-fan').forEach(n=>n.remove());
  const scale=Math.min(2,1500/w),width=Math.ceil(w*scale),height=Math.ceil(h*scale);
  const markup=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${x} ${y} ${w} ${h}">${new XMLSerializer().serializeToString(clone)}</svg>`;
  const url=URL.createObjectURL(new Blob([markup],{type:'image/svg+xml'}));
  try{const image=new Image();image.src=url;await image.decode();const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;canvas.getContext('2d').drawImage(image,0,0);const bitmap=document.createElementNS('http://www.w3.org/2000/svg','image');for(const [key,val] of Object.entries({x,y,width:w,height:h,href:canvas.toDataURL('image/png')}))bitmap.setAttribute(key,val);bitmap.setAttribute('data-stadium-bitmap',layer.dataset.stadiumLayer);
   // Decode before the atomic swap; the original stand remains until ready.
   const ready=new Image();ready.src=bitmap.getAttribute('href');await ready.decode();if(!svg.isConnected)return;
   if(layer.dataset.stadiumLayer==='far'){for(const fan of fans)layer.after(fan);}
   layer.replaceChildren(bitmap);layer.dataset.baked='true';
  }finally{URL.revokeObjectURL(url)}
 }} )().catch(error=>{console.warn('Stadium surface retained as SVG:',error.message)});jobs.set(svg,job);return job;
}
