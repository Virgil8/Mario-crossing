/* =====================================================
   three-world.js - Génération du monde 3D + PNJ + colliders
   ===================================================== */

const WORLD_SIZE = 90;
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

  // Initialise les textures procédurales
  initTextures();

  // ---------- Sol en herbe texturée ----------
  const groundGeo = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, 60, 60);
  const pos = groundGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i);
    pos.setZ(i,
      Math.sin(x * 0.15) * 0.15 +
      Math.cos(y * 0.12) * 0.15 +
      Math.sin((x + y) * 0.08) * 0.1
    );
  }
  groundGeo.computeVertexNormals();
  const ground = new THREE.Mesh(groundGeo, texMat(TEX.grass));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // ---------- Chemins en croix (texture pierre) ----------
  const pathMat = texMat(TEX.stone);
  const pathH = new THREE.Mesh(new THREE.PlaneGeometry(WORLD_SIZE, 4), pathMat);
  pathH.rotation.x = -Math.PI / 2;
  pathH.position.y = 0.02;
  pathH.receiveShadow = true;
  scene.add(pathH);
  const pathV = new THREE.Mesh(new THREE.PlaneGeometry(4, WORLD_SIZE), pathMat);
  pathV.rotation.x = -Math.PI / 2;
  pathV.position.y = 0.02;
  pathV.receiveShadow = true;
  scene.add(pathV);
  TEX.stone.repeat.set(WORLD_SIZE / 4, 1);

  // Place centrale (chemin plus large)
  const plaza = new THREE.Mesh(new THREE.CircleGeometry(4, 24), pathMat);
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.y = 0.021;
  plaza.receiveShadow = true;
  scene.add(plaza);

  // ---------- Grand lac ----------
  const pondX = -22, pondZ = -14, pondR = 7;
  const sand = new THREE.Mesh(new THREE.CircleGeometry(pondR + 1.5, 32), texMat(TEX.sand));
  sand.rotation.x = -Math.PI / 2;
  sand.position.set(pondX, 0.025, pondZ);
  sand.receiveShadow = true;
  scene.add(sand);
  const pondMat = texMat(TEX.water, { transparent: true, opacity: 0.85 });
  const pond = new THREE.Mesh(new THREE.CircleGeometry(pondR, 48), pondMat);
  pond.rotation.x = -Math.PI / 2;
  pond.position.set(pondX, 0.04, pondZ);
  pond.userData.isWater = true;
  scene.add(pond);
  WATER_AREAS.push({ x: pondX, z: pondZ, radius: pondR, mesh: pond });

  // Petit étang à l'est
  const pond2Mat = texMat(TEX.water, { transparent: true, opacity: 0.85 });
  const pond2 = new THREE.Mesh(new THREE.CircleGeometry(3, 32), pond2Mat);
  pond2.rotation.x = -Math.PI / 2;
  pond2.position.set(25, 0.04, 18);
  pond2.userData.isWater = true;
  scene.add(pond2);
  WATER_AREAS.push({ x: 25, z: 18, radius: 3, mesh: pond2 });
  const sand2 = new THREE.Mesh(new THREE.CircleGeometry(4, 24), texMat(TEX.sand));
  sand2.rotation.x = -Math.PI / 2;
  sand2.position.set(25, 0.025, 18);
  scene.add(sand2);

  // ---------- Village de tuyaux (zone nord, 5 tailles) ----------
  const pipeSpots = [
    [-5, -20, 2.0], [-2.5, -20, 2.8], [0, -20, 3.5],
    [2.5, -20, 2.8], [5, -20, 2.0],
    [-30, 10, 3.0], [30, -5, 2.5]
  ];
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

  // ---------- Zone ferme avec parcelles labourées texturées ----------
  const farmMat = texMat(TEX.dirt);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const dirt = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.3), farmMat);
      dirt.rotation.x = -Math.PI / 2;
      const x = 14 + i * 1.6, z = 10 + j * 1.6;
      dirt.position.set(x, 0.03, z);
      dirt.receiveShadow = true;
      scene.add(dirt);
      TILLED_AREAS.push({ x, z, mesh: dirt });
    }
  }
  // Barrière en bois autour de la ferme
  const fenceMat = texMat(TEX.wood);
  for (let x = 13; x <= 21; x += 1) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.8, 0.15), fenceMat);
    post.position.set(x, 0.4, 8.5);
    scene.add(post);
    const post2 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.8, 0.15), fenceMat);
    post2.position.set(x, 0.4, 17);
    scene.add(post2);
  }
  for (let z = 8.5; z <= 17; z += 1) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.8, 0.15), fenceMat);
    post.position.set(13, 0.4, z);
    scene.add(post);
    const post2 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.8, 0.15), fenceMat);
    post2.position.set(21, 0.4, z);
    scene.add(post2);
  }

  // ---------- Forêt d'arbres (densité accrue) ----------
  const rngT = mulberry32(123);
  for (let i = 0; i < 80; i++) {
    const x = (rngT() - 0.5) * (WORLD_SIZE - 8);
    const z = (rngT() - 0.5) * (WORLD_SIZE - 8);
    if (Math.abs(x) < 3 && Math.abs(z) < WORLD_SIZE / 2) continue;
    if (Math.abs(z) < 3 && Math.abs(x) < WORLD_SIZE / 2) continue;
    if (Math.hypot(x - pondX, z - pondZ) < pondR + 2) continue;
    if (Math.hypot(x - 25, z - 18) < 5) continue; // étang 2
    // Éviter proche des zones de bâtiments (nous les ajoutons plus bas)
    if (Math.hypot(x - 20, z + 25) < 10) continue; // château Peach
    if (Math.hypot(x + 25, z - 30) < 8) continue; // château Bowser
    if (Math.hypot(x + 15, z + 10) < 7) continue; // maison Mario
    if (Math.hypot(x - 30, z + 20) < 7) continue; // manoir Luigi
    // Ferme
    if (x > 12 && x < 22 && z > 8 && z < 18) continue;
    const tree = buildTree();
    tree.position.set(x, 0, z);
    tree.scale.setScalar(0.8 + rngT() * 0.5);
    tree.rotation.y = rngT() * Math.PI * 2;
    scene.add(tree);
    const entry = { mesh: tree, x, z, shaken: false, regrowAt: 0, shakeUntil: 0 };
    TREES_3D.push(entry);
    COLLIDERS.push({ x, z, radius: 0.5, type: 'tree', ref: entry });
  }

  // Petit PRNG utilitaire
  function mulberry32(a) {
    return function () {
      let t = (a += 0x6D2B79F5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ---------- Fleurs (en clusters) ----------
  const flowerColors = [PAL3D.red, PAL3D.yellow, PAL3D.pink, 0x80c8ff, 0xd080ff, PAL3D.white];
  for (let cluster = 0; cluster < 25; cluster++) {
    const cx = (Math.random() - 0.5) * (WORLD_SIZE - 6);
    const cz = (Math.random() - 0.5) * (WORLD_SIZE - 6);
    if (Math.abs(cx) < 3 || Math.abs(cz) < 3) continue;
    if (Math.hypot(cx - pondX, cz - pondZ) < pondR + 1.5) continue;
    const c = flowerColors[Math.floor(Math.random() * flowerColors.length)];
    for (let j = 0; j < 6; j++) {
      const f = buildFlower(c);
      f.position.set(cx + (Math.random() - 0.5) * 2.5, 0, cz + (Math.random() - 0.5) * 2.5);
      f.scale.setScalar(0.8 + Math.random() * 0.5);
      scene.add(f);
    }
  }
  // Fleurs isolées
  for (let i = 0; i < 40; i++) {
    const x = (Math.random() - 0.5) * (WORLD_SIZE - 6);
    const z = (Math.random() - 0.5) * (WORLD_SIZE - 6);
    if (Math.abs(x) < 2.5 || Math.abs(z) < 2.5) continue;
    const c = flowerColors[Math.floor(Math.random() * flowerColors.length)];
    const f = buildFlower(c);
    f.position.set(x, 0, z);
    scene.add(f);
  }

  // ---------- Rochers ----------
  for (let i = 0; i < 12; i++) {
    const x = (Math.random() - 0.5) * (WORLD_SIZE - 6);
    const z = (Math.random() - 0.5) * (WORLD_SIZE - 6);
    if (Math.abs(x) < 4 || Math.abs(z) < 4) continue;
    if (Math.hypot(x - pondX, z - pondZ) < pondR + 1) continue;
    const rock = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.5 + Math.random() * 0.6),
      mat(0x888888)
    );
    rock.position.set(x, 0.3, z);
    rock.rotation.set(Math.random(), Math.random(), Math.random());
    rock.castShadow = true;
    scene.add(rock);
    COLLIDERS.push({ x, z, radius: 0.7, type: 'rock' });
  }

  // ---------- Nuages (plus nombreux, plus haut) ----------
  for (let i = 0; i < 16; i++) {
    const c = buildCloud();
    c.position.set(
      (Math.random() - 0.5) * 120,
      15 + Math.random() * 8,
      (Math.random() - 0.5) * 120
    );
    c.userData.speed = 0.002 + Math.random() * 0.005;
    c.userData.isCloud = true;
    scene.add(c);
  }

  // ---------- Lampadaires ----------
  const lampSpots = [[-6, -6], [6, -6], [-6, 6], [6, 6], [-15, 0], [15, 0], [0, -15], [0, 15]];
  for (const [x, z] of lampSpots) {
    const base = cyl(0.15, 0.2, 0.3, 0x333333, 8);
    base.position.set(x, 0.15, z);
    scene.add(base);
    const pole = cyl(0.08, 0.08, 2.5, 0x222222, 8);
    pole.position.set(x, 1.5, z);
    scene.add(pole);
    const lantern = sphere(0.3, 0xffffa0, 10);
    lantern.material.emissive = new THREE.Color(0xffaa00);
    lantern.material.emissiveIntensity = 0.4;
    lantern.position.set(x, 2.9, z);
    scene.add(lantern);
    lantern.userData.isLantern = true;
    const pl = new THREE.PointLight(0xffcc66, 0.5, 8);
    pl.position.set(x, 2.9, z);
    pl.userData.isLampLight = true;
    scene.add(pl);
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

  // ---------- Bâtiments emblématiques ----------
  const peachCastle = buildPeachCastle();
  peachCastle.position.set(20, 0, 25);
  peachCastle.rotation.y = -Math.PI / 2;
  scene.add(peachCastle);
  COLLIDERS.push({ x: 20, z: 25, radius: 5, type: 'building' });

  const bowserCastle = buildBowserCastle();
  bowserCastle.position.set(-28, 0, -30);
  bowserCastle.rotation.y = Math.PI / 4;
  scene.add(bowserCastle);
  COLLIDERS.push({ x: -28, z: -30, radius: 7, type: 'building' });

  const marioHouse = buildMarioHouse();
  marioHouse.position.set(-15, 0, 10);
  marioHouse.rotation.y = -0.3;
  scene.add(marioHouse);
  COLLIDERS.push({ x: -15, z: 10, radius: 2.5, type: 'building' });

  const luigiMansion = buildLuigiMansion();
  luigiMansion.position.set(-32, 0, 20);
  luigiMansion.rotation.y = 0.4;
  scene.add(luigiMansion);
  COLLIDERS.push({ x: -32, z: 20, radius: 3, type: 'building' });

  const toadHouse = buildToadHouse();
  toadHouse.position.set(0, 0, -12);
  scene.add(toadHouse);
  COLLIDERS.push({ x: 0, z: -12, radius: 2.5, type: 'building' });

  const yoshiHouse = buildYoshiEggHouse();
  yoshiHouse.position.set(32, 0, 10);
  scene.add(yoshiHouse);
  COLLIDERS.push({ x: 32, z: 10, radius: 2.8, type: 'building' });

  // ---------- Panneaux indicateurs ----------
  addSign(scene, 4, 0, "🍄 Place centrale");
  addSign(scene, -17, -10, "🐟 Grand Lac");
  addSign(scene, 12, 8, "🌱 Ferme");
  addSign(scene, 0, -8, "🏪 Boutique de Toad");
  addSign(scene, 14, 20, "👑 Château de Peach");
  addSign(scene, -20, -22, "🔥 Château de Bowser");
  addSign(scene, -10, 8, "🔴 Maison de Mario");
  addSign(scene, -26, 16, "👻 Manoir de Luigi");
  addSign(scene, 28, 8, "🦖 Maison de Yoshi");

  // ---------- PNJ ----------
  const npcDefs = [
    {
      id: 'toad', name: 'Toad', x: 0, z: -9,
      colors: { cap: PAL3D.red, shirt: PAL3D.white, pants: 0xa03030, skin: PAL3D.skin, variant: 'toad' },
      dialogs: [
        "Bienvenue à la boutique ! Je rachète tes trouvailles à bon prix.",
        "Tu sais qu'en secouant les arbres on trouve parfois des pièces ?",
        "As-tu essayé de pêcher dans l'étang ? Les Cheep-Cheep y sont délicieux."
      ],
      shop: true
    },
    {
      id: 'luigi', name: 'Luigi', x: -28, z: 18,
      colors: { cap: 0x2e8b2e, shirt: 0x2e8b2e, pants: PAL3D.blue, skin: PAL3D.skin },
      dialogs: [
        "Mamma mia, quel temps magnifique !",
        "J'ai vu un Cheep Cheep ÉNORME dans l'étang l'autre jour !",
        "Tu devrais planter des graines dans la ferme."
      ]
    },
    {
      id: 'peach', name: 'Peach', x: 16, z: 22,
      colors: { cap: PAL3D.pink, shirt: PAL3D.pink, pants: PAL3D.yellow, skin: PAL3D.skin, variant: 'princess' },
      dialogs: [
        "Oh, quelle belle journée ! Les fleurs sont magnifiques.",
        "Si tu cueilles des fleurs de feu, je t'en serais reconnaissante.",
        "Le jour et la nuit passent vite ici, profite bien !"
      ]
    },
    {
      id: 'yoshi', name: 'Yoshi', x: 28, z: 10,
      colors: { cap: 0x5dc14f, shirt: 0x5dc14f, pants: PAL3D.white, skin: 0x5dc14f, variant: 'yoshi' },
      dialogs: [
        "Yoshi yoshi ! (Salut l'ami !)",
        "Les champignons que tu fais pousser sont délicieux !",
        "Si tu attrapes des papillons, je serai ton ami pour toujours."
      ]
    },
    {
      id: 'shyguy', name: 'Maskass', x: -20, z: -18,
      colors: { cap: 0xb02020, shirt: 0xb02020, pants: 0x602020, skin: 0xe8a080, variant: 'shy' },
      dialogs: [
        "...",
        "(Il te fait un signe timide)",
        "J'aime bien ta casquette."
      ]
    },
    {
      id: 'bowser', name: 'Bowser', x: -24, z: -28,
      colors: { cap: 0xc02020, shirt: 0xffa040, pants: 0x2a7a1a, skin: 0xffc070, variant: 'bowser' },
      dialogs: [
        "GWAHAHA ! Mes pics sont terrifiants, non ?",
        "Kidnapper Peach, c'est tellement démodé. J'essaie le jardinage.",
        "Si tu oses approcher de mon château, prépare-toi !"
      ]
    },
    {
      id: 'daisy', name: 'Daisy', x: 4, z: 4,
      colors: { cap: 0xffa020, shirt: 0xffa020, pants: PAL3D.white, skin: PAL3D.skin, variant: 'daisy' },
      dialogs: [
        "Salut ! Les fleurs de Sarasaland sont magnifiques aussi !",
        "On fait une partie de tennis un de ces jours ?",
        "Hi, I'm Daisy !"
      ]
    },
    {
      id: 'bowserjr', name: 'Bowser Jr.', x: -18, z: -25,
      colors: { cap: 0xc02020, shirt: 0xffa040, pants: 0x2a7a1a, skin: 0xffc070, variant: 'bowser' },
      dialogs: [
        "Je serai le meilleur roi un jour !",
        "Papa m'apprend à peindre avec un pinceau magique.",
        "Mario, t'as pas intérêt à embêter mon papa !"
      ]
    },
    {
      id: 'dk', name: 'Donkey Kong', x: 30, z: -10,
      colors: { cap: PAL3D.red, shirt: PAL3D.red, pants: 0x5a3a1a, skin: 0x6a3a1a, variant: 'dk' },
      dialogs: [
        "BANANES ! J'adore les bananes !",
        "Ooh ooh aah aah !",
        "DK Rap : He's the leader of the bunch !"
      ]
    },
    {
      id: 'wario', name: 'Wario', x: 12, z: -22,
      colors: { cap: PAL3D.yellow, shirt: PAL3D.yellow, pants: 0x7020a0, skin: PAL3D.skin },
      dialogs: [
        "Wario, number ONE !",
        "Tu as des pièces ? Donne-les moi !",
        "Je suis beaucoup plus fort que Mario, crois-moi."
      ]
    }
  ];

  for (const def of npcDefs) {
    const mesh = buildNPCMesh(def.id, def.colors);
    mesh.position.set(def.x, 0, def.z);
    mesh.rotation.y = Math.atan2(-def.x, -def.z);
    scene.add(mesh);

    const label = makeNameLabel(def.name);
    const labelY = def.id === 'bowser' ? 2.6 : def.id === 'dk' ? 2.2 : 2.2;
    label.position.set(0, labelY, 0);
    mesh.add(label);

    NPCS_3D.push({ ...def, mesh, idleTimer: Math.random() * 2 });
    COLLIDERS.push({ x: def.x, z: def.z, radius: 0.5, type: 'npc' });
  }
}

// Dispatcher : utilise les sprites Paper-Mario pour chaque PNJ
function buildNPCMesh(id, fallbackColors) {
  switch (id) {
    case 'mario':    return buildMarioSprite();
    case 'luigi':    return buildLuigiSprite();
    case 'wario':    return buildWarioSprite();
    case 'peach':    return buildPeachSprite();
    case 'daisy':    return buildDaisySprite();
    case 'toad':     return buildToadSprite();
    case 'yoshi':    return buildYoshiSprite();
    case 'bowser':   return buildBowserSprite();
    case 'bowserjr': return buildBowserJrSprite();
    case 'dk':       return buildDKSprite();
    case 'shyguy':   return buildShyGuySprite();
    default:         return buildCharacter(fallbackColors);
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
