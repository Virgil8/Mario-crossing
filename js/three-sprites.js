/* =====================================================
   three-sprites.js - Sprites de persos (style Paper Mario)
   Chaque perso est un dessin 2D sur un plan qui face caméra
   ===================================================== */

const SPRITE_RES = 512;

function makeSpriteChar(drawFn, width = 1.6, height = 2.2) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = SPRITE_RES;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  drawFn(ctx, SPRITE_RES);
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;

  const geo = new THREE.PlaneGeometry(width, height);
  const mat = new THREE.MeshBasicMaterial({
    map: tex, transparent: true, alphaTest: 0.02,
    side: THREE.DoubleSide, depthWrite: true
  });
  const plane = new THREE.Mesh(geo, mat);
  plane.position.y = height / 2;
  plane.userData.isBillboard = true;

  const g = new THREE.Group();
  g.add(plane);
  g.userData.billboard = plane;
  g.userData.height = height;

  // Ombre circulaire sous le perso
  const shadowTex = makeShadowTex();
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(width * 0.7, width * 0.35),
    new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  g.add(shadow);
  g.userData.shadow = shadow;

  // Refs factices pour compat avec animateWalk
  const dummy = { rotation: { x: 0 } };
  g.userData.legL = g.userData.legR = dummy;
  g.userData.armL = g.userData.armR = dummy;
  g.userData.shoeL = g.userData.shoeR = dummy;
  return g;
}

function makeShadowTex() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const grd = ctx.createRadialGradient(64, 64, 0, 64, 64, 60);
  grd.addColorStop(0, 'rgba(0,0,0,0.5)');
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

// Petit bob en marchant (appelé à la place de animateWalk)
function bobSprite(g, time, walking) {
  if (!g.userData.billboard) return;
  if (walking) {
    g.userData.billboard.position.y = g.userData.height / 2 + Math.abs(Math.sin(time * 0.012)) * 0.08;
  } else {
    g.userData.billboard.position.y += ((g.userData.height / 2) - g.userData.billboard.position.y) * 0.2;
  }
}

// ============== Helpers de dessin ==============
const STROKE = '#1a0a00';

function outline(ctx, w = 4) { ctx.strokeStyle = STROKE; ctx.lineWidth = w; ctx.stroke(); }
function fillStroke(ctx, color, w = 4) {
  ctx.fillStyle = color; ctx.fill();
  ctx.strokeStyle = STROKE; ctx.lineWidth = w; ctx.stroke();
}
function circ(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); }
function ellp(ctx, x, y, rx, ry, rot = 0) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
}

// Dessine les yeux : grands yeux ovales expressifs
function drawEyes(ctx, cx, cy, spacing = 22, scale = 1, lashes = false, pupilCol = '#1a1a3a') {
  for (const side of [-1, 1]) {
    const ex = cx + side * spacing;
    ellp(ctx, ex, cy, 13 * scale, 18 * scale);
    fillStroke(ctx, '#ffffff', 3);
    // Pupille
    circ(ctx, ex + side * 2, cy + 2, 7 * scale);
    ctx.fillStyle = pupilCol; ctx.fill();
    // Reflet
    circ(ctx, ex + side * 4, cy - 3, 3 * scale);
    ctx.fillStyle = '#ffffff'; ctx.fill();
    if (lashes) {
      ctx.strokeStyle = '#1a0a00'; ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(ex - 8 * scale, cy - 12 * scale);
      ctx.lineTo(ex - 14 * scale, cy - 18 * scale);
      ctx.moveTo(ex, cy - 14 * scale);
      ctx.lineTo(ex, cy - 22 * scale);
      ctx.moveTo(ex + 8 * scale, cy - 12 * scale);
      ctx.lineTo(ex + 14 * scale, cy - 18 * scale);
      ctx.stroke();
    }
  }
}

// Moustache classique en M
function drawMustache(ctx, cx, cy) {
  ctx.fillStyle = '#1a0a00';
  ctx.beginPath();
  ctx.moveTo(cx - 50, cy);
  ctx.quadraticCurveTo(cx - 55, cy + 18, cx - 30, cy + 18);
  ctx.quadraticCurveTo(cx - 18, cy + 10, cx - 8, cy + 12);
  ctx.quadraticCurveTo(cx, cy + 16, cx + 8, cy + 12);
  ctx.quadraticCurveTo(cx + 18, cy + 10, cx + 30, cy + 18);
  ctx.quadraticCurveTo(cx + 55, cy + 18, cx + 50, cy);
  ctx.quadraticCurveTo(cx + 35, cy - 2, cx + 20, cy + 2);
  ctx.quadraticCurveTo(cx, cy + 8, cx - 20, cy + 2);
  ctx.quadraticCurveTo(cx - 35, cy - 2, cx - 50, cy);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = STROKE; ctx.lineWidth = 2.5; ctx.stroke();
}

