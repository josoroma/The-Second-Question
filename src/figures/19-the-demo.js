// Chapter 19, The demo: a detour around the step that fails.
//
// Four evenly spaced steps stand on a plate and lead to a wider landing that
// holds a screen, where the room sees the value. A line scored through every
// station marks the planned path. A token hops from step to step. The third
// step fails live: it blinks, the token flinches back, and the step is left
// as a dashed outline over the bare footprint where it stood. A prepared
// arch, a half circle centred on that step, springs from the step before it
// and lands on the step after it, so the token rides over the failure and
// still reaches the screen.
//
// Light: the token and the screen it reaches are magenta (the point, and
// where the room sees it). The arch is teal while it carries the token: what
// was prepared first, the support. Its light spills on the two steps it
// stands on, never into the opening over the failed step. At rest only the
// token and the arch glow.

import { arc, bezier, breathe, clamp, cycle, easeIn, easeInOut, easeOut, figure, keys, lerp, rrect } from "../lib/iso/core.js"

const S = 2 // spacing between stations
const C = [0, S, 2 * S, 3 * S, 4 * S] // station centres along x: steps 1 to 4, then the landing
const TOP = 0.45 // height of every station's top
const PAD = 1.5 // a step's width and depth
const HT = 0.28 // half the token
const LEG = HT // the arch springs at the height of the resting token's centre
const RO = S - HT // outer radius: the token resting on step 2 just touches the arch's foot
const RI = RO - 0.3 // inner radius
const DEEP = 0.7 // the arch's depth along y
const HOP = 0.75 // height of a hop between stations
const JOINTS = [36, 72, 108, 144] // joints between the arch's five stones (degrees)
// The landing: in line with the steps at the front, longer and deeper behind, to hold the screen.
const DOCK = { x0: C[4] - PAD / 2, x1: C[4] + 1.0, y0: -1.2, y1: PAD / 2 }
// The screen stands on the landing's back edge, its glass toward the path.
const SCR = { x0: 7.4, x1: 8.8, y0: -1.14, y1: -0.86, h: 1.85 }
// How step 3 blinks as it fails: [seconds after the failure starts, 1 dashed or 0 solid].
// Three deliberate blinks of about a tenth of a second, then it stays dashed.
const BLINK = [
  [0, 1],
  [0.1, 0],
  [0.22, 1],
  [0.32, 0],
  [0.46, 1],
  [0.56, 0],
  [0.66, 1],
]
const BLINK_LEN = 0.66
const RESTORE = 0.45 // seconds of crossfade when step 3 comes back
const T = 9 // seconds per lap
const FAIL_AT = 0.245 // where in the lap step 3 fails
const BACK_AT = 0.93 // where in the lap it is restored for the next one
// Over the arch: quickly past the steep leg (where an upright token can only
// touch the arch with one edge), slowly onto the crown; the mirror on the way down.
const UP = bezier(0.2, 0.5, 0.1, 1)
const DOWN = bezier(0.9, 0, 0.8, 0.5)

const blinkAt = (age) => BLINK.reduce((v, [a, b]) => (age >= a ? b : v), 1)

/** The token's centre [x, z] at route position r: 0 step 1, 1 step 2, 2 over step 3, 3 step 4, 4 the landing. */
function route(r) {
  r = clamp(r, 0, 4)
  const z0 = TOP + HT
  if (r <= 1) return [lerp(C[0], C[1], r), z0 + HOP * 4 * r * (1 - r)]
  if (r >= 3) {
    const f = r - 3
    return [lerp(C[3], C[4], f), z0 + HOP * 4 * f * (1 - f)]
  }
  // Over the arch: the token rides its outer face upright, so its centre
  // stands off the half circle by the token's own reach in that direction.
  const th = Math.PI * (1 - (r - 1) / 2)
  const c = Math.cos(th)
  const s = Math.sin(th)
  const R = RO + HT * (Math.abs(c) + Math.abs(s))
  return [C[2] + R * c, z0 + R * s]
}

// The arch's anchor sits at its visual centre, not at its feet: the 3D view
// centres a part's glow on its anchor.
const ARCH_V = LEG + 0.95

