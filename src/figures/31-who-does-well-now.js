// Chapter 31, Who does well now: the draft, and the six things it left out.
//
// A finished plate lies in a six-sided curb, flush and smooth. Nothing holds
// it: a push from below lifts it straight out, and only then do the six empty
// sockets in its edge show, each of a different shape. Round it stand six
// keys, one to a side, each cut to one socket; now that the gaps can be seen,
// they light. The plate comes down and they go in one at a time, through the
// curb and into its edge. Round them runs a ring with six gates. A key that is
// still out stands in its gate and stops the ring; when the sixth is home the
// ring turns behind all six, and the same push no longer moves the plate.
//
// Light: teal is the draft (what came first, what was given). Magenta is what
// it left out and somebody supplies: the six keys, from the moment the empty
// sockets are seen. At rest only those glow.
//
// The pointer leaves one out: aim at a side and the ring opens, that key draws
// back into its gate, and the ring can't close again. Aim at the plate and all
// six draw back and it lifts off.

import { breathe, clamp, cycle, easeIn, easeInOut, easeOut, figure, keys, ring, rrect, smooth } from "../lib/iso/core.js"

const T = 10 // seconds per lap
const DEG = Math.PI / 180
const C30 = Math.cos(Math.PI / 6)

// Six sides, in the order the keys come in; the last one faces the viewer.
const A0 = 30
const SIDES = [60, 120, 180, 240, 300, 0].map((a) => A0 + a)
const NAMES = ["framer", "calibrator", "system reader", "strategist", "problem-solver", "translator"]
const near = (a) => Math.cos(a * DEG) + Math.sin(a * DEG) > 0

// The plate and its curb (apothems), and their heights.
const AP = 1.46
const CURB0 = AP + 0.05
const CURB1 = AP + 0.35
const CURB_H = 0.88
const PLATE_H = 0.96
const LIFT = 1.4
const KZ = 0.46 // the height of the sockets' centres

// A key: one bar of its own profile, with a collar that comes to rest on the
// curb. The travel takes its nose clear of the curb.
const BITE = 0.5 // how far the nose stands in the plate
const R_COL = CURB1 + 0.01 // where the collar rests
const COL = 0.14 // the collar
const COL_W = 0.82
const GRIP = 0.52 // the bar outside it
const R_END = R_COL + COL + GRIP
const SHAFT = R_COL - (AP - BITE) // the bar inside it
const TRAVEL = 1.12

// The ring and its gates.
const R0 = R_END + 0.07
const R1 = R0 + 0.34
const RING_H = 0.36
const GATE = 10.6 // half a gate, degrees
const TURN = 30

const KEY = ["shaft", "collar", "grip"]
const BASE = 3.8 // the base's apothem

/** A closed ring with its corners rounded by quadratic curves. */
const soft = (pts, r, steps = 8) => {
  const out = []
  const n = pts.length
  for (let i = 0; i < n; i++) {
    const a = pts[(i - 1 + n) % n]
    const b = pts[i]
    const c = pts[(i + 1) % n]
    const to = (p) => {
      const l = Math.hypot(p[0] - b[0], p[1] - b[1])
      const k = Math.min(r, l / 2) / l
      return [b[0] + (p[0] - b[0]) * k, b[1] + (p[1] - b[1]) * k]
    }
    const s = to(a)
    const e = to(c)
    for (let j = 0; j <= steps; j++) {
      const t = j / steps
      out.push([
        (1 - t) * (1 - t) * s[0] + 2 * t * (1 - t) * b[0] + t * t * e[0],
        (1 - t) * (1 - t) * s[1] + 2 * t * (1 - t) * b[1] + t * t * e[1],
      ])
    }
  }
  return out
}
/** A hexagon whose sides face the six keys. */
const hex = (ap) => SIDES.map((a) => a).sort((a, b) => a - b).map((a) => [(ap / C30) * Math.cos((a + 30) * DEG), (ap / C30) * Math.sin((a + 30) * DEG)])
const flip = (pts) => pts.map(([x, y]) => [x, -y])
const polar = (r, a) => [r * Math.cos(a * DEG), r * Math.sin(a * DEG)]

