import { HugeiconsIcon } from "@hugeicons/react"
import { Menu02Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

type NavEntry = {
  kind: "front" | "chapter" | "machine" | "back"
  slug: string
  title: string
  number?: number
  href: string
  ready: boolean
  preview: boolean
}
type NavGroup = { key: string; label: string; entries: NavEntry[] }

function EntryLabel({ entry, preview }: { entry: NavEntry; preview: string }) {
  return (
    <>
      <span className="w-5 shrink-0 text-right text-muted-foreground tabular-nums">{entry.number ?? ""}</span>
      <span className={cn(entry.kind === "machine" && "italic")}>
        {entry.title}
        {entry.preview && (
          <span className="ml-1.5 text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase not-italic">
            {preview}
          </span>
        )}
      </span>
    </>
  )
}

export function MobileNav({
  groups,
  current,
  homeHref,
  labels,
}: {
  groups: NavGroup[]
  current?: string
  homeHref: string
  labels: { contents: string; open: string; title: string; preview: string }
}) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label={labels.open} />
        }
      >
        <HugeiconsIcon icon={Menu02Icon} strokeWidth={2} />
      </SheetTrigger>
      <SheetContent side="left" className="w-[88%] max-w-sm overflow-y-auto">
        <SheetHeader className="pb-2">
          <SheetTitle>{labels.contents}</SheetTitle>
          <SheetDescription>
            <a href={homeHref} className="underline underline-offset-4">
              {labels.title}
            </a>
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-6 px-6 pb-10">
          {groups.map((group) => (
            <div key={group.key} className="flex flex-col gap-1">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{group.label}</p>
              <ul className="flex flex-col">
                {group.entries.map((entry) => (
                  <li key={entry.slug}>
                    {entry.ready ? (
                      <a
                        href={entry.href}
                        aria-current={entry.slug === current ? "page" : undefined}
                        className="flex gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-muted aria-[current=page]:bg-muted aria-[current=page]:font-medium"
                      >
                        <EntryLabel entry={entry} preview={labels.preview} />
                      </a>
                    ) : (
                      <span className="flex gap-3 px-2 py-1.5 text-sm text-muted-foreground/70">
                        <EntryLabel entry={entry} preview={labels.preview} />
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
