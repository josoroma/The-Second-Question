// Chapter 6, How sure are you? Say that: one lit pane, spread over three.
//
// A light box has three panes in a row, and only the first is lit from
// below: that part was checked. A cover rides on two rails over the panes. It
// is a light guide: laid over them it picks up the first pane's light and
// spreads it evenly over its whole face, so all three panes look lit. That is
// "should": the light of the part you checked, spread over the parts you only
// assumed.
//
// The cover slides back to its rest at the far end of the box. As it leaves
// the lit pane its own glow fades, because it never had a light of its own,
// and the panes show what they are: the first lit teal (checked), the other
// two dark (nobody looked). Once they are out from under it, the well the two
// dark panes share lights magenta round them: the limit, said aloud, the doubt
// put where people can use it. Then the cover slides forward and spreads the
// one light over all three again.
//
// Light: teal is the checked pane, and the cover only while it lends that
// pane's light; magenta is the limit round the two assumed panes. At rest only
// the checked pane and the limit glow.
//
// The pointer pulls the cover: its front edge follows the aim along the box,
// so the reader uncovers the panes as far as they like.

import { clamp, cycle, easeInOut, figure, keys, lerp, rrect, smooth } from "../lib/iso/core.js"

const T = 8 // seconds per lap

// The box: the panes in its front band, the cover's rest in its back band.
const BX = 3.25 // half its length along x
const BY0 = -3.6 // its back
const BY1 = 2.0 // its front
const BH = 1.2 // its height

// The panes, in a row along x: the first (checked) at the far left.
const PANE_X = [-1.95, 0, 1.95]
const PANE_Y = 0.55
const PW = 1.45 // a pane's glass
const WW = 1.7 // its well
const PY0 = PANE_Y - PW / 2 // the panes' back edge

// The rails and the cover.
const RAIL_X = 3.02
const RAIL_W = 0.12
const RAIL_H = 0.14
const CZ = BH + RAIL_H // the cover's underside
const CH = 0.1 // its thickness
const COVER = { x0: -3.1, x1: 3.1, y0: -0.7, y1: 1.7 } // laid over the panes, against the front stops
const TRAVEL = 2.6 // how far it slides back to its rest, against the back stops

const flat = (pts, z) => pts.map(([x, y]) => [x, y, z])
const closed = (pts) => [...pts, pts[0]]

