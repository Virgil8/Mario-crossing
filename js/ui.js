/* =====================================================
   ui.js - Dialogues, inventaire, boutique, HUD
   ===================================================== */

// =====================================================
// Inventaire
// =====================================================
const INVENTORY_SIZE = 18;
const inventory = []; // { kind, qty }

const ITEM_DATA = {
  mushroom:    { name: 'Champignon',     icon: '🍄', sell: 30,  edible: true },
  'fire-flower': { name: 'Fleur de feu',  icon: '🌺', sell: 80,  edible: false },
  star:        { name: 'Super Étoile',   icon: '⭐', sell: 500, edible: false },
  fish:        { name: 'Cheep-Cheep',    icon: '🐟', sell: 60,  edible: false },
  bug:         { name: 'Papillon',       icon: '🦋', sell: 40,  edible: false },
  coin:        { name: 'Pièce',          icon: '🪙', sell: 1,   edible: false },
  seed:        { name: 'Graine',         icon: '🌱', sell: 5,   edible: false, plantable: true },
  wood:        { name: 'Bois',           icon: '🪵', sell: 10,  edible: false },
};

function addToInventory(kind, qty = 1) {
  // Les pièces vont directement dans le porte-monnaie
  if (kind === 'coin') {
    state.coins += qty;
    updateHUD();
    showToast(`+${qty} 🪙`);
    return true;
  }
  const existing = inventory.find(s => s.kind === kind);
  if (existing) {
    existing.qty += qty;
    return true;
  }
  if (inventory.length >= INVENTORY_SIZE) {
    showToast("Sac plein !");
    return false;
  }
  inventory.push({ kind, qty });
  showToast(`+${qty} ${ITEM_DATA[kind].icon} ${ITEM_DATA[kind].name}`);
  return true;
}

function removeFromInventory(kind, qty = 1) {
  const slot = inventory.find(s => s.kind === kind);
  if (!slot || slot.qty < qty) return false;
  slot.qty -= qty;
  if (slot.qty <= 0) {
    inventory.splice(inventory.indexOf(slot), 1);
  }
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
      const data = ITEM_DATA[item.kind];
      slot.innerHTML = `${data.icon}<div class="qty">${item.qty}</div>`;
      slot.title = `${data.name} (${item.qty})`;
      slot.addEventListener('click', () => useItem(item.kind));
      slot.addEventListener('contextmenu', e => {
        e.preventDefault();
        dropItem(item.kind);
      });
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
    state.energy = Math.min(100, state.energy + 20);
    showToast(`Tu manges ${data.name} (+20 énergie)`);
    renderInventory();
  } else if (data.plantable) {
    // Planter sur tuile labourée devant soi
    const ft = getFacingTile();
    if (tileAtDecoded(ft.col, ft.row) === 'tilled' &&
        !CROPS.some(c => c.col === ft.col && c.row === ft.row)) {
      removeFromInventory(kind, 1);
      CROPS.push({ col: ft.col, row: ft.row, stage: 0, plantedAt: performance.now() });
      showToast("Graine plantée 🌱");
      renderInventory();
    } else {
      showToast("Terre non labourée devant toi");
    }
  } else {
    showToast(`${data.name} : pas d'usage direct`);
  }
}

function dropItem(kind) {
  const t = getPlayerTile();
  if (removeFromInventory(kind, 1)) {
    addDrop(kind, t.col, t.row);
    renderInventory();
  }
}

// =====================================================
// Dialogue
// =====================================================
let currentDialog = null;
let dialogIndex = 0;

function startDialog(npc) {
  currentDialog = npc;
  dialogIndex = Math.floor(Math.random() * npc.dialogs.length);
  const el = document.getElementById('dialog');
  el.classList.remove('hidden');
  document.getElementById('dialog-speaker').textContent = npc.name;
  document.getElementById('dialog-text').textContent = npc.dialogs[dialogIndex];
}

function advanceDialog() {
  if (!currentDialog) return;
  // Ferme le dialogue. Si c'est Toad, ouvre la boutique.
  const npc = currentDialog;
  currentDialog = null;
  document.getElementById('dialog').classList.add('hidden');
  if (npc.shop) {
    openShop();
  }
}

// =====================================================
// Boutique
// =====================================================
function openShop() {
  const shop = document.getElementById('shop');
  const list = document.getElementById('shop-sell-list');
  list.innerHTML = '';
  if (inventory.length === 0) {
    list.innerHTML = '<p style="text-align:center;padding:10px;">Ton sac est vide.</p>';
  } else {
    for (const slot of inventory) {
      const data = ITEM_DATA[slot.kind];
      const div = document.createElement('div');
      div.className = 'shop-item';
      div.innerHTML = `
        <span>${data.icon} ${data.name} x${slot.qty}</span>
        <span>${data.sell} 🪙/u</span>
        <button data-kind="${slot.kind}">Vendre 1</button>
      `;
      div.querySelector('button').addEventListener('click', () => {
        if (removeFromInventory(slot.kind, 1)) {
          state.coins += data.sell;
          updateHUD();
          showToast(`+${data.sell} 🪙`);
          openShop();
        }
      });
      list.appendChild(div);
    }
  }
  shop.classList.remove('hidden');
  state.paused = true;
}

function closeShop() {
  document.getElementById('shop').classList.add('hidden');
  state.paused = false;
}

document.getElementById('shop-close').addEventListener('click', closeShop);

// =====================================================
// Toast (notifications)
// =====================================================
let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 1800);
}

// =====================================================
// HUD
// =====================================================
function updateHUD() {
  document.getElementById('coins').textContent = state.coins;
  const h = Math.floor(state.gameMinutes / 60) % 24;
  const m = state.gameMinutes % 60;
  document.getElementById('time').textContent =
    `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  document.getElementById('day').textContent = `Jour ${state.day}`;
  document.getElementById('current-tool').textContent = TOOLS[state.tool].name;
}
