// Builds the book's logo files from src/figures/mark.js.
//   node scripts/build-logo.mjs [--preview out-dir]
// Writes:
//   src/assets/brand/the-second-question-mark.svg   mark, for the site (themed by the page)
//   src/assets/brand/the-second-question-logo.svg   mark and words, for the site
//   art/readme/logo-light.svg, logo-dark.svg         lockup with its own colors, for the README
//   public/favicon.svg                               mark, themed by the reader's color scheme

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import mark from "../src/figures/mark.js"
import { frameAt, renderToString } from "../src/lib/iso/svg.js"
import { fileStyle } from "../src/lib/iso/style.js"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const BRAND = join(ROOT, "src/assets/brand")
const WORDMARK = join(BRAND, "wordmark.svg")

// ---- the words: Geist semibold, outlined once and kept as a path.
if (!existsSync(WORDMARK)) {
  const old = readFileSync(join(BRAND, "the-second-question-logo.svg"), "utf8")
  const m = old.match(/<path class="tsq-words" d="([^"]+)"/)
  if (!m) throw new Error("No wordmark path found to extract")
  writeFileSync(
    WORDMARK,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 28"><path class="words" d="${m[1]}" fill="currentColor"/></svg>\n`
  )
}
const wordsD = readFileSync(WORDMARK, "utf8").match(/ d="([^"]+)"/)[1]

/** Bounding box of an SVG path (absolute and relative M L H V C S Q T Z). */
function pathBox(d) {
  const toks = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g)
  let i = 0
  let x = 0
  let y = 0
  let sx = 0
  let sy = 0
  let cmd = ""
  const xs = []
  const ys = []
  const num = () => parseFloat(toks[i++])
  const push = (px, py) => {
    xs.push(px)
    ys.push(py)
  }
  while (i < toks.length) {
    if (/[a-zA-Z]/.test(toks[i])) cmd = toks[i++]
    const rel = cmd === cmd.toLowerCase()
    const C = cmd.toUpperCase()
    const bx = rel ? x : 0
    const by = rel ? y : 0
    if (C === "Z") {
      x = sx
      y = sy
      continue
    }
    if (C === "M" || C === "L" || C === "T") {
      x = bx + num()
      y = by + num()
      if (C === "M") {
        sx = x
        sy = y
        cmd = rel ? "l" : "L"
      }
    } else if (C === "H") x = bx + num()
    else if (C === "V") y = by + num()
    else if (C === "Q" || C === "S") {
      push(bx + num(), by + num())
      x = bx + num()
      y = by + num()
    } else if (C === "C") {
      push(bx + num(), by + num())
      push(bx + num(), by + num())
      x = bx + num()
      y = by + num()
    } else throw new Error(`Unsupported path command ${cmd}`)
    push(x, y)
  }
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]
}

// ---- the mark, at its designed still.
const { items } = frameAt(mark)
let x0 = Infinity
let y0 = Infinity
let x1 = -Infinity
let y1 = -Infinity
for (const it of items)
  for (const p of it.pieces)
    for (const m of (p.d || "").matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/g)) {
      x0 = Math.min(x0, +m[1])
      y0 = Math.min(y0, +m[2])
      x1 = Math.max(x1, +m[1])
      y1 = Math.max(y1, +m[2])
    }
const pad = 1.5
const mb = [x0 - pad, y0 - pad, x1 + pad, y1 + pad]
const mw = mb[2] - mb[0]
const mh = mb[3] - mb[1]

const strip = (svg) => {
  // Drop defs nothing refers to (the still has no glow), and the root element.
  const inner = svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "")
  return /url\(#/.test(inner.replace(/<defs>.*?<\/defs>/s, "")) ? inner : inner.replace(/<defs>.*?<\/defs>/s, "")
}

