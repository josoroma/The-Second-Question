// Chapter 8, Easy to hear: the end that stops it at the right place.
//
// A block slides in a channel between a start station and a bumper. On its
// tail rides a loose crosspiece, the end of the word. A gate stands across the
// channel, wide enough for the block and too narrow for the crosspiece.
// Pulled fast, the block leaves its end behind on the two cheeks of the start
// station, passes through the gate and runs on to the far bay, 50. Pulled at
// half speed, the end rides along, meets the gate, and
// the block stops where it was meant to, at 15. A dashed outline in the far
// bay keeps what the fast pull sounded like.
//
// Light: teal is the part both words share, the block. Magenta is the end
// that tells them apart, and the lamp it lights.
//
// The pointer pulls. The block follows it along the channel; how fast it
// leaves the start decides whether the end comes with it. Bring the block
// back to the start and the end is on it again.

import { clamp, cycle, easeIn, easeInOut, easeOut, figure, keys, lerp, rrect } from "../lib/iso/core.js"

const T = 9.5 // seconds per lap
const PULL = 0.6 // the fast pull starts
const HOME = 3.2 // the block comes back for its end
const AGAIN = 4.6 // the slow pull starts
const DONE = 8.3 // it goes home
const YS = 2.6 // the block's centre at the start
const YG = -0.45 // the gate's centre
const GT = 0.3 // its thickness
const LEN = 1.9 // the block's length
const W = 1.0 // and width: it clears the gate
const Z0 = 0.04
const ZTOP = 0.62 // its top, and the top of the cheeks
const END_W = 2.06 // the end's width: it does not
const END_D = 0.3
const END_H = 0.36
const END_AT = 0.56 // from the block's centre to the end's near face (toward the gate)
const IN = 0.62 // the gate's opening, half its width
const OUT = 1.0 // its outside
const HEAD = 1.42 // and the height of the opening
const Y15 = YG + GT / 2 - END_AT // stopped: the end lies across the gate
const BUMP = -4.25 // the bumper's face
const Y50 = BUMP + LEN / 2 // stopped: the block touches the bumper
const FAST = 4 // units a second: faster than this, the end stays behind
const FREE = 0.6 // the end has left the cheeks once the block is this far out

/** A quadratic start over the first fifth, then an even pace to the end. */
const gentle = (u) => {
  const a = 0.2
  const v = 1 / (1 - a / 2)
  return u < a ? (v * u * u) / (2 * a) : v * (u - a / 2)
}

/** The loop, as a function of time in the lap: the block's centre, whether its end is on, the lamp. */
function loopAt(lt) {
  const y = keys(lt, [
    [0, YS],
    [PULL, YS],
    [PULL + 1.14, Y50, (u) => u], // a jerk, then full speed: about 5.2 units a second
    [PULL + 1.27, Y50 + 0.12, easeOut],
    [PULL + 1.42, Y50, easeIn],
    [HOME, Y50],
    [HOME + 0.9, YS, easeInOut],
    [AGAIN, YS],
    [AGAIN + 1.45, Y15, gentle], // a gentle start, then half of that
    [DONE, Y15],
    [DONE + 0.75, YS, easeInOut],
    [T, YS],
  ])
  return { y, on: lt < PULL || lt >= HOME + 0.89, heard: lt >= PULL + 1.1 && lt < DONE }
}

