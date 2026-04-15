/* =====================================================
   three-game.js - Scène, caméra, contrôles, boucle
   ===================================================== */

let scene, camera, renderer, clock;
let playerMesh, sunLight, hemiLight;

const state3D = {
  coins: 100,
  energy: 100,
  gameMinutes: 8 * 60,
  day: 1,
  tool: 0,
  running: false,
  paused: false,
  lastTime: 0,
};

const TOOLS = [
  { id: 'none',   name: 'Aucun' },
  { id: 'shovel', name: 'Pelle' },
  { id: 'net',    name: 'Épuisette' },
  { id: 'rod',    name: 'Canne à pêche' },
  { id: 'can',    name: 'Arrosoir' },
];

const input3D = { up: false, down: false, left: false, right: false, run: false };
const player = {
  x: 0, z: 3, y: 0,
  rotY: 0, targetRotY: 0,
  speed: 4.5,
  walkTimer: 0,
  moving: false,
};

// Camera orbit
const cam = {
  distance: 8,
  yaw: 0,
  pitch: 0.45,
  targetYaw: 0,
  targetPitch: 0.45,
};

// ============================================
// INIT
// ============================================
function init3D() {
  const canvas = document.getElementById('game');

  scene = new THREE.Scene();
  scene.background = new THREE.Color(PAL3D.sky);
  scene.fog = new THREE.Fog(PAL3D.sky, 55, 110);

  camera = new THREE.PerspectiveCamera(55, 768 / 576, 0.1, 300);

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(768, 576, false);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;

  // Lumière
  hemiLight = new THREE.HemisphereLight(0xfff7d6, 0x4a7a2a, 0.75);
  scene.add(hemiLight);

  sunLight = new THREE.DirectionalLight(0xffffff, 1.1);
  sunLight.position.set(15, 25, 10);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  const sc = sunLight.shadow.camera;
  sc.left = -50; sc.right = 50; sc.top = 50; sc.bottom = -50;
  sc.near = 0.1; sc.far = 150;
  scene.add(sunLight);

  // Monde
  buildWorld(scene);

  // Joueur
  playerMesh = buildCharacter({
    cap: PAL3D.red, shirt: PAL3D.red, pants: PAL3D.blue, skin: PAL3D.skin
  });
  scene.add(playerMesh);

  clock = new THREE.Clock();

  setupInput();
  setupUI();

  // Sauvegarde auto
  setInterval(() => { if (state3D.running) saveGame(); }, 20000);
  window.addEventListener('beforeunload', () => { if (state3D.running) saveGame(); });
}

// ============================================
// INPUT
// ============================================
function setupInput() {
  const keyMap = {
    'ArrowUp': 'up',    'z': 'up',    'w': 'up',    'Z': 'up',    'W': 'up',
    'ArrowDown': 'down','s': 'down',  'S': 'down',
    'ArrowLeft': 'left','q': 'left',  'a': 'left',  'Q': 'left',  'A': 'left',
    'ArrowRight':'right','d':'right', 'D': 'right',
    'Shift': 'run',
  };

  document.addEventListener('keydown', e => {
    if (keyMap[e.key] !== undefined) { input3D[keyMap[e.key]] = true; e.preventDefault(); }
    if (e.key === ' ' || e.key === 'e' || e.key === 'E' || e.key === 'Enter') {
      handleAction(); e.preventDefault();
    }
    if (e.key === 'i' || e.key === 'I') { toggleInventory(); e.preventDefault(); }
    if (e.key >= '1' && e.key <= '5') {
      state3D.tool = parseInt(e.key) - 1;
      updateHUD();
      showToast(`Outil : ${TOOLS[state3D.tool].name}`);
    }
    if (e.key === 'Escape') {
      closeShop();
      document.getElementById('inventory').classList.add('hidden');
      state3D.paused = false;
    }
  });
  document.addEventListener('keyup', e => {
    if (keyMap[e.key] !== undefined) input3D[keyMap[e.key]] = false;
  });

  // Souris : rotation caméra (clic droit + drag)
  const canvas = document.getElementById('game');
  let dragging = false, lastX = 0, lastY = 0;
  canvas.addEventListener('contextmenu', e => e.preventDefault());
  canvas.addEventListener('mousedown', e => {
    if (e.button === 2 || e.button === 0) {
      dragging = true;
      lastX = e.clientX; lastY = e.clientY;
    }
  });
  window.addEventListener('mouseup', () => dragging = false);
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    cam.targetYaw -= dx * 0.008;
    cam.targetPitch = Math.max(0.15, Math.min(1.2, cam.targetPitch - dy * 0.005));
    lastX = e.clientX; lastY = e.clientY;
  });
  canvas.addEventListener('wheel', e => {
    cam.distance = Math.max(3, Math.min(15, cam.distance + e.deltaY * 0.01));
    e.preventDefault();
  }, { passive: false });
}

