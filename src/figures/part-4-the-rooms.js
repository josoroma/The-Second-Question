// Part IV, The rooms: one floor plan on one module grid. Low walls divide a
// plinth into ten rooms of different sizes; each wall is one solid run, so the
// rooms on either side share it. The second question, the cube from the cover,
// waits outside, then hops into each room in the order of the part: where it
// lands the floor lights magenta, the room it left turns teal, and the door in
// the one wall they share stands open. It holds in the last room, leaves by the
// second door and slides back along the outside to start again.

import { arc, clamp, cycle, easeIn, easeInOut, easeOut, figure, keys, lerp, smooth } from "../lib/iso/core.js"

const T = 10 // seconds per lap
const H = 0.36 // wall height
const WE = 0.2 // outside wall thickness
const WI = 0.13 // inside wall thickness, centred on its module line
const e2 = WE / 2
const i2 = WI / 2
const G = 0.8 // door width
const TL = 0.05 // door leaf thickness
const HL = 0.3 // door leaf height
const AJAR = 16 // degrees a door rests open
const CUBE = 0.5 // the cube's side
const HOV = 0.55 // the cube's height in flight: clear of every wall
const X1 = 10 // the plan is X1 by Y1 modules
const Y1 = 7
const M = 1 // the plinth's margin round the plan
const OUT = 0.55 // the cube waits this far past the outer wall line
const RV = 0.4 // the plinth's corner radius

// The lap: a short wait outside, eleven hops of F seconds with a rest of R in
// each room and a longer hold in the last, out again, and back along the outside.
const F = 0.3
const R = 0.5
const HOLD = 1.2
const WAIT = 0.2
const on = (i) => WAIT + F + (R + F) * Math.min(i, 9) + (i > 9 ? HOLD + F : 0) // the cube lands in room i; on(10) is outside
const BACK = on(10) + 0.15 // it sets off back along the outside
const MAG = 0.66 // the current room's floor (the room it left: TEAL)
const TEAL = 0.44

// The plan: x runs right and down, y left and down. The tour comes in on the
// right, turns round the hall in the middle and leaves on the right.
const ROOMS = [
  { name: "meeting", x0: 7, x1: 10, y0: 4, y1: 7 },
  { name: "explanation", x0: 5, x1: 7, y0: 5, y1: 7 },
  { name: "update", x0: 2, x1: 5, y0: 5, y1: 7 },
  { name: "presentation", x0: 2, x1: 7, y0: 2, y1: 5 },
  { name: "demo", x0: 0, x1: 2, y0: 2, y1: 7 },
  { name: "pitch", x0: 0, x1: 3, y0: 0, y1: 2 },
  { name: "sale", x0: 3, x1: 5, y0: 0, y1: 2 },
  { name: "brief", x0: 5, x1: 8, y0: 0, y1: 2 },
  { name: "page", x0: 8, x1: 10, y0: 0, y1: 2 },
  { name: "across borders", x0: 7, x1: 10, y0: 2, y1: 4 },
]

// Every wall once, as solid runs: a run ends only at a door or where it meets
// another wall, never at a cut. [runs along, its line, from, to, thickness].
const RUNS = [
  ["y", 0, -e2, Y1 + e2, WE],
  ["y", X1, -e2, 2.6, WE],
  ["y", X1, 3.4, 5.1, WE],
  ["y", X1, 5.9, Y1 + e2, WE],
  ["x", 0, e2, X1 - e2, WE],
  ["x", Y1, e2, X1 - e2, WE],
  ["x", 2, e2, 0.6, WI],
  ["x", 2, 1.4, 8.6, WI],
  ["x", 2, 9.4, X1 - e2, WI],
  ["x", 4, 7 + i2, X1 - e2, WI],
  ["x", 5, 2 + i2, 3.1, WI],
  ["x", 5, 3.9, 7 - i2, WI],
  ["y", 2, 2 + i2, 3.1, WI],
  ["y", 2, 3.9, Y1 - e2, WI],
  ["y", 7, 2 + i2, 5.6, WI],
  ["y", 7, 6.4, Y1 - e2, WI],
  ["y", 5, 5 + i2, 5.6, WI],
  ["y", 5, 6.4, Y1 - e2, WI],
  ["y", 3, e2, 0.6, WI],
  ["y", 3, 1.4, 2 - i2, WI],
  ["y", 5, e2, 0.6, WI],
  ["y", 5, 1.4, 2 - i2, WI],
  ["y", 8, e2, 0.6, WI],
  ["y", 8, 1.4, 2 - i2, WI],
]
// [x0, y0, x1, y1] of each run.
const BOXES = RUNS.map(([a, l, f, to, w]) => (a === "x" ? [f, l - w / 2, to, l + w / 2] : [l - w / 2, f, l + w / 2, to]))

