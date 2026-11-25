import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"

// Book pages are plain Markdown files in book/ with no front matter, so they
// read cleanly on GitHub: NN-slug.md chapters, NNm- closing pages, 00a- front
// matter and 90- to 99- back matter. Order, parts and summaries come from
// src/data/toc.json; README.md and BOOK.md are generated and not pages.
const chapters = defineCollection({
  loader: glob({ pattern: "[0-9][0-9]*-*.md", base: "./book" }),
  schema: z.looseObject({}),
})

// The Spanish edition: the same file names in book/es/.
const chaptersEs = defineCollection({
  loader: glob({ pattern: "[0-9][0-9]*-*.md", base: "./book/es" }),
  schema: z.looseObject({}),
})

export const collections = { chapters, chaptersEs }
