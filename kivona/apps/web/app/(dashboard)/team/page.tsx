import { createClient } from "@/lib/supabase/server"
import { TeamList, type MyTeam } from "@/components/shared/team-list"
import type { MembershipStatus } from "@/types/team"

export default async function TeamListPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const [{ data: memberships }, { data: allTeams }] = await Promise.all([
    supabase
      .from("team_members")
      .select("status, teams(id, name, description, max_members)")
      .eq("user_id", user.id),
    supabase.from("teams").select("id, name, description, max_members").limit(50),
  ])

  const myTeams: MyTeam[] = (memberships ?? [])
    .map((row): MyTeam | null => {
      const { teams, status } = row as unknown as {
        teams: MyTeam | null
        status: MembershipStatus
      }
      return teams ? { ...teams, status } : null
    })
    .filter((team): team is MyTeam => Boolean(team))

  const myTeamIds = new Set(myTeams.map((team) => team.id))
  const openTeams = (allTeams ?? []).filter((team) => !myTeamIds.has(team.id))

  return <TeamList userId={user.id} myTeams={myTeams} openTeams={openTeams} />
}
