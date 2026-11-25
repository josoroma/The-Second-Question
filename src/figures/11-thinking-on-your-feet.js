// Chapter 11, Thinking on your feet: the turn before the answer.
//
// A turntable bridge lies in a round pit. One track comes in at the front;
// four docks fan out behind, one for each kind of question. The bridge starts
// in line with the dock straight ahead, the answer that was ready, so the
// question runs straight across and into it. Nothing holds it there: the
// buffer sends it back onto the bridge ("that's not what I asked"). Now the
// bridge turns first, about two seconds with the question on it, and lines up
// with another dock. The question runs in, the gates shut behind it and the
// dock's lamp lights: settled.
//
// Light: magenta is the question, and the lamp of the dock that settles it.
// Teal is the first answer, the one that was ready: a dashed outline left
// where the question stopped the first time. At rest only those glow.
//
// The pointer sorts: aim at a dock and the question comes back to the bridge,
// the bridge turns, and the question runs in. Three docks send it back; one
// kind of answer settles it.

import { arc, breathe, clamp, cycle, easeIn, easeInOut, easeOut, figure, geometry, keys, rrect } from "../lib/iso/core.js"

const T = 10 // seconds per lap
const DEG = Math.PI / 180

// The docks, left to right, as azimuths; and what each kind is called.
const TH = [168, 206, 244, 282]
const KIND = ["judgment", "fact", "commitment", "challenge"]
const READY = 1 // the dock straight ahead of the incoming track
const RIGHT = 3 // the dock that settles this question
const IN = TH[READY] - 180 // the incoming track's azimuth

const H = 0.3 // top of the tracks, the bridge and the docks' platform
const PIT = 2.08 // the pit's radius
const BR = 1.96 // half the bridge's length
const BW = 1.16 // its width
const CW = 0.5 // the channel's width
const PA0 = 147.5 // the platform's two ends
const PA1 = 302.5
const PR = 4.74 // its outer radius

const Q = 0.78 // the question
const HINGE = 2.74 // a dock's walls start here
const WALL_Y = 0.56 // inner face of a dock's walls, off its axis
const WALL_T = 0.14
const WALL_H = 0.36
const PLUNGE = 3.96 // the face of a dock's plunger
const R_END = PLUNGE - Q / 2 // the question stops here
const R_IN = -3.55 // where it waits on the incoming track
const PUSH = 0.1 // how far a plunger gives
const LEAF = 0.61 // a gate leaf: two of them, shut, close the mouth

// Paint order within layer 0: the bridge, the light on it, the docks (the two
// middle ones stand further away), the entry, then the question when it is not
// inside a dock.
const D_BRIDGE = -10
const D_LIGHT = -9
const D_DOCK = [-4, -6, -6, -4]
const D_ENTRY = 1
const D_FREE = 3

// The side of each dock's axis that is nearer the viewer.
const SIDE = TH.map((th) => (Math.cos(th * DEG) - Math.sin(th * DEG) > 0 ? 1 : -1))

const sum = (c) => c[0] + c[1] + c[2]
const polar = (r, a, z = 0) => [r * Math.cos(a * DEG), r * Math.sin(a * DEG), z]
const flat = (pts, z = 0) => pts.map(([x, y]) => [x, y, z])
const toUV = (pts) => pts.map(([x, y]) => [x, -y])
const turn = ([x, y], a) => [x * Math.cos(a * DEG) - y * Math.sin(a * DEG), x * Math.sin(a * DEG) + y * Math.cos(a * DEG)]

/** A polyline with a length d cut from each end. */
function trim(poly, d0, d1) {
  const cut = (pts, d) => {
    const out = pts.slice()
    let left = d
    while (out.length > 1) {
      const [a, b] = out
      const l = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (l > left) {
        out[0] = [a[0] + ((b[0] - a[0]) * left) / l, a[1] + ((b[1] - a[1]) * left) / l]
        break
      }
      left -= l
      out.shift()
    }
    return out
  }
  return cut(cut(poly, d0).reverse(), d1).reverse()
}

/** A closed outline from edges that meet at corners, each corner softened over d. */
function outline(edges, d) {
  const n = edges.length
  const out = []
  edges.forEach((e, i) => {
    const t = trim(e, d[(i + n - 1) % n], d[i])
    out.push(...t)
    const c = e[e.length - 1]
    const next = trim(edges[(i + 1) % n], d[i], 0)[0]
    const p = t[t.length - 1]
    for (let k = 1; k < 8; k++) {
      const s = k / 8
      out.push([0, 1].map((j) => (1 - s) * (1 - s) * p[j] + 2 * s * (1 - s) * c[j] + s * s * next[j]))
    }
  })
  return out
}

