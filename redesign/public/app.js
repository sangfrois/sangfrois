// A gesture and its altered return: no fabricated measurements, no idle animation.
const field=document.querySelector('#feedback');
if(field){
 const gesture=document.querySelector('#gesture-trace'),response=document.querySelector('#return-trace');
 const gp=document.querySelector('#gesture-point'),rp=document.querySelector('#return-point');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let points=[],echo=[],drawing=false,pending=null,last=0;
 const path=a=>a.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
 function render(){gesture.setAttribute('d',path(points));response.setAttribute('d',path(echo));for(const [el,a] of [[gp,points],[rp,echo]]){const p=a.at(-1);if(p){el.setAttribute('cx',p.x);el.setAttribute('cy',p.y)}}}
 function reset(){cancelAnimationFrame(pending);points=[];echo=[];drawing=false;for(let i=0;i<340;i++){const t=i/339*Math.PI*10;const scale=1-i/460;points.push({x:310+Math.cos(t)*145*scale,y:195+Math.sin(t)*165*scale});echo.push({x:390+Math.cos(t+.18)*145*scale,y:195+Math.sin(t+.18)*145*scale})}render()}
 function add(x,y){if(!drawing){points=[];echo=[];drawing=true}points.push({x,y});if(points.length>260)points.shift();const q={x:700-x+18*Math.sin(y/43),y:195+(y-195)*.8};if(reduced.matches){echo.push(q);if(echo.length>260)echo.shift();render();return}const start=echo.at(-1)||q;cancelAnimationFrame(pending);let step=0;function follow(){step++;echo.push({x:start.x+(q.x-start.x)*step/12,y:start.y+(q.y-start.y)*step/12});if(echo.length>260)echo.shift();render();if(step<12)pending=requestAnimationFrame(follow)}follow();render()}
 field.addEventListener('pointermove',e=>{if(e.pointerType==='touch'&&!e.buttons)return;if(e.timeStamp-last<25)return;last=e.timeStamp;const box=field.getBoundingClientRect();add((e.clientX-box.left)/box.width*700,(e.clientY-box.top)/box.height*390)});
 field.addEventListener('pointerdown',e=>{field.setPointerCapture(e.pointerId)});
 field.addEventListener('keydown',e=>{if(e.key==='Escape'){reset();return}const dirs={ArrowLeft:[-12,0],ArrowRight:[12,0],ArrowUp:[0,-12],ArrowDown:[0,12]};if(dirs[e.key]){e.preventDefault();const p=drawing?points.at(-1):{x:250,y:195};add(Math.max(0,Math.min(700,p.x+dirs[e.key][0])),Math.max(0,Math.min(390,p.y+dirs[e.key][1])))}});
 document.querySelector('#reset-study').addEventListener('click',reset);reset();
}
const stage=document.querySelector('.image-stage');
if(stage){
 const imgs=[...stage.querySelectorAll('img')],buttons=[...document.querySelectorAll('[data-slide]')];let current=0,startX=0;
 function show(i){current=(i+imgs.length)%imgs.length;imgs.forEach((im,n)=>{im.hidden=n!==current;im.classList.toggle('active',n===current)});buttons.forEach((b,n)=>b.setAttribute('aria-pressed',String(n===current)));document.querySelector('#gallery-count').textContent=`${String(current+1).padStart(2,'0')} / 06`;document.querySelector('#gallery-caption').textContent=imgs[current].dataset.caption}
 document.querySelector('#gallery-prev').addEventListener('click',()=>show(current-1));document.querySelector('#gallery-next').addEventListener('click',()=>show(current+1));buttons.forEach(b=>b.addEventListener('click',()=>show(Number(b.dataset.slide))));
 stage.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();show(current+(e.key==='ArrowRight'?1:-1))}});
 stage.addEventListener('touchstart',e=>{startX=e.changedTouches[0].clientX},{passive:true});stage.addEventListener('touchend',e=>{let dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>45)show(current+(dx<0?1:-1))},{passive:true});
}

// Scroll changes the relation between material layers, not reading position.
const atmosphere=document.querySelector('.atmosphere');
if(atmosphere){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),light=atmosphere.querySelector('.light-field'),signal=atmosphere.querySelector('.signal-field'),photo=document.querySelector('.image-stage');let queued=false;
 function update(){queued=false;if(reduced.matches){light.style.transform='';signal.style.transform='';photo?.style.removeProperty('--image-drift');return}const y=window.scrollY;light.style.transform=`translate3d(0,${-Math.min(y*.035,180)}px,0)`;signal.style.transform=`translate3d(0,${-Math.min(y*.075,350)}px,0)`;if(photo){const r=photo.getBoundingClientRect();const drift=Math.max(-9,Math.min(9,(r.top-innerHeight/2)*.018));photo.style.setProperty('--image-drift',`${drift}px`)}}
 addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update)}},{passive:true});reduced.addEventListener('change',update);update();
}
