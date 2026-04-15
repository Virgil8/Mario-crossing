/* =====================================================
   three-assets.js - Palette + constructeurs de modèles 3D
   ===================================================== */

const PAL3D = {
  sky:       0x87ceeb,
  grass:     0x58c242,
  grassDark: 0x2e8b2e,
  path:      0xe8c99b,
  pathEdge:  0xc8a46b,
  pipe:      0x3fa02e,
  pipeDark:  0x1e6e14,
  pipeLight: 0x66c957,
  brick:     0xc76b2a,
  brickDark: 0x7a3a10,
  block:     0xffd84a,
  blockDark: 0x8a6400,
  water:     0x3a95d8,
  waterFoam: 0xa0d8f0,
  sand:      0xf4d580,
  dirt:      0x6b3a1a,
  red:       0xe52521,
  blue:      0x2b75d8,
  green:     0x3fa02e,
  pink:      0xffb6d9,
  yellow:    0xffe400,
  purple:    0xa060d8,
  white:     0xffffff,
  skin:      0xffcc99,
  brown:     0x7a3a10,
  darkBrown: 0x3a2a1a,
};

// ---------- Helpers ----------
function mat(color, opts = {}) {
  return new THREE.MeshLambertMaterial({ color, ...opts });
}
function matBasic(color, opts = {}) {
  return new THREE.MeshBasicMaterial({ color, ...opts });
}
function box(w, h, d, color, opts) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, opts));
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}
function sphere(r, color, seg = 12, opts) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.max(6, seg / 2)), mat(color, opts));
  m.castShadow = true;
  return m;
}
function cyl(rt, rb, h, color, seg = 12, opts) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat(color, opts));
  m.castShadow = true;
  return m;
}

// ---------- Tuyau Mario ----------
function buildPipe(height = 2.5) {
  const g = new THREE.Group();

  const body = cyl(0.75, 0.75, height, PAL3D.pipe, 16);
  body.position.y = height / 2;
  g.add(body);

  // Bande verticale claire
  const hl = cyl(0.76, 0.76, height * 0.9, PAL3D.pipeLight, 16);
  hl.position.y = height / 2;
  hl.scale.x = 0.3;
  g.add(hl);

  const rim = cyl(0.95, 0.95, 0.35, PAL3D.pipe, 16);
  rim.position.y = height - 0.05;
  g.add(rim);

  const rimTop = cyl(1.0, 1.0, 0.12, PAL3D.pipeDark, 16);
  rimTop.position.y = height + 0.1;
  g.add(rimTop);

  // Trou sombre
  const hole = cyl(0.7, 0.7, 0.05, 0x0a2a0a, 16);
  hole.position.y = height + 0.16;
  g.add(hole);

  return g;
}

// ---------- Bloc "?" ----------
function buildQuestionBlock() {
  const g = new THREE.Group();
  const body = box(1, 1, 1, PAL3D.block);
  g.add(body);
  // Rivets sur 4 coins, 4 faces
  const rivetPositions = [
    [-0.4, 0.4, 0.51], [0.4, 0.4, 0.51], [-0.4, -0.4, 0.51], [0.4, -0.4, 0.51],
    [-0.4, 0.4, -0.51], [0.4, 0.4, -0.51], [-0.4, -0.4, -0.51], [0.4, -0.4, -0.51],
  ];
  for (const [x, y, z] of rivetPositions) {
    const r = box(0.08, 0.08, 0.02, PAL3D.blockDark);
    r.position.set(x, y, z);
    g.add(r);
  }
  // "?" sur face avant et arrière
  for (const z of [0.51, -0.51]) {
    const bar = box(0.1, 0.3, 0.02, PAL3D.blockDark);
    bar.position.set(0, 0.05, z);
    g.add(bar);
    const hook = box(0.3, 0.1, 0.02, PAL3D.blockDark);
    hook.position.set(0.1, 0.25, z);
    g.add(hook);
    const dot = box(0.1, 0.1, 0.02, PAL3D.blockDark);
    dot.position.set(0, -0.3, z);
    g.add(dot);
  }
  return g;
}

