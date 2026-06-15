module.exports = function(params = {}) {
  const v0 = params.v0 || 50, angle = params.angle || 45, g = params.g || 9.8;
  return `<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>抛体运动</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#1a1a2e;color:#e0e0e0;font-family:system-ui;max-width:600px;margin:0 auto;padding:10px}
canvas{width:100%;height:300px;background:#16213e;border-radius:8px;display:block}
.ctrl{display:flex;flex-direction:column;gap:8px;margin-top:10px}
label{display:flex;justify-content:space-between;font-size:14px;color:#64ffda}
input[type=range]{width:100%;height:44px;accent-color:#64ffda}
.btns{display:flex;gap:10px;margin-top:8px}
button{flex:1;height:44px;background:#0f3460;color:#e0e0e0;border:none;border-radius:6px;font-size:16px;cursor:pointer}
button:active{background:#1a4a80}
.data{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.data div{background:#0f3460;padding:4px 8px;border-radius:4px;font-size:12px}
</style>
</head>
<body>
<h3 style="text-align:center;color:#64ffda;margin-bottom:8px">抛体运动</h3>
<canvas id="cv"></canvas>
<div class="data">
<div>初速度V₀:<span id="dv0">${v0}</span> m/s</div>
<div>角度θ:<span id="da">${angle}</span>°</div>
<div>最大高度:<span id="dh">0</span> m</div>
<div>射程:<span id="dr">0</span> m</div>
<div>当前速度:<span id="dv">0</span> m/s</div>
</div>
<div class="ctrl">
<label>初速度 <span id="lv0">${v0} m/s</span></label>
<input type="range" id="sv0" min="10" max="100" value="${v0}">
<label>角度 <span id="la">${angle}°</span></label>
<input type="range" id="sa" min="0" max="90" value="${angle}">
<label>重力 <span id="lg">${g} m/s²</span></label>
<input type="range" id="sg" min="1" max="20" step="0.1" value="${g}">
</div>
<div class="btns"><button id="bpause">暂停</button><button id="breset">重置</button></div>
<script>
const cv=document.getElementById('cv'),cx=cv.getContext('2d');
function rs(){cv.width=cv.offsetWidth*2;cv.height=600;cx.scale(2,2)}
rs();window.addEventListener('resize',()=>{rs()});
let V0=${v0},ANG=${angle}*Math.PI/180,G=${g},t=0,paused=false,trail=[];
const W=()=>cv.offsetWidth,H=()=>cv.offsetHeight;
function maxR(){const vh=V0*Math.sin(ANG),T=2*vh/G;return V0*Math.cos(ANG)*T}
function maxH(){return Math.pow(V0*Math.sin(ANG),2)/(2*G)}
function scale(){const r=maxR()||1,h=maxH()||1;return Math.min((W()-40)/r,(H()-40)/h)}
function sim(){const T=2*V0*Math.sin(ANG)/G;return t%T}
function reset(){t=0;trail=[]}
document.getElementById('sv0').oninput=e=>{V0=+e.target.value;document.getElementById('lv0').textContent=V0+' m/s';document.getElementById('dv0').textContent=V0;reset()};
document.getElementById('sa').oninput=e=>{ANG=+e.target.value*Math.PI/180;document.getElementById('la').textContent=e.target.value+'°';document.getElementById('da').textContent=e.target.value;reset()};
document.getElementById('sg').oninput=e=>{G=+e.target.value;document.getElementById('lg').textContent=G+' m/s²';reset()};
document.getElementById('bpause').onclick=e=>{paused=!paused;e.target.textContent=paused?'继续':'暂停'};
document.getElementById('breset').onclick=reset;
let last=0;
function loop(ts){
if(!paused){const dt=(ts-last)/1000||0;t+=dt*0.5}
last=ts;
cx.clearRect(0,0,W(),H());
const s=scale(),x0=20,y0=H()-20;
const ts2=sim(),x=V0*Math.cos(ANG)*ts2,y=V0*Math.sin(ANG)*ts2-0.5*G*ts2*ts2;
const px=x0+x*s,py=y0-y*s;
if(!paused){trail.push([px,py]);if(trail.length>500)trail.shift()}
cx.strokeStyle='#64ffda33';cx.lineWidth=1;cx.beginPath();
trail.forEach((p,i)=>{i?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1])});cx.stroke();
const vy=V0*Math.sin(ANG)-G*ts2,vx=V0*Math.cos(ANG);
cx.strokeStyle='#64ffda';cx.lineWidth=2;cx.beginPath();cx.moveTo(px,py);cx.lineTo(px+vx*0.3*s,py-vy*0.3*s);cx.stroke();
cx.fillStyle='#64ffda';cx.beginPath();cx.arc(px,py,6,0,7);cx.fill();
document.getElementById('dh').textContent=maxH().toFixed(1);
document.getElementById('dr').textContent=maxR().toFixed(1);
document.getElementById('dv').textContent=Math.sqrt(vx*vx+vy*vy).toFixed(1);
requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
</script>
</body></html>`;
};
