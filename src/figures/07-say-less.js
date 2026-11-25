// Chapter 7, Say less: a lift that carries four.
//
// A platform runs up a portal frame on an endless rope; a counterweight of
// four plates hangs on the other side of it. Loaded with seven blocks the
// platform only strains. The three on top slide off onto a table beside it,
// and the four left outweigh nothing: the platform rises to a landing, stops
// flush with it, and the door there lights.
//
// The four are the answers that are enough (the point, what it rests on,
// where it stops, what you want). The three are what was said after them: the
// repeat, the hedge, the open offer. They are not thrown away; they wait on
// the table, for when someone asks.
//
// Light: magenta is the point, and the door it reaches; teal is the three
// answers that go up with it. While the load is too heavy nothing is lit.
//
// The pointer decides how much is said: over the table's far end nothing
// extra is on the platform; drawn back toward the lift, it calls the platform
// down and the extras return one by one, and one is enough to keep it there.

import { arc, clamp, cycle, easeIn, easeInOut, easeOut, figure, keys, rrect } from "../lib/iso/core.js"

const T = 9 // seconds per lap
const FLOOR = 0.5 // the platform's top, down
const RISE = 2.3 // how far it travels
const LAND = FLOOR + RISE // the landing's top
const B = 0.9 // a block's width and depth
const BH = 0.7 // and height
const Q = 0.5 // the blocks' centres, either side of the platform's
const SHELF = FLOOR + BH // the table's top: level with the tops of the four
const GO = 2.2 // how far an extra slides, from the platform to the table
const FY0 = -1.78 // the frame's back and front
const FY1 = -1.4
const ROPE = -1.59 // the rope's plane
const BEAM = 4.2 // the beam's underside
const BEAM_H = 0.42
const CW = 2.02 // the counterweight's centre along x
const CW_DOWN = 0.35 // its underside when the platform is up
const CW_PLATE = 0.28

// The four answers, far to near: [x, y, light]. The point stands nearest.
const FOUR = [
  ["four0", -Q, -Q, 2],
  ["four1", Q, -Q, 2],
  ["four2", -Q, Q, 2],
  ["point", Q, Q, 1],
]
// The extras, in the order they leave: the front row first, then the one behind it.
const EXTRA = [
  [-Q, Q],
  [Q, Q],
  [Q, -Q],
]
const LEAVE = [1.75, 2.1, 2.5] // seconds into the lap
const SLIDE = 0.62
const UP0 = 3.2
const UP1 = 4.5
const DOWN0 = 7.2
const DOWN1 = 8.1

/** A plan of two overlapping rectangles (a T), rounded, as [x, y] counterclockwise. */
function plan() {
  const r = 0.4
  const X0 = -3.75
  const X1 = 3.05
  const Y0 = -2.15
  const Y1 = 1.4
  const tx0 = -1.4
  const tx1 = 1.4
  const ty = 3.65
  const c = (cx, cy, a0, a1) => arc(cx, cy, r, a0, a1, 6)
  return [
    ...c(X1 - r, Y0 + r, -90, 0),
    ...c(X1 - r, Y1 - r, 0, 90),
    ...c(tx1 + r, Y1 + r, 270, 180),
    ...c(tx1 - r, ty - r, 0, 90),
    ...c(tx0 + r, ty - r, 90, 180),
    ...c(tx0 - r, Y1 + r, 0, -90),
    ...c(X0 + r, Y1 - r, 90, 180),
    ...c(X0 + r, Y0 + r, 180, 270),
  ]
}

/** The part of a sheave that stands above the beam, in (u, v) about its axle. */
function sheave(r, cut) {
  const a = (Math.asin(cut / r) * 180) / Math.PI
  return arc(0, 0, r, a, 180 - a, 28)
}

/** Where everything is at time lt into the lap, without a pointer. */
function loopAt(lt) {
  const off = EXTRA.map((_, j) =>
    keys(lt, [
      [LEAVE[j], 0],
      [LEAVE[j] + SLIDE, 1, easeInOut],
      [DOWN1 + 0.05 + (2 - j) * 0.1, 1],
      [DOWN1 + 0.6 + (2 - j) * 0.1, 0, easeInOut],
    ])
  )
  const up = keys(lt, [
    [0, 0],
    [0.45, 0],
    [0.7, 0.045, easeOut],
    [0.95, 0, easeIn],
    [1.05, 0],
    [1.28, 0.045, easeOut],
    [1.5, 0, easeIn],
    [UP0, 0],
    [UP1, 1, easeInOut],
    [DOWN0, 1],
    [DOWN1, 0, easeInOut],
    [T, 0],
  ])
  return { off, up }
}

