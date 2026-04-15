/* =====================================================
   three-buildings.js - Maisons et châteaux emblématiques
   ===================================================== */

// ---------- Château de Peach ----------
function buildPeachCastle() {
  const g = new THREE.Group();

  // Base principale
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(8, 5, 6),
    texMat(TEX.castle)
  );
  base.position.y = 2.5;
  base.castShadow = base.receiveShadow = true;
  g.add(base);

  // Bande rose décorative
  const band = box(8.1, 0.3, 6.1, PAL3D.pink);
  band.position.y = 4;
  g.add(band);

  // Tour centrale
  const tower = new THREE.Mesh(
    new THREE.CylinderGeometry(1.8, 1.8, 6, 16),
    texMat(TEX.castle)
  );
  tower.position.y = 6;
  tower.castShadow = true;
  g.add(tower);

  // Créneaux tour centrale
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const merlon = box(0.4, 0.5, 0.4, PAL3D.castle);
    merlon.material = texMat(TEX.castle);
    merlon.position.set(Math.cos(a) * 1.8, 9.3, Math.sin(a) * 1.8);
    g.add(merlon);
  }

  // Toit conique tour centrale
  const mainRoof = new THREE.Mesh(
    new THREE.ConeGeometry(2.2, 3, 16),
    texMat(TEX.roofRed)
  );
  mainRoof.position.y = 11;
  mainRoof.castShadow = true;
  g.add(mainRoof);

  // Drapeau
  const flagPole = cyl(0.04, 0.04, 2, 0x333333, 6);
  flagPole.position.y = 13.5;
  g.add(flagPole);
  const flag = box(0.8, 0.5, 0.02, PAL3D.pink);
  flag.position.set(0.4, 14, 0);
  g.add(flag);

  // Tours latérales
  for (const side of [-1, 1]) {
    const sideTower = new THREE.Mesh(
      new THREE.CylinderGeometry(1, 1, 5, 12),
      texMat(TEX.castle)
    );
    sideTower.position.set(side * 4, 2.5, -3);
    sideTower.castShadow = true;
    g.add(sideTower);

    const sideRoof = new THREE.Mesh(
      new THREE.ConeGeometry(1.2, 2, 12),
      texMat(TEX.roofRed)
    );
    sideRoof.position.set(side * 4, 6, -3);
    g.add(sideRoof);

    // Drapeau petit
    const sp = cyl(0.03, 0.03, 1, 0x333333, 4);
    sp.position.set(side * 4, 7.5, -3);
    g.add(sp);
    const sf = box(0.5, 0.3, 0.02, PAL3D.pink);
    sf.position.set(side * 4 + 0.25, 7.8, -3);
    g.add(sf);
  }

  // Grande porte en arche
  const doorArch = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.8, 0.3, 16, 1, false, 0, Math.PI),
    mat(PAL3D.brown)
  );
  doorArch.rotation.x = Math.PI / 2;
  doorArch.position.set(0, 2.2, 3.01);
  g.add(doorArch);
  const doorBase = box(1.6, 2.2, 0.3, PAL3D.brown);
  doorBase.position.set(0, 1.1, 3.01);
  g.add(doorBase);
  // Ferrures
  for (const x of [-0.5, 0.5]) {
    for (const y of [0.5, 1.5]) {
      const nail = sphere(0.08, 0x666666, 6);
      nail.position.set(x, y, 3.17);
      g.add(nail);
    }
  }
  // Vitrail au-dessus
  const window = new THREE.Mesh(
    new THREE.CircleGeometry(0.6, 16),
    mat(PAL3D.pink, { emissive: 0x330022 })
  );
  window.position.set(0, 3.8, 3.02);
  g.add(window);

  // Fenêtres latérales
  for (const fx of [-2.5, 2.5]) {
    for (const fy of [1.5, 3]) {
      const w = new THREE.Mesh(
        new THREE.CircleGeometry(0.35, 8),
        mat(0x80c8ff, { emissive: 0x002244 })
      );
      w.position.set(fx, fy, 3.02);
      g.add(w);
      // cadre
      const frame = new THREE.Mesh(
        new THREE.RingGeometry(0.35, 0.45, 8),
        mat(PAL3D.white)
      );
      frame.position.set(fx, fy, 3.03);
      g.add(frame);
    }
  }

  // Logo Peach (coeur)
  const heart = sphere(0.15, PAL3D.pink, 8);
  heart.position.set(0, 3.8, 3.05);
  heart.scale.set(1.5, 1.5, 0.5);
  g.add(heart);

  return g;
}

