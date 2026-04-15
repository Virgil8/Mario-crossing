/* =====================================================
   assets.js - Dessin des sprites (sans images externes)
   ===================================================== */

const TILE = 32;   // taille d'une tuile
const COLS = 40;   // largeur carte (tuiles)
const ROWS = 30;   // hauteur carte

// Palette Mario
const PAL = {
  sky:       '#87ceeb',
  grass:     '#4caf50',
  grassDark: '#388e3c',
  path:      '#e8c99b',
  pathDark:  '#c8a46b',
  water:     '#3a95d8',
  waterDark: '#2570b0',
  pipeGreen: '#3fa02e',
  pipeDark:  '#1e6e14',
  brick:     '#c76b2a',
  brickDark: '#7a3a10',
  block:     '#ffd84a',
  red:       '#e52521',
  white:     '#ffffff',
  skin:      '#ffcc99',
  brown:     '#7a3a10',
  blue:      '#2b75d8',
  shadow:    'rgba(0,0,0,0.25)',
};

// Helpers de dessin
function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function circle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

// ---- Dessin des tuiles ----
function drawTile(ctx, type, x, y, t = 0) {
  switch (type) {
    case 'grass':
      rect(ctx, x, y, TILE, TILE, PAL.grass);
      // petites touffes
      rect(ctx, x + 4,  y + 20, 3, 5, PAL.grassDark);
      rect(ctx, x + 14, y + 8,  3, 5, PAL.grassDark);
      rect(ctx, x + 24, y + 24, 3, 5, PAL.grassDark);
      break;

    case 'path':
      rect(ctx, x, y, TILE, TILE, PAL.path);
      rect(ctx, x + 2, y + 2, 4, 4, PAL.pathDark);
      rect(ctx, x + 20, y + 14, 5, 3, PAL.pathDark);
      rect(ctx, x + 8, y + 22, 3, 3, PAL.pathDark);
      break;

    case 'water':
      rect(ctx, x, y, TILE, TILE, PAL.water);
      const wob = Math.sin(t / 400 + x * 0.1) * 2;
      rect(ctx, x + 4, y + 10 + wob, 10, 2, PAL.waterDark);
      rect(ctx, x + 18, y + 20 - wob, 8, 2, PAL.waterDark);
      rect(ctx, x + 2, y + 24, 6, 2, PAL.white + '55');
      break;

    case 'pipe':
      rect(ctx, x, y, TILE, TILE, PAL.pipeGreen);
      rect(ctx, x, y, 6, TILE, PAL.pipeDark);
      rect(ctx, x + TILE - 6, y, 6, TILE, PAL.pipeDark);
      rect(ctx, x, y, TILE, 4, PAL.pipeDark);
      rect(ctx, x + 8, y + 6, 16, 4, '#7dd66a');
      break;

    case 'brick':
      rect(ctx, x, y, TILE, TILE, PAL.brick);
      rect(ctx, x, y, TILE, 2, PAL.brickDark);
      rect(ctx, x, y + 16, TILE, 2, PAL.brickDark);
      rect(ctx, x + 10, y + 2, 2, 14, PAL.brickDark);
      rect(ctx, x + 22, y + 18, 2, 12, PAL.brickDark);
      break;

    case 'block': {
      const blink = Math.sin(t / 300) > 0.5 ? '#fff4a0' : PAL.block;
      rect(ctx, x, y, TILE, TILE, blink);
      rect(ctx, x, y, TILE, 3, PAL.brown);
      rect(ctx, x, y + TILE - 3, TILE, 3, PAL.brown);
      rect(ctx, x, y, 3, TILE, PAL.brown);
      rect(ctx, x + TILE - 3, y, 3, TILE, PAL.brown);
      ctx.fillStyle = PAL.brown;
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('?', x + TILE / 2, y + 24);
      break;
    }

    case 'flower': {
      rect(ctx, x, y, TILE, TILE, PAL.grass);
      const cx = x + TILE / 2, cy = y + TILE / 2;
      circle(ctx, cx - 4, cy, 4, PAL.red);
      circle(ctx, cx + 4, cy, 4, PAL.red);
      circle(ctx, cx, cy - 4, 4, PAL.red);
      circle(ctx, cx, cy + 4, 4, PAL.red);
      circle(ctx, cx, cy, 3, PAL.block);
      break;
    }

    case 'sand':
      rect(ctx, x, y, TILE, TILE, '#f4d580');
      rect(ctx, x + 6, y + 10, 3, 2, '#d8a84a');
      rect(ctx, x + 20, y + 20, 3, 2, '#d8a84a');
      break;

    case 'tilled':
      rect(ctx, x, y, TILE, TILE, '#6b3a1a');
      rect(ctx, x, y + 8, TILE, 2, '#4a2a10');
      rect(ctx, x, y + 20, TILE, 2, '#4a2a10');
      break;

    default:
      rect(ctx, x, y, TILE, TILE, '#000');
  }
}

