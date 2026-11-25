// Chapter 12, Listening people can feel: the copy, held against the original.
//
// On a table stands a stepped wall: what someone said, five rows of it. Facing
// it is a comb of five sliding pins: the listener. As it is told, one pin
// after another slides out and takes its row's place, all but one, which never
// moves. The comb draws back with its copy, and nobody could say from the
// outside whether it holds. Then it comes back and is held against the wall
// again: the read-back. Now the table lights from below. Where the copy meets
// the wall no light comes through and the pins' tips light teal; under the row
// that was missed a gap shows, magenta. The piece that fits it has been lying
// on the wall all along: it slides out, drops into the gap, and when the comb
// draws back it carries the piece with it.
//
// Light: teal is what was understood (the tips that meet the wall); magenta is
// what was missed, the gap and the piece that corrects it. At rest only those
// glow.
//
// The pointer holds the comb. Out to the right the copy is away and dark, and
// nothing can be checked; drawn in, it is read back and the gap shows; on over
// the wall, the correction drops in.

import { clamp, cycle, easeIn, easeInOut, easeOut, figure, geometry, keys, lerp, rrect } from "../lib/iso/core.js"

const T = 10 // seconds per lap
const N = 5
const MISS = 2 // the row that was not taken down
const P = 1.16 // one row to the next
const Y = (i) => (MISS - i) * P // row 0 stands nearest
const W = 0.84 // a pin's width
const BENCH = 0.4 // the bench's top
const TABLE = 0.5 // the light plate's top, where the pins run
const PH = 0.2 // a pin's thickness
const WALL = 1.0 // the wall's top
const BACK = -3.1 // the wall's back
const FACE = -1.9 // the line its steps are measured from
const STEP = [0.55, 0.95, 1.35, 0.35, 0.8] // how far each row stands out
const X = (i) => FACE + STEP[i]
const BLANK = 0.72 // where every tip waits before it is told anything
const TIP = 0.8 // a tip's length
const PIN = 3.5 // a pin's whole length
const GAP = BLANK - X(MISS) // what is missing
const HX0 = 1.2 // the comb's head
const HX1 = 1.8
const HY = 3.36
const ARM = 2.78 // the bench's two arms run outside this
const AWAY = 0.9 // how far the comb draws back
const LID = TABLE + PH // underside of the head's upper bar
const REST_X = X(MISS) - 0.14 - GAP // the piece, lying on the wall

const flat = (pts, z = 0) => pts.map(([x, y]) => [x, y, z])
const sum = (c) => c[0] + c[1] + c[2]

// Paint order in layer 0: the rows are set apart by upright planes, so they
// paint from the far row to the near one; in a row, the wall, the piece, the
// tip, the shaft. The head's lower bar and far post come before every row, its
// near post and upper bar after.
const D = (i, part) => (N - 1 - i) * 10 + { wall: 0, mark: 1, piece: 3, tip: 5, shaft: 7, shaftMark: 8 }[part]
const D_UNDER = -10
const D_POST = 80
const D_LID = 90

/** A closed outline through corners, each rounded by its own radius. */
function rounded(pts, r) {
  const n = pts.length
  return pts.flatMap((c, i) => {
    const a = pts[(i + n - 1) % n]
    const b = pts[(i + 1) % n]
    const toward = (q) => {
      const l = Math.hypot(q[0] - c[0], q[1] - c[1])
      return [c[0] + ((q[0] - c[0]) * r[i]) / l, c[1] + ((q[1] - c[1]) * r[i]) / l]
    }
    const p0 = toward(a)
    const p1 = toward(b)
    return Array.from({ length: 7 }, (_, k) => {
      const t = k / 6
      return [0, 1].map((j) => (1 - t) * (1 - t) * p0[j] + 2 * t * (1 - t) * c[j] + t * t * p1[j])
    })
  })
}
const BENCH_SHAPE = rounded(
  [
    [-3.5, -3.4],
    [3.7, -3.4],
    [3.7, -ARM],
    [1.05, -ARM],
    [1.05, ARM],
    [3.7, ARM],
    [3.7, 3.4],
    [-3.5, 3.4],
  ],
  [0.4, 0.22, 0.22, 0.3, 0.3, 0.22, 0.22, 0.4]
)

