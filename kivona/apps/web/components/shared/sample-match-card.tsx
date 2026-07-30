"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { motion } from "framer-motion";

const DUMMY_PROFILES = [
  {
    full_name: "Zeynep Yılmaz",
    avatar_url: "https://i.pravatar.cc/150?u=selim",
    primary_role: "Frontend Geliştirici",
    top_skills: ["React", "Three.js", "Tailwind"],
    match_score: 98,
  },
  {
    full_name: "Caner Ekinci",
    avatar_url: "https://i.pravatar.cc/150?u=aykut",
    primary_role: "Veri Bilimci",
    top_skills: ["Python", "PyTorch", "SQL"],
    match_score: 95,
  },
  {
    full_name: "Elif Arslan",
    avatar_url: "https://i.pravatar.cc/150?u=elif",
    primary_role: "Backend Geliştirici",
    top_skills: ["Node.js", "PostgreSQL", "Docker"],
    match_score: 92,
  }
];

const CARD_STYLES = [
  { rotate: -2, top: 0, left: 0, scale: 1 },
  { rotate: 5, top: 48, left: 24, scale: 0.95 },
  { rotate: -4, top: 96, left: -16, scale: 0.9 },
];

export function SampleMatchCard({ showMatchScore = true, count = 2 }: { showMatchScore?: boolean, count?: number }) {
  const [profiles, setProfiles] = useState<typeof DUMMY_PROFILES>(DUMMY_PROFILES.slice(0, count));
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchRandomProfiles() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, ai_analysis, role, skills")
        .not("ai_analysis", "is", null)
        .limit(20);
        
      let fetchedProfiles: typeof DUMMY_PROFILES = [];
      if (!error && data && data.length > 0) {
        // Shuffle
        const shuffled = data.sort(() => 0.5 - Math.random());
        fetchedProfiles = shuffled.slice(0, count).map(p => {
          let skills = ["React", "TypeScript", "Next.js"];
          let role = p.role || "Yazılım Geliştirici";
          let score = Math.floor(Math.random() * 10) + 90;

          // Parse skills column which is an array of JSON strings
          if (Array.isArray(p.skills) && p.skills.length > 0) {
             try {
                const parsedSkills = p.skills.map((s: string) => JSON.parse(s).name);
                if (parsedSkills.length > 0) {
                   skills = parsedSkills.slice(0, 3);
                }
             } catch(e) {}
          }

          if (p.ai_analysis && p.ai_analysis.recommendation_metadata) {
            const meta = p.ai_analysis.recommendation_metadata;
            // activity_score can act as a realistic match score
            if (meta.activity_score && meta.activity_score > 70) {
               score = Math.min(99, meta.activity_score + 10);
            }
          }
          
          return {
            full_name: p.full_name || "Kivona Kullanıcısı",
            avatar_url: p.avatar_url || "",
            primary_role: role,
            top_skills: skills, // Max 3 yetenek
            match_score: score, // 90-99
          };
        });
      }

      // Veritabanında yeterli kişi yoksa dummy (sahte) profillerle tamamla
      const finalProfiles = [...fetchedProfiles];
      let dummyIndex = 0;
      while (finalProfiles.length < count) {
        finalProfiles.push(DUMMY_PROFILES[dummyIndex % DUMMY_PROFILES.length]);
        dummyIndex++;
      }

      setProfiles(finalProfiles);
    }
    fetchRandomProfiles();
  }, [count]);

  return (
    <div className="relative w-full max-w-[340px] mx-auto z-10 h-[260px] sm:max-w-sm mt-4">
      {profiles.map((profile, i) => {
        const initials = profile.full_name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "KV";
        const style = CARD_STYLES[i] || CARD_STYLES[0];
        const isHovered = hoveredIndex === i;
        
        return (
          <motion.div 
            key={`${profile.full_name}-${i}`}
            className="absolute w-full cursor-pointer"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{ 
              zIndex: isHovered ? 50 : 10 - i,
              top: style.top,
              left: style.left,
            }}
            initial={{ opacity: 0, y: 40, rotate: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, rotate: isHovered ? 0 : style.rotate, scale: isHovered ? 1.05 : style.scale }}
            transition={{ delay: i * 0.15, duration: 0.4, type: "spring", bounce: 0.3 }}
          >
            {/* Continuous floating animation wrapper */}
            <motion.div
              animate={isHovered ? { y: 0 } : { y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4 + i, ease: "easeInOut", delay: i * 0.5 }}
            >
              <Card className="relative border-border/80 shadow-2xl bg-card/95 backdrop-blur-sm transition-shadow hover:shadow-primary/20 duration-300">
                <CardHeader className="flex-row items-center gap-4 pb-4">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-12 h-12 shrink-0 rounded-full border-2 border-primary/20 object-cover bg-muted" />
                  ) : (
                    <div className="flex w-12 h-12 shrink-0 items-center justify-center rounded-full bg-accent text-lg font-semibold text-primary border-2 border-primary/20">
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base font-semibold text-foreground truncate">
                      {profile.full_name}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground truncate">
                      {profile.primary_role}
                    </CardDescription>
                  </div>
                  {showMatchScore && (
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50 shrink-0">
                      <Sparkles className="w-3 h-3 mr-1" /> %{profile.match_score} Uyum
                    </Badge>
                  )}
                </CardHeader>

                <CardContent className="flex flex-wrap gap-2 pt-0">
                  {profile.top_skills.map((skill, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="bg-accent/60 text-primary font-medium border-primary/10 dark:bg-muted dark:text-foreground dark:border-border"
                    >
                      {skill}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
