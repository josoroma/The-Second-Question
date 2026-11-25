// Chapter 32, Seeing the system: three necks in one channel, and who waits at
// which.
//
// A channel three lanes wide comes down three terraces. At the foot of each
// stands a neck: three shutters that can sink into the floor, and as many
// lanes are open as shutters are down. Each neck has one lane open. Blocks
// come in at the top, go down, and come in again. A neck lets one through in
// each open lane at every stroke, so they stand before the first one, a pile,
// and one a stroke goes on. Then the first neck opens wide. Its pile goes
// through at once, three abreast, and stands again before the second neck,
// where nobody was waiting. What leaves at the bottom hasn't changed: one a
// stroke, the pace of the neck that is still narrow.
//
// Nothing is drawn by hand: the blocks move by one rule (forward if the place
// ahead is free, into the open lane if theirs is shut), and the lap is that
// rule run until it repeats.
//
// Light: teal is the wait that was ended, the first pile, and the dashed
// outline of where it stood. Magenta is who waits next. At rest only those
// glow.
//
// The pointer opens necks: aim at one and it opens wide, with every neck
// before it. The pile goes to the next one that is still narrow; only with the
// last one open does the pace change.

import { breathe, clamp, easeInOut, easeIn, figure, lerp, rrect, smooth } from "../lib/iso/core.js"

// The channel.
const P = 0.67 // one lane, and one place along it
const COLS = 4 // places on a terrace
const NECK = 0.42 // the neck's depth, along the channel
const ZP = COLS * P + NECK // one terrace
const DROP = 0.56
const OUT = 2 // places below the last neck
const X = (z) => z * ZP
const Z = (z) => (3 - z) * DROP
const W = 0.54 // a block
const H = 0.5
const HALF = 1.5 * P // half the channel
const SIDE = HALF + 0.42 // half the machine
const SHUT = 0.42 // a shutter's height
const XN = (k) => X(k) + COLS * P + 0.06 // where neck k's shutters stand
const SHUT_D = 0.25
const X_END = X(3) + OUT * P + 0.25
const X_IN = -0.62

// The clock: a beat moves a block one place; a neck lets through on every second beat.
const BEAT = 0.25
const LAP = 36 // beats: nine seconds
const N = 14 // blocks

// The rule.
const START = [
  [0, 3, 0], [0, 3, 1], [0, 3, -1], [0, 2, 0], [0, 2, 1], [0, 2, -1], [0, 1, 0], [0, 1, 1],
]
const NARROW = [[0], [0], [0]]
const WIDE = [-1, 0, 1]
const key = (z, c, l) => z * 100 + c * 10 + l + 1

/** One beat: the blocks' next places. `open[k]` lists the open lanes of neck k. */
function step(blocks, open, beat) {
  const next = blocks.map((b) => ({ ...b, from: b.z < 0 ? null : [b.z, b.c, b.l], moved: false }))
  const occ = new Set(next.filter((b) => b.z >= 0).map((b) => key(b.z, b.c, b.l)))
  const free = (z, c, l) => l >= -1 && l <= 1 && !occ.has(key(z, c, l))
  const go = (b, z, c, l) => {
    // Moving across, it keeps its old place, and the corner it turns, until the beat is over.
    const across = z === b.z && l !== b.l
    if (across && c !== b.c) occ.add(key(b.z, b.c, l))
    if (!across) occ.delete(key(b.z, b.c, b.l))
    if (z !== b.z) b.lit = false
    b.z = z
    b.c = c
    b.l = l
    b.moved = true
    if (z >= 0) occ.add(key(z, c, l))
  }
  const at = (z, c, l) => next.find((b) => b.z === z && b.c === c && b.l === l && !b.moved)
  for (let c = OUT - 1; c >= 0; c--)
    for (const l of WIDE) {
      const b = at(3, c, l)
      if (!b) continue
      if (c === OUT - 1) go(b, -1, 0, 0)
      else if (free(3, c + 1, l)) go(b, 3, c + 1, l)
    }
  for (let z = 2; z >= 0; z--) {
    const F = COLS - 1
    if (beat % 2 === 0)
      for (const l of open[z]) {
        const b = at(z, F, l)
        if (b && free(z + 1, 0, l)) go(b, z + 1, 0, l)
      }
    // An open lane's front place is filled in turn: from either side, or from behind.
    const turn = Math.floor(beat / 2) % 3
    for (const l of open[z]) {
      const ways = [
        [F, l - 1],
        [F, l + 1],
        [F - 1, l],
      ]
      for (let j = 0; j < 3 && free(z, F, l); j++) {
        const [c, m] = ways[(turn + j) % 3]
        if (c === F && open[z].includes(m)) continue
        const b = at(z, c, m)
        if (b) go(b, z, F, l)
      }
    }
    for (let c = F - 1; c >= 0; c--)
      for (const l of [0, 1, -1]) {
        const b = at(z, c, l)
        if (!b) continue
        if (free(z, c + 1, l)) go(b, z, c + 1, l)
        else {
          const m = (l === 0 ? [1, -1] : [0]).find((q) => free(z, c + 1, q) && free(z, c, q))
          if (m !== undefined) go(b, z, c + 1, m)
        }
      }
  }
  for (const l of [0, 1, -1]) {
    const b = next.find((q) => q.z === -1 && !q.moved && q.still > 0)
    if (b && free(0, 0, l)) go(b, 0, 0, l)
  }
  // Who waits: whoever has stood still for two beats, until it is through its neck.
  for (const b of next) {
    b.still = b.moved ? (b.lit ? 2 : 0) : b.still + 1
    if (b.z >= 0 && b.z < 3 && b.still >= 2) b.lit = true
    if (b.z < 0 || b.z === 3) b.lit = false
  }
  return next
}

