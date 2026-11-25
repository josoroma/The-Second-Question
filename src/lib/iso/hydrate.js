// Brings the server-rendered figures to life: each .iso-figure gets its live
// SVG (motion, pointer), or the 3D view when its mode is "3d". three.js loads
// only then.

import { runtime } from "./runtime.js"
import { mountSVG } from "./svg.js"

const modules = import.meta.glob("/src/figures/*.js")

export function hydrateFigures(root = document) {
  for (const el of root.querySelectorAll(".iso-figure:not([data-live])")) {
    el.setAttribute("data-live", "")
    setup(el).catch((e) => console.error(`figure ${el.dataset.slug}:`, e))
  }
}

async function setup(el) {
  const load = modules[`/src/figures/${el.dataset.slug}.js`]
  if (!load) return
  const fig = (await load()).default
  const stage = el.querySelector(".iso-stage")
  const svg = stage.querySelector("svg")
  const readout = el.querySelector(".iso-readout")
  const onReadout = (r) => {
    if (readout && readout.textContent !== r) readout.textContent = r
  }
  const rt = runtime()
  const prefix = el.dataset.prefix
  const live = mountSVG(svg, fig, { runtime: rt, prefix, onReadout })

  // The cover asks for 3D; every other figure stays in its line view.
  if (el.dataset.mode !== "3d" || rt.reduced) return
  const { mount3D, canWebGL } = await import("./webgl.js")
  if (!canWebGL()) return
  live.destroy()
  svg.style.visibility = "hidden"
  mount3D(stage, fig, { runtime: rt, onReadout })
  el.dataset.view = "3d"
}
