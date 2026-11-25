// Chapter 28, Arguing well: the stand they both bring.
//
// Two rams face each other on one bed with the claim between them. Each pushes
// it from its own end, as hard as the other, and it only shivers. Then both
// draw back, the claim is lifted out of the way on a drop tower, and the same
// two pushes meet each other instead: each head is half of a round stand, and
// they close into one. The claim is let fall on it, and it settles.
//
// Neither half is a stand. Together they are the one place the claim can land,
// and neither side had to give up its push to bring it.
//
// Light: teal is the stand, the test, from the moment its halves meet.
// Magenta is the claim once it has landed there. While they push, nothing is
// lit.
//
// The pointer takes a side: on either ram it pushes the claim from that end,
// which moves a hair and no more. Over the middle it lifts the claim out, and
// the halves meet.

import { arc, breathe, clamp, cycle, easeIn, easeInOut, easeOut, figure, keys, lerp, ring, smooth } from "../lib/iso/core.js"

const T = 10 // seconds per lap
const R = 1.3 // the stand's radius
const RD = 1.16 // the drum under its top
const FLOOR = 0.1 // the rails' top: what the heads slide on
const TOP = 0.86 // the stand's top
const PLATE = 0.15
const C = 0.9 // the claim's side
const HOLD = C / 2 // half the gap while the claim is between them
const BACK = 0.76 // ...when both have drawn back
const LIFT = 2.3 // how high the claim is taken
const SETTLE = TOP - FLOOR // where it lands
const END = 4.35 // the far end of a ram's housing
const FACE = 3.1 // and the face its rod comes out of
const TAIL = 2.2 // the back of a head
const ROD = 0.19
const ROD_Z = 0.4

const SEAM = 0.022 // half the line left between the two tops
const EAR = 0.2 // how far a top reaches past the rim at each end of the seam
const EAR_W = 0.3

const half = (r, side) => arc(0, 0, r, side < 0 ? 90 : -90, side < 0 ? 270 : 90, 28)
/** Half of the top, with an ear at each end of its straight side. */
const halfTop = (side) => {
  const d = (Math.asin(EAR_W / R) * 180) / Math.PI
  const y = R + EAR
  return [
    [-SEAM, y],
    [-EAR_W, y],
    ...arc(0, 0, R, 90 + d, 270 - d, 28),
    [-EAR_W, -y],
    [-SEAM, -y],
  ].map(([px, py]) => [-side * px, py])
}

/** The pose from one number: 0 both pushing, 1 settled. */
const gapAt = (q) => keys(q, [[0, HOLD], [0.12, BACK, easeInOut], [0.36, BACK], [0.6, 0, easeInOut], [1, 0]])
const liftAt = (q) =>
  keys(q, [[0, 0], [0.14, 0], [0.38, LIFT, easeInOut], [0.69, LIFT], [0.8, SETTLE, easeIn], [0.84, SETTLE + 0.07, easeOut], [0.88, SETTLE, easeIn], [1, SETTLE]])

// The lap, in seconds.
const GO = 2.5 // they stop pushing
const DONE = 6.1
const AWAY = 8.0
const even = (u) => u
const loopQ = (lt) =>
  keys(lt, [[0, 0], [GO, 0], [DONE, 1, even], [AWAY, 1], [AWAY + 0.06, 0.88, even], [AWAY + 0.56, 0.69, even], [AWAY + 0.7, 0.6, even], [T - 0.1, 0, even], [T, 0]])

