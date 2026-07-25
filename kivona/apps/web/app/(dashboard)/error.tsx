"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardError({
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
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="size-7 text-destructive" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">Bir şeyler ters gitti</h2>
        <p className="text-sm text-muted-foreground">
          Bu sayfa yüklenirken beklenmeyen bir hata oluştu.
        </p>
      </div>
      <Button onClick={() => reset()}>Tekrar Dene</Button>
    </div>
  )
}
