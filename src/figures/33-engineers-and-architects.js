// Chapter 33, Engineers and architects: the frame that was pinned first.
//
// A grader. On its deck a slot widens in three steps; a block is pushed along
// it and drops through at the first step wider than itself, comes out of the
// mouth below and stops in the tray there. Which tray depends on the block, and
// nothing in the machine says so from the front.
//
// Before the trays runs a rail with three holes. A frame rides on it, and a pin
// set by hand holds it at one tray: the prediction. Only when the pin is down
// does the stop on the deck let the block go. The narrow block comes out inside
// the frame, and lights. Then a wide one, an input nobody had tried, goes past
// the first step and the second, and comes out in another tray, outside the
// frame: nothing lights, and the frame does not follow it. The pin is pulled,
// the frame moved and pinned again, and the wide block released again. This
// time it comes out inside the frame.
//
// Light: teal is the prediction, the frame and its pin, set before anything
// runs. Magenta is the block that came out where the frame was, the change you
// can answer for. At rest only those glow.
//
// The pointer pins the frame: aim at a tray and, once the last block is done,
// the frame goes there, the pin drops and the block on the deck is let go.
// Narrow, wide and middling come by turns.

import { breathe, clamp, cycle, easeIn, easeInOut, easeOut, figure, keys, lerp, ring, rrect, smooth } from "../lib/iso/core.js"

const T = 10 // seconds per lap

// The grader: the deck runs along y, the mouths look along +x.
const D = 0.82 // half its depth
const Y0 = -3.75
const Y1 = 2.35
const H = 1.62
const PITCH = 1.45
const YB = -2.55 // the base is wider from here on
const yAt = (k) => (k - 1) * PITCH // tray k
const START = -2.85 // a block waiting on the deck
const PUSH0 = -3.36 // the pusher, drawn back
const SLOT = [0.54, 0.86, 1.18] // the slot's three widths
const LEN = 0.72 // a block along the deck
const BH = 0.52 // and its height
// Three blocks: which tray, and how wide. Each is wider than the step before its own.
const KINDS = [
  { id: "n", k: 0, w: 0.46 },
  { id: "w", k: 2, w: 1.1 },
  { id: "m", k: 1, w: 0.78 },
]

// The trays and the frame.
const TRAY = 0.22
const TRAY1 = 3.05
const LAND = 2.08 // where a block comes to rest
const FRAME = [1.36, 1.04, 0.74]
const RAIL_X = 3.5
const RAIL_H = 0.22
const CAR_H = 0.26
const PIN_L = 0.62
const PIN_UP = 0.42
const PIN_SET = RAIL_H + CAR_H + 0.2 // the pin's top when it is set

// A run, in seconds after the pin is down.
const GO = 0.16 // the stop is down
const FALL = 0.16
const IN = 0.06
const COME = 0.42
const pushT = (k) => 0.24 + (yAt(k) - START) / 4.4
const runT = (kind) => GO + pushT(kind.k) + FALL + IN + COME

/** A polygon with its corners rounded by quadratic curves. */
const soft = (pts, r, steps = 8) => {
  const out = []
  const n = pts.length
  for (let i = 0; i < n; i++) {
    const b = pts[i]
    const to = (p) => {
      const l = Math.hypot(p[0] - b[0], p[1] - b[1])
      const k = Math.min(r, l / 2) / l
      return [b[0] + (p[0] - b[0]) * k, b[1] + (p[1] - b[1]) * k]
    }
    const a = to(pts[(i - 1 + n) % n])
    const c = to(pts[(i + 1) % n])
    for (let j = 0; j <= steps; j++) {
      const t = j / steps
      out.push([0, 1].map((q) => (1 - t) * (1 - t) * a[q] + 2 * t * (1 - t) * b[q] + t * t * c[q]))
    }
  }
  return out
}

