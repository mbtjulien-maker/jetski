import { setRequestLocale, getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createDisputeAction } from "@/lib/actions/disputes";
import { Link } from "@/i18n/navigation";
import { IconChevronLeft } from "@tabler/icons-react";

const THEMES = [
  "delivery",
  "defect",
  "billing",
  "warranty",
  "refund",
  "documents",
  "other",
] as const;

export default async function NewDisputePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("account.disputes");

  const session = await auth();
  if (!session?.user?.id) return null;

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  return (
    <section className="space-y-6">
      <Link
        href="/account/disputes"
        className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-muted hover:text-foreground transition-colors"
      >
        <IconChevronLeft size={14} stroke={1.5} /> {t("title")}
      </Link>

      <header>
        <h2 className="font-display text-3xl font-light tracking-tight">
          {t("newTitle")}
        </h2>
      </header>

      <form action={createDisputeAction} className="space-y-5 max-w-2xl">
        <input type="hidden" name="locale" value={locale} />

        <label className="block">
          <span className="block text-xs text-muted mb-1.5">
            {t("theme")}
          </span>
          <select
            name="theme"
            required
            defaultValue=""
            className="w-full bg-surface border border-border px-3 py-2.5 text-sm focus:border-accent outline-none"
          >
            <option value="" disabled>
              {t("themePicker")}
            </option>
            {THEMES.map((th) => (
              <option key={th} value={th}>
                {t(`themes.${th}`)}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="block text-xs text-muted mb-1.5">
            {t("linkOrder")}
          </span>
          <select
            name="orderId"
            defaultValue=""
            className="w-full bg-surface border border-border px-3 py-2.5 text-sm focus:border-accent outline-none"
          >
            <option value="">{t("linkOrderNone")}</option>
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                #{o.id.slice(-8).toUpperCase()} —{" "}
                {o.items.map((i) => i.product.model).join(", ").slice(0, 60)}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="block text-xs text-muted mb-1.5">
            {t("subjectField")}
          </span>
          <input
            name="subject"
            required
            minLength={2}
            maxLength={160}
            className="w-full bg-surface border border-border px-3 py-2.5 text-sm focus:border-accent outline-none"
          />
        </label>

        <label className="block">
          <span className="block text-xs text-muted mb-1.5">
            {t("bodyField")}
          </span>
          <textarea
            name="body"
            required
            minLength={10}
            maxLength={4000}
            rows={6}
            className="w-full bg-surface border border-border px-3 py-2.5 text-sm focus:border-accent outline-none resize-y"
          />
        </label>

        <button type="submit" className="btn-primary">
          {t("submit")}
        </button>
      </form>
    </section>
  );
}