// ---------- Manoir de Luigi ----------
function buildLuigiMansion() {
  const g = new THREE.Group();

  // Base tall and thin
  const base = box(4, 5, 4, 0x504a5a);
  base.material = texMat(TEX.castle, { color: 0x504a5a });
  base.position.y = 2.5;
  base.castShadow = true;
  g.add(base);

  // Étage (en retrait)
  const floor2 = box(3.5, 3, 3.5, 0x403848);
  floor2.material = texMat(TEX.castle, { color: 0x605a6a });
  floor2.position.y = 6.5;
  floor2.castShadow = true;
  g.add(floor2);

  // Toit pentu vert sombre
  const roof1 = new THREE.Mesh(
    new THREE.ConeGeometry(3.0, 2, 4),
    texMat(TEX.roofGreen, { color: 0x1a5a1a })
  );
  roof1.rotation.y = Math.PI / 4;
  roof1.position.y = 9;
  roof1.castShadow = true;
  g.add(roof1);

  // Cheminée
  const chim = box(0.6, 1.2, 0.6, PAL3D.brick);
  chim.material = texMat(TEX.brick);
  chim.position.set(1, 8.5, 0);
  g.add(chim);

  // Porte sombre
  const door = box(0.8, 1.8, 0.15, 0x2a1a0a);
  door.position.set(0, 0.9, 2.05);
  g.add(door);
  // Heurtoir fantôme
  const handle = sphere(0.1, PAL3D.block, 6);
  handle.position.set(0.25, 1, 2.13);
  g.add(handle);

  // Fenêtres lumineuses (jaunâtres - effet spooky)
  const winMat = mat(0xffd840, { emissive: 0xffa020 });
  for (const fx of [-1.2, 1.2]) {
    for (const fy of [1.8, 4.2]) {
      const w = box(0.6, 0.6, 0.05, 0xffd840);
      w.material = winMat;
      w.position.set(fx, fy, 2.03);
      g.add(w);
      // Croisillon
      const c1 = box(0.65, 0.05, 0.08, 0x2a1a0a);
      c1.position.set(fx, fy, 2.05);
      g.add(c1);
      const c2 = box(0.05, 0.65, 0.08, 0x2a1a0a);
      c2.position.set(fx, fy, 2.05);
      g.add(c2);
    }
  }
  // Fenêtre haute
  const topWin = box(0.5, 0.7, 0.05, 0xffd840);
  topWin.material = winMat;
  topWin.position.set(0, 7.5, 1.78);
  g.add(topWin);

  // Lanternes d'entrée
  for (const x of [-1, 1]) {
    const pole = cyl(0.04, 0.04, 2, 0x333333, 6);
    pole.position.set(x, 1, 2.5);
    g.add(pole);
    const lantern = box(0.3, 0.4, 0.3, 0xffd840, { emissive: 0xff8800 });
    lantern.position.set(x, 2.2, 2.5);
    g.add(lantern);
    const ptLight = new THREE.PointLight(0xffaa44, 0.6, 4);
    ptLight.position.set(x, 2.2, 2.5);
    g.add(ptLight);
  }

  // Arbre mort décoratif
  const deadTrunk = cyl(0.15, 0.2, 2.5, 0x2a1a0a, 6);
  deadTrunk.position.set(-3, 1.25, 2);
  g.add(deadTrunk);
  for (let i = 0; i < 3; i++) {
    const branch = cyl(0.05, 0.08, 0.8, 0x2a1a0a, 4);
    branch.position.set(-3, 2 + i * 0.3, 2);
    branch.rotation.z = (Math.random() - 0.5) * 1.5;
    g.add(branch);
  }

  return g;
}

