/* three-sprites-bowser.js - Bowser + Bowser Jr sprites */

function drawBowser(ctx, s, opts = {}) {
  const scaleY = opts.junior ? 0.75 : 1;
  const cx = s / 2;
  ctx.clearRect(0, 0, s, s);
  ctx.lineJoin = 'round';
  ctx.strokeStyle = STROKE; ctx.lineWidth = 4;

  const baseY = s - 20;
  const bodyY = baseY - 200 * scaleY;
  const headY = bodyY - 180 * scaleY;

  // ========== PIEDS (grosses pattes orange) ==========
  ctx.fillStyle = '#e0a030';
  ellp(ctx, cx - 55, baseY - 10, 55, 30);
  ctx.fill(); ctx.stroke();
  ellp(ctx, cx + 55, baseY - 10, 55, 30);
  ctx.fill(); ctx.stroke();
  // Griffes
  ctx.fillStyle = '#ffffff';
  for (const side of [-55, 55]) {
    for (const dx of [-20, 0, 20]) {
      ctx.beginPath();
      ctx.moveTo(cx + side + dx - 8, baseY - 25);
      ctx.lineTo(cx + side + dx, baseY - 40);
      ctx.lineTo(cx + side + dx + 8, baseY - 25);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    }
  }

  // Jambes (orange-jaune)
  ctx.fillStyle = '#f0b040';
  ellp(ctx, cx - 45, baseY - 60, 35, 50);
  ctx.fill(); ctx.stroke();
  ellp(ctx, cx + 45, baseY - 60, 35, 50);
  ctx.fill(); ctx.stroke();

  // ========== CORPS MASSIF ==========
  // Ventre jaune clair strié
  ctx.fillStyle = '#f0c050';
  ellp(ctx, cx, bodyY, 120 * scaleY, 100 * scaleY);
  ctx.fill(); ctx.stroke();
  // Stries horizontales
  ctx.strokeStyle = '#c08020'; ctx.lineWidth = 3;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(cx - 80, bodyY - 40 + i * 25);
    ctx.quadraticCurveTo(cx, bodyY - 30 + i * 25, cx + 80, bodyY - 40 + i * 25);
    ctx.stroke();
  }
  ctx.strokeStyle = STROKE; ctx.lineWidth = 4;

  // Carapace verte (en arrière-plan avant tout)
  ctx.save();
  ctx.fillStyle = '#2a8a20';
  ctx.beginPath();
  ctx.ellipse(cx, bodyY - 20, 150 * scaleY, 110 * scaleY, 0, Math.PI, 0);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Bord de la carapace
  ctx.strokeStyle = '#ffe040'; ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.ellipse(cx, bodyY - 20, 148 * scaleY, 108 * scaleY, 0, Math.PI, 0);
  ctx.stroke();
  ctx.strokeStyle = STROKE; ctx.lineWidth = 4;
  // Pics blancs sur la carapace (vu de face : seulement les bords)
  ctx.fillStyle = '#ffffff';
  for (const [dx, dy, r] of [[-130, -40, 14], [130, -40, 14], [-90, -100, 16], [90, -100, 16]]) {
    ctx.beginPath();
    ctx.moveTo(cx + dx * scaleY - r, bodyY + dy * scaleY);
    ctx.lineTo(cx + dx * scaleY, bodyY + dy * scaleY - r * 1.5);
    ctx.lineTo(cx + dx * scaleY + r, bodyY + dy * scaleY);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  }
  ctx.restore();

  // ========== BRAS ==========
  ctx.fillStyle = '#f0b040';
  ellp(ctx, cx - 145, bodyY, 32, 55);
  ctx.fill(); ctx.stroke();
  ellp(ctx, cx + 145, bodyY, 32, 55);
  ctx.fill(); ctx.stroke();
  // Bracelets à pics
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(cx - 175, bodyY + 35, 60, 25);
  ctx.strokeRect(cx - 175, bodyY + 35, 60, 25);
  ctx.fillRect(cx + 115, bodyY + 35, 60, 25);
  ctx.strokeRect(cx + 115, bodyY + 35, 60, 25);
  // Pics
  ctx.fillStyle = '#ffffff';
  for (const bx of [-175, 115]) {
    for (let i = 0; i < 3; i++) {
      const px = cx + bx + 10 + i * 20;
      ctx.beginPath();
      ctx.moveTo(px - 7, bodyY + 35);
      ctx.lineTo(px, bodyY + 20);
      ctx.lineTo(px + 7, bodyY + 35);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    }
  }
  // Mains (griffes)
  ctx.fillStyle = '#f0b040';
  circ(ctx, cx - 155, bodyY + 85, 28);
  ctx.fill(); ctx.stroke();
  circ(ctx, cx + 155, bodyY + 85, 28);
  ctx.fill(); ctx.stroke();

  // ========== COU + COLLIER À PICS ==========
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(cx - 55, headY + 70, 110, 25);
  ctx.strokeRect(cx - 55, headY + 70, 110, 25);
  // Pics du collier
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 4; i++) {
    const px = cx - 40 + i * 28;
    ctx.beginPath();
    ctx.moveTo(px - 8, headY + 95);
    ctx.lineTo(px, headY + 115);
    ctx.lineTo(px + 8, headY + 95);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  }

  // ========== TÊTE ==========
  // Tête verte/jaune
  ctx.fillStyle = '#e09030';
  ellp(ctx, cx, headY, 95 * scaleY, 75 * scaleY);
  ctx.fill(); ctx.stroke();

  // Museau
  ctx.fillStyle = '#e09030';
  ellp(ctx, cx, headY + 30, 60, 45);
  ctx.fill(); ctx.stroke();
  // Narines
  ctx.fillStyle = '#1a0a00';
  circ(ctx, cx - 15, headY + 20, 4); ctx.fill();
  circ(ctx, cx + 15, headY + 20, 4); ctx.fill();
  // Grande bouche
  ctx.strokeStyle = '#3a1000'; ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(cx - 45, headY + 45);
  ctx.quadraticCurveTo(cx, headY + 60, cx + 45, headY + 45);
  ctx.stroke();
  ctx.strokeStyle = STROKE; ctx.lineWidth = 4;
  // Crocs
  ctx.fillStyle = '#ffffff';
  for (const fx of [-20, 20]) {
    ctx.beginPath();
    ctx.moveTo(cx + fx - 6, headY + 50);
    ctx.lineTo(cx + fx, headY + 68);
    ctx.lineTo(cx + fx + 6, headY + 50);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  }

  // Yeux rouges colériques
  ctx.fillStyle = '#ffffff';
  circ(ctx, cx - 35, headY - 10, 15);
  ctx.fill(); ctx.stroke();
  circ(ctx, cx + 35, headY - 10, 15);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#e00000';
  circ(ctx, cx - 35, headY - 10, 8);
  ctx.fill();
  circ(ctx, cx + 35, headY - 10, 8);
  ctx.fill();
  // Sourcils froncés rouges
  ctx.fillStyle = '#a00000';
  ctx.beginPath();
  ctx.moveTo(cx - 55, headY - 35);
  ctx.lineTo(cx - 15, headY - 25);
  ctx.lineTo(cx - 20, headY - 18);
  ctx.lineTo(cx - 55, headY - 25);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 55, headY - 35);
  ctx.lineTo(cx + 15, headY - 25);
  ctx.lineTo(cx + 20, headY - 18);
  ctx.lineTo(cx + 55, headY - 25);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Cornes blanches
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(cx - 75, headY - 40);
  ctx.lineTo(cx - 100, headY - 75);
  ctx.lineTo(cx - 65, headY - 55);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 75, headY - 40);
  ctx.lineTo(cx + 100, headY - 75);
  ctx.lineTo(cx + 65, headY - 55);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Crinière rouge hérissée
  for (let i = 0; i < 7; i++) {
    const a = ((i - 3) / 7) * Math.PI;
    const mx = cx + Math.sin(a) * 80;
    const my = headY - 55 + Math.cos(a) * 10;
    ctx.fillStyle = i % 2 === 0 ? '#e01010' : '#c01010';
    ctx.beginPath();
    ctx.moveTo(mx - 12, my);
    ctx.lineTo(mx, my - 50);
    ctx.lineTo(mx + 12, my);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  }

  // Bavoir Bowser Jr
  if (opts.junior) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, headY + 110, 45, 0.1, Math.PI - 0.1);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    // Dessin visage de Bowser sur le bavoir
    ctx.fillStyle = '#1a1a1a';
    circ(ctx, cx - 10, headY + 120, 3); ctx.fill();
    circ(ctx, cx + 10, headY + 120, 3); ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, headY + 135, 10, 0.2, Math.PI - 0.2);
    ctx.stroke();
  }
}

function buildBowserSprite() {
  return makeSpriteChar((c, s) => drawBowser(c, s, {}), 2.4, 2.8);
}

function buildBowserJrSprite() {
  return makeSpriteChar((c, s) => drawBowser(c, s, { junior: true }), 1.6, 2.0);
}
