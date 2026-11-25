// Chapter 38, Still human: where the question stops.
//
// Eight uprights stand on one line, edge to edge, all the same size. Seven
// are dashed outlines: drafts. The question, the cube, comes along the line
// after them and runs through one after another as if nothing were there,
// because nothing is. One upright is solid. The cube meets its edge and
// stops; the upright turns a quarter turn toward it, the cube comes up to its
// face, and only then it lights. Two more drafts stand behind it; the cube
// has no need to reach them.
//
// Light: magenta is the question and the one who answers it. Nothing else.
//
// The pointer carries the question along the line. Over a draft it goes
// straight through; it never gets past the one that is solid.

import { breathe, clamp, cycle, easeIn, easeInOut, easeOut, figure, keys, ring } from "../lib/iso/core.js"

const T = 8 // seconds per lap
const N = 8 // uprights on the line
const PITCH = 1.36
const WHO = 5 // the solid one
const yOf = (i) => 4.76 - i * PITCH
const YH = yOf(WHO)

const L = 1.02 // an upright's length along the line
const TH = 0.26 // its thickness
const H = 2.2 // its height
const SEAT = 0.06 // the plate it stands on
const Q = 0.36 // the question's size

const Y0 = yOf(0) + 0.98 // the question comes in here
const MEET = YH + L / 2 + 0.06 + Q / 2 // it meets the solid one's edge, clear of the turn
const FACE = YH + TH / 2 + 0.26 + Q / 2 // it comes up to its face

// The lap, in seconds.
const GO = 0.5
const STOP = 3.1
const TURN0 = 3.4
const TURN1 = 4.3
const LIT = 4.85
const OFF = 7.0

/** The loop as a function of time in the lap: where the question is, how far it has turned, the light. */
function loopAt(lt) {
  return {
    y: keys(lt, [
      [0, Y0],
      [GO, Y0],
      [STOP, MEET, (u) => u], // an even pace: nothing on the way slows it
      [TURN1, MEET],
      [LIT - 0.05, FACE, easeInOut],
      [T, FACE],
    ]),
    turn: keys(lt, [
      [0, 0],
      [TURN0, 0],
      [TURN1, 1, easeInOut],
      [OFF + 0.2, 1],
      [T - 0.05, 0, easeInOut],
      [T, 0],
    ]),
    lit: keys(lt, [
      [0, 0],
      [LIT - 0.1, 0],
      [LIT + 0.2, 1, easeOut],
      [OFF, 1],
      [OFF + 0.35, 0, easeIn],
      [T, 0],
    ]),
    here: keys(lt, [
      [0, 0],
      [GO - 0.2, 0],
      [GO + 0.15, 1],
      [OFF, 1],
      [OFF + 0.35, 0],
      [T, 0],
    ]),
  }
}

/** Where in the lap the loop is most like this. */
function resume(y, turn, lit) {
  let best = 0
  let d0 = Infinity
  for (let i = 0; i <= 320; i++) {
    const lt = GO + 0.15 + ((OFF - GO - 0.15) * i) / 320
    const q = loopAt(lt)
    const d = Math.abs(q.y - y) + 2 * Math.abs(q.turn - turn) + Math.abs(q.lit - lit)
    if (d < d0) {
      d0 = d
      best = lt
    }
  }
  return best
}