// Six profiles: a key's, and the socket's it is cut to.
const c = 0.11
const PROFILES = [
  [[-0.32, -0.24], [0.32, -0.24], [0, 0.31]],
  ring(0, 0, 0.28, 32),
  rrect(-0.28, -0.25, 0.28, 0.25, 0.02),
  [[0, -0.32], [0.32, 0], [0, 0.32], [-0.32, 0]],
  Array.from({ length: 19 }, (_, i) => [0.31 * Math.cos((i / 18) * Math.PI), -0.17 + 0.4 * Math.sin((i / 18) * Math.PI)]),
  [[-c, -0.31], [c, -0.31], [c, -c], [0.31, -c], [0.31, c], [c, c], [c, 0.31], [-c, 0.31], [-c, c], [-0.31, c], [-0.31, -c], [-c, -c]],
]

// The lap, in seconds.
const UP = 0.4
const OPEN = 1.2 // lifted
const DOWN = 2.8
const KEY0 = 3.55 // the first key starts
const EACH = 0.5
const KEY_T = 0.46
const LOCK = KEY0 + 5 * EACH + KEY_T + 0.12 // the ring starts
const LOCKED = LOCK + 0.55
const PUSH = LOCKED + 0.35 // the push comes again
const UNLOCK = 9.0
const BACK = 9.4

