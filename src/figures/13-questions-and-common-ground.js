// Chapter 13, Questions and common ground: two shafts, one gallery.
//
// A block of ground is cut open. Two drums stand at the mouths of two shafts,
// yours on the left, theirs on the right, each on the first of four sliding
// floors. At the surface nothing joins the shafts but talk. Then they take
// turns: a word crosses to the other shaft along a rung (teal), the floors
// there slide away down to the level it came from, and that drum drops one
// level deeper. Turn by turn, each starting where the last answer stopped,
// until both stand at the level where the wall between the shafts is open:
// the gallery lights (magenta), the question both want answered.
//
// The pointer sets how deep the talk may go: at the surface both drums stay
// up; at a level they take their turns down to it; only at the gallery does
// the light come on, and only once both have come all the way.

import { breathe, clamp, cycle, easeInOut, figure, lerp, rrect, smooth } from "../lib/iso/core.js"

const T = 10.5 // seconds per lap

// The cut block: x from left to right, y from the back to the cut face.
const YB = 0.95 // the shafts' back wall
const YF = 1.85 // the cut face
const H = 4.6 // the surface
const X = [0, 1.5, 2.85, 5.65, 7.0, 8.5] // left mass, shaft, middle mass, shaft, right mass
const GAL = 1.17 // the gallery's height
const MID = (X[2] + X[3]) / 2

// The drums, and the floors they stand on: 0 at the surface, 4 the gallery's own.
const DR = 0.4
const DH = 0.72
const Z0 = 4.1
const STEP = 0.94
/** The height of level n (0 to 4, fractions between): the last drop is into the gallery, below the wall. */
const levelZ = (n) => (n <= 3 ? Z0 - STEP * n : lerp(Z0 - STEP * 3, 0.01, n - 3))
const RUNG = (n) => levelZ(n) + 0.3
const FLOOR_T = 0.09
const XY = (X[1] + X[2]) / 2 - 0.18 // your drum, toward the open side of its shaft
const XT = (X[3] + X[4]) / 2 - 0.18 // theirs
const YC = (YB + YF) / 2

// The turns, in order, each with a length in seconds: even turns are words,
// odd turns are drops, the last is the light. Word n leaves from level n.
//   word 0 you to them, they drop to 1; word 1 back, you drop to 2; word 2,
//   they drop to 3; word 3, you drop to the gallery; word 4 along the
//   gallery, they drop to it; the gallery lights.
const DUR = [0.42, 0.6, 0.42, 0.72, 0.42, 0.72, 0.42, 0.72, 0.42, 0.6, 0.4]
const N = DUR.length
const START = 0.6
const ENDS = DUR.reduce((a, d) => a.concat([(a.length ? a[a.length - 1] : START) + d]), [])
const LEAVE = 9.1 // the gallery goes dark
const BACK = 9.6 // the floors close and both stand at the surface again

/** How far along the turns lap time tl is: 0 to N, one unit per turn. */
function turnsAt(tl) {
  if (tl <= START) return 0
  let t0 = START
  for (let i = 0; i < N; i++) {
    if (tl < ENDS[i]) return i + (tl - t0) / DUR[i]
    t0 = ENDS[i]
  }
  return N
}

/** In a drop turn the floors slide first (0..1), then the drum falls (0..1). */
const slid = (q, i) => easeInOut(clamp((q - i) / 0.4))
const fell = (q, i) => {
  const u = clamp((q - i - 0.34) / 0.6)
  return u * u
}
/** The level each drum stands at after q turns. */
const levelYou = (q) => 2 * fell(q, 3) + 2 * fell(q, 7)
const levelThem = (q) => fell(q, 1) + 2 * fell(q, 5) + fell(q, 9)
// The drop turn that opens each of the four floors, in each shaft.
const OPENS = { you: [3, 3, 7, 7], them: [1, 5, 5, 9] }

const rect = (x0, x1, y, z0, z1) => [
  [x0, y, z0],
  [x1, y, z0],
  [x1, y, z1],
  [x0, y, z1],
]

