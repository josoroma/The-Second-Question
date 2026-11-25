// Chapter 37, Leading when nobody knows the answer: lay it, test it, roll.
//
// A crane on wheels stands on planks, at the edge of an empty board. It lays
// its own track: the arm swings round and takes the plank it has just left,
// swings on and lays it down in front. Then, before anything rolls, it drops
// its weight on that plank, the test. The plank gives a little and holds, and
// lights. Only then does the carriage roll onto it, and a stud stays in the
// board beside it. The view goes with the carriage: the board slides past and
// the studs fall behind, and the far end, a dashed outline, is exactly as far
// away as it was. It is never reached; there is always one more plank.
//
// Light: magenta is the test, the weight. Teal is what has held: the plank
// it has just tried, and a stud for every place before. At rest only those
// glow.
//
// The pointer says what is wanted. Over the far end it wants to get there,
// and the carriage goes plank by plank, faster, and gets no closer; over the
// place in front it wants the next test, and the weight comes down and stays;
// over the carriage it wants to stand still, on what has held.

import { breathe, clamp, cycle, easeIn, easeInOut, easeOut, figure, keys, rrect } from "../lib/iso/core.js"

const T = 9.8 // seconds per lap

const P = 1.9 // from one plank to the next
const PL = 1.74 // a plank's length
const PW = 2.7 // and width
const PH = 0.22
const CX = P / 2 // the carriage stands on planks 0 and 1
const ARM = 2 * P - CX // from the mast to the place in front
const WH = 0.5 // the weight
const WR = 0.52
const CARRY = 0.86 // how high a plank is carried
const ROD = 1.62
const STUDS = 5

// The lap, in seconds.
const OUT = [0.25, 1.85] // the arm swings back, empty
const PICK = 2.2 // down on the plank behind
const IN = [2.65, 4.25] // it swings to the front
const LAID = 4.7
const UP = 5.1
const DROP = 5.36 // the weight lands
const HELD = 5.55
const FREE = 7.1 // it is lifted off
const ROLL = [7.7, 9.1]

const JIB = 2.0 // the arm's underside

/** The lap as a function of its time: the arm's turn, the weight's height, the plank on it, the roll. */
function lapAt(lt) {
  const turn = keys(lt, [
    [0, 0],
    [OUT[0], 0],
    [OUT[1], -180],
    [IN[0], -180],
    [IN[1], -360],
    [T, -360],
  ])
  const top = PH + CARRY // the weight's underside when it is up
  const z = keys(lt, [
    [0, top],
    [OUT[1], top],
    [PICK, PH, easeInOut],
    [PICK + 0.08, PH],
    [IN[0], top, easeInOut],
    [IN[1], top],
    [LAID, PH, easeInOut],
    [LAID + 0.08, PH],
    [UP, top, easeInOut],
    [DROP, PH, easeIn],
    [FREE, PH],
    [FREE + 0.5, top, easeInOut],
    [T, top],
  ])
  const carried = lt > PICK + 0.04 && lt < LAID
  // What the plank does under the weight: it gives a little, and holds.
  const u = lt - DROP
  const dip = u > 0 && u < 0.6 ? -0.085 * Math.exp(-u * 7) * Math.cos(u * 20) : 0
  const lit = keys(lt, [
    [0, 0],
    [DROP + 0.1, 0],
    [HELD + 0.15, 1, easeOut],
    [T, 1],
  ])
  const roll = keys(lt, [
    [0, 0],
    [ROLL[0], 0],
    [ROLL[1], 1, easeInOut],
    [T, 1],
  ])
  return { turn, z, carried, dip, lit, roll }
}

