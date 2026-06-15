module.exports = function(params = {}) {
  const L = params.L || 1.5, g = params.g || 9.8, ang0 = params.ang0 || 45;
  return `<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>单摆</title>
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
<h3 style="text-align:center;color:#64ffda;margin-bottom:8px">单摆</h3>
<canvas id="cv"></canvas>
<div class="data">
<div>周期T:<span id="dT">0</span> s</div>
<div>当前角度:<span id="dA">0</span>°</div>
<div>角速度:<span id="dW">0</span> rad/s</div>
</div>
<div class="ctrl">
<label>摆长 <span id="lL">${L} m</span></label>
<input type="range" id="sL" min="0.5" max="3" step="0.1" value="${L}">
<label>重力 <span id="lg">${g} m/s²</span></label>
<input type="range" id="sg" min="1" max="20" step="0.1" value="${g}">
<label>初始角度 <span id="lA">${ang0}°</span></label>
<input type="range" id="sA" min="0" max="90" value="${ang0}">
</div>
<div class="btns"><button id="bp">暂停</button><button id="br">重置</button></div>
<script>
const cv=document.getElementById('cv'),cx=cv.getContext('2d');
function rs(){cv.width=cv.offsetWidth*2;cv.height=640;cx.scale(2,2)}rs();
let L=${L},G=${g},A0=${ang0}*Math.PI/180,theta=A0,omega=0,paused=false;
const W=()=>cv.offsetWidth,H=()=>cv.offsetHeight;
function period(){return 2*Math.PI*Math.sqrt(L/G)}
function reset(){theta=A0;omega=0}
document.getElementById('sL').oninput=e=>{L=+e.target.value;document.getElementById('lL').textContent=L+' m';reset()};
document.getElementById('sg').oninput=e=>{G=+e.target.value;document.getElementById('lg').textContent=G+' m/s²';reset()};
document.getElementById('sA').oninput=e=>{A0=+e.target.value*Math.PI/180;document.getElementById('lA').textContent=e.target.value+'°';reset()};
document.getElementById('bp').onclick=e=>{paused=!paused;e.target.textContent=paused?'继续':'暂停'};
document.getElementById('br').onclick=reset;
let last=0;
function loop(ts){
const dt=Math.min((ts-last)/1000,0.05);last=ts;
if(!paused){const acc=-G/L*Math.sin(theta);omega+=acc*dt;theta+=omega*dt}
cx.clearRect(0,0,W(),H());
const cx0=W()/2,cy0=40,sc=Math.min((H()-80)/3.5,(W()-40)/6);
const px=cx0+L*sc*Math.sin(theta),py=cy0+L*sc*Math.cos(theta);
cx.strokeStyle='#e0e0e0';cx.lineWidth=2;cx.beginPath();cx.moveTo(cx0,cy0);cx.lineTo(px,py);cx.stroke();
cx.fillStyle='#e0e0e044';cx.beginPath();cx.arc(cx0,cy0,5,0,7);cx.fill();
cx.strokeStyle='#64ffda';cx.beginPath();cx.moveTo(cx0-20,cy0);cx.lineTo(cx0+20,cy0);cx.stroke();
cx.fillStyle='#64ffda';cx.beginPath();cx.arc(px,py,14,0,7);cx.fill();
cx.strokeStyle='#64ffda44';cx.beginPath();cx.arc(cx0,cy0,L*sc,Math.PI/2-theta-0.3,Math.PI/2-theta+0.3);cx.stroke();
document.getElementById('dT').textContent=period().toFixed(2);
document.getElementById('dA').textContent=(theta*180/Math.PI).toFixed(1);
document.getElementById('dW').textContent=omega.toFixed(3);
requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
</script>
</body></html>`;
};
