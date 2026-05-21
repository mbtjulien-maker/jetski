"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function toggleWishlistAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { redirect: "/sign-in" } as const;
  const productId = String(formData.get("productId") ?? "");
  if (!productId) return { ok: false } as const;

  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });

  if (existing) {
    await prisma.wishlist.delete({ where: { id: existing.id } });
  } else {
    await prisma.wishlist.create({
      data: { userId: session.user.id, productId },
    });
  }

  revalidatePath("/account/wishlist");
  revalidatePath("/account");
  revalidatePath("/", "layout");
  return { ok: true } as const;
}
