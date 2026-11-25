// Chapter 2, Know what you think: from pile to point.
//
// Eight equal slats, the lines of the pile, are threaded on one post and lie
// stacked along one arm of a quarter-round plate. Every line is true and every
// one looks like the others. At the end of the other arm stands the question:
// a mast with a reading head. The head reads the pile from the top down, one
// line at a time. A line that does not answer only nods toward it and settles
// back; a line that answers turns a quarter turn about the post, across to
// the question, and lights. Three of the eight answer. Until then the point's
// place above the question is only a dashed outline; now the point comes down
// into it, pinned on the end of the same post, over the three lines it rests
// on, and glows. The pile stays on the post under it.
//
// Light: the point is magenta (the decision, the one sentence). The three
// lines that answer are teal (what the point rests on). At rest only those
// glow.
//
// The pointer holds a line up to the question: point at a line (or at a height
// on the head or the mast) and the head goes there. Once the head has reached
// it, a line that answers turns across and stays; one that does not leans
// toward the question and stays in the pile. Once all three are across, the
// point comes down. The pointer is tested against fixed slots, one per line,
// that change only with which answers have been found, never with the pose.

import { arc, breathe, clamp, cycle, easeIn, easeInOut, easeOut, figure, keys, lerp } from "../lib/iso/core.js"

const N = 8 // lines in the pile
const ANS = [6, 4, 1] // the lines that answer the question, counted from the bottom
const isAns = (k) => ANS.includes(k)

const L0 = -0.5 // a slat runs from behind the post...
const L1 = 3.1 // ...to its tip, along its arm
const W = 1.1 // a slat's width
const TH = 0.16 // and thickness
const PITCH = 0.33
const Z0 = 0.42 // the lowest slat's underside
const zOf = (k) => Z0 + k * PITCH
const TOP = zOf(N - 1) + TH // top of the pile
const SEAT = TOP + 0.26 // the point sits on the end of the post, this high
const PT_TH = 0.22
const POST_R = 0.15
const CX = 3.45 // the question's mast stands just behind the end of the answers' arm...
const CY = -0.62
const COL_R = 0.12
const COL_TOP = TOP + 0.08
const HEAD_H = 0.28 // ...and its reading head runs up and down in front of it, facing the tips
const HX0 = L1 + 0.03
const HX1 = CX + 0.26
const HY0 = CY + COL_R
const HY1 = 0.46
const readZ = (k) => zOf(k) + TH / 2 // the head's centre while it reads line k
const OUT = -90 // an answer turns from the pile's arm (+y) to the question's (+x)
const NUDGE = -9 // a line that does not answer only leans toward the question
const DROP = 0.6 // the point comes down this far
const PT_END = 2.6 // the point is shorter than a line: the answer under it shows past its end

// The lap, in seconds.
const T = 10
const MOVE = 0.12 // the head steps from line to line
const DWELL_NO = 0.3
const DWELL_YES = 0.62
const SWING = 0.5
const READ0 = 0.6
const READS = []
{
  let t = READ0
  for (let k = N - 1; k >= 0; k--) {
    if (k < N - 1) t += MOVE
    const dwell = isAns(k) ? DWELL_YES : DWELL_NO
    READS.push({ k, t, leave: t + dwell })
    t += dwell
  }
}
const READ_END = READS[READS.length - 1].leave // 4.8
const BACK = 0.6 // the head returns to the top
const LAND0 = READ_END + BACK + 0.05
const LAND1 = LAND0 + 0.5
const LIFT0 = 8.6
const LIFT1 = 9.0
const RET = { 6: 8.95, 4: 9.27, 1: 9.59 } // the answers turn back into the pile, one at a time
const RET_DUR = 0.32

const HEAD_FRAMES = [[0, readZ(N - 1)]]
READS.forEach((r, i) => {
  if (i === 0) HEAD_FRAMES.push([r.t, readZ(r.k)])
  else {
    HEAD_FRAMES.push([r.t - MOVE, readZ(READS[i - 1].k)])
    HEAD_FRAMES.push([r.t, readZ(r.k), easeInOut])
  }
})
HEAD_FRAMES.push([READ_END, readZ(0)], [READ_END + BACK, readZ(N - 1), easeInOut], [T, readZ(N - 1)])

