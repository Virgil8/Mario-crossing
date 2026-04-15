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

// ---------- Herbe ----------
function makeGrassTexture() {
  return canvasTex(256, (ctx, s) => {
    // Fond dégradé vert
    const g = ctx.createLinearGradient(0, 0, 0, s);
    g.addColorStop(0, '#4fba3a');
    g.addColorStop(1, '#3a9a2a');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    // Brins d'herbe
    for (let i = 0; i < 600; i++) {
      const x = Math.random() * s;
      const y = Math.random() * s;
      const h = 2 + Math.random() * 6;
      const shade = Math.random();
      ctx.strokeStyle = shade < 0.3 ? '#2a7a1a'
                     : shade < 0.7 ? '#5dc14f'
                                   : '#70d862';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() - 0.5) * 2, y - h);
      ctx.stroke();
    }
    // Petites fleurs aléatoires
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * s, y = Math.random() * s;
      ctx.fillStyle = ['#ffe400', '#ffffff', '#ffb6d9'][i % 3];
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

// ---------- Briques ----------
function makeBrickTexture() {
  return canvasTex(128, (ctx, s) => {
    ctx.fillStyle = '#7a3a10';
    ctx.fillRect(0, 0, s, s);
    const bw = 32, bh = 16;
    for (let y = 0; y < s; y += bh) {
      const offset = (y / bh) % 2 === 0 ? 0 : bw / 2;
      for (let x = -bw; x < s + bw; x += bw) {
        const bx = x + offset;
        // Dégradé brique
        const grd = ctx.createLinearGradient(bx, y, bx + bw, y + bh);
        grd.addColorStop(0, '#d88a4a');
        grd.addColorStop(0.5, '#c76b2a');
        grd.addColorStop(1, '#a04a10');
        ctx.fillStyle = grd;
        ctx.fillRect(bx + 1, y + 1, bw - 2, bh - 2);
        // Variations
        if (Math.random() < 0.3) {
          ctx.fillStyle = 'rgba(0,0,0,0.15)';
          ctx.fillRect(bx + 2 + Math.random() * 10, y + 3, 4 + Math.random() * 8, 2);
        }
      }
    }
  });
}

// ---------- Bois ----------
function makeWoodTexture() {
  return canvasTex(128, (ctx, s) => {
    ctx.fillStyle = '#b98850';
    ctx.fillRect(0, 0, s, s);
    // Veines
    for (let i = 0; i < 8; i++) {
      const y = (i / 8) * s + Math.random() * 4;
      ctx.strokeStyle = `rgba(80, 40, 10, ${0.2 + Math.random() * 0.3})`;
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x < s; x += 4) {
        ctx.lineTo(x, y + Math.sin(x * 0.1 + i) * 3);
      }
      ctx.stroke();
    }
    // Noeuds du bois
    for (let i = 0; i < 3; i++) {
      const x = Math.random() * s, y = Math.random() * s;
      const r = 3 + Math.random() * 4;
      const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
      grd.addColorStop(0, '#5a3010');
      grd.addColorStop(1, 'rgba(90, 48, 16, 0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

// ---------- Pierre (chemin) ----------
function makeStoneTexture() {
  return canvasTex(256, (ctx, s) => {
    ctx.fillStyle = '#e8c99b';
    ctx.fillRect(0, 0, s, s);
    // Pavés irréguliers
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * s, y = Math.random() * s;
      const w = 20 + Math.random() * 25;
      const h = 20 + Math.random() * 25;
      const shade = 180 + Math.random() * 50;
      ctx.fillStyle = `rgb(${shade - 20}, ${shade - 40}, ${shade - 70})`;
      ctx.beginPath();
      ctx.ellipse(x, y, w / 2, h / 2, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(80, 60, 30, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    // Grain
    for (let i = 0; i < 500; i++) {
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.1})`;
      ctx.fillRect(Math.random() * s, Math.random() * s, 1, 1);
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
