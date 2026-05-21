import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import type { Prisma } from "@prisma/client";

const BRANDS = ["Sea-Doo", "Yamaha", "Kawasaki"];

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ brand?: string; condition?: string; sort?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("shop");

  const where: Prisma.ProductWhereInput = {};
  if (sp.brand) where.brand = sp.brand;
  if (sp.condition && sp.condition !== "all") where.condition = sp.condition;

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sp.sort === "priceAsc") orderBy = { priceCents: "asc" };
  else if (sp.sort === "priceDesc") orderBy = { priceCents: "desc" };

  const products = await prisma.product.findMany({ where, orderBy });

  const FilterLink = ({
    href,
    active,
    children,
  }: {
    href: string;
    active: boolean;
    children: React.ReactNode;
  }) => (
    <Link
      href={href}
      className={`block py-1.5 text-sm transition-colors ${
        active ? "text-accent" : "text-muted hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );

  const buildQuery = (overrides: Record<string, string | undefined>) => {
    const q = new URLSearchParams();
    const merged = { ...sp, ...overrides };
    for (const [k, v] of Object.entries(merged)) {
      if (v) q.set(k, v);
    }
    const s = q.toString();
    return s ? `/shop?${s}` : "/shop";
  };

  return (
    <div className="mx-auto max-w-7xl px-6 pt-16 pb-32">
      <header className="mb-12">
        <h1 className="font-display text-5xl md:text-6xl font-light tracking-tight">{t("title")}</h1>
        <p className="mt-2 text-muted">{t("results", { count: products.length })}</p>
      </header>

      <div className="grid lg:grid-cols-[220px_1fr] gap-12">
        <aside className="space-y-8">
          <div>
            <h3 className="text-xs uppercase tracking-wider text-muted mb-3">
              {t("brand")}
            </h3>
            <FilterLink href={buildQuery({ brand: undefined })} active={!sp.brand}>
              {t("allBrands")}
            </FilterLink>
            {BRANDS.map((b) => (
              <FilterLink
                key={b}
                href={buildQuery({ brand: b })}
                active={sp.brand === b}
              >
                {b}
              </FilterLink>
            ))}
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-wider text-muted mb-3">
              {t("condition")}
            </h3>
            <FilterLink
              href={buildQuery({ condition: undefined })}
              active={!sp.condition || sp.condition === "all"}
            >
              {t("all")}
            </FilterLink>
            <FilterLink
              href={buildQuery({ condition: "new" })}
              active={sp.condition === "new"}
            >
              {t("new")}
            </FilterLink>
            <FilterLink
              href={buildQuery({ condition: "occasion" })}
              active={sp.condition === "occasion"}
            >
              {t("occasion")}
            </FilterLink>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-wider text-muted mb-3">
              {t("sort")}
            </h3>
            <FilterLink
              href={buildQuery({ sort: undefined })}
              active={!sp.sort}
            >
              {t("sortNewest")}
            </FilterLink>
            <FilterLink
              href={buildQuery({ sort: "priceAsc" })}
              active={sp.sort === "priceAsc"}
            >
              {t("sortPriceAsc")}
            </FilterLink>
            <FilterLink
              href={buildQuery({ sort: "priceDesc" })}
              active={sp.sort === "priceDesc"}
            >
              {t("sortPriceDesc")}
            </FilterLink>
          </div>

          {(sp.brand || sp.condition || sp.sort) && (
            <Link href="/shop" className="text-sm link-underline text-accent">
              {t("reset")}
            </Link>
          )}
        </aside>

        <div>
          {products.length === 0 ? (
            <p className="text-muted py-16">{t("noResults")}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-14">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
