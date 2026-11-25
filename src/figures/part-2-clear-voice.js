// Part II, Clear voice: a rest in the rhythm. A carriage keeps an even beat
// along a graduated spine. Beside it seven stations sit at equal steps: six
// pads and, in the middle, an open collar the size of a pad with a lamp sunk
// inside it. On each beat the stylus strikes the pad beneath it and the pad
// lights; over the collar there is nothing to strike: the stylus only nods,
// the carriage waits exactly one beat and the socket glows. The pause is
// counted, and the ticks keep the same spacing on both sides of it. A lap is
// seven beats: the carriage returns inside the seventh, so the next first
// beat falls on time.
//
// The pointer chooses a station. The carriage walks there on the beat, one
// station per beat, striking each pad it reaches and resting one beat at the
// collar; at the chosen station it keeps the beat. When the pointer leaves it
// carries on counting from wherever it stands.

import { arc, clamp, easeIn, easeInOut, easeOut, figure, keys, lerp, ring, rrect, smooth } from "../lib/iso/core.js"

const N = 7 // stations on the count line
const REST = 3 // the middle one is left open
const STEP = 1.1 // one step of the count, in world units
const Y = (i) => (REST - i) * STEP // the count runs from front left (1) to back right (7)
const YA = Y(0)
const YZ = Y(N - 1)

const PAD_R = 0.39
const PAD_H = 0.55
const RING_R = 0.27 // the pads' inner ring; the socket's lamp is the same size
const WELL_R = PAD_R + 0.12
const COLLAR_H = 0.24 // the open station: a collar of a pad's footprint, its lamp at the bottom
const COLLAR_IN = 0.28
const SEAM = 4 // degrees either side of the collar's seam, at its back

const SX0 = -2.3 // the spine, behind the row
const SX1 = -1.5
const SH = 1.3
const SY = 4.2 // half its length

const GAP = 0.3 // the stylus waits this far above a pad
const PRESS = 0.1 // how far a struck pad goes down
const REACH = GAP + PRESS // how far the stylus drops to strike
const NOD = 0.14 // over the open station it only nods: there is nothing to strike

const B = 0.9 // seconds per beat: the tempo
const T = N * B // a lap is seven beats
const MOVE = 0.26 // seconds the carriage takes for one step
const LEAVE = B - MOVE // when, within its beat, the carriage leaves for the next station
const BACK = 0.3 // in the seventh beat the carriage returns from here, the stylus up
const NEAR = 0.35 // a station answers only while the stylus is this close to it

const closed = (pts) => [...pts, pts[0]]
const flat = (pts, z = 0) => pts.map(([x, y]) => [x, y, z])
const mod = (v, m) => ((v % m) + m) % m

// Within a beat: the stylus drops and lifts...
const tapAt = (tau) =>
  keys(tau, [
    [0, 0],
    [0.05, 1, easeIn],
    [0.17, 1],
    [0.36, 0, easeOut],
  ])
// ...the pad lights on contact and fades as the carriage leaves...
const padAt = (tau) =>
  keys(tau, [
    [0.045, 0],
    [0.1, 1, easeOut],
    [LEAVE, 0.5],
    [LEAVE + 0.16, 0, easeOut],
  ])
// ...and at the open station the light rises with the beat and holds for the whole of it.
const restAt = (tau) =>
  keys(tau, [
    [0, 0],
    [0.14, 1, easeOut],
    [LEAVE, 1],
    [LEAVE + 0.2, 0, easeOut],
  ])

// A move from station a to n inside beat k: it starts at its leave time and lands on the next beat.
// A step snaps across one pitch; the carriage return glides, stylus up, at an even pace.
const leaveOf = (a, n) => (Math.abs(n - a) > 1 ? BACK : LEAVE)
const moveOf = (k, a, n) => ({ from: Y(a), to: n, t0: k * B + leaveOf(a, n), t1: (k + 1) * B, glide: Math.abs(n - a) > 1 })

// Where a move has the carriage at time t, and how fast it goes. A planned move
// eases from rest to rest; a steered one starts at the carriage's own speed
// (a cubic that ends at rest), so a change of course never jerks.
function track(m, t) {
  const D = m.t1 - m.t0
  const u = clamp((t - m.t0) / D)
  const y1 = Y(m.to)
  if (m.v0 === undefined) {
    const e = m.glide ? smooth(u) : easeInOut(u)
    const de = m.glide ? 6 * u * (1 - u) : u < 0.5 ? 12 * u * u : 12 * (1 - u) * (1 - u)
    return [lerp(m.from, y1, e), ((y1 - m.from) * de) / D]
  }
  const u2 = u * u
  const u3 = u2 * u
  const y = (2 * u3 - 3 * u2 + 1) * m.from + (u3 - 2 * u2 + u) * D * m.v0 + (3 * u2 - 2 * u3) * y1
  const v = ((6 * u2 - 6 * u) * m.from + (3 * u2 - 4 * u + 1) * D * m.v0 + (6 * u - 6 * u2) * y1) / D
  return [y, v]
}

