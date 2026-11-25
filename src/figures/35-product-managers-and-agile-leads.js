// Chapter 35, Product managers and agile leads: twelve run, one fits.
//
// Twelve little machines stand on a tray and every one of them runs: twelve
// plungers going up and down, each with a head of its own shape, all lit.
// Nothing on the tray says which to take. The question is the plate over them,
// with one opening cut in it. It is carried across on a bridge and lowered on
// one machine after another. On most it only comes to rest on top of the
// head. On one it goes all the way down, and the machine runs on, up through
// the opening.
//
// Light: teal is what works, all twelve heads. Magenta is the question. At
// rest only those glow.
//
// The pointer asks: point at a machine and the plate goes there and is
// lowered on it. It only fits one.

import { arc, breathe, clamp, cycle, easeIn, easeInOut, easeOut, figure, keys, ring, smooth } from "../lib/iso/core.js"

const T = 10 // seconds per lap
const BEAT = T / 7 // a plunger's stroke, up and down

const PX = 1.56
const PY = 1.62
const COLS = 4
const ROWS = 3
const X = (c) => (c - (COLS - 1) / 2) * PX
const Y = (r) => (r - (ROWS - 1) / 2) * PY
const cell = (c, r) => r * COLS + c
const FIT = [2, 1] // the machine the question was cut for

const BH = 0.34 // a machine's base
const HZ = 0.46 // where its head runs, on average
const HH = 0.5 // the head's height
const SW = 0.1 // half its stroke

const HOLE = 0.52 // the opening: a square on its corner
const W = 0.62 // half the plate
const PT = 0.14 // its thickness
const UP = 1.5 // carried
const REST = HZ + HH // stopped by a head
const SEAT = BH + 0.06 // all the way down
const BEAM = 2.12 // the bridge's underside
const BACK = 0.98 // the bridge runs this far behind the plate

// The lap, in seconds: the machines it tries, and when it is down on them.
const LIFT = 0.15
const TRY = [
  { at: [0, 2], go: 0.75, over: 1.8, down: 2.15, up: 2.55 },
  { at: [1, 0], go: 2.95, over: 4.0, down: 4.35, up: 4.75 },
]
const GO = 5.15
const OVER = 5.95
const DOWN = 6.6

/** The loop as a function of time in the lap: the plate's place. */
function loopAt(lt) {
  const path = (i, f) =>
    keys(lt, [
      [0, f(FIT)],
      [TRY[0].go, f(FIT)],
      [TRY[0].over, f(TRY[0].at), smooth],
      [TRY[1].go, f(TRY[0].at)],
      [TRY[1].over, f(TRY[1].at), smooth],
      [GO, f(TRY[1].at)],
      [OVER, f(FIT), smooth],
      [T, f(FIT)],
    ])
  return {
    x: path(0, ([c]) => X(c)),
    y: path(1, ([, r]) => Y(r)),
    z: keys(lt, [
      [0, SEAT],
      [LIFT, SEAT],
      [TRY[0].go, UP, easeInOut],
      [TRY[0].over, UP],
      [TRY[0].down, REST, easeIn],
      [TRY[0].up, REST],
      [TRY[1].go, UP, easeOut],
      [TRY[1].over, UP],
      [TRY[1].down, REST, easeIn],
      [TRY[1].up, REST],
      [GO, UP, easeOut],
      [OVER, UP],
      [DOWN, SEAT, easeInOut],
      [T, SEAT],
    ]),
  }
}

const poly = (n, r, a0 = 0) => Array.from({ length: n }, (_, i) => [r * Math.cos(((a0 + (360 * i) / n) * Math.PI) / 180), r * Math.sin(((a0 + (360 * i) / n) * Math.PI) / 180)])
const plus = (a, b) => [[a, -b], [a, b], [b, b], [b, a], [-b, a], [-b, b].slice(), [-a, b], [-a, -b], [-b, -b], [-b, -a], [b, -a], [b, -b]]

