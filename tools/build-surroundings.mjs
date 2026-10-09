import sharp from 'sharp';
import fs from 'node:fs';
const root=new URL('../assets/surroundings/',import.meta.url);
for(const id of ['C01','C02','C13'])for(const layer of ['back','front']){
 const input=new URL(`${id}-${layer}.svg`,root),output=new URL(`${id}-${layer}.webp`,root);
 await sharp(fs.readFileSync(input)).resize(2325,1553).webp({quality:92,alphaQuality:100}).toFile(output.pathname);
 console.log(output.pathname);
}
