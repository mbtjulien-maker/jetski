"use client";

import { useTransition, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { toggleWishlistAction } from "@/lib/actions/wishlist";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";

export function WishlistButton({
  productId,
  initial,
  size = 22,
  className = "",
  requiresAuth,
}: {
  productId: string;
  initial: boolean;
  size?: number;
  className?: string;
  requiresAuth?: boolean;
}) {
  const [active, setActive] = useState(initial);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label="Favori"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (requiresAuth) {
          router.push("/sign-in");
          return;
        }
        const next = !active;
        setActive(next); // optimistic
        const fd = new FormData();
        fd.append("productId", productId);
        startTransition(async () => {
          const res = await toggleWishlistAction(fd);
          if (res && "redirect" in res && res.redirect) {
            router.push(res.redirect as "/sign-in");
          }
        });
      }}
      disabled={pending}
      className={`inline-flex items-center justify-center transition-colors ${
        active ? "text-accent" : "text-foreground/70 hover:text-accent"
      } ${className}`}
    >
      {active ? (
        <IconHeartFilled size={size} />
      ) : (
        <IconHeart size={size} stroke={1.5} />
      )}
    </button>
  );
}
