"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { Github } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col md:flex-row antialiased selection:bg-accent selection:text-accent-foreground">
      {/* ============================
          Left Side: Interactive Form
          ============================ */}
      <main className="w-full md:w-1/2 lg:w-[45%] h-full flex flex-col items-center justify-center p-4 md:p-16 overflow-y-auto z-10 relative bg-card">
        <div className="w-full max-w-md flex flex-col gap-8">
          {/* Brand Anchor */}
          <div className="text-center md:text-left">
            <Link href="/">
              <span className="text-[40px] font-bold text-primary tracking-tight">
                Kivona
              </span>
            </Link>
          </div>

          {/* Login / Signup Toggle */}
          <div className="bg-muted p-1 rounded-lg flex items-center border border-border">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all text-center ${
                activeTab === "login"
                  ? "bg-card shadow-sm text-primary border border-border/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Giriş Yap
            </button>
            <Link
              href="/register"
              className="flex-1 py-2 px-4 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-center"
            >
              Kayıt Ol
            </Link>
          </div>

          {/* Header */}
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h1 className="text-2xl font-semibold text-foreground">
              Tekrar Hoş Geldin
            </h1>
            <p className="text-base text-muted-foreground">
              Macera kaldığı yerden devam ediyor.
            </p>
          </div>

          {/* GitHub Auth Button */}
          <button 
            onClick={async () => {
              setIsLoading(true);
              const supabase = createClient();
              await supabase.auth.signInWithOAuth({
                provider: "github",
                options: {
                  redirectTo: `${window.location.origin}/auth/callback`,
                },
              });
            }}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-card border border-border rounded-lg py-3 px-4 hover:bg-secondary transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Github className="w-5 h-5 text-foreground" />
            <span className="text-sm font-medium text-foreground">
              {isLoading ? "Yönlendiriliyor..." : "GitHub ile Devam Et"}
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 w-full">
            <div className="h-px bg-border flex-1" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              veya
            </span>
            <div className="h-px bg-border flex-1" />
          </div>

          {/* Form */}
          <form
            className="flex flex-col gap-5 w-full"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-muted-foreground ml-1"
              >
                E-posta
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-5 h-5 text-muted-foreground/60" />
                <input
                  id="email"
                  type="email"
                  placeholder="ornek@kivona.dev"
                  className="w-full bg-secondary border border-border rounded-lg py-3 pl-12 pr-4 text-foreground text-base focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between ml-1">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Şifre
                </label>
                <a
                  href="#"
                  className="text-xs font-semibold text-primary hover:underline transition-colors"
                >
                  Şifremi Unuttum?
                </a>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-5 h-5 text-muted-foreground/60" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-secondary border border-border rounded-lg py-3 pl-12 pr-12 text-foreground text-base focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-muted-foreground/60 hover:text-foreground transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                alert("AI tabanlı eşleşme motorunun düzgün çalışabilmesi için MVP (Beta) sürümünde sadece GitHub hesaplarıyla giriş desteklenmektedir.");
              }}
              className="w-full mt-2 py-6 text-sm font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-[0.98]"
              size="lg"
            >
              <span className="flex items-center justify-center gap-2">
                E-posta ile Devam Et
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
          </form>

          {/* Footer Text */}
          <p className="text-center text-base text-muted-foreground mt-2">
            Hesabın yok mu?{" "}
            <Link
              href="/register"
              className="text-primary font-medium hover:underline underline-offset-4"
            >
              Hemen Kayıt Ol
            </Link>
          </p>
        </div>
      </main>

      {/* ====================================
          Right Side: Visual Branding Panel
          (Hidden on mobile)
          ==================================== */}
      <aside className="hidden md:flex w-1/2 lg:w-[55%] h-full relative overflow-hidden bg-background items-center justify-center p-12">
        {/* Tech Pattern Overlay */}
        <div className="absolute inset-0 bg-subtle-pattern opacity-40" />

        {/* Ambient Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/30 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#dde1ff]/20 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex flex-col items-start gap-12 max-w-lg">
          {/* Hero Copy */}
          <div className="flex flex-col gap-6">
            <h2 className="text-5xl leading-[1.1] text-foreground tracking-tight font-bold">
              Geleceğin takımını kurmak için{" "}
              <span className="text-primary">ilk adımı at.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-md">
              AI destekli eşleşme motoru ile yeteneklerine en uygun ekibi bul,
              etkinliklerde zirveye oyna.
            </p>
          </div>

          {/* Match Card Preview */}
          <div className="bg-card border border-border rounded-xl p-8 shadow-xl shadow-muted/50 w-full max-w-md">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-accent bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">ZY</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Zeynep Yılmaz
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Frontend Geliştirici
                  </p>
                </div>
              </div>

              {/* Match Score Badge */}
              <div className="bg-accent border border-[#b4c5ff] rounded-full px-3 py-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-accent-foreground" />
                <span className="text-xs font-bold text-accent-foreground">
                  %98 Uyum
                </span>
              </div>
            </div>

            {/* Skill Tags */}
            <div className="flex flex-wrap gap-2">
              {["React", "Three.js", "Tailwind"].map((skill) => (
                <span
                  key={skill}
                  className="bg-muted border border-border rounded-md px-3 py-1 text-xs font-semibold text-muted-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
