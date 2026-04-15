/* =====================================================
   three-heroes.js - Héros humains (Mario, Luigi, Wario,
   Peach, Daisy) avec morphologies distinctes
   ===================================================== */

// --- Helpers yeux/bouche ---
function _eyes(g, y, z, opts = {}) {
  const sp = opts.spacing || 0.1;
  const pupilCol = opts.pupil || 0x0a1a5a;
  const lashes = opts.lashes || false;
  for (const x of [-sp, sp]) {
    const w = sphere(0.065, PAL3D.white, 10);
    w.scale.x = 1.25;
    w.position.set(x, y, z);
    g.add(w);
    const p = sphere(0.032, pupilCol, 6);
    p.position.set(x, y - 0.005, z + 0.055);
    g.add(p);
    // Reflet
    const hl = sphere(0.012, PAL3D.white, 4);
    hl.position.set(x + 0.015, y + 0.015, z + 0.065);
    g.add(hl);
    if (lashes) {
      const lash = box(0.075, 0.012, 0.015, 0x1a0a0a);
      lash.position.set(x, y + 0.055, z + 0.05);
      lash.rotation.z = x > 0 ? 0.25 : -0.25;
      g.add(lash);
    }
  }
}

function _mustache(g, y, z, style = 'normal') {
  const col = 0x1a0a00;
  if (style === 'zigzag') {
    // Wario - zigzag (4 blocs alternés en hauteur)
    for (let i = 0; i < 4; i++) {
      const dx = (i - 1.5) * 0.09;
      const dy = i % 2 === 0 ? 0.02 : -0.02;
      const p = box(0.08, 0.07, 0.1, col);
      p.position.set(dx, y + dy, z);
      g.add(p);
    }
  } else {
    const mL = box(0.14, 0.06, 0.1, col);
    mL.position.set(-0.09, y, z);
    mL.rotation.z = -0.25;
    g.add(mL);
    const mR = box(0.14, 0.06, 0.1, col);
    mR.position.set(0.09, y, z);
    mR.rotation.z = 0.25;
    g.add(mR);
  }
}

function _cap(color, initial) {
  const g = new THREE.Group();
  const top = new THREE.Mesh(
    new THREE.SphereGeometry(0.31, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    mat(color)
  );
  g.add(top);
  const brim = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 16, 8, 0, Math.PI, 0, Math.PI / 2),
    mat(color)
  );
  brim.position.set(0, -0.01, 0.22);
  brim.scale.set(1.3, 0.25, 1.1);
  g.add(brim);
  // Logo plate
  const plate = new THREE.Mesh(
    new THREE.CircleGeometry(0.12, 16),
    mat(PAL3D.white)
  );
  plate.position.set(0, 0.05, 0.30);
  g.add(plate);
  // Letter via canvas texture
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 64, 64);
  ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
  ctx.font = 'bold 60px Arial Black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initial, 32, 38);
  const tex = new THREE.CanvasTexture(canvas);
  const letter = new THREE.Mesh(
    new THREE.PlaneGeometry(0.18, 0.18),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true })
  );
  letter.position.set(0, 0.05, 0.305);
  g.add(letter);
  return g;
}

