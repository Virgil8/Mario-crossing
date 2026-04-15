/* =====================================================
   three-world.js - Génération du monde 3D + PNJ + colliders
   ===================================================== */

const WORLD_SIZE = 50;
const COLLIDERS = [];     // { x, z, radius, type, ref? }
const NPCS_3D = [];       // { id, name, dialogs, shop, mesh, x, z, ... }
const TREES_3D = [];      // { mesh, x, z, shaken, regrowAt }
const CROPS_3D = [];      // { mesh, x, z, plantedAt, stage, watered, tilled }
const DROPS_3D = [];      // { kind, mesh, x, z, spawnedAt }
const WATER_AREAS = [];   // { x, z, radius }
const TILLED_AREAS = [];  // { x, z, mesh }

function buildWorld(scene) {
  COLLIDERS.length = 0;
  NPCS_3D.length = 0;
  TREES_3D.length = 0;
  CROPS_3D.length = 0;
  DROPS_3D.length = 0;
  WATER_AREAS.length = 0;
  TILLED_AREAS.length = 0;

  // ---------- Sol en herbe ----------
  const groundGeo = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, 32, 32);
  // Subtile variation de relief
  const pos = groundGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i);
    pos.setZ(i, Math.sin(x * 0.3) * 0.05 + Math.cos(y * 0.25) * 0.05);
  }
  groundGeo.computeVertexNormals();
  const ground = new THREE.Mesh(groundGeo, mat(PAL3D.grass));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // ---------- Chemins en croix ----------
  const pathMat = mat(PAL3D.path);
  const pathH = new THREE.Mesh(new THREE.PlaneGeometry(WORLD_SIZE, 3), pathMat);
  pathH.rotation.x = -Math.PI / 2;
  pathH.position.y = 0.02;
  pathH.receiveShadow = true;
  scene.add(pathH);
  const pathV = new THREE.Mesh(new THREE.PlaneGeometry(3, WORLD_SIZE), pathMat);
  pathV.rotation.x = -Math.PI / 2;
  pathV.position.y = 0.02;
  pathV.receiveShadow = true;
  scene.add(pathV);

  // Place centrale (chemin plus large)
  const plaza = new THREE.Mesh(new THREE.CircleGeometry(4, 24), pathMat);
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.y = 0.021;
  plaza.receiveShadow = true;
  scene.add(plaza);

  // ---------- Étang (zone de pêche) ----------
  const pondX = -12, pondZ = -10, pondR = 4;

  // Sable autour
  const sandGeo = new THREE.CircleGeometry(pondR + 1, 24);
  const sand = new THREE.Mesh(sandGeo, mat(PAL3D.sand));
  sand.rotation.x = -Math.PI / 2;
  sand.position.set(pondX, 0.025, pondZ);
  scene.add(sand);

  // Eau
  const pondGeo = new THREE.CircleGeometry(pondR, 32);
  const pondMat = mat(PAL3D.water, { transparent: true, opacity: 0.88 });
  const pond = new THREE.Mesh(pondGeo, pondMat);
  pond.rotation.x = -Math.PI / 2;
  pond.position.set(pondX, 0.04, pondZ);
  pond.userData.isWater = true;
  scene.add(pond);
  WATER_AREAS.push({ x: pondX, z: pondZ, radius: pondR, mesh: pond });

  // ---------- Village de tuyaux (zone nord) ----------
  const pipeSpots = [[-2, -16, 2.5], [0, -16, 3.2], [2, -16, 2.5]];
  for (const [x, z, h] of pipeSpots) {
    const p = buildPipe(h);
    p.position.set(x, 0, z);
    scene.add(p);
    COLLIDERS.push({ x, z, radius: 1.0, type: 'pipe' });
  }

  // ---------- Bloc "?" qui flotte ----------
  const qb = buildQuestionBlock();
  qb.position.set(6, 1.3, -14);
  scene.add(qb);
  qb.userData.spawnY = 1.3;
  qb.userData.isBlock = true;
  COLLIDERS.push({ x: 6, z: -14, radius: 0.6, type: 'block', ref: qb });

  // ---------- Mur de briques ----------
  for (let i = 0; i < 5; i++) {
    const b = buildBrick();
    b.position.set(-6 + i * 1.0, 0.5, -14);
    scene.add(b);
    COLLIDERS.push({ x: -6 + i * 1.0, z: -14, radius: 0.5, type: 'brick' });
  }
  // 2e étage de briques
  for (let i = 0; i < 3; i++) {
    const b = buildBrick();
    b.position.set(-5 + i * 1.0, 1.5, -14);
    scene.add(b);
  }

  // ---------- Zone ferme (SE) avec parcelles labourées ----------
  const farmMat = mat(PAL3D.dirt);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const dirt = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.2), farmMat);
      dirt.rotation.x = -Math.PI / 2;
      const x = 10 + i * 1.5, z = 10 + j * 1.5;
      dirt.position.set(x, 0.03, z);
      dirt.receiveShadow = true;
      scene.add(dirt);
      TILLED_AREAS.push({ x, z, mesh: dirt });
    }
  }

  // ---------- Arbres ----------
  const treeSpots = [
    [-18, -18], [-15, -15], [-20, -8], [-18, 0], [-15, 8],
    [-10, 15], [-5, 18], [5, 18], [12, 15], [18, 10],
    [20, 0], [18, -8], [15, -15], [8, -18], [-3, -18],
    [-22, 5], [22, 5], [-10, -22], [10, -22],
    [16, 18], [-16, 18], [0, 20], [-20, 15]
  ];
  for (const [x, z] of treeSpots) {
    // éviter chemins et étang
    if (Math.abs(x) < 2.5 && Math.abs(z) < 25) continue;
    if (Math.abs(z) < 2.5 && Math.abs(x) < 25) continue;
    if (Math.hypot(x - pondX, z - pondZ) < pondR + 1.5) continue;
    const tree = buildTree();
    tree.position.set(x, 0, z);
    scene.add(tree);
    const entry = { mesh: tree, x, z, shaken: false, regrowAt: 0, shakeUntil: 0 };
    TREES_3D.push(entry);
    COLLIDERS.push({ x, z, radius: 0.5, type: 'tree', ref: entry });
  }

  // ---------- Fleurs ----------
  const flowerColors = [PAL3D.red, PAL3D.yellow, PAL3D.pink, 0x80c8ff, 0xd080ff, PAL3D.white];
  for (let i = 0; i < 80; i++) {
    const x = (Math.random() - 0.5) * 44;
    const z = (Math.random() - 0.5) * 44;
    if (Math.abs(x) < 2 || Math.abs(z) < 2) continue;
    if (Math.hypot(x - pondX, z - pondZ) < pondR + 1) continue;
    if (Math.hypot(x, z) < 4) continue;
    const c = flowerColors[Math.floor(Math.random() * flowerColors.length)];
    const f = buildFlower(c);
    f.position.set(x, 0, z);
    scene.add(f);
  }

  // ---------- Nuages dans le ciel ----------
  for (let i = 0; i < 10; i++) {
    const c = buildCloud();
    c.position.set(
      (Math.random() - 0.5) * 80,
      12 + Math.random() * 6,
      (Math.random() - 0.5) * 80
    );
    c.userData.speed = 0.002 + Math.random() * 0.004;
    c.userData.isCloud = true;
    scene.add(c);
  }

  // ---------- Collines à l'horizon ----------
  for (let i = 0; i < 14; i++) {
    const ang = (i / 14) * Math.PI * 2;
    const r = 34;
    const hill = buildHill(3 + Math.random() * 3);
    hill.position.set(Math.cos(ang) * r, -1.5, Math.sin(ang) * r);
    scene.add(hill);
  }

  // Montagne lointaine (fond)
  const mountain = new THREE.Mesh(
    new THREE.ConeGeometry(10, 14, 8),
    mat(0x6b7a8a)
  );
  mountain.position.set(-30, 5, -30);
  scene.add(mountain);
  const snowCap = new THREE.Mesh(
    new THREE.ConeGeometry(4, 5, 8),
    mat(PAL3D.white)
  );
  snowCap.position.set(-30, 10.5, -30);
  scene.add(snowCap);

  // ---------- Pièces flottantes (décoratives, ramassables) ----------
  const coinSpots = [[0, 0], [5, 0], [-5, 0], [0, 5], [0, -5]];
  for (const [x, z] of coinSpots) {
    const c = buildCoin();
    c.position.set(x, 1.2, z);
    c.userData.isCoin = true;
    c.userData.spawnY = 1.2;
    scene.add(c);
    DROPS_3D.push({ kind: 'coin', mesh: c, x, z, spawnedAt: 0 });
  }

  // ---------- Maisons (cubes décoratifs avec toit) ----------
  buildHouse(scene, 15, -15, PAL3D.red);
  buildHouse(scene, -16, 13, 0xffb6d9);
  buildHouse(scene, 18, 18, 0x6fd068);

  // ---------- Panneaux indicateurs ----------
  addSign(scene, 3, 0, "🍄 Place du village");
  addSign(scene, -5, -8, "🐟 Étang");
  addSign(scene, 8, 8, "🌱 Ferme");
  addSign(scene, 0, -11, "🏪 Boutique");

  // ---------- PNJ ----------
  const npcDefs = [
    {
      id: 'toad', name: 'Toad', x: 0, z: -11.5,
      colors: { cap: PAL3D.red, shirt: PAL3D.white, pants: 0xa03030, skin: PAL3D.skin, variant: 'toad' },
      dialogs: [
        "Bienvenue à la boutique ! Je rachète tes trouvailles à bon prix.",
        "Tu sais qu'en secouant les arbres on trouve parfois des pièces ?",
        "As-tu essayé de pêcher dans l'étang ? Les Cheep-Cheep y sont délicieux."
      ],
      shop: true
    },
    {
      id: 'luigi', name: 'Luigi', x: -8, z: 3,
      colors: { cap: 0x2e8b2e, shirt: 0x2e8b2e, pants: PAL3D.blue, skin: PAL3D.skin },
      dialogs: [
        "Mamma mia, quel temps magnifique !",
        "J'ai vu un Cheep Cheep ÉNORME dans l'étang l'autre jour !",
        "Tu devrais planter des graines dans la ferme."
      ]
    },
    {
      id: 'peach', name: 'Peach', x: 8, z: -3,
      colors: { cap: PAL3D.pink, shirt: PAL3D.pink, pants: PAL3D.yellow, skin: PAL3D.skin, variant: 'princess' },
      dialogs: [
        "Oh, quelle belle journée ! Les fleurs sont magnifiques.",
        "Si tu cueilles des fleurs de feu, je t'en serais reconnaissante.",
        "Le jour et la nuit passent vite ici, profite bien !"
      ]
    },
    {
      id: 'yoshi', name: 'Yoshi', x: 10, z: 12,
      colors: { cap: 0x5dc14f, shirt: 0x5dc14f, pants: PAL3D.white, skin: 0x5dc14f, variant: 'yoshi' },
      dialogs: [
        "Yoshi yoshi ! (Salut l'ami !)",
        "Les champignons que tu fais pousser sont délicieux !",
        "Si tu attrapes des papillons, je serai ton ami pour toujours."
      ]
    },
    {
      id: 'shyguy', name: 'Maskass', x: -12, z: -10,
      colors: { cap: 0xb02020, shirt: 0xb02020, pants: 0x602020, skin: 0xe8a080, variant: 'shy' },
      dialogs: [
        "...",
        "(Il te fait un signe timide)",
        "J'aime bien ta casquette."
      ]
    }
  ];

  for (const def of npcDefs) {
    const mesh = buildCharacter(def.colors);
    mesh.position.set(def.x, 0, def.z);
    mesh.rotation.y = Math.atan2(-def.x, -def.z);
    scene.add(mesh);

    // Étiquette de nom (sprite)
    const label = makeNameLabel(def.name);
    label.position.set(0, 2.2, 0);
    mesh.add(label);

    NPCS_3D.push({ ...def, mesh, idleTimer: Math.random() * 2 });
    COLLIDERS.push({ x: def.x, z: def.z, radius: 0.4, type: 'npc' });
  }
}

