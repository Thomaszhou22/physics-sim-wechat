module.exports = function(params = {}) {
  const h = params.h || 50, g = params.g || 9.8;
  return `<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>自由落体</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#1a1a2e;color:#e0e0e0;font-family:system-ui;max-width:600px;margin:0 auto;padding:10px}
canvas{width:100%;height:340px;background:#16213e;border-radius:8px;display:block}
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
<h3 style="text-align:center;color:#64ffda;margin-bottom:8px">自由落体</h3>
<canvas id="cv"></canvas>
<div class="data">
<div>当前速度:<span id="dv">0</span> m/s</div>
<div>下落距离:<span id="dd">0</span> m</div>
<div>剩余时间:<span id="dt">0</span> s</div>
<div>总时间:<span id="dtotal">0</span> s</div>
</div>
<div class="ctrl">
<label>初始高度 <span id="lh">${h} m</span></label>
<input type="range" id="sh" min="1" max="100" value="${h}">
<label>重力 <span id="lg">${g} m/s²</span></label>
<input type="range" id="sg" min="1" max="20" step="0.1" value="${g}">
</div>
<div class="btns"><button id="bp">暂停</button><button id="br">重置</button></div>
<script>
const cv=document.getElementById('cv'),cx=cv.getContext('2d');
function rs(){cv.width=cv.offsetWidth*2;cv.height=680;cx.scale(2,2)}rs();
let H=${h},G=${g},v=0,y=0,paused=false;
const W=()=>cv.offsetWidth,H2=()=>cv.offsetHeight;
function totalTime(){return Math.sqrt(2*H/G)}
function reset(){v=0;y=0}
document.getElementById('sh').oninput=e=>{H=+e.target.value;document.getElementById('lh').textContent=H+' m';reset()};
document.getElementById('sg').oninput=e=>{G=+e.target.value;document.getElementById('lg').textContent=G+' m/s²';reset()};
document.getElementById('bp').onclick=e=>{paused=!paused;e.target.textContent=paused?'继续':'暂停'};
document.getElementById('br').onclick=reset;
let last=0;
function loop(ts){
const dt=Math.min((ts-last)/1000,0.05);last=ts;
if(!paused&&y<H){v+=G*dt;y+=v*dt;if(y>H)y=H}
cx.clearRect(0,0,W(),H2());
const ballX=W()/2,sc=(H2()-60)/H;
const ballY=30+y*sc;
cx.strokeStyle='#333';cx.lineWidth=1;
for(let i=0;i<=H;i+=Math.max(1,Math.round(H/10))){
const ly=30+i*sc;
cx.beginPath();cx.moveTo(20,ly);cx.lineTo(40,ly);cx.stroke();
cx.fillStyle='#888';cx.font='10px system-ui';cx.fillText(i+'m',5,ly+3);
}
cx.fillStyle='#64ffda';cx.beginPath();cx.arc(ballX,ballY,12,0,7);cx.fill();
cx.strokeStyle='#64ffda44';cx.beginPath();cx.arc(ballX,ballY,20,0,7);cx.stroke();
const remain=Math.max(0,totalTime()-Math.sqrt(2*y/G));
document.getElementById('dv').textContent=v.toFixed(1);
document.getElementById('dd').textContent=y.toFixed(1);
document.getElementById('dt').textContent=remain.toFixed(2);
document.getElementById('dtotal').textContent=totalTime().toFixed(2);
requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
</script>
</body></html>`;
};
