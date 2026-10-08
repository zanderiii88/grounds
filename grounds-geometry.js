// Structural stand catalogue approved through the Clubline previews.
export function groundsStand(id){
 const original=legacyGroundsStand(id);if(!original)return original;
 if(['grass','terrace3','terrace5','bleacher3','bleacher5'].includes(id)){
  const t=original.tiers[0];return {...original,partialFrontV:t.startV+(t.rows*t.rowPitch)*.45};
 }
 if(id==='h1'){
  const tiers=[{rows:10,startV:.4,rowPitch:.6,tread:.54,startZ:1.3,rise:1.05},{rows:8,startV:2.15,rowPitch:.65,tread:.59,startZ:10.6,rise:1.35}];
  const depth=7.7,wallH=20.5;
  return {...original,id,tiers,depth,wallH,decks:[{style:'overhang',frontV:2.15,backV:2.15,baseZ:9.45,topZ:10.42}],partialFrontV:4.15,roofRearV:depth+.12,roofFrontZ:wallH+1,roofRearZ:wallH+1.8};
 }
 const variants={s1:[1,8,1.52,.53,0,false],s2:[1,8,3.04,.53,0,false],l1:[1,11,1.52,.58,0,false],l2:[1,11,2.62,.58,0,false],d1:[2,8,1.52,.53,13.1,false],d2:[2,8,1.52,.73,10.2,true],d3:[2,8,2.05,.53,17.0,false],d4:[2,8,2.05,.73,13.3,true],d5:[2,10,1.68,.60,17.5,false],d6:[2,10,1.78,.73,14.0,true],t1:[3,8,1.52,.53,13.1,false],t2:[3,8,1.52,.73,10.2,true]};
 const [count,rows,rake,pitch,lift,overhang]=variants[id]||variants.s1;
 const tiers=Array.from({length:count},(_,i)=>{const startV=overhang?2.0-i*.65:.42+i*(rows*pitch+.65);return {rows,startV,rowPitch:pitch,tread:pitch-.06,startZ:1.5+i*lift,rise:rake+i*.14};});
 const depth=Math.max(...tiers.map(t=>t.startV+t.rows*t.rowPitch))+.35;
 const wallH=Math.max(...tiers.map(t=>t.startZ+(t.rows-1)*t.rise))+.45;
 const decks=tiers.slice(1).map((upper,i)=>({style:overhang?'overhang':'setback',frontV:overhang?upper.startV:tiers[i].startV+tiers[i].rows*tiers[i].rowPitch,backV:upper.startV,baseZ:upper.startZ-1.15,topZ:upper.startZ-.18}));
 const spec={...original,tiers,decks,depth,wallH,roofRearV:depth+.12,roofFrontZ:wallH+1,roofRearZ:wallH+1.8,partialFrontV:tiers.at(-1).startV+2.0};
 // Preserve the approved rake, tier spacing and depth. Map plots must fit the engine.
 return spec;
}

