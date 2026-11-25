import { HugeiconsIcon } from "@hugeicons/react"
import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"

function setTheme(dark: boolean) {
  const root = document.documentElement
  root.classList.toggle("dark", dark)
  root.style.colorScheme = dark ? "dark" : "light"
  try {
    localStorage.setItem("theme", dark ? "dark" : "light")
  } catch {
    // Storage can be unavailable; the choice then lasts for this page only.
  }
}

export function ThemeToggle({ label }: { label: string }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      onClick={() => setTheme(!document.documentElement.classList.contains("dark"))}
    >
      <HugeiconsIcon icon={Moon02Icon} strokeWidth={2} className="dark:hidden" />
      <HugeiconsIcon icon={Sun03Icon} strokeWidth={2} className="hidden dark:block" />
    </Button>
  )
}