/**
 * Paint order of the runs, far to near. Two upright boxes overlap on screen
 * when their spans of x - y, y - z and x - z all overlap; where they do, the
 * one wholly on the low side of the other along x or y is behind it.
 */
function paintOrder(boxes) {
  const spans = ([x0, y0, x1, y1]) => [
    [x0 - y1, x1 - y0],
    [y0 - H, y1],
    [x0 - H, x1],
  ]
  const S = boxes.map(spans)
  const meet = (a, b) => S[a].every(([lo, hi], k) => Math.min(hi, S[b][k][1]) - Math.max(lo, S[b][k][0]) > 1e-6)
  const behind = (a, b) => boxes[a][2] <= boxes[b][0] + 1e-6 || boxes[a][3] <= boxes[b][1] + 1e-6
  const n = boxes.length
  const next = boxes.map(() => [])
  const need = boxes.map(() => 0)
  for (let a = 0; a < n; a++)
    for (let b = 0; b < n; b++)
      if (a !== b && meet(a, b) && behind(a, b)) {
        next[a].push(b)
        need[b]++
      }
  const depth = (i) => boxes[i][0] + boxes[i][1] + boxes[i][2] + boxes[i][3]
  const rank = new Array(n)
  const ready = []
  for (let i = 0; i < n; i++) if (!need[i]) ready.push(i)
  for (let r = 0; r < n; r++) {
    if (!ready.length) throw new Error("part-4-the-rooms: the wall runs have no paint order")
    ready.sort((a, b) => depth(a) - depth(b))
    const i = ready.shift()
    rank[i] = r
    for (const j of next[i]) if (!--need[j]) ready.push(j)
  }
  return rank
}
const RANK = paintOrder(BOXES)

// Door k joins room k-1 to room k: [the wall runs along, its line, where the gap starts].
const DOORS = [
  ["y", 7, 5.6],
  ["y", 5, 5.6],
  ["x", 5, 3.1],
  ["y", 2, 3.1],
  ["x", 2, 0.6],
  ["y", 3, 0.6],
  ["y", 5, 0.6],
  ["y", 8, 0.6],
  ["x", 2, 8.6],
]

const CENTRES = ROOMS.map((r) => [(r.x0 + r.x1) / 2, (r.y0 + r.y1) / 2])
const INLET = [X1 + OUT, 5.5] // outside the way in (the gap at y 5.1-5.9)
const OUTLET = [X1 + OUT, 3.0] // outside the way out (the gap at y 2.6-3.4)
const mid = ([a, l, f]) => (a === "y" ? [l, f + G / 2] : [f + G / 2, l])
const VIA = [[X1, INLET[1]], ...DOORS.map(mid), [X1, OUTLET[1]]]
// Hop k (0 in, 1..9 the doors, 10 out) as a path in plan.
const HOPS = VIA.map((v, k) => [k === 0 ? INLET : CENTRES[k - 1], v, k === 10 ? OUTLET : CENTRES[k]])

const roomAt = (x, y) => ROOMS.findIndex((r) => x >= r.x0 && x < r.x1 && y >= r.y0 && y < r.y1)