// Tier, deck and roof dimensions transcribed from GROUNDS standSpec.
// Keep the original height and depth adjustments so double and triple bowls
// preserve their staggered deck profiles.
function legacyGroundsStand(id){
 if(id==='empty')return null;
 if(['grass','terrace3','terrace5','bleacher3','bleacher5'].includes(id)){
  const cfg={grass:[1,1.25,.10,.10],terrace3:[3,.43,.32,.40],terrace5:[5,.43,.36,.44],bleacher3:[3,.50,.65,.62],bleacher5:[5,.50,.65,.62]}[id];
  const [rows,pitch,startZ,rise]=cfg;
  const spec={id,depth:.38+rows*pitch,tiers:[{rows,startV:.25,rowPitch:pitch,tread:pitch-.04,startZ,rise}],decks:[],wallH:startZ+(rows-1)*rise+.15,roofFrontZ:startZ+(rows-1)*rise+3.5,roofRearZ:startZ+(rows-1)*rise+3.8,roofRearV:.50+rows*pitch};
  return adjust(spec,true);
 }
  const specs = {
    s1: {
      id: "s1", layout: "single", depth: 4.6,
      tiers: [{ rows: 8, startV: .42, rowPitch: .48, tread: .40, startZ: 1.05, rise: .92 }], decks: [],
      wallH: 8.35, roofFrontZ: 8.72, roofRearZ: 9.30, roofRearV: 4.72, partialFrontV: 2.46,
    },
    s2: {
      id: "s2", layout: "single", depth: 4.6,
      tiers: [{ rows: 8, startV: .42, rowPitch: .48, tread: .40, startZ: 1.05, rise: 2.05 }], decks: [],
      wallH: 16.20, roofFrontZ: 16.55, roofRearZ: 17.35, roofRearV: 4.72, partialFrontV: 2.46,
    },
    l1: {
      id: "l1", layout: "single", depth: 6.1,
      tiers: [{ rows: 11, startV: .40, rowPitch: .50, tread: .42, startZ: 1.05, rise: 1.05 }], decks: [],
      wallH: 12.9, roofFrontZ: 13.3, roofRearZ: 14.0, roofRearV: 6.2, partialFrontV: 3.35,
    },
    l2: {
      id: "l2", layout: "single", depth: 6.1,
      tiers: [{ rows: 11, startV: .40, rowPitch: .50, tread: .42, startZ: 1.05, rise: 1.78 }], decks: [],
      wallH: 20.6, roofFrontZ: 21.0, roofRearZ: 21.9, roofRearV: 6.2, partialFrontV: 3.35,
    },
    d1: {
      id: "d1", layout: "setback", depth: 5.25,
      tiers: [
        { rows: 5, startV: .40, rowPitch: .48, tread: .40, startZ: 1.05, rise: .78 },
        { rows: 6, startV: 3.14, rowPitch: .35, tread: .30, startZ: 6.15, rise: 1.24 },
      ], decks:[{ style: "setback", frontV: 2.73, backV: 3.33, baseZ: 4.65, topZ: 5.55 }],
      wallH: 13.20, roofFrontZ: 13.55, roofRearZ: 14.25, roofRearV: 5.34, partialFrontV: 3.08,
    },
    d2: {
      id: "d2", layout: "overhang", depth: 5.20,
      tiers: [
        { rows: 6, startV: .40, rowPitch: .47, tread: .39, startZ: 1.05, rise: .76 },
        { rows: 7, startV: 1.72, rowPitch: .49, tread: .43, startZ: 7.25, rise: 1.30 },
      ], decks:[{ style: "overhang", frontV: 1.55, backV: 3.58, baseZ: 5.65, topZ: 6.78 }],
      wallH: 15.65, roofFrontZ: 16.05, roofRearZ: 16.78, roofRearV: 5.30, partialFrontV: 2.22,
    },
    d3: {
      id: "d3", layout: "setback", depth: 5.25,
      tiers: [
        { rows: 5, startV: .40, rowPitch: .48, tread: .40, startZ: 1.05, rise: .92 },
        { rows: 7, startV: 3.02, rowPitch: .34, tread: .29, startZ: 7.15, rise: 1.82 },
      ], decks:[{ style: "setback", frontV: 2.66, backV: 3.26, baseZ: 5.35, topZ: 6.42 }],
      wallH: 19.10, roofFrontZ: 19.50, roofRearZ: 20.35, roofRearV: 5.34, partialFrontV: 3.00,
    },
    d4: {
      id: "d4", layout: "overhang", depth: 5.20,
      tiers: [
        { rows: 6, startV: .40, rowPitch: .47, tread: .39, startZ: 1.05, rise: .90 },
        { rows: 7, startV: 1.62, rowPitch: .50, tread: .44, startZ: 8.20, rise: 2.02 },
      ], decks:[{ style: "overhang", frontV: 1.43, backV: 3.62, baseZ: 6.45, topZ: 7.72 }],
      wallH: 21.10, roofFrontZ: 21.50, roofRearZ: 22.40, roofRearV: 5.30, partialFrontV: 2.14,
    },
    d5: {
      id: "d5", layout: "setback", depth: 6.25,
      tiers: [
        { rows: 7, startV: .40, rowPitch: .49, tread: .41, startZ: 1.05, rise: .92 },
        { rows: 8, startV: 3.95, rowPitch: .35, tread: .31, startZ: 7.65, rise: 1.55 },
      ], decks:[{ style: "setback", frontV: 3.48, backV: 4.05, baseZ: 5.95, topZ: 7.02 }],
      wallH: 19.9, roofFrontZ: 20.3, roofRearZ: 21.2, roofRearV: 6.35, partialFrontV: 3.45,
    },
    d6: {
      id: "d6", layout: "overhang", depth: 6.10,
      tiers: [
        { rows: 7, startV: .40, rowPitch: .49, tread: .41, startZ: 1.05, rise: .90 },
        { rows: 9, startV: 1.90, rowPitch: .50, tread: .44, startZ: 8.65, rise: 1.72 },
      ], decks:[{ style: "overhang", frontV: 1.70, backV: 4.18, baseZ: 6.95, topZ: 8.25 }],
      wallH: 24.8, roofFrontZ: 25.2, roofRearZ: 26.1, roofRearV: 6.18, partialFrontV: 2.55,
    },
    t1: {
      id: "t1", layout: "triple", depth: 6.85,
      tiers: [
        { rows: 5, startV: .40, rowPitch: .48, tread: .40, startZ: 1.05, rise: .82 },
        { rows: 5, startV: 2.95, rowPitch: .33, tread: .28, startZ: 5.85, rise: 1.05 },
        { rows: 7, startV: 5.18, rowPitch: .25, tread: .23, startZ: 11.35, rise: 1.52 },
      ],
      decks:[
        { style: "setback", frontV: 2.54, backV: 3.00, baseZ: 4.65, topZ: 5.45 },
        { style: "setback", frontV: 4.82, backV: 5.18, baseZ: 9.45, topZ: 10.35 },
      ],
      wallH: 22.6, roofFrontZ: 23.0, roofRearZ: 24.0, roofRearV: 6.95, partialFrontV: 3.35,
    },
    t2: {
      id: "t2", layout: "triple", depth: 6.75,
      tiers: [
        { rows: 6, startV: .40, rowPitch: .48, tread: .40, startZ: 1.05, rise: .88 },
        { rows: 6, startV: 1.72, rowPitch: .35, tread: .30, startZ: 7.05, rise: 1.18 },
        { rows: 8, startV: 3.95, rowPitch: .34, tread: .30, startZ: 13.25, rise: 1.85 },
      ],
      decks:[
        { style: "overhang", frontV: 1.55, backV: 3.18, baseZ: 5.85, topZ: 6.95 },
        { style: "overhang", frontV: 3.66, backV: 5.06, baseZ: 11.55, topZ: 12.78 },
      ],
      wallH: 29.2, roofFrontZ: 29.7, roofRearZ: 30.8, roofRearV: 6.85, partialFrontV: 2.15,
    },
  };

 const spec=specs[id]||specs.s1;
 spec.depth=Math.max(spec.depth,...spec.tiers.map(t=>t.startV+t.rows*t.rowPitch+.20));
 spec.roofRearV=Math.max(spec.roofRearV,spec.depth+.10);
 return adjust(spec,false);
}
function adjust(spec,small){
 const heights={terrace3:1.32,terrace5:1.30,bleacher3:1.30,bleacher5:1.28,s1:1.16,s2:1.03,l1:1.12,l2:1.03,d1:1.10,d2:1.10,d3:1.04,d4:1.04,d5:1.04,d6:1.03,t1:1.02,t2:1.00};
 const first=heights[spec.id]||1;
 for(const tier of spec.tiers){tier.startZ*=first;tier.rise*=first}
 for(const deck of spec.decks){deck.baseZ*=first;deck.topZ*=first}
 const lift=spec.wallH*(first-1);spec.wallH*=first;spec.roofFrontZ+=lift;spec.roofRearZ+=lift;
 if(spec.id==='grass')return spec;
 const depth=small?1.12:1.10,height=small?1.14:({s1:1.12,l1:1.12,d1:1.11,d2:1.11}[spec.id]||1.08);
 for(const tier of spec.tiers){tier.startV*=depth;tier.rowPitch*=depth;tier.tread*=depth;tier.startZ*=height;tier.rise*=height}
 for(const deck of spec.decks){deck.frontV*=depth;deck.backV*=depth;deck.baseZ*=height;deck.topZ*=height}
 spec.depth*=depth;spec.roofRearV*=depth;spec.partialFrontV*=depth;
 const more=spec.wallH*(height-1);spec.wallH*=height;spec.roofFrontZ+=more;spec.roofRearZ+=more;
 return spec;
}
