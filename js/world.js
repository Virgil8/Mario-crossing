/* =====================================================
   world.js - Carte, tuiles, collisions, génération
   ===================================================== */

const SOLID_TILES = new Set(['water', 'pipe', 'brick', 'block']);

// Carte générée : tableau 2D de strings
let MAP = [];

// Arbres placés (x,y en tuiles) + état (peut être secoué)
let TREES = [];

// Cultures : { col, row, stage: 0-2, plantedAt: ms }
let CROPS = [];

function isSolidAt(col, row) {
  if (col < 0 || row < 0 || col >= COLS || row >= ROWS) return true;
  const t = MAP[row][col];
  if (SOLID_TILES.has(t)) return true;
  // Arbres bloquants
  if (TREES.some(tr => tr.col === col && tr.row === row)) return true;
  return false;
}

function tileAt(col, row) {
  if (col < 0 || row < 0 || col >= COLS || row >= ROWS) return 'grass';
  return MAP[row][col];
}

function setTile(col, row, t) {
  if (col < 0 || row < 0 || col >= COLS || row >= ROWS) return;
  MAP[row] = MAP[row].substring(0, col) + encodeTile(t) + MAP[row].substring(col + 1);
}

// Encodage 1 caractère par tuile pour stocker la carte
const TILE_CODES = {
  '.': 'grass', 'p': 'path', 'w': 'water', 'P': 'pipe',
  'b': 'brick', 'B': 'block', 'f': 'flower', 's': 'sand', 't': 'tilled'
};
const TILE_INV = Object.fromEntries(Object.entries(TILE_CODES).map(([k, v]) => [v, k]));
function decodeTile(c) { return TILE_CODES[c] || 'grass'; }
function encodeTile(n) { return TILE_INV[n] || '.'; }

function tileAtDecoded(col, row) {
  return decodeTile(tileAt(col, row));
}

// ---- Génération de la carte ----
function generateWorld() {
  MAP = [];
  TREES = [];
  CROPS = [];

  // Base : tout en herbe
  for (let r = 0; r < ROWS; r++) {
    let row = '';
    for (let c = 0; c < COLS; c++) row += '.';
    MAP.push(row);
  }

  // Étang central (pour la pêche) - cercle d'eau
  const pondCx = 10, pondCy = 18, pondR = 3;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const d = Math.hypot(c - pondCx, r - pondCy);
      if (d < pondR) setTile(c, r, 'water');
    }
  }

  // Plage/sable autour de l'étang
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const d = Math.hypot(c - pondCx, r - pondCy);
      if (d >= pondR && d < pondR + 1) setTile(c, r, 'sand');
    }
  }

  // Chemin principal en croix
  for (let c = 2; c < COLS - 2; c++) setTile(c, 14, 'path');
  for (let r = 2; r < ROWS - 2; r++) setTile(20, r, 'path');

  // Place centrale (clairière de chemin)
  for (let r = 12; r < 17; r++)
    for (let c = 18; c < 23; c++)
      setTile(c, r, 'path');

  // Village de tuyaux (zone boutique au nord)
  setTile(20, 5, 'pipe');
  setTile(21, 5, 'pipe');
  setTile(19, 5, 'pipe');
  // Briques décoratives
  setTile(18, 3, 'brick');
  setTile(22, 3, 'brick');
  setTile(20, 2, 'block');

  // Zone de ferme (sud-est) : terre labourée
  for (let r = 22; r < 26; r++)
    for (let c = 28; c < 34; c++)
      if ((r + c) % 2 === 0) setTile(c, r, 'tilled');

  // Fleurs aléatoires
  const rng = mulberry32(42);
  for (let i = 0; i < 40; i++) {
    const c = Math.floor(rng() * COLS);
    const r = Math.floor(rng() * ROWS);
    if (tileAtDecoded(c, r) === 'grass') setTile(c, r, 'flower');
  }

  // Arbres (hors chemins/eau/tuyaux)
  const treeSpots = [
    [3, 4], [5, 3], [8, 5], [12, 3], [16, 6],
    [26, 4], [30, 6], [34, 3], [37, 5], [35, 8],
    [3, 10], [5, 22], [7, 25], [12, 27], [4, 27],
    [25, 25], [30, 27], [36, 24], [34, 18], [37, 15],
    [2, 18], [4, 15], [16, 22], [15, 26], [28, 10]
  ];
  for (const [c, r] of treeSpots) {
    if (tileAtDecoded(c, r) === 'grass' || tileAtDecoded(c, r) === 'flower') {
      setTile(c, r, 'grass');
      TREES.push({ col: c, row: r, shaken: false, regrowAt: 0 });
    }
  }
}

// PRNG simple
function mulberry32(a) {
  return function() {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---- Rendu de la carte ----
function drawWorld(ctx, camX, camY, t) {
  // Tuiles visibles
  const startC = Math.max(0, Math.floor(camX / TILE));
  const endC   = Math.min(COLS, Math.ceil((camX + ctx.canvas.width) / TILE));
  const startR = Math.max(0, Math.floor(camY / TILE));
  const endR   = Math.min(ROWS, Math.ceil((camY + ctx.canvas.height) / TILE));

  for (let r = startR; r < endR; r++) {
    for (let c = startC; c < endC; c++) {
      drawTile(ctx, tileAtDecoded(c, r), c * TILE - camX, r * TILE - camY, t);
    }
  }

  // Plantes en cours
  for (const crop of CROPS) {
    drawPlant(ctx, crop.col * TILE - camX, crop.row * TILE - camY, crop.stage);
  }

  // Arbres (après les tuiles)
  for (const tr of TREES) {
    if (tr.shaken && t < tr.regrowAt) continue;
    const wob = tr.shakeUntil && t < tr.shakeUntil
      ? Math.sin(t / 40) * 2 : 0;
    drawTree(ctx, tr.col * TILE - camX + wob, tr.row * TILE - camY);
  }
}

// Interaction : secouer un arbre
function tryShakeTree(col, row, t) {
  const tr = TREES.find(x => x.col === col && x.row === row);
  if (!tr) return null;
  if (tr.shaken && t < tr.regrowAt) return null;
  tr.shakeUntil = t + 400;
  tr.shaken = true;
  tr.regrowAt = t + 45000; // 45s pour repousser
  // Drop aléatoire : pièce, champignon, bois
  const r = Math.random();
  if (r < 0.55) return 'coin';
  if (r < 0.85) return 'wood';
  return 'mushroom';
}

function findTreeAt(col, row) {
  return TREES.find(x => x.col === col && x.row === row);
}
