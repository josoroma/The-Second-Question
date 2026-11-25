// Chapter 3, Who is listening: three lines, then one question.
//
// A round plate is scored across the middle: your side of the table in front,
// the listener's behind. Three sighting lamps draw the listener sketch, one
// line each, and all three stand on your side. The first stands on the axis,
// and its line runs straight across the score to a lantern on the far side:
// what has reached the listener does reach them. The lines of the other two,
// which flank it, are dashed drafts. All three cross on your side, inside an
// empty dashed outline (the listener as the sketch imagined them), and run on
// past it, because nothing there stops them. The question, the cube, leaves
// the first lamp along its line, passes straight through the outline and
// reaches the lantern, which lights: the reply, held a moment (the still).
// Then the two drafted lines swing across the score onto the lantern, end
// there, and turn solid.
//
// Each line is exactly as long as its lamp's reach to the lantern's glass.
// The outline and the lantern are mirror images across the score: the guess
// is the listener drawn from your side of the table.
//
// The machine is laid on the world's diagonals, so the axis runs straight up
// the page and the score straight across it. Positions are given in (u, v): u
// along the axis, toward the viewer; v along the score, to the right. The
// plate is round, so no straight edge of it runs beside a line.
//
// Light: teal is the sketch (the line that reaches them from the start, the two
// drafts, and all three once checked); magenta is the question and the reply it
// brings back. At rest only the three lines and the lantern glow.
//
// The pointer asks. On their side of the score (the lantern included) the
// question goes out and the lines follow the reply; back on your side, the
// sketch returns to its guess the way the loop does: the lines swing back, the
// light goes out, the question reappears on its lamp. A reply never travels
// back out of the lantern.

import { breathe, clamp, cycle, easeIn, easeInOut, easeOut, figure, lerp, ring } from "../lib/iso/core.js"

const DEG = Math.PI / 180
const R2 = Math.SQRT2
const T = 10 // seconds per lap

/** World [x, y] of a point u along the axis (toward the viewer) and v along the score (to the right). */
const uv = (u, v) => [(u + v) / R2, (u - v) / R2]

// A lamp: footing, pedestal, and a head that turns on it.
const FOOT_R = 0.52
const FOOT_H = 0.08
const PED_R = 0.4
const PED_H = 0.44
const HL = 0.74
const HW = 0.6
const HH = 0.42
const NOSE = HL / 2 // from a lamp's pivot to its lens
const LENS = 0.13
const ZB = PED_H + HH / 2 // height of the lines: the lenses and the middle of the lantern's glass

// Along the axis the parts stand one behind another on the page, so they are
// spaced to clear: the outline's top below the lantern's foot, the first
// lamp's head below the outline's foot.
const A = 1.35 // the outline and the lantern stand this far either side of the score
const KU = 3.5 // the first lamp, on the axis, on your side
const DU = 1.9 // the two flanking lamps, on your side too...
const B = 2.0 // ...this far either side of the axis
const K = uv(KU, 0)
const D = uv(DU, -B)
const L = uv(DU, B)
const G = uv(A, 0) // where the sketch puts the listener: your side
const R = uv(-A, 0) // where the listener is: theirs

// The plate: a disc on the axis. Its back rim lies far enough behind the
// lantern that, on the page, it clears the raised ends of the lines.
// The back rim crosses the lantern's glass about halfway up, clear of the
// line ends below and of the cap above.
const PU = 0.97
const PC = uv(PU, 0)
const PRAD = 3.3

// The lantern: base, glass, cap, finial. The lines stop on the glass.
const RB = 0.5
const RR = 0.41
const R_FOOT = 0.6
const R_BASE = 0.34
const R_TOP = 2 * ZB - R_BASE // the glass is centred on the lines
const R_CAP = 0.15
const R_FIN = 0.2

// The question travels the axis: s is its place along u.
const Q = 0.38
const Z_ON = PED_H + HH + Q / 2 // resting on the first lamp
// The cube sits square to the world, so along the axis it reaches a corner, Q / sqrt 2.
const S_OUT = KU - NOSE - Q / R2 - 0.03 // on its line, just off the lens
const S_AT = -A + RR + Q / R2 // touching the lantern's glass
const S_IN = -A + 0.14 // taken in

