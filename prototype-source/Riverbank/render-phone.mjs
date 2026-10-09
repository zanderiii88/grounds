import fs from 'node:fs';
import {createRequire} from 'node:module';
const sharp=createRequire(import.meta.url)('sharp');
const src=fs.readFileSync(new URL('./review/riverbank-landscape.svg',import.meta.url),'utf8');
for(const [name,w,h,box] of [['landscape',844,285,'-299.82 225 2339.64 790'],['portrait',390,744,'365 -140 1060 1550']]){
 const svg=src.replace(/width="1464" height="872" viewBox="[^"]+"/,`width="${w}" height="${h}" viewBox="${box}"`);
 await sharp(Buffer.from(svg)).flatten({background:'#60862e'}).jpeg({quality:94}).toFile(new URL(`./review/phone-${name}-render.jpg`,import.meta.url).pathname);
}