/** The lap without a pointer, as a function of time in the lap. */
function loopAt(lt) {
  const ang = new Array(N).fill(0)
  const out = new Array(N).fill(0)
  let reading = null
  for (const r of READS) {
    if (isAns(r.k)) {
      out[r.k] = keys(lt, [
        [r.t + 0.06, 0],
        [r.t + 0.06 + SWING, 1, easeInOut],
        [RET[r.k], 1],
        [RET[r.k] + RET_DUR, 0, easeInOut],
      ])
      ang[r.k] = OUT * out[r.k]
    } else {
      ang[r.k] =
        NUDGE *
        keys(lt, [
          [r.t, 0],
          [r.t + 0.09, 1, easeOut],
          [r.t + 0.27, 0, easeInOut],
        ])
    }
    if (lt >= r.t - MOVE / 2 && lt < r.leave + MOVE / 2) reading = r.k
  }
  const land = keys(lt, [
    [LAND0, 0],
    [LAND1, 1, easeOut],
    [LIFT0, 1],
    [LIFT1, 0, easeIn],
  ])
  const lit = keys(lt, [
    [LAND1 - 0.08, 0],
    [LAND1 + 0.22, 1, easeOut],
    [LIFT0, 1],
    [LIFT0 + 0.14, 0],
  ])
  const head = keys(lt, HEAD_FRAMES)
  let state = "pile"
  if (reading !== null) state = `line ${N - reading} · ${isAns(reading) ? "yes" : "no"}`
  else if (lt >= READ_END && lt < LAND1) state = "3 of 8"
  else if (lt >= LAND1 && lt < LIFT1) state = "point"
  return { ang, out, head, land, lit, state }
}

/** The pointer's ray, from where it meets two fixed planes; null when there is no pointer. */
function ray(input) {
  if (!input.onPlane) return null
  const a = input.onPlane(0)
  const b = input.onPlane(1)
  if (!a || !b) return null
  // Going up the ray (dz = 1) goes toward the camera, in the iso view and in 3D.
  return { a, d: [b[0] - a[0], b[1] - a[1], 1] }
}

/** Where the ray first meets a box [[x0, x1], [y0, y1], [z0, z1]] seen from the camera: its height there, or null. */
function enter(r, box) {
  let t0 = -Infinity
  let t1 = Infinity
  for (let i = 0; i < 3; i++) {
    const o = r.a[i]
    const dd = r.d[i]
    const [lo, hi] = box[i]
    if (Math.abs(dd) < 1e-9) {
      if (o < lo || o > hi) return null
      continue
    }
    let ta = (lo - o) / dd
    let tb = (hi - o) / dd
    if (ta > tb) [ta, tb] = [tb, ta]
    t0 = Math.max(t0, ta)
    t1 = Math.min(t1, tb)
    if (t0 > t1) return null
  }
  return t1 // the camera lies up the ray: the largest parameter is the nearest face
}

// Each line's slot: the box it fills in the pile, and the box it fills across
// at the question. Bands are a full pitch tall, so the slots stack without gaps.
const band = (k) => [zOf(k) - (PITCH - TH) / 2, zOf(k) + TH + (PITCH - TH) / 2]
const pileSlot = (k) => [[-W / 2, W / 2], [L0, L1], band(k)]
const acrossSlot = (k) => [[L0, L1], [-W / 2, W / 2], band(k)]
const lineAt = (z) => (z < Z0 - 0.45 || z > TOP + 0.6 ? null : clamp(Math.round((z - Z0 - TH / 2) / PITCH), 0, N - 1))

// The head's whole run, and the mast: fixed columns. Where the ray enters one
// is where the head would stand under the pointer, so pointing there brings the
// head to the pointer and it stays.
const headRun = [[HX0, HX1], [HY0, HY1], [Z0 - 0.4, TOP + 0.5]]
const mastRun = [[CX - 0.18, CX + 0.18], [CY - 0.18, CY + 0.18], [0, COL_TOP + 0.08]]

