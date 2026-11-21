// SPDX-License-Identifier: MIT
// audio.js — all sounds are synthesized with WebAudio. No audio files.

let audioCtx = null;
let muted = false;

export function isMuted() {
  return muted;
}

export function toggleMuted() {
  muted = !muted;
  return muted;
}

function ensureCtx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(freq, startAt, dur, type, vol) {
  const ctx = ensureCtx();
  if (!ctx || muted) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startAt + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + startAt);
  osc.stop(ctx.currentTime + startAt + dur + 0.05);
}

export function playClick() {
  tone(620, 0, 0.06, 'sine', 0.12);
}

export function playFound() {
  // a bright two-note chime that rewards the find
  tone(660, 0, 0.14, 'sine', 0.22);
  tone(990, 0.09, 0.22, 'sine', 0.22);
  tone(1320, 0.18, 0.28, 'triangle', 0.14);
}

export function playWrong() {
  tone(160, 0, 0.18, 'sawtooth', 0.1);
  tone(120, 0.08, 0.2, 'sawtooth', 0.08);
}

export function playHint() {
  tone(880, 0, 0.1, 'sine', 0.14);
  tone(1174, 0.1, 0.16, 'sine', 0.14);
}

export function playSceneComplete() {
  const notes = [523, 659, 784, 1046];
  notes.forEach((n, i) => tone(n, i * 0.12, 0.22, 'triangle', 0.2));
}

export function playWin() {
  const notes = [523, 659, 784, 1046, 784, 1046, 1318];
  notes.forEach((n, i) => tone(n, i * 0.14, 0.3, 'triangle', 0.2));
}

export function playTick() {
  tone(440, 0, 0.05, 'square', 0.05);
}
