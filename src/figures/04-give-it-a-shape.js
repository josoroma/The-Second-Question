// Chapter 4, Give it a shape: next-question order.
//
// A rack of six shelves holds the speaker's notes in the order they happened:
// the oldest at the top, the newest at the bottom. In front of it one rail
// runs to a stop at the far end. Whatever goes onto the rail reaches that end
// one card at a time, in the order sent, and never comes back: a listener
// can't scroll back.
//
// The rack sends the newest card first: where things stand now, the point
// (magenta). Then a lamp lights beside the card that answers the question the
// last card raised, and that card drops onto the rail and lines up behind the
// one before it (teal from its call until it lands: it supports the point;
// only the last one keeps its light into the stop). Four cards
// go, out of the rack's order. Two never go, because no question leads to
// them: they stay on their shelves, in the notes. After the fourth the next
// place on the rail stays empty, a dashed outline: the next question is the
// listener's, so the rack stops.
//
// The pointer probes a piece. Over a shelf (or a place on the rail) the lamp
// of that card lights and the read-out names the question that calls it; a
// card no question calls only nudges against its shelf and stays; the empty
// place reads "theirs".

import { breathe, clamp, cycle, easeIn, easeInOut, figure, lerp, rrect } from "../lib/iso/core.js"

const N = 6 // shelves, the oldest note at the top
const PITCH = 0.72 // one shelf's height
const SHELF = 0.07 // a shelf plate's thickness
const BASE = 0.35 // the rack's sill and the rail's top
const floorOf = (c) => BASE + (N - 1 - c) * PITCH // shelf c's floor: 0 at the top, 5 at the bottom
const TOP = BASE + N * PITCH // the rack's height
const RX0 = -0.25 // the shelves' footprint
const RX1 = 0.6
const RY0 = -0.7
const RY1 = 0.7
const WALL = 0.14

const CW = 1.0 // a card's width (y)
const CT = 0.22 // its thickness (x)
const CH = 0.46 // its height
const REST_X = 0.4 // where a card stands on its shelf, at the front edge
const CLEAR_X = RX1 + CT / 2 // past this a card has left its shelf
const LAND_X = 1.0 // where a dropped card meets the rail
const GAP = 0.9 // spacing of the places on the rail
const slotX = (j) => 5.5 - j * GAP // place j: 0 at the stop, 4 the next place, left empty
const RAIL_END = 6.0

const ORDER = [5, 2, 4, 0] // the shelves, in the order the listener's questions call them (1 and 3 stay)
const ASKS = ["point first", "[why?]", "[and if not?]", "[september?]"]
const T = 10

// The lap: each card waits for the one before it to land.
const STEPS = []
{
  let t0 = 0.4
  ORDER.forEach((c, j) => {
    const drop = floorOf(c) - BASE
    const lamp = t0
    const out0 = lamp + 0.2
    const out1 = out0 + 0.3
    const fall1 = out1 + (drop > 0 ? 0.14 + 0.2 * Math.sqrt(drop) : 0)
    const slide0 = fall1 + (drop > 0 ? 0.05 : 0)
    const slide1 = slide0 + 0.4 + 0.09 * (slotX(j) - (drop > 0 ? LAND_X : REST_X))
    STEPS.push({ c, j, drop, lamp, out0, out1, fall1, slide0, slide1 })
    t0 = slide1 + 0.25
  })
}
const LAST = STEPS[STEPS.length - 1]
const STOP = LAST.slide1 + 0.1 // the next place shows: theirs
const GONE = 9.0 // the line fades from the rail...
const BACK = 9.45 // ...and the cards stand on their shelves again

const closed = (pts) => [...pts, pts[0]]
const flat = (pts, z = 0) => pts.map(([x, y]) => [x, y, z])

