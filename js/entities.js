/* =====================================================
   entities.js - Joueur, PNJ, items au sol
   ===================================================== */

// ---- Joueur ----
const player = {
  x: 20 * TILE, y: 15 * TILE,
  w: 20, h: 24,
  speed: 2.2,
  dir: 'down',
  walkFrame: 0,
  walkTimer: 0,
  moving: false,
  colors: { cap: PAL.red, shirt: PAL.red, pants: PAL.blue, skin: PAL.skin }
};

function getPlayerTile() {
  return {
    col: Math.floor((player.x + TILE / 2) / TILE),
    row: Math.floor((player.y + TILE / 2) / TILE)
  };
}

// Tuile juste devant le joueur (selon direction)
function getFacingTile() {
  const t = getPlayerTile();
  if (player.dir === 'up')    return { col: t.col,     row: t.row - 1 };
  if (player.dir === 'down')  return { col: t.col,     row: t.row + 1 };
  if (player.dir === 'left')  return { col: t.col - 1, row: t.row };
  if (player.dir === 'right') return { col: t.col + 1, row: t.row };
  return t;
}

// Collision AABB contre les tuiles solides
function canMoveTo(nx, ny) {
  const corners = [
    [nx + 4, ny + 8],                // haut gauche
    [nx + player.w - 4, ny + 8],     // haut droit
    [nx + 4, ny + player.h - 2],     // bas gauche
    [nx + player.w - 4, ny + player.h - 2] // bas droit
  ];
  for (const [x, y] of corners) {
    const c = Math.floor(x / TILE);
    const r = Math.floor(y / TILE);
    if (isSolidAt(c, r)) return false;
  }
  // Bords
  if (nx < 0 || ny < 0) return false;
  if (nx + player.w > COLS * TILE || ny + player.h > ROWS * TILE) return false;
  return true;
}

function updatePlayer(dt, input) {
  let dx = 0, dy = 0;
  if (input.up)    { dy -= 1; player.dir = 'up'; }
  if (input.down)  { dy += 1; player.dir = 'down'; }
  if (input.left)  { dx -= 1; player.dir = 'left'; }
  if (input.right) { dx += 1; player.dir = 'right'; }

  const sp = player.speed * (input.run ? 1.8 : 1);
  if (dx && dy) { dx *= 0.7071; dy *= 0.7071; }

  if (dx || dy) {
    player.moving = true;
    const nx = player.x + dx * sp * (dt / 16);
    const ny = player.y + dy * sp * (dt / 16);
    if (canMoveTo(nx, player.y)) player.x = nx;
    if (canMoveTo(player.x, ny)) player.y = ny;
    player.walkTimer += dt;
    if (player.walkTimer > 180) {
      player.walkFrame = 1 - player.walkFrame;
      player.walkTimer = 0;
    }
  } else {
    player.moving = false;
    player.walkFrame = 0;
  }
}

function drawPlayer(ctx, camX, camY) {
  drawCharacter(
    ctx,
    player.x - camX, player.y - camY,
    player.dir, player.walkFrame,
    player.colors
  );
}

// =====================================================
// PNJ
// =====================================================

