// Iso figure kit for "The Second Question".
//
// A figure is a set of solids in world space (z up), seen in true isometric
// projection. The same figure is drawn two ways from this one description:
// as a fine-line SVG (svg.js) and as an orbitable three.js scene (webgl.js).
//
// World axes on screen: +x runs right and down, +y left and down, +z up.
// The camera looks from (+x, +y, +z) toward the origin, so the faces that
// show are the top (+z), the right side (+x) and the left side (+y).
//
// Style after ISO-GLOW (isoglow.dev, MIT): fine lines on opaque faces, and
// whatever is switched on glows. Construction after Hairline (MIT): rounded
// solids drawn as a silhouette and one dim crease. Motion and checks after
// Plotter (MIT). See art/SKILL.md.

export const C30 = Math.cos(Math.PI / 6)
export const S30 = 0.5
export const TAU = Math.PI * 2
const DEG = Math.PI / 180

// ---------------------------------------------------------------- numbers

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const lerp = (a, b, t) => a + (b - a) * t
export const smooth = (t) => {
  t = clamp(t)
  return t * t * (3 - 2 * t)
}
export const easeOut = (t) => 1 - Math.pow(1 - clamp(t), 3)
export const easeIn = (t) => Math.pow(clamp(t), 3)
export const easeInOut = (t) => {
  t = clamp(t)
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/** cubic-bezier(x1, y1, x2, y2) as an easing function of t in [0, 1]. */
export function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1
  const bx = 3 * (x2 - x1) - cx
  const ax = 1 - cx - bx
  const cy = 3 * y1
  const by = 3 * (y2 - y1) - cy
  const ay = 1 - cy - by
  const x = (s) => ((ax * s + bx) * s + cx) * s
  const y = (s) => ((ay * s + by) * s + cy) * s
  const dx = (s) => (3 * ax * s + 2 * bx) * s + cx
  return (t) => {
    t = clamp(t)
    let s = t
    for (let i = 0; i < 6; i++) {
      const d = dx(s)
      if (Math.abs(d) < 1e-6) break
      s -= (x(s) - t) / d
    }
    return y(clamp(s))
  }
}

/** The long ease-out for a discrete change (Hairline's clock): 700ms on this curve. */
export const easeChoice = bezier(0.32, 0.72, 0, 1)

/** Position in a cycle of `period` seconds, 0..1. */
export const cycle = (t, period, offset = 0) => (((t / period + offset) % 1) + 1) % 1
/** A soft 0..1..0 breath over `period` seconds. */
export const breathe = (t, period, offset = 0) => 0.5 - 0.5 * Math.cos(TAU * cycle(t, period, offset))

/**
 * Piecewise keyframes. `p` is 0..1 through a cycle; `frames` is a list of
 * [at, value, ease?] with `at` rising from 0 to 1. The ease shapes the
 * segment that ends at that frame.
 */
export function keys(p, frames) {
  if (p <= frames[0][0]) return frames[0][1]
  for (let i = 1; i < frames.length; i++) {
    const [a, va] = frames[i - 1]
    const [b, vb, ease = smooth] = frames[i]
    if (p <= b) return lerp(va, vb, ease((p - a) / Math.max(1e-9, b - a)))
  }
  return frames[frames.length - 1][1]
}

// ---------------------------------------------------------------- camera

/**
 * True isometric camera. `scale` is screen units per world unit; `origin`
 * is where the world origin lands in the viewBox; `rz` turns the world
 * about the vertical axis through `pivot` (radians).
 */
export function camera({ scale = 20, origin = [280, 250], rz = 0, pivot = [0, 0] } = {}) {
  const c = Math.cos(rz)
  const s = Math.sin(rz)
  const rot = (x, y) => {
    const X = x - pivot[0]
    const Y = y - pivot[1]
    return [X * c - Y * s + pivot[0], X * s + Y * c + pivot[1]]
  }
  const P = (x, y, z) => {
    const [a, b] = rot(x, y)
    return [origin[0] + (a - b) * C30 * scale, origin[1] + (a + b) * S30 * scale - z * scale]
  }
  const depth = (x, y, z) => {
    const [a, b] = rot(x, y)
    return a + b + z
  }
  // Toward the camera, in world coordinates: a face shows when its normal
  // has a positive dot product with this.
  const view = [c + s, c - s, 1]
  const unproject = (sx, sy, z = 0) => {
    const u = (sx - origin[0]) / (C30 * scale)
    const v = (sy - origin[1] + z * scale) / (S30 * scale)
    const a = (u + v) / 2
    const b = (v - u) / 2
    const X = a - pivot[0]
    const Y = b - pivot[1]
    return [X * c + Y * s + pivot[0], -X * s + Y * c + pivot[1], z]
  }
  return { P, depth, view, unproject, scale, origin, rz, pivot }
}

