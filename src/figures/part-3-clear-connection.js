// Part III, Clear connection: common ground. Two round platforms of unequal
// size stand on one axis. The smaller (what you know) rides between two low
// rails: it leaves its stop, slides along the axis until its rim touches the
// larger (what they know), where nothing is shared yet, and a detent seats it
// into the larger. Only then is the lens both contain marked: it lights where
// it lies. Touching is not sharing; only the shared part carries the light.

import { arc, breathe, clamp, cycle, easeIn, easeInOut, easeOut, figure, keys, lerp, ring, smooth } from "../lib/iso/core.js"

const T = 9 // seconds per lap
const H = 1.0 // both platforms' height: their tops share one plane
const RB = 2.8 // the larger platform, what they know, centred at the origin
const RS = 1.8 // the smaller platform, what you know
const W = 0.9 // width of the shared lens along the axis
const XF = -(RB + RS - W) // the smaller centre when seated: the detent
const TOUCH = -(RB + RS) // ...when the rims just touch: nothing shared yet
const XA = -(RB + RS + 0.9) // ...when it rests against the stop, apart
const LIFT = 0.34 // thickness of the lens
const SEAT = 0.08 // the lens sits this far into the tops: in 3D its base rim and outline stay hidden (under a 2D pixel or two)
const LX = (-RB + XF + RS) / 2 // the lens's middle on the axis

// The track: two low rails along the axis, closed by a stop at the far end.
const RAIL_IN = RS + 0.14 // inner face of each rail, off the axis
const RAIL_T = 0.12 // a rail's width
const RAIL_H = 0.14 // a rail's height
const RAIL_OUT = RAIL_IN + RAIL_T
const STOP_X = XA - RS - 0.05 // the stop's face: the smaller rim rests here, apart
const STOP_T = 0.16
const RAIL_X1 = -2.35 // where the rails end, short of the larger wall

// The base plate under both.
const BX0 = STOP_X - STOP_T - 0.42
const BX1 = RB + 0.55
const BY = RB + 0.5

// The lap, as fractions of T.
const LEAVE = 0.06 // it leaves the stop
const MEET = 0.27 // the rims touch
const PULL = 0.32 // the detent takes it
const SEATED = 0.35 // seated: the lens starts to light
const LIT = 0.385 // fully lit
const DIM = 0.84 // the lens starts to go dark
const DARK = 0.87 // dark: it leaves the detent
const BACK = 0.98 // back against the stop

/** The part of both circles (radii rs, rb at the final overlap) as a ring of world [x, y], from two exact arcs. */
function lensOf(rs, rb, steps = 24) {
  const d = -XF
  const tx = (rs * rs - rb * rb - d * d) / (2 * d) // tip x, from the larger centre
  const ty = Math.sqrt(rb * rb - tx * tx)
  const phi = (Math.atan2(ty, tx + d) * 180) / Math.PI
  const psi = (Math.atan2(ty, tx) * 180) / Math.PI
  const near = arc(XF, 0, rs, -phi, phi, steps) // the smaller rim, inside the larger
  const far = arc(0, 0, rb, psi, 360 - psi, steps).slice(1, -1) // the larger rim, inside the smaller
  return { ring: near.concat(far), near }
}

const LENS = lensOf(RS, RB)
const INNER = lensOf(RS - 0.12, RB - 0.12)
const at = (pts, z) => pts.map(([x, y]) => [x, y, z])
const closed = (pts) => pts.concat([pts[0]])
/** A soft 0..1..0 bump that starts at t0 and lasts w (fractions of the lap). */
const bump = (x, t0, w) => (x > t0 && x < t0 + w ? Math.sin((Math.PI * (x - t0)) / w) : 0)

