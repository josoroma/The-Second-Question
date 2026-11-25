// Part VI, What stays human: an arch, closed by its keystone. Eight equal
// voussoirs, each spanning 20 degrees about one centre, rise from two piers.
// The keystone, set last at the crown, closes the ring: its two faces run to
// the same centre (the dashed guides say so), and only once it is seated does
// the load run down both halves of the arch into both piers. Lift it and the
// halves go dark: the arch needs it.

import { arc, bezier, breathe, clamp, cycle, easeChoice, easeInOut, easeOut, figure, keys, lerp } from "../lib/iso/core.js"

const T = 8 // seconds per lap
const D = 1.4 // depth of the arch and the piers (y): the front face is y = D
const PZ = 0.2 // top of the plinths
const H = 2.0 // pier height above its plinth
const SPRING = PZ + H // the springing line: the height of the arch's one centre
const RI = 2.0 // intrados
const RO = 3.2 // extrados
const RK = RO + 0.36 // the keystone stands a little proud of the ring
const RM = (RI + RO) / 2 // the line of thrust, at mid-ring
const KM = (RI + RK) / 2 // the keystone's own anchor, half way up its faces
const LIFT = 0.8 // where the keystone waits above its seat
const LIFT_HOVER = 0.75 // how far the pointer lifts it
const SEAT = 0.3 // lap fraction when it seats
const UNSEAT = 0.78 // lap fraction when it starts to lift
const FIRST = 0.1 // seconds after seating: the stones beside the crown take the load
const STEP = 0.24 // seconds per stone as the load runs down each half
const REACH = FIRST + 4 * STEP // seconds after seating: the load reaches the piers
const HAND = 0.7 // seconds for a hand-over between the loop and the pointer
const FY = D + 0.02 // lines drawn on the front face sit a hair proud of it
const LED_Z = PZ + 0.6 // the lamps on the piers
const lower = bezier(0.5, 0, 0.15, 1) // lowered with care: a long, soft landing

const rad = (a) => (a * Math.PI) / 180
/** An annular sector about the arch's centre, as one ring of [u, v] (u along x, v up). */
const sector = (a0, a1, r0, r1, n = 8) => [...arc(0, 0, r1, a0, a1, n), ...arc(0, 0, r0, a1, a0, n)]
/** World point on the front face at angle a and radius r about the centre. */
const onFace = (a, r, y = FY) => [r * Math.cos(rad(a)), y, SPRING + r * Math.sin(rad(a))]

// The two halves, listed from the crown down to the springer: [a0, a1] in degrees.
const RIGHT = [
  [60, 80],
  [40, 60],
  [20, 40],
  [0, 20],
]
const LEFT = [
  [100, 120],
  [120, 140],
  [140, 160],
  [160, 180],
]

