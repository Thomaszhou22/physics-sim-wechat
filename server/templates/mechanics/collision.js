module.exports = function(params = {}) {
  const m1 = params.m1 || 2, v1 = params.v1 || 5, m2 = params.m2 || 3, v2 = params.v2 || -2;
  return `<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>碰撞</title>
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
.mode{display:flex;gap:10px;margin-top:8px}
.mode button{background:#0f3460}
.mode button.active{background:#64ffda;color:#1a1a2e}
</style>
</head>
<body>
<h3 style="text-align:center;color:#64ffda;margin-bottom:8px">碰撞</h3>
<canvas id="cv"></canvas>
<div class="data">
<div>球1动量:<span id="dp1">0</span></div>
<div>球2动量:<span id="dp2">0</span></div>
<div>总动量:<span id="dpT">0</span></div>
<div>总动能:<span id="dE">0</span></div>
</div>
<div class="mode">
<button id="belastic" class="active">弹性碰撞</button>
<button id="binelastic">完全非弹性</button>
</div>
<div class="ctrl">
<label>球1质量 <span id="lm1">${m1} kg</span></label>
<input type="range" id="sm1" min="0.5" max="10" step="0.5" value="${m1}">
<label>球1速度 <span id="lv1">${v1} m/s</span></label>
<input type="range" id="sv1" min="-10" max="10" step="0.5" value="${v1}">
<label>球2质量 <span id="lm2">${m2} kg</span></label>
<input type="range" id="sm2" min="0.5" max="10" step="0.5" value="${m2}">
<label>球2速度 <span id="lv2">${v2} m/s</span></label>
<input type="range" id="sv2" min="-10" max="10" step="0.5" value="${v2}">
</div>
<div class="btns"><button id="bp">暂停</button><button id="br">重置</button></div>
<script>
const cv=document.getElementById('cv'),cx=cv.getContext('2d');
function rs(){cv.width=cv.offsetWidth*2;cv.height=560;cx.scale(2,2)}rs();
let M1=${m1},V1=${v1},M2=${m2},V2=${v2};
let x1,x2,v1c,v2c,elastic=true,paused=false;
const W=()=>cv.offsetWidth,H=()=>cv.offsetHeight;
function reset(){x1=W()*0.2;x2=W()*0.7;v1c=V1;v2c=V2}
reset();
document.getElementById('sm1').oninput=e=>{M1=+e.target.value;document.getElementById('lm1').textContent=M1+' kg';reset()};
document.getElementById('sv1').oninput=e=>{V1=+e.target.value;document.getElementById('lv1').textContent=V1+' m/s';reset()};
document.getElementById('sm2').oninput=e=>{M2=+e.target.value;document.getElementById('lm2').textContent=M2+' kg';reset()};
document.getElementById('sv2').oninput=e=>{V2=+e.target.value;document.getElementById('lv2').textContent=V2+' m/s';reset()};
document.getElementById('belastic').onclick=e=>{elastic=true;e.target.classList.add('active');document.getElementById('binelastic').classList.remove('active');reset()};
document.getElementById('binelastic').onclick=e=>{elastic=false;e.target.classList.add('active');document.getElementById('belastic').classList.remove('active');reset()};
document.getElementById('bp').onclick=e=>{paused=!paused;e.target.textContent=paused?'继续':'暂停'};
document.getElementById('br').onclick=reset;
let last=0;
function collide(){
const r1=10+M1*2,r2=10+M2*2;
if(Math.abs(x1-x2)<(r1+r2)){
if(elastic){const u1=v1c,u2=v2c;v1c=((M1-M2)*u1+2*M2*u2)/(M1+M2);v2c=((M2-M1)*u2+2*M1*u1)/(M1+M2)}
else{const vc=(M1*v1c+M2*v2c)/(M1+M2);v1c=vc;v2c=vc}
x1+=v1c*0.01*5;x2+=v2c*0.01*5;
}
}
function loop(ts){
const dt=Math.min((ts-last)/1000,0.05);last=ts;
if(!paused){x1+=v1c*dt*20;x2+=v2c*dt*20;collide();
if(x1<0||x1>W())v1c*=-1;if(x2<0||x2>W())v2c*=-1;}
cx.clearRect(0,0,W(),H());
const r1=10+M1*2,r2=10+M2*2,cy=H()/2;
cx.fillStyle='#64ffda';cx.beginPath();cx.arc(x1,cy,r1,0,7);cx.fill();
cx.fillStyle='#e94560';cx.beginPath();cx.arc(x2,cy,r2,0,7);cx.fill();
cx.fillStyle='#e0e0e0';cx.font='12px system-ui';
cx.fillText(M1+'kg',x1-12,cy+r1+18);cx.fillText(M2+'kg',x2-12,cy+r2+18);
const p1=M1*v1c,p2=M2*v2c;
document.getElementById('dp1').textContent=p1.toFixed(1);
document.getElementById('dp2').textContent=p2.toFixed(1);
document.getElementById('dpT').textContent=(p1+p2).toFixed(1);
document.getElementById('dE').textContent=(0.5*M1*v1c*v1c+0.5*M2*v2c*v2c).toFixed(1);
requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
</script>
</body></html>`;
};
