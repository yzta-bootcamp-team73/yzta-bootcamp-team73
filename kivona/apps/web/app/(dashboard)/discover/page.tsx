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
  const supabase = await createClient()
  const { data } = await supabase
    .from("competitions")
    .select("id, title, platform, url, description, category, prize, deadline, image_url")
    .order("deadline", { ascending: true })

  // Supabase'deki competitions tablosu henüz seed edilmemişse (ya da erişilemezse)
  // statik örnek verilere düşerek sayfanın boş görünmesini engelliyoruz.
  const competitions =
    data && data.length > 0 ? (data as CompetitionRow[]).map(mapRow) : seedCompetitions

  return <DiscoverBoard competitions={competitions} />
}
