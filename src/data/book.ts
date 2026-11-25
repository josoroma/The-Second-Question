import { strings, type Lang } from "./ui"
import toc from "./toc.json"
import tocEs from "./toc.es.json"

// The book's table of contents. Files live in book/:
//   NN-slug.md                         a chapter (01 to 38)
//   NNm-with-a-machine-in-the-room.md  the closing page of Parts I to V
//   00a-slug.md ... 00z-slug.md        front matter
//   90-slug.md ... 99-slug.md          back matter
// The Spanish edition has the same file names in book/es/ and its titles in
// toc.es.json.
// An entry without a file yet is listed as "In draft".

export type Chapter = {
  number: number
  slug: string
  title: string
  summary: string
}

export type ClosingPage = {
  slug: string
  title: string
  summary: string
}

export type Part = {
  number: number
  title: string
  blurb: string
  art: string
  chapters: Chapter[]
  machine?: ClosingPage
}

export const repo = "https://github.com/josoroma/The-Second-Question"

export function bookFor(lang: Lang) {
  const t = strings(lang)
  return { title: t.title, subtitle: t.subtitle, pitch: t.pitch, author: "josoroma", repo }
}

const tocs: Record<Lang, Part[]> = { en: toc.parts as Part[], es: tocEs.parts as Part[] }

export function partsFor(lang: Lang): Part[] {
  return tocs[lang]
}

export type ChapterWithPart = Chapter & { part: Part }

export function chaptersFor(lang: Lang): ChapterWithPart[] {
  return partsFor(lang).flatMap((part) => part.chapters.map((chapter) => ({ ...chapter, part })))
}

// Chapters and closing pages in reading order.
export type TocEntry = {
  kind: "chapter" | "machine"
  slug: string
  title: string
  summary: string
  number?: number
  part: Part
}

export function tocEntriesFor(lang: Lang): TocEntry[] {
  return partsFor(lang).flatMap((part) => [
    ...part.chapters.map((chapter) => ({ kind: "chapter" as const, ...chapter, part })),
    ...(part.machine ? [{ kind: "machine" as const, ...part.machine, part }] : []),
  ])
}

export function withBase(path = ""): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "")
  const clean = path.replace(/^\//, "")
  return clean ? `${base}/${clean}` : `${base}/`
}

// English lives at the root, Spanish under es/.
export function homeHref(lang: Lang): string {
  return withBase(lang === "es" ? "es/" : "")
}

export function chapterHref(slug: string, lang: Lang): string {
  return withBase(`${lang === "es" ? "es/" : ""}read/${slug}/`)
}

// Where a page's Markdown is in the repository.
export function sourceHref(slug: string, lang: Lang): string {
  return `${repo}/blob/main/book/${lang === "es" ? "es/" : ""}${slug}.md`
}