// ---------------------------------------------------------------- plane geometry

/** A rounded rectangle as a closed ring of [x, y] points (counterclockwise). */
export function rrect(x0, y0, x1, y1, r, steps = 5) {
  r = Math.max(0, Math.min(r, (x1 - x0) / 2, (y1 - y0) / 2))
  if (r <= 1e-6)
    return [
      [x0, y0],
      [x1, y0],
      [x1, y1],
      [x0, y1],
    ]
  const pts = []
  const corner = (cx, cy, a0) => {
    for (let i = 0; i <= steps; i++) {
      const a = a0 + (i / steps) * (Math.PI / 2)
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
    }
  }
  corner(x1 - r, y0 + r, -Math.PI / 2)
  corner(x1 - r, y1 - r, 0)
  corner(x0 + r, y1 - r, Math.PI / 2)
  corner(x0 + r, y0 + r, Math.PI)
  return pts
}

/** A circle as a closed ring (counterclockwise). */
export function ring(cx, cy, r, n = 48) {
  const pts = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
  }
  return pts
}

/** Signed area of a 2D ring (positive when counterclockwise). */
export function area(pts) {
  let a = 0
  for (let i = 0; i < pts.length; i++) {
    const [x0, y0] = pts[i]
    const [x1, y1] = pts[(i + 1) % pts.length]
    a += x0 * y1 - x1 * y0
  }
  return a / 2
}

/** Convex hull (Andrew's monotone chain) of 2D points. */
export function hull(points) {
  const pts = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1])
  if (pts.length < 3) return pts
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lower = []
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 1e-9) lower.pop()
    lower.push(p)
  }
  const upper = []
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i]
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 1e-9) upper.pop()
    upper.push(p)
  }
  upper.pop()
  lower.pop()
  return lower.concat(upper)
}

/** Point in polygon (even-odd). */
export function inside([x, y], poly) {
  let hit = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi + 1e-12) + xi) hit = !hit
  }
  return hit
}

/**
 * Outline of a thick stroke along a 2D centerline, as one ring.
 * Flat caps; joins are mitred (fine for the gentle curves used here).
 */
export function strokeOutline(center, width) {
  const h = width / 2
  const n = center.length
  const left = []
  const right = []
  for (let i = 0; i < n; i++) {
    const p = center[i]
    const a = center[Math.max(0, i - 1)]
    const b = center[Math.min(n - 1, i + 1)]
    let dx = b[0] - a[0]
    let dy = b[1] - a[1]
    const len = Math.hypot(dx, dy) || 1
    dx /= len
    dy /= len
    // miter length correction at interior points
    let m = 1
    if (i > 0 && i < n - 1) {
      const ux = p[0] - a[0]
      const uy = p[1] - a[1]
      const ul = Math.hypot(ux, uy) || 1
      const cos = (ux / ul) * dx + (uy / ul) * dy
      m = 1 / Math.max(0.5, Math.sqrt((1 + cos) / 2))
    }
    left.push([p[0] - dy * h * m, p[1] + dx * h * m])
    right.push([p[0] + dy * h * m, p[1] - dx * h * m])
  }
  return left.concat(right.reverse())
}

/** Points along a circular arc (degrees, counterclockwise when a1 > a0). */
export function arc(cx, cy, r, a0, a1, steps = 24) {
  const pts = []
  for (let i = 0; i <= steps; i++) {
    const a = (a0 + ((a1 - a0) * i) / steps) * DEG
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
  }
  return pts
}

// ---------------------------------------------------------------- vectors

