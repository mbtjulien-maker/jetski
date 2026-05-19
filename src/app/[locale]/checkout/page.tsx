import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { readCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { createCheckoutSession } from "@/lib/actions/checkout";
import { auth } from "@/lib/auth";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("checkout");
  const tCart = await getTranslations("cart");

  const cart = await readCart();
  if (cart.length === 0) redirect(`/${locale}/cart`);

  const products = await prisma.product.findMany({
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

  const session = await auth().catch(() => null);

  return (
    <div className="mx-auto max-w-6xl px-6 pt-16 pb-32">
      <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-12">
        {t("title")}
      </h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-16">
        <form action={createCheckoutSession} className="space-y-10">
          <input type="hidden" name="locale" value={locale} />
          <section>
            <h2 className="text-xs uppercase tracking-wider text-muted mb-4">
              {t("contact")}
            </h2>
            <Field
              label={t("email")}
              name="email"
              type="email"
              required
              defaultValue={session?.user?.email ?? ""}
            />
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-wider text-muted mb-4">
              {t("shippingAddress")}
            </h2>
            <div className="space-y-4">
              <Field
                label={t("fullName")}
                name="fullName"
                required
                defaultValue={session?.user?.name ?? ""}
              />
              <Field label={t("address")} name="address" required />
              <div className="grid grid-cols-2 gap-4">
                <Field label={t("postalCode")} name="postalCode" required />
                <Field label={t("city")} name="city" required />
              </div>
              <Field label={t("country")} name="country" required defaultValue="France" />
            </div>
          </section>

          <button type="submit" className="btn-primary w-full">
            {t("payNow")}
          </button>
        </form>

        <aside className="border border-border p-8 h-fit lg:sticky lg:top-24">
          <h2 className="text-xs uppercase tracking-wider text-muted mb-6">
            {t("summary")}
          </h2>
          <ul className="space-y-4 mb-6">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex gap-3 text-sm">
                <div className="relative w-16 h-12 shrink-0 bg-surface overflow-hidden">
                  <Image
                    src={product.heroImage}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate">{product.model}</p>
                  <p className="text-xs text-muted">x {quantity}</p>
                </div>
                <p className="whitespace-nowrap">
                  {formatPrice(product.priceCents * quantity, locale)}
                </p>
              </li>
            ))}
          </ul>
          <div className="border-t border-border pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">{tCart("subtotal")}</span>
              <span>{formatPrice(subtotal, locale)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">{tCart("shipping")}</span>
              <span className="text-accent text-xs uppercase">
                {tCart("shippingFree")}
              </span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between text-lg font-medium">
              <span>{tCart("total")}</span>
              <span>{formatPrice(subtotal, locale)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs text-muted mb-1.5">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="w-full bg-surface border border-border px-3 py-2.5 text-sm focus:border-accent outline-none"
      />
    </label>
  );
}
