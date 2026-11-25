// Chapter 27, Difficult people: labels on the machine, a collar on the stroke.
//
// A striker runs on two rails: a body with a rod, the rod through a fixed
// yoke, a head at its tip. Across its way a belt brings blocks in line, one
// step per beat. On every beat the striker knocks the block in front of it out
// of line, and the belt carries the block on as it was left, so the belt keeps
// a record of the last strokes.
//
// Between the beats a cap is set on the body, then a second, then a third:
// labels, blank because the word does not matter. They ride along and the
// record does not change; every block is out by the same amount. Then the one
// loose thing on the rod, the collar, slides forward, to where the act
// happens, and locks. Now the collar meets the yoke before the head meets the
// block. From that beat on the blocks stay in line, under the same three caps.
//
// Light: magenta is the collar, once it is set on the act. Teal is each block
// that stays in line because of it. The caps never light.
//
// The pointer sets the collar along the rod, and the next strokes leave the
// blocks out by exactly what it allows. Back over the body it sets the caps
// instead, as many as fit: nothing changes.

import { clamp, easeIn, easeInOut, easeOut, figure, keys, lerp, ring } from "../lib/iso/core.js"

const BEAT = 1.2 // seconds from stroke to stroke
const BEATS = 8 // to a lap: four long strokes, then four short
const PITCH = 0.96 // the belt's step
const UP = 2 // blocks on their way to the striker
const DOWN = 5 // and past it
const N = UP + DOWN + 2

// Along the stroke (+x), at rest.
const ZR = 0.74 // the rod's height
const BODY0 = -3.25
const BODY1 = -1.72
const BZ = 0.14 // on the rails
const BH = 0.98
const HEAD0 = 0.78
const HEAD1 = 1.06
const YOKE0 = 0.08
const YOKE1 = 0.34
const LINE = 1.36 // the near face of a block in line
const SIZE = 0.74
const GAP = LINE - HEAD1
const FULL = 1.22 // the stroke
const COL_W = 0.36
const COL_R = 0.46
const PARK = BODY1 + COL_W // the collar's front when it is against the body
const SET = YOKE0 - GAP + 0.04 // ...and where the stroke ends just short of the line
const STUB = 0.25
const STUBS = 6
const DECK = 0.1
const CAPS = 3
const CAP_H = 0.27

// Within a beat: the belt steps, something is set, the stroke, the return.
const STEP = 0.34
const HIT0 = 0.66
const HIT1 = 0.76
const REST = 0.86
const HOME = 1.12

