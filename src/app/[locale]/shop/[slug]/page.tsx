import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { addToCartFormAction } from "@/lib/actions/cart";
import { Link } from "@/i18n/navigation";
import { ProductGallery } from "@/components/ProductGallery";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { RelatedProducts } from "@/components/RelatedProducts";
import { WishlistButton } from "@/components/WishlistButton";
import { auth } from "@/lib/auth";
import {
  IconChevronLeft,
  IconTruck,
  IconShield,
  IconCalendar,
  IconBolt,
  IconUsers,
  IconTag,
} from "@tabler/icons-react";

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

  const session = await auth().catch(() => null);
  let inWishlist = false;
  if (session?.user?.id) {
    const w = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId: session.user.id, productId: product.id } },
    });
    inWishlist = !!w;
  }

  const descKey: LocalizedDesc = `description${locale[0].toUpperCase() + locale.slice(1)}` as LocalizedDesc;
  const description = product[descKey];
  const images = product.gallery.split(",").map((s) => s.trim()).filter(Boolean);
  if (images.length === 0) images.push(product.heroImage);

  const inStock = product.stock > 0;

  const specs = [
    { icon: IconCalendar, label: t("year"), value: String(product.year) },
    { icon: IconBolt, label: t("power"), value: `${product.power} ${t("hp")}` },
    { icon: IconUsers, label: t("seats"), value: String(product.seats) },
    {
      icon: IconTag,
      label: t("condition"),
      value: product.condition === "new" ? tShop("new") : tShop("occasion"),
    },
  ];

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 pt-8 pb-32 md:pb-16">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-muted hover:text-foreground transition-colors mb-8"
        >
          <IconChevronLeft size={14} stroke={1.5} /> Shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <ProductGallery
            images={images}
            alt={`${product.brand} ${product.model}`}
          />

          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              {product.brand}
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mt-2 leading-[1.05]">
              {product.model}
            </h1>
            <p className="text-xs text-muted mt-3">{product.year}</p>

            <div className="mt-10 flex items-baseline justify-between">
              <span className="text-3xl md:text-4xl font-light">
                {formatPrice(product.priceCents, locale)}
              </span>
              {inStock ? (
                <span className="text-xs text-muted">
                  {t("stockLeft", { count: product.stock })}
                </span>
              ) : (
                <span className="text-xs text-accent uppercase tracking-wider">
                  {t("outOfStock")}
                </span>
              )}
            </div>

            <div id="add-to-cart-anchor" className="mt-8 flex items-stretch gap-3">
              <form action={addToCartFormAction} className="flex-1">
                <input type="hidden" name="productId" value={product.id} />
                <button
                  type="submit"
                  disabled={!inStock}
                  className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {inStock ? t("addToCart") : t("outOfStock")}
                </button>
              </form>
              <div className="border border-border px-4 flex items-center">
                <WishlistButton
                  productId={product.id}
                  initial={inWishlist}
                  requiresAuth={!session?.user?.id}
                />
              </div>
            </div>

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

            <div className="mt-12 pt-8 border-t border-border">
              <h2 className="text-xs uppercase tracking-[0.25em] text-muted mb-6">
                {t("details")}
              </h2>
              <dl className="grid grid-cols-2 gap-6">
                {specs.map((s) => (
                  <div key={s.label} className="flex items-start gap-3">
                    <s.icon
                      size={20}
                      stroke={1.5}
                      className="text-accent shrink-0 mt-0.5"
                    />
                    <div>
                      <dt className="text-[10px] uppercase tracking-wider text-muted">
                        {s.label}
                      </dt>
                      <dd className="text-sm font-medium mt-0.5">{s.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-10 pt-8 border-t border-border">
              <h2 className="text-xs uppercase tracking-[0.25em] text-muted mb-4">
                {t("description")}
              </h2>
              <p className="text-sm leading-relaxed text-foreground/90">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <RelatedProducts
        brand={product.brand}
        excludeId={product.id}
        locale={locale}
      />

      <StickyMobileCTA
        productId={product.id}
        priceCents={product.priceCents}
        locale={locale}
        inStock={inStock}
      />
    </>
  );
}