// ---------- Maison champignon de Toad ----------
function buildToadHouse() {
  const g = new THREE.Group();

  // Pied (tige) épais
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(1.8, 2.2, 3, 16),
    mat(0xfff0d8)
  );
  stem.position.y = 1.5;
  stem.castShadow = true;
  g.add(stem);

  // Chapeau rouge à pois
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(3, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    mat(PAL3D.red)
  );
  cap.position.y = 3;
  cap.castShadow = true;
  g.add(cap);

  // Pois blancs
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const r = 2;
    const dot = sphere(0.4, PAL3D.white, 8);
    dot.position.set(Math.cos(a) * r, 3.8, Math.sin(a) * r);
    g.add(dot);
  }
  const topDot = sphere(0.5, PAL3D.white, 8);
  topDot.position.y = 5.6;
  g.add(topDot);

  // Rebord du chapeau
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(3, 0.2, 8, 16),
    mat(PAL3D.white)
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 3;
  g.add(rim);

  // Porte ronde
  const doorFrame = new THREE.Mesh(
    new THREE.CircleGeometry(0.7, 16),
    mat(PAL3D.brown)
  );
  doorFrame.position.set(0, 1, 2.15);
  g.add(doorFrame);
  const doorInner = new THREE.Mesh(
    new THREE.CircleGeometry(0.55, 16),
    mat(0x6a3a10)
  );
  doorInner.position.set(0, 1, 2.17);
  g.add(doorInner);
  const handle = sphere(0.06, PAL3D.block, 6);
  handle.position.set(0.3, 1, 2.19);
  g.add(handle);

  // Fenêtres rondes
  for (const fx of [-1.3, 1.3]) {
    const win = new THREE.Mesh(
      new THREE.CircleGeometry(0.3, 12),
      mat(0x80c8ff, { emissive: 0x002244 })
    );
    win.position.set(fx, 2.2, 2);
    g.add(win);
    const frame = new THREE.Mesh(
      new THREE.RingGeometry(0.3, 0.38, 12),
      mat(PAL3D.white)
    );
    frame.position.set(fx, 2.2, 2.01);
    g.add(frame);
  }

  return g;
}

// ---------- Maison-œuf de Yoshi ----------
function buildYoshiEggHouse() {
  const g = new THREE.Group();

  // Œuf géant
  const egg = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 24, 18),
    mat(PAL3D.white)
  );
  egg.scale.y = 1.3;
  egg.position.y = 2.8;
  egg.castShadow = true;
  g.add(egg);

  // Taches vertes
  const spotColors = [0x5dc14f, 0x3fa02e];
  for (let i = 0; i < 15; i++) {
    const a = Math.random() * Math.PI * 2;
    const b = Math.random() * Math.PI - Math.PI / 2;
    const x = Math.cos(b) * Math.cos(a) * 2.5;
    const y = Math.sin(b) * 2.5 * 1.3;
    const z = Math.cos(b) * Math.sin(a) * 2.5;
    const spot = sphere(0.3 + Math.random() * 0.3, spotColors[i % 2], 8);
    spot.position.set(x, 2.8 + y, z);
    spot.scale.setScalar(1 + Math.random() * 0.3);
    g.add(spot);
  }

  // Porte
  const door = box(0.8, 1.6, 0.1, 0x2e8b2e);
  door.position.set(0, 0.8, 2.4);
  g.add(door);
  const handle = sphere(0.08, PAL3D.block, 6);
  handle.position.set(0.28, 0.9, 2.47);
  g.add(handle);

  // Socle
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(2.3, 2.5, 0.4, 16),
    mat(0x6b3a1a)
  );
  base.position.y = 0.2;
  g.add(base);

  // Herbe autour
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const tuft = sphere(0.15, PAL3D.grassDark, 6);
    tuft.position.set(Math.cos(a) * 2.4, 0.5, Math.sin(a) * 2.4);
    g.add(tuft);
  }

  return g;
}

