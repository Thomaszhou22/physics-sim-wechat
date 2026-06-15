module.exports = function(params = {}) {
  const k = params.k || 80, m = params.m || 1, amp = params.amp || 1;
  return `<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>弹簧振子</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#1a1a2e;color:#e0e0e0;font-family:system-ui;max-width:600px;margin:0 auto;padding:10px}
canvas{width:100%;height:280px;background:#16213e;border-radius:8px;display:block}
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
<h3 style="text-align:center;color:#64ffda;margin-bottom:8px">弹簧振子</h3>
<canvas id="cv"></canvas>
<div class="data">
<div>频率f:<span id="df">0</span> Hz</div>
<div>周期T:<span id="dT">0</span> s</div>
<div>位移x:<span id="dx">0</span> m</div>
<div>弹性力F:<span id="dF">0</span> N</div>
</div>
<div class="ctrl">
<label>劲度系数 <span id="lk">${k} N/m</span></label>
<input type="range" id="sk" min="10" max="200" value="${k}">
<label>质量 <span id="lm">${m} kg</span></label>
<input type="range" id="sm" min="0.5" max="5" step="0.1" value="${m}">
<label>振幅 <span id="la">${amp} m</span></label>
<input type="range" id="sa" min="0.2" max="2" step="0.1" value="${amp}">
</div>
<div class="btns"><button id="bp">暂停</button><button id="br">重置</button></div>
<script>
const cv=document.getElementById('cv'),cx=cv.getContext('2d');
function rs(){cv.width=cv.offsetWidth*2;cv.height=560;cx.scale(2,2)}rs();
let K=${k},M=${m},AMP=${amp},t=0,paused=false;
const W=()=>cv.offsetWidth,H=()=>cv.offsetHeight;
function omega(){return Math.sqrt(K/M)}
function reset(){t=0}
document.getElementById('sk').oninput=e=>{K=+e.target.value;document.getElementById('lk').textContent=K+' N/m'};
document.getElementById('sm').oninput=e=>{M=+e.target.value;document.getElementById('lm').textContent=M+' kg'};
document.getElementById('sa').oninput=e=>{AMP=+e.target.value;document.getElementById('la').textContent=AMP+' m'};
document.getElementById('bp').onclick=e=>{paused=!paused;e.target.textContent=paused?'继续':'暂停'};
document.getElementById('br').onclick=reset;
let last=0;
function loop(ts){
const dt=Math.min((ts-last)/1000,0.05);last=ts;
if(!paused)t+=dt;
cx.clearRect(0,0,W(),H());
const x=AMP*Math.cos(omega()*t),F=-K*x;
const wallX=40,cy=H()/2;
const sc=Math.min((W()-120)/4/AMP,40);
const eqX=wallX+80;
const blockX=eqX+x*sc;
const f=omega()/(2*Math.PI);
cx.fillStyle='#0f3460';cx.fillRect(wallX-10,cy-40,10,80);
cx.strokeStyle='#e0e0e0';cx.lineWidth=2;
const coils=10,slen=blockX-wallX-20;
cx.beginPath();cx.moveTo(wallX,cy);
for(let i=0;i<coils;i++){const px=wallX+(i+0.5)*slen/coils;const py=cy+(i%2?12:-12);cx.lineTo(px,py)}
cx.lineTo(blockX-20,cy);cx.stroke();
cx.fillStyle='#64ffda';cx.fillRect(blockX-20,cy-20,40,40);
cx.strokeStyle='#64ffda88';cx.beginPath();cx.moveTo(eqX,cy-30);cx.lineTo(eqX,cy+30);cx.stroke();
document.getElementById('df').textContent=f.toFixed(2);
document.getElementById('dT').textContent=(1/f).toFixed(2);
document.getElementById('dx').textContent=x.toFixed(2);
document.getElementById('dF').textContent=F.toFixed(1);
requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
</script>
</body></html>`;
};
