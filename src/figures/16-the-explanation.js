// Chapter 16, The explanation: what you gain, what you give up, and the copy.
//
// Two equal rams stand in two wells joined by one closed pipe: raise the gain
// and the cost sinks by the same volume. Across the scored line stands a third
// ram, the listener's, joined to nothing: it moves only if they move it. Their
// bar waits beside it. It can slide over the cost only if their own ram is
// down out of its way, as deep as the cost has sunk.
//
// The first time, the gain goes up and their ram only dips and comes back: a
// nod. The bar runs into it, nothing is held, and the rams settle level again.
// The second time their ram comes down as far as the cost did (they have said
// what they gave up); the bar slides over both, and the choice stays made.
//
// The three blocks of space are equal: the lit block on the gain, the dashed
// one over the cost, and the dashed one over the copy.
//
// Light: teal is the gain. Magenta is the cost said back: the space over the
// listener's ram, and the bar it lets in. At rest only those glow.
//
// The pointer moves the listener's ram: it follows the pointer's height beside
// it. Part of the way down, the bar still meets it; only all the way down does
// the bar go in. Anywhere else over the board they only nod.

import { arc, breathe, clamp, cycle, easeIn, easeInOut, easeOut, figure, keys, lerp, smooth, strokeOutline } from "../lib/iso/core.js"

const T = 10 // seconds per lap
const W = 0.5 // half the width of a ram
const B = 0.8 // half the width of a well
const HZ = 0.8 // the top of the wells
const LEVEL = 2.15 // the top of all three rams, level
const D = 0.75 // how far one rises and the other sinks
const AX = -2.6 // the gain
const CY = -1.95 // the listener's ram, beside the cost

// The bar.
const BZ = LEVEL - D + 0.02 // it slides just over a lowered ram
const BH = 0.28
const OUT = 1.12 // where its edge waits
const JAM = W + 0.01 // where it meets a ram that is up
const IN = -0.28 // where it is home
const STAND = [1.85, 2.5] // the block it slides on

const flip = (pts) => pts.map(([x, y]) => [x, -y])

// A well is two pieces, so that a ram sorts between its far half and its near half.
const RC = 0.2
const far = [...arc(-B + RC, -B + RC, RC, 180, 270, 6), [W, -B], [W, -W], [-W, -W], [-W, W], [-B, W]]
const near = [...arc(B - RC, -B + RC, RC, -90, 0, 6), ...arc(B - RC, B - RC, RC, 0, 90, 6), ...arc(-B + RC, B - RC, RC, 90, 180, 6), [-B, W], [W, W], [W, -B]]

/** The lap: u, how far the gain is up; v, how far the copy is down; x, the bar's edge. */
function loopAt(t) {
  const u = keys(t, [
    [0, 0],
    [0.5, 0],
    [1.4, 1, easeInOut],
    [3.75, 1],
    [4.5, 0, easeInOut],
    [4.8, 0],
    [5.7, 1, easeInOut],
    [9.2, 1],
    [9.85, 0, easeInOut],
    [T, 0],
  ])
  const v = keys(t, [
    [0, 0],
    [1.7, 0],
    [1.95, 0.3, easeOut],
    [2.25, 0, easeInOut],
    [2.4, 0],
    [2.6, 0.17, easeOut],
    [2.85, 0, easeInOut],
    [6.0, 0],
    [6.75, 1, easeInOut],
    [9.2, 1],
    [9.85, 0, easeInOut],
    [T, 0],
  ])
  const x = keys(t, [
    [0, OUT],
    [2.95, OUT],
    [3.15, JAM, easeIn],
    [3.28, JAM + 0.14, easeOut],
    [3.42, JAM, easeIn],
    [3.6, JAM],
    [4.0, OUT, easeInOut],
    [6.95, OUT],
    [7.55, IN, easeInOut],
    [8.75, IN],
    [9.2, OUT, easeInOut],
    [T, OUT],
  ])
  return { u, v, x }
}

