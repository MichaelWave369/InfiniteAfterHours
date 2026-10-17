import {ZONES,getZone} from '../data/episodes.mjs';
const W=960,H=540;
const R=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h);};
function C(g,x,y,r,c){g.fillStyle=c;g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fill();}
function E(g,x,y,rx,ry,c){g.fillStyle=c;g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill();}
function L(g,x,y,x2,y2,c,w=2){g.strokeStyle=c;g.lineWidth=w;g.beginPath();g.moveTo(x,y);g.lineTo(x2,y2);g.stroke();}
function T(g,s,x,y,size=13,c='#e7f9ff',align='center'){g.fillStyle=c;g.textAlign=align;g.font='600 '+size+'px monospace';g.fillText(s,x,y);}
function panel(g,x,y,w,h,c='#15253d'){R(g,x+4,y+5,w,h,'#04091888');R(g,x,y,w,h,c);g.strokeStyle='#83b6cc65';g.strokeRect(x,y,w,h);}
function base(g,t,night){
 const sky=g.createLinearGradient(0,0,0,H);
 sky.addColorStop(0,night?'#060d28':'#214c80');
 sky.addColorStop(.65,night?'#233552':'#7fa8ba');
 sky.addColorStop(1,night?'#15283e':'#dbb18d');
 g.fillStyle=sky;g.fillRect(0,0,W,H);
 for(let i=0;i<95;i++){
   const x=(i*163+37)%W,y=(i*79+19)%310;
   if(night)C(g,x,y,(i%7===0?2:1),'#c1e5f0ab');
 }
 C(g,824,88,night?26:37,night?'#f2e4c6':'#ffe2a1');
 if(night) C(g,836,78,22,'#0d1b36');
 for(let j=0;j<15;j++){
   const x=(j*101+22)%W,y=100+(j*31)%180;
   if(!night){E(g,x,y,34,7,'#d8e7ec75');E(g,x+15,y-4,19,8,'#d8e7ec75');}
 }
}
function sea(g,t,night){
 R(g,0,306,W,234,night?'#123451':'#358da5');
 for(let i=0;i<17;i++){
   const y=318+i*15;
   for(let j=0;j<9;j++){
     const x=j*130+Math.sin(t*.4+i+j)*26-34;
     L(g,x,y,x+65,y,night?'#70c9d255':'#d4f0e35a',2);
   }
 }
}
function dome(g,x,y){
 E(g,x,y+17,98,23,'#132137');
 R(g,x-67,y-47,134,68,'#283a4e');
 E(g,x,y-48,68,43,'#af9c88');
 E(g,x,y-48,56,32,'#3b6a79');
 for(let i=0;i<5;i++){R(g,x-50+i*26,y-33,15,36,'#f1c97d');R(g,x-46+i*26,y-30,7,29,'#8cdde0');}
 R(g,x-7,y-106,14,24,'#c8a470');C(g,x,y-107,8,'#96eddd');
 T(g,'THE INFINITE HUB',x,y+48,11,'#e6f0e4');
}
function district(g,z,t){
 const x=z.x,y=z.y,col=z.color;
 E(g,x,y+8,73,19,'#121e31a8');
 if(z.id==='deep'){
   E(g,x,y-8,56,40,'#354b67');E(g,x,y-3,38,29,'#132739');
   for(let i=0;i<5;i++){const a=i*1.2;L(g,x-30+i*15,y+13,x-32+i*15,y-14+Math.sin(a)*12,col,5);}
   C(g,x,y-18,4,'#c5f3e9');
 }else if(z.id==='tree'){
   R(g,x-9,y-31,18,50,'#624c49');
   for(let i=0;i<7;i++)C(g,x+Math.sin(i*2.1)*36,y-44+Math.cos(i*2.1)*13,23,i%2?'#327b6e':'#4b9876');
   panel(g,x-16,y-48,35,25,'#936f6e');R(g,x-7,y-36,11,13,'#b6e4ba');
 }else if(z.id==='wipeout'){
   for(let i=0;i<3;i++)C(g,x-31+i*31,y-7+Math.sin(t*1.6+i)*3,17,'#ee627d');
   L(g,x-59,y+18,x+61,y+18,'#b3d5e2',5);
 }else if(z.id==='aqua'){
   E(g,x,y+3,60,24,'#4ad0e4');E(g,x,y+1,42,16,'#b6f2ee');
   L(g,x-30,y-35,x-30,y+6,'#f1d8a5',7);
   L(g,x-30,y-35,x+19,y-35,'#f1d8a5',7);
   L(g,x+19,y-35,x+19,y-8,'#ed9fc6',9);
 }else if(z.id==='drivein'){
   panel(g,x-44,y-49,89,55,'#68536a');R(g,x-35,y-39,71,34,'#222843');
   C(g,x+6,y-21,12,'#efbba3');R(g,x-13,y+17,38,12,'#30475a');
   C(g,x-4,y+30,7,'#19202b');C(g,x+18,y+30,7,'#19202b');
 }else if(z.id==='mall'){
   panel(g,x-48,y-43,96,66,'#66617e');
   for(let i=0;i<4;i++)R(g,x-36+i*21,y-29,14,45,i%2?'#c5a1c0':'#86bccc');
   R(g,x-52,y-46,104,8,'#e4be96');C(g,x,y+25,11,'#78d4ec');
 }else if(z.id==='disco'){
   panel(g,x-48,y-32,95,49,'#463658');C(g,x,y-41,21,'#ded8f5');
   for(let i=0;i<7;i++)L(g,x-13+i*4,y-57,x-14+i*5,y-24,'#ac85bb',1);
   R(g,x-50,y+19,100,7,'#ee9bca');
 }else if(z.id==='atrium'){
   R(g,x-53,y-32,108,48,'#b1c7ad');
   for(let i=0;i<4;i++){R(g,x-42+i*28,y-30,7,47,'#e0dfc9');C(g,x-40+i*28,y-33,8,'#f1d8b0');}
   E(g,x,y+20,48,13,'#6cc5b5');
 }else if(z.id==='neon'){
   for(let i=0;i<5;i++){
     const h=42+(i*19)%32;
     R(g,x-55+i*25,y-h,21,h+13,i%2?'#634d90':'#355a80');
     for(let j=0;j<4;j++)R(g,x-49+i*25,y-h+7+j*13,7,3,j%2?'#efa5ed':'#75deef');
   }
 }
 T(g,z.name.toUpperCase(),x,y+56,11,'#f4f5f0');
}
function island(g,t,night,episode){
 base(g,t,night);sea(g,t,night);
 E(g,479,330,418,166,'#0c243b77');
 E(g,480,308,426,160,'#b49a74');
 E(g,480,297,412,149,'#497e70');
 E(g,480,302,392,132,'#3a6d64');
 for(const z of ZONES){
   L(g,480,304,z.x,z.y,'#dcc59660',6);
   L(g,480,304,z.x,z.y,'#7ed0d05c',2);
 }
 dome(g,482,306);
 for(const z of ZONES)district(g,z,t);
 const zone=getZone(episode?.zone);
 const target=zone||{x:482,y:300,color:'#f9df97'};
 const pulse=.5+.5*Math.sin(t*2.3);
 g.strokeStyle=target.color||'#f6e2b4';g.lineWidth=3;
 g.beginPath();g.arc(target.x,target.y,69+pulse*3,0,2*Math.PI);g.stroke();
 const travel=(Math.sin(t*.28)+1)/2;
 const x=482+(target.x-482)*travel,y=303+(target.y-303)*travel;
 C(g,x,y-17,7,'#facf9d');R(g,x-7,y-9,14,21,'#89d8c4');R(g,x-5,y+12,4,12,'#263953');R(g,x+2,y+12,4,12,'#263953');
 T(g,'NINE DISTRICTS  ·  ONE LIVING ISLAND',480,32,14,'#dff4ee');
 T(g,night?'NIGHT SHIFT':'DAY SHIFT',31,511,11,'#e7e0d8','left');
}
function porch(g,t,night){
 base(g,t,night);R(g,0,361,W,179,'#18263b');
 R(g,94,168,770,188,'#344760');
 g.fillStyle='#52667d';g.beginPath();g.moveTo(65,177);g.lineTo(480,82);g.lineTo(895,177);g.fill();
 for(let i=0;i<4;i++){
   const x=168+i*180;
   panel(g,x,211,110,126,'#192740');
   R(g,x+8,220,94,108,['#505179','#466d73','#734c76','#69718c'][i]);
   R(g,x+19,230,70,3,'#a1dada');C(g,x+90,285,4,'#ffdc9d');
   T(g,'DOOR '+String(i+1),x+54,200,13,'#c9f1ee');
 }
 R(g,58,355,846,20,'#947e75');
 for(let i=0;i<18;i++)L(g,60+i*50,375,60+i*50,480,'#49617a',2);
 E(g,480,387,102,15,'#121b2bb3');
 C(g,477+Math.sin(t*.5)*30,327,10,'#efd3ac');R(g,467+Math.sin(t*.5)*30,337,20,39,'#80d4c8');
 T(g,'THE HALL OF BROTHERS',480,130,18,'#f3ebe0');
 T(g,'A DOOR FOR EVERY CONNECTED WORLD',480,507,13,'#bfd8e4');
}
function nbg(g,t,night){
 base(g,t,night);R(g,0,350,W,190,'#171f34');
 for(let i=0;i<9;i++){
   const r=56+i*20;
   g.save();g.translate(480,266);g.rotate(Math.sin(t*.11+i*.3)*.19);
   g.beginPath();g.ellipse(0,0,r,r*(i%2?.75:1),0,0,Math.PI*2);
   g.strokeStyle=i%2?'#99b6ed':'#77e1d8';g.lineWidth=i%3===0?3:1.7;g.stroke();g.restore();
 }
 for(let i=0;i<12;i++){
   const a=i*Math.PI/6+t*.12;
   C(g,480+Math.cos(a)*180,266+Math.sin(a)*108,3,'#efd9bb');
 }
 C(g,480,266,19,'#b7e8e4');C(g,480,266,9,'#354f82');
 T(g,'NESTED BUBBLE OBSERVATORY',480,58,18,'#e1f4fb');
 T(g,'CONCEPTUAL PATTERNS · NOT SCIENTIFIC VALIDATION',480,504,12,'#b6c4d7');
}
function radio(g,t,night){
 base(g,t,night);R(g,0,357,W,183,'#392440');
 for(let i=0;i<12;i++)L(g,480,356,i*102-80,540,'#75507165',2);
 panel(g,195,134,570,265,'#36465d');
 panel(g,211,151,538,230,'#5e6284');
 for(const x of [328,630]){
   C(g,x,274,91,'#1c2b42');C(g,x,274,73,'#416178');
   C(g,x,274,51,'#182640');C(g,x,274,29,'#7196a9');C(g,x,274,12,'#d2c3c1');
 }
 panel(g,422,208,115,124,'#172b45');
 for(let i=0;i<11;i++){const h=15+Math.abs(Math.sin(t*2+i))*75;R(g,429+i*9,320-h,5,h,i%3===0?'#f1b4ca':'#74e8d5');}
 T(g,'MORE BOUNCE RADIO',480,91,20,'#ffe4ee');
 T(g,'FM 36.9',480,356,15,'#ffd3f2');
 T(g,'BASS LEVEL: BEYOND THE KNOB',480,492,13,'#efd4df');
}
function louvre(g,t,night){
 base(g,t,night);R(g,0,360,W,180,'#27283b');
 for(let i=0;i<12;i++)L(g,480,360,i*111-125,540,'#7b6e85',1);
 for(let i=0;i<6;i++){R(g,15+i*187,81,33,281,'#555973');R(g,13+i*187,71,38,15,'#9490a5');}
 panel(g,295,104,370,269,'#bc9880');panel(g,307,114,346,248,'#1c2942');
 for(let i=0;i<24;i++){
   g.save();g.translate(480,236);g.rotate(i*.21+Math.sin(t*.13)*.13);
   g.strokeStyle=i%2?'#a8c2e1':'#e5adc1';g.lineWidth=3;
   g.beginPath();g.ellipse(0,0,148-i*5,105-i*3.5,0,0,Math.PI*2);g.stroke();g.restore();
 }
 T(g,'THE SILICON LOUVRE',480,49,19,'#eee4fb');
 T(g,'THE STILLNESS THAT MOVES',480,489,14,'#f4d7e7');
}
export function paintScene(g,{world='island',episode=null,night=true,reduced=false,time=0}={}){
 const t=reduced?0:time;
 g.save();g.clearRect(0,0,W,H);
 if(world==='porch')porch(g,t,night);
 else if(world==='nbg')nbg(g,t,night);
 else if(world==='radio')radio(g,t,night);
 else if(world==='louvre')louvre(g,t,night);
 else island(g,t,night,episode);
 g.restore();
}
