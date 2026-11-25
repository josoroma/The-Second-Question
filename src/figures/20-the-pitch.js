// Chapter 20, The pitch: five reasons on one turret, one seat cut to the
// listener.
//
// A turntable carries five slides of the same stock, your reasons, each with a
// differently cut end. In front stands the seat, cut to one listener: a plain
// fence and a block with a stair in it. Whichever slide is in front runs out
// and goes as far as its cut lets it. The square one, the one you would have
// led with, stops at the mouth and the seat stays dark. It draws back, the
// table turns, another passes, and the slide with the listener's own cut runs
// all the way in: every step of it meets the block, and the lamp in the seat
// lights. The other four stay on the table.
//
// Nothing is faked: how far each slide goes is worked out from its outline and
// the seat's.
//
// Light: teal is the post the table turns on, the sentence that stays.
// Magenta is the reason that is theirs, once it is home, and the lamp it
// lights. At rest only those glow.
//
// The pointer chooses which reason leads: point at a slide where it stands at
// rest and the table brings it to the front and tries it. Theirs is the one in
// front.

import { arc, breathe, clamp, cycle, easeIn, easeInOut, easeOut, figure, hull, keys, ring, rrect } from "../lib/iso/core.js"

const T = 9 // seconds per lap
const DEG = Math.PI / 180
const STEP = 72

// A slide, pointing along +y from the table's centre: from its tail to its
// shoulder it is plain stock; past the shoulder it is cut.
const HW = 0.54 // half its width
const C = (2 * HW) / 3 // one step of the stair
const TAIL = 0.66
const SHOULDER = 1.66
const CUT = [0.92, 0.5, 0.2] // the listener's stair, from the fence outward
const HOME = 1.16 // how far theirs runs in

// The five cuts: how far each reaches past the shoulder across its width.
const STAIR = [
  [-HW, CUT[0]],
  [-HW + C, CUT[0]],
  [-HW + C, CUT[1]],
  [HW - C, CUT[1]],
  [HW - C, CUT[2]],
  [HW, CUT[2]],
]
const POINT = [
  [-HW, 0.06],
  [0, CUT[0]],
  [HW, 0.06],
]
const ROUND = arc(0, CUT[0] - HW, HW, 180, 0, 20)
const SQUARE = [
  [-HW, CUT[0]],
  [HW, CUT[0]],
]
const FORK = [
  [-HW, CUT[0]],
  [-HW + 0.3, CUT[0]],
  [-HW + 0.3, 0.1],
  [HW - 0.3, 0.1],
  [HW - 0.3, CUT[0]],
  [HW, CUT[0]],
]
const CUTS = [STAIR, POINT, ROUND, SQUARE, FORK]
// Where each slide's outline is centred, for painting its knob after it.
const MID = CUTS.map((cut) => (2 * TAIL + cut.reduce((a, q) => a + SHOULDER + q[1], 0)) / (cut.length + 2))
const KNOB = TAIL + 0.32
const THEIRS = 0
const YOURS = 3

/** How far a cut reaches at x (the furthest, at a step). */
const reach = (cut, x) => {
  let best = 0
  for (let i = 0; i < cut.length - 1; i++) {
    const [x0, y0] = cut[i]
    const [x1, y1] = cut[i + 1]
    if (x < Math.min(x0, x1) - 1e-9 || x > Math.max(x0, x1) + 1e-9) continue
    best = Math.max(best, Math.abs(x1 - x0) < 1e-6 ? Math.max(y0, y1) : y0 + ((y1 - y0) * (x - x0)) / (x1 - x0))
  }
  return best
}
/** The seat's own depth at x: the shallower side at a step of the stair. */
const seatAt = (x) => HOME + CUT[clamp(Math.floor((x + HW) / C + 1e-6), 0, 2)]
/** How far a slide can run before it meets the seat. */
const stops = CUTS.map((cut) => {
  let d = HOME
  for (let x = -HW; x <= HW + 1e-9; x += 0.005) d = Math.min(d, seatAt(Math.min(x, HW - 1e-6)) - reach(cut, x))
  return Math.max(0, d)
})
stops[THEIRS] = HOME

// Heights.
const DISC = 0.72 // the table's top, and the seat's floor
const THICK = 0.42
const TOP = DISC + THICK
const LOW = DISC + 0.22 // the seat's top: the slide stands proud of it, so its fit shows
const R = 2.02 // the table

// The seat, in plan.
const MOUTH = SHOULDER + HOME - 0.14
const END = SHOULDER + HOME + CUT[0] + 0.72
const RIGHT = HW + 0.66
const y = (k) => SHOULDER + HOME + CUT[k]

// The lap, in seconds.
const OUT1 = 0.5
const HIT = 1.15
const BACK1 = 2.0
const TURN0 = 2.55
const TURN1 = 3.95
const OUT2 = 4.1
const IN = 4.95
const HOLD = 6.3
const BACK2 = 7.5
const TURN2 = 8.05

