"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function sendMessageAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return;
  const body = String(formData.get("body") ?? "").trim();
  if (!body || body.length > 2000) return;

  const conversation = await prisma.conversation.upsert({
    where: { userId: session.user.id },
    update: { updatedAt: new Date() },
    create: { userId: session.user.id },
  });

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      sender: "user",
      body,
      readByUser: true,
      readByAdmin: false,
    },
  });

  // Auto-reply 1 time on first message to keep the thread feeling alive in demo.
  const messageCount = await prisma.message.count({
    where: { conversationId: conversation.id },
  });
  if (messageCount === 1) {
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        sender: "support",
        body: "Merci pour votre message. Un conseiller revient vers vous sous 24 h ouvrées.",
        readByUser: false,
        readByAdmin: true,
      },
    });
  }

  revalidatePath("/account/messages");
  revalidatePath("/account");
}

export async function markMessagesReadAction() {
  const session = await auth();
  if (!session?.user?.id) return;
  const conv = await prisma.conversation.findUnique({
    where: { userId: session.user.id },
  });
  if (!conv) return;
  await prisma.message.updateMany({
    where: { conversationId: conv.id, sender: "support", readByUser: false },
    data: { readByUser: true },
  });
  revalidatePath("/account/messages");
  revalidatePath("/account");
}
