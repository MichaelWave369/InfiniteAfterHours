import {safeSignal} from '../data/episodes.mjs';
export function daypartAt(date=new Date()){
  const h=date.getHours();
  return h>=20||h<6?'night':'day';
}
export function readHistory(storage,key='infiniteAfterHours.history.v1'){
  try{
    const raw=JSON.parse(storage.getItem(key)||'[]');
    return Array.isArray(raw)?raw.filter(x=>x&&typeof x.id==='string'&&typeof x.zone==='string').slice(-40).map(x=>({id:x.id,zone:x.zone})):[];
  }catch{return [];}
}
export function writeHistory(storage,history,key='infiniteAfterHours.history.v1'){
  try{storage.setItem(key,JSON.stringify(history.slice(-40)));return true;}catch{return false;}
}
export function candidateScores(episodes,options={}){
  const history=Array.isArray(options.history)?options.history:[];
  const recentIds=new Set(history.slice(-7).map(x=>x.id));
  const recentZones=history.slice(-6).map(x=>x.zone);
  const signal=safeSignal(options.signal);
  const disabled=new Set(options.disabledZones||[]);
  const daypart=options.daypart==='night'?'night':'day';
  return episodes.filter(x=>x&&!x.manualOnly&&!disabled.has(x.zone)&&!recentIds.has(x.id))
    .map(event=>{
      let score=Number(event.baseWeight)||10;
      const seen=recentZones.filter(z=>z===event.zone).length;
      score*=seen>=2?.25:seen===1?.72:1.45;
      if(event.trigger!=='NONE')score*=event.trigger===signal?3.2:.65;
      if(event.daypart==='night')score*=daypart==='night'?1.8:.48;
      if(options.lastTwoHighEnergy&&event.energy==='active')score*=.35;
      if(event.rarity==='rare')score*=.30;
      return {event,score};
    });
}
export function chooseAdventure(episodes,options={}){
  const top=candidateScores(episodes,options).sort((a,b)=>b.score-a.score).slice(0,12);
  if(!top.length)return null; // Do not lie about the no-repeat rule.
  const random=typeof options.random==='function'?options.random:Math.random;
  const total=top.reduce((n,x)=>n+x.score,0);
  let roll=Math.max(0,Math.min(.999999,Number(random())||0))*total;
  for(const item of top){roll-=item.score;if(roll<0)return item.event;}
  return top.at(-1).event;
}
export function appendHistory(history,event){
  return event?[...history,{id:event.id,zone:event.zone}].slice(-40):history;
}
