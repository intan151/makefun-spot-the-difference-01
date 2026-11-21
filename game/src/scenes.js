// SPDX-License-Identifier: MIT
// scenes.js — the three scenes. Each scene is drawn procedurally on canvas
// in a 600 x 620 panel. drawScene(ctx, id, changed) paints one panel; the
// `changed` set holds the ids of the differences active in that panel, so
// the left panel (empty set) and the right panel (all ids) differ exactly
// where the scene's differences say they do.

import { bird, butterfly, cat, circle, cloud, ellipse, fish, flower, line, poly, rect, roundRect, sky, star, sun, tree } from './art.js';

export const PANEL_W = 600;
export const PANEL_H = 620;

// ---------------------------------------------------------------- garden
function drawGarden(ctx, changed) {
  sky(ctx, PANEL_W, PANEL_H, '#8ed0ff', '#d8f2ff');
  // rolling hills
  ctx.fillStyle = '#7cc46a';
  ctx.beginPath();
  ctx.moveTo(0, 380);
  ctx.quadraticCurveTo(150, 320, 320, 372);
  ctx.quadraticCurveTo(460, 415, 600, 360);
  ctx.lineTo(600, 620);
  ctx.lineTo(0, 620);
  ctx.closePath();
  ctx.fill();
  rect(ctx, 0, 420, 600, 200, '#5db356');
  // path
  ctx.fillStyle = '#e8d9a8';
  ctx.beginPath();
  ctx.moveTo(270, 620);
  ctx.lineTo(310, 420);
  ctx.lineTo(350, 420);
  ctx.lineTo(390, 620);
  ctx.closePath();
  ctx.fill();

  sun(ctx, 90, 80, 34, !changed.has('sun-rays'));
  cloud(ctx, 300, 70, 1);
  cloud(ctx, 470, 120, 0.8);
  if (changed.has('extra-cloud')) cloud(ctx, 185, 150, 0.7, '#fdfdfd');
  if (!changed.has('bird')) bird(ctx, 400, 90, 1);

  // fence along the hill line
  ctx.fillStyle = '#a9803e';
  ctx.fillRect(0, 396, 600, 8);
  for (const fx of [40, 140, 240, 340, 440, 540]) {
    if (changed.has('fence-post') && fx === 440) continue;
    ctx.fillRect(fx - 5, 378, 10, 34);
  }

  // big tree with apples (3 on the left, 2 on the right)
  const apples = changed.has('tree-apples')
    ? [[-26, -30], [22, -18]]
    : [[-26, -30], [22, -18], [2, -48]];
  tree(ctx, 110, 380, 1, apples);
  // extra mushroom on the right panel
  if (changed.has('mushroom')) {
    rect(ctx, 176, 556, 8, 14, '#fff3d6');
    ctx.fillStyle = '#e23b3b';
    ctx.beginPath();
    ctx.arc(180, 556, 16, Math.PI, 0);
    ctx.fill();
    circle(ctx, 174, 550, 3, '#fff');
    circle(ctx, 186, 552, 3, '#fff');
  }

  // pond with a duck
  ellipse(ctx, 450, 520, 92, 42, '#4aa8d8');
  ellipse(ctx, 450, 520, 78, 32, '#6fc3ea');
  if (!changed.has('pond-duck')) {
    ellipse(ctx, 440, 512, 16, 11, '#fff');
    circle(ctx, 426, 502, 8, '#fff');
    poly(ctx, [[418, 502], [410, 505], [418, 508]], '#f2a541');
    circle(ctx, 424, 500, 1.8, '#222');
  }

  // bench
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(300, 440, 110, 10);
  ctx.fillRect(300, 462, 110, 10);
  ctx.fillRect(308, 450, 8, 42);
  ctx.fillRect(394, 450, 8, 42);

  // flower bed along the bottom
  const bed = [
    [60, 585, '#e23b3b'], [130, 592, '#ff8fd1'], [210, 582, '#ffb62e'],
    [300, 588, '#e23b3b'], [380, 584, '#7a5fd0'], [470, 590, '#ff8fd1'],
    [550, 584, '#ffb62e'],
  ];
  for (const [fx, fy, col] of bed) {
    const petal = changed.has('flower-color') && fx === 300 ? '#ffd94d' : col;
    line(ctx, fx, fy + 8, fx, fy + 26, '#2f9e4f', 3);
    flower(ctx, fx, fy, petal, '#fff3a0');
  }
  // grass tufts
  ctx.strokeStyle = '#3d8f4e';
  ctx.lineWidth = 2;
  for (const [gx, gy] of [[500, 470], [90, 470], [560, 470], [250, 540]]) {
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx - 5, gy - 12);
    ctx.moveTo(gx + 4, gy);
    ctx.lineTo(gx + 8, gy - 12);
    ctx.stroke();
  }

  if (!changed.has('butterfly')) butterfly(ctx, 250, 470, 1, '#7a5fd0');
  if (!changed.has('cat')) cat(ctx, 520, 560, 0.9);
}

