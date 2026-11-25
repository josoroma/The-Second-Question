// The same figures as orbitable three.js scenes. Every part is built once in
// its own local frame; each frame, tick() moves the parts and this file copies
// their placement into the meshes. The isometric view matches the SVG exactly;
// drag turns the figure, Revolve spins it, Iso view brings it back.
//
// World (x, y, z), z up, maps to three.js (x, z, y). Swapping two axes mirrors
// the scene, which is what the SVG projection does too, so both read the same.

import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { LineMaterial } from "three/addons/lines/LineMaterial.js"
import { LineSegments2 } from "three/addons/lines/LineSegments2.js"
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js"
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js"
import { area, faceAxes, geometry, instantiate, placer, resetProps, ring, rrect } from "./core.js"
import { figureCamera } from "./svg.js"

const V3 = (p) => new THREE.Vector3(p[0], p[2], p[1])

// The figures use exact token colors (the same hex values as the SVG), so the
// scene skips three.js's linear color pipeline: what goes in is what shows.
THREE.ColorManagement.enabled = false

// ---------------------------------------------------------------- tokens

const TOKEN_NAMES = [
  "panel", "body", "body-2", "deck", "line", "detail", "ink", "glass", "recess",
  "accent", "accent-hi", "accent-lo", "accent2", "accent2-hi", "accent2-lo",
  "brand", "brand-up", "brand-side", "brand2", "brand2-up", "brand2-side",
]

function readTokens(el) {
  const cs = getComputedStyle(el)
  const t = {}
  for (const n of TOKEN_NAMES) {
    const v = cs.getPropertyValue(`--iso-${n}`).trim()
    t[n] = new THREE.Color(v || "#888888")
  }
  t.dark = document.documentElement.classList.contains("dark")
  return t
}

/** Colors for a part: the three tones of its faces, its lines and its glow. */
function paletteFor(part, tk) {
  const role = part.on === 1 ? "accent" : part.on === 2 ? "accent2" : part.role
  const set = {
    accent: [tk["accent-hi"], tk.accent, tk["accent-lo"], tk["accent-hi"], tk.accent],
    accent2: [tk["accent2-hi"], tk.accent2, tk["accent2-lo"], tk["accent2-hi"], tk.accent2],
    brand: [tk["brand-up"], tk.brand, tk["brand-side"], tk["brand-up"], tk.brand],
    brand2: [tk["brand2-up"], tk.brand2, tk["brand2-side"], tk["brand2-up"], tk.brand2],
    glass: [tk.glass, tk.glass, tk.glass, tk.line, tk.accent],
    recess: [tk.recess, tk.recess, tk.recess, tk.detail, tk.accent],
  }[role] || [tk.deck, tk.body, tk["body-2"], tk.line, tk.accent]
  const [up, right, left, line, glow] = set
  return { up, right, left, line, glow, crease: role in { accent: 1, accent2: 1, brand: 1, brand2: 1 } ? line : tk.detail }
}

// ---------------------------------------------------------------- shaders

const toneMaterial = () =>
  new THREE.ShaderMaterial({
    uniforms: {
      cUp: { value: new THREE.Color() },
      cRight: { value: new THREE.Color() },
      cLeft: { value: new THREE.Color() },
      cDown: { value: new THREE.Color() },
      opacity: { value: 1 },
    },
    vertexShader: `varying vec3 vN;
      void main(){ vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform vec3 cUp, cRight, cLeft, cDown; uniform float opacity; varying vec3 vN;
      void main(){
        vec3 n = normalize(vN);
        float up = max(n.y, 0.0), r = max(n.x, 0.0), l = max(n.z, 0.0);
        float dn = max(-n.y, 0.0) + 0.6 * max(-n.x, 0.0) + 0.6 * max(-n.z, 0.0);
        float wu = up * up * up, wr = r * r * r, wl = l * l * l, wd = dn * dn * dn;
        vec3 c = (cUp * wu + cRight * wr + cLeft * wl + cDown * wd) / max(1e-4, wu + wr + wl + wd);
        gl_FragColor = vec4(c, opacity);
      }`,
    side: THREE.FrontSide,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  })

// Silhouette: back faces pushed out along their screen-space normal by a pixel.
const outlineMaterial = (res) =>
  new THREE.ShaderMaterial({
    uniforms: { color: { value: new THREE.Color() }, thickness: { value: 1.1 }, res: { value: res }, opacity: { value: 1 } },
    vertexShader: `uniform float thickness; uniform vec2 res;
      void main(){
        vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vec4 n = projectionMatrix * vec4(normalize(normalMatrix * normal), 0.0);
        vec2 d = length(n.xy) > 1e-5 ? normalize(n.xy) : vec2(0.0);
        p.xy += d * thickness * 2.0 / res * p.w;
        gl_Position = p;
      }`,
    fragmentShader: `uniform vec3 color; uniform float opacity; void main(){ gl_FragColor = vec4(color, opacity); }`,
    side: THREE.BackSide,
    transparent: true,
  })

