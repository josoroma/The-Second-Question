// Chapter 23, On the page: two lines that open the rest.
//
// A page stands in a frame, and almost all of it is folded up in the box at
// the top. Only its first two lines show, two bars that slide on the front of
// the box. Beside the page stands the reader: a catch with two fingers, cut to
// the ends of those two lines, and a bolt that runs through the frame and
// holds the folded pack up. Slid the wrong way, away from the reader, the two
// lines meet nothing and the page stays folded. Slid to the reader, their ends
// meet the two fingers together and push the catch back; the bolt leaves the
// frame and the pack drops out of the box. The third line stops first, just
// under the second, then the fourth, down to the last.
//
// Light: teal is the first two lines, what comes first. Magenta is the third,
// from the moment it is read. At rest only those glow.
//
// The pointer slides the two lines: toward the reader the page unfolds, and
// away from them it folds up again.

import { breathe, clamp, cycle, easeIn, easeInOut, easeOut, figure, keys } from "../lib/iso/core.js"

const T = 9.4 // seconds per lap

// The frame, its face toward +y.
const W = 2.0 // half the page
const POST = 0.22
const PITCH = 0.5 // from line to line
const SLAT = 0.23
const ZB = 2.78 // the underside of the box
const BOX = 1.12
const FACE = 0.19 // the front of the box
const BAR = 0.16 // how thick the first two lines are
const z = (n) => (n < 3 ? ZB + 0.2 - (n - 2) * PITCH : ZB - 0.49 - (n - 3) * 0.5) // the underside of line n on the open page
const REST = [3, 4, 5, 6, 7]
const PACK = SLAT - 0.04 // folded, each line tucks a little under the one above
const zFold = (n) => ZB - 0.2 + (7 - n) * PACK
const FALL = zFold(7) - z(7)
// The third line is down once the pack has fallen this far.
const THIRD = zFold(3) - z(3)

// The first two lines: where their ends stand, and where the reader's fingers meet them.
const ENDS = [1.92, 1.5]
const LEFT = -1.86
const MEET = 0.5 // how far they slide to meet the fingers
const PUSH = 0.48 // and how far they push the catch
const AWAY = -0.58
const BOLT = 0.44 // how far the bolt reaches into the frame
const FREE = 0.45 // the catch has moved this far: the bolt is out

// The reader's catch.
const CX = W + POST + 0.78
const STAND = ZB - 0.82

// The lap, in seconds.
const WRONG0 = 0.4
const WRONG1 = 1.15
const TURN = 1.75
const TOUCH = 2.75
const OPEN = 3.25
const DROP = 3.15
const DOWN = 4.75
const HOLD = 7.4
const UP = 8.5
const CLOSE = 8.9

/** The loop: where the two lines are, and how far the pack has come down. */
function loopAt(lt) {
  const o = keys(lt, [
    [0, 0],
    [WRONG0, 0],
    [WRONG1, AWAY, easeInOut],
    [TURN, AWAY],
    [TOUCH, MEET, easeInOut],
    [OPEN, MEET + PUSH, easeOut],
    [HOLD + 0.6, MEET + PUSH],
    [CLOSE, 0, easeInOut],
    [T, 0],
  ])
  const d = keys(lt, [
    [0, 0],
    [DROP, 0],
    [DOWN, FALL, (u) => 0.6 * u * u + 0.4 * u],
    [HOLD, FALL],
    [UP, 0, easeInOut],
    [T, 0],
  ])
  // While the pack is out it stands in the bolt's way: the catch stays back.
  const hold = keys(lt, [
    [0, 0],
    [OPEN, 0],
    [OPEN + 0.05, 1],
    [UP, 1],
    [UP + 0.2, 0, easeIn],
    [T, 0],
  ])
  return { o, d, push: PUSH * Math.max(hold, clamp((o - MEET) / PUSH)) }
}