const mod = (a, n) => ((a % n) + n) % n
const flat = (pts) => pts.map(([x, y]) => [x, -y])
const soft = (pts, r, steps = 6) => {
  const out = []
  const n = pts.length
  for (let i = 0; i < n; i++) {
    const [a, b, c] = [pts[(i - 1 + n) % n], pts[i], pts[(i + 1) % n]]
    const to = (p) => {
      const l = Math.hypot(p[0] - b[0], p[1] - b[1])
      const k = Math.min(b[2] ?? r, l / 2) / l
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

/** How far out the stroke is, 0..1, at time `u` within its beat. */
const strokeAt = (u) =>
  keys(u, [
    [0, 0],
    [HIT0, 0],
    [HIT1, 1, easeIn],
    [REST, 1],
    [HOME, 0, easeInOut],
    [BEAT, 0],
  ])
/** The belt's place in steps at time `t`: it moves at the start of each beat. */
const beltAt = (t) => {
  const n = Math.floor(t / BEAT)
  return n - 1 + easeInOut(clamp((t - n * BEAT) / STEP))
}
/** In the lap, what beat `n` does to its block. */
const outBy = (n) => (mod(n, BEATS) < 4 ? FULL - GAP : 0)

export default figure({
  slug: "27-difficult-people",
  title: "Three caps change nothing, one collar does",
  desc: "A striker on two rails carries three blank caps stacked on its body. Its rod runs through a yoke toward a belt of blocks. The blocks furthest along the belt stand out of line, all by the same amount. A magenta collar, slid along the rod to the yoke, now stops the stroke short, and the last three blocks, teal, are still in line.",
  plate: "Difficult people",
  sentence:
    "The viewer sees a striker knock block after block out of line under one, two, three caps, and stop short once a collar is moved along its rod, which explains why a label changes nothing: only something set on the act itself can.",
  view: { scale: 39, origin: [260, 206] },
  still: 8,
  build(k) {
    k.grid("board", { at: [-3.6, -3.4, -0.28], size: [8.4, 9.1], step: 0.7 })
    const X1 = 3.72
    const Y0 = -(UP + 0.62) * PITCH
    const Y1 = (DOWN + 0.35) * PITCH
    const plan = soft(
      [
        [-4.05, -1.0],
        [0.85, -1.0, 0.25],
        [0.85, Y0],
        [X1, Y0],
        [X1, Y1],
        [0.85, Y1],
        [0.85, 1.0, 0.25],
        [-4.05, 1.0],
      ],
      0.36
    )
    k.extrude("base", { at: [0, 0, 0], shape: flat(plan), face: "+z", depth: 0.28, layer: -3 })
    ;[
      [-3.82, -0.78],
      [-3.82, 0.78],
    ].forEach(([x, y], j) => k.led(`screw${j}`, { at: [x, y, 0.002], face: "+z", r: 0.06, layer: -2 }))

    // The belt: a deck, slats that step with the blocks, the line they came in.
    k.block("deck", { at: [1.12, Y0 + 0.2, 0], size: [X1 - 1.12 - 0.22, Y1 - Y0 - 0.4, DECK], r: 0.1, layer: -2.2 })
    for (let i = 0; i < N; i++) k.detail(`slat${i}`, { pts: [[1.16, 0, DECK + 0.002], [2.2, 0, DECK + 0.002], [X1 - 0.26, 0, DECK + 0.002]], layer: -2.1 })
    k.guide("line", { pts: [[LINE + SIZE, Y0 + 0.22, DECK + 0.004], [LINE + SIZE, 1, DECK + 0.004], [LINE + SIZE, Y1 - 0.22, DECK + 0.004]], layer: -2 })
    k.halo("inLine", { at: [LINE + SIZE / 2, PITCH, DECK + 0.004], r: 1.9, on: 2, layer: -1.5 })
    k.halo("colFloor", { at: [YOKE0 - 0.1, 0.1, 0.004], r: 1.1, on: 1, layer: -1 })

    // The rails and the stop behind.
    for (const [j, y] of [-0.5, 0.5].entries()) k.block(`rail${j}`, { at: [-3.75, y - 0.08, 0], size: [3.6, 0.16, BZ], r: 0.05, layer: 0.1 + j * 0.02 })
    k.block("heel", { at: [-3.7, -0.72, 0], size: [0.3, 1.44, 0.5], r: 0.1, layer: 0.2 })

    // The striker. Its parts move together.
    k.group("st", { at: [0, 0, 0] })
    k.block("body", { at: [BODY0, -0.72, BZ], size: [BODY1 - BODY0, 1.44, BH], r: 0.16, parent: "st", layer: 0.4 })
    for (let i = 0; i < 3; i++) {
      const x = BODY0 + 0.45 + i * 0.22
      k.detail(`vent${i}`, { pts: [[x, 0.722, 0.42], [x, 0.722, 0.6], [x, 0.722, 0.8]], parent: "st", layer: 0.42 })
    }
    k.extrude("gland", { at: [BODY1 + 0.06, 0, ZR], shape: ring(0, 0, 0.27, 32), face: "+x", depth: 0.06, parent: "st", layer: 0.44 })
    // The caps: labels, blank. They sit on the body and ride with it.
    for (let i = 0; i < CAPS; i++) {
      const z = BZ + BH + i * (CAP_H + 0.02)
      k.group(`cap${i}`, { at: [0, 0, 0], parent: "st" })
      k.block(`slab${i}`, { at: [BODY0 - 0.08, -0.8, z], size: [BODY1 - BODY0 + 0.16, 1.6, CAP_H], r: 0.2, parent: `cap${i}`, layer: 0.5 + i * 0.04 })
      const q = (y0, y1, z0, z1) => [[0, y0, z0], [0, y1, z0], [0, y1, z1], [0, y0, z1]]
      k.face(`tag${i}`, { at: [BODY1 + 0.083, 0, z], pts: q(-0.42, 0.42, 0.06, CAP_H - 0.06), role: "glass", parent: `cap${i}`, layer: 0.51 + i * 0.04 })
    }

    // The yoke, fixed: a saddle the rod slides on and a post behind it.
    k.block("yokeFoot", { at: [YOKE0 - 0.12, -0.78, 0], size: [YOKE1 - YOKE0 + 0.24, 1.46, 0.12], r: 0.08, layer: 0.9 })
    k.block("yokeB", { at: [YOKE0, -0.66, 0.12], size: [YOKE1 - YOKE0, 0.46, 1.1], r: 0.06, layer: 1 })
    k.block("saddle", { at: [YOKE0, -0.2, 0.12], size: [YOKE1 - YOKE0, 0.74, ZR - 0.13 - 0.12], r: 0.06, layer: 1.05 })
    k.extrude("rod", { at: [HEAD0, 0, ZR], shape: ring(0, 0, 0.13, 28), face: "+x", depth: HEAD0 - BODY1 - 0.06, parent: "st", layer: 1.1 })
    // The collar: loose on the rod until it is set.
    k.group("col", { at: [0, 0, 0], parent: "st" })
    k.extrude("collar", { at: [PARK, 0, ZR], shape: ring(0, 0, COL_R, 48), face: "+x", depth: COL_W, parent: "col", layer: 1.2 })
    k.detail("collarSeam", { pts: ring(0, 0, 0.3, 32).concat([[0.3, 0]]).map(([y, z]) => [PARK + 0.004, y, ZR + z]), parent: "col", layer: 1.22 })
    // The rod again, ahead of the collar, painted over it: one length for each
    // stretch of the collar's way, every one ending inside the head.
    for (let i = 0; i < STUBS; i++) {
      const len = HEAD0 + 0.015 - PARK - i * STUB
      k.extrude(`ahead${i}`, { at: [PARK + len, 0, ZR], shape: ring(0, 0, 0.13, 28), face: "+x", depth: len, parent: "col", layer: 1.25 })
    }
    k.cyl("screw", { at: [PARK - COL_W / 2, 0, ZR + COL_R - 0.03], radius: 0.08, h: 0.17, n: 20, parent: "col", layer: 1.24 })
    k.extrude("head", { at: [HEAD1, 0, ZR - 0.06], shape: ring(0, 0, 0.32, 36), face: "+x", depth: HEAD1 - HEAD0, parent: "st", layer: 1.5 })

    // The blocks on the belt.
    for (let i = 0; i < N; i++) k.block(`b${i}`, { at: [LINE, -SIZE / 2, DECK], size: [SIZE, SIZE, SIZE], r: 0.12, layer: 2 })
  },
  tick(t, s, input) {
    const { p, groups } = s
    const beat = Math.floor(t / BEAT)
    const u = t - beat * BEAT
    const n = mod(beat, BEATS)
    const lap = n * BEAT + u
    const live = !input.still && input.dt > 0

    // The lap: a cap before beats 1, 2 and 3; the collar before beat 4; both
    // off again after the last stroke.
    const END = BEATS * BEAT
    const capL = [0, 1, 2].map((i) =>
      keys(lap, [
        [0, 0],
        [(i + 1) * BEAT + 0.12, 0],
        [(i + 1) * BEAT + 0.56, 1, easeOut],
        [END - 0.3, 1],
        [END, 0, easeInOut],
      ])
    )
    const setL = keys(lap, [
      [0, 0],
      [4 * BEAT - 0.06, 0],
      [4 * BEAT + 0.58, 1, easeInOut],
      [END - 0.3, 1],
      [END, 0, easeInOut],
    ])

    // The pointer sets the collar along the rod, or the caps on the body.
    const a = input.onPlane ? input.onPlane(ZR) : null
    const over = !!a && a[0] > -4.4 && a[0] < 4 && Math.abs(a[1]) < (a[0] > 0.9 ? 5.2 : 1.7)
    const onBody = over && a[0] < BODY1 + 0.05
    const m = input.tween("ptr", over ? 1 : 0, { dur: 0.4 })
    const aimC = over && !onBody ? clamp(a[0], PARK, YOKE0 - 0.12) : PARK
    const colP = input.spring("col", over ? aimC : lerp(PARK, SET, setL))
    const col = lerp(lerp(PARK, SET, setL), colP, m)
    const reach = Math.min(FULL, YOKE0 - col)
    const k = strokeAt(u)
    const ext = reach * k
    groups.st.off[0] = ext
    groups.col.off[0] = col - PARK
    const set = clamp((col - PARK - 0.25) / 0.3)
    const stub = clamp(Math.floor((col - PARK) / STUB), 0, STUBS - 1)
    for (let i = 0; i < STUBS; i++) p[`ahead${i}`].hide = i !== stub

    for (let i = 0; i < CAPS; i++) {
      const c = lerp(capL[i], input.tween(`cap${i}`, onBody ? 1 : 0, { dur: 0.35 + i * 0.22 }), m)
      groups[`cap${i}`].off[2] = (1 - c) * 1.1
      p[`slab${i}`].fade = p[`tag${i}`].fade = clamp(c * 2.2)
      p[`slab${i}`].hide = p[`tag${i}`].hide = c < 0.02
    }

    const snug = set > 0.5 && reach < FULL - 0.05
    const bump = snug ? k : 0
    p.collar.on = p.screw.on = p.collarSeam.on = set > 0.4 ? 1 : 0
    p.collar.glow = set * (0.32 + 0.25 * bump)
    p.colFloor.glow = set * (0.45 + 0.35 * bump)

    // The record: each beat leaves its block where the stroke put it.
    if (!s.rec) s.rec = new Map()
    if (live) {
      const left = Math.max(0, reach - GAP)
      if (k > 0.98) s.rec.set(beat, left)
      else if (u > REST && !s.rec.has(beat)) s.rec.set(beat, left)
      for (const key of s.rec.keys()) if (Math.abs(key - beat) > N) s.rec.delete(key)
    } else s.rec.clear()
    const belt = beltAt(t)
    let inLine = 0
    for (let j = 0; j < N; j++) {
      // The block whose beat is `own`: it stands before the striker when the belt has gone `own` steps.
      const own = beat + UP + 1 - j
      const id = mod(own, N)
      const y = (belt - own) * PITCH
      const d = own < beat ? s.rec.get(own) ?? outBy(own) : own === beat ? (u < HIT0 ? 0 : s.rec.get(own) ?? Math.max(0, ext - GAP, u > HIT1 ? reach - GAP : 0)) : 0
      const b = p[`b${id}`]
      b.off[0] = d
      b.off[1] = y
      const f = clamp((y / PITCH + UP + 0.45) / 0.4) * clamp((DOWN + 0.42 - y / PITCH) / 0.4)
      b.fade = f
      b.hide = f < 0.02
      const held = (own < beat || (own === beat && u > HIT1 - 0.01)) && d < 0.06
      b.on = held && f > 0.3 ? 2 : 0
      b.glow = held ? 0.22 * f : 0
      if (held && y > -0.5) inLine++
      const sl = p[`slat${id}`]
      sl.off[1] = y + PITCH / 2
      sl.hide = f < 0.1 || y / PITCH > DOWN - 0.2
      sl.fade = f
    }
    p.inLine.glow = clamp(inLine / 2) * 0.55

    const capN = [0, 1, 2].filter((i) => !p[`slab${i}`].hide && p[`slab${i}`].fade > 0.9).length
    s.state = snug ? (reach <= GAP ? "in line" : "shorter") : capN ? `${capN} label${capN > 1 ? "s" : ""}` : "no label"
  },
  readout: (s) => s.state || "rest",
})
