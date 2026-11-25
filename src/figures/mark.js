// The book's mark: two question marks in isometric depth. The first, behind,
// is a dashed teal outline: the first answer, which anyone or any machine
// can draft. The second, in front, is solid magenta with a teal dot: the
// second question, the one that shows whether you understand.

import { arc, breathe, figure } from "../lib/iso/core.js"

const W = 2.2 // stroke width of the glyph
const DEPTH = 1.9 // extrusion depth
const GAP = 3.4 // how far behind the first mark stands

/**
 * The question mark as flat rings in (u, v), v up, 10 units tall, built
 * from exact arcs: a bowl of three quarters of a circle, a stem hung from
 * its foot, and a square dot. No offset curves, so no joins to go wrong.
 */
export function questionGlyph({ w = W, top = 10, start = 158, stemBottom = 2.75, dot = 1.95 } = {}) {
  const Ro = 3.2
  const Ri = Ro - w
  const cy = top - Ro
  const outer = arc(0, cy, Ro, start, -90, 56) // terminal, over the top, down to the foot
  const inner = arc(0, cy, Ri, -90, start, 40) // back round the counter
  const hook = [...outer, [0, stemBottom], [-w, stemBottom], [-w, cy - Ri], ...inner]
  const dotRing = [
    [-w, 0],
    [0, 0],
    [0, dot],
    [-w, dot],
  ]
  return { hook, dot: dotRing }
}

export default figure({
  slug: "mark",
  title: "The Second Question",
  desc: "Two question marks in isometric depth: behind, a dashed teal outline of the first; in front, the second, solid magenta with a teal dot.",
  plate: "The mark",
  sentence: "The viewer sees the second question lift out of the first one's outline, which explains the title: the answer anyone can draft comes first, the question that tests it comes second.",
  view: { scale: 12, origin: [140, 150] },
  still: 0,
  build(k) {
    const g = questionGlyph()
    k.extrude("first", { shape: [g.hook, g.dot], face: "+x", depth: DEPTH, at: [-GAP, 0, 0], role: "ghost", on: 2 })
    k.group("second", { at: [0, 0, 0] })
    k.extrude("hook", { shape: g.hook, face: "+x", depth: DEPTH, at: [0, 0, 0], role: "brand", parent: "second" })
    k.extrude("dot", { shape: g.dot, face: "+x", depth: DEPTH, at: [0, 0, 0], role: "brand2", parent: "second" })
  },
  tick(t, s, input) {
    // The second mark lifts a little toward the pointer and settles back.
    const lift = input.spring("lift", input.pointer ? 0.6 : 0)
    s.groups.second.off[2] = lift
    // Its dot is switched on: it breathes a soft teal glow.
    s.p.dot.glow = input.still ? 0 : 0.18 + 0.22 * breathe(t, 3.2)
  },
  readout: (_s, input) => (input.pointer ? "second" : "rest"),
})
