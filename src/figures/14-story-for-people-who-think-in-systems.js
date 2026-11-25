// Chapter 14, Story for people who think in systems: the working story as a
// locating jig.
//
// A slotted arm, the story, turns on one pin, the moment (teal). On one pin
// it can swing to any lamp on the panel: one case can point anywhere, and no
// lamp lights. In front of that pin stands the count: a row of pins like it,
// in the place the log put them. Only over the row can the arm come down; the
// pins stand up through its slot, light one after another (teal), and it can
// no longer turn. Then the lamp it points at lights (magenta): the decision,
// marked with a dashed ring before anything moved and lit last.
//
// The pointer aims the arm. Anywhere off the row it follows, loose, and
// nothing lights; over the row it drops onto the pins and holds.

import { arc, breathe, clamp, cycle, easeIn, easeInOut, easeOut, figure, keys, lerp, ring, smooth } from "../lib/iso/core.js"

const T = 9 // seconds per lap
const DEG = Math.PI / 180

// Everything turns about the moment's pin, at the origin; the row runs along +x.
const PINS = 6 // the count's pins, after the first
const PITCH = 0.64
const PIN_R = 0.18
const ROW_TOP = 0.3 // the top of the rail the pins stand on
const PIN_H = 0.8
const PIN_TOP = ROW_TOP + PIN_H
const pinX = (i) => 0.95 + i * PITCH // pin i of the count

// The arm: two rails with a slot between them, a bearing over the first pin, a nose.
const SLOT = 0.23 // half the slot's width
const RAIL_W = 0.2
const ARM_T = 0.3
const ARM_X1 = pinX(PINS - 1) + 0.42 // where the rails end
const NOSE = 0.56
const UP = PIN_TOP + 0.14 // the arm's underside when loose: clear of the pins
const DOWN = ROW_TOP + 0.16 // ...when seated on the row

// The panel: a rail of lamps across the arm's reach.
const R0 = ARM_X1 + NOSE + 0.24
const R1 = R0 + 0.85
const PANEL_H = 0.55
const RL = (R0 + R1) / 2
const LAMPS = [-26, -13, 0, 13, 26]
const SWING = 26

/** A polygon with its corners rounded by quarter-ish arcs (quadratic curves). */
const soft = (pts, r, steps = 10) => {
  const out = []
  const n = pts.length
  for (let i = 0; i < n; i++) {
    const a = pts[(i - 1 + n) % n]
    const b = pts[i]
    const c = pts[(i + 1) % n]
    const to = (p) => {
      const l = Math.hypot(p[0] - b[0], p[1] - b[1])
      const k = Math.min(r, l / 2) / l
      return [b[0] + (p[0] - b[0]) * k, b[1] + (p[1] - b[1]) * k]
    }
    const s = to(a)
    const e = to(c)
    for (let j = 0; j <= steps; j++) {
      const t = j / steps
      out.push([
        (1 - t) * (1 - t) * s[0] + 2 * t * (1 - t) * b[0] + t * t * e[0],
        (1 - t) * (1 - t) * s[1] + 2 * t * (1 - t) * b[1] + t * t * e[1],
      ])
    }
  }
  return out
}

// The lap, in seconds.
const CATCH = 4.0 // the arm comes to rest over the row
const SEAT = 4.45 // seated
const COUNT1 = 5.15 // the last pin of the count is lit
const LIGHT = 5.45 // the lamp is lit
const DARK = 7.9
const LIFT = 8.4

