"use client";

import { useEffect, useRef, useState } from "react";
import { addToCartFormAction } from "@/lib/actions/cart";
import { formatPrice } from "@/lib/format";
import { useTranslations } from "next-intl";

export function StickyMobileCTA({
  productId,
  priceCents,
  locale,
  inStock,
}: {
  productId: string;
  priceCents: number;
  locale: string;
  inStock: boolean;
}) {
  const t = useTranslations("product");
  const [show, setShow] = useState(false);
  const sentinel = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // The sentinel is placed near the original CTA button. When it scrolls out of view,
    // show the sticky bar.
    const target = document.getElementById("add-to-cart-anchor");
    if (!target) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinel} />
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border transition-transform duration-300 ${
          show ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <form
          action={addToCartFormAction}
          className="flex items-center gap-3 px-4 py-3"
        >
          <input type="hidden" name="productId" value={productId} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {formatPrice(priceCents, locale)}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted">
              {t("delivery")}
            </p>
          </div>
          <button
            type="submit"
            disabled={!inStock}
            className="btn-primary !py-3 !px-5 whitespace-nowrap disabled:opacity-40"
          >
            {inStock ? t("addToCart") : t("outOfStock")}
          </button>
        </form>
      </div>
    </>
  );
}
