/* =====================================================
   three-textures.js - Textures procédurales (Canvas)
   ===================================================== */

function canvasTex(size, drawFn) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  drawFn(c.getContext('2d'), size);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.magFilter = THREE.LinearFilter;
  return t;
}

// ---------- Herbe (style Animal Crossing : douce, saturée) ----------
function makeGrassTexture() {
  return canvasTex(512, (ctx, s) => {
    // Fond vert saturé uniforme
    ctx.fillStyle = '#67c04a';
    ctx.fillRect(0, 0, s, s);
    // Patches vert clair
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * s, y = Math.random() * s;
      const r = 15 + Math.random() * 30;
      const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
      grd.addColorStop(0, 'rgba(140, 220, 110, 0.55)');
      grd.addColorStop(1, 'rgba(140, 220, 110, 0)');
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    // Patches vert foncé
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * s, y = Math.random() * s;
      const r = 10 + Math.random() * 20;
      const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
      grd.addColorStop(0, 'rgba(50, 130, 40, 0.4)');
      grd.addColorStop(1, 'rgba(50, 130, 40, 0)');
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    // Petits détails subtils (brins discrets)
    for (let i = 0; i < 150; i++) {
      ctx.strokeStyle = `rgba(80, 160, 60, ${0.3 + Math.random() * 0.3})`;
      ctx.lineWidth = 1;
      const x = Math.random() * s, y = Math.random() * s;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y - 3);
      ctx.stroke();
    }
  });
}

// ---------- Briques (propres et stylisées) ----------
function makeBrickTexture() {
  return canvasTex(256, (ctx, s) => {
    // Fond joint clair
    ctx.fillStyle = '#8a6040';
    ctx.fillRect(0, 0, s, s);
    const bw = 64, bh = 32;
    for (let y = 0; y < s; y += bh) {
      const off = (y / bh) % 2 === 0 ? 0 : bw / 2;
      for (let x = -bw; x < s + bw; x += bw) {
        const bx = x + off;
        // Couleur brique variée
        const hue = 18 + Math.random() * 8;
        const lum = 45 + Math.random() * 10;
        // Dégradé doux
        const grd = ctx.createLinearGradient(bx, y, bx, y + bh);
        grd.addColorStop(0, `hsl(${hue}, 60%, ${lum + 10}%)`);
        grd.addColorStop(0.5, `hsl(${hue}, 65%, ${lum}%)`);
        grd.addColorStop(1, `hsl(${hue}, 55%, ${lum - 5}%)`);
        ctx.fillStyle = grd;
        // Brique arrondie
        const r = 4;
        ctx.beginPath();
        ctx.moveTo(bx + r + 2, y + 3);
        ctx.arcTo(bx + bw - 2, y + 3, bx + bw - 2, y + bh - 3, r);
        ctx.arcTo(bx + bw - 2, y + bh - 3, bx + 2, y + bh - 3, r);
        ctx.arcTo(bx + 2, y + bh - 3, bx + 2, y + 3, r);
        ctx.arcTo(bx + 2, y + 3, bx + bw - 2, y + 3, r);
        ctx.closePath();
        ctx.fill();
        // Reflet en haut
        ctx.fillStyle = `hsla(${hue}, 70%, 75%, 0.3)`;
        ctx.fillRect(bx + 4, y + 4, bw - 8, 3);
      }
    }
  });
}

