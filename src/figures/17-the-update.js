// Chapter 17, The update: the date that moved, and the line that still says it.
//
// Five rails lie across a plate, and on each a marker stands at a date, 14 or
// 28. The first is the source, where the date is decided; the other four have
// repeated it. They are joined to nothing: the source can slip along its rail
// to 28 and no other marker feels it. All four go on showing 14, one after
// another down the line.
//
// What moves them is a wedge that rides the line on a guide behind it: the
// call that says the date has moved. It is cut so that its front edge takes a
// marker at the old date and leaves it at the new one. As it goes down the
// line each marker slides over in its turn, and nobody past its tip has moved.
//
// Light: teal is the old date, on every marker that still shows it. Magenta is
// the new one, and the wedge that tells it, while it travels.
//
// The pointer sends the call: the wedge goes as far down the line as the
// pointer, and the rest keep the old date. A marker that has been told stays told.

import { clamp, cycle, easeIn, easeInOut, figure, keys, lerp, ring, rrect, smooth } from "../lib/iso/core.js"

const T = 9.5 // seconds per lap
const N = 4 // repeaters
const X0 = -2.6 // the source
const PITCH = 1.3
const xOf = (i) => X0 + i * PITCH
const OLD = -0.66
const NEW = 0.66
const RAIL = 0.22 // the top of the rails
const PR = 0.37 // a marker's radius
const PH = 0.3
const CR = 0.29 // the lit cap

// The wedge: its front edge runs from its tip back to its full width.
const TIP_Y = -1.5
const FULL_Y = NEW - PR
const LP = 1.3
const TAIL = 0.5
const WZ = RAIL + 0.02
const WH = 0.28
const HOME = X0 - 0.06 // where the tip waits
const END = xOf(N) + LP + 0.06 // where it has told them all
const GUIDE = -1.9 // the guide's middle line

const H = FULL_Y - TIP_Y
const S = Math.hypot(H, LP)
const NX = H / S

/** Where the wedge, with its tip at xt, leaves a marker on the rail at cx that stood at y. */
function pushed(xt, cx, y) {
  const back = cx - (xt - LP) // how far the marker is in front of the full width
  if (back >= LP + PR) return y
  const at =
    back >= PR * NX ? TIP_Y + (PR * S + H * (xt - cx)) / LP : back > 0 ? FULL_Y + Math.sqrt(PR * PR - back * back) : FULL_Y + PR
  return Math.max(y, at)
}

// The lap, in seconds.
const SLIP = 0.9 // the source moves, in silence
const CALL = 3.6 // the wedge sets off
const TOLD = 6.4 // it has reached the end
const BACK = 7.9 // it comes home
const RESET = 8.65 // the next date: everything back to the start