export const add3 = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
export const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
export const mul3 = (a, k) => [a[0] * k, a[1] * k, a[2] * k]
export const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** Axes of an extrusion face: where the shape's u and v run, and its normal. */
export function faceAxes(face) {
  switch (face) {
    case "+x": // shape stands on the right side; it reads rising to the right
      return { u: [0, -1, 0], v: [0, 0, 1], n: [1, 0, 0] }
    case "+z": // shape lies flat on the ground; u along x, v along -y
      return { u: [1, 0, 0], v: [0, -1, 0], n: [0, 0, 1] }
    case "+y": // shape stands on the left side; it reads falling to the right
    default:
      return { u: [1, 0, 0], v: [0, 0, 1], n: [0, 1, 0] }
  }
}

// ---------------------------------------------------------------- the kit

const KINDS = ["block", "cyl", "extrude", "wire", "led", "halo", "face", "label", "grid"]

/**
 * Creates the registry a figure's build() fills. Every part has an id, a
 * kind, a role (body, ghost, glass, recess, ...) and props a figure may
 * animate in tick(): off [dx, dy, dz], rz (degrees), on (0 off, 1 magenta,
 * 2 teal), glow (0..1), fade (0..1 opacity), hide, dash, and the paint-order
 * props bias and layer. All of them reset to their build values before each
 * tick(). In the 3D view, role and dash are fixed at build time.
 */
export function kit() {
  const parts = []
  const byId = Object.create(null)
  const groups = Object.create(null)

  const base = (kind, id, o) => {
    if (byId[id]) throw new Error(`Duplicate part id: ${id}`)
    const p = {
      id,
      kind,
      role: o.role || (kind === "wire" ? "wire" : "body"),
      at: o.at ? o.at.slice() : [0, 0, 0],
      off: [0, 0, 0],
      rz: o.rz || 0,
      on: o.on || 0,
      glow: o.glow || 0,
      fade: o.fade ?? 1,
      hide: !!o.hide,
      dash: !!o.dash,
      // A floor halo lies above the grid, base plates and floor wires; a halo
      // on a raised top is painted with the standing parts.
      layer: o.layer ?? (kind === "halo" ? (o.at && o.at[2] > 0.01 ? 0 : -1) : 0),
      bias: o.bias || 0,
      parent: o.parent || null,
      flow: o.flow || null,
      cls: o.cls || "",
      ...o,
    }
    p.at = o.at ? o.at.slice() : [0, 0, 0]
    p.off = [0, 0, 0]
    p.rest = { at: p.at.slice(), rz: p.rz, on: p.on, glow: p.glow, fade: p.fade, hide: p.hide, dash: p.dash, role: p.role, bias: p.bias, layer: p.layer }
    parts.push(p)
    byId[id] = p
    return p
  }

  return {
    parts,
    p: byId,
    groups,
    /** A group moves its children together: off and rz apply to them all. */
    group(id, o = {}) {
      const g = { id, at: o.at ? o.at.slice() : [0, 0, 0], off: [0, 0, 0], rz: 0, parent: o.parent || null }
      groups[id] = g
      return g
    },
    /** Rounded box: at = its lowest corner, size = [w, d, h] along x, y, z. */
    block(id, o) {
      return base("block", id, { r: 0.25, steps: 5, ...o })
    },
    /** Upright cylinder: at = centre of its base. */
    cyl(id, o) {
      return base("cyl", id, { radius: 1, h: 1, n: 48, ...o })
    },
    /**
     * A flat shape given as one or more rings of [u, v] points, standing on
     * a face ("+y" left side, "+x" right side, "+z" flat) and extruded back
     * by `depth`. at = where the shape's (0, 0) sits on its front plane.
     */
    extrude(id, o) {
      return base("extrude", id, { face: "+y", depth: 1, sharp: 28, ...o })
    },
    /** A line through world points (relative to at). flow animates a pulse along it. */
    wire(id, o) {
      return base("wire", id, { pts: [], layer: o.layer ?? -1, ...o })
    },
    /** A small round lamp on a face. at = its centre. */
    led(id, o) {
      return base("led", id, { r: 0.18, face: "+z", ...o })
    },
    /** Light spilled on the ground under something that glows. */
    halo(id, o) {
      return base("halo", id, { r: 3, ...o })
    },
    /** A flat polygon through world points (relative to at): a screen, a panel, a mark. */
    face(id, o) {
      return base("face", id, { pts: [], role: o.role || "deck", ...o })
    },
    /** Small mono label lying on a face. Use sparingly: names belong on the plate. */
    label(id, o) {
      return base("label", id, { text: "", face: "+z", size: 0.6, role: "label", ...o })
    },
    /**
     * A dotted construction grid on a horizontal plane, fading from its
     * centre: the drawing board under the figure. at = its lowest corner.
     */
    grid(id, o) {
      return base("grid", id, { size: [10, 10], step: 1, layer: -9, role: "grid", ...o })
    },
    /** Fine lines on a surface: seams, vents, scale ticks. Drawn in the dim detail tone. */
    detail(id, o) {
      return base("wire", id, { pts: [], role: "detail", layer: o.layer ?? 0, ...o })
    },
    /** A dashed construction line (Plotter): a witness, a projection, a limit. */
    guide(id, o) {
      return base("wire", id, { pts: [], role: "guide", layer: o.layer ?? 0, ...o })
    },
  }
}