/** The arch's profile in (u, v) = (x from step 3, z from the anchor): exact arcs, straight legs. */
function archShape() {
  const outer = arc(0, LEG, RO, 0, 180, 40)
  const inner = arc(0, LEG, RI, 180, 0, 34)
  return [[RI, 0], [RO, 0], ...outer, [-RO, 0], [-RI, 0], ...inner].map(([u, v]) => [u, v - ARCH_V])
}

/**
 * A station's seam at height z, as two halves: the one that faces the iso
 * view (-45 to 135 degrees round the rounded outline) and the one behind it.
 */
function seam({ x0, x1, y0, y1 }, z, r = 0.22) {
  const corner = (cx, cy, a0, a1) =>
    Array.from({ length: 7 }, (_, i) => {
      const a = ((a0 + ((a1 - a0) * i) / 6) * Math.PI) / 180
      return [cx + r * Math.cos(a), cy + r * Math.sin(a), z]
    })
  return {
    front: [...corner(x1 - r, y0 + r, -45, 0), ...corner(x1 - r, y1 - r, 0, 90), ...corner(x0 + r, y1 - r, 90, 135)],
    back: [...corner(x0 + r, y1 - r, 135, 180), ...corner(x0 + r, y0 + r, 180, 270), ...corner(x1 - r, y0 + r, 270, 315)],
  }
}

const disc = (cx, cy, z, rad, n = 28) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    return [cx + rad * Math.cos(a), cy + rad * Math.sin(a), z]
  })
const depth = (q) => q[0] + q[1] + q[2]
const mean = (pts) => pts.reduce((a, q) => [a[0] + q[0], a[1] + q[1], a[2] + q[2]], [0, 0, 0]).map((v) => v / pts.length)
const mid = (pts) => pts[Math.floor(pts.length / 2)]