// --- Plombier (Mario/Luigi/Wario) ---
function buildPlumber(o) {
  const {
    capColor, shirtColor, pantsColor, skin = PAL3D.skin,
    initial = 'M', tall = 1, fat = 1,
    mustache = 'normal', noseBig = false
  } = o;
  const g = new THREE.Group();

  // Jambes
  const legL = cyl(0.13 * fat, 0.14 * fat, 0.48 * tall, pantsColor, 12);
  legL.position.set(-0.17, 0.24 * tall, 0);
  g.add(legL);
  const legR = cyl(0.13 * fat, 0.14 * fat, 0.48 * tall, pantsColor, 12);
  legR.position.set(0.17, 0.24 * tall, 0);
  g.add(legR);

  // Chaussures (demi-sphères aplaties, bouts ronds)
  function shoe() {
    const s = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      mat(PAL3D.brown)
    );
    s.rotation.x = Math.PI;
    s.scale.set(1.1, 1, 1.5);
    return s;
  }
  const shoeL = shoe();
  shoeL.position.set(-0.17, 0.08, 0.08);
  g.add(shoeL);
  const shoeR = shoe();
  shoeR.position.set(0.17, 0.08, 0.08);
  g.add(shoeR);

  // Torse (tronc cylindrique arrondi)
  const torsoY = 0.85 * tall + 0.05;
  const torso = new THREE.Mesh(
    new THREE.CylinderGeometry(0.33 * fat, 0.3 * fat, 0.55 * tall, 20),
    mat(shirtColor)
  );
  torso.position.y = torsoY;
  g.add(torso);
  // Ventre rond
  const belly = sphere(0.3 * fat, shirtColor, 16);
  belly.position.set(0, torsoY - 0.1 * tall, 0.08);
  belly.scale.z = 0.7;
  g.add(belly);

  // Salopette bas
  const ovBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.335 * fat, 0.305 * fat, 0.35 * tall, 20),
    mat(pantsColor)
  );
  ovBody.position.y = torsoY - 0.1 * tall;
  g.add(ovBody);

  // Salopette bavette
  const bib = box(0.28 * fat, 0.28 * tall, 0.05, pantsColor);
  bib.position.set(0, torsoY + 0.08 * tall, 0.3 * fat);
  g.add(bib);
  // Bretelles
  for (const sx of [-0.12 * fat, 0.12 * fat]) {
    const strap = box(0.08, 0.5 * tall, 0.05, pantsColor);
    strap.position.set(sx, torsoY + 0.25 * tall, 0.3 * fat);
    strap.rotation.x = -0.1;
    g.add(strap);
  }
  // Boutons
  for (const bx of [-0.08 * fat, 0.08 * fat]) {
    const btn = sphere(0.05, PAL3D.block, 10);
    btn.material.emissive = new THREE.Color(0x553300);
    btn.position.set(bx, torsoY + 0.05 * tall, 0.33 * fat);
    g.add(btn);
  }

  // Bras
  const armL = cyl(0.11, 0.1, 0.45 * tall, shirtColor, 12);
  armL.position.set(-0.42 * fat, torsoY, 0);
  armL.rotation.z = 0.18;
  g.add(armL);
  const armR = cyl(0.11, 0.1, 0.45 * tall, shirtColor, 12);
  armR.position.set(0.42 * fat, torsoY, 0);
  armR.rotation.z = -0.18;
  g.add(armR);
  // Gants
  const gL = sphere(0.14, PAL3D.white, 12);
  gL.position.set(-0.5 * fat, torsoY - 0.24 * tall, 0);
  g.add(gL);
  const gR = sphere(0.14, PAL3D.white, 12);
  gR.position.set(0.5 * fat, torsoY - 0.24 * tall, 0);
  g.add(gR);

  // Tête
  const headY = torsoY + 0.42 * tall;
  const head = sphere(0.3, skin, 20);
  head.scale.y = 0.92;
  head.position.y = headY;
  g.add(head);
  // Oreilles
  for (const ex of [-0.3, 0.3]) {
    const ear = sphere(0.07, skin, 8);
    ear.position.set(ex, headY, 0);
    g.add(ear);
  }

  _eyes(g, headY + 0.04, 0.26);

  // Nez
  const nose = sphere(noseBig ? 0.12 : 0.09, skin, 10);
  nose.position.set(0, headY - 0.06, 0.28);
  g.add(nose);

  _mustache(g, headY - 0.14, 0.28, mustache);

  // Bouche (sourire léger sous la moustache)
  const smile = new THREE.Mesh(
    new THREE.TorusGeometry(0.05, 0.012, 4, 8, Math.PI),
    mat(0x660000)
  );
  smile.rotation.x = Math.PI / 2;
  smile.position.set(0, headY - 0.2, 0.27);
  g.add(smile);

  // Casquette
  const cap = _cap(capColor, initial);
  cap.position.y = headY + 0.18;
  g.add(cap);

  g.traverse(o2 => { if (o2.isMesh) o2.castShadow = true; });

  g.userData.legL = legL;
  g.userData.legR = legR;
  g.userData.armL = armL;
  g.userData.armR = armR;
  g.userData.shoeL = shoeL;
  g.userData.shoeR = shoeR;
  return g;
}

function buildMario() {
  return buildPlumber({
    capColor: 0xe52521, shirtColor: 0xe52521, pantsColor: 0x2b75d8,
    initial: 'M'
  });
}

function buildLuigi() {
  const g = buildPlumber({
    capColor: 0x2e8b2e, shirtColor: 0x2e8b2e, pantsColor: 0x2b75d8,
    initial: 'L', tall: 1.2
  });
  g.scale.x = 0.92; // plus mince
  return g;
}

function buildWario() {
  return buildPlumber({
    capColor: 0xffe400, shirtColor: 0xffe400, pantsColor: 0x7020a0,
    initial: 'W', fat: 1.4, mustache: 'zigzag', noseBig: true, skin: 0xffb890
  });
}

