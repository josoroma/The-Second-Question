// Chapter 26, Saying no and pushing back: one rocker, two gates.
//
// Rows of crates come down a wide channel. Each row is one request: a wide
// crate, what was asked for, and a narrow one beside it, the part that could
// be used. Where the channel forks, the main run goes straight on and a side
// channel turns off. Both mouths are kept by one rocker, two leaves fixed
// square to each other on one post, so the stroke that shuts one opens the
// other by the same angle.
//
// The first rows meet the rocker half way: not a no, not a yes. Half way shuts
// both mouths, and everything waits. Then the rocker finishes its stroke. The
// long leaf closes the main run (the no, first), the same stroke swings the
// short leaf out of the side mouth, and the narrow crates go on, one behind
// the other, to the landing. The wide ones stay. The place at the end of the
// main run stays a dashed outline.
//
// Light: magenta is the no, the long leaf, once it is all the way across. Teal
// is what they can use, the narrow crates that go on.
//
// The pointer holds the rocker, as if by its leaves: near the closed line the
// side channel runs, along the main run the wide crates go and the narrow ones
// wait, anywhere between (or upstream) nothing moves.

import { arc, breathe, clamp, cycle, easeInOut, easeOut, figure, keys, lerp } from "../lib/iso/core.js"

const T = 9.6 // seconds per lap
const DEG = Math.PI / 180
const ROWS = 3
const PITCH = 1.1 // from row to row

// Plan. The post stands at the origin; the flow runs along +x.
const FAR = -2.06 // the far wall of the main run
const NEAR = 1.1 // the near wall of the side lane
const YB = -1.07 // the wide crates' lane
const YS = 0.58 // the narrow crates' lane
const LEN = 0.92 // a crate's length along the flow
const WB = 1.74
const WS = 0.8
const CH = 0.66 // crate height
const CURB = 0.13
const X0 = -4.15 // where the channel begins
const XE = 4.15 // and where the main run ends

// The side lane: straight, a quarter turn, straight to the landing.
const BEND = 1.25 // where it starts to turn
const RB = 1.02 // radius of its centre line
const CX = BEND // centre of the turn
const CY = YS + RB
const XS = CX + RB // the lane after the turn
const ARC = (RB * Math.PI) / 2
const IN = RB - (NEAR - YS) // inner and outer wall of the turn
const OUT = RB + (YS - 0.06)
const YE = 4.75 // where the landing ends

/** A place on the side lane, `u` past the post: [x, y, heading]. */
const lane = (u) => {
  if (u < BEND) return [u, YS, 0]
  if (u < BEND + ARC) {
    const a = (u - BEND) / RB
    return [CX + RB * Math.sin(a), CY - RB * Math.cos(a), a / DEG]
  }
  return [XS, CY + (u - BEND - ARC), 90]
}
const DOCK = BEND + ARC + (YE - CY) - LEN / 2 - 0.1 // the first crate's place on the landing
const WAIT = -0.16 - LEN / 2 // the first row's centre, against a leaf
const wait = (k) => WAIT - k * PITCH
const dock = (k) => DOCK - k * PITCH

// The rocker: turned 0 the main run is shut (no), turned 90 the side is (yes).
const HALF = 36
const LZ = 0.17
const LH = 0.86

// The lap, in seconds.
const JAM = 1.1 // the rows have come up against the half-shut gates
const NO = 2.5 // the stroke is finished
const SHUT = 3.2
const GO = 3.35 // the first narrow crate sets off
const EACH = 0.62 // then each next
const RUN = 2.5
const DARK = 8.2
const CLEAR = 9.1

const flat = (pts) => pts.map(([x, y]) => [x, -y])
const at = (z) => ([x, y]) => [x, y, z]
/** A closed polygon with its corners rounded. */
const soft = (pts, r, steps = 6) => {
  const out = []
  const n = pts.length
  for (let i = 0; i < n; i++) {
    const [a, b, c] = [pts[(i - 1 + n) % n], pts[i], pts[(i + 1) % n]]
    const rr = b[2] ?? r
    const to = (p) => {
      const l = Math.hypot(p[0] - b[0], p[1] - b[1])
      const k = Math.min(rr, l / 2) / l
      return [b[0] + (p[0] - b[0]) * k, b[1] + (p[1] - b[1]) * k]
    }
    const s = to(a)
    const e = to(c)
    for (let j = 0; j <= steps; j++) {
      const t = j / steps
      out.push([(1 - t) * (1 - t) * s[0] + 2 * t * (1 - t) * b[0] + t * t * e[0], (1 - t) * (1 - t) * s[1] + 2 * t * (1 - t) * b[1] + t * t * e[1]])
    }
  }
  return out
}

