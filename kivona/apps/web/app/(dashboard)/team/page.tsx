import { createClient } from "@/lib/supabase/server"
import { CreateOrJoinTeam } from "@/components/shared/create-or-join-team"
import { TeamWorkspace } from "@/components/shared/team-workspace"
import type { Idea, IcebreakerResponse, TeamMemberProfile, TeamMessage } from "@/types/team"

export default async function TeamPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: membership } = await supabase
    .from("team_members")
    .select("team_id")
    .eq("user_id", user.id)
    .maybeSingle()

  if (!membership) {
    const { data: openTeams } = await supabase
      .from("teams")
      .select("id, name, description, max_members")
      .limit(20)

    return <CreateOrJoinTeam userId={user.id} openTeams={openTeams ?? []} />
  }

  const { data: team } = await supabase
    .from("teams")
    .select("id, name, description, max_members, created_by")
    .eq("id", membership.team_id)
    .single()

  if (!team) {
    // Takım kaydı bulunamadı (silinmiş olabilir) — güvenli düşüş
    return <CreateOrJoinTeam userId={user.id} openTeams={[]} />
  }

  const [{ data: memberRows }, { data: ideas }, { data: icebreakers }, { data: messages }] =
    await Promise.all([
      supabase
        .from("team_members")
        .select("user_id, profiles(id, full_name, avatar_url)")
        .eq("team_id", membership.team_id),
      supabase
        .from("ideas")
        .select("id, team_id, author_id, title, content, status, votes")
        .eq("team_id", membership.team_id),
      supabase
        .from("icebreaker_responses")
        .select("id, team_id, user_id, question, answer")
        .eq("team_id", membership.team_id),
      supabase
        .from("messages")
        .select("id, team_id, user_id, content, file_path, file_name, created_at")
        .eq("team_id", membership.team_id)
        .order("created_at", { ascending: true })
        .limit(100),
    ])

  const members: TeamMemberProfile[] = (memberRows ?? [])
    .map((row) => (row as unknown as { profiles: TeamMemberProfile | null }).profiles)
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