// The lap without a pointer, as a function of time: beat k reads station k mod 7.
function lap(t) {
  const k = Math.floor(t / B)
  const a = mod(k, N)
  const n = (a + 1) % N
  return { a, m: t - k * B >= leaveOf(a, n) ? moveOf(k, a, n) : null }
}

// Live, the carriage remembers where it stands, so the pointer can steer it and
// the count carries on from there. Every move starts at a leave time and lands
// on a beat. A move under way can be steered once: a step away from the chosen
// station turns back, and the carriage return stops at the chosen station (or,
// when it is going too fast to stop there in time, at the first one past it).
function walk(t, s, target) {
  const k = Math.floor(t / B)
  const kb = k * B
  if (s.a === undefined || t < s.t || t - s.t > 2 * T) {
    const L = lap(t)
    s.a = L.a
    s.m = L.m
    s.t = t
  }
  const prev = s.t
  s.t = t
  if (s.m && t >= s.m.t1) {
    s.a = s.m.to
    s.m = null
  }
  const crossed = (x) => prev < kb + x && t >= kb + x
  if (!s.m) {
    if (target === null && s.a === N - 1 && crossed(BACK)) s.m = moveOf(k, s.a, 0)
    else if (crossed(LEAVE)) {
      const n = target === null ? Math.min(s.a + 1, N - 1) : s.a + Math.sign(target - s.a)
      if (n !== s.a) s.m = moveOf(k, s.a, n)
    }
    return
  }
  const m = s.m
  if (target === null || m.steered || target === m.to || t < m.t0 || m.t1 - t < 0.06) return
  const [y, v] = track(m, t)
  const steer = (to) => (s.m = { from: y, v0: v, to, t0: t, t1: m.t1, steered: true })
  if (Math.abs(Y(m.to) - m.from) < STEP + 1e-6) {
    // A single step: turn back if the chosen station lies behind it, early in the step.
    const away = Math.sign(m.to - s.a)
    if (Math.sign(target - s.a) !== away && (t - m.t0) / (m.t1 - m.t0) < 0.5) steer(s.a)
    return
  }
  // The carriage return: the stations still ahead, nearest first.
  const dir = Math.sign(Y(m.to) - y)
  const ahead = []
  for (let j = 0; j < N; j++) if ((Y(j) - y) * dir > 0.02) ahead.push(j)
  ahead.sort((p, q) => (Y(p) - Y(q)) * dir)
  const from = Math.max(0, ahead.indexOf(target))
  for (let q = from; q < ahead.length; q++) {
    const j = ahead[q]
    // A cubic from this speed to rest stays monotonic while speed x time <= 3 x distance.
    if (v * dir * (m.t1 - t) <= 3 * (Y(j) - y) * dir) {
      if (j !== m.to) steer(j)
      return
    }
  }
}

