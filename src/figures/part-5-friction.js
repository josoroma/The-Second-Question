// Part V, Friction: the angle that holds. Two timber blocks on a test bench
// are joined end to end by one dovetail and hauled apart by two winches. Each
// flank of the tail meets the socket at 15 degrees to the line of pull, so the
// tail's wide end is wider than the socket's mouth: dashed lines run back from
// its corners and land on the cheeks, outside the dashed mouth. Pulling only
// presses the two angled faces into the socket: the cables go taut, the blocks
// part by a hair and stop, then the tail and its faces light. The joint never
// opens.
//
// Construction. The socket block stands a little proud of the tail block, so
// the socket reads as a flared slot with the tail's top as its floor. A
// dovetail interlocks in depth, so for the painter's order the socket block is
// three solids: the back cheek below the tail's top (drawn before the tail
// block), the back cheek's proud part (after it) and the rest of the block,
// the end and the front cheek (after both). The tail block stays one piece:
// no seam at the neck. The two contact faces are the real flank faces above
// the tail's top, built in world space: in the iso view the back one shows
// and the front one faces away, so its top edge carries the light; the 3D
// view shows both. A scribed baseline marks the socket's depth where the back
// cheek meets the end, over the seam of that split.

import { arc, breathe, clamp, cycle, easeIn, easeInOut, easeOut, figure, keys, ring } from "../lib/iso/core.js"

const T = 9 // seconds per lap
const TAN = Math.tan((15 * Math.PI) / 180)

// The blocks, in plan: the shoulder line is x = 0, the line of pull runs along x.
const LA = 1.2 // tail block, behind the shoulder
const LB = 2.0 // socket block, past the shoulder
const W = 2.5
const CY = W / 2
const Z0 = 0.2 // both ride on a low track
const HA = 1.15 // tail block
const PROUD = 0.16 // the socket block stands this much higher
const ZA = Z0 + HA // top of the tail block: the socket's floor
const ZB = ZA + PROUD // top of the socket block
const ZC = Z0 + HA / 2 // height of the line of pull
const R = 0.22 // rounded outer corners

// The dovetail: neck N at the shoulder, tail LT long, flanks at 15 degrees.
const N = 0.9
const LT = 1.55
const TIP = N + 2 * LT * TAN
const Y1 = CY - N / 2 // the mouth, back
const Y4 = CY + N / 2 // the mouth, front
const Y2 = CY - TIP / 2 // the wide end, back
const Y3 = CY + TIP / 2 // the wide end, front
const ys = (x) => Y1 - x * TAN // the back flank

// Take-up: under pull the blocks part by GAP, which closes the flank clearance.
const GAP = 0.08
const CLR = GAP * TAN

// The bench: two winches, their cables, the plate.
const LC = 0.8 // free cable, yoke to drum
const DR = 0.27 // drum radius: its top is the line of pull
const XA = -LA - 0.1 - LC // drum axes
const XB = LB + 0.1 + LC
const PX0 = XA - 0.72
const PX1 = XB + 0.72
const PY0 = -0.6
const PY1 = W + 0.6
const JX = LT / 2 // the joint's centre

/** World plan points (x, y) as a +z extrusion's (u, v). */
const plan = (pts) => pts.map(([x, y]) => [x, -y])

const TAIL_BLOCK = [
  [0, 0],
  [0, Y1 + CLR],
  [LT, Y2 + CLR],
  [LT, Y3 - CLR],
  [0, Y4 - CLR],
  [0, W],
  ...arc(-LA + R, W - R, R, 90, 180, 6),
  ...arc(-LA + R, R, R, 180, 270, 6),
]
const BACK_CHEEK = [
  [0, 0],
  [LT, 0],
  [LT, Y2],
  [0, Y1],
]
const SOCKET_BLOCK = [
  [LT, 0],
  ...arc(LB - R, R, R, 270, 360, 6),
  ...arc(LB - R, W - R, R, 0, 90, 6),
  [0, W],
  [0, Y4],
  [LT, Y3],
]
// A winch cheek plate in elevation (x, z): straight sides, a round top.
const CHEEK_PLATE = [[-0.34, 0], [0.34, 0], ...arc(0, 0.5, 0.34, 0, 180, 14)]

