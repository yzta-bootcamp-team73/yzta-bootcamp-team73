"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Pencil, UserPen, Loader2 } from "lucide-react"

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full-Stack Developer",
  "Mobile Developer",
  "iOS Developer",
  "Android Developer",
  "Data Scientist",
  "Data Analyst",
  "Data Engineer",
  "ML Engineer",
  "AI Researcher",
  "DevOps Engineer",
  "Cloud Architect",
  "Game Developer",
  "Security Engineer",
  "UI/UX Designer",
  "Product Manager",
  "QA Engineer",
  "System Administrator",
  "Software Architect",
  "Blockchain Developer",
]

const SKILLS: Record<string, string[]> = {
  "Diller": [
    "JavaScript", "TypeScript", "Python", "Java", "C", "C++", "C#",
    "Go", "Ruby", "PHP", "Swift", "Kotlin", "Rust", "Dart", "Scala",
    "R", "SQL", "Shell", "Assembly", "Objective-C", "Elixir"
  ],
  "Web & Mobile Frameworks": [
    "React", "Angular", "Vue", "Svelte", "Next.js", "Nuxt.js",
    "React Native", "Flutter", "SwiftUI", "Jetpack Compose",
    "Tailwind CSS", "Bootstrap", "Material-UI", "Chakra UI"
  ],
  "Backend Frameworks": [
    "Django", "Flask", "FastAPI", "Spring Boot", "Express.js",
    "NestJS", "Laravel", "Ruby on Rails", "ASP.NET", "Gin", "Fiber"
  ],
  "Veritabanı & ORM": [
    "PostgreSQL", "MongoDB", "MySQL", "Redis", "SQLite", "Oracle",
    "Cassandra", "Elasticsearch", "Prisma", "TypeORM", "Mongoose",
    "SQLAlchemy", "Hibernate"
  ],
  "Araçlar & Bulut": [
    "Docker", "Kubernetes", "AWS", "Google Cloud", "Azure",
    "Git", "GitHub Actions", "GitLab CI", "Jenkins", "Terraform",
    "Firebase", "Supabase", "GraphQL", "Apollo", "Nginx", "RabbitMQ"
  ],
}

const SPECIALIZATIONS = [
  "Frontend Architecture",
  "Backend Systems",
  "Full-Stack Development",
  "Mobile App Development",
  "Data Engineering",
  "Machine Learning",
  "Deep Learning",
  "Natural Language Processing",
  "Cloud Architecture",
  "DevOps & CI/CD",
  "Database Design",
  "Microservices",
  "Cybersecurity",
  "Game Development",
  "UI/UX Design",
  "System Performance",
  "Blockchain & Web3",
  "AR/VR Development",
  "Internet of Things (IoT)",
  "E-commerce Solutions",
]

interface EditProfileDialogProps {
  userId: string
  currentRole?: string
  currentSkills?: string[]
  currentSpecializations?: string[]
  triggerVariant?: "button" | "icon"
}

export function EditProfileDialog({
  userId,
  currentRole = "",
  currentSkills = [],
  currentSpecializations = [],
  triggerVariant = "button",
}: EditProfileDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState(currentRole)
  const [selectedSkills, setSelectedSkills] = useState<string[]>(currentSkills)
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>(currentSpecializations)
  const [isLoading, setIsLoading] = useState(false)

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  const toggleSpec = (spec: string) => {
    setSelectedSpecs((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    )
  }

  const handleSubmit = async () => {
    if (!selectedRole && selectedSkills.length === 0 && selectedSpecs.length === 0) return

    setIsLoading(true)
    const supabase = createClient()

    try {
      const skillObjects = selectedSkills.map((name) => {
        let category = "language"
        if (SKILLS["Web & Mobile Frameworks"].includes(name) || SKILLS["Backend Frameworks"].includes(name)) category = "framework"
        else if (SKILLS["Araçlar & Bulut"].includes(name) || SKILLS["Veritabanı & ORM"].includes(name)) category = "tool"
        return { name, category }
      })

      const languages = selectedSkills.filter((s) => SKILLS["Diller"].includes(s))
      const frameworks = selectedSkills.filter((s) => SKILLS["Web & Mobile Frameworks"].includes(s) || SKILLS["Backend Frameworks"].includes(s))
      const tools = selectedSkills.filter((s) => SKILLS["Araçlar & Bulut"].includes(s) || SKILLS["Veritabanı & ORM"].includes(s))

      const manualProfile = {
        manual: true,
        primary_role: selectedRole || "Developer",
        skills: skillObjects,
        specializations: selectedSpecs,
        strengths: [],
        professional_summary: "",
        tech_stack: { languages, frameworks, tools },
        stats: null,
        repositories: [],
        analyzed_at: null,
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          ai_analysis: manualProfile,
          role: selectedRole || null,
          skills: selectedSkills,
        })
        .eq("id", userId)

      if (error) {
        console.error("Profil güncellenirken hata:", error)
      }

      setOpen(false)
      window.location.reload()
    } catch (error) {
      console.error("Profil kaydetme hatası:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setSelectedRole(currentRole || "")
      setSelectedSkills([...currentSkills])
      setSelectedSpecs([...currentSpecializations])
    }
    setOpen(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {triggerVariant === "icon" ? (
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="ml-1 text-muted-foreground hover:text-foreground"
            />
          }
        >
          <Pencil className="size-3.5" />
          <span className="sr-only">Profili Düzenle</span>
        </DialogTrigger>
      ) : (
        <DialogTrigger
          render={<Button variant="outline" className="w-full gap-2" />}
        >
          <UserPen className="size-4" />
          Profilini Doldur
        </DialogTrigger>
      )}
      <DialogContent
        className="sm:max-w-lg max-h-[85vh] overflow-y-auto"
        showCloseButton={true}
      >
        <DialogHeader>
          <DialogTitle>Profilini Doldur</DialogTitle>
          <DialogDescription>
            Yeteneklerini ve uzmanlık alanlarını seçerek profilini tamamla.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Role Selection */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Rol</h4>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() =>
                    setSelectedRole(role === selectedRole ? "" : role)
                  }
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                    role === selectedRole
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Skills Selection */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">
              Yetenekler
            </h4>
            {Object.entries(SKILLS).map(([category, items]) => (
              <div key={category} className="space-y-1.5">
                <p className="text-xs text-muted-foreground font-medium">
                  {category}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors cursor-pointer ${
                        selectedSkills.includes(skill)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-transparent text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Specializations Selection */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">
              Uzmanlık Alanları
            </h4>
            <div className="flex flex-wrap gap-2">
              {SPECIALIZATIONS.map((spec) => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => toggleSpec(spec)}
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                    selectedSpecs.includes(spec)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-end gap-2 mt-4">
          <DialogClose
            render={
              <Button type="button" variant="outline" disabled={isLoading} />
            }
          >
            İptal
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              (!selectedRole &&
                selectedSkills.length === 0 &&
                selectedSpecs.length === 0)
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              "Kaydet"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