/** The plate: a fan behind, the pit's round in the middle, a tongue under the incoming track. */
function plateShape(m) {
  const R = PR + 0.36 - m
  const r = PIT + 0.5 - m
  const a0 = PA0 - 5 + (m / R) * 57
  const a1 = PA1 + 5 - (m / R) * 57
  const w = 0.98 - m
  const end = 4.75 - m
  const half = Math.asin(w / r) / DEG
  const tongue = [
    [r * Math.cos(half * DEG), -w],
    [end, -w],
    [end, w],
    [r * Math.cos(half * DEG), w],
  ].map((q) => turn(q, IN))
  return outline(
    [
      arc(0, 0, R, a0, a1, 72),
      [polar(R, a1).slice(0, 2), polar(r, a1).slice(0, 2)],
      arc(0, 0, r, a1, 360 + IN - half, 24),
      [tongue[0], tongue[1]],
      [tongue[1], tongue[2]],
      [tongue[2], tongue[3]],
      arc(0, 0, r, IN + half, a0, 40),
      [polar(r, a0).slice(0, 2), polar(R, a0).slice(0, 2)],
    ],
    [0.4, 0.4, 0.36, 0.4, 0.4, 0.36, 0.4, 0.4]
  )
}

const PLATFORM = outline(
  [
    arc(0, 0, PR, PA0, PA1, 72),
    [polar(PR, PA1).slice(0, 2), polar(PIT, PA1).slice(0, 2)],
    arc(0, 0, PIT, PA1, PA0, 48),
    [polar(PIT, PA0).slice(0, 2), polar(PR, PA0).slice(0, 2)],
  ],
  [0.24, 0.08, 0.08, 0.24]
)

/** The lap without a pointer: the bridge's azimuth and the question's place along it. */
function lapAt(lap) {
  const a = keys(lap, [
    [0, TH[READY]],
    [0.38, TH[READY]],
    [0.56, TH[RIGHT], easeInOut],
    [0.93, TH[RIGHT]],
    [0.995, TH[READY], easeInOut],
    [1, TH[READY]],
  ])
  const r = keys(lap, [
    [0, R_IN],
    [0.04, R_IN],
    [0.185, R_END, easeInOut],
    [0.205, R_END + PUSH, easeOut],
    [0.22, R_END, easeIn],
    [0.32, 0, easeOut],
    [0.585, 0],
    [0.675, R_END, easeInOut],
    [1, R_END],
  ])
  const fade = keys(lap, [
    [0, 0],
    [0.03, 1, easeOut],
    [0.91, 1],
    [0.945, 0, easeIn],
    [1, 0],
  ])
  const shut = keys(lap, [
    [0, 0],
    [0.675, 0],
    [0.72, 1, easeInOut],
    [0.91, 1],
    [0.94, 0, easeInOut],
    [1, 0],
  ])
  const first = keys(lap, [
    [0, 0],
    [0.23, 0],
    [0.28, 1, easeOut],
    [0.9, 1],
    [0.94, 0],
    [1, 0],
  ])
  return { a, r, fade, shut, first }
}

/**
 * Under the pointer the machine is driven, one thing at a time: gates open,
 * the question comes back to the bridge, the bridge turns, the question runs
 * in. A dock that does not settle it sends it back once. When the pointer
 * leaves, the question fades, the bridge turns back to the lap and the lap
 * carries on. Returns null while the lap itself is in charge.
 */
