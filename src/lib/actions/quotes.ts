"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function updateQuoteStatusAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return;
  const quoteId = String(formData.get("quoteId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!quoteId || !["accepted", "declined"].includes(status)) return;

  await prisma.quote.updateMany({
    where: { id: quoteId, userId: session.user.id, status: "pending" },
    data: { status },
  });

  revalidatePath("/account/quotes");
  revalidatePath("/account");
}
