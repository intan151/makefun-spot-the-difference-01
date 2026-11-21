// SPDX-License-Identifier: MIT
// main.js — boots Twin Peeks, runs the render loop, owns the screens
// (title / playing / scene complete / win / time up) and the HUD.

import { PANEL_H, PANEL_W, SCENES, allDiffIds, drawScene } from './scenes.js';
import { SceneState } from './state.js';
import { attachKeyboard, attachPointer } from './input.js';
import { isMuted, playClick, playFound, playHint, playSceneComplete, playTick, playWin, playWrong, toggleMuted } from './audio.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const PANELS = [
  { x: 20, y: 20, w: PANEL_W, h: PANEL_H, label: 'PICTURE A' },
  { x: 660, y: 20, w: PANEL_W, h: PANEL_H, label: 'PICTURE B' },
];

const el = (id) => document.getElementById(id);
const sceneNameEl = el('sceneName');
const remainingEl = el('remainingPill');
const foundEl = el('foundPill');
const timerEl = el('timerPill');
const scoreEl = el('scorePill');
const statusEl = el('status');

let screen = 'title'; // title | playing | scene-done | win | time-up
let sceneState = new SceneState(0);
let totalScore = 0;
let sceneResults = [];
let lastTick = performance.now();
let lastWholeSecond = -1;
let sceneDoneAt = 0;

function showOverlay(id) {
  for (const name of ['titleScreen', 'sceneScreen', 'winScreen', 'timeScreen']) {
    el(name).classList.toggle('hidden', name !== id);
  }
  if (!id) {
    for (const name of ['titleScreen', 'sceneScreen', 'winScreen', 'timeScreen']) {
      el(name).classList.add('hidden');
    }
  }
}

function startScene(index) {
  sceneState = new SceneState(index);
  screen = 'playing';
  lastWholeSecond = -1;
  showOverlay(null);
  sceneNameEl.textContent = SCENES[index].name;
  updateHud();
  statusEl.textContent = `${SCENES[index].name}: find ${sceneState.totalDiffs} differences.`;
}

function startGame() {
  totalScore = 0;
  sceneResults = [];
  startScene(0);
}

function updateHud() {
  remainingEl.textContent = `${sceneState.remainingCount} remaining`;
  foundEl.textContent = `${sceneState.foundCount} found`;
  timerEl.textContent = sceneState.formatTime();
  timerEl.classList.toggle('low', sceneState.timeLeft <= 30 && screen === 'playing');
  scoreEl.textContent = `Score ${totalScore + sceneState.score}`;
  el('hintBtn').textContent = `💡 Hint (${3 - sceneState.hintsUsed} left)`;
  el('soundBtn').textContent = isMuted() ? '🔇' : '🔊';
}

function panelAt(x, y) {
  for (let i = 0; i < PANELS.length; i++) {
    const p = PANELS[i];
    if (x >= p.x && x < p.x + p.w && y >= p.y && y < p.y + p.h) {
      return { index: i, lx: x - p.x, ly: y - p.y };
    }
  }
  return null;
}

function handleCanvasClick(x, y) {
  if (screen !== 'playing') return;
  const hit = panelAt(x, y);
  if (!hit) return;
  const diff = sceneState.diffAt(hit.lx, hit.ly);
  if (diff) {
    sceneState.markFound(diff);
    playFound();
    updateHud();
    statusEl.textContent = `Found: ${diff.label}! ${sceneState.remainingCount} remaining.`;
    if (sceneState.isComplete) {
      sceneDoneAt = performance.now();
      totalScore += sceneState.score;
      sceneResults.push({ name: sceneState.scene.name, score: sceneState.score, timeLeft: sceneState.timeLeft });
      if (sceneState.sceneIndex === SCENES.length - 1) {
        playWin();
        setTimeout(() => {
          if (screen !== 'playing') return;
          screen = 'win';
          const lines = sceneResults.map((r) => `${r.name}: ${r.score} pts`).join('<br>');
          el('winStats').innerHTML = `${lines}<br><b>Total score: ${totalScore}</b>`;
          showOverlay('winScreen');
        }, 900);
      } else {
        playSceneComplete();
        setTimeout(() => {
          if (screen !== 'playing') return;
          screen = 'scene-done';
          el('sceneTitle').textContent = `${sceneState.scene.name} — complete!`;
          el('sceneStats').innerHTML =
            `You found all ${sceneState.totalDiffs} differences with ${sceneState.formatTime()} to spare.<br>` +
            `Scene score: <b>${sceneState.score}</b> · Total: <b>${totalScore}</b>`;
          showOverlay('sceneScreen');
        }, 900);
      }
    }
  } else {
    sceneState.markWrong(hit.lx, hit.ly);
    playWrong();
    updateHud();
    statusEl.textContent = 'Not a difference — try again.';
  }
}

function useHint() {
  if (screen !== 'playing') return;
  const pick = sceneState.useHint();
  if (pick) {
    playHint();
    updateHud();
    statusEl.textContent = `Hint: look near the ${pick.label}.`;
  }
}

function onKey(key) {
  if (key === 'enter') {
    if (screen === 'title') startGame();
    else if (screen === 'scene-done') startScene(sceneState.sceneIndex + 1);
    else if (screen === 'win' || screen === 'time-up') startGame();
    return;
  }
  if (key === 'm') {
    toggleMuted();
    updateHud();
    return;
  }
  if (screen !== 'playing') return;
  if (key === 'h') useHint();
  else if (key === 'r') startScene(sceneState.sceneIndex);
  else if (key === '1' || key === '2' || key === '3') startScene(Number(key) - 1);
}