const NPCS = [
  {
    id: 'toad', name: 'Toad',
    x: 20 * TILE, y: 7 * TILE,
    colors: { cap: '#ffffff', shirt: '#ffffff', pants: '#a03030', skin: PAL.skin },
    cap_variant: 'toad',
    dialogs: [
      "Bienvenue à la boutique ! Je rachète tes trouvailles à bon prix.",
      "Tu sais qu'en secouant les arbres, on trouve parfois des pièces ?",
      "Le Capitaine Bowser Jr. vient parfois embêter le village... mais il est gentil au fond.",
    ],
    shop: true
  },
  {
    id: 'luigi', name: 'Luigi',
    x: 6 * TILE, y: 10 * TILE,
    colors: { cap: '#2e8b2e', shirt: '#2e8b2e', pants: PAL.blue, skin: PAL.skin },
    dialogs: [
      "Mamma mia, cette forêt est paisible...",
      "J'ai vu un Cheep Cheep énorme dans l'étang l'autre jour !",
      "Tu devrais planter des graines dans la ferme au sud-est.",
    ]
  },
  {
    id: 'peach', name: 'Peach',
    x: 28 * TILE, y: 14 * TILE,
    colors: { cap: '#ffb6d9', shirt: '#ffb6d9', pants: PAL.block, skin: PAL.skin },
    cap_variant: 'crown',
    dialogs: [
      "Oh, quelle belle journée ! Les fleurs sont magnifiques.",
      "Si tu cueilles des fleurs de feu, je t'en serais reconnaissante.",
      "Le jour et la nuit passent vite ici, profite bien !",
    ]
  },
  {
    id: 'yoshi', name: 'Yoshi',
    x: 14 * TILE, y: 22 * TILE,
    colors: { cap: '#5dc14f', shirt: '#5dc14f', pants: PAL.white, skin: '#5dc14f' },
    dialogs: [
      "Yoshi yoshi ! (Salut l'ami !)",
      "Les champignons que tu fais pousser sont délicieux !",
      "Si tu attrapes des papillons, je serai ton ami pour toujours.",
    ]
  },
  {
    id: 'shyguy', name: 'Maskass',
    x: 34 * TILE, y: 20 * TILE,
    colors: { cap: '#b02020', shirt: '#b02020', pants: '#602020', skin: '#e8a080' },
    cap_variant: 'mask',
    dialogs: [
      "...",
      "(Il te fait un signe timide)",
      "J'aime bien ta casquette.",
    ]
  }
];

function drawNPC(ctx, npc, camX, camY, t) {
  const wf = Math.floor(t / 500) % 2;
  drawCharacter(
    ctx, npc.x - camX, npc.y - camY,
    'down', wf, npc.colors
  );
  // Variantes de casquette
  if (npc.cap_variant === 'toad') {
    const cx = npc.x + TILE / 2 - camX;
    const cy = npc.y + TILE / 2 - camY;
    circle(ctx, cx, cy - 10, 8, PAL.white);
    circle(ctx, cx - 4, cy - 12, 3, PAL.red);
    circle(ctx, cx + 4, cy - 12, 3, PAL.red);
    circle(ctx, cx, cy - 8, 3, PAL.red);
  } else if (npc.cap_variant === 'crown') {
    const cx = npc.x + TILE / 2 - camX;
    const cy = npc.y + TILE / 2 - camY;
    ctx.fillStyle = PAL.block;
    ctx.fillRect(cx - 5, cy - 14, 10, 4);
    ctx.fillRect(cx - 5, cy - 17, 2, 3);
    ctx.fillRect(cx - 1, cy - 18, 2, 4);
    ctx.fillRect(cx + 3, cy - 17, 2, 3);
  } else if (npc.cap_variant === 'mask') {
    const cx = npc.x + TILE / 2 - camX;
    const cy = npc.y + TILE / 2 - camY;
    rect(ctx, cx - 5, cy - 8, 10, 8, '#e8c9a0');
    rect(ctx, cx - 2, cy - 5, 2, 2, '#000');
    rect(ctx, cx + 1, cy - 5, 2, 2, '#000');
    // bouche en O
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy - 1, 1.5, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Nom au-dessus
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(npc.x - camX - 2, npc.y - camY - 14, 36, 12);
  ctx.fillStyle = '#fff';
  ctx.font = '10px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(npc.name, npc.x - camX + TILE / 2, npc.y - camY - 5);
}

function findNearbyNPC() {
  for (const n of NPCS) {
    const dx = n.x - player.x, dy = n.y - player.y;
    if (Math.hypot(dx, dy) < TILE * 1.4) return n;
  }
  return null;
}

// =====================================================
// Items au sol (drops)
// =====================================================
const DROPS = []; // {kind, x, y, spawnedAt}

function addDrop(kind, col, row) {
  DROPS.push({ kind, x: col * TILE, y: row * TILE, spawnedAt: performance.now() });
}

function drawDrops(ctx, camX, camY, t) {
  for (const d of DROPS) {
    drawItem(ctx, d.kind, d.x - camX, d.y - camY, t);
  }
}

function pickUpDrops() {
  const collected = [];
  for (let i = DROPS.length - 1; i >= 0; i--) {
    const d = DROPS[i];
    const dx = d.x + TILE / 2 - (player.x + player.w / 2);
    const dy = d.y + TILE / 2 - (player.y + player.h / 2);
    if (Math.hypot(dx, dy) < 18) {
      collected.push(d.kind);
      DROPS.splice(i, 1);
    }
  }
  return collected;
}