// The lap's first neck: one lane, wide, shut until the second pile is gone.
const OPEN0 = 8
const OPEN1 = 20
const SHUT1 = 32
const LEAD = 2
const first = (beat) => (beat < OPEN0 ? [0] : beat < OPEN1 ? WIDE : beat < SHUT1 ? [] : [0])
const wide = (k) => NARROW.map((o, n) => (n <= k ? WIDE : o))
const lapOpen = (beat) => [first(beat), NARROW[1], NARROW[2]]

/** The lap, run until it repeats: the blocks after every beat. */
const STATES = (() => {
  let b = Array.from({ length: N }, (_, i) => (i < START.length ? { z: START[i][0], c: START[i][1], l: START[i][2], still: 2, lit: true, from: null } : { z: -1, c: 0, l: 0, still: 0, lit: false, from: null }))
  for (let lap = 0; lap < 6; lap++) for (let i = 0; i < LAP; i++) b = step(b, lapOpen(i), i)
  const out = [b]
  for (let i = 0; i < LAP; i++) out.push((b = step(b, lapOpen(i), i)))
  return out
})()
/** With necks 0..k wide: the blocks once they have settled (for reduced motion). */
const settled = {}
const settle = (k) => {
  if (!settled[k]) {
    let b = STATES[0]
    for (let i = 0; i < LAP * 2; i++) b = step(b, wide(k), i)
    settled[k] = b
  }
  return settled[k]
}
const sig = (blocks) =>
  blocks
    .map((b) => (b.z < 0 ? -1 : key(b.z, b.c, b.l) * 2 + (b.lit ? 1 : 0)))
    .sort((a, b) => a - b)
    .join(",")

/** Where a place is, in the world: its centre on the floor. */
const place = (z, c, l) => [X(z) + (c + 0.5) * P, l * P, Z(z)]

