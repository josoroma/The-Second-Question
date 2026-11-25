import { getCollection } from "astro:content"

import { chapterHref, partsFor, tocEntriesFor, type Part } from "@/data/book"
import { strings, type Lang } from "@/data/ui"

// A chapter that so far has only its opening ends with this line.
const PREVIEW_MARK = "This chapter continues in the full draft"

export type ReadingEntry = {
  kind: "front" | "chapter" | "machine" | "back"
  slug: string
  title: string
  summary?: string
  number?: number
  part?: Part
  href: string
  ready: boolean
  preview: boolean
}

function fileTitle(body = ""): string | undefined {
  return body.match(/^#\s+(.+)$/m)?.[1]?.trim()
}

// The book's pages in one language.
export async function pages(lang: Lang) {
  return lang === "es" ? await getCollection("chaptersEs") : await getCollection("chapters")
}

// Every page of the book in reading order: front matter, each part's chapters
// and closing page, then back matter. Entries without a file are not ready.
export async function readingOrder(lang: Lang): Promise<ReadingEntry[]> {
  const files = await pages(lang)
  const byId = new Map(files.map((file) => [file.id, file]))

  const extra = (pattern: RegExp, kind: "front" | "back"): ReadingEntry[] =>
    files
      .filter((file) => pattern.test(file.id))
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((file) => ({
        kind,
        slug: file.id,
        title: fileTitle(file.body) ?? file.id,
        href: chapterHref(file.id, lang),
        ready: true,
        preview: false,
      }))

  const main: ReadingEntry[] = tocEntriesFor(lang).map((entry) => {
    const file = byId.get(entry.slug)
    return {
      kind: entry.kind,
      slug: entry.slug,
      title: entry.title,
      summary: entry.summary,
      number: entry.number,
      part: entry.part,
      href: chapterHref(entry.slug, lang),
      ready: Boolean(file),
      preview: Boolean(file?.body?.includes(PREVIEW_MARK)),
    }
  })

  return [...extra(/^00[a-z]-/, "front"), ...main, ...extra(/^9\d-/, "back")]
}

export async function readySlugs(lang: Lang): Promise<Set<string>> {
  const order = await readingOrder(lang)
  return new Set(order.filter((entry) => entry.ready).map((entry) => entry.slug))
}

// Plain data for the contents sidebar and the mobile sheet (no Part objects,
// so the React island's props stay small).
export type NavEntry = Pick<ReadingEntry, "kind" | "slug" | "title" | "number" | "href" | "ready" | "preview">
export type NavGroup = { key: string; label: string; entries: NavEntry[] }

export async function navGroups(lang: Lang): Promise<NavGroup[]> {
  const t = strings(lang)
  const order = await readingOrder(lang)
  const strip = ({ kind, slug, title, number, href, ready, preview }: ReadingEntry): NavEntry => ({
    kind,
    slug,
    title,
    number,
    href,
    ready,
    preview,
  })
  const front = order.filter((entry) => entry.kind === "front").map(strip)
  const back = order.filter((entry) => entry.kind === "back").map(strip)
  return [
    ...(front.length ? [{ key: "front", label: t.front, entries: front }] : []),
    ...partsFor(lang).map((part) => ({
      key: `part-${part.number}`,
      label: `${t.part} ${part.number} · ${part.title}`,
      entries: order.filter((entry) => entry.part?.number === part.number).map(strip),
    })),
    ...(back.length ? [{ key: "back", label: t.back, entries: back }] : []),
  ]
}

export function readingMinutes(markdown: string): number {
  const words = markdown.replace(/[#>*_`|-]/g, " ").split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 230))
}
