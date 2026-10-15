/* Pure training logic, used by the UI and behavior tests. */
(function(root){
 function correlate(events){
  const denied=events.filter(x=>x.event==='authorization'&&x.outcome==='denied').map(x=>({...x,time:Date.parse(x.timestamp)})).filter(x=>Number.isFinite(x.time)).sort((a,b)=>a.time-b.time);
  for(let i=0;i<denied.length;i++){const group=denied.slice(i).filter(x=>x.source===denied[i].source&&x.time-denied[i].time<=60000);if(group.length>=5)return 'Review required: at least five denials from the same recorded source within 60 seconds. This does not identify an attacker or prove compromise.';}
  if(events.some(x=>x.event==='lab-action'))return 'A lab operation was recorded. Compare it with the authorized exercise and verify recovery; a change is not automatically malicious.';
  return 'No repeated-denial threshold reached in these records. Review isolated failures in context; absence of this pattern does not prove safety.';
 }
 class Stream{
  constructor(){this.records=[[],[]];this.groups={ops:[0,0],security:[0,0]};this.next={ops:0,security:0};}
  produce(partition,link){if(![0,1].includes(partition))throw Error('Invalid partition');const record={partition,offset:this.records[partition].length,source:'training-radio',training:true,link,snr_db:link==='up'?18:4,timestamp:new Date().toISOString()};this.records[partition].push(record);return record;}
  lag(group){return this.records.reduce((sum,p,i)=>sum+p.length-this.groups[group][i],0);}
  consume(group){if(!this.groups[group])throw Error('Unknown group');for(let n=0;n<2;n++){const p=(this.next[group]+n)%2,pos=this.groups[group][p];if(pos<this.records[p].length){this.groups[group][p]++;this.next[group]=1-p;return this.records[p][pos];}}return null;}
 }
 const api={correlate,Stream};root.tpolExercises=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
