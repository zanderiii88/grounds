import {sceneSvg,stadiumProfile} from './scene.js?v=1.4.1';

const APP_VERSION='1.4.1';
const SAVE_KEY='clubline-career-r1';
const SITES=[['city','City Waterfront'],['gardens','Civic Gardens'],['rail','Rail District'],['university','University Quarter'],['oldtown','Old Town']];
const availableSites=c=>c.capacity>=45000?SITES.slice(0,3):SITES;
const COLOURS=['#862e43','#de414b','#e17837','#e7bd63','#257b5e','#1b8189','#3a6cbc','#633d8d','#edf0e9','#252c38'];
const FORMATIONS={
 '4-3-3':[['LW','ST','RW'],['CM','DM','CM'],['LB','CB','CB','RB'],['GK']],
 '4-2-3-1':[['ST'],['LW','AM','RW'],['DM','DM'],['LB','CB','CB','RB'],['GK']],
 '4-4-2':[['ST','ST'],['LW','CM','CM','RW'],['LB','CB','CB','RB'],['GK']],
 '3-5-2':[['ST','ST'],['LB','CM','DM','CM','RB'],['CB','CB','CB'],['GK']],
 '4-1-4-1':[['ST'],['LW','CM','CM','RW'],['DM'],['LB','CB','CB','RB'],['GK']],
 '4-3-2-1':[['ST'],['AM','AM'],['CM','DM','CM'],['LB','CB','CB','RB'],['GK']],
 '3-4-3':[['LW','ST','RW'],['LB','CM','CM','RB'],['CB','CB','CB'],['GK']],
 '5-3-2':[['ST','ST'],['CM','DM','CM'],['LB','CB','CB','CB','RB'],['GK']],
 '4-1-2-1-2':[['ST','ST'],['AM'],['CM','CM'],['DM'],['LB','CB','CB','RB'],['GK']]
};
const STYLES=['Balanced','High press','Possession','Direct','Counter'];
const ORDERS=['Standard','Attack','Protect lead'];
const html=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stars=(n,label)=>`<span class="stars" aria-label="${label}: ${n} of 5 stars">${'★'.repeat(n)}<span>${'☆'.repeat(5-n)}</span></span>`;
const fmtMoney=n=>'£'+Math.round(n||0).toLocaleString('en-GB');
const fmtDate=s=>new Date(s+'T12:00:00Z').toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
const addDays=(s,n)=>new Date(Date.parse(s+'T12:00:00Z')+86400000*n).toISOString().slice(0,10);
const rand=(arr)=>arr[Math.floor(Math.random()*arr.length)];
let dragGhost=null,dragTarget=null,activeDrag=null,suppressDragClick=false,autoResumeTimer=null;
let source,career=null,view='title',section='squad',sub='lineup',setup={clubId:'C01',site:'city',names:{},colour:null},selectedPlayer=null,selectedSlot=null,match=null,timer=null,notice='',updateMessage='',availableVersion=null,checkingUpdate=false;
const root=document.getElementById('app');

try {source=await (await fetch('./data/league.json',{cache:'no-store'})).json();}
catch(error){root.innerHTML='<main class="app-shell"><div class="shell-content"><h1>Clubline</h1><p>Could not load the league data. Open the game through a web server or GitHub Pages.</p></div></main>';throw error;}
const club=id=>source.clubs.find(c=>c.id===id);
const player=id=>source.players.find(p=>p.id===id);
const owner=id=>career?.owners?.[id]||player(id)?.clubId;
const squadPlayers=id=>source.players.filter(p=>owner(p.id)===id);
const transferValue=p=>Math.round((p.overall-55)**2*4500+Math.max(0,p.potential-p.overall)*22000);
const myClub=()=>club(career?.clubId||setup.clubId);
const clubName=id=>career?.names?.[id]||setup.names?.[id]||club(id)?.name||id;
const myColour=()=>career?.colour||setup.colour||myClub()?.colour||'#e5484f';
const playerFitness=id=>career?.players?.[id]?.fitness??player(id)?.fitness??80;
const slotsFor=f=>FORMATIONS[f||'4-3-3'].flat();
const opposition=(fixture,me)=>fixture.home===me?fixture.away:fixture.home;

