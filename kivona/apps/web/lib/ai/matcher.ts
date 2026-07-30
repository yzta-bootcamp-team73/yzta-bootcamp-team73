export async function fetchMatchScore(userSkills: string[], teamSkills: string[]): Promise<number> {
  // Fallback if no skills are provided
  if (userSkills.length === 0 || teamSkills.length === 0) {
    return 0
  }

  const mlApiUrl = process.env.ML_API_URL || "http://localhost:8000"

  try {
    const res = await fetch(`${mlApiUrl}/match`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_skills: userSkills,
        team_skills: teamSkills,
      }),
      // Revalidate or cache config depending on needs. We can cache it for a while to avoid hitting ML API too often.
      // But for hackathon, keeping it fresh or default is fine.
      cache: "no-store", 
    })

    if (!res.ok) {
      console.error("Match API error:", res.status, await res.text())
      return 0
    }

    const data = await res.json()
    // The API returns { score: float, percent: int, ... }
    return data.percent || 0
  } catch (error) {
    console.error("Failed to fetch match score:", error)
    return 0
  }
}