export default figure({
  slug: "26-saying-no-and-pushing-back",
  title: "One stroke shuts one gate and opens the other",
  desc: "A channel forks at a post. Two leaves fixed square to each other on the post keep both mouths: the long one, glowing magenta, stands across the main run, where wide crates wait in line; the short one has swung out of the side mouth, and narrow teal crates pass it, round a bend, to a landing. At the far end of the main run a dashed outline stays empty.",
  plate: "Saying no and pushing back",
  sentence:
    "The viewer sees a half-turned rocker hold everything up, then one stroke shut the main gate and open the side one, so the narrow crates go on, which explains a clean no: said all the way and first, it is what frees the part they can use.",
  view: { scale: 40, origin: [262, 200] },
  still: 5.5,
  build(k) {
    k.grid("board", { at: [-3.5, -2.8, -0.28], size: [7.7, 7.7], step: 0.7 })
    // The base: one plate, forked.
    const M = 0.2
    const plan = soft(
      [
        [X0, FAR - M - 0.18],
        [XE, FAR - M - 0.18],
        [XE, 0.22],
        [CX + OUT + M, 0.22, 0.12],
        [CX + OUT + M, YE + 0.28],
        [CX + IN - M, YE + 0.28],
        [CX + IN - M, NEAR + M, 0.3],
        [X0, NEAR + M],
      ],
      0.34
    )
    k.extrude("base", { at: [0, 0, 0], shape: flat(plan), face: "+z", depth: 0.28, layer: -3 })
    ;[
      [X0 + 0.22, FAR - 0.06],
      [XE - 0.22, FAR - 0.06],
    ].forEach(([x, y], j) => k.led(`screw${j}`, { at: [x, y - 0.02, 0.002], face: "+z", r: 0.06, layer: -2 }))

    // Where each leaf may swing.
    k.guide("sweepM", { pts: arc(0, 0, 1.98, -90, 0, 24).map(at(0.003)), layer: -2 })
    k.guide("sweepS", { pts: arc(0, 0, 1.06, 0, 90, 16).map(at(0.003)), layer: -2 })
    k.halo("noFloor", { at: [0.5, YB, 0.004], r: 1.5, on: 1, layer: -1 })
    k.halo("useFloor", { at: [XS, CY + 1.6, 0.004], r: 1.7, on: 2, layer: -1 })

    // The walls, low: painted behind or in front of what runs between them.
    const wall = (id, x0, y0, x1, y1, layer) => k.block(id, { at: [x0, y0, 0], size: [x1 - x0, y1 - y0, CURB], r: 0.05, layer })
    const bend = (id, r0, r1, a0, a1, layer) =>
      k.extrude(id, { at: [CX, CY, CURB], shape: flat([...arc(0, 0, r1, a0, a1, 14), ...arc(0, 0, r0, a1, a0, 14)]), face: "+z", depth: CURB, layer })
    wall("wallFar", X0 + 0.15, FAR - 0.12, XE - 0.15, FAR, 0.1)
    wall("wallMid", 0.3, -0.06, BEND, 0.06, 1.2)
    bend("bendFar0", OUT, OUT + 0.12, -90, -44, 1.22)
    wall("wallMain", BEND + 0.75, -0.06, XE - 0.15, 0.06, 1.25)
    wall("wallIn", CX + IN - 0.12, CY, CX + IN, YE, 1.2)
    bend("bendIn1", IN - 0.12, IN, -44, 0, 1.2)
    bend("bendIn0", IN - 0.12, IN, -90, -44, 4)
    wall("wallNear", X0 + 0.15, NEAR, BEND, NEAR + 0.12, 4)
    bend("bendFar1", OUT, OUT + 0.12, -44, 0, 4.1)
    wall("wallOut", CX + OUT, CY, CX + OUT + 0.12, YE, 4.1)
    k.block("landing", { at: [CX + IN - 0.12, YE, 0], size: [OUT - IN + 0.24, 0.18, 0.5], r: 0.06, layer: 4.2 })
    k.led("landLamp", { at: [XS, YE + 0.186, 0.27], face: "+y", r: 0.09, layer: 4.3 })
    // What was asked for has a place at the end of the main run.
    k.block("asked", { at: [XE - 0.4 - LEN, YB - WB / 2, 0.01], size: [LEN, WB, CH], r: 0.14, role: "ghost", layer: 1.1 })

    // The crates.
    for (let i = 0; i < ROWS; i++) {
      k.group(`big${i}`, { at: [0, YB, 0] })
      k.block(`wide${i}`, { at: [-LEN / 2, -WB / 2, 0.01], size: [LEN, WB, CH], r: 0.14, parent: `big${i}`, layer: 1 })
      k.detail(`seam${i}`, { pts: [[-LEN / 2 + 0.02, 0, CH + 0.013], [0, 0, CH + 0.013], [LEN / 2 - 0.02, 0, CH + 0.013]], parent: `big${i}`, layer: 1, bias: 0.6 })
      k.group(`part${i}`, { at: [0, 0, 0] })
      k.block(`use${i}`, { at: [-LEN / 2, -WS / 2, 0.01], size: [LEN, WS, CH], r: 0.14, parent: `part${i}`, layer: 1.5 })
    }

    // The rocker: two leaves, square, joined by a web; one post.
    k.group("rk", { at: [0, 0, 0] })
    k.cyl("seat", { at: [0, 0, 0], radius: 0.28, h: LZ - 0.02, n: 36, layer: 1.9 })
    k.block("leafNo", { at: [-0.09, -1.98, LZ], size: [0.18, 1.82, LH], r: 0.07, parent: "rk", layer: 2 })
    k.cyl("post", { at: [0, 0, LZ - 0.02], radius: 0.19, h: LH + 0.02, n: 36, layer: 2.05 })
    k.block("leafSide", { at: [0.16, -0.09, LZ], size: [0.9, 0.18, LH], r: 0.07, parent: "rk", layer: 2.1 })
    k.extrude("brace", { at: [0, 0, LZ + LH + 0.07], shape: flat([...arc(0, 0, 0.95, -93, 4, 20), ...arc(0, 0, 0.8, 4, -93, 20)]), face: "+z", depth: 0.07, parent: "rk", layer: 2.2 })
    k.cyl("head", { at: [0, 0, LZ + LH], radius: 0.27, h: 0.07, n: 36, layer: 2.25 })
    k.cyl("cap", { at: [0, 0, LZ + LH + 0.07], radius: 0.14, h: 0.12, n: 32, layer: 2.3 })
  },
  tick(t, s, input) {
    const { p, groups } = s
    const tl = cycle(t, T) * T

    // The lap: the rows come up and jam; the stroke is finished; the narrow
    // crates go on; all clears and the rocker is left half way again.
    const turnL = keys(tl, [
      [0, HALF],
      [NO, HALF],
      [SHUT, 0, easeInOut],
      [CLEAR - 0.4, 0],
      [T, HALF, easeInOut],
    ])
    const come = keys(tl, [
      [0, -1.5],
      [JAM, 0, easeOut],
      [T, 0],
    ])
    const fadeIn = clamp(tl / 0.5)
    const leave = keys(tl, [
      [0, 0],
      [DARK, 0],
      [CLEAR, 1, easeInOut],
      [T, 1],
    ])
    const fadeL = fadeIn * (1 - clamp((leave - 0.35) / 0.6))
    const bigL = (i) => wait(i) + come - leave * 0.9
    const useL = (i) =>
      keys(tl, [
        [0, wait(i) - 1.5],
        [JAM, wait(i), easeOut],
        [GO + i * EACH, wait(i)],
        [GO + i * EACH + RUN, dock(i), easeInOut],
        [T, dock(i)],
      ])

    // The pointer turns the rocker by its leaves.
    const a = input.onPlane ? input.onPlane(LZ + LH / 2) : null
    let want = null
    if (a && a[0] > X0 - 0.3 && a[0] < XE + 0.4 && a[1] > FAR - 0.6 && a[1] < YE + 0.6) {
      const d = Math.atan2(a[1], a[0]) / DEG
      want = a[0] < -0.15 ? HALF : a[1] < 0 ? clamp(d + 90, 0, 90) : clamp(d, 0, 90)
      want = want < 24 ? 0 : want > 52 ? 90 : HALF
    }
    const over = want !== null
    const m = input.tween("ptr", over ? 1 : 0, { dur: 0.5 })

    // Under the pointer the crates run by themselves: a lane moves while its
    // gate is open, and a leaf waits until nothing stands in its sweep.
    if (!s.run || (!over && m < 0.01)) s.run = { big: [0, 1, 2].map(wait), use: [0, 1, 2].map(wait), bf: [1, 1, 1], uf: [1, 1, 1] }
    const q = s.run
    const busyB = q.big.some((x) => x > WAIT + 0.05 && x < 2.6)
    const busyU = q.use.some((x) => x > WAIT + 0.05 && x < 1.7)
    let goal = over ? want : HALF
    if (goal < 72 && busyB && !input.still) goal = 90
    else if (goal > 18 && busyU && !input.still) goal = 0
    const turnP = input.spring("turn", over ? goal : turnL, { k: 80, c: 18 })
    const turn = lerp(turnL, turnP, m)
    const openB = over && want === 90 && turn > 80
    const openU = over && want === 0 && turn < 10
    const step = (xs, fs, open, end) => {
      const v = 1.7 * (input.dt || 0)
      const order = [0, 1, 2].sort((i, j) => xs[j] - xs[i])
      let ahead = Infinity
      for (const i of order) {
        let lim = ahead - PITCH
        const past = xs[i] > WAIT + 0.05
        if (!open && !past) lim = Math.min(lim, WAIT)
        xs[i] = Math.max(xs[i], Math.min(xs[i] + v, lim))
        ahead = xs[i]
        // Off the end it fades; then it joins the line again upstream.
        const f = xs[i] > end - 0.7 ? clamp((end - xs[i]) / 0.7) : xs[i] < wait(2) - 0.3 ? clamp((xs[i] - wait(2) + 1.1) / 0.8) : 1
        fs[i] = f
        if (xs[i] >= end) {
          xs[i] = Math.min(wait(2) - 1.1, Math.min(...xs) - PITCH)
          fs[i] = 0
        }
      }
    }
    if (over && input.dt) {
      step(q.big, q.bf, openB, XE - 0.4 - LEN / 2)
      step(q.use, q.uf, openU, DOCK + 0.05)
    }
    if (over && input.still) {
      // Reduced motion: the result at once.
      q.use = [0, 1, 2].map(want === 0 ? dock : wait)
      q.big = [0, 1, 2].map((i) => (want === 90 ? XE - 0.4 - LEN / 2 - i * PITCH : wait(i)))
    }

    groups.rk.rz = turn
    const shut = over || m > 0.5 ? clamp((8 - turn) / 6) : tl > NO ? clamp((6 - turn) / 5) : 0
    const b = input.still ? 0.5 : breathe(t, 2.8)
    const dim = over ? 1 : 1 - clamp((tl - DARK) / 0.4)
    const no = shut * dim
    p.leafNo.on = no > 0.3 ? 1 : 0
    p.leafNo.glow = no * (0.32 + 0.12 * b)
    p.noFloor.glow = no * 0.9

    // Positions, cross-faded between the lap and the pointer's run.
    const mix = Math.abs(2 * m - 1)
    let passed = 0
    for (let i = 0; i < ROWS; i++) {
      const bx = m > 0.5 ? q.big[i] : bigL(i)
      const bf = (m > 0.5 ? q.bf[i] : fadeL) * mix
      groups[`big${i}`].off[0] = bx
      p[`wide${i}`].fade = bf
      p[`wide${i}`].hide = p[`seam${i}`].hide = bf < 0.02
      p[`seam${i}`].fade = bf
      const past = bx > 0.6
      p[`wide${i}`].layer = p[`seam${i}`].layer = past && turn < 60 ? 2.6 : 1
      const u = m > 0.5 ? q.use[i] : useL(i)
      const uf = (m > 0.5 ? q.uf[i] : fadeL) * mix
      const [x, y, h] = lane(u)
      groups[`part${i}`].off[0] = x
      groups[`part${i}`].off[1] = y
      groups[`part${i}`].rz = h
      const c = p[`use${i}`]
      c.fade = uf
      c.hide = uf < 0.02
      c.layer = u > BEND + 0.2 ? 4.05 : turn < 25 ? 3 : 1.5
      const on = clamp((u + 0.45) / 0.5) * uf
      c.on = on > 0.3 ? 2 : 0
      c.glow = 0.26 * on
      passed += on
    }
    const use = clamp(passed / 2) * dim
    p.useFloor.glow = 0.75 * use
    const docked = m > 0.5 ? q.use.some((u) => u > DOCK - 1.2) : tl > GO + RUN - 0.3 && tl < DARK + 0.4
    p.landLamp.on = docked ? 2 : 0
    p.asked.fade = 0.9

    s.state = turn < 10 ? (passed > 0.5 ? "no, and this" : "no") : turn > 80 ? "yes" : "maybe"
  },
  readout: (s) => s.state || "rest",
})
