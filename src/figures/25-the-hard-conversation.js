// Chapter 25, The hard conversation: something both of you can hold.
//
// Two bays face each other across a bench, yours at the back, theirs in
// front. Each has a pair of jaws. Yours keep hold of a record, a solid bar
// with a slot left open in its far end: what happened, and the part you do not
// know. On their bay lies a loose piece.
//
// First only the outline of the record is sent: a hint, the same size, dashed.
// It drifts across into their jaws. They close on it and meet each other, hard
// enough to jolt the whole bay; they open, try again, and meet again. There is
// nothing in it to hold and nowhere to put an answer, and it drifts off over
// the edge of the bench and hangs there. Then the record itself goes across,
// still in your jaws. Theirs close on it and stop at its sides: it is held from
// both ends. Now their piece slides up, into the slot, and stays: the answer.
//
// Light: teal is the record once both hold it, the fact. Magenta is their
// piece once it is in, the answer it made room for. The hint never lights.
//
// The pointer says which is sent. Along the back of the bench, where the hint
// hangs: the hint, and their jaws keep closing on nothing. Anywhere else: the
// record, and it is held and answered.

import { arc, breathe, clamp, cycle, easeIn, easeInOut, easeOut, figure, keys, lerp } from "../lib/iso/core.js"

const T = 10 // seconds per lap

// The record, along x. Its tail is in your jaws, its slot faces them.
const LEN = 3.3
const HW = 0.52 // half its width
const Z0 = 0.17
const H = 0.56
const FROM = -3.75 // its tail at home
const TO = -2.0 // and across
const SLOT = 1.15 // how deep the slot is
const SW = 0.25 // half the slot's width
const JAW = 0.78 // a clamp's length
const JAW_T = 0.5
const LIP = 0.17 // how far its plate reaches over what it holds
const PLATE = 0.11
const JX = TO + LEN - JAW - 0.03 // their clamps
const WIDE = 1.06 // how far each opens from the centre line
const HOLD = (WIDE - HW) / (WIDE - LIP) // shut on the record; 1 is shut on nothing

// Their piece, and its way in.
const PIECE = 1.62
const PREST = TO + LEN + 0.34 // its inner end at rest
const PIN = TO + LEN - SLOT // ...and seated

// The hint: at home over the record, in their jaws, and hanging off the bench.
const HINT = [
  [FROM, 0, Z0],
  [TO + 0.12, 0, Z0 + 0.06],
  [TO - 0.5, -3.1, Z0 + 0.7],
]

// The lap, in seconds.
const ASK = 0.5
const THERE = 1.75
const SEND = 3.7
const ACROSS = 4.9
const HELD = 5.35
const ANSWER = 5.7
const IN = 6.5
const DARK = 8.4

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

/** One try at nothing: shut hard, wait, open. `u` is seconds into it. */
const tryAt = (u) =>
  keys(u, [
    [0, 0],
    [0.2, 1, easeIn],
    [0.45, 1],
    [0.75, 0, easeInOut],
    [0.9, 0],
  ])
/** The jolt after the jaws meet. */
const jolt = (u) => (u < 0.2 || u > 0.6 ? 0 : Math.sin((u - 0.2) * 62) * Math.exp(-(u - 0.2) * 9) * 0.07)