let glowTexture = null
function radialTexture() {
  if (glowTexture) return glowTexture
  const c = document.createElement("canvas")
  c.width = c.height = 128
  const g = c.getContext("2d")
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, "rgba(255,255,255,1)")
  grad.addColorStop(0.45, "rgba(255,255,255,.35)")
  grad.addColorStop(1, "rgba(255,255,255,0)")
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  glowTexture = new THREE.CanvasTexture(c)
  return glowTexture
}

// ---------------------------------------------------------------- local geometry

/**
 * Mapping world to three.js swaps two axes, which mirrors every triangle:
 * swap each triangle's last two vertices so outward faces wind
 * counterclockwise again (the silhouette pass relies on it).
 */
function finish(pos, nor) {
  for (let t = 0; t < pos.length; t += 9) {
    for (let k = 0; k < 3; k++) {
      const a = t + 3 + k
      const b = t + 6 + k
      ;[pos[a], pos[b]] = [pos[b], pos[a]]
      ;[nor[a], nor[b]] = [nor[b], nor[a]]
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3))
  return g
}

/** A prism between two rings in a part's local frame (z up), as a BufferGeometry. */
function prismGeometry(plan, h) {
  const pos = []
  const nor = []
  const n = plan.length
  const ccw = area(plan) >= 0 ? plan : plan.slice().reverse()
  // caps (rings here are convex: fans are fine)
  for (const [z, s] of [
    [h, 1],
    [0, -1],
  ]) {
    for (let i = 1; i < n - 1; i++) {
      const tri = s > 0 ? [ccw[0], ccw[i], ccw[i + 1]] : [ccw[0], ccw[i + 1], ccw[i]]
      for (const q of tri) {
        pos.push(...V3([q[0], q[1], z]).toArray())
        nor.push(0, s, 0)
      }
    }
  }
  // sides, with smooth normals so rounded corners shade softly
  const vn = ccw.map((q, i) => {
    const a = ccw[(i - 1 + n) % n]
    const b = ccw[(i + 1) % n]
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const l = Math.hypot(dx, dy) || 1
    return [dy / l, -dx / l]
  })
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a = ccw[i]
    const b = ccw[j]
    // sharp corner? use the face normal instead of the smooth one
    const fx = b[1] - a[1]
    const fy = -(b[0] - a[0])
    const fl = Math.hypot(fx, fy) || 1
    const sharp = (k) => vn[k][0] * (fx / fl) + vn[k][1] * (fy / fl) < 0.8
    const na = sharp(i) ? [fx / fl, fy / fl] : vn[i]
    const nb = sharp(j) ? [fx / fl, fy / fl] : vn[j]
    const quad = [
      [a, 0, na],
      [b, 0, nb],
      [b, h, nb],
      [a, 0, na],
      [b, h, nb],
      [a, h, na],
    ]
    for (const [q, z, nn] of quad) {
      pos.push(...V3([q[0], q[1], z]).toArray())
      nor.push(...V3([nn[0], nn[1], 0]).toArray())
    }
  }
  return finish(pos, nor)
}

/** An extrusion of flat rings standing on a face, in the part's local frame. */
function extrudeGeometry(part) {
  const ax = faceAxes(part.face)
  const shapes = Array.isArray(part.shape[0][0]) ? part.shape : [part.shape]
  const pos = []
  const nor = []
  const to = (u, v, k) => [ax.u[0] * u + ax.v[0] * v - ax.n[0] * k, ax.u[1] * u + ax.v[1] * v - ax.n[1] * k, ax.u[2] * u + ax.v[2] * v - ax.n[2] * k]
  const push = (p, n) => {
    pos.push(...V3(p).toArray())
    nor.push(...V3(n).toArray())
  }
  for (const shape of shapes) {
    const ring2 = area(shape) >= 0 ? shape : shape.slice().reverse()
    const tris = THREE.ShapeUtils.triangulateShape(ring2.map(([u, v]) => new THREE.Vector2(u, v)), [])
    // Caps: wind each triangle so it faces out (front +n, back -n) in world space.
    const cap = (tri, k, nrm) => {
      let [p0, p1, p2] = tri.map((q) => to(q[0], q[1], k))
      const e1 = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]]
      const e2 = [p2[0] - p0[0], p2[1] - p0[1], p2[2] - p0[2]]
      const cr = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
      if (cr[0] * nrm[0] + cr[1] * nrm[1] + cr[2] * nrm[2] < 0) [p1, p2] = [p2, p1]
      push(p0, nrm)
      push(p1, nrm)
      push(p2, nrm)
    }
    for (const [i, j, k] of tris) {
      const tri = [ring2[i], ring2[j], ring2[k]]
      cap(tri, 0, ax.n)
      cap(tri, part.depth, [-ax.n[0], -ax.n[1], -ax.n[2]])
    }
    const n = ring2.length
    for (let i = 0; i < n; i++) {
      const a = ring2[i]
      const b = ring2[(i + 1) % n]
      const du = b[0] - a[0]
      const dv = b[1] - a[1]
      const l = Math.hypot(du, dv) || 1
      const nn = [ax.u[0] * (dv / l) - ax.v[0] * (du / l), ax.u[1] * (dv / l) - ax.v[1] * (du / l), ax.u[2] * (dv / l) - ax.v[2] * (du / l)]
      const A0 = to(a[0], a[1], 0)
      const B0 = to(b[0], b[1], 0)
      const A1 = to(a[0], a[1], part.depth)
      const B1 = to(b[0], b[1], part.depth)
      for (const p of [A0, B0, B1, A0, B1, A1]) push(p, nn)
    }
  }
  return finish(pos, nor)
}

