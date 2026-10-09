// Career-owned, repeatable events. Time advancement generates offers; rendering never does.
export const eventAfter=(date,n)=>new Date(Date.parse(date+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
const hash=s=>{let n=2166136261;for(const c of s){n^=c.charCodeAt(0);n=Math.imul(n,16777619)}return n>>>0};
const clamp=(n,min=0,max=100)=>Math.max(min,Math.min(max,n));
const choice=(id,label,effects,result)=>({id,label,effects,result});
export const CLUB_STORIES=[
 {id:'charity',title:'A visit to the children’s ward',text:'A local charity asks whether a few players can visit the children’s ward after training.',choices:[choice('visit','Arrange the visit',{cash:-1500,clubMorale:2,supporters:3,squadHappiness:1},'The players made time for the visit. The families and supporters appreciated it.'),choice('later','Politely postpone',{},'The charity understands and hopes to arrange another visit later.')]},
 {id:'disagreement',title:'A training-ground disagreement',text:'Two senior players have had a disagreement during training. The coach suggests a quiet conversation.',choices:[choice('talk','Bring them together',{clubMorale:2,squadHappiness:2},'A calm conversation cleared the air.'),choice('leave','Let them settle it',{clubMorale:-2,squadHappiness:-1},'The tension lingered around the training ground.')]},
 {id:'fundraiser',title:'Supporters rally round',text:'The supporters’ association has organised a small fundraiser for the club.',effects:{cash:4500,supporters:2,clubMorale:1},result:'The supporters handed over their donation. A welcome gesture from the community.'},
 {id:'sponsor',title:'A local sponsorship offer',text:'A local firm offers a one-off sponsorship for an afternoon of player photographs.',choices:[choice('accept','Arrange the photographs',{cash:9000,condition:-1,clubMorale:1},'The afternoon went smoothly and the sponsorship payment arrived.'),choice('decline','Keep the afternoon free',{},'The players kept their afternoon for recovery.')]},
 {id:'homesick',title:'Missing familiar faces',text:'{player} has been finding it difficult to settle away from family and old friends.',young:true,choices:[choice('support','Arrange some support',{cash:-1200,playerHappiness:5,clubMorale:1},'A little practical support helped {player} feel more settled.'),choice('wait','Give them time',{playerHappiness:-2},'{player} still feels a little isolated.')]},
 {id:'coach',title:'A guest coaching session',text:'An experienced former coach offers to run a special afternoon session.',choices:[choice('session','Book the session',{cash:-2500,clubMorale:2,squadHappiness:1,condition:-1},'The squad enjoyed a different voice on the training pitch.'),choice('routine','Keep the usual routine',{},'Training continued as planned.')]},
 {id:'bus',title:'The team bus needs repairs',text:'The transport company reports a fault with the team bus. A repair is needed before the next journey.',choices:[choice('repair','Pay for a prompt repair',{cash:-3200,clubMorale:1},'The bus was repaired without disrupting the next trip.'),choice('hire','Arrange a temporary replacement',{cash:-1800,clubMorale:-1},'A hired bus covered the trip, although the players missed their usual comforts.')]},
 {id:'school',title:'The local school’s football day',text:'A nearby school would love a player to help with its football afternoon.',choices:[choice('help','Send a player and a coach',{cash:-800,supporters:3,playerHappiness:2},'{player} was a hit with the children at the school football day.'),choice('kits','Donate training equipment',{cash:-1200,supporters:2},'The school was delighted with the donated equipment.')]},
 {id:'pub',title:'A supporters’ evening',text:'A supporters’ group invites club staff to a question-and-answer evening at a local pub.',choices:[choice('attend','Attend and hear them out',{cash:-500,supporters:3,clubMorale:1},'Supporters appreciated the club taking their questions seriously.'),choice('statement','Send a written update',{supporters:1},'The written update answered a few concerns.')]},
 {id:'boots',title:'A boot-room windfall',text:'A kit supplier has sent a complimentary batch of training boots and equipment.',effects:{clubMorale:1,squadHappiness:1},result:'The boot-room staff put the new equipment to good use. No financial payment was involved.'},
 {id:'weather',title:'A miserable training afternoon',text:'Persistent rain has left the training ground waterlogged. The coach offers two alternatives.',choices:[choice('indoor','Hire an indoor facility',{cash:-2000,clubMorale:1},'The indoor session kept the routine intact.'),choice('recovery','Give the squad a recovery afternoon',{condition:2,squadHappiness:1},'A recovery afternoon helped the players freshen up. No ability increase was awarded.')]},
 {id:'press',title:'An unhelpful newspaper rumour',text:'A local newspaper claims there is unrest in the dressing room. The players ask how you want to respond.',choices:[choice('calm','Give a calm, brief response',{clubMorale:2,squadHappiness:1},'The measured response took the heat out of the story.'),choice('ignore','Ignore the rumour',{clubMorale:-1},'The rumour faded, but caused a little distraction.')]},
 {id:'birthday',title:'A dressing-room celebration',text:'The squad has organised a small celebration for a staff member’s milestone birthday.',effects:{clubMorale:2,squadHappiness:1},result:'A cheerful afternoon brought the dressing room a little closer together.'},
 {id:'garden',title:'The community garden appeal',text:'A neighbourhood group asks the club to support a small community garden near the ground.',choices:[choice('donate','Contribute to the project',{cash:-2000,supporters:3},'The neighbourhood group thanked the club for helping the garden take shape.'),choice('promote','Promote the appeal',{supporters:1},'The club publicised the appeal without committing money.')]},
 {id:'testimonial',title:'A former player’s testimonial',text:'A much-loved former player invites the club to support their testimonial reception.',choices:[choice('support','Help with the reception',{cash:-1800,supporters:2,clubMorale:2},'The club’s support was warmly received by former players and supporters.'),choice('message','Send a message of thanks',{supporters:1},'The club sent its thanks and best wishes.')]},
 {id:'volunteers',title:'The volunteers get stuck in',text:'Supporter volunteers have repainted a tired-looking entrance at the ground.',effects:{supporters:2,clubMorale:1},result:'Their work brightened the entrance. Stadium capacity and facilities are unchanged.'},
 {id:'breakin',title:'A break-in at the club shop',text:'A small overnight break-in damaged the club shop. The missing stock was insured, but there are repair costs.',choices:[choice('secure','Repair and improve the locks',{cash:-3800,clubMorale:1},'The shop reopened with better locks and repaired fittings.'),choice('repair','Make the essential repairs',{cash:-2200},'Essential repairs allowed the shop to reopen.')]},
 {id:'playeraward',title:'Recognition from the community',text:'{player} has received a local award for their community work.',effects:{playerHappiness:3,supporters:2,clubMorale:1},result:'{player} was pleased to be recognised. Supporters enjoyed hearing the news.'},
 {id:'teammeal',title:'An idea for a team meal',text:'The captain suggests a quiet team meal to help the squad spend time together away from training.',choices:[choice('meal','Cover the team meal',{cash:-2400,squadHappiness:2,clubMorale:2},'The meal gave the squad a chance to relax together.'),choice('club','Arrange a lunch at the club',{cash:-900,squadHappiness:1,clubMorale:1},'A simple club lunch helped everyone catch up.')]},
 {id:'powercut',title:'A power cut at the offices',text:'A short power cut has disrupted a morning at the club offices. The staff have worked together to catch up.',effects:{clubMorale:1},result:'The staff caught up by the end of the day. There was no lasting financial or fixture impact.'}
];
export const BOOKING_TYPES=[
 {id:'concert',label:'Summer stadium concert',setup:1,recovery:2,ticket:18,occupancy:.30,costRate:.62,fixedCost:6000,supporters:2,seasonal:true},
 {id:'community',label:'Community football day',setup:0,recovery:1,ticket:4,occupancy:.08,costRate:.45,fixedCost:1000,supporters:4},
 {id:'corporate',label:'Corporate hospitality evening',setup:0,recovery:0,ticket:45,occupancy:.008,costRate:.42,fixedCost:1600,supporters:1}
];
export function initialiseClubLife(c){
 if(c.clubLife)return c.clubLife;
 const seed=hash(`${c.clubId}:${c.date}:${c.youthSeed||'clubline'}`);
 return c.clubLife={version:1,seed,morale:50,supporters:50,storySerial:0,bookingSerial:0,lastProcessed:c.date,nextStory:eventAfter(c.date,18+seed%10),nextBooking:eventAfter(c.date,25+(seed>>>8)%12),stories:[],bookings:[]};
}
export const eventSquad=(c,league)=>league.players.filter(p=>(c.owners?.[p.id]||p.clubId)===c.clubId&&!c.players?.[p.id]?.retired&&!c.players?.[p.id]?.unregistered&&!c.loans?.[p.id]);
export function bookingWindow(b){const t=BOOKING_TYPES.find(t=>t.id===b.type);return {start:eventAfter(b.date,-t.setup),end:eventAfter(b.date,t.recovery)}}
const overlaps=(a,b)=>a.start<=b.end&&b.start<=a.end;
export function bookingConflict(c,b,ignoreId=b.id){
 const t=BOOKING_TYPES.find(t=>t.id===b.type);if(!t)return 'Unknown event type.';
 if(t.seasonal&&!['05','06','07','08'].includes(b.date.slice(5,7)))return 'Outdoor concerts are offered from May to August.';
 const window=bookingWindow(b);
 if(window.start<c.date)return 'There is no longer enough time for setup.';
 for(const r of c.schedule||[])if(r.fixtures.some(f=>f.home===c.clubId)&&r.date>=window.start&&r.date<=window.end)return 'A home fixture falls inside the setup, event or recovery period.';
 for(const other of c.clubLife?.bookings||[])if(other.id!==ignoreId&&['accepted','completed'].includes(other.status)&&overlaps(window,bookingWindow(other)))return 'Another stadium booking occupies these dates.';
 for(const job of c.construction||[])if(overlaps(window,{start:job.starts||job.started||c.date,end:job.opens}))return 'Stadium construction overlaps these dates.';
 return null;
}
export function stadiumDateConflict(c,date){return (c.clubLife?.bookings||[]).some(b=>['accepted','completed'].includes(b.status)&&date>=bookingWindow(b).start&&date<=bookingWindow(b).end)}
function applyEffects(c,league,effects,playerId){
 const life=initialiseClubLife(c),before={cash:c.balance,morale:life.morale,supporters:life.supporters},players=[];
 c.balance+=effects.cash||0;life.morale=clamp(life.morale+(effects.clubMorale||0));life.supporters=clamp(life.supporters+(effects.supporters||0));
 for(const p of eventSquad(c,league)){
  const state=c.players[p.id],oldH=state.happiness??70,oldF=state.fitness??p.fitness;
  const mood=(effects.squadHappiness||0)+(p.id===playerId?(effects.playerHappiness||0):0),condition=state.injuryDays?0:effects.condition||0;
  state.happiness=clamp(oldH+mood);state.fitness=clamp(oldF+condition);
  if(state.happiness!==oldH||state.fitness!==oldF)players.push({id:p.id,name:p.name,happiness:state.happiness-oldH,condition:state.fitness-oldF});
 }
 return {cash:c.balance-before.cash,clubMorale:life.morale-before.morale,supporters:life.supporters-before.supporters,players};
}
const wording=(s,name)=>s.replaceAll('{player}',name||'A squad player');
export function createClubStory(c,league,definitionId){
 const life=initialiseClubLife(c),def=CLUB_STORIES.find(s=>s.id===definitionId);if(!def||life.stories.some(s=>s.status==='pending'))return null;
 const pool=eventSquad(c,league),young=def.young?pool.filter(p=>p.age<25):pool,chosen=(young.length?young:pool)[hash(`${life.seed}:${c.date}:${def.id}`)%Math.max(1,(young.length?young:pool).length)];
 const story={id:`story-${life.seed}-${life.storySerial++}`,definition:def.id,title:def.title,text:wording(def.text,chosen?.name),playerId:chosen?.id||null,playerName:chosen?.name||null,date:c.date,deadline:eventAfter(c.date,7),status:def.choices?'pending':'resolved'};
 life.stories.push(story);life.stories=life.stories.slice(-60);
 if(!def.choices){story.effects=applyEffects(c,league,def.effects,story.playerId);story.result=wording(def.result,story.playerName);story.resolvedOn=c.date;}
 c.news.push({date:c.date,kind:'club-story',eventId:story.id,text:`${story.title}: ${story.status==='pending'?story.text:story.result}`});return story;
}
export function resolveClubStory(c,league,id,optionId,expired=false){
 const s=c.clubLife?.stories.find(s=>s.id===id),def=CLUB_STORIES.find(d=>d.id===s?.definition),option=def?.choices?.find(o=>o.id===optionId);
 if(!s||s.status!=='pending'||!option)return 'This story has already been handled.';
 if(!expired&&c.date>s.deadline)return 'The response deadline has passed.';
 if(option.effects.playerHappiness&&!eventSquad(c,league).some(p=>p.id===s.playerId))return 'The player is no longer in your registered squad. This choice is no longer available.';
 if((option.effects.cash||0)<0&&c.balance<-(option.effects.cash||0))return 'The club does not have enough cash for this choice.';
 s.effects=applyEffects(c,league,option.effects,s.playerId);s.status='resolved';s.choice=option.id;s.resolvedOn=c.date;s.result=wording(option.result,s.playerName);s.expired=expired;
 c.news.push({date:c.date,kind:'club-story',eventId:s.id,text:`${s.title}: ${s.result}${expired?' The response deadline passed; the lowest-cost option was used.':''}`});return null;
}
export function createBookingOffer(c,league,typeId){
 const life=initialiseClubLife(c),type=BOOKING_TYPES.find(t=>t.id===typeId),club=league.clubs.find(x=>x.id===c.clubId);if(!type||life.bookings.some(b=>b.status==='offered'))return null;
 let date=null;for(let offset=10;offset<=35;offset++){const proposed=eventAfter(c.date,offset);if(!bookingConflict(c,{type:type.id,date:proposed})){date=proposed;break}}if(!date)return null;
 const attendance=Math.max(25,Math.round(club.capacity*type.occupancy)),gross=attendance*type.ticket,cost=Math.round(gross*type.costRate+type.fixedCost);
 const b={id:`booking-${life.seed}-${life.bookingSerial++}`,type:type.id,title:type.label,date,offeredOn:c.date,deadline:eventAfter(c.date,7),status:'offered',estimate:{attendance,gross,cost,net:gross-cost}};
 life.bookings.push(b);life.bookings=life.bookings.slice(-60);c.news.push({date:c.date,kind:'stadium-booking',bookingId:b.id,text:`${b.title} proposed for ${b.date}. Review income, costs and reserved days before accepting.`});return b;
}
export function respondToBooking(c,id,accept){
 const b=c.clubLife?.bookings.find(b=>b.id===id);if(!b||b.status!=='offered')return 'This proposal has already been handled.';
 if(c.date>b.deadline){b.status='expired';return 'The proposal deadline has passed.';}
 if(accept){const conflict=bookingConflict(c,b);if(conflict)return conflict;if(c.balance<b.estimate.cost)return 'Keep enough cash available to cover the estimated operating costs.';}
 b.status=accept?'accepted':'declined';b.respondedOn=c.date;c.news.push({date:c.date,kind:'stadium-booking',bookingId:b.id,text:`${b.title}: ${accept?'accepted for '+b.date+'; no money charged today.':'proposal declined.'}`});return null;
}
export function settleBooking(c,league,b){
 if(b.status!=='accepted'||b.date>c.date)return false;
 // Recheck fixtures/works at the event date, ignoring the now-past setup day.
 const originalDate=c.date;c.date=bookingWindow(b).start;const conflict=bookingConflict(c,b);c.date=originalDate;
 if(conflict){b.status='cancelled';b.result=conflict;b.completedOn=c.date;c.news.push({date:c.date,kind:'stadium-booking',bookingId:b.id,text:`${b.title} cancelled: ${conflict} No event income or costs charged.`});return true;}
 const t=BOOKING_TYPES.find(t=>t.id===b.type),roll=hash(`${c.clubLife.seed}:${b.id}:outcome`),attendance=Math.max(20,Math.round(b.estimate.attendance*(.88+(roll%25)/100))),gross=attendance*t.ticket,cost=Math.round(gross*t.costRate+t.fixedCost*(.95+((roll>>>8)%11)/100));
 b.actual={attendance,gross,cost,net:gross-cost};b.effects=applyEffects(c,league,{cash:b.actual.net,supporters:t.supporters,clubMorale:1});b.status='completed';b.completedOn=c.date;b.result=`${b.title} took place successfully. Cleanup and recovery remain reserved until ${bookingWindow(b).end}.`;
 c.news.push({date:c.date,kind:'stadium-booking',bookingId:b.id,text:`${b.title} completed: ${attendance.toLocaleString('en-GB')} visitors; net ${b.actual.net>=0?'+':'−'}£${Math.abs(b.actual.net).toLocaleString('en-GB')}.`});return true;
}
export function activeStadiumEvent(c){return c.clubLife?.bookings.find(b=>['accepted','completed'].includes(b.status)&&b.date===c.date)||null}
export function advanceClubLife(c,league,{generate=true}={}){
 const life=initialiseClubLife(c);if(life.lastProcessed===c.date)return;
 life.lastProcessed=c.date;
 for(const b of life.bookings){if(b.status==='offered'&&c.date>b.deadline)b.status='expired';else settleBooking(c,league,b)}
 for(const s of life.stories.filter(s=>s.status==='pending'&&c.date>s.deadline)){s.status='resolved';s.expired=true;s.resolvedOn=c.date;s.effects={cash:0,clubMorale:0,supporters:0,players:[]};s.result='No decision was recorded before the deadline. The matter was deferred without additional spending.';c.news.push({date:c.date,kind:'club-story',eventId:s.id,text:`${s.title}: ${s.result}`})}
 if(!generate)return;
 const matchday=(c.schedule||[]).some(r=>r.date===c.date&&r.fixtures.some(f=>f.home===c.clubId||f.away===c.clubId));
 if(!matchday&&c.date>=life.nextStory&&!life.stories.some(s=>s.status==='pending')){
  const recent=new Set(life.stories.slice(-8).map(s=>s.definition)),available=CLUB_STORIES.filter(s=>!recent.has(s.id)),definition=available[hash(`${life.seed}:${c.date}:story`)%available.length];createClubStory(c,league,definition.id);life.nextStory=eventAfter(c.date,21+hash(`${life.seed}:${c.date}:gap`)%12);
 }
 if(!matchday&&c.date>=life.nextBooking&&!life.bookings.some(b=>b.status==='offered')){
  const start=hash(`${life.seed}:${c.date}:booking`)%BOOKING_TYPES.length;let offered=null;for(let i=0;i<BOOKING_TYPES.length&&!offered;i++)offered=createBookingOffer(c,league,BOOKING_TYPES[(start+i)%BOOKING_TYPES.length].id);life.nextBooking=eventAfter(c.date,offered?38+hash(`${life.seed}:${c.date}:booking-gap`)%15:7);
 }
}
export function validClubLife(life,playerIds){
 const obj=x=>x&&typeof x==='object'&&!Array.isArray(x),day=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&Number.isFinite(Date.parse(x+'T12:00:00Z'));
 const number=x=>Number.isFinite(x),money=x=>obj(x)&&['attendance','gross','cost','net'].every(k=>Number.isInteger(x[k]))&&x.attendance>=0&&x.gross>=0&&x.cost>=0&&x.net===x.gross-x.cost;
 if(!obj(life)||life.version!==1||!Number.isInteger(life.seed)||!['morale','supporters'].every(k=>number(life[k])&&life[k]>=0&&life[k]<=100)||!['storySerial','bookingSerial'].every(k=>Number.isInteger(life[k])&&life[k]>=0)||!['lastProcessed','nextStory','nextBooking'].every(k=>day(life[k]))||!Array.isArray(life.stories)||!Array.isArray(life.bookings)||life.stories.length>60||life.bookings.length>60)return false;
 const effects=x=>x===undefined||obj(x)&&['cash','clubMorale','supporters'].every(k=>number(x[k]))&&Array.isArray(x.players)&&x.players.every(p=>obj(p)&&playerIds.has(p.id)&&typeof p.name==='string'&&number(p.happiness)&&number(p.condition));
 const ids=new Set();
 for(const s of life.stories){if(!obj(s)||typeof s.id!=='string'||ids.has(s.id)||!CLUB_STORIES.some(d=>d.id===s.definition)||!['pending','resolved'].includes(s.status)||!day(s.date)||!day(s.deadline)||typeof s.title!=='string'||typeof s.text!=='string'||(s.playerId!==null&&!playerIds.has(s.playerId))||!effects(s.effects)||s.status==='resolved'&&(typeof s.result!=='string'||!day(s.resolvedOn)))return false;ids.add(s.id)}
 for(const b of life.bookings){if(!obj(b)||typeof b.id!=='string'||ids.has(b.id)||!BOOKING_TYPES.some(t=>t.id===b.type)||!['offered','accepted','declined','expired','completed','cancelled'].includes(b.status)||!day(b.date)||!day(b.offeredOn)||!day(b.deadline)||typeof b.title!=='string'||!money(b.estimate)||!effects(b.effects)||b.status==='completed'&&(!money(b.actual)||!day(b.completedOn)))return false;ids.add(b.id)}
 return true;
}
