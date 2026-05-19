import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { readCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { removeFromCartFormAction } from "@/lib/actions/cart";
import { QuantityInput } from "@/components/QuantityInput";
import { IconArrowRight, IconX } from "@tabler/icons-react";

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cart");

  const cart = await readCart();
  const products =
    cart.length === 0
      ? []
      : await prisma.product.findMany({
          where: { id: { in: cart.map((i) => i.productId) } },
        });

  const items = cart
    .map((ci) => {
      const product = products.find((p) => p.id === ci.productId);
      return product ? { product, quantity: ci.quantity } : null;
    })
    .filter((x): x is { product: typeof products[number]; quantity: number } => !!x);

  const subtotal = items.reduce(
    (s, i) => s + i.product.priceCents * i.quantity,
    0
  );

  return (
    <div className="mx-auto max-w-6xl px-6 pt-16 pb-32">
      <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-12">
        {t("title")}
      </h1>

      {items.length === 0 ? (
        <div className="py-16">
          <p className="text-muted mb-8">{t("empty")}</p>
          <Link href="/shop" className="btn-primary">
            {t("continueShoping")} <IconArrowRight size={16} stroke={2} />
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_360px] gap-16">
          <ul className="divide-y divide-border">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="py-6 flex gap-6">
                <div className="relative w-32 h-24 shrink-0 bg-surface overflow-hidden">
                  <Image
                    src={product.heroImage}
                    alt={product.model}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted">
                        {product.brand}
                      </p>
                      <Link
                        href={`/shop/${product.slug}`}
                        className="text-base font-medium hover:text-accent transition-colors"
                      >
                        {product.model}
                      </Link>
                    </div>
                    <p className="text-base font-medium whitespace-nowrap">
                      {formatPrice(product.priceCents * quantity, locale)}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted">{t("quantity")}</span>
                      <QuantityInput
                        productId={product.id}
                        defaultValue={quantity}
                        max={product.stock}
                      />
                    </div>
                    <form action={removeFromCartFormAction}>
                      <input type="hidden" name="productId" value={product.id} />
                      <button
                        type="submit"
                        className="text-xs text-muted hover:text-accent inline-flex items-center gap-1"
                      >
                        <IconX size={14} /> {t("remove")}
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="border border-border p-8 h-fit lg:sticky lg:top-24">
            <h2 className="text-xs uppercase tracking-wider text-muted mb-6">
              Total
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">{t("subtotal")}</dt>
                <dd>{formatPrice(subtotal, locale)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">{t("shipping")}</dt>
                <dd className="text-accent uppercase text-xs tracking-wider">
                  {t("shippingFree")}
                </dd>
              </div>
            </dl>
            <div className="border-t border-border mt-4 pt-4 flex justify-between text-lg font-medium">
              <span>{t("total")}</span>
              <span>{formatPrice(subtotal, locale)}</span>
            </div>
            <Link href="/checkout" className="btn-primary w-full mt-8">
              {t("checkout")} <IconArrowRight size={16} stroke={2} />
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