// ---------- Bois (planches propres) ----------
function makeWoodTexture() {
  return canvasTex(256, (ctx, s) => {
    // Planches verticales
    const plankW = 64;
    for (let x = 0; x < s; x += plankW) {
      // Couleur variée par planche
      const hue = 28 + Math.random() * 10;
      const sat = 45 + Math.random() * 15;
      const lum = 50 + Math.random() * 10;
      ctx.fillStyle = `hsl(${hue}, ${sat}%, ${lum}%)`;
      ctx.fillRect(x, 0, plankW, s);
      // Veines douces
      for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = `hsla(${hue}, 60%, 35%, 0.15)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const yOff = (i / 5) * s;
        for (let y = 0; y < s; y += 2) {
          const vx = x + plankW / 2 + Math.sin(y * 0.05 + i) * (plankW * 0.3);
          if (y === 0) ctx.moveTo(vx, y); else ctx.lineTo(vx, y);
        }
        ctx.stroke();
      }
      // Joint foncé entre planches
      ctx.fillStyle = 'rgba(60, 30, 10, 0.5)';
      ctx.fillRect(x + plankW - 2, 0, 2, s);
    }
  });
}

// ---------- Pierre (dalles propres style AC) ----------
function makeStoneTexture() {
  return canvasTex(512, (ctx, s) => {
    ctx.fillStyle = '#f0d9a8';
    ctx.fillRect(0, 0, s, s);
    // Dalles régulières avec léger décalage
    const dw = 120, dh = 80;
    for (let y = -dh; y < s + dh; y += dh) {
      const off = (Math.floor(y / dh) % 2) * (dw / 2);
      for (let x = -dw; x < s + dw; x += dw) {
        const dx = x + off, dy = y;
        // Couleur légèrement variée
        const hue = 35 + Math.random() * 10;
        const sat = 35 + Math.random() * 15;
        const lum = 70 + Math.random() * 10;
        ctx.fillStyle = `hsl(${hue}, ${sat}%, ${lum}%)`;
        // Dalle arrondie
        const r = 8;
        ctx.beginPath();
        ctx.moveTo(dx + r + 3, dy + 3);
        ctx.arcTo(dx + dw - 3, dy + 3, dx + dw - 3, dy + dh - 3, r);
        ctx.arcTo(dx + dw - 3, dy + dh - 3, dx + 3, dy + dh - 3, r);
        ctx.arcTo(dx + 3, dy + dh - 3, dx + 3, dy + 3, r);
        ctx.arcTo(dx + 3, dy + 3, dx + dw - 3, dy + 3, r);
        ctx.closePath();
        ctx.fill();
        // Ombre du joint
        ctx.strokeStyle = 'rgba(100, 70, 30, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  });
}

// ---------- Sable ----------
function makeSandTexture() {
  return canvasTex(128, (ctx, s) => {
    ctx.fillStyle = '#f4d580';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 2000; i++) {
      const shade = Math.random();
      ctx.fillStyle = shade < 0.5 ? 'rgba(216, 168, 74, 0.4)' : 'rgba(255, 240, 180, 0.3)';
      ctx.fillRect(Math.random() * s, Math.random() * s, 1, 1);
    }
    // Ondulations
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = 'rgba(180, 130, 60, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      const y = Math.random() * s;
      ctx.moveTo(0, y);
      for (let x = 0; x < s; x += 4) {
        ctx.lineTo(x, y + Math.sin(x * 0.2) * 2);
      }
      ctx.stroke();
    }
  });
}

// ---------- Pierre du château ----------
function makeCastleStoneTexture() {
  return canvasTex(128, (ctx, s) => {
    ctx.fillStyle = '#9a9aa8';
    ctx.fillRect(0, 0, s, s);
    const bw = 32, bh = 16;
    for (let y = 0; y < s; y += bh) {
      const offset = (y / bh) % 2 === 0 ? 0 : bw / 2;
      for (let x = -bw; x < s + bw; x += bw) {
        const bx = x + offset;
        const shade = 130 + Math.random() * 50;
        ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade + 10})`;
        ctx.fillRect(bx + 1, y + 1, bw - 2, bh - 2);
        // tache d'usure
        if (Math.random() < 0.3) {
          ctx.fillStyle = 'rgba(40, 40, 50, 0.2)';
          ctx.fillRect(bx + Math.random() * 20, y + Math.random() * 10, 5, 3);
        }
      }
    }
  });
}

// ---------- Toit tuile ----------
function makeRoofTexture(color = '#c32020') {
  return canvasTex(128, (ctx, s) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, s, s);
    // Tuiles
    const tw = 16, th = 10;
    for (let y = 0; y < s; y += th) {
      const offset = (y / th) % 2 === 0 ? 0 : tw / 2;
      for (let x = -tw; x < s + tw; x += tw) {
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.beginPath();
        ctx.arc(x + offset + tw / 2, y + th, tw / 2, Math.PI, 0);
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x + offset + tw / 2, y + th, tw / 2, Math.PI, 0);
        ctx.stroke();
      }
    }
  });
}

// ---------- Eau animée ----------
function makeWaterTexture() {
  return canvasTex(256, (ctx, s) => {
    const g = ctx.createLinearGradient(0, 0, s, s);
    g.addColorStop(0, '#3a95d8');
    g.addColorStop(0.5, '#4aa8e0');
    g.addColorStop(1, '#2570b0');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    // Reflets
    for (let i = 0; i < 30; i++) {
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const y = Math.random() * s;
      ctx.moveTo(Math.random() * s, y);
      ctx.lineTo(Math.random() * s, y + 3);
      ctx.stroke();
    }
  });
}

// ---------- Terre labourée ----------
function makeDirtTexture() {
  return canvasTex(128, (ctx, s) => {
    ctx.fillStyle = '#6b3a1a';
    ctx.fillRect(0, 0, s, s);
    // Sillons
    for (let y = 0; y < s; y += 16) {
      ctx.fillStyle = '#4a2a10';
      ctx.fillRect(0, y, s, 3);
      ctx.fillStyle = '#8a4a20';
      ctx.fillRect(0, y + 8, s, 2);
    }
    // Grain
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.3})`;
      ctx.fillRect(Math.random() * s, Math.random() * s, 1, 1);
    }
  });
}

// ---------- Cache global ----------
const TEX = {};
function initTextures() {
  TEX.grass   = makeGrassTexture();
  TEX.brick   = makeBrickTexture();
  TEX.wood    = makeWoodTexture();
  TEX.stone   = makeStoneTexture();
  TEX.sand    = makeSandTexture();
  TEX.castle  = makeCastleStoneTexture();
  TEX.roofRed = makeRoofTexture('#c32020');
  TEX.roofGreen = makeRoofTexture('#2e8b2e');
  TEX.roofPink = makeRoofTexture('#e090c0');
  TEX.roofBlue = makeRoofTexture('#4a7ac8');
  TEX.water   = makeWaterTexture();
  TEX.dirt    = makeDirtTexture();

  // Répétitions par défaut (herbe tuilée finement pour un effet dense)
  TEX.grass.repeat.set(45, 45);
  TEX.stone.repeat.set(1, 1);
  TEX.sand.repeat.set(3, 3);
  TEX.water.repeat.set(3, 3);
  TEX.dirt.repeat.set(2, 2);
}

// Matériau avec texture
function texMat(tex, opts = {}) {
  return new THREE.MeshLambertMaterial({ map: tex, ...opts });
}
