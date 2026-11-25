// Chapter 10, Steady under pressure: the limit, set before the push.
//
// A two-column press. Under its platen stands the claim, a bellows that holds
// its height only while nothing drives it down. The first push comes with
// nothing set: the platen rides down the columns and squeezes the claim to
// half its size. It lifts, the claim springs back, and while nothing pushes
// two split collars climb the columns, stop level with the claim and lock.
// Then the same push comes, twice. The platen's sleeves land on the collars
// and stop there: the claim keeps its size, because how far the push may go
// was decided before it came.
//
// Light: magenta is the claim (the point); teal is the limit, the two collars,
// from the moment they lock. At rest only those glow.
//
// The pointer sets the limit: the collars go to the height under the pointer
// and the press leans on them, so the claim is left exactly the size that was
// decided. Let them drop and the push takes the rest.

import { arc, breathe, clamp, cycle, easeIn, easeInOut, easeOut, figure, keys, lerp, rrect } from "../lib/iso/core.js"

const T = 10 // seconds per lap

const CX = 2.0 // the columns stand at x = -CX and x = CX, on the plane y = 0
const RC = 0.17 // a column's radius
const RI = RC + 0.012 // the bore of a sleeve or a collar
const RO = 0.38 // and its outside
const BED = 0.36 // top of the bed
const CROWN = 4.15 // underside of the crown
const CROWN_H = 0.6
const CY = 0.62 // half the crown's depth
const CROWN_T = CROWN + CROWN_H

// The claim: a bellows of wide rings on narrower ones. Squeezed, the narrow
// rings disappear into the wide ones above them.
const N = 6
const DISC = 0.13 // a wide ring's thickness
const GAP = 0.15 // the narrow ring between two of them, at full size
const TIGHT = 0.02 // ...and squeezed
const RW = 0.8
const RN = 0.62
const ZA = BED + 0.12 // the claim stands on the anvil
const FULL = N * DISC + (N - 1) * GAP // its full size
const FLAT = N * DISC + (N - 1) * TIGHT // what a push leaves of it

// The platen: p is the height of its underside; a pad under it meets the claim.
const PAD = 0.3
const PH = 0.46
const PX = 1.3
const PY = 0.5
const AIR = 0.14 // the limit is set just over the claim: a hair of air stays between them
const P_TOUCH = ZA + FULL + PAD // the pad meets the claim
const P_SET = P_TOUCH + AIR // the sleeves meet the collars, set
const P_MIN = ZA + FLAT + PAD // the claim squeezed flat
const P_UP = P_SET + 0.7
const RAM = 2.0

// A collar: c is the height of its top, where a sleeve lands.
const CH = 0.42
const C_FOOT = BED + 0.1 + CH // parked at the foot of its column

// Paint order round a column: back halves, the column, its ticks, front halves.
const D_L = 0.2 // the left column's depth...
const D_R = 4.2 // ...and the right one's

const flat = (pts, z = 0) => pts.map(([x, y]) => [x, y, z])
const closed = (pts) => [...pts, pts[0]]

/** Half a ring about a column, as a flat shape: the half toward the viewer, or the half away. */
const half = (front) => {
  const [a, b] = front ? [-41, 139] : [139, 319]
  return [...arc(0, 0, RO, a, b, 24), ...arc(0, 0, RI, b, a, 18)].map(([x, y]) => [x, -y])
}
const FRONT = half(true)
const BACK = half(false)
const centroid = (shape) => shape.reduce((a, [u, v]) => a + u - v, 0) / shape.length // x + y of its middle

