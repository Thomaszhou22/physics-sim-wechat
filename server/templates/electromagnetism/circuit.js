module.exports = function(params = {}) {
  const V = params.V || 12, R = params.R || 10;
  return `<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>简单电路</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#1a1a2e;color:#e0e0e0;font-family:system-ui;max-width:600px;margin:0 auto;padding:10px}
canvas{width:100%;height:300px;background:#16213e;border-radius:8px;display:block}
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
<h3 style="text-align:center;color:#64ffda;margin-bottom:8px">简单电路</h3>
<canvas id="cv"></canvas>
<div class="data">
<div>电压V:<span id="dV">${V}</span> V</div>
<div>电流I:<span id="dI">0</span> A</div>
<div>功率P:<span id="dP">0</span> W</div>
<div>电阻R:<span id="dR">${R}</span> Ω</div>
</div>
<div class="ctrl">
<label>电压 <span id="lV">${V} V</span></label>
<input type="range" id="sV" min="1" max="24" value="${V}">
<label>电阻 <span id="lR">${R} Ω</span></label>
<input type="range" id="sR" min="1" max="100" value="${R}">
</div>
<div class="btns"><button id="bp">暂停</button><button id="br">重置</button></div>
<script>
const cv=document.getElementById('cv'),cx=cv.getContext('2d');
function rs(){cv.width=cv.offsetWidth*2;cv.height=600;cx.scale(2,2)}rs();
let VOLT=${V},RES=${R},t=0,paused=false;
const W=()=>cv.offsetWidth,H=()=>cv.offsetHeight;
document.getElementById('sV').oninput=e=>{VOLT=+e.target.value;document.getElementById('lV').textContent=VOLT+' V';document.getElementById('dV').textContent=VOLT};
document.getElementById('sR').oninput=e=>{RES=+e.target.value;document.getElementById('lR').textContent=RES+' Ω';document.getElementById('dR').textContent=RES};
document.getElementById('bp').onclick=e=>{paused=!paused;e.target.textContent=paused?'继续':'暂停'};
document.getElementById('br').onclick=()=>{t=0};
let last=0;
function loop(ts){
const dt=Math.min((ts-last)/1000,0.05);last=ts;
if(!paused)t+=dt;
cx.clearRect(0,0,W(),H());
const I=VOLT/RES,P=VOLT*I;
const mx=60,my=40,MW=W()-120,MH=H()-80;
const x1=mx,y1=my,x2=mx+MW,y2=my,x3=mx+MW,y3=my+MH,x4=mx,y4=my+MH;
cx.strokeStyle='#e0e0e0';cx.lineWidth=3;
cx.beginPath();cx.moveTo(x1,y1);cx.lineTo(x2,y2);cx.lineTo(x3,y3);cx.lineTo(x4,y4);cx.closePath();cx.stroke();
cx.fillStyle='#0f3460';cx.fillRect(x1-18,y2-15,36,30);
cx.strokeStyle='#64ffda';cx.lineWidth=2;cx.strokeRect(x1-18,y2-15,36,30);
cx.fillStyle='#64ffda';cx.font='bold 14px system-ui';cx.textAlign='center';
cx.fillText(VOLT+'V',x1,y2+5);
cx.strokeStyle='#e94560';cx.lineWidth=4;
cx.beginPath();cx.moveTo(x3-25,y3-15);cx.lineTo(x3+25,y3+15);cx.moveTo(x3-25,y3+15);cx.lineTo(x3+25,y3-15);cx.stroke();
cx.fillStyle='#e94560';cx.font='12px system-ui';cx.fillText(RES+'Ω',x3+40,y3+5);
const speed=Math.min(I*5,15),nDots=12;
cx.fillStyle='#64ffda';
for(let i=0;i<nDots;i++){
const p=((i/nDots+t*speed)%1);
let px,py;
if(p<0.25){px=x1+(x2-x1)*p*4;py=y1}
else if(p<0.5){px=x2;py=y2+(y3-y2)*(p-0.25)*4}
else if(p<0.75){px=x3-(x3-x4)*(p-0.5)*4;py=y3}
else{px=x4;py=y4-(y4-y1)*(p-0.75)*4}
cx.beginPath();cx.arc(px,py,3,0,7);cx.fill();
}
cx.textAlign='left';
document.getElementById('dI').textContent=I.toFixed(2);
document.getElementById('dP').textContent=P.toFixed(1);
requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
</script>
</body></html>`;
};