const bearing = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]) / DEG
const near = (a, b) => a + ((((b - a) % 360) + 540) % 360) - 180 // b, within half a turn of a
const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1])
const D_G = bearing(D, G)
const D_R = near(D_G, bearing(D, R))
const L_G = bearing(L, G)
const L_R = near(L_G, bearing(L, R))
const K_R = bearing(K, R)
const LEN_S = dist(D, R) - NOSE - RR // the flanking lamps' reach to the glass (L mirrors D)
const LEN_K = dist(K, R) - NOSE - RR

// Paint order (depth is x + y + z of a part's centre, of a line's middle point).
// The first line ends on the near side of the lantern's glass, so it sorts
// after the glass; the question rides it, so the line sorts before the
// question wherever the question is. Mullions sort between the glass and the cap.
const GLASS_D = R[0] + R[1] + (R_BASE + R_TOP) / 2
const CAP_D = R[0] + R[1] + R_TOP + R_CAP / 2
const K_MID = KU - NOSE - LEN_K / 2 // along the axis
const K_BIAS = (GLASS_D + (S_IN * R2 + ZB)) / 2 - (K_MID * R2 + ZB)
// The drafts cross the question's path inside the outline: there they sort
// just before the question (and the outline), so the cube hides them.
const DRAFT_MID = (() => {
  const d = dist(D, G)
  const k = (NOSE + LEN_S / 2) / d
  return D[0] + (G[0] - D[0]) * k + D[1] + (G[1] - D[1]) * k + ZB
})()
const DRAFT_BIAS = Math.min(A * R2 + ZB, G[0] + G[1] + (R_TOP + R_CAP) / 2) - 0.12 - DRAFT_MID

// The sequence, as x runs from 0 (the guess) to 1 (checked).
const X_HOP = 0.06 // off the lamp onto its line
const X_AT = 0.42 // at the lantern
const X_IN = 0.47 // taken in
const X_LIT = 0.5 // the lantern is fully lit: the reply, held a moment
const X_SW0 = 0.6 // the drafted lines start to swing
const X_SW1 = 0.88 // ...and land on the lantern
const X_SET = 0.94 // solid

// The lap.
const GO = 0.08 // the question leaves
const DONE = 0.66 // the lines are on the lantern
const HOLD = 0.88 // the light goes out
const AGAIN = 0.97 // back at the guess

// Under the pointer, the whole sequence takes AHEAD seconds; going back, BACK.
const AHEAD = 3.4
const BACK = 1.7

const flat = (pts, z = 0) => pts.map(([x, y]) => [x, y, z])
const closed = (pts) => [...pts, pts[0]]
const line = (len) => [
  [NOSE, 0, ZB],
  [NOSE + len / 2, 0, ZB],
  [NOSE + len, 0, ZB],
]

/** Where everything stands at x through the sequence. */
function seq(x) {
  let s
  let z
  if (x <= X_HOP) {
    // Forward first, then down onto the line, so it clears the lamp's head;
    // a low arc, so the hop stays one short move below the outline.
    const f = x / X_HOP
    s = lerp(KU, S_OUT, easeOut(f))
    z = lerp(Z_ON, ZB, easeIn(f)) + 0.05 * 4 * f * (1 - f)
  } else if (x <= X_AT) {
    s = lerp(S_OUT, S_AT, easeInOut((x - X_HOP) / (X_AT - X_HOP)))
    z = ZB
  } else {
    s = lerp(S_AT, S_IN, easeOut(clamp((x - X_AT) / (X_IN - X_AT))))
    z = ZB
  }
  return {
    s,
    z,
    fade: 1 - clamp((x - X_AT) / (X_IN - X_AT)),
    heard: clamp((x - X_AT) / (X_LIT - X_AT)),
    swing: easeInOut(clamp((x - X_SW0) / (X_SW1 - X_SW0))),
    solid: clamp((x - X_SW1) / (X_SET - X_SW1)),
  }
}

/**
 * The way back to the guess, r from 0 to 1, from where the sequence stood
 * (v0): the lines swing back and go dashed, the light goes out, and the
 * question appears on the first lamp again. It never travels back out of the
 * lantern: a reply is not taken back.
 */
