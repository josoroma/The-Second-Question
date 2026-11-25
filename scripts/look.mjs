// Checks a figure and draws its contact sheet.
//   node scripts/look.mjs src/figures/<slug>.js [--times 0,2,4] [--out dir] [--zoom]
// Validates the figure (fields, frame, numbers, words), then renders the
// designed still and a few moments of its loop in light and dark, plus the
// still at 240px, on one sheet: <out>/<slug>-look.png. Exit 1 on a failed check.

import { mkdirSync, writeFileSync } from "node:fs"
import { basename, join, resolve } from "node:path"
import { pathToFileURL } from "node:url"
import { frameAt, renderToString } from "../src/lib/iso/svg.js"
import { fileStyle } from "../src/lib/iso/style.js"
import { shot } from "./shot.mjs"

const args = process.argv.slice(2)
const file = args.find((a) => !a.startsWith("--") && /\.m?js$/.test(a))
if (!file) {
  console.error("usage: node scripts/look.mjs src/figures/<slug>.js [--times 0,2,4] [--out dir] [--zoom]")
  process.exit(2)
}
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : dflt
}
const fig = (await import(pathToFileURL(resolve(file)).href)).default
const out = resolve(opt("out", "art/looks"))
mkdirSync(out, { recursive: true })

// ---------------------------------------------------------------- checks
const fails = []
const warns = []
for (const k of ["slug", "title", "desc", "sentence", "plate"]) if (!fig[k]) fails.push(`missing field: ${k}`)
if (fig.slug && fig.slug !== basename(file).replace(/\.m?js$/, "")) fails.push(`slug "${fig.slug}" does not match the file name`)
if (fig.sentence && !/^The viewer sees .+, which explains .+\.$/.test(fig.sentence))
  warns.push('sentence should read "The viewer sees [change], which explains [relationship]."')
if (fig.desc && fig.desc.length > 420) warns.push(`desc is ${fig.desc.length} characters; keep it under 420`)

const period = Number(opt("period", 0)) || 8
const times = (opt("times", null) || [0, 0.25, 0.5, 0.75].map((f) => +(f * period).toFixed(2)).join(","))
  .split(",")
  .map(Number)
const W = fig.width
const H = fig.height
let frameHits = 0
let labels = 0
let partsCount = 0
for (const t of [fig.still, ...times]) {
  const { items, state } = frameAt(fig, t)
  partsCount = state.parts.length
  for (const it of items)
    for (const p of it.pieces) {
      if (p.tag === "text") {
        labels++
        if (p.text.length > 12) fails.push(`label "${p.text}" is longer than 12 characters (names go on the plate)`)
        continue
      }
      if (/NaN|Infinity/.test(p.d)) fails.push(`t=${t}: part ${it.part.id} has NaN in its path`)
      for (const m of (p.d || "").matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/g)) {
        const x = +m[1]
        const y = +m[2]
        if (p.c === "halo" || p.c === "bloom") continue
        if (x < 8 || y < 8 || x > W - 8 || y > H - 8) frameHits++
      }
    }
}
if (frameHits) fails.push(`${frameHits} points leave the frame (8-unit margin inside ${W} x ${H}) at some sampled time`)
if (partsCount > 140) warns.push(`${partsCount} parts: the silhouette may not read at 240px`)
const perFrame = labels / (times.length + 1)
if (perFrame > 2) warns.push(`${perFrame} labels per frame: keep words off the drawing (two at most)`)

// coverage of the still
{
  const { items } = frameAt(fig, fig.still)
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  for (const it of items)
    for (const p of it.pieces)
      for (const m of (p.d || "").matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/g)) {
        if (p.c === "halo" || p.c === "bloom") continue
        x0 = Math.min(x0, +m[1])
        y0 = Math.min(y0, +m[2])
        x1 = Math.max(x1, +m[1])
        y1 = Math.max(y1, +m[2])
      }
  const cover = ((x1 - x0) * (y1 - y0)) / (W * H)
  const cx = (x0 + x1) / 2
  const cy = (y0 + y1) / 2
  console.log(`still covers ${(cover * 100).toFixed(0)}% of the frame; centre (${cx.toFixed(0)}, ${cy.toFixed(0)})`)
  if (cover < 0.3) warns.push(`the still covers only ${(cover * 100).toFixed(0)}% of the frame; scale up (aim for 40-65%)`)
  if (cover > 0.8) warns.push(`the still covers ${(cover * 100).toFixed(0)}% of the frame; leave air`)
  if (Math.abs(cx - W / 2) > 50 || Math.abs(cy - H / 2) > 45) warns.push(`the still is off centre (${cx.toFixed(0)}, ${cy.toFixed(0)}); aim for (${W / 2}, ${H / 2})`)
}

// ---------------------------------------------------------------- sheet
const svgFile = (theme, t, tag) => {
  const name = `${fig.slug}-${theme}-${tag}.svg`
  const svg = renderToString(fig, {
    t,
    style: fileStyle(theme) + ".iso .panel{fill:var(--iso-panel)}",
    prefix: `look-${theme}-${tag}`,
    className: "static",
  }).replace('<g class="scene">', `<rect class="panel" width="${W}" height="${H}" rx="18"/><g class="scene">`)
  writeFileSync(join(out, name), svg)
  return name
}
const rows = ["light", "dark"].map((theme) => {
  const still = svgFile(theme, fig.still, "still")
  const moments = times.map((t, i) => ({ t, src: svgFile(theme, t, `t${i}`) }))
  return `<section class="${theme}">
    <figure class="big"><img src="${still}"><figcaption>${theme} · still t=${fig.still}</figcaption></figure>
    <figure class="small"><img src="${still}" style="width:240px"><figcaption>240px</figcaption></figure>
    <div class="moments">${moments.map((m) => `<figure><img src="${m.src}"><figcaption>t=${m.t}</figcaption></figure>`).join("")}</div>
  </section>`
})
const html = `<!doctype html><meta charset="utf-8"><style>
  body{margin:0;font:12px ui-monospace,monospace;color:#555;background:#e5e5e5}
  h1{font:600 14px system-ui;margin:12px 16px 0}
  section{display:grid;grid-template-columns:560px 240px 1fr;gap:12px;padding:12px 16px;align-items:start}
  section.dark{background:#0a0a0a;color:#999}section.light{background:#fff}
  figure{margin:0}img{display:block;width:100%}.big img{width:560px}
  .moments{display:grid;grid-template-columns:1fr 1fr;gap:8px}
</style><h1>${fig.slug} — ${fig.title}</h1>${rows.join("")}`
const page = join(out, `${fig.slug}-look.html`)
writeFileSync(page, html)
const png = join(out, `${fig.slug}-look.png`)
shot(page, png, { width: 1500, height: 1000, scale: 1, wait: 300 })
if (args.includes("--zoom")) {
  const z = join(out, `${fig.slug}-zoom.html`)
  writeFileSync(z, `<!doctype html><style>body{margin:0;background:#fff}img{width:1120px;display:block}</style><img src="${fig.slug}-light-still.svg"><img src="${fig.slug}-dark-still.svg">`)
  shot(z, join(out, `${fig.slug}-zoom.png`), { width: 1120, height: 1760, scale: 1 })
}

for (const w of warns) console.log(`warn  ${w}`)
for (const f of fails) console.log(`FAIL  ${f}`)
console.log(png)
process.exit(fails.length ? 1 : 0)
