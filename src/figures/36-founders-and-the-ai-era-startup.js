// Chapter 36, Founders and the AI-era startup. A round hub, the founder's one
// point, is set into a low rail that crosses a square plate: the review line.
// In front of the rail three leaf-shaped loop tracks fan out, an engineer's in
// the middle and an agent's on each side. Each token runs its loop and docks
// back at the hub, where a small teal lamp on the rim shows it home; no loop
// reaches the rail. Only when all three are back does the hub's top lamp
// light (the sign-off), and then one token leaves through a port in the hub's
// back wall, along the one railed channel past the line, to its stop: what
// ships. It lifts away, and the lap begins again.

import { cycle, easeIn, easeOut, figure, inside, keys, lerp, rrect, smooth } from "../lib/iso/core.js"

const T = 10 // seconds per lap
const DEG = Math.PI / 180
const PLATE = 3.5 // half the side of the square plate
const PAD_H = 0.1 // the loop tracks are thin plates on the base
const HUB_R = 1.0
const HUB_H = 0.56 // the hub's wall: the port runs through it
const TOP_R = 0.72 // the hub's top tier, which roofs the port
const TOP_H = 0.26
const DOCK_D = 1.32 // where a team token waits, from the hub's centre
const RAIL_W = 0.16 // the review line, built as a low rail
const RAIL_H = 0.22
const RAIL_END = 3.8 // its posts, from the hub's centre
const EXIT = 240 // the founder's line runs this way, behind the rail
const SLOT_W = 0.58 // the port, and the channel between the lips
const SLOT_IN = 0.28 // the port's inner end, from the hub's centre
const LIP_W = 0.12
const LIP_H = 0.16
const TOK = 0.42 // the ship token: side and height (it clears the port's roof)
const TOK_H = 0.38
const SHIP_FROM = SLOT_IN + TOK / 2 + 0.03 // its centre at the start, inside the port
const EXIT_END = 2.7 // its centre at the stop
const STOP_D = EXIT_END + TOK / 2 + 0.03 // the stop's near face
const LIFT = 1.0
const PUSH = 0.5 // seconds: the push out of the port...
const RUN = 1.7 // ...and the run to the stop
const BLEND = 0.9 // seconds to ease back into the lap when the pointer leaves
const HAND = 0.7 // seconds a token that was out takes to finish then
const SHOW_START = 0.36 // the lap's ship window: the token shows from here
const SHOW_END = 0.93 // until here
const MUTE_END = 0.95 // and its lamp is out by here

const along = (a, d, o = [0, 0]) => [o[0] + d * Math.cos(a * DEG), o[1] + d * Math.sin(a * DEG)]

/** A straight band in plan along angle a, from d0 to d1, w wide, its centreline moved `side` to the left. */
function band(a, d0, d1, w, side = 0) {
  const [nx, ny] = along(a + 90, 1)
  const o = [nx * side, ny * side]
  const [x0, y0] = along(a, d0, o)
  const [x1, y1] = along(a, d1, o)
  const px = (nx * w) / 2
  const py = (ny * w) / 2
  return [
    [x0 + px, y0 + py],
    [x1 + px, y1 + py],
    [x1 - px, y1 - py],
    [x0 - px, y0 - py],
  ]
}

/** The hub's wall in plan: a disc with a slot cut from SLOT_IN out to the rim, toward EXIT. */
function portRing() {
  const h = SLOT_W / 2
  const ah = Math.asin(h / HUB_R) / DEG
  const n = 44
  const pts = []
  for (let i = 0; i <= n; i++) pts.push(along(EXIT + ah + ((360 - 2 * ah) * i) / n, HUB_R))
  const [ex, ey] = along(EXIT, 1)
  const [px, py] = along(EXIT + 90, 1)
  pts.push([ex * SLOT_IN - px * h, ey * SLOT_IN - py * h], [ex * SLOT_IN + px * h, ey * SLOT_IN + py * h])
  return pts
}

/** A teardrop in plan: tip, then the far arc of a circle of radius R whose centre is D from the tip along th. */
function teardrop(tip, th, D, R, steps = 30) {
  const half = Math.asin(R / D) / DEG
  const c = along(th, D, tip)
  const a0 = th - half - 90
  const a1 = th + half + 90
  const pts = [tip.slice()]
  for (let i = 0; i <= steps; i++) pts.push(along(a0 + ((a1 - a0) * i) / steps, R, c))
  return pts
}

