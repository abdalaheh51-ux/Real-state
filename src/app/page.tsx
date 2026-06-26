"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Banknote,
  Calendar,
  Trees,
  Wallet,
  Clock,
  Ruler,
  Crown,
  Users,
  TrendingUp,
  Home as HomeIcon,
  Award,
  Heart,
  ShieldCheck,
  Star,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  CalendarCheck,
  ChevronLeft,
  FileText,
  Sparkles,
  Scale,
  Eye,
  BadgeCheck,
  Quote,
  ArrowLeft,
  Building2,
  Compass,
  ChevronDown,
  Plus,
  Lock,
  Camera,
} from "lucide-react";
import { BookingDialog } from "@/components/booking-dialog";
import { PdfDownloadButton } from "@/components/pdf-download-button";
import { SafeImage } from "@/components/safe-image";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  compounds,
  faqs,
  buyerProfiles,
  trustStats,
  methodology,
  testimonials,
  mapLocations,
  type Compound,
} from "@/lib/compounds-data";
import { cn } from "@/lib/utils";

const iconMap = {
  banknote: Banknote,
  calendar: Calendar,
  trees: Trees,
  wallet: Wallet,
  clock: Clock,
  ruler: Ruler,
  crown: Crown,
  users: Users,
  "trending-up": TrendingUp,
  home: HomeIcon,
  award: Award,
  heart: Heart,
} as const;

const accentMap: Record<
  Compound["accent"],
  {
    ring: string;
    bg: string;
    text: string;
    soft: string;
    dot: string;
    gradient: string;
    softBorder: string;
    glow: string;
  }
> = {
  emerald: {
    ring: "ring-emerald-500/40",
    bg: "bg-emerald-600",
    text: "text-emerald-700",
    soft: "bg-emerald-50",
    dot: "bg-emerald-500",
    gradient: "from-emerald-500 to-emerald-700",
    softBorder: "border-emerald-200",
    glow: "shadow-[0_8px_24px_-8px_oklch(0.55_0.13_162/0.4)]",
  },
  amber: {
    ring: "ring-amber-500/40",
    bg: "bg-amber-500",
    text: "text-amber-700",
    soft: "bg-amber-50",
    dot: "bg-amber-500",
    gradient: "from-amber-400 to-amber-600",
    softBorder: "border-amber-200",
    glow: "shadow-[0_8px_24px_-8px_oklch(0.7_0.15_75/0.4)]",
  },
  teal: {
    ring: "ring-teal-500/40",
    bg: "bg-teal-600",
    text: "text-teal-700",
    soft: "bg-teal-50",
    dot: "bg-teal-500",
    gradient: "from-teal-500 to-teal-700",
    softBorder: "border-teal-200",
    glow: "shadow-[0_8px_24px_-8px_oklch(0.6_0.12_180/0.4)]",
  },
  rose: {
    ring: "ring-rose-500/40",
    bg: "bg-rose-600",
    text: "text-rose-700",
    soft: "bg-rose-50",
    dot: "bg-rose-500",
    gradient: "from-rose-500 to-rose-700",
    softBorder: "border-rose-200",
    glow: "shadow-[0_8px_24px_-8px_oklch(0.65_0.18_15/0.4)]",
  },
  violet: {
    ring: "ring-violet-500/40",
    bg: "bg-violet-600",
    text: "text-violet-700",
    soft: "bg-violet-50",
    dot: "bg-violet-500",
    gradient: "from-violet-500 to-violet-700",
    softBorder: "border-violet-200",
    glow: "shadow-[0_8px_24px_-8px_oklch(0.6_0.14_290/0.4)]",
  },
};

const navLinks = [
  { href: "#comparison", label: "المقارنة" },
  { href: "#compounds", label: "المجمعات" },
  { href: "#testimonials", label: "آراء العملاء" },
  { href: "#profiles", label: "ما يناسبك" },
  { href: "#faq", label: "أسئلة شائعة" },
];

function formatPrice(n: number) {
  return n.toLocaleString("en-US");
}

