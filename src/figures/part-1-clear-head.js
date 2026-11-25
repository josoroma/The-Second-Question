// Part I · Clear head: one vague whole, five checkable parts, one point.
// A plain square block with soft corners (everything you could say) sits on a
// base plate. Dashed cuts show where it divides; it comes apart into five
// crisp parts that keep their shared edges and the same width: four bars in a
// pinwheel around a centre. Each bar lights a small teal lamp once it can be
// checked; after the fourth check the centre, the point, lights and rises,
// still held by its slot. Dashed brackets on the base hold the width and depth
// of the whole, before and after: nothing is added, it is only divided and
// the point found.

import { breathe, clamp, cycle, easeInOut, easeOut, figure, keys, lerp, smooth } from "../lib/iso/core.js"

const C = 1.5 // one cell: the block is three cells wide
const W = 3 * C // the width of the whole, before and after
const H = 1.5 // the block's height (so the centre is a cube)
const g = 0.06 // half the seam between parts
const UP = 1.05 // how far the point rises: proud of the top, still held by its slot
const LIFT = 0.5 // how far the part under the pointer lifts
const M = 1.3 // the base plate's margin around the block
const T = 9 // seconds per lap
const FOUND = 0.345 // where in the lap the point is found: just after the fourth check
const EPS = 0.02 // below this much pointer the parts close back into the whole
const LAND = 0.06 // the point goes dark this close to flush, before the parts close

// Rest footprints [x0, y0, x1, y1]: four bars in a pinwheel around a centre.
// Outer edges sit exactly on the whole's edges; only the seams are inside.
const FOOT = {
  a: [0, 0, 2 * C - g, C - g],
  b: [2 * C + g, 0, W, 2 * C - g],
  c: [C + g, 2 * C + g, W, W],
  d: [0, C + g, C - g, W],
  e: [C + g, C + g, 2 * C - g, 2 * C - g],
}
const BARS = ["a", "b", "c", "d"]
// Each bar's lamp sits by its outer edge, near the end that meets the next
// bar (clear of the risen point at the iso angle); they light in this order.
const LAMP = {
  a: [2 * C - g - 0.6, 0.36],
  b: [W - 0.36, 2 * C - g - 0.6],
  c: [C + g + 0.6, W - 0.36],
  d: [0.36, C + g + 0.6],
}
// Painter's nudges: the near bars (b, c) go after the centre in its slot.
const BIAS = { a: 0, b: 1.5, c: 1.5, d: 0 }
// The read-out names the part under the pointer: the moves of Part I.
const NAME = { a: "for whom", b: "shape", c: "exact word", d: "how sure", e: "the point" }
const CUTS = ["cutA", "cutB", "cutC", "cutD", "cutAv", "cutDv"]

const mid = (f) => [(f[0] + f[2]) / 2, (f[1] + f[3]) / 2]
const dist = (i, j) => {
  const [ax, ay] = mid(FOOT[i])
  const [bx, by] = mid(FOOT[j])
  return Math.hypot(ax - bx, ay - by)
}
/** A soft 0..1..0 bump that starts at t0 and lasts w (fractions of the lap). */
const bump = (x, t0, w) => (x > t0 && x < t0 + w ? Math.sin((Math.PI * (x - t0)) / w) : 0)
const linear = (x) => x

/**
 * The pointer as a ray through two fixed planes, tested against the rest
 * pose (bars in place, the point risen): which part is nearest the eye.
 */
function aim(input) {
  const q0 = input.onPlane ? input.onPlane(0) : null
  const q1 = q0 ? input.onPlane(1) : null
  if (!q0 || !q1) return { over: false, chosen: null }
  const dx = q1[0] - q0[0]
  const dy = q1[1] - q0[1]
  const span = (p, d, a, b) => {
    if (Math.abs(d) < 1e-9) return p >= a && p <= b ? [-Infinity, Infinity] : null
    const u = (a - p) / d
    const v = (b - p) / d
    return u < v ? [u, v] : [v, u]
  }
  let best = -Infinity
  let chosen = null
  const test = (id, f, z0, z1) => {
    const sx = span(q0[0], dx, f[0], f[2])
    const sy = span(q0[1], dy, f[1], f[3])
    if (!sx || !sy) return
    const lo = Math.max(sx[0], sy[0], z0)
    const hi = Math.min(sx[1], sy[1], z1)
    // Toward the eye is up: the highest entry point is the one in front.
    if (lo <= hi && hi > best) {
      best = hi
      chosen = id
    }
  }
  for (const id of BARS) test(id, FOOT[id], 0, H)
  test("e", FOOT.e, UP, UP + H)
  const onBase = q0[0] > -M && q0[0] < W + M && q0[1] > -M && q0[1] < W + M
  return { over: onBase || chosen !== null, chosen }
}

