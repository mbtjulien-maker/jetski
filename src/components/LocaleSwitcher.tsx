"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useTransition } from "react";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={locale}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value as (typeof routing.locales)[number];
        startTransition(() => {
          router.replace(pathname, { locale: next });
        });
      }}
      className="bg-transparent text-xs uppercase tracking-wider border-none outline-none cursor-pointer hover:text-accent transition-colors"
      aria-label="Language"
    >
      {routing.locales.map((l) => (
        <option key={l} value={l} className="bg-surface text-foreground">
          {l.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
