// Chapter 30, Pressure and how to resist it: a limit left outside the walls.
//
// Two walls close in on a slider with slanted sides and squeeze it along the
// floor, the way a pip shoots from between two fingers. At the mark stands a
// stop. It stands on the same floor, between the same walls, so the slider
// pushes it along and both end far past the mark. The walls open, the slider
// comes back, and a chain is hooked on it. The chain runs out through the end
// of the room to a post on ground of its own. The walls close again and push
// as hard; the chain draws tight at the mark, the slider stops and the walls
// with it. What was inside moved. What held was out of their reach.
//
// Nothing is faked: the slider goes where its slanted sides send it, and the
// chain keeps its length, so it can only straighten.
//
// Light: teal is the chain and the post it was left with, once it is hooked.
// Magenta is the slider, the limit kept, while it stands at the mark under the
// push.
//
// The pointer pushes: the further along the room it points, the harder the
// walls close. The slider follows as far as the chain lets it.

import { breathe, clamp, cycle, easeIn, easeInOut, easeOut, figure, keys, lerp, ring, smooth } from "../lib/iso/core.js"

const T = 9.8 // seconds per lap
const X0 = -1.0 // the slider's back, at rest
const LEN = 1.5
const BACK_W = 0.42 // half its width there
const SLANT = 0.26 // how much wider it gets along the way
const FRONT_W = BACK_W + LEN * SLANT
const MARK = 0.95 // how far it may go
const FAR = 2.0 // how far it goes when nothing holds it
const SLIDER_H = 0.82
const WALL_H = 0.6
const NOSE = X0 + 0.95 // where the closing walls begin
const WALL_X1 = 3.1
const WALL_Y = 1.78 // their outside, open
const BEAM_Y = 1.9 // the fixed beams they are pushed from
const BEAM_W = 0.56
const STOP_W = 0.4 // the loose stop's depth
const STOP_X = X0 + LEN + MARK // it stands at the mark

// The chain: from a hook on the slider's back, through the end of the room at
// GATE, to the post.
const GATE = -1.75
const POST = -4.75
const HOOK = X0 - 0.06 // the hook's eye, at rest
const LINKS = 22
const CH_Z = 0.16
const CHAIN = HOOK + MARK - POST - 0.3 // its length: exactly enough to reach the mark
const LINK = CHAIN / LINKS

/** A bend that runs out and back once each way, of length len over a chord of d. */
function bend(len, d) {
  const chord = (a) => {
    let x = 0
    for (let i = 0; i < 48; i++) x += Math.cos(a * Math.sin(((i + 0.5) / 48) * Math.PI * 2)) / 48
    return x
  }
  let lo = 0
  let hi = 2.2
  const want = Math.min(1, d / Math.max(1e-6, len))
  for (let i = 0; i < 26; i++) {
    const mid = (lo + hi) / 2
    if (chord(mid) > want) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}

/** Points along the chain, from the hook: straight inside the room, slack outside it. */
function chainAt(hook) {
  const inside = hook - GATE
  const out = CHAIN - inside
  const d = GATE - (POST + 0.3)
  const a = bend(out, d)
  const steps = 160
  const pts = []
  let x = hook
  let y = 0
  const h = CHAIN / steps
  for (let i = 0; i <= steps; i++) {
    pts.push([x, y])
    const u = (i + 0.5) * h - inside
    const th = u <= 0 ? 0 : a * Math.sin((u / out) * Math.PI * 2)
    x -= h * Math.cos(th)
    y += h * Math.sin(th)
  }
  return (s) => {
    const q = clamp(s / h, 0, steps)
    const i = Math.min(steps - 1, Math.floor(q))
    return [lerp(pts[i][0], pts[i + 1][0], q - i), lerp(pts[i][1], pts[i + 1][1], q - i)]
  }
}

/** A long rounded link, centred on its middle. */
const linkShape = (l, w) => {
  const r = w / 2
  const pts = []
  for (let i = 0; i <= 8; i++) {
    const t = -Math.PI / 2 + (Math.PI * i) / 8
    pts.push([l / 2 - r + r * Math.cos(t), r * Math.sin(t)])
  }
  for (let i = 0; i <= 8; i++) {
    const t = Math.PI / 2 + (Math.PI * i) / 8
    pts.push([-l / 2 + r + r * Math.cos(t), r * Math.sin(t)])
  }
  return pts
}

/** A soft start, then an even pace: whatever ends it ends it at once. */
const drive = (u) => {
  const a = 0.3
  const v = 1 / (1 - a / 2)
  return u < a ? (v * u * u) / (2 * a) : v * (u - a / 2)
}

/** A polygon with its corners rounded (quadratic curves). */
const soft = (pts, r, steps = 8) => {
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
      out.push([(1 - t) ** 2 * s[0] + 2 * t * (1 - t) * b[0] + t * t * e[0], (1 - t) ** 2 * s[1] + 2 * t * (1 - t) * b[1] + t * t * e[1]])
    }
  }
  return out
}

