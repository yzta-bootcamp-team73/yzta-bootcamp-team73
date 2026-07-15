"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles, User as UserIcon } from "lucide-react"

export function NameOnboarding({ user }: { user: any }) {
  const [open, setOpen] = useState(false)
  const [fullName, setFullName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Sadece giriş yapmış ama user_metadata içinde full_name'i olmayanlara göster
    if (user && !user.user_metadata?.full_name) {
      setOpen(true)
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim()) return

    setIsLoading(true)
    const supabase = createClient()

    try {
      // 1. Supabase Auth user_metadata güncelleme (Böylece session'da anında güncellenir)
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: fullName.trim() }
      })
      
      if (authError) throw authError

      // 2. Profiles tablosunu güncelleme (Opsiyonel ama veritabanı bütünlüğü için önemli)
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ full_name: fullName.trim() })
        .eq('id', user.id)

      if (dbError) {
        console.warn("Profil tablosu güncellenemedi (İzin hatası olabilir) ama Auth güncellendi:", dbError);
      }

      // Başarılı, formu kapat ve sayfayı yenile ki yeni isim her yere (sidebar vb) yansısın
      setOpen(false)
      window.location.reload()
    } catch (error: any) {
      console.error("İsim güncellenirken hata oluştu:", error)
      alert(`Bir hata oluştu: ${error?.message || "Bilinmeyen hata"}`)
      setIsLoading(false)
    }
  }

  // interactOutside ve escapeKeyDown iptal edilerek popup'ın kapatılması engelleniyor.
  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        // Asla kullanıcının kapatmasına izin verme, sadece başarıyla form gönderilince biz false yaparız.
        if (!isOpen && user?.user_metadata?.full_name) {
          setOpen(isOpen)
        }
      }}
    >
      <DialogContent 
        className="sm:max-w-md" 
        showCloseButton={false}
      >
        <DialogHeader className="gap-2">
          <div className="mx-auto bg-primary/10 p-3 rounded-full mb-2">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">Kivona'ya Hoş Geldin!</DialogTitle>
          <DialogDescription className="text-center">
            Yapay zekamız GitHub profilindeki yeteneklerini harika analiz etti ama... sen kimsin? 😅 (İsmini gizli tutmayı seviyorsun anlaşılan 🥷). Mükemmel takımı kurarken sana sadece 'hey sen' diye seslenmemeleri için bize adını söyler misin?
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="flex flex-col gap-2">
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                id="name"
                placeholder="Örn: Burak Koçaş"
                className="pl-10 h-12"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          
          <DialogFooter className="sm:justify-center">
            <Button type="submit" disabled={!fullName.trim() || isLoading} className="w-full h-12 text-md">
              {isLoading ? "Kaydediliyor..." : "Kaydet ve Başla"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
