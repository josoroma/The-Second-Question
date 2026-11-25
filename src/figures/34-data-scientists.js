// Chapter 34, Data scientists: the opening it would go back through.
//
// A tower of discs, the number, stands on a slide, and in the slide, two
// steps along, an opening is cut to the tower's own size. It was there first:
// the tower came up through it, and only then was the slide drawn back, two
// steps, so that the number stands on solid metal. At the end of the channel
// two blocks are drawn as outlines, the misses that have not happened. Each
// one that does runs down the channel, strikes the slide and moves it one
// step, and stays there. After the first the tower still stands, with the
// opening beside it. After the second there is nothing under it, and it goes
// down into the base, flush with the slide.
//
// Light: magenta is the opening, what would make you take it back. Teal is
// the number, for as long as it stands. At rest only those glow.
//
// The pointer takes the opening along the channel: with none or one miss the
// tower stands; bring the opening under it and it goes.

import { arc, breathe, clamp, cycle, easeIn, easeInOut, easeOut, figure, keys, ring } from "../lib/iso/core.js"

const T = 9.6 // seconds per lap

// The channel runs along x; the tower stands at the origin.
const ZB = 1.5 // the bed's top
const TS = 0.34 // the slide's thickness
const ZS = ZB + TS // and its top
const W = 1.02 // half its width
const STEP = 1.5 // one miss moves it this far
const XL = -1.08 // its left end, from the opening's centre
const XR = 2 * STEP + 0.82 // its right end
const HOLE = 0.61
const LIP = 0.9 // the outside of the opening's collar
const R = 0.55 // the discs
const N = 9
const DH = 0.2
const TALL = N * DH
const P = 0.62 // a miss's length
const WAIT = [-5.55, -6.45] // where the two misses wait (left ends)
const off = (n) => -(2 - n) * STEP // the slide's place after n misses

/** Left end of miss i (0, 1) when it presses on the slide after n steps. */
const pressed = (i, n) => XL + off(n) - P * (i + 1)

// The lap, in seconds.
const BACK = 0.5 // the misses go back to their places
const RISE = 1.2
const SET = 2.4
const MISS1 = 4.1
const HIT1 = 4.6
const MISS2 = 6.7
const HIT2 = 7.25
const DROP = 7.75

/** The loop as a function of time in the lap. */
function loopAt(lt) {
  const n = keys(lt, [
    [0, 2],
    [SET, 2],
    [SET + 1.1, 0, easeInOut],
    [HIT1, 0],
    [HIT1 + 0.36, 1, easeOut],
    [HIT2, 1],
    [HIT2 + 0.36, 2, easeOut],
    [T, 2],
  ])
  const h = keys(lt, [
    [0, 0],
    [RISE, 0],
    [RISE + 1.1, 1, easeInOut],
    [DROP, 1],
    [DROP + 0.5, 0, easeIn],
    [T, 0],
  ])
  const x = [0, 1].map((i) => {
    const go = i ? MISS2 : MISS1
    const hit = i ? HIT2 : HIT1
    if (lt < BACK) return pressed(i, 2)
    if (lt < BACK + 0.8) return keys(lt, [[BACK, pressed(i, 2)], [BACK + 0.8, WAIT[i], easeInOut]])
    if (lt < go) return WAIT[i]
    if (lt < hit) return keys(lt, [[go, WAIT[i]], [hit, pressed(i, i), easeIn]])
    return pressed(i, n)
  })
  const real = [0, 1].map((i) => {
    const go = i ? MISS2 : MISS1
    return keys(lt, [
      [0, 1],
      [BACK + 0.75, 1],
      [BACK + 1.05, 0],
      [go - 0.3, 0],
      [go, 1],
      [T, 1],
    ])
  })
  return { n, h, x, real }
}

/** A half ring of the opening's collar, as a flat outline. */
const collar = (a0, a1) => [...arc(0, 0, LIP, a0, a1, 28), ...arc(0, 0, HOLE, a1, a0, 28)].map(([x, y]) => [x, -y])

/** The slide's plan, with the opening cut in it (a slit joins it to the back edge, under the collar). */
function slidePlan() {
  const r = 0.2
  const c = (cx, cy, a) => arc(cx, cy, r, a, a + 90, 5)
  const g = 0.004
  return [
    ...c(XR - r, W - r, 0),
    ...c(XL + r, W - r, 90),
    ...c(XL + r, -W + r, 180),
    [-g, -W],
    ...arc(0, 0, HOLE, 269.6, -89.6, 56),
    [g, -W],
    ...c(XR - r, -W + r, 270),
  ].map(([x, y]) => [x, -y])
}