/** The lap: how far each pin is out, the comb, the light, the piece. */
function lapAt(lap) {
  const ext = []
  for (let i = 0; i < N; i++) {
    const a = 0.04 + i * 0.034
    ext.push(
      i === MISS
        ? keys(lap, [
            [0, 0],
            [a, 0],
            [a + 0.02, 0.07, easeOut],
            [a + 0.045, 0, easeInOut],
            [1, 0],
          ])
        : keys(lap, [
            [0, 0],
            [a, 0],
            [a + 0.05, 1, easeOut],
            [0.925, 1],
            [0.985, 0, easeInOut],
            [1, 0],
          ])
    )
  }
  return {
    ext,
    c: keys(lap, [
      [0, 0],
      [0.25, 0],
      [0.32, 1, easeInOut],
      [0.38, 1],
      [0.46, 0, easeInOut],
      [0.82, 0],
      [0.9, 1, easeInOut],
      [0.94, 1],
      [0.995, 0, easeInOut],
      [1, 0],
    ]),
    lit: keys(lap, [
      [0, 0],
      [0.46, 0],
      [0.49, 1, easeOut],
      [0.815, 1],
      [0.83, 0],
      [1, 0],
    ]),
    m: keys(lap, [
      [0, 0],
      [0.63, 0],
      [0.7, 0.6, easeInOut],
      [0.725, 1, easeIn],
      [0.95, 1],
      [0.955, 0],
      [1, 0],
    ]),
    fade: keys(lap, [
      [0, 1],
      [0.915, 1],
      [0.945, 0],
      [0.96, 0],
      [0.995, 1],
      [1, 1],
    ]),
  }
}

