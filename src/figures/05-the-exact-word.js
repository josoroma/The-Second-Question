// Chapter 5, The exact word: one word, three readings; one count, one reading.
//
// Three identical dials sit in a row on a fixed bridge: three readers. Each
// is turned by its own spindle, which passes up through the bridge; at its
// foot the spindle carries a gear, and above the gear a smooth roller. Two
// bars of the same length lie on either side of the row. Behind it, raised to
// ride over the gears, a smooth bar marked READY: a label, a judgment with the
// facts taken out. It can only press the rollers, so it turns them by
// friction, and each roller slips short by its own amount: one push leaves
// the three needles at three different readings. In front, a rack marked 38
// with thirty-eight teeth: the count. It meshes with every gear and turns each
// by the same number of teeth, so the three needles turn as one and stop
// pointing the same way. When the smooth bar withdraws, a dashed needle stays
// on each dial where it left the real one: three readings that rest on
// nothing, still there while the rack gives the one they can all check.
//
// Light: teal is the count and what it gives every reader (the rack while it
// drives, the needles while they agree): the checked basis. Magenta marks
// READY's three readings, the part that rests on nothing. At rest only those
// glow.
//
// The pointer pushes either bar: aim along READY and the needles fan apart
// as you push; aim along 38 and they turn together.

import { arc, clamp, cycle, easeIn, easeInOut, easeOut, figure, keys, ring, rrect } from "../lib/iso/core.js"

const N = 26 // teeth on each reader's gear
const RP = 0.62 // the gears' pitch radius
const ADD = 0.048 // a tooth's reach past the pitch line
const DED = 0.06 // and its root below it
const R_TIP = RP + ADD
const R_ROOT = RP - DED
const P = (2 * Math.PI * RP) / N // the pitch, on the gears and on the rack
const TEETH = 38 // the count
const RL = TEETH * P // both bars are this long
const BW = 0.5 // the rack's body, behind its teeth
const GS = 1.9 // spacing between the readers
const GX = [0, GS, 2 * GS]
const ZB = 0.36 // top of the rack and the gears
const GD = 0.3 // gear thickness
const RO = 0.25 // the smooth rollers' radius
const BAR_Z = ZB + 0.06 // the smooth bar's underside: it clears the gears
const BAR_TOP = ZB + 0.36 // its top, and the rollers'
const LW = 0.75 // the smooth bar's width
const WEB = 0.2 // the web it stands on, along its back
const ZD = 2.0 // underside of the dials: the bridge's top
const BRIDGE_H = 0.2
const BRIDGE_Y = [-0.32, 0.24] // its back and front: shallow in front, so READY's top shows under it
const BRIDGE_X = [-1.72, 2 * GS + 1.72] // its two legs, past both bars' travel
const DH = 0.1 // dial thickness
const DR = 0.72 // dial radius
const RS = 0.6 // the scale's radius on the dial
const D = (RP * Math.PI) / 2 // one push: a quarter turn at the gears' pitch circle
const BACK = 0.16 // how far a bar stands off while it is not driving
const XA = -0.46 // the rack's left end at rest (it is pushed toward -x)
const XB = -1.43 // the smooth bar's left end at rest (it is pushed toward +x)
const YR = RP // the rack's pitch line, engaged: tangent to the gears' pitch circles
const YL = -RO // the smooth bar's face, engaged: it touches the rollers
const ZERO = 225 // the needles' rest: twelve o'clock on the page
const TURN = 90 // the count turns every needle a quarter turn: three o'clock
// How far each roller turns under the smooth bar, in quarter turns. Without
// slip one push would turn a roller D / RO, about 223 degrees; each slips
// short of that by its own amount: 36, 130 and 207 degrees.
const SLIP = [0.4, 1.45, 2.3]
const T = 10 // seconds per lap
const DEG = 180 / Math.PI

const closed = (pts) => [...pts, pts[0]]
const flat = (pts, z = 0) => pts.map(([x, y]) => [x, y, z])
const toUV = (pts) => pts.map(([x, y]) => [x, -y]) // world (x, y) offsets to a flat shape's (u, v)
const depth = (q) => q[0] + q[1] + q[2]

// Paint order, back to front: the plate's parts, the gears and the rack (layer
// 0); the raised smooth bar, which hangs over the gears' back halves (0.5); the
// rollers, spindles and the bridge's legs (1); the bridge (1.5); the dials and
// what lies on them (2).
const L_BAR = 0.5
const L_SPINDLE = 1
const L_BRIDGE = 1.5
const L_DIAL = 2