export default figure({
  slug: "31-who-does-well-now",
  title: "Six sockets, seen when it lifts",
  desc: "A smooth six-sided teal plate has been lifted out of its curb and shows empty sockets in its edge, each of a different shape: a triangle, a cross, a half round. Six magenta keys of the same shapes stand round it, one to a side, in the gates of a ring that can close only when all six are in.",
  plate: "Who does well now",
  sentence:
    "The viewer sees a finished plate lift off with six empty sockets in its edge, six different keys come in to fill them and a ring close behind the sixth so that the plate holds, which explains why answering for a draft means supplying what it left out.",
  view: { scale: 40, origin: [280, 214] },
  still: 2.4,
  build(k) {
    k.grid("board", { at: [-4.9, -4.9, -0.45], size: [9.8, 9.8], step: 0.7 })
    k.extrude("base", { at: [0, 0, 0], shape: flip(soft(hex(BASE), 0.6)), face: "+z", depth: 0.45, layer: -5 })
    const lip = soft(hex(BASE - 0.2), 0.5)
    k.detail("lip", { pts: [...lip, lip[0]].map(([x, y]) => [x, y, 0.002]), layer: -4.5 })
    // The groove the ring turns in.
    k.face("groove", { at: [0, 0, 0.002], pts: ring(0, 0, R1 + 0.06, 72).map(([x, y]) => [x, y, 0]), role: "recess", layer: -4 })
    k.face("island", { at: [0, 0, 0.003], pts: ring(0, 0, R0 - 0.06, 72).map(([x, y]) => [x, y, 0]), layer: -3.9 })
    k.halo("spill", { at: [0, 0, 0.004], r: 3.3, on: 1, layer: -1 })
    SIDES.forEach((a, i) => {
      const [x, y] = polar((BASE - 0.36) / C30 - 0.1, a + 30)
      k.led(`screw${i}`, { at: [x, y, 0.003], face: "+z", r: 0.075, layer: -4 })
    })

    // The push: three stages, one in another, under the plate.
    ;[0.62, 0.5, 0.38].forEach((r, i) => k.cyl(`stage${i}`, { at: [0, 0, -0.45], radius: r, h: 0.45, n: 40, layer: 1.4 + i * 0.01 }))
    k.face("pocket", { at: [0, 0, 0.004], pts: hex(CURB0).map(([x, y]) => [x, y, 0]), role: "recess", layer: 0.9 })
    k.halo("under", { at: [0, 0, 0.006], r: 1.2, on: 2, layer: 1.2 })

    // The plate.
    k.group("draft", { at: [0, 0, 0] })
    k.extrude("plate", { at: [0, 0, PLATE_H], shape: flip(hex(AP)), face: "+z", depth: PLATE_H, role: "accent2", parent: "draft", layer: 2 })
    const seam = hex(AP - 0.13)
    k.detail("seam", { pts: [...seam, seam[0]].map(([x, y]) => [x, y, PLATE_H + 0.002]), parent: "draft", on: 2, layer: 2.1 })

    SIDES.forEach((a, i) => {
      const front = near(a)
      const at = (r, u, z) => {
        // a point on side i: r along the key, u across it (to the right, seen from outside)
        const x = r * Math.cos(a * DEG) + u * Math.sin(a * DEG)
        const y = r * Math.sin(a * DEG) - u * Math.cos(a * DEG)
        return [x, y, z]
      }
      const mark = (id, r, o) => k.face(id, { pts: PROFILES[i].map(([u, v]) => at(r, u * 1.06, KZ + v * 1.06)), role: "recess", ...o })

      // The socket in the plate's edge.
      mark(`socket${i}`, AP + 0.003, { parent: "draft", layer: front ? 2.05 : 1.95 })
      // This side of the curb, with the key's way through it.
      const w0 = CURB0 / C30
      const w1 = CURB1 / C30
      const wall = [polar(w0, a - 30), polar(w1, a - 30), polar(w1, a + 30), polar(w0, a + 30)]
      k.extrude(`curb${i}`, { at: [0, 0, CURB_H], shape: flip(wall), face: "+z", depth: CURB_H, layer: front ? 3 : 1 })
      mark(`port${i}`, CURB1 + 0.003, { layer: front ? 3.05 : 0.95 })
      mark(`hole${i}`, CURB0 - 0.003, { layer: front ? 2.95 : 1.05 })

      // The key's way over the base.
      k.face(`way${i}`, {
        pts: [at(CURB1 + 0.06, COL_W / 2 + 0.05, 0.005), at(BASE - 0.24, COL_W / 2 + 0.05, 0.005), at(BASE - 0.24, -COL_W / 2 - 0.05, 0.005), at(CURB1 + 0.06, -COL_W / 2 - 0.05, 0.005)],
        layer: -3.8,
      })
      // The key.
      k.group(`key${i}`, { at: [0, 0, 0] })
      k.extrude(`shaft${i}`, { at: [R_COL, 0, KZ], shape: PROFILES[i], face: "+x", depth: SHAFT, parent: `key${i}`, layer: front ? 4 : 0.5 })
      k.block(`collar${i}`, { at: [R_COL, -COL_W / 2, 0.03], size: [COL, COL_W, 2 * KZ - 0.06], r: 0.06, parent: `key${i}`, layer: front ? 4 : 0.5 })
      k.extrude(`grip${i}`, { at: [R_END, 0, KZ], shape: PROFILES[i], face: "+x", depth: GRIP, parent: `key${i}`, layer: front ? 4 : 0.5 })

      // The ring's walls between the gates.
      k.group(`ring${i}`, { at: [0, 0, 0] })
      const arcPts = []
      for (let j = 0; j <= 14; j++) arcPts.push(polar(R1, GATE + (j / 14) * (60 - 2 * GATE)))
      for (let j = 14; j >= 0; j--) arcPts.push(polar(R0, GATE + (j / 14) * (60 - 2 * GATE)))
      k.extrude(`tooth${i}`, { at: [0, 0, RING_H], shape: flip(arcPts), face: "+z", depth: RING_H, sharp: 40, parent: `ring${i}`, layer: 0.5 })
    })
  },
  tick(t, s, input) {
    const { p, groups } = s
    const lt = cycle(t, T) * T

    // The lap: lift, show the sockets, down; six keys; the ring; the push again.
    const loopLift = keys(lt, [[0, 0], [UP, 0], [OPEN, 1, easeInOut], [DOWN, 1], [DOWN + 0.7, 0, easeInOut], [T, 0]])
    const loopKey = (i) => {
      const a = KEY0 + i * EACH
      return keys(lt, [[0, 0], [a, 0], [a + KEY_T, 1, easeInOut], [BACK, 1], [BACK + 0.5, 0, easeInOut], [T, 0]])
    }
    const loopRing = keys(lt, [[0, 0], [LOCK, 0], [LOCKED, 1, easeInOut], [UNLOCK, 1], [UNLOCK + 0.4, 0, easeInOut], [T, 0]])
    const loopSeen = keys(lt, [[0, 0], [OPEN - 0.2, 0], [OPEN + 0.65, 1, (u) => u], [BACK, 1], [BACK + 0.3, 0], [T, 0]])
    const loopNudge = keys(lt, [[0, 0], [PUSH, 0], [PUSH + 0.14, 1, easeOut], [PUSH + 0.34, 1], [PUSH + 0.5, 0, easeIn], [T, 0]])

    // The pointer leaves one out, or looks under the plate: fixed sectors.
    const at = input.onPlane ? input.onPlane(0.4) : null
    let pick = null // 0..5 a side, 6 the plate
    if (at) {
      const r = Math.hypot(at[0], at[1])
      if (r < AP + 0.1) pick = 6
      else if (r < BASE + 0.3) {
        const a = Math.atan2(at[1], at[0]) / DEG
        pick = SIDES.findIndex((b) => Math.cos((a - b) * DEG) > C30 - 1e-9)
        if (pick < 0) pick = null
      }
    }

    // Where the machine is now: on the lap, or wherever the pointer has taken it.
    const L = { v: SIDES.map((_, i) => loopKey(i)), lift: loopLift, r: loopRing, seen: loopSeen }
    let q = L
    if (input.still) {
      if (pick !== null) q = { v: SIDES.map((_, i) => (pick === i || pick === 6 ? 0 : 1)), lift: pick === 6 ? 1 : 0, r: pick === 6 ? 0 : 0.1, seen: 1 }
    } else if (pick !== null || s.m) {
      const m = s.m || (s.m = { ...L, v: L.v.slice() })
      const dt = Math.min(input.dt || 0, 0.05)
      const go = (x, to, rate) => x + clamp((to - x) * (1 - Math.exp(-dt * 10)), -rate * dt, rate * dt)
      const want = pick === null ? L : { v: SIDES.map((_, i) => (pick === i || pick === 6 ? 0 : 1)), lift: pick === 6 ? 1 : 0, r: pick === 6 ? 0 : 1, seen: 1 }
      const sum = m.v.reduce((n, v) => n + v, 0)
      // The ring closes only on six keys: against one that is out it comes up
      // short. A key moves only while the ring is open, and goes in only once
      // the plate is down; the plate rises only with every key clear of it.
      const all = sum > 5.95 && want.v.every((v) => v > 0.95)
      m.r = go(m.r, all ? want.r : want.r > 0.5 && sum > 0.5 && sum < 5.95 ? 0.11 * breathe(t, 1.6) : 0, 2.2)
      m.lift = go(m.lift, sum < 1.5 ? want.lift : 0, 1.7)
      m.v = m.v.map((v, i) => (m.r > 0.15 || (want.v[i] > v && m.lift > 0.03) ? v : go(v, want.v[i], 2.4)))
      m.seen = go(m.seen, want.seen, 3)
      q = m
      const off = Math.max(Math.abs(m.r - L.r), Math.abs(m.lift - L.lift), Math.abs(m.seen - L.seen), ...m.v.map((v, i) => Math.abs(v - L.v[i])))
      if (pick === null && off < 0.02) s.m = null
    }

    let out = 0
    for (let i = 0; i < 6; i++) {
      const v = q.v[i]
      groups[`key${i}`].rz = SIDES[i]
      const d = (1 - v) * TRAVEL
      for (const id of KEY) p[id + i].off[0] = d
      // Where the shaft goes into the curb it is out of sight (the 3D view hides it by itself).
      p[`shaft${i}`].depth = clamp(R_COL + d - (CURB1 + 0.004), 0.006, SHAFT)
      const lit = clamp(q.seen * 6 - i)
      for (const id of KEY) p[id + i].on = lit > 0.5 ? 1 : 0
      p[`grip${i}`].glow = lit * (0.14 + 0.16 * smooth(clamp((v - 0.9) / 0.1)))
      out += 1 - v
    }
    const held = smooth(clamp(1 - out / 0.1))
    const r = q.r
    const lift = q.lift

    const b = input.still ? 0.5 : breathe(t, 3)
    for (let i = 0; i < 6; i++) {
      const g = groups[`ring${i}`]
      const a0 = i * 60 + A0 + r * TURN
      g.rz = a0
      p[`tooth${i}`].layer = near(a0 + 30) ? 4 : 0.5
    }
    const dz = lift * LIFT + loopNudge * 0.07 * (s.m ? 0 : 1)
    groups.draft.off[2] = dz
    ;[1, 2, 3].forEach((n, i) => {
      p[`stage${i}`].off[2] = Math.min(dz, (n * LIFT) / 3) + (dz > 0.01 ? 0.004 * i : 0)
      p[`stage${i}`].hide = dz < 0.06
    })
    p.plate.glow = 0.16
    p.under.glow = 0.7 * clamp(dz)
    p.spill.glow = held * (0.5 + 0.35 * r + 0.1 * b)

    const n = Math.round(6 - out)
    s.state = pick === 6 ? "six left out" : pick !== null ? `no ${NAMES[pick]}` : r > 0.9 ? "it holds" : lift > 0.5 ? "six left out" : n >= 6 ? "six" : n > 0 && lt > KEY0 && lt < BACK ? NAMES[Math.min(5, n - 1)] : "the draft"
  },
  readout: (s) => s.state || "rest",
})
