/* three-sprites-royal.js - Peach, Daisy, Toad sprites */

function drawPrincess(ctx, s, o) {
  const {
    dressColor, trimColor, dressInner, hairColor, hairStyle = 'peach',
    crownStyle = 'crown', earringCol = '#cc0000', lipCol = '#dd2050',
    eyeCol = '#2060d0'
  } = o;

  const cx = s / 2;
  ctx.clearRect(0, 0, s, s);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const headY = 130;
  const headR = 75;

  // ========== ROBE (forme conique ample) ==========
  // Ombre intérieure de la jupe
  ctx.fillStyle = dressInner;
  ctx.beginPath();
  ctx.moveTo(cx - 180, s - 20);
  ctx.quadraticCurveTo(cx, s - 5, cx + 180, s - 20);
  ctx.lineTo(cx + 70, 330);
  ctx.lineTo(cx - 70, 330);
  ctx.closePath();
  ctx.fill();

  // Robe principale
  ctx.fillStyle = dressColor;
  ctx.strokeStyle = STROKE; ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx - 70, 330);
  ctx.quadraticCurveTo(cx - 120, 400, cx - 175, s - 20);
  ctx.quadraticCurveTo(cx - 100, s, cx, s - 10);
  ctx.quadraticCurveTo(cx + 100, s, cx + 175, s - 20);
  ctx.quadraticCurveTo(cx + 120, 400, cx + 70, 330);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Petit ourlet
  ctx.strokeStyle = trimColor; ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(cx - 170, s - 25);
  ctx.quadraticCurveTo(cx, s - 15, cx + 170, s - 25);
  ctx.stroke();
  ctx.strokeStyle = STROKE; ctx.lineWidth = 4;

  // Volants ondulés sur le devant
  ctx.fillStyle = dressInner;
  for (let i = 0; i < 5; i++) {
    const y = 430 + i * 35;
    ctx.beginPath();
    ctx.moveTo(cx - 80 - i * 8, y);
    ctx.quadraticCurveTo(cx, y + 15, cx + 80 + i * 8, y);
    ctx.quadraticCurveTo(cx, y + 25, cx - 80 - i * 8, y);
    ctx.closePath();
    ctx.fill();
  }

  // ========== TAILLE / CORSAGE ==========
  // Ceinture
  ctx.fillStyle = trimColor;
  ctx.fillRect(cx - 65, 315, 130, 20);
  ctx.strokeRect(cx - 65, 315, 130, 20);
  // Corsage (robe haute)
  ctx.fillStyle = dressColor;
  ctx.beginPath();
  ctx.moveTo(cx - 70, 315);
  ctx.quadraticCurveTo(cx - 85, 260, cx - 70, 230);
  ctx.lineTo(cx + 70, 230);
  ctx.quadraticCurveTo(cx + 85, 260, cx + 70, 315);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Décolleté (peau)
  ctx.fillStyle = '#ffcc99';
  ctx.beginPath();
  ctx.moveTo(cx - 30, 230);
  ctx.quadraticCurveTo(cx, 265, cx + 30, 230);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Bijou au centre
  ctx.fillStyle = '#ffd84a';
  circ(ctx, cx, 245, 10);
  ctx.fill(); outline(ctx, 3);
  ctx.fillStyle = earringCol;
  circ(ctx, cx, 245, 5);
  ctx.fill();

  // ========== BRAS + GANTS LONGS ==========
  // Épaules bouffantes
  ctx.fillStyle = dressColor;
  circ(ctx, cx - 85, 235, 22);
  ctx.fill(); ctx.stroke();
  circ(ctx, cx + 85, 235, 22);
  ctx.fill(); ctx.stroke();
  // Manches (bras avec longs gants blancs)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(cx - 95, 250);
  ctx.quadraticCurveTo(cx - 120, 310, cx - 110, 370);
  ctx.quadraticCurveTo(cx - 90, 380, cx - 80, 370);
  ctx.quadraticCurveTo(cx - 70, 310, cx - 75, 250);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 95, 250);
  ctx.quadraticCurveTo(cx + 120, 310, cx + 110, 370);
  ctx.quadraticCurveTo(cx + 90, 380, cx + 80, 370);
  ctx.quadraticCurveTo(cx + 70, 310, cx + 75, 250);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Anneau trim en haut des gants
  ctx.strokeStyle = trimColor; ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(cx - 100, 255);
  ctx.quadraticCurveTo(cx - 85, 265, cx - 70, 255);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 100, 255);
  ctx.quadraticCurveTo(cx + 85, 265, cx + 70, 255);
  ctx.stroke();
  ctx.strokeStyle = STROKE; ctx.lineWidth = 4;
  // Mains
  ctx.fillStyle = '#ffffff';
  circ(ctx, cx - 95, 390, 22);
  ctx.fill(); ctx.stroke();
  circ(ctx, cx + 95, 390, 22);
  ctx.fill(); ctx.stroke();

  // ========== COU ==========
  ctx.fillStyle = '#ffcc99';
  ctx.fillRect(cx - 18, 195, 36, 40);
  ctx.strokeRect(cx - 18, 195, 36, 40);

  // ========== TÊTE (féminine, ovale) ==========
  // Oreilles
  ctx.fillStyle = '#ffcc99';
  ellp(ctx, cx - headR, headY + 10, 14, 20);
  ctx.fill(); ctx.stroke();
  ellp(ctx, cx + headR, headY + 10, 14, 20);
  ctx.fill(); ctx.stroke();

  // Visage (ovale un peu allongé)
  ellp(ctx, cx, headY + 10, headR - 5, headR + 5);
  ctx.fillStyle = '#ffcc99';
  ctx.fill(); ctx.stroke();

  // ========== CHEVEUX LONGS ==========
  ctx.fillStyle = hairColor;
  // Masse arrière (encadre tête)
  ctx.beginPath();
  ctx.moveTo(cx - headR, headY);
  ctx.quadraticCurveTo(cx - 110, headY + 20, cx - 130, 260);
  ctx.quadraticCurveTo(cx - 140, 330, cx - 110, 340);
  ctx.quadraticCurveTo(cx - 80, 310, cx - 70, 260);
  ctx.lineTo(cx - 75, 200);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + headR, headY);
  ctx.quadraticCurveTo(cx + 110, headY + 20, cx + 130, 260);
  ctx.quadraticCurveTo(cx + 140, 330, cx + 110, 340);
  ctx.quadraticCurveTo(cx + 80, 310, cx + 70, 260);
  ctx.lineTo(cx + 75, 200);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Masse au sommet
  ctx.beginPath();
  ctx.moveTo(cx - 70, headY - 40);
  ctx.quadraticCurveTo(cx - 90, headY - 80, cx, headY - 70);
  ctx.quadraticCurveTo(cx + 90, headY - 80, cx + 70, headY - 40);
  ctx.quadraticCurveTo(cx, headY - 20, cx - 70, headY - 40);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Frange douce
  ctx.beginPath();
  ctx.moveTo(cx - 55, headY - 30);
  ctx.quadraticCurveTo(cx - 30, headY + 5, cx - 10, headY - 15);
  ctx.quadraticCurveTo(cx + 10, headY + 5, cx + 35, headY - 20);
  ctx.quadraticCurveTo(cx + 55, headY + 5, cx + 60, headY - 30);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Boucles au bout des mèches
  if (hairStyle === 'peach') {
    circ(ctx, cx - 120, 345, 20);
    ctx.fillStyle = hairColor; ctx.fill(); ctx.stroke();
    circ(ctx, cx + 120, 345, 20);
    ctx.fill(); ctx.stroke();
  }

  // ========== VISAGE ==========
  // Yeux grands avec cils
  drawEyes(ctx, cx, headY + 5, 18, 1.1, true, eyeCol);

  // Nez petit
  ctx.fillStyle = '#e8a078';
  circ(ctx, cx, headY + 30, 6);
  ctx.fill();

  // Lèvres
  ctx.fillStyle = lipCol;
  ctx.beginPath();
  ctx.moveTo(cx - 20, headY + 50);
  ctx.quadraticCurveTo(cx, headY + 60, cx + 20, headY + 50);
  ctx.quadraticCurveTo(cx, headY + 55, cx - 20, headY + 50);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#880030'; ctx.lineWidth = 2;
  ctx.stroke();
  ctx.strokeStyle = STROKE; ctx.lineWidth = 4;

  // Joues roses
  ctx.fillStyle = 'rgba(255, 140, 160, 0.5)';
  circ(ctx, cx - 45, headY + 35, 14);
  ctx.fill();
  circ(ctx, cx + 45, headY + 35, 14);
  ctx.fill();

  // Boucles d'oreilles
  ctx.fillStyle = earringCol;
  circ(ctx, cx - headR - 5, headY + 25, 7);
  ctx.fill(); outline(ctx, 2);
  circ(ctx, cx + headR + 5, headY + 25, 7);
  ctx.fill(); outline(ctx, 2);

  // ========== COURONNE ==========
  if (crownStyle === 'crown') {
    ctx.fillStyle = '#ffd84a';
    ctx.beginPath();
    ctx.moveTo(cx - 55, headY - 55);
    for (let i = 0; i <= 5; i++) {
      const x = cx - 55 + (110 / 5) * i;
      const up = i % 2 === 0;
      ctx.lineTo(x, headY - (up ? 90 : 60));
    }
    ctx.lineTo(cx + 55, headY - 55);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    // Gemmes
    for (let i = 0; i < 3; i++) {
      circ(ctx, cx - 30 + i * 30, headY - 60, 7);
      ctx.fillStyle = '#2060d0'; ctx.fill(); outline(ctx, 2);
      // Reflet gemme
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      circ(ctx, cx - 32 + i * 30, headY - 63, 2);
      ctx.fill();
    }
  } else if (crownStyle === 'flowers') {
    // Daisy : couronne de petites fleurs blanches
    for (let i = 0; i < 6; i++) {
      const fx = cx - 55 + i * 22;
      const fy = headY - 65 - Math.abs(i - 2.5) * 3;
      // Pétales
      for (let p = 0; p < 5; p++) {
        const pa = (p / 5) * Math.PI * 2;
        ctx.fillStyle = '#ffffff';
        circ(ctx, fx + Math.cos(pa) * 8, fy + Math.sin(pa) * 8, 6);
        ctx.fill(); outline(ctx, 2);
      }
      ctx.fillStyle = '#ffd84a';
      circ(ctx, fx, fy, 5);
      ctx.fill(); outline(ctx, 2);
    }
  }
}

