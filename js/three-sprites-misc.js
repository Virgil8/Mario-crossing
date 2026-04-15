/* three-sprites-misc.js - DK + Shy Guy sprites */

function drawDK(ctx, s) {
  const cx = s / 2;
  ctx.clearRect(0, 0, s, s);
  ctx.lineJoin = 'round';
  ctx.strokeStyle = STROKE; ctx.lineWidth = 4;

  // ========== JAMBES + PIEDS ==========
  ctx.fillStyle = '#5a3010';
  ellp(ctx, cx - 50, 445, 35, 45);
  ctx.fill(); ctx.stroke();
  ellp(ctx, cx + 50, 445, 35, 45);
  ctx.fill(); ctx.stroke();
  // Pieds beiges
  ctx.fillStyle = '#f4d8a0';
  ellp(ctx, cx - 50, 480, 45, 18);
  ctx.fill(); ctx.stroke();
  ellp(ctx, cx + 50, 480, 45, 18);
  ctx.fill(); ctx.stroke();

  // ========== TORSE MASSIF ==========
  ctx.fillStyle = '#4a2a10';
  ellp(ctx, cx, 360, 130, 90);
  ctx.fill(); ctx.stroke();
  // Poitrail clair
  ctx.fillStyle = '#f4d8a0';
  ellp(ctx, cx, 365, 85, 70);
  ctx.fill(); ctx.stroke();

  // ========== CRAVATE ROUGE ==========
  ctx.fillStyle = '#e52521';
  // Nœud
  ctx.beginPath();
  ctx.moveTo(cx - 20, 300);
  ctx.lineTo(cx + 20, 300);
  ctx.lineTo(cx + 25, 325);
  ctx.lineTo(cx - 25, 325);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Cravate
  ctx.beginPath();
  ctx.moveTo(cx - 25, 325);
  ctx.lineTo(cx + 25, 325);
  ctx.lineTo(cx + 20, 410);
  ctx.lineTo(cx, 425);
  ctx.lineTo(cx - 20, 410);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Logo DK jaune
  ctx.fillStyle = '#ffd400';
  circ(ctx, cx, 375, 18);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#1a0a00';
  ctx.font = 'bold 20px Arial Black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('DK', cx, 377);

  // ========== BRAS LONGS ET MUSCLÉS ==========
  ctx.fillStyle = '#4a2a10';
  // Bras gauche
  ctx.beginPath();
  ctx.moveTo(cx - 120, 290);
  ctx.quadraticCurveTo(cx - 180, 340, cx - 170, 410);
  ctx.quadraticCurveTo(cx - 125, 420, cx - 110, 400);
  ctx.quadraticCurveTo(cx - 100, 340, cx - 100, 290);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 120, 290);
  ctx.quadraticCurveTo(cx + 180, 340, cx + 170, 410);
  ctx.quadraticCurveTo(cx + 125, 420, cx + 110, 400);
  ctx.quadraticCurveTo(cx + 100, 340, cx + 100, 290);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Grandes mains beiges
  ctx.fillStyle = '#f4d8a0';
  ellp(ctx, cx - 175, 430, 38, 28);
  ctx.fill(); ctx.stroke();
  ellp(ctx, cx + 175, 430, 38, 28);
  ctx.fill(); ctx.stroke();

  // ========== TÊTE (petite, brune) ==========
  ctx.fillStyle = '#5a3010';
  ellp(ctx, cx, 180, 90, 80);
  ctx.fill(); ctx.stroke();
  // Museau beige (proéminent)
  ctx.fillStyle = '#f4d8a0';
  ellp(ctx, cx, 215, 70, 55);
  ctx.fill(); ctx.stroke();
  // Narines
  ctx.fillStyle = '#1a0a00';
  circ(ctx, cx - 18, 205, 5); ctx.fill();
  circ(ctx, cx + 18, 205, 5); ctx.fill();
  // Grande bouche
  ctx.strokeStyle = '#3a1000'; ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx - 40, 240);
  ctx.quadraticCurveTo(cx, 250, cx + 40, 240);
  ctx.stroke();
  ctx.strokeStyle = STROKE; ctx.lineWidth = 4;

  // Yeux
  ctx.fillStyle = '#ffffff';
  ellp(ctx, cx - 28, 165, 14, 18);
  ctx.fill(); ctx.stroke();
  ellp(ctx, cx + 28, 165, 14, 18);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#2a1a00';
  circ(ctx, cx - 26, 170, 6); ctx.fill();
  circ(ctx, cx + 26, 170, 6); ctx.fill();
  // Reflets
  ctx.fillStyle = '#ffffff';
  circ(ctx, cx - 23, 167, 2); ctx.fill();
  circ(ctx, cx + 30, 167, 2); ctx.fill();

  // Arcades sourcilières
  ctx.strokeStyle = '#2a1500'; ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(cx - 45, 145);
  ctx.lineTo(cx - 15, 150);
  ctx.moveTo(cx + 15, 150);
  ctx.lineTo(cx + 45, 145);
  ctx.stroke();
  ctx.strokeStyle = STROKE; ctx.lineWidth = 4;

  // Oreilles rondes
  ctx.fillStyle = '#4a2a10';
  circ(ctx, cx - 90, 175, 22);
  ctx.fill(); ctx.stroke();
  circ(ctx, cx + 90, 175, 22);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f4d8a0';
  circ(ctx, cx - 90, 178, 12);
  ctx.fill();
  circ(ctx, cx + 90, 178, 12);
  ctx.fill();

  // Touffe de cheveux noirs au sommet
  ctx.fillStyle = '#1a0a00';
  ctx.beginPath();
  ctx.moveTo(cx - 25, 100);
  ctx.quadraticCurveTo(cx, 75, cx + 20, 95);
  ctx.quadraticCurveTo(cx + 5, 115, cx - 25, 100);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
}