export default figure({
  slug: "19-the-demo",
  title: "A detour around the step that fails",
  desc: "Four evenly spaced steps on a plate lead to a landing with a screen. The third step is only a dashed outline over its bare footprint, because it failed. A prepared arch, a half circle centred on that step, springs from the second step to the fourth and carries a glowing token over the gap toward the screen.",
  plate: "The demo",
  sentence:
    "The viewer sees the third step fail as the token comes to it, and the prepared arch carry the token over it and on to the screen, which explains what to have ready when a demo breaks live: a rehearsed detour, so the point still reaches the room.",
  view: { scale: 36, origin: [155, 136] },
  still: 0.475 * T,
  build(k) {
    const shape = archShape()
    // Paint order: the arch sorts by its centre; parts lying on it sort just after.
    const archDepth = C[2] + TOP + ARCH_V + shape.reduce((a, q) => a + q[0] + q[1], 0) / shape.length
    const after = (q, target) => target - depth(q)

    k.grid("board", { at: [C[2] - 7, -3.85, -0.32], size: [14, 7.7], step: 0.7 })
    k.block("base", { at: [-1.25, -1.6, -0.32], size: [10.5, 3.2, 0.32], r: 0.4, layer: -3 })
    // The planned path: a line scored straight along the plate, step 1 to the
    // landing. The stations hide it in the iso view; the 3D view shows it
    // between them. It sorts by its middle, under the footprint below.
    k.detail("plan", { pts: [[C[0], 0, 0.002], [C[2], 0, 0.002], [C[4], 0, 0.002]], layer: -2 })
    // Where step 3 stood: its bare footprint, shown once it has failed. It sorts over the path.
    const hole = rrect(C[2] - PAD / 2, -PAD / 2, C[2] + PAD / 2, PAD / 2, 0.22, 5).map(([x, y]) => [x, y, 0.001])
    k.face("hole", { pts: hole, role: "recess", layer: -2, bias: 0.01, hide: true })
    k.halo("tokspill", { at: [C[0], 0, 0], r: 1.5, on: 1, layer: -1 })

    // The stations: four steps, then the landing. Step 3 has a solid body and
    // a dashed one, swapped when it fails. Step 4 sorts a little early: the
    // arch's foot stands on it.
    const stations = [0, 1, 2, 3].map((i) => ({ x0: C[i] - PAD / 2, x1: C[i] + PAD / 2, y0: -PAD / 2, y1: PAD / 2 })).concat([DOCK])
    const tops = []
    ;["pad1", "pad2", "step3", "pad4", "dock"].forEach((id, i) => {
      const st = stations[i]
      const n = i + 1
      const cx = C[i]
      const nudge = id === "pad4" ? -1 : 0
      const d = (st.x0 + st.x1) / 2 + (st.y0 + st.y1) / 2 + TOP / 2 + nudge
      tops.push(d)
      k.block(id, { at: [st.x0, st.y0, 0], size: [st.x1 - st.x0, st.y1 - st.y0, TOP], r: 0.22, bias: nudge })
      // The seam all round: its far half sorts just before the station, which
      // hides it here, so only the 3D view shows it from behind.
      const { front, back } = seam(st, TOP - 0.11)
      k.detail(`lid${n}b`, { pts: back, bias: after(mid(back), d - 0.05) })
      k.detail(`lid${n}`, { pts: front, bias: after(mid(front), d + 0.05) })
      // The planned path, scored across the station's top through its socket
      // (from the socket on step 1, to it on the landing).
      const z = TOP + 0.003
      const path = [[i === 0 ? cx : st.x0 + 0.04, 0, z], [cx, 0, z], [i === 4 ? cx : st.x1 - 0.04, 0, z]]
      k.detail(`path${n}`, { pts: path, bias: after(path[1], d + 0.055) })
      const sock = disc(cx, 0, TOP + 0.003, 0.24)
      k.face(`sock${n}`, { pts: sock, role: "recess", bias: after(mean(sock), d + 0.06) })
    })
    k.block("step3x", { at: [C[2] - PAD / 2, -PAD / 2, 0], size: [PAD, PAD, TOP], r: 0.22, role: "ghost", hide: true })
    // The arch's light where it stands: on the tops of steps 2 and 4 (a halo
    // on the plate would be hidden by the steps), never in the opening.
    ;[
      [1, 0.08],
      [3, -0.08],
    ].forEach(([i, dx]) => {
      const at = [C[i] + dx, 0, TOP + 0.004]
      k.halo(`land${i + 1}`, { at, r: 0.68, on: 2, layer: 0, bias: after(at, tops[i] + 0.08) })
    })

    // The prepared detour: a half circle centred on step 3, from step 2 to step 4.
    k.extrude("arch", { at: [C[2], DEEP / 2, TOP + ARCH_V], shape, face: "+y", depth: DEEP })
    JOINTS.forEach((a, i) => {
      const c = Math.cos((a * Math.PI) / 180)
      const s = Math.sin((a * Math.PI) / 180)
      const at = (rad, y) => [C[2] + rad * c, y, TOP + LEG + rad * s]
      const f = DEEP / 2
      const b = -DEEP / 2
      // Each joint rings its stone. The half that shows (the front face and
      // whichever curved face turns to the view) sorts after the arch; the far
      // half (the back face and the other curved face) sorts before it, so the
      // arch hides it here and the 3D view shows it from behind.
      const near = a < 135 ? [at(RI, f + 0.004), at(RO, f + 0.004), at(RO, b)] : [at(RI, b), at(RI, f + 0.004), at(RO, f + 0.004)]
      const far = a < 135 ? [at(RO, b - 0.004), at(RI, b - 0.004), at(RI, f)] : [at(RO, f), at(RO, b - 0.004), at(RI, b - 0.004)]
      k.detail(`joint${i}`, { pts: near, bias: after(near[1], archDepth + 0.04) })
      k.detail(`joint${i}b`, { pts: far, bias: after(far[1], archDepth - 0.04) })
    })
    // A witness: the half circle's centre is the failing step.
    k.guide("witness", { pts: [[C[2], 0, TOP + LEG + RI], [C[2], 0, TOP]] })

    // The screen on the landing, where the room sees the value.
    k.block("screen", { at: [SCR.x0, SCR.y0, TOP], size: [SCR.x1 - SCR.x0, SCR.y1 - SCR.y0, SCR.h], r: 0.1 })
    const screenDepth = (SCR.x0 + SCR.x1) / 2 + (SCR.y0 + SCR.y1) / 2 + TOP + SCR.h / 2
    // Anchored at its centre (points relative to it), so its glow in 3D sits on it.
    const glass = rrect(-0.58, -0.7, 0.58, 0.7, 0.08, 3).map(([x, z]) => [x, 0, z])
    k.face("glass", { at: [(SCR.x0 + SCR.x1) / 2, SCR.y1 + 0.004, TOP + 1.02], pts: glass, role: "glass" })
    // A standby lamp on the frame under the glass: dark at rest, lit with the screen.
    const lampAt = [SCR.x1 - 0.17, SCR.y1 + 0.006, TOP + 0.16]
    k.led("lamp", { at: lampAt, face: "+y", r: 0.055, bias: after(lampAt, screenDepth + 0.3) })
    // The screen's light on the landing in front of it.
    const seenAt = [C[4] + 0.12, -0.08, TOP + 0.004]
    k.halo("seenspill", { at: seenAt, r: 0.82, on: 1, layer: 0, bias: after(seenAt, tops[4] + 0.08) })

    // The token: the point the demo carries.
    k.group("tok", { at: [C[0], 0, TOP + HT] })
    k.block("token", {
      at: [-HT, -HT, -HT],
      size: [2 * HT, 2 * HT, 2 * HT],
      r: 0.14,
      role: "accent",
      parent: "tok",
      // Sorts in front of the arch exactly while it rides a face of the arch that shows.
      bias: archDepth - (C[2] + TOP + HT) + 0.05,
    })
  },
  tick(t, s, input) {
    const { p, groups } = s
    const lap = cycle(t, T)

    // The lap: in at step 1, hop to step 2, step 3 fails and the token
    // flinches back, the arch lights, carries the token over it and holds it
    // on the crown, sets it down on step 4, hop to the landing, the screen lights.
    const loopR = keys(lap, [
      [0, 0],
      [0.13, 0],
      [0.21, 1, easeInOut],
      [0.255, 1],
      [0.275, 0.85, easeOut],
      [0.305, 1, easeInOut],
      [0.36, 1],
      [0.44, 2, UP],
      [0.51, 2],
      [0.59, 3, DOWN],
      [0.63, 3],
      [0.71, 4, easeInOut],
      [1, 4],
    ])
    const loopArch = keys(lap, [
      [0, 0],
      [0.3, 0],
      [0.33, 1, easeOut],
      [0.59, 1],
      [0.64, 0],
    ])
    const loopSeen = keys(lap, [
      [0, 0],
      [0.69, 0],
      [0.73, 1, easeOut],
      [0.88, 1],
      [0.93, 0],
    ])
    const loopFade = keys(lap, [
      [0, 0],
      [0.05, 1, easeOut],
      [0.89, 1],
      [0.95, 0, easeIn],
    ])
    // In from above, a startled hop back as step 3 fails, a small bounce on
    // landing from the arch, out upward at the end.
    const loopLift = keys(lap, [
      [0, 0.6],
      [0.06, 0, easeOut],
      [0.255, 0],
      [0.275, 0.2, easeOut],
      [0.305, 0, easeIn],
      [0.59, 0],
      [0.602, 0.07, easeOut],
      [0.616, 0, easeIn],
      [0.89, 0],
      [0.95, 0.4, easeIn],
    ])

    // The pointer chooses where the token goes; it travels there along the
    // route. The screen is picked in the rest pose (it rises far above the
    // plane); a station is chosen on the plane of the station tops (fixed, so
    // nothing flickers); the arch's upper half, picked in the rest pose,
    // parks the token on the crown, over the failed step.
    let want = null
    if (input.pick && input.pick(["screen"])) want = 4
    else {
      const aim = input.onPlane ? input.onPlane(TOP) : null
      if (aim && aim[0] > -1.3 && aim[0] < 9.5 && aim[1] > -1.0 && aim[1] < 1.7) want = clamp(Math.round(aim[0] / S), 0, 4)
      else if (input.pick && input.pick(["arch"])) want = 2
    }
    // A soft spring while the reader chooses (the route is long, and the
    // detour should be seen); a stiff one tracks the loop otherwise, so a
    // reader who comes in never sees the route replayed from a lagging spring.
    // The reader's weight comes in briskly and lets go gently, so the token
    // glides back to the loop rather than snapping to it.
    const soft = want !== null || (s.w ?? 0) > 0.02
    const pr = clamp(input.spring("r", want ?? loopR, soft ? { k: 40, c: 12 } : { k: 4000, c: 126 }), 0, 4)
    const w = clamp(input.spring("w", want === null ? 0 : 1, want === null ? { k: 30, c: 11 } : {}))
    if (!input.still) s.w = w
    const r = lerp(loopR, pr, w)
    const live = w > 0.5

    // Step 3's failure. The loop fails it at FAIL_AT and restores it at
    // BACK_AT; under the pointer it fails as the token reaches step 2 and comes
    // back when the token returns to step 1. Either way it fails with the same
    // blink and comes back with the same crossfade.
    const loopFailed = lap >= FAIL_AT && lap < BACK_AT
    const target = live ? pr > 0.85 : loopFailed
    let solid = 1
    let flick = false
    if (input.still) {
      // The poster, a static export or reduced motion: the loop by its clock,
      // the reader's choice at once.
      const tl = lap * T
      if (live) solid = target ? 0 : 1
      else if (loopFailed) {
        const age = tl - FAIL_AT * T
        flick = age < BLINK_LEN
        solid = flick ? 1 - blinkAt(age) : 0
      } else if (lap >= BACK_AT) solid = clamp((tl - BACK_AT * T) / RESTORE)
      // No live state is written here: the 2D view also runs tick() at the
      // still to find the rest pose for picking, on the live state.
    } else {
      if (s.failed === undefined) {
        s.failed = target
        s.failedAt = -99
      } else if (target !== s.failed) {
        s.failed = target
        s.failedAt = t
      }
      const age = t - s.failedAt
      if (s.failed) {
        flick = age < BLINK_LEN
        solid = flick ? 1 - blinkAt(age) : 0
      } else solid = clamp(age / RESTORE)
    }

    // The arch is lit from the moment it is the way on (waiting on step 2) until the token is across.
    const archK = lerp(loopArch, input.tween("arch", pr > 0.9 && pr < 2.95 ? 1 : 0), w)
    const seenK = lerp(loopSeen, input.tween("seen", pr > 3.85 ? 1 : 0), w)
    const fade = lerp(loopFade, 1, w)
    const lift = lerp(loopLift, 0, w)

    // The token.
    const [x, z] = route(r)
    groups.tok.off[0] = x - C[0]
    groups.tok.off[2] = z - (TOP + HT) + lift
    p.token.fade = fade
    p.token.glow = (input.still ? 0.42 : 0.3 + 0.18 * breathe(t, 2.4)) * (1 - 0.5 * seenK) * fade
    p.tokspill.at[0] = x
    p.tokspill.glow = 0.75 * (1 - clamp((z - TOP - HT) / 1.1)) * fade

    // Step 3: solid, blinking, dashed over its bare footprint, then crossfaded back.
    for (const id of ["step3", "lid3", "lid3b", "path3", "sock3"]) {
      p[id].hide = solid <= 0
      p[id].fade = solid
    }
    p.step3x.hide = p.hole.hide = solid >= 1
    p.step3x.fade = p.hole.fade = 1 - solid

    // The arch lights teal while it is the way through (its color holds while
    // any glow is left). Its own bloom stays faint: one extrude's bloom fills
    // its whole hull, opening included. Its light lands on steps 2 and 4.
    const archOn = archK > 0.01 ? 2 : 0
    p.arch.on = archOn
    p.arch.glow = 0.06 * archK
    for (let i = 0; i < JOINTS.length; i++) p[`joint${i}`].on = p[`joint${i}b`].on = archOn
    p.land2.glow = p.land4.glow = 0.62 * archK

    // The screen lights when the token reaches the landing: the value is seen.
    const seenOn = seenK > 0.01 ? 1 : 0
    p.glass.on = p.lamp.on = seenOn
    p.glass.glow = 0.6 * seenK
    p.lamp.glow = 0.5 * seenK
    p.seenspill.glow = 0.85 * seenK

    // The read-out names where the token is (or the failure, while it happens).
    s.state =
      fade < 0.5
        ? "rest"
        : r >= 3.9
          ? "value seen"
          : r >= 2.96
            ? "step 4"
            : flick
              ? "step 3 fails"
              : r > 1.04
                ? "detour"
                : r >= 0.5
                  ? "step 2"
                  : "step 1"
  },
  readout: (s) => s.state || "rest",
})
