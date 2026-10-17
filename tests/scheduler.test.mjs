import test from 'node:test';
import assert from 'node:assert/strict';
import {EPISODES,ZONES,safeSignal} from '../src/data/episodes.mjs';
import {chooseAdventure,candidateScores,appendHistory,readHistory,writeHistory} from '../src/engine/scheduler.mjs';
test('nine districts and twelve story seeds',()=>{
 assert.equal(ZONES.length,9);assert.equal(EPISODES.length,12);
 assert.equal(new Set(EPISODES.map(e=>e.id)).size,12);
 for(const z of ZONES)assert.ok(EPISODES.some(e=>e.zone===z.id));
});
test('unknown signals rejected',()=>{assert.equal(safeSignal('PRIVATE_TEXT'),'NONE');assert.equal(safeSignal('BUILD_PASSED'),'BUILD_PASSED');});
test('primary does not repeat within last seven',()=>{
 let history=[];
 for(let i=0;i<30;i++){
  const e=chooseAdventure(EPISODES,{history,random:()=>.32});
  assert.ok(e);assert.ok(!history.slice(-7).some(h=>h.id===e.id));
  history=appendHistory(history,e);
 }
});
test('signal boosts matching event but not recent repeats',()=>{
 const normal=candidateScores(EPISODES,{signal:'NONE'}).find(x=>x.event.id==='mall.arcade_debug');
 const boosted=candidateScores(EPISODES,{signal:'BUILD_FAILED'}).find(x=>x.event.id==='mall.arcade_debug');
 assert.ok(boosted.score>normal.score);
 assert.ok(!candidateScores(EPISODES,{history:[{id:'mall.arcade_debug',zone:'mall'}]}).some(x=>x.event.id==='mall.arcade_debug'));
});
test('return event only manual',()=>{
 for(let i=0;i<30;i++)assert.notEqual(chooseAdventure(EPISODES,{random:()=>i/30})?.id,'island.user_returns');
});
test('disabled zones excluded',()=>{
 const scored=candidateScores(EPISODES,{disabledZones:ZONES.map(x=>x.id)});
 assert.ok(scored.every(x=>x.event.zone==='hub'));
});
test('event histories remain local and recover gracefully',()=>{
 const m=new Map();const store={getItem:k=>m.get(k),setItem:(k,v)=>m.set(k,v)};
 writeHistory(store,[{id:'x',zone:'hub'}]);assert.deepEqual(readHistory(store),[{id:'x',zone:'hub'}]);
 m.set('infiniteAfterHours.history.v1','{invalid');
 assert.deepEqual(readHistory(store),[]);
});
