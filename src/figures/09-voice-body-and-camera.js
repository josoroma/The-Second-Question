// Chapter 9, Voice, body and camera: one outline, three causes.
//
// Three windows stand side by side, each with a small lens over it. Before
// each stands a solid: a wedge, a drum, a block. All three are equally wide
// and equally tall, so what each window shows of its solid, its outline
// carried straight across to the glass, is the same rectangle. No window can
// say which solid is behind it. On the near side a groove runs past all three,
// with a spur to each. The question, the cube, runs along it, turns in at one
// solid and touches it, and that solid lights: which one it was. The window
// has not changed.
//
// The outlines are true: every solid is W wide across the windows and H tall,
// and the dashed lines carry its edges square onto the glass.
//
// Light: teal is what reached the windows, three outlines, one shape. Magenta
// is the question and the solid that answers it.
//
// The pointer asks, or only looks: over the floor the cube goes to that solid
// and it answers; over a window there is nothing more to see.

import { breathe, clamp, cycle, easeInOut, easeOut, figure, keys, ring, rrect } from "../lib/iso/core.js"

const T = 9 // seconds per lap
const W = 1.3 // every solid's width across the windows
const H = 1.2 // and height
const PITCH = 2.4
const LANE = [-PITCH, 0, PITCH] // the solids' centres along the windows
const NAME = ["wedge", "round", "square"]
const ORDER = [1, 0, 2] // which one each lap asks
const PANE = -2.45 // the windows' faces
const WALL = 7.3 // the screen's length
const WIN_W = 2.0 // and each window's
const WIN_H = 2.1
const Q = 0.52 // the question's size
const MAIN = 2.15 // the groove's line
const NEAR = W / 2 + Q / 2 // where the question touches a solid
const DOCK = 3.45 // where it waits, at the end of the groove

/** The groove: a line past the three solids with a spur to each, as [x, y]. */
function groove() {
  const g = 0.32
  const x1 = MAIN + g
  const x0 = MAIN - g
  const xs = W / 2 + 0.08
  const pts = [
    [x1, -PITCH - g],
    [x1, DOCK + g],
    [x0, DOCK + g],
  ]
  for (const y of [PITCH, 0, -PITCH]) {
    pts.push([x0, y + g], [xs, y + g], [xs, y - g])
    if (y > -PITCH) pts.push([x0, y - g])
  }
  return pts
}

/**
 * What the pointer is over, on fixed shapes: a solid or its stretch of floor
 * ({ ask }), or a window ({ look }). Nothing here moves.
 */
function aim(input) {
  const a = input.onPlane ? input.onPlane(0) : null
  const b = input.onPlane ? input.onPlane(1) : null
  if (!a || !b) return null
  const d = [b[0] - a[0], b[1] - a[1]]
  const band = (y) => (y < -PITCH / 2 ? 0 : y < PITCH / 2 ? 1 : 2)
  // A solid: the ray enters its box somewhere between the floor and its top.
  let best = null
  LANE.forEach((ly, i) => {
    let t0 = 0
    let t1 = H
    for (const [o, dd, c] of [
      [a[0], d[0], 0],
      [a[1], d[1], ly],
    ]) {
      if (Math.abs(dd) < 1e-9) {
        if (Math.abs(o - c) > W / 2) t1 = -1
        continue
      }
      const u = (c - W / 2 - o) / dd
      const v = (c + W / 2 - o) / dd
      t0 = Math.max(t0, Math.min(u, v))
      t1 = Math.min(t1, Math.max(u, v))
    }
    if (t0 <= t1 && (!best || t1 > best.t)) best = { i, t: t1 }
  })
  if (best) return { ask: best.i }
  if (a[0] > PANE && a[0] < 2.9 && a[1] > -3.85 && a[1] < 4.2) return { ask: band(a[1]) }
  if (Math.abs(d[0]) > 1e-9) {
    const z = (PANE - a[0]) / d[0]
    const y = a[1] + d[1] * z
    if (z >= 0 && z < WIN_H + 0.1 && Math.abs(y) < WALL / 2 + 0.1) return { look: band(y) }
  }
  return null
}

