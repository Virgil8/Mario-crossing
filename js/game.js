/* =====================================================
   game.js - Boucle principale, contrôles, outils, save
   ===================================================== */

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// ---- État global ----
const state = {
  coins: 0,
  energy: 100,
  gameMinutes: 8 * 60, // 8h du matin
  day: 1,
  tool: 0,
  paused: false,
  running: false,
  lastTime: 0,
};

// ---- Outils ----
const TOOLS = [
  { id: 'none',    name: 'Aucun',         key: '1' },
  { id: 'shovel',  name: 'Pelle',         key: '2' },
  { id: 'net',     name: 'Épuisette',     key: '3' },
  { id: 'rod',     name: 'Canne à pêche', key: '4' },
  { id: 'can',     name: 'Arrosoir',      key: '5' },
];

// ---- Input ----
const input = { up: false, down: false, left: false, right: false, run: false };
const keyMap = {
  'ArrowUp': 'up', 'z': 'up', 'w': 'up', 'Z': 'up', 'W': 'up',
  'ArrowDown': 'down', 's': 'down', 'S': 'down',
  'ArrowLeft': 'left', 'q': 'left', 'a': 'left', 'Q': 'left', 'A': 'left',
  'ArrowRight': 'right', 'd': 'right', 'D': 'right',
  'Shift': 'run',
};

document.addEventListener('keydown', e => {
  if (keyMap[e.key] !== undefined) { input[keyMap[e.key]] = true; e.preventDefault(); }

  if (e.key === ' ' || e.key === 'e' || e.key === 'E' || e.key === 'Enter') {
    handleAction();
    e.preventDefault();
  }
  if (e.key === 'i' || e.key === 'I') {
    toggleInventory();
    e.preventDefault();
  }
  if (e.key >= '1' && e.key <= '5') {
    state.tool = parseInt(e.key) - 1;
    updateHUD();
    showToast(`Outil : ${TOOLS[state.tool].name}`);
  }
  if (e.key === 'Escape') {
    closeShop();
    document.getElementById('inventory').classList.add('hidden');
  }
});
document.addEventListener('keyup', e => {
  if (keyMap[e.key] !== undefined) { input[keyMap[e.key]] = false; }
});

function toggleInventory() {
  const inv = document.getElementById('inventory');
  if (inv.classList.contains('hidden')) {
    renderInventory();
    inv.classList.remove('hidden');
    state.paused = true;
  } else {
    inv.classList.add('hidden');
    state.paused = false;
  }
}