export default figure({
  slug: "part-5-friction",
  title: "The angle that holds",
  desc: "Two timber blocks on a bench are joined end to end by one dovetail and hauled apart by two winches. The tail flares at 15 degrees: dashed lines from its wide end land on the socket's cheeks, outside the narrower mouth. Under the pull the tail and its two angled faces glow, and the joint stays shut.",
  plate: "Part V · Friction",
  sentence:
    "The viewer sees both winches haul while the dovetail's flared tail and its two angled faces light up and the joint stays shut, which explains how an agreement survives friction: pulling on it only presses its angled faces together, so it holds by its shape, not by force.",
  view: { scale: 54, origin: [320, 172] },
  still: 0.62 * T,
  build(k) {
    k.grid("board", { at: [PX0 - 1.2, PY0 - 1.4, -0.3], size: [PX1 - PX0 + 2.4, PY1 - PY0 + 2.8], step: 0.6 })
    k.block("plate", { at: [PX0, PY0, -0.3], size: [PX1 - PX0, PY1 - PY0, 0.3], r: 0.42, layer: -3 })
    for (const [i, [x, y]] of [
      [PX0 + 0.26, PY0 + 0.26],
      [PX1 - 0.26, PY0 + 0.26],
      [PX1 - 0.26, PY1 - 0.26],
      [PX0 + 0.26, PY1 - 0.26],
    ].entries())
      k.led(`screw${i}`, { at: [x, y, 0.002], face: "+z", r: 0.06, layer: -2 })
    // The track the blocks ride on: hidden under them in the iso view, there in 3D.
    k.block("track", { at: [-LA + 0.35, CY - 0.7, 0], size: [LA + LB - 0.7, 1.4, Z0], r: 0.1, layer: -2 })
    k.halo("spill", { at: [JX, CY, 0.002], r: 2.0, layer: -1, on: 1 })

    // The winches, one at each end: a foot, two cheek plates, a drum the
    // cable winds onto, a lamp that shows the pull.
    for (const [id, xc] of [
      ["A", XA],
      ["B", XB],
    ]) {
      k.block(`foot${id}`, { at: [xc - 0.5, CY - 0.78, 0], size: [1.0, 1.56, 0.2], r: 0.16, layer: -2 })
      k.extrude(`backPlate${id}`, { at: [xc, CY - 0.56, 0.2], shape: CHEEK_PLATE, face: "+y", depth: 0.12 })
      k.extrude(`drum${id}`, { at: [xc, CY + 0.56, ZC - DR], shape: ring(0, 0, DR, 36), face: "+y", depth: 1.12 })
      for (const [j, dy] of [-0.33, -0.11, 0.11, 0.33].entries())
        k.detail(`wind${id}${j}`, {
          pts: arc(0, 0, DR, -45, 135, 10).map(([u, v]) => [xc + u, CY + dy, ZC - DR + v]),
          bias: 0.2,
        })
      k.extrude(`frontPlate${id}`, { at: [xc, CY + 0.68, 0.2], shape: CHEEK_PLATE, face: "+y", depth: 0.12 })
      k.led(`boss${id}`, { at: [xc, CY + 0.681, ZC - DR], face: "+y", r: 0.075, bias: 0.6 })
      k.led(`lamp${id}`, { at: [xc, CY + 0.681, 0.8], face: "+y", r: 0.07, bias: 0.6 })
    }

    // The cables: slack at rest, taut under pull. Plain lines: taut against
    // slack already shows the pull.
    const slack = (x0, x1) => {
      const pts = []
      for (let i = 0; i <= 10; i++) {
        const u = i / 10
        pts.push([x0 + (x1 - x0) * u, CY, ZC - 0.16 * 4 * u * (1 - u)])
      }
      return pts
    }
    const xa = -LA - 0.1
    const xb = LB + 0.1
    k.wire("cableA", { pts: [[xa, CY, ZC], [(xa + XA) / 2, CY, ZC], [XA, CY, ZC]], layer: 0, bias: -0.5, hide: true })
    k.wire("slackA", { pts: slack(xa, XA), layer: 0, bias: -0.5 })
    k.wire("cableB", { pts: [[xb, CY, ZC], [(xb + XB) / 2, CY, ZC], [XB, CY, ZC]], layer: 0, bias: 0.5, hide: true })
    k.wire("slackB", { pts: slack(xb, XB), layer: 0, bias: 0.7 })

    /** A flat panel through world points, anchored at its own centre (where 3D puts its glow). */
    const panel = (id, pts, o) => {
      const c = [0, 1, 2].map((i) => pts.reduce((a, q) => a + q[i], 0) / pts.length)
      k.face(id, { at: c, pts: pts.map((q) => [q[0] - c[0], q[1] - c[1], q[2] - c[2]]), ...o })
    }

    // The tail block, one piece with its tail, and its yoke.
    k.group("ga", { at: [0, 0, 0] })
    k.block("yokeA", { at: [xa, CY - 0.38, ZC - 0.26], size: [0.1, 0.76, 0.52], r: 0.04, parent: "ga" })
    k.extrude("tailBlock", { at: [0, 0, ZA], shape: plan(TAIL_BLOCK), face: "+z", depth: HA, parent: "ga" })
    // The tail's top, lit under load: the flare itself, drawn before the socket
    // walls so they hide what they cover (and in 3D, the real walls do).
    panel(
      "tailTop",
      [
        [0, Y4 - CLR, ZA],
        [LT, Y3 - CLR, ZA],
        [LT, Y2 + CLR, ZA],
        [0, Y1 + CLR, ZA],
      ],
      { parent: "ga", bias: -1.4, hide: true }
    )
    // Light pressed out of the joint onto the tail's top, strongest toward the
    // wide end. In 3D it is a disc the socket walls clip; at the shoulder it
    // stays inside the neck, so it never floats in the hair of a gap there.
    k.halo("press", { at: [0.95, CY, ZA + 0.003], r: 0.97, on: 1, parent: "ga", layer: 0, bias: -1.4 })
    const onA = { parent: "ga", bias: 0.6 }
    k.detail("grainA1", { pts: [[-1.0, 0.4, ZA], [-0.32, 0.4, ZA]], ...onA })
    k.detail("grainA2", { pts: [[-0.95, CY + 0.07, ZA], [LT - 0.42, CY + 0.07, ZA]], ...onA })
    k.detail("grainA3", { pts: [[-1.05, 2.1, ZA], [-0.36, 2.1, ZA]], ...onA })
    k.detail("grainA4", { pts: [[-1.0, W, Z0 + 0.4], [-0.25, W, Z0 + 0.4]], parent: "ga", bias: 1 })

    // The socket block: the back cheek's body, (the tail block), the cheek's
    // proud part, the two contact faces, then the rest of the block.
    k.group("gb", { at: [0, 0, 0] })
    k.extrude("cheek", { at: [0, 0, ZA], shape: plan(BACK_CHEEK), face: "+z", depth: HA, parent: "gb", bias: -6 })
    k.extrude("cheekProud", { at: [0, 0, ZB], shape: plan(BACK_CHEEK), face: "+z", depth: PROUD, parent: "gb" })
    // The contact faces: the flanks' real faces above the floor, lit under load.
    // Drawn before the rest of the block, whose end and front cheek hide what
    // the iso view cannot see. Wound so each faces into the socket.
    panel(
      "faceBack",
      [
        [0, Y1, ZA],
        [LT, Y2, ZA],
        [LT, Y2, ZB],
        [0, Y1, ZB],
      ],
      { parent: "gb", hide: true }
    )
    panel(
      "faceFront",
      [
        [0, Y4, ZA],
        [0, Y4, ZB],
        [LT, Y3, ZB],
        [LT, Y3, ZA],
      ],
      { parent: "gb", bias: -0.6, hide: true }
    )
    // Grain on the back face, along the cheek's split: seen from behind it reads
    // as one grain line (hidden in the iso view, drawn before the block).
    k.detail("grainBack", { pts: [[0.06, 0, ZA], [LB - 0.3, 0, ZA]], parent: "gb", bias: -1.6 })
    k.extrude("socketBlock", { at: [0, 0, ZB], shape: plan(SOCKET_BLOCK), face: "+z", depth: HA + PROUD, parent: "gb" })
    k.block("yokeB", { at: [LB, CY - 0.38, ZC - 0.26], size: [0.1, 0.76, 0.52], r: 0.04, parent: "gb", bias: 0.4 })
    k.led("boltB1", { at: [LB + 0.1, CY - 0.22, ZC], face: "+x", r: 0.05, parent: "gb", bias: 0.8 })
    k.led("boltB2", { at: [LB + 0.1, CY + 0.22, ZC], face: "+x", r: 0.05, parent: "gb", bias: 0.8 })

    // On the socket block's surfaces, drawn last.
    const top = { parent: "gb", layer: 1 }
    // The front face turns away from the iso view: its top edge carries its light.
    k.detail("edgeFront", { pts: [[0.001, Y4 - 0.004, ZB + 0.004], [LT + 0.001, Y3 - 0.004, ZB + 0.004]], ...top, hide: true })
    // A scribed baseline at the socket's depth, where the back cheek meets the end.
    k.detail("baseBack", { pts: [[LT, 0, ZB], [LT, Y2, ZB]], ...top })
    k.detail("grainB1", { pts: [[0.3, 0.2, ZB], [1.86, 0.2, ZB]], ...top })
    k.detail("grainB3", { pts: [[0.36, 2.32, ZB], [1.82, 2.32, ZB]], ...top })
    k.detail("grainB4", { pts: [[0.3, W, Z0 + 0.8], [1.86, W, Z0 + 0.8]], ...top })
    // The truth of the shape: the mouth, and lines of pull from the tail's
    // wide end that land on the cheeks, outside it.
    k.guide("mouth", { pts: [[0, Y1, ZB], [0, Y4, ZB]], ...top })
    k.guide("witL", { pts: [[LT, Y2, ZB], [0, Y2, ZB]], ...top })
    k.guide("witR", { pts: [[LT, Y3, ZB], [0, Y3, ZB]], ...top })
    // The angle between the line of pull and the back flank.
    k.label("angle", { at: [0.27, (Y2 + ys(0.27)) / 2, ZB + 0.003], text: "15°", face: "+z", size: 0.2, ...top })
  },
  tick(t, s, input) {
    const { p, groups } = s
    const lap = cycle(t, T)

    // The lap: rest; the winches take in (cables taut) and hold a beat; the
    // take-up (the blocks part by a hair); the faces bear and light; a harder
    // pull (brighter, no more opening); hold; release.
    let target = keys(lap, [
      [0, 0],
      [0.09, 0],
      [0.165, 0.12, easeIn],
      [0.205, 0.12],
      [0.25, 0.25, easeInOut],
      [0.335, 0.6, easeOut],
      [0.4, 0.6],
      [0.49, 1, easeInOut],
      [0.8, 1],
      [0.92, 0, easeInOut],
      [1, 0],
    ])

    // The pointer hauls: the farther it sits from the joint along the line of
    // pull, toward either winch, the harder both winches pull. Over the joint
    // the pull holds at a moderate load, so the joint stays lit where you look.
    const aim = input.onPlane ? input.onPlane(ZA) : null
    const aimed = !!aim && aim[0] > PX0 - 0.3 && aim[0] < PX1 + 0.3 && aim[1] > PY0 - 0.8 && aim[1] < PY1 + 0.8
    if (aimed) {
      const u = aim[0] > LT ? (aim[0] - LT) / (XB - LT) : aim[0] < 0 ? aim[0] / XA : 0
      target = 0.45 + 0.55 * clamp(u)
    }
    const pull = clamp(input.spring("pull", target))

    const taut = clamp(pull / 0.12) // cause: the cables straighten
    const take = easeOut(clamp((pull - 0.12) / 0.13)) // the hair of take-up, then it stops
    const press = clamp((pull - 0.25) / 0.75) // response: the faces bear
    groups.ga.off[0] = (-GAP / 2) * take
    groups.gb.off[0] = (GAP / 2) * take

    const pulling = pull > 0.02
    for (const id of ["A", "B"]) {
      const c = p[`cable${id}`]
      const sl = p[`slack${id}`]
      c.hide = taut <= 0
      c.fade = taut
      sl.hide = taut >= 1
      sl.fade = 1 - taut
      p[`lamp${id}`].on = pulling ? 2 : 0
      p[`lamp${id}`].glow = pulling ? 0.2 + 0.4 * pull : 0
    }

    // What is switched on: the tail and its two angled faces, brighter as the
    // pull grows. The faces carry no glow of their own (a 3D glow is a sprite
    // that the tops would cut): the press light on the tail's top carries it.
    const lit = press > 0.01
    const br = input.still ? 1 : 0.92 + 0.08 * breathe(t, 2.4)
    for (const id of ["faceBack", "faceFront", "edgeFront"]) {
      p[id].hide = !lit
      p[id].on = 1
      p[id].fade = clamp(0.35 + 0.65 * press)
    }
    p.tailTop.hide = !lit
    p.tailTop.on = 1
    p.tailTop.fade = 0.14 + 0.44 * press
    p.press.glow = press * br
    p.spill.glow = press * 0.8
    const releasing = !aimed && lap > 0.8
    s.state = !pulling
      ? "rest"
      : press >= 0.01
        ? `held at ${Math.round(pull * 100)}%`
        : releasing
          ? "release"
          : take < 0.02
            ? "cables taut"
            : "taking up"
  },
  readout: (s) => s.state || "rest",
})
