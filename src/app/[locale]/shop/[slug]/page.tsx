import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { addToCartFormAction } from "@/lib/actions/cart";
import { Link } from "@/i18n/navigation";
import { IconChevronLeft, IconTruck, IconShield } from "@tabler/icons-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const p = await prisma.product.findUnique({ where: { slug } });
  if (!p) return {};
  return { title: `${p.brand} ${p.model}` };
}

type LocalizedDesc = "descriptionFr" | "descriptionEn" | "descriptionDe" | "descriptionIt";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("product");
  const tShop = await getTranslations("shop");

  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) notFound();

  const descKey: LocalizedDesc = `description${locale[0].toUpperCase() + locale.slice(1)}` as LocalizedDesc;
  const description = product[descKey];
  const images = product.gallery.split(",").map((s) => s.trim()).filter(Boolean);
  if (images.length === 0) images.push(product.heroImage);

  return (
    <div className="mx-auto max-w-7xl px-6 pt-8 pb-32">
      <Link
        href="/shop"
        className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-muted hover:text-foreground transition-colors mb-8"
      >
        <IconChevronLeft size={14} stroke={1.5} /> Shop
      </Link>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
        <div className="space-y-3">
          <div className="relative aspect-[4/3] bg-surface overflow-hidden">
            <Image
              src={images[0]}
              alt={`${product.brand} ${product.model}`}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {images.slice(1, 4).map((img, i) => (
                <div key={i} className="relative aspect-[4/3] bg-surface overflow-hidden">
                  <Image
                    src={img}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 17vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs uppercase tracking-[0.25em] text-muted">
            {product.brand}
          </p>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight mt-2">
            {product.model}
          </h1>
          <p className="text-xs text-muted mt-2">{product.year}</p>

          <div className="mt-8 flex items-baseline justify-between">
            <span className="text-3xl font-light">
              {formatPrice(product.priceCents, locale)}
            </span>
            {product.stock > 0 ? (
              <span className="text-xs text-muted">
                {t("stockLeft", { count: product.stock })}
              </span>
            ) : (
              <span className="text-xs text-accent uppercase tracking-wider">
                {t("outOfStock")}
              </span>
            )}
          </div>

          <form action={addToCartFormAction} className="mt-8">
            <input type="hidden" name="productId" value={product.id} />
            <button
              type="submit"
              disabled={product.stock === 0}
              className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t("addToCart")}
            </button>
          </form>

          <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-muted">
            <div className="flex items-start gap-2">
              <IconTruck size={16} stroke={1.5} className="text-accent shrink-0 mt-0.5" />
              {t("delivery")}
            </div>
            <div className="flex items-start gap-2">
              <IconShield size={16} stroke={1.5} className="text-accent shrink-0 mt-0.5" />
              {t("warranty")}
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-border">
            <h2 className="text-xs uppercase tracking-wider text-muted mb-4">
              {t("details")}
            </h2>
            <dl className="grid grid-cols-2 gap-y-3 text-sm">
              <dt className="text-muted">{t("year")}</dt>
              <dd>{product.year}</dd>
              <dt className="text-muted">{t("power")}</dt>
              <dd>{product.power} {t("hp")}</dd>
              <dt className="text-muted">{t("seats")}</dt>
              <dd>{product.seats}</dd>
              <dt className="text-muted">{t("condition")}</dt>
              <dd>{product.condition === "new" ? tShop("new") : tShop("occasion")}</dd>
            </dl>
          </div>

          <div className="mt-10 pt-8 border-t border-border">
            <h2 className="text-xs uppercase tracking-wider text-muted mb-4">
              {t("description")}
            </h2>
            <p className="text-sm leading-relaxed">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