export default figure({
  slug: "part-1-clear-head",
  title: "One vague whole, five checkable parts, one point",
  desc: "A soft-cornered square block on a base plate divides along dashed seams into five crisp parts: four bars in a pinwheel around a centre cube. The parts still share their edges and fill the same width, held by dashed brackets on the base. Each bar shows a small teal lamp; the centre, the point, stands raised in its slot and glows magenta.",
  plate: "Part I · Clear head",
  sentence:
    "The viewer sees one plain block divide along its seams into five parts that keep their shared edges and the same width while the middle part lights and rises, which explains what a clear head does before it speaks: it divides everything it could say into parts it can check and finds the one that is the point.",
  view: { scale: 35, origin: [280, 141] },
  still: 0.62 * T,
  build(k) {
    k.grid("board", { at: [W / 2 - 6, W / 2 - 6, -0.32], size: [12, 12], step: 0.7 })
    k.block("base", { at: [-M, -M, -0.32], size: [W + 2 * M, W + 2 * M, 0.32], r: 0.45, layer: -3 })
    // Four screws hold the plate.
    const s = M - 0.38
    ;[
      [-s, -s],
      [W + s, -s],
      [W + s, W + s],
      [-s, W + s],
    ].forEach(([x, y], i) => k.led(`screw${i}`, { at: [x, y, 0], r: 0.075, face: "+z", layer: -2 }))
    // The width of the whole, on the base: a dashed bracket from corner to corner.
    const yb = W + 0.72
    k.guide("width", {
      pts: [
        [0, W + 0.18, 0],
        [0, yb, 0],
        [W, yb, 0],
        [W, W + 0.18, 0],
      ],
      layer: -2,
    })
    // and its depth, on the right side
    k.guide("depth", {
      pts: [
        [W + 0.18, 0, 0],
        [yb, 0, 0],
        [yb, W, 0],
        [W + 0.18, W, 0],
      ],
      layer: -2,
    })
    // End marks: a short 45-degree slash across each bracket corner. The two
    // at the front run across the view, so they are drawn shorter to match.
    const slash = (id, x, y, sy, q) => k.detail(id, { pts: [[x - q, y - sy * q, 0], [x + q, y + sy * q, 0]], layer: -2 })
    slash("tick0", 0, yb, 1, 0.11)
    slash("tick1", W, yb, -1, 0.065)
    slash("tick2", yb, 0, 1, 0.11)
    slash("tick3", yb, W, -1, 0.065)

    // The whole: one plain block with soft corners, and the cuts that will divide it.
    k.group("w", { at: [0, 0, 0] })
    k.block("whole", { at: [0, 0, 0], size: [W, W, H], r: 0.6, parent: "w" })
    k.guide("cutA", { pts: [[2 * C, 0, H], [2 * C, 2 * C, H]], parent: "w", bias: 3 })
    k.guide("cutB", { pts: [[W, 2 * C, 0], [W, 2 * C, H], [C, 2 * C, H]], parent: "w", bias: 3 })
    k.guide("cutC", { pts: [[C, W, 0], [C, W, H], [C, C, H]], parent: "w", bias: 3 })
    k.guide("cutD", { pts: [[0, C, H], [2 * C, C, H]], parent: "w", bias: 3 })
    // the same cuts down the far sides (hidden at the iso angle, there in 3D)
    k.guide("cutAv", { pts: [[2 * C, 0, H], [2 * C, 0, 0]], parent: "w" })
    k.guide("cutDv", { pts: [[0, C, H], [0, C, 0]], parent: "w" })

    // The five parts, crisp-cornered. Bars carry their lamps in a group, so
    // they lift together. A lamp is a socket and a teal lens over it that
    // lights (and fades) when the part is checked.
    for (const id of BARS) {
      const [x0, y0, x1, y1] = FOOT[id]
      const [lx, ly] = LAMP[id]
      k.group(id, { at: [0, 0, 0] })
      k.block(`${id}Bar`, { at: [x0, y0, 0], size: [x1 - x0, y1 - y0, H], r: 0.12, parent: id, bias: BIAS[id] })
      k.led(`${id}Lamp`, { at: [lx, ly, H], r: 0.14, face: "+z", parent: id, bias: BIAS[id] + 1 })
      k.led(`${id}Lens`, { at: [lx, ly, H + 0.006], r: 0.15, face: "+z", on: 2, hide: true, parent: id, bias: BIAS[id] + 1.1 })
    }
    // Light from the point, spilled on the block's top around its slot.
    k.halo("spill", { at: [W / 2, W / 2, H], r: 1.9, on: 1, layer: 0, bias: 3.5 })
    // The point. It never leaves its slot (it rises at most 1.35 of 1.5), so
    // it always paints after the far bars (a, d) and before the near ones (b, c).
    const [ex0, ey0, ex1, ey1] = FOOT.e
    k.block("point", { at: [ex0, ey0, 0], size: [ex1 - ex0, ey1 - ey0, H], r: 0.12 })
  },
  tick(t, s, input) {
    const { p, groups } = s
    const lap = cycle(t, T)
    const SPLIT = 0.2
    const CLOSE = 0.9
    const split = lap >= SPLIT && lap < CLOSE

    // The lap: dashed cuts appear on the whole; it gives a small hop and lands
    // as five parts; each bar is released and checked in turn (a, b, c, d);
    // after the fourth check the point lights, rises and holds; it sinks back,
    // the bars settle in reverse order as their lamps dim out, and the whole
    // closes again.
    const cuts = keys(lap, [
      [0, 0],
      [0.08, 0],
      [0.17, 1],
      [0.91, 1],
      [0.98, 0],
    ])
    const hop = keys(lap, [
      [0, 0],
      [0.168, 0],
      [0.187, 0.13, easeOut],
      [0.2, 0, easeInOut],
      [1, 0],
    ])
    const loopLift = {}
    const check = {}
    const flash = {}
    BARS.forEach((id, i) => {
      const t0 = SPLIT + 0.004 + i * 0.032
      const t1 = 0.826 + (3 - i) * 0.011
      loopLift[id] = 0.26 * bump(lap, t0, 0.075) + 0.13 * bump(lap, t1, 0.04)
      // The check lights the lamp at the top of the bar's lift (d at 0.337);
      // the lamp dims out over 0.1 s as the bar settles back.
      check[id] = lap >= t0 + 0.037 ? 1 - clamp((lap - t1 - 0.02) / 0.012) : 0
      flash[id] = bump(lap, t0 + 0.03, 0.08)
    })
    const lit = lap >= FOUND && lap < 0.823
    const found = bump(lap, FOUND, 0.12)
    const rise = keys(lap, [
      [0, 0],
      [FOUND + 0.02, 0],
      [FOUND + 0.12, UP + 0.14, easeOut],
      [FOUND + 0.17, UP, easeInOut],
      [0.74, UP],
      [0.82, 0, easeInOut],
      [1, 0],
    ])

    // The pointer lifts the part it is on, its neighbours less by distance.
    const { over, chosen } = aim(input)
    const m = input.tween("ptr", over ? 1 : 0)
    // When the pointer leaves, the parts close along dashed cuts that then
    // fade, as they do at the end of the lap.
    const after = input.tween("after", over ? 1 : 0, { dur: over ? 0.25 : 1.3, ease: linear })
    const ptr = {}
    for (const id of [...BARS, "e"]) {
      const d = chosen ? dist(id, chosen) : 0
      const target = chosen ? (id === chosen ? LIFT : LIFT * Math.pow(clamp(1 - d / 4), 1.5)) : 0
      ptr[id] = input.tween(`lift-${id}`, target, { dur: 0.45 + 0.12 * d })
    }

    const parts = split || m > EPS
    p.whole.hide = parts
    groups.w.off[2] = hop
    const seams = Math.max(cuts, smooth(clamp(2 * after)))
    for (const id of CUTS) {
      p[id].hide = parts || seams < 0.01
      p[id].fade = seams
    }
    for (const id of BARS) {
      groups[id].off[2] = lerp(loopLift[id], ptr[id], m)
      p[`${id}Bar`].hide = p[`${id}Lamp`].hide = !parts
      // Lit by the loop's check, or by the pointer and fading with it. The
      // check's flash belongs to the loop: it never fires while the pointer holds.
      const level = Math.max(check[id], m)
      const lens = p[`${id}Lens`]
      lens.hide = !parts || level < 0.01
      lens.fade = level
      lens.glow = level * Math.min(1, 0.4 + 0.45 * flash[id] * (1 - m) + (chosen === id ? 0.4 * m : 0))
    }

    // The point: lit by the loop once found, or by the pointer while it is
    // raised; it goes dark as it lands, as at the end of the lap.
    const L = lerp(rise, UP + 0.6 * ptr.e, m)
    const on = lit || (m > EPS && L > LAND)
    const pt = p.point
    pt.hide = !parts
    pt.off[2] = L
    pt.on = on ? 1 : 0
    const rest = input.still ? 0.42 : 0.3 + 0.16 * breathe(t, 2.4)
    pt.glow = on ? Math.min(1, (lit ? 1 : m) * rest + 0.4 * found * (1 - m) + (chosen === "e" ? 0.25 * m : 0)) : 0
    p.spill.glow = on ? 0.9 * clamp(L / UP) : 0

    s.state =
      m > 0.5
        ? chosen
          ? NAME[chosen]
          : "five parts"
        : !parts
          ? seams > 0.05
            ? "seams"
            : "whole"
          : lit
            ? "the point"
            : "five parts"
  },
  readout: (s) => s.state || "rest",
})