// ============================================
// ACTIONS (Espace / E)
// ============================================
function handleAction() {
  if (currentDialog) { advanceDialog(); return; }
  if (state3D.paused) return;

  // Tuile devant le joueur (1 unité en avant)
  const fx = player.x + Math.sin(player.rotY) * 1.2;
  const fz = player.z + Math.cos(player.rotY) * 1.2;

  // --- PNJ à proximité ---
  const npc = findNearbyNPC3D(player.x, player.z, 1.8);
  if (npc) { startDialog(npc); return; }

  const tool = TOOLS[state3D.tool].id;
  const now = performance.now();

  // --- Arbre devant soi ---
  const tree = findNearestTree(fx, fz, 1.2);
  if (tree) {
    if (tree.shaken && now < tree.regrowAt) {
      showToast("Cet arbre a déjà été secoué");
      return;
    }
    tree.shakeUntil = now + 500;
    tree.shaken = true;
    tree.regrowAt = now + 45000;
    // Drop
    const r = Math.random();
    let kind;
    if (r < 0.55) kind = 'coin';
    else if (r < 0.85) kind = 'wood';
    else kind = 'mushroom';
    spawnDrop(kind, tree.x + (Math.random() - 0.5) * 1.2, tree.z + 1.4);
    showToast("Tu secoues l'arbre...");
    return;
  }

  // --- Récolte plante mûre ---
  const crop = CROPS_3D.find(c => Math.hypot(c.x - fx, c.z - fz) < 0.8);
  if (crop && crop.stage >= 2) {
    addToInventory('mushroom', 1);
    scene.remove(crop.mesh);
    CROPS_3D.splice(CROPS_3D.indexOf(crop), 1);
    return;
  }

  // --- Pelle ---
  if (tool === 'shovel') {
    const tilled = findNearestTilled(fx, fz, 1.0);
    if (!tilled) {
      showToast("Rien à creuser ici");
      return;
    }
    if (Math.random() < 0.3) {
      const loot = Math.random() < 0.5 ? 'coin' : 'seed';
      spawnDrop(loot, tilled.x, tilled.z);
      showToast("Tu trouves quelque chose !");
    } else {
      showToast("Tu creuses...");
    }
    return;
  }

  // --- Épuisette ---
  if (tool === 'net') {
    if (Math.random() < 0.45) {
      addToInventory('bug', 1);
    } else {
      showToast("Rien à attraper...");
    }
    return;
  }

  // --- Canne à pêche ---
  if (tool === 'rod') {
    const water = isNearWater(fx, fz, 1.5);
    if (!water) {
      showToast("Il faut être face à l'eau");
      return;
    }
    showToast("Tu lances ta ligne...");
    state3D.paused = true;
    setTimeout(() => {
      state3D.paused = false;
      if (Math.random() < 0.7) addToInventory('fish', 1);
      else showToast("Ça a mordu... mais pas pris !");
    }, 1200 + Math.random() * 1500);
    return;
  }

  // --- Arrosoir ---
  if (tool === 'can') {
    if (crop) {
      crop.watered = true;
      showToast("Plante arrosée 💧");
    } else {
      showToast("Rien à arroser");
    }
    return;
  }

  showToast("Rien à faire ici");
}

// ============================================
// DROP spawn
// ============================================
function spawnDrop(kind, x, z) {
  const mesh = buildItem(kind);
  mesh.position.set(x, 0.5, z);
  mesh.userData.spawnY = 0.5;
  mesh.userData.kind = kind;
  mesh.userData.bobOffset = Math.random() * Math.PI * 2;
  scene.add(mesh);
  DROPS_3D.push({ kind, mesh, x, z, spawnedAt: performance.now() });
}

// ============================================
// MISE À JOUR JOUEUR
// ============================================
function updatePlayer(dt) {
  // Déplacement relatif à la caméra
  let dx = 0, dz = 0;
  if (input3D.up)    dz -= 1;
  if (input3D.down)  dz += 1;
  if (input3D.left)  dx -= 1;
  if (input3D.right) dx += 1;

  const moving = dx !== 0 || dz !== 0;
  player.moving = moving;

  if (moving) {
    // Normaliser
    const len = Math.hypot(dx, dz);
    dx /= len; dz /= len;

    // Transformer en espace caméra
    const cy = Math.cos(cam.yaw), sy = Math.sin(cam.yaw);
    const wx = dx * cy - dz * sy;
    const wz = dx * sy + dz * cy;

    const sp = player.speed * (input3D.run ? 1.8 : 1) * dt;
    const nx = player.x + wx * sp;
    const nz = player.z + wz * sp;

    if (!isBlockedAt(nx, player.z, 0.35)) player.x = nx;
    if (!isBlockedAt(player.x, nz, 0.35)) player.z = nz;

    player.targetRotY = Math.atan2(wx, wz);
  }

  // Interpolation rotation
  let diff = player.targetRotY - player.rotY;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  player.rotY += diff * Math.min(1, dt * 12);

  playerMesh.position.set(player.x, 0, player.z);
  playerMesh.rotation.y = player.rotY;

  // Animation marche
  animateWalk(playerMesh, performance.now(), moving, input3D.run ? 1.6 : 1);
}

// ============================================
// CAMÉRA
// ============================================
function updateCamera(dt) {
  cam.yaw   += (cam.targetYaw - cam.yaw) * Math.min(1, dt * 6);
  cam.pitch += (cam.targetPitch - cam.pitch) * Math.min(1, dt * 6);

  const cx = player.x + Math.sin(cam.yaw) * Math.cos(cam.pitch) * cam.distance;
  const cz = player.z + Math.cos(cam.yaw) * Math.cos(cam.pitch) * cam.distance;
  const cy = 1.4 + Math.sin(cam.pitch) * cam.distance;

  camera.position.set(cx, cy, cz);
  camera.lookAt(player.x, 1.2, player.z);
}