/** A reader's gear, about its centre: N teeth, the first pointing along +x. */
function gearShape() {
  const A = 360 / N
  const pts = []
  for (let k = 0; k < N; k++)
    for (const [f, r] of [
      [-0.27, R_ROOT],
      [-0.13, R_TIP],
      [0.13, R_TIP],
      [0.27, R_ROOT],
    ]) {
      const a = ((k + f) * A) / DEG
      pts.push([r * Math.cos(a), r * Math.sin(a)])
    }
  return toUV(pts)
}

/** The rack, from its left end on the pitch line: 38 teeth toward -y, the body behind them. */
function rackShape() {
  const pts = [[0, DED]]
  for (let k = 0; k < TEETH; k++) {
    const c = (k + 0.5) * P
    pts.push([c - 0.27 * P, DED], [c - 0.13 * P, -ADD], [c + 0.13 * P, -ADD], [c + 0.27 * P, DED])
  }
  pts.push([RL, DED])
  const yb = DED + BW
  const rc = 0.12
  pts.push(...arc(RL - rc, yb - rc, rc, 0, 90, 5), ...arc(rc, yb - rc, rc, 90, 180, 5))
  return toUV(pts)
}

// Each gear starts with a tooth in the rack's gap at its contact point, so
// the mesh is true wherever the rack goes: a gap at x + d needs a tooth at
// 90 degrees minus d / RP.
const ROT0 = GX.map((x) => {
  const k = Math.round((x - XA) / P)
  return 90 - ((x - (XA + k * P)) / RP) * DEG
})

/** A dial's scale: an arc from twelve o'clock round to nine, with a tick every eighth of a turn. */
function scale(cx) {
  const z = ZD + DH + 0.002
  const at = (a, r) => [cx + r * Math.cos(a / DEG), r * Math.sin(a / DEG), z]
  const pts = []
  for (let k = 0; k <= 6; k++) {
    const a = ZERO + k * 45
    if (k > 0) for (let j = 1; j < 6; j++) pts.push(at(a - 45 + j * 7.5, RS))
    pts.push(at(a, RS), at(a, RS - (k === 0 ? 0.14 : 0.08)), at(a, RS))
  }
  return pts
}

// The needle points along +u from its pivot, with no tail: two hands on one
// pivot then read as two readings, not as a pair of scissors.
const NEEDLE = [...arc(0, 0, 0.075, 90, 270, 8), [0.5, -0.024], [0.56, 0], [0.5, 0.024]]
const NT = 0.055 // the needle's thickness

/** The lap without a pointer: the smooth bar's push, then the rack's. */
function lapAt(lap) {
  return {
    eL: keys(lap, [
      [0, 0],
      [0.05, 0],
      [0.09, 1, easeOut],
      [0.5, 1],
      [0.53, 0, easeIn],
      [1, 0],
    ]),
    sL: keys(lap, [
      [0, 0],
      [0.09, 0],
      [0.27, 1, easeInOut],
      [0.4, 1],
      [0.5, 0, easeInOut],
      [1, 0],
    ]),
    eC: keys(lap, [
      [0, 0],
      [0.52, 0],
      [0.555, 1, easeOut],
      [0.975, 1],
      [1, 0, easeIn],
    ]),
    sC: keys(lap, [
      [0, 0],
      [0.555, 0],
      [0.71, 1, easeInOut],
      [0.9, 1],
      [0.975, 0, easeInOut],
      [1, 0],
    ]),
  }
}