/** Where a block is, `u` seconds after its run began (u < 0: waiting). */
function run(kind, u) {
  const a = GO
  const b = a + pushT(kind.k)
  const c = b + FALL
  const d = c + IN
  const e = d + COME
  const y = u <= a ? START : lerp(START, yAt(kind.k), easeInOut(clamp((u - a) / (b - a))))
  return {
    y,
    sink: clamp((u - b) / FALL) ** 2 * (BH + 0.02),
    front: u < c ? null : lerp(D - 0.02, LAND + kind.w / 2, easeOut(clamp((u - d) / COME))),
    landed: smooth(clamp((u - e) / 0.14)),
    stop: clamp(u / GO),
    push: u < a ? lerp(PUSH0, START - LEN / 2 - 0.07, smooth(clamp(u / a))) : u < b ? y - LEN / 2 - 0.07 : lerp(yAt(kind.k) - LEN / 2 - 0.07, PUSH0, easeInOut(clamp((u - b - 0.1) / 0.6))),
  }
}

// The lap, in seconds.
const CLEAR = 0.7 // the last block is taken off
const PIN1 = 0.9
const RUN_A = 1.55
const RUN_B = 3.15
const CLEAR2 = 6.45
const PIN2 = 6.5
const RUN_C = 7.2

export default figure({
  slug: "33-engineers-and-architects",
  title: "Inside the frame that was pinned first",
  desc: "A long block with a stepped slot along its deck and three mouths in its side, each with a tray. Round the far tray stands a dashed teal frame, held on a rail by a teal pin; the narrow block that came out inside it glows magenta. A wide block has come out into the near tray, where no frame was, and stays dark.",
  plate: "Engineers and architects",
  sentence:
    "The viewer sees a frame pinned at one tray before a block is let go, the block light when it comes out inside it and a second block stay dark when it comes out anywhere else, which explains why you can answer for the change you can predict.",
  view: { scale: 41.5, origin: [212, 226] },
  still: 5.9,
  build(k) {
    k.grid("board", { at: [-2.4, -5.2, -0.3], size: [7.7, 9.1], step: 0.7 })
    const plan = (e) =>
      soft([[-1.25 + e, Y0 - 0.42 + e], [1.3 - e, Y0 - 0.42 + e], [1.3 - e, YB + e], [4.25 - e, YB + e], [4.25 - e, Y1 + 0.42 - e], [-1.25 + e, Y1 + 0.42 - e]], 0.42 - e * 0.6)
    k.extrude("base", { at: [0, 0, 0], shape: plan(0).map(([x, y]) => [x, -y]), face: "+z", depth: 0.3, layer: -5 })
    const lip = plan(0.17)
    k.detail("lip", { pts: [...lip, lip[0]].map(([x, y]) => [x, y, 0.002]), layer: -4.5 })
    ;[
      [3.86, YB + 0.4],
      [3.86, Y1 + 0.04],
      [0.98, Y0 - 0.12],
    ].forEach(([x, y], i) => k.led(`screw${i}`, { at: [x, y, 0.003], face: "+z", r: 0.07, layer: -4 }))
    k.halo("spill", { at: [LAND, 0, 0.004], r: 1.5, on: 1, layer: -3 })

    // The grader.
    k.block("body", { at: [-D, Y0, 0], size: [2 * D, Y1 - Y0, H], r: 0.16, layer: 0 })
    const half = SLOT.map((w) => w / 2)
    const e0 = yAt(0) - PITCH / 2 + 0.02
    const e1 = yAt(0) + PITCH / 2
    const e2 = yAt(1) + PITCH / 2
    const e3 = yAt(2) + PITCH / 2 - 0.1
    k.face("slot", {
      pts: [
        [half[0], e0], [half[0], e1], [half[1], e1], [half[1], e2], [half[2], e2], [half[2], e3],
        [-half[2], e3], [-half[2], e2], [-half[1], e2], [-half[1], e1], [-half[0], e1], [-half[0], e0],
      ].map(([x, y]) => [x, y, H + 0.002]),
      role: "recess",
      layer: 0.1,
    })
    k.block("railB", { at: [-D + 0.06, Y0 + 0.14, H], size: [0.1, Y1 - Y0 - 0.28, 0.12], r: 0.03, layer: 0.2 })
    k.block("railF", { at: [D - 0.16, Y0 + 0.14, H], size: [0.1, Y1 - Y0 - 0.28, 0.12], r: 0.03, layer: 0.6 })
    k.block("pusher", { at: [-0.5, PUSH0 - 0.06, H], size: [1, 0.13, 0.42], r: 0.05, layer: 0.4 })
    k.extrude("stop", { at: [0, -2.4, H + 0.3], shape: rrect(-0.28, -0.06, 0.28, 0.06, 0.03), face: "+z", depth: 0.3, layer: 0.4 })
    for (let j = 0; j < 4; j++) k.detail(`vent${j}`, { pts: [[D + 0.003, Y0 + 0.5 + j * 0.2, 0.42], [D + 0.003, Y0 + 0.5 + j * 0.2, 0.62], [D + 0.003, Y0 + 0.5 + j * 0.2, 0.82]], layer: 0.1 })
    k.detail("seam", { pts: [[D + 0.003, Y0 + 0.2, 1.2], [D + 0.003, 0, 1.2], [D + 0.003, Y1 - 0.2, 1.2]], layer: 0.1 })

    // Mouths and trays.
    for (let i = 0; i < 3; i++) {
      const y = yAt(i)
      k.block(`tray${i}`, { at: [D + 0.005, y - 0.6, 0], size: [TRAY1 - D, 1.2, TRAY], r: 0.1, layer: 0.2, bias: i })
      k.face(`floor${i}`, { pts: rrect(D + 0.06, y - 0.46, TRAY1 - 0.14, y + 0.46, 0.08).map(([a, b]) => [a, b, TRAY + 0.003]), role: "recess", layer: 0.25 })
      k.face(`mouth${i}`, { pts: [[D + 0.004, y + 0.46, TRAY], [D + 0.004, y - 0.46, TRAY], [D + 0.004, y - 0.46, 0.86], [D + 0.004, y + 0.46, 0.86]], role: "recess", layer: 0.12 })
    }
    k.halo("glow", { at: [LAND, 0, TRAY + 0.006], r: 1.0, on: 1, layer: 0.3 })

    // The blocks: one for the deck, one for the tray, the same block.
    for (const q of KINDS) {
      k.extrude(`deck_${q.id}`, { at: [0, START, H + BH], shape: rrect(-q.w / 2, -LEN / 2, q.w / 2, LEN / 2, 0.1), face: "+z", depth: BH, layer: 0.4 })
      k.extrude(`out_${q.id}`, { at: [LAND + q.w / 2, yAt(q.k), TRAY], shape: rrect(-LEN / 2, 0.004, LEN / 2, BH, 0.05), face: "+x", depth: q.w, layer: 1 })
    }

    // The rail, its holes, the frame and its pin.
    k.block("rail", { at: [RAIL_X - 0.2, YB + 0.3, 0], size: [0.4, Y1 - YB - 0.3, RAIL_H], r: 0.12, layer: 2 })
    for (let i = 0; i < 3; i++) k.led(`hole${i}`, { at: [RAIL_X, yAt(i), RAIL_H + 0.002], face: "+z", r: 0.09, layer: 2.1 })
    k.group("car", { at: [0, 0, 0] })
    k.block("frame", { at: [LAND - FRAME[0] / 2, -FRAME[1] / 2, TRAY + 0.01], size: FRAME, r: 0.06, role: "ghost", on: 2, parent: "car", layer: 1.5 })
    k.block("arm", { at: [LAND + FRAME[0] / 2, -0.07, RAIL_H + 0.07], size: [RAIL_X - 0.26 - LAND - FRAME[0] / 2, 0.14, 0.1], r: 0.03, parent: "car", layer: 2.2 })
    k.block("slider", { at: [RAIL_X - 0.3, -0.36, RAIL_H], size: [0.6, 0.72, CAR_H], r: 0.1, parent: "car", layer: 2.3 })
    k.extrude("pin", { at: [RAIL_X, 0, PIN_SET], shape: ring(0, 0, 0.1, 28), face: "+z", depth: PIN_L, role: "accent2", parent: "car", layer: 2.4 })
    k.cyl("knob", { at: [RAIL_X, 0, PIN_SET], radius: 0.17, h: 0.09, n: 32, role: "accent2", parent: "car", layer: 2.5 })
  },
  tick(t, s, input) {
    const { p, groups } = s
    // Left alone, the machine takes up the lap where a new block is set down.
    if (s.m && s.m.done) {
      s.c0 = s.m.car
      s.shift = t - (CLEAR + 0.2)
      s.m = null
    }
    const lt = cycle(input.still ? t : t - (s.shift || 0), T) * T
    if (lt > CLEAR2) s.c0 = 2
    const c0 = s.c0 ?? 2

    // The lap: the frame's place (in trays), the pin, and which blocks are where.
    const loopCar = keys(lt, [[0, c0], [PIN1 + 0.1, c0], [PIN1 + 0.5, 0, easeInOut], [PIN2 + 0.1, 0], [PIN2 + 0.55, 2, easeInOut], [T, 2]])
    const loopPin = keys(lt, [[0, 0], [PIN1, 0], [PIN1 + 0.1, 1, easeOut], [PIN1 + 0.5, 1], [PIN1 + 0.6, 0, easeIn], [PIN2, 0], [PIN2 + 0.1, 1, easeOut], [PIN2 + 0.55, 1], [PIN2 + 0.67, 0, easeIn], [T, 0]])
    const load = (a) => clamp((lt - a) / 0.25)
    // [block, seconds into its run, how far it has been set on the deck, its fade]
    let show = []
    if (lt < CLEAR + 0.2) show.push([KINDS[1], lt + T - RUN_C, 1, 1 - clamp((lt - CLEAR) / 0.2)])
    if (lt >= 0.85 && lt < CLEAR2 + 0.2) show.push([KINDS[0], lt - RUN_A, load(0.95), 1 - clamp((lt - CLEAR2) / 0.2)])
    if (lt >= RUN_B - 0.4 && lt < CLEAR2 + 0.2) show.push([KINDS[1], lt - RUN_B, load(RUN_B - 0.36), 1 - clamp((lt - CLEAR2) / 0.2)])
    if (lt >= CLEAR2 + 0.2) show.push([KINDS[1], lt - RUN_C, load(CLEAR2 + 0.2), 1])
    let car = loopCar
    let pin = loopPin

    // The pointer pins the frame at a tray: three fixed strips.
    const at = input.onPlane ? input.onPlane(TRAY) : null
    let pick = null
    if (at && at[0] > 0.2 && at[0] < 4.3 && at[1] > Y0 + 1.2 && at[1] < Y1 + 0.3) pick = clamp(Math.round(at[1] / PITCH) + 1, 0, 2)
    if (input.still) {
      if (pick !== null) {
        car = pick
        pin = 0
        show = [[KINDS[0], 9, 1, 1]]
      }
    } else if (pick !== null || s.m) {
      const dt = Math.min(input.dt || 0, 0.05)
      if (!s.m) {
        const [q, u, load] = show.length ? show[show.length - 1] : [KINDS[0], -1, 0]
        s.m = { car, pin, q, u: u < 0 ? -1 : u, fade: 1, load, n: KINDS.indexOf(q) + 1, old: show.length > 1 ? show[0] : null }
      }
      const m = s.m
      // A block that has come out is left there a while; less if another tray is wanted.
      const busy = m.u >= 0 && m.u < runT(m.q) + (pick !== null && pick !== m.car ? 0.5 : 1.6)
      if (m.old) {
        m.old = [m.old[0], m.old[1], m.old[2], m.old[3] - dt / 0.2]
        if (m.old[3] <= 0) m.old = null
      }
      if (m.u >= 0) m.u += dt
      if (m.u >= 0 && !busy) {
        // Taken off; the next one is set on the deck.
        m.fade -= dt / 0.25
        if (m.fade <= 0) {
          m.q = KINDS[m.n % KINDS.length]
          m.n++
          m.u = -1
          m.fade = 1
          m.load = 0
          if (pick === null) m.done = true
        }
      } else if (m.u < 0) {
        m.load = Math.min(1, m.load + dt / 0.25)
        const to = pick === null ? Math.round(m.car) : pick
        const there = Math.abs(m.car - to) < 0.004
        // The frame moves only with the pin up, and only while nothing runs.
        m.pin = clamp(m.pin + (there ? -dt : dt) / 0.13)
        if (!there && m.pin > 0.9) m.car += clamp((to - m.car) * (1 - Math.exp(-dt * 11)), -4 * dt, 4 * dt)
        if (there) m.car = to
        if (there && m.pin === 0 && m.load === 1) m.u = 0
      }
      car = m.car
      pin = m.pin
      show = [[m.q, m.u, m.load, m.fade]]
      if (m.old) show.unshift(m.old)
    }

    // The frame.
    groups.car.off[1] = yAt(car)
    const dz = pin * PIN_UP
    p.pin.off[2] = dz
    p.pin.depth = Math.min(PIN_L, PIN_SET + dz - (RAIL_H + CAR_H)) // what is in the slider is out of sight
    p.knob.off[2] = dz
    p.pin.glow = 0.22

    // The blocks.
    for (const q of KINDS) p[`deck_${q.id}`].hide = p[`out_${q.id}`].hide = true
    let lit = 0
    let litAt = 0
    let state = "a block waits"
    let pushY = PUSH0
    let stop = 0
    for (const [q, u, l, fade] of show) {
      const r = run(q, u)
      const deck = p[`deck_${q.id}`]
      const out = p[`out_${q.id}`]
      const last = show[show.length - 1][0] === q
      if (r.front === null) {
        const lift = u < 0 ? 0.5 * (1 - smooth(l)) : 0
        deck.hide = r.sink > BH - 0.01
        deck.off[1] = r.y - START
        deck.off[2] = lift - r.sink
        deck.depth = BH - r.sink // what is through the slot is out of sight
        deck.fade = u < 0 ? smooth(l) * fade : fade
      } else {
        out.hide = fade < 0.03 || r.front < D + 0.03
        out.off[0] = r.front - (LAND + q.w / 2)
        out.depth = clamp(r.front - D - 0.004, 0.01, q.w)
        out.fade = fade
      }
      const inside = Math.abs(car - q.k) < 0.02 && pin < 0.05
      const on = inside ? r.landed * fade : 0
      out.on = on > 0.3 ? 1 : 0
      out.glow = 0.34 * on
      if (on > lit) {
        lit = on
        litAt = q.k
      }
      if (last) {
        pushY = r.push
        stop = r.stop
        state = u < 0 ? (pin > 0.1 ? "pin out" : "pinned") : r.front === null ? "let go" : r.landed > 0.5 ? (inside ? "as predicted" : "not predicted") : "let go"
      }
    }
    p.pusher.off[1] = pushY - PUSH0
    p.stop.off[2] = -stop * 0.28
    p.stop.depth = 0.3 - stop * 0.28
    p.stop.hide = stop > 0.95
    const b = input.still ? 0.5 : breathe(t, 2.8)
    p.glow.off[1] = p.spill.off[1] = yAt(litAt)
    p.glow.glow = lit * (0.75 + 0.15 * b)
    p.spill.glow = lit * 0.6
    s.state = state
  },
  readout: (s) => s.state || "rest",
})
