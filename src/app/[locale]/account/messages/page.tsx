import { setRequestLocale, getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  sendMessageAction,
  markMessagesReadAction,
} from "@/lib/actions/messages";
import { MessageComposer } from "./MessageComposer";

export default async function MessagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("account.messages");

  const session = await auth();
  if (!session?.user?.id) return null;

  const conversation = await prisma.conversation.findUnique({
    where: { userId: session.user.id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  // Mark support messages as read on open
  if (conversation) {
    const hasUnread = conversation.messages.some(
      (m) => m.sender === "support" && !m.readByUser
    );
    if (hasUnread) await markMessagesReadAction();
  }

  const messages = conversation?.messages ?? [];

  return (
    <section className="space-y-6 flex flex-col h-[calc(100vh-16rem)] min-h-[500px]">
      <header>
        <h2 className="font-display text-3xl font-light tracking-tight">
          {t("title")}
        </h2>
        <p className="text-muted text-sm mt-2">{t("subtitle")}</p>
      </header>

      <div className="flex-1 border border-border/60 overflow-y-auto p-6 space-y-4 glass">
        {messages.length === 0 ? (
          <p className="text-muted text-center py-12">{t("empty")}</p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 ${
                  m.sender === "user"
                    ? "bg-accent text-background"
                    : "glass-strong border border-border/60"
                }`}
              >
                <p className="text-[10px] uppercase tracking-wider opacity-70 mb-1">
                  {m.sender === "user" ? t("you") : t("support")} ·{" "}
                  {m.createdAt.toLocaleString(locale, {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {m.body}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <MessageComposer
        action={sendMessageAction}
        placeholder={t("placeholder")}
        sendLabel={t("send")}
      />
    </section>
  );
}