export default figure({
  slug: "part-2-clear-voice",
  title: "A rest in the rhythm",
  desc: "Beside a graduated spine on a base plate sit seven evenly spaced stations: six round pads and, in the middle, an open collar the size of a pad with a lamp sunk inside. A carriage on the spine stops over the collar for exactly one beat, as it does over every pad; nothing is struck there and the collar glows: the pause is counted. The ticks keep the same spacing on both sides of it.",
  plate: "Part II · Clear voice",
  sentence:
    "The viewer sees a carriage strike six pads at an even beat and, at the open station in the middle, strike nothing and wait exactly one beat while the socket glows, which explains a chosen pause: it is counted in the rhythm, one beat after the beat before it and one beat before the next, and the spacing does not change around it.",
  view: { scale: 36, origin: [306, 244] },
  still: REST * B + 0.3,
  build(k) {
    k.grid("board", { at: [-5.1, -6.0, -0.4], size: [8.6, 12], step: 0.7 })
    k.block("base", { at: [-3.0, -4.6, -0.4], size: [4.3, 9.2, 0.4], r: 0.45, layer: -3 })
    // A lip inset from the plate's edge, and a screw in each corner.
    k.detail("lip", { pts: flat(closed(rrect(-2.76, -4.36, 1.06, 4.36, 0.28))), layer: -2 })
    const screws = [
      [-2.52, -4.1],
      [0.82, -4.1],
      [-2.52, 4.1],
      [0.82, 4.1],
    ]
    screws.forEach(([x, y], j) => k.led(`screw${j}`, { at: [x, y, 0], face: "+z", r: 0.08, layer: -2 }))

    // Seven wells at equal steps, each tied to its tick on the spine by a witness line.
    for (let i = 0; i < N; i++) {
      k.face(`well${i}`, { at: [0, Y(i), 0], pts: flat(ring(0, 0, WELL_R, 40)), role: "recess", layer: -2 })
      k.guide(`wit${i}`, { pts: [[SX1 + 0.1, Y(i), 0], [-WELL_R - 0.07, Y(i), 0]], layer: -2 })
    }
    // The open station's lamp lies at the bottom of its collar, a lens of a pad's inner ring.
    k.face("lamp", { at: [0, 0, 0], pts: flat(ring(0, 0, RING_R, 40)), role: "glass", layer: -2, bias: 0.05 })
    k.detail("lens", { at: [0, 0, 0], pts: flat(closed(ring(0, 0, 0.15, 32))), layer: -2, bias: 0.1 })

    // Light spilled on the plate: teal under the pad that sounds, magenta around the socket.
    k.halo("beam", { at: [0, YA, 0], r: 1.05, on: 2, layer: -1 })
    k.halo("spill", { at: [0, 0, 0], r: 1.45, on: 1, layer: -1 })

    // The spine: the count line made solid, graduated at every step and half step.
    k.block("spine", { at: [SX0, -SY, 0], size: [SX1 - SX0, 2 * SY, SH], r: 0.16, layer: -0.5 })
    k.detail("track", { pts: [[(SX0 + SX1) / 2, -SY + 0.5, SH], [(SX0 + SX1) / 2, SY - 0.5, SH]], layer: -0.4 })
    const tick = (y, len, down) => [
      [SX1 - len, y, SH],
      [SX1, y, SH],
      [SX1, y, SH - down],
    ]
    for (let i = 0; i < N; i++) k.detail(`tick${i}`, { pts: tick(Y(i), 0.26, 0.44), layer: -0.4 })
    for (let i = 0; i < N - 1; i++) k.detail(`half${i}`, { pts: tick(Y(i) - STEP / 2, 0.12, 0.22), layer: -0.4 })
    k.detail("plinth", { pts: [[SX1, -SY + 0.2, 0.3], [SX1, SY - 0.2, 0.3]], layer: -0.4 })
    for (let j = 0; j < 3; j++)
      k.detail(`vent${j}`, { pts: [[SX0 + 0.22, SY, 0.5 + j * 0.14], [SX1 - 0.22, SY, 0.5 + j * 0.14]], layer: -0.4 })
    k.block("stopA", { at: [SX0, SY - 0.36, SH], size: [SX1 - SX0, 0.36, 0.42], r: 0.14 })
    k.block("stopB", { at: [SX0, -SY, SH], size: [SX1 - SX0, 0.36, 0.42], r: 0.14 })

    // Six pads; the middle station holds only a collar and the outline of the missing pad.
    for (let i = 0; i < N; i++) {
      if (i === REST) continue
      k.group(`pg${i}`, { at: [0, Y(i), 0] })
      k.cyl(`pad${i}`, { at: [0, 0, 0], radius: PAD_R, h: PAD_H, parent: `pg${i}` })
      k.detail(`ring${i}`, { pts: flat(closed(ring(0, 0, RING_R, 32)), PAD_H), parent: `pg${i}`, bias: 0.7 })
    }
    // The collar is open by a hairline at the back, away from the eye (a ring needs a seam to be drawn).
    const collar = [...arc(0, 0, PAD_R, 135 + SEAM, 495 - SEAM, 48), ...arc(0, 0, COLLAR_IN, 495 - SEAM, 135 + SEAM, 40)]
    k.extrude("collar", { at: [0, 0, COLLAR_H], face: "+z", shape: collar, depth: COLLAR_H })
    k.cyl("ghost", { at: [0, 0, COLLAR_H], radius: PAD_R, h: PAD_H - COLLAR_H, role: "ghost" })
    // When the rest is counted the light rises out of the collar and fills the missing pad's place.
    k.halo("crown", { at: [0, 0, PAD_H], r: 0.7, on: 1, layer: 0, bias: 0.3 })

    // The carriage: a saddle on the spine, an arm over the row, a head with a stylus.
    const BX0 = SX0 - 0.08
    const BX1 = SX1 + 0.08
    const BZ0 = SH - 0.16
    const BZ1 = SH + 0.6
    k.group("car", { at: [0, 0, 0] })
    k.block("body", { at: [BX0, -0.45, BZ0], size: [BX1 - BX0, 0.9, BZ1 - BZ0], r: 0.14, parent: "car" })
    k.detail("index", { pts: [[BX1, 0, BZ0 + 0.02], [BX1, 0, BZ0 + 0.36]], parent: "car", bias: 0.2 })
    for (let j = 0; j < 3; j++)
      k.detail(`bvent${j}`, { pts: [[BX0 + 0.22, 0.45, BZ1 - 0.18 - j * 0.12], [BX1 - 0.3, 0.45, BZ1 - 0.18 - j * 0.12]], parent: "car" })
    k.block("arm", { at: [BX1, -0.15, SH + 0.3], size: [0.12 - BX1, 0.3, 0.22], r: 0.08, parent: "car" })
    k.cyl("stylus", { at: [0, 0, PAD_H + GAP], radius: 0.075, h: 0.7, parent: "car", bias: -0.1 })
    k.cyl("nozzle", { at: [0, 0, SH - 0.22], radius: 0.15, h: 0.28, parent: "car" })
    k.block("head", { at: [-0.3, -0.3, SH + 0.06], size: [0.6, 0.6, 0.5], r: 0.13, parent: "car" })
    k.detail("seam", { pts: [[0.3, -0.18, SH + 0.36], [0.3, 0.18, SH + 0.36]], parent: "car", bias: 0.3 })
  },
  tick(t, s, input) {
    const { p, groups } = s

    // The pointer chooses a station, at a pad or at its tick on the spine. Both are fixed
    // planes (the spine's top, the pads' tops), so the choice never follows what moves.
    const top = input.onPlane ? input.onPlane(SH) : null
    const onSpine = top && top[0] >= SX0 && top[0] <= SX1 + 0.1 && Math.abs(top[1]) <= SY
    const aim = onSpine ? top : input.onPlane ? input.onPlane(PAD_H) : null
    const over = aim && aim[0] > SX0 - 0.7 && aim[0] < PAD_R + 1.1 && aim[1] > YZ - 1.4 && aim[1] < YA + 1.4
    const pick = over ? clamp(Math.round(REST - aim[1] / STEP), 0, N - 1) : null

    // Where the carriage is, which station it reads this beat, and how far into the beat.
    let a
    let y
    let tau = null
    if (input.still && pick !== null) {
      a = pick
      y = Y(pick)
    } else if (input.still) {
      const L = lap(t)
      a = L.a
      y = L.m ? track(L.m, t)[0] : Y(a)
      tau = t - Math.floor(t / B) * B
    } else {
      walk(t, s, pick)
      a = s.a
      y = s.m ? track(s.m, t)[0] : Y(a)
      tau = t - Math.floor(t / B) * B
    }
    groups.car.off[1] = y

    // A station answers only with the stylus over it, and only on the beat.
    const near = clamp(1 - Math.abs(y - Y(a)) / NEAR)
    let tap = 0
    let pad = 0
    let rest = 0
    let nod = 0
    if (tau === null) {
      if (a === REST) rest = 1
      else tap = pad = 1
    } else if (a === REST) {
      rest = restAt(tau) * near
      nod = tapAt(tau) * near
    } else {
      tap = tapAt(tau) * near
      pad = padAt(tau) * near
    }

    for (let i = 0; i < N; i++) {
      if (i === REST) continue
      const on = i === a && pad > 0.04
      p[`pad${i}`].on = p[`ring${i}`].on = p[`wit${i}`].on = on ? 2 : 0
      p[`pad${i}`].glow = on ? 0.2 + 0.5 * pad : 0
      // The pad gives only once the stylus meets it.
      groups[`pg${i}`].off[2] = i === a ? -PRESS * clamp((tap * REACH - GAP) / PRESS) : 0
    }
    p.stylus.off[2] = -(REACH * tap + NOD * nod)
    p.beam.at[1] = Y(a)
    p.beam.glow = a !== REST ? 0.85 * pad : 0

    // The rest: nothing is struck, and the socket glows for the whole beat.
    const restOn = rest > 0.04
    p.collar.on = p.lamp.on = p.lens.on = p.ghost.on = p[`wit${REST}`].on = restOn ? 1 : 0
    p.collar.glow = restOn ? 0.25 + 0.35 * rest : 0
    p.lamp.glow = restOn ? 0.35 + 0.55 * rest : 0
    p.spill.glow = 0.9 * rest
    p.crown.glow = 0.85 * rest

    const here = a === REST ? `${REST + 1} · pause` : `beat ${a + 1}`
    s.state = pick !== null && pick !== a ? `${here} → ${pick + 1}` : here
  },
  readout: (s) => s.state || "rest",
})
