/* Bowser - Grand reptile avec carapace, cornes, crinière */

function buildBowserChar(scale = 1) {
  const g = new THREE.Group();

  // Cuisses épaisses vert-jaune
  const legL = cyl(0.18, 0.16, 0.4, 0xf0b040, 10);
  legL.position.set(-0.22, 0.25, 0);
  g.add(legL);
  const legR = cyl(0.18, 0.16, 0.4, 0xf0b040, 10);
  legR.position.set(0.22, 0.25, 0);
  g.add(legR);
  // Pieds/griffes
  const footL = box(0.28, 0.12, 0.4, 0xe0a030);
  footL.position.set(-0.22, 0.08, 0.1);
  g.add(footL);
  const footR = box(0.28, 0.12, 0.4, 0xe0a030);
  footR.position.set(0.22, 0.08, 0.1);
  g.add(footR);
  // 3 griffes blanches par pied
  for (const side of [-0.22, 0.22]) {
    for (const cx of [-0.08, 0, 0.08]) {
      const claw = new THREE.Mesh(
        new THREE.ConeGeometry(0.03, 0.08, 4),
        mat(PAL3D.white)
      );
      claw.rotation.x = -Math.PI / 2;
      claw.position.set(side + cx, 0.08, 0.3);
      g.add(claw);
    }
  }

  // Torse massif jaune-orange
  const torso = sphere(0.5, 0xf0b040, 16);
  torso.scale.set(1.2, 1.1, 1);
  torso.position.y = 0.95;
  g.add(torso);
  // Ventre strié (segments horizontaux)
  for (let i = 0; i < 4; i++) {
    const seg = new THREE.Mesh(
      new THREE.TorusGeometry(0.35, 0.03, 4, 12, Math.PI),
      mat(0xd08020)
    );
    seg.rotation.x = Math.PI / 2;
    seg.rotation.y = Math.PI / 2;
    seg.position.set(0, 0.7 + i * 0.15, 0.3);
    g.add(seg);
  }

  // Carapace verte dans le dos
  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    mat(0x2a7a1a)
  );
  shell.rotation.x = Math.PI / 2;
  shell.position.set(0, 1.0, -0.2);
  shell.scale.set(1.1, 1, 0.5);
  g.add(shell);
  // Contour clair
  const shellRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.55, 0.05, 8, 20),
    mat(0xf8e060)
  );
  shellRim.rotation.x = Math.PI / 2;
  shellRim.scale.set(1.1, 1, 1);
  shellRim.position.set(0, 1.0, -0.2);
  g.add(shellRim);
  // Gros pics blancs sur la carapace
  const spikePos = [
    [-0.35, 1.2, -0.45], [0.35, 1.2, -0.45],
    [-0.35, 0.8, -0.45], [0.35, 0.8, -0.45],
    [0, 1.0, -0.55]
  ];
  for (const [x, y, z] of spikePos) {
    const base = cyl(0.06, 0.09, 0.06, PAL3D.white, 8);
    base.position.set(x, y, z - 0.02);
    base.rotation.x = Math.PI / 2;
    g.add(base);
    const spike = new THREE.Mesh(
      new THREE.ConeGeometry(0.09, 0.22, 6),
      mat(PAL3D.white)
    );
    spike.rotation.x = Math.PI / 2;
    spike.position.set(x, y, z - 0.12);
    g.add(spike);
  }

  // Bras puissants
  const armL = cyl(0.14, 0.12, 0.4, 0xf0b040, 10);
  armL.position.set(-0.55, 0.95, 0);
  armL.rotation.z = 0.3;
  g.add(armL);
  const armR = cyl(0.14, 0.12, 0.4, 0xf0b040, 10);
  armR.position.set(0.55, 0.95, 0);
  armR.rotation.z = -0.3;
  g.add(armR);
  // Bracelets à pics noirs
  for (const bx of [-0.6, 0.6]) {
    const cuff = cyl(0.18, 0.18, 0.15, 0x1a1a1a, 12);
    cuff.position.set(bx, 0.72, 0);
    g.add(cuff);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const s = new THREE.Mesh(
        new THREE.ConeGeometry(0.04, 0.12, 4),
        mat(PAL3D.white)
      );
      s.position.set(bx + Math.cos(a) * 0.2, 0.72, Math.sin(a) * 0.2);
      s.rotation.z = -Math.cos(a) * Math.PI / 2;
      s.rotation.x = Math.sin(a) * Math.PI / 2;
      g.add(s);
    }
  }
  // Mains
  const hL = sphere(0.16, 0xf0b040, 10);
  hL.position.set(-0.65, 0.6, 0);
  g.add(hL);
  const hR = sphere(0.16, 0xf0b040, 10);
  hR.position.set(0.65, 0.6, 0);
  g.add(hR);
  // Griffes
  for (const side of [-0.65, 0.65]) {
    for (const cx of [-0.08, 0, 0.08]) {
      const claw = new THREE.Mesh(
        new THREE.ConeGeometry(0.025, 0.08, 4),
        mat(PAL3D.white)
      );
      claw.rotation.x = -Math.PI / 2;
      claw.position.set(side + (side > 0 ? cx : -cx) * 0.5, 0.5, 0.1);
      g.add(claw);
    }
  }

  // Cou
  const neck = cyl(0.18, 0.18, 0.15, 0xf0b040, 10);
  neck.position.y = 1.35;
  g.add(neck);

  // Tête grosse (verte-jaune)
  const head = sphere(0.36, 0xe09030, 16);
  head.scale.set(1.1, 1, 1.1);
  head.position.set(0, 1.6, 0.05);
  g.add(head);
  // Museau
  const snout = sphere(0.22, 0xe09030, 12);
  snout.scale.set(1, 0.8, 1.2);
  snout.position.set(0, 1.5, 0.35);
  g.add(snout);
  // Narines
  for (const nx of [-0.06, 0.06]) {
    const nostril = sphere(0.025, 0x1a0a00, 5);
    nostril.position.set(nx, 1.55, 0.55);
    g.add(nostril);
  }
  // Bouche large
  const mouth = box(0.25, 0.04, 0.1, 0x2a0a00);
  mouth.position.set(0, 1.4, 0.52);
  g.add(mouth);
  // Crocs
  for (const fx of [-0.08, 0.08]) {
    const fang = new THREE.Mesh(
      new THREE.ConeGeometry(0.025, 0.1, 4),
      mat(PAL3D.white)
    );
    fang.rotation.x = Math.PI;
    fang.position.set(fx, 1.34, 0.5);
    g.add(fang);
  }

  // Yeux rouges colériques
  for (const ex of [-0.13, 0.13]) {
    const sclera = sphere(0.08, PAL3D.white, 10);
    sclera.position.set(ex, 1.72, 0.28);
    g.add(sclera);
    const pupil = sphere(0.04, 0xcc0000, 6);
    pupil.material.emissive = new THREE.Color(0x440000);
    pupil.position.set(ex, 1.72, 0.33);
    g.add(pupil);
    // Sourcils froncés (rouges)
    const brow = box(0.1, 0.03, 0.04, 0xaa0000);
    brow.position.set(ex, 1.83, 0.3);
    brow.rotation.z = ex > 0 ? -0.4 : 0.4;
    g.add(brow);
  }

  // Cornes blanches
  for (const hx of [-0.22, 0.22]) {
    const horn = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.3, 8),
      mat(PAL3D.white)
    );
    horn.position.set(hx, 1.95, 0.0);
    horn.rotation.z = hx > 0 ? -0.3 : 0.3;
    g.add(horn);
  }

  // Crinière rouge hérissée
  const maneColors = [0xc02020, 0xd02020, 0xe02020];
  for (let i = 0; i < 8; i++) {
    const a = ((i - 3.5) / 8) * Math.PI;
    const spike = new THREE.Mesh(
      new THREE.ConeGeometry(0.06 + Math.random() * 0.02, 0.25 + Math.random() * 0.1, 4),
      mat(maneColors[i % 3])
    );
    spike.position.set(Math.sin(a) * 0.35, 1.85, -0.2 + Math.cos(a) * 0.15);
    spike.rotation.z = Math.sin(a) * -0.5;
    spike.rotation.x = -0.3;
    g.add(spike);
  }

  // Collier à pics autour du cou
  const collar = cyl(0.22, 0.22, 0.1, 0x1a1a1a, 16);
  collar.position.y = 1.25;
  g.add(collar);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const s = new THREE.Mesh(
      new THREE.ConeGeometry(0.04, 0.12, 4),
      mat(PAL3D.white)
    );
    s.position.set(Math.cos(a) * 0.25, 1.25, Math.sin(a) * 0.25);
    s.rotation.z = -Math.cos(a) * Math.PI / 2;
    s.rotation.x = Math.sin(a) * Math.PI / 2;
    g.add(s);
  }

  // Queue avec pics
  for (let i = 0; i < 4; i++) {
    const seg = sphere(0.12 - i * 0.02, 0x2a7a1a, 8);
    seg.position.set(0, 0.9 - i * 0.05, -0.6 - i * 0.15);
    g.add(seg);
  }

  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  if (scale !== 1) g.scale.setScalar(scale);
  g.userData.legL = legL;
  g.userData.legR = legR;
  g.userData.armL = armL;
  g.userData.armR = armR;
  g.userData.shoeL = footL;
  g.userData.shoeR = footR;
  return g;
}

function buildBowserJr() {
  const g = buildBowserChar(0.6);
  // Ajoute un bavoir blanc avec le dessin de Bowser
  const bib = new THREE.Mesh(
    new THREE.CircleGeometry(0.25, 16),
    mat(PAL3D.white)
  );
  bib.position.set(0, 0.7, 0.3);
  g.add(bib);
  // Yeux/dents du bavoir
  const bibMouth = box(0.1, 0.02, 0.02, 0x550000);
  bibMouth.position.set(0, 0.65, 0.32);
  g.add(bibMouth);
  return g;
}
