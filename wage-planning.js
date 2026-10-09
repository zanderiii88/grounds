// Advisory season allowance. Payroll processing remains owned by the career engine.
export const weeklyPayroll=pool=>pool.reduce((sum,p)=>sum+(Number(p.wage)||0),0);
export function payrollsAfter(date,end){
 const start=Date.parse(date+'T12:00:00Z'),finish=Date.parse(end+'T12:00:00Z');
 if(!Number.isFinite(start)||!Number.isFinite(finish)||finish<=start)return 0;
 const day=new Date(start).getUTCDay(),first=start+((8-day)%7||7)*86400000;
 return first>finish?0:Math.floor((finish-first)/604800000)+1;
}
export function initialiseWagePlan(c,pool){
 const key=c.seasonStart;
 if(c.wagePlan?.seasonStart===key&&Number.isFinite(c.wagePlan.weeklyAllowance))return c.wagePlan;
 const opening=weeklyPayroll(pool);
 c.wagePlan={seasonStart:key,setOn:c.date,openingPayroll:opening,weeklyAllowance:Math.ceil(opening*1.1/100)*100};
 return c.wagePlan;
}
export function wageOutlook(c,pool,adjustment=0){
 const plan=initialiseWagePlan(c,pool),end=(Number(c.seasonStart.slice(0,4))+1)+'-06-30';
 const weeks=payrollsAfter(c.date,end),seasonWeeks=payrollsAfter(c.seasonStart,end),weekly=weeklyPayroll(pool)+adjustment;
 return {...plan,end,weeks,seasonWeeks,weekly,headroom:plan.weeklyAllowance-weekly,projected:weekly*weeks,remainingAllowance:plan.weeklyAllowance*weeks,seasonAllowance:plan.weeklyAllowance*seasonWeeks};
}