// Moustache zigzag (Wario)
function drawZigzagMustache(ctx, cx, cy) {
  ctx.fillStyle = '#1a0a00';
  ctx.beginPath();
  ctx.moveTo(cx - 55, cy);
  ctx.lineTo(cx - 35, cy + 15);
  ctx.lineTo(cx - 20, cy);
  ctx.lineTo(cx, cy + 15);
  ctx.lineTo(cx + 20, cy);
  ctx.lineTo(cx + 35, cy + 15);
  ctx.lineTo(cx + 55, cy);
  ctx.lineTo(cx + 45, cy - 10);
  ctx.lineTo(cx, cy);
  ctx.lineTo(cx - 45, cy - 10);
  ctx.closePath();
  ctx.fill();
  outline(ctx, 2.5);
}

// ============== Drawer pour plombier (Mario / Luigi / Wario) ==============
function drawPlumber(ctx, s, o) {
  const {
    capColor, shirtColor, pantsColor, initial = 'M', letterCol = capColor,
    skin = '#ffcc99', fat = 1, mustacheType = 'classic', noseBig = false,
    shoeColor = '#6a3010'
  } = o;

  const cx = s / 2;
  ctx.clearRect(0, 0, s, s);

  // Proportions (canvas 512)
  const headY = 130;
  const headR = 85;
  const bodyY = 290;
  const legsY = 420;

  // ========== JAMBES + PIEDS ==========
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const legW = 50 * fat;
  // Jambes (pantalon)
  ctx.fillStyle = pantsColor;
  ctx.strokeStyle = STROKE; ctx.lineWidth = 4;
  // gauche
  ctx.beginPath();
  ctx.moveTo(cx - legW, legsY);
  ctx.quadraticCurveTo(cx - legW - 5, legsY + 50, cx - legW + 5, legsY + 60);
  ctx.lineTo(cx - 10, legsY + 60);
  ctx.lineTo(cx - 10, legsY);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // droite
  ctx.beginPath();
  ctx.moveTo(cx + 10, legsY);
  ctx.lineTo(cx + 10, legsY + 60);
  ctx.lineTo(cx + legW - 5, legsY + 60);
  ctx.quadraticCurveTo(cx + legW + 5, legsY + 50, cx + legW, legsY);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Chaussures
  ctx.fillStyle = shoeColor;
  ellp(ctx, cx - 35 * fat, legsY + 65, 45, 20);
  ctx.fill(); ctx.stroke();
  ellp(ctx, cx + 35 * fat, legsY + 65, 45, 20);
  ctx.fill(); ctx.stroke();
  // Petit reflet
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ellp(ctx, cx - 40 * fat, legsY + 60, 20, 5);
  ctx.fill();
  ellp(ctx, cx + 40 * fat, legsY + 60, 20, 5);
  ctx.fill();

  // ========== TORSE + SALOPETTE ==========
  // Chemise rouge (épaules/torse)
  ctx.fillStyle = shirtColor;
  ctx.beginPath();
  ctx.moveTo(cx - 90 * fat, bodyY - 50);
  ctx.quadraticCurveTo(cx - 100 * fat, bodyY - 30, cx - 95 * fat, bodyY);
  ctx.quadraticCurveTo(cx - 100 * fat, bodyY + 60, cx - 85 * fat, bodyY + 120);
  ctx.lineTo(cx + 85 * fat, bodyY + 120);
  ctx.quadraticCurveTo(cx + 100 * fat, bodyY + 60, cx + 95 * fat, bodyY);
  ctx.quadraticCurveTo(cx + 100 * fat, bodyY - 30, cx + 90 * fat, bodyY - 50);
  ctx.quadraticCurveTo(cx, bodyY - 75, cx - 90 * fat, bodyY - 50);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Salopette (au-dessus de la chemise au centre)
  ctx.fillStyle = pantsColor;
  ctx.beginPath();
  ctx.moveTo(cx - 60 * fat, bodyY - 20);
  ctx.lineTo(cx - 60 * fat, bodyY - 5);
  // Bretelles
  ctx.lineTo(cx - 45 * fat, bodyY - 50);
  ctx.lineTo(cx - 25 * fat, bodyY - 50);
  ctx.lineTo(cx - 25 * fat, bodyY - 15);
  ctx.lineTo(cx + 25 * fat, bodyY - 15);
  ctx.lineTo(cx + 25 * fat, bodyY - 50);
  ctx.lineTo(cx + 45 * fat, bodyY - 50);
  ctx.lineTo(cx + 60 * fat, bodyY - 5);
  ctx.lineTo(cx + 60 * fat, bodyY - 20);
  ctx.lineTo(cx + 85 * fat, bodyY + 120);
  ctx.lineTo(cx - 85 * fat, bodyY + 120);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Boutons dorés
  ctx.fillStyle = '#ffd84a';
  circ(ctx, cx - 40 * fat, bodyY, 8);
  ctx.fill(); outline(ctx, 3);
  circ(ctx, cx + 40 * fat, bodyY, 8);
  ctx.fill(); outline(ctx, 3);

  // ========== BRAS + GANTS ==========
  ctx.fillStyle = shirtColor;
  ellp(ctx, cx - 110 * fat, bodyY + 40, 28, 55);
  ctx.fill(); ctx.stroke();
  ellp(ctx, cx + 110 * fat, bodyY + 40, 28, 55);
  ctx.fill(); ctx.stroke();
  // Gants blancs
  ctx.fillStyle = '#ffffff';
  circ(ctx, cx - 115 * fat, bodyY + 105, 28);
  ctx.fill(); ctx.stroke();
  circ(ctx, cx + 115 * fat, bodyY + 105, 28);
  ctx.fill(); ctx.stroke();
  // Trait des doigts
  ctx.strokeStyle = '#aaaaaa'; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 105 * fat, bodyY + 100);
  ctx.lineTo(cx - 95 * fat, bodyY + 110);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 105 * fat, bodyY + 100);
  ctx.lineTo(cx + 95 * fat, bodyY + 110);
  ctx.stroke();

  // ========== TÊTE ==========
  // Oreilles
  ctx.fillStyle = skin;
  ctx.strokeStyle = STROKE; ctx.lineWidth = 4;
  ellp(ctx, cx - headR, headY + 20, 18, 26);
  ctx.fill(); ctx.stroke();
  ellp(ctx, cx + headR, headY + 20, 18, 26);
  ctx.fill(); ctx.stroke();
  // Visage rond
  ctx.fillStyle = skin;
  circ(ctx, cx, headY + 10, headR);
  ctx.fill(); ctx.stroke();

  // Joues rosées
  ctx.fillStyle = 'rgba(255, 140, 140, 0.5)';
  circ(ctx, cx - 50, headY + 35, 15);
  ctx.fill();
  circ(ctx, cx + 50, headY + 35, 15);
  ctx.fill();

  // Yeux
  drawEyes(ctx, cx, headY - 5, 22, 1);

  // Nez (gros)
  ctx.fillStyle = '#e8a078';
  ctx.strokeStyle = STROKE; ctx.lineWidth = 4;
  circ(ctx, cx, headY + 25, noseBig ? 28 : 22);
  ctx.fill(); ctx.stroke();
  // Reflet du nez
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  circ(ctx, cx - 8, headY + 18, 6);
  ctx.fill();

  // Moustache
  if (mustacheType === 'classic') drawMustache(ctx, cx, headY + 52);
  else if (mustacheType === 'zigzag') drawZigzagMustache(ctx, cx, headY + 52);

  // ========== CASQUETTE ==========
  ctx.fillStyle = capColor;
  ctx.strokeStyle = STROKE; ctx.lineWidth = 4;
  ctx.beginPath();
  // calotte
  ctx.arc(cx, headY + 5, headR + 5, Math.PI, 0);
  // visière
  ctx.lineTo(cx + headR + 20, headY + 5);
  ctx.quadraticCurveTo(cx + 40, headY + 30, cx - 40, headY + 30);
  ctx.quadraticCurveTo(cx - headR - 15, headY + 25, cx - headR - 20, headY + 5);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Reflet casquette
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.beginPath();
  ctx.ellipse(cx - 20, headY - 30, 35, 15, -0.4, 0, Math.PI * 2);
  ctx.fill();

  // Logo M rond
  ctx.fillStyle = '#ffffff';
  circ(ctx, cx, headY - 25, 28);
  ctx.fill(); outline(ctx, 4);
  ctx.fillStyle = letterCol;
  ctx.font = 'bold 44px Arial Black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initial, cx, headY - 21);
}

// ============== Wrappers ==============
function buildMarioSprite() {
  return makeSpriteChar((ctx, s) => drawPlumber(ctx, s, {
    capColor: '#e52521', shirtColor: '#e52521', pantsColor: '#2b75d8',
    initial: 'M', letterCol: '#e52521'
  }), 1.6, 2.2);
}

function buildLuigiSprite() {
  return makeSpriteChar((ctx, s) => drawPlumber(ctx, s, {
    capColor: '#2e8b2e', shirtColor: '#2e8b2e', pantsColor: '#2b75d8',
    initial: 'L', letterCol: '#2e8b2e'
  }), 1.5, 2.4);
}

function buildWarioSprite() {
  return makeSpriteChar((ctx, s) => drawPlumber(ctx, s, {
    capColor: '#ffd400', shirtColor: '#ffd400', pantsColor: '#7020a0',
    initial: 'W', letterCol: '#7020a0', skin: '#ffb890',
    fat: 1.3, mustacheType: 'zigzag', noseBig: true
  }), 1.9, 2.2);
}
