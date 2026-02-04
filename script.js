const landingScreen = document.getElementById("landingScreen");
const puzzleScreen = document.getElementById("puzzleScreen");
const finalScreen = document.getElementById("finalScreen");
const yesBtn = document.getElementById("yesBtn");

const gridContainer = document.getElementById("gridContainer");
const undoBtn = document.getElementById("undoBtn");
const resetBtn = document.getElementById("resetBtn");

const noBtn = document.querySelector(".btn.no");
const noScreen = document.getElementById("noScreen");
const backBtn = document.getElementById("backBtn");

yesBtn.onclick = () => {
  landingScreen.classList.remove("active");
  landingScreen.classList.add("hidden");
  puzzleScreen.classList.remove("hidden");
  puzzleScreen.classList.add("active");
  initPuzzle();
};

const GRID_SIZE = 7;

/* Sparse checkpoints (milestones only) */
const checkpoints = {
  7: 1,
  21: 2,
  27: 3,
  16: 4,
  8: 5
};

const START = 7;
const END = 8;
const MAX = 5;

/* Heart corridor */
const HEART_PATH = [
  7,14,21,22,29,36,37,44,45,38,39,32,33,
  26,27,20,13,12,11,18,17,16,9,8
];

const BLOCKED = [];
for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
  if (!HEART_PATH.includes(i)) BLOCKED.push(i);
}

let cells = [];
let path = [];
let dragging = false;
let nextExpected = 1;

/* ---------- INIT ---------- */
function initPuzzle() {
  gridContainer.innerHTML = "";
  cells = [];
  path = [];
  nextExpected = 1;

  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement("div");
    cell.className = "grid-cell";
    cell.dataset.index = i;

    if (BLOCKED.includes(i)) cell.classList.add("blocked");
    if (checkpoints[i]) cell.textContent = checkpoints[i];

    cell.onpointerdown = () => {
      if (path.length === 0 && i === START) {
        dragging = true;
        addCell(i);
      } else if (path[path.length - 1] === i) {
        dragging = true;
      }
    };

    cell.onpointerenter = () => {
      if (!dragging) return;
      const last = path[path.length - 1];
      if (!adjacent(last, i)) return;
      if (path.includes(i)) return;
      if (BLOCKED.includes(i)) return;
      if (checkpoints[i] && checkpoints[i] !== nextExpected) return;
      addCell(i);
    };

    gridContainer.appendChild(cell);
    cells.push(cell);
  }

  document.onpointerup = () => dragging = false;
}

/* ---------- CORE ---------- */
function addCell(i) {
  path.push(i);
  cells[i].classList.add("path");

  if (checkpoints[i]) nextExpected++;

  if (nextExpected > MAX && i === END && isHeartFullyFilled()) {
    finish();
  }
}

function isHeartFullyFilled() {
  return HEART_PATH.every(idx => path.includes(idx));
}

function adjacent(a, b) {
  const r1 = Math.floor(a / GRID_SIZE), c1 = a % GRID_SIZE;
  const r2 = Math.floor(b / GRID_SIZE), c2 = b % GRID_SIZE;
  return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
}

/* ---------- UNDO / RESET ---------- */
undoBtn.onclick = () => {
  if (path.length === 0) return;
  const removed = path.pop();
  cells[removed].classList.remove("path", "glow");
  if (checkpoints[removed]) nextExpected--;
};

resetBtn.onclick = () => {
  path.forEach(i => cells[i].classList.remove("path", "glow"));
  path = [];
  nextExpected = 1;
};

/* ---------- FINISH ---------- */
function finish() {
  cells.forEach(c => {
    if (c.classList.contains("path")) c.classList.add("glow");
  });

  setTimeout(() => {
  puzzleScreen.classList.remove("active");
  puzzleScreen.classList.add("hidden");

  finalScreen.classList.remove("hidden");
  finalScreen.classList.add("active");

  startFinalEffects();
}, 1200);
}

noBtn.onclick = () => {
  landingScreen.classList.remove("active");
  landingScreen.classList.add("hidden");

  noScreen.classList.remove("hidden");
  noScreen.classList.add("active");
};

backBtn.onclick = () => {
  noScreen.classList.remove("active");
  noScreen.classList.add("hidden");

  landingScreen.classList.remove("hidden");
  landingScreen.classList.add("active");
};

function startFinalEffects() {
  const heartsContainer = document.querySelector(".hearts");
  const chime = document.getElementById("chime");

  // play sound once
  if (chime) {
    chime.volume = 0.4;
    chime.play().catch(() => {});
  }

  // generate floating hearts
  for (let i = 0; i < 18; i++) {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = "💗";
    heart.style.left = Math.random() * 100 + "%";
    heart.style.animationDuration = 6 + Math.random() * 6 + "s";
    heart.style.animationDelay = Math.random() * 4 + "s";
    heartsContainer.appendChild(heart);
  }
}