/** Where card j (in calling order) is at lap time tl, and whether it is moving. */
function cardAt(j, tl) {
  const s = STEPS[j]
  const zf = floorOf(s.c)
  const slot = slotX(j)
  if (tl >= BACK) return { x: REST_X, z: zf, fade: clamp((tl - BACK) / 0.45), moving: false, said: false }
  if (tl >= GONE) return { x: slot, z: BASE, fade: 1 - clamp((tl - GONE) / 0.4), moving: false, said: true }
  if (tl < s.out0) return { x: REST_X, z: zf, fade: 1, moving: false, said: false }
  if (s.drop === 0) {
    // The bottom shelf is level with the rail: one push carries it to the stop.
    const u = clamp((tl - s.out0) / (s.slide1 - s.out0))
    return { x: lerp(REST_X, slot, easeInOut(u)), z: zf, fade: 1, moving: u < 1, said: true }
  }
  if (tl < s.out1) {
    const u = (tl - s.out0) / (s.out1 - s.out0)
    return { x: lerp(REST_X, LAND_X, easeInOut(u)), z: zf, fade: 1, moving: true, said: true }
  }
  if (tl < s.fall1) {
    const u = (tl - s.out1) / (s.fall1 - s.out1)
    return { x: LAND_X, z: lerp(zf, BASE, easeIn(u)), fade: 1, moving: true, said: true }
  }
  const u = clamp((tl - s.slide0) / (s.slide1 - s.slide0))
  return { x: lerp(LAND_X, slot, easeInOut(u)), z: BASE, fade: 1, moving: u < 1, said: true }
}

/** How lit an answer card is: from the moment its question calls it (with its lamp, still on the shelf) until a moment after it lands. The last one holds into the stop. */
function litAt(j, tl) {
  const s = STEPS[j]
  const last = j === STEPS.length - 1
  const off = last ? STOP + 0.55 : s.slide1 // the others go dark as they land, before the next lamp lights
  const fade = last ? 0.4 : 0.22
  if (tl < s.lamp || tl > off + fade) return 0
  if (tl < s.lamp + 0.12) return (tl - s.lamp) / 0.12
  return tl <= off ? 1 : 1 - (tl - off) / fade
}