// ---------- Maison ----------
function buildHouse(scene, x, z, roofColor) {
  const g = new THREE.Group();
  const walls = box(3, 2.5, 3, 0xf4d8a0);
  walls.position.y = 1.25;
  g.add(walls);
  // Toit
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(2.4, 1.5, 4),
    mat(roofColor)
  );
  roof.position.y = 3.25;
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  g.add(roof);
  // Porte
  const door = box(0.7, 1.2, 0.1, PAL3D.brown);
  door.position.set(0, 0.6, 1.55);
  g.add(door);
  const handle = sphere(0.05, PAL3D.yellow, 6);
  handle.position.set(0.2, 0.7, 1.61);
  g.add(handle);
  // Fenêtres
  for (const fx of [-0.8, 0.8]) {
    const win = box(0.5, 0.5, 0.05, 0x80c8ff);
    win.position.set(fx, 1.7, 1.53);
    g.add(win);
    const frame = box(0.55, 0.05, 0.06, PAL3D.white);
    frame.position.set(fx, 1.7, 1.54);
    g.add(frame);
    const frame2 = box(0.05, 0.55, 0.06, PAL3D.white);
    frame2.position.set(fx, 1.7, 1.54);
    g.add(frame2);
  }
  // Cheminée
  const chim = box(0.3, 0.8, 0.3, PAL3D.brick);
  chim.position.set(0.8, 3.5, 0);
  g.add(chim);

  g.position.set(x, 0, z);
  scene.add(g);
  COLLIDERS.push({ x, z, radius: 2.2, type: 'house' });
  return g;
}

