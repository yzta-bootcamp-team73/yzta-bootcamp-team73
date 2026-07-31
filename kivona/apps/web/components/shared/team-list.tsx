"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Users, Plus, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import type { JoinableTeam, MembershipStatus } from "@/types/team"

export interface MyTeam extends JoinableTeam {
  status: MembershipStatus
}

export function TeamList({
  userId,
  myTeams,
  openTeams,
}: {
  userId: string
  myTeams: MyTeam[]
  openTeams: JoinableTeam[]
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setIsLoading(true)
    setError(null)
    const supabase = createClient()

    const { data: team, error: teamError } = await supabase
      .from("teams")
      .insert({ name: name.trim(), description: description.trim() || null, created_by: userId })
      .select()
      .single()

    if (teamError || !team) {
      setError(teamError?.message ?? "Takım oluşturulamadı")
      setIsLoading(false)
      return
    }

    const { error: memberError } = await supabase
      .from("team_members")
      .insert({ team_id: team.id, user_id: userId, role: "kurucu" })

    if (memberError) {
      setError(memberError.message)
      setIsLoading(false)
      return
    }

    setOpen(false)
    router.push(`/team/${team.id}`)
  }

  async function handleJoin(teamId: string) {
    setIsLoading(true)
    setError(null)
    const supabase = createClient()
    const { error: joinError } = await supabase
      .from("team_members")
      .insert({ team_id: teamId, user_id: userId })

    if (joinError) {
      setError(joinError.message)
      setIsLoading(false)
      return
    }
    router.push(`/team/${teamId}`)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Takımlarım</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Üye olduğun takımları gör, yeni bir takım kur ya da açık bir takıma katıl. Artık
            birden fazla takımda birden olabilirsin.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="gap-2 shrink-0" />}>
            <Plus className="size-4" />
            Takım Kur
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Yeni Takım Kur</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="mt-2 space-y-4">
              <Input
                placeholder="Takım adı"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <Input
                placeholder="Kısa açıklama (opsiyonel)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <DialogFooter>
                <Button type="submit" disabled={!name.trim() || isLoading} className="w-full">
                  {isLoading ? "Oluşturuluyor..." : "Takımı Oluştur"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {myTeams.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Üye Olduğun Takımlar</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {myTeams.map((team) => (
              <Card key={team.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-2">
                    <span className="truncate">{team.name}</span>
                    {team.status === "pending" && (
                      <Badge variant="outline" className="shrink-0 text-xs">
                        Davet Bekliyor
                      </Badge>
                    )}
                  </CardTitle>
                  {team.description && <CardDescription>{team.description}</CardDescription>}
                </CardHeader>
                <CardFooter>
                  <Button
                    variant={team.status === "pending" ? "default" : "outline"}
                    size="sm"
                    className="w-full gap-1.5"
                    nativeButton={false}
                    render={<Link href={`/team/${team.id}`} />}
                  >
                    {team.status === "pending" ? "Daveti Görüntüle" : "Çalışma Alanına Git"}
                    <ArrowRight className="size-3.5" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Katılabileceğin Takımlar</h2>
        {openTeams.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {openTeams.map((team) => (
              <Card key={team.id}>
                <CardHeader>
                  <CardTitle>{team.name}</CardTitle>
                  {team.description && <CardDescription>{team.description}</CardDescription>}
                </CardHeader>
                <CardFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    disabled={isLoading}
                    onClick={() => handleJoin(team.id)}
                  >
                    Takıma Katıl
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
            <Users className="size-8 text-muted-foreground/50" />
            <p className="text-muted-foreground">Katılabileceğin başka bir takım yok.</p>
          </div>
        )}
      </div>
    </div>
  )
}
