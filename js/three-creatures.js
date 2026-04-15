/* =====================================================
   three-creatures.js - Toad, Yoshi (formes non humaines)
   ===================================================== */

// ==================================================
// Toad : petit humanoïde chibi avec énorme tête-champignon
// ==================================================
function buildToadChar() {
  const g = new THREE.Group();

  // Corps minuscule (gilet blanc + short marron)
  // Jambes courtes
  const legL = cyl(0.08, 0.08, 0.2, 0x4a2a10, 8);
  legL.position.set(-0.1, 0.1, 0);
  g.add(legL);
  const legR = cyl(0.08, 0.08, 0.2, 0x4a2a10, 8);
  legR.position.set(0.1, 0.1, 0);
  g.add(legR);
  // Chaussures marron
  const shoeL = new THREE.Mesh(
    new THREE.SphereGeometry(0.11, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2),
    mat(0x8a4a20)
  );
  shoeL.rotation.x = Math.PI;
  shoeL.scale.set(1, 1, 1.4);
  shoeL.position.set(-0.1, 0.02, 0.04);
  g.add(shoeL);
  const shoeR = shoeL.clone();
  shoeR.position.set(0.1, 0.02, 0.04);
  g.add(shoeR);

  // Torse (gilet blanc rond)
  const torso = sphere(0.22, PAL3D.white, 14);
  torso.scale.y = 1.1;
  torso.position.y = 0.42;
  g.add(torso);
  // Col doré
  const collar = new THREE.Mesh(
    new THREE.TorusGeometry(0.15, 0.025, 6, 16),
    mat(PAL3D.block)
  );
  collar.rotation.x = Math.PI / 2;
  collar.position.y = 0.6;
  g.add(collar);

  // Bras (petits, gantés)
  const armL = cyl(0.06, 0.06, 0.2, PAL3D.white, 8);
  armL.position.set(-0.25, 0.45, 0);
  armL.rotation.z = 0.3;
  g.add(armL);
  const armR = cyl(0.06, 0.06, 0.2, PAL3D.white, 8);
  armR.position.set(0.25, 0.45, 0);
  armR.rotation.z = -0.3;
  g.add(armR);
  // Gants ronds
  const hL = sphere(0.1, PAL3D.white, 10);
  hL.position.set(-0.3, 0.32, 0);
  g.add(hL);
  const hR = sphere(0.1, PAL3D.white, 10);
  hR.position.set(0.3, 0.32, 0);
  g.add(hR);

  // Tête (visage rond sous le champignon)
  const face = sphere(0.24, 0xfff0dc, 16);
  face.position.y = 0.88;
  g.add(face);

  // Yeux grands et ovales
  for (const x of [-0.1, 0.1]) {
    const eye = sphere(0.05, PAL3D.white, 10);
    eye.scale.set(1, 1.4, 1);
    eye.position.set(x, 0.9, 0.22);
    g.add(eye);
    const pupil = sphere(0.04, 0x0a1a4a, 8);
    pupil.scale.y = 1.5;
    pupil.position.set(x, 0.9, 0.25);
    g.add(pupil);
  }

  // Bouche ouverte souriante
  const mouth = new THREE.Mesh(
    new THREE.TorusGeometry(0.04, 0.012, 4, 10, Math.PI),
    mat(0x551010)
  );
  mouth.rotation.x = Math.PI / 2;
  mouth.position.set(0, 0.78, 0.23);
  g.add(mouth);

  // Joues roses
  for (const x of [-0.16, 0.16]) {
    const blush = sphere(0.04, 0xff8080, 6);
    blush.material.transparent = true;
    blush.material.opacity = 0.6;
    blush.scale.set(1, 0.5, 0.2);
    blush.position.set(x, 0.84, 0.2);
    g.add(blush);
  }

  // ------- Champignon sur la tête (grand) -------
  // Chapeau rouge à pois blancs
  const capShell = new THREE.Mesh(
    new THREE.SphereGeometry(0.45, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2),
    mat(0xe52521)
  );
  capShell.position.y = 1.1;
  capShell.castShadow = true;
  g.add(capShell);
  // Rebord
  const capRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.45, 0.04, 8, 20),
    mat(0xfff0dc)
  );
  capRim.rotation.x = Math.PI / 2;
  capRim.position.y = 1.1;
  g.add(capRim);
  // Pois blancs (5 gros)
  const dotSpots = [
    [0, 1.55, 0],
    [0.3, 1.3, 0.15], [-0.3, 1.3, 0.15],
    [0.15, 1.2, 0.32], [-0.15, 1.2, 0.32]
  ];
  for (const [x, y, z] of dotSpots) {
    const dot = sphere(0.09, PAL3D.white, 10);
    dot.position.set(x, y, z);
    g.add(dot);
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

// ==================================================
// Yoshi : dinosaure vert avec museau, selle rouge, queue
// ==================================================
function buildYoshiChar() {
  const g = new THREE.Group();

  // Jambes robustes (cuisses)
  const legL = cyl(0.15, 0.14, 0.4, 0x5dc14f, 10);
  legL.position.set(-0.18, 0.25, 0);
  g.add(legL);
  const legR = cyl(0.15, 0.14, 0.4, 0x5dc14f, 10);
  legR.position.set(0.18, 0.25, 0);
  g.add(legR);
  // Chaussures oranges
  const shoeL = new THREE.Mesh(
    new THREE.SphereGeometry(0.17, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    mat(0xff8a20)
  );
  shoeL.rotation.x = Math.PI;
  shoeL.scale.set(1, 1, 1.5);
  shoeL.position.set(-0.18, 0.04, 0.08);
  g.add(shoeL);
  const shoeR = shoeL.clone();
  shoeR.position.set(0.18, 0.04, 0.08);
  g.add(shoeR);

  // Corps oviforme (gros ventre)
  const body = sphere(0.4, 0x5dc14f, 16);
  body.scale.set(1.1, 1.1, 1.2);
  body.position.y = 0.85;
  g.add(body);
  // Ventre blanc
  const belly = sphere(0.32, 0xfff0dc, 14);
  belly.scale.set(0.9, 1, 0.5);
  belly.position.set(0, 0.8, 0.3);
  g.add(belly);

  // Selle rouge sur le dos (façon carapace Yoshi)
  const saddle = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    mat(0xe52521)
  );
  saddle.scale.set(1.1, 0.8, 1);
  saddle.position.set(0, 1.0, -0.15);
  g.add(saddle);
  // Contour jaune
  const saddleRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.03, 6, 20),
    mat(PAL3D.yellow)
  );
  saddleRim.rotation.x = Math.PI / 2;
  saddleRim.scale.set(1.1, 1, 1);
  saddleRim.position.set(0, 1.0, -0.15);
  g.add(saddleRim);
  // Pois blancs sur la selle
  for (let i = 0; i < 3; i++) {
    const a = (i - 1) * 0.8;
    const dot = sphere(0.04, PAL3D.white, 6);
    dot.position.set(Math.sin(a) * 0.2, 1.15, -0.15 + Math.cos(a) * 0.2);
    g.add(dot);
  }

  // Bras courts
  const armL = cyl(0.08, 0.08, 0.25, 0x5dc14f, 10);
  armL.position.set(-0.38, 0.85, 0);
  armL.rotation.z = 0.35;
  g.add(armL);
  const armR = cyl(0.08, 0.08, 0.25, 0x5dc14f, 10);
  armR.position.set(0.38, 0.85, 0);
  armR.rotation.z = -0.35;
  g.add(armR);
  // Gants blancs
  const hL = sphere(0.1, PAL3D.white, 10);
  hL.position.set(-0.45, 0.7, 0);
  g.add(hL);
  const hR = sphere(0.1, PAL3D.white, 10);
  hR.position.set(0.45, 0.7, 0);
  g.add(hR);

  // Queue
  const tailBase = cyl(0.12, 0.06, 0.4, 0x5dc14f, 10);
  tailBase.position.set(0, 0.75, -0.4);
  tailBase.rotation.x = Math.PI / 3;
  g.add(tailBase);
  const tailTip = sphere(0.08, 0x5dc14f, 8);
  tailTip.position.set(0, 0.55, -0.6);
  g.add(tailTip);

  // Cou
  const neck = cyl(0.13, 0.14, 0.3, 0x5dc14f, 10);
  neck.position.set(0, 1.2, 0.1);
  neck.rotation.x = -0.15;
  g.add(neck);

  // Tête avec long museau
  const head = sphere(0.28, 0x5dc14f, 16);
  head.scale.set(1, 0.9, 1.1);
  head.position.set(0, 1.45, 0.15);
  g.add(head);
  // Museau allongé
  const snout = sphere(0.2, 0x5dc14f, 12);
  snout.scale.set(1, 0.85, 1.3);
  snout.position.set(0, 1.38, 0.4);
  g.add(snout);
  // Narines
  for (const nx of [-0.05, 0.05]) {
    const nostril = sphere(0.018, 0x0a1a00, 4);
    nostril.position.set(nx, 1.42, 0.58);
    g.add(nostril);
  }
  // Bouche (ligne sous le museau)
  const mouth = box(0.15, 0.015, 0.08, 0x1a2a08);
  mouth.position.set(0, 1.28, 0.52);
  g.add(mouth);

  // Yeux exorbités (sphères blanches sur tiges courtes)
  for (const ex of [-0.13, 0.13]) {
    const eyeSocket = sphere(0.11, PAL3D.white, 10);
    eyeSocket.position.set(ex, 1.65, 0.18);
    g.add(eyeSocket);
    const pupil = sphere(0.05, 0x0a0a2a, 8);
    pupil.scale.y = 1.4;
    pupil.position.set(ex, 1.64, 0.27);
    g.add(pupil);
    const hl = sphere(0.015, PAL3D.white, 4);
    hl.position.set(ex + 0.02, 1.68, 0.3);
    g.add(hl);
  }

  // Crête dorsale
  const crest = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.02, 0.12, 6),
    mat(0xe52521)
  );
  crest.position.set(0, 1.75, 0.1);
  g.add(crest);

  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  g.userData.legL = legL;
  g.userData.legR = legR;
  g.userData.armL = armL;
  g.userData.armR = armR;
  g.userData.shoeL = shoeL;
  g.userData.shoeR = shoeR;
  return g;
}
