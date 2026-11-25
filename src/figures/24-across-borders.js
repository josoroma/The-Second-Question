// Chapter 24, Across borders: two gauges, one push, two zeros.
//
// Two plates stand side by side with a gap between them, the border. Each
// carries the same gauge: a needle on a hub and, round it, a scale with one
// lamp on it, the mark that is read as yes. One bar runs across the border
// and joins a crank on each hub, so whatever is pushed is pushed on both
// sides by the same angle. The stops are not in the same place: a post on
// each plate is as far back as its needle can go, that side's no.
//
// First both scales are laid the same way, as if the two sides were alike.
// The bar is pushed and the needles stand at different marks: one short of
// its lamp, one past it. Then the bar is drawn back until each needle meets
// its post, and the posts light. Each scale slides round its groove until the
// tongue at its zero touches that post. The same push then brings both needles
// to the lamps. They stand exactly where they stood the first time.
//
// The lamp's circuit runs through the tongue and the post, so nothing lights
// on a scale that is not seated on its stop. A dashed lamp stays where each
// yes was first assumed.
//
// Light: teal is the no that was found (post and tongue) and the marks counted
// from it; magenta is the yes those marks lead to, dashed where it was only
// assumed.
//
// The pointer pushes: the needle of the nearer gauge follows the aim, and the
// other turns with it. Push for a yes at once and nothing lights; run back to
// the stop first and the same push lights both.

import { arc, breathe, clamp, cycle, easeIn, easeInOut, easeOut, figure, keys, lerp, ring, rrect, smooth } from "../lib/iso/core.js"

const T = 9.4 // seconds per lap
const DEG = Math.PI / 180

const PY = 3.12 // each pivot's distance from the border
const HALF = 2.95 // half the width of a plate
const RIM = 3.4 // the round side of a plate
const BACK = -1.72 // its straight side

// The scale: an arc rail round the hub, with its zero, its ticks and its lamp.
const R0 = 2.28
const R1 = 2.98
const RM = (R0 + R1) / 2
const BAND_H = 0.28
const STEP = 8 // degrees between marks
const MARKS = 7 // between the zero and the lamp
const P = MARKS * STEP // the push: the angle from the stop to the lamp
const D = 24 // where the needles stand before anything is asked
const ZERO = -44 // the zero, in the scale's own frame

// The stop: a post inside the scale. The needle's flank meets it GAP degrees
// after its centre.
const POST_R = 0.19
const POST_AT = 1.64
const GAP = 10
const SHIFT = [-17, 17] // how far each stop lies from where both scales were laid
const PSI = SHIFT.map((d) => ZERO + d) // the angle of each stop
const MARK = ZERO + GAP + P // the lamp, in the scale's own frame

// The needle and the crank on the same hub.
const NZ = 0.46
const TIP = 2.14
const CRANK = 1.2
const CRANK0 = 180 - P / 2 // the crank's angle with the needle on its stop

const polar = (r, a) => [r * Math.cos(a * DEG), r * Math.sin(a * DEG)]
const flat = (pts) => pts.map(([x, y]) => [x, -y]) // plan points for a "+z" extrusion
const at = (z) => ([x, y]) => [x, y, z]

// The lap, in seconds.
const PUSH1 = 0.6
const READ1 = 1.4
const DRAW = 2.4
const STOP = 3.2 // both needles meet their posts
const SLIDE = 3.7
const SEAT = 4.8
const PUSH2 = 5.2
const YES = 6.1
const DARK = 8.2
const BACKHOME = 8.4