function back(r, v0) {
  const early = r < 0.15 && v0.fade > 0.02 // a question just taken in finishes fading where it is
  return {
    s: early ? v0.s : KU,
    z: early ? v0.z : Z_ON,
    fade: early ? v0.fade * (1 - r / 0.15) : clamp((r - 0.55) / 0.45),
    heard: v0.heard * (1 - clamp(r / 0.4)),
    swing: v0.swing * (1 - easeInOut(clamp((r - 0.1) / 0.65))),
    solid: v0.solid * (1 - clamp(r / 0.2)),
  }
}

/** The lap without a pointer: the sequence, a hold, then the light goes out and the guess comes back. */
function loopState(lap) {
  if (lap < HOLD) {
    const x = clamp((lap - GO) / (DONE - GO))
    return { x, r: null, ...seq(x) }
  }
  const r = (lap - HOLD) / (AGAIN - HOLD)
  return { x: 1, r: clamp(r), ...back(clamp(r), seq(1)) }
}

export default figure({
  slug: "03-who-is-listening",
  title: "Three lines, then one question",
  desc: "A round plate is scored across the middle. Three sighting lamps stand on the near side. One aims a solid line across the score at a lantern, which glows: a question sent along that line has just reached it. The other two lines are still dashed drafts, crossing on the near side inside an empty dashed outline of the lantern, where the sketch imagined the listener.",
  plate: "Who is listening",
  sentence:
    "The viewer sees one question run along the line that already reaches across the table, pass through the empty outline where the two drafted lines cross, and light the lantern on the far side, and then the drafted lines swing over and end on it, which explains the listener sketch: three lines about one person are drawn from your side of the table, and one question checks them.",
  view: { scale: 52, origin: [280, 192] },
  still: 4.0, // the reply: the lantern lit, the drafts still crossing in the empty outline
  build(k) {
    k.grid("board", { at: [PC[0] - 4, PC[1] - 4, -0.32], size: [8, 8], step: 0.7 })
    k.cyl("base", { at: [PC[0], PC[1], -0.32], radius: PRAD, h: 0.32, n: 128, layer: -3 })
    k.detail("lip", { at: [PC[0], PC[1], 0], pts: flat(closed(ring(0, 0, PRAD - 0.22, 128))), layer: -2 })
    // Two screws, either side of the first lamp.
    ;[30, 330].forEach((a, j) => {
      const [x, y] = uv(PU + (PRAD - 0.5) * Math.cos(a * DEG), (PRAD - 0.5) * Math.sin(a * DEG))
      k.led(`screw${j}`, { at: [x, y, 0], face: "+z", r: 0.08, layer: -2 })
    })

    // The score across the middle, rim to rim: your side of the table in front, theirs behind.
    const sv = Math.sqrt((PRAD - 0.22) ** 2 - PU * PU) - 0.3 // where it meets the lip, less a margin
    k.face("score", { pts: [uv(-0.08, -sv), uv(-0.08, sv), uv(0.08, sv), uv(0.08, -sv)].map(([x, y]) => [x, y, 0.002]), role: "recess", layer: -2 })

    // Light on the plate: under the question, and round the lantern when it answers.
    k.halo("qspill", { at: [K[0], K[1], 0], r: 0.9, on: 1, layer: -1 })
    k.halo("spill", { at: [R[0], R[1], 0], r: 1.45, on: 1, layer: -1 })

    // The listener as the sketch imagined them: an outline of the lantern, on your side.
    k.cyl("imagined", { at: [G[0], G[1], 0], radius: RB, h: R_TOP + R_CAP, role: "ghost" })
    k.cyl("imaginedTip", { at: [G[0], G[1], R_TOP + R_CAP], radius: 0.1, h: R_FIN, role: "ghost" })

    // The listener: a lantern on their side. Its glass is dark until it answers;
    // a lit twin of the glass takes over then.
    k.cyl("rfoot", { at: [R[0], R[1], 0], radius: R_FOOT, h: FOOT_H })
    k.cyl("rbase", { at: [R[0], R[1], FOOT_H], radius: RB, h: R_BASE - FOOT_H })
    k.cyl("glass", { at: [R[0], R[1], R_BASE], radius: RR, h: R_TOP - R_BASE, role: "glass" })
    k.cyl("lamp", { at: [R[0], R[1], R_BASE], radius: RR, h: R_TOP - R_BASE, hide: true, bias: 0.01 })
    k.cyl("cap", { at: [R[0], R[1], R_TOP], radius: RB, h: R_CAP })
    k.cyl("finial", { at: [R[0], R[1], R_TOP + R_CAP], radius: 0.1, h: R_FIN })
    // Mullions on the glass, on the side that faces the view.
    ;[0, 45, 90].forEach((a, j) => {
      const c = RR * Math.cos(a * DEG)
      const s = RR * Math.sin(a * DEG)
      k.detail(`mull${j}`, {
        at: [R[0], R[1], 0],
        pts: [
          [c, s, R_BASE + 0.03],
          [c, s, ZB],
          [c, s, R_TOP - 0.03],
        ],
        bias: (GLASS_D + CAP_D) / 2 - (R[0] + R[1] + c + s + ZB),
      })
    })

    // Three lamps, one line each. Each head turns on its pedestal about the pivot.
    const lamp = (id, [x, y]) => {
      k.cyl(`foot${id}`, { at: [x, y, 0], radius: FOOT_R, h: FOOT_H })
      k.cyl(`ped${id}`, { at: [x, y, FOOT_H], radius: PED_R, h: PED_H - FOOT_H })
      k.group(`h${id}`, { at: [x, y, 0] })
      k.block(`head${id}`, { at: [-HL / 2, -HW / 2, PED_H], size: [HL, HW, HH], r: 0.15, parent: `h${id}` })
      k.face(`lens${id}`, { pts: ring(0, 0, LENS, 28).map(([u, v]) => [NOSE + 0.004, u, ZB + v]), role: "glass", parent: `h${id}` })
      const zt = PED_H + HH + 0.002
      k.detail(`sight${id}`, {
        pts: [
          [-HL / 2 + 0.16, 0, zt],
          [0, 0, zt],
          [HL / 2 - 0.12, 0, zt],
        ],
        parent: `h${id}`,
      })
      // Every lamp aims away from the viewer, so the back of its head shows: two vents.
      for (const [j, dz] of [-0.06, 0.06].entries())
        k.detail(`vent${id}${j}`, {
          pts: [
            [-HL / 2 - 0.003, -0.15, ZB + dz],
            [-HL / 2 - 0.003, 0, ZB + dz],
            [-HL / 2 - 0.003, 0.15, ZB + dz],
          ],
          parent: `h${id}`,
        })
    }
    lamp("K", K)
    lamp("D", D)
    lamp("L", L)

    // The line that reaches them: solid from the start. It sorts after the
    // lantern's glass (it ends on the glass's near side) and before the question.
    k.wire("beamK", { pts: line(LEN_K), on: 2, parent: "hK", layer: 0, bias: K_BIAS })
    // The two drafted lines, dashed; each has a solid twin that takes over once checked.
    for (const id of ["D", "L"]) {
      k.wire(`draft${id}`, { pts: line(LEN_S), on: 2, dash: true, parent: `h${id}`, layer: 0, bias: DRAFT_BIAS })
      k.wire(`beam${id}`, { pts: line(LEN_S), on: 2, parent: `h${id}`, layer: 0, hide: true })
    }

    // The question.
    k.group("q", { at: [0, 0, 0] })
    k.block("cube", { at: [-Q / 2, -Q / 2, -Q / 2], size: [Q, Q, Q], r: 0.09, role: "accent", parent: "q" })
  },
  tick(t, s, input) {
    const { p, groups } = s
    const lp = loopState(cycle(t, T))

    // The pointer asks. It is read on the plate's own plane (fixed, so nothing
    // flickers): on their side of the score the question goes out, on your side
    // the sketch stays a guess. A narrow band over the score keeps the last choice.
    // The lantern stands up out of the plate, so its screen footprint (glass,
    // cap and finial, which meet the plate's plane further back) counts as their side.
    const aim = input.onPlane ? input.onPlane(0) : null
    const au = aim ? (aim[0] + aim[1]) / R2 : 0
    const av = aim ? (aim[0] - aim[1]) / R2 : 0
    const over = !!aim && (Math.hypot(aim[0] - PC[0], aim[1] - PC[1]) < PRAD + 0.3 || (au < -0.3 && au > -3.8 && Math.abs(av) < 0.9))
    let want = 0
    if (over) {
      want = au < -0.3 ? 1 : au > 0.3 ? 0 : (s.want ?? 0)
      if (!input.still) s.want = want
    }
    // The reader's weight comes in briskly and lets go gently, back to the lap.
    const w = clamp(input.spring("w", over ? 1 : 0, over ? { k: 90, c: 19 } : { k: 30, c: 11 }))
    let pp
    if (input.still) pp = seq(over ? want : lp.x)
    else {
      const dt = input.dt || 0
      if (s.x === undefined || (!over && w < 0.02)) {
        s.x = lp.x
        s.r = lp.r
        s.v0 = lp.r === null ? null : seq(1)
      } else if (over) {
        if (s.r !== null) {
          // On the way back: finish it (quicker if the reader asks again), then start from the guess.
          s.r += dt / (want ? BACK / 2 : BACK)
          if (s.r >= 1) {
            s.r = null
            s.v0 = null
            s.x = 0
          }
        } else if (want === 0 && s.x >= X_AT) {
          // Back on your side after the reply: the loop's own return, not the sequence run backward.
          s.r = 0
          s.v0 = seq(s.x)
        } else s.x += clamp(want - s.x, -dt / BACK, dt / AHEAD)
      }
      pp = s.r !== null ? back(clamp(s.r), s.v0) : seq(s.x)
    }
    const v = {}
    for (const key of ["s", "z", "fade", "heard", "swing", "solid"]) v[key] = lerp(lp[key], pp[key], w)

    // The lamps: the first holds its aim; the two drafted lines swing across the score.
    groups.hK.rz = K_R
    groups.hD.rz = lerp(D_G, D_R, v.swing)
    groups.hL.rz = lerp(L_G, L_R, v.swing)
    for (const id of ["D", "L"]) {
      p[`beam${id}`].hide = v.solid < 0.02
      p[`beam${id}`].fade = v.solid
      // Pulses run at one speed on every line: period and size scale with length.
      p[`beam${id}`].flow = v.solid > 0.6 ? { period: (2.4 * LEN_S) / LEN_K, size: (6 * LEN_K) / LEN_S } : null
      p[`draft${id}`].hide = v.solid > 0.98
      p[`draft${id}`].fade = 1 - v.solid
      p[`lens${id}`].on = 2
    }
    p.lensK.on = 2
    p.beamK.flow = v.solid > 0.6 ? { period: 2.4, size: 6 } : null

    // The lantern answers: the reply.
    const heard = v.heard > 0.02
    p.lamp.hide = !heard
    p.lamp.on = 1
    p.lamp.fade = v.heard
    p.lamp.glow = heard ? 0.12 + 0.4 * v.heard : 0
    p.glass.hide = v.heard > 0.98
    for (let j = 0; j < 3; j++) p[`mull${j}`].on = v.heard > 0.5 ? 1 : 0
    p.spill.glow = 0.85 * v.heard

    // The question.
    const [qx, qy] = uv(v.s, 0)
    groups.q.off[0] = qx
    groups.q.off[1] = qy
    groups.q.off[2] = v.z
    p.cube.hide = v.fade < 0.02
    p.cube.fade = v.fade
    p.cube.glow = (input.still ? 0.42 : 0.3 + 0.18 * breathe(t, 2.4)) * v.fade
    p.qspill.at[0] = qx
    p.qspill.at[1] = qy
    p.qspill.glow = 0.6 * v.fade

    s.state = v.solid > 0.5 ? "checked" : v.heard > 0.05 ? "reply" : v.fade > 0.5 && v.s < KU - 0.05 ? "asking" : "guess"
    // On your side, under the pointer, whatever is still moving is going back to the guess.
    if (!input.still && over && want === 0 && w > 0.5) s.state = "guess"
  },
  readout: (s) => s.state || "rest",
})
