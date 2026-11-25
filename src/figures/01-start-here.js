// Chapter 1, Start here: the point, said first. Two takes of the same
// sixty-second talk lie on a stepped deck, five blocks of twelve seconds each:
// take 1 on the raised back step, take 2 on the floor in front, both on one
// time scale that runs along the riser between them. In take 1 the point is
// the last block; in take 2 it is the first. One reader bridges both tracks
// and plays them at the same speed; each point lights when the reader reaches
// it, so the point of take 2 is lit 48 seconds before the point of take 1.
// A dashed dimension on the riser measures the shift. Teal marks the first
// take (what came first); magenta marks the take that says the point first.

import { arc, breathe, clamp, cycle, easeInOut, easeOut, figure, keys } from "../lib/iso/core.js"

const T = 8 // seconds per lap
const SEC = 1 / 6 // world units per second of talk: 12 s is 2 units, 60 s is 10
const STEP = 12 * SEC // one block: twelve seconds of talk
const GAP = 0.09 // half the gap between two blocks
const RAIL_H = 0.18
const RAIL_D = 1.2
const BLOCK_H = 0.7
const BLOCK_R = 0.16
const UP = 1.1 // height of the back step
const RISER = 1.5 // y of the riser face
const STEP_END = 10.75 // x of the step's right end; the base runs on past it
const BASE_END = 11.3 // x of the base's right end
const Y1 = 0 // take 1: the back track, on the step
const Y2 = 2.55 // take 2: the front track, on the floor, clear of the riser's foot
const BASE_FRONT = Y2 + RAIL_D + 0.8
const TOP1 = UP + RAIL_H + BLOCK_H // block tops, take 1
const TOP2 = RAIL_H + BLOCK_H // block tops, take 2
// On the plane of take 1's tops, a pointer nearer than this is no longer on
// take 1 (its blocks' front faces included), so it is read on take 2's plane.
const SPLIT = Y1 + RAIL_D + 0.65
const RULER_Z = 0.84 // the time scale's base line on the riser
const DIM_Z = 0.55 // the dimension line on the riser
const ARM_Z = TOP1 + 0.12 + 0.36 // underside of the reader's arm
const START = -0.55 // where the reader parks, just before 0 s
const END = 60 * SEC // 60 s
const P1 = 48 * SEC // where the point begins in take 1
const P2 = 0 // where the point begins in take 2
const linear = (u) => u

// A seam round a rounded box's two near faces at height z: from the
// silhouette at its front-left corner, along the front (+y), round the
// front-right corner on its true arc, along the right side (+x), to the
// silhouette at the back-right corner.
const seam = (x0, y0, x1, y1, r, z) =>
  [...arc(x0 + r, y1 - r, r, 133, 90, 4), ...arc(x1 - r, y1 - r, r, 90, 0, 8), ...arc(x1 - r, y0 + r, r, 0, -43, 4)].map(
    ([x, y]) => [x, y, z]
  )

