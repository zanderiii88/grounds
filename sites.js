// Fixed placements shared by setup, renderer and prerendered menus.
// New city maps preserve their natural aspect ratio. Scale changes the whole
// projection equally; stadium geometry and axis directions remain unchanged.
export const SITES=[
 {
  "id": "town",
  "name": "Town Quarter",
  "origin": [
   430,
   1210
  ]
 },
 {
  "id": "riverside",
  "name": "Riverside City",
  "origin": [
   425,
   1210
  ]
 },
 {
  "id": "beach",
  "name": "Beach Resort",
  "origin": [
   427,
   1250
  ]
 },
 {
  "id": "rural",
  "name": "Woodland Station",
  "origin": [
   420,
   1156
  ]
 },
 {
  "id": "glasgow",
  "name": "Sandstone Viaduct",
  "origin": [
   390,
   1150
  ],
  "night": true
 },
 {
  "id": "newcastle",
  "name": "Tyne Quarter",
  "origin": [
   415,
   1230
  ],
  "night": true
 },
 {
  "id": "aberdeen",
  "name": "Granite Harbour",
  "origin": [
   416.43046,
   987.33874
  ],
  "scale": 0.61371434,
  "artHeight": 1535.77007,
  "night": true,
  "plot": [
   [
    411.39913,
    776.4671
   ],
   [
    774.93673,
    995.78995
   ],
   [
    417.02549,
    1204.20892
   ],
   [
    62.36048,
    972.88898
   ]
  ]
 },
 {
  "id": "liverpool",
  "name": "Liverpool Quarter",
  "origin": [
   412.05804,
   1182.96497
  ],
  "scale": 0.61371434,
  "artHeight": 1895,
  "night": true,
  "plot": [
   [
    390.28571,
    960.5
   ],
   [
    780.57143,
    1200.57143
   ],
   [
    437,
    1406.53846
   ],
   [
    40.375,
    1164.25
   ]
  ]
 },
 {
  "id": "manchester",
  "name": "Manchester Quarter",
  "origin": [
   414.6875,
   1182.01964
  ],
  "scale": 0.61371434,
  "artHeight": 1894,
  "night": true,
  "plot": [
   [
    409.5,
    958.42857
   ],
   [
    780.625,
    1194.75
   ],
   [
    422.25,
    1411.65
   ],
   [
    46.375,
    1163.25
   ]
  ]
 },
 {
  "id": "cardiff",
  "name": "Cardiff Quarter",
  "origin": [
   421.16112,
   1179.92419
  ],
  "scale": 0.61371434,
  "artHeight": 1895,
  "night": true,
  "plot": [
   [
    414.09091,
    959.31818
   ],
   [
    774.625,
    1189.25
   ],
   [
    424.5,
    1404.7
   ],
   [
    71.42857,
    1166.42857
   ]
  ]
 },
 {
  "id": "dublin",
  "name": "Dublin Quarter",
  "origin": [
   415.74417,
   1176.26142
  ],
  "scale": 0.61371434,
  "artHeight": 1894,
  "night": true,
  "plot": [
   [
    415.57895,
    947.36842
   ],
   [
    778.625,
    1185.25
   ],
   [
    420.5,
    1410.7
   ],
   [
    48.27273,
    1161.72727
   ]
  ]
 },
 {
  "id": "birmingham",
  "name": "Birmingham Quarter",
  "origin": [
   417.00093,
   972.79423
  ],
  "scale": 0.61371434,
  "artHeight": 1535.77007,
  "night": true,
  "plot": [
   [
    416.11455,
    772.68619
   ],
   [
    773.9865,
    981.53651
   ],
   [
    420.85141,
    1180.69879
   ],
   [
    57.05125,
    956.25542
   ]
  ]
 }
].map(s=>({...s,art:'clubline-'+s.id,limit:75000,east:[7.2*(s.scale||1),4.2*(s.scale||1)],south:[-7.35*(s.scale||1),4.2*(s.scale||1)]}));
export const SHOWCASE_SITES=['aberdeen','liverpool','manchester','cardiff','dublin','birmingham','glasgow','newcastle','town','riverside','beach','rural'];
export const siteById=id=>SITES.find(s=>s.id===id)||SITES[0];