export default figure({
  slug: "13-questions-and-common-ground",
  title: "Two shafts, one gallery",
  desc: "A block of ground cut open shows two shafts, yours and theirs, joined through the wall between them by four teal rungs, one level apart: the turns of a conversation, each starting one level below the last. The floors have slid away, both drums stand at the bottom, where the wall is open, and the gallery between them glows magenta.",
  plate: "Questions and common ground",
  sentence:
    "The viewer sees two drums drop down two shafts by turns, each one level below the word that opened its floor, until both stand where the wall between them is open and the gallery lights, which explains common ground: you reach the question you both want answered by following each answer further down and meeting it with something of your own.",
  view: { scale: 33, origin: [186, 190] },
  still: 7.8,
  build(k) {
    k.grid("board", { at: [-2.2, -2.2, -0.26], size: [12.6, 6.3], step: 0.7 })
    k.block("base", { at: [-0.6, -0.5, -0.26], size: [9.7, 3.45, 0.26], r: 0.4, layer: -3 })
    ;[
      [-0.25, 2.6],
      [8.75, 2.6],
      [8.75, -0.15],
    ].forEach(([x, y], i) => k.led(`screw${i}`, { at: [x, y, 0], face: "+z", r: 0.08, layer: -2 }))
    k.halo("spill", { at: [MID, YF + 0.2, 0], r: 2.1, on: 1, layer: -1 })
    k.label("yours", { at: [XY, 2.4, 0.003], text: "yours", face: "+z", size: 0.34, layer: -1 })
    k.label("theirs", { at: [XT, 2.4, 0.003], text: "theirs", face: "+z", size: 0.34, layer: -1 })

    // The ground: one block with two shafts and a gallery cut into its face.
    // The layers run from the back to the front and from left to right, so
    // whatever is in a shaft is painted inside it, and a floor that slides to
    // the right goes into the mass beside it.
    const mass = (id, x0, x1, z0, layer) =>
      k.extrude(id, { at: [0, YF, 0], shape: rrect(x0, z0, x1, H, 0.07, 3), face: "+y", depth: YF, layer })
    const fill = (id, x0, x1, z1, layer) => k.block(id, { at: [x0, 0, 0], size: [x1 - x0, YB, z1], r: 0, layer })
    fill("fillL", X[1], X[2], H, 0)
    // The gallery's back is a thin pane in an alcove: from behind, its light shows too.
    k.block("pane", { at: [X[2], YB - 0.1, 0], size: [X[3] - X[2], 0.1, GAL], r: 0, layer: 0 })
    k.face("gback", { pts: rect(X[2], X[3], YB - 0.104, 0.01, GAL - 0.01), role: "glass", layer: -0.5 })
    fill("fillR", X[3], X[4], H, 2.5)
    const floor = (x0, x1) => [
      [x0, YB, 0.004],
      [x1, YB, 0.004],
      [x1, YF, 0.004],
      [x0, YF, 0.004],
    ]
    k.face("wallL", { pts: rect(X[1], X[2], YB + 0.003, 0, H), role: "glass", layer: 0.3 })
    k.face("wallR", { pts: rect(X[3], X[4], YB + 0.003, 0, H), role: "glass", layer: 2.6 })
    k.face("floorL", { pts: floor(X[1], X[2]), role: "recess", layer: 0.3 })
    k.face("floorR", { pts: floor(X[3], X[4]), role: "recess", layer: 0.3 })
    k.face("gwall", { pts: rect(X[2], X[3], YB + 0.004, 0, GAL), role: "glass", layer: 0.4 })
    k.face("gfloor", { pts: floor(X[2], X[3]), role: "recess", layer: 0.45 })
    k.halo("glow", { at: [MID, YC, 0.01], r: 1.4, on: 1, layer: 0.5 })
    mass("left", X[0], X[1], 0, 0.6)
    mass("middle", X[2], X[3], GAL, 2)
    mass("right", X[4], X[5], 0, 4)
    // The levels, marked on the cut: one ground, the same depth on both sides.
    for (let n = 0; n < 4; n++) {
      const z = levelZ(n)
      k.detail(`stratL${n}`, { pts: [[0, YF, z], [X[1] / 2, YF, z], [X[1], YF, z]], layer: 0.7 })
      k.detail(`stratR${n}`, { pts: [[X[4], YF, z], [X[5], YF, z], [X[5], 0, z]], layer: 4.1 })
      // Round the far sides too, for the turned view (the block hides them here).
      k.detail(`stratB${n}`, { pts: [[0, YF, z], [0, 0, z], [X[1], 0, z], [X[5], 0, z]], layer: -0.5 })
    }

    // The rungs across the middle mass: dashed until a word has crossed.
    for (let n = 0; n < 4; n++) {
      const z = RUNG(n)
      k.guide(`plan${n}`, { pts: [[X[2] + 0.02, YF, z], [MID, YF, z], [X[3] - 0.02, YF, z]], layer: 2.1 })
      k.block(`rung${n}`, { at: [X[2] + 0.34, YF, z - 0.05], size: [X[3] - X[2] - 0.68, 0.08, 0.1], r: 0.03, layer: 2.2, role: "accent2", hide: true })
      k.led(`portL${n}`, { at: [X[2] + 0.18, YF, z], face: "+y", r: 0.075, layer: 2.3 })
      k.led(`portR${n}`, { at: [X[3] - 0.18, YF, z], face: "+y", r: 0.075, layer: 2.3 })
    }

    // The sliding floors and the drum in each shaft. Lower floors are painted first.
    const shaft = (id, x0, x1, layer) => {
      for (let n = 0; n < 4; n++)
        k.block(`${id}Floor${n}`, {
          at: [x0 + 0.03, YB + 0.02, levelZ(n) - FLOOR_T],
          size: [x1 - x0 - 0.06, YF - YB - 0.06, FLOOR_T],
          r: 0.02,
          layer: layer + 0.1 * (3 - n),
        })
      k.group(id, { at: [x0 === X[1] ? XY : XT, YC, levelZ(4)] })
      k.cyl(`${id}Drum`, { at: [0, 0, 0], radius: DR, h: DH, n: 40, parent: id, layer: layer + 0.35 })
      k.detail(`${id}Band`, {
        pts: Array.from({ length: 19 }, (_, i) => {
          const a = ((-45 + i * 10) * Math.PI) / 180
          return [DR * Math.cos(a), DR * Math.sin(a), 0.5]
        }),
        parent: id,
        layer: layer + 0.36,
      })
    }
    shaft("you", X[1], X[2], 1)
    shaft("them", X[3], X[4], 3)

    // The word on its way across.
    k.led("word", { at: [XY, YF + 0.1, RUNG(0)], face: "+y", r: 0.15, on: 2, layer: 6, hide: true })
  },
  tick(t, s, input) {
    const { p, groups } = s
    const tl = cycle(t, T) * T

    // The lap: the turns run down; hold; the gallery goes dark; both stand at the surface again.
    const loopQ = tl < BACK ? turnsAt(tl) : 0
    const dark = clamp((tl - LEAVE) / 0.3)
    const gone = tl < LEAVE ? 0 : tl < BACK ? smooth((tl - LEAVE - 0.1) / (BACK - LEAVE - 0.1)) : 1 - smooth((tl - BACK) / 0.4)

    // The pointer, on the plane of the cut face: how deep the talk may go.
    let depth = null
    if (input.onPlane) {
      const a = input.onPlane(0)
      const b = input.onPlane(1)
      if (a && b && Math.abs(b[1] - a[1]) > 1e-6) {
        const h = (YF - a[1]) / (b[1] - a[1])
        const x = a[0] + h * (b[0] - a[0])
        if (x > -0.4 && x < X[5] + 0.4 && h > -0.4 && h < H + 1.2) depth = clamp(Math.round((RUNG(0) - h) / STEP), 0, 4)
      }
    }
    const goal = depth === null ? loopQ : [0, 2, 4, 6, N][depth]
    const m = input.tween("ptr", depth === null ? 0 : 1, { dur: 0.45 })
    const q = clamp(input.spring("q", goal, { k: 14, c: 8 }), 0, N)

    // Where the drums stand, and which floors are open.
    const you = lerp(levelYou(loopQ), levelYou(q), m)
    const them = lerp(levelThem(loopQ), levelThem(q), m)
    const fade = 1 - gone * (1 - m)
    for (const [id, lv, layer] of [
      ["you", you, 1],
      ["them", them, 3],
    ]) {
      groups[id].off[2] = levelZ(lv) - levelZ(4)
      // A drum is painted over the floor it stands on and under the ones above it.
      const over = layer + 0.1 * (3 - Math.min(3, Math.ceil(lv - 0.02))) + 0.05
      const at = lv > 3.02 ? layer - 0.05 : over
      p[`${id}Drum`].layer = at
      p[`${id}Band`].layer = at + 0.01
      p[`${id}Drum`].fade = p[`${id}Band`].fade = fade
      for (let n = 0; n < 4; n++) {
        const i = OPENS[id][n]
        p[`${id}Floor${n}`].off[0] = (X[2] - X[1]) * lerp(slid(loopQ, i) * (1 - gone), slid(q, i), m)
      }
    }

    // The rungs light as the words cross them, and stay.
    for (let n = 0; n < 4; n++) {
      const vis = lerp(smooth(clamp(loopQ - 2 * n)) * (1 - dark), smooth(clamp(q - 2 * n)), m)
      const r = p[`rung${n}`]
      r.hide = vis < 0.01
      r.fade = vis
      r.glow = 0.14 * vis
      const sent = n % 2 === 0 ? "L" : "R" // the side the word left from
      const got = n % 2 === 0 ? "R" : "L"
      p[`port${sent}${n}`].on = vis > 0.02 ? 2 : 0
      p[`port${got}${n}`].on = vis > 0.85 ? 2 : 0
    }

    // A word crosses on every even turn: from the drum that just came down to
    // the other shaft's wall. The drum it reaches then takes its turn, lit.
    const qq = m > 0.5 ? q : tl < LEAVE ? loopQ : N
    const turn = Math.floor(qq)
    if (turn < 10 && turn % 2 === 0 && qq - turn > 0.06 && qq - turn < 0.97) {
      const n = turn / 2
      const from = n % 2 === 0 ? XY : XT
      const to = n === 4 ? X[3] + 0.1 : n % 2 === 0 ? X[3] - 0.18 : X[2] + 0.18
      p.word.hide = false
      p.word.at[0] = lerp(from, to, easeInOut(qq - turn))
      p.word.at[2] = RUNG(n)
      p.word.glow = 0.6
    }
    const taking = (i) => qq > i + 0.02 && qq < i + 0.98
    p.themDrum.on = p.themBand.on = taking(1) || taking(5) || taking(9) ? 2 : 0
    p.youDrum.on = p.youBand.on = taking(3) || taking(7) ? 2 : 0

    // The gallery: lit only once both drums stand on its floor.
    const met = clamp(1 - 4 * (4 - Math.min(you, them)))
    const loopLit = smooth(clamp(loopQ - (N - 1))) * (1 - dark)
    const ptrLit = smooth(clamp(q - (N - 1)))
    const lit = Math.min(met, lerp(loopLit, ptrLit, m))
    const on = lit > 0.02
    p.gwall.on = p.gfloor.on = p.gback.on = on ? 1 : 0
    p.gwall.fade = p.gback.fade = on ? 0.35 + 0.65 * lit : 1
    p.gfloor.fade = on ? 0.35 + 0.4 * lit : 1
    const b = input.still ? 0.5 : breathe(t, 2.8)
    p.gwall.glow = lit * 0.16
    p.glow.glow = lit * 0.8
    p.spill.glow = lit * (0.75 + 0.15 * b)

    const deepest = Math.max(you, them)
    const level = Math.max(1, Math.round(deepest))
    s.state =
      lit > 0.5 ? "both want it" : (m < 0.5 && tl > LEAVE) || deepest < 0.15 ? "small talk" : level > 3 ? "almost there" : `level ${level}`
  },
  readout: (s) => s.state || "rest",
})