// ---- Arbres Mario (buissons style SMB) ----
function drawTree(ctx, x, y) {
  ctx.fillStyle = PAL.shadow;
  ctx.beginPath();
  ctx.ellipse(x + TILE / 2, y + TILE + 4, 14, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tronc
  rect(ctx, x + 12, y + 18, 8, 14, PAL.brown);
  // Feuillage rond
  circle(ctx, x + 16, y + 8,  12, PAL.grassDark);
  circle(ctx, x + 8,  y + 14, 10, PAL.grassDark);
  circle(ctx, x + 24, y + 14, 10, PAL.grassDark);
  circle(ctx, x + 16, y + 6,  10, '#5dc14f');
}

// ---- Pièce qui tourne ----
function drawCoin(ctx, x, y, t) {
  const w = Math.abs(Math.sin(t / 300)) * 14 + 4;
  const cx = x + TILE / 2;
  const cy = y + TILE / 2 - Math.abs(Math.sin(t / 500)) * 4;
  ctx.fillStyle = '#d89f00';
  ctx.fillRect(cx - w / 2, cy - 10, w, 20);
  ctx.fillStyle = PAL.block;
  ctx.fillRect(cx - w / 2 + 2, cy - 8, w - 4, 16);
}

// ---- Items au sol ----
function drawItem(ctx, kind, x, y, t = 0) {
  const bob = Math.sin(t / 300) * 2;
  const cx = x + TILE / 2, cy = y + TILE / 2 + bob;

  switch (kind) {
    case 'mushroom':
      // chapeau rouge
      ctx.fillStyle = PAL.red;
      ctx.beginPath();
      ctx.arc(cx, cy - 2, 10, Math.PI, 0);
      ctx.fill();
      // pois blancs
      circle(ctx, cx - 4, cy - 5, 2, PAL.white);
      circle(ctx, cx + 4, cy - 5, 2, PAL.white);
      // tige
      rect(ctx, cx - 6, cy - 2, 12, 8, '#f0d8a0');
      // yeux
      rect(ctx, cx - 3, cy + 2, 2, 3, '#000');
      rect(ctx, cx + 1, cy + 2, 2, 3, '#000');
      break;

    case 'fire-flower':
      rect(ctx, cx - 1, cy + 2, 2, 8, '#2a8020');
      circle(ctx, cx, cy - 2, 5, PAL.red);
      circle(ctx, cx - 4, cy, 4, '#ff9a1a');
      circle(ctx, cx + 4, cy, 4, '#ff9a1a');
      circle(ctx, cx, cy - 4, 4, PAL.block);
      circle(ctx, cx, cy - 1, 2, '#000');
      break;

    case 'star':
      ctx.fillStyle = PAL.block;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        ctx.lineTo(cx + Math.cos(a) * 10, cy + Math.sin(a) * 10);
        const a2 = a + Math.PI / 5;
        ctx.lineTo(cx + Math.cos(a2) * 5, cy + Math.sin(a2) * 5);
      }
      ctx.closePath();
      ctx.fill();
      rect(ctx, cx - 4, cy - 2, 2, 3, '#000');
      rect(ctx, cx + 2, cy - 2, 2, 3, '#000');
      break;

    case 'fish':
      ctx.fillStyle = PAL.red;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 10, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx + 8, cy);
      ctx.lineTo(cx + 14, cy - 5);
      ctx.lineTo(cx + 14, cy + 5);
      ctx.closePath();
      ctx.fill();
      circle(ctx, cx - 4, cy - 1, 2, PAL.white);
      circle(ctx, cx - 4, cy - 1, 1, '#000');
      break;

    case 'bug':
      ctx.fillStyle = '#7b3f9e';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 8, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      rect(ctx, cx - 6, cy - 6, 2, 4, '#000');
      rect(ctx, cx + 4, cy - 6, 2, 4, '#000');
      circle(ctx, cx - 2, cy - 1, 1.5, PAL.white);
      circle(ctx, cx + 2, cy - 1, 1.5, PAL.white);
      break;

    case 'coin':
      drawCoin(ctx, x, y - bob, t);
      break;

    case 'seed':
      circle(ctx, cx, cy, 4, '#6b3a1a');
      circle(ctx, cx - 1, cy - 1, 1.5, '#a06040');
      break;

    case 'wood':
      rect(ctx, cx - 8, cy - 4, 16, 8, PAL.brown);
      rect(ctx, cx - 8, cy - 2, 16, 1, '#5a2a08');
      rect(ctx, cx - 8, cy + 1, 16, 1, '#5a2a08');
      break;
  }
}