function bestLineup(clubId,formation){
 const pool=squadPlayers(clubId);
 const remaining=pool.filter(p=>!(career?.clubId===clubId&&career?.players?.[p.id]?.injuryDays>0));
 const slots=slotsFor(formation);
 const lineup=slots.map(pos=>{
  remaining.sort((a,b)=>(b.positions[pos]+(b.primary===pos?3:0)+(playerFitness(b.id)-80)*.05)-(a.positions[pos]+(a.primary===pos?3:0)+(playerFitness(a.id)-80)*.05));
  const choice=remaining.shift();return choice?.id||null;
 });
 remaining.sort((a,b)=>(b.overall+(playerFitness(b.id)-80)*.08)-(a.overall+(playerFitness(a.id)-80)*.08));
 const bench=[];const keeper=remaining.find(p=>p.primary==='GK');if(keeper){bench.push(keeper.id);remaining.splice(remaining.indexOf(keeper),1)}
 bench.push(...remaining.slice(0,7-bench.length).map(p=>p.id));
 return {lineup,bench};
}
function scheduleSeason(){
 const ids=source.clubs.map(c=>c.id),rotation=[...ids],rounds=[];
 for(let cycle=0;cycle<2;cycle++) for(let r=0;r<11;r++){
  const fixtures=[];
  for(let i=0;i<6;i++){
   const a=rotation[i],b=rotation[11-i],reverse=(r%2===0) !== (cycle===0);
   fixtures.push({home:reverse?b:a,away:reverse?a:b,kickoff:['15:00','17:30','19:45'][(r+i+cycle)%3],homeGoals:null,awayGoals:null});
  }
  rounds.push({date:addDays('2026-08-15',rounds.length*7),fixtures});
  rotation.splice(1,0,rotation.pop());
 }
 return rounds;
}
function newCareer(){
 const c=club(setup.clubId),choice=bestLineup(c.id,c.formation);
 career={version:1,clubId:c.id,names:{...setup.names},colour:setup.colour||c.colour,site:setup.site,date:'2026-08-13',time:'09:00',balance:c.budget*5,formation:c.formation,style:c.style,order:'Standard',lineup:choice.lineup,bench:choice.bench,players:Object.fromEntries(source.players.map(p=>[p.id,{fitness:p.fitness,form:[]}])),owners:{},transferList:[],offers:[],schedule:scheduleSeason(),reports:[],news:[],kit:{home:'solid',away:'stripes'}};
 view='career';section='squad';sub='lineup';save();render();
}
function save(){if(career)localStorage.setItem(SAVE_KEY,JSON.stringify({career,match}));}
function load(){try{const saved=JSON.parse(localStorage.getItem(SAVE_KEY));if(saved?.career?.version===1){career=saved.career;career.owners??={};career.transferList??=[];career.offers??=[];if(career.site==='harbour')career.site='city';match=saved.match||null;if(match)match.kickoff??='15:00';return true}}catch{}return false}
const hasSave=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY))?.career?.version===1}catch{return false}};
function nextFixture(){if(!career)return null;for(const round of career.schedule){const f=round.fixtures.find(x=>(x.home===career.clubId||x.away===career.clubId)&&x.homeGoals===null);if(f)return {...f,date:round.date,round}}return null}
function allResults(){return career.schedule.flatMap(r=>r.fixtures.filter(f=>f.homeGoals!==null).map(f=>({...f,date:r.date})))}
function standings(){
 const table=Object.fromEntries(source.clubs.map(c=>[c.id,{id:c.id,P:0,W:0,D:0,L:0,GF:0,GA:0,Pts:0}]));
 for(const f of allResults()){
  const h=table[f.home],a=table[f.away];h.P++;a.P++;h.GF+=f.homeGoals;h.GA+=f.awayGoals;a.GF+=f.awayGoals;a.GA+=f.homeGoals;
  if(f.homeGoals>f.awayGoals){h.W++;a.L++;h.Pts+=3}else if(f.homeGoals<f.awayGoals){a.W++;h.L++;a.Pts+=3}else{h.D++;a.D++;h.Pts++;a.Pts++}
 }
 return Object.values(table).sort((a,b)=>b.Pts-a.Pts||(b.GF-b.GA)-(a.GF-a.GA)||b.GF-a.GF||clubName(a.id).localeCompare(clubName(b.id)));
}
function toast(message){notice=message;document.querySelector('.toast')?.remove();const div=document.createElement('div');div.className='toast';div.textContent=message;document.body.appendChild(div);setTimeout(()=>div.remove(),3500)}
function scene(current,site,open=false,crowd=false,evening=false){return `<div class="scene ${open?'open':''}">${sceneSvg(current,site,crowd,evening,open)}</div>`}
function logo(small=false){return `<img class="logo ${small?'small':''}" src="assets/clubline-logo.svg?v=${APP_VERSION}" alt="Clubline">`}
function titleView(){const c=club('C01');return `<div class="app-shell title-screen" style="--club:${c.colour}">${scene(c,'city',true)}<div class="shell-content"><div class="menu-hero"><div class="hero-copy glass">${logo()}<p class="title-tagline">Your club. Your call.</p><div class="hero-actions"><button class="btn primary arrow wide" data-action="new-game">New career</button>${hasSave()?'<button class="btn wide" data-action="continue">Continue</button>':''}</div><small>12 clubs · Premier Division · 22 fixtures</small><div class="update-area"><button class="btn ghost slim" data-action="check-update" ${checkingUpdate?'disabled':''}>${checkingUpdate?'Checking…':'↻ Check for updates'}</button><span class="build-label">v${APP_VERSION}</span>${availableVersion?'<button class="btn slim primary" data-action="load-update">Load update</button>':''}${updateMessage?`<p role="status">${html(updateMessage)}</p>`:''}</div></div></div></div></div>`}
async function checkForUpdates(){
 if(checkingUpdate)return;
 checkingUpdate=true;updateMessage='';availableVersion=null;render();
 try{
  const response=await fetch(`./version.json?check=${Date.now()}`,{cache:'no-store'});
  if(!response.ok)throw new Error('Version unavailable');
  const data=await response.json();
  if(!/^\d+\.\d+\.\d+$/.test(data.version))throw new Error('Invalid version');
  const current=APP_VERSION.split('.').map(Number),remote=data.version.split('.').map(Number);
  const newer=remote.some((n,i)=>n>current[i]&&remote.slice(0,i).every((v,j)=>v===current[j]));
  if(newer){availableVersion=data.version;updateMessage=`Clubline v${data.version} is ready.`}
  else updateMessage=`You're up to date (v${APP_VERSION}).`;
 }catch{updateMessage="Couldn't check for updates. Try again when online."}
 checkingUpdate=false;if(view==='title')render();
}
function setupView(){
 const c=club(setup.clubId),name=setup.names[c.id]||c.name,col=setup.colour||c.colour;
 return `<div class="app-shell" style="--club:${col}">${scene({...c,colour:col},setup.site,true)}<div class="shell-content"><header class="topbar">${logo(true)}<button class="btn ghost" data-action="back-title">← Back</button></header><div class="setup-layout"><div class="glass setup-card"><span class="eyebrow">01 / Choose your club</span><h2>Premier Division</h2><div class="setup-list">${source.clubs.map(x=>`<button class="club-choice ${x.id===c.id?'active':''}" data-action="choose-club" data-id="${x.id}"><strong>${html(setup.names[x.id]||x.name)}</strong><span>ATT ${x.attack} &nbsp; DEF ${x.defence} &nbsp; ${Math.round(x.capacity/1000)}k seats · Facilities ${x.facilities}★ · Youth ${x.youth}★</span></button>`).join('')}</div><p class="muted" style="margin:14px 0 0;font-size:.75rem">All club names can be changed before kick-off.</p></div><div class="glass setup-detail"><span class="eyebrow">02 / Make it yours</span><h2>${html(name)}</h2><div class="stat-pair"><div class="stat-block"><small>Attack</small><strong>${c.attack}</strong></div><div class="stat-block"><small>Defence</small><strong>${c.defence}</strong></div><div class="stat-block"><small>Seats</small><strong>${(c.capacity/1000).toFixed(0)}k</strong></div></div><div class="detail-row"><span>Starting style</span><b>${html(c.style)}</b></div><div class="detail-row"><span>Home ground</span><b>${html(c.ground)}</b></div><div class="detail-row"><span>Ground character</span><b>${html(stadiumProfile(c).name)}</b></div><div class="detail-row"><span>Opening funds</span><b>${fmtMoney(c.budget*5)}</b></div><div class="detail-row"><span>Club facilities</span>${stars(c.facilities,'Club facilities')}</div><div class="detail-row"><span>Youth programme</span>${stars(c.youth,'Youth programme')}</div><label class="field">Your club name<input id="clubRename" maxlength="32" value="${html(name)}"></label><button class="btn slim" data-action="rename-all">${setup.showNames?'Hide division names':'Rename any club'}</button>${setup.showNames?`<div class="list" style="max-height:150px;overflow:auto;margin-top:9px">${source.clubs.map(x=>`<label class="field" style="margin:3px 0">${html(x.name)}<input data-rename="${x.id}" maxlength="32" value="${html(setup.names[x.id]||x.name)}"></label>`).join('')}</div>`:''}<label class="field">Primary colour, locked for your home kit</label><div class="swatches">${COLOURS.map(x=>`<button class="swatch ${col===x?'on':''}" style="background:${x}" data-action="colour" data-colour="${x}" aria-label="Choose ${x}"></button>`).join('')}<input type="color" id="customColour" aria-label="Custom primary colour" value="${col}" style="width:40px;height:32px;padding:0;border:0;background:transparent"></div><label class="field">Home location</label><div class="site-options">${availableSites(c).map(([key,label])=>`<button class="btn ${setup.site===key?'selected':''}" data-action="site" data-site="${key}">${label}</button>`).join('')}</div><div class="setup-ground-preview" aria-label="Preview of selected home ground">${sceneSvg({...c,colour:col},setup.site,false,false,true)}<span>${html(c.ground)} · ${c.capacity.toLocaleString('en-GB')} seats</span></div><div class="setup-footer"><button class="btn club arrow" data-action="start-season">Start season</button></div></div></div></div></div>`;
}

function topbar(){const next=nextFixture();return `<header class="topbar">${logo(true)}<div class="top-pill"><small>Date / time</small><b>${fmtDate(career.date)} · ${career.time}</b></div><div class="top-pill"><small>Club balance</small><b class="money">${fmtMoney(career.balance)}</b></div><div class="top-pill"><small>Next match</small><b>${next?`${next.home===career.clubId?'H':'A'} ${next.kickoff||'15:00'} · ${html(clubName(opposition(next,career.clubId)))}`:'Season complete'}</b></div><button class="btn slim ghost" data-action="menu">Menu</button></header>`}
function dashboard(){const c=myClub(),next=nextFixture(),homeMatch=match&&match.home===career.clubId;return `<div class="app-shell" style="--club:${myColour()}">${scene({...c,colour:myColour()},career.site,false,homeMatch,!!(match&&match.kickoff>='17:30'))}<div class="shell-content">${topbar()}<div class="dash-grid"><div><div class="glass panel welcome"><span class="eyebrow">${html(c.ground)} / ${c.capacity.toLocaleString('en-GB')} seats</span><h1>${html(clubName(c.id))}</h1><div class="next-line">${next?`Next: ${next.home===c.id?'at home to':'away at'} ${html(clubName(opposition(next,c.id)))} · ${fmtDate(next.date)} · ${next.kickoff||'15:00'}`:'The league season is complete.'}</div></div><nav class="section-nav" aria-label="Club sections">${[['squad','Squad'],['facilities','Facilities'],['finances','Finances'],['organiser','Organiser']].map(([id,label])=>`<button class="btn ${section===id?'active':''}" data-action="section" data-section="${id}">${label}</button>`).join('')}</nav></div><div class="glass panel section-content">${sectionContent()}</div></div><div class="advance-dock"><button class="btn primary arrow" data-action="advance">${next&&career.date===next.date?'Matchday':'Advance time'}</button><span>${next?`${next.date===career.date?'Kick-off event ahead':'Next fixture '+fmtDate(next.date)}`:'Season finished'}</span></div></div>${match?matchOverlay():''}${career.offers?.some(o=>o.status==='new')?`<button class="offer-alert" data-action="open-offers">Transfer offer received · Review →</button>`:''}</div>`}