/** The loop: how far the table has turned, and how far the front slide is out. */
function loopAt(lt) {
  const p = lt / T
  const turn = keys(p, [
    [0, -YOURS * STEP],
    [TURN0 / T, -YOURS * STEP],
    [TURN1 / T, -5 * STEP, easeInOut],
    [TURN2 / T, -5 * STEP],
    [0.995, -5 * STEP - YOURS * STEP, easeInOut],
    [1, -5 * STEP - YOURS * STEP],
  ])
  const d = keys(p, [
    [0, 0],
    [OUT1 / T, 0],
    [HIT / T, stops[YOURS], easeIn],
    [(HIT + 0.12) / T, stops[YOURS] - 0.05, easeOut],
    [(HIT + 0.26) / T, stops[YOURS], easeIn],
    [BACK1 / T, stops[YOURS]],
    [(BACK1 + 0.5) / T, 0, easeInOut],
    [OUT2 / T, 0],
    [IN / T, HOME, easeInOut],
    [BACK2 / T, HOME],
    [(BACK2 + 0.5) / T, 0, easeInOut],
    [1, 0],
  ])
  return { turn, d, front: lt < (TURN0 + TURN1) / 2 || lt > 8.5 ? YOURS : THEIRS }
}

export default figure({
  slug: "20-the-pitch",
  title: "The one that fits goes in front",
  desc: "Five slides with differently cut ends lie around a turntable on a teal post. The one in front, its end cut like a stair, has run all the way into a seat with the same stair and glows magenta, with the lamp in the seat. The other four, pointed, round, square and forked, stay on the table.",
  plate: "The pitch",
  sentence:
    "The viewer sees a turntable offer a square-ended slide that stops at the mouth of a seat, then turn until the slide cut like the seat is in front and runs home, which explains why a pitch leads with the listener's reason: all five are yours, and one is cut to what this listener has to decide.",
  view: { scale: 41, origin: [322, 196] },
  still: 6.2,
  build(k) {
    k.grid("board", { at: [-4.2, -3.6, -0.3], size: [8.4, 9.8], step: 0.7 })
    const plan = hull(ring(0, 0, 2.62, 64).concat(rrect(-1.32, 2.2, 1.6, END + 0.5, 0.5, 8)))
    k.extrude("base", { at: [0, 0, 0], shape: plan.map(([a, b]) => [a, -b]), face: "+z", depth: 0.3, layer: -3 })
    // How far the cut ends swing: the seat stands just outside it.
    const swing = SHOULDER + CUT[0] + 0.06
    k.guide("swing", { pts: arc(0, 0, swing, 118, 422, 90).map(([a, b]) => [a, b, 0.002]), layer: -2 })
    ;[
      [-1.08, END + 0.22],
      [1.34, END + 0.22],
    ].forEach(([a, b], i) => k.led(`screw${i}`, { at: [a, b, 0.002], face: "+z", r: 0.07, layer: -2 }))
    k.halo("spill", { at: [0.1, 2.25, 0.003], r: 1.7, on: 1, layer: -1 })

    // The table.
    k.cyl("foot", { at: [0, 0, 0], radius: 1.5, h: 0.3, layer: -0.5 })
    k.cyl("table", { at: [0, 0, 0.3], radius: R, h: DISC - 0.3, n: 72, layer: 0 })
    k.halo("stays", { at: [0, 0, DISC + 0.002], r: 1.1, on: 2, layer: 0.2 })
    CUTS.forEach((cut, i) => {
      k.group(`g${i}`, { at: [0, 0, 0] })
      k.face(`way${i}`, {
        at: [0, 0, DISC + 0.002],
        pts: rrect(-HW - 0.05, TAIL - 0.06, HW + 0.05, R - 0.06, 0.08).map(([a, b]) => [a, b, 0]),
        role: "recess",
        parent: `g${i}`,
        layer: 0.1,
      })
      const pts = [[HW, TAIL], [-HW, TAIL], ...cut.map(([a, b]) => [a, SHOULDER + b])]
      k.extrude(`slide${i}`, { at: [0, 0, TOP], shape: pts.map(([a, b]) => [a, -b]), face: "+z", depth: THICK, parent: `g${i}`, layer: 1 })
      k.cyl(`knob${i}`, { at: [0, KNOB, TOP], radius: 0.13, h: 0.12, n: 28, parent: `g${i}`, layer: 1 })
    })
    k.cyl("post", { at: [0, 0, DISC], radius: 0.36, h: 1.16, role: "accent2", layer: 1 })
    k.cyl("cap", { at: [0, 0, DISC + 1.16], radius: 0.27, h: 0.1, role: "accent2", layer: 1, bias: 0.4 })

    // The seat, cut to the listener.
    k.block("stand", { at: [-HW - 0.46, MOUTH - 0.22, 0], size: [RIGHT + HW + 0.6, END - MOUTH + 0.34, DISC], r: 0.14, layer: 0.4 })
    k.face("floor", {
      at: [0, 0, DISC + 0.002],
      pts: [
        [-HW, MOUTH - 0.06],
        [HW, MOUTH - 0.06],
        [HW, y(2)],
        [HW - C, y(2)],
        [HW - C, y(1)],
        [-HW + C, y(1)],
        [-HW + C, y(0)],
        [-HW, y(0)],
      ].map(([a, b]) => [a, b, 0]),
      role: "recess",
      layer: 0.45,
    })
    k.block("fence", { at: [-HW - 0.32, MOUTH, DISC], size: [0.32, END - MOUTH, THICK + 0.28], r: 0.06, layer: 0.6 })
    const cutPlan = [
      [HW, MOUTH],
      [RIGHT, MOUTH],
      [RIGHT, END],
      [-HW, END],
      [-HW, y(0)],
      [-HW + C, y(0)],
      [-HW + C, y(1)],
      [HW - C, y(1)],
      [HW - C, y(2)],
      [HW, y(2)],
    ]
    k.extrude("seat", { at: [0, 0, LOW], shape: cutPlan.map(([a, b]) => [a, -b]), face: "+z", depth: LOW - DISC, layer: 2 })
    k.cyl("socket", { at: [0.36, END - 0.38, LOW], radius: 0.27, h: 0.06, layer: 2.1 })
    k.cyl("lamp", { at: [0.36, END - 0.38, LOW + 0.06], radius: 0.2, h: 0.2, layer: 2.2 })
    k.halo("lampGlow", { at: [0.36, END - 0.38, LOW + 0.002], r: 0.75, on: 1, layer: 2.05 })
  },
  tick(t, s, input) {
    const { p, groups } = s
    const lt = cycle(input.still ? t : t - (s.shift || 0), T) * T
    const L = loopAt(lt)
    let turn = L.turn
    let d = L.d
    let front = L.front

    // The pointer chooses a slide by where it stands at rest: five fixed
    // sectors round the post, the front one running out over the seat.
    const at = input.onPlane ? input.onPlane(TOP) : null
    let pick = null
    if (at) {
      const r = Math.hypot(at[0], at[1])
      const i = ((Math.round(Math.atan2(-at[0], at[1]) / DEG / STEP) % 5) + 5) % 5
      const inSeat = at[1] > 0 && at[1] < END + 0.3 && at[0] > -1.1 && at[0] < RIGHT + 0.2
      if (r > 0.3 && (r < 2.9 || inSeat)) pick = inSeat && at[1] > 1.4 ? THEIRS : i
    }
    if (input.still) {
      if (pick !== null) {
        front = pick
        turn = -pick * STEP
        d = stops[pick]
      }
    } else if (pick !== null || s.m) {
      const m = s.m || (s.m = { turn: L.turn, d: L.d, front: L.front })
      // Let go, the machine leads with theirs and the lap goes on from there.
      const want = pick === null ? THEIRS : pick
      const dt = Math.min(input.dt || 0, 0.05)
      const goal = (c) => -c * STEP + 360 * Math.round((m.turn + c * STEP) / 360)
      if (m.front !== want && m.d < 0.004) m.front = want
      const to = goal(m.front)
      if (m.d < 0.004) m.turn += clamp((to - m.turn) * (1 - Math.exp(-dt * 8)), -230 * dt, 230 * dt)
      const there = Math.abs(m.turn - to) < 0.6
      if (there) m.turn = to
      const dTo = there && m.front === want ? stops[m.front] : 0
      m.d += clamp((dTo - m.d) * (1 - Math.exp(-dt * 11)), -2.6 * dt, 2.6 * dt)
      if (Math.abs(dTo - m.d) < 0.003) m.d = dTo
      turn = m.turn
      d = m.d
      front = m.front
      if (pick === null && m.front === THEIRS && m.d >= HOME - 0.002) {
        s.m = null
        s.shift = t - HOLD
      }
    }

    // Which slide is in front now, and whether it has come all the way in.
    const home = front === THEIRS ? clamp((d - (HOME - 0.03)) / 0.03) : 0
    const lit = input.still ? home : clamp(input.spring("lit", home, { k: 150, c: 24 }))
    const b = input.still ? 0.5 : breathe(t, 2.8)
    CUTS.forEach((cut, i) => {
      const a = i * STEP + turn
      groups[`g${i}`].rz = a
      const out = i === front ? d : 0
      p[`slide${i}`].off[1] = out
      p[`knob${i}`].off[1] = out
      // The knob is painted just after its own slide, whichever way that points.
      p[`knob${i}`].bias = (MID[i] - KNOB) * (Math.cos(a * DEG) - Math.sin(a * DEG)) - 0.2
    })
    p.slide0.on = lit > 0.35 ? 1 : 0
    p.slide0.glow = lit * (0.34 + 0.1 * b)
    p.knob0.on = p.slide0.on
    p.lamp.on = lit > 0.35 ? 1 : 0
    p.lamp.glow = lit * 0.6
    p.lampGlow.glow = lit * 0.8
    p.spill.glow = lit * 0.8
    p.post.glow = 0.16
    p.stays.glow = 0.55

    s.state = home > 0.5 ? "theirs, home" : d > 0.02 ? (front === THEIRS ? "theirs" : d > stops[front] - 0.02 ? "stops short" : "yours") : "five reasons"
  },
  readout: (s) => s.state || "rest",
})
