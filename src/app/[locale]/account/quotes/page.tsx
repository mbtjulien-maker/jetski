import { setRequestLocale, getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { updateQuoteStatusAction } from "@/lib/actions/quotes";

const STATUS_COLORS: Record<string, string> = {
  pending: "text-accent",
  accepted: "text-emerald-300",
  declined: "text-muted",
  expired: "text-muted/60",
};

export default async function QuotesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("account.quotes");

  const session = await auth();
  if (!session?.user?.id) return null;

  const quotes = await prisma.quote.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });

  const statusLabel: Record<string, string> = {
    pending: t("statusPending"),
    accepted: t("statusAccepted"),
    declined: t("statusDeclined"),
    expired: t("statusExpired"),
  };

  return (
    <section className="space-y-6">
      <header>
        <h2 className="font-display text-3xl font-light tracking-tight">
          {t("title")}
        </h2>
        <p className="text-muted text-sm mt-2">{t("subtitle")}</p>
      </header>

      {quotes.length === 0 ? (
        <div className="border border-border p-10 text-center">
          <p className="text-muted">{t("empty")}</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {quotes.map((q) => (
            <li
              key={q.id}
              className="border border-border p-6 grid md:grid-cols-[1fr_auto] gap-4 items-start"
            >
              <div>
                <p
                  className={`text-xs uppercase tracking-wider ${
                    STATUS_COLORS[q.status] ?? "text-muted"
                  }`}
                >
                  {statusLabel[q.status] ?? q.status}
                </p>
                <h3 className="text-base font-medium mt-1">{q.title}</h3>
                {q.product && (
                  <p className="text-xs text-muted mt-1">
                    {q.product.brand} · {q.product.model}
                  </p>
                )}
                {q.description && (
                  <p className="text-sm text-foreground/90 mt-3 leading-relaxed">
                    {q.description}
                  </p>
                )}
                {q.validUntil && (
                  <p className="text-xs text-muted mt-3">
                    {t("validUntil")} {q.validUntil.toLocaleDateString(locale)}
                  </p>
                )}
              </div>
              <div className="md:text-right flex flex-col items-start md:items-end gap-3">
                <p className="text-2xl font-light">
                  {formatPrice(q.amountCents, locale)}
                </p>
                {q.status === "pending" && (
                  <div className="flex gap-2">
                    <form action={updateQuoteStatusAction}>
                      <input type="hidden" name="quoteId" value={q.id} />
                      <input type="hidden" name="status" value="accepted" />
                      <button type="submit" className="btn-primary !py-2 !px-4">
                        {t("accept")}
                      </button>
                    </form>
                    <form action={updateQuoteStatusAction}>
                      <input type="hidden" name="quoteId" value={q.id} />
                      <input type="hidden" name="status" value="declined" />
                      <button type="submit" className="btn-ghost !py-2 !px-4">
                        {t("decline")}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
