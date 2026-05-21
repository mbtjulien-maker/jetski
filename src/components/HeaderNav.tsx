"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  IconBuildingStore,
  IconSparkles,
  IconRecycle,
  IconInfoCircle,
  IconMail,
  type Icon,
} from "@tabler/icons-react";

type Item = { href: string; key: string; Icon: Icon };

const ITEMS: Item[] = [
  { href: "/shop", key: "shop", Icon: IconBuildingStore },
  { href: "/shop?condition=new", key: "newArrivals", Icon: IconSparkles },
  { href: "/shop?condition=occasion", key: "occasion", Icon: IconRecycle },
  { href: "/about", key: "about", Icon: IconInfoCircle },
  { href: "/contact", key: "contact", Icon: IconMail },
];

export function HeaderNav() {
  const t = useTranslations("nav");
  return (
    <nav className="hidden md:flex items-center gap-1">
      {ITEMS.map(({ href, key, Icon }) => (
        <Link
          key={key}
          href={href}
          className="group relative w-10 h-10 flex items-center justify-center text-foreground/80 hover:text-accent transition-colors"
          aria-label={t(key)}
        >
          <Icon size={20} stroke={1.5} />
          <span
            className="pointer-events-none absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.2em] text-foreground/90 bg-background/90 backdrop-blur-md border border-border/70 px-2 py-1 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150"
          >
            {t(key)}
          </span>
        </Link>
      ))}
    </nav>
  );
}
