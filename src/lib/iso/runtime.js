// One animation loop for every live figure on the page. A figure only runs
// while it is on screen and the tab is visible. Under reduced motion it shows
// its designed still and answers the pointer without animating.

import { easeChoice, inside } from "./core.js"

export function createRuntime() {
  const items = new Set()
  let raf = 0
  let last = 0
  const mq = typeof matchMedia === "function" ? matchMedia("(prefers-reduced-motion: reduce)") : { matches: false }
  const io =
    typeof IntersectionObserver === "function"
      ? new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              const it = [...items].find((x) => x.el === e.target)
              if (it) {
                it.visible = e.isIntersecting
                if (it.visible) wake(it)
              }
            }
          },
          { rootMargin: "120px" }
        )
      : null

  const frame = (now) => {
    raf = 0
    // Springs and tweens step in 1/240 s substeps, so a slow frame (or a
    // headless capture) can advance them by up to a quarter second at once.
    const dt = last ? Math.min(0.25, (now - last) / 1000) : 1 / 60
    last = now
    let again = false
    for (const it of items) {
      if (!it.visible || document.hidden) continue
      if (it.run(now, dt)) again = true
    }
    if (again) raf = requestAnimationFrame(frame)
    else last = 0
  }

  function wake(it) {
    if (it) it.dirty = true
    if (!raf && typeof requestAnimationFrame === "function") raf = requestAnimationFrame(frame)
  }

  if (typeof document !== "undefined") document.addEventListener("visibilitychange", () => !document.hidden && wake())
  if (mq.addEventListener) mq.addEventListener("change", () => items.forEach((it) => wake(it)))

  return {
    get reduced() {
      return mq.matches
    },

    /** Input passed to a figure's tick(): pointer, springs, tweens and picking. */
    input(pointer, getRest) {
      const springs = new Map()
      const tweens = new Map()
      const input = {
        pointer: null,
        screen: null,
        dt: 0,
        still: false,
        /** Spring toward target (k 100, c 18, m 1): for where the pointer is. Call once per key per frame. */
        spring(key, target, { k = 100, c = 18, m = 1 } = {}) {
          let s = springs.get(key)
          if (!s) {
            s = { x: target, v: 0 }
            springs.set(key, s)
          }
          if (input.still || !input.dt) {
            s.x = target
            s.v = 0
            return target
          }
          const steps = Math.max(1, Math.ceil(input.dt / (1 / 240)))
          const h = input.dt / steps
          for (let i = 0; i < steps; i++) {
            const a = (-k * (s.x - target) - c * s.v) / m
            s.v += a * h
            s.x += s.v * h
          }
          return s.x
        },
        /** Timed ease toward target (700ms on .32 .72 0 1): for which thing is chosen. */
        tween(key, target, { dur = 0.7, ease = easeChoice } = {}) {
          let s = tweens.get(key)
          if (!s) {
            s = { from: target, to: target, p: 1, x: target }
            tweens.set(key, s)
          }
          if (input.still) {
            s.from = s.to = s.x = target
            s.p = 1
            return target
          }
          if (target !== s.to) {
            s.from = s.x
            s.to = target
            s.p = 0
          }
          s.p = Math.min(1, s.p + input.dt / dur)
          s.x = s.from + (s.to - s.from) * ease(s.p)
          return s.x
        },
        /** Which part (of ids, or any) is under the pointer, tested against the rest pose. */
        pick(ids) {
          const polys = getRest()
          if (!polys || !input.screen) return null
          for (let i = polys.length - 1; i >= 0; i--) {
            const r = polys[i]
            if (ids && !ids.includes(r.id)) continue
            if (r.poly.length && inside(input.screen, r.poly)) return r.id
          }
          return null
        },
        /** Distance on the ground from the pointer to a world point, or Infinity. */
        near(x, y) {
          if (!input.pointer) return Infinity
          return Math.hypot(input.pointer[0] - x, input.pointer[1] - y)
        },
      }
      return input
    },

    add(el, fig, render, input) {
      const it = { el, visible: true, dirty: true, t0: performance.now() }
      it.run = (now, dt) => {
        const still = mq.matches
        input.still = still
        input.dt = still ? 0 : dt
        if (still) {
          if (!it.dirty) return false
          it.dirty = false
          render(fig.still)
          return false
        }
        render(fig.still + (now - it.t0) / 1000)
        return true
      }
      items.add(it)
      if (io) io.observe(el)
      render(fig.still)
      wake(it)
      return {
        wake: () => wake(it),
        remove() {
          items.delete(it)
          if (io) io.unobserve(el)
        },
      }
    },
  }
}

let shared = null
/** The page's runtime (created on first use, in the browser only). */
export function runtime() {
  if (!shared) shared = createRuntime()
  return shared
}
