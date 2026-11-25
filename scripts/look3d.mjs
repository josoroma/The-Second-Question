// Screenshots a figure's lab page (2D plus 3D from three sides) from the dev server.
//   node scripts/look3d.mjs <slug> [--out dir] [--dark]
// Needs `npm run dev` running on http://localhost:4321 (the lab page exists in development only).
import { mkdirSync } from "node:fs"
import { join, resolve } from "node:path"
import { chrome } from "./shot.mjs"

const args = process.argv.slice(2)
const slug = args.find((a) => !a.startsWith("--"))
if (!slug) {
  console.error("usage: node scripts/look3d.mjs <slug> [--out dir] [--dark]")
  process.exit(2)
}
const i = args.indexOf("--out")
const out = resolve(i >= 0 ? args[i + 1] : "art/looks")
mkdirSync(out, { recursive: true })
const dark = args.includes("--dark")
const png = join(out, `${slug}-3d${dark ? "-dark" : ""}.png`)
chrome(
  `http://localhost:4321/The-Second-Question/lab/${slug}/`,
  png,
  [
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--window-size=1200,1400",
    "--virtual-time-budget=6000",
    dark ? "--force-dark-mode" : "--disable-features=AutoDarkMode",
    `--blink-settings=preferredColorScheme=${dark ? 0 : 1}`,
  ]
)
console.log(png)