const GARDEN_DIFFS = [
  { id: 'sun-rays', x: 90, y: 80, r: 42, label: 'sun rays' },
  { id: 'extra-cloud', x: 185, y: 150, r: 36, label: 'extra cloud' },
  { id: 'tree-apples', x: 110, y: 300, r: 40, label: 'apples on the tree' },
  { id: 'flower-color', x: 300, y: 588, r: 24, label: 'flower colour' },
  { id: 'butterfly', x: 250, y: 470, r: 28, label: 'butterfly' },
  { id: 'bird', x: 400, y: 90, r: 28, label: 'bird in the sky' },
  { id: 'pond-duck', x: 440, y: 512, r: 30, label: 'duck in the pond' },
  { id: 'fence-post', x: 440, y: 395, r: 26, label: 'fence post' },
  { id: 'cat', x: 520, y: 560, r: 32, label: 'sitting cat' },
  { id: 'mushroom', x: 180, y: 556, r: 26, label: 'mushroom' },
];

// --------------------------------------------------------------- kitchen
function drawKitchen(ctx, changed) {
  // wall + floor
  rect(ctx, 0, 0, 600, 430, '#f7ead2');
  rect(ctx, 0, 430, 600, 190, '#c89b6a');
  for (let y = 470; y < 620; y += 46) line(ctx, 0, y, 600, y, '#a87c4e', 2);

  // window with curtains
  rect(ctx, 70, 50, 200, 170, '#fff');
  rect(ctx, 82, 62, 176, 146, '#bfe6ff');
  circle(ctx, 130, 110, 22, '#ffd94d');
  ctx.fillStyle = '#7cc46a';
  ctx.beginPath();
  ctx.moveTo(82, 208);
  ctx.lineTo(170, 160);
  ctx.lineTo(258, 208);
  ctx.closePath();
  ctx.fill();
  const curtain = changed.has('curtain-color') ? '#4caf7d' : '#4a90d9';
  poly(ctx, [[62, 44], [108, 44], [100, 226], [62, 226]], curtain);
  poly(ctx, [[228, 44], [274, 44], [274, 226], [236, 226]], curtain);

  // wall clock (3:00 on the left, 4:30 on the right), clear of the mugs
  const cx = 400;
  const cy = 150;
  circle(ctx, cx, cy, 38, '#fff');
  ctx.beginPath();
  ctx.arc(cx, cy, 38, 0, Math.PI * 2);
  ctx.strokeStyle = '#33302e';
  ctx.lineWidth = 4;
  ctx.stroke();
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    line(ctx, cx + Math.cos(a) * 30, cy + Math.sin(a) * 30, cx + Math.cos(a) * 34, cy + Math.sin(a) * 34, '#33302e', 2);
  }
  if (changed.has('clock-hands')) {
    line(ctx, cx, cy, cx + 20, cy, '#33302e', 4); // to 3
    line(ctx, cx, cy, cx, cy + 24, '#33302e', 4); // to 6
  } else {
    line(ctx, cx, cy, cx, cy - 24, '#33302e', 4); // to 12
    line(ctx, cx, cy, cx + 20, cy, '#33302e', 4); // to 3
  }
  circle(ctx, cx, cy, 4, '#e23b3b');

  // framed picture: a fish on the left, a flower on the right
  rect(ctx, 500, 150, 70, 60, '#8a5a2b');
  rect(ctx, 508, 158, 54, 44, '#dff3ff');
  if (changed.has('picture-fish')) flower(ctx, 535, 180, '#ff8fd1', '#fff3a0');
  else fish(ctx, 535, 180, 0.9, '#f2a541');

  // shelf with hanging mugs
  rect(ctx, 380, 30, 200, 12, '#8a5a2b');
  for (const [mx, miss] of [[415, false], [480, true], [545, false]]) {
    if (changed.has('mug-missing') && miss) continue;
    line(ctx, mx, 42, mx, 56, '#33302e', 2);
    roundRect(ctx, mx - 14, 56, 28, 34, 6, '#e2574c');
    ctx.strokeStyle = '#e2574c';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(mx + 16, 72, 8, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
  }

  // counter + cabinets
  rect(ctx, 0, 430, 600, 16, '#8a5a2b');
  rect(ctx, 0, 446, 600, 174, '#f2e3c6');
  for (const cx of [100, 300, 500]) {
    rect(ctx, cx - 80, 470, 160, 120, '#d9b98a');
    ctx.strokeStyle = '#8a5a2b';
    ctx.lineWidth = 3;
    ctx.strokeRect(cx - 80, 470, 160, 120);
    circle(ctx, cx + 62, 530, 6, '#8a5a2b');
  }

  // stove pot with lid (lid off on the right: soup shows)
  rect(ctx, 140, 398, 110, 32, '#3a3f44');
  ellipse(ctx, 195, 398, 55, 10, '#565d63');
  ctx.fillStyle = '#c0c8ce';
  ctx.fillRect(150, 368, 90, 32);
  if (changed.has('pot-lid')) {
    ellipse(ctx, 195, 368, 46, 9, '#f2a541'); // soup
    circle(ctx, 180, 366, 5, '#e2574c');
    circle(ctx, 210, 364, 5, '#7cc46a');
  } else {
    ellipse(ctx, 195, 368, 48, 8, '#8a939b');
    line(ctx, 195, 360, 195, 352, '#565d63', 4);
  }

  // kettle with steam
  ctx.fillStyle = '#4a90d9';
  ctx.beginPath();
  ctx.ellipse(330, 408, 34, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  poly(ctx, [[356, 396], [382, 382], [378, 398], [358, 406]], '#4a90d9');
  rect(ctx, 318, 372, 24, 14, '#2f6da8');
  if (!changed.has('kettle-steam')) {
    ctx.strokeStyle = 'rgba(120,120,120,0.7)';
    ctx.lineWidth = 3;
    for (const sx of [322, 338]) {
      ctx.beginPath();
      ctx.moveTo(sx, 368);
      ctx.quadraticCurveTo(sx - 8, 350, sx + 2, 334);
      ctx.stroke();
    }
  }

  // fruit bowl (3 apples left, 2 right)
  ctx.fillStyle = '#7a5fd0';
  ctx.beginPath();
  ctx.ellipse(465, 424, 48, 14, 0, 0, Math.PI);
  ctx.fill();
  const apples = changed.has('fruit-count')
    ? [[445, 408], [482, 410]]
    : [[445, 408], [465, 400], [486, 409]];
  for (const [ax, ay] of apples) circle(ctx, ax, ay, 11, '#e23b3b');

  // potted plant (flower on the left only)
  ctx.fillStyle = '#e2574c';
  ctx.beginPath();
  ctx.moveTo(528, 400);
  ctx.lineTo(576, 400);
  ctx.lineTo(570, 430);
  ctx.lineTo(534, 430);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#2f9e4f';
  ctx.lineWidth = 4;
  for (const [lx, ly] of [[540, 396], [552, 386], [564, 396]]) {
    ctx.beginPath();
    ctx.moveTo(552, 400);
    ctx.quadraticCurveTo(lx, ly - 6, lx, ly - 14);
    ctx.stroke();
  }
  if (!changed.has('plant-flower')) flower(ctx, 552, 372, '#ff8fd1', '#fff3a0');

  // chair with a cat, bottom left
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(60, 500, 90, 10);
  ctx.fillRect(66, 510, 8, 70);
  ctx.fillRect(136, 510, 8, 70);
  ctx.fillRect(60, 440, 8, 70);
  if (!changed.has('cat')) cat(ctx, 105, 492, 0.8);

  // rug with a stripe (red left, blue right)
  ellipse(ctx, 320, 575, 120, 26, '#e8d9a8');
  ellipse(ctx, 320, 575, 100, 18, changed.has('rug-stripe') ? '#4a90d9' : '#e2574c');
}

const KITCHEN_DIFFS = [
  { id: 'clock-hands', x: 400, y: 150, r: 40, label: 'clock hands' },
  { id: 'curtain-color', x: 85, y: 135, r: 40, label: 'curtain colour' },
  { id: 'kettle-steam', x: 330, y: 350, r: 26, label: 'kettle steam' },
  { id: 'mug-missing', x: 480, y: 72, r: 24, label: 'hanging mug' },
  { id: 'fruit-count', x: 465, y: 408, r: 30, label: 'apples in the bowl' },
  { id: 'plant-flower', x: 552, y: 372, r: 22, label: 'flower on the plant' },
  { id: 'picture-fish', x: 535, y: 180, r: 30, label: 'framed picture' },
  { id: 'pot-lid', x: 195, y: 372, r: 30, label: 'pot lid' },
  { id: 'rug-stripe', x: 320, y: 575, r: 40, label: 'rug stripe colour' },
];

// ----------------------------------------------------------------- beach
function drawBeach(ctx, changed) {
  sky(ctx, PANEL_W, PANEL_H, '#7ecbf2', '#dff6ff');
  // sea
  rect(ctx, 0, 290, 600, 130, '#2f8fc7');
  ctx.strokeStyle = 'rgba(255,255,255,0.65)';
  ctx.lineWidth = 3;
  for (const [wx, wy, wl] of [[60, 330, 90], [300, 360, 110], [470, 325, 80], [180, 395, 120]]) {
    ctx.beginPath();
    ctx.moveTo(wx, wy);
    ctx.quadraticCurveTo(wx + wl / 2, wy - 8, wx + wl, wy);
    ctx.stroke();
  }
  // sand
  ctx.fillStyle = '#f2dd9e';
  ctx.beginPath();
  ctx.moveTo(0, 430);
  ctx.quadraticCurveTo(300, 405, 600, 432);
  ctx.lineTo(600, 620);
  ctx.lineTo(0, 620);
  ctx.closePath();
  ctx.fill();

  sun(ctx, 520, 70, 32, true);
  cloud(ctx, 110, 80, 0.9);
  cloud(ctx, 300, 55, 0.7);
  if (changed.has('extra-cloud')) cloud(ctx, 430, 140, 0.65);
  if (!changed.has('seagull')) bird(ctx, 250, 120, 1);

  // sailboat (red sail left, blue sail right)
  poly(ctx, [[150, 330], [150, 262], [196, 330]], changed.has('sail-color') ? '#4a90d9' : '#e23b3b');
  poly(ctx, [[142, 330], [142, 276], [108, 330]], '#fff');
  line(ctx, 150, 258, 150, 334, '#6b4a2b', 4);
  ctx.fillStyle = '#8a5a2b';
  ctx.beginPath();
  ctx.moveTo(96, 330);
  ctx.lineTo(204, 330);
  ctx.lineTo(186, 348);
  ctx.lineTo(114, 348);
  ctx.closePath();
  ctx.fill();

  // palm tree with coconuts (3 left, 2 right)
  ctx.strokeStyle = '#8a5a2b';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(90, 460);
  ctx.quadraticCurveTo(96, 380, 78, 330);
  ctx.stroke();
  ctx.strokeStyle = '#2f9e4f';
  ctx.lineWidth = 8;
  for (const [fx, fy, tx, ty] of [[78, 330, 20, 300], [78, 330, 40, 290], [78, 330, 120, 296], [78, 330, 140, 316], [78, 330, 100, 344]]) {
    ctx.beginPath();
    ctx.moveTo(78, 330);
    ctx.quadraticCurveTo(fx, fy, tx, ty);
    ctx.stroke();
  }
  const nuts = changed.has('coconuts') ? [[70, 338], [88, 342]] : [[70, 338], [88, 342], [79, 350]];
  for (const [nx, ny] of nuts) circle(ctx, nx, ny, 7, '#6b4a2b');

  // striped umbrella (one stripe changes colour)
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(346, 470, 6, 70);
  const stripes = ['#e23b3b', '#fff', '#e23b3b', '#fff', '#e23b3b'];
  if (changed.has('umbrella-stripe')) stripes[1] = '#ffd94d';
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(350, 470);
    ctx.arc(350, 470, 62, Math.PI + (i / 5) * Math.PI, Math.PI + ((i + 1) / 5) * Math.PI);
    ctx.closePath();
    ctx.fillStyle = stripes[i];
    ctx.fill();
  }
  circle(ctx, 350, 470, 5, '#ffd94d');

  // beach ball (a yellow panel turns white on the right)
  const ballColors = changed.has('ball-panel')
    ? ['#e23b3b', '#fff', '#4a90d9', '#fff', '#37b25c']
    : ['#e23b3b', '#ffd94d', '#4a90d9', '#fff', '#37b25c'];
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(250, 540);
    ctx.arc(250, 540, 28, -Math.PI / 2 + (i / 5) * Math.PI * 2, -Math.PI / 2 + ((i + 1) / 5) * Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = ballColors[i];
    ctx.fill();
  }
  circle(ctx, 250, 540, 7, '#fff');
  ctx.beginPath();
  ctx.arc(250, 540, 28, 0, Math.PI * 2);
  ctx.strokeStyle = '#33302e';
  ctx.lineWidth = 2;
  ctx.stroke();

  // towel with sunglasses
  roundRect(ctx, 150, 566, 110, 34, 8, '#ff8fd1');
  line(ctx, 150, 578, 260, 578, '#fff', 4);
  line(ctx, 150, 590, 260, 590, '#fff', 4);
  if (!changed.has('sunglasses')) {
    circle(ctx, 196, 582, 9, '#222');
    circle(ctx, 220, 582, 9, '#222');
    line(ctx, 205, 582, 211, 582, '#222', 3);
  }

  // bucket and spade
  ctx.fillStyle = '#e23b3b';
  ctx.beginPath();
  ctx.moveTo(452, 528);
  ctx.lineTo(492, 528);
  ctx.lineTo(486, 566);
  ctx.lineTo(458, 566);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#8a5a2b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(472, 528, 14, Math.PI, 0);
  ctx.stroke();
  if (!changed.has('spade')) {
    line(ctx, 500, 566, 516, 522, '#f2a541', 5);
    poly(ctx, [[508, 522], [524, 522], [516, 500]], '#4a90d9');
  }

  // crab (missing on the right)
  if (!changed.has('crab')) {
    ctx.fillStyle = '#e2574c';
    ctx.beginPath();
    ctx.ellipse(420, 582, 20, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    circle(ctx, 404, 572, 8, '#e2574c');
    circle(ctx, 436, 572, 8, '#e2574c');
    ctx.fillStyle = '#fff';
    circle(ctx, 412, 578, 3, '#fff');
    circle(ctx, 428, 578, 3, '#fff');
    ctx.fillStyle = '#222';
    circle(ctx, 412, 578, 1.5, '#222');
    circle(ctx, 428, 578, 1.5, '#222');
    ctx.strokeStyle = '#e2574c';
    ctx.lineWidth = 3;
    for (const [lx, ly] of [[400, 592], [404, 596], [440, 592], [436, 596]]) {
      ctx.beginPath();
      ctx.moveTo(412, 588);
      ctx.lineTo(lx, ly);
      ctx.stroke();
    }
  }

  // starfish, and one extra on the right
  star(ctx, 540, 600, 16, '#f2a541');
  if (changed.has('extra-starfish')) star(ctx, 120, 600, 14, '#ff8fd1');
}

const BEACH_DIFFS = [
  { id: 'sail-color', x: 165, y: 300, r: 34, label: 'sail colour' },
  { id: 'extra-cloud', x: 430, y: 140, r: 30, label: 'extra cloud' },
  { id: 'ball-panel', x: 250, y: 540, r: 30, label: 'beach ball panel' },
  { id: 'crab', x: 420, y: 582, r: 28, label: 'crab' },
  { id: 'extra-starfish', x: 120, y: 600, r: 24, label: 'extra starfish' },
  { id: 'coconuts', x: 79, y: 344, r: 24, label: 'coconuts' },
  { id: 'spade', x: 510, y: 530, r: 24, label: 'spade' },
  { id: 'sunglasses', x: 208, y: 582, r: 26, label: 'sunglasses' },
  { id: 'seagull', x: 250, y: 120, r: 24, label: 'seagull' },
  { id: 'umbrella-stripe', x: 350, y: 450, r: 34, label: 'umbrella stripe' },
];

// ---------------------------------------------------------------- scenes
export const SCENES = [
  { id: 'garden', name: 'Sunny Garden', timeLimit: 180, diffs: GARDEN_DIFFS, draw: drawGarden },
  { id: 'kitchen', name: 'Cozy Kitchen', timeLimit: 150, diffs: KITCHEN_DIFFS, draw: drawKitchen },
  { id: 'beach', name: 'Sunny Beach', timeLimit: 120, diffs: BEACH_DIFFS, draw: drawBeach },
];

export function drawScene(ctx, sceneIndex, changed) {
  SCENES[sceneIndex].draw(ctx, changed);
}

export function allDiffIds(sceneIndex) {
  return new Set(SCENES[sceneIndex].diffs.map((d) => d.id));
}
