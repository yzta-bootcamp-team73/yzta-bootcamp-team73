"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Users, Sparkles } from "lucide-react"
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

const roleTabs = [
  { value: "all", label: "Tümü" },
  { value: "developer", label: "Geliştirici" },
  { value: "designer", label: "Tasarımcı" },
  { value: "data_scientist", label: "Veri Bilimci" },
  { value: "pm", label: "Proje Yöneticisi" },
] as const

function initialsOf(fullName: string) {
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
                    <Card>
                      <CardHeader className="flex-row items-center gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-primary">
                          {initialsOf(profile.fullName)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="truncate text-base">
                            {profile.fullName}
                          </CardTitle>
                          <CardDescription>{roleLabels[profile.role]}</CardDescription>
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
                      <CardContent className="space-y-3">
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {profile.bio}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {profile.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="outline" size="sm" className="w-full gap-2" disabled>
                          <Sparkles className="size-3.5" />
                          Takıma Davet Et (Yakında)
                        </Button>
                      </CardContent>
                    </Card>
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