export default figure({
  slug: "14-story-for-people-who-think-in-systems",
  title: "One pin leaves it loose, the row holds it",
  desc: "A slotted arm turns on one pin on a plate and can point at any of five lamps on a panel. It has come down on a straight row of pins like the first; they stand up through its slot, lit teal, and it cannot turn. The lamp at the end of the row, the decision, glows magenta.",
  plate: "Story for people who think in systems",
  sentence:
    "The viewer sees an arm swing loose on one pin, come down on a row of pins like it and light the one lamp the row points at, which explains the working story: one case can point anywhere, and the count is what holds it on the decision.",
  view: { scale: 37, origin: [170, 156] },
  still: 6.6,
  build(k) {
    k.grid("board", { at: [-2.4, -5.2, -0.3], size: [11.2, 10.4], step: 0.7 })
    // The plate: narrow at the pivot, wide at the panel.
    const plate = soft(
      [
        [-1.2, -1.45],
        [R1 + 0.4, -4.25],
        [R1 + 0.4, 4.25],
        [-1.2, 1.45],
      ],
      0.6
    )
    k.extrude("base", { at: [0, 0, 0], shape: plate.map(([x, y]) => [x, -y]), face: "+z", depth: 0.3, layer: -3 })

    // Where the end of the rails may swing.
    k.guide("sweep", { pts: arc(0, 0, ARM_X1, -SWING, SWING, 40).map(([x, y]) => [x, y, 0]), layer: -2 })
    ;[
      [-0.82, -1.15],
      [-0.82, 1.15],
      [R1 + 0.02, -3.72],
      [R1 + 0.02, 3.72],
    ].forEach(([x, y], i) => k.led(`screw${i}`, { at: [x, y, 0], face: "+z", r: 0.08, layer: -2 }))
    k.halo("spill", { at: [RL + 0.3, 0, 0], r: 1.7, on: 1, layer: -1 })

    // The row: a low rail with the count's pins standing on it.
    k.block("row", { at: [-0.55, -0.42, 0], size: [pinX(PINS - 1) + 0.55 + 0.45, 0.84, ROW_TOP], r: 0.2, layer: 0 })
    k.halo("rowGlow", { at: [pinX(3), 0, ROW_TOP], r: 2, on: 2, layer: 0, bias: 9 })
    k.cyl("collar", { at: [0, 0, ROW_TOP], radius: 0.34, h: 0.08, layer: 1 })
    k.cyl("moment", { at: [0, 0, ROW_TOP + 0.08], radius: PIN_R - 0.03, h: UP + ARM_T - ROW_TOP, layer: 1.1, role: "accent2" })
    for (let i = 0; i < PINS; i++) k.cyl(`pin${i}`, { at: [pinX(i), 0, ROW_TOP], radius: PIN_R, h: PIN_H, n: 28, layer: 1.5 })

    // The panel and its lamps: where a story could point.
    k.block("panel", { at: [R0, -3.45, 0], size: [R1 - R0, 6.9, PANEL_H], r: 0.16, layer: 3 })
    LAMPS.forEach((a, i) => {
      const c = [RL, RL * Math.tan(a * DEG), PANEL_H]
      k.cyl(`seat${i}`, { at: c, radius: 0.29, h: 0.06, n: 32, layer: 3.2 })
      k.cyl(`lamp${i}`, { at: [c[0], c[1], PANEL_H + 0.06], radius: 0.22, h: 0.26, n: 32, layer: 3.3 })
    })
    k.halo("lampGlow", { at: [RL, 0, PANEL_H], r: 0.95, on: 1, layer: 3.1 })
    k.guide("chosen", { pts: ring(RL, 0, 0.37, 40).concat([[RL + 0.37, 0]]).map(([x, y]) => [x, y, PANEL_H]), layer: 3.15 })

    // The arm.
    k.group("arm", { at: [0, 0, DOWN] })
    k.block("railB", { at: [0.3, -SLOT - RAIL_W, 0], size: [ARM_X1 - 0.3, RAIL_W, ARM_T], r: 0.04, parent: "arm", layer: 1.2 })
    k.block("railF", { at: [0.3, SLOT, 0], size: [ARM_X1 - 0.3, RAIL_W, ARM_T], r: 0.04, parent: "arm", layer: 2 })
    k.cyl("bearing", { at: [0, 0, 0], radius: 0.56, h: ARM_T + 0.08, parent: "arm", layer: 2.1 })
    // The first pin shows through the bearing at any height: its upper part rides with the arm.
    k.cyl("cap", { at: [0, 0, ARM_T], radius: PIN_R, h: UP - DOWN + 0.16, parent: "arm", layer: 2.2, role: "accent2" })
    const e = SLOT + RAIL_W
    k.extrude("nose", {
      at: [ARM_X1, 0, ARM_T + 0.05],
      shape: soft([[-0.2, -e], [0.06, -e], [NOSE, -0.07], [NOSE, 0.07], [0.06, e], [-0.2, e]], 0.06, 3),
      face: "+z",
      depth: ARM_T + 0.05,
      parent: "arm",
      layer: 2.1,
    })
  },
  tick(t, s, input) {
    const { p, groups } = s
    const tl = cycle(t, T) * T

    // The lap: loose, it swings to one lamp and another; it comes back over
    // the row, drops onto the pins, the count lights, the lamp lights; lift.
    const loopA = keys(tl / T, [
      [0, 0],
      [0.1, -SWING, easeInOut],
      [0.16, -SWING],
      [0.28, 13, easeInOut],
      [0.33, 13],
      [CATCH / T, 0, easeInOut],
      [1, 0],
    ])
    const loopUp = keys(tl / T, [
      [0, 1],
      [(CATCH + 0.1) / T, 1],
      [SEAT / T, 0, easeIn],
      [DARK / T, 0],
      [LIFT / T, 1, easeOut],
      [1, 1],
    ])

    // The pointer aims the arm, on the fixed plane of the lamps.
    const at = input.onPlane ? input.onPlane(PANEL_H + 0.2) : null
    let aim = null
    if (at) {
      const r = Math.hypot(at[0], at[1])
      const a = Math.atan2(at[1], at[0]) / DEG
      if (r > 0.7 && r < R1 + 0.5 && Math.abs(a) < 42) aim = clamp(a, -SWING - 3, SWING + 3)
    }
    // Over the row (with a little hysteresis) it can come down.
    s.over = aim !== null && Math.abs(aim) < (s.over ? 8.5 : 6)
    const m = input.tween("ptr", aim === null ? 0 : 1, { dur: 0.4 })
    const aPtr = input.spring("a", aim === null ? loopA : s.over ? 0 : aim)
    const still = Math.abs(aPtr) < 1.6
    const uPtr = input.tween("up", aim === null ? (loopUp > 0.5 ? 1 : 0) : s.over && still ? 0 : 1, { dur: 0.45 })
    const u = lerp(loopUp, uPtr, m)
    // It turns only clear of the pins: in the row they do not let it.
    const a = lerp(loopA, aPtr, m) * smooth(clamp((u - 0.78) / 0.22))
    groups.arm.rz = a
    groups.arm.off[2] = u * (UP - DOWN)
    const seated = 1 - smooth(clamp(u / 0.12))

    // Clear of the pins, the arm passes over them: paint it after them.
    if (u > 0.55) p.railB.layer = 1.8

    // The moment is lit throughout; the count lights pin by pin, outward.
    const loopN = tl < SEAT ? 0 : tl < COUNT1 ? ((tl - SEAT) / (COUNT1 - SEAT)) * PINS : tl < DARK ? PINS : PINS * (1 - clamp((tl - DARK) / 0.2))
    const ptrN = input.tween("n", s.over && uPtr < 0.06 ? PINS : 0, { dur: 0.75, ease: (x) => x })
    const n = lerp(loopN, ptrN, m)
    p.cap.glow = 0.3
    for (let i = 0; i < PINS; i++) {
      const lit = clamp(n - i) * seated
      p[`pin${i}`].on = lit > 0.4 ? 2 : 0
      p[`pin${i}`].glow = 0.28 * lit
    }
    p.rowGlow.glow = 0.5 * clamp(n / PINS) * seated

    // The decision lights last.
    const loopL = keys(tl / T, [
      [0, 0],
      [COUNT1 / T, 0],
      [LIGHT / T, 1, easeOut],
      [DARK / T, 1],
      [(DARK + 0.25) / T, 0],
      [1, 0],
    ])
    const ptrL = input.tween("lit", ptrN > PINS - 0.05 ? 1 : 0, { dur: 0.3 })
    const lit = Math.min(seated, lerp(loopL, ptrL, m))
    const b = input.still ? 0.5 : breathe(t, 2.6)
    p.lamp2.on = lit > 0.3 ? 1 : 0
    p.lamp2.glow = lit * (0.5 + 0.2 * b)
    p.lampGlow.glow = lit * 0.9
    p.spill.glow = lit * 0.45

    s.state = lit > 0.5 ? "the decision" : n * seated > 0.3 ? `count ${Math.min(PINS, Math.ceil(n))}` : seated > 0.5 ? "on the row" : "one case"
  },
  readout: (s) => s.state || "rest",
})
