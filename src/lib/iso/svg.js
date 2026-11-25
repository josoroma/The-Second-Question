// SVG renderer for iso figures: one function computes the drawing as plain
// data (pieces per part, in paint order); renderToString() serialises it for
// static files, and mountSVG() keeps a live <svg> in step with it.

import {
  add3,
  camera,
  clamp,
  dot3,
  geometry,
  hull,
  inside,
  instantiate,
  mul3,
  resetProps,
} from "./core.js"

const R = (v) => Math.round(v * 100) / 100

export function pathOf(pts, close = true) {
  if (!pts.length) return ""
  let d = `M${R(pts[0][0])} ${R(pts[0][1])}`
  for (let i = 1; i < pts.length; i++) d += `L${R(pts[i][0])} ${R(pts[i][1])}`
  return close ? `${d}Z` : d
}

function segPath(segs) {
  // segs: [[a, b], ...] screen points; consecutive segments are joined.
  let d = ""
  let last = null
  for (const [a, b] of segs) {
    if (!last || Math.abs(last[0] - a[0]) > 0.01 || Math.abs(last[1] - a[1]) > 0.01) d += `M${R(a[0])} ${R(a[1])}`
    d += `L${R(b[0])} ${R(b[1])}`
    last = b
  }
  return d
}

/** Which of the three iso faces a world normal looks like: up, right or left. */
export function toneOf(n, cam) {
  const c = Math.cos(cam.rz)
  const s = Math.sin(cam.rz)
  const nx = n[0] * c - n[1] * s
  const ny = n[0] * s + n[1] * c
  const nz = n[2]
  const len = Math.hypot(nx, ny, nz) || 1
  if (nz / len > 0.5) return "up"
  return nx >= ny ? "right" : "left"
}

const avgDepth = (pts, cam) => pts.reduce((a, q) => a + cam.depth(q[0], q[1], q[2]), 0) / Math.max(1, pts.length)

// ---------------------------------------------------------------- pieces per kind

function solidPieces(part, geo, cam) {
  const B = geo.bottom.map((q) => cam.P(q[0], q[1], q[2]))
  const T = geo.top.map((q) => cam.P(q[0], q[1], q[2]))
  const sil = hull(B.concat(T))
  if (part.role === "ghost" || part.dash) {
    const ghost = [
      { c: "out", d: pathOf(sil) },
      { c: "crease", d: pathOf(T) },
    ]
    if (part.glow > 0) ghost.unshift({ c: "bloom", d: pathOf(sil), o: part.glow })
    return ghost
  }
  const pieces = []
  if (part.glow > 0) pieces.push({ c: "bloom", d: pathOf(sil), o: part.glow })
  pieces.push({ c: "side", d: pathOf(sil) })
  pieces.push({ c: "top", d: pathOf(T) })
  pieces.push({ c: "out", d: pathOf(sil) })
  return pieces
}