export default figure({
  slug: "37-leading-when-nobody-knows-the-answer",
  title: "One plank ahead, tested, then roll",
  desc: "A crane on wheels stands on two planks on an empty board. It has laid a third in front and dropped a magenta weight on it; the plank holds and is lit teal, like the studs left behind. Further on, the far end is only a dashed outline.",
  plate: "Leading when nobody knows the answer",
  sentence:
    "The viewer sees a carriage lay one plank ahead, drop a weight on it and roll only when it holds, while the outline at the far end stays as far away, which explains how to lead without the answer: promise the next test, and go as far as it carries.",
  view: { scale: 34, origin: [219, 194] },
  still: 6.4,
  build(k) {
    k.grid("board", { at: [-3.8, -4.75, 0], size: [13.3, 9.5], step: P / 2 })
    // The next places, as they are promised.
    const spot = rrect(-PL / 2, -PW / 2, PL / 2, PW / 2, 0.14)
    const place = [...spot, spot[0]].map(([a, b]) => [a, b, 0.003])
    k.guide("next0", { pts: place, layer: -2 })
    k.guide("next1", { pts: place, layer: -2 })
    // The far end.
    k.block("far", { at: [7.45, -PW / 2, 0], size: [1.5, PW, 0.62], r: 0.16, role: "ghost", layer: 0 })

    k.halo("spill", { at: [2 * P, 0.2, 0.004], r: 2.3, on: 2, layer: -1 })

    // Studs: where a plank has held. One is left at every place.
    for (let i = 0; i < STUDS; i++) k.cyl(`stud${i}`, { at: [0, PW / 2 + 0.4, 0], radius: 0.13, h: 0.12, n: 28, role: "accent2", layer: -0.8 })

    // Three planks. The first is the one that is taken up and laid again.
    for (let i = 0; i < 3; i++) {
      k.group(`g${i}`, { at: [0, 0, 0] })
      k.block(`plank${i}`, { at: [-PL / 2, -PW / 2, 0], size: [PL, PW, PH], r: 0.14, parent: `g${i}`, layer: -0.5 })
      for (const [j, y] of [-0.98, 0.98].entries())
        k.detail(`seam${i}${j}`, {
          pts: [
            [-PL / 2 + 0.05, y, PH + 0.003],
            [0, y, PH + 0.003],
            [PL / 2 - 0.05, y, PH + 0.003],
          ],
          parent: `g${i}`,
          layer: -0.5,
          bias: 0.3,
        })
    }

    // The carriage.
    const wheel = (id, x, y, layer) => k.extrude(id, { at: [x, y, PH + 0.4], shape: rrect(-0.4, -0.4, 0.4, 0.4, 0.4, 9), face: "+y", depth: 0.26, layer })
    wheel("wheelA", 0.02, -0.72, 0)
    wheel("wheelB", P - 0.02, -0.72, 0)
    k.block("chassis", { at: [CX - 1.5, -0.74, 0.5], size: [3.0, 1.48, 0.42], r: 0.22, layer: 0.1 })
    wheel("wheelC", 0.02, 1.0, 0.2)
    wheel("wheelD", P - 0.02, 1.0, 0.2)
    for (const id of ["C", "D"]) {
      k.led(`hub${id}`, { at: [id === "C" ? 0.02 : P - 0.02, 1.004, PH + 0.4], face: "+y", r: 0.12, layer: 0.21 })
      k.led(`dot${id}`, { at: [id === "C" ? 0.02 : P - 0.02, 1.006, PH + 0.4], face: "+y", r: 0.05, layer: 0.22 })
    }
    k.block("house", { at: [CX - 0.95, -0.6, 0.92], size: [1.5, 1.2, 0.5], r: 0.18, layer: 0.3 })
    k.detail("vent", {
      pts: [
        [CX - 0.7, 0.604, 1.24],
        [CX - 0.2, 0.604, 1.24],
        [CX + 0.3, 0.604, 1.24],
      ],
      layer: 0.31,
    })
    k.cyl("mast", { at: [CX, 0, 1.42], radius: 0.3, h: JIB - 1.42, layer: 0.4 })
    k.cyl("slew", { at: [CX, 0, JIB - 0.12], radius: 0.44, h: 0.12, layer: 0.45 })
    for (const [j, y] of [-0.36, 0.36].entries()) k.led(`front${j}`, { at: [CX + 1.505, y, 0.71], face: "+x", r: 0.09, layer: 0.12 })

    // The arm, and the weight on its rod.
    k.group("crane", { at: [CX, 0, 0] })
    k.block("jib", { at: [-1.1, -0.17, JIB], size: [1.1 + ARM - 0.3, 0.34, 0.24], r: 0.07, parent: "crane", layer: 2 })
    k.block("cw", { at: [-1.35, -0.36, JIB - 0.22], size: [0.6, 0.72, 0.56], r: 0.12, parent: "crane", layer: 2 })
    k.block("head", { at: [ARM - 0.36, -0.24, JIB - 0.16], size: [0.26, 0.48, 0.56], r: 0.06, parent: "crane", layer: 2 })
    k.cyl("cap", { at: [CX, 0, JIB + 0.24], radius: 0.24, h: 0.12, layer: 2.5 })
    k.cyl("weight", { at: [ARM, 0, 0], radius: WR, h: WH, role: "accent", parent: "crane", layer: 1.5 })
    k.cyl("neck", { at: [ARM, 0, WH], radius: 0.2, h: 0.12, role: "accent", parent: "crane", layer: 1.6 })
    k.cyl("rod", { at: [ARM, 0, WH + 0.12], radius: 0.075, h: ROD, n: 24, parent: "crane", layer: 2 })
    k.halo("press", { at: [2 * P, 0, PH + 0.006], r: 1.15, on: 1, layer: 1.2 })
  },
  tick(t, s, input) {
    const { p, groups } = s

    // The pointer says what is wanted; the lap runs to where that is, and waits.
    const at = input.onPlane ? input.onPlane(PH) : null
    const on = !!at && Math.abs(at[1]) < 2.6 && at[0] > -3 && at[0] < 9
    const want = !on ? 0 : at[0] > 2.5 * P + 0.1 ? 3 : at[0] > 1.5 * P - 0.2 ? 2 : 1
    let lt = cycle(input.still ? t : t - (s.shift || 0), T) * T
    if (input.still) {
      if (want === 1) lt = T - 0.2
    } else {
      const there = want === 2 ? lt > HELD + 0.1 && lt < FREE - 0.1 : want === 1 ? lt > ROLL[1] + 0.02 || lt < OUT[0] - 0.02 : false
      const rate = input.spring("rate", want === 0 ? 1 : there ? 0 : 1.9, { k: 160, c: 25 })
      const step = (input.dt || 0) * clamp(rate, 0, 2)
      // Never past the place it should wait at.
      if (want && there) s.shift = (s.shift || 0) + (input.dt || 0)
      else s.shift = (s.shift || 0) + (input.dt || 0) - (want ? step : (input.dt || 0) * clamp(rate, 0, 1))
      lt = cycle(t - s.shift, T) * T
    }
    const q = lapAt(lt)
    const w = q.roll * P

    // The board and everything left on it slide back under the carriage.
    p.board.off[0] = -w
    p.next0.off[0] = 2 * P - w
    p.next1.off[0] = 3 * P - w
    p.next1.fade = q.lit
    p.next1.hide = q.lit < 0.02
    for (let i = 0; i < STUDS; i++) {
      const stud = p[`stud${i}`]
      stud.off[0] = (i - 2) * P - w // the last of them belongs to the place in front
      stud.fade = i === STUDS - 1 ? q.lit : i === 0 ? clamp(1 - q.roll * 1.8) : 1
      stud.hide = stud.fade < 0.02
      stud.glow = i === STUDS - 1 ? 0.25 * q.lit * (1 - q.roll) : 0
    }

    // The arm.
    groups.crane.rz = q.turn
    const b = input.still ? 0.5 : breathe(t, 2.6)
    p.weight.off[2] = q.z + (q.z <= PH + 1e-6 && !q.carried ? q.dip : 0)
    p.neck.off[2] = p.weight.off[2]
    p.rod.off[2] = p.weight.off[2]
    p.rod.bias = JIB + 0.1 - (p.weight.off[2] + WH + 0.12 + ROD / 2)
    const down = clamp((PH + 0.5 - q.z) / 0.5) * Number(lt > UP && lt < FREE + 0.3)
    p.weight.glow = 0.22 + 0.2 * down + 0.06 * b
    p.neck.glow = 0
    p.press.glow = 0.9 * down

    // The planks: the first is behind, on the arm, or in front.
    const a = (q.turn * Math.PI) / 180
    for (let i = 0; i < 3; i++) {
      const g = groups[`g${i}`]
      const plank = p[`plank${i}`]
      let on2 = 0
      let layer = -0.5
      if (i > 0) {
        g.off[0] = (i - 1) * P - w
      } else if (lt <= PICK + 0.04) {
        g.off[0] = -P - w
      } else {
        on2 = q.lit * (1 - q.roll)
        g.off[2] = q.carried ? q.z - PH : q.dip
        if (lt < IN[1]) {
          g.rz = q.turn
          g.off[0] = CX + ARM * Math.cos(a)
          g.off[1] = ARM * Math.sin(a)
        } else g.off[0] = 2 * P - w
        // In the air it passes over everything; on the board it goes under the wheels.
        if (lt > IN[0] - 0.2 && lt < FREE) layer = 1
      }
      plank.layer = layer
      p[`seam${i}0`].layer = layer
      p[`seam${i}1`].layer = layer
      plank.on = on2 > 0.4 ? 2 : 0
      for (const j of [0, 1]) p[`seam${i}${j}`].on = plank.on
      plank.glow = 0.22 * on2
    }
    p.spill.glow = 0.75 * q.lit * (1 - q.roll)

    // The wheels turn as the board goes by.
    const r = w / 0.4
    for (const id of ["C", "D"]) {
      const dot = p[`dot${id}`]
      dot.off[0] = 0.26 * Math.cos(r - 0.6)
      dot.off[2] = -0.26 * Math.sin(r - 0.6)
    }

    s.state = lt < OUT[1] ? (lt < OUT[0] ? "rest" : "back") : lt < LAID ? "lay" : lt < HELD ? "test" : lt < ROLL[0] ? "holds" : lt < ROLL[1] ? "roll" : "rest"
  },
  readout: (s) => s.state || "rest",
})
