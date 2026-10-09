import {SECTIONS,normaliseLayout} from './stadium-model.js';
import {groundsStand} from './grounds-geometry.js';
export const FIXED_SURROUNDINGS={"C01": {"id": "fixed-c01", "name": "Armoury FC surroundings", "limit": 75000, "artWidth": 1100, "artHeight": 1400, "origin": [900, 710], "east": [10.8, 6.3], "south": [-11.025, 6.3], "scale": 1.5, "background": null, "reserve": {"x": 3.4600000000000017, "y": 9.18, "w": 58.809999999999995, "d": 41.64}, "box": [-660, -175, 3100, 2070]}, "C02": {"id": "fixed-c02", "name": "Aston Vale surroundings", "limit": 75000, "artWidth": 1100, "artHeight": 1400, "origin": [900, 710], "east": [10.8, 6.3], "south": [-11.025, 6.3], "scale": 1.5, "background": null, "reserve": {"x": 3.4600000000000017, "y": 9.18, "w": 59.849999999999994, "d": 42.13}, "box": [-660, -175, 3100, 2070]}, "C13": {"id": "fixed-c13", "name": "Middleborough FC surroundings", "limit": 75000, "artWidth": 1100, "artHeight": 1400, "origin": [900, 710], "east": [10.8, 6.3], "south": [-11.025, 6.3], "scale": 1.5, "background": null, "reserve": {"x": 9.73, "y": 9.73, "w": 52.54, "d": 40.54}, "box": [-660, -175, 3100, 2070]}};
export const fixedSurroundings=id=>FIXED_SURROUNDINGS[id]||null;
export function fixedSiteError(club,layout){
 const site=fixedSurroundings(club?.id);if(!site)return null;
 const model=normaliseLayout(layout,club),r=site.reserve;
 for(const s of SECTIONS){const cfg=model.sections[s.id],spec=groundsStand(cfg.stand);if(!spec)continue;
 const d=(spec.roofRearV||spec.depth||0)+({compact:0,concourse:1.2,amenities:2,hospitality:2.6}[cfg.rear]||0);
 const sides=s.corner?s.id.split(''):[s.side];
 for(const side of sides)if((side==='W'&&20-d<r.x)||(side==='E'&&52+d>r.x+r.w)||(side==='N'&&20-d<r.y)||(side==='S'&&40+d>r.y+r.d))return 'This stand or roof extends beyond this ground’s fixed buildable site. Choose a smaller option.';
 }return null;
}
export function surroundingsLayer(site,layer,evening=false){const [x,y,w,h]=site.box;return `<image data-surroundings-layer="${layer}" href="assets/surroundings/${Object.keys(FIXED_SURROUNDINGS).find(id=>FIXED_SURROUNDINGS[id]===site)}-${layer}.webp?v=1.50.0-pilot.1" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="none" ${evening?'style="filter:brightness(.60) saturate(.9)"':''}/>`;}
