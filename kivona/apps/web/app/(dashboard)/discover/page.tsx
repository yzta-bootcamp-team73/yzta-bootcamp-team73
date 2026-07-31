import { createClient } from "@/lib/supabase/server"
import { competitions as seedCompetitions, type Competition } from "@/lib/data/competitions"
import { DiscoverBoard } from "@/components/shared/discover-board"

type CompetitionRow = {
  id: string
  title: string
  platform: Competition["platform"]
  url: string
  description: string
  category: Competition["category"]
  prize: string
  deadline: string
  image_url: string
}

type HackathonApiItem = CompetitionRow

function mapRow(row: CompetitionRow): Competition {
  return {
    id: row.id,
    title: row.title,
    platform: row.platform,
    url: row.url,
    description: row.description,
    category: row.category,
    prize: row.prize,
    deadline: row.deadline,
    imageUrl: row.image_url,
  }
}

export default async function DiscoverPage() {
  let competitions: Competition[] = []
  const mlApiUrl = process.env.ML_API_URL || "http://localhost:8000"

  // 1. Try to fetch live hackathons from Devpost RSS via our ML-API
  try {
    const res = await fetch(`${mlApiUrl}/api/v1/hackathons`, { 
      cache: 'no-store' 
    })
    if (res.ok) {
      const result = await res.json()
      if (result.status === "success" && result.data.length > 0) {
        competitions = result.data.map((item: HackathonApiItem) => ({
          ...item,
          imageUrl: item.image_url, // map snake_case to camelCase
        }))
      }
    }
  } catch (error) {
    console.error("Failed to fetch live hackathons:", error)
  }

  // 2. Fallback to Supabase if live API fails or returns empty
  if (competitions.length === 0) {
    const supabase = await createClient()
    const { data } = await supabase
      .from("competitions")
      .select("id, title, platform, url, description, category, prize, deadline, image_url")
      .order("deadline", { ascending: true })

    competitions = data && data.length > 0 ? (data as CompetitionRow[]).map(mapRow) : seedCompetitions
  }

  return <DiscoverBoard competitions={competitions} />
}

