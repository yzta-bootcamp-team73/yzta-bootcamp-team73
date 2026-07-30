import { createClient } from "@/lib/supabase/server"
import { fetchGithubRepos, computeLanguageStats } from "@/lib/github/client"
import { demoProfiles } from "@/lib/data/profiles"
import { MatchBoard } from "@/components/shared/match-board"
import { fetchMatchScore } from "@/lib/ai/matcher"

export default async function MatchPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const repos = user?.user_metadata?.user_name
    ? await fetchGithubRepos(user.user_metadata.user_name)
    : []
  const mySkills = computeLanguageStats(repos).map((stat) => stat.language)

  // Fetch ML match scores for all profiles
  const profilesWithScores = await Promise.all(
    demoProfiles.map(async (profile) => {
      const matchScore = await fetchMatchScore(mySkills, profile.skills)
      return { ...profile, matchScore }
    })
  )

  // Sort by matchScore descending
  profilesWithScores.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))

  return <MatchBoard mySkills={mySkills} profiles={profilesWithScores} />
}
