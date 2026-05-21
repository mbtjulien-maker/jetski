"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Link, useRouter, usePathname as useIntlPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { IconMenu2, IconX } from "@tabler/icons-react";

export function MobileMenu({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const intlPathname = useIntlPathname();
  const rawPathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [rawPathname]);

  // Prevent body scroll while open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden hover:text-accent transition-colors"
        aria-label="Menu"
      >
        <IconMenu2 size={22} stroke={1.5} />
      </button>

      <div
        className={`md:hidden fixed inset-0 z-[100] bg-background transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 px-6 flex items-center justify-between border-b border-border">
            <span className="text-xs uppercase tracking-[0.3em] text-muted">
              Menu
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="hover:text-accent transition-colors"
            >
              <IconX size={22} stroke={1.5} />
            </button>
          </div>

          <nav className="flex-1 px-6 py-10 flex flex-col gap-1">
            <MobileLink href="/shop" label={t("shop")} />
            <MobileLink href="/shop?condition=new" label={t("newArrivals")} />
            <MobileLink href="/shop?condition=occasion" label={t("occasion")} />
            <MobileLink href="/about" label={t("about")} />
            <MobileLink href="/contact" label={t("contact")} />
            <div className="border-t border-border my-6" />
            <MobileLink
              href={isAuthenticated ? "/account" : "/sign-in"}
              label={t("account")}
            />
            <MobileLink href="/cart" label={t("cart")} />
          </nav>

          <div className="px-6 py-8 border-t border-border">
            <p className="text-xs uppercase tracking-[0.3em] text-muted mb-4">
              Language
            </p>
            <div className="flex flex-wrap gap-2">
              {routing.locales.map((l) => (
                <button
                  key={l}
                  onClick={() => router.replace(intlPathname, { locale: l })}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider border transition-colors ${
                    l === locale
                      ? "border-accent text-accent"
                      : "border-border text-muted hover:text-foreground"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function MobileLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="font-display text-3xl font-light py-3 hover:text-accent transition-colors"
    >
      {label}
    </Link>
  );
}
