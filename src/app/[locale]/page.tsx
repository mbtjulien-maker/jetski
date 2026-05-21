import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { ScrollCue } from "@/components/ScrollCue";
import { Reveal } from "@/components/Reveal";
import { IconArrowRight, IconTruck, IconShield, IconCreditCard } from "@tabler/icons-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const featured = await prisma.product.findMany({
    orderBy: { priceCents: "desc" },
    take: 4,
  });

  const scrollLabels: Record<string, string> = {
    fr: "Défiler",
    en: "Scroll",
    de: "Scrollen",
    it: "Scorri",
  };

  return (
    <>
      {/* HERO */}
      <section className="relative h-[92vh] min-h-[640px] flex items-end overflow-hidden">
        <div className="absolute inset-0 animate-ken-burns">
          <Image
            src="https://images.unsplash.com/photo-1755566981083-5e54b2915148?w=2400&q=80"
            alt=""
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/40 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 pb-24 w-full">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-6">
            {t("heroEyebrow")}
          </p>
          <h1 className="font-display-italic text-5xl md:text-7xl lg:text-[8rem] font-light max-w-5xl leading-[0.95]">
            {t("heroTitle")}
          </h1>
          <p className="mt-8 text-base md:text-lg text-muted max-w-xl leading-relaxed">
            {t("heroSubtitle")}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/shop" className="btn-primary">
              {t("heroCta")} <IconArrowRight size={16} stroke={2} />
            </Link>
            <Link href="/contact" className="btn-ghost">
              {t("heroSecondary")}
            </Link>
          </div>
        </div>

        <ScrollCue label={scrollLabels[locale] ?? "Scroll"} />
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <Reveal className="flex items-end justify-between mb-14">
          <div>
            <h2 className="font-display text-4xl md:text-5xl tracking-tight font-light">
              {t("featuredTitle")}
            </h2>
            <p className="mt-3 text-muted max-w-md">{t("featuredSubtitle")}</p>
          </div>
          <Link
            href="/shop"
            className="hidden md:inline-flex items-center gap-2 text-sm link-underline"
          >
            {t("viewAll")} <IconArrowRight size={16} stroke={1.5} />
          </Link>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <ProductCard product={p} locale={locale} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* BRANDS */}
      <section className="border-y border-border py-20">
        <Reveal className="mx-auto max-w-7xl px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-muted text-center mb-10">
            {t("brandsTitle")}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-6 text-2xl font-light tracking-[0.2em] text-muted/70">
            <span>SEA-DOO</span>
            <span className="opacity-60">·</span>
            <span>YAMAHA</span>
            <span className="opacity-60">·</span>
            <span>KAWASAKI</span>
            <span className="opacity-60">·</span>
            <span>BRP</span>
            <span className="opacity-60">·</span>
            <span>KRASH</span>
          </div>
        </Reveal>
      </section>

      {/* VALUE PROPS */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <Reveal>
          <h2 className="font-display text-4xl md:text-5xl tracking-tight font-light mb-16 max-w-2xl">
            {t("valuePropTitle")}
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { icon: IconTruck, title: t("valueProp1Title"), body: t("valueProp1Body") },
            { icon: IconShield, title: t("valueProp2Title"), body: t("valueProp2Body") },
            { icon: IconCreditCard, title: t("valueProp3Title"), body: t("valueProp3Body") },
          ].map((v, i) => (
            <Reveal key={i} delay={i * 120}>
              <div className="border-t border-border pt-8">
                <v.icon size={28} stroke={1.5} className="text-accent mb-6" />
                <h3 className="text-lg font-medium mb-3">{v.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