export default figure({
  slug: "09-voice-body-and-camera",
  title: "One outline, three causes",
  desc: "Three windows stand in a row and all show the same teal rectangle. In front of each stands the solid it comes from, and the three are different: a wedge, a drum and a block, equally wide and equally tall. A magenta cube, the question, has run along a groove to the drum and touches it, and the drum is lit.",
  plate: "Voice, body and camera",
  sentence:
    "The viewer sees three different solids show the same outline in three windows, and one of them light up only when the cube goes over and touches it, which explains reading a face on a screen: one look can have many causes, and only asking finds out which.",
  view: { scale: 33, origin: [284, 246] },
  still: 5.6,
  build(k) {
    k.grid("board", { at: [-5.2, -6.2, -0.3], size: [10.4, 12.4], step: 0.7 })
    k.block("base", { at: [-3.05, -3.85, -0.3], size: [5.95, 8.05, 0.3], r: 0.45, layer: -3 })
    const lip = rrect(-2.85, -3.65, 2.7, 4.0, 0.3)
    k.detail("lip", { pts: [...lip, lip[0]].map(([x, y]) => [x, y, 0.002]), layer: -2.5 })
    k.face("groove", { at: [0, 0, 0.003], pts: groove().map(([x, y]) => [x, y, 0]), role: "recess", layer: -2 })
    ;[
      [-2.7, 3.85],
      [2.55, 3.85],
      [2.55, -3.5],
    ].forEach(([x, y], j) => k.led(`screw${j}`, { at: [x, y, 0.003], face: "+z", r: 0.075, layer: -2 }))
    k.halo("qspill", { at: [MAIN, DOCK, 0.004], r: 1.1, on: 1, layer: -1 })

    // One screen, three windows in it.
    k.block("wall", { at: [PANE - 0.3, -WALL / 2, 0], size: [0.3, WALL, WIN_H], r: 0.12, layer: 0 })
    LANE.forEach((y, i) => {
      const l = 0.02 + i * 0.01
      k.face(`glass${i}`, {
        at: [PANE + 0.004, y, 0],
        pts: [[0, WIN_W / 2, 0.03], [0, -WIN_W / 2, 0.03], [0, -WIN_W / 2, WIN_H - 0.26], [0, WIN_W / 2, WIN_H - 0.26]],
        role: "glass",
        layer: l + 0.002,
      })
      // What reaches the glass: the solid's outline, at its true size.
      k.face(`shape${i}`, {
        at: [PANE + 0.012, y, H / 2],
        pts: [[0, W / 2, -H / 2 + 0.03], [0, -W / 2, -H / 2 + 0.03], [0, -W / 2, H / 2], [0, W / 2, H / 2]],
        on: 2,
        layer: l + 0.004,
      })
      k.halo(`wash${i}`, { at: [PANE + 0.75, y, 0.004], r: 0.95, on: 2, layer: -1 })
      // The outline carried square from the solid's widest edges to the glass.
      const x = i === 1 ? 0 : -W / 2
      for (const [j, sy] of [-W / 2, W / 2].entries()) {
        k.guide(`top${i}${j}`, { pts: [[PANE + 0.02, y + sy, H], [(PANE + x) / 2, y + sy, H], [x, y + sy, H]], layer: 0.1 })
        k.guide(`floor${i}${j}`, { pts: [[PANE + 0.02, y + sy, 0.004], [(PANE + x) / 2, y + sy, 0.004], [x, y + sy, 0.004]], layer: 0.09 })
      }
    })

    // The solids: equally wide across the windows, equally tall, and nothing else alike.
    k.extrude("solid0", { at: [0, LANE[0] + W / 2, 0], face: "+y", shape: [[-W / 2, 0], [W / 2, 0], [W / 2, 0.1], [-W / 2 + 0.1, H], [-W / 2, H]], depth: W, layer: 0.2 })
    k.cyl("solid1", { at: [0, LANE[1], 0], radius: W / 2, h: H, n: 64, layer: 0.21 })
    k.block("solid2", { at: [-W / 2, LANE[2] - W / 2, 0], size: [W, W, H], r: 0.1, layer: 0.22 })

    // A line scored on each, set in from its top: the differences a window drops.
    const closed = (pts) => [...pts, pts[0]]
    const slope = (u, y) => [-W / 2 + 0.1 + (W - 0.1) * u + 0.002, y, H - (H - 0.1) * u + 0.003]
    const in0 = LANE[0] - W / 2 + 0.16
    const in1 = LANE[0] + W / 2 - 0.16
    k.detail("score0", { pts: closed([slope(0.12, in0), slope(0.12, in1), slope(0.9, in1), slope(0.9, in0)]), layer: 0.205 })
    k.detail("score1", { pts: closed(ring(0, LANE[1], W / 2 - 0.16, 48)).map(([x, y]) => [x, y, H + 0.003]), layer: 0.215 })
    k.detail("score2", { pts: closed(rrect(-W / 2 + 0.16, LANE[2] - W / 2 + 0.16, W / 2 - 0.16, LANE[2] + W / 2 - 0.16, 0.06)).map(([x, y]) => [x, y, H + 0.003]), layer: 0.225 })

    // The question, and where it waits.
    k.group("q", { at: [MAIN, DOCK, 0] })
    k.block("cube", { at: [-Q / 2, -Q / 2, 0.01], size: [Q, Q, Q], r: 0.12, role: "accent", parent: "q", layer: 0.4 })
  },
  tick(t, s, input) {
    const { p, groups } = s
    const tl = input.still ? t : t - (s.shift || 0)
    const lap = cycle(tl, T)
    const turn = ((Math.floor(tl / T) % ORDER.length) + ORDER.length) % ORDER.length
    const lane = ORDER[turn]

    // The lap: the outlines come on, one after another and all the same; the
    // question runs along, turns in and touches one solid; that one lights.
    let shapes = LANE.map((_, i) =>
      keys(lap, [
        [0, 0],
        [0.02 + i * 0.045, 0],
        [0.06 + i * 0.045, 1, easeOut],
        [0.955, 1],
        [0.99, 0],
      ])
    )
    const along = keys(lap, [
      [0, 0],
      [0.26, 0],
      [0.37, 1, easeInOut],
      [0.86, 1],
      [0.955, 0, easeInOut],
    ])
    let into = keys(lap, [
      [0, 0],
      [0.385, 0],
      [0.455, 1, easeInOut],
      [0.79, 1],
      [0.85, 0, easeInOut],
    ])
    let y = DOCK + (LANE[lane] - DOCK) * along
    let lit = LANE.map((_, i) => (i === lane ? keys(lap, [[0, 0], [0.45, 0], [0.475, 1, easeOut], [0.79, 1], [0.82, 0]]) : 0))

    const at = aim(input)
    const ask = at && at.ask !== undefined ? at.ask : null
    const look = at && at.look !== undefined ? at.look : null
    if (input.still) {
      if (ask !== null) {
        y = LANE[ask]
        into = 1
        lit = LANE.map((_, i) => (i === ask ? 1 : 0))
      } else if (look !== null) {
        y = DOCK
        into = 0
        lit = LANE.map(() => 0)
      }
    } else {
      if (at && !s.ptr) s.ptr = { y, into }
      const live = !!s.ptr
      const sp = live ? { k: 80, c: 17.9 } : { k: 4000, c: 126 }
      let toY = y
      let toI = into
      if (live) {
        // Out of a spur before it runs along, and in only once it is in line.
        const goal = ask !== null ? LANE[ask] : DOCK
        const inLine = Math.abs(s.ptr.y - goal) < 0.05
        toI = inLine && ask !== null ? 1 : 0
        toY = inLine || s.ptr.into < 0.05 ? goal : s.ptr.y
      }
      y = input.spring("y", toY, sp)
      into = clamp(input.spring("into", toI, sp))
      const touch = live ? LANE.findIndex((ly) => Math.abs(y - ly) < 0.06 && into > 0.95) : -1
      const litLoop = lit
      lit = LANE.map((_, i) => input.spring(`lit${i}`, live ? (touch === i ? 1 : 0) : litLoop[i], live ? { k: 160, c: 25 } : { k: 4000, c: 126 }))
      shapes = shapes.map((v, i) => clamp(input.spring(`shape${i}`, live ? 1 : v, live ? { k: 80, c: 17.9 } : { k: 4000, c: 126 })))
      if (live) {
        s.ptr = { y, into }
        // Let go: the question goes back to its dock, and the loop takes up from there.
        if (!at && Math.abs(y - DOCK) < 0.02 && into < 0.02) {
          s.ptr = null
          s.shift = t - T * (0.2 + turn + 1)
        }
      }
    }

    const x = MAIN + (NEAR - MAIN) * into
    groups.q.off[0] = x - MAIN
    groups.q.off[1] = y - DOCK

    for (let i = 0; i < 3; i++) {
      p[`shape${i}`].fade = shapes[i]
      p[`shape${i}`].hide = shapes[i] < 0.02
      p[`shape${i}`].glow = 0.2 * shapes[i]
      p[`wash${i}`].glow = 0.5 * shapes[i]
      for (const j of [0, 1])
        for (const g of ["top", "floor"]) {
          p[`${g}${i}${j}`].fade = 0.2 + 0.8 * shapes[i]
          p[`${g}${i}${j}`].on = look === i ? 2 : 0
        }
      p[`solid${i}`].on = p[`score${i}`].on = lit[i] > 0.05 ? 1 : 0
      p[`solid${i}`].glow = 0.3 * clamp(lit[i])
    }
    p.cube.glow = 0.28 + 0.16 * (input.still ? 0.5 : breathe(t, 2.4))
    p.qspill.at[0] = x
    p.qspill.at[1] = y
    p.qspill.glow = 0.8

    const told = lit.findIndex((v) => v > 0.5)
    s.state = look !== null ? "can't tell" : told >= 0 ? NAME[told] : shapes[2] > 0.5 ? "all alike" : "rest"
  },
  readout: (s) => s.state || "rest",
})
