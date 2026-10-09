export const WELCOME_STOPS=[
 {id:'squad',label:'Meet your squad',note:'Review ability, condition and squad depth.',section:'squad',sub:'squad-list'},
 {id:'lineup',label:'Set your starting XI',note:'Choose a formation, eleven players and your bench.',section:'squad',sub:'lineup'},
 {id:'finances',label:'Check the finances',note:'Understand your cash balance and weekly commitments.',section:'finances',sub:'lineup'},
 {id:'contracts',label:'Review contracts',note:'Look at expiring deals and your wage allowance.',section:'finances',sub:'contracts'},
 {id:'preseason',label:'Plan pre-season',note:'Review optional friendly invitations and the calendar.',section:'organiser',sub:'calendar'},
 {id:'expectations',label:'Read our expectations',note:'Check this season’s league and financial objectives.',section:'hub',sub:'lineup'}
];
export const topClubPlayers=(league,id)=>league.players.filter(p=>p.clubId===id).sort((a,b)=>b.overall-a.overall||a.name.localeCompare(b.name,'en-GB')||a.id.localeCompare(b.id)).slice(0,3);
