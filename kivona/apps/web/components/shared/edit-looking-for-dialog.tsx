"use client"

import { useState, type FormEvent } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil } from "lucide-react"

export function EditLookingForDialog({
  userId,
  currentRoles,
}: {
  userId: string
  currentRoles: string[]
}) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(currentRoles.join(", "))
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const supabase = createClient()

    const roles = value
      .split(",")
      .map((role) => role.trim())
      .filter(Boolean)

    const { error } = await supabase
      .from("profiles")
      .update({ looking_for: roles })
      .eq("id", userId)

    setIsLoading(false)

    if (error) {
      console.warn("Aradığım roller güncellenemedi (İzin hatası olabilir):", error)
    }

    setOpen(false)
    window.location.reload()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <Pencil className="size-3.5" />
        <span className="sr-only">Aradığım Rolleri Düzenle</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Aradığım Roller</DialogTitle>
          <DialogDescription>Rolleri virgülle ayırarak yaz.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <Input
            placeholder="ör. Backend Geliştirici, Veri Bilimci"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
          />
          <DialogFooter className="sm:justify-end gap-2">
            <DialogClose render={<Button type="button" variant="outline" disabled={isLoading} />}>
              İptal
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