function buildBrick() {
  const g = new THREE.Group();
  g.add(box(1, 1, 1, PAL3D.brick));
  // Joints (cross pattern)
  const jointH = box(1.02, 0.04, 1.02, PAL3D.brickDark);
  g.add(jointH);
  const jointV = box(0.04, 0.5, 1.02, PAL3D.brickDark);
  jointV.position.set(0.25, 0.25, 0);
  g.add(jointV);
  const jointV2 = box(0.04, 0.5, 1.02, PAL3D.brickDark);
  jointV2.position.set(-0.25, -0.25, 0);
  g.add(jointV2);
  return g;
}

// ---------- Arbre rond style SMB ----------
function buildTree() {
  const g = new THREE.Group();

  const trunk = cyl(0.22, 0.28, 1.2, PAL3D.brown, 8);
  trunk.position.y = 0.6;
  g.add(trunk);

  // Feuillage : plusieurs sphères pour look cloud-top
  const f1 = sphere(1.0, PAL3D.grassDark, 10);
  f1.position.y = 1.8;
  g.add(f1);
  const f2 = sphere(0.75, PAL3D.grassDark, 8);
  f2.position.set(-0.6, 1.6, 0.3);
  g.add(f2);
  const f3 = sphere(0.75, PAL3D.grassDark, 8);
  f3.position.set(0.6, 1.6, -0.3);
  g.add(f3);
  const f4 = sphere(0.7, 0x6fd068, 8);
  f4.position.set(0, 2.3, 0);
  g.add(f4);

  g.userData.origY = g.position.y;
  return g;
}

// ---------- Fleur ----------
function buildFlower(color = PAL3D.red) {
  const g = new THREE.Group();
  const stem = cyl(0.03, 0.03, 0.3, 0x2a8020, 6);
  stem.position.y = 0.15;
  g.add(stem);
  // 5 pétales
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const p = sphere(0.08, color, 6);
    p.position.set(Math.cos(a) * 0.1, 0.32, Math.sin(a) * 0.1);
    g.add(p);
  }
  const center = sphere(0.07, PAL3D.yellow, 6);
  center.position.y = 0.34;
  g.add(center);
  return g;
}

// ---------- Pièce ----------
function buildCoin() {
  const g = new THREE.Group();
  const disk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 0.05, 16),
    new THREE.MeshLambertMaterial({ color: PAL3D.block, emissive: 0x442200 })
  );
  disk.rotation.x = Math.PI / 2;
  disk.castShadow = true;
  g.add(disk);
  return g;
}

// ---------- Nuage (billboard de sphères) ----------
function buildCloud() {
  const g = new THREE.Group();
  const m = matBasic(0xffffff);
  const puffs = [
    [0, 0, 0, 1.3], [1.5, 0.2, 0, 1.0],
    [-1.3, 0.1, 0, 1.1], [0.6, 0.5, 0, 0.9],
    [-0.6, 0.4, 0, 0.85]
  ];
  for (const [x, y, z, r] of puffs) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 6), m);
    s.position.set(x, y, z);
    g.add(s);
  }
  return g;
}

// ---------- Colline (décor lointain) ----------
function buildHill(size = 4) {
  const g = new THREE.Group();
  const h = sphere(size, PAL3D.grassDark, 16);
  h.scale.y = 0.5;
  g.add(h);
  const h2 = sphere(size * 0.7, 0x6fd068, 12);
  h2.position.set(0, size * 0.2, 0);
  h2.scale.y = 0.5;
  g.add(h2);
  return g;
}

