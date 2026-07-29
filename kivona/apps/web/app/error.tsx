"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="size-8 text-destructive" />
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Bir şeyler ters gitti</h1>
        <p className="text-muted-foreground">Beklenmeyen bir hata oluştu, lütfen tekrar deneyin.</p>
      </div>
      <Button onClick={() => reset()}>Tekrar Dene</Button>
    </div>
  )
}