export default figure({
  slug: "05-the-exact-word",
  title: "One word, three readings; one count, one reading",
  desc: "Three identical dials sit in a row on a bridge, each turned by its own spindle. In front, a toothed rack marked 38 meshes with every spindle's gear and has turned each by the same number of teeth: the three needles agree, lit teal. Behind, a smooth bar marked READY only presses smooth rollers, which slip; dashed magenta needles show the three different readings it left.",
  plate: "The exact word",
  sentence:
    "The viewer sees three identical dials turned by a smooth bar marked READY stop at three different readings, and turned by a toothed rack marked 38 stop at one, which explains the observable version: a label leaves each listener to fill in the reading, while a count gives every listener the same thing to check.",
  view: { scale: 40, origin: [217, 183] },
  still: 0.8 * T,
  build(k) {
    k.grid("board", { at: [-4.0, -4.4, -0.32], size: [11.6, 8.8], step: 0.7 })
    k.block("base", { at: [-2.0, -1.95, -0.32], size: [7.8, 3.9, 0.32], r: 0.4, layer: -3 })
    k.detail("lip", { pts: flat(closed(rrect(-1.78, -1.73, 5.58, 1.73, 0.26))), layer: -2 })
    ;[
      [-1.56, -1.52],
      [5.36, -1.52],
      [-1.56, 1.52],
      [5.36, 1.52],
    ].forEach(([x, y], j) => k.led(`screw${j}`, { at: [x, y, 0], face: "+z", r: 0.07, layer: -2 }))

    // The guides: a low rail outside each lane.
    k.block("railB", { at: [-1.3, -1.6, 0], size: [6.4, 0.12, 0.16], r: 0.05, bias: -3.5 - (1.9 - 1.54 + 0.08) })
    k.block("railF", { at: [-1.3, 1.42, 0], size: [6.4, 0.12, 0.16], r: 0.05, bias: 7.0 - (1.9 + 1.48 + 0.08) })

    // Behind the row: the smooth bar, READY, raised on a web along its back so
    // it rides over the gears and presses only the rollers.
    k.group("ready", { at: [0, 0, 0] })
    const webAt = [XB + 0.12, YL - LW, 0]
    k.block("web", { at: webAt, size: [RL - 0.24, WEB, BAR_Z + 0.02], r: 0.06, parent: "ready", bias: -2.6 - (XB + RL / 2 + YL - LW + BAR_Z / 2) })
    k.block("smooth", { at: [XB, YL - LW, BAR_Z], size: [RL, LW, BAR_TOP - BAR_Z], r: 0.12, parent: "ready", layer: L_BAR })
    // Its nameplate near its right end, past the last spindle and under the
    // bridge's end, where the bar's top shows.
    const wordAt = [XB + RL - 0.5, YL - 0.32, BAR_TOP + 0.002]
    k.face("wordplate", { at: wordAt, pts: flat(rrect(-0.42, -0.15, 0.42, 0.15, 0.06)), role: "recess", parent: "ready", layer: L_BAR, bias: 0.05 })
    k.label("word", { at: [wordAt[0], wordAt[1], BAR_TOP + 0.004], text: "READY", face: "+z", size: 0.21, parent: "ready", layer: L_BAR, bias: 0.1 })

    // The bridge the dials sit on: fixed, on two legs; the spindles pass through it.
    BRIDGE_X.forEach((x, j) => {
      k.cyl(`legFoot${j}`, { at: [x, 0, 0], radius: 0.22, h: 0.06, layer: L_SPINDLE })
      k.cyl(`leg${j}`, { at: [x, 0, 0.06], radius: 0.12, h: ZD - BRIDGE_H - 0.06, layer: L_SPINDLE })
    })
    k.block("bridge", { at: [BRIDGE_X[0] - 0.22, BRIDGE_Y[0], ZD - BRIDGE_H], size: [BRIDGE_X[1] - BRIDGE_X[0] + 0.44, BRIDGE_Y[1] - BRIDGE_Y[0], BRIDGE_H], r: 0.24, layer: L_BRIDGE })

    // The three readers: a gear at the foot, a smooth roller, a spindle, a dial with its scale and needle.
    GX.forEach((x, i) => {
      k.cyl(`boss${i}`, { at: [x, 0, 0], radius: 0.24, h: ZB - GD })
      k.extrude(`gear${i}`, { at: [x, 0, ZB], face: "+z", shape: gearShape(), depth: GD, rz: ROT0[i] })
      // A hub ring on the gear's top, round the roller's foot: it sorts after the gear.
      const hub = flat(closed(ring(x, 0, 0.34, 32)), ZB + 0.002)
      k.detail(`hub${i}`, { pts: hub, bias: x + 0.34 - depth(hub[Math.floor(hub.length / 2)]) })
      k.cyl(`roller${i}`, { at: [x, 0, ZB], radius: RO, h: BAR_TOP - ZB, layer: L_SPINDLE })
      k.cyl(`post${i}`, { at: [x, 0, BAR_TOP], radius: 0.085, h: ZD - BRIDGE_H - BAR_TOP, layer: L_SPINDLE })
      k.cyl(`dial${i}`, { at: [x, 0, ZD], radius: DR, h: DH, layer: L_DIAL })
      // The face inside the scale, a shade darker than the dial, so a plain needle still reads.
      const faceAt = [x, 0, ZD + DH + 0.001]
      k.face(`face${i}`, { at: faceAt, pts: flat(ring(0, 0, RS + 0.04, 48)), role: "recess", layer: L_DIAL, bias: 0.02 })
      k.halo(`agree${i}`, { at: [x, 0, ZD + DH + 0.003], r: 0.6, on: 2, layer: L_DIAL, bias: 0.03 })
      k.detail(`scale${i}`, { pts: scale(x), layer: L_DIAL })
      // A witness: a flat dashed needle where the smooth bar left the real one,
      // a reading that rests on nothing, over a faint lit face of the same
      // shape (so it still reads small, and lights in 3D). They sort over the
      // scale, under the needle.
      const wrz = ZERO + TURN * SLIP[i]
      const wc = Math.cos(wrz / DEG)
      const ws = Math.sin(wrz / DEG)
      k.face(`wface${i}`, {
        at: [x, 0, ZD + DH + 0.004],
        pts: NEEDLE.map(([u, v]) => [u * wc + v * ws, u * ws - v * wc, 0]),
        on: 1,
        layer: L_DIAL,
        bias: 0.7,
      })
      k.extrude(`witness${i}`, {
        at: [x, 0, ZD + DH + 0.006],
        face: "+z",
        shape: NEEDLE,
        depth: 0.004,
        rz: wrz,
        role: "ghost",
        on: 1,
        layer: L_DIAL,
        bias: 0.8,
      })
      // The needle sorts after its witness at any angle; the cap after the needle.
      k.extrude(`needle${i}`, { at: [x, 0, ZD + DH + NT], face: "+z", shape: NEEDLE, depth: NT, rz: ZERO, layer: L_DIAL, bias: 1.2 })
      k.cyl(`cap${i}`, { at: [x, 0, ZD + DH], radius: 0.085, h: NT + 0.03, layer: L_DIAL, bias: 1.5 })
    })

    // In front of the row: the rack, 38. It sorts after every reader's foot.
    k.group("count", { at: [0, 0, 0] })
    const shape = rackShape()
    const mx = shape.reduce((a, q) => a + q[0], 0) / shape.length
    const my = -shape.reduce((a, q) => a + q[1], 0) / shape.length
    const rackDepth = XA + mx + YR + my + ZB / 2
    const RACK = 6.2 // the rack's depth at rest, after the readers' feet
    // Its light lands on the plate in front of it, and stays on the plate.
    k.halo("spillA", { at: [XA + RL * 0.28, YR + 0.33, 0], r: 1.0, on: 2, parent: "count" })
    k.halo("spillB", { at: [XA + RL * 0.72, YR + 0.33, 0], r: 1.0, on: 2, parent: "count" })
    k.extrude("rack", { at: [XA, YR, ZB], face: "+z", shape, depth: ZB, parent: "count", bias: RACK - rackDepth })
    const numAt = [XA + RL - 0.62, YR + DED + BW / 2, ZB + 0.002]
    k.face("numplate", { at: numAt, pts: flat(rrect(-0.3, -0.16, 0.3, 0.16, 0.06)), role: "recess", parent: "count", bias: RACK + 0.05 - depth(numAt) })
    k.label("num", { at: [numAt[0], numAt[1], ZB + 0.004], text: "38", face: "+z", size: 0.26, parent: "count", bias: RACK + 0.1 - depth(numAt) })
  },
  tick(t, s, input) {
    const { p, groups } = s
    const lap = cycle(t, T)
    const L = lapAt(lap)

    // The pointer pushes a bar: aimed along a lane, on the fixed plane of that
    // bar's top (so the choice never follows what moves). Along the rack,
    // further toward -x is a longer push; along the smooth bar, further toward
    // +x. Over a dial, a spindle, a roller or the bridge's legs nothing is
    // pushed: they stand above the lanes on the page.
    const a0 = input.onPlane ? input.onPlane(0) : null
    const a1 = input.onPlane ? input.onPlane(1) : null
    // Does the pointer's ray pass within r of an upright axis (at one of xs) between heights z0 and z1?
    const byAxis = (z0, z1, r, xs = GX) => {
      if (!a0 || !a1) return false
      const dx = a1[0] - a0[0]
      const dy = a1[1] - a0[1]
      const dd = dx * dx + dy * dy || 1e-9
      return xs.some((x) => {
        const t = clamp(-((a0[0] - x) * dx + a0[1] * dy) / dd, z0, z1)
        return Math.hypot(a0[0] + dx * t - x, a0[1] + dy * t) < r
      })
    }
    const onReader =
      byAxis(ZD, ZD + DH, DR + 0.1) || byAxis(BAR_TOP, ZD, 0.14) || byAxis(ZB, BAR_TOP, RO + 0.04) || byAxis(0, ZD, 0.2, BRIDGE_X)
    const aimL = input.onPlane && !onReader ? input.onPlane(BAR_TOP) : null
    const aimC = input.onPlane && !onReader ? input.onPlane(ZB) : null
    let want = null
    let frac = 0
    const span = GX[2] + 0.8
    if (aimC && aimC[0] > -1.7 && aimC[0] < 5.5 && aimC[1] > 0.45 && aimC[1] < 2.0) {
      want = "C"
      frac = clamp((GX[2] + 0.4 - aimC[0]) / span)
    } else if (aimL && aimL[0] > -1.7 && aimL[0] < 5.5 && aimL[1] < 0.0 && aimL[1] > -1.8) {
      want = "L"
      frac = clamp((aimL[0] + 0.4) / span)
    }
    // Soft springs while the reader pushes; stiff ones track the lap otherwise,
    // so a reader who arrives never sees a lagging replay.
    const w = clamp(input.spring("w", want ? 1 : 0, want ? {} : { k: 30, c: 11 }))
    if (!input.still) s.w = w
    const soft = want !== null || (s.w ?? 0) > 0.02
    const sp = soft ? { k: 70, c: 16 } : { k: 4000, c: 126 }
    const sL = clamp(input.spring("sL", want === "L" ? frac : want === "C" ? 0 : L.sL, sp))
    const sC = clamp(input.spring("sC", want === "C" ? frac : want === "L" ? 0 : L.sC, sp))
    const eL = clamp(input.spring("eL", want === "L" ? 1 : want === "C" ? 0 : L.eL, sp))
    const eC = clamp(input.spring("eC", want === "C" ? 1 : want === "L" ? 0 : L.eC, sp))

    // The bars: each moves in against the readers to drive, then slides.
    groups.ready.off[0] = D * sL
    groups.ready.off[1] = -BACK * (1 - eL)
    groups.count.off[0] = -D * sC
    groups.count.off[1] = BACK * (1 - eC)

    // The readers: the rack turns every gear by the same teeth; the smooth bar
    // turns each roller short of its travel, by its own slip.
    const agree = eC > 0.5 && sC > 0.04 && sL < 0.02
    const lit = agree ? clamp((sC - 0.04) / 0.25) : 0
    // The witnesses stay where the smooth bar left the needles, through the
    // rack's push, until the lap ends (not while the reader pushes).
    const wit =
      keys(lap, [
        [0, 0],
        [0.4, 0],
        [0.47, 1],
        [0.92, 1],
        [0.99, 0],
      ]) *
      (1 - w)
    for (let i = 0; i < 3; i++) {
      p[`witness${i}`].fade = wit
      p[`witness${i}`].hide = wit < 0.02
      p[`witness${i}`].glow = 0.38 * wit
      p[`wface${i}`].fade = 0.6 * wit
      p[`wface${i}`].hide = wit < 0.02
      const turn = TURN * (sC + SLIP[i] * sL)
      p[`gear${i}`].rz = ROT0[i] + turn
      p[`needle${i}`].rz = ZERO + turn
      p[`needle${i}`].on = agree ? 2 : 0
      p[`needle${i}`].glow = 0.45 * lit
      p[`agree${i}`].glow = 0.7 * lit
    }

    // The rack lights while it drives: the count, the basis every reader can check.
    const driving = eC > 0.5
    // Its own bloom stays faint (in 3D it is one sprite the size of the bar);
    // its light lands on the plate in front of it.
    p.rack.on = driving ? 2 : 0
    p.rack.glow = driving ? 0.08 : 0
    p.spillA.glow = p.spillB.glow = driving ? 0.4 + 0.35 * clamp(sC / 0.4) : 0

    // The read-out names the word and, once the needles show it, what it gave.
    s.state =
      eL > 0.5 && sL > 0.04
        ? sL > 0.35
          ? "ready: 3 readings"
          : "ready"
        : driving && sC > 0.04
          ? sC > 0.35
            ? "38: 1 reading"
            : "38"
          : "rest"
  },
  readout: (s) => s.state || "rest",
})
