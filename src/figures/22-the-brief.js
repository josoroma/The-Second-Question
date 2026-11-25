// Chapter 22, The brief: a mold that fills wherever nobody closed it.
//
// Six cavities share one feed. A press at the end of the tray drives the fill
// in from below, and it rises in every cavity that is open. Four are stopped
// with plugs: what the brief decides. One is left open on purpose, with a
// collar set round it: the fill comes up to the collar, level, and stops.
// The last was left open by nobody: the fill comes up there too, past the rim
// and out of square, a dashed lump that nobody asked for. The press lets go,
// the fill sinks, the plug that was missing crosses from its stand and drops
// in. Pressed again, only the gap that was chosen fills.
//
// Light: magenta is the gap nobody chose, and then the plug that closes it;
// teal is the fill in the gap that was left on purpose. At rest only the fill
// in those two gaps glows.
//
// The pointer lifts the plug it is over, under pressure: that cavity fills at
// once. Let go and the plug drives it out.

import { breathe, clamp, cycle, easeIn, easeInOut, easeOut, figure, keys, smooth } from "../lib/iso/core.js"

const T = 9.6 // seconds per lap

// The tray: two rows of three cavities, the rows along y.
const CELL = 1.3 // a cavity's inside
const DIV = 0.18
const PITCH = CELL + DIV
const WALL = 0.22
const FLOOR = 0.06
const RIM = 0.82 // the top of the partitions
const LIP = RIM + 0.1 // the top of the outer wall
const cx = (r) => (r - 0.5) * PITCH
const cy = (c) => (c - 1) * PITCH
const HX = PITCH / 2 + CELL / 2 + WALL
const HY = PITCH + CELL / 2 + WALL
const CELLS = []
for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) CELLS.push({ r, c, id: `${r}${c}` })
const CHOSEN = "01"
const MISSED = "12"
// A plug is the cavity's size, less a hair, and stands proud of the rim.
const PLUG = CELL - 0.08
const PLUG_H = RIM + 0.16 - FLOOR
const LUMP = 0.58 // how high the lump stands over the rim
const RAISE = 1.3 // how high the pointer lifts one

// The press.
const PY = -3.48
const PR = 0.8 // half the tank
const TANK = 1.3
const STROKE = 0.8
// The stand the missing plug waits on.
const SX = cx(1)
const SY = 3.36
const GROUND = -0.22 // the base's top; the plinth's top is 0
const STAND = 0.14 + GROUND
const OVER = 1.2 // how high it crosses

// The lap, in seconds.
const DOWN1 = 0.45
const FULL1 = 1.7
const UP1 = 3.0
const CLEAR = 3.8
const MOVE0 = 3.9
const SET = 5.1
const DOWN2 = 5.25
const FULL2 = 6.3
const UP2 = 8.0
const OUT = 8.4
const PARK = 9.4

/** The loop: how far the press is down, and where the missing plug is (0 stand, 1 set). */
function loopAt(lt) {
  const press = keys(lt, [
    [0, 0],
    [DOWN1, 0],
    [FULL1, 1, easeInOut],
    [UP1, 1],
    [CLEAR, 0, easeInOut],
    [DOWN2, 0],
    [FULL2, 1, easeInOut],
    [UP2, 1],
    [UP2 + 0.8, 0, easeInOut],
    [T, 0],
  ])
  const set = keys(lt, [
    [0, 0],
    [MOVE0, 0],
    [SET, 1, (u) => u],
    [OUT, 1],
    [PARK, 0, (u) => u],
    [T, 0],
  ])
  return { press, set }
}

/** The missing plug's way: up from the stand, across, down into its cavity. */
const way = (u) => ({
  y: easeInOut(clamp((u - 0.2) / 0.52)),
  z: u < 0.5 ? easeOut(clamp(u / 0.32)) : 1 - easeIn(clamp((u - 0.64) / 0.36)),
})

