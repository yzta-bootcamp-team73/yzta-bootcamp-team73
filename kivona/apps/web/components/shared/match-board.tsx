"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Users, Sparkles, UserPlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type DemoProfile, roleLabels } from "@/lib/data/profiles"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"

interface InviteTeam {
  id: string
  name: string
}

function InviteSection({ profile, myTeams }: { profile: DemoProfile; myTeams: InviteTeam[] }) {
  const [teamId, setTeamId] = useState(myTeams[0]?.id ?? "")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  )

  if (profile.isDemo) {
    return (
      <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/40 p-4 text-center">
        <p className="text-xs text-muted-foreground">
          Bu demo bir profil, gerçek bir hesaba bağlı değil — davet gönderilemez.
        </p>
      </div>
    )
  }

  if (myTeams.length === 0) {
    return (
      <div className="mt-4 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Davet gönderebilmek için önce üye olduğun bir takım olması lazım.
        </p>
      </div>
    )
  }

  async function handleInvite() {
    if (!teamId) return
    setIsLoading(true)
    setFeedback(null)
    const supabase = createClient()

    const { error } = await supabase.from("team_members").insert({
      team_id: teamId,
      user_id: profile.id,
      status: "pending",
      invite_message: message.trim() || null,
    })

    if (error) {
      setFeedback({
        type: "error",
        text:
          error.code === "23505"
            ? "Bu kişiye bu takımdan zaten davet gönderilmiş."
            : `Gönderilemedi: ${error.message}`,
      })
      setIsLoading(false)
      return
    }

    setFeedback({ type: "success", text: "Davet gönderildi!" })
    setIsLoading(false)
  }

  return (
    <div className="mt-4 space-y-3 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4">
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-primary/10 p-2">
          <UserPlus className="size-4 text-primary" />
        </div>
        <h4 className="text-sm font-semibold text-foreground">Takıma Davet Et</h4>
      </div>

      {myTeams.length > 1 && (
        <select
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
        >
          {myTeams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      )}

      <Input
        placeholder="Davetle birlikte kısa bir mesaj yaz (opsiyonel)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <Button className="w-full" onClick={handleInvite} disabled={isLoading || !teamId}>
        {isLoading ? "Gönderiliyor..." : "Davet Gönder"}
      </Button>

      {feedback && (
        <p
          className={`text-xs ${
            feedback.type === "error"
              ? "text-destructive"
              : "text-emerald-600 dark:text-emerald-400"
          }`}
        >
          {feedback.text}
        </p>
      )}
    </div>
  )
}

const roleTabs = [
  { value: "all", label: "Tümü" },
  { value: "developer", label: "Geliştirici" },
  { value: "designer", label: "Tasarımcı" },
  { value: "data_scientist", label: "Veri Bilimci" },
  { value: "pm", label: "Proje Yöneticisi" },
] as const

function initialsOf(fullName: string) {
  if (!fullName) return "K"
  return fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function MatchBoard({
  mySkills,
  profiles,
  myTeams,
}: {
  mySkills: string[]
  profiles: DemoProfile[]
  myTeams: InviteTeam[]
}) {
  const [activeRole, setActiveRole] = useState<string>("all")

  const filtered =
    activeRole === "all" ? profiles : profiles.filter((profile) => profile.role === activeRole)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Akıllı Eşleştirme</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Rolüne göre filtrele, yapay zeka (ML) destekli uyum oranını gör.
        </p>
        {mySkills.length === 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            Uyum oranını görebilmek için GitHub hesabınızda herkese açık dil bilgisi
            olan repo bulunması gerekir.
          </p>
        )}
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveRole}>
        <TabsList>
          {roleTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeRole} className="mt-6">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((profile, i) => {
                const compatibility = profile.matchScore || 0
                return (
                  <motion.div
                    key={profile.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.04, ease: "easeOut" }}
                  >
                    <Dialog>
                      <DialogTrigger nativeButton={false} render={<Card className="cursor-pointer hover:border-primary/50 transition-colors h-[280px] flex flex-col text-left" />}>
                        <CardHeader className="flex-row items-center gap-3">
                          <Avatar className="size-12 border">
                            {profile.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />}
                            <AvatarFallback className="bg-accent text-primary font-semibold">
                              {initialsOf(profile.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="truncate text-base">
                              {profile.fullName}
                            </CardTitle>
                            <CardDescription>{roleLabels[profile.role as keyof typeof roleLabels] || profile.role}</CardDescription>
                          </div>
                          {mySkills.length > 0 && (
                            <Badge
                              className={
                                compatibility >= 30
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                  : "bg-accent/60 text-primary"
                              }
                            >
                              %{compatibility} Uyum
                            </Badge>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-3 flex-1 flex flex-col justify-between overflow-hidden">
                          <div className="space-y-3">
                            <p className="line-clamp-2 text-sm text-muted-foreground">
                              {profile.bio}
                            </p>
                            <div className="flex flex-wrap gap-1.5 h-[60px] overflow-hidden">
                              {profile.skills.slice(0, 4).map((skill) => (
                                <Badge key={skill} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                              {profile.skills.length > 4 && (
                                <Badge variant="outline">+{profile.skills.length - 4}</Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-primary/80 pt-2 text-center font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            Detayları görmek için tıkla
                          </p>
                        </CardContent>
                      </DialogTrigger>
                      
                      {/* Expanded Modal Content */}
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <div className="flex items-center gap-4">
                            <Avatar className="size-16 border-2 border-primary/20">
                              {profile.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />}
                              <AvatarFallback className="bg-accent text-primary font-semibold text-lg">
                                {initialsOf(profile.fullName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <DialogTitle className="text-xl">{profile.fullName}</DialogTitle>
                              <p className="text-sm font-medium text-muted-foreground">
                                {roleLabels[profile.role as keyof typeof roleLabels] || profile.role}
                              </p>
                            </div>
                            {mySkills.length > 0 && (
                              <Badge
                                className={`ml-auto text-sm py-1 px-3 ${
                                  compatibility >= 30
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                    : "bg-accent/60 text-primary"
                                }`}
                              >
                                %{compatibility} Uyum
                              </Badge>
                            )}
                          </div>
                        </DialogHeader>
                        
                        <div className="space-y-6 py-4">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-foreground">Hakkında</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {profile.bio}
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                              <Sparkles className="size-4 text-primary" />
                              Yetenekler & Teknolojiler
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {profile.skills.length > 0 ? (
                                profile.skills.map((skill) => (
                                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                                    {skill}
                                  </Badge>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground">Belirtilmedi</p>
                              )}
                            </div>
                          </div>

                          {profile.lookingFor && profile.lookingFor.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold text-foreground">Aradığı Roller</h4>
                              <div className="flex flex-wrap gap-2">
                                {profile.lookingFor.map((role) => (
                                  <Badge key={role} variant="outline" className="px-3 py-1">
                                    {role}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Invite CTA Area */}
                        <InviteSection profile={profile} myTeams={myTeams} />
                      </DialogContent>
                    </Dialog>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <Users className="size-8 text-muted-foreground/50" />
              <p className="text-muted-foreground">Bu rolde henüz kimse yok.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