export default figure({
  slug: "08-easy-to-hear",
  title: "The end that stops it at fifteen",
  desc: "A teal block has slid along a channel and stopped at a gate marked 15, because the magenta crosspiece on its tail is wider than the gate's opening; the lamp on the gate is lit. Further on, in the bay marked 50, a dashed outline shows where the same block ran when it was pulled too fast and left its end behind.",
  plate: "Easy to hear",
  sentence:
    "The viewer sees a block pulled fast leave its end behind and run through the gate into the bay marked 50, and the same block pulled at half speed keep its end and stop at 15, which explains why to slow down for a number: the end of the word is all that keeps it from being heard as another.",
  view: { scale: 40, origin: [267, 257] },
  still: 7.4,
  build(k) {
    k.grid("board", { at: [-3.5, -5.6, -0.3], size: [7.0, 10.5], step: 0.7 })
    k.block("base", { at: [-1.7, -4.95, -0.3], size: [3.3, 9.0, 0.3], r: 0.4, layer: -3 })
    const lip = rrect(-1.5, -4.75, 1.4, 3.85, 0.26)
    k.detail("lip", { pts: [...lip, lip[0]].map(([x, y]) => [x, y, 0.002]), layer: -2 })
    // A scale along the channel: even steps, to read the pace by.
    const ticks = []
    for (let i = 0; i <= 14; i++) {
      const y = 2.8 - i * 0.5
      ticks.push([1.14, y, 0.002], [i % 2 === 0 ? 1.28 : 1.21, y, 0.002], [1.14, y, 0.002])
    }
    k.detail("scale", { pts: ticks, layer: -2 })
    // The channel's bed.
    k.face("bed", { at: [0, 0, 0.002], pts: rrect(-0.58, BUMP, 0.58, 3.66, 0.1).map(([x, y]) => [x, y, 0]), role: "recess", layer: -2 })
    ;[
      [-1.4, -4.6],
      [1.28, -4.6],
      [-1.4, 3.72],
      [1.28, 3.72],
    ].forEach(([x, y], j) => k.led(`screw${j}`, { at: [x, y, 0.002], face: "+z", r: 0.065, layer: -2 }))
    k.halo("spill", { at: [0, Y15 + 1.1, 0.003], r: 1.6, on: 1, layer: -1 })
    k.halo("under", { at: [0, 0, 0.003], r: 1.2, on: 2, layer: -1 })

    // The bumper at the far end, 50.
    k.block("bumper", { at: [-0.95, BUMP - 0.36, 0], size: [1.9, 0.36, 1.5], r: 0.12, layer: 0.02 })
    for (const [j, x] of [-0.28, 0.28].entries()) k.led(`buffer${j}`, { at: [x, BUMP + 0.006, 0.4], face: "+y", r: 0.14, layer: 0.03 })
    k.label("fifty", { at: [0, BUMP + 0.004, 1.12], text: "50", face: "+y", size: 0.46, layer: 0.03 })

    // The channel: two rails, and at the start a cheek on either side.
    k.block("railB", { at: [-0.72, BUMP, 0], size: [0.12, 7.75, 0.16], r: 0.04, layer: 0.06 })
    k.block("cheekB", { at: [-1.06, YS + 0.36, 0], size: [0.48, 0.72, ZTOP], r: 0.12, layer: 0.08 })
    k.block("ghost", { at: [-W / 2, Y50 - LEN / 2, Z0], size: [W, LEN, ZTOP - Z0], r: 0.16, role: "ghost", on: 2, layer: 0.1 })
    k.group("blk", { at: [0, YS, 0] })
    k.block("body", { at: [-W / 2, -LEN / 2, Z0], size: [W, LEN, ZTOP - Z0], r: 0.16, role: "accent2", parent: "blk", layer: 0.2 })
    // The seat its end rides in, and the ring it is pulled by.
    const seat = (y) => [[-W / 2 + 0.03, y, ZTOP + 0.003], [0, y, ZTOP + 0.003], [W / 2 - 0.03, y, ZTOP + 0.003]]
    k.detail("seat0", { pts: seat(END_AT), parent: "blk", on: 2, layer: 0.205 })
    k.detail("seat1", { pts: seat(END_AT + END_D), parent: "blk", on: 2, layer: 0.205 })
    k.cyl("ring", { at: [0, -LEN / 2 + 0.28, ZTOP], radius: 0.13, h: 0.07, role: "accent2", parent: "blk", layer: 0.21 })
    k.block("railF", { at: [0.6, BUMP, 0], size: [0.12, 7.75, 0.16], r: 0.04, layer: 0.3 })
    k.block("cheekF", { at: [0.58, YS + 0.36, 0], size: [0.48, 0.72, ZTOP], r: 0.12, layer: 0.32 })

    // Where the end rests on the cheeks.
    for (const [j, x] of [-0.82, 0.82].entries())
      k.face(`rest${j}`, { at: [x, YS + END_AT + END_D / 2, ZTOP + 0.003], pts: rrect(-0.2, -END_D / 2, 0.2, END_D / 2, 0.05).map(([u, v]) => [u, v, 0]), role: "recess", layer: j ? 0.33 : 0.09 })

    // The gate, 15: wide enough for the block, too narrow for its end. In three
    // pieces, so the block sorts between its far pillar and its near one.
    k.block("pillarB", { at: [-OUT, YG - GT / 2, 0], size: [OUT - IN, GT, HEAD], r: 0.06, layer: 0.15 })
    k.block("pillarF", { at: [IN, YG - GT / 2, 0], size: [OUT - IN, GT, HEAD], r: 0.06, layer: 0.4 })
    k.block("lintel", { at: [-OUT - 0.08, YG - GT / 2 - 0.05, HEAD], size: [2 * OUT + 0.16, GT + 0.1, 0.5], r: 0.12, layer: 0.6 })
    k.label("fifteen", { at: [0, YG + GT / 2 + 0.054, HEAD + 0.25], text: "15", face: "+y", size: 0.42, layer: 0.61 })
    k.cyl("socket", { at: [0, YG, HEAD + 0.5], radius: 0.24, h: 0.06, layer: 0.62 })
    k.cyl("lamp", { at: [0, YG, HEAD + 0.56], radius: 0.18, h: 0.2, layer: 0.63 })

    // The end: a loose crosspiece on the block's tail. Where it should be when it is not: dashed.
    k.block("lost", { at: [-END_W / 2, END_AT, ZTOP], size: [END_W, END_D, END_H], r: 0.1, role: "ghost", on: 1, parent: "blk", layer: 0.45 })
    k.block("end", { at: [-END_W / 2, YS + END_AT, ZTOP], size: [END_W, END_D, END_H], r: 0.1, role: "accent", layer: 0.5 })
  },
  tick(t, s, input) {
    const { p, groups } = s
    const lt = cycle(input.still ? t : t - (s.shift || 0), T) * T
    const L = loopAt(lt)

    // The pointer pulls the block along the channel, on the fixed plane of its top.
    const aim = input.onPlane ? input.onPlane(ZTOP) : null
    const pulling = !!aim && Math.abs(aim[0]) < 1.5 && aim[1] > -4.7 && aim[1] < 4.2
    const at = pulling ? clamp(aim[1], Y50, YS) : YS

    let y = L.y
    let on = L.on
    let heard = L.heard
    let ahead = lt >= AGAIN && lt < DONE
    if (input.still) {
      if (pulling) {
        // Reduced motion: past the gate it can only have lost its end.
        on = at > Y15 - 0.3
        y = on ? Math.max(at, Y15) : at
        heard = !on
      }
    } else if (pulling || s.ptr) {
      if (!s.ptr) s.ptr = { y: L.y, on: L.on, heard: L.heard }
      const q = s.ptr
      const to = q.on ? Math.max(at, Y15) : at
      const next = clamp(input.spring("y", to, pulling ? { k: 70, c: 16.7 } : { k: 26, c: 10.2 }), Y50, YS)
      const v = input.dt ? (q.y - next) / input.dt : 0
      // Leaving the cheeks faster than the end can follow leaves it there.
      if (q.on && pulling && v > FAST && next > YS - FREE) q.on = false
      if (!q.on && next > YS - 0.03 && v <= 0.05) q.on = true
      if (!q.on && next < Y50 + 0.1) q.heard = true
      q.y = q.on ? Math.max(next, Y15) : next
      y = q.y
      on = q.on
      heard = q.heard
      ahead = v > 0.02
      // Let go: the block goes home, and the loop starts over from there.
      if (!pulling && y > YS - 0.01 && on) {
        s.ptr = null
        s.shift = t
      }
    }
    if (!input.still && !s.ptr) input.spring("y", L.y, { k: 4000, c: 126 })

    const stopped = on && y < Y15 + 0.02
    const lit = input.still ? (stopped ? 1 : 0) : clamp(input.spring("lit", stopped ? 1 : 0, { k: 160, c: 25 }))
    const far = !on && y < Y50 + 0.14

    groups.blk.off[1] = y - YS
    p.end.off[1] = on ? y - YS : 0
    p.end.glow = 0.15 + 0.3 * lit
    p.lost.fade = clamp((YS - y - 0.25) / 0.4)
    p.lost.hide = on || p.lost.fade < 0.02
    p.body.glow = 0.05
    p.under.at[1] = y
    p.under.glow = 0.55
    p.lamp.on = lit > 0.3 ? 1 : 0
    p.lamp.glow = 0.75 * lit
    p.spill.glow = 0.85 * lit
    // What the fast pull sounded like stays in the far bay once the block has left it.
    const gone = heard ? clamp((y - Y50 - 0.2) / 1.2) : 0
    const lapEnd = s.ptr ? 1 : lerp(1, 0, clamp((lt - DONE) / 0.5))
    p.ghost.fade = gone * lapEnd
    p.ghost.hide = p.ghost.fade < 0.02

    s.state = stopped ? "15" : far ? "50" : !on ? "end left" : y < YS - 0.1 && ahead ? "half speed" : "rest"
  },
  readout: (s) => s.state || "rest",
})