export default figure({
  slug: "16-the-explanation",
  title: "The cost, copied before anything locks",
  desc: "Three square rams stand in wells. The first is up, its top block lit teal: the gain. The second, joined to it by a pipe, has sunk by the same block, left as a dashed outline. The third, the listener's, has been lowered to match, its own missing block dashed in magenta, and a magenta bar has slid over both and holds them down.",
  plate: "The explanation",
  sentence:
    "The viewer sees one ram rise and the one piped to it sink by the same block, and a bar that can lock them only once a third ram, the listener's, has been brought down as far, which explains that a choice is made when they can say what they gave up and that a nod holds nothing.",
  view: { scale: 39, origin: [262, 263] },
  still: 8.1,
  build(k) {
    k.grid("board", { at: [-4.2, -4.2, -0.3], size: [8.4, 7.0], step: 0.7 })
    // Two plates: the speaker's side, and the listener's behind it. Only the bar crosses.
    k.block("sideL", { at: [-1.35, -3.15, -0.3], size: [5.6, 2.06, 0.3], r: 0.4, layer: -3.1 })
    k.block("sideS", { at: [-3.95, -0.95, -0.3], size: [5.25, 2.8, 0.3], r: 0.4, layer: -3 })
    ;[
      [-3.65, 1.55],
      [1.02, 1.55],
      [3.95, -2.85],
      [3.95, -1.39],
    ].forEach(([x, y], j) => k.led(`screw${j}`, { at: [x, y, 0.002], face: "+z", r: 0.07, layer: -2 }))
    k.halo("spill", { at: [0.9, CY + 0.6, 0.003], r: 1.9, on: 1, layer: -1 })
    k.halo("spillA", { at: [AX - 0.1, 0.3, 0.003], r: 1.7, on: 2, layer: -1 })

    // The wells and the rams, back to front: the gain, the copy, the cost.
    const tall = (id, x, y, L, len) => {
      k.extrude(`${id}far`, { at: [x, y, HZ], face: "+z", shape: flip(far), depth: HZ, layer: L })
      k.group(id, { at: [x, y, LEVEL] })
      k.block(`${id}ram`, { at: [-W, -W, -len], size: [2 * W, 2 * W, len - (id === "A" ? D : 0)], r: 0.1, parent: id, layer: L + 0.1 })
      // Graduations: a third of the block that moves.
      for (let i = 1; i <= 5; i++) {
        const z = (-D * i) / 3
        if (id === "A" && i <= 3) continue
        k.detail(`${id}t${i}`, {
          pts: [[-W + 0.1, W, z], [W - 0.1, W, z], [W - 0.03, W - 0.03, z], [W, W - 0.1, z], [W, -W + 0.1, z]],
          parent: id,
          layer: L + 0.15,
        })
      }
    }
    const front = (id, x, y, L) => {
      k.extrude(`${id}near`, { at: [x, y, HZ], face: "+z", shape: flip(near), depth: HZ, layer: L + 0.5 })
      k.detail(`${id}band`, { pts: [[x - B + 0.2, y + B + 0.002, 0.16], [x + B - 0.2, y + B + 0.002, 0.16], [x + B - 0.06, y + B - 0.06, 0.16], [x + B + 0.002, y + B - 0.2, 0.16], [x + B + 0.002, y - B + 0.2, 0.16]], layer: L + 0.55 })
    }
    tall("A", AX, 0, 1, 2.12)
    k.block("gain", { at: [-W, -W, -D], size: [2 * W, 2 * W, D], r: 0.1, parent: "A", layer: 1.2 })
    front("A", AX, 0, 1)
    tall("C", 0, CY, 2, 1.42)
    front("C", 0, CY, 2)
    tall("B", 0, 0, 3, 1.42)
    front("B", 0, 0, 3)

    // The pipe between the gain's well and the cost's.
    const PY = B + 0.5
    const path = [
      [AX, B],
      ...arc(AX + 0.24, PY - 0.24, 0.24, 180, 90, 6),
      ...arc(-0.24, PY - 0.24, 0.24, 90, 0, 6),
      [0, B],
    ]
    k.extrude("pipe", { at: [0, 0, 0.44], face: "+z", shape: flip(strokeOutline(path, 0.34)), depth: 0.34, layer: 3.8 })
    k.wire("flow", { pts: path.map(([x, y]) => [x, y, 0.445]).reverse(), layer: 3.9 })

    // The bar, the block it slides on, and the space it needs.
    k.block("stand", { at: [STAND[0], CY - 0.42, 0], size: [STAND[1] - STAND[0], 0.84, BZ - 0.01], r: 0.14, layer: 4 })
    k.block("cheekF", { at: [STAND[0] + 0.08, CY - 0.42, BZ - 0.01], size: [STAND[1] - STAND[0] - 0.16, 0.14, 0.34], r: 0.05, layer: 4.1 })
    k.group("bar", { at: [0, 0, BZ] })
    k.block("barHead", { at: [0, CY - 0.4, 0], size: [0.6, 0.36 - CY + 0.4, BH], r: 0.1, parent: "bar", layer: 4.5 })
    k.block("barStem", { at: [0.6, CY - 0.24, 0], size: [2.25, 0.48, BH], r: 0.05, parent: "bar", layer: 4.55 })
    k.cyl("knob", { at: [2.62, CY, BH], radius: 0.16, h: 0.26, n: 32, parent: "bar", layer: 4.7 })
    k.block("cheekN", { at: [STAND[0] + 0.08, CY + 0.28, BZ - 0.01], size: [STAND[1] - STAND[0] - 0.16, 0.14, 0.34], r: 0.05, layer: 4.8 })

    // What was given up, over the cost and, once they have said it, over the copy.
    k.block("lost", { at: [-W, -W, LEVEL - D], size: [2 * W, 2 * W, D], r: 0.1, role: "ghost", layer: 4.65 })
    k.block("said", { at: [-W, CY - W, LEVEL - D], size: [2 * W, 2 * W, D], r: 0.1, role: "ghost", on: 1, layer: 4.6 })
  },
  tick(t, s, input) {
    const { p, groups } = s
    let { u, v, x } = loopAt(cycle(t, T) * T)

    // The pointer's height beside the listener's ram, on the vertical plane of its near face.
    let aim = null
    let board = false
    const g0 = input.onPlane ? input.onPlane(0) : null
    const g1 = g0 && input.onPlane(1)
    if (g0 && g1) {
      board = g0[0] > -7 && g0[0] < 4.6 && g0[1] > -6.5 && g0[1] < 2.6
      const dy = g1[1] - g0[1]
      if (Math.abs(dy) > 1e-6) {
        const z = (CY + W - g0[1]) / dy
        const px = g0[0] + (g1[0] - g0[0]) * z
        if (Math.abs(px) < 0.95 && z > 0.2 && z < LEVEL + 0.7) aim = clamp((LEVEL - z) / D)
      }
    }
    // The pointer hands back to the lap only while both leave the bar out.
    s.live = board || (!input.still && !!s.live && (s.barX < W || x < OUT - 0.01))
    const m = input.tween("ptr", s.live ? 1 : 0, { dur: 0.5 })
    if (s.live || m > 0.001) {
      // They only nod, unless their ram is brought down.
      const nod = input.still ? 0 : 0.16 * Math.max(0, Math.sin(t * 3.4)) ** 3
      const want = aim === null ? nod : aim > 0.84 ? 1 : aim
      const overIt = !input.still && s.barX !== undefined && s.barX < W - 0.02
      const vP = clamp(input.spring("v", overIt ? 1 : want, { k: 160, c: 25 }), 0, 1)
      const free = vP > 0.975 && want === 1
      const xP = input.spring("x", free ? IN : overIt ? OUT : vP > 0.975 ? OUT : JAM, { k: 120, c: 22 })
      const xC = vP > 0.975 ? xP : Math.max(xP, JAM)
      u = lerp(u, 1, m)
      v = lerp(v, vP, m)
      x = lerp(x, xC, m)
      if (v < 0.975) x = Math.max(x, JAM)
    } else {
      input.spring("v", v, { k: 4000, c: 126 })
      input.spring("x", x, { k: 4000, c: 126 })
    }
    s.barX = x

    groups.A.off[2] = u * D
    groups.B.off[2] = -u * D
    groups.C.off[2] = -v * D
    groups.bar.off[0] = x

    // The gain is lit while it is up, and what it cost is marked over the other ram.
    const b = input.still ? 0.5 : breathe(t, 2.8)
    p.gain.on = u > 0.55 ? 2 : 0
    p.gain.glow = 0.34 * smooth(clamp((u - 0.55) / 0.3))
    p.spillA.glow = 0.5 * smooth(clamp((u - 0.55) / 0.3))
    p.lost.fade = smooth(clamp((u - 0.3) / 0.5))
    p.lost.hide = p.lost.fade < 0.02
    p.said.fade = smooth(clamp((v - 0.55) / 0.42))
    p.said.hide = p.said.fade < 0.02

    // The bar lights when it is home.
    const home = smooth(clamp((0.0 - x) / 0.24))
    p.barHead.on = p.barStem.on = p.knob.on = home > 0.5 ? 1 : 0
    p.barHead.glow = p.barStem.glow = home * (0.26 + 0.1 * b)
    p.spill.glow = 0.75 * home
    p.flow.on = u > 0.02 && u < 0.98 ? 2 : 0
    p.flow.flow = p.flow.on ? { period: 0.9, size: 14 } : null

    s.state = home > 0.5 ? "locked" : v > 0.9 ? "said" : u > 0.9 && x < JAM + 0.2 ? "only a nod" : u > 0.9 ? "the gain" : "level"
  },
  readout: (s) => s.state || "rest",
})