function drive(s, want, lp, dt) {
  if (want === null && !s.live) return null
  if (!s.live) {
    s.live = true
    s.v = { ...lp, mode: "turn" }
    s.va = s.vr = 0
    s.k = null
  }
  const v = s.v
  if (want !== null && want !== s.k) {
    s.k = want
    s.sent = false
  }
  const step = (x, to, rate) => x + clamp(to - x, -rate * dt, rate * dt)
  const spring = (x, vel, to, w) => {
    const n = Math.max(1, Math.ceil(dt * 240))
    const h = dt / n
    for (let i = 0; i < n; i++) {
      vel += (-w * w * (x - to) - 2 * w * vel) * h
      x += vel * h
    }
    return [x, vel]
  }
  if (want === null) {
    v.fade = step(v.fade, 0, 5)
    v.shut = step(v.shut, 0, 5)
    v.first = step(v.first, 0, 4)
    if (v.fade < 0.02) {
      v.r = 0
      ;[v.a, s.va] = spring(v.a, s.va, lp.a, 10)
      // Join the lap where the question is at rest on the bridge or just appearing.
      if (Math.abs(v.a - lp.a) < 1.5 && v.shut < 0.02) {
        s.back = step(s.back ?? 0, 1, 4)
        v.a = lp.a
        v.r = lp.r
        const f = s.back
        if (f >= 1) {
          s.live = false
          s.back = 0
          return null
        }
        return { ...lp, fade: lp.fade * f, shut: lp.shut * f, first: lp.first * f, mode: "loop" }
      }
    }
    v.mode = "turn"
    return { ...v, mode: "loop" }
  }
  s.back = 0
  v.fade = step(v.fade, 1, 4)
  v.first = step(v.first, 0, 3)
  const to = TH[want]
  const lined = Math.abs(v.a - to) < 1
  const settles = want === RIGHT
  const goal = lined && !s.sent ? (settles ? R_END : R_END + PUSH) : 0
  if (v.shut > 0.02 && !(lined && settles)) v.shut = step(v.shut, 0, 3.5)
  else [v.r, s.vr] = spring(v.r, s.vr, goal, 7)
  if (lined || Math.abs(v.r) < 0.12) [v.a, s.va] = spring(v.a, s.va, to, lined ? 12 : 6.5)
  if (lined && !settles && v.r > R_END + 0.05) {
    s.sent = true
    s.vr = -2
  }
  if (lined && settles && v.r > R_END - 0.04) v.shut = step(v.shut, 1, 3)
  v.mode = !lined ? "turn" : settles && v.shut > 0.6 ? "settled" : s.sent ? "back" : "in"
  return v
}