/**
 * The silhouette shell of an extrusion: the same triangles with one normal per
 * rim vertex, half way between the side wall and the cap, so the shell is a
 * clean offset of the solid (merging vertices would let the triangulated caps
 * bend the rim normals into a comb).
 */
function extrudeHullGeometry(part) {
  const ax = faceAxes(part.face)
  const shapes = Array.isArray(part.shape[0][0]) ? part.shape : [part.shape]
  const pos = []
  const nor = []
  const to = (u, v, k) => [ax.u[0] * u + ax.v[0] * v - ax.n[0] * k, ax.u[1] * u + ax.v[1] * v - ax.n[1] * k, ax.u[2] * u + ax.v[2] * v - ax.n[2] * k]
  const norm = (a) => {
    const l = Math.hypot(a[0], a[1], a[2]) || 1
    return [a[0] / l, a[1] / l, a[2] / l]
  }
  for (const shape of shapes) {
    const ring2 = area(shape) >= 0 ? shape : shape.slice().reverse()
    const n = ring2.length
    const side = ring2.map((q, i) => {
      const a = ring2[(i - 1 + n) % n]
      const b = ring2[(i + 1) % n]
      const e1 = [q[0] - a[0], q[1] - a[1]]
      const e2 = [b[0] - q[0], b[1] - q[1]]
      const l1 = Math.hypot(...e1) || 1
      const l2 = Math.hypot(...e2) || 1
      const nu = e1[1] / l1 + e2[1] / l2
      const nv = -e1[0] / l1 - e2[0] / l2
      return norm([ax.u[0] * nu + ax.v[0] * nv, ax.u[1] * nu + ax.v[1] * nv, ax.u[2] * nu + ax.v[2] * nv])
    })
    const front = side.map((sn) => norm([sn[0] + ax.n[0], sn[1] + ax.n[1], sn[2] + ax.n[2]]))
    const back = side.map((sn) => norm([sn[0] - ax.n[0], sn[1] - ax.n[1], sn[2] - ax.n[2]]))
    const P = (i, k) => to(ring2[i][0], ring2[i][1], k)
    const push = (p3, n3) => {
      pos.push(...V3(p3).toArray())
      nor.push(...V3(n3).toArray())
    }
    const tris = THREE.ShapeUtils.triangulateShape(ring2.map(([u, v]) => new THREE.Vector2(u, v)), [])
    for (const t of tris) {
      // the same winding rule as the fill: front faces +n, back faces -n
      const cap = (k, normals, out) => {
        let [i, j, l] = t
        const p0 = P(i, k)
        const p1 = P(j, k)
        const p2 = P(l, k)
        const e1 = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]]
        const e2 = [p2[0] - p0[0], p2[1] - p0[1], p2[2] - p0[2]]
        const cr = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
        if (cr[0] * out[0] + cr[1] * out[1] + cr[2] * out[2] < 0) [j, l] = [l, j]
        for (const v of [i, j, l]) push(P(v, k), normals[v])
      }
      cap(0, front, ax.n)
      cap(part.depth, back, [-ax.n[0], -ax.n[1], -ax.n[2]])
    }
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      for (const [v, k] of [
        [i, 0],
        [j, 0],
        [j, part.depth],
        [i, 0],
        [j, part.depth],
        [i, part.depth],
      ])
        push(P(v, k), k === 0 ? front[v] : back[v])
    }
  }
  return finish(pos, nor)
}

/** Pairs of points for a polyline (or a closed ring). */
function segs(pts, closed = false) {
  const out = []
  const n = pts.length
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const a = V3(pts[i])
    const b = V3(pts[(i + 1) % n])
    out.push(a.x, a.y, a.z, b.x, b.y, b.z)
  }
  return out
}

