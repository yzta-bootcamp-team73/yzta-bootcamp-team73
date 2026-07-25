"use client"

import { useState, type FormEvent } from "react"
import { DndContext, useDraggable, useDroppable, type DragEndEvent } from "@dnd-kit/core"
import { Plus, ThumbsUp, Shuffle, UserPlus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { icebreakerQuestions } from "@/lib/data/icebreaker-questions"
import type {
  Team,
  TeamMemberProfile,
  Idea,
  IdeaStatus,
  IcebreakerResponse,
} from "@/types/team"

const columns: { status: IdeaStatus; label: string }[] = [
  { status: "todo", label: "Yapılacak" },
  { status: "doing", label: "Devam Ediyor" },
  { status: "done", label: "Tamamlandı" },
]

function IdeaCardDraggable({
  idea,
  onVote,
}: {
  idea: Idea
  onVote: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: idea.id,
  })
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-grab space-y-2 rounded-lg border border-border bg-card p-3 shadow-sm active:cursor-grabbing ${
        isDragging ? "z-10 opacity-50" : ""
      }`}
    >
      <p className="text-sm font-medium text-foreground">{idea.title}</p>
      {idea.content && (
        <p className="line-clamp-2 text-xs text-muted-foreground">{idea.content}</p>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onVote(idea.id)
        }}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
      >
        <ThumbsUp className="size-3" />
        {idea.votes}
      </button>
    </div>
  )
}

function Column({
  status,
  label,
  ideas,
  onVote,
}: {
  status: IdeaStatus
  label: string
  ideas: Idea[]
  onVote: (id: string) => void
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
          <IdeaCardDraggable key={idea.id} idea={idea} onVote={onVote} />
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
}: {
  team: Team
  initialMembers: TeamMemberProfile[]
  currentUserId: string
  initialIdeas: Idea[]
  initialIcebreakers: IcebreakerResponse[]
}) {
  const [members, setMembers] = useState(initialMembers)
  const [ideas, setIdeas] = useState(initialIdeas)
  const [icebreakers, setIcebreakers] = useState(initialIcebreakers)
  const [newIdeaTitle, setNewIdeaTitle] = useState("")
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState("")
  const [inviteUsername, setInviteUsername] = useState("")
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [inviteLoading, setInviteLoading] = useState(false)

  async function handleInvite(e: FormEvent) {
    e.preventDefault()
    const username = inviteUsername.trim().replace(/^@/, "")
    if (!username) return

    setInviteLoading(true)
    setInviteError(null)
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
      setInviteError("Bu kişi zaten takımda.")
      setInviteLoading(false)
      return
    }

    const { error: insertError } = await supabase
      .from("team_members")
      .insert({ team_id: team.id, user_id: profile.id })

    if (insertError) {
      setInviteError(
        insertError.code === "23505"
          ? "Bu kişi zaten başka bir takımda."
          : `Eklenemedi: ${insertError.message}`
      )
      setInviteLoading(false)
      return
    }

    setMembers((prev) => [...prev, profile as TeamMemberProfile])
    setInviteUsername("")
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
    const nextVotes = idea.votes + 1
    setIdeas((prev) => prev.map((i) => (i.id === ideaId ? { ...i, votes: nextVotes } : i)))

    const supabase = createClient()
    await supabase.from("ideas").update({ votes: nextVotes }).eq("id", ideaId)
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

        <Tabs defaultValue="kanban">
          <TabsList>
            <TabsTrigger value="kanban">Fikir Panosu</TabsTrigger>
            <TabsTrigger value="icebreaker">Buz Kırıcı</TabsTrigger>
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

            <DndContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {columns.map((col) => (
                  <Column
                    key={col.status}
                    status={col.status}
                    label={col.label}
                    ideas={ideas.filter((idea) => idea.status === col.status)}
                    onVote={handleVote}
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
        </Tabs>
      </div>

      {/* Üyeler paneli */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">
          Takım Üyeleri ({members.length}/{team.max_members})
        </h2>
        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 rounded-lg border border-border p-2"
            >
              <Avatar size="sm">
                <AvatarFallback>
                  {(member.full_name ?? "?").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="truncate text-sm text-foreground">
                {member.full_name ?? "İsimsiz"}
              </span>
            </div>
          ))}
        </div>

        {members.length < team.max_members && (
          <form onSubmit={handleInvite} className="space-y-2 border-t border-border pt-3">
            <label className="text-xs font-medium text-muted-foreground">
              GitHub kullanıcı adıyla üye ekle
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
                <span className="sr-only">Ekle</span>
              </Button>
            </div>
            {inviteError && <p className="text-xs text-destructive">{inviteError}</p>}
          </form>
        )}
      </div>
    </div>
  )
}