function extrudePieces(part, geo, cam) {
  const view = cam.view
  const pieces = []
  const ghost = part.role === "ghost" || part.dash
  const capFront = dot3(geo.n, view) > 0
  const capTone = toneOf(capFront ? geo.n : mul3(geo.n, -1), cam)
  const solids = geo.solids
    .map((s) => ({ s, depth: avgDepth(s.front.concat(s.back), cam) }))
    .sort((a, b) => a.depth - b.depth)

  if (part.glow > 0) {
    const all = []
    for (const { s } of solids) for (const q of s.front.concat(s.back)) all.push(cam.P(q[0], q[1], q[2]))
    pieces.push({ c: "bloom", d: pathOf(hull(all)), o: part.glow })
  }

  for (const { s } of solids) {
    const n = s.shape.length
    const cap3 = capFront ? s.front : s.back
    const far3 = capFront ? s.back : s.front
    const cap = cap3.map((q) => cam.P(q[0], q[1], q[2]))
    const far = far3.map((q) => cam.P(q[0], q[1], q[2]))
    const vis = new Array(n)
    const tone = new Array(n)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const du = s.shape[j][0] - s.shape[i][0]
      const dv = s.shape[j][1] - s.shape[i][1]
      const nw = add3(mul3(geo.u, dv), mul3(geo.v, -du))
      vis[i] = dot3(nw, view) > 1e-9
      tone[i] = toneOf(nw, cam)
    }
    const sharpAt = (i) => {
      const a = s.shape[(i - 1 + n) % n]
      const b = s.shape[i]
      const c = s.shape[(i + 1) % n]
      const e1x = b[0] - a[0]
      const e1y = b[1] - a[1]
      const e2x = c[0] - b[0]
      const e2y = c[1] - b[1]
      const cos = (e1x * e2x + e1y * e2y) / ((Math.hypot(e1x, e1y) * Math.hypot(e2x, e2y)) || 1)
      return (Math.acos(clamp(cos, -1, 1)) * 180) / Math.PI > part.sharp
    }

    if (ghost) {
      const capSegs = []
      const farSegs = []
      const conn = []
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n
        capSegs.push([cap[i], cap[j]])
        farSegs.push([far[i], far[j]])
        const prev = (i - 1 + n) % n
        if (vis[i] !== vis[prev]) conn.push([cap[i], far[i]])
      }
      pieces.push({ c: "ghost-cap", d: pathOf(cap) })
      pieces.push({ c: "out far", d: segPath(farSegs) })
      pieces.push({ c: "out", d: segPath(conn) })
      pieces.push({ c: "out", d: segPath(capSegs) })
      continue
    }

    // Runs of visible side quads that share a tone.
    let start = 0
    for (let i = 0; i < n; i++) {
      const prev = (i - 1 + n) % n
      if (vis[i] && (!vis[prev] || tone[prev] !== tone[i])) {
        start = i
        break
      }
    }
    const strips = []
    let cur = null
    for (let k = 0; k < n; k++) {
      const i = (start + k) % n
      if (!vis[i]) {
        cur = null
        continue
      }
      if (!cur || tone[i] !== cur.tone) {
        cur = { tone: tone[i], idx: [] }
        strips.push(cur)
      }
      cur.idx.push(i)
    }
    for (const st of strips) {
      const pts = []
      for (const i of st.idx) pts.push(cap3[i], far3[i], cap3[(i + 1) % n], far3[(i + 1) % n])
      st.depth = avgDepth(pts, cam)
    }
    strips.sort((a, b) => a.depth - b.depth)

    for (const st of strips) {
      const i0 = st.idx[0]
      const i1 = st.idx[st.idx.length - 1]
      const front = st.idx.map((i) => cap[i]).concat([cap[(i1 + 1) % n]])
      const back = st.idx.map((i) => far[i]).concat([far[(i1 + 1) % n]])
      pieces.push({ c: `side t-${st.tone}`, d: pathOf(front.concat(back.slice().reverse())) })
      const bright = []
      const dim = []
      for (let k = 0; k < back.length - 1; k++) bright.push([back[k], back[k + 1]])
      const prev = (i0 - 1 + n) % n
      const next = (i1 + 1) % n
      if (!vis[prev]) bright.push([cap[i0], far[i0]])
      else if (sharpAt(i0)) dim.push([cap[i0], far[i0]])
      if (!vis[next]) bright.push([cap[next], far[next]])
      else if (sharpAt(next)) dim.push([cap[next], far[next]])
      for (let k = 1; k < st.idx.length; k++) {
        const v = st.idx[k]
        if (sharpAt(v)) dim.push([cap[v], far[v]])
      }
      if (dim.length) pieces.push({ c: "crease", d: segPath(dim) })
      pieces.push({ c: "out", d: segPath(bright) })
    }

    // The cap: its edges are creases where a side shows, contours elsewhere.
    pieces.push({ c: `cap t-${capTone}`, d: pathOf(cap) })
    const dim = []
    const bright = []
    for (let i = 0; i < n; i++) {
      const seg = [cap[i], cap[(i + 1) % n]]
      if (vis[i]) dim.push(seg)
      else bright.push(seg)
    }
    if (dim.length) pieces.push({ c: "crease cap-edge", d: segPath(dim) })
    if (bright.length) pieces.push({ c: "out", d: segPath(bright) })
  }
  return pieces
}

function gridPieces(part, geo, cam) {
  const rings = ["", "", ""]
  for (const { p, r } of geo.dots) {
    if (r > 1.02) continue
    const [x, y] = cam.P(p[0], p[1], p[2])
    const k = r < 0.45 ? 0 : r < 0.75 ? 1 : 2
    rings[k] += `M${R(x)} ${R(y)}h0`
  }
  return rings.map((d, i) => ({ c: `grid g${i}`, d })).filter((q) => q.d)
}

function wirePieces(part, geo, cam) {
  const P = geo.pts.map((q) => cam.P(q[0], q[1], q[2]))
  const d = pathOf(P, false)
  if (part.role === "detail") return [{ c: "detail", d }]
  if (part.role === "guide") return [{ c: "guide", d }]
  const pieces = [{ c: "under", d }, { c: "wire", d }]
  if (part.flow) pieces.push({ c: "pulse", d, flow: part.flow })
  return pieces
}

