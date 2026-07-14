"use client"

import { useState } from "react"
import { Calendar, Trophy } from "lucide-react"
import { competitions, type Competition } from "@/lib/data/competitions"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const categoryLabels: Record<Competition["category"], string> = {
  ai_ml: "AI / ML",
  web: "Web",
  mobile: "Mobil",
  data: "Data",
  blockchain: "Blockchain",
  iot: "IoT",
}

const platformLabels: Record<Competition["platform"], string> = {
  devpost: "Devpost",
  kaggle: "Kaggle",
  hackerearth: "HackerEarth",
  mlh: "MLH",
}

const tabs = [
  { value: "all", label: "Tümü" },
  { value: "ai_ml", label: "AI / ML" },
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobil" },
  { value: "data", label: "Data" },
] as const

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function CompetitionCard({ competition }: { competition: Competition }) {
  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-kivona-sm hover:scale-[1.02] cursor-pointer">
      {/* Gradient Header */}
      <div
        className="relative h-32 w-full"
        style={{ background: competition.imageUrl }}
      >
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-foreground backdrop-blur-sm">
            {platformLabels[competition.platform]}
          </Badge>
        </div>
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-1">{competition.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {competition.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Trophy className="size-4 text-primary" />
            {competition.prize}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="size-3.5" />
            {formatDate(competition.deadline)}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Badge variant="outline">{categoryLabels[competition.category]}</Badge>
      </CardFooter>
    </Card>
  )
}

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<string>("all")

  const filteredCompetitions =
    activeTab === "all"
      ? competitions
      : competitions.filter((c) => c.category === activeTab)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Yarışmaları Keşfet
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Dünya genelindeki hackathon ve yarışmaları keşfet, takımını kur ve katıl.
        </p>
      </div>

      {/* Tabs & Grid */}
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredCompetitions.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCompetitions.map((competition) => (
                <CompetitionCard
                  key={competition.id}
                  competition={competition}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-muted-foreground">
                Bu kategoride henüz yarışma bulunmuyor.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
