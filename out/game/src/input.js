// SPDX-License-Identifier: MIT
// input.js — mouse clicks on the canvas and keyboard shortcuts.

export function attachPointer(canvas, onPanelClick) {
  canvas.addEventListener('pointerdown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    onPanelClick(x, y);
  });
}

export function attachKeyboard(onKey) {
  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if (['h', 'r', 'm', '1', '2', '3', 'enter', ' '].includes(key)) {
      event.preventDefault();
      onKey(key === ' ' ? 'enter' : key);
    }
  });
}