/** A route through plan points: the point at a fraction of its length, and the heading there. */
function route(pts) {
  const lens = [0]
  for (let i = 1; i < pts.length; i++) lens.push(lens[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const total = lens[lens.length - 1]
  const at = (f) => {
    const d = Math.min(1, Math.max(0, f)) * total
    let i = 1
    while (i < lens.length - 1 && lens[i] < d) i++
    const k = (d - lens[i - 1]) / Math.max(1e-9, lens[i] - lens[i - 1])
    return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k]
  }
  // A short chord, so the heading turns smoothly round the arc.
  const heading = (f, dl = 0.02) => {
    const a = at(f - dl)
    const b = at(f + dl)
    return Math.atan2(b[1] - a[1], b[0] - a[0]) / DEG
  }
  return { pts, total, at, heading }
}

/** Points of a circle in plan at height z, from angle a0 to a1 (degrees). */
const arcAt = (r, z, a0, a1, n = 24) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = (a0 + ((a1 - a0) * i) / n) * DEG
    return [r * Math.cos(a), r * Math.sin(a), z]
  })

/** An angle folded into [-45, 45): a square token looks the same turned by 90 degrees. */
const wrap90 = (a) => ((((a + 45) % 90) + 90) % 90) - 45

// The three loops. period: seconds per lap when sent round by the pointer;
// runs: when each lap of the loop starts and ends in the figure's own lap.
const LOOPS = [
  { id: "a1", name: "agent 1", th: 90, D: 2.35, R: 0.62, gR: 0.38, period: 1.6, runs: [[0.03, 0.16], [0.16, 0.29]] },
  { id: "eng", name: "engineer", th: 45, D: 3.1, R: 0.84, gR: 0.54, period: 3.4, runs: [[0.05, 0.33]] },
  { id: "a2", name: "agent 2", th: 0, D: 2.35, R: 0.62, gR: 0.38, period: 1.6, runs: [[0.07, 0.19], [0.19, 0.31]] },
]

/** How many laps of its loop a token has run at this point of the lap (fractional while it runs). */
function progress(lap, runs) {
  let u = 0
  for (const [a, b] of runs) {
    if (lap >= b) u += 1
    else {
      if (lap > a) u += smooth((lap - a) / (b - a))
      break
    }
  }
  return u
}

/** How far along the founder's line the ship token is, x seconds after it starts (0 in the port, 1 at the stop). */
const travel = (x) => (x <= 0 ? 0 : x < PUSH ? 0.25 * easeIn(x / PUSH) : 0.25 + 0.75 * easeOut((x - PUSH) / RUN))

/** The figure's own lap, as a pure function of time. A token's u counts every lap it has run, so it never jumps. */
function lapPose(t) {
  const lap = cycle(t, T)
  const done = Math.floor(t / T)
  return {
    u: LOOPS.map((lp) => done * lp.runs.length + progress(lap, lp.runs)),
    sign: keys(lap, [[0, 0], [0.318, 0], [0.356, 1, easeOut], [0.89, 1], [0.945, 0], [1, 0]]),
    v: travel((lap - 0.375) * T),
    shown: keys(lap, [[0, 0], [SHOW_START, 0], [0.38, 1], [0.86, 1], [SHOW_END, 0], [1, 0]]),
    dock: keys(lap, [[0, 0], [0.575, 0], [0.625, 1, easeOut], [0.86, 1], [0.94, 0], [1, 0]]),
    lift: keys(lap, [[0, 0], [0.85, 0], [0.93, LIFT, easeIn], [1, LIFT]]),
  }
}

/** A token's way home from u0: forward to the next dock (or back, if it has barely left), at `pace` times its usual speed. */
function homeward(u0, period, pace = 1) {
  const rem = Math.ceil(u0 - 0.2) - u0
  const dur = Math.abs(rem) < 1e-4 ? 0 : Math.max(0.3, (Math.abs(rem) * period) / pace)
  return { dur, at: (e) => (dur ? u0 + rem * smooth(e / dur) : u0) }
}

/** Distance run after e seconds from rest at one unit per second (a soft start). */
const glide = (e) => e - 0.25 * (1 - Math.exp(-e / 0.25))

const toShape = (ring) => ring.map(([x, y]) => [x, -y]) // plan (x, y) to a "+z" extrusion's (u, v)

