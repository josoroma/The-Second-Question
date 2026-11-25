// Chapter 15, The meeting: a name, and the way out.
//
// Items ride round an oval on pallets, an empty seat in the top of each. The
// belt goes one place at a time, and every place brings the next item to the
// same stop, under a press that holds names. Past the stop a fork stands over
// the belt: two rails, higher than an item and lower than a name. An item
// that stopped and left with its seat empty goes under the fork, round the
// oval and back to the stop. An item a name was pushed into is taken by it:
// the rails have the name between them, so when the belt turns the corner the
// item goes straight on, off its pallet and out.
//
// Light: teal is the name, from the moment it is in its seat (what the
// decision rests on); magenta is the item the fork has taken (the decision).
// At rest only those glow.
//
// The pointer gives names. Held over the press, it pushes one into every item
// that stops there, and each one leaves; anywhere else over the board no name
// is given, and everything comes round again.

import { arc, breathe, clamp, easeIn, easeInOut, easeOut, figure, keys, lerp, ring, smooth } from "../lib/iso/core.js"

const STEP = 3 // seconds per place
const REST = 1.9 // the belt stands this long, then moves
const LAP = 3 // the press gives one name in this many places: a lap of nine seconds

// The oval: straights along x, half-length A; the belt's middle line at radius R.
const A = 1.5
const R = 1.55
const HALF = 0.53 // half the belt's width
const N = 7 // pallets
const LEN = 4 * A + 2 * Math.PI * R
const D = LEN / N // one place
const XS = -0.95 // the stop, on the near straight
const OUT = 5.3 // where the way out runs off the plate

const PAL = 0.07
const PUCK = 0.44
const TOP = PAL + PUCK // the top of an item
const PUCK_R = 0.43
const PEG_R = 0.115
const PEG_H = 0.58

// The press.
const HEAD0 = 1.42 // the underside of its head
const HEAD1 = 1.8
const HANG = 0.36 // how far a waiting name shows under the head
const DROP = HEAD0 - HANG - TOP // how far it is pushed
const ROD0 = HEAD0 - HANG + PEG_H // the rod starts on top of the waiting name

// The fork.
const RAIL0 = TOP + 0.14
const RAIL_H = 0.2
const GAP = 0.165 // half the space between its rails
const RAIL_W = 0.15
const FX0 = 0.9
const FX1 = 4.1

/** The middle line of the belt, at a distance s past the stop: [x, y, in front of the island]. */
function onBelt(s) {
  s = ((s % LEN) + LEN) % LEN
  if (s <= A - XS) return [XS + s, R, true]
  s -= A - XS
  if (s <= Math.PI * R) {
    const a = Math.PI / 2 - s / R
    return [A + R * Math.cos(a), R * Math.sin(a), Math.cos(a) + Math.sin(a) > 0]
  }
  s -= Math.PI * R
  if (s <= 2 * A) return [A - s, -R, false]
  s -= 2 * A
  if (s <= Math.PI * R) {
    const a = -Math.PI / 2 - s / R
    return [-A + R * Math.cos(a), R * Math.sin(a), Math.cos(a) + Math.sin(a) > 0]
  }
  s -= Math.PI * R
  return [-A + s, R, true]
}

/** An oval of radius r about the same two centres. */
const oval = (r) => [...arc(A, 0, r, -90, 90, 28), ...arc(-A, 0, r, 90, 270, 28)]

/** An oval of radius r with a straight way out on its near side, from y0 to y1, to x1. */
function ovalAndWay(r, y0, y1, x1, rc) {
  const a = (Math.asin(y0 / r) * 180) / Math.PI
  const end = rc > 0 ? [...arc(x1 - rc, y0 + rc, rc, -90, 0, 6), ...arc(x1 - rc, y1 - rc, rc, 0, 90, 6)] : [[x1, y0], [x1, y1]]
  return [...arc(-A, 0, r, 90, 270, 28), ...arc(A, 0, r, -90, a, 24), ...end]
}
const flat = (pts, z = 0.002) => pts.map(([x, y]) => [x, y, z])
const closed = (pts) => [...pts, pts[0]]
const flip = (pts) => pts.map(([x, y]) => [x, -y])
const mod = (a, n) => ((a % n) + n) % n

