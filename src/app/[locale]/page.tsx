import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
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

  return (
    <>
      {/* HERO */}
      <section className="relative h-[88vh] min-h-[600px] flex items-end overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=2400&q=80"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="relative mx-auto max-w-7xl px-6 pb-20 w-full">
          <p className="text-xs uppercase tracking-[0.25em] text-accent mb-6">
            {t("heroEyebrow")}
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight max-w-4xl leading-[1.05]">
            {t("heroTitle")}
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted max-w-xl leading-relaxed">
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
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight">
              {t("featuredTitle")}
            </h2>
            <p className="mt-2 text-muted">{t("featuredSubtitle")}</p>
          </div>
          <Link
            href="/shop"
            className="hidden md:inline-flex items-center gap-2 text-sm link-underline"
          >
            {t("viewAll")} <IconArrowRight size={16} stroke={1.5} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} />
          ))}
        </div>
      </section>

      {/* BRANDS */}
      <section className="border-y border-border py-16">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-muted text-center mb-8">
            {t("brandsTitle")}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-6 text-2xl font-light tracking-wider text-muted/80">
            <span>SEA-DOO</span>
            <span>YAMAHA</span>
            <span>KAWASAKI</span>
            <span>BRP</span>
            <span>KRASH</span>
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-16">
          {t("valuePropTitle")}
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { icon: IconTruck, title: t("valueProp1Title"), body: t("valueProp1Body") },
            { icon: IconShield, title: t("valueProp2Title"), body: t("valueProp2Body") },
            { icon: IconCreditCard, title: t("valueProp3Title"), body: t("valueProp3Body") },
          ].map((v, i) => (
            <div key={i} className="border-t border-border pt-6">
              <v.icon size={28} stroke={1.5} className="text-accent mb-6" />
              <h3 className="text-lg font-medium mb-3">{v.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