const markSVG = ({ prefix, style, theme } = {}) => {
  const svg = renderToString(mark, {
    prefix,
    viewBox: mb.map((v, i) => (i < 2 ? v : 0)).slice(0, 2).concat([mw, mh]).map((v) => +v.toFixed(2)).join(" "),
    className: "mark",
    style: style ? fileStyle(theme) : undefined,
  })
  return svg.replace("<g class=\"scene\">", "<g class=\"scene\">").replace(/<defs>.*?<\/defs>/s, (m) => (/url\(#/.test(svg.replace(m, "")) ? m : ""))
}

// ---- the lockup: mark, then the words, centred on the mark.
const H = 40 // lockup height in its own units
const k = H / mh
const [wx0, wy0, wx1, wy1] = pathBox(wordsD)
const cap = wy1 - wy0
const wordsH = H * 0.4
const wk = wordsH / cap
const gap = 10
const wordsX = mw * k + gap
const wordsY = (H - wordsH) / 2
const lockW = +(wordsX + (wx1 - wx0) * wk + 1).toFixed(2)

function lockup({ prefix, style, theme, words = "currentColor" }) {
  const inner = strip(
    renderToString(mark, {
      prefix,
      viewBox: `${mb[0]} ${mb[1]} ${mw} ${mh}`,
      className: "mark",
    })
  )
  const body = inner.replace(/<title[^>]*>.*?<\/title><desc[^>]*>.*?<\/desc>/s, "")
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lockW} ${H}" width="${lockW}" height="${H}" class="iso mark lockup" role="img" aria-labelledby="${prefix}-title ${prefix}-desc">` +
    `<title id="${prefix}-title">The Second Question</title>` +
    `<desc id="${prefix}-desc">${mark.desc} Then the words The Second Question.</desc>` +
    (style ? `<style>${fileStyle(theme)}</style>` : "") +
    `<g transform="translate(${(-mb[0] * k).toFixed(3)} ${(-mb[1] * k).toFixed(3)}) scale(${k.toFixed(5)})">${body}</g>` +
    `<path class="words" fill="${words}" transform="translate(${(wordsX - wx0 * wk).toFixed(3)} ${(wordsY - wy0 * wk).toFixed(3)}) scale(${wk.toFixed(5)})" d="${wordsD}"/>` +
    `</svg>\n`
  )
}

const outputs = {
  [join(BRAND, "the-second-question-mark.svg")]: markSVG({ prefix: "tsq-mark" }) + "\n",
  [join(BRAND, "the-second-question-logo.svg")]: lockup({ prefix: "tsq-logo" }),
  [join(ROOT, "art/readme/logo-light.svg")]: lockup({ prefix: "tsq-logo", style: true, theme: "light", words: "#171717" }),
  [join(ROOT, "art/readme/logo-dark.svg")]: lockup({ prefix: "tsq-logo", style: true, theme: "dark", words: "#ededed" }),
  [join(ROOT, "public/favicon.svg")]: markSVG({ prefix: "tsq-fav", style: true, theme: "auto" }) + "\n",
}
for (const [file, svg] of Object.entries(outputs)) {
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, svg)
  console.log(`${file.replace(ROOT + "/", "")}  ${(svg.length / 1024).toFixed(1)} KB`)
}

// ---- optional preview sheet
const pi = process.argv.indexOf("--preview")
if (pi > 0) {
  const dir = resolve(process.argv[pi + 1] || "logo-preview")
  mkdirSync(dir, { recursive: true })
  const { TOKENS, ISO_CSS } = await import("../src/lib/iso/style.js")
  const vars = (sel, t) => `${sel}{${Object.entries(t).map(([k2, v]) => `${k2}:${v}`).join(";")}}`
  const site = (theme) => `<style>${vars(`.${theme} .iso`, TOKENS[theme])}${theme === "light" ? ISO_CSS : ""}</style>`
  const logo = readFileSync(join(BRAND, "the-second-question-logo.svg"), "utf8")
  const markOnly = readFileSync(join(BRAND, "the-second-question-mark.svg"), "utf8")
  const josoroma = readFileSync(join(BRAND, "josoroma-logo.svg"), "utf8")
  const row = (theme) => `
    <section class="${theme}">${site(theme)}
      <div class="hdr"><span class="lg" style="height:28px">${logo}</span><span class="by">by</span><span class="jo">${josoroma}</span></div>
      <div class="hdr"><span class="lg" style="height:40px">${logo}</span><span class="by">by</span><span class="jo" style="height:26px">${josoroma}</span></div>
      <div class="marks">${[16, 24, 32, 48, 96, 160].map((h) => `<span style="height:${h}px">${markOnly}</span>`).join("")}</div>
    </section>`
  writeFileSync(
    join(dir, "index.html"),
    `<!doctype html><meta charset="utf-8"><style>
      body{margin:0;font:13px system-ui}
      section{padding:24px 28px;display:grid;gap:22px}
      .light{background:#fff;color:#171717}.dark{background:#0a0a0a;color:#ededed}
      .hdr{display:flex;align-items:center;gap:10px}.hdr .lg svg,.marks svg{height:100%;width:auto;display:block}
      .lg{display:block}.by{color:#737373;font-size:12px}.jo{display:block;height:18px}.jo svg{height:100%;width:auto;display:block}
      .marks{display:flex;align-items:flex-end;gap:22px}.marks span{display:block}
    </style>${row("light")}${row("dark")}`
  )
  const { shot } = await import("./shot.mjs")
  shot(join(dir, "index.html"), join(dir, "logo-sheet.png"), { width: 900, height: 820, scale: 2 })
  console.log(join(dir, "logo-sheet.png"))
}