/** The press, seconds after it starts: 0 up, 1 down on the item. */
const push = (q) => keys(q, [[0, 0], [0.45, 1, easeIn], [0.75, 1], [1.3, 0, easeInOut]])

export default figure({
  slug: "15-the-meeting",
  title: "Only an item with a name in it leaves",
  desc: "Round items with an empty seat on top ride an oval belt past a press. One has had a teal peg pushed into its seat; two rails over the belt hold the peg between them, and the item, lit magenta, is leaving along a straight way out while the others follow the bend and come round again.",
  plate: "The meeting",
  sentence:
    "The viewer sees items ride round past the same press and go by a fork untouched until a peg, a name, is pushed into one and the fork takes it straight out, which explains why a decision is only as real as the name beside it: without one it comes round again.",
  view: { scale: 41, origin: [270, 205] },
  still: 8.62,
  build(k) {
    k.grid("board", { at: [-4.9, -3.5, -0.3], size: [10.5, 7], step: 0.7 })
    const plate = ovalAndWay(2.5, 0.5, 2.5, OUT, 0.22)
    k.extrude("base", { at: [0, 0, 0], face: "+z", shape: flip(plate), depth: 0.3, layer: -3 })
    const bed = ovalAndWay(R + HALF, R - HALF, R + HALF, OUT - 0.005, 0)
    k.face("bed", { at: [0, 0, 0], pts: flat(bed.slice().reverse()), role: "recess", layer: -2 })
    ;[
      [-3.5, 1.35],
      [-3.5, -1.35],
      [3.0, -1.9],
      [5.02, 0.76],
      [5.02, 2.29],
    ].forEach(([x, y], i) => k.led(`screw${i}`, { at: [x, y, 0.002], face: "+z", r: 0.07, layer: -2 }))
    k.halo("spill", { at: [0, 0, 0.003], r: 1.35, on: 1, layer: -1 })
    // Where the belt goes and where it does not: the bend, and the way out.
    k.guide("bend", { pts: flat(arc(A, 0, R, 90, -90, 30), 0.004), layer: -1.6 })
    k.guide("way", { pts: flat([[A, R], [3, R], [OUT - 0.1, R]], 0.004), layer: -1.6 })

    // The island inside the oval.
    k.extrude("island", { at: [0, 0, 0.24], face: "+z", shape: flip(oval(R - HALF - 0.03)), depth: 0.24, layer: 1 })
    k.detail("seam", { pts: flat(closed(oval(R - HALF - 0.2)), 0.243), layer: 1.1 })

    // The press: a column on the island, an arm over the stop, a head with names in it.
    k.block("foot", { at: [XS - 0.36, -0.42, 0.24], size: [0.72, 0.72, 0.12], r: 0.14, layer: 2 })
    k.block("column", { at: [XS - 0.21, -0.28, 0.36], size: [0.42, 0.42, HEAD0 + 0.06 - 0.36], r: 0.1, layer: 2.1 })
    k.block("arm", { at: [XS - 0.25, -0.36, HEAD0 + 0.06], size: [0.5, R + 0.36, 0.28], r: 0.12, layer: 5 })
    k.detail("armseam", { pts: [[XS + 0.252, -0.2, HEAD0 + 0.2], [XS + 0.252, 0.5, HEAD0 + 0.2], [XS + 0.252, R - 0.4, HEAD0 + 0.2]], layer: 5.1 })
    k.cyl("rod", { at: [XS, R, ROD0], radius: 0.075, h: HEAD1 + DROP + 0.06 - ROD0, n: 24, layer: 4.6 })
    k.cyl("tip", { at: [XS, R, HEAD0 - HANG], radius: PEG_R, h: PEG_H, n: 28, layer: 4.7 })
    k.cyl("head", { at: [XS, R, HEAD0], radius: 0.31, h: HEAD1 - HEAD0, layer: 5.2 })
    k.cyl("rodUp", { at: [XS, R, HEAD1], radius: 0.075, h: DROP + 0.06, n: 24, layer: 5.3 })
    k.cyl("knob", { at: [XS, R, HEAD1 + DROP + 0.06], radius: 0.21, h: 0.1, n: 36, layer: 5.4 })

    // The belt's pallets, the items, and the seats in them.
    for (let i = 0; i < N; i++) {
      k.cyl(`pal${i}`, { at: [0, 0, 0.003], radius: 0.5, h: PAL - 0.003, layer: 3 })
      k.cyl(`item${i}`, { at: [0, 0, PAL], radius: PUCK_R, h: PUCK, layer: 3 })
      k.face(`seat${i}`, { at: [0, 0, TOP + 0.003], pts: ring(0, 0, PEG_R + 0.035, 24).reverse().map(([x, y]) => [x, y, 0]), role: "recess", layer: 3.01 })
    }
    for (let i = 0; i < 3; i++) k.cyl(`name${i}`, { at: [0, 0, TOP], radius: PEG_R, h: PEG_H, n: 28, role: "accent2", layer: 3.6 })

    // The fork: two rails, flared at the mouth, each on posts of its own.
    const rail = (sg) => {
      const i = R + sg * GAP
      const o = R + sg * (GAP + RAIL_W)
      return [
        [FX0, i + sg * 0.2],
        [FX0 + 0.45, i],
        [FX1, i],
        [FX1, o],
        [FX0 + 0.42, o],
        [FX0, o + sg * 0.2],
      ]
    }
    k.cyl("postF0", { at: [1.5, 0.82, 0.24], radius: 0.09, h: RAIL0 - 0.24, n: 24, layer: 2.5 })
    k.cyl("postF1", { at: [3.7, 0.8, 0], radius: 0.09, h: RAIL0, n: 24, layer: 3.4 })
    k.block("barF0", { at: [1.41, 0.72, RAIL0], size: [0.18, R - GAP - RAIL_W + 0.02 - 0.72, RAIL_H], r: 0.05, layer: 3.45 })
    k.block("barF1", { at: [3.61, 0.7, RAIL0], size: [0.18, R - GAP - RAIL_W + 0.02 - 0.7, RAIL_H], r: 0.05, layer: 3.45 })
    k.extrude("railF", { at: [0, 0, RAIL0 + RAIL_H], face: "+z", shape: flip(rail(-1)), depth: RAIL_H, layer: 3.5 })
    k.extrude("railN", { at: [0, 0, RAIL0 + RAIL_H], face: "+z", shape: flip(rail(1)), depth: RAIL_H, layer: 3.7 })
    for (const [j, x] of [1.5, 2.55].entries()) {
      k.block(`barN${j}`, { at: [x - 0.09, R + GAP + RAIL_W - 0.02, RAIL0], size: [0.18, 2.36 - (R + GAP + RAIL_W - 0.02), RAIL_H], r: 0.05, layer: 3.8 })
      k.cyl(`postN${j}`, { at: [x, 2.27, 0], radius: 0.09, h: RAIL0, n: 24, layer: 3.75 })
    }
  },
  tick(t, s, input) {
    const { p } = s
    const n = Math.floor(t / STEP)
    const q = t - n * STEP // seconds into this place
    const f = q < REST ? 0 : easeInOut((q - REST) / (STEP - REST))

    // The pointer: over the press (its shaft is tall, so on three planes), over the board, or away.
    let over = false
    let board = false
    if (input.onPlane) {
      for (const z of [0.4, 1.3, 2.2]) {
        const w = input.onPlane(z)
        if (w && Math.hypot(w[0] - XS, w[1] - R) < 0.62) over = true
      }
      const w = input.onPlane(0)
      board = over || (!!w && w[0] > -4.2 && w[0] < 5.1 && Math.abs(w[1]) < 2.7)
    }

    // Who gets a name: in the loop, one item in three; under the pointer, whoever it is given to.
    if (!s.given) s.given = new Map() // place -> when its press started, or null
    if (!input.still) {
      const has = s.given.has(n)
      if (board && !over && q < 0.42 && !has) s.given.set(n, null)
      if (over && q < 1.3 && (!has || s.given.get(n) === null)) s.given.set(n, Math.max(q, 0.1))
      if (over && q >= 1.3 && !has) s.given.set(n, null)
      for (const m of s.given.keys()) if (m < n - N - 2) s.given.delete(m)
    }
    const start = (m) => {
      if (input.still && board && !over) return null
      if (s.given.has(m)) return s.given.get(m)
      return mod(m, LAP) === 1 ? 0.45 : null
    }

    // The press.
    const q0 = start(n)
    const down = q0 === null ? keys(q, [[0, 0], [0.6, 0], [0.85, 0.13, easeOut], [1.15, 0, easeInOut]]) : push(q - q0)
    const seated = q0 !== null && q - q0 > 0.45
    const dz = -down * DROP
    p.rod.off[2] = dz
    p.rodUp.off[2] = dz
    p.knob.off[2] = dz
    // After the push the next name follows the rod back into place.
    p.tip.off[2] = seated ? lerp(0.12, 0, smooth((q - q0 - 1.0) / 0.3)) : dz
    p.tip.hide = seated && q - q0 < 1.0
    // The rod shows under the head only while it pushes.
    p.rod.hide = down < 0.02

    // The belt.
    let lit = 0
    let taken = null
    for (let i = 0; i < 3; i++) p[`name${i}`].hide = true
    for (let i = 0; i < N; i++) {
      const m = n - mod(n - i, N) // the place at which this slot last stopped under the press
      const u = n + f - m
      const [bx, by, front] = onBelt(u * D)
      const pal = p[`pal${i}`]
      const item = p[`item${i}`]
      const seat = p[`seat${i}`]
      const L = front ? 3 : 0
      pal.at[0] = bx
      pal.at[1] = by
      pal.layer = L - 0.02
      item.layer = L
      seat.layer = L
      seat.bias = 0.02
      let x = bx
      let y = by
      let z = 0
      const named = start(m) !== null && (m < n || seated)
      if (named && u < 4) {
        const k = mod(m, 3)
        const nm = p[`name${k}`]
        // Between the rails the name cannot turn the corner.
        x = XS + Math.min(u, 2) * D + clamp(u - 2) * 1.15
        y = R
        item.fade = 1 - smooth(clamp((u - 2.35) / 0.5))
        item.hide = seat.hide = item.fade < 0.02
        const on = smooth(clamp((u - 1.12) / 0.2))
        item.on = on > 0.4 ? 1 : 0
        const b = input.still ? 0.5 : breathe(t, 2.6)
        item.glow = on * (0.32 + 0.1 * b) * item.fade
        item.layer = seat.layer = 3
        seat.hide = true
        if (u < 3) {
          nm.hide = item.hide
          nm.fade = item.fade
          nm.at[0] = x
          nm.at[1] = y
          nm.glow = 0.42 * item.fade * (m === n ? smooth((q - q0 - 0.45) / 0.2) : 1)
        }
        if (on * item.fade > lit) {
          lit = on * item.fade
          taken = [x, y]
        }
      } else if (named && u < 5) {
        // The next item on the list drops into the empty place.
        const a = clamp((q - 0.5) / 0.55)
        const drop = u > 4 ? 1 : a
        z = 0.7 * (1 - easeIn(drop))
        item.fade = seat.fade = smooth(drop * 2)
        item.hide = seat.hide = item.fade < 0.02
      }
      item.at[0] = seat.at[0] = x
      item.at[1] = seat.at[1] = y
      item.off[2] = seat.off[2] = z
    }
    p.spill.hide = !taken
    if (taken) {
      p.spill.at[0] = taken[0]
      p.spill.at[1] = taken[1]
      p.spill.glow = 0.8 * lit
    }
    s.state = lit > 0.4 ? "decided" : seated ? "a name" : q < REST ? "no name" : "round again"
  },
  readout: (s) => s.state || "rest",
})