// ---------- Château de Bowser ----------
function buildBowserCastle() {
  const g = new THREE.Group();

  // Base sombre
  const base = box(10, 6, 8, 0x3a2a3a);
  base.material = texMat(TEX.castle, { color: 0x504050 });
  base.position.y = 3;
  base.castShadow = true;
  g.add(base);

  // Créneaux
  for (let x = -4.5; x <= 4.5; x += 1) {
    for (const z of [-3.9, 3.9]) {
      const merlon = box(0.7, 1, 0.7, 0x504050);
      merlon.position.set(x, 6.5, z);
      g.add(merlon);
    }
  }
  for (let z = -3; z <= 3; z += 1) {
    for (const x of [-4.9, 4.9]) {
      const merlon = box(0.7, 1, 0.7, 0x504050);
      merlon.position.set(x, 6.5, z);
      g.add(merlon);
    }
  }

  // Tours d'angle
  for (const [cx, cz] of [[-5, -4], [5, -4], [-5, 4], [5, 4]]) {
    const tower = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.4, 8, 12),
      texMat(TEX.castle, { color: 0x403040 })
    );
    tower.position.set(cx, 4, cz);
    tower.castShadow = true;
    g.add(tower);

    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(1.5, 2.5, 12),
      mat(0x1a0a1a)
    );
    roof.position.set(cx, 9.2, cz);
    g.add(roof);

    // Pics au sommet
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const spike = new THREE.Mesh(
        new THREE.ConeGeometry(0.15, 0.8, 4),
        mat(PAL3D.white)
      );
      spike.position.set(cx + Math.cos(a) * 1.4, 9.5, cz + Math.sin(a) * 1.4);
      g.add(spike);
    }

    // Drapeau noir à crâne
    const fp = cyl(0.03, 0.03, 1.2, 0x000000, 4);
    fp.position.set(cx, 11.5, cz);
    g.add(fp);
    const fl = box(0.5, 0.3, 0.02, 0x202020);
    fl.position.set(cx + 0.25, 11.9, cz);
    g.add(fl);
  }

  // Porte massive
  const doorOuter = box(2, 3.5, 0.3, 0x3a2a1a);
  doorOuter.position.set(0, 1.75, 4.05);
  g.add(doorOuter);
  // Crocs sur la porte (gueule de Bowser)
  const fangLeft = new THREE.Mesh(
    new THREE.ConeGeometry(0.15, 0.4, 4),
    mat(PAL3D.white)
  );
  fangLeft.position.set(-0.4, 2.2, 4.2);
  fangLeft.rotation.x = Math.PI;
  g.add(fangLeft);
  const fangRight = new THREE.Mesh(
    new THREE.ConeGeometry(0.15, 0.4, 4),
    mat(PAL3D.white)
  );
  fangRight.position.set(0.4, 2.2, 4.2);
  fangRight.rotation.x = Math.PI;
  g.add(fangRight);
  // Yeux rouges de la porte
  for (const x of [-0.4, 0.4]) {
    const eye = sphere(0.12, 0xff0000, 8);
    eye.material.emissive = new THREE.Color(0xaa0000);
    eye.position.set(x, 3, 4.2);
    g.add(eye);
  }

  // Logo tête de Bowser en relief au-dessus de la porte
  // (simplifié : grand cercle jaune avec visage)
  const logo = sphere(0.6, 0xffa040, 12);
  logo.position.set(0, 5, 4.05);
  logo.scale.z = 0.3;
  g.add(logo);
  // Yeux
  for (const x of [-0.2, 0.2]) {
    const e = sphere(0.06, 0x000000, 6);
    e.position.set(x, 5.1, 4.25);
    g.add(e);
  }

  // Pics acérés sur le haut du mur
  for (let x = -4; x <= 4; x += 2) {
    const pic = new THREE.Mesh(
      new THREE.ConeGeometry(0.3, 1, 4),
      mat(PAL3D.white)
    );
    pic.position.set(x, 8, 4);
    g.add(pic);
  }

  // Flammes décoratives
  for (const [fx, fz] of [[-3, 4.5], [3, 4.5]]) {
    const flameBase = cyl(0.3, 0.3, 0.3, 0x666666, 8);
    flameBase.position.set(fx, 0.15, fz);
    g.add(flameBase);
    const flame = sphere(0.4, 0xff4410, 8);
    flame.material.emissive = new THREE.Color(0xaa2200);
    flame.scale.y = 1.5;
    flame.position.set(fx, 0.8, fz);
    g.add(flame);
    const flameInner = sphere(0.25, 0xffaa20, 6);
    flameInner.material.emissive = new THREE.Color(0xff8800);
    flameInner.scale.y = 1.3;
    flameInner.position.set(fx, 0.7, fz);
    g.add(flameInner);
    flame.userData.isFlame = true;
    flameInner.userData.isFlame = true;
    // point light
    const pl = new THREE.PointLight(0xff6620, 1.2, 8);
    pl.position.set(fx, 1, fz);
    g.add(pl);
  }

  return g;
}