export default figure({
  slug: "28-arguing-well",
  title: "The stand they both bring",
  desc: "Two rams face each other on one bed. Their heads are the two halves of a round stand, and they have met under a drop tower: the closed top glows teal. The claim, a cube they had been pushing between them, has been let fall onto the seam and glows magenta where it settled.",
  plate: "Arguing well",
  sentence:
    "The viewer sees two rams push one claim from opposite ends until it only shivers, then close the two halves of one stand for it to fall on and settle, which explains why to agree the test first: what would settle it is the part both sides can bring.",
  view: { scale: 36.5, origin: [273, 255] },
  still: 6.9,
  build(k) {
    k.grid("board", { at: [-5.6, -4.2, -0.3], size: [11.2, 8.4], step: 0.7 })
    k.block("base", { at: [-4.65, -2.35, -0.3], size: [9.3, 4.05, 0.3], r: 0.45, layer: -3 })
    ;[
      [-4.36, -2.06],
      [4.36, -2.06],
      [-4.36, 1.42],
      [4.36, 1.42],
    ].forEach(([x, y], i) => k.led(`screw${i}`, { at: [x, y, 0.002], face: "+z", r: 0.08, layer: -2 }))
    // Where the closed stand will be.
    k.guide("plan", { pts: ring(0, 0, R + 0.14, 48).concat([[R + 0.14, 0]]).map(([x, y]) => [x, y, 0.002]), layer: -2 })
    k.halo("spill", { at: [0.1, 0.1, 0.003], r: 2.3, on: 2, layer: -1 })
    for (const [i, y] of [-0.46, 0.34].entries()) k.block(`rail${i}`, { at: [-FACE, y, 0], size: [2 * FACE, 0.12, FLOOR], r: 0.03, layer: -0.5 })

    // The drop tower, behind.
    k.block("foot", { at: [-0.62, -2.2, 0], size: [1.24, 0.72, 0.16], r: 0.12, layer: 0.5 })
    k.block("mast", { at: [-0.3, -2.06, 0.16], size: [0.6, 0.44, 4.3], r: 0.06, layer: 0.6 })
    const ticks = []
    for (let i = 0; i <= 16; i++) {
      const z = 0.9 + i * 0.22
      ticks.push([0.303, -1.64, z], [0.303, i % 4 === 0 ? -1.86 : -1.75, z], [0.303, -1.64, z])
    }
    k.detail("scale", { pts: ticks, layer: 0.61 })
    k.block("cap", { at: [-0.42, -2.16, 4.46], size: [0.84, 0.64, 0.2], r: 0.1, layer: 0.62 })

    // Left: a fixed rod that its head slides on.
    k.block("houseL", { at: [-END, -0.8, 0], size: [END - FACE, 1.6, 1.16], r: 0.22, layer: 1 })
    k.extrude("flangeL", { at: [-FACE + 0.12, 0, ROD_Z], shape: ring(0, 0, 0.36, 32), face: "+x", depth: 0.14, layer: 1.01 })
    k.extrude("rodL", { at: [-1.75, 0, ROD_Z], shape: ring(0, 0, ROD, 28), face: "+x", depth: FACE - 1.75, layer: 1.02 })
    // Right: a rod that its head pushes out of the housing.
    k.block("houseR", { at: [FACE, -0.8, 0], size: [END - FACE, 1.6, 1.16], r: 0.22, layer: 2.2 })
    for (const [n, x0] of [["L", -END + 0.3], ["R", FACE + 0.3]]) {
      for (let i = 0; i < 4; i++) {
        const z = 0.42 + i * 0.14
        k.detail(`vent${n}${i}`, { pts: [[x0, 0.803, z], [x0 + 0.33, 0.803, z], [x0 + 0.66, 0.803, z]], layer: n === "L" ? 1.03 : 2.21 })
      }
      k.block(`lid${n}`, { at: [x0 - 0.1, -0.5, 1.16], size: [0.85, 1.0, 0.09], r: 0.16, layer: n === "L" ? 1.04 : 2.22 })
    }

    for (const [n, side] of [["L", -1], ["R", 1]]) {
      const L = side < 0 ? 1.2 : 1.6
      k.group(n, { at: [0, 0, 0] })
      // The shank behind the half drum, cut round to fit it.
      const a = (Math.asin(0.6 / (RD + 0.01)) * 180) / Math.PI
      const mid = side < 0 ? 180 : 0
      const inner = arc(0, 0, RD + 0.01, mid - a, mid + a, 14)
      const rc = 0.2
      const cx = side * (TAIL - rc)
      const cy = 0.6 - rc
      const end = side < 0 ? [...arc(cx, -cy, rc, 270, 180, 6), ...arc(cx, cy, rc, 180, 90, 6)] : [...arc(cx, cy, rc, 90, 0, 6), ...arc(cx, -cy, rc, 0, -90, 6)]
      const shank = [...inner, ...end]
      k.extrude(`shank${n}`, { at: [0, 0, 0.64], shape: shank.map(([x, y]) => [x, -y]), face: "+z", depth: 0.64 - FLOOR, parent: n, layer: L + (side < 0 ? 0 : 0.02) })
      k.extrude(`drum${n}`, { at: [0, 0, TOP - PLATE], shape: half(RD, side).map(([x, y]) => [x, -y]), face: "+z", depth: TOP - PLATE - FLOOR, parent: n, layer: L + 0.01, sharp: 40 })
      k.extrude(`plate${n}`, { at: [0, 0, TOP], shape: halfTop(side).map(([x, y]) => [x, -y]), face: "+z", depth: PLATE, parent: n, layer: L + 0.03, sharp: 40 })
      // The stand's scale, half on each head: it is one scale when they meet.
      const marks = []
      for (let i = 0; i <= 12; i++) {
        const t = ((side < 0 ? 97.5 : -82.5) + i * 13.75) * (Math.PI / 180)
        const p = (r) => [r * Math.cos(t), r * Math.sin(t), TOP + 0.003]
        marks.push(p(R - 0.08), p(R - (i % 3 === 1 ? 0.28 : 0.2)), p(R - 0.08))
      }
      k.detail(`marks${n}`, { pts: marks, parent: n, layer: L + 0.04 })
    }
    k.extrude("rodR", { at: [TAIL + 1.2, 0, ROD_Z], shape: ring(0, 0, ROD, 28), face: "+x", depth: 1.25, parent: "R", layer: 2.1 })

    // The claim, on the tower's carriage.
    k.halo("landed", { at: [0, 0, TOP + 0.004], r: 1.25, on: 1, layer: 1.7 })
    k.group("drop", { at: [0, 0, 0] })
    k.block("carriage", { at: [-0.5, -1.62, 1.14], size: [1.0, 0.3, 0.8], r: 0.08, parent: "drop", layer: 1.9 })
    k.block("arm", { at: [-0.2, -1.36, 1.36], size: [0.4, 1.66, 0.26], r: 0.1, parent: "drop", layer: 1.95 })
    k.cyl("grip", { at: [0, 0, FLOOR + C], radius: 0.2, h: 1.36 - FLOOR - C, n: 28, parent: "drop", layer: 1.94 })
    k.block("claim", { at: [-C / 2, -C / 2, FLOOR], size: [C, C, C], r: 0.1, parent: "drop", layer: 1.4 })
  },
  tick(t, s, input) {
    const { p, groups } = s
    const lt = cycle(t, T) * T
    const base = loopQ(lt)

    // The pointer takes a side, or the middle.
    const at = input.onPlane ? input.onPlane(TOP) : null
    const over = at && Math.abs(at[1]) < 2.1 && Math.abs(at[0]) < 5.2
    const agree = !!over && Math.abs(at[0]) < (s.agree ? 1.6 : 1.35)
    s.agree = agree
    if (input.still) s.q = over ? (agree ? 1 : 0) : base
    else if (over || s.q != null) {
      if (s.q == null) s.q = base
      const goal = over ? (agree ? 1 : 0) : base
      // Going back, the claim is lifted off the stand no faster than it was raised.
      const pace = goal > s.q ? 0.36 : s.q > 0.69 && s.q < 0.88 ? 0.42 : 0.62
      const step = (input.dt || 0) * (over ? pace : pace * 1.5)
      s.q += clamp(goal - s.q, -step, step)
    }
    const q = s.q ?? base
    // Let go: it catches up with the lap and follows it again.
    if (!input.still && !over && s.q != null && Math.abs(s.q - base) < 1e-4) s.q = null
    const m = input.still ? (over ? 1 : 0) : input.tween("ptr", over ? 1 : 0, { dur: 0.4 })

    // Both push: a hair one way, a hair the other, and a shiver. No more.
    const contact = 1 - smooth(clamp(q / 0.05))
    const wave = keys(lt, [[0, 0], [0.35, 0], [0.7, 0.085, easeOut], [1.15, -0.085, easeInOut], [1.55, 0.075, easeInOut], [1.95, -0.06, easeInOut], [2.3, 0.02, easeInOut], [GO, 0], [T, 0]])
    const side = over && !agree ? (at[0] < 0 ? 0.1 : -0.1) : 0
    const lean = lerp(wave, input.spring("lean", side, { k: 160, c: 17 }), m)
    const busy = Math.max(clamp(Math.abs(lean) / 0.05), over && !agree ? 1 : 0)
    const tug = contact * (lean + (input.still ? 0 : 0.011 * busy * Math.sin(t * 68)))

    const g = gapAt(q)
    groups.L.off[0] = -g + tug
    groups.R.off[0] = g + tug
    groups.drop.off[0] = tug
    const z = liftAt(q)
    groups.drop.off[2] = z
    // Between the halves it stands behind the near one; above them, in front of both.
    if (z > SETTLE - 0.02) p.claim.layer = 1.92

    // The stand lights when its halves meet; the claim when it has landed on it.
    const met = clamp((q - 0.595) / 0.03)
    const down = clamp((q - 0.8) / 0.04)
    const b = input.still ? 0.5 : breathe(t, 2.8)
    for (const n of ["L", "R"]) {
      p[`plate${n}`].on = met > 0.5 ? 2 : 0
      p[`plate${n}`].glow = 0.13 * met
      p[`marks${n}`].on = met > 0.5 ? 2 : 0
    }
    p.spill.glow = 0.6 * met
    p.claim.on = down > 0.5 ? 1 : 0
    p.claim.glow = down * (0.42 + 0.14 * b)
    p.landed.glow = 0.9 * down

    s.state = down > 0.5 ? "settled" : met > 0.5 ? "one stand" : q > 0.13 ? "lifted" : busy > 0.3 && contact > 0.5 ? "pushing" : "stuck"
  },
  readout: (s) => s.state || "rest",
})