function sectionContent(){return section==='squad'?squadSection():section==='facilities'?facilitiesSection():section==='finances'?financesSection():organiserSection()}

function tabBar(items){return `<div class="tabs">${items.map(([key,label])=>`<button class="btn ${sub===key?'selected':''}" data-action="sub" data-sub="${key}">${label}</button>`).join('')}</div>`}
function squadSection(){
 const tabs=[['lineup','Starting XI'],['transfers','Transfers'],['formation','Formation'],['style','Play style'],['orders','Orders'],['form','Form charts']];
 let content='';
 if(sub==='lineup') content=lineupEditor(false);
 if(sub==='transfers') content=transfersSection();
 if(sub==='formation') content=`<p>Choose a shape. The current players stay in their positions until you arrange them again.</p><div class="choice-grid">${Object.keys(FORMATIONS).map(f=>`<button class="btn ${career.formation===f?'selected':''}" data-action="formation" data-value="${f}">${f}</button>`).join('')}</div>`;
 if(sub==='style') content=`<p>Your approach changes how many chances your side creates and concedes.</p><div class="choice-grid">${STYLES.map(x=>`<button class="btn ${career.style===x?'selected':''}" data-action="style" data-value="${x}">${x}</button>`).join('')}</div>`;
 if(sub==='orders') content=`<p>Set an overall match instruction. You can change this during a watched game.</p><div class="choice-grid">${ORDERS.map(x=>`<button class="btn ${career.order===x?'selected':''}" data-action="order" data-value="${x}">${x}</button>`).join('')}</div>`;
 if(sub==='form') content=`<p>Recent league results and the players who have stood out.</p><div class="list">${career.reports.slice(-5).reverse().map(r=>`<div class="row"><span>${fmtDate(r.date)} · ${html(clubName(r.opponent))}</span><b>${r.us}-${r.them}</b></div>`).join('')||'<div class="empty-note">No games played yet.</div>'}</div><div class="divider"></div><div class="list">${career.lineup.map(id=>{const p=player(id),form=career.players[id].form;return `<div class="row"><span>${html(p.name)} <small>${p.primary}</small></span><b>${form.length?(form.reduce((a,b)=>a+b,0)/form.length).toFixed(1):'—'}</b></div>`}).join('')}</div>`;
 return `<span class="eyebrow">Football / Squad</span><h2>Shape your eleven</h2>${tabBar(tabs)}${content}`;
}
function transfersSection(){
 const listed=source.players.filter(p=>owner(p.id)!==career.clubId).filter(p=>career.transferList.includes(p.id)||p.overall<72).sort((a,b)=>b.overall-a.overall).slice(0,35);
 const my=squadPlayers(career.clubId).sort((a,b)=>b.overall-a.overall);
 return `<p>Scout the division, inquire about availability, and negotiate a fee. Clubs can accept, reject or counter an offer.</p><h3>Transfer proposals</h3><div class="list">${career.offers.filter(o=>o.status==='new'||o.status==='counter').map(o=>`<div class="transfer-row"><span><b>${html(player(o.id).name)}</b><small>${o.incoming?'Your bid to '+html(clubName(o.clubId)):html(clubName(o.clubId))+' bid'} · ${fmtMoney(o.fee)} ${o.status==='counter'?'counteroffer':'offer'}</small></span><button class="btn slim primary" data-action="accept-offer" data-id="${o.id}" data-club="${o.clubId}">Accept</button><button class="btn slim" data-action="counter-offer" data-id="${o.id}" data-club="${o.clubId}">${o.incoming?'Wait':'Counter'}</button><button class="btn slim ghost" data-action="reject-offer" data-id="${o.id}" data-club="${o.clubId}">Reject</button></div>`).join('')||'<div class="empty-note">No proposals waiting.</div>'}</div><h3>Your squad · ${my.length} players</h3><div class="transfer-list">${my.map(p=>`<div class="transfer-row"><span><b>${html(p.name)}</b><small>${p.primary} · ${p.overall} OVR · value ${fmtMoney(transferValue(p))}</small></span><button class="btn slim ${career.transferList.includes(p.id)?'selected':''}" data-action="list-player" data-id="${p.id}">${career.transferList.includes(p.id)?'Listed ✓':'List'}</button></div>`).join('')}</div><h3>Market</h3><div class="transfer-list">${listed.map(p=>`<div class="transfer-row"><span><b>${html(p.name)}</b><small>${html(clubName(owner(p.id)))} · ${p.primary} · ${p.overall} OVR · ${fmtMoney(transferValue(p))}</small></span><button class="btn slim" data-action="inquire" data-id="${p.id}">Inquire</button><button class="btn slim primary" data-action="bid" data-id="${p.id}">Bid</button></div>`).join('')}</div>`;
}
function shirt(p,compact=false){return `<span class="shirt ${compact?'shirt-small':''}" style="--shirt:${myColour()}"><b>${p?html(p.number):'–'}</b></span>`}
function lineupEditor(inModal=false){
 const pool=squadPlayers(career.clubId).sort((a,b)=>b.overall-a.overall);
 let idx=0;
 const pitch=FORMATIONS[career.formation].map(line=>`<div class="pitch-line">${line.map(pos=>{const at=idx++,id=career.lineup[at],p=player(id);return `<button class="slot shirt-slot ${!p?'empty':''} ${selectedSlot===at?'selected':''}" data-action="slot" data-index="${at}" data-drop-slot="${at}" data-player="${id||''}" draggable="${!!p}" aria-label="${pos}: ${p?html(p.name)+', rated '+p.overall+', condition '+playerFitness(id)+' percent':'Empty'}"><span class="slot-name">${p?html(p.name.split(' ').at(-1)):'Select'}</span>${shirt(p)}<span class="slot-stats">${pos} · ${p?p.overall:'—'} · ${p?playerFitness(id)+'%':'—'}</span></button>`}).join('')}</div>`).join('');
 return `<div class="squad-toolbar"><label class="field">Formation <select class="select" data-squad-formation>${Object.keys(FORMATIONS).map(f=>`<option value="${f}" ${f===career.formation?'selected':''}>${f}</option>`).join('')}</select></label><span class="badge">${career.style}</span><button class="btn slim" data-action="auto-lineup">Auto pick</button></div><div class="formation-pitch">${pitch}</div><small>Bench · tap a player, then a slot. Drag and drop also works.</small><div class="bench shirt-bench">${career.bench.map((id,i)=>{const p=player(id);return `<button class="slot shirt-slot ${selectedSlot===11+i?'selected':''}" data-action="slot" data-index="${11+i}" data-drop-slot="${11+i}" data-player="${id||''}" draggable="${!!p}"><span class="slot-name">${p?html(p.name.split(' ').at(-1)):'Select'}</span>${shirt(p,true)}<span class="slot-stats">${p?p.primary+' · '+p.overall+' · '+playerFitness(id)+'%':'Empty'}</span></button>`}).join('')}</div><div class="player-list">${pool.map(p=>`<button draggable="true" class="player-card ${selectedPlayer===p.id?'active':''}" data-action="select-player" data-player="${p.id}">${shirt(p,true)}<span class="player-card-copy"><strong>${html(p.name)}</strong><span class="meta">${p.primary}${p.secondary?' / '+p.secondary:''} · ${p.overall} OVR · ${playerFitness(p.id)}% condition</span><span class="meta">Age ${p.age} ${career.lineup.includes(p.id)?'· XI':career.bench.includes(p.id)?'· Bench':''}</span></span></button>`).join('')}</div>${inModal?'<div class="modal-actions"><button class="btn primary" data-action="confirm-lineup">Confirm lineup</button></div>':''}`;
}
function facilitiesSection(){return `<span class="eyebrow">Club / Facilities</span><h2>${html(myClub().ground)}</h2><p>Your ${myClub().capacity.toLocaleString('en-GB')}-seat ground is the visible home of the club. Stadium construction and groundskeeping are planned for a later release.</p><div class="detail-row"><span>Location</span><b>${html(SITES.find(x=>x[0]===career.site)?.[1])}</b></div><div class="detail-row"><span>Seat colour</span><b><span style="display:inline-block;width:15px;height:15px;background:${myColour()};vertical-align:middle"></span> ${html(myColour().toUpperCase())}</b></div><div class="detail-row"><span>Capacity</span><b>${myClub().capacity.toLocaleString('en-GB')}</b></div><div class="empty-note" style="margin-top:18px">The ground and its colour are visible now. Designer, facilities and site compatibility upgrades follow in Release 3.</div>`}
function financesSection(){const home=career.reports.filter(r=>r.home),income=home.reduce((n,r)=>n+r.income,0);return `<span class="eyebrow">Club / Finances</span><h2>Club balance</h2><div class="stat-pair"><div class="stat-block"><small>Available cash</small><strong style="font-size:1.7rem">${fmtMoney(career.balance)}</strong></div><div class="stat-block"><small>Home income</small><strong style="font-size:1.7rem">${fmtMoney(income)}</strong></div></div><p>Home fixtures produce ticket, food and shop income automatically in this release. The breakdown appears on each match report.</p><div class="detail-row"><span>Weekly squad wages</span><b>${fmtMoney(squadPlayers(career.clubId).reduce((n,p)=>n+p.wage,0))}</b></div><div class="detail-row"><span>Matchday pricing</span><b>Standard for the league</b></div><div class="empty-note" style="margin-top:18px">Pricing, concessions, commercial events and seasonal kit redesigns are planned for later releases.</div>`}
function organiserSection(){
 const table=standings(),next=nextFixture(),fixtureLines=career.schedule.flatMap(r=>r.fixtures.filter(f=>f.home===career.clubId||f.away===career.clubId).map(f=>({...f,date:r.date}))).filter(f=>f.homeGoals===null).slice(0,5);
 return `<span class="eyebrow">Season / Organiser</span><h2>Premier Division</h2>${tabBar([['table','Table'],['calendar','Calendar'],['news','League news']])}${sub==='calendar'?`<div class="list">${fixtureLines.map(f=>`<div class="row"><span>${fmtDate(f.date)}<br><small>${f.home===career.clubId?'Home':'Away'} · ${html(clubName(opposition(f,career.clubId)))}</small></span><b>${f.kickoff||'15:00'}</b></div>`).join('')||'<div class="empty-note">All league fixtures have been played.</div>'}</div>`:sub==='news'?`<div class="list">${career.news.slice(-12).reverse().map(n=>`<div class="row"><span>${html(n.text)}</span><small>${fmtDate(n.date)}</small></div>`).join('')||'<div class="empty-note">The season is just beginning. Results and injuries will appear here.</div>'}</div>`:`<div class="table-wrap"><table class="league-table"><thead><tr><th>#</th><th>Club</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th></tr></thead><tbody>${table.map((t,i)=>`<tr class="${t.id===career.clubId?'mine':''}"><td>${i+1}</td><td>${html(clubName(t.id))}</td><td>${t.P}</td><td>${t.W}</td><td>${t.D}</td><td>${t.L}</td><td>${t.GF-t.GA}</td><td><b>${t.Pts}</b></td></tr>`).join('')}</tbody></table></div><p style="margin-top:14px">${next?'Next round '+fmtDate(next.date):'Season complete'}</p>`}`;
}

