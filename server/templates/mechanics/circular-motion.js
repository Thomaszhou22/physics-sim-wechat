module.exports = function(params = {}) {
  const r = params.r || 5, omega = params.omega || 2, mass = params.mass || 1;
  return `<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>圆周运动</title>
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
<h3 style="text-align:center;color:#64ffda;margin-bottom:8px">圆周运动</h3>
<canvas id="cv"></canvas>
<div class="data">
<div>线速度v:<span id="dv">0</span> m/s</div>
<div>向心加速度:<span id="da">0</span> m/s²</div>
<div>向心力F:<span id="dF">0</span> N</div>
<div>周期T:<span id="dT">0</span> s</div>
</div>
<div class="ctrl">
<label>半径 <span id="lr">${r} m</span></label>
<input type="range" id="sr" min="1" max="10" step="0.5" value="${r}">
<label>角速度 <span id="lw">${omega} rad/s</span></label>
<input type="range" id="sw" min="0.5" max="5" step="0.1" value="${omega}">
<label>质量 <span id="lm">${mass} kg</span></label>
<input type="range" id="sm" min="0.5" max="10" step="0.5" value="${mass}">
</div>
<div class="btns"><button id="bp">暂停</button><button id="br">重置</button></div>
<script>
const cv=document.getElementById('cv'),cx=cv.getContext('2d');
function rs(){cv.width=cv.offsetWidth*2;cv.height=640;cx.scale(2,2)}rs();
let R=${r},W_OMEGA=${omega},MASS=${mass},theta=0,paused=false;
const W=()=>cv.offsetWidth,H=()=>cv.offsetHeight;
function reset(){theta=0}
document.getElementById('sr').oninput=e=>{R=+e.target.value;document.getElementById('lr').textContent=R+' m'};
document.getElementById('sw').oninput=e=>{W_OMEGA=+e.target.value;document.getElementById('lw').textContent=W_OMEGA+' rad/s'};
document.getElementById('sm').oninput=e=>{MASS=+e.target.value;document.getElementById('lm').textContent=MASS+' kg'};
document.getElementById('bp').onclick=e=>{paused=!paused;e.target.textContent=paused?'继续':'暂停'};
document.getElementById('br').onclick=reset;
let last=0;
function loop(ts){
const dt=Math.min((ts-last)/1000,0.05);last=ts;
if(!paused)theta+=W_OMEGA*dt;
cx.clearRect(0,0,W(),H());
const cx0=W()/2,cy0=H()/2;
const sc=Math.min(W(),H())/2/(12);
const radius=R*sc;
cx.strokeStyle='#333';cx.lineWidth=1;cx.setLineDash([3,3]);
cx.beginPath();cx.arc(cx0,cy0,radius,0,7);cx.stroke();cx.setLineDash([]);
const bx=cx0+radius*Math.cos(theta),by=cy0+radius*Math.sin(theta);
cx.strokeStyle='#555';cx.lineWidth=1;cx.beginPath();cx.moveTo(cx0,cy0);cx.lineTo(bx,by);cx.stroke();
cx.fillStyle='#64ffda';cx.beginPath();cx.arc(bx,by,10,0,7);cx.fill();
const v=W_OMEGA*R,ac=W_OMEGA*W_OMEGA*R,F=MASS*ac;
const arrowLen=Math.min(40,F*2+10);
const dx=(cx0-bx)/radius*arrowLen,dy=(cy0-by)/radius*arrowLen;
cx.strokeStyle='#e94560';cx.lineWidth=2.5;
cx.beginPath();cx.moveTo(bx,by);cx.lineTo(bx+dx,by+dy);cx.stroke();
const ang=Math.atan2(dy,dx);
cx.beginPath();cx.moveTo(bx+dx,by+dy);
cx.lineTo(bx+dx-6*Math.cos(ang-0.4),by+dy-6*Math.sin(ang-0.4));
cx.moveTo(bx+dx,by+dy);
cx.lineTo(bx+dx-6*Math.cos(ang+0.4),by+dy-6*Math.sin(ang+0.4));cx.stroke();
cx.fillStyle='#e94560';cx.font='11px system-ui';
cx.fillText('F',bx+dx+5,by+dy);
cx.fillStyle='#e0e0e0';cx.beginPath();cx.arc(cx0,cy0,3,0,7);cx.fill();
document.getElementById('dv').textContent=v.toFixed(1);
document.getElementById('da').textContent=ac.toFixed(1);
document.getElementById('dF').textContent=F.toFixed(1);
document.getElementById('dT').textContent=(2*Math.PI/W_OMEGA).toFixed(2);
requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
</script>
</body></html>`;
};
