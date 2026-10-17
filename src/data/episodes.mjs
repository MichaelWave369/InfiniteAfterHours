// Original July 2026 story seeds, adapted to public-safe micro-story captions.
export const ZONES = Object.freeze([
  {id:'deep',name:'The Deep Below',x:158,y:193,color:'#79bfde',glyph:'◆'},
  {id:'tree',name:'Tree Top',x:473,y:143,color:'#7cdaad',glyph:'♣'},
  {id:'wipeout',name:'Wipeout Arena',x:797,y:193,color:'#f391a4',glyph:'●'},
  {id:'aqua',name:'Aqua Paradise',x:790,y:334,color:'#76ddef',glyph:'≈'},
  {id:'drivein',name:'Retro Drive-In',x:160,y:345,color:'#edc28e',glyph:'▣'},
  {id:'mall',name:'Mall Dreams',x:351,y:302,color:'#d5b3f2',glyph:'◇'},
  {id:'disco',name:'Roller Disco',x:285,y:451,color:'#ec99db',glyph:'✦'},
  {id:'atrium',name:'Daydream Atrium',x:540,y:453,color:'#d4e9a7',glyph:'☼'},
  {id:'neon',name:'Neon Haven',x:712,y:458,color:'#a6baff',glyph:'✧'}
]);
export const SIGNALS=Object.freeze(['NONE','BUILD_STARTED','BUILD_PASSED','BUILD_FAILED','CLAIM_SUPPORTED','CLAIM_UNSUPPORTED','NEW_IDEA_CAPTURED','SYNC_COMPLETE','LONG_WORK_STREAK']);
export const WORLDS=Object.freeze([
  {id:'island',name:'Infinite Island',subtitle:'Nine districts. One little dream.'},
  {id:'porch',name:'Infinite Porch',subtitle:'Hall of Brothers: everybody gets a door.'},
  {id:'nbg',name:'Nested Bubble Observatory',subtitle:'Visual metaphor, not experimental evidence.'},
  {id:'radio',name:'More Bounce Radio',subtitle:'The beat persists without supervision.'},
  {id:'louvre',name:'Silicon Louvre',subtitle:'The stillness that moves.'}
]);
const episode=(id,title,zone,beat,o={})=>Object.freeze({
  id,title,zone,beat,trigger:o.trigger||'NONE',
  rarity:o.rarity||'common',baseWeight:o.baseWeight||25,
  energy:o.energy||'calm',daypart:o.daypart||'any',
  manualOnly:!!o.manualOnly
});
export const EPISODES=Object.freeze([
  episode('island.wake_wave','Institute Wake Wave','hub','A beacon travels from the hub through nine districts. The island wakes.',{baseWeight:20}),
  episode('deep.headlamp','Headlamp Handshake','deep','A tiny explorer taps the lamp twice. The crystal cavern answers in teal.'),
  episode('tree.courier','Canopy Courier','tree','A courier ziplines between birdhouse mailboxes. Another idea delivered.',{trigger:'NEW_IDEA_CAPTURED',energy:'active'}),
  episode('wipeout.monkey_bars','Monkey Bar Build Test','wipeout','The inspector checks LINT, TESTS, TYPES and SECURITY before the jump.',{trigger:'BUILD_PASSED',energy:'active'}),
  episode('aqua.lazy_river','Lazy River Log Replay','aqua','A tiny logbook floats past. No private information aboard.'),
  episode('drivein.snack_compile','Snack Bar Compile','drivein','The snack bar serves a popcorn-shaped progress bar.',{trigger:'BUILD_STARTED'}),
  episode('mall.arcade_debug','Arcade Cabinet Debug','mall','The arcade says ONE MORE TRY. The error sprites politely queue.',{trigger:'BUILD_FAILED',energy:'active'}),
  episode('disco.dj_sassy','DJ Lil SaaSy','disco','A tiny DJ starts a cheerful sync celebration.',{trigger:'BUILD_PASSED',energy:'active'}),
  episode('atrium.pool_reflection','Sunlit Pool Reflection','atrium','The still pool reflects a new doorway. Some ideas need sunlight.'),
  episode('neon.lounge_sync','Night Lounge Sync','neon','Neon lamps breathe together. The skyline settles into a rhythm.',{trigger:'SYNC_COMPLETE',daypart:'night'}),
  episode('island.resh_bottle','Message Bottle From Resh','hub','A sealed bottle drifts into Idea Harbor. A rare lore moment arrives.',{rarity:'rare',baseWeight:2}),
  episode('island.user_returns','The User Returns','hub','WELCOME BACK, BRO. The island waves and returns control.',{manualOnly:true})
]);
export const getZone=id=>ZONES.find(z=>z.id===id);
export const safeSignal=s=>SIGNALS.includes(s)?s:'NONE';