function render(){clearInterval(timer);timer=null;root.innerHTML=view==='title'?titleView():view==='setup'?setupView():dashboard();if(match?.phase==='live'&&!match.paused)startClock()}

function validLineup(){const ids=[...career.lineup,...career.bench];return career.lineup.length===11&&career.bench.length===7&&ids.every(Boolean)&&new Set(ids).size===18&&career.lineup.some((id,i)=>slotsFor(career.formation)[i]==='GK'&&player(id).primary==='GK')&&career.lineup.every(id=>!(career.players[id]?.injuryDays>0))}
function advance(){
 if(match){toast('Finish the match first.');return}
 const next=nextFixture();
 if(!next){toast('The season is complete. Check the final table in Organiser.');return}
 if(career.date===next.date&&career.time==='09:00'){career.time=next.kickoff?`${String(Math.floor((Number(next.kickoff.slice(0,2))*60+Number(next.kickoff.slice(3))-15)/60)).padStart(2,'0')}:${String((Number(next.kickoff.slice(0,2))*60+Number(next.kickoff.slice(3))-15)%60).padStart(2,'0')}`:'14:45';match={phase:'choice',fixtureDate:next.date,kickoff:next.kickoff||'15:00',home:next.home,away:next.away,homeGoals:0,awayGoals:0,minute:0,added:2,events:[],paused:false,speed:2,subCount:0,ratings:{},goalCounts:{},cardCounts:{},injured:[],participants:{},lineup:[...career.lineup],bench:[...career.bench]};save();render();return}
 career.date=addDays(career.date,1);career.time='09:00';
 for(const p of squadPlayers(career.clubId)){
  const state=career.players[p.id];if(state.injuryDays>0)state.injuryDays--;
  state.fitness=Math.min(100,state.fitness+(state.injuryDays?1:Math.max(2,Math.round((100-state.fitness)*.18))));
 }
 if(Math.random()<.025){const fit=squadPlayers(career.clubId).filter(p=>!career.players[p.id].injuryDays);const p=rand(fit);if(p){career.players[p.id].injuryDays=2+Math.floor(Math.random()*8);career.news.push({date:career.date,text:`Training injury: ${p.name} will miss ${career.players[p.id].injuryDays} days.`});section='squad';sub='lineup'}}
 if(new Date(career.date+'T12:00:00Z').getUTCDay()===1){const wages=squadPlayers(career.clubId).reduce((n,p)=>n+p.wage,0);career.balance-=wages;career.news.push({date:career.date,text:`Weekly wages paid: ${fmtMoney(wages)}.`})}
 for(const o of career.offers.filter(x=>x.status==='pending')){if(Math.random()<.55){o.status=Math.random()<.55?'new':'rejected';career.news.push({date:career.date,text:`${clubName(o.clubId)} ${o.status==='new'?'agreed to discuss':'declined'} your counter proposal for ${player(o.id).name}.`});if(o.status==='new'){section='squad';sub='transfers'}}}
 if(Math.random()<.10&&career.offers.filter(o=>o.status==='new').length<2){const candidate=rand(squadPlayers(career.clubId).filter(p=>!career.offers.some(o=>o.id===p.id&&['new','pending'].includes(o.status))&&(p.primary!=='GK'||squadPlayers(career.clubId).filter(x=>x.primary==='GK').length>2)));const buyer=rand(source.clubs.filter(c=>c.id!==career.clubId));if(candidate){career.offers.push({id:candidate.id,clubId:buyer.id,fee:Math.round(transferValue(candidate)*(career.transferList.includes(candidate.id)?1.12:.85)/10000)*10000,status:'new'});career.news.push({date:career.date,text:`${clubName(buyer.id)} offered for ${candidate.name}. Review the proposal in Squad → Transfers.`});section='squad';sub='transfers'}}
 save();render();
}
function resolveTransfer(id,newClub,fee){
 const p=player(id),oldClub=owner(id);if(!p||!oldClub||oldClub===newClub)return;
 career.owners[id]=newClub;career.transferList=career.transferList.filter(x=>x!==id);
 career.offers=career.offers.filter(o=>o.id!==id);
 career.balance+=newClub===career.clubId?-fee:fee;
 if(oldClub===career.clubId||newClub===career.clubId){const picks=bestLineup(career.clubId,career.formation);career.lineup=picks.lineup;career.bench=picks.bench}
 career.news.push({date:career.date,text:`Transfer: ${p.name} moves from ${clubName(oldClub)} to ${clubName(newClub)} for ${fmtMoney(fee)}.`});save();render();
}
function beginMatch(mode){
 if(mode==='simulate'&&!validLineup()){toast('The saved lineup needs changes. Use Auto pick or confirm a watched lineup.');return}
 match.phase=mode==='watch'?'confirm':'live';match.lineup=[...career.lineup];match.bench=[...career.bench];
 match.oppLineup=bestLineup(opposition(match,career.clubId),club(opposition(match,career.clubId)).formation).lineup;
 match.events.push({minute:0,type:'info',text:`Kick-off approaches: ${clubName(match.home)} v ${clubName(match.away)}.`});
 if(mode==='simulate'){match.participants=Object.fromEntries(match.lineup.map(id=>[id,{start:0,end:null}]));while(match&&match.phase==='live'&&match.minute<96)tickMatch(true);if(match?.phase!=='report')finishMatch();}
 save();render();
}
function startClock(){if(!match||match.phase!=='live'||match.paused)return;const duration=match.speed*60*1000/45;timer=setInterval(()=>tickMatch(false),duration)}
function clockLabel(n){return n>90?`90+${n-90}′`:`${n}′`}
function teamIds(id){return id===career.clubId?match.lineup:match.oppLineup}
function onPitch(id,roles){const all=teamIds(id).map(x=>player(x)).filter(Boolean),narrow=all.filter(p=>roles.includes(p.primary));return rand(narrow.length?narrow:all)}
function teamPower(id,phase){
 const c=club(id),base=phase==='attack'?c.attack:c.defence;
 if(id!==career.clubId)return base;
 const positions=slotsFor(career.formation),active=match?.phase==='live'?match.lineup:career.lineup;
 const chosen=active.map((pid,i)=>player(pid)?.positions[positions[i]]||25);
 const fitness=active.reduce((n,pid)=>n+(pid?playerFitness(pid):40),0)/11;
 let modifier=(chosen.reduce((n,x)=>n+x,0)/11-77)*.48+(fitness-85)*.08;
 if(phase==='attack'&&career.order==='Attack')modifier+=5;
 if(phase==='defence'&&career.order==='Protect lead')modifier+=5;
 if(career.style==='High press')modifier+=phase==='attack'?3:-2;
 if(career.style==='Counter')modifier+=phase==='defence'?2:-1;
 if(career.style==='Possession')modifier+=phase==='attack'?1:1;
 return base+modifier;
}
function addMoment(moment,important=false){match.events.push(moment);if(important){match.paused=true;match.pauseReason=moment.type;match.flash=moment;}}
function chanceEvent(attackerId){
 const defenderId=attackerId===match.home?match.away:match.home;
 const attacker=onPitch(attackerId,['ST','LW','RW','AM','CM']);const creator=onPitch(attackerId,['CM','AM','LW','RW']);const keeper=onPitch(defenderId,['GK']);
 const atk=teamPower(attackerId,'attack'),def=teamPower(defenderId,'defence');
 const conversion=Math.max(.12,Math.min(.37,.22+(atk-def)*.008));
 const time=clockLabel(match.minute);
 if(Math.random()<conversion){
  if(attackerId===match.home)match.homeGoals++;else match.awayGoals++;
  match.goalCounts[attacker.id]=(match.goalCounts[attacker.id]||0)+1;
  const descriptions=[`${creator.name} slips a pass into the area and ${attacker.name} finishes beyond ${keeper.name}.`,`${attacker.name} meets a cross at the far post and beats ${keeper.name}.`,`${attacker.name} drives forward and finds the corner despite ${keeper.name}'s dive.`,`${creator.name} wins the ball high up the pitch. ${attacker.name} makes the chance count.`];
  addMoment({minute:match.minute,type:'goal',team:attackerId,playerId:attacker.id,text:`GOAL! ${attacker.name} ${time}. ${rand(descriptions)}`},true);
 }else{
  const descriptions=[`${attacker.name} goes close with a looping header. Saved by ${keeper.name}.`,`${creator.name} finds ${attacker.name} in space, but the shot skims wide.`,`${attacker.name} strikes from the edge of the box. ${keeper.name} gets down to save.`,`${attacker.name} reaches a deep cross and sends the effort over the bar.`];
  addMoment({minute:match.minute,type:'chance',team:attackerId,playerId:attacker.id,text:`Chance for ${clubName(attackerId)}: ${rand(descriptions)}`});
 }
}
function cardEvent(teamId){const offender=onPitch(teamId,['CB','DM','CM','LB','RB']);const time=clockLabel(match.minute),previous=match.cardCounts[offender.id]||0;match.cardCounts[offender.id]=previous+1;const red=previous>0||Math.random()<.07;
 addMoment({minute:match.minute,type:red?'red':'yellow',team:teamId,playerId:offender.id,text:`${red?'RED':'YELLOW'} CARD! ${offender.name} ${time}. ${rand(['Late challenge near the touchline.','The referee punishes a mistimed tackle.','A foul stops a promising move.'])}`},true);
 if(red&&teamId===career.clubId){match.lineup=match.lineup.map(id=>id===offender.id?null:id);if(match.participants[offender.id])match.participants[offender.id].end=match.minute;career.news.push({date:career.date,text:`${offender.name} was sent off against ${clubName(opposition(match,career.clubId))}.`})}
 if(red&&teamId!==career.clubId)match.oppLineup=match.oppLineup.map(id=>id===offender.id?null:id);
}
function injuryEvent(teamId){const injured=onPitch(teamId,['ST','LW','RW','CM','CB','LB','RB']);const time=clockLabel(match.minute);match.injured.push(injured.id);
 addMoment({minute:match.minute,type:'injury',team:teamId,playerId:injured.id,text:`INJURY! ${injured.name} ${time}. Play stops while ${injured.name} receives treatment.`},true);
 if(teamId===career.clubId){career.players[injured.id].injuryDays=3+Math.floor(Math.random()*12);career.news.push({date:career.date,text:`${injured.name} faces ${career.players[injured.id].injuryDays} days out after an injury.`})}
}
function tickMatch(quick){
 if(!match||match.phase!=='live'||(match.paused&&!quick))return;
 match.paused=false;match.flash=null;match.minute++;
 const m=match.minute;
 if(m===46&&!quick){match.paused=true;match.pauseReason='half';match.events.push({minute:45,type:'info',text:`Half-time. ${clubName(match.home)} ${match.homeGoals}–${match.awayGoals} ${clubName(match.away)}.`});save();render();return}
 if(m>90+match.added){finishMatch();save();render();return}
 if(m===90)match.events.push({minute:m,type:'info',text:`${match.added} minutes of added time.`});
 if(m!==46){
  const chosen=Math.random()<.5?match.home:match.away;
  const pressure=(teamPower(chosen,'attack')-teamPower(opposition(match,chosen),'defence'))*.003;
  if(Math.random()<Math.max(.035,.085+pressure))chanceEvent(chosen);
  else if(Math.random()<.021)cardEvent(chosen);
  else if(Math.random()<.008)injuryEvent(chosen);
  else if(m%15===0)match.events.push({minute:m,type:'info',text:`${clockLabel(m)} The contest remains finely balanced.`});
 }
 if(!quick){
  save();render();
  if(match?.paused&&['goal','yellow','red','injury'].includes(match.pauseReason)){
   const pausedAt=match.minute,reason=match.pauseReason;
   clearTimeout(autoResumeTimer);
   autoResumeTimer=setTimeout(()=>{if(match?.phase==='live'&&match.paused&&match.minute===pausedAt&&match.pauseReason===reason){match.paused=false;match.flash=null;save();render()}},1800);
  }
 }
}

