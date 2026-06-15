module.exports = function(params = {}) {
  const u = params.u || 30, f = params.f || 15;
  return `<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>透镜成像</title>
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
<h3 style="text-align:center;color:#64ffda;margin-bottom:8px">透镜成像</h3>
<canvas id="cv"></canvas>
<div class="data">
<div>物距u:<span id="du">${u}</span> cm</div>
<div>像距v:<span id="dv">0</span> cm</div>
<div>放大率m:<span id="dm">0</span>×</div>
<div>像的性质:<span id="dp">-</span></div>
</div>
<div class="ctrl">
<label>物距 <span id="lu">${u} cm</span></label>
<input type="range" id="su" min="5" max="50" value="${u}">
<label>焦距 <span id="lf">${f} cm</span></label>
<input type="range" id="sf" min="5" max="30" value="${f}">
</div>
<div class="btns"><button id="bp">暂停</button><button id="br">重置</button></div>
<script>
const cv=document.getElementById('cv'),cx=cv.getContext('2d');
function rs(){cv.width=cv.offsetWidth*2;cv.height=640;cx.scale(2,2)}rs();
let U=${u},F=${f},t=0,paused=false;
const W=()=>cv.offsetWidth,H=()=>cv.offsetHeight;
document.getElementById('su').oninput=e=>{U=+e.target.value;document.getElementById('lu').textContent=U+' cm';document.getElementById('du').textContent=U};
document.getElementById('sf').oninput=e=>{F=+e.target.value;document.getElementById('lf').textContent=F+' cm'};
document.getElementById('bp').onclick=e=>{paused=!paused;e.target.textContent=paused?'继续':'暂停'};
document.getElementById('br').onclick=()=>{t=0};
let last=0;
function loop(ts){
const dt=Math.min((ts-last)/1000,0.05);last=ts;
if(!paused)t+=dt;
cx.clearRect(0,0,W(),H());
const axisY=H()/2,lensX=W()*0.5,scale=3;
const fPx=F*scale,uPx=U*scale;
let vPx=0,real=true,m=0;
if(U>F){vPx=(F*U)/(U-F)*scale;real=true;m=-vPx/uPx}
else{vPx=-(F*U)/(F-U)*scale;real=false;m=-vPx/uPx}
const objH=30;
cx.strokeStyle='#555';cx.lineWidth=1;cx.beginPath();cx.moveTo(0,axisY);cx.lineTo(W(),axisY);cx.stroke();
cx.strokeStyle='#888';cx.setLineDash([4,4]);
cx.beginPath();cx.moveTo(lensX-fPx,0);cx.lineTo(lensX-fPx,H());
cx.moveTo(lensX+fPx,0);cx.lineTo(lensX+fPx,H());cx.stroke();cx.setLineDash([]);
cx.strokeStyle='#64ffda';cx.lineWidth=3;
cx.beginPath();cx.moveTo(lensX,axisY-50);cx.lineTo(lensX,axisY+50);cx.stroke();
cx.strokeStyle='#e94560';cx.lineWidth=2;
cx.beginPath();cx.moveTo(lensX-uPx,axisY);cx.lineTo(lensX-uPx,axisY-objH);cx.stroke();
cx.fillStyle='#e94560';cx.fillRect(lensX-uPx-8,axisY-objH,16,objH);
cx.lineWidth=1.5;
const imgH=objH*m;
cx.strokeStyle='#64ffda';
cx.beginPath();cx.moveTo(lensX-uPx,axisY-objH);cx.lineTo(lensX+50,axisY-objH);cx.lineTo(lensX,axisY);cx.stroke();
cx.beginPath();cx.moveTo(lensX-uPx,axisY-objH);cx.lineTo(lensX+50,axisY);cx.stroke();
cx.beginPath();cx.moveTo(lensX-uPx,axisY-objH);cx.lineTo(lensX,axisY-objH);cx.lineTo(lensX+Math.abs(vPx)*Math.sign(m),axisY-imgH);cx.stroke();
if(real){
cx.fillStyle='#64ffda88';cx.fillRect(lensX+vPx-8,axisY-Math.abs(imgH)*(imgH<0?0:1),16,Math.abs(imgH));
cx.strokeStyle='#64ffda';cx.beginPath();cx.moveTo(lensX,axisY);cx.lineTo(lensX+vPx,axisY-imgH);cx.stroke();
}else{
cx.setLineDash([3,3]);
cx.strokeStyle='#64ffda88';
cx.beginPath();cx.moveTo(lensX,axisY);cx.lineTo(lensX+vPx,axisY-imgH);cx.stroke();
cx.setLineDash([]);
}
document.getElementById('dv').textContent=(vPx/scale).toFixed(1);
document.getElementById('dm').textContent=Math.abs(m).toFixed(2);
let prop='';
if(U>F){prop=Math.abs(m)>1?'实像 倒立 放大':'实像 倒立 缩小'}
else{prop='虚像 正立 放大'}
document.getElementById('dp').textContent=prop;
requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
</script>
</body></html>`;
};
