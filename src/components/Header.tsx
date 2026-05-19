import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { IconShoppingBag, IconUser } from "@tabler/icons-react";
import { readCart, cartCount } from "@/lib/cart";
import { auth } from "@/lib/auth";

export async function Header() {
  const t = await getTranslations("nav");
  const cart = await readCart();
  const count = cartCount(cart);
  const session = await auth().catch(() => null);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/shop" className="link-underline">{t("shop")}</Link>
          <Link href="/shop?condition=new" className="link-underline">{t("newArrivals")}</Link>
          <Link href="/shop?condition=occasion" className="link-underline">{t("occasion")}</Link>
          <Link href="/about" className="link-underline">{t("about")}</Link>
          <Link href="/contact" className="link-underline">{t("contact")}</Link>
        </nav>
        <div className="flex items-center gap-5">
          <LocaleSwitcher />
          <Link
            href={session?.user ? "/account" : "/sign-in"}
            className="hover:text-accent transition-colors"
            aria-label={t("account")}
          >
            <IconUser size={20} stroke={1.5} />
          </Link>
          <Link
            href="/cart"
            className="relative hover:text-accent transition-colors"
            aria-label={t("cart")}
          >
            <IconShoppingBag size={20} stroke={1.5} />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-accent text-background text-[10px] font-medium w-4 h-4 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
