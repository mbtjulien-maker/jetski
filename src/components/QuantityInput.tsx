"use client";

import { useTransition } from "react";
import { updateQuantity } from "@/lib/actions/cart";

export function QuantityInput({
  productId,
  defaultValue,
  max,
}: {
  productId: string;
  defaultValue: number;
  max: number;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <input
      type="number"
      defaultValue={defaultValue}
      min={1}
      max={max}
      disabled={pending}
      onChange={(e) => {
        const q = Number(e.target.value);
        startTransition(() => updateQuantity(productId, q));
      }}
      className="w-16 bg-surface border border-border px-2 py-1 text-sm focus:border-accent outline-none disabled:opacity-50"
    />
  );
}
