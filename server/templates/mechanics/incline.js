module.exports = function(params = {}) {
  const angle = params.angle || 30, mu = params.mu || 0.2, mass = params.mass || 2;
  return `<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>斜面滑块</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#1a1a2e;color:#e0e0e0;font-family:system-ui;max-width:600px;margin:0 auto;padding:10px}
canvas{width:100%;height:320px;background:#16213e;border-radius:8px;display:block}
label{display:flex;justify-content:space-between;font-size:14px;color:#64ffda}
input[type=range]{width:100%;height:44px;accent-color:#64ffda}
.ctrl{display:flex;flex-direction:column;gap:8px;margin-top:10px}
.btns{display:flex;gap:10px;margin-top:8px}
button{flex:1;height:44px;background:#0f3460;color:#e0e0e0;border:none;border-radius:6px;font-size:16px}
.data{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.data div{background:#0f3460;padding:4px 8px;border-radius:4px;font-size:12px}
</style>
</head>
<body>
<h3 style="text-align:center;color:#64ffda;margin-bottom:8px">斜面滑块</h3>
<canvas id="cv"></canvas>
<div class="data">
<div>重力分力:<span id="dg">0</span> N</div>
<div>摩擦力:<span id="df">0</span> N</div>
<div>加速度:<span id="da">0</span> m/s²</div>
<div>状态:<span id="dst">静止</span></div>
</div>
<div class="ctrl">
<label>斜面角度 <span id="la">${angle}°</span></label>
<input type="range" id="sa" min="10" max="60" value="${angle}">
<label>摩擦系数 <span id="lm">${mu}</span></label>
<input type="range" id="sm" min="0" max="0.8" step="0.01" value="${mu}">
<label>质量 <span id="lM">${mass} kg</span></label>
<input type="range" id="sM" min="0.5" max="10" step="0.5" value="${mass}">
</div>
<div class="btns"><button id="bp">暂停</button><button id="br">重置</button></div>
<script>
const cv=document.getElementById('cv'),cx=cv.getContext('2d');
function rs(){cv.width=cv.offsetWidth*2;cv.height=640;cx.scale(2,2)}rs();
let ANG=${angle}*Math.PI/180,MU=${mu},MASS=${mass},s=0,v=0,paused=false;
const W=()=>cv.offsetWidth,H=()=>cv.offsetHeight;
function reset(){s=0;v=0}
document.getElementById('sa').oninput=e=>{ANG=+e.target.value*Math.PI/180;document.getElementById('la').textContent=e.target.value+'°';reset()};
document.getElementById('sm').oninput=e=>{MU=+e.target.value;document.getElementById('lm').textContent=MU;reset()};
document.getElementById('sM').oninput=e=>{MASS=+e.target.value;document.getElementById('lM').textContent=MASS+' kg';reset()};
document.getElementById('bp').onclick=e=>{paused=!paused;e.target.textContent=paused?'继续':'暂停'};
document.getElementById('br').onclick=reset;
const G=9.8;
let last=0;
function loop(ts){
const dt=Math.min((ts-last)/1000,0.05);last=ts;
const Fg=MASS*G*Math.sin(ANG),Ff_max=MU*MASS*G*Math.cos(ANG);
let Ff=0,a=0,sliding=false;
if(Fg>Ff_max+0.01){Ff=Ff_max;a=(Fg-Ff)/MASS;sliding=true}else{Ff=Fg;a=0}
if(!paused&&sliding){v+=a*dt;s+=v*dt;if(s>1)s=1,v=0}
cx.clearRect(0,0,W(),H());
const baseY=H()-30,len=W()-60;
const bx=30,by=baseY,tx=W()-30,ty=baseY-len*Math.tan(ANG);
if(Math.tan(ANG)>1)ty=Math.max(40,baseY-len);
const inclineLen=Math.sqrt((tx-bx)**2+(ty-by)**2);
cx.fillStyle='#0f3460';cx.beginPath();cx.moveTo(bx,by);cx.lineTo(tx,ty);cx.lineTo(bx,by);cx.closePath();cx.fill();
const blockS=s*inclineLen*0.8;
const dx=bx+Math.cos(Math.atan2(ty-by,tx-bx))*blockS;
const dy=by+Math.sin(Math.atan2(ty-by,tx-bx))*blockS;
cx.save();cx.translate(dx,dy);cx.rotate(-ANG);
cx.fillStyle='#64ffda';cx.fillRect(-15,-30,30,30);cx.restore();
document.getElementById('dg').textContent=Fg.toFixed(1);
document.getElementById('df').textContent=Ff.toFixed(1);
document.getElementById('da').textContent=a.toFixed(2);
document.getElementById('dst').textContent=sliding?'滑动':'静止';
requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
</script>
</body></html>`;
};
