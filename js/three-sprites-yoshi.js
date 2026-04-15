/* three-sprites-yoshi.js - Yoshi sprite */

function drawYoshi(ctx, s) {
  const cx = s / 2;
  ctx.clearRect(0, 0, s, s);
  ctx.lineJoin = 'round';
  ctx.strokeStyle = STROKE; ctx.lineWidth = 4;

  // Chaussures oranges
  ctx.fillStyle = '#ff8a20';
  ellp(ctx, cx - 45, 475, 50, 20);
  ctx.fill(); ctx.stroke();
  ellp(ctx, cx + 45, 475, 50, 20);
  ctx.fill(); ctx.stroke();

  // Jambes (vertes)
  ctx.fillStyle = '#5dc14f';
  ctx.fillRect(cx - 55, 400, 30, 70);
  ctx.strokeRect(cx - 55, 400, 30, 70);
  ctx.fillRect(cx + 25, 400, 30, 70);
  ctx.strokeRect(cx + 25, 400, 30, 70);

  // ========== CORPS OVIFORME ==========
  ctx.fillStyle = '#5dc14f';
  ellp(ctx, cx, 340, 110, 90);
  ctx.fill(); ctx.stroke();
  // Ventre blanc
  ctx.fillStyle = '#fff0dc';
  ellp(ctx, cx, 360, 75, 65);
  ctx.fill(); ctx.stroke();

  // ========== SELLE ROUGE ==========
  ctx.fillStyle = '#e52521';
  ctx.beginPath();
  ctx.arc(cx, 275, 70, Math.PI, 0);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Bord jaune
  ctx.strokeStyle = '#ffe400'; ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, 275, 67, Math.PI, 0);
  ctx.stroke();
  ctx.strokeStyle = STROKE; ctx.lineWidth = 4;
  // Pois blancs sur la selle
  ctx.fillStyle = '#ffffff';
  circ(ctx, cx - 30, 250, 8); ctx.fill(); outline(ctx, 2);
  circ(ctx, cx + 30, 250, 8); ctx.fill(); outline(ctx, 2);
  circ(ctx, cx, 230, 8); ctx.fill(); outline(ctx, 2);

  // ========== BRAS ==========
  ctx.fillStyle = '#5dc14f';
  ellp(ctx, cx - 115, 340, 22, 40);
  ctx.fill(); ctx.stroke();
  ellp(ctx, cx + 115, 340, 22, 40);
  ctx.fill(); ctx.stroke();
  // Gants blancs
  ctx.fillStyle = '#ffffff';
  circ(ctx, cx - 120, 385, 24);
  ctx.fill(); ctx.stroke();
  circ(ctx, cx + 120, 385, 24);
  ctx.fill(); ctx.stroke();

  // ========== TÊTE ==========
  // Cou
  ctx.fillStyle = '#5dc14f';
  ctx.fillRect(cx - 25, 220, 50, 40);
  ctx.strokeRect(cx - 25, 220, 50, 40);

  // Tête principale (ovale, incliné)
  ctx.fillStyle = '#5dc14f';
  ctx.beginPath();
  ctx.ellipse(cx, 165, 75, 65, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  // Museau allongé vers l'avant (droite)
  ctx.beginPath();
  ctx.ellipse(cx + 55, 180, 55, 40, 0.1, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  // Narines
  ctx.fillStyle = '#1a3a08';
  circ(ctx, cx + 95, 175, 4); ctx.fill();
  circ(ctx, cx + 95, 190, 4); ctx.fill();

  // Bouche (ligne)
  ctx.strokeStyle = '#1a3a08'; ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx + 40, 205);
  ctx.lineTo(cx + 100, 210);
  ctx.stroke();
  ctx.strokeStyle = STROKE; ctx.lineWidth = 4;

  // ========== YEUX EXORBITÉS ==========
  // Le yeux sort au-dessus de la tête
  ctx.fillStyle = '#5dc14f';
  ellp(ctx, cx - 10, 100, 25, 40);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffffff';
  circ(ctx, cx - 10, 85, 28);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#1a1a3a';
  ellp(ctx, cx - 5, 90, 10, 16);
  ctx.fill();
  // Reflet
  ctx.fillStyle = '#ffffff';
  circ(ctx, cx - 2, 80, 4);
  ctx.fill();

  // Crête rouge au sommet de la tête
  ctx.fillStyle = '#e52521';
  ctx.beginPath();
  ctx.moveTo(cx - 25, 120);
  ctx.quadraticCurveTo(cx - 20, 95, cx, 100);
  ctx.quadraticCurveTo(cx + 5, 115, cx - 10, 125);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Queue en arrière
  ctx.fillStyle = '#5dc14f';
  ctx.beginPath();
  ctx.moveTo(cx - 95, 330);
  ctx.quadraticCurveTo(cx - 150, 360, cx - 170, 400);
  ctx.quadraticCurveTo(cx - 130, 410, cx - 115, 380);
  ctx.quadraticCurveTo(cx - 100, 360, cx - 95, 330);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
}

function buildYoshiSprite() {
  return makeSpriteChar(drawYoshi, 2.0, 2.2);
}
