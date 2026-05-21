import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { signOutAction } from "@/lib/actions/auth";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("account");
  const tNav = await getTranslations("nav");

  const session = await auth();
  if (!session?.user) redirect(`/${locale}/sign-in`);

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  const statusMap = {
    pending: t("statusPending"),
    paid: t("statusPaid"),
    shipped: t("statusShipped"),
    delivered: t("statusDelivered"),
  } as const;

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h1 className="font-display text-5xl md:text-6xl font-light tracking-tight">
            {t("title")}
          </h1>
          <p className="text-muted mt-2">{session.user.email}</p>
        </div>
        <form action={signOutAction}>
          <button type="submit" className="btn-ghost">
            {tNav("signOut")}
          </button>
        </form>
      </div>

      <h2 className="text-xs uppercase tracking-wider text-muted mb-6">
        {t("orders")}
      </h2>

      {orders.length === 0 ? (
        <p className="text-muted">{t("noOrders")}</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => (
            <li
              key={o.id}
              className="border border-border p-6 flex flex-wrap items-center justify-between gap-4"
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
                  {statusMap[o.status as keyof typeof statusMap] ?? o.status}
                </p>
                <p className="text-lg font-medium mt-1">
                  {formatPrice(o.totalCents, locale)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
