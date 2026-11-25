// Chapter 29, Negotiation: the disc each side stands on.
//
// Two beams carry one rail between them, half each. Each beam stands on one
// leg, and each leg on one disc of a single row that both sides share: on the
// third from the end on one side, on the second on the other. The discs from
// the end to the leg are what that side needs. The ones between the two legs
// are spare, and a shuttle slides them across: however they are shared, both
// beams stand where they stood. One disc more has to come out from under a
// leg. The leg drops into the empty place, the rail breaks at the join and its
// lamp goes dark. Slid back, the disc lifts the leg again.
//
// Nothing is faked: a beam is as high as what is under its leg.
//
// Light: teal is what each side needs, while it is all there. Magenta is the
// rail they carry together, their word, and the lamp at its end.
//
// The pointer sets the deal: the further toward one end it points, the more
// discs go there. Between the two dashed lines any split holds; past them, one
// side sinks.

import { breathe, clamp, cycle, easeIn, easeInOut, easeOut, figure, keys, lerp, smooth } from "../lib/iso/core.js"

const T = 9.6 // seconds per lap
const R = 0.44 // a disc
const H = 0.52
const P = 1 // from one place in the row to the next
const END = 4 // the last place at either end: -END and END
const BED = 0.14 // what the discs stand on
const NEED = { A: 3, B: 2 }
const LEG = { A: -END + (NEED.A - 1) * P, B: END - (NEED.B - 1) * P } // where the legs stand
const HAVE = { A: 4, B: 3 } // before anything is given
const DISCS = HAVE.A + HAVE.B
const JOIN = 0.5
const BEAM = 1.5 // the beams' underside
const BT = 0.3
const PAD = 0.17 // half of a leg's foot
const HELD = R + 0.02 // the shuttle's fork closes on this

const seatA = (k) => -END + k * P
const seatB = (k) => END - k * P

// The lap: how many discs have gone from A to B.
const TURN = 4.7 // until here they go over, and after it they come back
const loopG = (lt) =>
  keys(lt, [
    [0, 0],
    [0.3, 0],
    [1.75, 1, (u) => u], // a spare
    [2.15, 1],
    [3.6, 2, (u) => u], // and one too many
    [TURN, 2],
    [6.15, 1, (u) => u], // it comes back
    [8.0, 1],
    [9.4, 0, (u) => u],
    [T, 0],
  ])

/**
 * The whole machine, from how many discs have been given by A to B, and which
 * way they are going (1: to B, 0: to A): a leg drops when its disc is taken
 * from under it, and rises only as a disc comes in under its foot.
 */
function pose(g, way) {
  const n = Math.min(Math.floor(g + 1e-9), g >= 2 ? 1 : Math.floor(g + 1e-9))
  const u = clamp(g - n)
  // Discs 0..a-1 are A's, from its end; the disc in hand is the next one over.
  const a = HAVE.A - n // A's discs before this move
  const b = HAVE.B + n
  const from = seatA(a - 1)
  const to = seatB(b)
  const x = keys(u, [[0, from], [0.3, from], [0.72, to, easeInOut], [1, to]])
  const car = keys(u, [[0, JOIN], [0.23, from, smooth], [0.3, from], [0.72, to, easeInOut], [0.79, to], [1, JOIN, smooth]])
  const away = keys(u, [[0, 1], [0.21, 1], [0.29, 0, easeOut], [0.73, 0], [0.81, 1, easeIn], [1, 1]])
  const at = []
  for (let i = 0; i < DISCS; i++) at[i] = i < a - 1 ? seatA(i) : i === a - 1 ? x : seatB(DISCS - 1 - i)
  // A leg stands on its disc until the disc's edge has gone from under its foot.
  const drop = (side) => {
    let near = Infinity
    // Only the disc under the leg, or the next one in from it, can hold it up.
    for (const q of at) {
      const inward = side === "A" ? q - LEG.A : LEG.B - q
      if (inward > -0.05) near = Math.min(near, Math.abs(inward))
    }
    const falls = clamp((near - (R - PAD / 2)) / 0.95) ** 2
    const rises = smooth(clamp((near - 0.3) / (R + PAD + 0.05 - 0.3)))
    const w = side === "A" ? way : 1 - way
    return -H * lerp(rises, falls, w)
  }
  const count = (side) => at.filter((q) => (side === "A" ? q < LEG.A + 0.05 : q > LEG.B - 0.05)).length
  return { at, hand: u > 0.29 && u < 0.73 ? a - 1 : -1, car, away, drop: { A: drop("A"), B: drop("B") }, whole: { A: count("A") >= NEED.A, B: count("B") >= NEED.B } }
}

/** The fork that closes on the front of a disc; (0, 0) is the disc's centre, v toward the front. */
const fork = () => {
  const a = 46
  const pts = []
  for (let i = 0; i <= 14; i++) {
    const t = ((-90 - a + (2 * a * i) / 14) * Math.PI) / 180
    pts.push([HELD * Math.cos(t), HELD * Math.sin(t)])
  }
  return [...pts, [0.42, -0.42], [0.42, -0.66], [0.2, -0.8], [0.2, -0.95], [-0.2, -0.95], [-0.2, -0.8], [-0.42, -0.66], [-0.42, -0.42]]
}