export default figure({
  slug: "25-the-hard-conversation",
  title: "The record both can hold",
  desc: "Two pairs of jaws face each other across a bench and hold the two ends of one solid bar, the record, lit teal. In the slot left open in its far end sits a piece from the other side, glowing magenta. Behind, off the edge of the bench, hangs a dashed outline of the same bar: the hint that nobody could take hold of.",
  plate: "The hard conversation",
  sentence:
    "The viewer sees jaws close on a dashed outline and meet with a jolt, then close on the solid bar, hold it and add a piece to it, which explains why a fact does less harm than a hint: only what can be held can be answered.",
  view: { scale: 41, origin: [294, 236] },
  still: 7.3,
  build(k) {
    k.grid("board", { at: [-4.6, -3.9, -0.3], size: [8.4, 7], step: 0.7 })
    // The bench: two bays and the neck between them.
    const L0 = -4.4
    const L1 = -0.92
    const R0 = 0.12
    const R1 = 3.78
    const W = 1.82
    const N = 0.9
    const plan = soft([[L0, -W], [L1, -W], [L1, -N, 0.25], [R0, -N, 0.25], [R0, -W], [R1, -W], [R1, W], [R0, W], [R0, N, 0.25], [L1, N, 0.25], [L1, W], [L0, W]], 0.36)
    k.extrude("base", { at: [0, 0, 0], shape: flat(plan), face: "+z", depth: 0.3, layer: -3 })
    ;[
      [L0 + 0.28, -W + 0.28],
      [L0 + 0.28, W - 0.28],
      [R1 - 0.28, -W + 0.28],
      [R1 - 0.28, W - 0.28],
    ].forEach(([x, y], j) => k.led(`screw${j}`, { at: [x, y, 0.002], face: "+z", r: 0.07, layer: -2 }))
    for (const [j, y] of [-0.24, 0.24].entries()) k.block(`rail${j}`, { at: [L0 + 0.5, y - 0.06, 0], size: [PREST + PIECE - L0 - 0.5, 0.12, 0.08], r: 0.04, layer: -1.6 })
    k.halo("under", { at: [TO + 1.75, 0.2, 0.004], r: 1.9, on: 2, layer: -1 })
    k.halo("answered", { at: [PIN + PIECE + 0.1, 0.3, 0.004], r: 1.3, on: 1, layer: -1 })

    // A clamp: a body that bears on the side, a plate that reaches over the top.
    const clamps = (id, x, y, parent) => {
      const top = Z0 + H
      for (const [n, d] of [["B", -1], ["F", 1]]) {
        const f = n === "F"
        k.block(`${id}Jaw${n}`, { at: [x, f ? y : -y - JAW_T, 0.14], size: [JAW, JAW_T, top - 0.14], r: 0.1, parent, layer: f ? 1.5 : 0.5 })
        k.block(`${id}Plate${n}`, { at: [x + 0.08, f ? y - LIP : -y - JAW_T + 0.06, top], size: [JAW - 0.16, JAW_T + LIP - 0.06, PLATE], r: 0.07, parent, layer: f ? 1.55 : 1.3 })
        k.cyl(`${id}Bolt${n}`, { at: [x + JAW / 2, d * (y + JAW_T / 2), top + PLATE], radius: 0.12, h: 0.09, n: 28, parent, layer: f ? 1.58 : 1.33 })
      }
    }
    // Your bay: a sled on the rails with the jaws shut on the record.
    k.group("you", { at: [0, 0, 0] })
    k.block("sled", { at: [FROM - 0.05, -1.3, 0.04], size: [JAW + 0.1, 2.6, 0.1], r: 0.1, parent: "you", layer: 0.1 })
    clamps("y", FROM, HW, "you")

    // The record, with what a record shows on it and a slot left open.
    k.group("rec", { at: [FROM, 0, 0] })
    k.block("record", { at: [0, -HW, Z0], size: [LEN - SLOT, 2 * HW, H], r: 0.06, parent: "rec", layer: 1 })
    k.block("sideB", { at: [LEN - SLOT, -HW, Z0], size: [SLOT, HW - SW, H], r: 0.06, parent: "rec", layer: 1.02 })
    k.block("sideF", { at: [LEN - SLOT, SW, Z0], size: [SLOT, HW - SW, H], r: 0.06, parent: "rec", layer: 1.15 })
    ;[
      [-0.26, 1.85],
      [0, 1.7],
      [0.26, 1.4],
    ].forEach(([y, x1], j) => k.detail(`entry${j}`, { pts: [[0.6, y, Z0 + H + 0.003], [1.0, y, Z0 + H + 0.003], [x1, y, Z0 + H + 0.003]], parent: "rec", layer: 1.02 }))

    // Their bay: jaws that slide on a beam, and a loose piece on its rest.
    k.group("them", { at: [0, 0, 0] })
    k.block("beam", { at: [JX - 0.05, -1.56, 0.04], size: [JAW + 0.1, 3.12, 0.1], r: 0.1, parent: "them", layer: 0.12 })
    for (const [j, y] of [-1.0, 1.0].entries()) k.detail(`way${j}`, { pts: [[JX + JAW / 2, y - 0.5, 0.142], [JX + JAW / 2, y, 0.142], [JX + JAW / 2, y + 0.45, 0.142]], parent: "them", layer: 0.14 })
    clamps("t", JX, WIDE, "them")
    k.block("rest", { at: [PREST + 0.25, -0.62, 0], size: [PIECE - 0.2, 1.24, 0.12], r: 0.14, parent: "them", layer: 0.2 })
    k.group("ans", { at: [PREST, 0, 0], parent: "them" })
    // Narrow where it goes in, as wide as the record where it is held.
    k.block("piece", { at: [0.03, -SW + 0.02, Z0], size: [SLOT, 2 * SW - 0.04, H], r: 0.06, parent: "ans", layer: 1.1 })
    k.block("grasp", { at: [SLOT + 0.03, -HW, Z0], size: [PIECE - SLOT - 0.03, 2 * HW, H], r: 0.13, parent: "ans", layer: 1.2 })

    // The end stops of the two bays.
    k.block("stopY", { at: [L0 + 0.16, -0.85, 0], size: [0.28, 1.7, 0.42], r: 0.1, layer: 0 })
    k.block("stopT", { at: [R1 - 0.42, -0.85, 0], size: [0.28, 1.7, 0.42], r: 0.1, layer: 1.8 })

    // The hint: the record's outline, and nothing in it.
    k.block("hint", { at: [0, -HW, 0], size: [LEN, 2 * HW, H], r: 0.16, role: "ghost", layer: 2.5 })
  },
  tick(t, s, input) {
    const { p, groups } = s
    const tl = cycle(t, T) * T

    // The lap: the hint goes over, two tries at it; it drifts off; the record
    // goes over, is held, is answered; all goes home.
    const hintL = keys(tl, [
      [0, 0],
      [ASK, 0],
      [THERE, 1, easeInOut],
      [3.3, 1],
      [4.5, 2, easeInOut],
      [T, 2],
    ])
    const hintFade = clamp((tl - 0.1) / 0.45) * (1 - clamp((tl - DARK - 0.2) / 0.6))
    const u1 = tl - THERE
    const u2 = tl - THERE - 0.85
    const triesL = Math.max(tryAt(clamp(u1, 0, 0.9)), tryAt(clamp(u2, 0, 0.9)))
    const joltL = jolt(u1) + jolt(u2)
    const recL = keys(tl, [
      [0, 0],
      [SEND, 0],
      [ACROSS, 1, easeInOut],
      [8.95, 1],
      [9.85, 0, easeInOut],
      [T, 0],
    ])
    const gripL = keys(tl, [
      [0, 0],
      [ACROSS + 0.05, 0],
      [HELD, 1, easeOut],
      [8.8, 1],
      [9.1, 0, easeInOut],
      [T, 0],
    ])
    const ansL = keys(tl, [
      [0, 0],
      [ANSWER, 0],
      [IN, 1, easeInOut],
      [DARK + 0.1, 1],
      [8.85, 0, easeInOut],
      [T, 0],
    ])
    const heldL = keys(tl, [
      [0, 0],
      [HELD - 0.05, 0],
      [HELD + 0.12, 1, easeOut],
      [DARK, 1],
      [DARK + 0.25, 0],
      [T, 0],
    ])
    const inL = keys(tl, [
      [0, 0],
      [IN - 0.06, 0],
      [IN + 0.12, 1, easeOut],
      [DARK - 0.1, 1],
      [DARK + 0.15, 0],
      [T, 0],
    ])

    // The pointer says which is sent, on the fixed plane of the record.
    const a = input.onPlane ? input.onPlane(Z0 + H) : null
    const over = !!a && a[0] > -5.2 && a[0] < 4.3 && a[1] > -4.2 && a[1] < 2.2
    const want = over ? (a[1] < (s.want === "hint" ? -0.85 : -1.1) ? "hint" : "fact") : null
    s.want = want
    const m = input.tween("ptr", over ? 1 : 0, { dur: 0.4 })
    const q = s.q || (s.q = { rec: 0, grip: 0, ans: 0, t0: 0 })
    if (!over && m < 0.01) Object.assign(q, { rec: 0, grip: 0, ans: 0 })
    const fact = want === "fact"
    const rec = input.tween("rec", over ? (fact || q.grip > 0.04 ? 1 : 0) : recL > 0.5 ? 1 : 0, { dur: 1, ease: easeInOut })
    const grip = input.tween("grip", over ? ((fact && rec > 0.98) || q.ans > 0.04 ? 1 : 0) : gripL > 0.5 ? 1 : 0, { dur: 0.4 })
    const ans = input.tween("ans", over ? (fact && grip > 0.98 ? 1 : 0) : ansL > 0.5 ? 1 : 0, { dur: 0.8, ease: easeInOut })
    Object.assign(q, { rec, grip, ans })
    const hintP = input.tween("hint", over ? (want === "hint" && (rec < 0.06 || (s.sent ?? 0) < 1.05) ? 1 : 2) : hintL > 1.5 ? 2 : hintL > 0.5 ? 1 : 0, { dur: 1, ease: easeInOut })
    s.sent = hintP
    const trying = want === "hint" && hintP < 1.03 && rec < 0.03
    if (!trying) q.t0 = t
    const uP = trying ? (t - q.t0) % 1.05 : 0
    const triesP = input.still ? (trying ? 1 : 0) : trying ? tryAt(clamp(uP, 0, 0.9)) : 0

    const R = lerp(recL, rec, m)
    const x = (TO - FROM) * R
    groups.you.off[0] = x
    groups.rec.off[0] = x
    const shut = lerp(Math.max(triesL, gripL * HOLD), Math.max(triesP, grip * HOLD), m)
    const dy = (WIDE - LIP) * clamp(shut)
    for (const n of ["Jaw", "Plate", "Bolt"]) {
      p[`t${n}B`].off[1] = dy
      p[`t${n}F`].off[1] = -dy
    }
    const J = input.still ? 0 : lerp(joltL, trying ? jolt(uP) : 0, m)
    groups.them.off[0] = J
    const A = lerp(ansL, ans, m)
    groups.ans.off[0] = (PIN - PREST) * A

    // The hint, drifting.
    const g = lerp(hintL, hintP, m)
    const i = g < 1 ? 0 : 1
    const f = clamp(g - i)
    const lift = Math.sin(Math.PI * f) * (i ? 0.2 : 0.55)
    const bob = input.still ? 0 : 0.05 * Math.sin(t * 1.7)
    for (let c = 0; c < 3; c++) p.hint.off[c] = lerp(HINT[i][c], HINT[i + 1][c], f) + (c === 2 ? lift + bob * clamp(g - 1) : 0)
    p.hint.fade = lerp(hintFade, 1, m)
    p.hint.hide = p.hint.fade < 0.02

    // What is held lights, then what answers it.
    const b = input.still ? 0.5 : breathe(t, 2.8)
    const held = lerp(heldL, input.tween("held", grip > 0.97 && rec > 0.97 ? 1 : 0, { dur: 0.25 }), m)
    const inn = lerp(inL, input.tween("in", ans > 0.97 ? 1 : 0, { dur: 0.25 }), m)
    for (const n of ["record", "sideB", "sideF"]) p[n].on = held > 0.3 ? 2 : 0
    p.record.glow = 0.2 * held
    for (let j = 0; j < 3; j++) p[`entry${j}`].on = held > 0.3 ? 2 : 0
    p.under.glow = 0.75 * held
    p.piece.on = p.grasp.on = inn > 0.3 ? 1 : 0
    p.grasp.glow = inn * (0.3 + 0.12 * b)
    p.answered.glow = 0.8 * inn

    s.state = inn > 0.5 ? "answered" : held > 0.5 ? "held" : shut > 0.9 ? "nothing there" : R > 0.04 ? "a fact" : p.hint.fade > 0.3 && g < 1.2 ? "a hint" : "rest"
  },
  readout: (s) => s.state || "rest",
})
