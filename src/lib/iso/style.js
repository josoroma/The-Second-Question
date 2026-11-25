// The figures' stylesheet. One source for the site (tokens follow the
// page's .dark class) and for standalone files (tokens follow the reader's
// color scheme). Accents are the author's josoroma colors: magenta for what
// is switched on, teal for the second accent.

export const TOKENS = {
  light: {
    "--iso-panel": "#f7f7f7",
    "--iso-body": "#ececec",
    "--iso-body-2": "#e2e2e2",
    "--iso-deck": "#fbfbfb",
    "--iso-line": "#8a8a8a",
    "--iso-detail": "#cfcfcf",
    "--iso-ink": "#6b6b6b",
    "--iso-glass": "#dedede",
    "--iso-recess": "#e5e5e5",
    "--iso-accent": "#c92b60",
    "--iso-accent-hi": "#e3507f",
    "--iso-accent-lo": "#9c1e4a",
    "--iso-accent-ln": "#7e183c",
    "--iso-accent-cr": "#ec7d9f",
    "--iso-accent2": "#087fa9",
    "--iso-accent2-hi": "#2ea2cc",
    "--iso-accent2-lo": "#06668a",
    "--iso-accent2-ln": "#05516e",
    "--iso-accent2-cr": "#5cb8da",
    "--iso-brand": "#c92b60",
    "--iso-brand-up": "#e2527f",
    "--iso-brand-side": "#971c46",
    "--iso-brand2": "#087fa9",
    "--iso-brand2-up": "#2fa3cd",
    "--iso-brand2-side": "#055f80",
    "--iso-brand-ln": "#6e1435",
    "--iso-brand-cr": "#ef86a8",
    "--iso-brand2-ln": "#044a64",
    "--iso-brand2-cr": "#62bcdd",
  },
  dark: {
    "--iso-panel": "#111111",
    "--iso-body": "#171717",
    "--iso-body-2": "#131313",
    "--iso-deck": "#1e1e1e",
    "--iso-line": "#565656",
    "--iso-detail": "#2d2d2d",
    "--iso-ink": "#8c8c8c",
    "--iso-glass": "#0e0e0e",
    "--iso-recess": "#0d0d0d",
    "--iso-accent": "#e8457c",
    "--iso-accent-hi": "#ff7da5",
    "--iso-accent-lo": "#b42a5b",
    "--iso-accent-ln": "#ff9fbd",
    "--iso-accent-cr": "#ff92b4",
    "--iso-accent2": "#1aa6d8",
    "--iso-accent2-hi": "#66cff3",
    "--iso-accent2-lo": "#0d7ea7",
    "--iso-accent2-ln": "#93ddf6",
    "--iso-accent2-cr": "#7ad5f4",
    "--iso-brand": "#e3487c",
    "--iso-brand-up": "#f3739c",
    "--iso-brand-side": "#ab2c5a",
    "--iso-brand2": "#1fa3cf",
    "--iso-brand2-up": "#5cc5eb",
    "--iso-brand2-side": "#0e789f",
    "--iso-brand-ln": "#f9a3c1",
    "--iso-brand-cr": "#f39ab8",
    "--iso-brand2-ln": "#7fd3f2",
    "--iso-brand2-cr": "#6cc8ea",
  },
}

const block = (sel, vars) => `${sel}{${Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(";")}}`