// The lap, in seconds.
const loopPush = (lt) =>
  keys(lt, [
    [0, 0],
    [0.4, 0],
    [2.1, FAR, easeInOut], // nothing holds it
    [2.9, FAR],
    [3.8, 0, easeInOut],
    [4.7, 0],
    [5.8, MARK, drive], // the same push, on the chain
    [5.88, MARK - 0.022, easeOut],
    [5.98, MARK, easeIn],
    [8.6, MARK],
    [9.5, 0, easeInOut],
    [T, 0],
  ])
const HOOKED = 4.2
const FREED = 9.6

export default figure({
  slug: "30-pressure-and-how-to-resist-it",
  title: "The chain that leaves the room",
  desc: "Two walls have closed in on a slider with slanted sides, squeezing it along the floor. A chain runs from it through the open end of the room to a post on a plate of its own; it is drawn tight, lit teal, and the slider, glowing magenta, stands at a dashed mark. The loose stop that once stood at that mark has been pushed far down the room.",
  plate: "Pressure and how to resist it",
  sentence:
    "The viewer sees two walls squeeze a slider past a stop that stood in the room with it, then the same push end at the mark because a chain to a post outside draws tight, which explains where to leave your limits: with someone the push can't reach.",
  view: { scale: 37, origin: [306, 226] },
  still: 7.4,
  build(k) {
    k.grid("board", { at: [-6.4, -4.2, -0.3], size: [11.2, 8.4], step: 0.7 })
    k.block("base", { at: [-2.1, -2.72, -0.3], size: [5.75, 5.44, 0.3], r: 0.4, layer: -3 })
    ;[
      [-1.84, -2.46],
      [3.39, -2.46],
      [-1.84, 2.46],
      [3.39, 2.46],
    ].forEach(([x, y], i) => k.led(`screw${i}`, { at: [x, y, 0.002], face: "+z", r: 0.08, layer: -2 }))
    k.halo("spill", { at: [X0 + MARK + 0.9, 0.5, 0.004], r: 1.9, on: 1, layer: -1 })

    // Outside: a plate of its own, and the post.
    k.block("ground", { at: [-5.75, -1.25, -0.3], size: [3.2, 2.5, 0.3], r: 0.4, layer: -3 })
    k.halo("outside", { at: [POST, 0, 0.004], r: 1.7, on: 2, layer: -1 })
    k.cyl("foot", { at: [POST, 0, 0], radius: 0.56, h: 0.1, n: 40, layer: -0.5 })
    k.cyl("band", { at: [POST, 0, 0.1], radius: 0.33, h: 0.22, n: 36, layer: 0.2 })
    k.cyl("post", { at: [POST, 0, 0.32], radius: 0.26, h: 1.03, n: 32, layer: 0.205 })
    k.cyl("cap", { at: [POST, 0, 1.35], radius: 0.34, h: 0.22, n: 36, layer: 0.21 })

    // The end of the room: two pieces, with a way through for the chain.
    k.block("endB", { at: [GATE - 0.16, -1.95, 0], size: [0.32, 1.72, WALL_H], r: 0.08, layer: 0.3 })
    k.block("endF", { at: [GATE - 0.16, 0.23, 0], size: [0.32, 1.72, WALL_H], r: 0.08, layer: 0.7 })
    k.detail("sill0", { pts: [[GATE + 0.3, -0.16, 0.003], [1, -0.16, 0.003], [3.4, -0.16, 0.003]], layer: -2 })
    k.detail("sill1", { pts: [[GATE + 0.3, 0.16, 0.003], [1, 0.16, 0.003], [3.4, 0.16, 0.003]], layer: -2 })

    // The mark, and where the stop stood.
    const z = 0.004
    k.guide("mark", { pts: [[STOP_X, -1.0, z], [STOP_X, 0, z], [STOP_X, 1.0, z]], layer: -1.2 })
    k.block("stood", { at: [STOP_X + 0.02, -0.72, 0], size: [STOP_W, 1.44, 0.46], r: 0.08, role: "ghost", layer: 0.5 })
    k.block("stop", { at: [STOP_X + 0.02, -0.72, 0], size: [STOP_W, 1.44, 0.46], r: 0.08, layer: 0.52 })

    // The closing walls and what drives them.
    const x1 = WALL_X1
    const inY = (x) => BACK_W + (x - X0) * SLANT
    const wall = [
      [NOSE, inY(NOSE) + 0.06],
      [NOSE + 0.06, inY(NOSE + 0.06)],
      [x1, inY(x1)],
      [x1, WALL_Y],
      [NOSE, WALL_Y],
    ]
    for (const [n, s] of [["B", -1], ["F", 1]]) {
      k.group(n, { at: [0, 0, 0] })
      const L = s < 0 ? 0.35 : 0.8
      // shape u = x, v = -y
      k.extrude(`wall${n}`, { at: [0, 0, WALL_H], shape: soft(wall, 0.07).map(([x, y]) => [x, -s * y]), face: "+z", depth: WALL_H - 0.02, parent: n, layer: L + 0.02 })
      k.detail(`seam${n}`, { pts: [[NOSE + 0.2, s * (WALL_Y - 0.16), WALL_H + 0.002], [1.4, s * (WALL_Y - 0.16), WALL_H + 0.002], [x1 - 0.16, s * (WALL_Y - 0.16), WALL_H + 0.002]], parent: n, layer: L + 0.03 })
      k.block(`beam${n}`, { at: [NOSE + 0.1, s < 0 ? -BEAM_Y - BEAM_W : BEAM_Y, 0], size: [x1 - NOSE - 0.2, BEAM_W, WALL_H + 0.06], r: 0.1, layer: s < 0 ? L : L + 0.05 })
      for (const [i, x] of [0.6, 2.0].entries()) {
        // Behind, the rods stay with the beam and the wall slides along them;
        // in front they go with the wall into the beam.
        if (s < 0) k.extrude(`rod${n}${i}`, { at: [x, -1.24, 0.34], shape: ring(0, 0, 0.14, 22), face: "+y", depth: BEAM_Y - 1.24, layer: L + 0.01 })
        else k.extrude(`rod${n}${i}`, { at: [x, BEAM_Y + BEAM_W - 0.04, 0.34], shape: ring(0, 0, 0.14, 22), face: "+y", depth: BEAM_Y + BEAM_W - 0.04 - WALL_Y, parent: n, layer: L + 0.04 })
      }
    }

    // The slider.
    k.group("slider", { at: [0, 0, 0] })
    const body = [
      [X0, -BACK_W],
      [X0 + LEN, -FRONT_W],
      [X0 + LEN, FRONT_W],
      [X0, BACK_W],
    ]
    k.extrude("body", { at: [0, 0, SLIDER_H], shape: soft(body, 0.14), face: "+z", depth: SLIDER_H - 0.03, parent: "slider", layer: 0.6 })
    k.cyl("boss", { at: [X0 + 0.86, 0, SLIDER_H], radius: 0.3, h: 0.14, n: 36, parent: "slider", layer: 0.61 })
    k.cyl("eye", { at: [HOOK, 0, 0.06], radius: 0.15, h: 0.2, n: 24, parent: "slider", layer: 0.585 })

    // The chain.
    for (let i = 0; i < LINKS; i++) {
      const flat = i % 2 === 0
      k.extrude(`link${i}`, {
        at: [0, 0, CH_Z + (flat ? 0.045 : 0.08)],
        shape: linkShape(LINK * (flat ? 1.28 : 1.02), flat ? 0.17 : 0.08),
        face: "+z",
        depth: flat ? 0.09 : 0.16,
        layer: 0.4,
        sharp: 60,
      })
    }
  },
  tick(t, s, input) {
    const { p, groups } = s
    const lt = cycle(input.still ? t : t - (s.shift || 0), T) * T
    const b = input.still ? 0.5 : breathe(t, 2.8)
    const loop = loopPush(lt)

    // The pointer pushes, on the fixed plane of the slider's top; the chain is on.
    const at = input.onPlane ? input.onPlane(SLIDER_H) : null
    const over = !!at && at[0] > -2.3 && at[0] < 4.2 && Math.abs(at[1]) < 3
    const asked = over ? clamp((at[0] + 0.6) / 2.4) * FAR : 0

    let sl = loop
    let hooked = lt >= HOOKED && lt < FREED
    // The loose stop goes as far as it is pushed, and lies there till the lap ends.
    let carried = lt < 2.1 ? Math.max(0, loop - MARK) : lt < 8.7 ? FAR - MARK : lerp(FAR - MARK, 0, smooth(clamp((lt - 8.7) / 0.8)))
    if (input.still) {
      if (over) sl = Math.min(asked, MARK)
      hooked = hooked || over
    } else if (over || s.ptr) {
      if (!s.ptr) s.ptr = { v: loop, hooked, carried }
      const q = s.ptr
      // It is hooked, or freed, only back at the end of the room.
      const turn = q.hooked !== over
      const goal = turn ? 0 : over ? Math.min(asked, MARK) : 0
      const was = q.v
      q.v += (goal - q.v) * (1 - Math.exp(-(input.dt || 0) * 7))
      if (q.v > was && over && !turn && asked > MARK && q.v > MARK - 0.02) q.v = MARK
      if (turn && q.v < 0.03) q.hooked = over
      if (!over) q.carried *= Math.exp(-(input.dt || 0) * 5)
      sl = q.v
      hooked = q.hooked
      carried = Math.max(q.carried, sl - MARK)
      // Let go: everything is back where it began, and the lap starts over.
      if (!over && !q.hooked && q.v < 0.012 && q.carried < 0.012) {
        s.ptr = null
        s.shift = t
      }
    }

    // Strain: at the mark, under a push, the walls quiver and go no further.
    const tight = hooked && sl > MARK - 0.035 ? 1 : 0
    const force = tight * (over ? clamp((asked - MARK) / 0.6) : 1)
    const quiver = input.still ? 0 : force * 0.008 * Math.sin(t * 61)
    groups.slider.off[0] = sl
    const close = sl * SLANT
    groups.B.off[1] = close + quiver
    groups.F.off[1] = -close - quiver

    p.stop.off[0] = carried
    const moved = clamp(carried / 0.3)
    p.stood.hide = moved < 0.02
    p.stood.fade = moved

    // The chain hangs on the room's end until it is hooked, then goes with the slider.
    const hk = hooked ? HOOK + sl : HOOK
    const curve = chainAt(hk)
    for (let i = 0; i < LINKS; i++) {
      const c = p[`link${i}`]
      const q0 = curve(i * LINK)
      const q1 = curve((i + 1) * LINK)
      c.off[0] = (q0[0] + q1[0]) / 2
      c.off[1] = (q0[1] + q1[1]) / 2
      c.rz = (Math.atan2(q1[1] - q0[1], q1[0] - q0[0]) * 180) / Math.PI
      c.on = hooked ? 2 : 0
      c.glow = hooked ? 0.1 + 0.1 * tight : 0
      // Inside the room it runs in front of the back of the end wall, and behind the front.
      c.layer = (q0[0] + q1[0]) / 2 < GATE - 0.2 ? 0.25 : 0.58
      c.bias = 0
    }
    p.band.on = p.cap.on = hooked ? 2 : 0
    p.cap.glow = hooked ? 0.35 : 0
    p.outside.glow = hooked ? 0.75 : 0

    const lit = input.still ? tight : input.tween("lit", tight, { dur: tight ? 0.3 : 0.15 })
    p.body.on = lit > 0.4 ? 1 : 0
    p.body.glow = lit * (0.32 + 0.12 * b)
    p.boss.on = lit > 0.4 ? 1 : 0
    p.spill.glow = 0.8 * lit

    s.state = tight ? "held" : !hooked && sl > MARK + 0.05 ? "carried" : hooked ? "hooked" : sl > 0.05 ? "pushed" : "rest"
  },
  readout: (s) => s.state || "rest",
})
