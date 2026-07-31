"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { DndContext, useDraggable, useDroppable, type DragEndEvent } from "@dnd-kit/core"
import { Plus, ThumbsUp, Shuffle, UserPlus, LogOut, X, UserMinus, Crown } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { icebreakerQuestions } from "@/lib/data/icebreaker-questions"
import { TeamChat } from "@/components/shared/team-chat"
import type {
  Team,
  TeamMemberProfile,
  Idea,
  IdeaStatus,
  IcebreakerResponse,
  TeamMessage,
} from "@/types/team"

const columns: { status: IdeaStatus; label: string }[] = [
  { status: "todo", label: "Yapılacak" },
  { status: "doing", label: "Devam Ediyor" },
  { status: "done", label: "Tamamlandı" },
]

function IdeaCardDraggable({
  idea,
  currentUserId,
  onVote,
  onDelete,
}: {
  idea: Idea
  currentUserId: string
  onVote: (id: string) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: idea.id,
  })
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined
  const hasVoted = idea.voted_by.includes(currentUserId)

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`group cursor-grab space-y-2 rounded-lg border border-border bg-card p-3 shadow-sm active:cursor-grabbing ${
        isDragging ? "z-10 opacity-50" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-foreground">{idea.title}</p>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            onDelete(idea.id)
          }}
          className="shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
        >
          <X className="size-3.5" />
          <span className="sr-only">Fikri sil</span>
        </button>
      </div>
      {idea.content && (
        <p className="line-clamp-2 text-xs text-muted-foreground">{idea.content}</p>
      )}
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation()
          onVote(idea.id)
        }}
        className={`flex items-center gap-1 text-xs transition-colors ${
          hasVoted ? "font-medium text-primary" : "text-muted-foreground hover:text-primary"
        }`}
      >
        <ThumbsUp className={`size-3 ${hasVoted ? "fill-current" : ""}`} />
        {idea.votes}
      </button>
    </div>
  )
}

function Column({
  status,
  label,
  ideas,
  currentUserId,
  onVote,
  onDelete,
}: {
  status: IdeaStatus
  label: string
  ideas: Idea[]
  currentUserId: string
  onVote: (id: string) => void
  onDelete: (id: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-64 flex-col gap-3 rounded-xl border border-border bg-muted/30 p-3 transition-colors ${
        isOver ? "bg-accent/40" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{label}</h3>
        <Badge variant="secondary">{ideas.length}</Badge>
      </div>
      <div className="flex-1 space-y-2">
        {ideas.map((idea) => (
          <IdeaCardDraggable
            key={idea.id}
            idea={idea}
            currentUserId={currentUserId}
            onVote={onVote}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}

export function TeamWorkspace({
  team,
  initialMembers,
  currentUserId,
  initialIdeas,
  initialIcebreakers,
  initialMessages,
}: {
  team: Team
  initialMembers: TeamMemberProfile[]
  currentUserId: string
  initialIdeas: Idea[]
  initialIcebreakers: IcebreakerResponse[]
  initialMessages: TeamMessage[]
}) {
  const router = useRouter()
  const [members, setMembers] = useState(initialMembers)
  const [ideas, setIdeas] = useState(initialIdeas)
  const [icebreakers, setIcebreakers] = useState(initialIcebreakers)
  const [newIdeaTitle, setNewIdeaTitle] = useState("")
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState("")
  const [inviteUsername, setInviteUsername] = useState("")
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null)
  const [inviteLoading, setInviteLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("kanban")
  const [messages, setMessages] = useState(initialMessages)
  const [isUploading, setIsUploading] = useState(false)
  const [lastReadMessagesAt, setLastReadMessagesAt] = useState<Date | null>(null)
  const [isLeaving, setIsLeaving] = useState(false)

  const lastMessage = messages[messages.length - 1]
  const hasUnreadMessages =
    activeTab !== "messages" &&
    Boolean(lastMessage) &&
    (!lastReadMessagesAt || new Date(lastMessage.created_at) > lastReadMessagesAt)

  function handleTabChange(value: string) {
    setActiveTab(value)
    if (value === "messages") {
      setLastReadMessagesAt(new Date())
    }
  }

  // Takım kanalını dinleyip başkalarının gönderdiği mesajları anlık ekliyoruz.
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`messages:${team.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `team_id=eq.${team.id}` },
        (payload) => {
          setMessages((prev) =>
            prev.some((m) => m.id === (payload.new as TeamMessage).id)
              ? prev
              : [...prev, payload.new as TeamMessage]
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [team.id])

  function handleSendMessage(content: string) {
    const supabase = createClient()
    supabase
      .from("messages")
      .insert({ team_id: team.id, user_id: currentUserId, content })
      .select()
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          setMessages((prev) => (prev.some((m) => m.id === data.id) ? prev : [...prev, data as TeamMessage]))
        }
      })
  }

  async function handleUploadFile(file: File) {
    setIsUploading(true)
    const supabase = createClient()
    const path = `${team.id}/${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage.from("team-files").upload(path, file)
    if (!uploadError) {
      const { data, error } = await supabase
        .from("messages")
        .insert({ team_id: team.id, user_id: currentUserId, file_path: path, file_name: file.name })
        .select()
        .single()

      if (!error && data) {
        setMessages((prev) => (prev.some((m) => m.id === data.id) ? prev : [...prev, data as TeamMessage]))
      }
    }
    setIsUploading(false)
  }

  async function handleLeaveTeam() {
    setIsLeaving(true)
    const supabase = createClient()
    await supabase.from("team_members").delete().eq("team_id", team.id).eq("user_id", currentUserId)
    router.push("/team")
  }

  async function handleRemoveMember(memberId: string) {
    setMembers((prev) => prev.filter((member) => member.id !== memberId))
    const supabase = createClient()
    await supabase.from("team_members").delete().eq("team_id", team.id).eq("user_id", memberId)
  }

  async function handleInvite(e: FormEvent) {
    e.preventDefault()
    const username = inviteUsername.trim().replace(/^@/, "")
    if (!username) return

    setInviteLoading(true)
    setInviteError(null)
    setInviteSuccess(null)
    const supabase = createClient()

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .eq("github_username", username)
      .maybeSingle()

    if (profileError || !profile) {
      setInviteError("Bu GitHub kullanıcı adına sahip bir Kivona üyesi bulunamadı.")
      setInviteLoading(false)
      return
    }

    if (members.some((member) => member.id === profile.id)) {
      setInviteError("Bu kişiye zaten davet gönderilmiş ya da takımda.")
      setInviteLoading(false)
      return
    }

    const { error: insertError } = await supabase
      .from("team_members")
      .insert({
        team_id: team.id,
        user_id: profile.id,
        status: "pending",
        invited_by: currentUserId,
      })

    if (insertError) {
      setInviteError(
        insertError.code === "23505"
          ? "Bu kişiye zaten davet gönderilmiş."
          : `Eklenemedi: ${insertError.message}`
      )
      setInviteLoading(false)
      return
    }

    setMembers((prev) => [...prev, { ...(profile as TeamMemberProfile), status: "pending" }])
    setInviteUsername("")
    setInviteSuccess("Davet gönderildi, kabul etmesini bekliyoruz.")
    setInviteLoading(false)
  }

  async function handleAddIdea(e: FormEvent) {
    e.preventDefault()
    if (!newIdeaTitle.trim()) return

    const supabase = createClient()
    const { data, error } = await supabase
      .from("ideas")
      .insert({
        team_id: team.id,
        author_id: currentUserId,
        title: newIdeaTitle.trim(),
        status: "todo",
      })
      .select()
      .single()

    if (!error && data) {
      setIdeas((prev) => [...prev, data as Idea])
      setNewIdeaTitle("")
    }
  }

  async function handleVote(ideaId: string) {
    const idea = ideas.find((i) => i.id === ideaId)
    if (!idea) return

    const hasVoted = idea.voted_by.includes(currentUserId)
    const nextVotedBy = hasVoted
      ? idea.voted_by.filter((id) => id !== currentUserId)
      : [...idea.voted_by, currentUserId]
    const nextVotes = nextVotedBy.length

    setIdeas((prev) =>
      prev.map((i) => (i.id === ideaId ? { ...i, votes: nextVotes, voted_by: nextVotedBy } : i))
    )

    const supabase = createClient()
    await supabase
      .from("ideas")
      .update({ votes: nextVotes, voted_by: nextVotedBy })
      .eq("id", ideaId)
  }

  async function handleDeleteIdea(ideaId: string) {
    setIdeas((prev) => prev.filter((i) => i.id !== ideaId))

    const supabase = createClient()
    await supabase.from("ideas").delete().eq("id", ideaId)
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return
    const newStatus = over.id as IdeaStatus

    setIdeas((prev) =>
      prev.map((idea) => (idea.id === active.id ? { ...idea, status: newStatus } : idea))
    )

    const supabase = createClient()
    await supabase.from("ideas").update({ status: newStatus }).eq("id", active.id)
  }

  async function handleAnswerSubmit(e: FormEvent) {
    e.preventDefault()
    if (!answer.trim()) return
    const question = icebreakerQuestions[questionIndex]

    const supabase = createClient()
    const { data, error } = await supabase
      .from("icebreaker_responses")
      .insert({ team_id: team.id, user_id: currentUserId, question, answer: answer.trim() })
      .select()
      .single()

    if (!error && data) {
      setIcebreakers((prev) => [...prev, data as IcebreakerResponse])
      setAnswer("")
      setQuestionIndex((prev) => (prev + 1) % icebreakerQuestions.length)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      <div className="space-y-6 lg:col-span-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{team.name}</h1>
          {team.description && (
            <p className="mt-1 text-sm text-muted-foreground">{team.description}</p>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="kanban">Fikir Panosu</TabsTrigger>
            <TabsTrigger value="icebreaker">Buz Kırıcı</TabsTrigger>
            <TabsTrigger value="messages" className="relative">
              Mesajlar
              {hasUnreadMessages && (
                <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-destructive" />
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kanban" className="mt-6 space-y-4">
            <form onSubmit={handleAddIdea} className="flex gap-2">
              <Input
                placeholder="Yeni fikir ekle..."
                value={newIdeaTitle}
                onChange={(e) => setNewIdeaTitle(e.target.value)}
              />
              <Button type="submit" disabled={!newIdeaTitle.trim()} className="shrink-0 gap-1.5">
                <Plus className="size-4" />
                Ekle
              </Button>
            </form>

            <DndContext id="team-kanban" onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {columns.map((col) => (
                  <Column
                    key={col.status}
                    status={col.status}
                    label={col.label}
                    ideas={ideas.filter((idea) => idea.status === col.status)}
                    currentUserId={currentUserId}
                    onVote={handleVote}
                    onDelete={handleDeleteIdea}
                  />
                ))}
              </div>
            </DndContext>
          </TabsContent>

          <TabsContent value="icebreaker" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  Buz Kırıcı Soru
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    type="button"
                    onClick={() =>
                      setQuestionIndex((prev) => (prev + 1) % icebreakerQuestions.length)
                    }
                  >
                    <Shuffle className="size-4" />
                    <span className="sr-only">Başka soru göster</span>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-foreground">{icebreakerQuestions[questionIndex]}</p>
                <form onSubmit={handleAnswerSubmit} className="flex gap-2">
                  <Input
                    placeholder="Cevabını yaz..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                  <Button type="submit" disabled={!answer.trim()} className="shrink-0">
                    Gönder
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {icebreakers.map((response) => (
                <Card key={response.id}>
                  <CardContent className="space-y-1 pt-6">
                    <p className="text-xs font-medium text-muted-foreground">
                      {response.question}
                    </p>
                    <p className="text-sm text-foreground">{response.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <TeamChat
              currentUserId={currentUserId}
              members={members}
              messages={messages}
              onSend={handleSendMessage}
              onUploadFile={handleUploadFile}
              isUploading={isUploading}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Üyeler paneli */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">
          Takım Üyeleri ({members.length}/{team.max_members})
        </h2>
        <div className="space-y-2">
          {members.map((member) => {
            const isLeader = member.id === team.created_by
            const canRemove = currentUserId === team.created_by && !isLeader
            return (
              <div
                key={member.id}
                className="flex items-center gap-3 rounded-lg border border-border p-2"
              >
                <Avatar size="sm">
                  <AvatarFallback>
                    {(member.full_name ?? "?").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="flex-1 truncate text-sm text-foreground">
                  {member.full_name ?? "İsimsiz"}
                </span>
                {isLeader && (
                  <Badge variant="outline" className="gap-1 text-xs">
                    <Crown className="size-3" />
                    Takım Lideri
                  </Badge>
                )}
                {member.status === "pending" && (
                  <Badge variant="outline" className="text-xs">
                    Bekliyor
                  </Badge>
                )}
                {canRemove && (
                  <Dialog>
                    <DialogTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="shrink-0 text-muted-foreground hover:text-destructive"
                        />
                      }
                    >
                      <UserMinus className="size-3.5" />
                      <span className="sr-only">Üyeyi Çıkar</span>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                      <DialogHeader>
                        <DialogTitle>
                          {member.full_name ?? "Bu kişiyi"} takımdan çıkarılsın mı?
                        </DialogTitle>
                        <DialogDescription>
                          Bu işlem geri alınamaz, kişi tekrar davet edilene kadar takıma erişemez.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="sm:justify-end gap-2">
                        <DialogClose render={<Button variant="outline" />}>Vazgeç</DialogClose>
                        <DialogClose
                          render={
                            <Button
                              variant="destructive"
                              onClick={() => handleRemoveMember(member.id)}
                            />
                          }
                        >
                          Evet, Çıkar
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            )
          })}
        </div>

        {members.length < team.max_members && (
          <form onSubmit={handleInvite} className="space-y-2 border-t border-border pt-3">
            <label className="text-xs font-medium text-muted-foreground">
              GitHub kullanıcı adıyla davet et
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="ör. octocat"
                value={inviteUsername}
                onChange={(e) => setInviteUsername(e.target.value)}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!inviteUsername.trim() || inviteLoading}
                className="shrink-0"
              >
                <UserPlus className="size-4" />
                <span className="sr-only">Davet Et</span>
              </Button>
            </div>
            {inviteError && <p className="text-xs text-destructive">{inviteError}</p>}
            {inviteSuccess && <p className="text-xs text-emerald-600 dark:text-emerald-400">{inviteSuccess}</p>}
          </form>
        )}

        <Dialog>
          <DialogTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-1.5 text-destructive hover:text-destructive"
              />
            }
          >
            <LogOut className="size-3.5" />
            Takımdan Ayrıl
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Takımdan ayrılmak istediğine emin misin?</DialogTitle>
              <DialogDescription>
                &quot;{team.name}&quot; takımından ayrılırsın, tekrar katılmak için davet edilmen ya
                da yeniden katılman gerekir.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-end gap-2">
              <DialogClose render={<Button variant="outline" disabled={isLeaving} />}>
                Vazgeç
              </DialogClose>
              <Button variant="destructive" onClick={handleLeaveTeam} disabled={isLeaving}>
                {isLeaving ? "Ayrılınıyor..." : "Evet, Ayrıl"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