function quickScore(home,away){const baseH=1.25+(club(home).attack-club(away).defence)*.024+.2,baseA=1.12+(club(away).attack-club(home).defence)*.024;const poisson=mean=>{let n=0,p=1,threshold=Math.exp(-Math.max(.2,mean));do{n++;p*=Math.random()}while(p>threshold);return n-1};return [poisson(baseH),poisson(baseA)]}
function finishMatch(){
 if(!match||match.phase==='report')return;
 const round=career.schedule.find(r=>r.date===match.fixtureDate);
 const fixture=round.fixtures.find(f=>f.home===match.home&&f.away===match.away);
 fixture.homeGoals=match.homeGoals;fixture.awayGoals=match.awayGoals;
 for(const f of round.fixtures)if(f.homeGoals===null)[f.homeGoals,f.awayGoals]=quickScore(f.home,f.away);
 const home=match.home===career.clubId,us=home?match.homeGoals:match.awayGoals,them=home?match.awayGoals:match.homeGoals;
 const attendance=home?Math.round(myClub().capacity*(.51+Math.random()*.35)):0;
 const tickets=home?attendance*22:0,concessions=home?Math.round(attendance*5.5):0,shop=home?Math.round(attendance*1.6):0;
 const operating=home?Math.round((tickets+concessions+shop)*.46):0;
 const income=tickets+concessions+shop-operating;
 career.balance+=income;
 const performances=[];
 for(const [id,participation] of Object.entries(match.participants)){
  const p=player(id),minutes=Math.max(1,(participation.end??90)-participation.start),goals=match.goalCounts[id]||0,cards=match.cardCounts[id]||0;
  let rating=Math.max(4.5,Math.min(9.9,6.2+Math.random()*1.5+(us-them)*.17+goals*1.1-cards*.25));
  rating=Math.round(rating*10)/10;career.players[id].form=[...career.players[id].form.slice(-4),rating];
  career.players[id].fitness=Math.max(34,career.players[id].fitness-Math.max(3,Math.round((12+Math.floor(Math.random()*9))*minutes/90)));
  performances.push({id,rating,minutes,goals,cards,fitness:career.players[id].fitness,injuryDays:career.players[id].injuryDays||0});
 }
 const report={date:career.date,opponent:opposition(match,career.clubId),home,us,them,attendance,tickets,concessions,shop,operating,income,performances,events:[...match.events]};
 career.reports.push(report);career.news.push({date:career.date,text:`${clubName(match.home)} ${match.homeGoals}–${match.awayGoals} ${clubName(match.away)}.`});
 match.phase='report';match.paused=true;career.time='17:15';save();
}