export default figure({
  slug: "23-on-the-page",
  title: "Two lines open the rest",
  desc: "A page stands in a frame. Its first two lines, two teal bars on the box at the top, have slid to the right and pushed back the two fingers of the reader's catch. Below them the rest of the page has come down out of the box, line by line, and the third line glows magenta.",
  plate: "On the page",
  sentence:
    "The viewer sees two bars slide one way and leave a page folded in its box, then slide to the reader's catch, push its bolt out and let the third line and all the rest down, which explains why the first two lines are written for one reader: they decide whether that reader goes on.",
  view: { scale: 41, origin: [258, 262] },
  still: 6.4,
  build(k) {
    k.grid("board", { at: [-3.6, -2.8, -0.3], size: [9, 6.3], step: 0.7 })
    k.block("base", { at: [-2.75, -0.95, -0.3], size: [7.3, 2.6, 0.3], r: 0.4, layer: -3 })
    ;[
      [-2.5, -0.7],
      [-2.5, 1.4],
      [4.3, -0.7],
      [4.3, 1.4],
    ].forEach(([x, y], i) => k.led(`screw${i}`, { at: [x, y, 0.002], face: "+z", r: 0.07, layer: -2 }))
    k.halo("spill", { at: [0, 0.6, 0.003], r: 1.5, on: 1, layer: -1 })

    // The frame, and the sheet behind the lines.
    k.block("sheet", { at: [-W, -0.24, 0.1], size: [2 * W, 0.1, ZB - 0.06], r: 0.01, layer: 0 })
    k.block("postL", { at: [-W - POST, -0.28, 0], size: [POST, 0.46, ZB], r: 0.06, layer: 0.4 })
    k.block("sill", { at: [-W, -0.28, 0], size: [2 * W, 0.46, 0.14], r: 0.02, layer: 0.5 })
    for (const n of REST) k.guide(`gap${n}`, { pts: [[-W + 0.1, -0.135, z(n) + SLAT / 2], [0, -0.135, z(n) + SLAT / 2], [W - 0.1, -0.135, z(n) + SLAT / 2]], layer: 0.6 })
    k.block("postR", { at: [W, -0.28, 0], size: [POST, 0.46, ZB], r: 0.06, layer: 1.5 })

    // The folded lines. Each has its words scored along it.
    const words = { 3: 0.74, 4: 0.9, 5: 0.62, 6: 0.84, 7: 0.4 }
    for (const n of REST) {
      k.group(`g${n}`, { at: [0, 0, 0] })
      k.block(`line${n}`, { at: [-W + 0.02, -0.1, z(n)], size: [2 * W - 0.04, 0.18, SLAT], r: 0.04, parent: `g${n}`, layer: 1 })
      const x0 = -W + 0.22
      const x1 = x0 + (2 * W - 0.44) * words[n]
      k.detail(`words${n}`, { pts: [[x0, 0.084, z(n) + SLAT / 2], [(x0 + x1) / 2, 0.084, z(n) + SLAT / 2], [x1, 0.084, z(n) + SLAT / 2]], parent: `g${n}`, layer: 1.1 })
    }

    // The box the page folds into, with a track on its front for each of the two lines.
    k.block("box", { at: [-W - POST - 0.06, -0.34, ZB], size: [2 * (W + POST) + 0.12, 0.34 + FACE, BOX], r: 0.1, layer: 2 })
    for (const n of [1, 2])
      k.face(`track${n}`, {
        at: [0, FACE + 0.003, z(n) + 0.08],
        pts: [
          [-W - POST + 0.06, 0, 0],
          [W + POST - 0.06, 0, 0],
          [W + POST - 0.06, 0, 0.14],
          [-W - POST + 0.06, 0, 0.14],
        ],
        role: "recess",
        layer: 2.1,
      })
    k.group("two", { at: [0, 0, 0] })
    for (const n of [2, 1]) {
      const x1 = ENDS[n - 1]
      k.block(`line${n}`, { at: [LEFT, FACE + 0.01, z(n)], size: [x1 - LEFT, BAR, 0.28], r: 0.05, role: "accent2", parent: "two", layer: 2.3 })
      const w1 = LEFT + (x1 - LEFT) * (n === 1 ? 0.88 : 0.8)
      const y = FACE + 0.01 + BAR + 0.004
      k.detail(`words${n}`, { pts: [[LEFT + 0.2, y, z(n) + 0.14], [0, y, z(n) + 0.14], [w1, y, z(n) + 0.14]], on: 2, parent: "two", layer: 2.35 })
    }

    // The reader: a stand, and on it the catch with its two fingers and its bolt.
    k.block("foot", { at: [CX - 0.32, -0.28, 0], size: [1.56, 1.06, 0.14], r: 0.2, layer: 2.5 })
    k.extrude("mast", {
      at: [CX + 0.46, 0.53, 0.14],
      shape: [
        [-0.58, 0],
        [0.58, 0],
        [0.3, STAND - 0.14],
        [-0.3, STAND - 0.14],
      ],
      face: "+y",
      depth: 0.56,
      layer: 2.6,
    })
    k.block("slide", { at: [CX - 0.24, -0.03, STAND], size: [1.4, 0.56, 0.14], r: 0.05, layer: 2.7 })
    k.group("catch", { at: [0, 0, 0] })
    k.block("bolt", { at: [W - BOLT, -0.07, ZB - 0.36], size: [BOLT + POST + 0.04, 0.18, 0.16], r: 0.03, parent: "catch", layer: 1.2 })
    k.block("rod", { at: [W + POST - 0.02, -0.07, ZB - 0.36], size: [CX - W - POST + 0.06, 0.18, 0.16], r: 0.03, parent: "catch", layer: 1.6 })
    k.block("carriage", { at: [CX - 0.12, -0.14, STAND + 0.14], size: [0.62, 0.8, 0.2], r: 0.08, parent: "catch", layer: 3 })
    k.block("bar", { at: [CX, -0.1, STAND + 0.34], size: [0.28, 0.7, z(1) + 0.46 - STAND - 0.34], r: 0.07, parent: "catch", layer: 3.1 })
    for (const n of [2, 1]) {
      const tip = ENDS[n - 1] + MEET
      k.block(`finger${n}`, { at: [tip, FACE + 0.02, z(n) + 0.04], size: [CX - tip + 0.02, BAR - 0.02, 0.2], r: 0.04, parent: "catch", layer: 3.05 })
    }
  },
  tick(t, s, input) {
    const { p, groups } = s
    const lt = cycle(input.still ? t : t - (s.shift || 0), T) * T
    const L = loopAt(lt)
    let { o, d, push } = L

    // The pointer slides the two lines: where it stands along the front of the
    // box, read on the fixed plane of their middle.
    const at = input.onPlane ? input.onPlane(ZB + 0.4) : null
    const aim = at ? at[0] - at[1] + FACE : null
    const near = aim !== null && aim > -3.4 && aim < 5.2
    if (input.still) {
      if (near) {
        o = clamp(aim * 0.62, AWAY, MEET + PUSH)
        d = o > MEET + FREE ? FALL : 0
        push = clamp(o - MEET, 0, PUSH)
      }
    } else if (near || s.m) {
      const m = s.m || (s.m = { o: L.o, d: L.d, push: L.push })
      const dt = Math.min(input.dt || 0, 0.05)
      // Let go, they go to the reader and the lap carries on from the open page.
      const to = near ? clamp(aim * 0.62, AWAY, MEET + PUSH) : MEET + PUSH
      m.o += clamp((to - m.o) * (1 - Math.exp(-dt * 9)), -2.4 * dt, 2.4 * dt)
      if (Math.abs(to - m.o) < 0.004) m.o = to
      const free = m.o > MEET + FREE
      m.d = clamp(m.d + (free ? (1.0 + 0.5 * m.d) * dt : -2.6 * dt), 0, FALL)
      const back = m.d > 0.01 ? PUSH : clamp(m.o - MEET, 0, PUSH)
      m.push = Math.max(clamp(m.o - MEET, 0, PUSH), m.push + clamp(back - m.push, -2.4 * dt, 2.4 * dt))
      o = m.o
      d = m.d
      push = m.push
      if (!near && m.o === to && m.d >= FALL) {
        s.m = null
        s.shift = t - (DOWN + 0.4)
      }
    }

    // The two lines, and the catch once they push it.
    groups.two.off[0] = o
    groups.catch.off[0] = push
    const met = clamp((o - MEET + 0.03) / 0.03)

    // The pack falls as one; each line stops at its own place.
    for (const n of REST) {
      const at = Math.max(z(n), zFold(n) - d)
      groups[`g${n}`].off[2] = at - z(n)
      const out = at < ZB - 0.22
      p[`words${n}`].hide = !out
    }

    const read = clamp((d - THIRD + 0.02) / 0.06)
    const lit = input.still ? read : clamp(input.spring("lit", read, { k: 160, c: 25 }))
    const b = input.still ? 0.5 : breathe(t, 2.8)
    p.line3.on = lit > 0.35 ? 1 : 0
    p.words3.on = p.line3.on
    p.line3.glow = lit * (0.22 + 0.08 * b)
    p.spill.glow = lit * 0.4
    for (const n of [1, 2]) p[`line${n}`].glow = 0.1 * met

    const down = REST.filter((n) => d >= zFold(n) - z(n) - 0.01).length
    s.state = down > 0 ? `line ${2 + down}` : push > 0.02 ? "the reader" : o < -0.1 ? "still folded" : "two lines"
  },
  readout: (s) => s.state || "rest",
})