export default figure({
  slug: "part-6-what-stays-human",
  title: "An arch, closed by its keystone",
  desc: "A stone arch of eight equal voussoirs rises from two piers on a base plate. At the crown the magenta keystone sits in its seat; dashed guides run its two faces down to the arch's one centre. Teal light runs down both halves of the arch into both piers and pools on the floor in front of them.",
  plate: "Part VI · What stays human",
  sentence:
    "The viewer sees the load run down both halves of the arch into both piers only once the keystone is set at the crown, which explains what stays human: machines can cut every equal stone, but the one set last, the second question, closes the ring and lets the whole structure carry weight.",
  // The 3D view orbits the ground point under the frame centre: this origin
  // keeps that point close to the arch's axis, so the crown stays in frame
  // from every side (and the waiting keystone with it).
  view: { scale: 28, origin: [296, 226] },
  still: 0.62 * T,
  build(k) {
    k.grid("board", { at: [-7.0, -2.8, -0.32], size: [14, 7.0], step: 0.7 })
    k.block("base", { at: [-4.7, -1.3, -0.32], size: [9.4, 4.2, 0.32], r: 0.45, layer: -3 })
    for (const [i, [x, y]] of [
      [-4.3, -0.9],
      [4.3, -0.9],
      [-4.3, 2.5],
      [4.3, 2.5],
    ].entries())
      k.led(`screw${i}`, { at: [x, y, 0], r: 0.07, face: "+z", layer: -2 })

    // Floor spill in front of each pier: lit when the load reaches its lamp.
    // Centre and radius keep it on the plate (its front edge is y = 2.9).
    for (const side of [-1, 1]) k.halo(side < 0 ? "poolL" : "poolR", { at: [side * RM, D + 0.2, 0], r: 1.3, layer: -1, on: 2 })

    // Plinths and piers. The piers are extrusions like the stones, so their
    // front, their side and the arch above them share one set of tones.
    for (const side of [-1, 1]) {
      const s = side < 0 ? "L" : "R"
      k.block(`plinth${s}`, { at: [side * RM - 0.75, -0.15, 0], size: [1.5, D + 0.3, PZ], r: 0.12 })
      const x0 = side < 0 ? -RO : RI
      k.extrude(`pier${s}`, {
        at: [x0, D, PZ],
        face: "+y",
        depth: D,
        shape: [
          [0, 0],
          [RO - RI, 0],
          [RO - RI, H],
          [0, H],
        ],
      })
      // The impost seam, round the faces that show (the left pier's inner face shows through the opening).
      const xs = side < 0 ? -RI : RO
      k.detail(`seam${s}`, {
        pts: [
          [x0, D, SPRING - 0.3],
          [x0 + (RO - RI), D, SPRING - 0.3],
          [xs, 0, SPRING - 0.3],
        ],
        bias: 0.4,
      })
      k.led(`lamp${s}`, { at: [side * RM, D + 0.01, LED_Z], face: "+y", r: 0.14, layer: 1 })
    }

    // The ring: eight equal stones about one centre, then the keystone.
    // Biases keep the painter's order true while the keystone moves: it must
    // stay in front of the stone on its left and behind the one on its right.
    const ring = (id, [a0, a1], bias = 0) => k.extrude(id, { at: [0, D, SPRING], face: "+y", depth: D, shape: sector(a0, a1, RI, RO), bias })
    RIGHT.forEach((a, i) => ring(`vR${i}`, a, i === 0 ? 0.25 : 0))
    LEFT.forEach((a, i) => ring(`vL${i}`, a, i === 0 ? -0.85 : 0))
    k.extrude("key", {
      at: [0, D, SPRING + KM],
      face: "+y",
      depth: D,
      shape: sector(80, 100, RI, RK).map(([u, v]) => [u, v - KM]),
      role: "accent",
      bias: -1.0,
    })

    // Construction: the springing line, and the keystone's two faces run on
    // down to the one centre they share.
    k.guide("springing", { pts: [[-RI, FY, SPRING], [RI, FY, SPRING]], layer: 1 })
    k.guide("faces", { pts: [onFace(80, RI - 0.04), [0, FY, SPRING], onFace(100, RI - 0.04)], layer: 1, bias: 0.1 })
    k.led("centre", { at: [0, D + 0.01, SPRING], face: "+y", r: 0.07, layer: 1, bias: 0.2 })

    // The line of thrust down each half: from the keystone's face along the
    // middle of the ring, then straight down the pier face to its lamp (at the
    // springing the arc is already vertical, so the line runs on unbroken).
    // Dark, it is a dim channel; a bead on each stone lights as the load passes.
    // The beads sit a layer above the lines, so a line's gap stroke never
    // crosses a bead.
    for (const side of [-1, 1]) {
      const s = side < 0 ? "L" : "R"
      const a0 = side < 0 ? 102 : 78 // clear of the keystone's faces (80° and 100°), gap stroke included
      const a1 = side < 0 ? 180 : 0
      k.wire(`thrust${s}`, {
        pts: [...arc(0, 0, RM, a0, a1, 40).map(([u, v]) => [u, FY, SPRING + v]), [side * RM, FY, LED_Z + 0.24]],
        layer: 1,
      })
      ;(side < 0 ? LEFT : RIGHT).forEach(([b0, b1], i) =>
        k.led(`bead${s}${i}`, { at: onFace((b0 + b1) / 2, RM, D + 0.01), face: "+y", r: 0.1, layer: 2 })
      )
    }

    // Where the pointer lifts the keystone: its screen box (u = x - y, w =
    // (x + y) / 2 - z), at rest and lifted, from the rest pose.
    const corners = []
    for (const [u, v] of sector(80, 100, RI, RK, 4))
      for (const y of [0, D]) for (const dz of [0, LIFT_HOVER]) corners.push([u, y, SPRING + v + dz])
    const us = corners.map(([x, y]) => x - y)
    const ws = corners.map(([x, y, z]) => (x + y) / 2 - z)
    return { hit: { u0: Math.min(...us) - 0.35, u1: Math.max(...us) + 0.35, w0: Math.min(...ws) - 0.35, w1: Math.max(...ws) + 0.35 } }
  },
  tick(t, s, input) {
    const { p } = s
    const lap = cycle(t, T)
    const dt = input.dt || 0

    // The lap: the keystone waits, is lowered into the crown, holds, lifts away.
    const loopLift = keys(lap, [
      [0, LIFT],
      [0.1, LIFT],
      [SEAT, 0, lower],
      [UNSEAT, 0],
      [0.92, LIFT, easeInOut],
      [1, LIFT],
    ])

    // The pointer: near the crown it lifts the keystone; anywhere else on the
    // figure it seats it. The box is fixed (rest and lifted pose), so holding
    // still never flickers.
    const ZM = SPRING + KM
    const aim = input.onPlane ? input.onPlane(ZM) : null
    let near = false
    if (aim) {
      const u = aim[0] - aim[1]
      const w = (aim[0] + aim[1]) / 2 - ZM
      near = u > s.hit.u0 && u < s.hit.u1 && w > s.hit.w0 && w < s.hit.w1
    }

    // Who moves the stone: the loop, or the pointer (lift or seat). Each
    // hand-over is one choice tween that starts from where the stone is, so it
    // never moves the wrong way first; handing back eases onto the loop's own
    // moving height.
    const drive = aim ? (near ? "lift" : "seat") : "loop"
    const goal = drive === "lift" ? LIFT_HOVER : drive === "seat" ? 0 : loopLift
    const hand = s.hand || (s.hand = { drive, from: goal, k: 1, lift: goal })
    if (input.still) Object.assign(hand, { drive, from: goal, k: 1 })
    else if (drive !== hand.drive) Object.assign(hand, { drive, from: hand.lift, k: 0 })
    hand.k = Math.min(1, hand.k + dt / HAND)
    const lift = lerp(hand.from, goal, easeChoice(hand.k))
    const falling = input.still || hand.prev === undefined ? drive === "loop" && lap > 0.1 && lap < SEAT : lift < hand.prev - 1e-4
    hand.prev = hand.lift = lift
    const seated = lift < 0.004
    const byLoop = drive === "loop" && hand.k >= 1

    // How long the keystone has been seated. The loop's own seating keeps the
    // loop's clock, so stills and exports match it; any other seating (the
    // pointer set it, or the loop took it back from the pointer) counts from
    // 0, so the cascade always plays. Under reduced motion all is lit.
    const loopSince = lap >= SEAT ? (lap - SEAT) * T : 0
    let since = -1
    if (input.still) {
      if (seated) since = aim ? 9 : loopSince
    } else if (!seated) {
      s.clock = "open"
    } else {
      const first = s.clock === undefined // the first live frame joins the loop where it is
      const fresh = s.clock === "open" // the stone has just seated
      if (first || fresh) s.clock = byLoop && (first || loopSince < 0.2) ? "loop" : "live"
      else if (s.clock === "loop" && !byLoop) s.clock = "live" // the pointer holds it: count on from here
      s.since = s.clock === "loop" ? loopSince : fresh || first ? 0 : s.since + dt
      since = s.since
    }

    p.key.off[2] = lift
    const settle = since >= 0 ? 1 - easeOut(since / 0.9) : 0
    p.key.glow = since >= 0 ? 0.5 + 0.42 * settle : 0.26 + (input.still ? 0.1 : 0.16 * breathe(t, 2.4))

    // Once it seats, the load runs from the crown down both halves, stone by
    // stone (each bead flares as the load passes, then holds); when it
    // reaches the piers the whole line is live and flows.
    const inPier = since >= REACH
    const flare = (from, dur) => 1 - easeOut((since - from) / dur)
    for (const half of ["R", "L"]) {
      for (let i = 0; i < 4; i++) {
        const b = p[`bead${half}${i}`]
        const at = FIRST + i * STEP
        const lit = since >= at
        b.on = lit ? 2 : 0
        b.glow = lit ? 0.45 + 0.4 * flare(at, 0.45) : 0
      }
      const w = p[`thrust${half}`]
      w.on = inPier ? 2 : 0
      w.fade = inPier ? 1 : 0.5
      w.flow = inPier ? { period: 1.6 } : null
    }
    for (const id of ["lampL", "lampR"]) {
      p[id].on = inPier ? 2 : 0
      p[id].glow = inPier ? 0.6 + 0.3 * flare(REACH, 0.6) : 0
    }
    const pool = since >= 0 ? clamp((since - REACH + 0.04) / 0.6) : 0
    p.poolL.glow = p.poolR.glow = 0.95 * easeOut(pool)
    // The keystone's faces find the centre the moment it closes the ring.
    p.faces.on = since >= 0 ? 1 : 0

    s.state = drive === "lift" ? "lifted" : seated ? (inPier ? "closed" : "closing") : falling ? "setting" : "open"
  },
  readout: (s) => s.state || "rest",
})
