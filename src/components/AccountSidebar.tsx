"use client";

import { Link, usePathname } from "@/i18n/navigation";
import {
  IconUser,
  IconShoppingBag,
  IconMessages,
  IconAlertTriangle,
  IconHeart,
  IconFileInvoice,
  IconFileDescription,
  IconLayoutDashboard,
  IconLogout,
} from "@tabler/icons-react";
import { signOutAction } from "@/lib/actions/auth";
import { useTranslations } from "next-intl";

const items = [
  { href: "/account", labelKey: "dashboard", icon: IconLayoutDashboard, exact: true },
  { href: "/account/profile", labelKey: "profile", icon: IconUser },
  { href: "/account/orders", labelKey: "orders", icon: IconShoppingBag },
  { href: "/account/messages", labelKey: "messages", icon: IconMessages },
  { href: "/account/disputes", labelKey: "disputes", icon: IconAlertTriangle },
  { href: "/account/wishlist", labelKey: "wishlist", icon: IconHeart },
  { href: "/account/quotes", labelKey: "quotes", icon: IconFileDescription },
  { href: "/account/invoices", labelKey: "invoices", icon: IconFileInvoice },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const t = useTranslations("account.nav");

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors border-l-2 ${
              active
                ? "border-accent text-foreground bg-surface"
                : "border-transparent text-muted hover:text-foreground hover:bg-surface/50"
            }`}
          >
            <Icon size={18} stroke={1.5} />
            <span>{t(item.labelKey)}</span>
          </Link>
        );
      })}
      <form action={signOutAction} className="mt-6 pt-6 border-t border-border">
        <button
          type="submit"
          className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-muted hover:text-accent transition-colors"
        >
          <IconLogout size={18} stroke={1.5} />
          {t("signOut")}
        </button>
      </form>
    </nav>
  );
}
