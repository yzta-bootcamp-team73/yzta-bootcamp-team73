"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Users, Check, X, MessageSquareQuote } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import type { Team } from "@/types/team"

export function PendingInvite({
  team,
  currentUserId,
  inviteMessage,
  inviterName,
}: {
  team: Team
  currentUserId: string
  inviteMessage?: string | null
  inviterName?: string | null
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleAccept() {
    setIsLoading(true)
    const supabase = createClient()
    await supabase
      .from("team_members")
      .update({ status: "accepted" })
      .eq("team_id", team.id)
      .eq("user_id", currentUserId)
    router.refresh()
  }

  async function handleDecline() {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.from("team_members").delete().eq("team_id", team.id).eq("user_id", currentUserId)
    router.push("/team")
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-accent">
        <Users className="size-8 text-primary" />
      </div>
      <Card className="w-full max-w-sm text-left">
        <CardHeader>
          <CardTitle>{team.name}</CardTitle>
          {team.description && <CardDescription>{team.description}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {inviterName
              ? `${inviterName} seni bu takıma davet etti. Katılmak ister misin?`
              : "Bu takıma davet edildin. Katılmak ister misin?"}
          </p>
          {inviteMessage && (
            <div className="flex gap-2 rounded-lg border border-border bg-muted/40 p-3">
              <MessageSquareQuote className="size-4 shrink-0 text-primary" />
              <p className="text-sm text-foreground italic">&quot;{inviteMessage}&quot;</p>
            </div>
          )}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 gap-1.5"
              onClick={handleDecline}
              disabled={isLoading}
            >
              <X className="size-4" />
              Reddet
            </Button>
            <Button className="flex-1 gap-1.5" onClick={handleAccept} disabled={isLoading}>
              <Check className="size-4" />
              Kabul Et
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
