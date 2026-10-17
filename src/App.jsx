import React,{useCallback,useEffect,useRef,useState} from 'react';
import {WORLDS,ZONES,SIGNALS,EPISODES} from './data/episodes.mjs';
import {chooseAdventure,appendHistory,daypartAt,readHistory,writeHistory} from './engine/scheduler.mjs';
import {paintScene} from './graphics/draw.mjs';

const WORLD_CAPTIONS={
 porch:'A living hall with a door for each connected world. Nobody told the furniture.',
 nbg:'Nested gears and bubbles dance. The ledger still requires evidence.',
 radio:'Somebody turned the bass knob so far that the knob left.',
 louvre:'A painting tilts. The entire gallery pretends not to notice.'
};
function WorldCanvas({world,episode,night,reduced}){
 const canvasRef=useRef(null);
 useEffect(()=>{
  const g=canvasRef.current?.getContext('2d',{alpha:false});
  if(!g)return;
  let frame=0;
  const loop=ms=>{
   paintScene(g,{world,episode,night,reduced,time:ms/1000});
   frame=requestAnimationFrame(loop);
  };
  frame=requestAnimationFrame(loop);
  return()=>cancelAnimationFrame(frame);
 },[world,episode,night,reduced]);
 return <canvas ref={canvasRef} width="960" height="540" aria-label="Original animated pixel-art styled scene from Infinite After Hours" role="img"/>;
}
function getStoredHistory(){
 if(typeof window==='undefined')return [];
 return readHistory(window.localStorage);
}
export default function App(){
 const [world,setWorld]=useState('island');
 const [episode,setEpisode]=useState(EPISODES[0]);
 const [history,setHistory]=useState(getStoredHistory);
 const historyRef=useRef(history);
 const [signal,setSignal]=useState('NONE');
 const [auto,setAuto]=useState(true);
 const [saver,setSaver]=useState(false);
 const [reduced,setReduced]=useState(()=>typeof window!=='undefined'&&window.matchMedia?.('(prefers-reduced-motion: reduce)').matches===true);
 const [ledger,setLedger]=useState(false);
 const [notice,setNotice]=useState('');
 const night=daypartAt()==='night';
 const current=WORLDS.find(w=>w.id===world)||WORLDS[0];
 const advance=useCallback((inputSignal)=>{
  const selected=chooseAdventure(EPISODES,{history:historyRef.current,signal:inputSignal||'NONE',daypart:daypartAt()});
  if(!selected)return;
  setEpisode(selected);
  const next=appendHistory(historyRef.current,selected);
  historyRef.current=next;
  setHistory(next);
  writeHistory(window.localStorage,next);
 },[]);
 useEffect(()=>{advance('NONE');},[advance]);
 useEffect(()=>{
  if(!auto)return;
  const eventId=setInterval(()=>{if(world==='island')advance(signal);},22000);
  return()=>clearInterval(eventId);
 },[auto,world,signal,advance]);
 useEffect(()=>{
  if(!auto)return;
  const worldId=setInterval(()=>{
   setWorld(old=>WORLDS[(WORLDS.findIndex(w=>w.id===old)+1)%WORLDS.length].id);
  },78000);
  return()=>clearInterval(worldId);
 },[auto]);
 useEffect(()=>{
  let timer;
  const clear=()=>clearTimeout(timer);
  const start=()=>{clear();timer=setTimeout(()=>setSaver(true),180000);};
  const wake=()=>{
   setSaver(false);
   setNotice('WELCOME BACK, BRO');
   setTimeout(()=>setNotice(''),1700);
  };
  const onActivity=()=>{if(saver)wake();else start();};
  if(!saver)start();
  window.addEventListener('pointermove',onActivity);
  window.addEventListener('pointerdown',onActivity);
  window.addEventListener('keydown',onActivity);
  return()=>{clear();window.removeEventListener('pointermove',onActivity);window.removeEventListener('pointerdown',onActivity);window.removeEventListener('keydown',onActivity);};
 },[saver]);
 useEffect(()=>{
  const key=e=>{
   if(saver)return;
   if(e.target instanceof HTMLElement&&['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;
   if(e.key==='ArrowRight'||e.key===' '){e.preventDefault();setWorld(w=>WORLDS[(WORLDS.findIndex(x=>x.id===w)+1)%WORLDS.length].id);}
   if(e.key==='ArrowLeft'){e.preventDefault();setWorld(w=>WORLDS[(WORLDS.findIndex(x=>x.id===w)+WORLDS.length-1)%WORLDS.length].id);}
   if(e.key.toLowerCase()==='a')setAuto(x=>!x);
   if(e.key.toLowerCase()==='s')setSaver(true);
   if(e.key==='Escape')setLedger(false);
  };
  window.addEventListener('keydown',key);
  return()=>window.removeEventListener('keydown',key);
 },[saver]);
 function nextWorld(){setWorld(w=>WORLDS[(WORLDS.findIndex(x=>x.id===w)+1)%WORLDS.length].id);}
 function nextStory(){setWorld('island');advance(signal);}
 function fullscreen(){
  if(document.fullscreenElement)document.exitFullscreen?.();
  else document.documentElement.requestFullscreen?.().catch(()=>{});
 }
 const recent=history.slice(-6).reverse();
 const currentBeat=world==='island'?episode.beat:WORLD_CAPTIONS[world];
 return <div className={'app '+(saver?'is-saver':'')}>
  <WorldCanvas world={world} episode={episode} night={night} reduced={reduced}/>
  <div className="scanlines" aria-hidden="true"/><div className="vignette" aria-hidden="true"/>
  <header className="topbar">
   <div className="brand"><div className="eyebrow">THE SCREEN SLEEPS. THE WORLDS WAKE UP.</div><h1>INFINITE <span>AFTER HOURS</span></h1><div className="subhead">ORIGINAL LIVING SCREENSAVER UNIVERSE · v0.1</div></div>
   <nav className="actions" aria-label="Playback controls">
    <button onClick={nextWorld}>NEXT WORLD ↗</button>
    <button onClick={nextStory}>NEW STORY</button>
    <button aria-pressed={auto} onClick={()=>setAuto(x=>!x)}>AUTO {auto?'ON':'OFF'}</button>
    <button onClick={()=>setSaver(true)}>SAVER MODE</button>
    <button onClick={fullscreen}>FULLSCREEN</button>
   </nav>
  </header>
  <aside className="worldrail" aria-label="Worlds">
   {WORLDS.map(w=><button key={w.id} title={w.name} aria-current={world===w.id?'true':undefined} onClick={()=>setWorld(w.id)}><span className="world-dot"/>{w.name}</button>)}
  </aside>
  <footer className="hud">
   <div className="story">
    <div className="eyebrow">{current.name.toUpperCase()} · {world==='island'?'STORY SEED PREVIEW':'WORLD PREVIEW'}</div>
    <h2>{world==='island'?episode.title:current.subtitle}</h2>
    <p>{currentBeat}</p>
   </div>
   <div className="settings">
    <div className="settings-title">IDLEKIT INSPECTOR</div>
    <div className="settings-row"><label htmlFor="signal">SIMULATED SIGNAL</label>
     <select id="signal" value={signal} onChange={e=>setSignal(e.target.value)}>
      {SIGNALS.map(s=><option key={s} value={s}>{s.replaceAll('_',' ')}</option>)}
     </select>
    </div>
    <div className="settings-row inline"><button onClick={()=>{setWorld('island');advance(signal);}}>RUN SIGNAL</button><button aria-pressed={reduced} onClick={()=>setReduced(x=>!x)}>MOTION {reduced?'LOW':'FULL'}</button><button onClick={()=>setLedger(x=>!x)}>LEDGER ({history.length})</button></div>
    <small>Preview signals only. No network, real CI status or private data.</small>
   </div>
  </footer>
  <div className="tiny-note">9 DISTRICTS · 12 STORY SEEDS · 5 VISUAL WORLDS · SOUND OFF</div>
  {ledger&&<div className="ledger" role="dialog" aria-label="Local story event history">
   <div className="ledger-head"><h2>LOCAL STORY LEDGER</h2><button onClick={()=>setLedger(false)}>CLOSE ×</button></div>
   <p>Only event IDs and zone IDs are saved on this device. This is not a record of real build or project status.</p>
   {recent.length===0?<p>No stories seen yet.</p>:<ol>{recent.map((e,i)=><li key={i}>{e.id} / {e.zone}</li>)}</ol>}
   <p className="dim">No documents, emails, source code or filenames collected.</p>
  </div>}
  {notice&&<div className="wake-notice" role="status">{notice}</div>}
  {saver&&<div className="saver-hint" aria-hidden="true">MOVE MOUSE OR PRESS ANY KEY TO WAKE</div>}
 </div>;
}
