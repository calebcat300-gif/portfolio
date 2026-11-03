import './style.css';

const $ = (s) => document.querySelector(s);
const app = $('#app');
const pause = (t) => new Promise((resolve) => setTimeout(resolve, t));
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const ASCII = String.raw`                 _                 _     _
  ___ _ __   __| | ___  _ __ _ __ | |__ (_)_ __  ___
 / _ \ '_ \ / _\` |/ _ \| '__| '_ \| '_ \| | '_ \/ __|
|  __/ | | | (_| | (_) | |  | |_) | | | | | | | \__ \
 \___|_| |_|\__,_|\___/|_|  | .__/|_| |_|_|_| |_|___/
                            |_|`;
const boot = [
  '[    0.000000] Linux version 6.x (builduser@linux)',
  '[    0.037014] x86/cpu: User Mode Instruction Prevention activated',
  '[    0.151081] clocksource: Switched to clocksource tsc',
  '[    0.323831] Freeing unused kernel image memory',
  '[    0.442813] Run /init as init process',
  '[    0.691642] systemd[1]: Detected architecture x86-64.',
  '[    0.755004] systemd[1]: Hostname set to <endorphins>.',
  '',
  '[  OK  ] Finished Load Kernel Modules.',
  '[  OK  ] Finished Remount Root and Kernel File Systems.',
  '[  OK  ] Reached target Local File Systems.',
  '[  OK  ] Started Journal Service.',
  '[  OK  ] Started D-Bus System Message Bus.',
  '[  OK  ] Started Network Manager.',
  '[  OK  ] Started Getty on tty1.',
  '[  OK  ] Reached target Login Prompts.',
  '[  OK  ] Reached target Multi-User System.',
  '', 'Linux (tty1)', '',
  'endorphins login: endorphins (automatic login)', '',
  'endorphins@endorphins ~ $ enter'
];
let introToken = 0;
let route = '/';
// Real fullscreen pixel wipe, fixed at 10 visual frames per second.
async function wipe(change = null) {
  if (reduced()) { change?.(); return; }
  const overlay = document.createElement('div');
  overlay.className = 'wipe';
  const c = document.createElement('canvas');
  const glow = document.createElement('canvas');
  const cell = 14;
  c.width = glow.width = Math.ceil(innerWidth / cell);
  c.height = glow.height = Math.ceil(innerHeight / cell);
  c.className = 'wipe-front'; glow.className = 'wipe-bloom';
  overlay.append(glow, c); document.body.append(overlay);
  const ctx = c.getContext('2d');
  const gctx = glow.getContext('2d');
  const hash = (x,y,t) => { const n = Math.sin(x*127.1+y*311.7+t*74.7)*43758.5453; return n-Math.floor(n); };
  async function draw(mode) {
    for (let frame=0; frame<=9; frame++) {
      ctx.clearRect(0,0,c.width,c.height); gctx.clearRect(0,0,c.width,c.height);
      for (let x=0; x<c.width; x++) {
        const edge = frame/9*(c.height+10)-5 + (hash(x,19,frame)-.5)*6;
        for (let y=0; y<c.height; y++) {
          if (mode==='close' ? y<=edge : y>=edge) {
            ctx.fillStyle='#050505';ctx.fillRect(x,y,1,1);
          }
          const n=hash(x,y,frame);
          if (Math.abs(y-edge)<4 && n>.54) {
            ctx.fillStyle=n>.92?'#f1f1f1':n>.78?'#929292':'#323232';
            ctx.fillRect(x,y,1,1);
            if(n>.92) {gctx.fillStyle='#fff';gctx.fillRect(x,y,1,1);}
          }
        }
      }
      await pause(100);
    }
  }
  try { if(change) { await draw('close');change(); } await draw('open'); }
  finally { overlay.remove(); }
}

async function pixelName() {
  const el=$('#ascii'); if (!el || reduced()) return;
  const r=el.getBoundingClientRect();
  const width=Math.ceil(r.width), height=Math.ceil(r.height);
  const source=document.createElement('canvas');source.width=width;source.height=height;
  const sc=source.getContext('2d'); const st=getComputedStyle(el);
  sc.font=`${st.fontSize} ${st.fontFamily}`;sc.fillStyle='#f4f4f4';sc.textBaseline='top';
  el.textContent.split('\n').forEach((l,i)=>sc.fillText(l,0,i*parseFloat(st.lineHeight)));
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;canvas.className='ascii-layer';
  el.parentNode.append(canvas); const ctx=canvas.getContext('2d');el.style.visibility='hidden';
  try { for(const block of [24,22,18,14,10,8,6,4,3,2,1]) {
    const mini=document.createElement('canvas');mini.width=Math.max(1,Math.ceil(width/block));mini.height=Math.max(1,Math.ceil(height/block));
    mini.getContext('2d').drawImage(source,0,0,mini.width,mini.height);
    ctx.clearRect(0,0,width,height);ctx.imageSmoothingEnabled=false;ctx.drawImage(mini,0,0,width,height);
    await pause(100);
  }} finally { canvas.remove();el.style.visibility='visible'; }
}

function identity() {
  app.innerHTML=`<main class="intro identity"><div class="ascii-box"><pre id="ascii"></pre></div><button class="continue" id="continue">continue ↵</button></main>`;
  $('#ascii').textContent=ASCII;
}
async function intro() {
  const token=++introToken;
  route='/';
  app.innerHTML=`<main class="intro boot"><pre id="bootlines"></pre></main>`;
  await wipe();
  for(const [i,line] of boot.entries()) {
    if(token!==introToken)return;
    const pre=$('#bootlines'); if(!pre)return;
    pre.textContent+=line+'\n';pre.scrollTop=pre.scrollHeight;
    await pause(i>18?230:100);
  }
  if(token!==introToken)return;
  await wipe(()=>{ if(token===introToken)identity(); });
  if(token!==introToken)return;
  await pixelName();
}

intro();


// endorphins-enter-wipe-hook
window.addEventListener("click", async (event) => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const button = target.closest("#continue");
    if (!button || button.hasAttribute("disabled")) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    button.setAttribute("disabled", "");

    try {
        await wipe(() => {
            sessionStorage.setItem("enter-wipe", "1");
            (window.__siteNavigateHome ? window.__siteNavigateHome() : window.location.assign("/home"));
        });
    } catch (error) {
        button.removeAttribute("disabled");
        console.error("enter wipe failed:", error);
    }
}, true);