function matchOverlay(){
 const other=opposition(match,career.clubId),home=match.home===career.clubId;
 let body='';
 if(match.phase==='choice')body=`<span class="eyebrow">Matchday / ${fmtDate(career.date)}</span><h2>${home?'Home at '+html(myClub().ground):'Away fixture'}</h2><div class="scoreline"><span>${html(clubName(match.home))}</span><strong>v</strong><span>${html(clubName(match.away))}</span></div><p>Take your side into a text match with live decisions, or simulate for a quick result. Simulation uses your saved eleven and tactics.</p>${!validLineup()?'<div class="empty-note">Your saved XI needs a fit replacement. Auto pick a fit side or review it before kick-off.</div>':''}<div class="modal-actions"><button class="btn primary arrow" data-action="watch-match">Watch match</button><button class="btn" data-action="simulate-match" ${!validLineup()?'disabled':''}>Simulate result</button><button class="btn" data-action="auto-lineup">Auto pick fit XI</button><button class="btn ghost" data-action="close-choice">Back to club</button></div>`;
 if(match.phase==='confirm')body=`<span class="eyebrow">Matchday / Lineup confirmation</span><h2>Pick your eleven</h2><p>Confirm your XI, bench and shape before kick-off. You can change tactics and make substitutions during the match.</p><div class="match-columns"><div>${lineupEditor(true)}</div><div class="glass panel"><h3>Match plan</h3><div class="detail-row"><span>Formation</span><select class="select" data-match-setting="formation">${Object.keys(FORMATIONS).map(x=>`<option ${x===career.formation?'selected':''}>${x}</option>`).join('')}</select></div><div class="detail-row"><span>Style</span><select class="select" data-match-setting="style">${STYLES.map(x=>`<option ${x===career.style?'selected':''}>${x}</option>`).join('')}</select></div><div class="detail-row"><span>Orders</span><select class="select" data-match-setting="order">${ORDERS.map(x=>`<option ${x===career.order?'selected':''}>${x}</option>`).join('')}</select></div><button class="btn ghost" data-action="choice-back" style="margin-top:20px">← Match options</button></div></div>`;
 if(match.phase==='live'){
  const last=match.flash,score=`${match.homeGoals} : ${match.awayGoals}`;
  body=`<span class="eyebrow">${home?html(myClub().ground):'Away match'} / ${clockLabel(match.minute)} ${match.paused?'· Paused':''}</span><div class="scoreline"><span>${html(clubName(match.home))}</span><strong>${score}</strong><span>${html(clubName(match.away))}</span></div>${last?`<div class="flash ${last.type==='yellow'?'yellow':last.type==='red'?'red':''}">${last.type==='goal'?'GOAL!:':last.type==='yellow'?'YELLOW CARD:':last.type==='red'?'RED CARD:':last.type==='injury'?'INJURY:':'HALF-TIME'} ${last.playerId?html(player(last.playerId).name):''} ${clockLabel(last.minute)}</div>`:''}<div class="match-toolbar"><small>Match pace</small>${[4,2,1].map(n=>`<button class="btn slim ${match.speed===n?'selected':''}" data-action="speed" data-speed="${n}">${n} min / half</button>`).join('')}${match.paused?'<button class="btn primary slim" data-action="resume-match">Continue ▶</button>':'<button class="btn slim" data-action="pause-match">Pause</button>'}<button class="btn slim" data-action="sim-next">Sim to next event</button><button class="btn slim" data-action="sim-half">Sim to end of half</button><button class="btn slim" data-action="finish-sim">Sim match</button></div><div class="match-columns"><div class="commentary" id="commentary">${match.events.slice(-30).map(e=>`<div class="comment ${e.type}"><small>${clockLabel(e.minute)} ${e.team?html(clubName(e.team)):''}</small><br>${html(e.text)}</div>`).join('')}</div><div class="glass panel"><h3>Touchline decisions</h3><div class="detail-row"><span>Formation</span><select class="select" data-match-setting="formation">${Object.keys(FORMATIONS).map(x=>`<option ${x===career.formation?'selected':''}>${x}</option>`).join('')}</select></div><div class="detail-row"><span>Style</span><select class="select" data-match-setting="style">${STYLES.map(x=>`<option ${x===career.style?'selected':''}>${x}</option>`).join('')}</select></div><div class="detail-row"><span>Orders</span><select class="select" data-match-setting="order">${ORDERS.map(x=>`<option ${x===career.order?'selected':''}>${x}</option>`).join('')}</select></div><div class="divider"></div><small>Substitutions ${match.subCount}/5 · tap a bench player, then the player to replace</small><div class="bench">${match.bench.filter(Boolean).map(id=>`<button class="btn slim ${selectedPlayer===id?'selected':''}" data-action="match-bench" data-player="${id}">${html(player(id).name)} ${playerFitness(id)}%</button>`).join('')}</div><div class="list" style="max-height:190px;overflow:auto">${match.lineup.map((id,i)=>id?`<button class="row" style="color:var(--text);text-align:left;cursor:pointer" data-action="match-replace" data-index="${i}"><span>${slotsFor(career.formation)[i]} · ${html(player(id).name)}</span><small>${playerFitness(id)}%</small></button>`:`<button class="row" data-action="match-replace" data-index="${i}"><span>Empty · replace sent-off player</span></button>`).join('')}</div></div></div>`;
 }
 if(match.phase==='report'){
  const report=career.reports.at(-1);body=`<span class="eyebrow">Full-time / ${fmtDate(report.date)}</span><h2>Match report card</h2><div class="scoreline"><span>${html(clubName(match.home))}</span><strong>${match.homeGoals} : ${match.awayGoals}</strong><span>${html(clubName(match.away))}</span></div><div class="report-grid"><div><small>Attendance</small><strong>${report.home?report.attendance.toLocaleString('en-GB'):'Away'}</strong></div><div><small>Ticket sales</small><strong>${fmtMoney(report.tickets)}</strong></div><div><small>Food & drink</small><strong>${fmtMoney(report.concessions)}</strong></div><div><small>Club shop</small><strong>${fmtMoney(report.shop)}</strong></div></div><p>Matchday costs: ${fmtMoney(report.operating)} · Net home income: ${fmtMoney(report.income)}</p><div class="match-columns"><div><h3>Your players</h3><div class="report-list list">${report.performances.sort((a,b)=>(b.rating||0)-(a.rating||0)).map(x=>`<div class="row"><span><b>${html(player(x.id).name)}</b><br><small>${player(x.id).primary} · ${x.minutes} min · ${x.goals?x.goals+' goal'+(x.goals>1?'s':'')+' · ':''}${x.cards?'Card · ':''}${x.injuryDays?'Injured · ':''}Fit ${x.fitness}%</small></span><strong>${x.rating??'—'}</strong></div>`).join('')}</div></div><div><h3>Key moments</h3><div class="commentary">${report.events.filter(e=>['goal','yellow','red','injury','chance'].includes(e.type)).map(e=>`<div class="comment ${e.type}"><small>${clockLabel(e.minute)}</small><br>${html(e.text)}</div>`).join('')||'<div class="muted">A quiet game.</div>'}</div></div></div><div class="modal-actions"><button class="btn primary arrow" data-action="close-report">Continue career</button></div>`;
 }
 return `<div class="overlay" role="dialog" aria-modal="true" aria-label="Matchday"><div class="modal">${home?`<div class="match-ground" aria-label="Crowd at ${html(myClub().ground)}">${sceneSvg({...myClub(),colour:myColour()},career.site,true,match.kickoff>='17:30',true)}<span>${html(myClub().ground)} · ${myClub().capacity.toLocaleString('en-GB')} seats</span></div>`:''}<div class="modal-head"><div style="flex:1">${body}</div></div></div></div>`;
}