export default figure({
  slug: "part-3-clear-connection",
  title: "Common ground: what both contain",
  desc: "Two round platforms of unequal size stand on one axis on a base plate; the smaller rides between two low rails. It has slid along the axis into the larger, and only the lens-shaped part they both contain is marked: it glows magenta, its light spilled on the tops around it.",
  plate: "Part III · Clear connection",
  sentence:
    "The viewer sees a smaller disc slide along a shared axis into a larger one until the lens they both contain lights, which explains common ground: connection happens only in the part both people already hold.",
  view: { scale: 28, origin: [335, 247] },
  still: 0.62 * T,
  build(k) {
    k.grid("board", { at: [BX0 - 2, -BY - 1.6, -0.32], size: [BX1 - BX0 + 4, 2 * BY + 3.2], step: 0.7 })
    k.block("base", { at: [BX0, -BY, -0.32], size: [BX1 - BX0, 2 * BY, 0.32], r: 0.5, layer: -3 })
    const screws = [
      [BX0 + 0.42, -BY + 0.42],
      [BX1 - 0.42, -BY + 0.42],
      [BX1 - 0.42, BY - 0.42],
      [BX0 + 0.42, BY - 0.42],
    ]
    screws.forEach(([x, y], i) => k.led(`screw${i}`, { at: [x, y, 0], face: "+z", r: 0.09, layer: -2 }))
    // The one axis both centres stand on, on the floor: from the stop to under the larger centre.
    k.guide("axis", { pts: [[STOP_X + 0.2, 0, 0], [0, 0, 0]], layer: -2 })
    // The track: a stop across the far end and two rails that keep the smaller on the axis.
    k.block("stop", { at: [STOP_X - STOP_T, -RAIL_OUT, 0], size: [STOP_T, 2 * RAIL_OUT, RAIL_H + 0.06], r: 0.06 })
    k.block("railB", { at: [STOP_X, -RAIL_OUT, 0], size: [RAIL_X1 - STOP_X, RAIL_T, RAIL_H], r: 0.05 })
    k.block("railF", { at: [STOP_X, RAIL_IN, 0], size: [RAIL_X1 - STOP_X, RAIL_T, RAIL_H], r: 0.05 })

    // The smaller platform: what you know. It slides along the axis.
    k.group("mine", { at: [XF, 0, 0] })
    k.cyl("small", { at: [0, 0, 0], radius: RS, h: H, n: 72, parent: "mine" })
    // A seam round the wall under the top plate. The half facing away is
    // drawn before the solid, so the flat drawing hides it; in 3D both show.
    k.detail("smallBand", { pts: at(arc(0, 0, RS, -45, 135, 36), H - 0.2), parent: "mine", bias: 0.5 })
    k.detail("smallBandBack", { pts: at(arc(0, 0, RS, 135, 315, 36), H - 0.2), parent: "mine" })
    k.detail("smallSeam", { pts: closed(at(ring(0, 0, RS - 0.28, 72), H)), parent: "mine", bias: 1.5 })
    // Its share of the axis, across its top plate through its centre.
    k.guide("smallAxis", { pts: [[-(RS - 0.28), 0, H], [0, 0, H], [RS - 0.28, 0, H]], parent: "mine", bias: 0.3 })
    k.cyl("smallHub", { at: [0, 0, H], radius: 0.24, h: 0.14, parent: "mine", bias: 1.8 })

    // The larger platform: what they know. It stays.
    k.cyl("large", { at: [0, 0, 0], radius: RB, h: H, n: 96 })
    k.detail("largeBand", { pts: at(arc(0, 0, RB, -45, 135, 48), H - 0.2) })
    k.detail("largeBandBack", { pts: at(arc(0, 0, RB, 135, 315, 48), H - 0.2) })
    k.detail("largeSeam", { pts: closed(at(ring(0, 0, RB - 0.28, 96), H)), bias: 2.5 })
    k.guide("largeAxis", { pts: [[-(RB - 0.28), 0, H], [0, 0, H], [RB - 0.28, 0, H]], bias: 0.1 })
    // Where the smaller rim reaches when seated: a dashed witness on the larger top.
    k.guide("reach", { pts: at(LENS.near, H), bias: 2.1 })
    k.cyl("largeHub", { at: [0, 0, H], radius: 0.24, h: 0.14, bias: 0.5 })

    // Common ground: the lens both contain, and its light on the tops around it.
    k.halo("spill", { at: [LX, 0, H], r: 1.5, on: 1, layer: 0, bias: 3.3 })
    k.halo("core", { at: [LX, 0, H], r: 0.95, on: 1, layer: 0, bias: 3.4 })
    k.extrude("lens", {
      at: [LX, 0, H + LIFT - SEAT],
      shape: LENS.ring.map(([x, y]) => [x - LX, -y]),
      face: "+z",
      depth: LIFT,
      on: 1,
      bias: 4,
    })
    k.detail("lensRim", { pts: closed(at(INNER.ring, H + LIFT - SEAT)), on: 1, bias: 4.3 })
  },
  tick(t, s, input) {
    const { p, groups } = s
    const lap = cycle(t, T)

    // The lap: it rests against the stop; slides along the rails until the
    // rims touch and holds there (nothing is shared yet); the detent takes
    // it and it seats; the lens both contain lights where it lies; hold; the
    // lens goes dark; it slides back to the stop.
    const loopX = keys(lap, [
      [0, XA],
      [LEAVE, XA],
      [MEET, TOUCH, easeInOut],
      [PULL, TOUCH],
      [SEATED, XF, easeIn],
      [DARK, XF],
      [BACK, XA, easeInOut],
      [1, XA],
    ])
    const loopLit = keys(lap, [
      [0, 0],
      [SEATED, 0],
      [LIT, 1, easeOut],
      [DIM, 1],
      [DARK, 0, easeIn],
      [1, 0],
    ])

    // The pointer slides the smaller platform along the axis: free travel
    // from the stop to touching, then the detent seats it fully, so a partial
    // overlap can never be held. Fixed planes only: the floor says whether the
    // pointer is over the plate; the tops' plane gives the reach.
    const floor = input.onPlane ? input.onPlane(0) : null
    const over = !!floor && floor[0] > BX0 && floor[0] < BX1 && Math.abs(floor[1]) < BY + 0.7
    let target = loopX
    if (over) {
      const ax = input.onPlane(H)[0]
      // A little hysteresis: once seated, it lets go only well short of touching.
      s.seated = s.seated ? ax > TOUCH - 0.3 : ax >= TOUCH
      target = s.seated ? XF : clamp(ax, XA, TOUCH)
    } else s.seated = false
    const m = input.tween("ptr", over ? 1 : 0)
    const xp = clamp(input.spring("x", target), XA, XF)
    const x = lerp(loopX, xp, m)
    // The lens is the shape of the full overlap: it can light only there.
    const met = smooth(clamp((x - XF) / 0.12 + 1))
    const ptrLit = input.tween("lit", s.seated ? 1 : 0, { dur: 0.35 })
    // One level drives the lens and all its light, so no light shows without it.
    const vis = Math.min(met, lerp(loopLit, ptrLit, m))

    groups.mine.off[0] = x - XF

    p.lens.hide = p.lensRim.hide = vis < 0.01
    p.lens.fade = p.lensRim.fade = vis
    // The lens's own bloom stays low (in 3D its glow sits on the cap and is
    // cut by it); the two halos on the tops carry its light.
    p.lens.glow = vis * 0.15
    const breath = input.still ? 0.5 : breathe(t, 2.6)
    const flash = bump(lap, SEATED, 0.12) * (1 - m)
    p.spill.glow = vis * Math.min(1, 0.8 + 0.08 * breath + 0.2 * flash)
    p.core.glow = vis * Math.min(1, 0.6 + 0.1 * breath + 0.4 * flash)

    if (m > 0.5) {
      const move = target - xp
      s.state =
        vis > 0.5 ? "common ground" : x >= TOUCH - 0.03 ? "touching" : move > 0.03 ? "closing in" : move < -0.03 ? "parting" : "apart"
    } else {
      s.state =
        lap < LEAVE || lap >= BACK
          ? "apart"
          : lap < MEET
            ? "closing in"
            : lap < SEATED + 0.02
              ? "touching"
              : lap < DIM
                ? "common ground"
                : "parting"
    }
  },
  readout: (s) => s.state || "rest",
})
