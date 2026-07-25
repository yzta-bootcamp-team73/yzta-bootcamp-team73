import { Sparkles, FolderGit2, Star, GitFork, ExternalLink } from "lucide-react";
import { Github } from "@/components/shared/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/server"
import { EditNameDialog } from "@/components/shared/edit-name-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  fetchGithubRepos,
  computeLanguageStats,
  topRepos,
} from "@/lib/github/client"

const lookingFor = ["UI/UX Tasarımcı", "Veri Bilimci"]

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const avatarUrl = user?.user_metadata?.avatar_url;
  const userNameStr = user?.user_metadata?.user_name || "kullanici";
  const fullName = user?.user_metadata?.full_name || userNameStr;
  const userName = `@${userNameStr}`;
  const initials = fullName.substring(0, 2).toUpperCase();

  const repos = user?.user_metadata?.user_name
    ? await fetchGithubRepos(user.user_metadata.user_name)
    : [];
  const languageStats = computeLanguageStats(repos).slice(0, 6);
  const featuredRepos = topRepos(repos, 4);

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
                  Yeni üye | Beceriler yakında AI tarafından analiz edilecek.
                </p>
                <div className="mt-3">
                  <Badge>Geliştirici</Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Skills — GitHub repolarındaki dil dağılımına göre (basit sayım, AI değil) */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                Yetenekler
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  GitHub repolarına göre
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {languageStats.length > 0 ? (
                  languageStats.map((stat) => (
                    <Badge key={stat.language} variant="secondary">
                      {stat.language} · %{stat.percentage}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Genel dil dağılımı için GitHub repolarında yeterli veri bulunamadı.
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* Looking For */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                Aradığım Roller
              </h3>
              <div className="flex flex-wrap gap-2">
                {lookingFor.map((role) => (
                  <Badge key={role} variant="outline">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Side Cards */}
        <div className="space-y-6">
          {/* AI Analysis Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="size-5 text-primary" />
                AI Yetkinlik Analizi
              </CardTitle>
              <CardDescription>
                Profilinizi analiz etmek için GitHub hesabınızı bağlayın.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button disabled className="w-full gap-2">
                <Github className="size-4" />
                GitHub ile Analiz Et
              </Button>
              <div className="mt-3 flex justify-center">
                <Badge variant="outline">Yakında</Badge>
              </div>
            </CardContent>
          </Card>

          {/* GitHub Repos Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderGit2 className="size-5 text-primary" />
                GitHub Repoları
              </CardTitle>
              <CardDescription>
                {featuredRepos.length > 0
                  ? "Yıldız sayısına göre öne çıkan repolarınız."
                  : "GitHub hesabınız bağlandığında repolarınız burada görünecek."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {featuredRepos.length > 0 ? (
                <div className="space-y-3">
                  {featuredRepos.map((repo) => (
                    <a
                      key={repo.id}
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block rounded-lg border border-border p-3 transition-colors hover:bg-muted"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium text-foreground">
                          {repo.name}
                        </span>
                        <ExternalLink className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      {repo.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {repo.description}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        {repo.language && (
                          <span className="flex items-center gap-1">
                            <span className="size-2 rounded-full bg-primary/60" />
                            {repo.language}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Star className="size-3" />
                          {repo.stargazers_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="size-3" />
                          {repo.forks_count}
                        </span>
                      </div>
                    </a>
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