export default figure({
  slug: "11-thinking-on-your-feet",
  title: "The turn before the answer",
  desc: "A turntable bridge lies in a round pit, with one track coming in and four docks fanned out behind it. The bridge has turned to the dock on the far right, where a glowing cube, the question, stands behind shut gates and a lit lamp. In the dock straight ahead of the incoming track only a dashed teal outline is left, where the question stopped first.",
  plate: "Thinking on your feet",
  sentence:
    "The viewer sees a question run straight ahead into the nearest dock and come back, wait on the bridge while it turns, and then run into another dock whose gates shut behind it, which explains sort first: a question is settled only by the kind of answer it asks for, so take two seconds to line up with the kind, and when it comes back, sort again.",
  view: { scale: 38, origin: [280, 226] },
  still: 8.0,
  build(k) {
    // Fix a part's place in the paint order, whatever its own centre says.
    const put = (part, d) => {
      part.bias = part.rest.bias = d - sum(geometry(part, k.groups).centre)
      return part
    }

    k.grid("board", { at: [-5.6, -5.6, -0.32], size: [11.2, 11.2], step: 0.7 })
    k.extrude("base", { at: [0, 0, 0], face: "+z", shape: toUV(plateShape(0)), depth: 0.32, layer: -3 })
    const lip = plateShape(0.2)
    k.detail("lip", { pts: flat([...lip, lip[0]]), layer: -2.9 })

    // The pit: its floor, the ring the bridge's ends run on, a low curb in front.
    k.face("pit", { pts: flat(arc(0, 0, PIT, 0, 354, 59), 0.002), role: "recess", layer: -2.8 })
    k.detail("race", { pts: flat(arc(0, 0, BR - 0.3, 0, 360, 72), 0.004), layer: -2.7 })
    const gap = (Math.asin(0.78 / PIT) / DEG)
    for (const [j, a0, a1] of [
      [0, PA1 - 360 + 1.5, IN - gap],
      [1, IN + gap, PA0 - 1.5],
    ])
      put(k.extrude(`curb${j}`, { at: [0, 0, 0.14], face: "+z", shape: toUV([...arc(0, 0, PIT + 0.2, a0, a1, 30), ...arc(0, 0, PIT, a1, a0, 30)]), depth: 0.14 }), D_ENTRY - 0.5)

    // The docks' platform, an arc round the back of the pit.
    k.extrude("platform", { at: [0, 0, H], face: "+z", shape: toUV(PLATFORM), depth: H, layer: -1 })

    // The incoming track.
    k.group("in", { at: [0, 0, 0] }).rz = IN
    put(k.block("entry", { at: [PIT + 0.02, -0.66, 0], size: [2.2, 1.32, H], r: 0.16, parent: "in" }), D_ENTRY)
    put(k.face("entryCh", { pts: flat([[PIT + 0.02, -CW / 2], [PIT + 2.22 - 0.12, -CW / 2], [PIT + 2.22 - 0.12, CW / 2], [PIT + 0.02, CW / 2]], H + 0.002), role: "recess", parent: "in" }), D_ENTRY + 0.1)

    // The bridge.
    k.group("br", { at: [0, 0, 0] })
    put(k.cyl("pivot", { at: [0, 0, 0], radius: 0.62, h: 0.12, n: 48 }), D_BRIDGE - 0.2)
    put(k.block("deck", { at: [-BR, -BW / 2, 0.1], size: [2 * BR, BW, H - 0.1], r: 0.14, parent: "br" }), D_BRIDGE)
    put(k.face("deckCh", { pts: flat([[-BR, -CW / 2], [BR, -CW / 2], [BR, CW / 2], [-BR, CW / 2]], H + 0.002), role: "recess", parent: "br" }), D_BRIDGE + 0.1)
    for (const [j, y] of [-0.42, 0.42].entries())
      put(k.detail(`deckSeam${j}`, { pts: [[-BR + 0.2, y, H + 0.003], [0, y, H + 0.003], [BR - 0.2, y, H + 0.003]], parent: "br" }), D_BRIDGE + 0.12)
    put(k.detail("deckRing", { pts: flat(arc(0, 0, 0.3, 0, 360, 36), H + 0.004), parent: "br" }), D_BRIDGE + 0.14)

    put(k.halo("spill", { at: [0, 0, H + 0.004], r: 1.15, on: 1, layer: 0 }), D_LIGHT)

    // Four docks: a channel, two walls, a plunger on a buffer, a lamp, two gate leaves.
    TH.forEach((th, i) => {
      const D = D_DOCK[i]
      const g = `d${i}`
      k.group(g, { at: [0, 0, 0] }).rz = th
      // Which of the two walls is the near one depends on the dock's azimuth.
      const near = SIDE[i]
      const rect = (x0, x1, w, z) => flat([[x0, -w], [x1, -w], [x1, w], [x0, w]], z)
      put(k.face(`ch${i}`, { pts: rect(PIT + 0.01, PLUNGE, CW / 2, H + 0.002), role: "recess", parent: g }), D - 0.6)
      if (i === RIGHT) put(k.halo("glow", { at: [R_END, 0, H + 0.004], r: 1.5, on: 1, layer: 0, parent: g }), D - 0.55)
      put(k.block(`buf${i}`, { at: [4.1, -WALL_Y - WALL_T, H], size: [0.3, 2 * (WALL_Y + WALL_T), 0.52], r: 0.1, parent: g }), D - 0.4)
      put(k.led(`lamp${i}`, { at: [4.25, 0, H + 0.524], face: "+z", r: 0.105, parent: g }), D - 0.39)
      put(k.block(`plu${i}`, { at: [PLUNGE, -0.3, H + 0.08], size: [0.12, 0.6, 0.34], r: 0.05, parent: g }), D - 0.3)
      for (const side of [-1, 1]) {
        const id = side === near ? "n" : "f"
        const y = side > 0 ? WALL_Y : -WALL_Y - WALL_T
        put(k.block(`wall${id}${i}`, { at: [HINGE, y, H], size: [1.42, WALL_T, WALL_H], r: 0.05, parent: g }), D + (side === near ? 0.3 : -0.35))
        // A leaf hangs on the wall's end; open, it lies in line with the wall.
        k.group(`h${id}${i}`, { at: [HINGE, side * (WALL_Y + WALL_T / 2), 0], parent: g })
        put(k.block(`leaf${id}${i}`, { at: [-LEAF, -0.05, H], size: [LEAF, 0.1, 0.36], r: 0.045, parent: `h${id}${i}` }), D + (side === near ? 0.25 : -0.32))
        put(k.cyl(`pin${id}${i}`, { at: [HINGE, side * (WALL_Y + WALL_T / 2), H], radius: 0.1, h: WALL_H + 0.06, n: 20, parent: g }), D + (side === near ? 0.32 : -0.3))
      }
    })

    // What is left of the first answer: where the question stopped, dashed.
    put(k.block("first", { at: [R_END - Q / 2, -Q / 2, H], size: [Q, Q, Q], r: 0.16, role: "ghost", on: 2, parent: `d${READY}` }), D_DOCK[READY])
    put(k.face("firstFoot", { pts: flat(rrect(R_END - Q / 2, -Q / 2, R_END + Q / 2, Q / 2, 0.16), H + 0.006), on: 2, parent: `d${READY}` }), D_DOCK[READY] - 0.5)

    // The question.
    k.group("q", { at: [0, 0, 0] })
    k.block("cube", { at: [-Q / 2, -Q / 2, H], size: [Q, Q, Q], r: 0.16, role: "accent", parent: "q" })
  },
  tick(t, s, input) {
    const { p, groups } = s
    // Fixed azimuths: groups reset to zero every frame.
    groups.in.rz = IN
    TH.forEach((th, i) => (groups[`d${i}`].rz = th))

    const lp = lapAt(cycle(t, T))

    // The pointer chooses a dock, on the platform's own plane.
    const aim = input.onPlane ? input.onPlane(H) : null
    let want = null
    if (aim) {
      const r = Math.hypot(aim[0], aim[1])
      const az = ((Math.atan2(aim[1], aim[0]) / DEG) % 360 + 360) % 360
      if (r > PIT - 0.3 && r < PR + 0.7 && az > PA0 - 6 && az < PA1 + 6) {
        want = 0
        for (let i = 1; i < 4; i++) if (Math.abs(az - TH[i]) < Math.abs(az - TH[want])) want = i
      }
    }

    let v = lp
    let mode = "loop"
    if (input.still) {
      if (want !== null) {
        v = { a: TH[want], r: want === RIGHT ? R_END : 0, fade: 1, shut: want === RIGHT ? 1 : 0, first: want === RIGHT ? lp.first : 0 }
        mode = want === RIGHT ? "settled" : "back"
        if (want !== RIGHT) s.k = want
      }
    } else {
      const live = drive(s, want, lp, input.dt || 0)
      if (live) {
        v = live
        mode = live.mode
      }
    }

    groups.br.rz = v.a
    groups.q.rz = v.a
    p.cube.off[0] = v.r
    p.cube.fade = v.fade
    p.cube.hide = v.fade < 0.02
    p.cube.glow = (input.still ? 0.4 : 0.3 + 0.16 * breathe(t, 2.4)) * v.fade

    // Which dock the question is in, if any; it sorts between that dock's walls.
    let k = -1
    TH.forEach((th, i) => {
      if (Math.abs(v.a - th) < 1.6 && v.r > 1.75) k = i
    })
    p.cube.bias = (k >= 0 ? D_DOCK[k] : D_FREE) - sum(geometry(p.cube, groups).centre)

    const [x, y] = polar(v.r, v.a)
    p.spill.at[0] = x
    p.spill.at[1] = y
    p.spill.bias = D_LIGHT - sum([x, y, H])
    p.spill.glow = 0.75 * v.fade * (1 - v.shut)

    // A plunger gives as the question meets it and sends it back.
    TH.forEach((th, i) => {
      p[`plu${i}`].off[0] = k === i ? Math.max(0, v.r - R_END) : 0
      const shut = i === RIGHT ? v.shut : 0
      const side = SIDE[i]
      // Leaves: in line with the walls when open, across the mouth when shut.
      groups[`hn${i}`].rz = side * 90 * shut
      groups[`hf${i}`].rz = -side * 90 * shut
      for (const id of ["n", "f"]) {
        const D = D_DOCK[i] + (shut > 0.3 ? 0.2 : id === "n" ? 0.25 : -0.32)
        p[`leaf${id}${i}`].bias = D - sum(geometry(p[`leaf${id}${i}`], groups).centre)
      }
    })
    p[`lamp${RIGHT}`].on = v.shut > 0.6 ? 1 : 0
    p[`lamp${RIGHT}`].glow = v.shut > 0.6 ? 0.6 * v.shut : 0
    p.glow.glow = 0.95 * v.shut
    for (const id of ["n", "f"]) p[`leaf${id}${RIGHT}`].on = v.shut > 0.9 ? 1 : 0

    p.first.hide = v.first < 0.02
    p.first.fade = v.first
    p.first.glow = 0.22 * v.first
    p.firstFoot.hide = v.first < 0.02
    p.firstFoot.fade = 0.28 * v.first

    const lap = cycle(t, T)
    if (mode === "loop")
      s.state =
        lap < 0.04
          ? "a question"
          : lap < 0.2
            ? "the ready answer"
            : lap < 0.36
              ? "not what I asked"
              : lap < 0.58
                ? "sort first"
                : lap < 0.715
                  ? KIND[RIGHT]
                  : lap < 0.91
                    ? `${KIND[RIGHT]}: settled`
                    : "rest"
    else s.state = mode === "settled" ? `${KIND[RIGHT]}: settled` : mode === "turn" ? "sort first" : mode === "back" ? `${KIND[s.k]}: sent back` : `${KIND[s.k]}?`
  },
  readout: (s) => s.state || "rest",
})
