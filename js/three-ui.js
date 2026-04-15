/* =====================================================
   three-ui.js - UI (inventaire, dialogues, boutique, HUD)
   + mises à jour monde (cycle jour/nuit, cultures) + boucle
   ===================================================== */

// ============================================
// INVENTAIRE
// ============================================
const INVENTORY_SIZE = 18;
const inventory = [];

const ITEM_DATA = {
  mushroom:    { name: 'Champignon',   icon: '🍄', sell: 30,  edible: true },
  'fire-flower': { name: 'Fleur de feu', icon: '🌺', sell: 80,  edible: false },
  star:        { name: 'Super Étoile',  icon: '⭐', sell: 500, edible: false },
  fish:        { name: 'Cheep-Cheep',   icon: '🐟', sell: 60,  edible: false },
  bug:         { name: 'Papillon',      icon: '🦋', sell: 40,  edible: false },
  coin:        { name: 'Pièce',         icon: '🪙', sell: 1,   edible: false },
  seed:        { name: 'Graine',        icon: '🌱', sell: 5,   edible: false, plantable: true },
  wood:        { name: 'Bois',          icon: '🪵', sell: 10,  edible: false },
};

function addToInventory(kind, qty = 1) {
  if (kind === 'coin') {
    state3D.coins += qty;
    updateHUD();
    showToast(`+${qty} 🪙`);
    return true;
  }
  const existing = inventory.find(s => s.kind === kind);
  if (existing) { existing.qty += qty; showToast(`+${qty} ${ITEM_DATA[kind].icon}`); return true; }
  if (inventory.length >= INVENTORY_SIZE) { showToast("Sac plein !"); return false; }
  inventory.push({ kind, qty });
  showToast(`+${qty} ${ITEM_DATA[kind].icon} ${ITEM_DATA[kind].name}`);
  return true;
}

function removeFromInventory(kind, qty = 1) {
  const s = inventory.find(x => x.kind === kind);
  if (!s || s.qty < qty) return false;
  s.qty -= qty;
  if (s.qty <= 0) inventory.splice(inventory.indexOf(s), 1);
  return true;
}

function renderInventory() {
  const grid = document.getElementById('inventory-grid');
  grid.innerHTML = '';
  for (let i = 0; i < INVENTORY_SIZE; i++) {
    const slot = document.createElement('div');
    slot.className = 'inv-slot';
    const item = inventory[i];
    if (item) {
      const d = ITEM_DATA[item.kind];
      slot.innerHTML = `${d.icon}<div class="qty">${item.qty}</div>`;
      slot.title = `${d.name} (${item.qty})`;
      slot.addEventListener('click', () => useItem(item.kind));
      slot.addEventListener('contextmenu', e => { e.preventDefault(); dropItem(item.kind); });
    } else {
      slot.classList.add('empty');
    }
    grid.appendChild(slot);
  }
}

function useItem(kind) {
  const data = ITEM_DATA[kind];
  if (data.edible) {
    removeFromInventory(kind, 1);
    state3D.energy = Math.min(100, state3D.energy + 20);
    showToast(`Tu manges ${data.name} (+20 énergie)`);
    renderInventory();
  } else if (data.plantable) {
    // Planter sur une parcelle labourée proche
    const fx = player.x + Math.sin(player.rotY) * 1.2;
    const fz = player.z + Math.cos(player.rotY) * 1.2;
    const tilled = findNearestTilled(fx, fz, 1.0);
    if (tilled && !CROPS_3D.some(c => c.x === tilled.x && c.z === tilled.z)) {
      removeFromInventory(kind, 1);
      const m = buildPlant(0);
      m.position.set(tilled.x, 0, tilled.z);
      scene.add(m);
      CROPS_3D.push({ mesh: m, x: tilled.x, z: tilled.z, plantedAt: performance.now(), stage: 0, watered: false });
      showToast("Graine plantée 🌱");
      renderInventory();
    } else {
      showToast("Terre labourée requise devant toi");
    }
  } else {
    showToast(`${data.name} : pas d'usage direct`);
  }
}