// ------------------------------------------------------------ rendering
function drawPanelBorder(panel) {
  ctx.strokeStyle = '#0e1a26';
  ctx.lineWidth = 4;
  ctx.strokeRect(panel.x, panel.y, panel.w, panel.h);
  // label badge
  ctx.fillStyle = 'rgba(14, 26, 38, 0.85)';
  ctx.beginPath();
  ctx.roundRect(panel.x + 10, panel.y + 10, 118, 30, 15);
  ctx.fill();
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'bold 16px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(panel.label, panel.x + 69, panel.y + 26);
}

function drawMarker(diff, bornAt, now) {
  const age = now - bornAt;
  const pop = age < 280 ? 1.45 - (age / 280) * 0.45 : 1;
  const r = diff.r * 0.82 * pop;
  for (const panel of PANELS) {
    const cx = panel.x + diff.x;
    const cy = panel.y + diff.y;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffd94d';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r + 5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 217, 77, 0.45)';
    ctx.lineWidth = 2;
    ctx.stroke();
    // check mark
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.45, cy);
    ctx.lineTo(cx - r * 0.12, cy + r * 0.35);
    ctx.lineTo(cx + r * 0.5, cy - r * 0.35);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.stroke();
  }
}

function drawWrongMark(mark, now) {
  const age = now - mark.bornAt;
  if (age > 700) return;
  const alpha = 1 - age / 700;
  for (const panel of PANELS) {
    const cx = panel.x + mark.x;
    const cy = panel.y + mark.y;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#ff5a5a';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 12, cy - 12);
    ctx.lineTo(cx + 12, cy + 12);
    ctx.moveTo(cx + 12, cy - 12);
    ctx.lineTo(cx - 12, cy + 12);
    ctx.stroke();
    ctx.restore();
  }
}

function drawHintPulse(now) {
  const hint = sceneState.hintPulse;
  if (!hint || now > hint.until) return;
  const diff = sceneState.scene.diffs.find((d) => d.id === hint.diffId);
  if (!diff) return;
  const pulse = 1 + 0.18 * Math.sin(now / 120);
  for (const panel of PANELS) {
    ctx.beginPath();
    ctx.arc(panel.x + diff.x, panel.y + diff.y, diff.r * pulse, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 182, 46, 0.9)';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 8]);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function render(now) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#22303c';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const rightChanged = allDiffIds(sceneState.sceneIndex);
  const leftChanged = new Set();
  const panels = [leftChanged, rightChanged];
  for (let i = 0; i < PANELS.length; i++) {
    const p = PANELS[i];
    ctx.save();
    ctx.beginPath();
    ctx.rect(p.x, p.y, p.w, p.h);
    ctx.clip();
    ctx.translate(p.x, p.y);
    drawScene(ctx, sceneState.sceneIndex, panels[i]);
    ctx.restore();
    drawPanelBorder(p);
  }

  for (const mark of sceneState.marks) drawMarker(mark.diff, mark.bornAt, now);
  for (const mark of sceneState.wrongMarks) drawWrongMark(mark, now);
  if (screen === 'playing') drawHintPulse(now);
}

function loop(now) {
  const dt = Math.min(0.1, (now - lastTick) / 1000);
  lastTick = now;
  if (screen === 'playing') {
    sceneState.tick(dt);
    const whole = Math.ceil(sceneState.timeLeft);
    if (whole !== lastWholeSecond) {
      lastWholeSecond = whole;
      if (whole <= 5 && whole > 0) playTick();
      updateHud();
    }
    if (sceneState.timeUp) {
      screen = 'time-up';
      el('timeStats').innerHTML =
        `You found ${sceneState.foundCount} of ${sceneState.totalDiffs} differences in ${sceneState.scene.name}.<br>` +
        `Score so far: <b>${totalScore + sceneState.score}</b>`;
      showOverlay('timeScreen');
    }
  }
  render(now);
  requestAnimationFrame(loop);
}

// ------------------------------------------------------------- wiring
attachPointer(canvas, handleCanvasClick);
attachKeyboard(onKey);
el('startBtn').addEventListener('click', () => { playClick(); startGame(); });
el('nextBtn').addEventListener('click', () => { playClick(); startScene(sceneState.sceneIndex + 1); });
el('againBtn').addEventListener('click', () => { playClick(); startGame(); });
el('retryBtn').addEventListener('click', () => { playClick(); startScene(sceneState.sceneIndex); });
el('hintBtn').addEventListener('click', useHint);
el('soundBtn').addEventListener('click', () => { toggleMuted(); updateHud(); });

showOverlay('titleScreen');
updateHud();
requestAnimationFrame(loop);

// Test/automation hook: lets a scripted play-test read the scene and click
// exact differences. It changes nothing about the game itself.
window.__spot = {
  panels: PANELS,
  get screen() { return screen; },
  get sceneIndex() { return sceneState.sceneIndex; },
  get scene() { return SCENES[sceneState.sceneIndex]; },
  get foundCount() { return sceneState.foundCount; },
  get remainingCount() { return sceneState.remainingCount; },
  get totalScore() { return totalScore + sceneState.score; },
  startGame,
  startScene,
};
