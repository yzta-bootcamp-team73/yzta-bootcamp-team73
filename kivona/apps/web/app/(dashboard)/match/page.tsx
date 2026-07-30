import { createClient } from "@/lib/supabase/server"
import { fetchGithubRepos, computeLanguageStats } from "@/lib/github/client"
import { demoProfiles, type DemoProfile, type DemoRole } from "@/lib/data/profiles"
import { MatchBoard } from "@/components/shared/match-board"
import { fetchMatchScore } from "@/lib/ai/matcher"

// Helper to map dynamic roles to tab filters
function mapRoleToTab(roleText: string): DemoRole {
  if (!roleText) return "developer"
  const r = roleText.toLowerCase()
  if (r.includes("veri") || r.includes("data")) return "data_scientist"
  if (r.includes("tasarım") || r.includes("design") || r.includes("ui")) return "designer"
  if (r.includes("yönet") || r.includes("manager") || r.includes("pm")) return "pm"
  return "developer"
}

export default async function MatchPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const repos = user?.user_metadata?.user_name
    ? await fetchGithubRepos(user.user_metadata.user_name)
    : []
  const mySkills = computeLanguageStats(repos).map((stat) => stat.language)

  // Fetch real profiles from Supabase
  const { data: realProfiles } = await supabase.from("profiles").select("*")

  const dbProfiles: DemoProfile[] = (realProfiles || [])
    .filter((p) => p.id !== user?.id) // Kendi kendimizle eşleşmemek için
    .map((p) => {
      const analysis = p.ai_analysis || {}
      
      // Extract skills
      let skills: string[] = []
      if (Array.isArray(analysis.skills)) {
        skills = analysis.skills.map((s: any) => typeof s === "string" ? s : s.name).filter(Boolean)
      }

      return {
        id: p.id,
        fullName: p.full_name || "İsimsiz Üye",
        username: "gercek_uye", 
        role: mapRoleToTab(analysis.primary_role || p.role),
        skills,
        lookingFor: p.looking_for || [],
        bio: analysis.professional_summary || "Yetenekler AI tarafından analiz ediliyor.",
        avatarUrl: p.avatar_url,
      }
    })

  // Combine Real and Fake profiles
  const allProfiles = [...dbProfiles, ...demoProfiles]

  // Fetch ML match scores for all profiles
  const profilesWithScores = await Promise.all(
    allProfiles.map(async (profile) => {
      const matchScore = await fetchMatchScore(mySkills, profile.skills)
      return { ...profile, matchScore }
    })
  )

  // Sort by matchScore descending
  profilesWithScores.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))

  return <MatchBoard mySkills={mySkills} profiles={profilesWithScores} />
}