/**
 * The line the pointer holds up to the question. The ray is tested against
 * fixed slots, nearest the camera first: each line's pile slot while it is in
 * the pile, its slot across while it has been found. The held line keeps both
 * of its slots, so the pick does not jump when that line swings away. The
 * slots change only with the found set, never with the moving pose. Off the
 * slots, the head's run and the mast read by height, and so do the long faces
 * of both arms.
 */
function choose(input, found, held) {
  const r = ray(input)
  if (!r) return null
  let best = null
  let bt = -Infinity
  const consider = (k, box) => {
    const t = enter(r, box)
    if (t !== null && t > bt) {
      bt = t
      best = k
    }
  }
  for (let k = 0; k < N; k++) {
    const across = isAns(k) && found.includes(k)
    if (!across || k === held) consider(k, pileSlot(k))
    if (across || (k === held && isAns(k))) consider(k, acrossSlot(k))
  }
  if (best !== null) return best
  const zh = enter(r, headRun) ?? enter(r, mastRun)
  if (zh !== null) return lineAt(zh)
  const { a, d } = r
  const m = [a[0] + d[0] * 1.6, a[1] + d[1] * 1.6]
  const right = m[0] - m[1] > 0
  let z
  let along
  if (!right) {
    if (Math.abs(d[0]) < 1e-6) return null
    z = (W / 2 - a[0]) / d[0]
    along = a[1] + d[1] * z
    if (along < L0 - 0.4 || along > L1 + 0.4) return null
  } else {
    if (Math.abs(d[1]) < 1e-6) return null
    z = (W / 2 - a[1]) / d[1]
    along = a[0] + d[0] * z
    if (along < L0 - 0.4 || along > L1 + 0.4) return null
  }
  return lineAt(z)
}

/** The plate: a quarter disc about the post, rounded behind it. Points [x, y], counterclockwise. */
function fan(R, e, rf) {
  const cx = Math.sqrt((R - rf) ** 2 - (rf - e) ** 2)
  const a1 = (Math.atan2(rf - e, cx) * 180) / Math.PI
  return [
    ...arc(cx, rf - e, rf, -90, a1, 8),
    ...arc(0, 0, R, a1, 90 - a1, 56).slice(1),
    ...arc(rf - e, cx, rf, 90 - a1, 180, 8).slice(1),
    ...arc(0, 0, e, 180, 270, 16),
  ]
}

const LAYER = (k) => 0.1 + k * 0.01 // the pile paints from the bottom up