export default figure({
  slug: "01-start-here",
  title: "The point, said first",
  desc: "A stepped deck carries two takes of the same sixty-second talk, five equal blocks each, on one time scale along the riser between them. Take 1, on the back step, keeps its point for the last block (teal: the first take); take 2, in front, says it in the first block (magenta). A reader on both tracks has just passed 48 seconds, and a dashed dimension on the riser measures the shift: 48 seconds.",
  plate: "Start here",
  sentence:
    "The viewer sees one reader play two takes of the same talk and the point light 48 seconds sooner in the take that says it first, which explains the chapter's one move: say the point first.",
  view: { scale: 29, origin: [190, 134] },
  still: 4.78,
  build(k) {
    k.grid("board", { at: [-3.4, -3.3, -0.32], size: [16.8, 9.8], step: 0.7 })
    k.block("base", { at: [-1.3, -1.45, -0.32], size: [BASE_END + 1.3, BASE_FRONT + 1.45, 0.32], r: 0.45, layer: -3 })
    k.block("step", { at: [-1.15, -1.3, 0], size: [STEP_END + 1.15, RISER + 1.3, UP], r: 0.35, layer: -2 })
    // The reader's slot along the back of the step.
    k.face("slot", {
      pts: [
        [-1.0, -1.0, UP],
        [STEP_END - 0.3, -1.0, UP],
        [STEP_END - 0.3, -0.5, UP],
        [-1.0, -0.5, UP],
      ],
      role: "recess",
      layer: -1,
    })
    // Two tracks, one per take.
    k.block("rail1", { at: [-0.35, Y1, UP], size: [10.7, RAIL_D, RAIL_H], r: 0.12, layer: -2 })
    k.block("rail2", { at: [-0.35, Y2, 0], size: [10.7, RAIL_D, RAIL_H], r: 0.12, layer: -2 })
    // The time scale they share, graduated along the riser: a long mark every
    // twelve seconds, a short one every three. The witness of take 1 stands in
    // for the mark at 48 s.
    const ruler = []
    for (let i = 0; i <= 20; i++) {
      const x = i * 3 * SEC
      ruler.push([x, RISER, RULER_Z])
      if (Math.abs(x - P1) > 1e-6) ruler.push([x, RISER, RULER_Z + (i % 4 ? 0.08 : 0.17)], [x, RISER, RULER_Z])
    }
    k.detail("ruler", { pts: ruler, layer: -1 })
    // A vent grille on the step's end.
    for (let i = 0; i < 4; i++)
      k.detail(`vent${i}`, {
        pts: [
          [STEP_END, -0.45, 0.32 + i * 0.15],
          [STEP_END, 0.65, 0.32 + i * 0.15],
        ],
      })
    // The dimension: where the point begins in each take, carried to the riser.
    k.guide("wit2", {
      pts: [
        [P2, Y2, 0],
        [P2, RISER, 0],
        [P2, RISER, DIM_Z - 0.12],
      ],
      layer: -1,
    })
    k.guide("wit1", {
      pts: [
        [P1, Y1 + RAIL_D, UP],
        [P1, RISER, UP],
        [P1, RISER, DIM_Z + 0.12],
      ],
      layer: -1,
    })
    k.guide("dim", {
      pts: [
        [P2, RISER, DIM_Z],
        [P1, RISER, DIM_Z],
      ],
      layer: -1,
    })
    for (const [id, x] of [
      ["end2", P2],
      ["end1", P1],
    ])
      k.detail(id, {
        pts: [
          [x, RISER, DIM_Z - 0.12],
          [x, RISER, DIM_Z + 0.12],
        ],
        layer: -1,
      })
    k.label("shift", { at: [(P1 + P2) / 2, RISER, 0.25], text: "48 sec", face: "+y", size: 0.4, layer: -1 })
    // Light spilled round each point while it is lit, kept on the surface the
    // block stands on: take 1's stops at the step's edge, take 2's at the base's.
    k.halo("spill2", { at: [P2 + STEP / 2, Y2 + RAIL_D / 2, RAIL_H], r: 1.4, layer: -1, on: 1 })
    k.halo("spill1", { at: [P1 + STEP / 2, RISER - 1.3, UP + RAIL_H], r: 1.3, layer: -1, on: 2 })
    // Five blocks of twelve seconds per take: the point is a4 (last, take 1)
    // and b0 (first, take 2). A lid seam runs round each block's near faces.
    for (let i = 0; i < 5; i++) {
      const x0 = i * STEP + GAP
      const x1 = (i + 1) * STEP - GAP
      for (const [name, y, z] of [
        ["a", Y1, UP],
        ["b", Y2, 0],
      ]) {
        k.block(`${name}${i}`, { at: [x0, y + 0.1, z + RAIL_H], size: [x1 - x0, RAIL_D - 0.2, BLOCK_H], r: BLOCK_R })
        k.detail(`${name}${i}s`, {
          pts: seam(x0, y + 0.1, x1, y + RAIL_D - 0.1, BLOCK_R, z + RAIL_H + BLOCK_H - 0.17),
          bias: 0.5,
        })
      }
    }
    // The reader: a carriage in the slot, a post, and an arm over both tracks
    // with a head over each take, the front one hung on a rod. Paint order,
    // near the reader: head2 < rod < arm < rivets, so the arm hides the rod's top.
    k.group("reader", { at: [0, 0, 0] })
    const R = { parent: "reader" }
    k.block("carriage", { at: [-0.36, -1.02, UP], size: [0.72, 0.54, 0.1], r: 0.1, ...R })
    k.block("post", { at: [-0.25, -1.0, UP + 0.1], size: [0.5, 0.5, ARM_Z - UP - 0.1], r: 0.14, ...R })
    k.detail("postSeam", { pts: seam(-0.25, -1.0, 0.25, -0.5, 0.14, ARM_Z - 0.22), bias: 0.8, ...R })
    k.block("head1", { at: [-0.2, Y1 + 0.3, TOP1 + 0.12], size: [0.4, 0.6, 0.36], r: 0.1, bias: 3, ...R })
    k.block("head2", { at: [-0.2, Y2 + 0.3, TOP2 + 0.12], size: [0.4, 0.6, 0.3], r: 0.1, bias: 3, ...R })
    k.cyl("rod", { at: [0, Y2 + 0.6, TOP2 + 0.42], radius: 0.06, h: ARM_Z - TOP2 - 0.42, bias: 2.6, ...R })
    // A lens on each head's leading face (+x), the side that meets the talk
    // first; wound so its 3D normal points out of the head.
    for (const [id, y, z] of [
      ["lens1", Y1 + 0.6, TOP1 + 0.18],
      ["lens2", Y2 + 0.6, TOP2 + 0.19],
    ])
      k.face(id, {
        pts: [
          [0.206, y + 0.13, z],
          [0.206, y - 0.13, z],
          [0.206, y - 0.13, z + 0.13],
          [0.206, y + 0.13, z + 0.13],
        ],
        role: "glass",
        bias: 3.4,
        ...R,
      })
    k.block("arm", { at: [-0.25, -1.0, ARM_Z], size: [0.5, Y2 + 1.05 + 1.0, 0.3], r: 0.14, bias: 4.5, ...R })
    // Rivets from where the arm sits on the post to where it holds the rod.
    for (let i = 0; i < 5; i++)
      k.led(`rivet${i}`, { at: [0.25, -0.75 + (i * (Y2 + 0.6 + 0.75)) / 4, ARM_Z + 0.15], face: "+x", r: 0.05, bias: 9, ...R })
  },
  tick(t, s, input) {
    const { p, groups } = s
    const lap = cycle(t, T)

    // The lap: parked, both takes play at one speed, hold at 60 s, rewind.
    const run = keys(lap, [
      [0, START],
      [0.08, START],
      [0.7, END, linear],
      [0.86, END],
      [1, START, easeInOut],
    ])

    // The pointer scrubs the reader along the tracks; without it the lap runs.
    // It is read on two fixed planes: take 1's block tops while it is over the
    // back step, take 2's block tops everywhere else.
    const a1 = input.onPlane ? input.onPlane(TOP1) : null
    const aim = a1 && a1[1] < SPLIT ? a1 : input.onPlane ? input.onPlane(TOP2) : null
    const over = aim && aim[0] > -1.8 && aim[0] < 11.8 && aim[1] > -1.8 && aim[1] < BASE_FRONT + 0.4
    const x = input.spring("x", over ? clamp(aim[0], START, END) : run)
    groups.reader.off[0] = x

    // A point lights when the reader reaches where it begins, and stays lit:
    // from then on the listener has it. It flares once as it lights: a quick
    // tween less a slow one, so the flare follows the event (forward, by the
    // lap or the pointer), never the rewind, and is zero in the still.
    const flare = (key, on) =>
      clamp(input.tween(`${key}+`, on ? 1 : 0, { dur: 0.14 }) - input.tween(`${key}-`, on ? 1 : 0, { dur: 1.3, ease: easeOut }))
    const lit2 = x >= P2
    const lit1 = x >= P1
    const f2 = flare("b0", lit2)
    const f1 = flare("a4", lit1)
    const calm = input.still ? 0 : 0.05 * breathe(t, 2.6)
    // At rest the point said first leads: magenta sits brighter than teal.
    p.b0.on = p.b0s.on = lit2 ? 1 : 0
    p.b0.glow = lit2 ? 0.55 + calm + 0.4 * f2 : 0
    p.spill2.glow = lit2 ? 0.95 + 0.05 * f2 : 0
    p.a4.on = p.a4s.on = lit1 ? 2 : 0
    p.a4.glow = lit1 ? 0.3 + calm + 0.5 * f1 : 0
    p.spill1.glow = lit1 ? 0.7 + 0.3 * f1 : 0

    // The dimension comes up in full as the reader reaches 48 s.
    const dimFade = 0.4 + 0.6 * clamp((x - (P1 - 0.35)) / 0.35)
    for (const id of ["dim", "wit1", "wit2", "end1", "end2", "shift"]) p[id].fade = dimFade

    const secs = Math.round(clamp(x, 0, END) / SEC)
    const clock = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`
    s.state = x < P2 ? "ready" : lit1 ? `${clock} · both` : `${clock} · take 2`
  },
  readout: (s) => s.state || "rest",
})
