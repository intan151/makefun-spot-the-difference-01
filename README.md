<!-- SPDX-License-Identifier: MIT -->
# Twin Peeks — Spot the Difference

[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/intan151/makefun-spot-the-difference-01/rank.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/intan151/makefun-spot-the-difference-01/reward.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)

A complete, original spot-the-difference game that runs offline from static
files. Two near-identical pictures side by side — click every difference
before the clock runs out.

## How to play

- **Mouse:** click a difference in either picture. A golden ring with a check
  mark appears on both pictures.
- **H:** hint (reveals one unfound difference for a few seconds, −25 points,
  3 per scene) · **R:** restart the scene · **1 / 2 / 3:** jump to a scene ·
  **M:** sound on/off · **Enter:** start / continue.
- A wrong click costs 10 points. Finding a difference scores 100 points plus
  a time bonus; finishing a scene adds 5 points per second left on the clock.

## Scenes

1. **Sunny Garden** — 10 differences, 3:00
2. **Cozy Kitchen** — 9 differences, 2:30
3. **Sunny Beach** — 10 differences, 2:00

Every picture is drawn procedurally on canvas (no copied art), every sound
is synthesized with WebAudio (no audio files), and the game makes no network
request at all.

## Run it

Serve `game/` with any static server, for example:

```sh
cd game && python3 -m http.server 8080
```

Then open <http://localhost:8080> in desktop Chrome.

## Files

- `game/index.html` — page, HUD, title / scene-complete / win / time-up overlays
- `game/style.css` — layout, HUD pills, overlay cards
- `game/src/main.js` — boot, render loop, screens, HUD, markers
- `game/src/scenes.js` — the three procedural scenes and their differences
- `game/src/art.js` — shared canvas drawing helpers
- `game/src/state.js` — per-scene state: finds, score, timer, hints
- `game/src/input.js` — mouse clicks and keyboard shortcuts
- `game/src/audio.js` — WebAudio sound effects
- `main.ts` — entry program: copies `game/` and `screenshots/` to `/output`
  and writes `dossier.json` with `vendor/makefun-game.ts`

## License

MIT — see [LICENSE](LICENSE).