/* ---------- Animation variants ---------- */
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingCompound, setBookingCompound] = useState<string | undefined>();
  const [view, setView] = useState<"table" | "cards">("cards");
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeMapPin, setActiveMapPin] = useState<string | null>(null);

  useEffect(() => {
    const prefersCards = window.matchMedia("(max-width: 639px)").matches;
    setView(prefersCards ? "cards" : "table");
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(100, (window.scrollY / docHeight) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Best values for highlighting
  const best = useMemo(() => {
    return {
      price: Math.min(...compounds.map((c) => c.pricePerMeter)),
      delivery: "Q1 2026",
      green: Math.max(...compounds.map((c) => c.greenSpacePercent)),
      down: Math.min(...compounds.map((c) => c.downPaymentPercent)),
      years: Math.max(...compounds.map((c) => c.installmentYears)),
      area: Math.min(...compounds.map((c) => c.minArea)),
    };
  }, []);

  function openBooking(compoundId?: string) {
    setBookingCompound(compoundId);
    setBookingOpen(true);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ===== Reading progress bar ===== */}
      <div className="fixed top-0 inset-x-0 z-[60] h-1 pointer-events-none">
        <div
          className="h-full bg-gradient-to-l from-emerald-500 via-emerald-600 to-amber-400 transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* ===== Header ===== */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-background/85 backdrop-blur-xl border-b border-border shadow-soft"
            : "bg-background/60 backdrop-blur-md border-b border-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <a href="#" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative">
              <div className="size-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-[0_4px_12px_-2px_oklch(0.55_0.13_162/0.4)] transition-transform group-hover:scale-105">
                <Building2 className="size-5 text-white" />
              </div>
              <span className="absolute -top-0.5 -left-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background pulse-ring" />
            </div>
            <div className="leading-tight">
              <div className="font-extrabold text-base tracking-tight">Real Estate</div>
              <div className="text-[10px] text-muted-foreground -mt-0.5 flex items-center gap-1">
                <span className="size-1 rounded-full bg-emerald-500" />
                استشارات عقارية محايدة
              </div>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors hover:bg-muted/60"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <MobileNav navLinks={navLinks} onBook={() => openBooking()} />
            <Button
              variant="ghost"
              size="default"
              className="hidden sm:inline-flex text-muted-foreground hover:text-foreground h-11 min-h-11"
              onClick={() => openBooking()}
            >
              <Phone className="size-4" />
              استشارة مجانية
            </Button>
            <Button
              size="default"
              onClick={() => openBooking()}
              className="gap-1.5 h-11 min-h-11 shadow-[0_4px_12px_-2px_oklch(0.45_0.12_162/0.35)]"
            >
              <CalendarCheck className="size-4" />
              احجز الآن
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ===== Hero ===== */}
        <section className="relative overflow-hidden bg-grain">
          <div className="absolute inset-0 bg-mesh-premium pointer-events-none" />
          <div className="absolute inset-0 pattern-grid opacity-50 pointer-events-none" />
          {/* Soft radial glow top-right */}
          <div className="absolute -top-32 -left-32 size-[480px] rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -right-20 size-[420px] rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
          {/* Corner arabesque */}
          <div className="absolute top-10 right-6 size-32 corner-arabesque hidden lg:block opacity-50" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-20 pb-20 sm:pt-28 sm:pb-32">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.div variants={fadeUp} className="mb-8 flex justify-center">
                <span className="eyebrow-line text-xs font-semibold tracking-wide text-primary">
                  <Sparkles className="size-3.5" />
                  دليل 2026 — محدّث في يناير 2026
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-[2rem] leading-[1.18] sm:text-5xl lg:text-[3.75rem] lg:leading-[1.1] font-extrabold tracking-tight text-balance"
              >
                دليلك الشامل للمقارنة بين{" "}
                <span className="text-gradient">أفضل 5 مجمعات سكنية</span>{" "}
                في القاهرة الجديدة لعام 2026
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-10 text-base sm:text-lg text-muted-foreground leading-relaxed text-balance max-w-2xl mx-auto"
              >
                زرت عشرات المواقع وغرقْتَ في التفاصيل؟ خبيرنا العقاري المحايد
                جمع لك كل الأرقام في مكان واحد: متوسط سعر المتر، مواعيد التسليم،
                المساحات الخضراء، وخطط السداد — دون أي لغة بيع مُلحّة.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <PdfDownloadButton
                  size="lg"
                  className="w-full sm:w-auto h-12 min-h-12 text-base shadow-[0_12px_32px_-6px_oklch(0.45_0.12_162/0.55)] hover:shadow-[0_16px_38px_-6px_oklch(0.45_0.12_162/0.65)] hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                />
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-12 min-h-12 text-base gap-2 border-2 border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                  onClick={() => openBooking()}
                >
                  <CalendarCheck className="size-4" />
                  احجز استشارة مجانية مع خبير
                </Button>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground"
              >
                <ShieldCheck className="size-4 text-primary" />
                <span>
                  +4,200 عميل ساعدهم خبيرنا —{" "}
                  <span className="font-medium text-foreground">بدون أي رسوم استشارية</span>
                </span>
              </motion.div>
            </motion.div>

            {/* Trust stats — glass cards */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
            >
              {trustStats.map((stat, i) => {
                const Icon = iconMap[stat.icon as keyof typeof iconMap];
                return (
                  <motion.div
                    key={stat.label}
                    variants={fadeUp}
                    custom={i}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  >
                    <div className="glass rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 h-full">
                      <div className="relative size-12 rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-500/10 flex items-center justify-center shrink-0 ring-1 ring-emerald-500/15">
                        {Icon ? (
                          <Icon className="size-5 text-primary" />
                        ) : (
                          <Clock className="size-5 text-primary" />
                        )}
                      </div>
                      <div className="text-right flex-1 min-w-0">
                        <div className="text-2xl sm:text-3xl font-extrabold tabular leading-none text-foreground">
                          {stat.value}
                        </div>
                        <div className="text-[11px] sm:text-xs text-muted-foreground mt-1.5 leading-tight">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Bottom fade into next section */}
          <div className="absolute inset-x-0 bottom-0 h-px divider-fade" />
        </section>

        {/* ===== Hero cinematic showcase image ===== */}
        <section className="relative pb-16 sm:pb-24">
          <motion.div
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative mx-auto max-w-7xl px-4 sm:px-6 -mt-16 sm:-mt-24 z-20"
          >
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-pop ring-1 ring-border/60 group">
              <div className="aspect-[16/8] sm:aspect-[16/6] relative">
                <SafeImage
                  src="/images/hero-aerial.png"
                  alt="عرض جوي لمجمع سكني فاخر في القاهرة الجديدة"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  fallbackGradient="from-emerald-800 via-teal-900 to-emerald-950"
                />
                {/* Stronger gradient overlays for depth + text legibility + blend with hero */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/15 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-l from-emerald-950/40 via-transparent to-amber-950/20" />
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/60 to-transparent" />
                {/* caption */}
                <div className="absolute bottom-0 inset-x-0 p-5 sm:p-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                  <div className="text-white">
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-white/15 backdrop-blur-md rounded-full px-2.5 py-1 mb-2 ring-1 ring-white/20">
                      <MapPin className="size-3" />
                      القاهرة الجديدة — التجمع الخامس
                    </div>
                    <div className="text-lg sm:text-2xl font-extrabold drop-shadow-sm">
                      حيث تلتقي الفخامة بالاستثمار الذكي
                    </div>
                    <div className="text-xs sm:text-sm text-white/80 mt-1 max-w-md">
                      أكثر من 50 مشروعاً قيد التطوير في المنطقة — اخترنا لك أفضل 5
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-white/90 text-xs">
                    <Camera className="size-4" />
                    <span>عرض جوي حقيقي</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ===== Expert positioning strip ===== */}
        <section className="bg-gradient-to-b from-background to-muted/30 border-b border-border/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-right">
              <div className="flex items-center gap-3.5 shrink-0">
                <div className="size-14 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-amber-400/10 flex items-center justify-center ring-1 ring-emerald-500/15">
                  <Scale className="size-7 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-base">دورنا: المستشار لا البائع</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    نرشّح الأنسب لك، لا الأعلى عمولة لنا
                  </div>
                </div>
              </div>
              <Separator
                orientation="vertical"
                className="hidden md:block h-14 bg-border-strong"
              />
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 max-w-2xl">
                لا نبيعك وحدتنا، بل نبحث معك عن الوحدة الأنسب لميزانيتك وغرضك.
                عمولتنا تأتي من المطوّر بعد البيع، أما نصيحتك فمجانية دائماً —
                حتى لو لم تشترِ شيئاً.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 shrink-0">
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-gradient tabular leading-none">
                    15
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">عاماً خبرة</div>
                </div>
                <div className="size-8 w-px bg-border-strong" />
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-gradient tabular leading-none">
                    3
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">خبراء يراجعون</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Comparison Table ===== */}
        <section id="comparison" className="scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="eyebrow-line text-xs font-semibold tracking-wide text-primary mb-4 justify-center">
                <Scale className="size-3.5" />
                المقارنة الحاسمة
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight text-balance mt-4">
                5 مجمعات. 6 معايير.{" "}
                <span className="text-gradient">مقارنة واحدة صادقة.</span>
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                القيم المُظلَّلة بالأخضر هي الأفضل في كل معيار (أقل سعر، أقرب تسليم،
                أعلى مساحات خضراء...). على الجوال يُفضَّل عرض البطاقات؛ في الجدول
                اسحب للتمرير يميناً ويساراً.
              </p>
            </div>

            <div className="flex justify-center mb-8">
              <Tabs
                value={view}
                onValueChange={(v) => setView(v as "table" | "cards")}
              >
                <TabsList className="bg-muted/60 border border-border/60">
                  <TabsTrigger value="table" className="gap-1.5">
                    <Scale className="size-3.5" />
                    عرض جدول
                  </TabsTrigger>
                  <TabsTrigger value="cards" className="gap-1.5">
                    <Building2 className="size-3.5" />
                    عرض بطاقات
                    <span className="sm:hidden text-[9px] font-bold bg-primary/15 text-primary px-1.5 py-0.5 rounded-full">
                      مُفضّل
                    </span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {view === "table" ? (
              <div className="relative">
                <Card className="overflow-hidden border-border/60 shadow-card rounded-2xl">
                  <div className="overflow-x-auto scroll-elegant">
                    <table className="w-full text-sm border-collapse min-w-[820px]">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="sticky right-0 z-20 bg-card backdrop-blur-sm text-right p-4 font-semibold border-b border-border/60 min-w-[210px] sticky-edge-left">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Compass className="size-4 text-primary" />
                              <span className="text-xs uppercase tracking-wider">المعيار</span>
                            </div>
                          </th>
                          {compounds.map((c) => {
                            const accent = accentMap[c.accent];
                            return (
                              <th
                                key={c.id}
                                className="p-4 text-center border-b border-border/60 min-w-[150px] align-top bg-card"
                              >
                                <div className="flex flex-col items-center gap-2">
                                  <div
                                    className={cn(
                                      "size-12 rounded-xl flex items-center justify-center text-white font-extrabold text-lg bg-gradient-to-br shadow-md",
                                      accent.gradient
                                    )}
                                  >
                                    {c.name.charAt(0)}
                                  </div>
                                  <div className="font-bold text-foreground text-sm leading-tight">
                                    {c.name}
                                  </div>
                                  <div className="text-[10px] text-muted-foreground leading-tight">
                                    {c.developer}
                                  </div>
                                  <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/60 px-2 py-0.5">
                                    <Star className="size-3 fill-amber-400 text-amber-400" />
                                    <span className="text-[10px] font-bold tabular text-amber-700">
                                      {c.rating.toFixed(1)}
                                    </span>
                                  </div>
                                </div>
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        <ComparisonRow
                          label="متوسط سعر المتر"
                          unit="ج.م"
                          icon={Banknote}
                          isBest={(c) => c.pricePerMeter === best.price}
                          render={(c) => formatPrice(c.pricePerMeter)}
                        />
                        <ComparisonRow
                          label="موعد التسليم"
                          unit=""
                          icon={Calendar}
                          isBest={(c) => c.deliveryQuarter === best.delivery}
                          render={(c) => c.deliveryDate}
                        />
                        <ComparisonRow
                          label="المساحات الخضراء"
                          unit="%"
                          icon={Trees}
                          isBest={(c) => c.greenSpacePercent === best.green}
                          render={(c) => `${c.greenSpacePercent}%`}
                        />
                        <ComparisonRow
                          label="المقدم"
                          unit="%"
                          icon={Wallet}
                          isBest={(c) => c.downPaymentPercent === best.down}
                          render={(c) => `${c.downPaymentPercent}%`}
                        />
                        <ComparisonRow
                          label="سنوات السداد"
                          unit="سنة"
                          icon={Clock}
                          isBest={(c) => c.installmentYears === best.years}
                          render={(c) => `${c.installmentYears} سنة`}
                        />
                        <ComparisonRow
                          label="المساحات المتاحة"
                          unit="م²"
                          icon={Ruler}
                          isBest={(c) => c.minArea === best.area}
                          render={(c) => `${c.minArea} - ${c.maxArea} م²`}
                        />
                        <ComparisonRow
                          label="الموقع"
                          unit=""
                          icon={MapPin}
                          isBest={() => false}
                          render={(c) => (
                            <span className="text-xs leading-snug">{c.location}</span>
                          )}
                        />
                        <ComparisonRow
                          label="الأفضل لـ"
                          unit=""
                          icon={BadgeCheck}
                          isBest={() => false}
                          render={(c) => (
                            <span className="text-xs font-medium text-primary">
                              {c.bestFor}
                            </span>
                          )}
                        />
                      </tbody>
                      <tfoot>
                        <tr>
                          <td className="sticky right-0 z-10 bg-card p-3 border-t-2 border-border/60 sticky-edge-left" />
                          {compounds.map((c) => (
                            <td
                              key={c.id}
                              className="p-3 text-center border-t-2 border-border/60 bg-card"
                            >
                              <Button
                                size="default"
                                variant="outline"
                                className="w-full min-h-11 h-11 gap-1.5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors active:scale-[0.98]"
                                onClick={() => openBooking(c.id)}
                              >
                                <CalendarCheck className="size-3.5" />
                                استشارة
                              </Button>
                            </td>
                          ))}
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </Card>

                {/* Mobile scroll hint — pulsing arrow */}
                <div className="sm:hidden mt-3 flex items-center justify-center gap-2 text-[11px] font-medium text-primary bg-primary/8 border border-primary/20 rounded-full py-1.5 px-3 w-fit mx-auto animate-pulse-slow">
                  <ChevronLeft className="size-3.5" />
                  <span>اسحب للتمرير يميناً ويساراً</span>
                  <ChevronLeft className="size-3.5 rotate-180" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {compounds.map((c, i) => {
                  const accent = accentMap[c.accent];
                  return (
                    <motion.div
                      key={c.id}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-60px" }}
                      variants={fadeUp}
                      custom={i}
                    >
                      <Card
                        className={cn(
                          "overflow-hidden border border-border/60 card-lift h-full rounded-2xl",
                          "hover:border-primary/40"
                        )}
                      >
                        <div className={cn("h-1.5 bg-gradient-to-r", accent.gradient)} />
                        {/* Compound image */}
                        <div className="relative h-36 overflow-hidden">
                          <SafeImage
                            src={c.image}
                            alt={`صورة ${c.name}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 hover:scale-105"
                            fallbackGradient={accent.gradient}
                          />
                          <div
                            className={cn(
                              "absolute inset-0 bg-gradient-to-t opacity-40 mix-blend-multiply",
                              accent.gradient
                            )}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          <div className="absolute top-2.5 right-2.5">
                            <span className="inline-flex items-center gap-1 text-[9px] font-medium bg-white/85 backdrop-blur-sm text-foreground rounded-full px-1.5 py-0.5">
                              <Camera className="size-2.5" />
                              صورة
                            </span>
                          </div>
                        </div>
                        <CardContent className="p-5 space-y-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "size-12 rounded-xl flex items-center justify-center text-white font-extrabold text-lg bg-gradient-to-br shadow-md",
                                  accent.gradient
                                )}
                              >
                                {c.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold leading-tight">{c.name}</div>
                                <div className="text-[11px] text-muted-foreground mt-0.5">
                                  {c.developer}
                                </div>
                              </div>
                            </div>
                            <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/60 px-2 py-0.5">
                              <Star className="size-3 fill-amber-400 text-amber-400" />
                              <span className="text-xs font-bold tabular text-amber-700">
                                {c.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <Stat
                              icon={Banknote}
                              label="سعر المتر"
                              value={`${formatPrice(c.pricePerMeter)} ج.م`}
                              highlight={c.pricePerMeter === best.price}
                            />
                            <Stat
                              icon={Calendar}
                              label="التسليم"
                              value={c.deliveryDate}
                              highlight={c.deliveryQuarter === best.delivery}
                            />
                            <Stat
                              icon={Trees}
                              label="أخضر"
                              value={`${c.greenSpacePercent}%`}
                              highlight={c.greenSpacePercent === best.green}
                            />
                            <Stat
                              icon={Wallet}
                              label="مقدم"
                              value={`${c.downPaymentPercent}%`}
                              highlight={c.downPaymentPercent === best.down}
                            />
                            <Stat
                              icon={Clock}
                              label="سداد"
                              value={`${c.installmentYears} سنة`}
                              highlight={c.installmentYears === best.years}
                            />
                            <Stat
                              icon={Ruler}
                              label="المساحة"
                              value={`${c.minArea}-${c.maxArea}م²`}
                            />
                          </div>

                          <div className="flex items-center gap-1.5 text-xs font-medium bg-primary/5 border border-primary/15 rounded-lg px-3 py-2.5">
                            <BadgeCheck className="size-4 shrink-0 text-primary" />
                            <span className="text-primary">{c.bestFor}</span>
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full gap-1.5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                            onClick={() => openBooking(c.id)}
                          >
                            <CalendarCheck className="size-3.5" />
                            احجز استشارة لهذا المجمع
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}

            <div className="mt-8 flex items-center justify-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1.5">
                <Crown className="size-3.5 text-primary" />
                <span className="font-medium text-primary">الأفضل</span>
                <span className="text-muted-foreground">= المتميّز في المعيار</span>
              </span>
              <span className="text-muted-foreground/60">•</span>
              <span>الأسعار محدّثة في يناير 2026 وقابلة للتحقق</span>
            </div>
          </div>
        </section>

        {/* ===== Methodology ===== */}
        <section
          id="methodology"
          className="scroll-mt-20 bg-gradient-to-b from-muted/30 to-background border-y border-border/60 relative overflow-hidden"
        >
          <div className="absolute inset-0 pattern-dots opacity-30 pointer-events-none" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="eyebrow-line text-xs font-semibold tracking-wide text-primary mb-4 justify-center">
                <Eye className="size-3.5" />
                الشفافية أولاً
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight text-balance mt-4">
                كيف نقيّم المجمعات؟{" "}
                <span className="text-gradient">منهجية مكشوفة</span>
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                لا نعتمد على التسويق، بل على بيانات ميدانية يجمعها فريقنا أسبوعياً
                ويراجعها 3 خبراء مستقلين.
              </p>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Connecting line (RTL-aware) — appears on md+ */}
              <div className="hidden md:block absolute top-[60px] right-[16.66%] left-[16.66%] h-px bg-gradient-to-l from-transparent via-primary/30 to-transparent" />

              {methodology.map((m, idx) => (
                <motion.div
                  key={m.step}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  variants={fadeUp}
                  custom={idx}
                  className="relative"
                >
                  <Card className="h-full border-border/60 hover:border-primary/40 transition-colors rounded-2xl shadow-card hover:shadow-hover">
                    <CardContent className="p-6 sm:p-7">
                      <div className="flex items-start justify-between mb-5">
                        <div className="relative">
                          <div className="size-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-extrabold text-lg shadow-glow">
                            {m.step}
                          </div>
                        </div>
                        <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/15">
                          {idx === 0 && <MapPin className="size-5 text-primary" />}
                          {idx === 1 && <Scale className="size-5 text-primary" />}
                          {idx === 2 && <ShieldCheck className="size-5 text-primary" />}
                        </div>
                      </div>
                      <h3 className="font-bold text-lg mb-2 leading-tight">{m.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {m.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Founder pull-quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="mt-12 relative"
            >
              <div className="relative rounded-3xl border border-border/60 bg-card p-7 sm:p-9 shadow-card overflow-hidden">
                <Quote className="absolute top-6 left-6 size-16 text-primary/8 -scale-x-100" />
                <div className="relative flex flex-col sm:flex-row items-start gap-5">
                  <div className="size-16 rounded-full bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center text-white font-extrabold text-xl shrink-0 shadow-glow">
                    ك.ع
                  </div>
                  <div className="flex-1">
                    <p className="text-lg sm:text-xl leading-relaxed font-medium text-foreground">
                      «نحن لا نبيع وحدات، نبيع{" "}
                      <span className="text-gradient">القرار الصحيح</span>. لو رشحنا
                      لك مجمعاً بناءً على عمولتنا بدلاً من مصلحتك — ستفقد الثقة ولن
                      تعود. هذه معادلتنا البسيطة.»
                    </p>
                    <div className="mt-5 flex items-center gap-3">
                      <div className="h-px w-12 bg-primary/40" />
                      <div>
                        <div className="font-bold text-sm">م. كريم عبد الله</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          مؤسس Real Estate
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== Compound detailed cards ===== */}
        <section id="compounds" className="scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="eyebrow-line text-xs font-semibold tracking-wide text-primary mb-4 justify-center">
                <Building2 className="size-3.5" />
                التفاصيل الكاملة
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight text-balance mt-4">
                ماذا يقدّم كل مجمع{" "}
                <span className="text-gradient">فعلياً؟</span>
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                لكل مشروع شخصيته. هذه بطاقة مختصرة بكل ما تحتاج معرفته قبل أن
                تدفع مقدماً واحداً.
              </p>
            </div>

            <div className="space-y-6">
              {compounds.map((c, idx) => {
                const accent = accentMap[c.accent];
                return (
                  <motion.div
                    key={c.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={fadeUp}
                    custom={idx}
                  >
                    <Card className="overflow-hidden border-border/60 card-lift rounded-2xl">
                      {/* Gradient header band */}
                      <div
                        className={cn(
                          "relative h-2 bg-gradient-to-r",
                          accent.gradient
                        )}
                      />
                      <CardContent className="p-0">
                        <div className="flex flex-col lg:flex-row">
                          {/* Identity column */}
                          <div className="lg:w-80 shrink-0 p-6 sm:p-7 lg:border-l border-border/60 bg-muted/20">
                            {/* Compound image */}
                            <div className="relative h-44 sm:h-48 rounded-xl overflow-hidden mb-5 ring-1 ring-border/60 group/img">
                              <SafeImage
                                src={c.image}
                                alt={`صورة ${c.name}`}
                                fill
                                sizes="(max-width: 1024px) 100vw, 320px"
                                className="object-cover transition-transform duration-700 group-hover/img:scale-105"
                                fallbackGradient={accent.gradient}
                              />
                              <div
                                className={cn(
                                  "absolute inset-0 bg-gradient-to-t opacity-50 mix-blend-multiply",
                                  accent.gradient
                                )}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                              <div className="absolute top-3 right-3">
                                <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-white/85 backdrop-blur-sm text-foreground rounded-full px-2 py-0.5 ring-1 ring-white/40">
                                  <Camera className="size-2.5" />
                                  صورة للمشروع
                                </span>
                              </div>
                              <div className="absolute bottom-2.5 left-3 text-white text-[10px] font-medium opacity-90 drop-shadow">
                                {c.location}
                              </div>
                            </div>
                            <div className="flex items-center gap-3.5">
                              <div
                                className={cn(
                                  "size-16 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl bg-gradient-to-br shadow-md",
                                  accent.gradient
                                )}
                              >
                                {c.name.charAt(0)}
                              </div>
                              <div>
                                <h3 className="font-extrabold text-xl leading-tight">
                                  {c.name}
                                </h3>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {c.developer}
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200/60 px-3 py-1">
                              <Star className="size-3.5 fill-amber-400 text-amber-400" />
                              <span className="text-sm font-bold tabular text-amber-700">
                                {c.rating.toFixed(1)}
                              </span>
                              <span className="text-[10px] text-amber-700/70">/ 5</span>
                            </div>

                            <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                              <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                              <span className="leading-snug">{c.location}</span>
                            </div>

                            {/* Pull-quote highlight */}
                            <div
                              className={cn(
                                "mt-5 rounded-xl px-4 py-3 text-sm font-medium border-r-2 leading-relaxed",
                                accent.soft,
                                accent.text,
                                "border-r-current"
                              )}
                            >
                              {c.highlight}
                            </div>

                            <Button
                              variant="outline"
                              className="w-full gap-1.5 mt-5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                              onClick={() => openBooking(c.id)}
                            >
                              <CalendarCheck className="size-4" />
                              استشر عن هذا المجمع
                            </Button>
                          </div>

                          {/* Details column */}
                          <div className="flex-1 p-6 sm:p-7">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              <MiniStat
                                icon={Banknote}
                                label="سعر المتر"
                                value={`${formatPrice(c.pricePerMeter)}`}
                                unit="ج.م"
                                best={c.pricePerMeter === best.price}
                              />
                              <MiniStat
                                icon={Calendar}
                                label="التسليم"
                                value={c.deliveryDate}
                                best={c.deliveryQuarter === best.delivery}
                              />
                              <MiniStat
                                icon={Trees}
                                label="مساحات خضراء"
                                value={`${c.greenSpacePercent}%`}
                                best={c.greenSpacePercent === best.green}
                              />
                              <MiniStat
                                icon={Wallet}
                                label="المقدم"
                                value={`${c.downPaymentPercent}%`}
                                best={c.downPaymentPercent === best.down}
                              />
                              <MiniStat
                                icon={Clock}
                                label="سنوات السداد"
                                value={`${c.installmentYears}`}
                                unit="سنة"
                                best={c.installmentYears === best.years}
                              />
                              <MiniStat
                                icon={Building2}
                                label="عدد الوحدات"
                                value={`${formatPrice(c.totalUnits)}`}
                                unit="وحدة"
                              />
                            </div>

                            <div className="mt-6">
                              <div className="text-xs font-semibold text-muted-foreground mb-2.5 flex items-center gap-1.5">
                                <BadgeCheck className="size-3.5 text-primary" />
                                المميزات الرئيسية
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {c.amenities.map((a) => (
                                  <span
                                    key={a}
                                    className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-card px-3 py-1 text-xs font-medium transition-colors hover:border-primary/40 hover:bg-primary/5"
                                  >
                                    <CheckCircle2 className="size-3 text-primary" />
                                    {a}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Expert verdict — high-contrast editorial sidebar */}
                            <div className="mt-6 relative rounded-xl bg-emerald-50/80 border border-emerald-200/60 p-4 pl-5 bar-accent">
                              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 mb-1.5">
                                <div className="size-5 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0">
                                  <Sparkles className="size-3" />
                                </div>
                                رأي الخبير
                              </div>
                              <p className="text-sm font-medium leading-relaxed text-emerald-950">
                                {c.verdict}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== Interactive locations map ===== */}
        <section className="bg-gradient-to-b from-muted/30 to-background border-y border-border/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="eyebrow-line text-xs font-semibold tracking-wide text-primary mb-3 inline-flex">
                <MapPin className="size-3.5" />
                خريطة المواقع
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-balance">
                أين تقع المجمعات الخمسة؟
              </h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                نظرة جغرافية سريعة على توزيع المشاريع في القاهرة الجديدة. اضغط على
                أي نقطة لرؤية اسم المجمع ومنطقته.
              </p>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
            >
              <Card className="overflow-hidden border-border/60 shadow-card rounded-2xl">
                <CardContent className="p-0">
                  <div className="relative aspect-[16/10] sm:aspect-[16/8] bg-gradient-to-br from-emerald-50 via-background to-amber-50/40 overflow-hidden">
                    {/* Stylized map background — roads + districts */}
                    <svg
                      className="absolute inset-0 w-full h-full"
                      viewBox="0 0 100 62.5"
                      preserveAspectRatio="none"
                      aria-hidden
                    >
                      {/* Grid lines representing districts */}
                      <g stroke="oklch(0.45 0.12 162 / 0.08)" strokeWidth="0.2">
                        {[15, 30, 45, 60, 75, 90].map((x) => (
                          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="62.5" />
                        ))}
                        {[12, 24, 36, 48].map((y) => (
                          <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} />
                        ))}
                      </g>
                      {/* Main roads (ring road + main axes) */}
                      <g fill="none" stroke="oklch(0.45 0.12 162 / 0.18)" strokeWidth="0.8" strokeLinecap="round">
                        <path d="M5 18 Q40 14 70 20 Q90 24 96 32" />
                        <path d="M10 50 Q35 46 55 52 Q78 56 95 50" />
                        <path d="M30 5 Q32 30 28 55" />
                        <path d="M62 5 Q60 28 64 58" />
                      </g>
                      {/* Green patches (parks) */}
                      <g fill="oklch(0.55 0.13 162 / 0.10)">
                        <ellipse cx="38" cy="38" rx="8" ry="5" />
                        <ellipse cx="72" cy="48" rx="6" ry="4" />
                        <ellipse cx="20" cy="30" rx="5" ry="3.5" />
                      </g>
                      {/* Water bodies */}
                      <g fill="oklch(0.6 0.1 200 / 0.12)">
                        <ellipse cx="48" cy="20" rx="4" ry="2.5" />
                        <ellipse cx="80" cy="40" rx="3.5" ry="2" />
                      </g>
                    </svg>

                    {/* Location pins */}
                    {mapLocations.map((loc) => {
                      const accent = accentMap[loc.accent];
                      const isActive = activeMapPin === loc.compoundId;
                      return (
                        <button
                          key={loc.compoundId}
                          type="button"
                          aria-label={`${loc.name} — ${loc.area}`}
                          aria-pressed={isActive}
                          onClick={() =>
                            setActiveMapPin((prev) =>
                              prev === loc.compoundId ? null : loc.compoundId
                            )
                          }
                          className="group/pin absolute -translate-x-1/2 -translate-y-1/2 z-10 touch-manipulation"
                          style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                        >
                          {/* Pulse ring */}
                          <span
                            className={cn(
                              "absolute inset-0 rounded-full opacity-40 animate-ping-slow",
                              accent.bg,
                              isActive && "opacity-60"
                            )}
                          />
                          {/* Pin */}
                          <div
                            className={cn(
                              "relative size-9 sm:size-10 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg ring-2 ring-white cursor-pointer transition-transform group-hover/pin:scale-125 active:scale-110",
                              accent.bg,
                              isActive && "scale-125 ring-primary"
                            )}
                          >
                            <MapPin className="size-4 sm:size-4" />
                          </div>
                          {/* Tooltip label — hover + tap */}
                          <div
                            className={cn(
                              "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 transition-opacity z-20 pointer-events-none",
                              isActive
                                ? "opacity-100"
                                : "opacity-0 group-hover/pin:opacity-100"
                            )}
                          >
                            <div className="bg-foreground text-background text-xs font-semibold rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg">
                              {loc.name}
                              <div className="text-[10px] font-normal text-background/70">
                                {loc.area}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}

                    {/* Legend — collapsible on small screens */}
                    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 max-w-[42%] sm:max-w-none bg-background/85 backdrop-blur-md rounded-xl border border-border/60 p-2 sm:p-3 shadow-soft">
                      <div className="text-[10px] font-bold text-muted-foreground mb-1.5">
                        المجمعات
                      </div>
                      <div className="flex flex-col gap-1">
                        {mapLocations.map((loc) => {
                          const accent = accentMap[loc.accent];
                          return (
                            <div
                              key={loc.compoundId}
                              className="flex items-center gap-1.5 text-[10px] sm:text-xs"
                            >
                              <span className={cn("size-2 rounded-full", accent.dot)} />
                              <span className="text-foreground/80">{loc.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Compass */}
                    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 size-10 rounded-full bg-background/85 backdrop-blur-md border border-border/60 flex items-center justify-center shadow-soft">
                      <Compass className="size-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                خريطة توضيحية للمواقع النسبية — للتوجيه الإرشادي فقط
              </p>
            </motion.div>
          </div>
        </section>

        {/* ===== Testimonials ===== */}
        <section id="testimonials" className="scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="eyebrow-line text-xs font-semibold tracking-wide text-primary mb-3 inline-flex">
                <Heart className="size-3.5" />
                عملاء راضون
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-balance">
                ماذا قال من سبقوك؟
              </h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                تجارب حقيقية من عملاء استعانوا بخبرائنا لاتخاذ قرارهم العقاري.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {testimonials.map((t, i) => {
                const accent = accentMap[t.accent];
                return (
                  <motion.div
                    key={t.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={fadeUp}
                    custom={i}
                  >
                    <Card className="h-full border-border/60 card-lift rounded-2xl flex flex-col">
                      <CardContent className="p-6 flex flex-col flex-1 gap-4">
                        {/* Quote mark + rating */}
                        <div className="flex items-start justify-between">
                          <Quote className={cn("size-8 opacity-20", accent.text)} />
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={cn(
                                  "size-3.5",
                                  s <= Math.floor(t.rating)
                                    ? "fill-amber-400 text-amber-400"
                                    : "fill-muted text-muted-foreground/30"
                                )}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Quote text */}
                        <p className="text-sm sm:text-base leading-relaxed text-foreground/90 flex-1">
                          «{t.quote}»
                        </p>

                        {/* Author */}
                        <div className="flex items-center gap-3 pt-3 border-t border-border/60">
                          <div
                            className={cn(
                              "size-11 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br shrink-0",
                              accent.gradient
                            )}
                          >
                            {t.initials}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-sm leading-tight">
                              {t.name}
                            </div>
                            <div className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                              {t.role}
                            </div>
                          </div>
                          <BadgeCheck className={cn("size-4 ml-auto shrink-0", accent.text)} />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Trust summary strip */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Award className="size-4 text-primary" />
                <span className="font-bold text-foreground tabular">94%</span> رضا العملاء
              </span>
              <span className="flex items-center gap-2">
                <Users className="size-4 text-primary" />
                <span className="font-bold text-foreground tabular">+4,200</span> عميل ساعدناهم
              </span>
              <span className="flex items-center gap-2">
                <Heart className="size-4 text-primary" />
                <span className="font-bold text-foreground tabular">4.9/5</span> متوسط التقييم
              </span>
            </div>
          </div>
        </section>

        {/* ===== Buyer profiles / recommendation ===== */}
        <section
          id="profiles"
          className="scroll-mt-20 bg-gradient-to-b from-muted/30 to-background border-y border-border/60"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="eyebrow-line text-xs font-semibold tracking-wide text-primary mb-4 justify-center">
                <Users className="size-3.5" />
                ماذا يناسبك أنت؟
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight text-balance mt-4">
                اختر نوع المشتري{" "}
                <span className="text-gradient">الذي يشبهك</span>
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                لا يوجد مجمع «الأفضل» مطلقاً، بل الأفضل لظروفك. ابحث عن نفسك هنا.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {buyerProfiles.map((p, i) => {
                const recommended = compounds.find(
                  (c) => c.id === p.recommendedId
                )!;
                const Icon = iconMap[p.icon as keyof typeof iconMap] ?? HomeIcon;
                const accent = accentMap[recommended.accent];
                return (
                  <motion.div
                    key={p.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={fadeUp}
                    custom={i}
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  >
                    <Card className="border-border/60 shadow-card hover:shadow-hover transition-shadow h-full flex flex-col rounded-2xl overflow-hidden">
                      <CardContent className="p-5 flex flex-col flex-1 gap-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="size-12 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-amber-400/10 flex items-center justify-center ring-1 ring-primary/15">
                              <Icon className="size-6 text-primary" />
                            </div>
                          </div>
                          <h3 className="font-bold text-base leading-tight">
                            {p.title}
                          </h3>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {p.description}
                        </p>

                        <div className="mt-auto pt-4 border-t border-dashed border-border/70">
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                            <Crown className="size-3 text-amber-500" />
                            ننصحك بـ
                          </div>
                          <div className="flex items-center gap-2.5 mb-2.5 group">
                            <div
                              className={cn(
                                "size-9 rounded-lg flex items-center justify-center text-white text-sm font-extrabold bg-gradient-to-br shadow-sm transition-transform group-hover:scale-105",
                                accent.gradient
                              )}
                            >
                              {recommended.name.charAt(0)}
                            </div>
                            <span className="font-bold text-sm leading-tight">
                              {recommended.name}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-snug">
                            {p.reason}
                          </p>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="w-full mt-4 gap-1 text-primary hover:text-primary hover:bg-primary/10 group/btn"
                            onClick={() => openBooking(recommended.id)}
                          >
                            احصل على تقييم مخصص
                            <ArrowLeft className="size-3.5 transition-transform group-hover/btn:-translate-x-0.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section id="faq" className="scroll-mt-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24">
            <div className="text-center mb-12">
              <span className="eyebrow-line text-xs font-semibold tracking-wide text-primary mb-4 justify-center">
                <ShieldCheck className="size-3.5" />
                أسئلة قد تشغل بالك
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight text-balance mt-4">
                قبل أن تسأل،{" "}
                <span className="text-gradient">أجبنا</span>
              </h2>
            </div>

            <Accordion
              type="single"
              collapsible
              className="w-full space-y-3"
            >
              {faqs.map((faq, idx) => (
                <AccordionItem
                  key={idx}
                  value={`item-${idx}`}
                  className="border border-border/60 rounded-2xl px-5 bg-card shadow-soft data-[state=open]:shadow-card data-[state=open]:border-primary/30 transition-shadow"
                >
                  <AccordionTrigger className="text-right text-base sm:text-lg font-bold hover:no-underline py-5 gap-3 [&>svg]:hidden">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="size-7 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Plus className="size-4 transition-transform accordion-only-plus" />
                      </span>
                      <span className="flex-1 text-right">{faq.q}</span>
                      <ChevronDown className="size-4 text-muted-foreground transition-transform duration-300 [[data-state=open]_&]:rotate-180" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm sm:text-base text-muted-foreground leading-relaxed pt-0 pb-5 px-10">
                    <div className="divider-fade mb-4" />
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* ===== Final CTA ===== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 text-primary-foreground">
          <div className="absolute inset-0 opacity-[0.12] pattern-dots pointer-events-none" />
          <div className="absolute inset-0 bg-grain pointer-events-none" />
          {/* Glow orbs */}
          <div className="absolute -top-24 -right-24 size-96 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-24 size-96 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />

          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-24 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 px-3.5 py-1.5 text-xs font-medium backdrop-blur-sm">
                <FileText className="size-3.5" />
                الخطوة الأخيرة
              </span>
              <h2 className="mt-6 text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance leading-[1.1]">
                توقف عن التشتت.
                <br />
                <span className="bg-gradient-to-l from-amber-200 to-amber-400 bg-clip-text text-transparent">
                  ابدأ بقرار واعٍ.
                </span>
              </h2>
              <p className="mt-6 text-primary-foreground/85 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed text-balance">
                حمّل الملف الشامل (12 صفحة) بكل التفاصيل والأرقام، أو احجز
                استشارة مجانية مع خبير يسمع ظروفك ويوصي بالأنسب — دون أي التزام.
              </p>

              {/* Countdown timer */}
              <CountdownTimer />

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                <PdfDownloadButton
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto h-12 text-base text-primary shadow-[0_8px_24px_-6px_oklch(0.985_0.01_95/0.4)]"
                />
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-12 text-base gap-2 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground hover:border-primary-foreground/50 transition-all"
                  onClick={() => openBooking()}
                >
                  <CalendarCheck className="size-4" />
                  احجز استشارة مجانية
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm text-primary-foreground/80">
                <span className="flex items-center gap-2">
                  <span className="size-7 rounded-full bg-primary-foreground/15 flex items-center justify-center">
                    <ShieldCheck className="size-3.5" />
                  </span>
                  بدون رسوم استشارية
                </span>
                <span className="flex items-center gap-2">
                  <span className="size-7 rounded-full bg-primary-foreground/15 flex items-center justify-center">
                    <Clock className="size-3.5" />
                  </span>
                  رد خلال 24 ساعة
                </span>
                <span className="flex items-center gap-2">
                  <span className="size-7 rounded-full bg-primary-foreground/15 flex items-center justify-center">
                    <BadgeCheck className="size-3.5" />
                  </span>
                  توصية مبنية على ملفك أنت
                </span>
                <span className="flex items-center gap-2">
                  <span className="size-7 rounded-full bg-primary-foreground/15 flex items-center justify-center">
                    <Lock className="size-3.5" />
                  </span>
                  بياناتك سرية بالكامل
                </span>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ===== Footer ===== */}
      <footer className="relative bg-foreground text-background/90 mt-auto">
        <div className="h-1 bg-gradient-to-l from-emerald-500 via-amber-400 to-emerald-500" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-md">
                  <Building2 className="size-5 text-white" />
                </div>
                <div>
                  <div className="font-extrabold text-base text-background">
                    Real Estate
                  </div>
                  <div className="text-[10px] text-background/60 -mt-0.5">
                    استشارات عقارية محايدة
                  </div>
                </div>
              </div>
              <p className="text-sm text-background/70 leading-relaxed max-w-md">
                مستشار عقاري محايد في سوق القاهرة الجديدة منذ 2011. نساعدك على
                اتخاذ قرار الشراء الصحيح دون أي ضغط بيعي، فعمولتنا من المطوّر
                لكنّ نصيحتنا لك.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/20 px-3 py-1 text-[11px] text-emerald-300">
                  <span className="size-1.5 rounded-full bg-emerald-400 pulse-ring" />
                  متاح للاستشارة الآن
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 px-3 py-1 text-[11px] text-amber-300">
                  <Award className="size-3" />
                  15 عاماً خبرة
                </span>
              </div>
            </div>

            <div>
              <div className="font-bold mb-4 text-background text-sm uppercase tracking-wider">
                روابط سريعة
              </div>
              <ul className="space-y-2.5 text-sm">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="text-background/70 hover:text-background transition-colors inline-flex items-center gap-2 group"
                    >
                      <span className="size-1 rounded-full bg-primary transition-transform group-hover:scale-150" />
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="font-bold mb-4 text-background text-sm uppercase tracking-wider">
                تواصل معنا
              </div>
              <ul className="space-y-3 text-sm text-background/70">
                <li className="flex items-center gap-2.5">
                  <span className="size-8 rounded-lg bg-background/10 flex items-center justify-center shrink-0">
                    <Phone className="size-4 text-emerald-400" />
                  </span>
                  <span dir="ltr">+20 100 123 4567</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="size-8 rounded-lg bg-background/10 flex items-center justify-center shrink-0">
                    <Mail className="size-4 text-emerald-400" />
                  </span>
                  expert@realestate.com
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="size-8 rounded-lg bg-background/10 flex items-center justify-center shrink-0">
                    <MapPin className="size-4 text-emerald-400" />
                  </span>
                  <span className="leading-snug">التجمع الخامس، القاهرة الجديدة</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="my-7 divider-fade" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-background/60">
            <p>© 2026 Real Estate. جميع الحقوق محفوظة.</p>
            <div className="flex items-center gap-5">
              <a href="#" className="hover:text-background transition-colors">
                سياسة الخصوصية
              </a>
              <span className="size-1 rounded-full bg-background/30" />
              <a href="#" className="hover:text-background transition-colors">
                الشروط والأحكام
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ===== Floating CTA (mobile) ===== */}
      {!bookingOpen && (
        <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden border-t border-border/80 bg-background/95 backdrop-blur-xl px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex gap-3 shadow-[0_-8px_28px_-6px_oklch(0.21_0.02_160/0.22)]">
          <PdfDownloadButton
            size="default"
            className="flex-1 h-12 min-h-12 text-sm font-bold active:scale-[0.98]"
            label="تحميل PDF"
            shortLabel="تحميل PDF"
          />
          <Button
            size="default"
            className="flex-1 h-12 min-h-12 text-sm font-bold gap-2 active:scale-[0.98]"
            onClick={() => openBooking()}
          >
            <CalendarCheck className="size-4" />
            استشارة مجانية
          </Button>
        </div>
      )}
      {/* spacer for mobile floating bar */}
      <div className="sm:hidden h-[calc(5rem+env(safe-area-inset-bottom))]" />

      <BookingDialog
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        defaultCompound={bookingCompound}
      />
    </div>
  );
}

/* ---------- Sub components ---------- */

function ComparisonRow({
  label,
  unit,
  icon: Icon,
  isBest,
  render,
}: {
  label: string;
  unit: string;
  icon: React.ElementType;
  isBest: (c: Compound) => boolean;
  render: (c: Compound) => React.ReactNode;
}) {
  return (
    <tr className="row-hover transition-colors group">
      <td className="sticky right-0 z-10 bg-card p-4 font-medium border-b border-border/40 group-hover:bg-muted/40 transition-colors sticky-edge-left">
        <div className="flex items-center gap-2.5">
          <span className="size-7 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
            <Icon className="size-3.5 text-muted-foreground" />
          </span>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-medium text-foreground leading-tight">
              {label}
            </span>
            {unit && (
              <span className="text-[10px] text-muted-foreground mt-0.5">({unit})</span>
            )}
          </div>
        </div>
      </td>
      {compounds.map((c) => {
        const best = isBest(c);
        return (
          <td
            key={c.id}
            className={cn(
              "p-4 text-center border-b border-border/40 tabular transition-colors relative",
              best && "best-cell"
            )}
          >
            <div className="flex items-center justify-center gap-1.5">
              {best && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground shadow-sm">
                  <Crown className="size-2.5" />
                  الأفضل
                </span>
              )}
              <span
                className={cn(
                  "text-[15px] transition-colors",
                  best
                    ? "text-primary font-extrabold text-base"
                    : "text-foreground font-semibold"
                )}
              >
                {render(c)}
              </span>
            </div>
          </td>
        );
      })}
    </tr>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-2.5 text-right transition-colors",
        highlight
          ? "border-primary/40 bg-primary/8"
          : "border-border/60 bg-muted/30"
      )}
    >
      <div className="flex items-center gap-1 text-[13px] font-normal text-muted-foreground mb-1 leading-tight">
        <Icon className={cn("size-3 shrink-0", highlight && "text-primary")} />
        <span className="truncate">{label}</span>
      </div>
      <div
        className={cn(
          "text-[18px] font-bold tabular leading-none",
          highlight ? "text-primary" : "text-foreground"
        )}
      >
        {value}
      </div>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  unit,
  best,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  unit?: string;
  best?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-3.5 transition-all hover:shadow-soft",
        best
          ? "border-primary/40 bg-gradient-to-br from-primary/8 to-amber-400/5 shadow-soft"
          : "border-border/60 bg-card"
      )}
    >
      <div className="flex items-center gap-1.5 text-[13px] font-normal text-muted-foreground mb-2 leading-tight">
        <Icon className={cn("size-3.5 shrink-0", best && "text-primary")} />
        <span className="truncate">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className={cn(
            "text-[18px] font-bold tabular leading-none",
            best && "text-primary"
          )}
        >
          {value}
        </span>
        {unit && <span className="text-[11px] text-muted-foreground">{unit}</span>}
        {best && (
          <Badge
            variant="secondary"
            className="text-[9px] px-1.5 py-0 h-4 gap-0.5 ml-auto bg-primary/15 text-primary border-primary/20"
          >
            <Crown className="size-2.5" />
            الأفضل
          </Badge>
        )}
      </div>
    </div>
  );
}

/* ---------- Countdown timer ---------- */
function CountdownTimer() {
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    // Target: end of current month, 23:59:59
    const computeTarget = () => {
      const now = new Date();
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      return end.getTime();
    };
    let target = computeTarget();

    const tick = () => {
      let diff = Math.max(0, target - Date.now());
      if (diff === 0) {
        target = computeTarget();
        diff = Math.max(0, target - Date.now());
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      setRemaining({ days, hours, mins, secs });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: "يوم", value: remaining.days },
    { label: "ساعة", value: remaining.hours },
    { label: "دقيقة", value: remaining.mins },
    { label: "ثانية", value: remaining.secs },
  ];

  return (
    <div className="mt-10 mx-auto max-w-2xl">
      <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/15 border border-amber-300/30 px-3.5 py-1.5 text-xs font-semibold text-amber-200 backdrop-blur-sm mb-4">
        <span className="size-1.5 rounded-full bg-amber-300 animate-pulse" />
        عرض الاستشارة المجانية ينتهي بنهاية الشهر
      </div>
      <div className="flex items-center justify-center gap-2 sm:gap-3" dir="ltr">
        {units.map((u, idx) => (
          <div key={u.label} className="flex items-center gap-2 sm:gap-3">
            <div className="flex flex-col items-center">
              <div className="size-16 sm:size-20 rounded-2xl bg-primary-foreground/10 border border-primary-foreground/20 backdrop-blur-md flex items-center justify-center">
                <span className="text-2xl sm:text-4xl font-extrabold tabular text-primary-foreground">
                  {String(u.value).padStart(2, "0")}
                </span>
              </div>
              <span className="mt-2 text-[10px] sm:text-xs font-medium text-primary-foreground/70">
                {u.label}
              </span>
            </div>
            {idx < units.length - 1 && (
              <span className="text-2xl sm:text-3xl font-extrabold text-primary-foreground/40 pb-5">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