// ---------- Maison de Mario (classique rouge et blanche) ----------
function buildMarioHouse() {
  const g = new THREE.Group();

  // Mur principal avec texture bois
  const walls = box(3.5, 2.8, 3.5, 0xf4d8a0);
  walls.material = new THREE.MeshLambertMaterial({ map: TEX.wood, color: 0xf4f0e0 });
  walls.position.y = 1.4;
  walls.castShadow = true;
  g.add(walls);

  // Bande décorative
  const trim = box(3.6, 0.15, 3.6, PAL3D.red);
  trim.position.y = 0.3;
  g.add(trim);
  const trim2 = box(3.6, 0.15, 3.6, PAL3D.red);
  trim2.position.y = 2.6;
  g.add(trim2);

  // Toit pyramidal rouge
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(2.8, 2, 4),
    texMat(TEX.roofRed)
  );
  roof.rotation.y = Math.PI / 4;
  roof.position.y = 3.8;
  roof.castShadow = true;
  g.add(roof);

  // Cheminée
  const chim = box(0.4, 1.2, 0.4, 0x8a3020);
  chim.material = texMat(TEX.brick);
  chim.position.set(1, 4.2, 0);
  g.add(chim);

  // Logo M
  const mPlate = new THREE.Mesh(
    new THREE.CircleGeometry(0.4, 16),
    mat(PAL3D.white)
  );
  mPlate.position.set(0, 3.3, 1.76);
  mPlate.rotation.y = Math.PI; // face avant
  mPlate.position.set(0, 3.3, 1.76);
  g.add(mPlate);
  // M rouge
  const mLetter = new THREE.Mesh(
    new THREE.CircleGeometry(0.25, 16),
    mat(PAL3D.red, { emissive: 0x330000 })
  );
  mLetter.position.set(0, 3.3, 1.77);
  g.add(mLetter);

  // Porte rouge
  const door = box(0.9, 1.6, 0.1, PAL3D.red);
  door.position.set(0, 0.8, 1.76);
  g.add(door);
  const handle = sphere(0.08, PAL3D.block, 6);
  handle.position.set(0.3, 0.9, 1.83);
  g.add(handle);
  // Contour de porte
  const doorFrame = box(1.0, 1.7, 0.05, PAL3D.white);
  doorFrame.position.set(0, 0.85, 1.74);
  g.add(doorFrame);

  // Fenêtres
  for (const fx of [-1.1, 1.1]) {
    const w = box(0.7, 0.7, 0.05, 0x80c8ff, { emissive: 0x002244 });
    w.position.set(fx, 1.7, 1.76);
    g.add(w);
    const frame = box(0.8, 0.8, 0.06, PAL3D.white);
    frame.position.set(fx, 1.7, 1.74);
    g.add(frame);
    // Croisillons
    const cH = box(0.75, 0.04, 0.02, PAL3D.white);
    cH.position.set(fx, 1.7, 1.79);
    g.add(cH);
    const cV = box(0.04, 0.75, 0.02, PAL3D.white);
    cV.position.set(fx, 1.7, 1.79);
    g.add(cV);
  }

  // Boîte aux lettres
  const mbPole = cyl(0.04, 0.04, 0.8, 0x2a1a0a, 4);
  mbPole.position.set(-2, 0.4, 2);
  g.add(mbPole);
  const mbBox = box(0.3, 0.2, 0.4, PAL3D.red);
  mbBox.position.set(-2, 0.9, 2);
  g.add(mbBox);

  return g;
}
