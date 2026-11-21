// SPDX-License-Identifier: MIT
// state.js — one scene's game state: found differences, score, timer, hints.

import { SCENES } from './scenes.js';

export const POINTS_PER_FIND = 100;
export const HINT_COST = 25;
export const WRONG_CLICK_COST = 10;
export const MAX_HINTS_PER_SCENE = 3;
export const TIME_BONUS_PER_SECOND = 5;

export class SceneState {
  constructor(sceneIndex) {
    this.sceneIndex = sceneIndex;
    this.scene = SCENES[sceneIndex];
    this.found = new Map(); // diff id -> { at: timestamp, panel: 'left'|'right' }
    this.marks = []; // animated markers: { diff, bornAt }
    this.wrongMarks = []; // { x, y, panel, bornAt }
    this.hintsUsed = 0;
    this.hintPulse = null; // { diffId, until }
    this.score = 0;
    this.timeLeft = this.scene.timeLimit;
    this.finished = false;
    this.startedAt = performance.now();
  }

  get totalDiffs() {
    return this.scene.diffs.length;
  }

  get foundCount() {
    return this.found.size;
  }

  get remainingCount() {
    return this.totalDiffs - this.found.size;
  }

  get isComplete() {
    return this.found.size === this.totalDiffs;
  }

  diffAt(x, y, panel) {
    // x, y are panel-local coordinates; the same spot counts in both panels
    for (const d of this.scene.diffs) {
      if (this.found.has(d.id)) continue;
      const dx = x - d.x;
      const dy = y - d.y;
      if (dx * dx + dy * dy <= d.r * d.r) return d;
    }
    return null;
  }

  markFound(diff) {
    this.found.set(diff.id, { at: performance.now() });
    this.marks.push({ diff, bornAt: performance.now() });
    const timeBonus = Math.round(this.timeLeft) * 2;
    this.score += POINTS_PER_FIND + timeBonus;
    if (this.isComplete) {
      this.finished = true;
      this.score += Math.round(this.timeLeft) * TIME_BONUS_PER_SECOND;
    }
    return this.score;
  }

  markWrong(x, y) {
    this.wrongMarks.push({ x, y, bornAt: performance.now() });
    this.score = Math.max(0, this.score - WRONG_CLICK_COST);
  }

  useHint() {
    if (this.hintsUsed >= MAX_HINTS_PER_SCENE || this.isComplete) return null;
    const left = this.scene.diffs.filter((d) => !this.found.has(d.id));
    if (left.length === 0) return null;
    const pick = left[Math.floor(Math.random() * left.length)];
    this.hintsUsed += 1;
    this.score = Math.max(0, this.score - HINT_COST);
    this.hintPulse = { diffId: pick.id, until: performance.now() + 2500 };
    return pick;
  }

  tick(dtSeconds) {
    if (this.finished || this.isComplete) return;
    this.timeLeft = Math.max(0, this.timeLeft - dtSeconds);
  }

  get timeUp() {
    return this.timeLeft <= 0 && !this.isComplete;
  }

  formatTime() {
    const s = Math.max(0, Math.ceil(this.timeLeft));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }
}
