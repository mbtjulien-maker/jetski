import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { IconChevronLeft } from "@tabler/icons-react";

export default async function DisputeDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("account.disputes");

  const session = await auth();
  if (!session?.user?.id) return null;

  const dispute = await prisma.dispute.findFirst({
    where: { id, userId: session.user.id },
    include: { order: true, product: true },
  });
  if (!dispute) notFound();

  const statusLabel: Record<string, string> = {
    open: t("statusOpen"),
    in_progress: t("statusInProgress"),
    resolved: t("statusResolved"),
    closed: t("statusClosed"),
  };

  return (
    <section className="space-y-6">
      <Link
        href="/account/disputes"
        className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-muted hover:text-foreground transition-colors"
      >
        <IconChevronLeft size={14} stroke={1.5} /> {t("title")}
      </Link>

      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-2">
          {t(`themes.${dispute.theme}`)} · {statusLabel[dispute.status] ?? dispute.status}
        </p>
        <h2 className="font-display text-3xl font-light tracking-tight">
          {dispute.subject}
        </h2>
        <p className="text-xs text-muted mt-2">
          {dispute.createdAt.toLocaleDateString(locale)}
          {dispute.order
            ? ` · #${dispute.order.id.slice(-8).toUpperCase()}`
            : ""}
        </p>
      </header>

      <article className="border border-border p-6 bg-surface/40">
        <p className="text-xs uppercase tracking-wider text-muted mb-3">
          {t("bodyField")}
        </p>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {dispute.body}
        </p>
      </article>

      {dispute.reply && (
        <article className="border border-accent/40 p-6 bg-accent/5">
          <p className="text-xs uppercase tracking-wider text-accent mb-3">
            {t("reply")}
          </p>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {dispute.reply}
          </p>
        </article>
      )}
    </section>
  );
}
