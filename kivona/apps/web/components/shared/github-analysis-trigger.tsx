"use client"

import { useState } from "react"
import { Sparkles, Loader2, CheckCircle2, AlertCircle, TrendingUp, Code2, Target, Trash2 } from "lucide-react"
import { Github } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"

type AnalysisStatus = "idle" | "loading" | "success" | "error"

interface GitHubAnalysis {
  primary_role: string
  skills: Array<{ name: string; confidence: number; category: string }>
  specializations: string[]
  tech_stack: {
    languages: string[]
    frameworks: string[]
    tools: string[]
  }
  strengths: string[]
  professional_summary: string
  stats: {
    total_repos: number
    total_stars: number
    top_languages: Record<string, number>
    activity_score: number
  }
  analyzed_at: string
}

interface GitHubAnalysisTriggerProps {
  hasGitHub: boolean
  existingAnalysis: GitHubAnalysis | null
  userId: string
}

export function GitHubAnalysisTrigger({
  hasGitHub,
  existingAnalysis,
  userId,
}: GitHubAnalysisTriggerProps) {
  const [status, setStatus] = useState<AnalysisStatus>("idle")
  const [analysis, setAnalysis] = useState<GitHubAnalysis | null>(existingAnalysis)
  const [errorMessage, setErrorMessage] = useState("")
  const [needsReauth, setNeedsReauth] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  const handleAnalyze = async () => {
    setStatus("loading")
    setErrorMessage("")
    setNeedsReauth(false)

    try {
      const response = await fetch("/api/github/analyze", {
        method: "POST",
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        if (data.needs_github_reauth || data.needs_github) {
          setNeedsReauth(true)
        }
        throw new Error(data.error || "Analiz başarısız oldu")
      }

      const result = await response.json()
      setAnalysis(result)
      setStatus("success")

      // Sayfayı yenile ki profil sayfasındaki diğer bölümler de güncellensin
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu")
      setStatus("error")
    }
  }

  const handleClearAnalysis = async () => {
    if (!window.confirm("Analiz verileriniz silinecek. Emin misiniz?")) return

    setIsClearing(true)
    const supabase = createClient()

    try {
      await supabase
        .from("profiles")
        .update({
          ai_analysis: null,
          skills: null,
          role: null,
        })
        .eq("id", userId)

      window.location.reload()
    } catch (error) {
      console.error("Analiz silinirken hata:", error)
      setIsClearing(false)
    }
  }

  const handleConnectGitHub = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/profile`,
      },
    })
  }

  // Durum 1: Analiz tamamlanmış — sonuçları göster
  if (analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            AI Yetkinlik Analizi
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <CheckCircle2 className="size-3.5 text-emerald-500" />
            {analysis.analyzed_at
              ? `Son analiz: ${new Date(analysis.analyzed_at).toLocaleDateString("tr-TR")}`
              : "Analiz tamamlandı"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Primary Role */}
          <div className="flex items-center gap-2">
            <Target className="size-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Birincil Rol:</span>
            <Badge className="bg-primary/10 text-primary border-primary/20">
              {analysis.primary_role}
            </Badge>
          </div>

          <Separator />

          {/* Strengths */}
          {analysis.strengths.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Güçlü Yönler</span>
              </div>
              <ul className="space-y-1.5">
                {analysis.strengths.map((strength, i) => (
                  <li
                    key={i}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Separator />

          {/* Tech Stack */}
          {analysis.tech_stack && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Code2 className="size-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Teknoloji Stack</span>
              </div>
              <div className="space-y-2">
                {analysis.tech_stack.languages?.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground font-medium">Diller</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {analysis.tech_stack.languages.map((lang) => (
                        <Badge key={lang} variant="secondary" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {analysis.tech_stack.frameworks?.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground font-medium">Framework</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {analysis.tech_stack.frameworks.map((fw) => (
                        <Badge key={fw} variant="secondary" className="text-xs">
                          {fw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {analysis.tech_stack.tools?.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground font-medium">Araçlar</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {analysis.tech_stack.tools.map((tool) => (
                        <Badge key={tool} variant="secondary" className="text-xs">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <Separator />

          {/* Stats */}
          {analysis.stats && (
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-muted/50 p-2">
                <p className="text-lg font-bold text-foreground">
                  {analysis.stats.total_repos}
                </p>
                <p className="text-xs text-muted-foreground">Repo</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-2">
                <p className="text-lg font-bold text-foreground">
                  {analysis.stats.total_stars}
                </p>
                <p className="text-xs text-muted-foreground">Star</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-2">
                <p className="text-lg font-bold text-foreground">
                  {analysis.stats.activity_score}
                </p>
                <p className="text-xs text-muted-foreground">Aktivite</p>
              </div>
            </div>
          )}

          {/* Re-analyze & Clear buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleAnalyze}
              disabled={status === "loading" || isClearing}
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Analiz Ediliyor...
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Yeniden Analiz Et
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAnalysis}
              disabled={status === "loading" || isClearing}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              {isClearing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Durum 2: GitHub bağlı değil
  if (!hasGitHub) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            AI Yetkinlik Analizi
          </CardTitle>
          <CardDescription>
            GitHub hesabınız bağlı değil. Profil analizinizi yapabilmemiz için lütfen GitHub hesabınızı bağlayın.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleConnectGitHub} className="w-full gap-2">
            <Github className="size-4" />
            GitHub Hesabını Bağla
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Durum 3: GitHub bağlı ama analiz yapılmamış
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          AI Yetkinlik Analizi
        </CardTitle>
        <CardDescription>
          GitHub profilinizi analiz ederek teknik yetkinliklerinizi belirleyelim.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {status === "error" && (
          <div className="space-y-3">
            <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="size-4 mt-0.5 shrink-0" />
              <p>{errorMessage}</p>
            </div>
            {needsReauth && (
              <Button
                onClick={handleConnectGitHub}
                variant="outline"
                className="w-full gap-2"
              >
                <Github className="size-4" />
                GitHub Hesabını Yeniden Bağla
              </Button>
            )}
          </div>
        )}

        <Button
          onClick={handleAnalyze}
          disabled={status === "loading"}
          className="w-full gap-2"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Profiliniz Analiz Ediliyor...
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              Profilimi Analiz Et
            </>
          )}
        </Button>

        {status === "loading" && (
          <p className="text-center text-xs text-muted-foreground">
            Tüm repository&apos;leriniz inceleniyor. Bu işlem birkaç saniye sürebilir...
          </p>
        )}
      </CardContent>
    </Card>
  )
}