// =====================================================
// Actions contextuelles (Espace / E)
// =====================================================
function handleAction() {
  // Prioriser : fermer dialogue -> parler PNJ -> utiliser outil
  if (currentDialog) { advanceDialog(); return; }
  if (state.paused) return;

  const npc = findNearbyNPC();
  if (npc) { startDialog(npc); return; }

  const ft = getFacingTile();
  const tile = tileAtDecoded(ft.col, ft.row);
  const tool = TOOLS[state.tool].id;
  const t = performance.now();

  // --- Arbre devant soi ---
  const tree = findTreeAt(ft.col, ft.row);
  if (tree) {
    const dropped = tryShakeTree(ft.col, ft.row, t);
    if (dropped) {
      addDrop(dropped, ft.col, ft.row + 1 <= ROWS - 1 && !isSolidAt(ft.col, ft.row + 1) ? ft.row + 1 : ft.row);
      showToast("Tu secoues l'arbre...");
    } else {
      showToast("Cet arbre est déjà secoué");
    }
    return;
  }

  // --- Utilisation des outils ---
  if (tool === 'shovel') {
    if (tile === 'grass' || tile === 'flower') {
      setTile(ft.col, ft.row, 'tilled');
      showToast("Terre labourée");
      // 20% chance de trouver un objet
      if (Math.random() < 0.2) {
        const loot = Math.random() < 0.5 ? 'coin' : 'seed';
        addDrop(loot, ft.col, ft.row);
      }
    } else if (tile === 'tilled') {
      setTile(ft.col, ft.row, 'grass');
      // retire la culture si présente
      const ci = CROPS.findIndex(c => c.col === ft.col && c.row === ft.row);
      if (ci >= 0) CROPS.splice(ci, 1);
    } else {
      showToast("Impossible de creuser ici");
    }
    return;
  }

  if (tool === 'net') {
    // Attrape un "papillon" aléatoirement dans l'herbe/fleurs
    if (tile === 'grass' || tile === 'flower') {
      if (Math.random() < 0.45) {
        addToInventory('bug', 1);
      } else {
        showToast("Rien à attraper...");
      }
    }
    return;
  }

  if (tool === 'rod') {
    if (tile === 'water') {
      showToast("Tu lances ta ligne...");
      // Pêche : attendre 1-2s
      const waitMs = 800 + Math.random() * 1500;
      setTimeout(() => {
        if (Math.random() < 0.7) {
          addToInventory('fish', 1);
        } else {
          showToast("Ça a mordu... mais pas pris !");
        }
      }, waitMs);
    } else {
      showToast("Il faut être face à l'eau");
    }
    return;
  }

  if (tool === 'can') {
    const crop = CROPS.find(c => c.col === ft.col && c.row === ft.row);
    if (crop) {
      crop.watered = true;
      crop.lastWater = t;
      showToast("Plante arrosée 💧");
    } else if (tile === 'tilled') {
      showToast("Il faut planter une graine");
    } else {
      showToast("Rien à arroser ici");
    }
    return;
  }

  // --- Récolte plante mûre sans outil ---
  const crop = CROPS.find(c => c.col === ft.col && c.row === ft.row);
  if (crop && crop.stage >= 2) {
    addToInventory('mushroom', 1);
    const i = CROPS.indexOf(crop);
    CROPS.splice(i, 1);
    setTile(ft.col, ft.row, 'tilled');
    return;
  }

  // --- Ramasser drop devant soi ---
  // (Le ramassage auto se fait en passant dessus)
  showToast("Rien à faire ici");
}

// =====================================================
// Croissance des plantes
// =====================================================
function updateCrops(t) {
  for (const c of CROPS) {
    const age = t - c.plantedAt;
    const bonus = c.watered ? 0.5 : 1;
    // stage 0 -> 1 après 15s, 1 -> 2 après 30s total (plus vite arrosé)
    if (age > 30000 * bonus) c.stage = 2;
    else if (age > 15000 * bonus) c.stage = 1;
    else c.stage = 0;
  }
}

// =====================================================
// Cycle jour/nuit
// =====================================================
function updateTime(dt) {
  // 1 seconde réelle = 1 minute de jeu
  state.gameMinutes += dt / 1000;
  if (state.gameMinutes >= 24 * 60) {
    state.gameMinutes -= 24 * 60;
    state.day++;
    // Fait repousser tous les arbres au nouveau jour
    for (const tr of TREES) { tr.shaken = false; tr.regrowAt = 0; }
    showToast(`🌅 Jour ${state.day} !`);
  }
}

function getNightAlpha() {
  const h = state.gameMinutes / 60;
  // Nuit entre 20h et 6h
  if (h >= 20 || h < 5) return 0.55;
  if (h >= 19 && h < 20) return (h - 19) * 0.55;
  if (h >= 5 && h < 7) return Math.max(0, 0.55 - (h - 5) * 0.27);
  return 0;
}

