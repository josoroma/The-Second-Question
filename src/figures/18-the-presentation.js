// Chapter 18, The presentation: a staircase of locks, drawn on by the empty one.
//
// Five basins step down and turn a corner: the sections of a talk. One holds
// the water and a raft with the room's seats on it; the others are dry. The
// water moves only into a basin that is still empty, and only once the gate to
// it is down. First the floor of the next basin lights, a question with no
// answer in it yet; then the gate sinks, the water runs in, and the raft goes
// with it. The answer covers the question, and the basin behind is dry.
//
// In the middle basin, at the corner, no question is lit ahead. The gate
// stays up, the water stands level, and the raft stops, until the next floor
// lights and draws it on to the end.
//
// Light: magenta is the open question, the floor of the basin that still waits
// for its answer. Teal is the water: what has been answered, and carries the
// room. At rest only those glow.
//
// The pointer asks. Aimed at a basin further on, it lights the questions one
// by one and the raft is drawn down to it; aimed at the basin the raft is in,
// or one behind it, nothing is open and the raft stands still.

import { breathe, clamp, cycle, easeIn, easeInOut, figure, lerp, smooth } from "../lib/iso/core.js"

const T = 10 // seconds per lap
const N = 5
const C = 0.86 // half a basin
const WALL = 0.2
const P = 2 * C + WALL // from one basin's centre to the next
const STEP = 0.4 // each floor is this much lower
const DEEP = 0.42 // the water, when a basin is full
const RIM = 0.58 // the walls above the floor
const CENTRE = [
  [0, 0],
  [P, 0],
  [2 * P, 0], // the middle, at the corner
  [2 * P, P],
  [2 * P, 2 * P],
]
const floorZ = (i) => 0.28 + (N - 1 - i) * STEP
const RAFT = 0.5 // half the raft
const BENCHES = [-0.22, 0.24] // two rows of seats
const RIDERS = ["deck", "plank0", "plank1", ...BENCHES.flatMap((_y, j) => [`rest${j}`, `bench${j}`])]

// One leg, in seconds from the moment the next floor lights.
const ASK = 0.45 // the question has been open this long when the gate starts down
const GATE = 0.3
const FLOW = 1.05
const RUN = ASK + GATE * 0.55 // the water starts before the gate is all the way down
const ARRIVE = RUN + FLOW
const opened = (q) => smooth(clamp((q - ASK) / GATE)) * (1 - smooth(clamp((q - ARRIVE + 0.1) / 0.35)))
const flowed = (q) => easeInOut(clamp((q - RUN) / FLOW))
const asked = (q) => smooth(clamp(q / 0.25))

// The lap: when each leg starts. After the second, in the middle, nothing is asked.
const START = [0.1, 1.85, 5.4, 7.15]
const FADE = 9.45

const layerOf = (i, k) => 10 * i + k