function ledPieces(part, geo, cam) {
  const P = geo.pts.map((q) => cam.P(q[0], q[1], q[2]))
  const d = pathOf(P)
  const pieces = []
  if (part.glow > 0) pieces.push({ c: "bloom", d, o: part.glow })
  pieces.push({ c: "led", d })
  return pieces
}

function haloPieces(part, geo, cam) {
  const P = geo.pts.map((q) => cam.P(q[0], q[1], q[2]))
  return [{ c: "halo", d: pathOf(P), o: part.glow }]
}

function facePieces(part, geo, cam) {
  const P = geo.pts.map((q) => cam.P(q[0], q[1], q[2]))
  const pieces = []
  if (part.glow > 0) pieces.push({ c: "bloom", d: pathOf(P), o: part.glow })
  pieces.push({ c: "face", d: pathOf(P) })
  return pieces
}

function labelPieces(part, geo, cam) {
  const [x, y] = cam.P(geo.centre[0], geo.centre[1], geo.centre[2])
  const o = cam.P(0, 0, 0)
  const u = cam.P(geo.axes.u[0], geo.axes.u[1], geo.axes.u[2])
  const v = cam.P(-geo.axes.v[0], -geo.axes.v[1], -geo.axes.v[2])
  // The label's font is 10px: scale it so its em is `size` world units.
  const k = (part.size * cam.scale) / 10
  const a = ((u[0] - o[0]) / cam.scale) * k
  const b = ((u[1] - o[1]) / cam.scale) * k
  const c = ((v[0] - o[0]) / cam.scale) * k
  const d = ((v[1] - o[1]) / cam.scale) * k
  return [
    {
      tag: "text",
      c: "label",
      text: part.text,
      transform: `matrix(${R(a)} ${R(b)} ${R(c)} ${R(d)} ${R(x)} ${R(y)})`,
      anchor: part.anchor || "middle",
    },
  ]
}

const PIECES = {
  block: solidPieces,
  cyl: solidPieces,
  extrude: extrudePieces,
  wire: wirePieces,
  led: ledPieces,
  halo: haloPieces,
  face: facePieces,
  label: labelPieces,
  grid: gridPieces,
}

/** The whole drawing for the state's current props: parts in paint order with their pieces. */
export function drawing(state, cam) {
  const items = []
  for (const part of state.parts) {
    if (part.hide) continue
    const geo = geometry(part, state.groups)
    const pieces = PIECES[part.kind](part, geo, cam)
    const depth = cam.depth(geo.centre[0], geo.centre[1], geo.centre[2]) + part.bias
    items.push({ part, pieces, depth })
  }
  items.sort((a, b) => a.part.layer - b.part.layer || a.depth - b.depth)
  return items
}

export function partClass(part) {
  let c = `p k-${part.kind} r-${part.role}`
  if (part.on === 1) c += " on"
  if (part.on === 2) c += " on2"
  if (part.dash) c += " dash"
  if (part.cls) c += ` ${part.cls}`
  return c
}

/** Camera for a figure, optionally turned about its pivot (radians). */
export function figureCamera(fig, rz = 0) {
  return camera({ scale: fig.view.scale, origin: fig.view.origin, rz, pivot: fig.view.pivot || [0, 0] })
}

/** Input for tick() when nothing is live: springs and tweens land on their targets. */
export function stillInput() {
  return {
    pointer: null,
    screen: null,
    dt: 0,
    still: true,
    spring: (_k, target) => target,
    tween: (_k, target) => target,
    pick: () => null,
    near: () => Infinity,
    onPlane: () => null,
  }
}

/** Evaluates a figure at time t and returns its drawing (for files and posters). */
export function frameAt(fig, t = fig.still, opts = {}) {
  const state = opts.state || instantiate(fig)
  resetProps(state)
  fig.tick(t, state, opts.input || stillInput())
  const cam = figureCamera(fig, opts.rz || 0)
  return { state, cam, items: drawing(state, cam) }
}

// ---------------------------------------------------------------- static SVG

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch])

/** Shared defs: glow filters and the halo gradient, with ids under a prefix. */
export function defsMarkup(prefix) {
  return (
    `<defs>` +
    `<filter id="${prefix}-bloom" filterUnits="userSpaceOnUse" x="-200" y="-200" width="960" height="840"><feGaussianBlur stdDeviation="7"/></filter>` +
    `<filter id="${prefix}-soft" filterUnits="userSpaceOnUse" x="-200" y="-200" width="960" height="840"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>` +
    `<radialGradient id="${prefix}-halo"><stop offset="0" stop-color="var(--iso-accent)" stop-opacity=".34"/><stop offset=".55" stop-color="var(--iso-accent)" stop-opacity=".1"/><stop offset="1" stop-color="var(--iso-accent)" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="${prefix}-halo2"><stop offset="0" stop-color="var(--iso-accent2)" stop-opacity=".32"/><stop offset=".55" stop-color="var(--iso-accent2)" stop-opacity=".09"/><stop offset="1" stop-color="var(--iso-accent2)" stop-opacity="0"/></radialGradient>` +
    `</defs>`
  )
}

