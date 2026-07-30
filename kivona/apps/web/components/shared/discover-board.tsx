"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Trophy, Info, ExternalLink } from "lucide-react"
import type { Competition } from "@/lib/data/competitions"
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
  { value: "blockchain", label: "Blockchain" },
  { value: "iot", label: "IoT" },
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
          <Badge variant="secondary" className="bg-background/90 text-foreground backdrop-blur-sm">
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

export function DiscoverBoard({ competitions }: { competitions: Competition[] }) {
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
          Dünya genelindeki etkinlik ve yarışmaları keşfet, takımını kur ve katıl.
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
              {filteredCompetitions.map((competition, i) => (
                <motion.div
                  key={competition.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.04, ease: "easeOut" }}
                >
                  <CompetitionCard competition={competition} />
                </motion.div>
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

      {/* Partnership & Real Competitions Callout */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-12 rounded-xl border border-primary/20 bg-primary/5 p-6 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="rounded-full bg-primary/10 p-2 text-primary shrink-0">
            <Info className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Daha Fazla Etkinlik ve Yarışma Nerede?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Şu an platformumuzda gördüğünüz etkinlikler, Kivona'nın akıllı eşleşme konseptini sergilemek amacıyla listelenmektedir.
              Vizyonumuz; gelecekte teknoloji odaklı kariyer platformları ve organizatörlerle resmi B2B (kurumsal) anlaşmalar yaparak, 
              Türkiye'deki ve dünyadaki tüm proje çağrılarını ve teknoloji yarışmalarını tek bir merkezde toplamaktır.
              Biz bu entegrasyonları tamamlayana kadar, güncel fırsatlara aşağıdaki platformlardan göz atabilirsiniz:
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="https://devpost.com/hackathons" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-md bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm border border-border hover:bg-accent hover:text-accent-foreground transition-colors">
                Devpost <ExternalLink className="size-3.5 opacity-70" />
              </a>
              <a href="https://www.hackerearth.com/challenges/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-md bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm border border-border hover:bg-accent hover:text-accent-foreground transition-colors">
                HackerEarth <ExternalLink className="size-3.5 opacity-70" />
              </a>
              <a href="https://mlh.io/seasons/2026/events" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-md bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm border border-border hover:bg-accent hover:text-accent-foreground transition-colors">
                MLH <ExternalLink className="size-3.5 opacity-70" />
              </a>
              <a href="https://www.kaggle.com/competitions" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-md bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm border border-border hover:bg-accent hover:text-accent-foreground transition-colors">
                Kaggle <ExternalLink className="size-3.5 opacity-70" />
              </a>
              <a href="https://www.topcoder.com/challenges" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-md bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm border border-border hover:bg-accent hover:text-accent-foreground transition-colors">
                Topcoder <ExternalLink className="size-3.5 opacity-70" />
              </a>
              <a href="https://www.teknofest.org/tr/competitions/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-md bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm border border-border hover:bg-accent hover:text-accent-foreground transition-colors">
                Teknofest <ExternalLink className="size-3.5 opacity-70" />
              </a>
              <a href="https://www.techcareer.net/events" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-md bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm border border-border hover:bg-accent hover:text-accent-foreground transition-colors">
                Techcareer.net <ExternalLink className="size-3.5 opacity-70" />
              </a>
              <a href="https://www.patika.dev/bootcamp" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-md bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm border border-border hover:bg-accent hover:text-accent-foreground transition-colors">
                Patika.dev <ExternalLink className="size-3.5 opacity-70" />
              </a>
              <a href="https://coderspace.io/etkinlikler/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-md bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm border border-border hover:bg-accent hover:text-accent-foreground transition-colors">
                Coderspace <ExternalLink className="size-3.5 opacity-70" />
              </a>
              <a href="https://tubitak.gov.tr/tr/yarismalar" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-md bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm border border-border hover:bg-accent hover:text-accent-foreground transition-colors">
                TÜBİTAK <ExternalLink className="size-3.5 opacity-70" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
