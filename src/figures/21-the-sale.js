// Chapter 21, The sale: a load that has to go on without the crane.
//
// A gantry on two wide rails carries a slab, the decision. A wall stops the
// rails; in the wall is a gate, wide enough for the slab and too narrow for
// the gantry. Carried, the slab gets as far as the wall and comes back. Then
// three struts run in under it, one at a time, on the sled that runs through
// the gate: the problem in their numbers (the one with the scale rings), the
// price, the limit (the one with the collar). Only when all three stand there
// does the gantry set the slab down, open its claws, lift and draw back. The
// slab rolls through the gate on its own struts and stands on the far side.
//
// Light: teal is the three struts, each from the moment it is in place.
// Magenta is the decision, from the moment nothing holds it but them. At rest
// only those glow.
//
// The pointer asks the slab along the track. On your side of the wall the
// gantry carries it to the pointer, as far as the wall. Beyond the wall it
// goes only once the struts are in and the gantry has let go.

import { breathe, clamp, cycle, easeIn, easeInOut, easeOut, figure, keys, lerp, ring } from "../lib/iso/core.js"

const T = 10 // seconds per lap

// Along x: the shelf, the sled's home, the wall, the far end of the track.
const HOME = -0.95 // where the gantry sets the slab on the sled
const BACK = -3.05 // where the gantry draws back to
const WALL = 1.06 // the wall's near face
const THICK = 0.34
const FAR = 3.02 // where the sled stops
const FOOT = 0.74 // half a gantry foot: it stops when this meets the wall
const REACH = WALL - FOOT // as far as the gantry can carry
// Across y.
const RAIL = 1.72 // the gantry's rails
const GATE = 0.86 // half the gate
const SLAB = [0.76, 0.72] // half the slab
// Up z.
const DECK = 0.42 // the sled's top, level with the shelf
const LEG = 1.16
const SEAT = DECK + LEG // the slab's underside when it stands
const HANG = 0.15 // how far above that the gantry holds it
const SLAB_H = 0.3
const BEAM = 2.82
const LIFT = 0.46

// The struts, on the sled and parked on the shelf.
const STRUTS = [
  { x: 0.44, y: -0.44, park: 2.05 },
  { x: 0.44, y: 0.44, park: 2.05 },
  { x: -0.44, y: 0, park: 1.95 },
]

// The lap, in seconds.
const GO = 0.25
const BUMP = 1.0
const BACK1 = 1.5
const RET = 2.2
const RUN0 = 2.3
const RUN1 = 5.9
const LEAVE = 7.8
const END = 9.8

/** The run, as one number: struts in, slab down, claws open, hook up, gantry back, sled through. */
const span = (q, a, b, e = easeInOut) => e(clamp((q - a) / (b - a)))
const run = (q) => ({
  in: STRUTS.map((_, i) => span(q, i * 0.11, i * 0.11 + 0.16)),
  down: span(q, 0.4, 0.46),
  open: span(q, 0.47, 0.52),
  up: span(q, 0.52, 0.6),
  back: span(q, 0.57, 0.77),
  through: span(q, 0.64, 1),
})

/** The loop: where the gantry carries the slab, and how far the run has gone. */
function loopAt(lt) {
  const gx = keys(lt, [
    [0, HOME],
    [GO, HOME],
    [BUMP, REACH, easeIn],
    [BUMP + 0.12, REACH - 0.09, easeOut],
    [BUMP + 0.28, REACH, easeIn],
    [BACK1, REACH],
    [RET, HOME, easeInOut],
    [T, HOME],
  ])
  const q = keys(lt, [
    [0, 0],
    [RUN0, 0],
    [RUN1, 1, (u) => u],
    [LEAVE, 1],
    [END, 0, (u) => u],
    [T, 0],
  ])
  return { gx, q }
}

