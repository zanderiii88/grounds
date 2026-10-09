import {stadiumDateConflict} from './club-events.js?v=1.55.0';
// Invitations are career-owned. Only accepted invitations become fixtures.
const after=(date,n)=>new Date(Date.parse(date+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
export function offerFriendlies(career,league){
 const year=career.date.slice(0,4),start=year+'-08-03';
 career.friendlyInvitations=league.clubs.filter(c=>c.id!==career.clubId).sort((a,b)=>Math.abs((a.attack+a.defence)-(league.clubs.find(c=>c.id===career.clubId).attack+league.clubs.find(c=>c.id===career.clubId).defence))-Math.abs((b.attack+b.defence)-(league.clubs.find(c=>c.id===career.clubId).attack+league.clubs.find(c=>c.id===career.clubId).defence))||a.id.localeCompare(b.id)).slice(0,3).map((club,i)=>({id:`F${year}-${career.clubId}-${i}`,opponent:club.id,date:after(start,[2,6,9][i]),home:i!==1,status:'offered'}));
 career.news.push({date:career.date,kind:'friendlies',text:'Pre-season invitations received. Accept or decline them in Home. Friendlies affect condition and form, but not league points or league suspensions.'});
}
export function respondToFriendly(career,id,accept){
 const invitation=career.friendlyInvitations?.find(x=>x.id===id);
 if(!invitation||invitation.status!=='offered')return 'This invitation has already been handled.';
 if(invitation.date<career.date){invitation.status='expired';return 'The proposed date has passed.';}
 if(accept&&invitation.home&&stadiumDateConflict(career,invitation.date))return 'A stadium booking reserves this date for setup, the event or recovery.';
 if(accept&&career.schedule.some(r=>Math.abs((Date.parse(r.date)-Date.parse(invitation.date))/86400000)<3&&r.fixtures.some(f=>f.home===career.clubId||f.away===career.clubId)))return 'Leave at least three days between your fixtures.';
 invitation.status=accept?'accepted':'declined';
 if(accept){career.schedule.push({date:invitation.date,friendly:true,fixtures:[{id:invitation.id,friendly:true,home:invitation.home?career.clubId:invitation.opponent,away:invitation.home?invitation.opponent:career.clubId,kickoff:'15:00',homeGoals:null,awayGoals:null}]});career.schedule.sort((a,b)=>a.date.localeCompare(b.date));}
 return null;
}
export function expireFriendlies(career){for(const f of career.friendlyInvitations||[])if(f.status==='offered'&&f.date<career.date)f.status='expired';}
export function friendlyEstimate(career,club,invitation){const attendance=Math.round(club.capacity*.32),ticket=club.ticketPrice||18;return invitation.home?{income:Math.round(attendance*ticket*.55*.54),travel:0}:{income:0,travel:3500};}