function swapLineup(target,id){
 if(!id)return;
 const list=target<11?career.lineup:career.bench,offset=target<11?target:target-11;
 const old=list[offset];const oldXi=career.lineup.indexOf(id),oldBench=career.bench.indexOf(id);
 if(oldXi>=0)career.lineup[oldXi]=old;
 if(oldBench>=0)career.bench[oldBench]=old;
 list[offset]=id;selectedPlayer=null;selectedSlot=null;save();render();
}
function setFormation(shape){
 if(!FORMATIONS[shape]||!career)return;
 career.formation=shape;
 const picks=bestLineup(career.clubId,shape);
 career.lineup=picks.lineup;career.bench=picks.bench;
 selectedPlayer=null;selectedSlot=null;save();render();
}
function skipMatch(kind){
 if(!match||match.phase!=='live')return;
 clearTimeout(autoResumeTimer);
 const startEvents=match.events.length,stop=match.minute<46?46:95;
 match.paused=false;match.flash=null;
 while(match?.phase==='live'&&match.minute<stop){
  tickMatch(true);
  if(kind==='next'&&match.events.length>startEvents&&['goal','yellow','red','injury','chance'].includes(match.events.at(-1).type))break;
 }
 if(match?.phase==='live'){
  match.paused=true;match.pauseReason='skip';
  if(match.minute===46)match.events.push({minute:45,type:'info',text:`Half-time. ${clubName(match.home)} ${match.homeGoals}–${match.awayGoals} ${clubName(match.away)}.`});
 }
 save();render();
}
function substitute(index){
 if(!match||match.phase!=='live'||!selectedPlayer)return;
 const id=selectedPlayer;if(!match.bench.includes(id)){toast('Choose a bench player first.');return}
 if(match.subCount>=5){toast('You have used all five substitutions.');return}
 const outgoing=match.lineup[index];match.bench.splice(match.bench.indexOf(id),1);
 if(outgoing&&match.participants[outgoing])match.participants[outgoing].end=match.minute;
 match.lineup[index]=id;match.subCount++;match.participants[id]={start:match.minute,end:null};
 match.events.push({minute:match.minute,type:'info',text:`Substitution: ${player(id).name} ${outgoing?'replaces '+player(outgoing).name:'comes on'}.`});
 selectedPlayer=null;save();render();
}

