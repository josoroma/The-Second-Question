// Screenshots an HTML or SVG file (or a URL) with headless Chrome, for looking at art.
//   node scripts/shot.mjs page.html out.png [width] [height] [scale] [waitMs]
// Headless Chrome lays a page out at least ~500px wide; keep width >= 500.
// Each run uses its own throwaway profile, so parallel runs do not collide, and
// a run counts as done when the PNG was written, whatever Chrome's exit code
// (under load Chrome can exit 2 from its teardown watchdog after writing it).

import { execFileSync } from "node:child_process"
import { existsSync, mkdtempSync, rmSync, statSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { pathToFileURL } from "node:url"

export const CHROME = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find((p) => p && existsSync(p))

const written = (file) => existsSync(file) && statSync(file).size > 0

/** Runs headless Chrome with a private profile; returns the output path once the PNG exists. */
export function chrome(url, output, flags = [], { timeout = 90000, tries = 2 } = {}) {
  if (!CHROME) throw new Error("No Chrome found; set CHROME_PATH")
  const out = resolve(output)
  let lastError = null
  for (let attempt = 0; attempt < tries; attempt++) {
    const profile = mkdtempSync(join(tmpdir(), "tsq-shot-"))
    try {
      rmSync(out, { force: true })
      execFileSync(
        CHROME,
        [
          "--headless=new",
          "--hide-scrollbars",
          "--no-first-run",
          "--no-default-browser-check",
          `--user-data-dir=${profile}`,
          ...flags,
          `--screenshot=${out}`,
          url,
        ],
        { stdio: "ignore", timeout }
      )
    } catch (e) {
      lastError = e
    } finally {
      rmSync(profile, { recursive: true, force: true })
    }
    if (written(out)) return out
  }
  throw new Error(`Chrome did not write ${out}${lastError ? `: ${lastError.message}` : ""}`)
}

export function shot(input, output, { width = 1200, height = 900, scale = 1, wait = 400 } = {}) {
  const url = /^https?:/.test(input) ? input : pathToFileURL(resolve(input)).href
  return chrome(url, output, [
    "--disable-gpu",
    `--force-device-scale-factor=${scale}`,
    `--window-size=${width},${height}`,
    `--virtual-time-budget=${wait}`,
  ])
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [input, output, w, h, s, wait] = process.argv.slice(2)
  if (!input || !output) {
    console.error("usage: node scripts/shot.mjs page.html out.png [width] [height] [scale] [waitMs]")
    process.exit(2)
  }
  shot(input, output, { width: +w || 1200, height: +h || 900, scale: +s || 1, wait: +wait || 400 })
  console.log(output)
}