export default figure({
  slug: "21-the-sale",
  title: "It goes through without the crane",
  desc: "A slab, glowing magenta, stands on three teal struts on a small sled that has rolled through a narrow gate in a wall. Behind the wall a gantry too wide for the gate has drawn back on its rails, its claws open and empty.",
  plate: "The sale",
  sentence:
    "The viewer sees a gantry carry a slab no further than a wall, then set it on three struts, let go and draw back while the slab rolls through the narrow gate alone, which explains what a sale has to leave behind: a decision that stands on its own numbers, price and limit, where you can't go with it.",
  view: { scale: 37, origin: [288, 254] },
  still: 7.2,
  build(k) {
    k.grid("board", { at: [-5.2, -3.5, -0.3], size: [10.4, 7], step: 0.7 })
    k.block("base", { at: [-4.5, -2.3, -0.3], size: [8.9, 4.6, 0.3], r: 0.4, layer: -3 })
    ;[
      [-4.25, -2.05],
      [-4.25, 2.05],
      [4.15, -2.05],
      [4.15, 2.05],
    ].forEach(([x, y], i) => k.led(`screw${i}`, { at: [x, y, 0.002], face: "+z", r: 0.07, layer: -2 }))
    k.halo("spill", { at: [FAR, 0, 0.003], r: 1.7, on: 1, layer: -1.5 })
    // The wide rails end at the wall; the narrow track goes on through the gate.
    for (const [i, y] of [-RAIL, RAIL].entries()) k.block(`rail${i}`, { at: [-4.1, y - 0.08, 0], size: [WALL + 4.1, 0.16, 0.1], r: 0.02, layer: i ? 2.9 : -0.6 })
    for (const [i, y] of [-0.46, 0.46].entries()) k.block(`track${i}`, { at: [-1.95, y - 0.05, 0], size: [5.9, 0.1, 0.08], r: 0.02, layer: -0.5 + i * 0.05 })
    k.block("stop", { at: [FAR + 0.9, -0.62, 0], size: [0.2, 1.24, 0.42], r: 0.06, layer: 2.6 })

    // The gantry's far side.
    k.group("gantry", { at: [0, 0, 0] })
    const frame = [
      [-0.62, 0],
      [-0.36, 0],
      [0, BEAM - 0.86],
      [0.36, 0],
      [0.62, 0],
      [0.17, BEAM - 0.36],
      [-0.17, BEAM - 0.36],
    ]
    for (const [i, y] of [-RAIL, RAIL].entries()) {
      const L = i ? 3 : 0
      for (const [j, x] of [-0.48, 0.48].entries())
        k.extrude(`wheel${i}${j}`, { at: [x, y + 0.2, 0.24], shape: ring(0, 0, 0.14, 24), face: "+y", depth: 0.08, parent: "gantry", layer: L + 0.1 })
      k.block(`foot${i}`, { at: [-FOOT, y - 0.15, 0.16], size: [2 * FOOT, 0.3, 0.2], r: 0.06, parent: "gantry", layer: L + 0.05 })
      k.extrude(`frame${i}`, { at: [0, y + 0.1, 0.36], shape: frame, face: "+y", depth: 0.2, parent: "gantry", layer: L + 0.2 })
    }
    k.block("beam", { at: [-0.21, -RAIL - 0.24, BEAM], size: [0.42, 2 * RAIL + 0.48, 0.26], r: 0.06, parent: "gantry", layer: 4 })
    k.block("trolley", { at: [-0.3, -0.4, BEAM + 0.26], size: [0.6, 0.8, 0.44], r: 0.08, parent: "gantry", layer: 4.1 })

    // The shelf the struts wait on, with a lane for each.
    k.block("shelf", { at: [-4.1, -0.72, 0], size: [2.22, 1.44, DECK], r: 0.12, layer: 0.5 })
    STRUTS.forEach(({ x, y, park }, i) =>
      k.face(`lane${i}`, {
        at: [0, 0, DECK + 0.002],
        pts: [
          [HOME + x - park - 0.22, y - 0.1],
          [-1.9, y - 0.1],
          [-1.9, y + 0.1],
          [HOME + x - park - 0.22, y + 0.1],
        ].map(([a, b]) => [a, b, 0]),
        role: "recess",
        layer: 0.52,
      })
    )

    // The wall: two wings and the posts of the gate between them.
    k.block("wingB", { at: [WALL, -2.14, 0], size: [THICK, 2.14 - GATE - 0.28, 1.16], r: 0.03, layer: 0.8 })
    k.block("postB", { at: [WALL, -GATE - 0.28, 0], size: [THICK, 0.28, 1.9], r: 0.03, layer: 0.82 })
    k.block("postF", { at: [WALL, GATE, 0], size: [THICK, 0.28, 1.9], r: 0.03, layer: 5 })
    k.block("wingF", { at: [WALL, GATE + 0.28, 0], size: [THICK, 2.14 - GATE - 0.28, 1.16], r: 0.03, layer: 5.1 })

    // The sled and the struts.
    k.group("sled", { at: [0, 0, 0] })
    k.block("deck", { at: [-0.88, -0.66, 0.12], size: [1.76, 1.32, DECK - 0.12], r: 0.14, parent: "sled", layer: 1 })
    for (const [j, x] of [-0.56, 0.56].entries())
      k.extrude(`roll${j}`, { at: [x, 0.73, 0.21], shape: ring(0, 0, 0.13, 24), face: "+y", depth: 0.07, parent: "sled", layer: 1.02 })
    k.halo("base2", { at: [0, 0, DECK + 0.003], r: 0.95, on: 2, parent: "sled", layer: 1.04 })
    STRUTS.forEach(({ x, y }, i) => {
      k.face(`cup${i}`, { at: [x, y, DECK + 0.002], pts: ring(0, 0, 0.27, 28).map(([a, b]) => [a, b, 0]), role: "recess", parent: "sled", layer: 1.03 })
      k.group(`s${i}`, { at: [x, y, DECK], parent: "sled" })
      // Painted far lane, middle lane, near lane.
      const L = 1.1 + [0, 0.2, 0.1][i]
      k.cyl(`sole${i}`, { at: [0, 0, 0], radius: 0.23, h: 0.09, n: 32, parent: `s${i}`, layer: L })
      k.cyl(`strut${i}`, { at: [0, 0, 0.09], radius: 0.145, h: LEG - 0.09, n: 32, parent: `s${i}`, layer: L + 0.01 })
    })
    for (const [j, z] of [0.3, 0.46, 0.62].entries()) k.cyl(`scale${j}`, { at: [0, 0, z], radius: 0.172, h: 0.045, n: 32, parent: "s0", layer: 1.12 + j * 0.001 })
    k.cyl("collar", { at: [0, 0, 0.52], radius: 0.21, h: 0.14, n: 32, parent: "s2", layer: 1.22 })

    // The slab, and the claws that carry it.
    k.block("slab", { at: [-SLAB[0], -SLAB[1], SEAT], size: [2 * SLAB[0], 2 * SLAB[1], SLAB_H], r: 0.2, layer: 2 })
    k.group("hook", { at: [0, 0, SEAT + HANG], parent: "gantry" })
    const y0 = SLAB[1] + 0.03
    k.block("armB", { at: [-0.15, -y0 - 0.12, -0.06], size: [0.3, 0.12, SLAB_H + 0.24], r: 0.03, parent: "hook", layer: 1.9 })
    k.block("lipB", { at: [-0.15, -y0 - 0.12, -0.15], size: [0.3, 0.3, 0.09], r: 0.03, parent: "hook", layer: 1.89 })
    k.block("armF", { at: [-0.15, y0, -0.06], size: [0.3, 0.12, SLAB_H + 0.24], r: 0.03, parent: "hook", layer: 2.2 })
    k.block("lipF", { at: [-0.15, y0 - 0.18, -0.15], size: [0.3, 0.3, 0.09], r: 0.03, parent: "hook", layer: 2.19 })
    k.cyl("rod", { at: [0, 0, SLAB_H + 0.3], radius: 0.05, h: BEAM + 0.16 - (SEAT + HANG + SLAB_H + 0.3), n: 20, parent: "hook", layer: 2.4 })
    k.block("spreader", { at: [-0.17, -y0 - 0.26, SLAB_H + 0.16], size: [0.34, 2 * y0 + 0.52, 0.15], r: 0.05, parent: "hook", layer: 2.3 })
  },
  tick(t, s, input) {
    const { p, groups } = s
    const lt = cycle(input.still ? t : t - (s.shift || 0), T) * T
    const L = loopAt(lt)
    let { gx, q } = L

    // The pointer asks the slab along the track, on the fixed plane of the sled's deck.
    const at = input.onPlane ? input.onPlane(DECK) : null
    const ask = at && Math.abs(at[1]) < 2.6 && at[0] > -4.4 && at[0] < 4.6 ? at[0] : null
    if (input.still) {
      if (ask !== null) {
        q = ask > WALL + 0.2 ? 1 : 0
        gx = q ? HOME : clamp(ask, HOME, REACH)
      }
    } else if (ask !== null || s.m) {
      const m = s.m || (s.m = { gx: L.gx, q: L.q, v: 0 })
      const dt = Math.min(input.dt || 0, 0.05)
      const beyond = ask === null ? m.q > 0 : ask > WALL + 0.2
      const gTo = beyond || m.q > 0 || ask === null ? HOME : clamp(ask, HOME - 0.6, REACH)
      m.gx += clamp((gTo - m.gx) * (1 - Math.exp(-dt * 8)), -3 * dt, 3 * dt)
      if (Math.abs(gTo - m.gx) < 0.004) m.gx = gTo
      const ready = Math.abs(m.gx - HOME) < 0.01
      if (beyond && ready) m.q = Math.min(1, m.q + dt / 3)
      else if (!beyond) m.q = Math.max(0, m.q - dt / 1.9)
      gx = m.gx
      q = m.q
      // Let go, the run it was in finishes and the lap goes on from there.
      if (ask === null && ready && (m.q === 1 || m.q === 0)) {
        s.shift = t - (m.q === 1 ? RUN1 + 0.1 : RUN0)
        s.m = null
      }
    }

    const r = run(q)
    const sledX = lerp(HOME, FAR, r.through)
    groups.sled.off[0] = sledX
    groups.gantry.off[0] = lerp(gx, BACK, r.back)
    groups.hook.off[2] = -HANG * r.down + (LIFT + HANG) * r.up * (r.down > 0 ? 1 : 0)
    p.armB.off[1] = p.lipB.off[1] = -0.17 * r.open
    p.armF.off[1] = p.lipF.off[1] = 0.17 * r.open
    p.slab.off[0] = r.up > 0 ? sledX : gx
    p.slab.off[2] = HANG * (1 - r.down)

    // Each strut lights when it is in place, the slab when only they hold it.
    let n = 0
    STRUTS.forEach(({ park }, i) => {
      groups[`s${i}`].off[0] = -park * (1 - r.in[i])
      const lit = r.in[i] > 0.985
      if (lit) n++
      for (const id of [`strut${i}`, `sole${i}`]) p[id].on = lit ? 2 : 0
      p[`strut${i}`].glow = lit ? 0.16 : 0
    })
    for (let j = 0; j < 3; j++) p[`scale${j}`].on = p.strut0.on
    p.collar.on = p.strut2.on
    p.base2.glow = 0.28 * n
    const alone = r.up > 0.25 ? clamp((r.up - 0.25) / 0.3) : 0
    const b = input.still ? 0.5 : breathe(t, 2.8)
    p.slab.on = alone > 0.3 ? 1 : 0
    p.slab.glow = alone * (0.36 + 0.1 * b)
    p.spill.at[0] = sledX
    p.spill.glow = alone * 0.75

    s.state = r.through > 0.98 ? "on its own" : alone > 0.3 ? "let go" : n > 0 ? `${n} of 3` : Math.abs(gx - HOME) > 0.05 ? (gx > REACH - 0.12 ? "no further" : "carried") : "held"
  },
  readout: (s) => s.state || "rest",
})
