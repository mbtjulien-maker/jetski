import { setRequestLocale, getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { Link } from "@/i18n/navigation";

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("account");
  const tNav = await getTranslations("account.nav");

  const session = await auth();
  if (!session?.user?.id) return null;

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  const statusMap: Record<string, string> = {
    pending: t("statusPending"),
    paid: t("statusPaid"),
    shipped: t("statusShipped"),
    delivered: t("statusDelivered"),
  };

  return (
    <section className="space-y-6">
      <header>
        <h2 className="font-display text-3xl font-light tracking-tight">
          {tNav("orders")}
        </h2>
      </header>
      {orders.length === 0 ? (
        <div className="border border-border/60 glass p-10 text-center">
          <p className="text-muted">{t("noOrders")}</p>
          <Link href="/shop" className="inline-block mt-6 btn-primary">
            Découvrir la collection
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => (
            <li
              key={o.id}
              className="border border-border/60 p-6 glass flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">
                  {t("orderNumber")} #{o.id.slice(-8).toUpperCase()}
                </p>
                <p className="text-sm mt-1">
                  {o.items.map((i) => i.product.model).join(", ")}
                </p>
                <p className="text-xs text-muted mt-1">
                  {t("orderDate")} {o.createdAt.toLocaleDateString(locale)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-accent">
                  {statusMap[o.status] ?? o.status}
                </p>
                <p className="text-lg font-medium mt-1">
                  {formatPrice(o.totalCents, locale)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
