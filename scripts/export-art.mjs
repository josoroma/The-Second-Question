// Exports every figure in src/figures as static SVG files for places that
// cannot run the site's script: the README, GitHub's file view, social cards.
//   node scripts/export-art.mjs [slug ...]
// Writes art/figures/<slug>.svg (follows the reader's color scheme, keeps the
// CSS motion: pulses along wires, glows that breathe) and, for the cover,
// art/readme/cover-light.svg and cover-dark.svg for the README's <picture>.

import { mkdirSync, readdirSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { renderToString } from "../src/lib/iso/svg.js"
import { fileStyle } from "../src/lib/iso/style.js"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const FIGS = join(ROOT, "src/figures")
const only = process.argv.slice(2)
const files = readdirSync(FIGS).filter((f) => f.endsWith(".js") && f !== "mark.js")

const panel = (fig) => `<rect class="panel" width="${fig.width}" height="${fig.height}" rx="22"/>`
const write = (file, svg) => {
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, svg)
  console.log(`${file.replace(ROOT + "/", "")}  ${(svg.length / 1024).toFixed(1)} KB`)
}

for (const f of files) {
  const fig = (await import(pathToFileURL(join(FIGS, f)).href)).default
  if (only.length && !only.includes(fig.slug)) continue
  const svg = (theme) =>
    renderToString(fig, { prefix: `tsq-${fig.slug}`, style: fileStyle(theme), className: "static" }).replace(
      '<g class="scene">',
      `${panel(fig)}<g class="scene">`
    ) + "\n"
  write(join(ROOT, "art/figures", `${fig.slug}.svg`), svg("auto"))
  if (fig.slug === "cover") {
    write(join(ROOT, "art/readme/cover-light.svg"), svg("light"))
    write(join(ROOT, "art/readme/cover-dark.svg"), svg("dark"))
  }
}
