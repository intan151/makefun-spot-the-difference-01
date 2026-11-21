// SPDX-License-Identifier: MIT
// art.js — small canvas drawing helpers shared by every scene painter.

export function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

export function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function poly(ctx, points, fill) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.stroke();
}

export function sky(ctx, w, h, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

export function cloud(ctx, x, y, s, white = '#ffffff') {
  ctx.fillStyle = white;
  ctx.beginPath();
  ctx.arc(x, y, 22 * s, 0, Math.PI * 2);
  ctx.arc(x + 24 * s, y - 8 * s, 18 * s, 0, Math.PI * 2);
  ctx.arc(x + 48 * s, y, 20 * s, 0, Math.PI * 2);
  ctx.arc(x + 24 * s, y + 8 * s, 18 * s, 0, Math.PI * 2);
  ctx.fill();
}

export function sun(ctx, x, y, r, withRays) {
  if (withRays) {
    ctx.strokeStyle = '#ffb62e';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * (r + 8), y + Math.sin(a) * (r + 8));
      ctx.lineTo(x + Math.cos(a) * (r + 22), y + Math.sin(a) * (r + 22));
      ctx.stroke();
    }
  }
  circle(ctx, x, y, r, '#ffd94d');
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.strokeStyle = '#e8a100';
  ctx.lineWidth = 3;
  ctx.stroke();
}

export function star(ctx, x, y, r, fill, points = 5) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export function flower(ctx, x, y, petal, center) {
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    circle(ctx, x + Math.cos(a) * 9, y + Math.sin(a) * 9, 7, petal);
  }
  circle(ctx, x, y, 6, center);
}

export function tree(ctx, x, y, s, apples) {
  // trunk
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(x - 9 * s, y, 18 * s, 62 * s);
  // canopy: three overlapping crowns
  circle(ctx, x - 30 * s, y - 18 * s, 34 * s, '#2f9e4f');
  circle(ctx, x + 30 * s, y - 18 * s, 34 * s, '#37b25c');
  circle(ctx, x, y - 44 * s, 40 * s, '#2f9e4f');
  circle(ctx, x - 14 * s, y - 30 * s, 22 * s, '#4cc36e');
  // apples
  for (const [ax, ay] of apples) {
    circle(ctx, x + ax * s, y + ay * s, 7 * s, '#e23b3b');
    ctx.fillStyle = '#7ec850';
    ctx.fillRect(x + ax * s - 1, y + ay * s - 12 * s, 3 * s, 6 * s);
  }
}

export function bird(ctx, x, y, s, color = '#2b3a4a') {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(x - 10 * s, y, 10 * s, Math.PI * 1.15, Math.PI * 1.9);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + 10 * s, y, 10 * s, Math.PI * 1.1, Math.PI * 1.85);
  ctx.stroke();
}

export function butterfly(ctx, x, y, s, wing) {
  ctx.fillStyle = wing;
  ctx.beginPath();
  ctx.ellipse(x - 10 * s, y - 6 * s, 11 * s, 14 * s, -0.5, 0, Math.PI * 2);
  ctx.ellipse(x + 10 * s, y - 6 * s, 11 * s, 14 * s, 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ff8fd1';
  ctx.beginPath();
  ctx.ellipse(x - 9 * s, y + 9 * s, 8 * s, 9 * s, -0.4, 0, Math.PI * 2);
  ctx.ellipse(x + 9 * s, y + 9 * s, 8 * s, 9 * s, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#33302e';
  ctx.fillRect(x - 2 * s, y - 10 * s, 4 * s, 20 * s);
  ctx.strokeStyle = '#33302e';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x - 1, y - 10 * s);
  ctx.quadraticCurveTo(x - 8 * s, y - 20 * s, x - 10 * s, y - 22 * s);
  ctx.moveTo(x + 1, y - 10 * s);
  ctx.quadraticCurveTo(x + 8 * s, y - 20 * s, x + 10 * s, y - 22 * s);
  ctx.stroke();
}

export function cat(ctx, x, y, s, body = '#f2a541') {
  // sitting cat, facing left
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(x, y, 26 * s, 20 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  circle(ctx, x - 18 * s, y - 22 * s, 15 * s, body);
  // ears
  poly(ctx, [[x - 30 * s, y - 30 * s], [x - 26 * s, y - 44 * s], [x - 18 * s, y - 32 * s]], body);
  poly(ctx, [[x - 12 * s, y - 33 * s], [x - 8 * s, y - 46 * s], [x - 2 * s, y - 32 * s]], body);
  // tail, curled up
  ctx.strokeStyle = body;
  ctx.lineWidth = 7 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x + 24 * s, y + 8 * s);
  ctx.quadraticCurveTo(x + 40 * s, y + 2 * s, x + 36 * s, y - 18 * s);
  ctx.stroke();
  // face
  ctx.fillStyle = '#2b2b2b';
  circle(ctx, x - 23 * s, y - 24 * s, 2 * s, '#2b2b2b');
  ctx.beginPath();
  ctx.moveTo(x - 32 * s, y - 18 * s);
  ctx.lineTo(x - 28 * s, y - 16 * s);
  ctx.lineTo(x - 32 * s, y - 14 * s);
  ctx.strokeStyle = '#2b2b2b';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

export function fish(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, 18 * s, 11 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  poly(ctx, [[x + 16 * s, y], [x + 30 * s, y - 10 * s], [x + 30 * s, y + 10 * s]], color);
  ctx.fillStyle = '#222';
  circle(ctx, x - 9 * s, y - 2 * s, 2.5 * s, '#222');
}
