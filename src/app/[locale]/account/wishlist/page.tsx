import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { WishlistButton } from "@/components/WishlistButton";

export default async function WishlistPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("account.wishlist");

  const session = await auth();
  if (!session?.user?.id) return null;

  const favorites = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });

  return (
    <section className="space-y-6">
      <header>
        <h2 className="font-display text-3xl font-light tracking-tight">
          {t("title")}
        </h2>
        <p className="text-muted text-sm mt-2">{t("subtitle")}</p>
      </header>

      {favorites.length === 0 ? (
        <div className="border border-border p-10 text-center">
          <p className="text-muted">{t("empty")}</p>
          <Link href="/shop" className="inline-block mt-6 btn-primary">
            {t("browse")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {favorites.map((w) => (
            <div key={w.id} className="group relative">
              <Link
                href={`/shop/${w.product.slug}`}
                className="block"
              >
                <div className="relative aspect-[4/3] bg-surface overflow-hidden">
                  <Image
                    src={w.product.heroImage}
                    alt={`${w.product.brand} ${w.product.model}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="pt-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">
                      {w.product.brand}
                    </p>
                    <h3 className="text-base font-medium mt-1">
                      {w.product.model}
                    </h3>
                  </div>
                  <p className="text-base font-medium whitespace-nowrap">
                    {formatPrice(w.product.priceCents, locale)}
                  </p>
                </div>
              </Link>
              <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm p-1.5">
                <WishlistButton
                  productId={w.product.id}
                  initial={true}
                  size={18}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