/** World offset of a part from its groups (translation and turn about each group's anchor). */
function groupChain(part, groups) {
  const chain = []
  let g = part.parent ? groups[part.parent] : null
  while (g) {
    chain.push(g)
    g = g.parent ? groups[g.parent] : null
  }
  return chain
}

function turnAbout([x, y, z], [ax, ay], deg) {
  if (!deg) return [x, y, z]
  const c = Math.cos(deg * DEG)
  const s = Math.sin(deg * DEG)
  const X = x - ax
  const Y = y - ay
  return [ax + X * c - Y * s, ay + X * s + Y * c, z]
}

/**
 * Places a part's local points in the world: its own turn about its anchor,
 * its offset, then for each group, innermost first: the group's position
 * (a child's `at` is relative to its group's `at`), turn and offset.
 */
export function placer(part, groups) {
  const chain = groupChain(part, groups)
  const anchor = part.at
  return (local) => {
    let p = [anchor[0] + local[0], anchor[1] + local[1], anchor[2] + local[2]]
    p = turnAbout(p, anchor, part.rz)
    p = add3(p, part.off)
    for (const g of chain) {
      p = add3(p, g.at)
      p = turnAbout(p, g.at, g.rz)
      p = add3(p, g.off)
    }
    return p
  }
}

/**
 * World geometry of a part, independent of the renderer.
 * Returns { rings: [bottom, top] } for solids, { front, back, axes } for
 * extrusions, { pts } for wires and faces, { centre, normal } for lamps.
 */
