/* Donkey Kong (gorille) + Shy Guy (Maskass) */

function buildGorilla() {
  const g = new THREE.Group();

  // Jambes courtes et épaisses brun
  const legL = cyl(0.17, 0.18, 0.35, 0x5a3010, 10);
  legL.position.set(-0.2, 0.2, 0);
  g.add(legL);
  const legR = cyl(0.17, 0.18, 0.35, 0x5a3010, 10);
  legR.position.set(0.2, 0.2, 0);
  g.add(legR);
  // Pieds
  const footL = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    mat(0x3a1a00)
  );
  footL.rotation.x = Math.PI;
  footL.scale.set(1, 1, 1.5);
  footL.position.set(-0.2, 0.06, 0.1);
  g.add(footL);
  const footR = footL.clone();
  footR.position.set(0.2, 0.06, 0.1);
  g.add(footR);

  // Torse massif (brun foncé)
  const torso = sphere(0.45, 0x4a2a10, 16);
  torso.scale.set(1.3, 1.1, 1);
  torso.position.y = 0.85;
  g.add(torso);
  // Poitrail clair
  const chest = sphere(0.35, 0xf4d8a0, 12);
  chest.scale.set(1, 1, 0.5);
  chest.position.set(0, 0.85, 0.3);
  g.add(chest);
  // Poils sur le torse (texture)
  for (let i = 0; i < 20; i++) {
    const hair = box(0.02, 0.06, 0.02, 0x2a1500);
    hair.position.set(
      (Math.random() - 0.5) * 0.5,
      0.7 + Math.random() * 0.4,
      0.35 + Math.random() * 0.05
    );
    g.add(hair);
  }

  // Cravate rouge
  const tieKnot = box(0.12, 0.15, 0.04, 0xe52521);
  tieKnot.position.set(0, 1.15, 0.42);
  g.add(tieKnot);
  const tie = new THREE.Mesh(
    new THREE.ConeGeometry(0.12, 0.4, 4),
    mat(0xe52521)
  );
  tie.rotation.x = Math.PI;
  tie.position.set(0, 0.85, 0.42);
  g.add(tie);
  // Logo DK jaune sur la cravate
  const dkCircle = new THREE.Mesh(
    new THREE.CircleGeometry(0.06, 16),
    mat(PAL3D.block)
  );
  dkCircle.position.set(0, 0.95, 0.45);
  g.add(dkCircle);

  // Bras longs et épais (caractéristique gorille)
  const armL = cyl(0.15, 0.14, 0.65, 0x4a2a10, 12);
  armL.position.set(-0.55, 0.75, 0);
  armL.rotation.z = 0.25;
  g.add(armL);
  const armR = cyl(0.15, 0.14, 0.65, 0x4a2a10, 12);
  armR.position.set(0.55, 0.75, 0);
  armR.rotation.z = -0.25;
  g.add(armR);
  // Avant-bras musclés
  const forearmL = sphere(0.16, 0x4a2a10, 10);
  forearmL.position.set(-0.65, 0.4, 0);
  g.add(forearmL);
  const forearmR = sphere(0.16, 0x4a2a10, 10);
  forearmR.position.set(0.65, 0.4, 0);
  g.add(forearmR);
  // Grosses mains
  const hL = sphere(0.2, 0xf4d8a0, 12);
  hL.scale.set(1, 0.7, 1);
  hL.position.set(-0.7, 0.2, 0);
  g.add(hL);
  const hR = sphere(0.2, 0xf4d8a0, 12);
  hR.scale.set(1, 0.7, 1);
  hR.position.set(0.7, 0.2, 0);
  g.add(hR);

  // Tête (petite par rapport au corps)
  const head = sphere(0.28, 0x5a3010, 16);
  head.scale.set(1.1, 0.95, 1);
  head.position.y = 1.35;
  g.add(head);
  // Museau de gorille (sort en avant)
  const snout = sphere(0.2, 0xf4d8a0, 12);
  snout.scale.set(1.2, 0.85, 1);
  snout.position.set(0, 1.28, 0.22);
  g.add(snout);
  // Narines
  for (const nx of [-0.05, 0.05]) {
    const nostril = sphere(0.02, 0x1a0800, 5);
    nostril.position.set(nx, 1.3, 0.4);
    g.add(nostril);
  }
  // Bouche large
  const mouth = box(0.2, 0.02, 0.06, 0x2a0a00);
  mouth.position.set(0, 1.2, 0.38);
  g.add(mouth);

  // Yeux
  for (const ex of [-0.09, 0.09]) {
    const sclera = sphere(0.05, PAL3D.white, 8);
    sclera.position.set(ex, 1.43, 0.22);
    g.add(sclera);
    const pupil = sphere(0.025, 0x2a1a00, 6);
    pupil.position.set(ex, 1.43, 0.26);
    g.add(pupil);
    // Arcades sourcilières
    const brow = box(0.12, 0.04, 0.05, 0x2a1500);
    brow.position.set(ex, 1.5, 0.22);
    g.add(brow);
  }

  // Oreilles rondes
  for (const sx of [-0.3, 0.3]) {
    const ear = sphere(0.07, 0x4a2a10, 8);
    ear.position.set(sx, 1.4, 0);
    g.add(ear);
    const earInner = sphere(0.04, 0xf4d8a0, 6);
    earInner.position.set(sx * 1.05, 1.4, 0.02);
    g.add(earInner);
  }

  // Touffe de cheveux noirs au sommet
  const hairTuft = sphere(0.1, 0x1a0a00, 8);
  hairTuft.scale.y = 0.6;
  hairTuft.position.y = 1.55;
  g.add(hairTuft);

  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  g.userData.legL = legL;
  g.userData.legR = legR;
  g.userData.armL = armL;
  g.userData.armR = armR;
  g.userData.shoeL = footL;
  g.userData.shoeR = footR;
  return g;
}