export default figure({
  slug: "24-across-borders",
  title: "Two zeros, then one yes",
  desc: "Two fan-shaped gauges stand on two plates with a gap between them, joined by one bar across the gap. Each scale has been turned until the tongue at its zero touches a post on its own plate, the stop, both lit teal. The two needles point at the same mark on their scales, and both lamps glow magenta, away from the dashed outlines where they were first assumed to be.",
  plate: "Across borders",
  sentence:
    "The viewer sees one push leave two needles at different marks, each scale then slide to its own stop, and the same push light the same mark on both, which explains why a yes is a guess until you know how that side says no: the no is the zero the yes is measured from.",
  view: { scale: 32, origin: [267, 211] },
  still: 7.1,
  build(k) {
    k.grid("board", { at: [-3.4, -7, -0.3], size: [8.4, 14], step: 0.7 })
    k.guide("border", { pts: [[BACK - 0.5, 0, -0.3], [0.8, 0, -0.3], [3.3, 0, -0.3]], layer: -2.5 })

    // The bar that crosses the border. Cranks and bar lie low, behind the hubs.
    k.group("bar", { at: [0, 0, 0] })
    k.block("link", { at: [-0.17, -PY - 0.3, 0.28], size: [0.34, 2 * PY + 0.6, 0.2], r: 0.17, parent: "bar", layer: 0.3 })
    k.detail("linkSeam", { pts: [[0, -PY + 0.35, 0.482], [0, -1.0, 0.482], [0, -0.62, 0.482]], parent: "bar", layer: 0.32 })
    k.detail("linkSeam2", { pts: [[0, 0.62, 0.482], [0, 1.0, 0.482], [0, PY - 0.35, 0.482]], parent: "bar", layer: 0.32 })
    k.block("grip", { at: [-0.32, -0.45, 0.48], size: [0.64, 0.9, 0.14], r: 0.2, parent: "bar", layer: 0.33 })
    k.cyl("knob", { at: [0, 0, 0.62], radius: 0.2, h: 0.36, parent: "bar", layer: 0.34 })

    for (const g of [0, 1]) {
      const s = g ? 1 : -1
      const py = s * PY
      const L = g ? 2 : 1 // the near gauge is painted after the far one

      // The plate: straight at the back, round where the scale runs.
      const e = Math.asin(HALF / RIM) / DEG
      const c = rrect(BACK, -HALF, BACK + 2, HALF, 0.42, 6).filter(([x]) => x < BACK + 0.6)
      const plan = [...c.filter(([, y]) => y > 0), ...c.filter(([, y]) => y < 0), ...arc(0, 0, RIM, -e, e, 40)]
      k.extrude(`plate${g}`, { at: [0, py, 0], shape: flat(plan), face: "+z", depth: 0.3, layer: -3 + g * 0.1 })
      for (const [j, [x, y]] of [[BACK + 0.36, -HALF + 0.36], [BACK + 0.36, HALF - 0.36], polar(RIM - 0.24, -56), polar(RIM - 0.24, 56)].entries())
        if (j < 2) k.led(`screw${g}${j}`, { at: [x, py + y, 0.002], face: "+z", r: 0.075, layer: -2 })
      // The groove the scale slides in.
      for (const [j, r] of [R0 - 0.07, R1 + 0.07].entries())
        k.detail(`groove${g}${j}`, { at: [0, py, 0.002], pts: arc(0, 0, r, -68, 64, 40).map(at(0)), layer: -2 })
      k.halo(`spill${g}`, { at: [...polar(RM, PSI[g] + GAP + P), 0.003].map((v, i) => (i === 1 ? v + py : v)), r: 1.35, on: 1, layer: -1 })
      k.halo(`floor${g}`, { at: [...polar(POST_AT, PSI[g]), 0.003].map((v, i) => (i === 1 ? v + py : v)), r: 0.95, on: 2, layer: -1 })

      // The hub's crank and its pin through the bar.
      k.group(`arm${g}`, { at: [0, py, 0] })
      k.extrude(`crank${g}`, {
        at: [0, 0, 0.26],
        shape: [...arc(CRANK, 0, 0.26, -90, 90, 12), ...arc(0, 0, 0.4, 100, 260, 14)],
        face: "+z",
        depth: 0.2,
        rz: CRANK0,
        parent: `arm${g}`,
        layer: 0.2,
      })
      k.cyl(`pin${g}`, { at: [...polar(CRANK, CRANK0), 0.48], radius: 0.13, h: 0.14, n: 28, parent: `arm${g}`, layer: 0.36 })

      // The scale, laid on the groove, with its tongue at the zero.
      k.group(`scale${g}`, { at: [0, py, 0] })
      k.extrude(`band${g}`, {
        at: [0, 0, BAND_H],
        shape: flat([...arc(0, 0, R1, ZERO - 7, MARK + 22, 44), ...arc(0, 0, R0, MARK + 22, ZERO - 7, 44)]),
        face: "+z",
        depth: BAND_H - 0.03,
        parent: `scale${g}`,
        layer: L + 0.1,
      })
      k.extrude(`tongue${g}`, {
        at: [0, 0, 0.2],
        shape: flat([[POST_AT + POST_R + 0.02, -0.1], [R0 + 0.03, -0.15], [R0 + 0.03, 0.15], [POST_AT + POST_R + 0.02, 0.1]]),
        face: "+z",
        depth: 0.17,
        rz: ZERO,
        parent: `scale${g}`,
        layer: g ? L + 0.09 : L + 0.12, // behind the near scale, in front of the far one
      })
      // Its marks, counted from the zero: the eighth is the lamp.
      for (let i = 0; i < MARKS; i++) {
        const a = ZERO + GAP + i * STEP
        const r = i === 0 ? R1 - 0.12 : R0 + 0.4
        const w = 0.045
        const t = [-Math.sin(a * DEG) * w, Math.cos(a * DEG) * w]
        const [p0, p1] = [polar(R0 + 0.13, a), polar(r, a)]
        const quad = [[p0[0] - t[0], p0[1] - t[1]], [p1[0] - t[0], p1[1] - t[1]], [p1[0] + t[0], p1[1] + t[1]], [p0[0] + t[0], p0[1] + t[1]]]
        k.face(`mark${g}${i}`, { pts: quad.map(at(BAND_H + 0.003)), role: "recess", parent: `scale${g}`, layer: L + 0.14 })
      }
      const m = polar(RM, MARK)
      k.halo(`lampGlow${g}`, { at: [...m, BAND_H + 0.004], r: 0.75, on: 1, parent: `scale${g}`, layer: L + 0.15 })
      k.cyl(`seat${g}`, { at: [...m, BAND_H], radius: 0.27, h: 0.05, n: 32, parent: `scale${g}`, layer: L + 0.16 })
      k.cyl(`lamp${g}`, { at: [...m, BAND_H + 0.05], radius: 0.21, h: 0.26, n: 32, parent: `scale${g}`, layer: L + 0.2 })
      // Where the yes was assumed, before the stop was known.
      const gm = polar(RM, MARK)
      k.cyl(`guess${g}`, { at: [gm[0], gm[1] + py, BAND_H + 0.02], radius: 0.21, h: 0.28, n: 32, role: "ghost", on: 1, layer: L + 0.18 })

      // The stop.
      const q = polar(POST_AT, PSI[g])
      k.cyl(`foot${g}`, { at: [q[0], q[1] + py, 0], radius: POST_R + 0.04, h: 0.05, n: 32, layer: L + 0.3 })
      k.cyl(`post${g}`, { at: [q[0], q[1] + py, 0.05], radius: POST_R - 0.02, h: 0.86, n: 32, layer: L + 0.32 })

      // The hub and the needle.
      k.cyl(`hub${g}`, { at: [0, py, 0.1], radius: 0.5, h: NZ - 0.12, layer: L + 0.4 })
      k.extrude(`needle${g}`, {
        at: [0, 0, NZ + 0.16],
        shape: flat([...arc(0, 0, 0.36, 60, 300, 24), [TIP - 0.18, -0.1], [TIP, 0], [TIP - 0.18, 0.1]]),
        face: "+z",
        depth: 0.16,
        rz: PSI[g] + GAP,
        parent: `arm${g}`,
        layer: L + 0.5,
      })
      k.cyl(`cap${g}`, { at: [0, py, NZ + 0.16], radius: 0.28, h: 0.16, n: 36, layer: L + 0.6 })
      k.detail(`capRing${g}`, { at: [0, py, NZ + 0.322], pts: ring(0, 0, 0.13, 24).concat([[0.13, 0]]).map(at(0)), layer: L + 0.62 })
    }
  },
  tick(t, s, input) {
    const { p, groups } = s
    const tl = cycle(t, T) * T

    // The lap: push, two readings; back to both stops; each scale to its own
    // stop; the same push again.
    const phiL = keys(tl, [
      [0, D],
      [PUSH1, D],
      [READ1, P, easeInOut],
      [DRAW, P],
      [STOP, 0, (u) => easeInOut(u)],
      [PUSH2, 0],
      [YES - 0.1, P, easeInOut],
      [BACKHOME, P],
      [T, D, easeInOut],
    ])
    const slideL = [0, 1].map((g) =>
      keys(tl, [
        [0, 0],
        [SLIDE + g * 0.25, 0],
        [SEAT - 0.25 + g * 0.25, 1, easeInOut],
        [BACKHOME, 1],
        [T, 0, easeInOut],
      ])
    )
    const noL = tl >= STOP - 0.02 && tl < BACKHOME ? 1 : 0
    const yesL = keys(tl, [
      [0, 0],
      [YES - 0.12, 0],
      [YES + 0.08, 1, easeOut],
      [DARK, 1],
      [BACKHOME, 0],
      [T, 0],
    ])

    // The pointer pushes: the aim's angle about the nearer pivot, from its stop.
    const a = input.onPlane ? input.onPlane(NZ) : null
    let aim = null
    if (a && a[0] > BACK - 0.4) {
      const g = a[1] < 0 ? 0 : 1
      const x = a[0]
      const y = a[1] - (g ? PY : -PY)
      const r = Math.hypot(x, y)
      if (r < RIM + 0.4) {
        aim = clamp(Math.atan2(y, Math.max(x, 0.12)) / DEG - PSI[g] - GAP, 0, P + 16)
        if (Math.abs(aim - P) < 5) aim = P
        if (aim < 4) aim = 0
      }
    }
    const m = input.tween("ptr", aim === null ? 0 : 1, { dur: 0.45 })
    if (aim === null && m < 0.01) s.known = false
    const phiP = input.spring("phi", aim === null ? phiL : aim, { k: 90, c: 19 })
    if (aim !== null && m > 0.98 && phiP < 1.2) s.known = true
    const phi = clamp(lerp(phiL, phiP, m), 0, P + 16)

    const barAng = CRANK0 + phi
    const [bx, by] = polar(CRANK, barAng)
    groups.bar.off[0] = bx
    groups.bar.off[1] = by
    const b = input.still ? 0.5 : breathe(t, 2.6)
    let yes = 0
    for (const g of [0, 1]) {
      groups[`arm${g}`].rz = phi
      const slideP = input.tween(`slide${g}`, s.known ? 1 : 0, { dur: 0.9 })
      const u = lerp(slideL[g], slideP, m)
      groups[`scale${g}`].rz = SHIFT[g] * u
      const seated = smooth(clamp((u - 0.96) / 0.04))
      const no = m > 0.5 ? (s.known ? 1 : 0) : noL
      p[`post${g}`].on = no ? 2 : 0
      p[`post${g}`].glow = no ? 0.35 : 0
      p[`floor${g}`].glow = no ? 0.55 : 0
      p[`tongue${g}`].on = no && seated > 0.5 ? 2 : 0
      p[`tongue${g}`].glow = no * seated * 0.25
      // The marks light as the needle counts past them, from its stop.
      for (let i = 0; i < MARKS; i++) {
        const c = no && seated > 0.5 && phi > i * STEP - 1.5 && (m > 0.5 || tl > SEAT - 0.3) ? 1 : 0
        p[`mark${g}${i}`].on = c ? 2 : 0
      }
      const onMark = clamp(1 - Math.abs(phi - P) / 2.5)
      const lit = lerp(yesL, input.tween(`yes${g}`, seated > 0.5 && s.known && onMark > 0.4 ? 1 : 0, { dur: 0.25 }), m) * seated
      p[`lamp${g}`].on = lit > 0.3 ? 1 : 0
      p[`lamp${g}`].glow = lit * (0.5 + 0.2 * b)
      p[`lampGlow${g}`].glow = lit * 0.8
      p[`spill${g}`].glow = lit * 0.6
      const gone = clamp((u - 0.35) / 0.4)
      p[`guess${g}`].fade = gone
      p[`guess${g}`].hide = gone < 0.02
      yes = Math.max(yes, lit)
    }

    const knows = m > 0.5 ? s.known : tl >= STOP && tl < BACKHOME
    s.state = yes > 0.5 ? "their yes" : phi < 1.5 ? "their no" : knows ? "zeroed" : Math.abs(phi - P) < 2.5 ? "two readings" : "a guess"
  },
  readout: (s) => s.state || "rest",
})