export default figure({
  slug: "18-the-presentation",
  title: "The raft goes where a basin is still empty",
  desc: "Five square basins step down and turn a corner. The middle one, at the corner, is full of teal water and carries a raft with two rows of seats. The floor of the next basin, still dry, is lit magenta; the gate between them has sunk and the water is starting to run through, taking the raft with it. The basins behind are dry.",
  plate: "The presentation",
  sentence:
    "The viewer sees a raft stand still in the middle of a staircase of locks until the floor of the next, empty basin lights and its gate goes down, and the water runs in and draws the raft on, which explains that what keeps a room is the answer it is still waiting for.",
  view: { scale: 39.5, origin: [265, 177] },
  still: 6,
  build(k) {
    k.grid("board", { at: [-2.1, -2.1, -0.3], size: [8.4, 8.4], step: 0.7 })
    const e = C + WALL + 0.36
    const far = 2 * P
    // The plate, a chevron under the staircase.
    const r = 0.4
    const corner = (cx, cy, a0, a1) => {
      const out = []
      for (let i = 0; i <= 6; i++) {
        const a = ((a0 + ((a1 - a0) * i) / 6) * Math.PI) / 180
        out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
      }
      return out
    }
    const plate = [
      ...corner(-e + r, -e + r, 180, 270),
      ...corner(far + e - r, -e + r, 270, 360),
      ...corner(far + e - r, far + e - r, 0, 90),
      ...corner(far - e + r, far + e - r, 90, 180),
      ...corner(far - e - r, e + r, 0, -90),
      ...corner(-e + r, e - r, 90, 180),
    ]
    k.extrude("base", { at: [0, 0, 0], face: "+z", shape: plate.map(([x, y]) => [x, -y]), depth: 0.3, layer: -3 })
    ;[
      [far + e - 0.2, -e + 0.2],
      [far + e - 0.2, far + e - 0.2],
      [far - e + 0.2, far + e - 0.2],
      [-e + 0.2, e - 0.2],
    ].forEach(([x, y], j) => k.led(`screw${j}`, { at: [x, y, 0.002], face: "+z", r: 0.065, layer: -2 }))

    for (let i = 0; i < N; i++) {
      const [cx, cy] = CENTRE[i]
      const z = floorZ(i)
      const top = z + RIM
      const alongX = i < 2 // its exit is on +x
      const last = i === N - 1
      const wall = (id, x0, y0, x1, y1, layer, h = top) => k.block(id, { at: [x0, y0, 0], size: [x1 - x0, y1 - y0, h], r: 0.04, steps: 2, layer })
      const o = C + WALL
      // The walls behind: they show above the floor.
      if (i === 0) wall("end0", cx - o, cy - o, cx - C, cy + o, layerOf(i, 0))
      if (i < 3) wall(`back${i}`, cx - C, cy - o, i === 2 ? cx + o : cx + C + WALL, cy - C, layerOf(i, 0.5))
      else wall(`back${i}`, cx - o, cy - C, cx - C, cy + o, layerOf(i, 0.5))
      // The floor, and the question it can hold.
      const sx = alongX ? 0.06 : 0
      const sy = alongX || last ? 0 : 0.06
      k.block(`pier${i}`, { at: [cx - C, cy - C, 0], size: [2 * C + sx, 2 * C + sy, z], r: 0.01, steps: 1, layer: layerOf(i, 1) })
      const q = 0.1
      k.face(`ask${i}`, {
        at: [cx, cy, z + 0.003],
        pts: [
          [-C + q, -C + q, 0],
          [-C + q, C - q, 0],
          [C - q, C - q, 0],
          [C - q, -C + q, 0],
        ],
        role: "recess",
        layer: layerOf(i, 2),
      })
      k.halo(`askGlow${i}`, { at: [cx, cy, z + 0.006], r: 1.25, on: 1, layer: layerOf(i, 2.2) })
      // The water: a block as deep as the basin, sunk out of sight when it is dry.
      k.block(`water${i}`, { at: [cx - C + 0.01, cy - C + 0.01, z - DEEP], size: [2 * C - 0.02, 2 * C - 0.02, DEEP], r: 0.01, steps: 1, role: "accent2", layer: layerOf(i, 3) })
      // The gate, which sinks into the step, and the lip of the step over it.
      if (!last) {
        if (alongX) {
          k.block(`gate${i}`, { at: [cx + C + 0.06, cy - C, z - 0.02], size: [0.08, 2 * C, RIM - 0.04], r: 0.02, steps: 1, layer: layerOf(i, 7) })
          k.block(`lip${i}`, { at: [cx + C + 0.14, cy - C, 0], size: [0.06, 2 * C, z], r: 0.01, steps: 1, layer: layerOf(i, 7.2) })
          k.block(`fall${i}`, { at: [cx + C + 0.01, cy - 0.62, z - STEP], size: [0.26, 1.24, STEP + 0.07], r: 0.03, steps: 1, role: "accent2", layer: layerOf(i, 7.4) })
        } else {
          k.block(`gate${i}`, { at: [cx - C, cy + C + 0.06, z - 0.02], size: [2 * C, 0.08, RIM - 0.04], r: 0.02, steps: 1, layer: layerOf(i, 7) })
          k.block(`lip${i}`, { at: [cx - C, cy + C + 0.14, 0], size: [2 * C, 0.06, z], r: 0.01, steps: 1, layer: layerOf(i, 7.2) })
          k.block(`fall${i}`, { at: [cx - 0.62, cy + C + 0.01, z - STEP], size: [1.24, 0.26, STEP + 0.07], r: 0.03, steps: 1, role: "accent2", layer: layerOf(i, 7.4) })
        }
      }
      // The walls in front, with the level of the floor scored on them.
      const y1 = cy + o + 0.002
      const x1 = cx + o + 0.002
      if (alongX || last) k.detail(`scoreY${i}`, { pts: [[cx - (alongX && i ? C : o) + 0.06, y1, z], [cx, y1, z], [cx + (last ? C : o) - 0.06, y1, z]], layer: layerOf(i, 8.5) })
      if (!alongX) k.detail(`scoreX${i}`, { pts: [[x1, cy - (i === 2 ? o : C) + 0.06, z], [x1, cy, z], [x1, cy + o - 0.06, z]], layer: layerOf(i, 8.5) })
      if (i < 2) wall(`front${i}`, i === 0 ? cx - o : cx - C, cy + C, cx + o, cy + o, layerOf(i, 8))
      if (i === 2) {
        wall("cornerL", cx - C - WALL, cy + C, cx - C, cy + o, layerOf(i, 7.6))
        wall("front2", cx + C, cy - o, cx + o, cy + o, layerOf(i, 8))
      }
      if (i > 2) {
        if (last) wall("end1", cx - o, cy + C, cx + C, cy + o, layerOf(i, 7.8))
        wall(`front${i}`, cx + C, cy - C, cx + o, cy + o, layerOf(i, 8))
      }
    }

    // The raft, with the room's seats.
    k.group("raft", { at: [0, 0, 0] })
    k.block("deck", { at: [-RAFT, -RAFT, 0], size: [2 * RAFT, 2 * RAFT, 0.14], r: 0.12, parent: "raft" })
    for (const [j, v] of [-0.02, 0.46].entries()) k.detail(`plank${j}`, { pts: [[-RAFT + 0.06, v, 0.142], [0, v, 0.142], [RAFT - 0.06, v, 0.142]], parent: "raft" })
    BENCHES.forEach((y, j) => {
      k.block(`rest${j}`, { at: [-0.36, y - 0.16, 0.14], size: [0.72, 0.06, 0.3], r: 0.02, steps: 2, parent: "raft" })
      k.block(`bench${j}`, { at: [-0.36, y - 0.1, 0.14], size: [0.72, 0.22, 0.12], r: 0.04, steps: 3, parent: "raft" })
    })
  },
  tick(t, s, input) {
    const { p, groups } = s

    // Which basin the pointer is over, on the fixed plane of its full level.
    let aim = -1
    let board = false
    if (input.onPlane) {
      for (let i = N - 1; i >= 0 && aim < 0; i--) {
        const w = input.onPlane(floorZ(i) + DEEP)
        if (w && Math.abs(w[0] - CENTRE[i][0]) < C + WALL && Math.abs(w[1] - CENTRE[i][1]) < C + WALL) aim = i
      }
      const w = input.onPlane(0)
      board = aim >= 0 || (!!w && w[0] > -3.2 && w[0] < 6 && w[1] > -3.2 && w[1] < 6)
    }

    // How long ago each leg started; below zero, not yet.
    let lt = cycle(input.still ? t : t - (s.shift || 0), T) * T
    let q = START.map((a) => lt - a)
    let fade = 1 - smooth(clamp((lt - FADE) / 0.3))
    if (lt > T - 0.22) fade = smooth((lt - (T - 0.22)) / 0.22)
    const again = lt > T - 0.22
    if (again) q = [-1, -1, -1, -1]

    if (input.still) {
      if (board && aim !== 3) q[2] = -1
    } else if (board) {
      if (!s.ptr) s.ptr = q.map((v) => (v >= 0 ? t - v : Infinity))
      let k = s.ptr.filter((a) => a <= t).length // legs started
      const busy = k > 0 && t - s.ptr[k - 1] < ARRIVE
      if (!busy && k < N - 1 && aim > k) s.ptr[k] = t
      // From the last basin, aiming back up starts the talk over.
      if (!busy && k === N - 1 && aim >= 0 && aim < N - 1 && t - s.ptr[k - 1] > ARRIVE + 0.6) {
        s.ptr = [Infinity, Infinity, Infinity, Infinity]
        s.back = t
      }
      q = s.ptr.map((a) => (a <= t ? t - a : -1))
      fade = s.back ? smooth(clamp((t - s.back) / 0.35)) : 1
    } else if (s.ptr) {
      // The lap takes over from where the raft is.
      const k = s.ptr.filter((a) => a <= t).length
      const at = k === 0 ? 0 : START[k - 1] + Math.min(t - s.ptr[k - 1], ARRIVE + 0.02)
      s.shift = t - at
      q = START.map((a) => at - a)
      s.ptr = null
      s.back = null
      fade = 1
    }

    // Water, gates, floors.
    const f = q.map(flowed)
    let k = 0
    for (let i = 0; i < N - 1; i++) if (f[i] > 0) k = f[i] < 1 ? i : i + 1
    const b = input.still ? 0.5 : breathe(t, 2.4)
    for (let i = 0; i < N; i++) {
      const full = i === 0 ? 1 : f[i - 1]
      const level = DEEP * clamp(full - (i < N - 1 ? f[i] : 0))
      const water = p[`water${i}`]
      water.off[2] = level
      water.hide = level < 0.012
      water.fade = fade
      water.glow = 0
      if (i < N - 1) {
        const open = q[i] >= 0 ? opened(q[i]) : 0
        p[`gate${i}`].off[2] = -open * (RIM - 0.07)
        const run = f[i] > 0 ? smooth(clamp(f[i] / 0.12)) * (1 - smooth(clamp((f[i] - 0.72) / 0.2))) : 0
        p[`fall${i}`].fade = run
        p[`fall${i}`].hide = run < 0.02
      }
      // Open: lit, and not yet covered by its answer.
      const open = i > 0 && q[i - 1] >= 0 ? asked(q[i - 1]) * (1 - smooth(clamp((level / DEEP - 0.1) / 0.5))) * (f[i - 1] < 1 ? 1 : 0) : 0
      p[`ask${i}`].on = open > 0.3 ? 1 : 0
      p[`ask${i}`].glow = open * (0.4 + 0.15 * b)
      p[`askGlow${i}`].glow = 0.9 * open
      p[`askGlow${i}`].hide = open < 0.02
    }

    // The raft rides the water, from one level to the next.
    const u = k < N - 1 ? f[k] : 0
    const [x0, y0] = CENTRE[k]
    const [x1, y1] = CENTRE[Math.min(N - 1, k + 1)]
    const z0 = floorZ(k) + DEEP - 0.05
    const z1 = floorZ(Math.min(N - 1, k + 1)) + DEEP - 0.05
    const bob = input.still || u > 0 ? 0 : 0.012 * Math.sin(t * 2.1)
    groups.raft.off[0] = lerp(x0, x1, u)
    groups.raft.off[1] = lerp(y0, y1, u)
    groups.raft.off[2] = lerp(z0, z1, easeIn(u) * 0.35 + u * 0.65) + bob
    const L = layerOf(u > 0.02 ? k + 1 : k, 5)
    RIDERS.forEach((id, j) => {
      p[id].layer = L + 0.01 * j
      p[id].fade = fade
    })

    const waiting = q.some((v, i) => v >= 0 && f[i] < 1)
    s.state = waiting ? (u > 0.05 ? "drawn on" : "a question") : k === N - 1 ? "the ask" : k === 2 ? "the middle" : "level"
  },
  readout: (s) => s.state || "rest",
})