export default figure({
  slug: "22-the-brief",
  title: "The gap nobody chose",
  desc: "A press has driven the fill up into a tray of six cavities. Four are closed by plugs. One, left open with a collar set round it, has filled level and glows teal. The last, left open by nobody, has filled too and gone over its rim in a dashed magenta lump. The plug that would have closed it stands in front, on its stand.",
  plate: "The brief",
  sentence:
    "The viewer sees a press fill every open cavity in a tray, level where a collar was set and out of shape where nobody closed the gap, until the missing plug drops in, which explains why a brief has to choose its gaps: whatever it leaves open gets filled.",
  view: { scale: 37, origin: [284, 234] },
  still: 2.6,
  build(k) {
    k.grid("board", { at: [-3.5, -5.6, -0.52], size: [7, 11.2], step: 0.7 })
    k.block("base", { at: [-2.1, -4.66, GROUND - 0.3], size: [4.2, 9.06, 0.3], r: 0.4, layer: -3 })
    ;[
      [-1.86, -4.42],
      [1.86, -4.42],
      [-1.86, 4.16],
      [1.86, 4.16],
    ].forEach(([x, y], i) => k.led(`screw${i}`, { at: [x, y, GROUND + 0.002], face: "+z", r: 0.07, layer: -2 }))
    k.halo("spill", { at: [cx(1) + 0.9, cy(2) + 0.6, GROUND + 0.003], r: 1.5, on: 1, layer: -1 })

    // The press: a square tank with a plunger in it, and the feed to the tray.
    const ell = (x0, y0, x1, y1, w, back) =>
      back
        ? [[x0, y0], [x1 - w, y0], [x1 - w, y0 + w], [x0 + w, y0 + w], [x0 + w, y1 - w], [x0, y1 - w]]
        : [[x1, y0], [x1, y1], [x0, y1], [x0, y1 - w], [x1 - w, y1 - w], [x1 - w, y0]]
    const flat = (pts) => pts.map(([a, b]) => [a, -b])
    // One hollow plinth feeds them all.
    const o = 0.14
    k.extrude("plinth", {
      at: [0, 0, 0],
      shape: flat([
        [-PR - o, PY - PR - o],
        [PR + o, PY - PR - o],
        [PR + o, -HY - o],
        [HX + o, -HY - o],
        [HX + o, HY + o],
        [-HX - o, HY + o],
        [-HX - o, -HY - o],
        [-PR - o, -HY - o],
      ]),
      face: "+z",
      depth: -GROUND,
      layer: -1.2,
    })
    k.extrude("tankB", { at: [0, 0, TANK], shape: flat(ell(-PR, PY - PR, PR, PY + PR, 0.2, true)), face: "+z", depth: TANK, layer: -0.9 })
    k.group("ram", { at: [0, PY, 0] })
    const pr = PR - 0.22
    k.block("ram", { at: [-pr, -pr, 0.94], size: [2 * pr, 2 * pr, 0.74], r: 0.06, parent: "ram", layer: -0.8 })
    k.cyl("stem", { at: [0, 0, 1.68], radius: 0.16, h: 0.34, n: 28, parent: "ram", layer: -0.79 })
    k.cyl("pad", { at: [0, 0, 2.02], radius: 0.46, h: 0.14, n: 40, parent: "ram", layer: -0.78 })
    k.extrude("tankF", { at: [0, 0, TANK], shape: flat(ell(-PR, PY - PR, PR, PY + PR, 0.2, false)), face: "+z", depth: TANK, layer: -0.7 })

    // The tray.
    k.extrude("trayB", { at: [0, 0, LIP], shape: flat(ell(-HX, -HY, HX, HY, WALL, true)), face: "+z", depth: LIP, layer: -0.2 })
    for (const { r, c, id } of CELLS) {
      k.face(`floor${id}`, {
        at: [cx(r), cy(c), FLOOR],
        pts: [
          [-CELL / 2, -CELL / 2, 0],
          [CELL / 2, -CELL / 2, 0],
          [CELL / 2, CELL / 2, 0],
          [-CELL / 2, CELL / 2, 0],
        ],
        role: "recess",
        layer: -0.4,
      })
      const L = r * 10 + c * 2
      const f = CELL - 0.03
      k.block(`fill${id}`, {
        at: [cx(r) - f / 2, cy(c) - f / 2, FLOOR],
        size: [f, f, 0.1],
        r: 0.02,
        role: id === MISSED ? "accent" : "accent2",
        layer: L + 0.2,
      })
      if (id !== CHOSEN) {
        k.group(`p${id}`, { at: [cx(r), cy(c), FLOOR] })
        k.block(`plug${id}`, { at: [-PLUG / 2, -PLUG / 2, 0], size: [PLUG, PLUG, PLUG_H], r: 0.14, parent: `p${id}`, layer: L + 0.4 })
        k.cyl(`knob${id}`, { at: [0, 0, PLUG_H], radius: 0.2, h: 0.16, n: 32, parent: `p${id}`, layer: L + 0.42 })
      }
      // The partition toward the next cavity along the row.
      if (c < 2) k.block(`div${id}`, { at: [cx(r) - CELL / 2, cy(c) + CELL / 2, 0], size: [CELL, DIV, RIM], r: 0.01, layer: L + 1 })
    }
    k.block("mid", { at: [-DIV / 2, -HY + WALL, 0], size: [DIV, 2 * (HY - WALL), RIM], r: 0.01, layer: 8 })
    k.extrude("trayF", { at: [0, 0, LIP], shape: flat(ell(-HX, -HY, HX, HY, WALL, false)), face: "+z", depth: LIP, layer: 19 })

    // The collar round the gap left on purpose.
    const [gx, gy] = [cx(0), cy(1)]
    const e = CELL / 2
    const CT = RIM + 0.34
    k.block("collarL", { at: [gx - e - 0.13, gy - e - DIV, LIP], size: [0.13, CELL + 2 * DIV, CT - LIP], r: 0.03, layer: 1.4 })
    k.block("collarB", { at: [gx - e, gy - e - DIV + 0.02, RIM], size: [CELL, DIV - 0.02, CT - RIM], r: 0.03, layer: 1.5 })
    k.block("collarF", { at: [gx - e, gy + e, RIM], size: [CELL, DIV - 0.02, CT - RIM], r: 0.03, layer: 3.5 })
    k.block("collarR", { at: [gx + e, gy - e - DIV + 0.02, RIM], size: [DIV - 0.02, CELL + 2 * DIV - 0.04, CT - RIM], r: 0.03, layer: 8.5 })

    // The lump nobody asked for, and the stand the missing plug waits on.
    const blob = [[-0.8, -0.28], [-0.5, -0.84], [0.3, -0.64], [0.86, -0.74], [0.7, 0.1], [0.9, 0.62], [0.1, 0.82], [-0.5, 0.62]]
    k.extrude("lump", { at: [cx(1), cy(2), RIM + LUMP], shape: flat(blob), face: "+z", depth: LUMP - 0.02, role: "ghost", on: 1, layer: 21 })
    k.block("stand", { at: [SX - 0.8, SY - 0.8, GROUND], size: [1.6, 1.6, STAND - GROUND], r: 0.2, layer: 22 })
    k.halo("glowT", { at: [gx, gy, CT], r: 1.05, on: 2, layer: 8.7 })
  },
  tick(t, s, input) {
    const { p, groups } = s
    const lt = cycle(t, T) * T
    const L = loopAt(lt)

    // The pointer lifts the plug of the cavity it is over: six fixed places on the rim's plane.
    const at = input.onPlane ? input.onPlane(RIM + 0.2) : null
    let over = null
    let on = false
    if (at) {
      on = Math.abs(at[0]) < HX + 0.4 && Math.abs(at[1]) < HY + 0.4
      for (const { r, c, id } of CELLS) if (Math.abs(at[0] - cx(r)) < PITCH / 2 - 0.02 && Math.abs(at[1] - cy(c)) < PITCH / 2 - 0.02) over = id
    }
    const m = input.tween("ptr", on ? 1 : 0, { dur: 0.6 })
    const press = L.press + (1 - L.press) * m
    const set = L.set + (1 - L.set) * m

    // The press.
    groups.ram.off[2] = -STROKE * press

    // Each cavity: how far its plug is out, and so how far it fills.
    const w = way(set)
    const b = input.still ? 0.5 : breathe(t, 2.6)
    let wrong = 0
    for (const { id } of CELLS) {
      const lift = input.tween(`lift${id}`, over === id ? 1 : 0, { dur: 0.55 })
      let open = id === CHOSEN ? 1 : lift
      if (id !== CHOSEN) groups[`p${id}`].off[2] = (id === MISSED ? RAISE + 0.36 : RAISE) * lift
      if (id === MISSED) {
        const g = groups[`p${id}`]
        g.off[1] = (1 - w.y) * (SY - cy(2))
        g.off[2] += w.z * OVER + (1 - w.y) * (STAND - FLOOR)
        open = Math.max(open, 1 - set)
        // On its way across it is painted over everything it passes.
        if (w.y < 0.999) {
          p[`plug${id}`].layer = 30
          p[`knob${id}`].layer = 31
        }
      }
      const level = press * smooth(clamp(open * 1.6 - 0.3))
      if (id === MISSED) wrong = level
      const f = p[`fill${id}`]
      f.off[2] = level * (RIM - 0.1 - FLOOR)
      f.hide = level < 0.03
      f.fade = clamp(level * 6)
    }

    // The gap left on purpose fills level and glows; the one nobody chose goes over.
    p[`fill${CHOSEN}`].glow = 0.2 * press
    p.glowT.glow = 0.9 * smooth(clamp((press - 0.5) / 0.5))
    const rise = smooth(clamp((wrong - 0.55) / 0.45))
    p.lump.hide = rise < 0.02
    p.lump.fade = clamp(rise * 1.5)
    p.lump.off[2] = -0.5 * (1 - rise)
    p.lump.glow = rise * (0.16 + 0.08 * b)
    p[`fill${MISSED}`].glow = 0.3 * rise

    const seated = set > 0.995 ? 1 : 0
    const hold = seated * press * (over === MISSED ? 0 : 1)
    p[`plug${MISSED}`].on = p[`knob${MISSED}`].on = set > 0.02 ? 1 : 0
    p[`plug${MISSED}`].glow = hold * (0.3 + 0.1 * b)
    p.spill.glow = 0.75 * hold

    s.state = over === CHOSEN ? "left open" : over ? "fills" : rise > 0.4 ? "nobody chose" : press > 0.9 && seated ? "as chosen" : set > 0.02 && !seated ? (lt > UP2 && !on ? "lifted out" : "setting") : press > 0.05 ? "pressing" : "rest"
  },
  readout: (s) => s.state || "rest",
})
