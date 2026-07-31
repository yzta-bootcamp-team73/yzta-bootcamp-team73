import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { TeamWorkspace } from "@/components/shared/team-workspace"
import { PendingInvite } from "@/components/shared/pending-invite"
import type {
  Idea,
  IcebreakerResponse,
  TeamMemberProfile,
  TeamMessage,
  MembershipStatus,
} from "@/types/team"

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ teamId: string }>
}) {
  const { teamId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: membership } = await supabase
    .from("team_members")
    .select("status, invite_message, invited_by")
    .eq("team_id", teamId)
    .eq("user_id", user.id)
    .maybeSingle()

  if (!membership) {
    notFound()
  }

  const { data: team } = await supabase
    .from("teams")
    .select("id, name, description, max_members, created_by")
    .eq("id", teamId)
    .single()

  if (!team) {
    notFound()
  }

  if (membership.status === "pending") {
    const inviter = membership.invited_by
      ? (
          await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", membership.invited_by)
            .maybeSingle()
        ).data
      : null

    return (
      <PendingInvite
        team={team}
        currentUserId={user.id}
        inviteMessage={membership.invite_message}
        inviterName={inviter?.full_name ?? null}
      />
    )
  }

  const [
    { data: memberRows, error: memberError },
    { data: ideas },
    { data: icebreakers },
    { data: messages },
  ] = await Promise.all([
      // team_members'ta profiles'a iki farkli foreign key var (user_id ve invited_by),
      // bu yuzden hangi kolon uzerinden embed yapilacagini acikca belirtmek gerekiyor
      // -- yoksa PostgREST "more than one relationship was found" hatasi verip
      // sorguyu tamamen basarisiz kiliyor (uye listesi sessizce bos donuyor).
      supabase
        .from("team_members")
        .select("user_id, status, profiles!user_id(id, full_name, avatar_url)")
        .eq("team_id", teamId),
      supabase
        .from("ideas")
        .select("id, team_id, author_id, title, content, status, votes, voted_by")
        .eq("team_id", teamId),
      supabase
        .from("icebreaker_responses")
        .select("id, team_id, user_id, question, answer")
        .eq("team_id", teamId),
      supabase
        .from("messages")
        .select("id, team_id, user_id, content, file_path, file_name, created_at")
        .eq("team_id", teamId)
        .order("created_at", { ascending: true })
        .limit(100),
    ])

  if (memberError) {
    console.error("Takım üyeleri çekilemedi:", memberError)
  }

  const members: TeamMemberProfile[] = (memberRows ?? [])
    .map((row): TeamMemberProfile | null => {
      const { profiles, status } = row as unknown as {
        profiles: TeamMemberProfile | null
        status: MembershipStatus
      }
      return profiles ? { ...profiles, status } : null
    })
    .filter((profile): profile is TeamMemberProfile => Boolean(profile))

  return (
    <TeamWorkspace
      team={team}
      initialMembers={members}
      currentUserId={user.id}
      initialIdeas={(ideas as Idea[] | null) ?? []}
      initialIcebreakers={(icebreakers as IcebreakerResponse[] | null) ?? []}
      initialMessages={(messages as TeamMessage[] | null) ?? []}
    />
  )
}