export default figure({
  slug: "38-still-human",
  title: "The one the question stops at",
  desc: "Eight uprights of one size stand along a line. Seven are dashed outlines. The solid one has turned across the line to face a small cube that came along it, and glows magenta.",
  plate: "Still human",
  sentence:
    "The viewer sees a question run through a row of outlines and stop at the one upright that is solid, which turns to it and lights, which explains what a name is for: it is where the next question can stop.",
  view: { scale: 35.5, origin: [286, 252] },
  still: 5.8,
  build(k) {
    k.grid("board", { at: [-4.2, -5.95, -0.3], size: [8.4, 11.9], step: 0.7 })
    const y1 = Y0 + 0.44
    const y0 = yOf(N - 1) - 1.0
    k.block("base", { at: [-0.95, y0, -0.3], size: [1.9, y1 - y0, 0.3], r: 0.5, layer: -3 })
    // The line.
    k.face("line", {
      at: [0, 0, 0.002],
      pts: [
        [-0.07, y0 + 0.5, 0],
        [0.07, y0 + 0.5, 0],
        [0.07, y1 - 0.34, 0],
        [-0.07, y1 - 0.34, 0],
      ],
      role: "recess",
      layer: -2,
    })
    for (let i = 0; i < N; i++) {
      const y = yOf(i)
      if (i === WHO) continue
      const c = ring(0, y, 0.64, 48)
      k.detail(`seat${i}`, { pts: [...c, c[0]].map(([a, b]) => [a, b, 0.003]), layer: -2 })
      k.block(`draft${i}`, { at: [-TH / 2, y - L / 2, SEAT], size: [TH, L, H], r: 0.1, role: "ghost", layer: 0.6 })
    }
    ;[
      [-0.62, y0 + 0.42],
      [0.62, y0 + 0.42],
      [-0.62, y1 - 0.42],
      [0.62, y1 - 0.42],
    ].forEach(([x, y], i) => k.led(`screw${i}`, { at: [x, y, 0.002], face: "+z", r: 0.065, layer: -2 }))
    k.halo("spill", { at: [0, YH + 0.35, 0.004], r: 2.1, on: 1, layer: -1 })
    k.halo("under", { at: [0, 0, 0.004], r: 0.8, on: 1, layer: -1 })

    // The solid one, on a plate that can turn.
    k.cyl("plate", { at: [0, YH, 0], radius: 0.64, h: SEAT, layer: -0.5 })
    k.group("who", { at: [0, YH, SEAT] })
    k.block("human", { at: [-TH / 2, -L / 2, 0], size: [TH, L, H], r: 0.1, parent: "who" })
    // The place for a name, low on its face.
    k.detail("name", {
      pts: [
        [TH / 2 + 0.004, 0.28, 0.5],
        [TH / 2 + 0.004, 0, 0.5],
        [TH / 2 + 0.004, -0.28, 0.5],
      ],
      parent: "who",
      bias: 0.6,
    })

    // The question.
    k.block("ask", { at: [-Q / 2, -Q / 2, 0.02], size: [Q, Q, Q], r: 0.08, role: "accent", layer: 0.5 })
  },
  tick(t, s, input) {
    const { p, groups } = s

    // The pointer carries the question along the line.
    const at = input.onPlane ? input.onPlane(0.4) : null
    const on = !!at && Math.abs(at[0]) < 2 && at[1] < Y0 + 0.9 && at[1] > yOf(N - 1) - 1.4
    if (on && !input.still) s.held = true
    else if (s.held) {
      // Let go: the lap goes on from here.
      s.held = false
      s.shift = t - resume(s.y, s.turn, s.lit)
    }
    const lt = cycle(input.still ? t : t - (s.shift || 0), T) * T
    const loop = loopAt(lt)

    const stopped = s.y !== undefined && s.y < MEET + 0.04
    const faced = (s.turn || 0) > 0.985
    const aim = on ? clamp(at[1], faced && stopped ? FACE : MEET, Y0) : loop.y
    const track = { k: 4000, c: 126 }
    const y = input.spring("y", aim, on ? { k: 46, c: 13.6 } : track)
    const wantTurn = on ? (input.still ? aim <= MEET + 0.02 : y < MEET + 0.06) : loop.turn
    const turn = input.spring("turn", on ? Number(wantTurn) : loop.turn, on ? { k: 52, c: 14.4 } : track)
    const wantLit = on ? Number(turn > 0.94 && y < MEET + 0.1) : loop.lit
    const lit = clamp(input.spring("lit", wantLit, on ? { k: 90, c: 19 } : track))
    const here = input.spring("here", on ? 1 : loop.here, on ? { k: 200, c: 28 } : track)
    s.y = y
    s.turn = turn
    s.lit = lit

    groups.who.rz = 90 * turn
    p.human.on = lit > 0.45 ? 1 : 0
    const b = input.still ? 0.5 : breathe(t, 3.2)
    p.human.glow = lit * (0.34 + 0.12 * b)
    p.name.on = p.human.on
    p.spill.glow = lit * 0.85

    p.ask.off[1] = y
    p.ask.fade = clamp(here)
    p.ask.hide = here < 0.02
    p.ask.glow = 0.4 * clamp(here)
    p.under.at[1] = y
    p.under.glow = 0.5 * clamp(here) * (1 - 0.6 * lit)

    s.state = lit > 0.5 ? "here" : here < 0.3 ? "rest" : y < MEET + 0.05 ? "stopped" : "through"
  },
  readout: (s) => s.state || "rest",
})
