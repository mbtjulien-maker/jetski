"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const VALID_THEMES = [
  "delivery",
  "defect",
  "billing",
  "warranty",
  "refund",
  "documents",
  "other",
] as const;

const disputeSchema = z.object({
  theme: z.enum(VALID_THEMES),
  subject: z.string().min(2).max(160),
  body: z.string().min(10).max(4000),
  orderId: z.string().optional().nullable(),
});

export async function createDisputeAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return;
  const locale = String(formData.get("locale") ?? "fr");

  const parsed = disputeSchema.safeParse({
    theme: formData.get("theme"),
    subject: formData.get("subject"),
    body: formData.get("body"),
    orderId: formData.get("orderId") || null,
  });
  if (!parsed.success) return;

  const dispute = await prisma.dispute.create({
    data: {
      userId: session.user.id,
      theme: parsed.data.theme,
      subject: parsed.data.subject,
      body: parsed.data.body,
      orderId: parsed.data.orderId || null,
      status: "open",
    },
  });

  revalidatePath("/account/disputes");
  revalidatePath("/account");
  redirect(`/${locale}/account/disputes/${dispute.id}`);
}
