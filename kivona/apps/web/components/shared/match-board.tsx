"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Users, Sparkles, UserPlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
}: {
  mySkills: string[]
  profiles: DemoProfile[]
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
                        <div className="mt-4 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 flex flex-col items-center text-center gap-3">
                          <div className="rounded-full bg-primary/10 p-2">
                            <UserPlus className="size-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-foreground">Takıma Davet Et</h4>
                            <p className="text-xs text-muted-foreground mt-1 max-w-[250px]">
                              Bu özellik çok yakında aktif olacak. Şimdilik mükemmel eşleşmelerinizi inceleyebilirsiniz.
                            </p>
                          </div>
                          <Button variant="default" className="w-full mt-1 opacity-50 cursor-not-allowed">
                            Yakında
                          </Button>
                        </div>
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