function dropItem(kind) {
  if (removeFromInventory(kind, 1)) {
    spawnDrop(kind, player.x + Math.sin(player.rotY) * 1.0, player.z + Math.cos(player.rotY) * 1.0);
    renderInventory();
  }
}

function toggleInventory() {
  const inv = document.getElementById('inventory');
  if (inv.classList.contains('hidden')) {
    renderInventory();
    inv.classList.remove('hidden');
    state3D.paused = true;
  } else {
    inv.classList.add('hidden');
    state3D.paused = false;
  }
}

// Construction d'une plante selon le stade
function buildPlant(stage) {
  const g = new THREE.Group();
  if (stage === 0) {
    const s = sphere(0.12, 0x6fd068, 6);
    s.position.y = 0.08;
    g.add(s);
  } else if (stage === 1) {
    const stem = cyl(0.03, 0.03, 0.3, 0x2a8020, 6);
    stem.position.y = 0.15;
    g.add(stem);
    const leaf1 = sphere(0.12, 0x6fd068, 6);
    leaf1.position.set(-0.1, 0.25, 0);
    g.add(leaf1);
    const leaf2 = sphere(0.12, 0x6fd068, 6);
    leaf2.position.set(0.1, 0.3, 0);
    g.add(leaf2);
  } else {
    g.add(buildMushroom());
  }
  return g;
}

// ============================================
// DIALOGUE
// ============================================
let currentDialog = null;

function startDialog(npc) {
  currentDialog = npc;
  const el = document.getElementById('dialog');
  el.classList.remove('hidden');
  document.getElementById('dialog-speaker').textContent = npc.name;
  document.getElementById('dialog-text').textContent =
    npc.dialogs[Math.floor(Math.random() * npc.dialogs.length)];
  // Orienter PNJ vers joueur
  const dx = player.x - npc.x, dz = player.z - npc.z;
  npc.mesh.rotation.y = Math.atan2(dx, dz);
}

function advanceDialog() {
  if (!currentDialog) return;
  const npc = currentDialog;
  currentDialog = null;
  document.getElementById('dialog').classList.add('hidden');
  if (npc.shop) openShop();
}

// ============================================
// BOUTIQUE
// ============================================
function openShop() {
  const list = document.getElementById('shop-sell-list');
  list.innerHTML = '';
  if (inventory.length === 0) {
    list.innerHTML = '<p style="text-align:center;padding:10px;">Ton sac est vide.</p>';
  } else {
    for (const slot of inventory) {
      const d = ITEM_DATA[slot.kind];
      const div = document.createElement('div');
      div.className = 'shop-item';
      div.innerHTML = `
        <span>${d.icon} ${d.name} x${slot.qty}</span>
        <span>${d.sell} 🪙/u</span>
        <button>Vendre 1</button>`;
      div.querySelector('button').addEventListener('click', () => {
        if (removeFromInventory(slot.kind, 1)) {
          state3D.coins += d.sell;
          updateHUD();
          showToast(`+${d.sell} 🪙`);
          openShop();
        }
      });
      list.appendChild(div);
    }
  }
  document.getElementById('shop').classList.remove('hidden');
  state3D.paused = true;
}

function closeShop() {
  document.getElementById('shop').classList.add('hidden');
  state3D.paused = false;
}