root.addEventListener('click',event=>{
 if(suppressDragClick){suppressDragClick=false;return}
 const el=event.target.closest('[data-action]');if(!el)return;
 const action=el.dataset.action;
 if(action==='new-game'){setup={clubId:'C01',site:'city',names:{},colour:null};view='setup';render()}
 else if(action==='continue'){if(load()){view='career';render()}}
 else if(action==='check-update')checkForUpdates();
 else if(action==='load-update'&&availableVersion){const url=new URL(location.href);url.searchParams.set('update',availableVersion);url.searchParams.set('t',Date.now());location.assign(url.href)}
 else if(action==='back-title'||action==='menu'){view='title';render()}
 else if(action==='choose-club'){setup.clubId=el.dataset.id;setup.colour=null;if(!availableSites(club(setup.clubId)).some(x=>x[0]===setup.site))setup.site='city';render()}
 else if(action==='rename-all'){setup.showNames=!setup.showNames;render()}
 else if(action==='colour'){setup.colour=el.dataset.colour;render()}
 else if(action==='site'){if(availableSites(club(setup.clubId)).some(x=>x[0]===el.dataset.site))setup.site=el.dataset.site;render()}
 else if(action==='start-season')newCareer();
 else if(action==='section'){section=el.dataset.section;sub=section==='organiser'?'table':'lineup';render()}
 else if(action==='sub'){sub=el.dataset.sub;render()}
 else if(action==='open-offers'){section='squad';sub='transfers';render()}
 else if(action==='list-player'){const id=el.dataset.id;if(career.transferList.includes(id))career.transferList=career.transferList.filter(x=>x!==id);else career.transferList.push(id);save();render()}
 else if(action==='inquire'){const p=player(el.dataset.id);toast(`${clubName(owner(p.id))} value ${p.name} around ${fmtMoney(transferValue(p))}.`)}
 else if(action==='bid'){const p=player(el.dataset.id),fee=Math.round(transferValue(p)*1.1/10000)*10000;if(career.balance<fee){toast(`You need ${fmtMoney(fee)} to make this bid.`);return}if(squadPlayers(owner(p.id)).length<=18){toast('That club needs to keep enough players for its matchday squad.');return}if(Math.random()<.65||career.transferList.includes(p.id)){resolveTransfer(p.id,career.clubId,fee);toast(`${p.name} joins your club for ${fmtMoney(fee)}.`)}else{career.offers.push({id:p.id,clubId:owner(p.id),fee:Math.round(fee*1.2/10000)*10000,status:'counter',incoming:true});career.news.push({date:career.date,text:`${clubName(owner(p.id))} countered your bid for ${p.name}.`});save();render();toast('The selling club has countered your offer.')}}
 else if(['accept-offer','counter-offer','reject-offer'].includes(action)){const id=el.dataset.id,clubId=el.dataset.club,o=career.offers.find(x=>x.id===id&&x.clubId===clubId&&(x.status==='new'||x.status==='counter'));if(!o)return;if(action==='reject-offer'){o.status='rejected';save();render();return}if(action==='counter-offer'){if(o.incoming){toast('The selling club is waiting on your decision.');return}o.fee=Math.round(o.fee*1.2/10000)*10000;o.status='pending';save();render();toast(`Counter proposal sent: ${fmtMoney(o.fee)}.`);return}if(o.incoming){if(career.balance<o.fee){toast('Your club cannot afford that fee.');return}resolveTransfer(id,career.clubId,o.fee)}else{if(squadPlayers(career.clubId).length<=18){toast('Keep at least 18 players in your squad.');return}resolveTransfer(id,clubId,o.fee)}}
 else if(action==='advance')advance();
 else if(action==='auto-lineup'){const picks=bestLineup(career.clubId,career.formation);career.lineup=picks.lineup;career.bench=picks.bench;save();render()}
 else if(action==='formation'){setFormation(el.dataset.value)}
 else if(action==='style'){career.style=el.dataset.value;save();render()}
 else if(action==='order'){career.order=el.dataset.value;save();render()}
 else if(action==='select-player'){const id=el.dataset.player;if(selectedSlot!==null)swapLineup(selectedSlot,id);else{selectedPlayer=id;render()}}
 else if(action==='slot'){const at=Number(el.dataset.index);if(selectedPlayer)swapLineup(at,selectedPlayer);else{selectedSlot=at;render()}}
 else if(action==='close-choice'){match=null;career.time='09:00';save();render()}
 else if(action==='choice-back'){match.phase='choice';save();render()}
 else if(action==='watch-match')beginMatch('watch');
 else if(action==='simulate-match')beginMatch('simulate');
 else if(action==='confirm-lineup'){if(!validLineup()){toast('Complete your XI and bench, including a fit goalkeeper.');return}match.lineup=[...career.lineup];match.bench=[...career.bench];match.participants=Object.fromEntries(match.lineup.map(id=>[id,{start:0,end:null}]));match.phase='live';career.time=match.kickoff||'15:00';match.events.push({minute:0,type:'info',text:'Kick-off! The match is underway.'});save();render()}
 else if(action==='speed'){match.speed=Number(el.dataset.speed);save();render()}
 else if(action==='sim-next')skipMatch('next');
 else if(action==='sim-half')skipMatch('half');
 else if(action==='pause-match'){clearTimeout(autoResumeTimer);match.paused=true;match.pauseReason='manual';save();render()}
 else if(action==='resume-match'){clearTimeout(autoResumeTimer);match.paused=false;match.flash=null;save();render()}
 else if(action==='finish-sim'){match.paused=false;while(match&&match.phase==='live'&&match.minute<96)tickMatch(true);if(match?.phase!=='report')finishMatch();save();render()}
 else if(action==='match-bench'){selectedPlayer=el.dataset.player;render()}
 else if(action==='match-replace')substitute(Number(el.dataset.index));
 else if(action==='close-report'){match=null;save();render()}
});
root.addEventListener('change',event=>{
 const el=event.target;
 if(el.dataset.squadFormation!==undefined){setFormation(el.value)}
 else if(el.id==='clubRename'){setup.names[setup.clubId]=el.value.trim().slice(0,32)||club(setup.clubId).name;render()}
 else if(el.dataset.rename){setup.names[el.dataset.rename]=el.value.trim().slice(0,32)||club(el.dataset.rename).name;render()}
 else if(el.id==='customColour'){setup.colour=el.value;render()}
 else if(el.dataset.matchSetting){if(el.dataset.matchSetting==='formation'){if(match?.phase==='live'){career.formation=el.value;save();render()}else setFormation(el.value);return}career[el.dataset.matchSetting]=el.value;save();render()}
});
root.addEventListener('dragstart',event=>{const card=event.target.closest('[data-player]');if(!card?.draggable)return;event.dataTransfer.setData('text/plain',card.dataset.player);const ghost=card.querySelector('.shirt')?.cloneNode(true);if(ghost){ghost.classList.add('drag-preview');document.body.appendChild(ghost);event.dataTransfer.setDragImage(ghost,20,20);setTimeout(()=>ghost.remove(),0)}});
root.addEventListener('dragover',event=>{const slot=event.target.closest('[data-drop-slot]');if(slot)event.preventDefault();if(dragTarget!==slot){dragTarget?.classList.remove('drop-highlight');dragTarget=slot;dragTarget?.classList.add('drop-highlight')}});
root.addEventListener('dragleave',event=>{if(!event.relatedTarget?.closest?.('[data-drop-slot]')){dragTarget?.classList.remove('drop-highlight');dragTarget=null}});
root.addEventListener('dragend',()=>{dragTarget?.classList.remove('drop-highlight');dragTarget=null});
root.addEventListener('drop',event=>{const slot=event.target.closest('[data-drop-slot]');dragTarget?.classList.remove('drop-highlight');dragTarget=null;if(!slot)return;event.preventDefault();swapLineup(Number(slot.dataset.dropSlot),event.dataTransfer.getData('text/plain'))});
root.addEventListener('pointerdown',event=>{const card=event.target.closest('.player-card[data-player],.shirt-slot[data-player]');if(!card?.dataset.player)return;activeDrag={id:card.dataset.player,x:event.clientX,y:event.clientY,moved:false}});
document.addEventListener('pointermove',event=>{
 if(!activeDrag)return;
 if(!activeDrag.moved&&Math.hypot(event.clientX-activeDrag.x,event.clientY-activeDrag.y)<9)return;
 if(!activeDrag.moved&&Math.abs(event.clientY-activeDrag.y)>Math.abs(event.clientX-activeDrag.x)*1.5){activeDrag=null;return}
 event.preventDefault();
 activeDrag.moved=true;
 if(!dragGhost){dragGhost=document.createElement('div');dragGhost.className='touch-drag-ghost';dragGhost.innerHTML=shirt(player(activeDrag.id));document.body.appendChild(dragGhost)}
 dragGhost.style.left=`${event.clientX}px`;dragGhost.style.top=`${event.clientY}px`;
 const slot=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-drop-slot]');
 if(slot!==dragTarget){dragTarget?.classList.remove('drop-highlight');dragTarget=slot;dragTarget?.classList.add('drop-highlight')}
});
document.addEventListener('pointerup',()=>{
 if(!activeDrag)return;
 const slot=dragTarget,id=activeDrag.id,moved=activeDrag.moved;
 dragGhost?.remove();dragGhost=null;dragTarget?.classList.remove('drop-highlight');dragTarget=null;activeDrag=null;
 if(moved){suppressDragClick=true;setTimeout(()=>suppressDragClick=false,80);if(slot)swapLineup(Number(slot.dataset.dropSlot),id)}
});

render();