export default figure({
  slug: "36-founders-and-the-ai-era-startup",
  title: "Every path returns to one point",
  desc: "A round hub is set into a low rail that crosses a square plate: the review line. In front of it three leaf-shaped loop tracks fan out; their tokens, an engineer's and two agents', are docked back at the hub, and three small teal lamps show them home. The hub's top lamp is lit magenta, and one magenta token has left through a port in its back, along the only channel past the rail.",
  plate: "Founders",
  sentence:
    "The viewer sees three tokens run their loops out of the founder's hub and back without reaching the review rail, and only then one token leave through the hub's port and cross the line to a stop, which explains that in a small AI-era company every path returns to the founder, and only the founder's sign-off goes past the line.",
  view: { scale: 39, origin: [280, 208] },
  still: 7.2,
  build(k) {
    k.grid("board", { at: [-5.25, -5.25, -0.32], size: [10.5, 10.5], step: 0.7 })
    k.block("base", { at: [-PLATE, -PLATE, -0.32], size: [2 * PLATE, 2 * PLATE, 0.32], r: 0.55, layer: -3 })
    const inset = rrect(-PLATE + 0.24, -PLATE + 0.24, PLATE - 0.24, PLATE - 0.24, 0.34)
    k.detail("seam", { pts: [...inset, inset[0]].map(([x, y]) => [x, y, 0]), layer: -2.5 })
    k.led("screwN", { at: [-(PLATE - 0.5), -(PLATE - 0.5), 0], face: "+z", r: 0.07, layer: -2.5 })
    k.led("screwS", { at: [PLATE - 0.5, PLATE - 0.5, 0], face: "+z", r: 0.07, layer: -2.5 })

    // The review line: a low rail across the plate, a post at each end, the hub its only gate.
    for (const [id, a] of [["railL", 135], ["railR", 315]]) {
      k.extrude(id, { at: [0, 0, RAIL_H], shape: toShape(band(a, HUB_R - 0.1, RAIL_END, RAIL_W)), face: "+z", depth: RAIL_H })
      const [x, y] = along(a, RAIL_END)
      k.cyl(`post${id.slice(-1)}`, { at: [x, y, 0], radius: 0.14, h: 0.46 })
    }

    // The loops: a leaf-shaped plate for each, with its loop drawn on it.
    const pads = []
    const routes = []
    for (const lp of LOOPS) {
      const pad = teardrop(along(lp.th, 0.2), lp.th, lp.D - 0.2, lp.R)
      pads.push(pad)
      k.extrude(`pad-${lp.id}`, { at: [0, 0, PAD_H], shape: toShape(pad), face: "+z", depth: PAD_H, layer: -2 })
      const tip = along(lp.th, DOCK_D)
      const r = route([...teardrop(tip, lp.th, lp.D - DOCK_D, lp.gR), tip])
      routes.push(r)
      k.wire(`loop-${lp.id}`, { pts: r.pts.map(([x, y]) => [x, y, PAD_H]), layer: -1.5 })
      k.halo(`spill-${lp.id}`, { at: [tip[0], tip[1], PAD_H], r: 0.6, on: 2, layer: -1 })
    }

    // The founder's line: a groove between two lips, from the hub's port to a stop.
    // Everything here lies low, so it paints before the token that runs on it.
    k.face("groove", { pts: band(EXIT, SLOT_IN, STOP_D, SLOT_W).map(([x, y]) => [x, y, 0.002]), role: "recess", layer: -2, bias: -3 })
    k.extrude("stop", { at: [0, 0, 0.3], shape: toShape(band(EXIT, STOP_D, STOP_D + 0.2, SLOT_W + 2 * LIP_W + 0.1)), face: "+z", depth: 0.3, layer: -2, bias: -2 })
    for (const [id, side] of [["lipA", SLOT_W / 2 + LIP_W / 2], ["lipB", -(SLOT_W / 2 + LIP_W / 2)]]) {
      k.extrude(id, { at: [0, 0, LIP_H], shape: toShape(band(EXIT, HUB_R - 0.12, STOP_D, LIP_W, side)), face: "+z", depth: LIP_H, layer: -2 })
    }
    const g0 = along(EXIT, HUB_R + 0.02)
    const g1 = along(EXIT, STOP_D - 0.02)
    const dk = along(EXIT, EXIT_END)
    k.wire("exit", { pts: [[g0[0], g0[1], 0.012], [g1[0], g1[1], 0.012]], layer: -1.5 })
    k.halo("dockSpill", { at: [dk[0], dk[1], 0], r: 1.05, on: 1, layer: -1 })

    // The hub: the founder's one point, on the line. A port runs through its
    // back wall under the top tier; a lamp on the rim for each loop shows its
    // token home; the top lamp is the sign-off.
    k.extrude("hubRing", { at: [0, 0, HUB_H], shape: toShape(portRing()), face: "+z", depth: HUB_H })
    k.detail("hubSeam", { pts: arcAt(HUB_R, 0.2, -45, 135), bias: -0.6 })
    for (const lp of LOOPS) {
      const [x, y] = along(lp.th, (HUB_R + TOP_R) / 2)
      k.led(`home-${lp.id}`, { at: [x, y, HUB_H], face: "+z", r: 0.07 })
    }
    // Both tiers are extruded discs, so the whole hub takes the same two tones.
    const disc = (r) => toShape(Array.from({ length: 48 }, (_, i) => along(i * 7.5, r)))
    k.extrude("hubTop", { at: [0, 0, HUB_H + TOP_H], shape: disc(TOP_R), face: "+z", depth: TOP_H })
    k.halo("lampSpill", { at: [0, 0, HUB_H + TOP_H], r: 0.62, on: 1, layer: 0, bias: 0.02 })
    k.cyl("lamp", { at: [0, 0, HUB_H + TOP_H], radius: 0.2, h: 0.24 })

    // The team's tokens: the engineer's a small block that turns with its track, the agents' pucks.
    k.cyl("tok-a1", { at: [0, 0, PAD_H], radius: 0.2, h: 0.18 })
    k.group("eng", { at: [0, 0, PAD_H] })
    k.block("tok-eng", { at: [-0.21, -0.21, 0], size: [0.42, 0.42, 0.3], r: 0.12, parent: "eng" })
    k.cyl("tok-a2", { at: [0, 0, PAD_H], radius: 0.2, h: 0.18 })

    // The ship token: what the founder signs leaves through the port, square to the channel.
    k.group("ship", { at: [0, 0, 0] })
    k.block("shipTok", { at: [-TOK / 2, -TOK / 2, 0], size: [TOK, TOK, TOK_H], r: 0.12, role: "accent", parent: "ship" })

    // How the engineer's block turns: with its track, and smoothly through the
    // turn at the dock, so it rests square to the hub.
    const er = routes[1]
    const n = er.pts.length
    const th = LOOPS[1].th
    const head = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]) / DEG
    const relOut = wrap90(head(er.pts[0], er.pts[1]) - th)
    const relIn = wrap90(head(er.pts[n - 2], er.pts[n - 1]) - th)
    const E = 0.07
    const turn = (f) => {
      if (f < E) return lerp(relIn, relOut, smooth((f + E) / (2 * E)))
      if (f > 1 - E) return lerp(relIn, relOut, smooth((f - 1 + E) / (2 * E)))
      return wrap90(er.heading(f) - th)
    }

    return { pads, routes, turn }
  },
  tick(t, s, input) {
    const { p, groups } = s
    const still = !!input.still

    // What the pointer is over. The hub is picked in the rest pose; the loop
    // plates and the far side of the line are tested on a plane that never moves.
    let hover = null
    if (input.pick && input.pick(["hubRing", "hubTop", "lamp"])) hover = "hub"
    const aim = hover === null && input.onPlane ? input.onPlane(PAD_H) : null
    if (aim) {
      s.pads.forEach((pad, i) => {
        if (hover === null && inside(aim, pad)) hover = i
      })
      if (hover === null && aim[0] + aim[1] < -0.3 && Math.abs(aim[0]) < PLATE && Math.abs(aim[1]) < PLATE) hover = "ship"
    }

    // Each mode is a pure function of the time since it began, starting from
    // the pose that was showing then, so nothing jumps and nothing lags.
    const mode = typeof hover === "number" ? hover : hover === "ship" ? "ship" : "lap"
    const lap = lapPose(t)
    if (s.mode === undefined) {
      s.mode = mode
      s.tm = t
      if (mode !== "lap") s.from = { ...lap, u: lap.u.slice() }
    }
    if (mode !== s.mode) {
      const was = s.pose || lap
      s.from = was
      s.mode = mode
      s.tm = t
      if (mode === "lap") {
        // Which lap of its loop each token joins. A token at home joins the
        // lap's run if that has only just begun, and otherwise sits it out; a
        // token out on its loop joins the nearest place ahead (or just behind).
        s.shift = lap.u.map((u, i) =>
          Math.abs(was.u[i] - Math.round(was.u[i])) < 1e-6 ? Math.floor(was.u[i] - u + 0.12) : Math.ceil(was.u[i] - u - 0.12)
        )
        // A token ahead of its place in the lap waits for the lap to catch up,
        // when the lap's token will pass it on this run; otherwise (it has
        // barely left a dock where the lap's token sits) it steps back.
        s.hold = lap.u.map((u, i) => {
          const target = u + s.shift[i]
          const reach = Math.ceil(u - 1e-9) + s.shift[i]
          return target < was.u[i] && was.u[i] <= reach + 1e-9 ? was.u[i] : null
        })
        // The ship token's fate is decided once, here. A token that is out
        // finishes where it is (it lifts away from the stop, or fades on the
        // line); it never runs backward. The lap's own token, and its lamp,
        // stay off for the rest of the lap's ship window if the token is
        // showing now, or would show while the old one finishes.
        s.hand = was.shown > 0.02 ? { v: was.v, lift: was.lift, shown: was.shown, dock: was.dock, away: was.dock > 0.5 || was.lift > 0.05 } : null
        const ph = cycle(t, T)
        const soon = ph < SHOW_END && ph + HAND / T > SHOW_START
        s.mute = lap.shown > 0.02 || (s.hand && soon) ? (Math.floor(t / T) + MUTE_END) * T : -Infinity
      }
    }
    const el = Math.max(0, t - (s.tm ?? t))
    const from = s.from || lap

    // Where the team's tokens are at time tt in this mode (a pure function of
    // tt, so it can be asked a moment ahead and behind).
    const teamU = (tt) => {
      const e = Math.max(0, tt - (s.tm ?? tt))
      const lu = lapPose(tt).u
      if (mode === "lap") {
        if (!s.from || still) return lu
        // Back to the lap: ease from the pose the pointer left, along each track.
        const k = smooth(e / BLEND)
        return lu.map((u, i) => {
          const base = lerp(from.u[i], u + s.shift[i], k)
          return s.hold[i] === null ? base : Math.max(s.hold[i], base)
        })
      }
      if (typeof mode === "number") {
        // A hovered loop: its token runs round from where it is; the rest go home.
        return LOOPS.map((lp, i) =>
          i === mode
            ? still
              ? Math.round(from.u[i]) + 0.45
              : from.u[i] + glide(e) / lp.period
            : still
              ? Math.round(from.u[i])
              : homeward(from.u[i], lp.period).at(e)
        )
      }
      // The far side: everyone comes home, a little faster than they run.
      return LOOPS.map((lp, i) => (still ? Math.round(from.u[i]) : homeward(from.u[i], lp.period, 1.8).at(e)))
    }

    let pose
    if (mode === "lap") {
      pose = { ...lap, u: teamU(t) }
      if (s.from && !still) {
        pose.sign = lerp(from.sign, t < s.mute ? 0 : lap.sign, smooth(el / BLEND))
        if (s.hand && el < HAND) {
          const e = el / HAND
          const h = s.hand
          pose.v = h.v
          pose.lift = h.away ? lerp(h.lift, Math.max(h.lift, LIFT), easeIn(e)) : h.lift
          pose.shown = h.shown * (1 - smooth(e))
          pose.dock = h.dock * (1 - smooth(e))
        } else if (t < s.mute) {
          pose.shown = 0
          pose.dock = 0
        }
      }
    } else if (typeof mode === "number") {
      // A hovered loop: the lamp and the ship token fade where they are.
      const fade = 1 - smooth(el / 0.35)
      pose = {
        u: teamU(t),
        sign: still ? 0 : from.sign * fade,
        shown: still ? 0 : from.shown * fade,
        dock: still ? 0 : from.dock * fade,
        v: from.v,
        lift: from.lift,
      }
    } else {
      // The far side: everyone comes home first, then the lamp, then one token ships.
      const ways = LOOPS.map((lp, i) => homeward(from.u[i], lp.period, 1.8))
      const u = teamU(t)
      const onWay = from.shown > 0.02 && from.lift < 0.001 && from.sign > 0.5
      if (still) pose = { u, sign: 1, shown: 1, v: 1, dock: 1, lift: 0 }
      else if (onWay) {
        // Already on its way: it carries on to the stop.
        const dur = Math.max(0.3, (PUSH + RUN) * (1 - from.v))
        pose = {
          u,
          sign: lerp(from.sign, 1, smooth(el / 0.3)),
          shown: Math.max(from.shown, smooth(el / 0.25)),
          lift: 0,
          v: lerp(from.v, 1, easeOut(el / dur)),
          dock: Math.max(from.dock, smooth((el - dur + 0.2) / 0.3)),
        }
      } else {
        const start = Math.max(...ways.map((w) => w.dur), from.shown > 0.02 ? 0.3 : 0)
        const e = el - start
        pose = {
          u,
          sign: e < 0 ? from.sign : Math.max(from.sign, smooth(e / 0.35)),
          shown: e < 0 ? from.shown * (1 - smooth(el / 0.3)) : smooth((e - 0.15) / 0.2),
          v: e < 0 ? from.v : travel(e - 0.35),
          lift: e < 0 ? from.lift : 0,
          dock: e < 0 ? from.dock * (1 - smooth(el / 0.3)) : smooth((e - 0.35 - PUSH - RUN + 0.2) / 0.3),
        }
      }
    }
    s.pose = { ...pose, u: pose.u.slice() }

    // Tokens on their loops. A token at work, and its loop, light teal: one
    // off its dock now or a moment either side (so one that only touches its
    // dock on the way round stays lit), and the hovered one always. A token
    // at rest at home is quiet, and its lamp on the hub's rim is lit.
    const out = (u) => Math.abs(u - Math.round(u)) > 0.004
    const ahead = still ? pose.u : teamU(t + 0.12)
    const behind = still ? pose.u : teamU(Math.max(s.tm ?? t, t - 0.12))
    const away = pose.u.map((u, i) => (typeof mode === "number" && mode === i && !still) || out(u) || out(ahead[i]) || out(behind[i]))
    LOOPS.forEach((lp, i) => {
      const f = pose.u[i] - Math.floor(pose.u[i])
      const [x, y] = s.routes[i].at(f)
      const tok = p[`tok-${lp.id}`]
      if (lp.id === "eng") {
        groups.eng.off[0] = x
        groups.eng.off[1] = y
        groups.eng.rz = s.turn(f)
      } else {
        tok.at[0] = x
        tok.at[1] = y
      }
      tok.on = away[i] ? 2 : 0
      tok.glow = away[i] ? 0.38 : 0
      p[`loop-${lp.id}`].on = away[i] ? 2 : 0
      const spill = p[`spill-${lp.id}`]
      spill.at[0] = x
      spill.at[1] = y
      spill.glow = away[i] ? 0.8 : 0
      const home = p[`home-${lp.id}`]
      home.on = away[i] ? 0 : 2
      home.glow = away[i] ? 0 : 0.5
    })

    // The top lamp lights when everyone is back.
    p.lamp.on = pose.sign > 0.5 ? 1 : 0
    p.lamp.glow = pose.sign * 0.62
    p.lampSpill.glow = pose.sign * 0.85

    // The ship token: out of the port, along the channel, to the stop, away.
    const d = SHIP_FROM + pose.v * (EXIT_END - SHIP_FROM)
    const [sx, sy] = along(EXIT, d)
    groups.ship.off[0] = sx
    groups.ship.off[1] = sy
    groups.ship.off[2] = pose.lift
    groups.ship.rz = EXIT - 270
    p.shipTok.fade = pose.shown
    p.shipTok.hide = pose.shown < 0.02
    p.shipTok.glow = pose.shown * (0.3 + 0.32 * pose.dock)
    const lineLive = pose.sign > 0.5 && pose.shown > 0.5
    p.exit.on = lineLive ? 1 : 0
    p.exit.flow = lineLive && !still ? { period: 1.3 } : null
    p.dockSpill.glow = pose.dock * 0.95

    // The read-out names the hovered part, or the stage, read from the pose itself.
    const busy = away.some(Boolean)
    const gone = pose.lift > 0.05 && pose.shown <= 0.05
    const stage =
      pose.shown > 0.05 && (pose.dock > 0.5 || pose.lift > 0.05)
        ? "ships"
        : pose.sign > 0.5 && !gone
          ? "signed"
          : mode === "ship"
            ? "waiting"
            : busy
              ? "loops out"
              : "rest"
    s.state = hover === "hub" ? "founder" : typeof mode === "number" ? LOOPS[mode].name : stage
  },
  readout: (s) => s.state || "rest",
})