export function geometry(part, groups) {
  const place = placer(part, groups)
  switch (part.kind) {
    case "block": {
      const [w, d, h] = part.size
      const plan = rrect(0, 0, w, d, part.r, part.steps)
      return {
        bottom: plan.map(([x, y]) => place([x, y, 0])),
        top: plan.map(([x, y]) => place([x, y, h])),
        centre: place([w / 2, d / 2, h / 2]),
      }
    }
    case "cyl": {
      const plan = ring(0, 0, part.radius, part.n)
      return {
        bottom: plan.map(([x, y]) => place([x, y, 0])),
        top: plan.map(([x, y]) => place([x, y, part.h])),
        centre: place([0, 0, part.h / 2]),
      }
    }
    case "extrude": {
      const ax = faceAxes(part.face)
      const shapes = Array.isArray(part.shape[0][0]) ? part.shape : [part.shape]
      const solids = shapes.map((shape) => {
        const ccw = area(shape) >= 0 ? shape : shape.slice().reverse()
        const to3 = ([u, v], k) =>
          place(add3(add3(mul3(ax.u, u), mul3(ax.v, v)), mul3(ax.n, -k)))
        return {
          shape: ccw,
          front: ccw.map((q) => to3(q, 0)),
          back: ccw.map((q) => to3(q, part.depth)),
        }
      })
      // Normals turn with the part and its groups: derive them from placed points.
      const o = place([0, 0, 0])
      const nW = sub3(place(ax.n), o)
      const uW = sub3(place(ax.u), o)
      const vW = sub3(place(ax.v), o)
      let cx = 0
      let cy = 0
      let cz = 0
      let k = 0
      for (const s of solids)
        for (const q of s.front.concat(s.back)) {
          cx += q[0]
          cy += q[1]
          cz += q[2]
          k++
        }
      return { solids, n: nW, u: uW, v: vW, centre: [cx / k, cy / k, cz / k] }
    }
    case "wire": {
      const pts = part.pts.map(place)
      const mid = pts[Math.floor(pts.length / 2)] || place([0, 0, 0])
      return { pts, centre: mid }
    }
    case "face": {
      const pts = part.pts.map(place)
      const c = pts.reduce((a, q) => add3(a, q), [0, 0, 0]).map((v) => v / Math.max(1, pts.length))
      return { pts, centre: c }
    }
    case "led": {
      const ax = faceAxes(part.face)
      const n = 24
      const pts = []
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU
        pts.push(place(add3(mul3(ax.u, part.r * Math.cos(a)), mul3(ax.v, part.r * Math.sin(a)))))
      }
      return { pts, centre: place([0, 0, 0]), axes: ax }
    }
    case "halo": {
      const n = 40
      const pts = []
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU
        pts.push(place([part.r * Math.cos(a), part.r * Math.sin(a), 0]))
      }
      return { pts, centre: place([0, 0, 0]) }
    }
    case "label": {
      return { centre: place([0, 0, 0]), axes: faceAxes(part.face) }
    }
    case "grid": {
      const [w, d] = part.size
      const pts = []
      for (let x = 0; x <= w + 1e-9; x += part.step)
        for (let y = 0; y <= d + 1e-9; y += part.step) {
          const fx = (x - w / 2) / (w / 2)
          const fy = (y - d / 2) / (d / 2)
          pts.push({ p: place([x, y, 0]), r: Math.hypot(fx, fy) })
        }
      return { dots: pts, centre: place([w / 2, d / 2, 0]) }
    }
    default:
      throw new Error(`Unknown part kind: ${part.kind} (expected one of ${KINDS.join(", ")})`)
  }
}

// ---------------------------------------------------------------- figures

/**
 * Declares a figure. See art/SKILL.md for every field.
 *
 *   slug      file name and id prefix
 *   title     short accessible name of the drawing
 *   desc      what the rest pose shows, in one or two plain sentences
 *   plate     the name on the figure's plate (mono caption), e.g. "Chapter 19"
 *   sentence  "The viewer sees [change], which explains [relationship]."
 *   view      { scale, origin } fitting the figure in the 560 x 440 frame
 *   still     the time (s) of the designed still: poster, static export, reduced motion
 *   build(k)  adds the parts; may return extra state
 *   tick(t, s, input)  sets part props for time t; input has pointer, pick, spring, tween
 *   readout(s, input)  a few characters naming what is under the pointer, or "rest"
 */
export function figure(def) {
  const required = ["slug", "title", "desc", "build"]
  for (const k of required) if (!def[k]) throw new Error(`figure() needs ${k}`)
  return {
    view: { scale: 20, origin: [280, 250] },
    still: 0,
    width: 560,
    height: 440,
    tick: () => {},
    readout: () => "",
    ...def,
  }
}

/** Builds a figure's parts and returns its live state. */
export function instantiate(fig) {
  const k = kit()
  const extra = fig.build(k) || {}
  return { fig, k, parts: k.parts, p: k.p, groups: k.groups, ...extra }
}

/** Resets every animatable prop to rest, so tick() always starts clean. */
export function resetProps(state) {
  for (const p of state.parts) {
    const r = p.rest
    p.off[0] = p.off[1] = p.off[2] = 0
    p.at[0] = r.at[0]
    p.at[1] = r.at[1]
    p.at[2] = r.at[2]
    p.rz = r.rz
    p.on = r.on
    p.glow = r.glow
    p.fade = r.fade
    p.hide = r.hide
    p.dash = r.dash
    p.role = r.role
    p.bias = r.bias
    p.layer = r.layer
  }
  for (const g of Object.values(state.groups)) {
    g.off[0] = g.off[1] = g.off[2] = 0
    g.rz = 0
  }
}