export default figure({
  slug: "29-negotiation",
  title: "The disc each side stands on",
  desc: "Two beams meet at a join and carry one rail, glowing magenta, with a lamp at its end. Each beam stands on one leg, and each leg on a disc of one shared row: the third from one end, the second from the other. The discs from the ends to the legs glow teal. Between the two legs a shuttle is sliding a spare disc across.",
  plate: "Negotiation",
  sentence:
    "The viewer sees spare discs slide between two sides with nothing moving, and one disc more come out from under a leg, which drops and breaks the rail both carry, which explains where a deal stops being good: past what a side needs to keep its word.",
  view: { scale: 36, origin: [279, 236] },
  still: 1.12,
  build(k) {
    k.grid("board", { at: [-5.6, -4.2, -0.3], size: [11.2, 8.4], step: 0.7 })
    k.block("base", { at: [-5.0, -2.2, -0.3], size: [10.0, 4.1, 0.3], r: 0.45, layer: -3 })
    ;[
      [-4.72, -1.92],
      [4.72, -1.92],
      [-4.72, 1.62],
      [4.72, 1.62],
    ].forEach(([x, y], i) => k.led(`screw${i}`, { at: [x, y, 0.002], face: "+z", r: 0.08, layer: -2 }))
    k.halo("underA", { at: [(seatA(0) + LEG.A) / 2, 0.4, 0.003], r: 2.2, on: 2, layer: -1 })
    k.halo("underB", { at: [(seatB(0) + LEG.B) / 2, 0.4, 0.003], r: 1.8, on: 2, layer: -1 })

    // The row: a bed between two lips, stopped at both ends.
    k.block("bed", { at: [-4.62, -0.66, 0], size: [9.24, 1.32, BED], r: 0.12, layer: -0.5 })
    k.block("lipB", { at: [-4.5, -0.62, BED], size: [9.0, 0.1, 0.12], r: 0.03, layer: 0.02 })
    k.block("lipF", { at: [-4.5, 0.52, BED], size: [9.0, 0.1, 0.12], r: 0.03, layer: 1 })
    k.block("stopA", { at: [-4.64, -0.6, BED], size: [0.18, 1.2, 0.4], r: 0.06, layer: 0.1 })
    k.block("stopB", { at: [4.46, -0.6, BED], size: [0.18, 1.2, 0.4], r: 0.06, layer: 1.02 })
    // The two lines, and the stretch between them where discs can change hands.
    const lineA = LEG.A + P / 2
    const lineB = LEG.B - P / 2
    for (const [n, x] of [["A", lineA], ["B", lineB]]) {
      k.guide(`floor${n}`, { pts: [[x, 0.68, 0.003], [x, 1.2, 0.003], [x, 1.74, 0.003]], on: 2, layer: -1.2 })
      k.guide(`line${n}`, { pts: [[x, 0.5, BED + 0.003], [x, 0, BED + 0.003], [x, -0.5, BED + 0.003]], on: 2, layer: 0.01 })
    }
    for (let i = 0; i < 9; i++) {
      const x = -END + i * P
      k.face(`place${i}`, { at: [x, 0, BED + 0.003], pts: Array.from({ length: 28 }, (_, j) => [0.14 * Math.cos((j / 28) * 2 * Math.PI), 0.14 * Math.sin((j / 28) * 2 * Math.PI), 0]), role: "recess", layer: 0 })
    }

    for (const n of ["A", "B"]) {
      const L = n === "A" ? 0.2 : 0.4
      const x = LEG[n]
      k.block(`heel${n}`, { at: [x - 0.36, -2.02, 0], size: [0.72, 0.62, 0.12], r: 0.1, layer: L })
      k.block(`post${n}`, { at: [x - 0.16, -1.9, 0.12], size: [0.32, 0.3, 2.35], r: 0.06, layer: L + 0.01 })
      k.group(n, { at: [0, 0, 0] })
      k.block(`shoe${n}`, { at: [x - 0.36, -1.98, BEAM - 0.1], size: [0.72, 0.6, 0.5], r: 0.08, parent: n, layer: L + 0.02 })
      const x0 = n === "A" ? -4.6 : JOIN + 0.02
      const x1 = n === "A" ? JOIN - 0.02 : 4.6
      k.block(`beam${n}`, { at: [x0, -1.5, BEAM], size: [x1 - x0, 0.78, BT], r: 0.1, parent: n, layer: L + 0.03 })
      k.block(`rail${n}`, { at: [n === "A" ? -4.2 : x0, -1.22, BEAM + BT], size: [n === "A" ? x1 + 4.2 : 4.2 - x0, 0.22, 0.2], r: 0.04, parent: n, layer: L + 0.05 })
      // The leg: a bracket over the row and a foot on one disc.
      k.block(`bracket${n}`, { at: [x - 0.2, -0.76, BEAM + 0.02], size: [0.4, 0.98, BT - 0.06], r: 0.08, parent: n, layer: 0.85 })
      k.cyl(`leg${n}`, { at: [x, 0, BED + H + 0.12], radius: 0.13, h: BEAM + 0.02 - BED - H - 0.12, n: 24, parent: n, layer: 0.8 })
      k.cyl(`pad${n}`, { at: [x, 0, BED + H], radius: PAD + 0.05, h: 0.12, n: 28, parent: n, layer: 0.79 })
    }
    k.block("terminal", { at: [-4.42, -1.33, BEAM + BT], size: [0.42, 0.44, 0.42], r: 0.1, parent: "A", layer: 0.27 })
    k.cyl("seat", { at: [4.22, -1.11, BEAM + BT], radius: 0.29, h: 0.12, n: 32, parent: "B", layer: 0.47 })
    k.cyl("lamp", { at: [4.22, -1.11, BEAM + BT + 0.12], radius: 0.22, h: 0.36, n: 32, parent: "B", layer: 0.48 })
    k.halo("shine", { at: [JOIN, -1.0, BEAM + BT + 0.003], r: 1.7, on: 1, layer: 0.44 })

    for (let i = 0; i < DISCS; i++) {
      k.group(`g${i}`, { at: [0, 0, 0] })
      k.cyl(`disc${i}`, { at: [0, 0, BED], radius: R, h: H, n: 40, parent: `g${i}`, layer: 0.6 })
    }

    // The shuttle in front.
    k.block("track", { at: [-4.3, 1.12, 0], size: [8.6, 0.14, 0.08], r: 0.03, layer: -1.5 })
    k.group("shuttle", { at: [0, 0, 0] })
    k.block("car", { at: [-0.4, 0.92, 0.08], size: [0.8, 0.54, 0.26], r: 0.12, parent: "shuttle", layer: 1.1 })
    k.group("hand", { at: [0, 0, 0], parent: "shuttle" })
    k.extrude("fork", { at: [0, 0, 0.48], shape: fork(), face: "+z", depth: 0.14, parent: "hand", layer: 1.2 })
    k.block("grip", { at: [-0.24, 0.86, 0.34], size: [0.48, 0.42, 0.24], r: 0.1, parent: "hand", layer: 1.3 })
  },
  tick(t, s, input) {
    const { p, groups } = s
    const lt = cycle(t, T) * T
    const base = loopG(lt)

    // The pointer sets the deal, on the fixed plane of the discs' tops.
    const at = input.onPlane ? input.onPlane(BED + H) : null
    const over = !!at && Math.abs(at[0]) < 5.6 && at[1] > -3 && at[1] < 2.6
    if (over) {
      const v = (at[0] - JOIN) / 1.55
      // A little hysteresis, so a pointer on a border does not dither.
      if (s.want == null || Math.abs(v - s.want) > 0.62) s.want = clamp(Math.round(v), -2, 2)
    } else s.want = null
    let g = base
    let dir = lt < TURN ? 1 : 0
    if (input.still) g = over ? s.want : base
    else if (over || s.g != null) {
      if (s.g == null) s.g = base
      const goal = over ? s.want : base
      const step = (input.dt || 0) * (over ? 0.69 : 0.9)
      dir = goal > s.g ? 1 : goal < s.g ? 0 : (s.dir ?? dir)
      s.g += clamp(goal - s.g, -step, step)
      g = s.g
      // Let go: it catches up with the lap and follows it again.
      if (!over && Math.abs(goal - s.g) < 1e-3) s.g = null
    }
    s.dir = dir
    const M = pose(clamp(g, -2, 2), input.tween("way", dir, { dur: 0.3 }))

    for (const n of ["A", "B"]) groups[n].off[2] = M.drop[n]
    for (let i = 0; i < DISCS; i++) {
      groups[`g${i}`].off[0] = M.at[i]
      const x = M.at[i]
      const mine = x < LEG.A + 0.05 ? "A" : x > LEG.B - 0.05 ? "B" : null
      const lit = mine && M.whole[mine]
      p[`disc${i}`].on = lit ? 2 : 0
      p[`disc${i}`].glow = lit ? 0.12 : 0
    }
    for (const n of ["A", "B"]) p[`under${n}`].glow = M.whole[n] ? 0.7 : 0
    groups.shuttle.off[0] = M.car
    groups.hand.off[1] = 0.42 * M.away

    // Their word: one rail, whole only while both beams stand.
    const meet = M.drop.A > -0.03 && M.drop.B > -0.03
    const live = input.still ? (meet ? 1 : 0) : input.tween("live", meet ? 1 : 0, { dur: meet ? 0.3 : 0.1 })
    const b = input.still ? 0.5 : breathe(t, 2.8)
    for (const n of ["A", "B"]) {
      p[`rail${n}`].on = live > 0.5 ? 1 : 0
      p[`rail${n}`].glow = live * (0.22 + 0.08 * b)
    }
    p.lamp.on = live > 0.5 ? 1 : 0
    p.lamp.glow = live * (0.5 + 0.2 * b)
    p.shine.glow = 0.4 * live

    s.state = !meet ? "one side short" : M.hand < 0 ? "both hold" : M.whole.A && M.whole.B ? "a spare" : "one too many"
  },
  readout: (s) => s.state || "rest",
})
