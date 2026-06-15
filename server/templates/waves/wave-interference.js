module.exports = function(params = {}) {
  const freq = params.freq || 2, amp = params.amp || 20, sep = params.sep || 80;
  return `<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>波的干涉</title>
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
<h3 style="text-align:center;color:#64ffda;margin-bottom:8px">波的干涉</h3>
<canvas id="cv"></canvas>
<div class="data">
<div>频率:<span id="dF">${freq}</span> Hz</div>
<div>波长λ:<span id="dL">0</span></div>
<div>波源间距:<span id="dS">${sep}</span></div>
</div>
<div class="ctrl">
<label>频率 <span id="lF">${freq} Hz</span></label>
<input type="range" id="sF" min="0.5" max="5" step="0.1" value="${freq}">
<label>振幅 <span id="lA">${amp}</span></label>
<input type="range" id="sA" min="5" max="40" value="${amp}">
<label>波源间距 <span id="lS">${sep}</span></label>
<input type="range" id="sS" min="30" max="150" value="${sep}">
</div>
<div class="btns"><button id="bp">暂停</button><button id="br">重置</button></div>
<script>
const cv=document.getElementById('cv'),cx=cv.getContext('2d');
function rs(){cv.width=cv.offsetWidth*2;cv.height=600;cx.scale(2,2)}rs();
let F=${freq},AMP=${amp},SEP=${sep},t=0,paused=false;
const W=()=>cv.offsetWidth,H=()=>cv.offsetHeight;
document.getElementById('sF').oninput=e=>{F=+e.target.value;document.getElementById('lF').textContent=F+' Hz';document.getElementById('dF').textContent=F};
document.getElementById('sA').oninput=e=>{AMP=+e.target.value;document.getElementById('lA').textContent=AMP};
document.getElementById('sS').oninput=e=>{SEP=+e.target.value;document.getElementById('lS').textContent=SEP;document.getElementById('dS').textContent=SEP};
document.getElementById('bp').onclick=e=>{paused=!paused;e.target.textContent=paused?'继续':'暂停'};
document.getElementById('br').onclick=()=>{t=0};
let last=0;
function loop(ts){
const dt=Math.min((ts-last)/1000,0.05);last=ts;
if(!paused)t+=dt;
const w=2*Math.PI*F;
const wavelength=340/F;
document.getElementById('dL').textContent=wavelength.toFixed(0);
const s1x=W()/2-SEP/2,s2x=W()/2+SEP/2,sy=H()/2;
const cellSize=6;
for(let px=0;px<W();px+=cellSize){
for(let py=0;py<H();py+=cellSize){
const d1=Math.sqrt((px-s1x)**2+(py-sy)**2);
const d2=Math.sqrt((px-s2x)**2+(py-sy)**2);
const v1=AMP*Math.sin(w*t-2*Math.PI*d1/40);
const v2=AMP*Math.sin(w*t-2*Math.PI*d2/40);
const sum=(v1+v2)/(2*AMP);
const intensity=(sum+1)/2;
const r=Math.round(intensity*100),g=Math.round(intensity*255),b=Math.round(intensity*220);
cx.fillStyle='rgb('+r+','+g+','+b+')';
cx.fillRect(px,py,cellSize,cellSize);
}
}
cx.fillStyle='#64ffda';cx.beginPath();cx.arc(s1x,sy,4,0,7);cx.fill();
cx.beginPath();cx.arc(s2x,sy,4,0,7);cx.fill();
requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
</script>
</body></html>`;
};