// ---- Plante en croissance ----
function drawPlant(ctx, x, y, stage) {
  const cx = x + TILE / 2;
  if (stage === 0) {
    circle(ctx, cx, y + TILE - 6, 3, '#5dc14f');
  } else if (stage === 1) {
    rect(ctx, cx - 1, y + TILE - 12, 2, 10, '#2a8020');
    circle(ctx, cx - 3, y + TILE - 10, 3, '#5dc14f');
    circle(ctx, cx + 3, y + TILE - 12, 3, '#5dc14f');
  } else {
    // prêt à récolter : champignon
    drawItem(ctx, 'mushroom', x, y, 0);
  }
}

// ---- Personnage (Mario-like) ----
function drawCharacter(ctx, x, y, dir, walkFrame, colors) {
  const { cap, shirt, pants, skin } = colors;
  const cx = x + TILE / 2;
  const cy = y + TILE / 2;

  // Ombre
  ctx.fillStyle = PAL.shadow;
  ctx.beginPath();
  ctx.ellipse(cx, y + TILE, 10, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Animation de marche (léger bob)
  const bob = walkFrame ? -1 : 0;

  // Jambes
  rect(ctx, cx - 5, cy + 6, 4, 6, pants);
  rect(ctx, cx + 1, cy + 6, 4, 6, pants);
  if (walkFrame) {
    rect(ctx, cx - 6, cy + 10, 5, 2, '#3a2a1a');
  } else {
    rect(ctx, cx + 2, cy + 10, 5, 2, '#3a2a1a');
  }

  // Corps (salopette)
  rect(ctx, cx - 6, cy - 2 + bob, 12, 9, shirt);
  rect(ctx, cx - 6, cy + 1 + bob, 12, 6, pants);
  // Bretelles
  rect(ctx, cx - 4, cy - 2 + bob, 2, 6, pants);
  rect(ctx, cx + 2, cy - 2 + bob, 2, 6, pants);
  // Boutons
  circle(ctx, cx - 3, cy + 2 + bob, 1, PAL.block);
  circle(ctx, cx + 3, cy + 2 + bob, 1, PAL.block);

  // Bras
  rect(ctx, cx - 8, cy + bob, 3, 6, shirt);
  rect(ctx, cx + 5, cy + bob, 3, 6, shirt);
  // Gants
  circle(ctx, cx - 6, cy + 6 + bob, 2, PAL.white);
  circle(ctx, cx + 7, cy + 6 + bob, 2, PAL.white);

  // Tête
  rect(ctx, cx - 5, cy - 10 + bob, 10, 8, skin);
  // Casquette
  rect(ctx, cx - 6, cy - 12 + bob, 12, 3, cap);
  rect(ctx, cx - 7, cy - 10 + bob, 14, 2, cap);
  // Logo M
  ctx.fillStyle = PAL.white;
  ctx.font = 'bold 5px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('M', cx, cy - 9 + bob);

  // Yeux (selon la direction)
  const eyeOff = dir === 'left' ? -1 : dir === 'right' ? 1 : 0;
  rect(ctx, cx - 2 + eyeOff, cy - 6 + bob, 2, 2, '#000');
  rect(ctx, cx + 1 + eyeOff, cy - 6 + bob, 2, 2, '#000');

  // Moustache
  rect(ctx, cx - 3, cy - 3 + bob, 6, 1, '#3a2a1a');
}