function pieceMarkup(p, prefix) {
  if (p.tag === "text")
    return `<text class="${p.c}" transform="${p.transform}" text-anchor="${p.anchor}" dominant-baseline="central">${esc(p.text)}</text>`
  let attrs = `class="${p.c}" d="${p.d}"`
  if (p.c === "pulse") {
    const f = p.flow
    attrs += ` pathLength="100" style="--flow-dur:${f.period || 2.4}s;--flow-delay:${f.delay || 0}s;--flow-dash:${f.size || 6}"`
  }
  if (p.o !== undefined) attrs += ` style="opacity:${R(clamp(p.o))}"`
  if (p.c === "halo") attrs += ` fill="url(#${prefix}-${p.alt ? "halo2" : "halo"})"`
  if (p.c === "bloom") attrs += ` filter="url(#${prefix}-bloom)"`
  return `<path ${attrs}/>`
}

/** Serialises a drawing. `style` is the stylesheet to embed (files outside the site). */
export function renderToString(fig, opts = {}) {
  const prefix = opts.prefix || `iso-${fig.slug}`
  const { items } = frameAt(fig, opts.t ?? fig.still, opts)
  const body = items
    .map(({ part, pieces }) => {
      const style = part.fade < 1 ? ` style="opacity:${R(part.fade)}"` : ""
      const inner = pieces
        .map((p) => pieceMarkup(p.c === "halo" && part.on === 2 ? { ...p, alt: true } : p, prefix))
        .join("")
      return `<g class="${partClass(part)}" data-id="${esc(part.id)}"${style}>${inner}</g>`
    })
    .join("")
  const title = opts.title ?? fig.title
  const desc = opts.desc ?? fig.desc
  const size = opts.size ? ` width="${opts.size[0]}" height="${opts.size[1]}"` : ""
  const vb = opts.viewBox || `0 0 ${fig.width} ${fig.height}`
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"${size} class="iso${opts.className ? ` ${opts.className}` : ""}" data-fig="${esc(fig.slug)}" role="img" aria-labelledby="${prefix}-title ${prefix}-desc">` +
    `<title id="${prefix}-title">${esc(title)}</title><desc id="${prefix}-desc">${esc(desc)}</desc>` +
    (opts.style ? `<style>${opts.style}</style>` : "") +
    defsMarkup(prefix) +
    `<g class="scene">${body}</g></svg>`
  )
}

// ---------------------------------------------------------------- live SVG

const SVGNS = "http://www.w3.org/2000/svg"

/**
 * Keeps an <svg> in step with a figure: builds it, runs its loop while it is
 * visible, and lets it answer the pointer. Returns { destroy, render, state }.
 */