function drawNightOverlay() {
  const a = getNightAlpha();
  if (a > 0.01) {
    ctx.fillStyle = `rgba(10, 20, 60, ${a})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// =====================================================
// Caméra
// =====================================================
function getCamera() {
  const cx = player.x + player.w / 2 - canvas.width / 2;
  const cy = player.y + player.h / 2 - canvas.height / 2;
  return {
    x: Math.max(0, Math.min(COLS * TILE - canvas.width, cx)),
    y: Math.max(0, Math.min(ROWS * TILE - canvas.height, cy)),
  };
}

// =====================================================
// Indicateur "devant le joueur"
// =====================================================
function drawFacingIndicator(camX, camY) {
  const ft = getFacingTile();
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 3]);
  ctx.strokeRect(ft.col * TILE - camX + 1, ft.row * TILE - camY + 1, TILE - 2, TILE - 2);
  ctx.setLineDash([]);
}

// =====================================================
// Boucle principale
// =====================================================
function loop(time) {
  if (!state.running) return;
  const dt = Math.min(50, time - state.lastTime);
  state.lastTime = time;

  if (!state.paused) {
    updatePlayer(dt, input);
    updateCrops(time);
    updateTime(dt);
    const picked = pickUpDrops();
    for (const k of picked) addToInventory(k, 1);
  }

  // ---- Rendu ----
  const cam = getCamera();
  ctx.fillStyle = PAL.sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawWorld(ctx, cam.x, cam.y, time);
  drawDrops(ctx, cam.x, cam.y, time);

  // Tri simple par Y pour que PNJ/joueur s'affichent dans l'ordre
  const entities = [
    ...NPCS.map(n => ({ type: 'npc', y: n.y, ref: n })),
    { type: 'player', y: player.y }
  ].sort((a, b) => a.y - b.y);

  for (const e of entities) {
    if (e.type === 'npc') drawNPC(ctx, e.ref, cam.x, cam.y, time);
    else drawPlayer(ctx, cam.x, cam.y);
  }

  drawFacingIndicator(cam.x, cam.y);
  drawNightOverlay();

  updateHUD();
  requestAnimationFrame(loop);
}

// =====================================================
// Sauvegarde
// =====================================================
const SAVE_KEY = 'mario-crossing-save-v1';

function saveGame() {
  const data = {
    state: {
      coins: state.coins, energy: state.energy,
      gameMinutes: state.gameMinutes, day: state.day, tool: state.tool
    },
    player: { x: player.x, y: player.y, dir: player.dir },
    inventory,
    map: MAP,
    trees: TREES,
    crops: CROPS,
    drops: DROPS,
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return false;
  try {
    const d = JSON.parse(raw);
    Object.assign(state, d.state);
    Object.assign(player, d.player);
    inventory.length = 0;
    inventory.push(...d.inventory);
    MAP = d.map;
    TREES.length = 0;
    TREES.push(...d.trees);
    CROPS.length = 0;
    CROPS.push(...d.crops);
    DROPS.length = 0;
    DROPS.push(...d.drops);
    return true;
  } catch (e) {
    console.warn('Sauvegarde corrompue', e);
    return false;
  }
}

function resetGame() {
  localStorage.removeItem(SAVE_KEY);
  state.coins = 100;
  state.energy = 100;
  state.gameMinutes = 8 * 60;
  state.day = 1;
  state.tool = 0;
  player.x = 20 * TILE;
  player.y = 15 * TILE;
  player.dir = 'down';
  inventory.length = 0;
  addToInventory('seed', 3);
  DROPS.length = 0;
  generateWorld();
}

// Sauvegarde auto toutes les 20s
setInterval(() => { if (state.running) saveGame(); }, 20000);
window.addEventListener('beforeunload', () => { if (state.running) saveGame(); });

// =====================================================
// Démarrage
// =====================================================
document.getElementById('start-btn').addEventListener('click', () => {
  if (!loadGame()) {
    resetGame();
  }
  document.getElementById('title-screen').classList.add('hidden');
  state.running = true;
  state.lastTime = performance.now();
  updateHUD();
  requestAnimationFrame(loop);
});

document.getElementById('reset-btn').addEventListener('click', () => {
  if (confirm('Effacer la sauvegarde et repartir de zéro ?')) {
    resetGame();
    document.getElementById('title-screen').classList.add('hidden');
    state.running = true;
    state.lastTime = performance.now();
    updateHUD();
    requestAnimationFrame(loop);
  }
});

// Pré-génère le monde pour l'aperçu du menu titre si besoin
generateWorld();
