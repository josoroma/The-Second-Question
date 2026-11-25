// Brings the server-rendered figures to life: each .iso-figure gets its live
// SVG (motion, pointer), and, on request or when it asks for it, the 3D view.
// three.js loads only when a figure goes 3D.

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
  let live = mountSVG(svg, fig, { runtime: rt, prefix, onReadout })
  let three = null
  let pending = null
  const btn3d = el.querySelector('[data-act="3d"]')
  const btnRev = el.querySelector('[data-act="revolve"]')
  const btnIso = el.querySelector('[data-act="iso"]')

  const set3D = async (on) => {
    if (pending) await pending
    if (on && !three) {
      pending = import("./webgl.js")
      const { mount3D, canWebGL } = await pending
      pending = null
      if (!canWebGL()) {
        btn3d?.setAttribute("disabled", "")
        btnRev?.setAttribute("disabled", "")
        return
      }
      live?.destroy()
      live = null
      svg.style.visibility = "hidden"
      three = mount3D(stage, fig, { runtime: rt, onReadout })
      el.dataset.view = "3d"
    } else if (!on && three) {
      three.destroy()
      three = null
      svg.style.visibility = ""
      live = mountSVG(svg, fig, { runtime: rt, prefix, onReadout })
      el.dataset.view = "2d"
      btnRev?.setAttribute("aria-pressed", "false")
    }
    btn3d?.setAttribute("aria-pressed", String(!!three))
  }

  btn3d?.addEventListener("click", () => set3D(!three))
  btnRev?.addEventListener("click", async () => {
    if (!three) await set3D(true)
    const on = btnRev.getAttribute("aria-pressed") !== "true"
    three?.setRevolve(on)
    btnRev.setAttribute("aria-pressed", String(on))
  })
  btnIso?.addEventListener("click", async () => {
    if (!three) await set3D(true)
    three?.isoView()
    btnRev?.setAttribute("aria-pressed", "false")
  })
  if (el.dataset.mode === "3d" && !rt.reduced) set3D(true)
}