export default figure({
  slug: "17-the-update",
  title: "The move, told down the line",
  desc: "Five markers stand on five rails, each at one of two dates, 14 or 28. The source and the two markers next to it, lit magenta, stand at 28; a magenta wedge riding along the line has just pushed them over. The last two markers, which it has not reached, are still at 14 and still lit teal.",
  plate: "The update",
  sentence:
    "The viewer sees the source slip to a new date while the markers that repeated it go on showing the old one, until a wedge sent down the line pushes each of them over in turn, which explains why a date moved in silence is still being repeated.",
  view: { scale: 40, origin: [288, 222] },
  still: 5.02,
  build(k) {
    k.grid("board", { at: [-5.2, -3.1, -0.3], size: [10.5, 6.3], step: 0.7 })
    k.block("base", { at: [-4.7, -2.35, -0.3], size: [9.15, 4.15, 0.3], r: 0.45, layer: -3 })
    const lip = rrect(-4.5, -2.15, 4.25, 1.6, 0.3)
    k.detail("lip", { pts: [...lip, lip[0]].map(([x, y]) => [x, y, 0.002]), layer: -2.2 })
    ;[
      [-4.3, 1.4],
      [4.05, 1.4],
      [-4.3, -1.5],
      [4.05, -1.5],
    ].forEach(([x, y], j) => k.led(`screw${j}`, { at: [x, y, 0.002], face: "+z", r: 0.07, layer: -2 }))
    k.label("d14", { at: [3.62, OLD, 0.003], text: "14", face: "+z", size: 0.5, layer: -2 })
    k.label("d28", { at: [3.62, NEW, 0.003], text: "28", face: "+z", size: 0.5, layer: -2 })
    k.halo("spill", { at: [0, 0.1, 0.003], r: 1.9, on: 1, layer: -1 })

    // The guide the wedge rides on.
    k.block("guide", { at: [-4.45, GUIDE - 0.11, 0], size: [8.65, 0.22, 0.34], r: 0.08, layer: -0.5 })

    // The rails: the source's on a plinth, then the four that repeat it.
    for (let i = 0; i <= N; i++) {
      const x = xOf(i)
      k.block(`rail${i}`, { at: [x - 0.48, -1.38, 0], size: [0.96, 2.76, RAIL], r: 0.18, layer: 0 })
      k.face(`slot${i}`, { at: [x, 0, RAIL + 0.002], pts: rrect(-0.11, -1.12, 0.11, 1.12, 0.11).reverse().map(([a, b]) => [a, b, 0]), role: "recess", layer: 0, bias: 0.6 })
      for (const [j, y] of [OLD, NEW].entries())
        k.detail(`seat${i}${j}`, { pts: [...ring(x, y, PR + 0.045, 36), [x + PR + 0.045, y]].map(([a, b]) => [a, b, RAIL + 0.004]), layer: 0.2 })
    }
    // The two dates, carried down the line.
    k.guide("lineOld", { pts: [[xOf(0) - 0.6, OLD, RAIL + 0.006], [0, OLD, RAIL + 0.006], [xOf(N) + 0.62, OLD, RAIL + 0.006]], layer: 0.3 })
    k.guide("lineNew", { pts: [[xOf(0) - 0.6, NEW, RAIL + 0.006], [0, NEW, RAIL + 0.006], [xOf(N) + 0.62, NEW, RAIL + 0.006]], layer: 0.3 })

    // The wedge.
    k.group("call", { at: [0, 0, WZ] })
    k.extrude("wedge", {
      at: [0, 0, WH],
      face: "+z",
      shape: [
        [0.02, TIP_Y],
        [-LP, FULL_Y],
        [-LP - TAIL, FULL_Y],
        [-LP - TAIL, TIP_Y - 0.12],
        [0.02, TIP_Y - 0.12],
      ].map(([x, y]) => [x, -y]),
      depth: WH,
      parent: "call",
      layer: 1,
    })
    k.block("shoe", { at: [-1.75, GUIDE - 0.2, 0.11], size: [1.15, TIP_Y - 0.14 - GUIDE + 0.2, WH - 0.14], r: 0.08, parent: "call", layer: 0.95 })
    k.detail("seam", { pts: [[-LP - TAIL + 0.14, FULL_Y - 0.14, WH + 0.002], [-LP - 0.1, FULL_Y - 0.14, WH + 0.002], [-0.22, TIP_Y + 0.06, WH + 0.002]], parent: "call", layer: 1.05 })

    // The markers: the source's is square, with a knob; the others repeat it.
    k.group("m0", { at: [X0, OLD, RAIL] })
    k.block("src", { at: [-0.34, -0.34, 0], size: [0.68, 0.68, 0.4], r: 0.12, parent: "m0", layer: 2 })
    k.cyl("cap0", { at: [0, 0, 0.4], radius: CR, h: 0.42, n: 40, parent: "m0", layer: 2, bias: 0.4 })
    for (let i = 1; i <= N; i++) {
      k.group(`m${i}`, { at: [xOf(i), OLD, RAIL] })
      k.cyl(`puck${i}`, { at: [0, 0, 0], radius: PR, h: PH, parent: `m${i}`, layer: 2 })
      k.cyl(`cap${i}`, { at: [0, 0, PH], radius: CR, h: 0.3, n: 40, parent: `m${i}`, layer: 2, bias: 0.4 })
    }
  },
  tick(t, s, input) {
    const { p, groups } = s
    const lt = cycle(t, T) * T

    // The lap: a pure function of the time in it.
    const src = keys(lt, [[0, OLD], [SLIP, OLD], [SLIP + 0.55, NEW, easeInOut], [RESET, NEW], [RESET + 0.5, OLD, easeInOut], [T, OLD]])
    const tip = keys(lt, [[0, HOME], [CALL, HOME], [CALL + 0.35, HOME + 0.45, easeIn], [TOLD, END, (u) => 1.16 * u - 0.16 * u * u * u], [BACK, END], [BACK + 0.65, HOME, easeInOut], [T, HOME]])
    const loopY = []
    for (let i = 1; i <= N; i++) {
      const reached = lt < CALL ? HOME : lt < TOLD ? tip : END
      const y = pushed(reached, xOf(i), OLD)
      loopY.push(lt < RESET ? y : lerp(NEW, OLD, easeInOut((lt - RESET) / 0.5)))
    }

    // The pointer sends the call as far as it points, on the fixed plane of the wedge.
    const at = input.onPlane ? input.onPlane(WZ + 0.2) : null
    const on = !!at && Math.abs(at[0]) < 4.9 && Math.abs(at[1]) < 2.4
    const m = input.tween("ptr", on ? 1 : 0, { dur: 0.45 })
    if (on && !s.told) s.told = loopY.slice()
    if (!on && m < 0.001) s.told = null
    const aim = on ? clamp(at[0], HOME, END) : (s.aim ?? HOME)
    if (on) s.aim = aim
    const xp = input.spring("x", on || m > 0.001 ? aim : tip, on || m > 0.001 ? { k: 70, c: 16.8 } : { k: 4000, c: 126 })
    const xt = lerp(tip, xp, m)
    let y0 = src
    if (m > 0.001 && s.told) {
      y0 = lerp(src, NEW, m)
      for (let i = 1; i <= N; i++) {
        if (on) {
          const by = pushed(xp, xOf(i), OLD)
          // Let go half way, a marker clicks to the nearer date.
          const y = Math.max(s.told[i - 1], by)
          s.told[i - 1] = y > by + 0.004 && input.dt ? y + clamp((y > 0 ? NEW : OLD) - y, -2.4 * input.dt, 2.4 * input.dt) : y
        }
        loopY[i - 1] = lerp(loopY[i - 1], s.told[i - 1], m)
      }
    }

    groups.m0.off[1] = y0 - OLD
    groups.call.off[0] = xt
    const moved = y0 > 0
    p.cap0.on = moved ? 1 : 2
    p.cap0.glow = 0.4

    // Whoever was not told goes on repeating the old date, one after another
    // down the line; once all have been told, they repeat the new one.
    const told = loopY.filter((y) => y > 0).length
    const going = xt > HOME + 0.12
    for (let i = 1; i <= N; i++) {
      const y = loopY[i - 1]
      groups[`m${i}`].off[1] = y - OLD
      const is = y > 0
      const says = !input.still && (!is || told === N) && !(lt >= RESET - 0.1 && m < 0.5)
      const beat = says ? smooth(Math.max(0, 1 - Math.abs(cycle(t, 1.5, -i * 0.15) - 0.25) / 0.17)) : 0
      p[`cap${i}`].on = is ? 1 : 2
      p[`cap${i}`].off[2] = 0.13 * beat
      p[`cap${i}`].glow = 0.3 + 0.35 * beat
    }
    const lit = going && !(m < 0.5 && lt > BACK)
    p.wedge.on = lit ? 1 : 0
    p.seam.on = lit ? 1 : 0
    p.wedge.glow = lit ? 0.22 : 0
    p.spill.at[0] = xt - 0.9
    p.spill.glow = lit ? 0.6 : 0

    s.state = !moved && told === 0 ? "the 14th" : told === 0 ? "in silence" : told < N ? `told ${told} of ${N}` : "the 28th"
  },
  readout: (s) => s.state || "rest",
})
