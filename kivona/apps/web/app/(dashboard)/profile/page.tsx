import { Sparkles, FolderGit2, Star, GitFork, ExternalLink } from "lucide-react";
import { Github } from "@/components/shared/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/server"
import { EditNameDialog } from "@/components/shared/edit-name-dialog"
import { EditLookingForDialog } from "@/components/shared/edit-looking-for-dialog"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { GitHubAnalysisTrigger } from "@/components/shared/github-analysis-trigger"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profileRow } = user
    ? await supabase.from("profiles").select("looking_for").eq("id", user.id).maybeSingle()
    : { data: null };
  const lookingFor: string[] = profileRow?.looking_for ?? [];

  const avatarUrl = user?.user_metadata?.avatar_url;
  const userNameStr = user?.user_metadata?.user_name || "kullanici";
  const fullName = user?.user_metadata?.full_name || userNameStr;
  const userName = `@${userNameStr}`;
  const initials = fullName.substring(0, 2).toUpperCase();

  // Profil tablosundan verileri çek
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single();

  // GitHub analiz verileri 
  const analysis = profile?.ai_analysis || null;
  const hasGitHub = !!user?.user_metadata?.user_name;

  // Analiz varsa dinamik veri, yoksa boş
  const skills = analysis?.skills ?? [];
  const specializations = analysis?.specializations ?? [];
  const primaryRole = analysis?.primary_role || "Geliştirici";
  const summary = analysis?.professional_summary || "Yeni üye | Beceriler yakında AI tarafından analiz edilecek.";
  const repositories = analysis?.repositories ?? [];

  const getConfidenceColor = (score: number) => {
    if (score >= 90) return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
    if (score >= 70) return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30";
    return "bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profilim</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Profil bilgilerinizi görüntüleyin ve düzenleyin.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Card — Main */}
        <Card className="lg:col-span-2">
          <CardContent className="space-y-6">
            {/* User Info */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <Avatar size="lg" className="size-20">
                {avatarUrl && <AvatarImage src={avatarUrl} alt="Avatar" />}
                <AvatarFallback className="text-xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start">
                  <h2 className="text-xl font-bold text-foreground">
                    {fullName}
                  </h2>
                  <EditNameDialog user={user} />
                </div>
                <p className="text-sm text-muted-foreground">{userName}</p>
                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                  {summary}
                </p>
                <div className="mt-3">
                  <Badge>{primaryRole}</Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Skills — GitHub repolarındaki dil dağılımına göre */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                Yetenekler
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  GitHub repolarına göre
                </span>
              </h3>
              {skills.length > 0 ? (
                <TooltipProvider delay={200}>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill: any) => (
                      <Tooltip key={skill.name}>
                        <TooltipTrigger className="cursor-help">
                          <Badge 
                            variant="outline" 
                            className={`flex items-center gap-1.5 px-2.5 py-1 transition-colors hover:brightness-95 dark:hover:brightness-110 ${getConfidenceColor(skill.confidence || 0)}`}
                          >
                            {skill.name}
                            {skill.confidence && (
                              <span className="text-[10px] font-bold opacity-70">
                                %{skill.confidence}
                              </span>
                            )}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent sideOffset={8} className="max-w-xs p-3">
                          <div className="font-semibold text-sm border-b pb-1.5 mb-2 flex items-center gap-2">
                            <Sparkles className="size-3.5 text-primary" />
                            AI Karar Detayı
                          </div>
                          {skill.reasons?.length > 0 ? (
                            <ul className="space-y-1.5">
                              {skill.reasons.map((reason: string, idx: number) => (
                                <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1.5 leading-snug">
                                  <span className="mt-1 size-1 shrink-0 rounded-full bg-primary/60" />
                                  <span>{reason}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-muted-foreground">Genel analiz sonucu eklendi.</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>
              ) : (
                <p className="text-sm text-muted-foreground">
                  GitHub profilinizi analiz ettirerek yeteneklerinizi otomatik olarak belirleyebilirsiniz.
                </p>
              )}
            </div>

            <Separator />

            {/* Specializations & Looking For */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                Uzmanlık Alanları
              </h3>
              {specializations.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {specializations.map((spec: string) => (
                    <Badge key={spec} variant="outline">
                      {spec}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Analiz sonrasında uzmanlık alanlarınız burada görünecek.
                </p>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center">
                <h3 className="text-sm font-semibold text-foreground">
                  Aradığım Roller
                </h3>
                {user && <EditLookingForDialog userId={user.id} currentRoles={lookingFor} />}
              </div>
              <div className="flex flex-wrap gap-2">
                {lookingFor.length > 0 ? (
                  lookingFor.map((role) => (
                    <Badge key={role} variant="outline">
                      {role}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Henüz belirtilmedi — düzenle simgesine tıklayarak ekleyebilirsin.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Side Cards */}
        <div className="space-y-6">
          {/* AI Analysis Card — Now interactive */}
          <GitHubAnalysisTrigger
            hasGitHub={hasGitHub}
            existingAnalysis={analysis}
          />

          {/* GitHub Repos Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderGit2 className="size-5 text-primary" />
                GitHub Repoları
              </CardTitle>
              <CardDescription>
                {repositories.length > 0
                  ? `${repositories.length} public repository (Yıldızlara göre)`
                  : "GitHub hesabınız bağlandığında repolarınız burada görünecek."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {repositories.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {repositories.map((repo: any) => (
                    <div
                      key={repo.name}
                      className="rounded-lg border border-border p-3 space-y-2 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                        >
                          {repo.name}
                          <ExternalLink className="size-3" />
                        </a>
                        <div className="flex items-center gap-2 shrink-0 text-xs text-muted-foreground">
                          {repo.stars > 0 && (
                            <span className="flex items-center gap-0.5">
                              <Star className="size-3" />
                              {repo.stars}
                            </span>
                          )}
                          {repo.forks > 0 && (
                            <span className="flex items-center gap-0.5">
                              <GitFork className="size-3" />
                              {repo.forks}
                            </span>
                          )}
                        </div>
                      </div>
                      {repo.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {repo.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        {repo.language && (
                          <Badge variant="secondary" className="text-xs py-0 px-1.5">
                            {repo.language}
                          </Badge>
                        )}
                        {repo.topics?.slice(0, 3).map((topic: string) => (
                          <Badge key={topic} variant="outline" className="text-xs py-0 px-1.5">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-8 text-center">
                  <Github className="size-8 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Henüz bağlı repo yok
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

