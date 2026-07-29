import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="size-8 text-destructive" />
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Giriş Başarısız</h1>
        <p className="max-w-sm text-muted-foreground">
          GitHub ile giriş yapılırken bir sorun oluştu. Lütfen tekrar dene.
        </p>
      </div>
      <Button nativeButton={false} render={<Link href="/login" />}>Tekrar Dene</Button>
    </div>
  )
}
