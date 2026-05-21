import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  IconShoppingBag,
  IconMessages,
  IconAlertTriangle,
  IconHeart,
  IconFileDescription,
  IconFileInvoice,
  IconUser,
  IconArrowRight,
} from "@tabler/icons-react";

export default async function AccountDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("account.overview");
  const tNav = await getTranslations("account.nav");

  const session = await auth();
  if (!session?.user?.id) return null;
  const userId = session.user.id;

  const [
    user,
    ordersCount,
    paidCount,
    unreadMessages,
    openDisputes,
    wishlistCount,
    quotesCount,
  ] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.order.count({ where: { userId } }),
    prisma.order.count({ where: { userId, status: { in: ["paid", "shipped", "delivered"] } } }),
    prisma.message.count({
      where: {
        sender: "support",
        readByUser: false,
        conversation: { userId },
      },
    }),
    prisma.dispute.count({
      where: { userId, status: { in: ["open", "in_progress"] } },
    }),
    prisma.wishlist.count({ where: { userId } }),
    prisma.quote.count({ where: { userId, status: "pending" } }),
  ]);

  const firstName = user?.firstName || user?.name?.split(" ")[0] || "";

  type Card = {
    href: string;
    label: string;
    icon: typeof IconUser;
    line: string;
  };

  const cards: Card[] = [
    {
      href: "/account/profile",
      label: tNav("profile"),
      icon: IconUser,
      line: user?.firstName
        ? `${user.firstName} ${user.lastName ?? ""}`.trim()
        : user?.email ?? "",
    },
    {
      href: "/account/orders",
      label: tNav("orders"),
      icon: IconShoppingBag,
      line: t("ordersCount", { count: ordersCount }),
    },
    {
      href: "/account/messages",
      label: tNav("messages"),
      icon: IconMessages,
      line: t("messagesUnread", { count: unreadMessages }),
    },
    {
      href: "/account/disputes",
      label: tNav("disputes"),
      icon: IconAlertTriangle,
      line: t("disputesOpen", { count: openDisputes }),
    },
    {
      href: "/account/wishlist",
      label: tNav("wishlist"),
      icon: IconHeart,
      line: t("wishlistCount", { count: wishlistCount }),
    },
    {
      href: "/account/quotes",
      label: tNav("quotes"),
      icon: IconFileDescription,
      line: t("quotesCount", { count: quotesCount }),
    },
    {
      href: "/account/invoices",
      label: tNav("invoices"),
      icon: IconFileInvoice,
      line: t("ordersCount", { count: paidCount }),
    },
  ];

  return (
    <div className="space-y-12">
      <section>
        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-2">
          {t("welcome")}
          {firstName ? `, ${firstName}` : ""}
        </p>
        <p className="text-muted max-w-2xl">{t("yourSpace")}</p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.href}
              href={c.href}
              className="group relative border border-border/60 p-6 glass hover:bg-background/70 transition-colors"
            >
              <Icon size={22} stroke={1.5} className="text-accent mb-6" />
              <h2 className="text-base font-medium">{c.label}</h2>
              <p className="text-sm text-muted mt-1 truncate">{c.line}</p>
              <IconArrowRight
                size={16}
                stroke={1.5}
                className="absolute top-6 right-6 text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
              />
            </Link>
          );
        })}
      </section>
    </div>
  );
}