// ---------- Champignon (item / PNJ Toad) ----------
function buildMushroom(capColor = PAL3D.red) {
  const g = new THREE.Group();
  const stem = cyl(0.22, 0.28, 0.4, 0xfff0d8, 10);
  stem.position.y = 0.2;
  g.add(stem);
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.45, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    mat(capColor)
  );
  cap.position.y = 0.4;
  cap.castShadow = true;
  g.add(cap);
  // pois blancs
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const dot = sphere(0.08, PAL3D.white, 6);
    dot.position.set(Math.cos(a) * 0.28, 0.55, Math.sin(a) * 0.28);
    g.add(dot);
  }
  const top = sphere(0.09, PAL3D.white, 6);
  top.position.y = 0.8;
  g.add(top);
  return g;
}

// ---------- Fleur de feu ----------
function buildFireFlower() {
  const g = new THREE.Group();
  const stem = cyl(0.04, 0.04, 0.4, 0x2a8020, 6);
  stem.position.y = 0.2;
  g.add(stem);
  const outer = sphere(0.2, PAL3D.red, 8);
  outer.position.y = 0.5;
  g.add(outer);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const p = sphere(0.12, 0xff9a1a, 6);
    p.position.set(Math.cos(a) * 0.18, 0.5, Math.sin(a) * 0.18);
    g.add(p);
  }
  const center = sphere(0.1, PAL3D.block, 6);
  center.position.y = 0.5;
  g.add(center);
  return g;
}

// ---------- Étoile ----------
function buildStar() {
  const g = new THREE.Group();
  const body = sphere(0.3, PAL3D.yellow, 10);
  body.material.emissive = new THREE.Color(0x554400);
  g.add(body);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    const spike = cyl(0.02, 0.15, 0.25, PAL3D.yellow, 4);
    spike.position.set(Math.cos(a) * 0.3, Math.sin(a) * 0.3, 0);
    spike.rotation.z = a - Math.PI / 2;
    g.add(spike);
  }
  return g;
}

// ---------- Poisson (Cheep-Cheep) ----------
function buildFish() {
  const g = new THREE.Group();
  const body = sphere(0.2, PAL3D.red, 8);
  body.scale.set(1.5, 1, 0.8);
  g.add(body);
  const tail = new THREE.Mesh(
    new THREE.ConeGeometry(0.15, 0.2, 4),
    mat(PAL3D.red)
  );
  tail.rotation.z = Math.PI / 2;
  tail.position.x = -0.3;
  g.add(tail);
  const eye = sphere(0.05, 0xffffff, 6);
  eye.position.set(0.2, 0.05, 0.15);
  g.add(eye);
  return g;
}

// ---------- Papillon ----------
function buildBug() {
  const g = new THREE.Group();
  const body = sphere(0.08, 0x4a1a6a, 6);
  body.scale.y = 1.6;
  g.add(body);
  // Ailes
  for (const x of [-0.15, 0.15]) {
    const wing = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 6, 4, 0, Math.PI),
      mat(0x9a40d0, { transparent: true, opacity: 0.85 })
    );
    wing.rotation.y = x > 0 ? 0 : Math.PI;
    wing.position.set(x, 0, 0);
    wing.scale.set(1, 0.1, 1);
    g.add(wing);
  }
  return g;
}

// ---------- Graine ----------
function buildSeed() {
  const g = new THREE.Group();
  const s = sphere(0.12, 0x6b3a1a, 6);
  g.add(s);
  return g;
}

// ---------- Bois ----------
function buildWood() {
  const g = new THREE.Group();
  const log = cyl(0.15, 0.15, 0.4, PAL3D.brown, 8);
  log.rotation.z = Math.PI / 2;
  g.add(log);
  return g;
}

// Dispatch par type d'item
function buildItem(kind) {
  switch (kind) {
    case 'mushroom':    return buildMushroom();
    case 'fire-flower': return buildFireFlower();
    case 'star':        return buildStar();
    case 'fish':        return buildFish();
    case 'bug':         return buildBug();
    case 'coin':        return buildCoin();
    case 'seed':        return buildSeed();
    case 'wood':        return buildWood();
    default:            return buildCoin();
  }
}