export default figure({
  slug: "06-how-sure-are-you",
  title: "One lit pane, spread over three",
  desc: "A light box with three panes in a row and a cover on rails. Slid back, the cover shows that only the first pane, marked Checked, is lit teal; the other two, marked Assumed, sit dark in a shared well that lights magenta. Laid over the panes, the cover glowed evenly teal, as if all three were lit.",
  plate: "How sure are you? Say that",
  sentence:
    "The viewer sees a cover that glows evenly over three panes slide back and show that only the first pane is lit, while the other two are dark and framed in magenta, which explains the sized claim: one vague word spreads the light of the part you checked over the parts you only assumed, and saying how sure, part by part, puts the doubt where people can use it.",
  view: { scale: 38, origin: [254, 262] },
  still: 0.55 * T,
  build(k) {
    k.grid("board", { at: [-4.4, -5.2, 0], size: [8.8, 8.8], step: 0.7 })
    k.block("box", { at: [-BX, BY0, 0], size: [2 * BX, BY1 - BY0, BH], r: 0.32, layer: -3 })
    // A lip inset from the top's edge.
    k.detail("lip", { pts: flat(closed(rrect(-BX + 0.16, BY0 + 0.16, BX - 0.16, BY1 - 0.16, 0.2)), BH + 0.002), layer: -2 })
    // The basis words on the front wall, under their panes.
    k.label("lc", { at: [PANE_X[0], BY1 + 0.004, BH / 2], text: "Checked", face: "+y", size: 0.34, layer: -2 })
    k.label("la", { at: [(PANE_X[1] + PANE_X[2]) / 2, BY1 + 0.004, BH / 2], text: "Assumed", face: "+y", size: 0.34, layer: -2 })

    // Two wells: one for the checked pane, one shared by the two assumed panes
    // (one part of the claim, two sites). The shared well is the limit: it
    // lights magenta once the cover is off. Each well holds glass; only the
    // first pane is lit from below.
    const wy0 = PANE_Y - WW / 2
    const wy1 = PANE_Y + WW / 2
    k.face("wellC", { pts: flat(rrect(PANE_X[0] - WW / 2, wy0, PANE_X[0] + WW / 2, wy1, 0.16), BH + 0.002), role: "recess", layer: -2 })
    k.face("limit", { pts: flat(rrect(PANE_X[1] - WW / 2, wy0, PANE_X[2] + WW / 2, wy1, 0.16), BH + 0.002), role: "recess", layer: -2 })
    PANE_X.forEach((x, i) => {
      k.face(`pane${i}`, { pts: flat(rrect(x - PW / 2, PANE_Y - PW / 2, x + PW / 2, PANE_Y + PW / 2, 0.1), BH + 0.004), role: "glass", layer: -1.9 })
    })
    k.halo("spill", { at: [PANE_X[0], PANE_Y, BH + 0.006], r: 1.5, on: 2, layer: -1 })

    // Two rails along the box, a stop at each end of each.
    for (const s of [-1, 1]) {
      const x = s * RAIL_X - RAIL_W / 2
      k.block(`rail${s}`, { at: [x, BY0 + 0.12, BH], size: [RAIL_W, BY1 - BY0 - 0.24, RAIL_H], r: 0.04 })
      k.block(`stopB${s}`, { at: [x - 0.03, BY0 + 0.12, BH], size: [RAIL_W + 0.06, 0.16, RAIL_H + CH + 0.08], r: 0.05 })
      k.block(`stopF${s}`, { at: [x - 0.03, BY1 - 0.28, BH], size: [RAIL_W + 0.06, 0.16, RAIL_H + CH + 0.08], r: 0.05, layer: 0.6 })
    }

    // The cover, with a grip along its front edge.
    k.group("cover", { at: [0, 0, 0] })
    k.block("sheet", { at: [COVER.x0, COVER.y0, CZ], size: [COVER.x1 - COVER.x0, COVER.y1 - COVER.y0, CH], r: 0.12, parent: "cover", layer: 0.5 })
    k.block("grip", { at: [-0.7, COVER.y1 - 0.34, CZ + CH], size: [1.4, 0.2, 0.12], r: 0.08, parent: "cover", layer: 0.55 })
  },
  tick(t, s, input) {
    const { p, groups } = s
    const lap = cycle(t, T)

    // The lap: the cover lies over the panes, slides back, rests, slides forward.
    const loopBack = keys(lap, [
      [0, 0],
      [0.14, 0],
      [0.34, 1, easeInOut],
      [0.78, 1],
      [0.95, 0, easeInOut],
    ])

    // The pointer pulls the cover: on the fixed plane of its top, its front
    // edge goes to the aim's place along the box.
    let want = null
    const aim = input.onPlane ? input.onPlane(CZ + CH) : null
    if (aim && Math.abs(aim[0]) < BX + 0.6 && aim[1] > BY0 - 0.6 && aim[1] < BY1 + 0.9) {
      want = clamp((COVER.y1 - clamp(aim[1], COVER.y1 - TRAVEL, COVER.y1)) / TRAVEL)
    }
    const soft = want !== null || (s.w ?? 0) > 0.02
    const pb = input.spring("back", want ?? loopBack, soft ? { k: 70, c: 15 } : { k: 4000, c: 126 })
    const w = clamp(input.spring("w", want === null ? 0 : 1, want === null ? { k: 30, c: 11 } : {}))
    if (!input.still) s.w = w
    const back = clamp(lerp(loopBack, pb, w))
    groups.cover.off[1] = -back * TRAVEL

    // How much of the lit pane the cover still lies over, and how bare the panes are.
    const front = COVER.y1 - back * TRAVEL
    const over = clamp((front - PY0) / PW)
    const bare = 1 - over

    // The cover glows only with light it picks up from the first pane; away
    // from it, it has nothing to show.
    p.sheet.on = over > 0.01 ? 2 : 0
    p.sheet.glow = 0.1 * over
    p.grip.on = p.sheet.on
    // The first pane is lit: what is out from under the cover shows it.
    p.pane0.on = 2
    p.pane0.glow = 0.55 * bare
    p.spill.glow = 0.9 * bare
    // Once the panes are bare, the well round the dark two lights magenta: the
    // limit. No bloom, which would spread over the dark glass and make it look lit.
    const limitK = smooth((bare - 0.75) / 0.25)
    p.limit.on = limitK > 0.02 ? 1 : 0
    p.limit.fade = limitK > 0.02 ? 0.35 + 0.65 * limitK : 1

    s.state = bare < 0.02 ? "should" : limitK > 0.5 ? "checked · assumed" : "sizing"
  },
  readout: (s) => s.state || "rest",
})
