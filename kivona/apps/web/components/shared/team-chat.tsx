"use client"

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react"
import { Paperclip, Send, FileText } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { TeamMessage, TeamMemberProfile } from "@/types/team"

const FILE_BUCKET = "team-files"

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
}

export function TeamChat({
  currentUserId,
  members,
  messages,
  onSend,
  onUploadFile,
  isUploading,
}: {
  currentUserId: string
  members: TeamMemberProfile[]
  messages: TeamMessage[]
  onSend: (content: string) => void
  onUploadFile: (file: File) => void
  isUploading: boolean
}) {
  const [text, setText] = useState("")
  const [fileUrls, setFileUrls] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const memberMap = new Map(members.map((member) => [member.id, member]))

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Bucket private olduğu için dosya eki olan mesajlara imzalı (geçici) URL üretiyoruz.
  useEffect(() => {
    const pending = messages.filter(
      (m): m is TeamMessage & { file_path: string } => Boolean(m.file_path) && !fileUrls[m.file_path!]
    )
    if (pending.length === 0) return

    const supabase = createClient()
    Promise.all(
      pending.map(async (m) => {
        const { data } = await supabase.storage.from(FILE_BUCKET).createSignedUrl(m.file_path, 3600)
        return [m.file_path, data?.signedUrl ?? ""] as const
      })
    ).then((entries) => {
      setFileUrls((prev) => ({ ...prev, ...Object.fromEntries(entries) }))
    })
  }, [messages, fileUrls])

  function handleSend(e: FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    onSend(text.trim())
    setText("")
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    onUploadFile(file)
    e.target.value = ""
  }

  return (
    <div className="flex h-[32rem] flex-col rounded-xl border border-border">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Henüz mesaj yok. İlk mesajı sen gönder.
          </p>
        )}
        {messages.map((message) => {
          const author = memberMap.get(message.user_id)
          const isMe = message.user_id === currentUserId
          return (
            <div key={message.id} className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
              <Avatar size="sm" className="mt-4 shrink-0">
                <AvatarFallback>
                  {(author?.full_name ?? "?").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className={`flex max-w-[75%] flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{author?.full_name ?? "İsimsiz"}</span>
                  <span>{formatTime(message.created_at)}</span>
                </div>
                {message.content && (
                  <div
                    className={`rounded-lg px-3 py-2 text-sm ${
                      isMe ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}
                  >
                    {message.content}
                  </div>
                )}
                {message.file_path && (
                  <a
                    href={fileUrls[message.file_path] || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex max-w-full items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    <FileText className="size-4 shrink-0" />
                    <span className="truncate">{message.file_name}</span>
                  </a>
                )}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-border p-3">
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="size-4" />
          <span className="sr-only">Dosya ekle</span>
        </Button>
        <Input
          placeholder={isUploading ? "Dosya yükleniyor..." : "Mesaj yaz..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isUploading}
        />
        <Button type="submit" size="icon" disabled={!text.trim() || isUploading}>
          <Send className="size-4" />
          <span className="sr-only">Gönder</span>
        </Button>
      </form>
    </div>
  )
}