function buildPeachSprite() {
  return makeSpriteChar((ctx, s) => drawPrincess(ctx, s, {
    dressColor: '#ffa8d4', trimColor: '#d060a0', dressInner: '#ffd0e4',
    hairColor: '#f4d850', hairStyle: 'peach',
    crownStyle: 'crown', earringCol: '#cc2222', lipCol: '#dd2050',
    eyeCol: '#2060d0'
  }), 1.8, 2.5);
}

function buildDaisySprite() {
  return makeSpriteChar((ctx, s) => drawPrincess(ctx, s, {
    dressColor: '#ffb030', trimColor: '#ffffff', dressInner: '#ffe8a0',
    hairColor: '#c04820', hairStyle: 'peach',
    crownStyle: 'flowers', earringCol: '#ff8020', lipCol: '#cc3030',
    eyeCol: '#20a040'
  }), 1.8, 2.5);
}

// ============== TOAD ==============
function drawToad(ctx, s) {
  const cx = s / 2;
  ctx.clearRect(0, 0, s, s);
  ctx.lineJoin = 'round';

  // Corps : petit, vêtu d'un gilet blanc
  // Jambes courtes
  ctx.fillStyle = '#6a3010';
  ctx.strokeStyle = STROKE; ctx.lineWidth = 4;
  ctx.fillRect(cx - 35, 410, 22, 50);
  ctx.strokeRect(cx - 35, 410, 22, 50);
  ctx.fillRect(cx + 13, 410, 22, 50);
  ctx.strokeRect(cx + 13, 410, 22, 50);
  // Chaussures
  ctx.fillStyle = '#8a4a20';
  ellp(ctx, cx - 24, 470, 30, 13);
  ctx.fill(); ctx.stroke();
  ellp(ctx, cx + 24, 470, 30, 13);
  ctx.fill(); ctx.stroke();

  // Gilet blanc rond
  ctx.fillStyle = '#ffffff';
  ellp(ctx, cx, 380, 85, 60);
  ctx.fill(); ctx.stroke();
  // Col doré
  ctx.fillStyle = '#ffd84a';
  ctx.beginPath();
  ctx.moveTo(cx - 45, 345);
  ctx.lineTo(cx + 45, 345);
  ctx.lineTo(cx + 35, 365);
  ctx.lineTo(cx - 35, 365);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Bras + gants blancs
  ctx.fillStyle = '#ffffff';
  ellp(ctx, cx - 95, 370, 20, 30);
  ctx.fill(); ctx.stroke();
  ellp(ctx, cx + 95, 370, 20, 30);
  ctx.fill(); ctx.stroke();
  circ(ctx, cx - 105, 405, 25);
  ctx.fill(); ctx.stroke();
  circ(ctx, cx + 105, 405, 25);
  ctx.fill(); ctx.stroke();

  // VISAGE (rond chibi)
  ctx.fillStyle = '#fff0dc';
  circ(ctx, cx, 270, 90);
  ctx.fill(); ctx.stroke();

  // Grands yeux ovales noirs (style Toad)
  ctx.fillStyle = '#ffffff';
  ellp(ctx, cx - 30, 270, 18, 28);
  ctx.fill(); ctx.stroke();
  ellp(ctx, cx + 30, 270, 18, 28);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#1a1a4a';
  ellp(ctx, cx - 30, 275, 12, 20);
  ctx.fill();
  ellp(ctx, cx + 30, 275, 12, 20);
  ctx.fill();
  // Reflets
  ctx.fillStyle = '#ffffff';
  circ(ctx, cx - 28, 265, 5);
  ctx.fill();
  circ(ctx, cx + 32, 265, 5);
  ctx.fill();

  // Petite bouche souriante
  ctx.strokeStyle = '#551010'; ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, 315, 12, 0.2, Math.PI - 0.2);
  ctx.stroke();
  // Langue rose
  ctx.fillStyle = '#ff8090';
  ellp(ctx, cx, 320, 6, 3);
  ctx.fill();
  ctx.strokeStyle = STROKE; ctx.lineWidth = 4;

  // Joues rosées
  ctx.fillStyle = 'rgba(255, 160, 180, 0.5)';
  circ(ctx, cx - 55, 295, 15);
  ctx.fill();
  circ(ctx, cx + 55, 295, 15);
  ctx.fill();

  // ========== CHAPEAU CHAMPIGNON (gros) ==========
  // Rebord clair
  ctx.fillStyle = '#fff0dc';
  ellp(ctx, cx, 195, 130, 25);
  ctx.fill(); ctx.stroke();
  // Chapeau rouge
  ctx.fillStyle = '#e52521';
  ctx.beginPath();
  ctx.arc(cx, 195, 130, Math.PI, 0);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Gros pois blancs
  ctx.fillStyle = '#ffffff';
  const dots = [[0, 90], [-70, 130], [70, 130], [-35, 180], [35, 180]];
  for (const [dx, dy] of dots) {
    ellp(ctx, cx + dx, dy, 28, 22);
    ctx.fill(); ctx.stroke();
  }
  // Reflet sur le chapeau
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ellp(ctx, cx - 40, 110, 30, 12, -0.3);
  ctx.fill();
}

function buildToadSprite() {
  return makeSpriteChar(drawToad, 1.5, 2.0);
}