export default figure({
  slug: "12-listening-people-can-feel",
  title: "The copy, held against the original",
  desc: "A comb of five pins is held against a stepped wall of five rows on a light table. Four pins have taken their row's place and their tips glow teal where they meet the wall. One pin stayed back: light shows through the gap in front of it, magenta, and a magenta piece of the gap's exact size lies on the wall behind it.",
  plate: "Listening people can feel",
  sentence:
    "The viewer sees a comb take the shape of a wall, go away with it, and only when it is brought back and held against the wall show light through one gap, into which the wall's own missing piece drops, which explains the read-back: people know they were heard when your copy comes back to them and they can correct the one thing you missed.",
  view: { scale: 37, origin: [280, 229] },
  still: 5.7,
  build(k) {
    const put = (part, d) => {
      part.bias = part.rest.bias = d - sum(geometry(part, k.groups).centre)
      return part
    }
    k.grid("board", { at: [-4.9, -4.9, 0], size: [9.8, 9.8], step: 0.7 })
    // The bench: a table with two arms the comb rides on.
    k.extrude("bench", { at: [0, 0, BENCH], face: "+z", shape: BENCH_SHAPE.map(([x, y]) => [x, -y]), depth: BENCH, layer: -2 })
    for (const [j, y] of [-3.07, 3.07].entries()) k.detail(`groove${j}`, { pts: [[1.1, y, BENCH + 0.002], [2, y, BENCH + 0.002], [3.5, y, BENCH + 0.002]], layer: -1.9 })
    k.detail("benchSeam", { pts: [[-3.1, 3.4, 0.14], [0, 3.4, 0.14], [3.4, 3.4, 0.14]], layer: -1.9 })

    // The light plate, with a window under each row from the wall to where the tips wait.
    k.block("plate", { at: [-3.1, -2.98, BENCH], size: [4.0, 5.96, TABLE - BENCH], r: 0.12, layer: -1 })
    k.halo("under", { at: [(X(MISS) + BLANK) / 2, Y(MISS), TABLE + 0.004], r: 1.9, on: 1, layer: -0.8 })
    for (let i = 0; i < N; i++)
      k.face(`win${i}`, { pts: flat(rrect(X(i) + 0.02, Y(i) - 0.36, BLANK - 0.04, Y(i) + 0.36, 0.06), TABLE + 0.004), role: "recess", layer: -0.7 })

    // The wall: five rows, each with its line.
    for (let i = 0; i < N; i++) {
      put(k.block(`wall${i}`, { at: [BACK, Y(i) - P / 2 + 0.015, TABLE], size: [X(i) - BACK, P - 0.03, WALL - TABLE], r: 0.05 }), D(i, "wall"))
      if (i !== MISS) put(k.detail(`line${i}`, { pts: [[BACK + 0.25, Y(i), WALL], [(BACK + X(i)) / 2, Y(i), WALL], [X(i) - 0.25, Y(i), WALL]] }), D(i, "mark"))
    }
    // The piece the copy will miss, lying on its row of the wall.
    put(k.block("piece", { at: [REST_X, Y(MISS) - W / 2, WALL], size: [GAP, W, PH], r: 0.08 }), D(MISS, "piece"))
    put(k.detail("pieceLine", { pts: [[REST_X + 0.2, Y(MISS), WALL + PH], [REST_X + GAP / 2, Y(MISS), WALL + PH], [REST_X + GAP - 0.2, Y(MISS), WALL + PH]] }), D(MISS, "piece") + 0.5)

    // The comb: a head of two bars, and seven pins that slide between them.
    k.group("comb", { at: [0, 0, 0] })
    put(k.block("sole", { at: [HX0, -ARM - 0.02, 0.3], size: [HX1 - HX0, 2 * ARM + 0.04, TABLE - 0.3], r: 0.06, parent: "comb" }), D_UNDER)
    put(k.block("postF", { at: [HX0, -HY, BENCH], size: [HX1 - HX0, HY - ARM, LID - BENCH], r: 0.12, parent: "comb" }), D_UNDER + 1)
    for (let i = 0; i < N; i++) {
      k.group(`pin${i}`, { at: [0, 0, 0], parent: "comb" })
      put(k.block(`tip${i}`, { at: [BLANK, Y(i) - W / 2, TABLE], size: [TIP, W, PH], r: 0.07, parent: `pin${i}` }), D(i, "tip"))
      put(k.block(`shaft${i}`, { at: [BLANK + TIP, Y(i) - W / 2, TABLE], size: [PIN - TIP, W, PH], r: 0.07, parent: `pin${i}` }), D(i, "shaft"))
      put(k.detail(`rule${i}`, { pts: [[BLANK + PIN - 0.8, Y(i), LID], [BLANK + PIN - 0.45, Y(i), LID], [BLANK + PIN - 0.18, Y(i), LID]], parent: `pin${i}` }), D(i, "shaftMark"))
    }
    put(k.block("postN", { at: [HX0, ARM, BENCH], size: [HX1 - HX0, HY - ARM, LID - BENCH], r: 0.12, parent: "comb" }), D_POST)
    put(k.block("lid", { at: [HX0, -HY, LID], size: [HX1 - HX0, 2 * HY, 0.22], r: 0.16, parent: "comb" }), D_LID)
    for (let i = 0; i < N; i++) put(k.cyl(`screwp${i}`, { at: [(HX0 + HX1) / 2, Y(i), LID + 0.22], radius: 0.14, h: 0.1, n: 24, parent: "comb" }), D_LID + 1 + (N - i) * 0.1)
  },
  tick(t, s, input) {
    const { p, groups } = s
    const lap = cycle(t, T)
    const lp = lapAt(lap)

    // The pointer holds the comb: its place along the pins, on the table's plane.
    const aim = input.onPlane ? input.onPlane(TABLE) : null
    const over = !!aim && aim[0] > -3.9 && aim[0] < 5.3 && Math.abs(aim[1]) < HY + 0.6
    let zone = null
    if (over) zone = aim[0] > 2.1 ? "away" : aim[0] > X(MISS) + 0.1 ? "back" : "correct"
    const w = input.tween("w", over ? 1 : 0, { dur: 0.6 })
    const c1 = clamp(input.spring("c", zone === null ? lp.c : zone === "away" ? clamp((aim[0] - 2.1) / 1.2) : 0))
    // The piece moves only while the copy is held against the wall.
    if (!input.still) {
      if (zone === null) {
        if (w < 0.02) s.in = lp.m > 0.5 // until it has handed back, the piece stays where the reader left it
      }
      else if (c1 < 0.04 && zone !== "away") s.in = zone === "correct"
    } else if (zone !== null) s.in = zone === "correct"
    const m1 = input.tween("m", s.in ? 1 : 0, { dur: 0.8 })

    const c = lerp(lp.c, c1, w)
    const m = lerp(lp.m, m1, w)
    const lit = lerp(lp.lit, c1 < 0.05 && zone !== "away" ? clamp(1 - c1 / 0.05) : 0, w)
    const fade = lerp(lp.fade, 1, w) * (Math.abs(lp.m - m1) > 0.05 ? 1 - 4 * w * (1 - w) : 1)

    groups.comb.off[0] = AWAY * c
    for (let i = 0; i < N; i++) {
      const out = lerp(lp.ext[i], i === MISS ? 0 : 1, w)
      groups[`pin${i}`].off[0] = (X(i) - BLANK) * out
      const meets = i !== MISS && out > 0.98 && c < 0.04
      p[`tip${i}`].on = meets && lit > 0.4 ? 2 : 0
      p[`tip${i}`].glow = meets ? 0.22 * lit : 0
      p[`win${i}`].on = lit > 0.4 ? 1 : 0
    }

    // The piece: out over the gap, down into it, and then it goes with the comb.
    const place = (mm, cc) => ({
      dx: (X(MISS) - REST_X) * clamp(mm / 0.6) + (mm > 0.95 ? AWAY * cc : 0),
      drop: clamp((mm - 0.6) / 0.4),
    })
    const A = place(lp.m, lp.c)
    const B = place(m1, c1)
    const dx = lerp(A.dx, B.dx, w)
    const drop = lerp(A.drop, B.drop, w)
    for (const id of ["piece", "pieceLine"]) {
      p[id].off[0] = dx
      p[id].off[2] = -(WALL - TABLE) * drop
      p[id].fade = fade
      p[id].hide = fade < 0.02
      p[id].on = lit > 0.4 || m > 0.02 ? 1 : 0
    }
    p.piece.bias = D(MISS, "piece") - sum(geometry(p.piece, groups).centre)
    p.pieceLine.bias = D(MISS, "piece") + 0.5 - sum(geometry(p.pieceLine, groups).centre)
    p.piece.glow = p.piece.on ? (0.2 + 0.25 * Math.max(lit, drop)) * fade : 0
    const open = lit * (1 - drop)
    p[`win${MISS}`].glow = 0.55 * open
    p.under.glow = 0.9 * open

    // Every pin keeps its row's place in the paint order as it slides.
    for (let i = 0; i < N; i++)
      for (const [id, part] of [
        [`tip${i}`, "tip"],
        [`shaft${i}`, "shaft"],
        [`rule${i}`, "shaftMark"],
      ])
        p[id].bias = D(i, part) - sum(geometry(p[id], groups).centre)
    const keep = (id, d) => (p[id].bias = d - sum(geometry(p[id], groups).centre))
    keep("sole", D_UNDER)
    keep("postF", D_UNDER + 1)
    keep("postN", D_POST)
    keep("lid", D_LID)
    for (let i = 0; i < N; i++) keep(`screwp${i}`, D_LID + 1 + (N - i) * 0.1)

    s.state =
      w > 0.5
        ? zone === "away" || c > 0.1
          ? m > 0.9
            ? "corrected"
            : "on trust"
          : m > 0.9
            ? "corrected"
            : m > 0.05
              ? "correction"
              : "read back: 1 gap"
        : lap < 0.04
          ? "rest"
          : lap < 0.25
            ? "being told"
            : lap < 0.38
              ? "on trust"
              : lap < 0.46
                ? "read back"
                : lap < 0.63
                  ? "1 gap"
                  : lap < 0.725
                    ? "correction"
                    : lap < 0.92
                      ? "corrected"
                      : "rest"
  },
  readout: (s) => s.state || "rest",
})
