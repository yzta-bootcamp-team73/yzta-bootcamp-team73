import Link from "next/link"
import { Compass } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-accent">
        <Compass className="size-8 text-primary" />
      </div>
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-foreground">404</h1>
        <p className="text-muted-foreground">Aradığın sayfa bulunamadı.</p>
      </div>
      <Button nativeButton={false} render={<Link href="/" />}>Ana Sayfaya Dön</Button>
    </div>
  )
}
