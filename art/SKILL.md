---
name: second-question-figures
description: Make, revise or review a figure for "The Second Question": an isometric, fine-line scene that does one thing, lights up what matters, answers the pointer, and turns in 3D. Use for the cover, part openers, chapter figures and the mark. The look follows ISO-GLOW (it wins every conflict), the construction follows Hairline, and the motion and checks follow Plotter.
---

# Second Question figures

A figure is one small machine that explains one idea. It is drawn in true isometric projection with fine lines on opaque faces; whatever is switched on glows in the book's magenta (or its teal); it runs a short loop that tells its idea; it answers the pointer; and the same description turns into a 3D scene the reader can orbit.

Three sources, one style:

| Source | What we take | Where they disagree |
|---|---|---|
| [ISO-GLOW](https://isoglow.dev) (MIT) | The look: fine-line isometric objects, opaque faces in two tones, what is on glows, floor spill under light, a plate under each figure, a true 3D view you can turn | **ISO-GLOW wins.** Glow is allowed (Hairline forbids it); depth is allowed (Plotter forbids it) |
| [Hairline](https://hairline.lucasmarkes.com) (MIT) | Construction: rounded solids drawn as a silhouette plus one dim crease, no vertical corner lines; a designed rest pose; hit tests against the rest pose; stagger by distance; clamped reach; springs for where, tweens for which | Small mono labels are allowed on surfaces, sparingly (ISO-GLOW uses them) |
| [Plotter](https://github.com/pasqualevitiello/plotter) (MIT) | Discipline: one relationship named before drawing; never an icon standing for an idea; every mark earns its place; dashed guides that tell the truth; the motion sentence; check and look before delivering | Isometric depth, glow and fills are allowed (ISO-GLOW wins) |

Credit: keep the line "Style after ISO-GLOW (isoglow.dev), with Hairline and Plotter (MIT)" wherever the figures are published. No code from those projects is copied here; the engine is the book's own.

## Hard rules

Each rule has a test. A figure that fails one is not finished.

1. **One idea, named first.** Before drawing, write the figure's `sentence`: "The viewer sees [change], which explains [relationship]." The change is what moves; the relationship is the chapter's idea. *Test:* the sentence is filled and the loop shows exactly that change.
2. **A machine, not an icon.** Draw the structure the idea works on and what happens to it: a beam that holds or does not, a channel that carries a signal or drops it, a set of trays that fill in order. Never a light bulb for an idea, a gear for process, a heart for empathy, a speech bubble for talk. *Test:* cover the title; the figure still shows a mechanism, not a symbol.
3. **What is on glows, and it means one thing.** Magenta (`on: 1`, role `accent`) marks the second question, the point, the human act, the part that matters. Teal (`on: 2`, role `accent2`) marks what supports it or what came first: the basis, the draft, the given. At rest at most two lit things, one per color. Glow is never decoration. *Test:* every lit part can be named in one word that matches the sentence.
4. **Fine lines on opaque faces.** Solids are opaque (they hide what is behind them) and drawn bright outside, dim inside: a silhouette, the top face as a lighter plate with a dim crease, no vertical corner lines. Use `detail` for seams and vents, `guide` (dashed) for limits, witnesses and projections, never as decoration. *Test:* no far edge shows through a near solid; nothing is outlined twice.
5. **Rest is designed.** The `still` is the poster, the static export, the reduced-motion frame and the 240px thumbnail. Pick the moment that tells the idea best (often the decisive event, not frame zero). *Test:* the still alone, at 240px, says what the figure is about.
6. **It does something.** A loop of 4 to 10 seconds (`cycle(t, T)`) that stages cause before response: approach, event, result, return. Use `keys()` with an ease per segment; hold a result long enough to read it. No unrelated rotation or pulsing. *Test:* describe the loop in one sentence without reading the code.
7. **It answers the pointer.** One gesture that lets the reader test the idea: aim the load, choose a tray, lift a layer. Hit tests use fixed planes or the rest pose (`input.onPlane(z)`, `input.pick(ids)`), never the moving pose. Use `input.spring()` for where the pointer is and `input.tween()` for which part is chosen. Clamp every reach. Without a pointer the loop runs. *Test:* holding the pointer still on a moving part never makes it flicker.
8. **Quiet.** No sentences in the drawing. A label, if any, is a few mono characters on a surface (`k.label`, at most 12 characters, at most two per figure); the name goes on the plate (`plate`) and the state on the read-out (`readout`). No people: show people through what they use (a chair, a cup, a lamp, a door). No real logos, brands, products or places. *Test:* the checker counts labels; no figure needs one to be understood.
9. **3D-honest.** Build everything as solids in world space, so the 3D view shows the same object from every side. No flat tricks that only work at the iso angle. *Test:* the figure looks right in the 3D view from three angles.
10. **Fits the frame.** The canvas is 560 × 440. Fit with `view.scale` and `view.origin` so the still covers 40 to 65% of the frame, centred near (280, 220), and nothing leaves it at any moment of the loop (the checker samples the loop). *Test:* `look.mjs` passes.
11. **Original.** Our metaphors come from the book's outline. Do not recreate an ISO-GLOW, Hairline or Plotter figure or a known product. *Test:* nothing in the figure could be mistaken for one of theirs.

## The frame and the camera

- World units: z is up. On screen +x runs right and down, +y left and down. The visible faces are the top (+z), the right side (+x) and the left side (+y).
- `view: { scale, origin }`: screen units per world unit, and where the world origin lands. Start with `scale` 26 to 34 for a scene about 10 units wide.
- Depth order: parts are painted far to near by the depth of their centre (`x + y + z`), within `layer` (lower first). Use `layer` for flat things lying on others: the floor grid at -9, a base plate at -3, wires and guides on it at -2, floor halos at -1, everything standing at 0. Nudge a part with `bias` (added to its depth) when two touch.

## The kit

A figure file is `src/figures/<slug>.js`:

```js
import { breathe, clamp, cycle, easeIn, easeInOut, easeOut, figure, keys } from "../lib/iso/core.js"

export default figure({
  slug: "19-the-demo",                 // the chapter's slug (or "cover", "part-1-clear-head", ...)
  title: "A detour around the step that fails",   // short accessible name
  desc: "What the still shows, in one or two plain sentences.",
  plate: "The demo",                   // name on the plate under the figure
  sentence: "The viewer sees ..., which explains ...",
  view: { scale: 30, origin: [200, 180] },
  still: 3.4,                          // seconds into the loop: the designed rest
  build(k) { /* add parts; return extra state if needed */ },
  tick(t, s, input) { /* set props for time t */ },
  readout: (s) => s.state || "rest",   // a few characters: what is happening or under the pointer
})
```

Parts (all take `at`, and optional `role`, `on`, `glow`, `layer`, `bias`, `parent`):

| Call | Shape | Notes |
|---|---|---|
| `k.block(id, { at, size: [w, d, h], r })` | Rounded box; `at` is its lowest corner | `r` rounds the vertical corners (0.15 to 0.4) |
| `k.cyl(id, { at, radius, h })` | Upright cylinder; `at` is the centre of its base | Discs, pucks, posts, dials |
| `k.extrude(id, { at, shape, face, depth })` | Flat rings of `[u, v]` points standing on a face (`"+x"` right side, `"+y"` left side, `"+z"` flat) and pushed back by `depth` | Glyphs, brackets, arches, any profile. Build outlines from exact arcs (`arc()`), not stroke offsets |
| `k.wire(id, { pts, flow })` | A cable or track through world points | `flow: { period }` sends a light pulse along it (on: 1 or 2 to color it) |
| `k.detail(id, { pts })` | Fine seam, vent or tick line on a surface | Dim tone; no gap stroke |
| `k.guide(id, { pts })` | Dashed construction line | Limits, witnesses, projections |
| `k.led(id, { at, r, face })` | Small round lamp on a face | Lit with `on`; `glow` adds a bloom |
| `k.halo(id, { at, r })` | Light spilled on a floor or top | `glow` 0..1 sets its strength; `on: 2` for teal |
| `k.face(id, { pts, role })` | Flat polygon: a screen, a panel, a slot | `role: "glass"` for screens, `"recess"` for slots |
| `k.label(id, { at, text, face, size })` | Mono label lying on a face | Rule 8 |
| `k.grid(id, { at, size: [w, d], step })` | Dotted drawing board fading from its centre | One per figure at most, `layer` -9 |
| `k.group(id, { at })` | Moves children together | A child's `at` is relative to its group's `at`; animate `s.groups.id.off` and `.rz` |

Roles: `body` (default), `ghost` (dashed outline: what is absent, proposed, unsupported or only drafted), `glass`, `recess`, `accent` (always magenta), `accent2` (always teal). The `brand` roles are for the mark only.

Props `tick()` may set each frame (they reset to their build values first, so set what you need every frame):

- `off: [dx, dy, dz]` and `rz` (degrees, about the part's `at`): move and turn;
- `at`: may be reassigned for parts that slide;
- `on`: 0, 1 (magenta) or 2 (teal); `glow`: 0..1; `fade`: 0..1; `hide`; `dash`;
- `flow` on wires.

`input` in `tick()`:

- `input.onPlane(z)`: the world point where the pointer meets the horizontal plane at height `z`, or null;
- `input.pick(ids)`: which of those parts is under the pointer in the rest pose, or null;
- `input.spring(key, target)` (k 100, c 18) for continuous aims; `input.tween(key, target)` (700 ms, ease .32 .72 0 1) for choices. Call each key once per frame;
- `input.still`: true for the poster and under reduced motion: show the designed frame, no breathing.

Helpers from `core.js`: `cycle(t, T)` (0..1 through the lap), `keys(p, [[at, value, ease], ...])`, `breathe(t, T)`, `clamp`, `lerp`, `smooth`, `easeIn`, `easeOut`, `easeInOut`, `easeChoice`, `arc(cx, cy, r, a0, a1)`, `rrect(...)`, `ring(...)`.

## Engine facts worth knowing

Learned while drawing the first ten figures; they save hours.

- **Paint order** is by the depth of each part's centre within its `layer`. Long thin solids (a wall meeting another at a T) and parts that interlock (a dovetail) need help: give a `bias`, or split a solid into pieces that sort correctly. `bias` and `layer` may be set in `tick()` like any other prop (they reset every frame), so a part rising out of a slot can change its order as it clears.
- **A wire's depth** is its middle point (`pts[floor(n/2)]`), not its centroid. A line lying on a solid (a ring, a seam) needs three or more points or a `bias` to draw above it.
- **Halos**: a halo on the floor defaults to layer -1 (above the grid, a base plate at -3 and floor wires); a halo on a raised top (its `at` above 0) defaults to layer 0. Set `layer` yourself when a halo must sit on something else.
- **Ghosts glow** in the SVG when you set `glow`; in 3D a ghost has no fill to light, so put a lamp or face beside it when the glow matters.
- **3D builds each part once.** `role` and `dash` set in `tick()` change the SVG but not the 3D view. If a part must switch between solid and ghost, make two parts and swap them with `hide`.
- **3D picking** (`input.pick`) hits the moving meshes. For stable hit tests in both views, prefer `input.onPlane(z)` with fixed regions.
- **Glow in 3D** is a soft sprite at the centre of the part's own bounds, not depth-tested; a face's or extrusion's glow follows its shape wherever its `at` is.
- **Labels** render in 3D too, upper case unless the part has `cls: "keep-case"`.
- **Pulses**: `flow: { period, delay, size }`; `size` is the pulse's length in percent of the wire (default 6). Use one long wire rather than many short ones.
- **Springs and tweens** advance in small substeps, up to a quarter second per frame, so they keep up in slow frames and captures. Laps should still be pure functions of `t`.
- **Wires lie on the floor by default** (`k.wire` takes layer -1); a line in the air needs `layer: 0`. Detail and guide lines default to layer 0.
- **Glass solids do not light**: a block or cylinder with `role: "glass"` keeps its glass faces when `on` is set (only its outline turns). Swap in a lit twin with `hide` if a glass part must glow. Faces (`k.face`) with `role: "glass"` do light.
- **Flat faces cannot be dashed**; dash styling reaches outlines and creases only. For a dashed flat mark, use a ghost extrusion of near-zero depth.
- **The 3D view orbits the figure's mid-height** on the ray through the frame's centre, so the iso view matches the SVG and tall figures stay in frame when turned.
- **Checks** run headless Chrome with a throwaway profile per run and accept a written PNG even if Chrome exits with an error under load.

## Process

1. **Concept.** Read the chapter's promise in the outline (or the part's blurb). Write the `sentence`, the object, the lit parts and what the pointer does, in four lines. One figure, one idea.
2. **Build.** Write the file. Compose the rest pose first: an object with real features (a base plate, seams, a lamp, a rail), not plain blocks. 25 to 90 parts is the usual range.
3. **Check.** `node scripts/look.mjs src/figures/<slug>.js --times a,b,c,d` with four moments spread over the lap. Fix every FAIL; read every warn.
4. **Look.** Open `art/looks/<slug>-look.png` (add `--zoom` for the still at double size). Answer each item below with yes or no, and fix every no:
   - the still reads at 240px, in light and dark;
   - the lit parts mean what the sentence says, and nothing else glows;
   - nothing shows through a solid; no line is drawn twice; no crease is as bright as a silhouette;
   - each sampled moment is a readable composition, and the loop's event is visible;
   - the figure fits the frame with air around it.
5. **Hand over.** Report the sentence, the loop's beats (with times), what the pointer does, and anything not verified (for example, the 3D view not looked at).

## Light, dark and colors

Tokens live in `src/lib/iso/style.js`. Light faces are near white with grey lines; dark faces are near black with dim lines, and the glows carry the figure. The accents are the author's josoroma colors: magenta `#c92b60` and teal `#087fa9` (lifted to `#e8457c` and `#1aa6d8` on dark). Never set a color in a figure: choose a role or `on`.

## Files

- `src/lib/iso/core.js`: camera, geometry, the kit, helpers.
- `src/lib/iso/svg.js`: the SVG renderer, static and live.
- `src/lib/iso/webgl.js`: the 3D renderer (three.js), loaded only when a figure goes 3D.
- `src/lib/iso/runtime.js`: the animation loop (pauses off screen, respects reduced motion).
- `src/lib/iso/style.js`: tokens and classes for the site and for standalone files.
- `src/components/Figure.astro`: the figure on a page, with its plate, read-out and 3D buttons.
- `scripts/look.mjs`: checks and contact sheet. `scripts/export-art.mjs`: static SVGs. `scripts/build-logo.mjs`: the logo files.
