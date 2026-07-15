"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Brain,
  Users,
  Trophy,
  Kanban,
  ArrowRight,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { Github } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Navbar
   ───────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-border shadow-kivona-sm"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="size-4 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-primary">
            Kivona
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="default" render={<Link href="/login" />}>
            Giriş Yap
          </Button>
          <Button variant="default" size="default" render={<Link href="/login" />}>
            <Github className="size-4" />
            Başla
          </Button>
        </div>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────
   Hero – Sample Match Card
   ───────────────────────────────────────────── */
function SampleMatchCard() {
  return (
    <div className="relative mx-auto mt-16 w-full max-w-sm">
      {/* Glow behind card */}
      <div className="absolute -inset-4 rounded-3xl bg-primary/5 blur-2xl" />

      <Card className="relative border-border/60 shadow-kivona-lg">
        <CardHeader className="flex-row items-center gap-4">
          {/* Avatar placeholder */}
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-lg font-semibold text-primary">
            ZY
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base font-semibold text-foreground">
              Zeynep Yılmaz
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Frontend Geliştirici
            </CardDescription>
          </div>
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
            %98 Uyum
          </Badge>
        </CardHeader>

        <CardContent className="flex flex-wrap gap-2">
          {["React", "Three.js", "Tailwind"].map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="bg-accent/60 text-primary font-medium"
            >
              {skill}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Hero Section
   ───────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-subtle-pattern pt-16">
      {/* Gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 size-[500px] rounded-full bg-primary/[0.06] blur-[100px]" />
        <div className="absolute -bottom-24 right-1/4 size-[400px] rounded-full bg-accent/40 blur-[100px]" />
        <div className="absolute top-1/3 right-[10%] size-[300px] rounded-full bg-primary/[0.04] blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center lg:px-8">
        {/* Eyebrow */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm">
          <Sparkles className="size-3.5 text-primary" />
          AI Destekli Takım Eşleştirme Platformu
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Yeteneklerini keşfet,
          <br />
          <span className="text-primary">hayalindeki takımı kur.</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Kivona, AI destekli eşleşme motoru ile GitHub profilini analiz eder, yeteneklerine en uygun takım arkadaşlarını bulur.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            variant="default"
            size="lg"
            className="h-12 px-8 text-base font-semibold"
            render={<Link href="/login" />}
          >
            Hemen Başla
            <ArrowRight className="ml-1 size-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 px-8 text-base font-semibold"
            render={<a href="#how-it-works" />}
          >
            Nasıl Çalışır?
            <ChevronDown className="ml-1 size-4" />
          </Button>
        </div>

        {/* Sample Match Card */}
        <SampleMatchCard />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Features Section
   ───────────────────────────────────────────── */
const FEATURES = [
  {
    icon: Brain,
    title: "AI Profil Analizi",
    description:
      "GitHub repolarını analiz ederek güçlü yönlerini, kullandığın teknolojileri ve etkinliklerdeki ideal rolünü belirler.",
  },
  {
    icon: Users,
    title: "Akıllı Eşleştirme",
    description:
      "Makine öğrenmesi ile takım ihtiyaçlarına en uygun adayları bulur ve uyum skoru hesaplar.",
  },
  {
    icon: Trophy,
    title: "Etkinlik Keşfi",
    description:
      "Devpost, Kaggle ve diğer platformlardaki güncel yarışmaları tek panoda toplar.",
  },
  {
    icon: Kanban,
    title: "Takım Çalışma Alanı",
    description:
      "Kanban panosu, fikir havuzu ve buz kırıcı aktiviteler ile ekip uyumunu hızlandırır.",
  },
];

function FeaturesSection() {
  return (
    <section className="relative bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 text-sm">
            Özellikler
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Kivona ile Neler Yapabilirsin?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Proje ve yarışma yolculuğunun her adımında yanında.
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group border-border/60 transition-all duration-300 hover:shadow-kivona-lg hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-accent">
                    <Icon className="size-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   How It Works Section
   ───────────────────────────────────────────── */
const STEPS = [
  {
    step: "1",
    title: "GitHub ile Giriş Yap",
    description: "Hesabını bağla, profilini otomatik oluştur.",
  },
  {
    step: "2",
    title: "AI Analiz & Eşleşme",
    description:
      "Yapay zeka profilini analiz etsin ve sana en uygun takım arkadaşlarını bulsun.",
  },
  {
    step: "3",
    title: "Takımını Kur",
    description:
      "Eşleştiğin kişilerle takımını oluştur ve etkinliğe katıl.",
  },
];

function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative bg-kivona-surface-low py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 text-sm">
            Adımlar
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Nasıl Çalışır?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Üç basit adımda rüya takımını kur.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          {/* Connecting dashed line (desktop only) */}
          <div className="pointer-events-none absolute top-16 right-[16.67%] left-[16.67%] hidden h-px border-t-2 border-dashed border-border md:block" />

          {STEPS.map((step) => (
            <div key={step.step} className="relative flex flex-col items-center text-center">
              {/* Step number */}
              <div className="relative z-10 flex size-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white shadow-lg shadow-primary/25">
                {step.step}
              </div>

              <h3 className="mt-6 text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 max-w-xs text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CTA Section
   ───────────────────────────────────────────── */
function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-[#1B2540] py-24 lg:py-32">
      {/* Decorative gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Bu maceraya bugün
          <br />
          <span className="text-kivona-blue-dim">bugün başla.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">
          GitHub hesabınla giriş yap, AI profilini oluştursun ve sana en uygun
          takım arkadaşlarını bulsun.
        </p>
        <div className="mt-10">
          <Button
            variant="default"
            size="lg"
            className="h-12 px-8 text-base font-semibold bg-white text-primary hover:bg-white/90"
            render={<Link href="/login" />}
          >
            Hemen Kayıt Ol
            <ArrowRight className="ml-1 size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Footer
   ───────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-border bg-white py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 text-sm text-muted-foreground md:flex-row md:justify-between lg:px-8">
        <p>© 2026 Kivona. Tüm hakları saklıdır.</p>
        <nav className="flex gap-6">
          <a href="#" className="transition-colors hover:text-foreground">
            Hakkımızda
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Gizlilik
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            İletişim
          </a>
        </nav>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   Page
   ───────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CtaSection />
      <Footer />
    </>
  );
}
