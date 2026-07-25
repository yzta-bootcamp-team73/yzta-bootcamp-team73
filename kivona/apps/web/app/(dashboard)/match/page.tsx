import { createClient } from "@/lib/supabase/server"
import { fetchGithubRepos, computeLanguageStats } from "@/lib/github/client"
import { demoProfiles } from "@/lib/data/profiles"
import { MatchBoard } from "@/components/shared/match-board"

export default async function MatchPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const repos = user?.user_metadata?.user_name
    ? await fetchGithubRepos(user.user_metadata.user_name)
    : []
  const mySkills = computeLanguageStats(repos).map((stat) => stat.language)

  return <MatchBoard mySkills={mySkills} profiles={demoProfiles} />
}
