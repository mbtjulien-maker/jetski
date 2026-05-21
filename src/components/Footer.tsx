import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <Logo />
          <p className="mt-4 text-sm text-muted max-w-xs leading-relaxed">
            {t("tagline")}
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider text-muted mb-4">{t("shop")}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shop" className="link-underline">{tNav("shop")}</Link></li>
            <li><Link href="/shop?condition=new" className="link-underline">{tNav("newArrivals")}</Link></li>
            <li><Link href="/shop?condition=occasion" className="link-underline">{tNav("occasion")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider text-muted mb-4">{t("company")}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="link-underline">{tNav("about")}</Link></li>
            <li><Link href="/contact" className="link-underline">{tNav("contact")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider text-muted mb-4">{t("legal")}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/terms" className="link-underline">{t("terms")}</Link></li>
            <li><Link href="/privacy" className="link-underline">{t("privacy")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-6 text-xs text-muted flex flex-col md:flex-row justify-between gap-2">
          <span>© {year} Riderz. {t("rights")}</span>
          <span>Made in Europe</span>
        </div>
      </div>
    </footer>
  );
}