function lineObject(positions, mat) {
  const g = new LineSegmentsGeometry().setPositions(positions)
  const l = new LineSegments2(g, mat)
  l.computeLineDistances()
  return l
}

// ---------------------------------------------------------------- mount

/**
 * Mounts a figure as a three.js scene in `host` (an element with class "iso",
 * sized by CSS). Returns { destroy, isoView, setRevolve, state }.
 */
export function mount3D(host, fig, opts = {}) {
  const runtime = opts.runtime
  const state = instantiate(fig)
  const W = fig.width
  const H = fig.height
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace
  const canvas = renderer.domElement
  canvas.className = "iso-canvas"
  canvas.setAttribute("aria-label", `${fig.title}, in 3D: drag to turn it`)
  canvas.setAttribute("role", "img")
  host.appendChild(canvas)

  const scene = new THREE.Scene()
  const svgCam = figureCamera(fig)
  // The SVG draws each world axis at full length; a true orthographic view
  // along (1, 1, 1) shortens every axis by sqrt(2/3). Shrink the frustum to match.
  const S = svgCam.scale / Math.sqrt(2 / 3)
  const camera = new THREE.OrthographicCamera(-W / 2 / S, W / 2 / S, H / 2 / S, -H / 2 / S, 0.1, 400)
  // Orbit about the figure's mid-height on the ray through the frame's centre:
  // the iso view is unchanged, and a tall figure no longer swings out of frame.
  let zmin = Infinity
  let zmax = -Infinity
  resetProps(state)
  for (const p of state.parts) {
    if (p.kind === "halo" || p.kind === "label" || p.kind === "grid") continue
    const g = geometry(p, state.groups)
    const pts = g.bottom ? g.bottom.concat(g.top) : g.solids ? g.solids.flatMap((sd) => sd.front.concat(sd.back)) : g.pts || []
    for (const q of pts) {
      if (q[2] < zmin) zmin = q[2]
      if (q[2] > zmax) zmax = q[2]
    }
  }
  const zc = Number.isFinite(zmin) ? (zmin + zmax) / 2 : 0
  const target = V3(svgCam.unproject(W / 2, H / 2, zc))
  const isoDir = new THREE.Vector3(1, 1, 1).normalize()
  camera.position.copy(target).addScaledVector(isoDir, 60)
  camera.up.set(0, 1, 0)
  camera.lookAt(target)
  // A fixed turn away from the iso view (for checks and stills): degrees.
  if (opts.azimuth || opts.elevation) {
    const sph = new THREE.Spherical().setFromVector3(camera.position.clone().sub(target))
    sph.theta += ((opts.azimuth || 0) * Math.PI) / 180
    sph.phi = Math.min(Math.PI * 0.47, Math.max(0.12, sph.phi - ((opts.elevation || 0) * Math.PI) / 180))
    camera.position.copy(target).add(new THREE.Vector3().setFromSpherical(sph))
    camera.lookAt(target)
  }

  const controls = new OrbitControls(camera, canvas)
  controls.target.copy(target)
  controls.enableZoom = false
  controls.enablePan = false
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.rotateSpeed = 0.7
  controls.minPolarAngle = 0.12
  controls.maxPolarAngle = Math.PI * 0.47
  controls.autoRotateSpeed = 1.6
  controls.update()
  // Let a vertical swipe scroll the page; a sideways drag turns the figure.
  canvas.style.touchAction = "pan-y"

  const res = new THREE.Vector2(1, 1)
  const lineMats = []
  const mkLine = (o = {}) => {
    const m = new LineMaterial({ linewidth: 1, resolution: res, transparent: true, depthTest: true, ...o })
    m.polygonOffset = true
    m.polygonOffsetFactor = -2
    m.polygonOffsetUnits = -6
    lineMats.push(m)
    return m
  }

  // Build every part once, in its local frame.
  const nodes = []
  for (const part of state.parts) {
    const group = new THREE.Group()
    group.matrixAutoUpdate = false
    const node = { part, group, fill: null, outline: null, lines: [], glow: null, extra: {} }
    const ghost = part.role === "ghost" || part.dash
    if (part.kind === "block" || part.kind === "cyl") {
      const plan = part.kind === "block" ? rrect(0, 0, part.size[0], part.size[1], part.r, part.steps) : ring(0, 0, part.radius, part.n)
      const h = part.kind === "block" ? part.size[2] : part.h
      if (!ghost) {
        const geo = prismGeometry(plan, h)
        node.fill = new THREE.Mesh(geo, toneMaterial())
        node.fill.userData.id = part.id
        group.add(node.fill)
        const hullGeo = mergeVertices(prismGeometry(plan, h).deleteAttribute("normal"), 1e-4)
        hullGeo.computeVertexNormals()
        node.outline = new THREE.Mesh(hullGeo, outlineMaterial(res))
        group.add(node.outline)
      }
      const rings = [plan.map(([x, y]) => [x, y, h]), plan.map(([x, y]) => [x, y, 0])]
      const crease = mkLine({ dashed: ghost, dashSize: 0.12, gapSize: 0.12 })
      node.lines.push({ obj: lineObject(segs(rings[0], true).concat(ghost ? segs(rings[1], true) : []), crease), kind: ghost ? "line" : "crease" })
      if (ghost && part.kind === "block") {
        // vertical edges at the four corners, so the outline reads from any side
        const n = plan.length
        const v = []
        for (let k = 0; k < 4; k++) {
          const q = plan[Math.floor(((k + 0.5) * n) / 4) % n]
          v.push(...segs([[q[0], q[1], 0], [q[0], q[1], h]]))
        }
        node.lines.push({ obj: lineObject(v, crease), kind: "line" })
      }
    } else if (part.kind === "extrude") {
      const geo = extrudeGeometry(part)
      if (!ghost) {
        node.fill = new THREE.Mesh(geo, toneMaterial())
        node.fill.userData.id = part.id
        group.add(node.fill)
        node.outline = new THREE.Mesh(extrudeHullGeometry(part), outlineMaterial(res))
        group.add(node.outline)
      }
      const ax = faceAxes(part.face)
      const shapes = Array.isArray(part.shape[0][0]) ? part.shape : [part.shape]
      const to = (u, v, k) => [ax.u[0] * u + ax.v[0] * v - ax.n[0] * k, ax.u[1] * u + ax.v[1] * v - ax.n[1] * k, ax.u[2] * u + ax.v[2] * v - ax.n[2] * k]
      const pos = []
      for (const s of shapes) {
        pos.push(...segs(s.map(([u, v]) => to(u, v, 0)), true))
        pos.push(...segs(s.map(([u, v]) => to(u, v, part.depth)), true))
        // sharp corners get their connecting edge
        const n = s.length
        for (let i = 0; i < n; i++) {
          const a = s[(i - 1 + n) % n]
          const b = s[i]
          const c = s[(i + 1) % n]
          const e1 = [b[0] - a[0], b[1] - a[1]]
          const e2 = [c[0] - b[0], c[1] - b[1]]
          const cos = (e1[0] * e2[0] + e1[1] * e2[1]) / ((Math.hypot(...e1) * Math.hypot(...e2)) || 1)
          if (Math.acos(Math.max(-1, Math.min(1, cos))) > (part.sharp * Math.PI) / 180) pos.push(...segs([to(b[0], b[1], 0), to(b[0], b[1], part.depth)]))
        }
      }
      node.lines.push({ obj: lineObject(pos, mkLine({ dashed: ghost, dashSize: 0.14, gapSize: 0.12 })), kind: ghost ? "line" : "crease" })
    } else if (part.kind === "wire") {
      const mat = mkLine({ dashed: part.role === "guide" || part.dash, dashSize: 0.12, gapSize: 0.16 })
      node.lines.push({ obj: lineObject(segs(part.pts), mat), kind: part.role === "detail" ? "crease" : part.role === "guide" ? "guide" : "wire" })
      if (part.role === "wire") {
        node.extra.pulse = lineObject([0, 0, 0, 0, 0.001, 0], mkLine({ linewidth: 2.2 }))
        node.extra.pulse.visible = false
        group.add(node.extra.pulse)
        let len = 0
        const lens = [0]
        for (let i = 1; i < part.pts.length; i++) {
          len += Math.hypot(part.pts[i][0] - part.pts[i - 1][0], part.pts[i][1] - part.pts[i - 1][1], part.pts[i][2] - part.pts[i - 1][2])
          lens.push(len)
        }
        node.extra.len = len
        node.extra.lens = lens
      }
    } else if (part.kind === "led") {
      const ax = faceAxes(part.face)
      const geo = new THREE.CircleGeometry(part.r, 24)
      // orient the disc in the face plane, a hair proud of the surface
      const m = new THREE.Matrix4().makeBasis(V3(ax.u), V3(ax.v), V3(ax.n))
      geo.applyMatrix4(m)
      geo.translate(...V3([ax.n[0] * 0.01, ax.n[1] * 0.01, ax.n[2] * 0.01]).toArray())
      node.fill = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide }))
      node.fill.userData.id = part.id
      group.add(node.fill)
    } else if (part.kind === "halo") {
      const geo = new THREE.CircleGeometry(part.r, 40)
      geo.rotateX(-Math.PI / 2)
      geo.translate(0, 0.005, 0)
      node.fill = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: radialTexture(), transparent: true, depthWrite: false, opacity: 0 }))
      node.fill.renderOrder = 2
      group.add(node.fill)
    } else if (part.kind === "face") {
      const pts = part.pts
      if (pts.length >= 3) {
        const a = V3(pts[0])
        const b = V3(pts[1])
        const c = V3(pts[2])
        const nrm = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a)).normalize()
        const u = new THREE.Vector3().subVectors(b, a).normalize()
        const v = new THREE.Vector3().crossVectors(nrm, u)
        const flat = pts.map((p) => {
          const q = V3(p).sub(a)
          return new THREE.Vector2(q.dot(u), q.dot(v))
        })
        const tris = THREE.ShapeUtils.triangulateShape(flat, [])
        const pos = []
        for (const t of tris) for (const i of t) pos.push(...V3(pts[i]).addScaledVector(nrm, 0.004).toArray())
        const geo = new THREE.BufferGeometry()
        geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3))
        node.fill = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide }))
        node.fill.userData.id = part.id
        group.add(node.fill)
        node.lines.push({ obj: lineObject(segs(pts, true), mkLine()), kind: part.role === "glass" ? "line" : "crease" })
      }
    } else if (part.kind === "grid") {
      const [w, d] = part.size
      const pos = []
      for (let x = 0; x <= w + 1e-9; x += part.step)
        for (let y = 0; y <= d + 1e-9; y += part.step) {
          const r = Math.hypot((x - w / 2) / (w / 2), (y - d / 2) / (d / 2))
          if (r <= 1) pos.push(...V3([x, y, 0]).toArray())
        }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3))
      node.fill = new THREE.Points(geo, new THREE.PointsMaterial({ size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.5 }))
      group.add(node.fill)
    } else if (part.kind === "label") {
      // A mono label lying on its face, drawn into a canvas (redrawn when the theme changes).
      const ax = faceAxes(part.face)
      const canvas = document.createElement("canvas")
      const tex = new THREE.CanvasTexture(canvas)
      tex.anisotropy = 4
      const text = (part.cls || "").includes("keep-case") ? part.text : String(part.text).toUpperCase()
      const draw = (color) => {
        const px = 96
        const g = canvas.getContext("2d")
        const font = `500 ${px}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
        g.font = font
        const spacing = px * 0.08
        const width = Math.ceil(g.measureText(text).width + spacing * text.length + px * 0.4)
        canvas.width = width
        canvas.height = Math.ceil(px * 1.3)
        g.font = font
        g.fillStyle = color
        g.textBaseline = "middle"
        let x = px * 0.2
        for (const ch of text) {
          g.fillText(ch, x, canvas.height / 2)
          x += g.measureText(ch).width + spacing
        }
        tex.needsUpdate = true
        return canvas.width / canvas.height
      }
      const aspect = draw("#888888")
      const hgt = part.size * 1.3
      const geo = new THREE.PlaneGeometry(hgt * aspect, hgt)
      geo.applyMatrix4(new THREE.Matrix4().makeBasis(V3(ax.u), V3(ax.v), V3(ax.n)))
      geo.translate(...V3([ax.n[0] * 0.012, ax.n[1] * 0.012, ax.n[2] * 0.012]).toArray())
      node.fill = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide }))
      node.fill.renderOrder = 2
      node.extra.drawLabel = draw
      node.extra.labelAspect = aspect
      group.add(node.fill)
    }
    for (const l of node.lines) group.add(l.obj)
    // glow: a soft sprite at the centre of the part's own bounds, sized to them.
    // It is not depth-tested, so its own solid never cuts it in half.
    if (["block", "cyl", "extrude", "led", "face"].includes(part.kind)) {
      group.updateMatrixWorld(true)
      const box = new THREE.Box3().setFromObject(group)
      const centre = box.isEmpty() ? new THREE.Vector3() : box.getCenter(new THREE.Vector3())
      const dims = box.isEmpty() ? new THREE.Vector3(1, 1, 1) : box.getSize(new THREE.Vector3())
      const [d1, d2] = [dims.x, dims.y, dims.z].sort((a, b) => b - a)
      const size = Math.max(0.6, Math.sqrt(d1 * Math.max(d2, d1 * 0.15)) * (part.kind === "led" ? 3.4 : 1.9))
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: radialTexture(), transparent: true, depthWrite: false, depthTest: false, opacity: 0 }))
      sp.scale.set(size, size, 1)
      sp.position.copy(centre)
      sp.renderOrder = 4
      node.glow = sp
      group.add(sp)
    }
    scene.add(group)
    nodes.push(node)
  }

  // ---------------------------------------------------------------- per frame
  let tk = readTokens(host)
  const m4 = new THREE.Matrix4()
  const applyColors = (node) => {
    const { part } = node
    const pal = paletteFor(part, tk)
    const dark = tk.dark
    if (node.fill && node.fill.material.uniforms) {
      const u = node.fill.material.uniforms
      u.cUp.value.copy(pal.up)
      u.cRight.value.copy(pal.right)
      u.cLeft.value.copy(pal.left)
      u.cDown.value.copy(pal.left).multiplyScalar(dark ? 0.8 : 0.94)
      // An extrusion standing on a face shows its main color on that face.
      if (part.kind === "extrude" && ["accent", "accent2", "brand", "brand2"].includes(part.on ? (part.on === 1 ? "accent" : "accent2") : part.role)) {
        const main = pal.right
        if (part.face === "+x") {
          u.cRight.value.copy(main)
          u.cLeft.value.copy(pal.left)
        } else if (part.face === "+y") {
          u.cLeft.value.copy(main)
          u.cRight.value.copy(pal.left)
        }
      }
    } else if (node.fill && part.kind === "led") {
      node.fill.material.color.copy(part.on ? pal.glow : tk.detail)
    } else if (node.fill && part.kind === "halo") {
      node.fill.material.color.copy(part.on === 2 ? tk.accent2 : tk.accent)
      node.fill.material.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending
    } else if (node.fill && part.kind === "face") {
      node.fill.material.color.copy(part.on ? pal.right : part.role === "glass" ? tk.glass : part.role === "recess" ? tk.recess : tk.deck)
    } else if (node.fill && part.kind === "grid") {
      node.fill.material.color.copy(tk.line)
    } else if (node.fill && part.kind === "label" && node.extra.drawLabel) {
      node.extra.drawLabel(`#${(part.on === 1 ? tk["accent-hi"] : part.on === 2 ? tk["accent2-hi"] : tk.ink).getHexString()}`)
    }
    if (node.outline) node.outline.material.uniforms.color.value.copy(pal.line)
    for (const l of node.lines) {
      const m = l.obj.material
      if (l.kind === "crease") m.color.copy(part.on || ["brand", "brand2", "accent", "accent2"].includes(part.role) ? pal.line : tk.detail)
      else if (l.kind === "guide") m.color.copy(part.on === 1 ? tk.accent : part.on === 2 ? tk.accent2 : tk.line)
      else if (l.kind === "wire") m.color.copy(part.on === 1 ? tk.accent : part.on === 2 ? tk.accent2 : tk.line)
      else m.color.copy(part.on === 1 ? tk.accent : part.on === 2 ? tk.accent2 : tk.line)
    }
    if (node.extra.pulse) node.extra.pulse.material.color.copy(part.on === 2 ? tk["accent2-hi"] : tk["accent-hi"])
    if (node.glow) {
      node.glow.material.color.copy(part.on === 2 || part.role === "accent2" || part.role === "brand2" ? tk.accent2 : tk.accent)
      node.glow.material.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending
    }
    node.colorKey = `${part.on}|${part.role}|${tk.dark}`
  }
  nodes.forEach(applyColors)

  const pointer = { ndc: null }
  const raycaster = new THREE.Raycaster()
  const input = runtime
    ? runtime.input(pointer, () => null)
    : { spring: (_k, v) => v, tween: (_k, v) => v, pick: () => null, near: () => Infinity, still: true, dt: 0 }
  input.onPlane = (z) => {
    if (!pointer.ndc) return null
    raycaster.setFromCamera(pointer.ndc, camera)
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -z)
    const hit = new THREE.Vector3()
    if (!raycaster.ray.intersectPlane(plane, hit)) return null
    return [hit.x, hit.z, hit.y]
  }
  input.pick = (ids) => {
    if (!pointer.ndc) return null
    raycaster.setFromCamera(pointer.ndc, camera)
    const meshes = nodes.filter((n) => n.fill && n.fill.isMesh && (!ids || ids.includes(n.part.id))).map((n) => n.fill)
    const hit = raycaster.intersectObjects(meshes, false)[0]
    return hit ? hit.object.userData.id || null : null
  }

  const resize = () => {
    const r = host.getBoundingClientRect()
    const w = Math.max(1, r.width)
    const h = Math.max(1, r.height)
    renderer.setSize(w, h, false)
    renderer.getDrawingBufferSize(res)
    const aspect = w / h
    const halfH = H / 2 / S
    const halfW = Math.max(halfH * aspect, W / 2 / S)
    const hh = halfW / aspect
    camera.left = -halfW
    camera.right = halfW
    camera.top = hh
    camera.bottom = -hh
    camera.updateProjectionMatrix()
    for (const m of lineMats) m.resolution.copy(res)
  }
  const ro = new ResizeObserver(resize)
  ro.observe(host)
  resize()

  const theme = new MutationObserver(() => {
    tk = readTokens(host)
    nodes.forEach(applyColors)
    if (handle) handle.wake()
  })
  theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

  let snap = null
  const render = (t) => {
    resetProps(state)
    input.pointer = null
    fig.tick(t, state, input)
    for (const node of nodes) {
      const { part, group } = node
      group.visible = !part.hide
      if (part.hide) continue
      const place = placer(part, state.groups)
      const o = place([0, 0, 0])
      const ex = place([1, 0, 0])
      const ey = place([0, 1, 0])
      const ez = place([0, 0, 1])
      // local frame columns, in three's axis order
      const X = V3([ex[0] - o[0], ex[1] - o[1], ex[2] - o[2]])
      const Y = V3([ey[0] - o[0], ey[1] - o[1], ey[2] - o[2]])
      const Z = V3([ez[0] - o[0], ez[1] - o[1], ez[2] - o[2]])
      const O = V3(o)
      // local three axes: (x, z, y) of the part frame
      m4.set(X.x, Z.x, Y.x, O.x, X.y, Z.y, Y.y, O.y, X.z, Z.z, Y.z, O.z, 0, 0, 0, 1)
      group.matrix.copy(m4)
      group.matrixWorldNeedsUpdate = true
      if (node.colorKey !== `${part.on}|${part.role}|${tk.dark}`) applyColors(node)
      const fade = part.fade ?? 1
      if (node.fill && node.fill.material.uniforms) {
        node.fill.material.uniforms.opacity.value = fade
        node.fill.material.transparent = fade < 1
      }
      else if (node.fill && part.kind === "halo") node.fill.material.opacity = Math.min(1, part.glow) * (tk.dark ? 0.55 : 0.32)
      else if (node.fill && node.fill.material) node.fill.material.opacity = fade * (part.kind === "grid" ? 0.5 : 1)
      if (node.outline) node.outline.material.uniforms.opacity.value = fade
      for (const l of node.lines) l.obj.material.opacity = fade * (l.kind === "guide" ? 0.75 : 1)
      if (node.glow) node.glow.material.opacity = Math.min(1, part.glow) * (tk.dark ? 0.75 : 0.35)
      if (node.extra.pulse) {
        const f = part.flow
        node.extra.pulse.visible = !!f && !input.still
        if (f) {
          const u = (((t + (f.delay || 0)) / (f.period || 2.4)) % 1) * node.extra.len
          const at = (s) => {
            const L = node.extra.lens
            let i = 1
            while (i < L.length - 1 && L[i] < s) i++
            const k = (s - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1])
            const a = part.pts[i - 1]
            const b = part.pts[i]
            return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]
          }
          const a = at(Math.max(0, u - 0.35))
          const b = at(Math.min(node.extra.len, u + 0.35))
          node.extra.pulse.geometry.setPositions(segs([a, b]))
        }
      }
    }
    if (snap) {
      const k = Math.min(1, (performance.now() - snap.t0) / 650)
      const e = 1 - Math.pow(1 - k, 3)
      camera.position.copy(snap.from).lerp(snap.to, e)
      camera.position.sub(target).setLength(60).add(target)
      if (k >= 1) snap = null
    }
    controls.update()
    renderer.render(scene, camera)
    if (opts.onReadout) opts.onReadout(fig.readout(state, input) || "rest")
  }

  const toNdc = (e) => {
    const r = canvas.getBoundingClientRect()
    return new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
  }
  const onMove = (e) => {
    pointer.ndc = toNdc(e)
    if (handle) handle.wake()
  }
  const onLeave = () => {
    pointer.ndc = null
    if (handle) handle.wake()
  }
  canvas.addEventListener("pointermove", onMove)
  canvas.addEventListener("pointerleave", onLeave)
  controls.addEventListener("change", () => handle && handle.wake())

  const handle = runtime ? runtime.add(host, fig, render, input) : null
  if (!handle) render(fig.still)

  return {
    state,
    isoView() {
      controls.autoRotate = false
      snap = { from: camera.position.clone(), to: target.clone().addScaledVector(isoDir, 60), t0: performance.now() }
      if (handle) handle.wake()
    },
    setRevolve(on) {
      controls.autoRotate = !!on
      if (handle) handle.wake()
    },
    destroy() {
      if (handle) handle.remove()
      ro.disconnect()
      theme.disconnect()
      controls.dispose()
      canvas.removeEventListener("pointermove", onMove)
      canvas.removeEventListener("pointerleave", onLeave)
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose()
        if (o.material) o.material.dispose()
      })
      renderer.dispose()
      canvas.remove()
    },
  }
}

/** True when this browser can draw WebGL. */
export function canWebGL() {
  try {
    const c = document.createElement("canvas")
    return !!(c.getContext("webgl2") || c.getContext("webgl"))
  } catch {
    return false
  }
}
