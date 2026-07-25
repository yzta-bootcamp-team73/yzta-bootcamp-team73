"use client"

import { useSyncExternalStore, useCallback } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

const THEME_CHANGE_EVENT = "kivona-theme-change"

function subscribe(callback: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, callback)
  return () => window.removeEventListener(THEME_CHANGE_EVENT, callback)
}

// document her zaman client'ta erişilebilir olduğu için useEffect+useState yerine
// useSyncExternalStore kullanıyoruz — React bunu SSR/hydration'da otomatik
// getServerSnapshot ile eşleştirip mismatch üretmeden sonra gerçek değere geçiriyor.
function getSnapshot() {
  return document.documentElement.classList.contains("dark")
}

function getServerSnapshot() {
  return false
}

export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const toggleTheme = useCallback(() => {
    const next = !document.documentElement.classList.contains("dark")
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("kivona-theme", next ? "dark" : "light")
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT))
  }, [])

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Temayı değiştir">
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}
