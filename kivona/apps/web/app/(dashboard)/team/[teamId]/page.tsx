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
    .select("status, invite_message")
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
    return (
      <PendingInvite
        team={team}
        currentUserId={user.id}
        inviteMessage={membership.invite_message}
      />
    )
  }

  const [{ data: memberRows }, { data: ideas }, { data: icebreakers }, { data: messages }] =
    await Promise.all([
      supabase
        .from("team_members")
        .select("user_id, status, profiles(id, full_name, avatar_url)")
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