export default figure({
  slug: "07-say-less",
  title: "The lift that carries four",
  desc: "A lift on a portal frame has risen to a landing, where a door is lit. It carries four blocks: a magenta one, the point, and three teal ones. Its counterweight, four plates, hangs low on the other side of the frame. Three plain blocks, taken off before it could rise, wait on a table at its foot.",
  plate: "Say less",
  sentence:
    "The viewer sees a lift loaded with seven blocks strain and stay down until the three on top slide off, and then rise with the four that are left and light the door at the landing, which explains where to stop: four answers carry a point to the listener, and every sentence after them holds it down.",
  view: { scale: 34.5, origin: [300, 270] },
  still: 5.4,
  build(k) {
    k.grid("board", { at: [-5.2, -4.0, -0.3], size: [10.5, 9.1], step: 0.7 })
    const pl = plan()
    k.extrude("base", { at: [0, 0, 0], face: "+z", shape: pl.map(([x, y]) => [x, -y]), depth: 0.3, layer: -3 })
    ;[
      [-3.45, -1.85],
      [-3.45, 1.1],
      [2.75, 0.9],
      [0, 3.42],
    ].forEach(([x, y], j) => k.led(`screw${j}`, { at: [x, y, 0.002], face: "+z", r: 0.07, layer: -2 }))
    // The pit the platform rests in, scored on the plate.
    k.face("pit", { at: [0, 0, 0.002], pts: rrect(-1.2, -1.2, 1.2, 1.2, 0.2).map(([x, y]) => [x, y, 0]), role: "recess", layer: -2 })

    // The frame: three posts, a beam, two sheaves. The rope is endless, so its
    // two falls hang the full height of the frame and never change.
    k.block("postA", { at: [-1.5, FY0, 0], size: [0.28, FY1 - FY0, BEAM], r: 0.06, layer: 0 })
    k.block("postB", { at: [1.22, FY0, 0], size: [0.28, FY1 - FY0, BEAM], r: 0.06, layer: 0 })
    k.block("footL", { at: [-0.2, ROPE - 0.16, 0], size: [0.4, 0.32, 0.16], r: 0.08, layer: 0.01 })
    k.block("footR", { at: [CW - 0.2, ROPE - 0.16, 0], size: [0.4, 0.32, 0.16], r: 0.08, layer: 0.01 })
    k.wire("ropeL", { pts: [[0, ROPE, BEAM], [0, ROPE, 2], [0, ROPE, 0.16]], layer: 0.02 })
    k.wire("ropeR", { pts: [[CW, ROPE, BEAM], [CW, ROPE, 2], [CW, ROPE, 0.16]], layer: 0.02 })
    k.block("postC", { at: [2.56, FY0, 0], size: [0.28, FY1 - FY0, BEAM], r: 0.06, layer: 0.06 })
    k.block("beam", { at: [-1.66, FY0 - 0.06, BEAM], size: [4.66, FY1 - FY0 + 0.12, BEAM_H], r: 0.12, layer: 0.08 })
    k.detail("beamseam", { pts: [[-1.54, FY1 + 0.061, BEAM + 0.1], [0.5, FY1 + 0.061, BEAM + 0.1], [2.9, FY1 + 0.061, BEAM + 0.1], [2.998, FY1 - 0.02, BEAM + 0.1], [2.998, FY0, BEAM + 0.1]], layer: 0.085 })
    const SR = 0.42
    const top = BEAM + BEAM_H
    const axle = top + 0.1
    const sh = sheave(SR, -0.1)
    ;[0.42, CW - 0.42].forEach((x, j) => {
      k.extrude(`sheave${j}`, { at: [x, ROPE + 0.09, axle], face: "+y", shape: sh, depth: 0.18, layer: 0.09 + j * 0.01 })
      k.led(`axle${j}`, { at: [x, ROPE + 0.092, axle], face: "+y", r: 0.07, layer: 0.095 + j * 0.01 })
    })
    const over = (cx, a0, a1) => arc(cx, axle, SR, a0, a1, 14).map(([x, z]) => [x, ROPE, z])
    k.wire("ropeT", { pts: [...over(0.42, 180, 90), ...over(CW - 0.42, 90, 0)], layer: 0.12 })

    // The counterweight: four plates, for four answers.
    k.group("cw", { at: [CW, 0, CW_DOWN] })
    for (let i = 0; i < 4; i++)
      k.block(`plate${i}`, { at: [-0.46, FY0 + 0.02, i * CW_PLATE], size: [0.92, 0.4, CW_PLATE], r: 0.08, parent: "cw", layer: 0.04 + i * 0.001 })
    k.cyl("eye", { at: [0, ROPE, 4 * CW_PLATE], radius: 0.09, h: 0.14, parent: "cw", layer: 0.05 })

    // The landing: a deck on legs, with a door at its far end.
    const DX0 = -3.45
    const DX1 = -1.16
    const DY = 1.05
    ;[
      [DX0 + 0.4, -DY + 0.3],
      [DX1 - 0.25, -DY + 0.3],
      [DX0 + 0.4, DY - 0.3],
      [DX1 - 0.25, DY - 0.3],
    ].forEach(([x, y], j) => {
      k.cyl(`lfoot${j}`, { at: [x, y, 0], radius: 0.2, h: 0.08, layer: 0.15, bias: j * 0.01 - 0.5 })
      k.cyl(`leg${j}`, { at: [x, y, 0.08], radius: 0.1, h: LAND - 0.28, layer: 0.15 })
    })
    k.block("deck", { at: [DX0, -DY, LAND - 0.2], size: [DX1 - DX0, 2 * DY, 0.2], r: 0.14, layer: 0.16 })
    k.halo("deckspill", { at: [-2.3, 0, LAND + 0.002], r: 1.0, on: 1, layer: 0.165 })
    // Its leaf stands in the middle of the frame's thickness and comes down to the deck.
    k.face("pane", { at: [DX0 + 0.22, 0, LAND + 0.68], pts: [[0, 0.5, -0.67], [0, -0.5, -0.67], [0, -0.5, 0.7], [0, 0.5, 0.7]], role: "glass", layer: 0.17 })
    const frame = [[-0.74, 0], [-0.5, 0], [-0.5, 1.38], [0.5, 1.38], [0.5, 0], [0.74, 0], [0.74, 1.64], [-0.74, 1.64]]
    k.extrude("door", { at: [DX0 + 0.34, 0, LAND], face: "+x", shape: frame, depth: 0.24, layer: 0.175 })

    // Where the platform will stop: flush with the landing.
    k.guide("level", { pts: [[-1.08, 1.08, LAND], [1.08, 1.08, LAND], [1.08, -1.12, LAND], [-1.08, -1.12, LAND], [-1.08, 1.08, LAND]], layer: 0.62 })

    // The platform, with the plate it hangs by, and the four answers.
    k.group("lift", { at: [0, 0, FLOOR] })
    k.block("shoeA", { at: [-1.3, -1.36, 0.2], size: [0.3, 0.2, 0.5], r: 0.06, parent: "lift", layer: 0.28 })
    k.block("shoeB", { at: [1.0, -1.36, 0.2], size: [0.3, 0.2, 0.5], r: 0.06, parent: "lift", layer: 0.28 })
    k.block("hang", { at: [-1.05, -1.3, -0.2], size: [2.1, 0.18, 1.6], r: 0.08, parent: "lift", layer: 0.29 })
    k.detail("hangseam", { pts: [[-0.75, -1.118, 1.1], [0.75, -1.118, 1.1], [0.75, -1.118, 0.7]], parent: "lift", layer: 0.295 })
    k.block("hitch", { at: [-0.14, -1.72, 0.95], size: [0.28, 0.44, 0.22], r: 0.05, parent: "lift", layer: 0.285 })
    k.block("slab", { at: [-1.08, -1.12, -0.2], size: [2.16, 2.2, 0.2], r: 0.14, parent: "lift", layer: 0.3 })
    FOUR.forEach(([id, x, y]) => {
      k.block(id, { at: [x - B / 2, y - B / 2, 0], size: [B, B, BH], r: 0.16, parent: "lift", layer: 0.32 })
    })

    // The table, level with the tops of the four.
    ;[
      [-0.9, 1.32],
      [0.9, 1.32],
      [-0.9, 3.2],
      [0.9, 3.2],
    ].forEach(([x, y], j) => k.cyl(`tleg${j}`, { at: [x, y, 0], radius: 0.09, h: SHELF - 0.18, layer: 0.5 }))
    k.block("table", { at: [-1.08, 1.14, SHELF - 0.18], size: [2.16, 2.24, 0.18], r: 0.14, layer: 0.52 })

    // The extras.
    EXTRA.forEach(([x, y], j) => {
      k.block(`extra${j}`, { at: [x - B / 2, y - B / 2, SHELF], size: [B, B, BH], r: 0.16, layer: 0.6 })
    })
    k.label("max", { at: [2.18, FY1 + 0.062, BEAM + 0.23], text: "MAX 4", face: "+y", size: 0.24, layer: 0.1 })
  },
  tick(t, s, input) {
    const { p, groups } = s
    const lt = cycle(t, T) * T
    const L = loopAt(lt)

    // The pointer decides how many extras are on: along the lane of the table
    // and the lift, on the fixed plane of the table's top; at the landing, none.
    let want = null
    const lane = input.onPlane ? input.onPlane(SHELF) : null
    const high = input.onPlane ? input.onPlane(LAND) : null
    if (lane && Math.abs(lane[0]) < 1.35 && lane[1] > -1.2 && lane[1] < 3.7) want = lane[1] > 2.3 ? 0 : lane[1] > 1.55 ? 1 : lane[1] > 0.8 ? 2 : 3
    else if (high && high[0] > -3.6 && high[0] < 1.3 && Math.abs(high[1]) < 1.3) want = 0

    let off = L.off
    let up = L.up
    if (!input.still) {
      // While the reader decides, and afterwards until everything is back where
      // the loop has it, what is asked for is done in the only order that works:
      // an extra goes on while the platform is down, and the platform rises
      // once every extra is off. Otherwise stiff springs follow the loop.
      if (want !== null) s.live = true
      else if (s.live && s.off.every((v, j) => Math.abs(v - L.off[j]) < 0.04) && Math.abs(s.up - L.up) < 0.06) s.live = false
      const live = s.live === true
      const sp = live ? { k: 46, c: 13.6 } : { k: 4000, c: 126 }
      const ask = want !== null ? want : L.off.filter((v) => v < 0.5).length
      const rise = want !== null ? want === 0 : L.up > 0.5
      const o0 = s.off || L.off
      const z0 = s.up ?? L.up
      off = EXTRA.map((_, j) => {
        let to = L.off[j]
        if (live) {
          to = 2 - j < ask ? (z0 < 0.03 || o0[j] < 0.9 ? 0 : 1) : 1
          // One after another: the one behind goes last and comes back first,
          // so it never passes through the one in front of it.
          if (to === 1 && j > 0 && o0[j - 1] < 0.45) to = 0
          if (to === 0 && j < 2 && o0[j + 1] > 0.55) to = 1
        }
        return clamp(input.spring(`off${j}`, to, sp))
      })
      const clear = off.every((v) => v > 0.96)
      const settled = off.filter((v) => v < 0.04).length === ask
      up = clamp(input.spring("up", !live ? L.up : rise && clear ? 1 : ask > 0 && settled ? 0.04 : 0, sp))
      s.up = up
      s.off = off
    } else if (want !== null) {
      off = EXTRA.map((_, j) => (2 - j < want ? 0 : 1))
      up = want === 0 ? 1 : 0
    }

    groups.lift.off[2] = up * RISE
    groups.cw.off[2] = (1 - up) * RISE
    EXTRA.forEach((_, j) => {
      p[`extra${j}`].off[1] = GO * off[j]
      p[`extra${j}`].off[2] = up * RISE * (1 - off[j])
    })

    // What rises lights; what arrives glows.
    const risen = clamp((up - 0.06) / 0.2)
    const there = clamp((up - 0.93) / 0.07)
    for (const [id, , , on] of FOUR) {
      p[id].on = risen > 0 ? on : 0
      p[id].glow = (on === 1 ? 0.28 : 0.1) * risen + (on === 1 ? 0.12 : 0.05) * there
    }
    p.pane.on = there > 0.2 ? 1 : 0
    p.pane.glow = 0.55 * there
    p.deckspill.glow = 0.8 * there
    p.level.fade = clamp(1 - (up - 0.1) / 0.3)
    p.level.hide = p.level.fade < 0.02

    const on = off.filter((v) => v < 0.5).length
    s.state = there > 0.5 ? "4: heard" : on > 0 ? `${4 + on}: too much` : "4"
  },
  readout: (s) => s.state || "rest",
})