// Twelve heads, each its own shape. Only one goes through the opening, a
// square on its corner: every other head has a point past |x| + |y| = HOLE.
const HEADS = [
  ring(0, 0, 0.4, 32),
  poly(4, 0.5, 45),
  poly(3, 0.48, 60),
  plus(0.42, 0.16),
  poly(6, 0.43, 0),
  [...arc(0, -0.14, 0.42, 0, 180, 20)],
  poly(4, HOLE - 0.06, 0),
  [[0.42, -0.2], [0.42, 0.2], [-0.42, 0.2], [-0.42, -0.2]],
  [[0.4, 0.36], [-0.4, 0.36], [-0.2, -0.36], [0.2, -0.36]],
  poly(5, 0.44, 90),
  [...arc(0.16, 0, 0.26, -90, 90, 14), ...arc(-0.16, 0, 0.26, 90, 270, 14)],
  [[0.38, -0.38], [0.38, 0.38], [0.06, 0.38], [0.06, -0.06], [-0.38, -0.06], [-0.38, -0.38]],
]

const flat = (pts) => pts.map(([x, y]) => [x, -y])

export default figure({
  slug: "35-product-managers-and-agile-leads",
  title: "Twelve run, and the question fits one",
  desc: "Twelve little machines run on a tray, their heads lit teal, each a different shape. A magenta plate with one opening, carried on a bridge, has come all the way down round the one machine whose head goes through it.",
  plate: "Product managers and agile leads",
  sentence:
    "The viewer sees twelve machines running and a plate with one opening lowered on them, stopped by every head but one, which explains how to choose when everything works: the question has to do it.",
  view: { scale: 39, origin: [280, 255] },
  still: 7.8,
  build(k) {
    const hx = (COLS / 2) * PX + 0.12
    const hy = (ROWS / 2) * PY + 0.16
    k.grid("board", { at: [-hx - 1.4, -hy - 1.4, -0.28], size: [2 * hx + 2.8, 2 * hy + 2.8], step: 0.7 })
    k.block("tray", { at: [-hx - 0.4, -hy, -0.28], size: [2 * hx + 0.8, 2 * hy, 0.28], r: 0.4, layer: -3 })
    k.block("railL", { at: [-hx - 0.22, -hy + 0.35, 0], size: [0.18, 2 * hy - 0.7, 0.12], r: 0.05, layer: -0.6 })
    k.block("railR", { at: [hx + 0.04, -hy + 0.35, 0], size: [0.18, 2 * hy - 0.7, 0.12], r: 0.05, layer: 0.5 })
    k.halo("under", { at: [X(FIT[0]), Y(FIT[1]), 0.004], r: 1.5, on: 1, layer: -1 })

    // The machines.
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        const i = cell(c, r)
        const x = X(c)
        const y = Y(r)
        k.block(`base${i}`, { at: [x - 0.46, y - 0.46, 0], size: [0.92, 0.92, BH], r: 0.16 })
        k.cyl(`neck${i}`, { at: [x, y, BH], radius: 0.13, h: HZ - BH + 0.14, n: 24, bias: 0.2 })
        k.extrude(`head${i}`, { at: [x, y, HZ + HH], shape: flat(HEADS[i]), face: "+z", depth: HH, bias: 0.4, sharp: 30 })
      }

    // The bridge.
    k.group("bridge", { at: [0, 0, 0] })
    k.block("legL", { at: [-hx - 0.23, -BACK - 0.1, 0.12], size: [0.2, 0.2, BEAM - 0.12], r: 0.05, parent: "bridge", layer: -0.5 })
    k.block("legR", { at: [hx + 0.03, -BACK - 0.1, 0.12], size: [0.2, 0.2, BEAM - 0.12], r: 0.05, parent: "bridge", layer: 1 })
    k.block("beam", { at: [-hx - 0.3, -BACK - 0.11, BEAM], size: [2 * hx + 0.6, 0.22, 0.18], r: 0.06, parent: "bridge", layer: 1.01 })
    k.group("trolley", { at: [0, 0, 0], parent: "bridge" })
    k.block("slider", { at: [-0.3, -BACK - 0.18, BEAM - 0.1], size: [0.6, 0.36, 0.42], r: 0.08, parent: "trolley", layer: 1.02 })
    k.group("tool", { at: [0, 0, 0], parent: "trolley" })
    k.block("bar", { at: [-0.12, -BACK + 0.18, 0], size: [0.24, 0.18, 2.3], r: 0.04, parent: "tool", layer: 1.05 })

    // The question: a plate with one opening, in two pieces so that a head can stand in it.
    const h = HOLE
    k.extrude("askB", {
      at: [0, 0, PT],
      shape: flat([[W, 0], [h, 0], [0, -h], [-h, 0], [0, h], [0, W], [-W, W], [-W, -W], [W, -W]]),
      face: "+z",
      depth: PT,
      parent: "tool",
      role: "accent",
      layer: 1.1,
    })
    k.extrude("askF", { at: [0, 0, PT], shape: flat([[W, 0], [W, W], [0, W], [0, h], [h, 0]]), face: "+z", depth: PT, parent: "tool", role: "accent", layer: 1.3 })
  },
  tick(t, s, input) {
    const { p, groups } = s
    // The pointer asks of one machine.
    const at = input.onPlane ? input.onPlane(0.5) : null
    let aim = null
    if (at) {
      const c = Math.round(at[0] / PX + (COLS - 1) / 2)
      const r = Math.round(at[1] / PY + (ROWS - 1) / 2)
      if (c >= 0 && c < COLS && r >= 0 && r < ROWS && Math.abs(at[0] - X(c)) < 0.72 && Math.abs(at[1] - Y(r)) < 0.75) aim = [c, r]
      else if (s.aim && Math.abs(at[0]) < (COLS / 2) * PX + 0.2 && Math.abs(at[1]) < (ROWS / 2) * PY + 0.2) aim = s.aim
    }
    s.aim = aim
    if (aim && !input.still) s.held = true
    else if (!aim && s.held && s.q) {
      // Let go: it goes back to the one it fits, and the lap goes on from there.
      aim = FIT
      if (input.still || (Math.abs(s.q.x - X(FIT[0])) + Math.abs(s.q.y - Y(FIT[1])) < 0.02 && s.q.z < SEAT + 0.02)) {
        s.held = false
        s.shift = t - (DOWN + 0.6)
        aim = null
      }
    }
    const lt = cycle(input.still ? t : t - (s.shift || 0), T) * T
    const L = loopAt(lt)

    let { x, y, z } = L
    const stop = (c, r) => (c === FIT[0] && r === FIT[1] ? SEAT : REST)
    if (aim && input.still) {
      x = X(aim[0])
      y = Y(aim[1])
      z = stop(...aim)
    } else if (!input.still) {
      const fast = { k: 4000, c: 126 }
      const q = s.q || L
      const tx = aim ? X(aim[0]) : L.x
      const ty = aim ? Y(aim[1]) : L.y
      const off = Math.hypot(q.x - tx, q.y - ty)
      const high = q.z > UP - 0.12
      // It crosses only when it is up, and comes down only when it is there.
      const move = !aim || high || off < 0.02
      x = input.spring("x", move ? tx : q.x, aim ? { k: 60, c: 15.5 } : fast)
      y = input.spring("y", move ? ty : q.y, aim ? { k: 60, c: 15.5 } : fast)
      z = input.spring("z", aim ? (off < 0.06 ? stop(...aim) : UP) : L.z, aim ? { k: 80, c: 18 } : fast)
      if (aim) z = Math.max(z, off < 0.06 ? stop(...aim) : Math.min(q.z, REST))
      s.q = { x, y, z }
    }

    groups.bridge.off[1] = y
    groups.trolley.off[0] = x
    groups.tool.off[2] = z

    // Twelve plungers, running. The one under the plate is held by it.
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        const i = cell(c, r)
        const fit = c === FIT[0] && r === FIT[1]
        const under = clamp(1 - Math.hypot(x - X(c), y - Y(r)) / 0.5)
        const ph = ((c * 5 + r * 7 + 5) % 12) / 12
        const run = SW * Math.sin(2 * Math.PI * cycle(t, BEAT, ph))
        const free = fit ? 1 : 1 - under * clamp((UP - z) / (UP - REST - 0.1))
        const head = p[`head${i}`]
        head.off[2] = run * free
        head.on = 2
        head.glow = 0.1
        if (fit && under > 0.2) {
          head.layer = 1.2
          p[`neck${i}`].layer = 1.15
        }
      }

    const down = clamp((REST - z) / (REST - SEAT))
    const b = input.still ? 0.5 : breathe(t, 2.6)
    p.askB.glow = 0.1 + down * (0.28 + 0.1 * b)
    p.askF.glow = 0.05 + down * 0.1
    p.under.glow = 0.95 * down

    s.state = down > 0.9 ? "fits" : z < REST + 0.04 ? "stopped" : aim ? "ask" : lt > TRY[0].go ? "ask" : "rest"
  },
  readout: (s) => s.state || "rest",
})
