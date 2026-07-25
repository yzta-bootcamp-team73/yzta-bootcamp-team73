"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  // Sunucuda (ve client'ta ilk render'da) resolvedTheme henüz `undefined`'dır;
  // next-themes kendi içinde bunu mount sonrası çözüp yeniden render eder,
  // bu yüzden burada ayrı bir "mounted" state'ine gerek yok.
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Temayı değiştir"
    >
      {resolvedTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}