// ---------- Panneau ----------
function addSign(scene, x, z, text) {
  const g = new THREE.Group();
  const pole = cyl(0.05, 0.05, 0.8, PAL3D.brown, 6);
  pole.position.y = 0.4;
  g.add(pole);
  const board = box(1.2, 0.5, 0.08, PAL3D.brown);
  board.position.y = 0.85;
  g.add(board);
  const face = makeTextPlate(text, 200, 80, '#fff8d0', '#3a2a0a');
  face.position.set(0, 0.85, 0.05);
  face.scale.set(1.1, 0.46, 1);
  g.add(face);
  g.position.set(x, 0, z);
  scene.add(g);
}

// ---------- Texture de texte ----------
function makeTextPlate(text, w = 256, h = 64, bg = '#fff8d0', fg = '#3a2a0a') {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = fg;
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, w - 4, h - 4);
  ctx.fillStyle = fg;
  ctx.font = 'bold 26px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, w / 2, h / 2);
  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
  return plane;
}

// ---------- Sprite-label (toujours face caméra) ----------
function makeNameLabel(text) {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  roundRect(ctx, 28, 10, 200, 44, 10);
  ctx.fill();
  ctx.fillStyle = '#ffe400';
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 32);
  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(2, 0.5, 1);
  sprite.renderOrder = 999;
  return sprite;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// ---------- Collision ----------
