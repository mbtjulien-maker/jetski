import { setRequestLocale, getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { IconDownload } from "@tabler/icons-react";

export default async function InvoicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("account.invoices");

  const session = await auth();
  if (!session?.user?.id) return null;

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
      status: { in: ["paid", "shipped", "delivered"] },
    },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  return (
    <section className="space-y-6">
      <header>
        <h2 className="font-display text-3xl font-light tracking-tight">
          {t("title")}
        </h2>
        <p className="text-muted text-sm mt-2">{t("subtitle")}</p>
      </header>

      {orders.length === 0 ? (
        <div className="border border-border/60 glass p-10 text-center">
          <p className="text-muted">{t("empty")}</p>
        </div>
      ) : (
        <ul className="divide-y divide-border/60 border border-border/60 glass">
          {orders.map((o) => (
            <li
              key={o.id}
              className="px-6 py-5 flex items-center justify-between gap-4"
            >
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">
                  {t("invoiceNumber")} #{o.id.slice(-8).toUpperCase()}
                </p>
                <p className="text-sm mt-1">
                  {o.items.map((i) => i.product.model).join(", ")}
                </p>
                <p className="text-xs text-muted mt-1">
                  {o.createdAt.toLocaleDateString(locale)}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <p className="text-base font-medium whitespace-nowrap">
                  {formatPrice(o.totalCents, locale)}
                </p>
                <button
                  type="button"
                  disabled
                  title="PDF generation coming soon"
                  className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-muted hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <IconDownload size={14} stroke={1.5} /> {t("download")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