// ==================================================
// Shy Guy (Maskass) : robe longue + masque blanc
// ==================================================
function buildShyGuyChar(robeColor = 0xc02020) {
  const g = new THREE.Group();

  // Corps : cône (robe qui descend jusqu'au sol)
  const robe = new THREE.Mesh(
    new THREE.ConeGeometry(0.35, 1.4, 16, 1, true),
    new THREE.MeshLambertMaterial({ color: robeColor, side: THREE.DoubleSide })
  );
  robe.position.y = 0.7;
  robe.castShadow = true;
  g.add(robe);
  // Socle
  const base = cyl(0.35, 0.35, 0.05, robeColor, 16);
  base.position.y = 0.025;
  g.add(base);
  // Ceinture
  const belt = new THREE.Mesh(
    new THREE.TorusGeometry(0.28, 0.03, 6, 20),
    mat(0x552a00)
  );
  belt.rotation.x = Math.PI / 2;
  belt.position.y = 0.6;
  g.add(belt);
  const buckle = box(0.08, 0.06, 0.02, PAL3D.block);
  buckle.position.set(0, 0.6, 0.3);
  g.add(buckle);

  // Petites chaussures marron qui dépassent
  const shoeL = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2),
    mat(0x4a2a10)
  );
  shoeL.rotation.x = Math.PI;
  shoeL.scale.set(1, 1, 1.5);
  shoeL.position.set(-0.08, 0.04, 0.25);
  g.add(shoeL);
  const shoeR = shoeL.clone();
  shoeR.position.set(0.08, 0.04, 0.25);
  g.add(shoeR);

  // Manches
  const sleeveL = cyl(0.08, 0.1, 0.4, robeColor, 10);
  sleeveL.position.set(-0.3, 1.0, 0);
  sleeveL.rotation.z = 0.4;
  g.add(sleeveL);
  const sleeveR = cyl(0.08, 0.1, 0.4, robeColor, 10);
  sleeveR.position.set(0.3, 1.0, 0);
  sleeveR.rotation.z = -0.4;
  g.add(sleeveR);
  // Mains gantées blanches
  const hL = sphere(0.09, PAL3D.white, 10);
  hL.position.set(-0.4, 0.8, 0);
  g.add(hL);
  const hR = sphere(0.09, PAL3D.white, 10);
  hR.position.set(0.4, 0.8, 0);
  g.add(hR);

  // Tête/capuche
  const hood = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 16, 12, 0, Math.PI * 2, 0, Math.PI / 1.4),
    mat(robeColor)
  );
  hood.position.y = 1.35;
  g.add(hood);

  // Masque blanc (caractéristique Shy Guy)
  const mask = new THREE.Mesh(
    new THREE.SphereGeometry(0.27, 16, 12),
    mat(0xf5e4ce)
  );
  mask.scale.z = 0.9;
  mask.position.set(0, 1.32, 0.04);
  g.add(mask);
  // Yeux percés (trous noirs ovales)
  for (const ex of [-0.08, 0.08]) {
    const hole = new THREE.Mesh(
      new THREE.CircleGeometry(0.04, 8),
      mat(0x000000)
    );
    hole.position.set(ex, 1.35, 0.26);
    hole.scale.y = 1.6;
    g.add(hole);
  }
  // Bouche (petit O)
  const mouthRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.03, 0.008, 4, 12),
    mat(0x000000)
  );
  mouthRing.position.set(0, 1.22, 0.26);
  g.add(mouthRing);
  // Cordons de masque
  for (const cx of [-0.25, 0.25]) {
    const cord = cyl(0.008, 0.008, 0.06, 0x000000, 4);
    cord.position.set(cx, 1.32, -0.05);
    cord.rotation.z = Math.PI / 2;
    g.add(cord);
  }

  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  // Animation : la robe ne bouge pas les jambes
  g.userData.legL = { rotation: { x: 0 } };
  g.userData.legR = { rotation: { x: 0 } };
  g.userData.armL = sleeveL;
  g.userData.armR = sleeveR;
  g.userData.shoeL = { rotation: { x: 0 } };
  g.userData.shoeR = { rotation: { x: 0 } };
  return g;
}