export default figure({
  slug: "34-data-scientists",
  title: "The opening cut before the tower goes up",
  desc: "A teal tower of discs stands on a slide. Beside it, one step away, the slide has a magenta-rimmed opening the tower's own size. One block has struck the slide and moved it a step; a second waits as a dashed outline.",
  plate: "Data scientists",
  sentence:
    "The viewer sees a tower stand on a slide with an opening its own size, each miss move the opening one step nearer, and the second take it down, which explains how to stand behind a number: what would make you take it back is cut before it goes up.",
  view: { scale: 37.5, origin: [346, 290] },
  still: 5.6,
  build(k) {
    k.grid("board", { at: [-7.7, -3.5, -0.26], size: [11.2, 7.7], step: 0.7 })
    k.block("base", { at: [-7.0, -2.0, -0.26], size: [9.2, 3.7, 0.26], r: 0.45, layer: -3 })
    ;[
      [-6.6, -1.6],
      [-6.6, 1.3],
      [1.8, -1.6],
      [1.8, 1.3],
    ].forEach(([x, y], i) => k.led(`screw${i}`, { at: [x, y, 0.002], face: "+z", r: 0.07, layer: -2 }))
    k.halo("floor", { at: [0.6, 0.6, 0.004], r: 2.1, on: 2, layer: -1 })

    // The scale the tower is read against.
    k.block("post", { at: [-0.14, -1.78, 0], size: [0.28, 0.28, ZS + TALL + 0.32], r: 0.07, layer: -0.6 })
    const ticks = []
    for (let i = 0; i <= N; i++) {
      const z = ZS + i * DH
      ticks.push([0.143, -1.72, z], [0.143, i % 4 ? -1.64 : -1.56, z], [0.143, -1.72, z])
    }
    k.detail("ticks", { pts: ticks, layer: -0.55 })

    // The bed: a box deep enough for the tower, a channel, a leg.
    k.block("leg", { at: [-6.3, -0.8, 0], size: [0.8, 1.6, ZB - 0.36], r: 0.16, layer: -0.4 })
    k.block("box", { at: [-1.15, -1.1, 0], size: [2.3, 2.2, ZB - 0.36], r: 0.24, layer: -0.3 })
    k.block("bed", { at: [-6.7, -1.3, ZB - 0.36], size: [8.1, 2.6, 0.36], r: 0.3, layer: -0.2 })
    k.block("lipB", { at: [-6.4, -1.26, ZB], size: [7.5, 0.16, 0.18], r: 0.06, layer: -0.1 })

    // What is under the opening.
    k.face("well", { at: [0, 0, ZB + 0.004], pts: ring(0, 0, HOLE, 40).map(([x, y]) => [x, y, 0]), role: "recess", layer: 0.9 })

    // The misses: outlines where they wait, blocks once they happen.
    for (const i of [1, 0]) {
      k.block(`wait${i}`, { at: [WAIT[i], -0.65, ZB], size: [P, 1.3, 0.72], r: 0.16, role: "ghost", layer: 0.92 + (1 - i) * 0.02 })
      k.block(`miss${i}`, { at: [0, -0.65, ZB], size: [P, 1.3, 0.72], r: 0.16, layer: 0.93 + (1 - i) * 0.02 })
    }

    // The slide, with the opening and its collar in two halves.
    k.group("slide", { at: [0, 0, ZS] })
    k.extrude("plate", { at: [0, 0, 0], shape: slidePlan(), face: "+z", depth: TS, sharp: 40, parent: "slide", layer: 1 })
    k.extrude("rimB", { at: [0, 0, 0.05], shape: collar(135, 315), face: "+z", depth: 0.05, parent: "slide", role: "accent", layer: 1.1, sharp: 60 })
    k.extrude("rimF", { at: [0, 0, 0.05], shape: collar(-45, 135), face: "+z", depth: 0.05, parent: "slide", role: "accent", layer: 1.3, sharp: 60 })

    k.block("lipF", { at: [-6.4, 1.1, ZB], size: [7.5, 0.16, 0.18], r: 0.06, layer: 1.6 })
    // The opening's three places: two misses away, one, none.
    for (const n of [0, 1, 2])
      k.detail(`mark${n}`, {
        pts: [
          [off(n), 1.265, ZB + 0.04],
          [off(n), 1.265, ZB + 0.09],
          [off(n), 1.265, ZB + 0.14],
        ],
        layer: 1.7,
      })

    // The bracket that keeps the tower where it is while the slide moves.
    const fork = [...arc(0, 0, 0.78, 172, 312, 24), ...arc(0, 0, 0.6, 312, 172, 24)]
    k.block("arm", { at: [-0.1, -1.55, ZS + 1.18], size: [0.2, 0.86, 0.16], r: 0.04, layer: 1.8 })
    k.extrude("fork", { at: [0, 0, ZS + 1.34], shape: fork.map(([x, y]) => [x, -y]), face: "+z", depth: 0.16, sharp: 60, layer: 1.9 })

    // The tower.
    for (let i = 0; i < N; i++) k.cyl(`disc${i}`, { at: [0, 0, ZS + i * DH], radius: R, h: DH, n: 44, layer: 2 })
  },
  tick(t, s, input) {
    const { p, groups } = s
    // The pointer says how many misses there have been: the opening's nearest place.
    const at = input.onPlane ? input.onPlane(ZS) : null
    const here = !!at && Math.abs(at[1]) < 1.7 && at[0] > -7 && at[0] < 4.2
    if (here) s.want = clamp(Math.round(at[0] / STEP) + 2, 0, 2)
    if (here && !input.still) s.held = true
    else if (s.held && s.q) {
      // Let go: it finishes what it was doing, and the lap goes on from there.
      const { n, h, x } = s.q
      const done = Math.abs(n - s.want) < 0.01 && Math.abs(h - (s.want === 2 ? 0 : 1)) < 0.02 && x.every((v, i) => Math.abs(v - (s.want > i ? pressed(i, n) : WAIT[i])) < 0.04)
      if (done || input.still) {
        s.held = false
        s.shift = t - [MISS1 - 0.5, HIT1 + 0.9, DROP + 0.6][s.want]
      }
    }
    const on = here || !!s.held
    const want = on ? s.want : 0
    const lt = cycle(input.still ? t : t - (s.shift || 0), T) * T
    const L = loopAt(lt)

    let { n, h, x, real } = L
    if (on && input.still) {
      n = want
      h = want === 2 ? 0 : 1
      x = [0, 1].map((i) => (want > i ? pressed(i, want) : WAIT[i]))
      real = [0, 1].map((i) => (want > i ? 1 : 0))
    }
    if (!input.still) {
      const fast = { k: 4000, c: 126 }
      const q = s.q || L
      const g = on
      // A miss runs to the slide; the slide moves once it is struck; the tower
      // must be up before the slide can be drawn back, and down only when
      // there is nothing under it.
      const hit = g ? [0, 1].map((i) => want > i && ((q.hit && q.hit[i]) || q.x[i] > pressed(i, q.n) - 0.04)) : null
      const locked = q.n > 1.97 && q.h < 0.985
      const nTo = !g ? L.n : locked ? 2 : want > q.n ? Math.min(want, hit[0] ? (hit[1] ? 2 : 1) : 0) : want
      n = clamp(input.spring("n", nTo, g ? { k: 90, c: 19 } : fast), 0, 2)
      h = clamp(input.spring("h", g ? (want === 2 && n > 1.975 ? 0 : 1) : L.h, g ? { k: 60, c: 15.5 } : fast))
      x = [0, 1].map((i) => {
        const to = !g ? L.x[i] : want > i ? pressed(i, n) : WAIT[i]
        const v = input.spring(`x${i}`, to, g && !hit[i] ? { k: 110, c: 21 } : fast)
        return Math.min(v, pressed(i, n))
      })
      real = [0, 1].map((i) => clamp(input.spring(`r${i}`, g ? (want > i || x[i] > WAIT[i] + 0.25 ? 1 : 0) : L.real[i], g ? { k: 260, c: 32 } : fast)))
      s.q = { n, h, x, hit }
    }

    groups.slide.off[0] = off(n)
    p.well.off[0] = off(n)
    for (let i = 0; i < N; i++) {
      const d = p[`disc${i}`]
      const dz = -(1 - h) * TALL
      const z = ZS + i * DH + dz
      d.off[2] = dz
      // A disc below the slide's top is painted inside the opening; once it is
      // all the way under, the one above it covers it.
      if (z < ZS - 1e-4) d.layer = 1.2
      d.hide = z + DH < ZS - 1e-4
      d.on = h > 0.04 ? 2 : 0
      d.glow = h > 0.04 ? 0.12 * h : 0
    }
    p.floor.glow = 0.5 * h
    const b = input.still ? 0.5 : breathe(t, 2.8)
    p.rimB.glow = 0.16 + 0.08 * b
    p.rimF.glow = 0.08 + 0.04 * b
    for (const i of [0, 1]) {
      const m = p[`miss${i}`]
      m.at[0] = x[i]
      m.fade = clamp(real[i])
      m.hide = real[i] < 0.02
      p[`wait${i}`].fade = clamp(1 - real[i])
      p[`wait${i}`].hide = real[i] > 0.98
    }

    const left = 2 - Math.round(n)
    s.state = h < 0.5 ? (n > 1.5 ? "taken back" : "rest") : left === 2 ? "stands, 2" : left === 1 ? "stands, 1" : "none left"
  },
  readout: (s) => s.state || "rest",
})
