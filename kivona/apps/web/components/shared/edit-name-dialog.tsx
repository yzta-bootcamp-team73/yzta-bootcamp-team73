"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, User as UserIcon } from "lucide-react"

export function EditNameDialog({ user }: { user: any }) {
  const [open, setOpen] = useState(false)
  const currentFullName = user?.user_metadata?.full_name || user?.user_metadata?.user_name || ""
  const [fullName, setFullName] = useState(currentFullName)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || fullName.trim() === currentFullName) {
      setOpen(false)
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: fullName.trim() }
      })
      if (authError) throw authError

      const { error: dbError } = await supabase
        .from('profiles')
        .update({ full_name: fullName.trim() })
        .eq('id', user.id)
      
      if (dbError) {
        console.warn("Profil tablosu güncellenemedi (İzin hatası olabilir) ama Auth güncellendi:", dbError);
      }

      setOpen(false)
      window.location.reload()
    } catch (error: any) {
      console.error("İsim güncellenirken hata oluştu:", error)
      alert(`Bir hata oluştu: ${error?.message || "Bilinmeyen hata"}`)
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="icon-sm" className="ml-2 text-muted-foreground hover:text-foreground" />}>
        <Pencil className="w-4 h-4" />
        <span className="sr-only">İsmi Düzenle</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" showCloseButton={true}>
        <DialogHeader>
          <DialogTitle>İsmi Düzenle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="flex flex-col gap-2">
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                id="edit-name"
                placeholder="Örn: Zeynep Yılmaz"
                className="pl-10 h-12"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <DialogClose render={<Button type="button" variant="outline" disabled={isLoading} />}>
              İptal
            </DialogClose>
            <Button type="submit" disabled={!fullName.trim() || isLoading}>
              {isLoading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