export default figure({
  slug: "04-give-it-a-shape",
  title: "The next question calls the next card",
  desc: "A rack of six shelves holds notes in the order they happened, newest at the bottom. On the rail in front, four cards stand in the order they were sent: the newest first, glowing, then the cards three questions called, out of the rack's order. Two cards stay on their shelves, and the next place on the rail is an empty dashed outline: the listener's.",
  plate: "Give it a shape",
  sentence:
    "The viewer sees the rack send its newest card first, then only the cards each next question calls, out of the order they were filed, and stop at an empty place with two cards still on the shelves, which explains next-question order: the point first, then what this listener would ask next, and the stop where the next question is theirs.",
  view: { scale: 33, origin: [201, 222] },
  still: 7.6,
  build(k) {
    k.grid("board", { at: [-3.4, -3.0, -0.3], size: [12.4, 6.0], step: 0.7 })
    k.block("base", { at: [-1.4, -1.45, -0.3], size: [8.2, 2.9, 0.3], r: 0.4, layer: -3 })
    k.detail("lip", { pts: flat(closed(rrect(-1.16, -1.21, 6.56, 1.21, 0.26))), layer: -2 })
    ;[
      [-1.0, -1.05],
      [6.4, -1.05],
      [-1.0, 1.05],
      [6.4, 1.05],
    ].forEach(([x, y], i) => k.led(`screw${i}`, { at: [x, y, 0], face: "+z", r: 0.07, layer: -2 }))

    // The rack: a sill, two walls at the back, five shelves and a cap. Open at the front and the near side.
    k.block("sill", { at: [RX0 - WALL, RY0 - WALL, 0], size: [RX1 - RX0 + WALL, RY1 - RY0 + WALL, BASE], r: 0.08, layer: -2 })
    k.block("back", { at: [RX0 - WALL, RY0 - WALL, BASE], size: [WALL, RY1 - RY0 + WALL, TOP - BASE - 0.1], r: 0.04, layer: -0.5 })
    k.block("side", { at: [RX0, RY0 - WALL, BASE], size: [RX1 - RX0, WALL, TOP - BASE - 0.1], r: 0.04, layer: -0.5 })
    for (let c = 0; c < N - 1; c++) k.block(`shelf${c}`, { at: [RX0, RY0, floorOf(c) - SHELF], size: [RX1 - RX0, RY1 - RY0, SHELF], r: 0.03 })
    k.block("cap", { at: [RX0 - WALL - 0.04, RY0 - WALL - 0.04, TOP - 0.1], size: [RX1 - RX0 + WALL + 0.1, RY1 - RY0 + WALL + 0.1, 0.1], r: 0.08 })
    k.label("notes", { at: [(RX0 - WALL + RX1) / 2 + 0.02, (RY0 - WALL + RY1) / 2, TOP + 0.002], text: "notes", face: "+z", size: 0.26 })
    // A lamp beside each card, on the wall's inner face: lit when a question calls that card.
    for (let c = 0; c < N; c++) k.led(`lamp${c}`, { at: [RX1 - 0.12, RY0, floorOf(c) + 0.33], face: "+y", r: 0.09 })

    // The rail: one way, one card at a time, to a low stop at the far end.
    k.block("rail", { at: [RX1, -0.6, 0], size: [RAIL_END - RX1, 1.2, BASE], r: 0.06, layer: -2 })
    k.detail("groove", { pts: [[RX1 + 0.12, 0, BASE + 0.003], [3.3, 0, BASE + 0.003], [RAIL_END - 0.36, 0, BASE + 0.003]], layer: -2 })
    // Five places on the rail, in the order they fill; the fifth is never the speaker's to fill.
    const railDepth = (RX1 + RAIL_END) / 2 + BASE / 2
    const footprint = (x, z) => rrect(x - CT / 2 - 0.04, -CW / 2 - 0.04, x + CT / 2 + 0.04, CW / 2 + 0.04, 0.06, 3).map(([u, v]) => [u, v, z])
    for (let j = 0; j < 5; j++) {
      const x = slotX(j)
      k.face(`place${j}`, { pts: footprint(x, BASE + 0.002), role: "recess", layer: -2, bias: railDepth + 0.05 - (x + BASE) })
    }
    // Where each card stands on its shelf: an empty footprint shows a card has gone.
    for (let c = 0; c < N; c++) k.face(`foot${c}`, { pts: footprint(REST_X, floorOf(c) + 0.002), role: "recess" })
    k.block("stop", { at: [RAIL_END - 0.13, -0.6, BASE], size: [0.13, 1.2, 0.07], r: 0.05 })

    // Light on the rail: magenta under the point at the stop, teal under the card on its way.
    k.halo("spill", { at: [slotX(0), 0, BASE + 0.003], r: 0.72, on: 1, layer: 0, bias: -0.4 })
    k.halo("trail", { at: [LAND_X, 0, BASE + 0.003], r: 0.6, on: 2, layer: 0, bias: -0.4 })

    // The next place: empty, the listener's.
    k.block("next", { at: [slotX(4) - CT / 2, -CW / 2, BASE], size: [CT, CW, CH], r: 0.06, role: "ghost", hide: true })

    // The cards, each with two ruled lines on its face.
    for (let c = 0; c < N; c++) {
      k.group(`cg${c}`, { at: [REST_X, 0, floorOf(c)] })
      k.block(`card${c}`, { at: [-CT / 2, -CW / 2, 0], size: [CT, CW, CH], r: 0.06, role: c === ORDER[0] ? "accent" : "body", parent: `cg${c}` })
      const fx = CT / 2 + 0.004
      k.detail(`ln${c}a`, { pts: [[fx, 0.34, 0.31], [fx, 0, 0.31], [fx, -0.34, 0.31]], parent: `cg${c}` })
      k.detail(`ln${c}b`, { pts: [[fx, 0.34, 0.19], [fx, 0.12, 0.19], [fx, -0.1, 0.19]], parent: `cg${c}` })
    }
  },
  tick(t, s, input) {
    const { p, groups } = s
    const tl = cycle(t, T) * T

    // The pointer probes a piece: a shelf (on the rack's open front or side) or a place on the rail.
    // Both are fixed planes, so a moving card never makes the choice flicker.
    let probe = null
    if (input.onPlane) {
      const a = input.onPlane(0)
      const b = input.onPlane(1)
      if (a && b) {
        // The pointer's ray, as a point per unit of height: where it meets x = v, y = v or z = v.
        const d = [b[0] - a[0], b[1] - a[1], 1]
        const at = (axis, v) => {
          if (Math.abs(d[axis]) < 1e-6) return null
          const h = (v - a[axis]) / d[axis]
          return [a[0] + h * d[0], a[1] + h * d[1], h]
        }
        const shelfOf = (z) => clamp(N - 1 - Math.floor((z - BASE) / PITCH), 0, N - 1)
        const front = at(0, RX1)
        const near = at(1, RY1)
        if (front && front[1] > RY0 - 0.15 && front[1] < RY1 + 0.15 && front[2] > BASE && front[2] < TOP) probe = { shelf: shelfOf(front[2]) }
        else if (near && near[0] > RX0 && near[0] < RX1 + 0.15 && near[2] > BASE && near[2] < TOP) probe = { shelf: shelfOf(near[2]) }
        else {
          const r = at(2, BASE + CH / 2) // the plane through the cards' middles
          if (r && r[0] > RX1 + 0.5 && r[0] < RAIL_END + 0.3 && Math.abs(r[1]) < 0.85) {
            const j = clamp(Math.round((slotX(0) - r[0]) / GAP), 0, 4)
            probe = j < ORDER.length ? { shelf: ORDER[j] } : { next: true }
          }
        }
      }
    }
    const probed = probe && probe.shelf !== undefined ? probe.shelf : null

    // The cards.
    let mover = null
    let state = tl < STEPS[0].lamp ? "rest" : null
    for (let c = 0; c < N; c++) {
      const j = ORDER.indexOf(c)
      const g = groups[`cg${c}`]
      const ids = [`card${c}`, `ln${c}a`, `ln${c}b`]
      let x = REST_X
      let z = floorOf(c)
      let fade = 1
      let lit = 0
      if (j >= 0) {
        const q = cardAt(j, tl)
        x = q.x
        z = q.z
        fade = q.fade
        if (j > 0) lit = litAt(j, tl)
        if (q.moving && j > 0) mover = { x, z, lit }
      } else {
        // A card no question calls: under the pointer it nudges against its shelf, and stays.
        x += 0.14 * input.tween(`nudge${c}`, probed === c ? 1 : 0)
      }
      g.off[0] = x - REST_X
      g.off[2] = z - floorOf(c)
      // While part of it is still under the shelf above, it keeps its place in the paint order.
      const keep = z === floorOf(c) && x < CLEAR_X ? -(x - REST_X) : 0
      for (const id of ids) {
        p[id].bias += keep
        p[id].fade = fade
        p[id].hide = fade <= 0
      }
      // Under the pointer a called card lights in its own color.
      const hl = input.tween(`hl${c}`, probed === c && j >= 0 ? 1 : 0)
      if (j === 0) p[`card${c}`].glow = (input.still ? 0.42 : 0.3 + 0.14 * breathe(t, 2.4) + 0.2 * hl) * fade
      else {
        const on = Math.max(lit, hl)
        p[`card${c}`].on = p[`ln${c}a`].on = p[`ln${c}b`].on = on > 0.02 ? 2 : 0
        p[`card${c}`].glow = 0.45 * on * fade
      }
    }

    // Each lamp lights from the moment its question calls the card until the card has left.
    for (let c = 0; c < N; c++) {
      const j = ORDER.indexOf(c)
      const st = j >= 0 ? STEPS[j] : null
      const calling = st && tl >= st.lamp && tl < st.out1 + 0.12
      const hl = input.tween(`lamp${c}`, probed === c && j >= 0 ? 1 : 0)
      const on = calling ? 1 : hl
      p[`lamp${c}`].on = on > 0.02 ? (j === 0 ? 1 : 2) : 0
      p[`lamp${c}`].glow = 0.7 * on
      if (calling) state = ASKS[j]
    }
    if (!state) {
      // Between calls the read-out keeps the last question until the stop.
      for (let j = STEPS.length - 1; j >= 0; j--)
        if (tl >= STEPS[j].lamp) {
          state = ASKS[j]
          break
        }
      if (tl >= STOP && tl < GONE) state = "theirs"
      if (tl >= GONE) state = "rest"
    }

    // The point's light on the rail follows it to the stop.
    const pc = cardAt(0, tl)
    p.spill.at[0] = pc.x
    p.spill.glow = 0.8 * clamp((pc.x - RX1) / 0.6) * pc.fade

    // The card on its way spills teal on the rail as it comes down to it.
    if (mover) {
      p.trail.at[0] = mover.x
      p.trail.glow = 0.7 * mover.lit * (1 - clamp((mover.z - BASE) / 1.4))
    } else p.trail.glow = 0

    // The stop: the next place stays empty. It is the listener's.
    const nextK = Math.max(tl >= GONE ? 1 - clamp((tl - GONE) / 0.3) : clamp((tl - STOP) / 0.3), input.tween("next", probe && probe.next ? 1 : 0))
    p.next.hide = nextK <= 0.01
    p.next.fade = nextK

    s.state = probe ? (probe.next ? "theirs" : ORDER.includes(probe.shelf) ? ASKS[ORDER.indexOf(probe.shelf)] : "notes only") : state
  },
  readout: (s) => s.state || "rest",
})