// ==================================================
// Princesses (Peach, Daisy)
// ==================================================
function buildPrincess(o) {
  const {
    dress, trim, dressInner = 0xffd8ec,
    hair, crownStyle = 'crown', earring = 0xdd2020,
    lipColor = 0xdd2050
  } = o;
  const g = new THREE.Group();

  // Robe : jupe ample en cône
  const skirtMat = new THREE.MeshLambertMaterial({ color: dress, side: THREE.DoubleSide });
  const skirt = new THREE.Mesh(
    new THREE.ConeGeometry(0.6, 1.0, 24, 1, true),
    skirtMat
  );
  skirt.position.y = 0.5;
  skirt.castShadow = true;
  g.add(skirt);
  // Doublure intérieure visible sous la jupe
  const innerMat = new THREE.MeshLambertMaterial({ color: dressInner, side: THREE.DoubleSide });
  const inner = new THREE.Mesh(
    new THREE.ConeGeometry(0.57, 0.95, 24, 1, true),
    innerMat
  );
  inner.position.y = 0.49;
  g.add(inner);

  // Bordure de la jupe
  const hem = new THREE.Mesh(
    new THREE.TorusGeometry(0.6, 0.04, 8, 24),
    mat(trim)
  );
  hem.rotation.x = Math.PI / 2;
  hem.position.y = 0.05;
  g.add(hem);

  // Socle invisible (pour l'ombre sous la robe)
  const base = cyl(0.3, 0.6, 0.1, dress, 16);
  base.position.y = 0.05;
  g.add(base);

  // Ceinture / taille
  const waist = new THREE.Mesh(
    new THREE.TorusGeometry(0.2, 0.04, 6, 20),
    mat(trim)
  );
  waist.rotation.x = Math.PI / 2;
  waist.position.y = 1.02;
  g.add(waist);

  // Buste
  const bust = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.2, 0.3, 18),
    mat(dress)
  );
  bust.position.y = 1.18;
  g.add(bust);
  // Petit épaulement/corsage bombé
  const chest = sphere(0.23, dress, 14);
  chest.scale.set(1.1, 0.55, 0.9);
  chest.position.set(0, 1.15, 0.05);
  g.add(chest);

  // Décolleté en V (peau)
  const neckV = new THREE.Mesh(
    new THREE.ConeGeometry(0.08, 0.1, 3),
    mat(PAL3D.skin)
  );
  neckV.rotation.x = Math.PI;
  neckV.position.set(0, 1.24, 0.2);
  g.add(neckV);

  // Broche / médaillon
  const brooch = sphere(0.05, PAL3D.block, 10);
  brooch.material.emissive = new THREE.Color(0x553300);
  brooch.position.set(0, 1.1, 0.23);
  g.add(brooch);

  // Bras avec longs gants blancs
  const armL = cyl(0.07, 0.065, 0.45, PAL3D.white, 10);
  armL.position.set(-0.27, 1.15, 0);
  armL.rotation.z = 0.15;
  g.add(armL);
  const armR = cyl(0.07, 0.065, 0.45, PAL3D.white, 10);
  armR.position.set(0.27, 1.15, 0);
  armR.rotation.z = -0.15;
  g.add(armR);
  // Mains gantées
  const hL = sphere(0.09, PAL3D.white, 10);
  hL.position.set(-0.3, 0.93, 0);
  g.add(hL);
  const hR = sphere(0.09, PAL3D.white, 10);
  hR.position.set(0.3, 0.93, 0);
  g.add(hR);
  // Anneaux au sommet des gants (accents trim)
  for (const ax of [-0.27, 0.27]) {
    const band = new THREE.Mesh(
      new THREE.TorusGeometry(0.08, 0.018, 6, 12),
      mat(trim)
    );
    band.rotation.x = Math.PI / 2;
    band.position.set(ax, 1.35, 0);
    g.add(band);
  }

  // Cou
  const neck = cyl(0.08, 0.08, 0.1, PAL3D.skin, 10);
  neck.position.y = 1.37;
  g.add(neck);

  // Tête plus petite et féminine
  const head = sphere(0.24, PAL3D.skin, 20);
  head.scale.set(0.98, 1.05, 0.95);
  head.position.y = 1.55;
  g.add(head);

  // Cheveux longs derrière (masse principale)
  const backHair = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 16, 12),
    mat(hair)
  );
  backHair.scale.set(1.05, 1.2, 1.05);
  backHair.position.set(0, 1.58, -0.05);
  g.add(backHair);
  // Mèches latérales tombantes
  for (const sx of [-1, 1]) {
    const strand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.04, 0.55, 10),
      mat(hair)
    );
    strand.position.set(sx * 0.22, 1.35, 0.03);
    strand.rotation.z = sx * 0.12;
    g.add(strand);
    // Boucle au bout
    const tip = sphere(0.05, hair, 8);
    tip.position.set(sx * 0.28, 1.1, 0.05);
    g.add(tip);
  }
  // Frange au-dessus des yeux
  const bangs = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2.5),
    mat(hair)
  );
  bangs.position.set(0, 1.68, 0.02);
  bangs.scale.set(1, 0.8, 1);
  g.add(bangs);

  // Yeux avec cils
  _eyes(g, 1.55, 0.22, { spacing: 0.08, pupil: 0x1a4aa0, lashes: true });

  // Nez (petit)
  const nose = sphere(0.03, PAL3D.skin, 6);
  nose.position.set(0, 1.48, 0.24);
  g.add(nose);

  // Lèvres (arc rouge)
  const lips = new THREE.Mesh(
    new THREE.TorusGeometry(0.035, 0.012, 4, 10, Math.PI),
    mat(lipColor)
  );
  lips.rotation.x = Math.PI / 2;
  lips.position.set(0, 1.42, 0.23);
  g.add(lips);
  // Lèvre inférieure
  const lipLower = box(0.06, 0.02, 0.03, lipColor);
  lipLower.position.set(0, 1.41, 0.24);
  g.add(lipLower);

  // Joues roses
  for (const cx of [-0.13, 0.13]) {
    const blush = sphere(0.05, 0xff8090, 6);
    blush.material.transparent = true;
    blush.material.opacity = 0.5;
    blush.scale.set(1, 0.4, 0.3);
    blush.position.set(cx, 1.5, 0.21);
    g.add(blush);
  }

  // Boucles d'oreilles
  for (const ex of [-0.22, 0.22]) {
    const stud = sphere(0.025, earring, 8);
    stud.material.emissive = new THREE.Color(earring).multiplyScalar(0.3);
    stud.position.set(ex, 1.5, 0.04);
    g.add(stud);
  }

  // Couronne
  if (crownStyle === 'crown') {
    const crown = new THREE.Mesh(
      new THREE.CylinderGeometry(0.19, 0.22, 0.08, 10),
      mat(PAL3D.block)
    );
    crown.position.y = 1.82;
    g.add(crown);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const spike = new THREE.Mesh(
        new THREE.ConeGeometry(0.035, 0.08, 4),
        mat(PAL3D.block)
      );
      spike.position.set(Math.cos(a) * 0.19, 1.9, Math.sin(a) * 0.19);
      g.add(spike);
    }
    // Gemmes bleues
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + Math.PI / 5;
      const gem = sphere(0.022, 0x2060d0, 6);
      gem.material.emissive = new THREE.Color(0x001a44);
      gem.position.set(Math.cos(a) * 0.2, 1.83, Math.sin(a) * 0.2);
      g.add(gem);
    }
  } else if (crownStyle === 'flower') {
    // Couronne de fleur pour Daisy
    const band = new THREE.Mesh(
      new THREE.TorusGeometry(0.22, 0.015, 6, 16),
      mat(0xffffff)
    );
    band.rotation.x = Math.PI / 2;
    band.position.y = 1.78;
    g.add(band);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      for (let p = 0; p < 5; p++) {
        const pa = (p / 5) * Math.PI * 2;
        const petal = sphere(0.03, PAL3D.white, 6);
        petal.position.set(
          Math.cos(a) * 0.22 + Math.cos(pa) * 0.04,
          1.82,
          Math.sin(a) * 0.22 + Math.sin(pa) * 0.04
        );
        g.add(petal);
      }
      const center = sphere(0.028, PAL3D.yellow, 6);
      center.position.set(Math.cos(a) * 0.22, 1.83, Math.sin(a) * 0.22);
      g.add(center);
    }
  }

  g.traverse(o2 => { if (o2.isMesh) o2.castShadow = true; });

  // Objets d'animation factices (la robe ne bouge pas)
  g.userData.legL = { rotation: { x: 0 } };
  g.userData.legR = { rotation: { x: 0 } };
  g.userData.armL = armL;
  g.userData.armR = armR;
  g.userData.shoeL = { rotation: { x: 0 } };
  g.userData.shoeR = { rotation: { x: 0 } };
  return g;
}

function buildPeach() {
  return buildPrincess({
    dress: 0xffa8d4, trim: 0xd06ba0,
    dressInner: 0xffd8ec, hair: 0xf4e070,
    crownStyle: 'crown', earring: 0x2060d0, lipColor: 0xdd2050
  });
}

function buildDaisy() {
  return buildPrincess({
    dress: 0xffb030, trim: 0xffffff,
    dressInner: 0xfff0c8, hair: 0xc04810,
    crownStyle: 'flower', earring: 0xff8020, lipColor: 0xcc4030
  });
}
