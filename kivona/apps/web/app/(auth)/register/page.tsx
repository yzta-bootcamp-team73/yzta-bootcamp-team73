"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Sparkles,
} from "lucide-react";
import { Github } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col md:flex-row antialiased selection:bg-accent selection:text-accent-foreground">
      {/* ============================
          Left Side: Registration Form
          ============================ */}
      <main className="w-full md:w-1/2 lg:w-[45%] h-full flex flex-col items-center justify-center p-4 md:p-16 overflow-y-auto z-10 relative bg-card">
        <div className="w-full max-w-md flex flex-col gap-7">
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
            <Link
              href="/login"
              className="flex-1 py-2 px-4 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-center"
            >
              Giriş Yap
            </Link>
            <button className="flex-1 py-2 px-4 rounded-md bg-card shadow-sm text-primary text-sm font-medium transition-all text-center border border-border/30">
              Kayıt Ol
            </button>
          </div>

          {/* Header */}
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h1 className="text-2xl font-semibold text-foreground">
              Maceraya Katıl
            </h1>
            <p className="text-base text-muted-foreground">
              Hesabını oluştur ve hayalindeki takımı bulmaya başla.
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
              {isLoading ? "Yönlendiriliyor..." : "GitHub ile Kayıt Ol"}
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
            className="flex flex-col gap-4 w-full"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="fullName"
                className="text-sm font-medium text-muted-foreground ml-1"
              >
                Ad Soyad
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-4 w-5 h-5 text-muted-foreground/60" />
                <input
                  id="fullName"
                  type="text"
                  placeholder="Adınız Soyadınız"
                  className="w-full bg-secondary border border-border rounded-lg py-3 pl-12 pr-4 text-foreground text-base focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/50"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="registerEmail"
                className="text-sm font-medium text-muted-foreground ml-1"
              >
                E-posta
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-5 h-5 text-muted-foreground/60" />
                <input
                  id="registerEmail"
                  type="email"
                  placeholder="ornek@kivona.dev"
                  className="w-full bg-secondary border border-border rounded-lg py-3 pl-12 pr-4 text-foreground text-base focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="registerPassword"
                className="text-sm font-medium text-muted-foreground ml-1"
              >
                Şifre
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-5 h-5 text-muted-foreground/60" />
                <input
                  id="registerPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="En az 8 karakter"
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

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-muted-foreground ml-1"
              >
                Şifre Tekrar
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-5 h-5 text-muted-foreground/60" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Şifrenizi tekrar girin"
                  className="w-full bg-secondary border border-border rounded-lg py-3 pl-12 pr-12 text-foreground text-base focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 text-muted-foreground/60 hover:text-foreground transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? (
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
                alert("AI tabanlı eşleşme motorunun düzgün çalışabilmesi için MVP (Beta) sürümünde sadece GitHub hesaplarıyla kayıt alınmaktadır.");
              }}
              className="w-full mt-2 py-6 text-sm font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-[0.98]"
              size="lg"
            >
              <span className="flex items-center justify-center gap-2">
                Hesap Oluştur
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
          </form>

          {/* Footer Text */}
          <p className="text-center text-base text-muted-foreground">
            Zaten hesabın var mı?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline underline-offset-4"
            >
              Giriş Yap
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
              Yeteneklerini keşfet,{" "}
              <span className="text-primary">takımını kur.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-md">
              GitHub profilini bağla, AI destekli analiz ile güçlü yönlerini
              öğren ve sana en uygun ekip arkadaşlarını bul.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="flex flex-col gap-4 w-full">
            {[
              {
                icon: "🤖",
                title: "AI Profil Analizi",
                desc: "GitHub repolarını otomatik analiz eder",
              },
              {
                icon: "🎯",
                title: "Akıllı Eşleştirme",
                desc: "Yeteneklerine uygun takım arkadaşları bulur",
              },
              {
                icon: "🏆",
                title: "Hackathon Keşfi",
                desc: "Güncel yarışmaları tek panoda toplar",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex items-center gap-4 bg-card border border-border rounded-lg p-4"
              >
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