export default figure({
  slug: "32-seeing-the-system",
  title: "The pile that moved to the next neck",
  desc: "A channel comes down three terraces with a neck of shutters at the foot of each. The first neck stands wide open and nobody waits there any more: a dashed teal outline shows where the pile stood. The blocks, lit magenta, are piled before the second neck, which has one lane open; beyond it they still leave one at a time.",
  plate: "Seeing the system",
  sentence:
    "The viewer sees the first neck of a channel opened wide and its pile go through, only to stand again before the second neck while the blocks still leave one at a time, which explains why, before you end one wait, you find out who waits next.",
  view: { scale: 32.5, origin: [137, 172] },
  still: 4.6,
  build(k) {
    k.grid("board", { at: [-1.5, -3.2, -0.3], size: [13.3, 6.4], step: 0.7 })
    // The terraces: one stair.
    const stair = [[X_IN, -0.3], [X_END, -0.3], [X_END, 0]]
    for (let z = 3; z >= 1; z--) stair.push([X(z), Z(z)], [X(z), Z(z - 1)])
    stair.push([X_IN, Z(0)])
    k.extrude("stair", { at: [0, SIDE, 0], shape: stair, face: "+y", depth: 2 * SIDE, layer: -5 })
    const side = [[X_IN + 0.14, -0.16], [X_END - 0.14, -0.16]]
    k.detail("skirt", { pts: [...side, side[0]].map(([x, z]) => [x, SIDE + 0.003, z]), layer: -4.9 })
    for (let z = 0; z < 3; z++)
      for (let j = 0; j < 4; j++) {
        const x = X(z) + 0.5 + j * 0.22
        k.detail(`vent${z}${j}`, { pts: [[x, SIDE + 0.003, Z(z) - 0.2], [x, SIDE + 0.003, Z(z) - 0.31], [x, SIDE + 0.003, Z(z) - 0.42]], layer: -4.9 })
      }
    for (let z = 0; z < 4; z++) {
      const x0 = z ? X(z) : X_IN + 0.5
      const x1 = z < 3 ? XN(z) - 0.06 : X_END
      const zz = Z(z) + 0.002
      k.face(`bed${z}`, { pts: [[x0, -HALF - 0.04, zz], [x1, -HALF - 0.04, zz], [x1, HALF + 0.04, zz], [x0, HALF + 0.04, zz]], role: "recess", layer: -4 })
      // Lane lines.
      for (const s of [-0.5, 0.5]) k.detail(`lane${z}${s}`, { pts: [[x0, s * P, zz + 0.002], [(x0 + x1) / 2, s * P, zz + 0.002], [x1, s * P, zz + 0.002]], layer: -3.9 })
      // Rails.
      for (const [j, y] of [-HALF - 0.2, HALF + 0.06].entries()) k.block(`rail${z}${j}`, { at: [x0, y, Z(z)], size: [(z < 3 ? X(z) + COLS * P : X_END - 0.1) - x0, 0.14, 0.14], r: 0.04, layer: j ? 1 : -3 })
    }
    // Where the blocks come in.
    k.block("mouth", { at: [X_IN, -HALF - 0.2, Z(0)], size: [0.5, 2 * HALF + 0.4, 0.95], r: 0.12, layer: -2 })
    k.face("in", { pts: [[0, -HALF + 0.03, 0.02], [0, HALF - 0.03, 0.02], [0, HALF - 0.03, 0.66], [0, -HALF + 0.03, 0.66]], at: [X_IN + 0.503, 0, Z(0)], role: "recess", layer: -1.9 })

    // The necks.
    for (let n = 0; n < 3; n++) {
      for (const s of [-1, 1]) k.block(`post${n}${s}`, { at: [XN(n) - 0.04, s > 0 ? HALF + 0.02 : -HALF - 0.28, Z(n)], size: [SHUT_D + 0.08, 0.24, SHUT + (s > 0 ? 0.06 : 0.2)], r: 0.07, layer: 0 })
      for (const l of WIDE) {
        const g = 0.015
        k.face(`slot${n}${l}`, { pts: rrect(XN(n) - 0.02, l * P - P / 2, XN(n) + SHUT_D + 0.02, l * P + P / 2, 0.02).map(([x, y]) => [x, y, Z(n) + 0.003]), layer: -3.8 })
        k.extrude(`shut${n}${l}`, { at: [XN(n), l * P, Z(n) + SHUT], shape: rrect(0, -P / 2 + g, SHUT_D, P / 2 - g, 0.03, 2), face: "+z", depth: SHUT, layer: 0 })
      }
    }
    k.block("gone", { at: [X(0) + P - 0.06, -HALF + 0.04, Z(0)], size: [3 * P + 0.04, 2 * HALF - 0.08, H + 0.04], r: 0.14, role: "ghost", on: 2, layer: 0.6 })
    k.halo("glow0", { at: [X(0) + 2.4 * P, 0, Z(0) + 0.006], r: 1.6, on: 2, layer: -3.7 })
    k.halo("glow1", { at: [X(1) + 2.4 * P, 0, Z(1) + 0.006], r: 1.75, on: 1, layer: -3.7 })
    k.halo("glow2", { at: [X(2) + 2.4 * P, 0, Z(2) + 0.006], r: 1.75, on: 1, layer: -3.7 })

    for (let i = 0; i < N; i++) k.block(`b${i}`, { at: [-W / 2, -W / 2, 0], size: [W, W, H], r: 0.1, layer: 0 })
  },
  tick(t, s, input) {
    const { p } = s
    const beatT = t / BEAT
    const beat = Math.floor(beatT)
    const f = beatT - beat
    const lap = ((beat % LAP) + LAP) % LAP

    // The pointer opens a neck, and every neck before it (fixed regions).
    let pick = null
    if (input.onPlane)
      for (let z = 2; z >= 0 && pick === null; z--) {
        const w = input.onPlane(Z(z) + 0.2)
        if (w && w[0] > X(z) - (z ? 0 : 0.7) && w[0] < X(z + 1) && Math.abs(w[1]) < SIDE + 0.15) pick = z
      }
    let prev = STATES[lap]
    let next = STATES[lap + 1]
    let open = lapOpen(lap)
    // A shutter starts down two beats before its lane is used.
    const lead = (b) => lapOpen(b % LAP).map((o, n) => WIDE.filter((l) => o.includes(l) || lapOpen((b + LEAD) % LAP)[n].includes(l)))
    let down = lead(lap)
    if (input.still && pick !== null) {
      prev = next = settle(pick)
      open = down = wide(pick)
    } else if (!input.still && (pick !== null || s.live)) {
      const q = s.live || (s.live = { beat, prev, next, open, down, since: {} })
      while (s.live && q.beat < beat) {
        q.beat++
        const bl = ((q.beat % LAP) + LAP) % LAP
        q.down = pick === null ? lead(bl) : wide(pick)
        q.open = q.down.map((o, n) =>
          o.filter((l) => {
            if (q.open[n].includes(l)) return true
            const id = `${n}${l}`
            if (!(id in q.since)) q.since[id] = q.beat
            return q.beat - q.since[id] >= LEAD
          })
        )
        for (const id in q.since) if (!q.down[id[0]].includes(Number(id.slice(1))) || q.open[id[0]].includes(Number(id.slice(1)))) delete q.since[id]
        q.prev = q.next
        q.next = step(q.prev, q.open, bl)
        // Left alone, it runs on by itself until it is back on the lap.
        if (pick === null && sig(q.prev) === sig(STATES[bl]) && sig(q.next) === sig(STATES[bl + 1])) s.live = null
      }
      ;({ prev, next, open, down } = q)
    }

    // The shutters: down where a lane is open.
    for (let n = 0; n < 3; n++)
      for (const l of WIDE) {
        const v = input.tween(`sh${n}${l}`, down[n].includes(l) ? 1 : 0, { dur: 0.5, ease: easeInOut })
        const sink = v * (SHUT - 0.004)
        const g = p[`shut${n}${l}`]
        g.off[2] = -sink
        g.depth = SHUT - sink // below the floor it is out of sight
        g.hide = sink > SHUT - 0.02
      }

    // The blocks.
    const lit = [0, 0, 0]
    next.forEach((b, i) => {
      const a = prev[i]
      const part = p[`b${i}`]
      const at = part.off
      part.hide = false
      part.fade = 1
      if (a.z < 0 && b.z < 0) part.hide = true
      else if (a.z < 0) {
        const to = place(b.z, b.c, b.l)
        const u = smooth(f)
        at[0] = lerp(X_IN + 0.2, to[0], u)
        at[1] = to[1]
        at[2] = to[2]
        part.fade = clamp((f - 0.15) / 0.5)
      } else if (b.z < 0) {
        const from = place(a.z, a.c, a.l)
        at[0] = from[0] + P * f
        at[1] = from[1]
        at[2] = from[2]
        part.fade = 1 - clamp(f / 0.8)
      } else {
        const from = place(a.z, a.c, a.l)
        const to = place(b.z, b.c, b.l)
        const u = b.moved ? f : 0
        // Into the open lane: after whoever goes first; round a corner: across, then on.
        const turn = a.z === b.z && a.l !== b.l && a.c !== b.c
        at[0] = lerp(from[0], to[0], turn ? clamp(2 * u - 1) : u)
        at[1] = lerp(from[1], to[1], turn ? clamp(2 * u) : smooth(clamp((u - 0.25) / 0.75)))
        // Over the edge of a terrace it goes on, then falls.
        at[2] = a.z === b.z ? from[2] : lerp(from[2], to[2], easeIn(clamp((u - 0.55) / 0.45)))
      }
      if (part.fade < 0.03) part.hide = true
      const on = a.lit && (b.lit || a.z === b.z)
      part.on = on ? (a.z === 0 ? 2 : 1) : 0
      part.glow = on ? 0.12 : 0
      if (on) lit[a.z]++
    })
    const b = input.still ? 0.5 : breathe(t, 3)
    lit.forEach((n, z) => {
      const v = input.still ? n : input.spring(`g${z}`, n, { k: 60, c: 15 })
      p[`glow${z}`].glow = clamp(v / 7) * (0.8 + 0.12 * b)
    })
    // Where the first pile stood, once it is gone.
    const gone = input.still ? (lit[0] === 0 ? 1 : 0) : clamp(input.spring("gone", lit[0] <= 1 && (pick !== null || open[0].length === 3) ? 1 : 0, { k: 90, c: 19 }))
    p.gone.fade = gone
    p.gone.hide = gone < 0.03

    const w = lit.indexOf(Math.max(...lit))
    s.state = Math.max(...lit) >= 3 ? ["waits at the first", "waits at the second", "waits at the third"][w] : pick === 2 ? "nobody waits" : "moving"
  },
  readout: (s) => s.state || "rest",
})
