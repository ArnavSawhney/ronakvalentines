const landingScreen = document.getElementById("landingScreen");
const puzzleScreen = document.getElementById("puzzleScreen");
const finalScreen = document.getElementById("finalScreen");
const noScreen = document.getElementById("noScreen");

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const backBtn = document.getElementById("backBtn");

const gridContainer = document.getElementById("gridContainer");
const undoBtn = document.getElementById("undoBtn");
const resetBtn = document.getElementById("resetBtn");

yesBtn.onclick = () => {
  landingScreen.classList.replace("active","hidden");
  puzzleScreen.classList.replace("hidden","active");
  initPuzzle();
};

noBtn.onclick = () => {
  landingScreen.classList.replace("active","hidden");
  noScreen.classList.replace("hidden","active");
};

backBtn.onclick = () => {
  noScreen.classList.replace("active","hidden");
  landingScreen.classList.replace("hidden","active");
};

/* ---------- PUZZLE CONFIG ---------- */
const GRID = 7;

const HEART_PATH = [
  7,14,21,22,29,36,37,44,45,38,39,32,33,
  26,27,20,13,12,11,18,17,16,9,8
];

const checkpoints = { 7:1, 21:2, 27:3, 16:4, 8:5 };
const START = 7;
const END = 8;
const MAX = 5;

const BLOCKED = [];
for (let i=0;i<49;i++) if (!HEART_PATH.includes(i)) BLOCKED.push(i);

let cells=[], path=[], dragging=false, nextExpected=1;

/* ---------- INIT ---------- */
function initPuzzle() {
  gridContainer.innerHTML="";
  cells=[]; path=[]; nextExpected=1;

  for (let i=0;i<49;i++) {
    const cell=document.createElement("div");
    cell.className="grid-cell";
    cell.dataset.index=i;

    if (BLOCKED.includes(i)) cell.classList.add("blocked");
    if (checkpoints[i]) cell.textContent=checkpoints[i];

    cell.onpointerdown=()=> {
      if (path.length===0 && i===START) {
        dragging=true; addCell(i);
      } else if (path[path.length-1]===i) dragging=true;
    };

    cell.onpointerenter=()=> {
      if (!dragging) return;
      const last=path[path.length-1];
      if (!adjacent(last,i)) return;
      if (path.includes(i)) return;
      if (BLOCKED.includes(i)) return;
      if (checkpoints[i] && checkpoints[i]!==nextExpected) return;
      addCell(i);
    };

    gridContainer.appendChild(cell);
    cells.push(cell);
  }

  document.onpointerup=()=>dragging=false;
}

/* ---------- CORE ---------- */
function addCell(i){
  path.push(i);
  cells[i].classList.add("path");
  if (checkpoints[i]) nextExpected++;

  if (nextExpected>MAX && i===END && isHeartFilled()) finish();
}

function isHeartFilled(){
  return HEART_PATH.every(i=>path.includes(i));
}

function adjacent(a,b){
  const r1=Math.floor(a/GRID), c1=a%GRID;
  const r2=Math.floor(b/GRID), c2=b%GRID;
  return Math.abs(r1-r2)+Math.abs(c1-c2)===1;
}

/* ---------- CONTROLS ---------- */
undoBtn.onclick=()=>{
  if (!path.length) return;
  const r=path.pop();
  cells[r].classList.remove("path","glow");
  if (checkpoints[r]) nextExpected--;
};

resetBtn.onclick=()=>{
  path.forEach(i=>cells[i].classList.remove("path","glow"));
  path=[]; nextExpected=1;
};

/* ---------- FINISH ---------- */
function finish(){
  cells.forEach(c=>c.classList.contains("path")&&c.classList.add("glow"));

  setTimeout(()=>{
    puzzleScreen.classList.replace("active","hidden");
    finalScreen.classList.replace("hidden","active");
    startFinalEffects();
  },1200);
}

function startFinalEffects(){
  const chime=document.getElementById("chime");
  chime.volume=0.4;
  chime.play().catch(()=>{});

  const hearts=document.querySelector(".hearts");
  for(let i=0;i<18;i++){
    const h=document.createElement("div");
    h.className="heart";
    h.textContent="💗";
    h.style.left=Math.random()*100+"%";
    h.style.animationDuration=6+Math.random()*6+"s";
    h.style.animationDelay=Math.random()*4+"s";
    hearts.appendChild(h);
  }
}