/** Classes shared by every figure. */
export const ISO_CSS = `
.iso{overflow:visible;--iso-mono:ui-monospace,"SF Mono",SFMono-Regular,Menlo,Consolas,monospace}
.iso .panel{fill:var(--iso-panel)}
.iso .p{--ts:var(--iso-body);--tt:var(--iso-deck);--tu:var(--iso-deck);--tr:var(--iso-body);--tl:var(--iso-body-2);--ln:var(--iso-line);--cr:var(--iso-detail);--bl:var(--iso-accent)}
.iso .p.r-accent,.iso .p.on{--ts:var(--iso-accent);--tt:var(--iso-accent-hi);--tu:var(--iso-accent-hi);--tr:var(--iso-accent-lo);--tl:var(--iso-accent-lo);--ln:var(--iso-accent-ln);--cr:var(--iso-accent-cr);--bl:var(--iso-accent)}
.iso .p.r-accent2,.iso .p.on2{--ts:var(--iso-accent2);--tt:var(--iso-accent2-hi);--tu:var(--iso-accent2-hi);--tr:var(--iso-accent2-lo);--tl:var(--iso-accent2-lo);--ln:var(--iso-accent2-ln);--cr:var(--iso-accent2-cr);--bl:var(--iso-accent2)}
.iso .p.r-brand{--ts:var(--iso-brand);--tt:var(--iso-brand-up);--tu:var(--iso-brand-up);--tr:var(--iso-brand-side);--tl:var(--iso-brand-side);--ln:var(--iso-brand-ln);--cr:var(--iso-brand-cr);--bl:var(--iso-brand)}
.iso .p.r-brand2{--ts:var(--iso-brand2);--tt:var(--iso-brand2-up);--tu:var(--iso-brand2-up);--tr:var(--iso-brand2-side);--tl:var(--iso-brand2-side);--ln:var(--iso-brand2-ln);--cr:var(--iso-brand2-cr);--bl:var(--iso-brand2)}
.iso .p.r-brand .cap{fill:var(--iso-brand);stroke:var(--iso-brand)}
.iso .p.r-brand2 .cap{fill:var(--iso-brand2);stroke:var(--iso-brand2)}
.iso .p.r-glass{--ts:var(--iso-glass);--tt:var(--iso-glass)}
.iso .p.r-recess{--ts:var(--iso-recess);--tt:var(--iso-recess)}
.iso .side{fill:var(--ts);stroke:var(--ts);stroke-width:.6;vector-effect:non-scaling-stroke;stroke-linejoin:round}
.iso .top{fill:var(--tt);stroke:var(--cr);stroke-width:1;vector-effect:non-scaling-stroke;stroke-linejoin:round}
.iso .side.t-up{fill:var(--tu);stroke:var(--tu)}
.iso .side.t-right{fill:var(--tr);stroke:var(--tr)}
.iso .side.t-left{fill:var(--tl);stroke:var(--tl)}
.iso .cap{stroke-width:.6;vector-effect:non-scaling-stroke;stroke-linejoin:round}
.iso .cap.t-up{fill:var(--tu);stroke:var(--tu)}
.iso .cap.t-right{fill:var(--tr);stroke:var(--tr)}
.iso .cap.t-left{fill:var(--tl);stroke:var(--tl)}
.iso .p.r-accent .cap,.iso .p.on .cap{fill:var(--iso-accent);stroke:var(--iso-accent)}
.iso .p.r-accent2 .cap,.iso .p.on2 .cap{fill:var(--iso-accent2);stroke:var(--iso-accent2)}
.iso .out{fill:none;stroke:var(--ln);stroke-width:1;vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}
.iso .crease{fill:none;stroke:var(--cr);stroke-width:1;vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}
.iso .face{fill:var(--tt);stroke:var(--cr);stroke-width:1;vector-effect:non-scaling-stroke;stroke-linejoin:round}
.iso .p.r-glass .face{fill:var(--iso-glass);stroke:var(--iso-line)}
.iso .p.r-recess .face{fill:var(--iso-recess);stroke:var(--iso-detail)}
.iso .p.r-mark .face{fill:none;stroke:var(--iso-detail)}
.iso .p.on .face{fill:var(--iso-accent);stroke:var(--iso-accent-hi)}
.iso .p.on2 .face{fill:var(--iso-accent2);stroke:var(--iso-accent2-hi)}
.iso .p.r-ghost .out,.iso .p.r-ghost .crease,.iso .p.dash .out,.iso .p.dash .crease{stroke-dasharray:3 3.5}
.iso .p.r-ghost .far,.iso .p.dash .far{opacity:.55}
.iso .ghost-cap{fill:var(--ln);fill-opacity:.06;stroke:none}
.iso .p.on .ghost-cap{fill:var(--iso-accent);fill-opacity:.1}
.iso .p.on2 .ghost-cap{fill:var(--iso-accent2);fill-opacity:.1}
.iso .p.r-ghost.on,.iso .p.r-ghost.on2,.iso .p.dash.on,.iso .p.dash.on2{--ln:var(--bl)}
.iso .under{fill:none;stroke:var(--iso-panel);stroke-width:3.5;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.iso .wire{fill:none;stroke:var(--iso-line);stroke-width:1;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke;transition:stroke .4s}
.iso .p.r-wire.dash .wire{stroke-dasharray:3 3.5}
.iso .p.on .wire{stroke:var(--iso-accent)}
.iso .p.on2 .wire{stroke:var(--iso-accent2)}
.iso .pulse{fill:none;stroke:var(--iso-accent-hi);stroke-width:2.2;stroke-linecap:round;vector-effect:non-scaling-stroke;stroke-dasharray:var(--flow-dash,6) 106;stroke-dashoffset:var(--flow-dash,6);animation:iso-flow var(--flow-dur,2.4s) linear var(--flow-delay,0s) infinite}
.iso .p.on2 .pulse{stroke:var(--iso-accent2-hi)}
.iso .detail{fill:none;stroke:var(--cr);stroke-width:1;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.iso .guide{fill:none;stroke:var(--iso-line);stroke-width:1;stroke-dasharray:3 4;opacity:.7;stroke-linecap:round;vector-effect:non-scaling-stroke}
.iso .p.on .guide{stroke:var(--iso-accent);opacity:1}
.iso .p.on2 .guide{stroke:var(--iso-accent2);opacity:1}
.iso .grid{fill:none;stroke:var(--iso-detail);stroke-width:1.7;stroke-linecap:round;vector-effect:non-scaling-stroke}
.iso .grid.g1{opacity:.6}.iso .grid.g2{opacity:.28}
.iso .led{fill:var(--iso-detail);stroke:var(--iso-line);stroke-width:.6;vector-effect:non-scaling-stroke}
.iso .p.on .led{fill:var(--iso-accent);stroke:var(--iso-accent-hi)}
.iso .p.on2 .led{fill:var(--iso-accent2);stroke:var(--iso-accent2-hi)}
.iso .bloom{fill:var(--bl);stroke:none;pointer-events:none}
.iso .halo{stroke:none;pointer-events:none}
.iso .label{fill:var(--iso-ink);font-family:var(--iso-mono);font-size:10px;font-weight:500;letter-spacing:.08em;text-transform:uppercase}
.iso .p.on .label{fill:var(--iso-accent-hi)}
.iso .p.keep-case .label{text-transform:none;letter-spacing:.04em}
.iso.mark .out,.iso.mark .crease,.iso.mark .top{vector-effect:none;stroke-width:1.25}
.iso.mark .crease{stroke-width:.85}
.iso.mark .side,.iso.mark .cap{vector-effect:none;stroke-width:.7}
.iso.mark .p.r-ghost .out,.iso.mark .p.r-ghost .crease{stroke-width:1.5;stroke-dasharray:4.5 3.5}
.iso.mark .p.r-ghost .far{opacity:.5}
.iso.mark .words{fill:currentColor}
@keyframes iso-march{to{stroke-dashoffset:-16}}
a:hover .iso.mark .p.r-ghost .out,.iso.mark.live .p.r-ghost .out{animation:iso-march 1.2s linear infinite}
@keyframes iso-flow{from{stroke-dashoffset:var(--flow-dash,6)}to{stroke-dashoffset:-100}}
@keyframes iso-breathe{0%,100%{opacity:.25}50%{opacity:.75}}
.iso.static .breathe .bloom,.iso.static .breathe .halo{animation:iso-breathe 3.2s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.iso .pulse{animation:none;opacity:0}.iso.static .breathe .bloom,.iso.static .breathe .halo{animation:none}}
`

/** Stylesheet for the site: light tokens on .iso, dark tokens under .dark. */
export function siteStyle() {
  return block(".iso", TOKENS.light) + block(".dark .iso", TOKENS.dark) + ISO_CSS
}

/** Stylesheet for a standalone file: tokens follow prefers-color-scheme, or one theme. */
export function fileStyle(theme = "auto") {
  if (theme === "light") return block(".iso", TOKENS.light) + ISO_CSS
  if (theme === "dark") return block(".iso", TOKENS.dark) + ISO_CSS
  return block(".iso", TOKENS.light) + `@media (prefers-color-scheme:dark){${block(".iso", TOKENS.dark)}}` + ISO_CSS
}
