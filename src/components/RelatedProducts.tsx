import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "./ProductCard";

export async function RelatedProducts({
  brand,
  excludeId,
  locale,
}: {
  brand: string;
  excludeId: string;
  locale: string;
}) {
  const t = await getTranslations("home");

  // Same brand first, then fill with others
  const sameBrand = await prisma.product.findMany({
    where: { brand, id: { not: excludeId } },
    orderBy: { priceCents: "desc" },
    take: 3,
  });

  let products = sameBrand;
  if (products.length < 3) {
    const others = await prisma.product.findMany({
      where: { id: { not: excludeId, notIn: products.map((p) => p.id) } },
      orderBy: { priceCents: "desc" },
      take: 3 - products.length,
    });
    products = [...products, ...others];
  }

  if (products.length === 0) return null;

  const headings: Record<string, string> = {
    fr: "Vous aimerez aussi",
    en: "You may also like",
    de: "Das könnte Ihnen gefallen",
    it: "Potrebbe interessarti",
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 border-t border-border mt-16">
      <h2 className="font-display text-3xl md:text-4xl font-light tracking-tight mb-12">
        {headings[locale] ?? headings.en}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} locale={locale} />
        ))}
      </div>
      {/* Reference to t to keep next-intl active in this server component scope */}
      <span className="sr-only">{t("viewAll")}</span>
    </section>
  );
}