export default figure({
  slug: "10-steady-under-pressure",
  title: "The limit, set before the push",
  desc: "A two-column press stands on a base plate. Two split collars, lit teal, are locked on its columns, and the platen's sleeves have come down and stopped on them. Under the platen a ribbed cylinder, the claim, glows magenta and keeps its full height.",
  plate: "Steady under pressure",
  sentence:
    "The viewer sees a press squeeze the claim to half its size and then, once two collars are locked on its columns, come down the same way and stop on them with the claim still whole, which explains staying steady: the limit is decided while nobody is pushing, so when the push comes there is nothing left to decide.",
  view: { scale: 36, origin: [283, 303] },
  still: 6.9,
  build(k) {
    k.grid("board", { at: [-4.4, -3.2, -0.32], size: [8.8, 6.4], step: 0.7 })
    k.block("base", { at: [-3.2, -1.9, -0.32], size: [6.4, 3.8, 0.32], r: 0.45, layer: -3 })
    k.detail("lip", { pts: flat(closed(rrect(-2.98, -1.68, 2.98, 1.68, 0.3))), layer: -2 })
    ;[
      [2.72, -1.42],
      [-2.72, 1.42],
      [2.72, 1.42],
    ].forEach(([x, y], j) => k.led(`screw${j}`, { at: [x, y, 0], face: "+z", r: 0.08, layer: -2 }))

    // The bed, with a seam round it and a T-slot in each visible side.
    k.block("bed", { at: [-2.55, -1.1, 0], size: [5.1, 2.2, BED], r: 0.28, layer: -0.8 })
    k.detail("bedSeam", { pts: flat(closed(rrect(-2.4, -0.95, 2.4, 0.95, 0.2)), BED), layer: -0.7 })
    for (let j = 0; j < 2; j++) k.detail(`vent${j}`, { pts: [[-2.1, 1.1, 0.13 + j * 0.1], [-1.2, 1.1, 0.13 + j * 0.1]], layer: -0.7 })
    k.halo("spill", { at: [0, 0, BED], r: 1.75, on: 1, layer: -0.6 })
    k.cyl("anvil", { at: [0, 0, BED], radius: 1.0, h: ZA - BED, n: 64, layer: -0.5 })

    for (const [id, x, D] of [
      ["L", -CX, D_L],
      ["R", CX, D_R],
    ]) {
      k.cyl(`foot${id}`, { at: [x, 0, BED], radius: 0.34, h: 0.1, layer: -0.5 })
      const mid = (BED + CROWN) / 2
      k.cyl(`col${id}`, { at: [x, 0, BED], radius: RC, h: CROWN - BED, n: 32, bias: D - x - mid })
      // Graduations: every fifth of a unit, longer at the claim's full size.
      for (let j = 0; j < 8; j++) {
        const z = 1.0 + j * 0.2
        const pts = flat(arc(x, 0, RC, 10, 80, 6), z)
        const m = pts[3]
        k.detail(`tick${id}${j}`, { pts, bias: D + 0.02 - m[0] - m[1] - m[2] })
      }
      // The collar, two halves, parked at the foot.
      k.group(`c${id}`, { at: [x, 0, 0] })
      k.extrude(`cb${id}`, { at: [0, 0, C_FOOT], face: "+z", shape: BACK, depth: CH, parent: `c${id}` })
      k.extrude(`cf${id}`, { at: [0, 0, C_FOOT], face: "+z", shape: FRONT, depth: CH, parent: `c${id}` })
    }

    // The claim.
    for (let i = 0; i < N; i++) {
      k.cyl(`disc${i}`, { at: [0, 0, ZA + i * (DISC + GAP)], radius: RW, h: DISC, n: 56, role: "accent" })
      if (i < N - 1) k.cyl(`core${i}`, { at: [0, 0, ZA + i * (DISC + GAP) + DISC], radius: RN, h: GAP, n: 48, role: "accent" })
    }

    // The platen, on its sleeves.
    k.group("plt", { at: [0, 0, 0] })
    k.cyl("pad", { at: [0, 0, P_SET - PAD], radius: 0.46, h: PAD, n: 40, parent: "plt" })
    for (const [id, x] of [
      ["L", -CX],
      ["R", CX],
    ]) {
      k.extrude(`sb${id}`, { at: [x, 0, P_SET + PH], face: "+z", shape: BACK, depth: PH, parent: "plt" })
      k.extrude(`sf${id}`, { at: [x, 0, P_SET + PH], face: "+z", shape: FRONT, depth: PH, parent: "plt" })
    }
    k.block("armL", { at: [-CX + 0.34, -0.2, P_SET + 0.08], size: [0.5, 0.4, PH - 0.16], r: 0.05, parent: "plt" })
    k.block("armR", { at: [PX - 0.2, -0.2, P_SET + 0.08], size: [0.5, 0.4, PH - 0.16], r: 0.05, parent: "plt" })
    k.block("platen", { at: [-PX, -PY, P_SET], size: [2 * PX, 2 * PY, PH], r: 0.2, parent: "plt" })
    k.detail("pltSeam", { pts: [[-PX + 0.2, PY, P_SET + PH - 0.14], [0, PY, P_SET + PH - 0.14], [PX - 0.2, PY, P_SET + PH - 0.14]], parent: "plt", bias: 0.4 })
    k.cyl("boss", { at: [0, 0, P_SET + PH], radius: 0.4, h: 0.1, n: 40, parent: "plt" })
    k.cyl("ram", { at: [0, 0, P_SET + PH + 0.1], radius: 0.27, h: RAM, n: 36, parent: "plt" })

    // The crown and the cylinder that pushes: above everything.
    k.block("crown", { at: [-CX - 0.45, -CY, CROWN], size: [2 * CX + 0.9, 2 * CY, CROWN_H], r: 0.3, layer: 1, bias: -4 })
    k.detail("crownSeam", { pts: [[-CX - 0.15, CY, CROWN + 0.16], [0, CY, CROWN + 0.16], [CX + 0.15, CY, CROWN + 0.16]], layer: 1, bias: 1 })
    k.cyl("nutL", { at: [-CX, 0, CROWN_T], radius: 0.27, h: 0.16, n: 32, layer: 1 })
    k.cyl("nutR", { at: [CX, 0, CROWN_T], radius: 0.27, h: 0.16, n: 32, layer: 1 })
    k.cyl("flange", { at: [0, 0, CROWN_T], radius: 0.6, h: 0.1, n: 56, layer: 1 })
    k.cyl("barrel", { at: [0, 0, CROWN_T + 0.1], radius: 0.48, h: 0.86, n: 48, layer: 1 })
    k.detail("band", { pts: flat(arc(0, 0, 0.48, -45, 135, 24), CROWN_T + 0.28), layer: 1, bias: 1 })
    k.cyl("cap", { at: [0, 0, CROWN_T + 0.96], radius: 0.54, h: 0.14, n: 48, layer: 1 })
  },
  tick(t, s, input) {
    const { p, groups } = s
    const lap = cycle(t, T)

    // The lap: a push with nothing set, then the collars, then two pushes.
    const loopP = keys(lap, [
      [0, P_UP],
      [0.05, P_UP],
      [0.12, P_TOUCH, easeIn],
      [0.2, P_MIN, easeOut],
      [0.29, P_MIN],
      [0.38, P_UP, easeInOut],
      [0.57, P_UP],
      [0.635, P_SET, easeIn],
      [0.73, P_SET],
      [0.765, P_SET + 0.4, easeOut],
      [0.8, P_SET, easeIn],
      [0.88, P_SET],
      [0.95, P_UP, easeInOut],
      [1, P_UP],
    ])
    const loopC = keys(lap, [
      [0, C_FOOT],
      [0.39, C_FOOT],
      [0.5, P_SET, easeInOut],
      [0.93, P_SET],
      [0.99, C_FOOT, easeInOut],
      [1, C_FOOT],
    ])

    // The pointer sets the limit: its height on the upright plane through both
    // columns (a fixed plane), up to the claim's full size. Below the size a push
    // leaves anyway there is no limit: the collars drop to the foot.
    const a0 = input.onPlane ? input.onPlane(0) : null
    const a1 = input.onPlane ? input.onPlane(1) : null
    let aim = null
    if (a0 && a1 && Math.abs(a1[1] - a0[1]) > 1e-4) {
      const z = -a0[1] / (a1[1] - a0[1])
      const x = a0[0] + (a1[0] - a0[0]) * z
      if (Math.abs(x) < CX + 0.9 && z > -0.2 && z < CROWN_T + 1.2) aim = z < P_MIN ? C_FOOT : Math.min(z, P_SET)
    }
    const w = input.tween("w", aim === null ? 0 : 1, { dur: 0.5 })
    const cAim = input.spring("c", aim === null ? loopC : aim)
    const pAim = input.spring("p", aim === null ? loopP : Math.max(P_MIN, aim))
    const c = clamp(lerp(loopC, cAim, w), C_FOOT, P_SET)
    // A sleeve never passes the collar under it, nor the squeezed claim.
    const pz = Math.max(P_MIN, c, lerp(loopP, pAim, w))

    groups.cL.off[2] = groups.cR.off[2] = c - C_FOOT
    groups.plt.off[2] = pz - P_SET

    // Paint order: everything round a column keeps its place however it moves.
    for (const [id, x, D] of [
      ["L", -CX, D_L],
      ["R", CX, D_R],
    ]) {
      const zc = c - CH / 2
      const zs = pz + PH / 2
      p[`cb${id}`].bias = D - 0.1 - (x + centroid(BACK) + zc)
      p[`sb${id}`].bias = D - 0.05 - (x + centroid(BACK) + zs)
      p[`cf${id}`].bias = D + 0.05 - (x + centroid(FRONT) + zc)
      p[`sf${id}`].bias = D + 0.1 - (x + centroid(FRONT) + zs)
    }

    // The claim gives way to whatever comes lower than its full size.
    const size = clamp(pz - PAD - ZA, FLAT, FULL)
    const g = (size - N * DISC) / (N - 1)
    const whole = (size - FLAT) / (FULL - FLAT)
    const breath = input.still ? 0.5 : breathe(t, 2.6)
    for (let i = 0; i < N; i++) {
      const d = i * (g - GAP)
      p[`disc${i}`].off[2] = d
      if (i < N - 1) p[`core${i}`].off[2] = d
    }
    p.disc2.glow = whole * (0.22 + 0.08 * breath)
    p.disc4.glow = whole * (0.18 + 0.08 * breath)
    p.spill.glow = 0.2 + 0.65 * whole

    // The limit lights once it is set: the collars have reached their height and locked.
    const set = w > 0.5 ? clamp((c - C_FOOT) / 0.12) : clamp((c - P_SET + 0.06) / 0.05)
    const held = set > 0.5 && pz - c < 0.02
    for (const id of ["L", "R"]) {
      for (const f of ["cb", "cf"]) p[`${f}${id}`].on = set > 0.5 ? 2 : 0
      p[`cf${id}`].glow = set > 0.5 ? (held ? 0.4 : 0.22) : 0
    }

    const moving = w > 0.5 ? 0 : lap
    s.state =
      w > 0.5
        ? whole > 0.97
          ? "held: full size"
          : whole < 0.03
            ? "no limit: gave way"
            : "held at the limit"
        : moving < 0.05 || moving >= 0.95
          ? "before the push"
          : moving < 0.2
            ? "push"
            : moving < 0.29
              ? "gave way"
              : moving < 0.39
                ? "let go"
                : moving < 0.5
                  ? "setting the limit"
                  : moving < 0.57
                    ? "limit set"
                    : held
                      ? "held"
                      : moving < 0.88
                        ? "push"
                        : "let go"
  },
  readout: (s) => s.state || "rest",
})
