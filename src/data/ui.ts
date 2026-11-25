// Every word the site itself says, in both languages. The book's own words
// are in book/ (English) and book/es/ (Spanish).

export const langs = ["en", "es"] as const
export type Lang = (typeof langs)[number]

export const ui = {
  en: {
    locale: "en",
    name: "English",
    title: "The Second Question",
    subtitle:
      "How Builders Think Clearly, Speak Precisely, and Stay Human When Machines Write the First Draft",
    pitch:
      "Anyone, or any assistant, can prepare the first answer. The second question shows whether you understand what you said. This book trains you for that moment: in the meeting, the demo, the pitch, the hard conversation, and every brief you hand to a person or a machine.",
    by: "by",
    home: "The Second Question, home",
    skip: "Skip to content",
    contents: "Contents",
    openContents: "Open the contents",
    source: "The book's Markdown source on GitHub",
    theme: "Switch between light and dark mode",
    otherLang: "Leer en español",
    otherShort: "ES",
    part: "Part",
    chapter: "Chapter",
    closing: "Closing page",
    front: "Before you start",
    back: "At the back",
    minRead: "min read",
    preview: "Preview",
    previewLong: "Preview: opening only",
    inDraft: "In draft",
    readMarkdownChapter: "Read this chapter in Markdown",
    readMarkdownPage: "Read this page in Markdown",
    pageNav: "Page navigation",
    previous: "Previous",
    next: "Next",
    onThisPage: "On this page",
    startReading: "Start reading",
    readMarkdown: "Read the Markdown",
    heroPlate: "The second question",
    badge: (online: number, total: number) => `Free to read · ${online} of ${total} chapters · English and Spanish`,
    promiseHeading: "Machines can write the sentence. Someone still has to answer for it.",
    promises: [
      {
        title: "Written from inside the work",
        body: "Design reviews, demos, client calls, sales calls and pull requests. Never a generic office.",
      },
      {
        title: "Confidence that survives the second question",
        body: "Say the claim, what it rests on and where it stops, and you will not be caught out by the follow-up.",
      },
      {
        title: "Honest about its own limits",
        body: "Every technique comes with when it fails, and how it changes when the other person has power over you.",
      },
      {
        title: "It checks the famous numbers",
        body: "Research is verified before it is printed, and the popular myths are corrected, not repeated.",
      },
      {
        title: "A second language is normal",
        body: "An accent is never treated as a fault. Being easy to understand is trained like any other skill.",
      },
      {
        title: "One skill, two listeners",
        body: "What makes a brief clear to a colleague makes it clear to a machine, and you answer for both.",
      },
    ],
    contentsIntro:
      "Six parts and thirty-eight chapters. Parts I to V each close with one page on doing that part's work with a machine in the room. Every chapter is also a Markdown file in the repository's book folder.",
    footerSource: "Written in Markdown.",
    footerLink: "Read the source on GitHub",
    footerArt: "Figures after ISO-GLOW (isoglow.dev), with Hairline and Plotter (MIT).",
    footerNote: "2026. Every person and company in this book is invented. AI agents drafted it, directed by the author.",
    figureView: "Figure view",
    view3d: "Show this figure in 3D",
    revolve: "Revolve",
    revolveTitle: "Turn the figure slowly",
    isoView: "Iso view",
    isoTitle: "Back to the isometric view",
    illustration: "Illustration",
  },
  es: {
    locale: "es-CR",
    name: "Español",
    title: "La segunda pregunta",
    subtitle:
      "Cómo quienes construyen piensan con claridad, hablan con precisión y siguen siendo humanos cuando las máquinas escriben el primer borrador",
    pitch:
      "Cualquiera, o cualquier asistente, puede preparar la primera respuesta. La segunda pregunta muestra si usted entiende lo que dijo. Este libro le entrena para ese momento: en la reunión, la demo, el pitch, la conversación difícil y cada encargo que le da a una persona o a una máquina.",
    by: "por",
    home: "La segunda pregunta, inicio",
    skip: "Ir al contenido",
    contents: "Contenido",
    openContents: "Abrir el contenido",
    source: "El Markdown del libro en GitHub",
    theme: "Cambiar entre modo claro y oscuro",
    otherLang: "Read in English",
    otherShort: "EN",
    part: "Parte",
    chapter: "Capítulo",
    closing: "Página de cierre",
    front: "Antes de empezar",
    back: "Al final del libro",
    minRead: "min de lectura",
    preview: "Adelanto",
    previewLong: "Adelanto: solo el comienzo",
    inDraft: "En borrador",
    readMarkdownChapter: "Leer este capítulo en Markdown",
    readMarkdownPage: "Leer esta página en Markdown",
    pageNav: "Navegación entre páginas",
    previous: "Anterior",
    next: "Siguiente",
    onThisPage: "En esta página",
    startReading: "Empezar a leer",
    readMarkdown: "Leer el Markdown",
    heroPlate: "La segunda pregunta",
    badge: (online: number, total: number) => `Lectura gratis · ${online} de ${total} capítulos · español e inglés`,
    promiseHeading: "Las máquinas pueden escribir la frase. Alguien todavía tiene que responder por ella.",
    promises: [
      {
        title: "Escrito desde adentro del trabajo",
        body: "Revisiones de diseño, demos, llamadas con clientes, ventas y pull requests. Nunca una oficina genérica.",
      },
      {
        title: "Una seguridad que aguanta la segunda pregunta",
        body: "Diga la afirmación, en qué se apoya y hasta dónde llega, y la pregunta que sigue no le tomará por sorpresa.",
      },
      {
        title: "Honesto sobre sus propios límites",
        body: "Cada técnica dice cuándo falla y qué cambia cuando la otra persona tiene poder sobre usted.",
      },
      {
        title: "Revisa los números famosos",
        body: "La investigación se verifica antes de imprimirla, y los mitos populares se corrigen en vez de repetirse.",
      },
      {
        title: "Una segunda lengua es lo normal",
        body: "Un acento nunca se trata como una falla. Que le entiendan con facilidad se entrena como cualquier otra habilidad.",
      },
      {
        title: "Una habilidad, dos oyentes",
        body: "Lo que hace claro un encargo para un colega lo hace claro para una máquina, y usted responde por los dos.",
      },
    ],
    contentsIntro:
      "Seis partes y treinta y ocho capítulos. Las partes I a V cierran con una página sobre hacer ese trabajo con una máquina en la sala. Cada capítulo es también un archivo Markdown en la carpeta book/es del repositorio.",
    footerSource: "Escrito en Markdown.",
    footerLink: "Lea la fuente en GitHub",
    footerArt: "Figuras según ISO-GLOW (isoglow.dev), con Hairline y Plotter (MIT).",
    footerNote:
      "2026. Todas las personas y empresas de este libro son inventadas. Lo redactaron y tradujeron agentes de IA, dirigidos por el autor.",
    figureView: "Vista de la figura",
    view3d: "Ver esta figura en 3D",
    revolve: "Girar",
    revolveTitle: "Girar la figura despacio",
    isoView: "Vista iso",
    isoTitle: "Volver a la vista isométrica",
    illustration: "Ilustración",
  },
}

export type UI = (typeof ui)["en"]

export function strings(lang: Lang): UI {
  return ui[lang] as UI
}