export default figure({
  slug: "02-know-what-you-think",
  title: "From pile to point",
  desc: "Eight equal slats, the lines of a pile, are threaded on one post. A reading head on a mast, the question, has read them from the top: three lines turned across to it and glow teal, while the rest stay stacked on the post. Above the question, pinned on the end of the post over the three lines it rests on, sits the point: one slat, lit magenta.",
  plate: "Know what you think",
  sentence:
    "The viewer sees a head read down a pile of equal lines, only three of them turn across to it, and only then the point come down above them, which explains knowing what you think: until a question picks the few lines that answer it and you decide one sentence on top of them, you have only material, and the pile stays under the point.",
  view: { scale: 42, origin: [280, 218] },
  still: 6.6,
  build(k) {
    k.grid("board", { at: [-2.7, -2.7, -0.3], size: [7.0, 7.0], step: 0.7 })
    const flip = (pts) => pts.map(([x, y]) => [x, -y])
    k.extrude("base", { at: [0, 0, 0], face: "+z", shape: flip(fan(4.3, 1.0, 0.35)), depth: 0.3, layer: -3 })
    const lip = fan(4.08, 0.8, 0.26)
    k.detail("lip", { pts: [...lip, lip[0]].map(([x, y]) => [x, y, 0.002]), layer: -2 })
    ;[
      [-0.48, 3.62],
      [2.6, 2.6],
      [3.75, 0.55],
    ].forEach(([x, y], j) => k.led(`screw${j}`, { at: [x, y, 0.003], face: "+z", r: 0.08, layer: -2 }))
    // The path a line's tip takes when it answers.
    k.guide("swing", { pts: arc(0, 0, 3.12, 4, 86, 40).map(([x, y]) => [x, y, 0.003]), layer: -2 })

    // Light spilled on the plate under the lines that answer.
    k.halo("spill", { at: [1.7, 0.55, 0], r: 1.75, on: 2, layer: -1 })

    // The post the pile is threaded on.
    k.cyl("boss", { at: [0, 0, 0], radius: 0.42, h: 0.26, layer: 0.0 })
    k.cyl("post", { at: [0, 0, 0.2], radius: POST_R, h: TOP - 0.2, layer: 0.01 })
    k.cyl("postUp", { at: [0, 0, TOP - 0.02], radius: POST_R, h: SEAT - TOP + 0.02, layer: LAYER(N) })
    k.cyl("pin", { at: [0, 0, SEAT - 0.02], radius: 0.07, h: 0.1, layer: LAYER(N) + 0.001 })

    // The pile: eight equal lines on the post.
    for (let i = 0; i < N; i++) {
      k.group(`g${i}`, { at: [0, 0, zOf(i)] })
      k.block(`line${i}`, { at: [-W / 2, L0, 0], size: [W, L1 - L0, TH], r: 0.18, parent: `g${i}`, layer: LAYER(i) })
      k.detail(`rule${i}`, { pts: [[0, 0.4, TH + 0.002], [0, 1.6, TH + 0.002], [0, 2.8, TH + 0.002]], parent: `g${i}`, layer: LAYER(i) + 0.005 })
    }

    // The question: a mast at the end of the answers' arm, and the head that reads.
    k.cyl("foot", { at: [CX, CY, 0], radius: 0.28, h: 0.16, layer: 0.5 })
    k.cyl("mast", { at: [CX, CY, 0.1], radius: COL_R, h: COL_TOP - 0.1, layer: 0.5 })
    k.cyl("cap", { at: [CX, CY, COL_TOP], radius: 0.17, h: 0.07, layer: 0.5 })
    k.group("head", { at: [0, 0, readZ(N - 1)] })
    k.block("reader", { at: [HX0, HY0, -HEAD_H / 2], size: [HX1 - HX0, HY1 - HY0, HEAD_H], r: 0.1, parent: "head", layer: 0.5, bias: 10 })
    // A seam round the two faces of the head that show.
    k.detail("seam", { pts: [[HX0 + 0.1, HY1, 0.02], [HX1 - 0.1, HY1, 0.02], [HX1, HY1 - 0.1, 0.02], [HX1, HY0 + 0.08, 0.02]], parent: "head", layer: 0.5, bias: 10.1 })

    // Where the point will sit, drawn as a dashed outline until it is decided.
    k.block("place", { at: [L0, -0.6, SEAT], size: [PT_END - L0, 1.2, PT_TH], r: 0.2, role: "ghost", layer: 0.6, bias: -1 })

    // The point: one line, decided, on the end of the post.
    k.group("pt", { at: [0, 0, SEAT] })
    k.block("point", { at: [L0, -0.6, 0], size: [PT_END - L0, 1.2, PT_TH], r: 0.2, parent: "pt", layer: 0.6 })
    k.detail("ruleP", { pts: [[0.4, 0, PT_TH + 0.002], [1.3, 0, PT_TH + 0.002], [2.2, 0, PT_TH + 0.002]], parent: "pt", layer: 0.61 })
    // It is pinned on the same post as the pile: the rivet's head shows on top.
    k.cyl("rivet", { at: [0, 0, PT_TH], radius: 0.12, h: 0.05, parent: "pt", layer: 0.62 })
  },
  tick(t, s, input) {
    const { p, groups } = s
    const lt = cycle(t, T) * T
    const L = loopAt(lt)
    const loopFound = ANS.filter((j) => L.out[j] > 0.5)
    const pick = choose(input, s.ptr && !input.still ? s.ptr.found : loopFound, s.ptr && !input.still ? s.ptr.held : null)

    let ang = L.ang.slice()
    let out = L.out.slice()
    let head = L.head
    let land = L.land
    let lit = L.lit
    let state = L.state
    const hold = new Array(N).fill(0) // the held line's acknowledgment

    if (input.still) {
      // The poster or reduced motion: the loop by its clock, and the pointer's line at once.
      if (pick !== null) {
        head = readZ(pick)
        if (!isAns(pick)) ang[pick] = NUDGE
        state = `line ${N - pick} · ${isAns(pick) ? "yes" : "no"}`
      }
    } else {
      // Live: the pointer takes over the head; what it finds stays found until it lets go.
      const w = clamp(input.spring("w", pick !== null ? 1 : 0, pick !== null ? { k: 70, c: 16 } : { k: 30, c: 11 }))
      if (pick !== null && !s.ptr) s.ptr = { found: loopFound.slice(), held: null }
      if (s.ptr && pick !== null) s.ptr.held = pick
      head = lerp(L.head, input.spring("head", pick !== null ? readZ(pick) : L.head), w)
      // Cause before response: a line answers only once the head has reached it.
      const arrived = pick !== null && w > 0.9 && Math.abs(head - readZ(pick)) < 0.05
      if (s.ptr && arrived && isAns(pick) && !s.ptr.found.includes(pick)) s.ptr.found.push(pick)
      if (pick === null && w < 0.02) s.ptr = null
      const found = s.ptr ? s.ptr.found : loopFound
      let across = 0
      for (let i = 0; i < N; i++) {
        if (isAns(i)) {
          const o = input.tween(`a${i}`, found.includes(i) ? 1 : 0)
          if (o > 0.95) across++
          out[i] = lerp(L.out[i], o, w)
          ang[i] = OUT * out[i]
          hold[i] = input.tween(`h${i}`, pick === i && arrived ? 1 : 0) * w
        } else {
          const n = input.tween(`a${i}`, pick === i && arrived ? 1 : 0)
          ang[i] = lerp(L.ang[i], NUDGE * n, w)
        }
      }
      // The point comes down only once the third answer is all the way across.
      const pl = input.tween("land", across === ANS.length ? 1 : 0)
      land = lerp(L.land, pl, w)
      lit = lerp(L.lit, clamp((pl - 0.75) / 0.25), w)
      if (w > 0.5) state = pick !== null ? `line ${N - pick} · ${isAns(pick) ? "yes" : "no"}` : state
    }

    // The pile: each line turns about the post.
    for (let i = 0; i < N; i++) {
      groups[`g${i}`].rz = ang[i]
      if (isAns(i)) {
        const on = out[i] > 0.02
        p[`line${i}`].on = p[`rule${i}`].on = on ? 2 : 0
        // Faint: three long slats' blooms add up, and the point must stay the brightest thing.
        // The held answer lifts a little, so a reader pointing at it sees it was heard.
        p[`line${i}`].glow = on ? 0.04 + 0.1 * out[i] + 0.16 * hold[i] : 0
      }
    }
    p.spill.glow = (0.85 * ANS.reduce((a, j) => a + out[j], 0)) / ANS.length

    // The question's head.
    groups.head.off[2] = clamp(head, readZ(0), readZ(N - 1)) - readZ(N - 1)

    // The point comes down onto the end of the post, into its outline, and glows once it sits there.
    groups.pt.off[2] = (1 - land) * DROP
    p.point.fade = p.ruleP.fade = p.rivet.fade = clamp(land * 1.6)
    p.point.hide = p.ruleP.hide = p.rivet.hide = land < 0.01
    p.point.on = p.ruleP.on = land > 0.01 ? 1 : 0
    p.point.glow = (0.06 + (input.still ? 0.24 : 0.18 + 0.08 * breathe(t, 2.6)) * lit) * clamp(land * 1.6)
    p.place.hide = land > 0.97
    p.place.fade = 1 - land
    s.state = state
  },
  readout: (s) => s.state || "pile",
})
