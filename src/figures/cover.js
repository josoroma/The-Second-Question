// Cover: the supported span. A beam stands for a statement; its two piers
// are its basis. Past the last pier the beam is only a dashed outline. The
// second question is a load that presses where it is aimed: over the span
// the piers take it and light up; past the last pier it falls through.

import { breathe, clamp, cycle, easeIn, easeInOut, easeOut, figure, keys } from "../lib/iso/core.js"

const BEAM_TOP = 3.8
const HOVER = 5.3
const SINK = BEAM_TOP - 1.0
const LIMIT = 6.5 // x where the last pier ends: past it, nothing holds
const T = 8 // seconds per lap

export default figure({
  slug: "cover",
  title: "The supported span",
  desc: "A beam rests on two piers. Past the last pier it continues only as a dashed outline. A glowing load, the second question, presses on that unsupported end and falls through it, while over the span between the piers the same load is held and the piers light up.",
  plate: "The second question",
  sentence:
    "The viewer sees the same load held over the span and falling through past the last pier, which explains what the second question does: it finds the part of a claim that rests on nothing.",
  view: { scale: 30, origin: [186, 178] },
  still: 0.665 * T,
  build(k) {
    k.grid("board", { at: [-3.2, -2.6, -0.32], size: [15, 8.4], step: 0.7 })
    k.block("base", { at: [-1.1, -1.0, -0.32], size: [10.6, 3.6, 0.32], r: 0.4, layer: -3 })
    // The limit, drawn on the base under the end of the last pier, and a
    // witness line from the dashed end down to the base: nothing is beneath it.
    k.guide("limit", { pts: [[LIMIT, -0.75, 0], [LIMIT, 2.35, 0]], layer: -2 })
    k.guide("witness", { pts: [[LIMIT + 2.0, 1.4, 3.0], [LIMIT + 2.0, 1.4, 0]], layer: 1, bias: 9 })
    const seam = (x0, x1, y, z) => [[x0, y, z], [x1 - 0.22, y, z], [x1, y - 0.22, z], [x1, 0, z]]
    k.detail("cap1", { pts: seam(0.5, 1.5, 1.4, 2.78), bias: 0.6 })
    k.detail("cap2", { pts: seam(5.5, 6.5, 1.4, 2.78), bias: 0.6 })
    k.detail("flange", { pts: [[-0.12, 1.4, 3.4], [LIMIT - 0.2, 1.4, 3.4]], bias: 3 })
    k.wire("link", {
      at: [0, 0, 0],
      pts: [
        [1.0, 1.4, 0],
        [1.0, 2.15, 0],
        [6.0, 2.15, 0],
        [6.0, 1.4, 0],
      ],
      layer: -2,
    })
    k.halo("glow1", { at: [1.0, 0.7, 0], r: 1.7, layer: -1, on: 2 })
    k.halo("glow2", { at: [6.0, 0.7, 0], r: 1.7, layer: -1, on: 2 })
    k.halo("spill", { at: [7.5, 0.7, 0], r: 1.9, layer: -1, on: 1 })
    k.block("pier1", { at: [0.5, 0, 0], size: [1.0, 1.4, 3.0], r: 0.22 })
    k.block("pier2", { at: [5.5, 0, 0], size: [1.0, 1.4, 3.0], r: 0.22 })
    k.led("led1", { at: [1.0, 1.4, 2.45], face: "+y", r: 0.15 })
    k.led("led2", { at: [6.0, 1.4, 2.45], face: "+y", r: 0.15 })
    k.block("beam", { at: [-0.3, 0, 3.0], size: [LIMIT + 0.3, 1.4, 0.8], r: 0.18 })
    for (let i = 0; i < 6; i++) k.led(`rivet${i}`, { at: [0.15 + i * 1.18, 1.4, 3.6], face: "+y", r: 0.06, bias: 3.2 })
    k.block("over", { at: [LIMIT, 0, 3.0], size: [2.0, 1.4, 0.8], r: 0.18, role: "ghost" })
    k.halo("press", { at: [3.5, 0.7, BEAM_TOP], r: 1.05, on: 1, bias: 0.4 })
    k.group("load", { at: [3.5, 0.7, HOVER] })
    k.block("weight", { at: [-0.55, -0.55, 0], size: [1.1, 1.1, 1.1], r: 0.2, role: "accent", parent: "load" })
  },
  tick(t, s, input) {
    const { p, groups } = s
    const lap = cycle(t, T)

    // The lap: press over the span (held), then past the last pier (falls through).
    let x = keys(lap, [
      [0, 3.5],
      [0.42, 3.5],
      [0.54, 7.5, easeInOut],
      [0.9, 7.5],
      [1, 3.5, easeInOut],
    ])
    let z = keys(lap, [
      [0, HOVER],
      [0.1, HOVER],
      [0.2, BEAM_TOP, easeIn],
      [0.32, BEAM_TOP],
      [0.42, HOVER, easeOut],
      [0.56, HOVER],
      [0.63, BEAM_TOP, easeIn],
      [0.69, SINK, easeIn],
      [0.78, SINK],
      [0.9, HOVER, easeOut],
      [1, HOVER],
    ])

    // The pointer aims the load: over the span it is held, past the pier it sinks.
    const aim = input.onPlane ? input.onPlane(BEAM_TOP) : null
    if (aim && aim[0] > -0.6 && aim[0] < 8.8 && aim[1] > -1.6 && aim[1] < 3.2) {
      const ax = clamp(aim[0], 0.2, 8.0)
      x = input.spring("x", ax)
      z = input.spring("z", ax > LIMIT ? SINK : BEAM_TOP)
    } else {
      input.spring("x", x)
      input.spring("z", z)
    }

    groups.load.off[0] = x - 3.5
    groups.load.off[2] = z - HOVER

    const touching = z <= BEAM_TOP + 0.05
    const held = touching && x <= LIMIT
    const through = touching && x > LIMIT

    // What is switched on glows: the piers' lamps when they hold the load,
    // the dashed end when the load meets nothing.
    const holdK = held ? 1 : 0
    p.led1.on = p.led2.on = held ? 2 : 0
    p.led1.glow = p.led2.glow = held ? 0.55 : 0
    p.link.on = held ? 2 : 0
    p.link.flow = held ? { period: 1.6 } : null
    p.glow1.glow = p.glow2.glow = holdK * 0.9
    p.over.on = through ? 1 : 0
    p.over.off[2] = through ? -clamp((BEAM_TOP - z) / (BEAM_TOP - SINK)) * 0.28 : 0
    p.spill.glow = through ? 0.9 : 0
    p.weight.glow = 0.28 + 0.2 * breathe(t, 2.4) + (touching ? 0.25 : 0)
    p.press.at[0] = x
    p.press.glow = held ? 0.8 : 0
    s.state = held ? "held" : through ? "no support" : "rest"
  },
  readout: (s) => s.state || "rest",
})
