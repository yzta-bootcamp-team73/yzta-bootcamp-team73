"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
import { ThemeToggle } from "@/components/shared/theme-toggle";
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

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

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
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-kivona-sm"
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
          <ThemeToggle />
          <Button variant="ghost" size="default" nativeButton={false} render={<Link href="/login" />}>
            Giriş Yap
          </Button>
          <Button variant="default" size="default" nativeButton={false} render={<Link href="/login" />}>
            <Github className="size-4" />
            Başla
          </Button>
        </div>
      </div>
    </nav>
  );
}

import { SampleMatchCard } from "@/components/shared/sample-match-card";

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
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeUp}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm"
        >
          <Sparkles className="size-3.5 text-primary" />
          AI Destekli Takım Eşleştirme Platformu
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial="hidden"
          animate="visible"
          custom={1}
          variants={fadeUp}
          className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          Yeteneklerini keşfet,
          <br />
          <span className="text-primary">hayalindeki takımı kur.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial="hidden"
          animate="visible"
          custom={2}
          variants={fadeUp}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
        >
          Kivona, AI destekli eşleşme motoru ile GitHub profilini analiz eder, yeteneklerine en uygun takım arkadaşlarını bulur.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={3}
          variants={fadeUp}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            variant="default"
            size="lg"
            className="h-12 px-8 text-base font-semibold"
            nativeButton={false}
            render={<Link href="/login" />}
          >
            Hemen Başla
            <ArrowRight className="ml-1 size-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 px-8 text-base font-semibold"
            nativeButton={false}
            render={<a href="#how-it-works" />}
          >
            Nasıl Çalışır?
            <ChevronDown className="ml-1 size-4" />
          </Button>
        </motion.div>

        {/* Sample Match Card */}
        <motion.div initial="hidden" animate="visible" custom={4} variants={fadeUp}>
          <div className="relative mx-auto mt-16 w-full max-w-sm">
            {/* Glow behind card */}
            <div className="absolute -inset-4 rounded-3xl bg-primary/5 blur-2xl" />
            <SampleMatchCard />
          </div>
        </motion.div>
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
          <Badge variant="secondary" className="mb-4 text-sm bg-secondary text-secondary-foreground border-border">
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
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              >
                <Card className="group h-full border-border/60 transition-all duration-300 hover:shadow-kivona-lg hover:-translate-y-1 bg-card">
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
              </motion.div>
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
      className="relative bg-secondary/30 py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 text-sm bg-secondary text-secondary-foreground border-border">
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

          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Step number */}
              <div className="relative z-10 flex size-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground shadow-lg shadow-primary/25">
                {step.step}
              </div>

              <h3 className="mt-6 text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 max-w-xs text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
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
    <section className="relative overflow-hidden bg-primary py-24 lg:py-32">
      {/* Decorative gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-white/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-3xl px-6 text-center lg:px-8"
      >
        <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
          Hayalindeki Takımı
          <br />
          <span className="text-primary-foreground/80">Kivona İle Kur.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-primary-foreground/80">
          GitHub hesabınla giriş yap, AI profilini oluştursun ve sana en uygun
          takım arkadaşlarını bulsun.
        </p>
        <div className="mt-10">
          <Button
            variant="default"
            size="lg"
            className="h-12 px-8 text-base font-semibold bg-background text-foreground hover:bg-background/90"
            nativeButton={false}
            render={<Link href="/login" />}
          >
            Hemen Kayıt Ol
            <ArrowRight className="ml-1 size-4" />
          </Button>
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Footer
   ───────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-border bg-background py-10">
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
