"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { IconSearch, IconX } from "@tabler/icons-react";
import {
  searchProductsAction,
  type SearchResult,
} from "@/lib/actions/search";
import { formatPrice } from "@/lib/format";

export function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("nav");

  // Focus input on open, lock scroll, esc to close
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      startTransition(async () => {
        const r = await searchProductsAction(query);
        setResults(r);
      });
    }, 180);
    return () => clearTimeout(timer);
  }, [query, open]);

  const placeholder =
    locale === "fr"
      ? "Rechercher un jetski, une marque…"
      : locale === "de"
        ? "Jetski oder Marke suchen…"
        : locale === "it"
          ? "Cerca una moto d'acqua o un marchio…"
          : "Search a jetski, a brand…";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hover:text-accent transition-colors"
        aria-label="Search"
      >
        <IconSearch size={20} stroke={1.5} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[150] bg-background/95 backdrop-blur-md"
          onClick={() => setOpen(false)}
        >
          <div
            className="mx-auto max-w-3xl px-6 pt-24"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 border-b border-border pb-4">
              <IconSearch size={22} stroke={1.5} className="text-muted shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted/60"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-muted hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <IconX size={22} stroke={1.5} />
              </button>
            </div>

            <div className="mt-6">
              {query.trim().length < 2 ? (
                <p className="text-sm text-muted py-8 text-center">
                  {locale === "fr"
                    ? "Tapez au moins 2 caractères."
                    : "Type at least 2 characters."}
                </p>
              ) : pending ? (
                <p className="text-sm text-muted py-8 text-center animate-pulse">
                  …
                </p>
              ) : results.length === 0 ? (
                <p className="text-sm text-muted py-8 text-center">
                  {locale === "fr"
                    ? "Aucun résultat."
                    : locale === "de"
                      ? "Keine Ergebnisse."
                      : locale === "it"
                        ? "Nessun risultato."
                        : "No results."}
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {results.map((r) => (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          router.push(`/shop/${r.slug}`);
                        }}
                        className="w-full flex items-center gap-4 py-3 text-left hover:bg-surface/60 transition-colors px-2"
                      >
                        <div className="relative w-16 h-12 shrink-0 bg-surface overflow-hidden">
                          <Image
                            src={r.heroImage}
                            alt=""
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs uppercase tracking-wider text-muted">
                            {r.brand}
                          </p>
                          <p className="text-sm font-medium truncate">
                            {r.model}
                          </p>
                        </div>
                        <p className="text-sm font-medium whitespace-nowrap">
                          {formatPrice(r.priceCents, locale)}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