// ---------- Personnage Mario ----------
function buildCharacter({ cap, shirt, pants, skin, variant }) {
  const g = new THREE.Group();

  // --- Jambes ---
  const legL = cyl(0.12, 0.12, 0.55, pants, 8);
  legL.position.set(-0.16, 0.3, 0);
  g.add(legL);
  const legR = cyl(0.12, 0.12, 0.55, pants, 8);
  legR.position.set(0.16, 0.3, 0);
  g.add(legR);

  // --- Chaussures ---
  const shoeL = box(0.24, 0.12, 0.32, PAL3D.darkBrown);
  shoeL.position.set(-0.16, 0.06, 0.06);
  g.add(shoeL);
  const shoeR = box(0.24, 0.12, 0.32, PAL3D.darkBrown);
  shoeR.position.set(0.16, 0.06, 0.06);
  g.add(shoeR);

  // --- Torse (chemise) ---
  const torso = box(0.6, 0.5, 0.42, shirt);
  torso.position.y = 0.9;
  g.add(torso);

  // Salopette (devant)
  const overalls = box(0.5, 0.45, 0.44, pants);
  overalls.position.y = 0.8;
  g.add(overalls);
  // Bretelles
  for (const x of [-0.13, 0.13]) {
    const strap = box(0.08, 0.3, 0.02, pants);
    strap.position.set(x, 1.05, 0.22);
    g.add(strap);
  }
  // Boutons dorés
  for (const x of [-0.13, 0.13]) {
    const btn = sphere(0.04, PAL3D.block, 6);
    btn.position.set(x, 0.9, 0.23);
    g.add(btn);
  }

  // --- Bras ---
  const armL = cyl(0.1, 0.1, 0.45, shirt, 8);
  armL.position.set(-0.36, 0.95, 0);
  g.add(armL);
  const armR = cyl(0.1, 0.1, 0.45, shirt, 8);
  armR.position.set(0.36, 0.95, 0);
  g.add(armR);

  // --- Gants ---
  const handL = sphere(0.13, PAL3D.white, 8);
  handL.position.set(-0.36, 0.68, 0);
  g.add(handL);
  const handR = sphere(0.13, PAL3D.white, 8);
  handR.position.set(0.36, 0.68, 0);
  g.add(handR);

  // --- Tête ---
  const head = sphere(0.28, skin, 12);
  head.position.y = 1.42;
  g.add(head);

  // Oreilles
  for (const x of [-0.27, 0.27]) {
    const ear = sphere(0.06, skin, 6);
    ear.position.set(x, 1.42, 0);
    g.add(ear);
  }

  // Yeux
  for (const x of [-0.1, 0.1]) {
    const eyeWhite = sphere(0.06, PAL3D.white, 6);
    eyeWhite.position.set(x, 1.45, 0.22);
    g.add(eyeWhite);
    const pupil = sphere(0.025, 0x000000, 4);
    pupil.position.set(x, 1.45, 0.27);
    g.add(pupil);
  }

  // Nez
  const nose = sphere(0.08, skin, 6);
  nose.position.set(0, 1.37, 0.27);
  g.add(nose);

  // Moustache
  if (variant !== 'princess' && variant !== 'toad' && variant !== 'shy') {
    const mL = box(0.12, 0.05, 0.1, PAL3D.darkBrown);
    mL.position.set(-0.08, 1.28, 0.25);
    g.add(mL);
    const mR = box(0.12, 0.05, 0.1, PAL3D.darkBrown);
    mR.position.set(0.08, 1.28, 0.25);
    g.add(mR);
  }

  // --- Casquette ---
  if (variant === 'toad') {
    // Gros champignon pour Toad
    const m = buildMushroom(PAL3D.red);
    m.scale.set(0.9, 0.9, 0.9);
    m.position.y = 1.45;
    g.add(m);
    // Cache la tête sous le champignon
    head.scale.set(0.9, 0.9, 0.9);
  } else if (variant === 'princess') {
    // Couronne
    const crown = cyl(0.22, 0.24, 0.1, PAL3D.yellow, 8);
    crown.position.y = 1.72;
    g.add(crown);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const spike = new THREE.Mesh(
        new THREE.ConeGeometry(0.04, 0.1, 4),
        mat(PAL3D.yellow)
      );
      spike.position.set(Math.cos(a) * 0.2, 1.82, Math.sin(a) * 0.2);
      g.add(spike);
      const gem = sphere(0.03, PAL3D.red, 6);
      gem.position.set(Math.cos(a) * 0.2, 1.86, Math.sin(a) * 0.2);
      g.add(gem);
    }
    // Cheveux blonds
    const hair = sphere(0.32, PAL3D.yellow, 10);
    hair.position.set(0, 1.4, -0.05);
    hair.scale.set(1, 1.1, 1.05);
    g.add(hair);
  } else if (variant === 'shy') {
    // Masque blanc
    const mask = new THREE.Mesh(
      new THREE.SphereGeometry(0.29, 12, 8),
      mat(0xf0e0c0)
    );
    mask.position.set(0, 1.42, 0.05);
    mask.scale.z = 0.9;
    g.add(mask);
    // Yeux noirs percés
    for (const x of [-0.09, 0.09]) {
      const hole = box(0.05, 0.07, 0.02, 0x000000);
      hole.position.set(x, 1.45, 0.3);
      g.add(hole);
    }
    // Capuche
    const hood = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 10, 8, 0, Math.PI * 2, 0, Math.PI / 1.5),
      mat(cap)
    );
    hood.position.y = 1.48;
    g.add(hood);
  } else {
    // Casquette classique Mario
    const capTop = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      mat(cap)
    );
    capTop.position.y = 1.55;
    capTop.castShadow = true;
    g.add(capTop);
    const capBrim = box(0.55, 0.06, 0.15, cap);
    capBrim.position.set(0, 1.52, 0.25);
    g.add(capBrim);
    // Logo blanc
    const logoBg = sphere(0.1, PAL3D.white, 8);
    logoBg.scale.z = 0.1;
    logoBg.position.set(0, 1.58, 0.28);
    g.add(logoBg);
  }

  // Dinosaure Yoshi : queue + crête
  if (variant === 'yoshi') {
    const tail = cyl(0.1, 0.2, 0.5, shirt, 8);
    tail.position.set(0, 0.8, -0.3);
    tail.rotation.x = Math.PI / 3;
    g.add(tail);
    const shell = sphere(0.28, PAL3D.white, 10);
    shell.scale.y = 0.5;
    shell.position.set(0, 0.9, -0.2);
    g.add(shell);
  }

  g.traverse(o => { if (o.isMesh) o.castShadow = true; });

  g.userData.legL = legL;
  g.userData.legR = legR;
  g.userData.armL = armL;
  g.userData.armR = armR;
  g.userData.shoeL = shoeL;
  g.userData.shoeR = shoeR;

  return g;
}

function animateWalk(character, time, walking, speedFactor = 1) {
  const ud = character.userData;
  if (!walking) {
    ud.legL.rotation.x = 0;
    ud.legR.rotation.x = 0;
    ud.shoeL.rotation.x = 0;
    ud.shoeR.rotation.x = 0;
    ud.armL.rotation.x = 0;
    ud.armR.rotation.x = 0;
    return;
  }
  const t = time * 0.008 * speedFactor;
  const swing = Math.sin(t) * 0.6;
  ud.legL.rotation.x = swing;
  ud.legR.rotation.x = -swing;
  ud.shoeL.rotation.x = swing;
  ud.shoeR.rotation.x = -swing;
  ud.armL.rotation.x = -swing * 0.4;
  ud.armR.rotation.x = swing * 0.4;
}