function isBlockedAt(x, z, radius = 0.3) {
  if (Math.abs(x) > WORLD_SIZE / 2 - 1) return true;
  if (Math.abs(z) > WORLD_SIZE / 2 - 1) return true;
  for (const c of COLLIDERS) {
    if (c.type === 'tree' && c.ref && c.ref.shaken) continue; // can walk through shaken tree? no, keep it
    const dx = x - c.x, dz = z - c.z;
    if (dx * dx + dz * dz < (c.radius + radius) ** 2) return true;
  }
  // Water blocks movement (you can walk to the sand edge only)
  for (const w of WATER_AREAS) {
    const dx = x - w.x, dz = z - w.z;
    if (dx * dx + dz * dz < (w.radius - 0.2) ** 2) return true;
  }
  return false;
}

function isNearWater(x, z, reach = 1.2) {
  for (const w of WATER_AREAS) {
    const dx = x - w.x, dz = z - w.z;
    const d = Math.sqrt(dx * dx + dz * dz);
    if (d > w.radius - 0.3 && d < w.radius + reach) return w;
  }
  return null;
}

function findNearestTilled(x, z, maxDist = 1.5) {
  let best = null, bestD = maxDist;
  for (const t of TILLED_AREAS) {
    const d = Math.hypot(x - t.x, z - t.z);
    if (d < bestD) { best = t; bestD = d; }
  }
  return best;
}

function findNearestTree(x, z, maxDist = 1.8) {
  let best = null, bestD = maxDist;
  for (const t of TREES_3D) {
    const d = Math.hypot(x - t.x, z - t.z);
    if (d < bestD) { best = t; bestD = d; }
  }
  return best;
}

function findNearbyNPC3D(x, z, maxDist = 1.6) {
  let best = null, bestD = maxDist;
  for (const n of NPCS_3D) {
    const d = Math.hypot(x - n.x, z - n.z);
    if (d < bestD) { best = n; bestD = d; }
  }
  return best;
}
