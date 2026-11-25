// @ts-check

import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import { unified } from "@astrojs/markdown-remark"
import { rehypeBook } from "./src/lib/rehype-book.mjs"

// https://astro.build/config
export default defineConfig({
  site: "https://josoroma.github.io",
  base: "/The-Second-Question",
  trailingSlash: "ignore",
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
    // three.js (the figures' 3D view) is one lazy chunk of about 540 kB, loaded
    // only when a figure turns 3D.
    build: { chunkSizeWarningLimit: 700 },
  },
  integrations: [react()],
  markdown: {
    processor: unified({ rehypePlugins: [rehypeBook], gfm: true, smartypants: true }),
  },
})