/** A point s (0..1) of the way along a polyline, by length. */
function along(pts, s) {
  const lens = [0]
  for (let i = 1; i < pts.length; i++) lens.push(lens[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const d = clamp(s) * lens[lens.length - 1]
  let i = 1
  while (i < pts.length - 1 && lens[i] < d) i++
  const k = (d - lens[i - 1]) / Math.max(1e-9, lens[i] - lens[i - 1])
  return [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]
}

/** Where the loop's cube is at u seconds into the lap: [x, y, z]. It lifts, crosses, lands. */
function tourCube(u) {
  if (u < on(0) - F) return [...INLET, 0]
  for (let k = 0; k <= 10; k++) {
    const land = on(k)
    if (u > land) continue
    const lift = land - F
    if (u < lift) return [...CENTRES[k - 1], 0] // resting in the room before
    const tau = u - lift
    const [x, y] = along(HOPS[k], smooth((tau - 0.03) / 0.22))
    return [x, y, HOV * Math.min(easeOut(tau / 0.07), 1 - easeIn((tau - 0.22) / 0.08))]
  }
  return [OUTLET[0], lerp(OUTLET[1], INLET[1], easeInOut((u - BACK) / (T - BACK))), 0]
}
const loopVelocity = (u) => {
  const a = tourCube((u - 0.004 + T) % T)
  const b = tourCube((u + 0.004) % T)
  return [0, 1, 2].map((i) => (b[i] - a[i]) / 0.008)
}
// Where the loop's cube rests, and when (loop time): [x, y, from, to].
const RESTS = [[...INLET, 0, on(0) - F], ...CENTRES.map((c, k) => [...c, on(k), on(k + 1) - F]), [...OUTLET, on(10), BACK]]
/** The first place the loop's cube will be resting at least `lead` seconds after t (u in the lap), in absolute times. */
function nextRest(t, u, lead) {
  let best = null
  for (const [x, y, a, b] of RESTS)
    for (const lap of [0, T]) {
      const tA = t + a + lap - u
      const tB = t + b + lap - u
      if (tB >= t + lead + 0.1 && (!best || tA < best.tA)) best = { pt: [x, y], room: roomAt(x, y), tA, tB }
    }
  return best
}
/** The last landing before u: 0..9 a room, 10 outside again, -1 not yet. */
const lastLanding = (u) => {
  let k = -1
  for (let i = 0; i <= 10; i++) if (on(i) <= u) k = i
  return k
}

/**
 * The loop's light in room i: null while dark. Magenta from the landing; teal
 * once the cube lands in the next room; dark as it lifts off from that one.
 */
function tourLight(i, u) {
  const a = on(i)
  const b = on(i + 1)
  if (u < a) return null
  if (u < b) return { on: 1, fade: MAG * easeOut((u - a) / 0.18) }
  const off = i < 9 ? on(i + 2) - F : T - 0.5
  if (u >= off + 0.25) return null
  return { on: 2, fade: lerp(MAG, TEAL, easeOut((u - b) / 0.25)) * (1 - smooth((u - off) / 0.25)) }
}

/** How open door k is (0 ajar, 1 open): open as the cube lifts for it, shut as it lifts off again. */
const tourDoor = (k, u) =>
  keys(u, [
    [on(k) - F - 0.3, 0],
    [on(k) - F, 1, easeOut],
    [on(k + 1) - F, 1],
    [on(k + 1) - F + 0.3, 0, easeInOut],
  ])

// ---------------------------------------------------------------- the pointer's flight

/** Door k joins rooms k - 1 and k; -1 when two rooms share no door. */
const doorBetween = (a, b) => (a >= 0 && b >= 0 && Math.abs(a - b) === 1 ? Math.max(a, b) : -1)
/** Just past door k, inside room `into`. */
function pastDoor(k, into) {
  const [a, l] = DOORS[k - 1]
  const [mx, my] = VIA[k]
  const c = CENTRES[into]
  return a === "y" ? [l + Math.sign(c[0] - l) * 0.35, my] : [mx, l + Math.sign(c[1] - l) * 0.35]
}
/** Where the cube's centre may go below the wall tops: inside room i, clear of its walls (i = -1: the outside strip). */
function floorBox(i) {
  const g = CUBE / 2 + 0.02
  if (i < 0) return [X1 + e2 + g, -M + g, X1 + M - g, Y1 + M - g]
  const r = ROOMS[i]
  return [
    r.x0 + (r.x0 === 0 ? e2 : i2) + g,
    r.y0 + (r.y0 === 0 ? e2 : i2) + g,
    r.x1 - (r.x1 === X1 ? e2 : i2) - g,
    r.y1 - (r.y1 === Y1 ? e2 : i2) - g,
  ]
}
/**
 * One small step of the cube toward goal { pt, z, room, door, from }. Springs
 * carry its speed from one choice to the next; it pulls across only once it
 * is up, and below the wall tops it cannot leave the room it is in.
 */
function fly(s, goal, h, t) {
  const [x, y, z] = s.c
  const v = s.v
  const cur = roomAt(x, y)
  const same = cur === goal.room
  const aim = !same && cur >= 0 && cur === goal.from && goal.door > 0 ? pastDoor(goal.door, goal.room) : goal.pt
  const near = Math.hypot(goal.pt[0] - x, goal.pt[1] - y) < 0.3
  // Coming down it aims a little below the floor, so it lands rather than settles.
  const zT = same && (near || z < 0.02) ? (goal.z > 0.001 ? goal.z : -0.08) : HOV
  const grip = same ? 1 : smooth((z - 0.12) / (HOV - 0.2))
  v[0] += (-100 * grip * (x - aim[0]) - 18 * v[0]) * h
  v[1] += (-100 * grip * (y - aim[1]) - 18 * v[1]) * h
  v[2] += (-160 * (z - zT) - 24 * v[2]) * h
  let nx = x + v[0] * h
  let ny = y + v[1] * h
  let nz = z + v[2] * h
  if (nz < H + 0.03) {
    const [a, b, c, d] = floorBox(cur)
    if (nx < a || nx > c) {
      nx = clamp(nx, a, c)
      v[0] = 0
    }
    if (ny < b || ny > d) {
      ny = clamp(ny, b, d)
      v[1] = 0
    }
  }
  if (nz <= 0) {
    if (z > 0) {
      s.landT = t
      s.home = roomAt(nx, ny)
    }
    nz = 0
    v[2] = Math.max(0, v[2])
  }
  s.c = [nx, ny, nz]
}

export default figure({
  slug: "part-4-the-rooms",
  title: "The rooms",
  desc: "An isometric floor plan on one module grid: low walls divide a plinth into ten rooms of different sizes, each wall shared by the rooms on either side. A magenta cube has landed in the central hall, whose floor is lit magenta; the room it came from is lit teal, and the door in the wall they share stands open.",
  plate: "Part IV · The rooms",
  sentence:
    "The viewer sees one cube hop through every room of a floor plan, each floor lighting as it lands, which explains Part IV: ten different rooms on one module, each wall shared, the same question entering each.",
  view: { scale: 24, origin: [249, 113] },
  still: Math.round((on(3) + 0.35) * 100) / 100, // the cube has landed in the hall: 3.25 s
  build(k) {
    // The drawing board, dotted on the module, and the plinth the plan stands on.
    k.grid("board", { at: [-4, -4, -0.4], size: [18, 15], step: 1 })
    k.block("plate", { at: [-M, -M, -0.4], size: [X1 + 2 * M, Y1 + 2 * M, 0.4], r: RV, steps: 8, layer: -3 })
    // A reveal all round the plinth. The near half is drawn over it; the far
    // half lies under it, hidden in the iso view and seen when the figure turns.
    const A = [-M + RV, Y1 + M - RV]
    const B = [X1 + M - RV, Y1 + M - RV]
    const C = [X1 + M - RV, -M + RV]
    const D = [-M + RV, -M + RV]
    const lift = (pts) => pts.map(([x, y]) => [x, y, -0.17])
    k.detail("reveal", { pts: lift([...arc(...A, RV, 135, 90, 4), ...arc(...B, RV, 90, 0, 8), ...arc(...C, RV, 0, -45, 4)]), layer: -2 })
    k.detail("reveal-far", { pts: lift([...arc(...C, RV, -45, -90, 4), ...arc(...D, RV, -90, -180, 8), ...arc(...A, RV, 180, 135, 4)]), layer: -3.5 })

    // The module, on the floor under every room and measured along the plinth's
    // two left sides, a longer tick wherever a wall meets the outside wall.
    const lines = (n, len, P) => {
      const pts = []
      for (let i = 1; i < n; i++) pts.push(...(i % 2 ? [P(i, 0), P(i, len)] : [P(i, len), P(i, 0)]))
      return pts
    }
    k.detail("module-x", { pts: lines(X1, Y1, (i, v) => [i, v, 0.004]), layer: -2.5 })
    k.detail("module-y", { pts: lines(Y1, X1, (i, v) => [v, i, 0.004]), layer: -2.5 })
    const rule = (n, walls, P) => {
      const pts = []
      for (let i = 0; i <= n; i++) {
        const l = walls.includes(i) ? 0.16 : 0.08
        pts.push(P(i, 0), P(i, -l), P(i, l), P(i, 0))
      }
      return pts
    }
    k.detail("rule-x", { pts: rule(X1, [0, 2, 5, 7, 10], (i, d) => [i, Y1 + 0.6 + d, 0]), layer: -2 })
    k.detail("rule-y", { pts: rule(Y1, [0, 2, 7], (i, d) => [-0.6 + d, i, 0]), layer: -2 })

    // The floors: one face per room, dark until the cube or the pointer lights it.
    ROOMS.forEach((r, i) => {
      const ax = r.x0 + (r.x0 === 0 ? e2 : i2)
      const bx = r.x1 - (r.x1 === X1 ? e2 : i2)
      const ay = r.y0 + (r.y0 === 0 ? e2 : i2)
      const by = r.y1 - (r.y1 === Y1 ? e2 : i2)
      const cx = (ax + bx) / 2
      const cy = (ay + by) / 2
      k.face(`floor${i}`, {
        at: [cx, cy, 0.01],
        pts: [
          [ax - cx, ay - cy, 0],
          [ax - cx, by - cy, 0],
          [bx - cx, by - cy, 0],
          [bx - cx, ay - cy, 0],
        ],
        layer: -2,
        hide: true,
      })
    })
    // The cube's light on the floor under it.
    k.halo("spill", { at: [...CENTRES[3], 0], r: 1.05, layer: -1, on: 1 })

    // The walls: one block per run, painted far to near (each run its own layer).
    BOXES.forEach(([x0, y0, x1, y1], i) =>
      k.block(`wall${i}`, { at: [x0, y0, 0], size: [x1 - x0, y1 - y0, H], r: 0, layer: -0.9 + (0.8 * RANK[i]) / (BOXES.length - 1) })
    )

    // The doors: a leaf hung on the jamb that comes first, swinging toward the viewer.
    const len = G - TL / 2 - 0.03
    DOORS.forEach(([dir, line, from], i) => {
      const id = `door${i + 1}`
      if (dir === "x") {
        k.group(id, { at: [from + TL / 2, line, 0] })
        k.block(`leaf${i + 1}`, { at: [0, -TL / 2, 0], size: [len, TL, HL], r: 0, parent: id })
      } else {
        k.group(id, { at: [line, from + TL / 2, 0] })
        k.block(`leaf${i + 1}`, { at: [-TL / 2, 0, 0], size: [TL, len, HL], r: 0, parent: id })
      }
    })

    // The second question: one cube, above every wall when it moves, so it
    // paints over them (layer 1); it only comes down in the middle of a room.
    k.group("carry", { at: [0, 0, 0] })
    k.block("cube", { at: [-CUBE / 2, -CUBE / 2, 0], size: [CUBE, CUBE, CUBE], r: 0.1, role: "accent", parent: "carry", layer: 1 })
    return { mode: "loop", goal: -1, prev: -1, door: -1, home: -1, rest: null, c: [...INLET, 0], v: [0, 0, 0], landT: -9, state: "rest" }
  },
  tick(t, s, input) {
    const { p, groups } = s
    const u = cycle(t, T) * T
    const still = !!input.still
    const dt = still ? 0 : Math.min(0.05, input.dt || 0)
    const loop = tourCube(u)
    const landing = lastLanding(u)
    const loopHome = landing >= 0 && landing < 10 ? landing : -1

    // The pointer chooses a room on the floor plane (fixed, so the choice never
    // follows anything that moves). The cube flies there, through the shared
    // door when the room is next door; the room lights, the room it left turns teal.
    const q = input.onPlane ? input.onPlane(0) : null
    const hover = q ? roomAt(q[0], q[1]) : -1
    if (hover >= 0) {
      if (s.mode === "loop") s.home = loopHome
      if (s.mode !== "point" || hover !== s.goal) {
        s.prev = s.home !== hover ? s.home : -1
        s.door = doorBetween(s.prev, hover)
        s.goal = hover
      }
      s.mode = "point"
    } else if (s.mode === "point") {
      // Let go: it flies to the first place the loop's cube will rest in time, and the loop takes over there.
      s.mode = still ? "loop" : "return"
      s.rest = nextRest(t, u, 0.75)
    }

    // The cube: on the loop, or flying (to the chosen room, or back to the loop).
    let landed = 1 // seconds since it last came down (for the glow it gives on landing)
    if (s.mode === "point" && still) {
      s.c = [...CENTRES[s.goal], 0]
      s.v = [0, 0, 0]
      s.home = s.goal
    } else if (s.mode === "loop") {
      s.c = loop.slice()
      s.v = loopVelocity(u)
      if (landing >= 0) landed = u - on(landing)
    } else {
      if (s.mode === "return" && t > s.rest.tB) s.rest = nextRest(t, u, 0.5)
      const goal =
        s.mode === "point"
          ? { pt: CENTRES[s.goal], z: 0, room: s.goal, door: s.door, from: s.prev }
          : { pt: s.rest.pt, z: 0, room: s.rest.room, door: -1, from: -1 }
      const n = Math.max(1, Math.ceil(dt / (1 / 240)))
      for (let i = 0; i < n; i++) fly(s, goal, dt / n, t)
      landed = t - s.landT
      // Back on the loop once both rest on the same spot.
      if (s.mode === "return" && t >= s.rest.tA && Math.hypot(s.c[0] - loop[0], s.c[1] - loop[1], s.c[2] - loop[2]) < 0.03 && Math.hypot(...s.v) < 0.3)
        s.mode = "loop"
    }
    const [x, y, z] = s.c
    groups.carry.off[0] = x
    groups.carry.off[1] = y
    groups.carry.off[2] = z
    p.cube.glow = still ? 0.4 : 0.4 + 0.45 * (1 - easeOut(landed / 0.5))
    // Its light on the floor, only over the plan: gone by the time it is past the outer wall.
    const past = Math.max(x - X1, -x, y - Y1, -y)
    p.spill.at[0] = x
    p.spill.at[1] = y
    p.spill.glow = (0.35 + 0.6 * clamp(1 - z / HOV)) * (1 - smooth((past + 0.2) / 0.35))

    // The floors: the loop's light and the pointer's cross-fade.
    const w = input.tween("ptr", s.mode === "point" ? 1 : 0)
    ROOMS.forEach((_r, i) => {
      const m = MAG * input.tween(`m${i}`, s.mode === "point" && s.goal === i ? 1 : 0)
      const n = TEAL * input.tween(`n${i}`, s.mode === "point" && s.prev === i ? 1 : 0)
      const L = tourLight(i, u)
      let light = L ? { on: L.on, fade: L.fade * (1 - w) } : { on: 0, fade: 0 }
      if (m > light.fade && m >= n) light = { on: 1, fade: m }
      else if (n > light.fade) light = { on: 2, fade: n }
      if (light.fade < 0.01) return
      const f = p[`floor${i}`]
      f.hide = false
      f.on = light.on
      f.fade = clamp(light.fade)
    })

    // The doors: the loop's, or the one between the room it left and the one it is going to.
    DOORS.forEach(([dir], i) => {
      const k = i + 1
      const loopOpen = tourDoor(k, u)
      const sprung = clamp(input.spring(`d${i}`, s.mode === "point" ? (s.door === k ? 1 : 0) : loopOpen))
      const open = s.mode === "loop" ? loopOpen : sprung
      groups[`door${k}`].rz = (dir === "x" ? 1 : -1) * lerp(AJAR, 90, open)
    })

    if (s.mode === "point") s.state = ROOMS[s.goal].name
    else s.state = loopHome >= 0 ? ROOMS[loopHome].name : "rest"
  },
  readout: (s) => s.state || "rest",
})
