// Rehype plugin for the book's Markdown.
//
// 1. Removes the chapter's first <h1>: the page renders its own chapter header.
// 2. Marks the book's callouts so the site can style them. A callout is a
//    blockquote whose first paragraph starts with a bold label:
//      > **Research says:** ...   > **Myth check:** ...
//      > **From practice:** ...   > **Line to keep:** ...
// 3. Marks device headings ("Practice: ...", "Words to use", "When it backfires",
//    "With a machine in the room") with a data attribute.

const CALLOUTS = {
  "research says": "research",
  "myth check": "myth",
  "from practice": "practice",
  "line to keep": "line",
  // Spanish edition
  "la investigación dice": "research",
  "mito a prueba": "myth",
  "de la práctica": "practice",
  "frase para guardar": "line",
}

const HEADINGS = [
  ["practice", "practice"],
  ["words to use", "words"],
  ["when it backfires", "backfires"],
  ["with a machine in the room", "machine"],
  ["phrases you will hear", "words"],
  // Spanish edition
  ["práctica", "practice"],
  ["palabras para usar", "words"],
  ["cuando sale mal", "backfires"],
  ["con una máquina en la sala", "machine"],
  ["frases que va a oír", "words"],
]

function textOf(node) {
  if (!node) return ""
  if (node.type === "text") return node.value
  if (Array.isArray(node.children)) return node.children.map(textOf).join("")
  return ""
}

function firstElement(children = []) {
  return children.find((child) => child.type === "element")
}

function walk(node, visit, parent) {
  visit(node, parent)
  if (Array.isArray(node.children)) {
    for (const child of [...node.children]) walk(child, visit, node)
  }
}

export function rehypeBook() {
  return (tree) => {
    let removedTitle = false

    walk(tree, (node, parent) => {
      if (node.type !== "element") return

      if (!removedTitle && node.tagName === "h1" && parent) {
        parent.children = parent.children.filter((child) => child !== node)
        removedTitle = true
        return
      }

      if (node.tagName === "blockquote") {
        const paragraph = firstElement(node.children)
        const strong = paragraph && firstElement(paragraph.children)
        if (!strong || strong.tagName !== "strong") return
        const label = textOf(strong).replace(/[:.]\s*$/, "").trim().toLowerCase()
        const kind = CALLOUTS[label]
        if (!kind) return
        node.properties = node.properties || {}
        node.properties.dataCallout = kind
        strong.properties = strong.properties || {}
        strong.properties.dataCalloutLabel = ""
        // The label is set as a small caption on the site: drop its colon.
        const last = strong.children?.[strong.children.length - 1]
        if (last?.type === "text") last.value = last.value.replace(/[:.]\s*$/, "")
        return
      }

      // Tables: label each cell with its column header, so a phone can show
      // every row as a small stacked card.
      if (node.tagName === "table") {
        const rows = []
        walk(node, (child) => {
          if (child.type === "element" && child.tagName === "tr") rows.push(child)
        })
        const header = rows.find((row) => row.children.some((cell) => cell.tagName === "th"))
        if (!header) return
        const labels = header.children.filter((cell) => cell.tagName === "th").map((cell) => textOf(cell).trim())
        for (const row of rows) {
          if (row === header) continue
          row.children
            .filter((cell) => cell.tagName === "td")
            .forEach((cell, i) => {
              if (!labels[i]) return
              cell.properties = cell.properties || {}
              cell.properties.dataLabel = labels[i]
            })
        }
        return
      }

      if (/^h[2-4]$/.test(node.tagName)) {
        const heading = textOf(node).trim().toLowerCase()
        for (const [prefix, kind] of HEADINGS) {
          if (heading.startsWith(prefix)) {
            node.properties = node.properties || {}
            node.properties.dataDevice = kind
            break
          }
        }
      }
    })
  }
}