// ============================================
// HUD / TOAST
// ============================================
function updateHUD() {
  document.getElementById('coins').textContent = state3D.coins;
  const h = Math.floor(state3D.gameMinutes / 60) % 24;
  const m = Math.floor(state3D.gameMinutes % 60);
  document.getElementById('time').textContent =
    `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  document.getElementById('day').textContent = `Jour ${state3D.day}`;
  document.getElementById('current-tool').textContent = TOOLS[state3D.tool].name;
}

let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 1800);
}

function setupUI() {
  document.getElementById('shop-close').addEventListener('click', closeShop);
}

// ============================================
// MISES À JOUR MONDE
// ============================================
function updateCrops(time) {
  for (const c of CROPS_3D) {
    const age = time - c.plantedAt;
    const bonus = c.watered ? 0.5 : 1;
    let newStage = c.stage;
    if (age > 30000 * bonus) newStage = 2;
    else if (age > 15000 * bonus) newStage = 1;
    if (newStage !== c.stage) {
      c.stage = newStage;
      scene.remove(c.mesh);
      const m = buildPlant(newStage);
      m.position.set(c.x, 0, c.z);
      scene.add(m);
      c.mesh = m;
    }
  }
}

function updateTime(dt) {
  // 1 seconde réelle = 1 minute jeu
  state3D.gameMinutes += dt;
  if (state3D.gameMinutes >= 24 * 60) {
    state3D.gameMinutes -= 24 * 60;
    state3D.day++;
    for (const t of TREES_3D) { t.shaken = false; t.regrowAt = 0; }
    showToast(`🌅 Jour ${state3D.day} !`);
  }
}

function updateDayNight() {
  const h = state3D.gameMinutes / 60;
  // Position du soleil selon l'heure
  const sunAngle = ((h - 6) / 24) * Math.PI * 2;
  const sunY = Math.sin(sunAngle) * 25;
  const sunX = Math.cos(sunAngle) * 25;
  sunLight.position.set(sunX, Math.max(2, sunY), 10);

  // Intensité
  let intensity = 1.0;
  let skyColor = 0x87ceeb;
  let fogColor = 0x87ceeb;
  let ambientIntensity = 0.75;

  if (h >= 20 || h < 5) {
    // Nuit
    intensity = 0.15;
    skyColor = 0x1a2850;
    fogColor = 0x1a2850;
    ambientIntensity = 0.3;
  } else if (h >= 5 && h < 7) {
    // Aube
    const t = (h - 5) / 2;
    intensity = 0.15 + t * 0.85;
    skyColor = lerpColor(0x1a2850, 0xffa070, t);
    fogColor = skyColor;
    ambientIntensity = 0.3 + t * 0.45;
  } else if (h >= 18 && h < 20) {
    // Crépuscule
    const t = (h - 18) / 2;
    intensity = 1.0 - t * 0.85;
    skyColor = lerpColor(0x87ceeb, 0xff7050, Math.min(1, t * 1.5));
    skyColor = lerpColor(skyColor, 0x1a2850, Math.max(0, (t - 0.7) * 3));
    fogColor = skyColor;
    ambientIntensity = 0.75 - t * 0.45;
  }

  sunLight.intensity = intensity;
  hemiLight.intensity = ambientIntensity;
  scene.background = new THREE.Color(skyColor);
  scene.fog.color = new THREE.Color(fogColor);
}

function lerpColor(a, b, t) {
  const ar = (a >> 16) & 0xff, ag = (a >> 8) & 0xff, ab = a & 0xff;
  const br = (b >> 16) & 0xff, bg = (b >> 8) & 0xff, bb = b & 0xff;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return (r << 16) | (g << 8) | bl;
}

function updateWorldAnimations(time) {
  // Nuages défilent
  scene.traverse(o => {
    if (o.userData && o.userData.isCloud) {
      o.position.x += o.userData.speed;
      if (o.position.x > 40) o.position.x = -40;
    }
    if (o.userData && o.userData.isBlock) {
      o.position.y = o.userData.spawnY + Math.sin(time * 0.002) * 0.1;
      o.rotation.y = Math.sin(time * 0.001) * 0.1;
    }
    if (o.userData && o.userData.isCoin) {
      o.rotation.y = time * 0.003;
      o.position.y = o.userData.spawnY + Math.sin(time * 0.003) * 0.2;
    }
  });

  // Bob des drops au sol + rotation
  for (const d of DROPS_3D) {
    if (!d.mesh.userData.spawnY) continue;
    d.mesh.position.y = d.mesh.userData.spawnY + Math.sin(time * 0.004 + (d.mesh.userData.bobOffset || 0)) * 0.1;
    d.mesh.rotation.y = time * 0.001 + (d.mesh.userData.bobOffset || 0);
  }

  // Animation de secousse des arbres
  for (const t of TREES_3D) {
    if (t.shakeUntil && time < t.shakeUntil) {
      t.mesh.rotation.z = Math.sin(time * 0.04) * 0.08;
    } else {
      t.mesh.rotation.z *= 0.9;
    }
    // Arbre secoué = plus de feuillage (on le cache simplement en l'enfonçant)
    if (t.shaken && time < t.regrowAt) {
      t.mesh.scale.y = 0.7;
    } else {
      t.mesh.scale.y = 1;
    }
  }

  // NPCs : petit idle
  for (const n of NPCS_3D) {
    n.mesh.position.y = Math.sin(time * 0.002 + n.idleTimer) * 0.04;
  }
}

// Ramassage des drops en passant dessus
function pickupDrops() {
  for (let i = DROPS_3D.length - 1; i >= 0; i--) {
    const d = DROPS_3D[i];
    const dist = Math.hypot(d.x - player.x, d.z - player.z);
    if (dist < 0.8) {
      addToInventory(d.kind, 1);
      scene.remove(d.mesh);
      DROPS_3D.splice(i, 1);
    }
  }
}

// ============================================
// SAUVEGARDE
// ============================================
const SAVE_KEY = 'mario-crossing-3d-v1';

function saveGame() {
  const data = {
    state: {
      coins: state3D.coins, energy: state3D.energy,
      gameMinutes: state3D.gameMinutes, day: state3D.day, tool: state3D.tool
    },
    player: { x: player.x, z: player.z, rotY: player.rotY },
    inventory,
    trees: TREES_3D.map(t => ({ x: t.x, z: t.z, shaken: t.shaken, regrowAt: t.regrowAt })),
    crops: CROPS_3D.map(c => ({ x: c.x, z: c.z, plantedAt: c.plantedAt, stage: c.stage, watered: c.watered })),
  };
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch (e) {}
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return false;
  try {
    const d = JSON.parse(raw);
    Object.assign(state3D, d.state);
    player.x = d.player.x; player.z = d.player.z; player.rotY = d.player.rotY;
    player.targetRotY = player.rotY;
    inventory.length = 0; inventory.push(...d.inventory);
    // Restaurer arbres
    for (const ts of d.trees) {
      const t = TREES_3D.find(x => x.x === ts.x && x.z === ts.z);
      if (t) { t.shaken = ts.shaken; t.regrowAt = ts.regrowAt; }
    }
    // Restaurer cultures
    for (const cs of d.crops) {
      const m = buildPlant(cs.stage);
      m.position.set(cs.x, 0, cs.z);
      scene.add(m);
      CROPS_3D.push({ mesh: m, x: cs.x, z: cs.z, plantedAt: cs.plantedAt, stage: cs.stage, watered: cs.watered });
    }
    return true;
  } catch (e) { return false; }
}

function resetGame() {
  localStorage.removeItem(SAVE_KEY);
  state3D.coins = 100;
  state3D.gameMinutes = 8 * 60;
  state3D.day = 1;
  state3D.tool = 0;
  player.x = 0; player.z = 3; player.rotY = 0; player.targetRotY = 0;
  inventory.length = 0;
  addToInventory('seed', 3);
}

// ============================================
// BOUCLE
// ============================================
function loop3D(time) {
  if (!state3D.running) return;

  const dt = Math.min(0.05, clock.getDelta());

  if (!state3D.paused) {
    updatePlayer(dt);
    updateCrops(time);
    updateTime(dt);
    pickupDrops();
  }
  updateCamera(dt);
  updateDayNight();
  updateWorldAnimations(time);
  updateHUD();

  renderer.render(scene, camera);
  requestAnimationFrame(loop3D);
}

// ============================================
// DÉMARRAGE
// ============================================
window.addEventListener('load', () => {
  init3D();

  document.getElementById('start-btn').addEventListener('click', () => {
    if (!loadGame()) resetGame();
    document.getElementById('title-screen').classList.add('hidden');
    state3D.running = true;
    updateHUD();
    requestAnimationFrame(loop3D);
  });

  document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm('Effacer la sauvegarde et repartir de zéro ?')) {
      resetGame();
      document.getElementById('title-screen').classList.add('hidden');
      state3D.running = true;
      updateHUD();
      requestAnimationFrame(loop3D);
    }
  });

  // Aperçu animé du monde en fond de titre
  renderer.render(scene, camera);
});