function buildDKSprite() {
  return makeSpriteChar(drawDK, 2.2, 2.5);
}

// ============== SHY GUY (Maskass) ==============
function drawShyGuy(ctx, s) {
  const cx = s / 2;
  ctx.clearRect(0, 0, s, s);
  ctx.lineJoin = 'round';
  ctx.strokeStyle = STROKE; ctx.lineWidth = 4;

  // ========== CHAUSSURES MARRON ==========
  ctx.fillStyle = '#3a1a00';
  ellp(ctx, cx - 30, 485, 25, 12);
  ctx.fill(); ctx.stroke();
  ellp(ctx, cx + 30, 485, 25, 12);
  ctx.fill(); ctx.stroke();

  // ========== ROBE LONGUE (cône) ==========
  ctx.fillStyle = '#c02020';
  ctx.beginPath();
  ctx.moveTo(cx - 130, 480);
  ctx.quadraticCurveTo(cx - 100, 400, cx - 90, 310);
  ctx.lineTo(cx + 90, 310);
  ctx.quadraticCurveTo(cx + 100, 400, cx + 130, 480);
  ctx.quadraticCurveTo(cx, 495, cx - 130, 480);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Ombres de plis
  ctx.strokeStyle = '#801010'; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - 60, 340);
  ctx.lineTo(cx - 90, 470);
  ctx.moveTo(cx + 60, 340);
  ctx.lineTo(cx + 90, 470);
  ctx.moveTo(cx, 335);
  ctx.lineTo(cx, 480);
  ctx.stroke();
  ctx.strokeStyle = STROKE; ctx.lineWidth = 4;

  // Ceinture
  ctx.fillStyle = '#552a00';
  ctx.fillRect(cx - 90, 310, 180, 18);
  ctx.strokeRect(cx - 90, 310, 180, 18);
  // Boucle
  ctx.fillStyle = '#ffd84a';
  ctx.fillRect(cx - 15, 308, 30, 22);
  ctx.strokeRect(cx - 15, 308, 30, 22);

  // ========== MANCHES + MAINS ==========
  ctx.fillStyle = '#c02020';
  ellp(ctx, cx - 110, 280, 25, 40);
  ctx.fill(); ctx.stroke();
  ellp(ctx, cx + 110, 280, 25, 40);
  ctx.fill(); ctx.stroke();
  // Gants blancs
  ctx.fillStyle = '#ffffff';
  circ(ctx, cx - 120, 315, 22);
  ctx.fill(); ctx.stroke();
  circ(ctx, cx + 120, 315, 22);
  ctx.fill(); ctx.stroke();

  // ========== CAPUCHE ==========
  ctx.fillStyle = '#c02020';
  ctx.beginPath();
  ctx.moveTo(cx - 95, 250);
  ctx.quadraticCurveTo(cx - 120, 180, cx - 90, 110);
  ctx.quadraticCurveTo(cx, 70, cx + 90, 110);
  ctx.quadraticCurveTo(cx + 120, 180, cx + 95, 250);
  ctx.quadraticCurveTo(cx, 270, cx - 95, 250);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // ========== MASQUE BLANC ==========
  ctx.fillStyle = '#f0e0c8';
  ellp(ctx, cx, 175, 70, 85);
  ctx.fill(); ctx.stroke();
  // Légère ombre au bord du masque
  ctx.strokeStyle = '#c8b8a0'; ctx.lineWidth = 2;
  ellp(ctx, cx, 175, 65, 80);
  ctx.stroke();
  ctx.strokeStyle = STROKE; ctx.lineWidth = 4;

  // Yeux percés (ovales noirs)
  ctx.fillStyle = '#000000';
  ellp(ctx, cx - 25, 165, 10, 22);
  ctx.fill();
  ellp(ctx, cx + 25, 165, 10, 22);
  ctx.fill();

  // Bouche (petit O)
  ctx.strokeStyle = '#000000'; ctx.lineWidth = 4;
  circ(ctx, cx, 215, 8);
  ctx.stroke();
  ctx.strokeStyle = STROKE; ctx.lineWidth = 4;

  // Cordon de masque
  ctx.strokeStyle = '#1a0a00'; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - 70, 175);
  ctx.quadraticCurveTo(cx - 90, 185, cx - 95, 220);
  ctx.moveTo(cx + 70, 175);
  ctx.quadraticCurveTo(cx + 90, 185, cx + 95, 220);
  ctx.stroke();
  ctx.strokeStyle = STROKE; ctx.lineWidth = 4;
}

function buildShyGuySprite() {
  return makeSpriteChar(drawShyGuy, 1.6, 2.3);
}