export function mountSVG(svg, fig, opts = {}) {
  const prefix = opts.prefix || svg.getAttribute("data-prefix") || `iso-${fig.slug}`
  const state = instantiate(fig)
  const runtime = opts.runtime
  let scene = svg.querySelector("g.scene")
  if (!scene) {
    svg.insertAdjacentHTML("beforeend", defsMarkup(prefix))
    scene = document.createElementNS(SVGNS, "g")
    scene.setAttribute("class", "scene")
    svg.appendChild(scene)
  }
  // Start from scratch: the server-rendered still is replaced by live nodes.
  scene.textContent = ""
  const nodes = new Map()
  let order = []
  let rz = opts.rz || 0
  let cam = figureCamera(fig, rz)

  // Hit areas come from the rest pose (Hairline's first rule): picking never
  // follows what is moving under the pointer.
  let restPolys = null
  const computeRest = () => {
    const { items } = frameAt(fig, fig.still, { state, rz })
    restPolys = items.map(({ part, pieces }) => {
      const pts = []
      for (const p of pieces) {
        if (!p.d) continue
        for (const m of p.d.matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/g)) pts.push([+m[1], +m[2]])
      }
      return { id: part.id, poly: pts.length > 2 ? hull(pts) : [] }
    })
  }

  const pointer = { screen: null, world: null }
  const input = runtime ? runtime.input(pointer, () => restPolys) : stillInput()
  // Where the pointer meets the horizontal plane at height z (a fixed plane,
  // so hit tests never follow what moves).
  input.onPlane = (z) => (pointer.screen ? cam.unproject(pointer.screen[0], pointer.screen[1], z) : null)

  const render = (t) => {
    resetProps(state)
    input.pointer = pointer.world
    input.screen = pointer.screen
    fig.tick(t, state, input)
    const items = drawing(state, cam)
    const ids = items.map((it) => it.part.id)
    for (const { part, pieces } of items) {
      let n = nodes.get(part.id)
      const sig = pieces.map((p) => p.c).join("|")
      if (!n) {
        const g = document.createElementNS(SVGNS, "g")
        g.setAttribute("data-id", part.id)
        n = { g, sig: "", els: [] }
        nodes.set(part.id, n)
      }
      const cls = partClass(part)
      if (n.cls !== cls) {
        n.g.setAttribute("class", cls)
        n.cls = cls
      }
      const op = part.fade < 1 ? String(R(part.fade)) : ""
      if (n.op !== op) {
        n.g.style.opacity = op
        n.op = op
      }
      if (n.sig !== sig) {
        n.g.textContent = ""
        n.els = pieces.map((p) => {
          const el = document.createElementNS(SVGNS, p.tag || "path")
          el.setAttribute("class", p.c)
          if (p.tag === "text") {
            el.setAttribute("text-anchor", p.anchor)
            el.setAttribute("dominant-baseline", "central")
            el.textContent = p.text
          }
          if (p.c === "pulse") {
            el.setAttribute("pathLength", "100")
            el.style.setProperty("--flow-dur", `${p.flow.period || 2.4}s`)
            el.style.setProperty("--flow-delay", `${p.flow.delay || 0}s`)
            el.style.setProperty("--flow-dash", `${p.flow.size || 6}`)
          }
          if (p.c === "halo") el.setAttribute("fill", `url(#${prefix}-${part.on === 2 ? "halo2" : "halo"})`)
          if (p.c === "bloom") el.setAttribute("filter", `url(#${prefix}-bloom)`)
          n.g.appendChild(el)
          return el
        })
        n.sig = sig
        n.ds = []
      }
      pieces.forEach((p, i) => {
        const el = n.els[i]
        if (p.tag === "text") {
          if (n.ds[i] !== p.transform) el.setAttribute("transform", p.transform)
          n.ds[i] = p.transform
        } else if (n.ds[i] !== p.d) {
          el.setAttribute("d", p.d)
          n.ds[i] = p.d
        }
        if (p.o !== undefined) el.style.opacity = String(R(clamp(p.o)))
      })
    }
    // Remove hidden parts, then fix paint order only when it changed.
    for (const [id, n] of nodes)
      if (!ids.includes(id) && n.g.parentNode) {
        n.g.remove()
      }
    if (ids.join("|") !== order.join("|")) {
      for (const id of ids) scene.appendChild(nodes.get(id).g)
      order = ids
    }
    if (opts.onReadout) opts.onReadout(fig.readout(state, input) || "rest")
  }

  computeRest()
  const toViewBox = (e) => {
    const r = svg.getBoundingClientRect()
    const vb = svg.viewBox.baseVal
    return [vb.x + ((e.clientX - r.left) / r.width) * vb.width, vb.y + ((e.clientY - r.top) / r.height) * vb.height]
  }
  const onMove = (e) => {
    pointer.screen = toViewBox(e)
    pointer.world = cam.unproject(pointer.screen[0], pointer.screen[1], 0)
    if (handle) handle.wake()
  }
  const onLeave = () => {
    pointer.screen = null
    pointer.world = null
    if (handle) handle.wake()
  }
  if (opts.interactive !== false) {
    svg.addEventListener("pointermove", onMove)
    svg.addEventListener("pointerdown", onMove)
    svg.addEventListener("pointerleave", onLeave)
  }

  const handle = runtime ? runtime.add(svg, fig, render, input) : null
  if (!handle) render(fig.still)

  return {
    state,
    render,
    setTurn(next) {
      rz = next
      cam = figureCamera(fig, rz)
      computeRest()
      if (handle) handle.wake()
    },
    destroy() {
      svg.removeEventListener("pointermove", onMove)
      svg.removeEventListener("pointerdown", onMove)
      svg.removeEventListener("pointerleave", onLeave)
      if (handle) handle.remove()
    },
    pick(screen) {
      if (!restPolys || !screen) return null
      for (let i = restPolys.length - 1; i >= 0; i--) if (restPolys[i].poly.length && inside(screen, restPolys[i].poly)) return restPolys[i].id
      return null
    },
  }
}
