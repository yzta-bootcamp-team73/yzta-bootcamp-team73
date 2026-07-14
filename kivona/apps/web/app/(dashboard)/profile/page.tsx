import { Sparkles, FolderGit2 } from "lucide-react";
import { Github } from "@/components/shared/icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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

const skills = ["React", "Next.js", "Python", "TypeScript", "TailwindCSS", "Node.js"]
const lookingFor = ["UI/UX Tasarımcı", "Veri Bilimci"]

export default function ProfilePage() {
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
                <AvatarFallback className="text-xl">KU</AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold text-foreground">
                  Demo Kullanıcı
                </h2>
                <p className="text-sm text-muted-foreground">@demo_kullanici</p>
                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                  Full-stack geliştirici | AI &amp; ML meraklısı | Hackathon tutkunu
                </p>
                <div className="mt-3">
                  <Badge>Geliştirici</Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Skills */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                Yetenekler
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
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
                GitHub hesabınız bağlandığında repolarınız burada görünecek.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-8 text-center">
                <Github className="size-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Henüz bağlı repo yok
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
