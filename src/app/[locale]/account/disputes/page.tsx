import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { IconPlus } from "@tabler/icons-react";

const STATUS_COLORS: Record<string, string> = {
  open: "text-accent",
  in_progress: "text-amber-300",
  resolved: "text-emerald-300",
  closed: "text-muted",
};

export default async function DisputesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("account.disputes");

  const session = await auth();
  if (!session?.user?.id) return null;

  const disputes = await prisma.dispute.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { order: true, product: true },
  });

  const statusLabel: Record<string, string> = {
    open: t("statusOpen"),
    in_progress: t("statusInProgress"),
    resolved: t("statusResolved"),
    closed: t("statusClosed"),
  };

  return (
    <section className="space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-3xl font-light tracking-tight">
            {t("title")}
          </h2>
          <p className="text-muted text-sm mt-2">{t("subtitle")}</p>
        </div>
        <Link href="/account/disputes/new" className="btn-primary">
          <IconPlus size={16} stroke={2} /> {t("new")}
        </Link>
      </header>

      {disputes.length === 0 ? (
        <div className="border border-border p-10 text-center">
          <p className="text-muted">{t("empty")}</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {disputes.map((d) => (
            <li key={d.id}>
              <Link
                href={`/account/disputes/${d.id}`}
                className="block border border-border p-5 hover:bg-surface/60 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-muted">
                      {t(`themes.${d.theme}`)}
                    </p>
                    <p className="text-base font-medium mt-1 truncate">
                      {d.subject}
                    </p>
                    <p className="text-xs text-muted mt-1">
                      {d.createdAt.toLocaleDateString(locale)}
                      {d.order
                        ? ` · #${d.order.id.slice(-8).toUpperCase()}`
                        : ""}
                    </p>
                  </div>
                  <span
                    className={`text-xs uppercase tracking-wider ${
                      STATUS_COLORS[d.status] ?? "text-muted"
                    }`}
                  >
                    {statusLabel[d.status] ?? d.status}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
