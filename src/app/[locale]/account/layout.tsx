import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AccountSidebar } from "@/components/AccountSidebar";

export default async function AccountLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();
  if (!session?.user) redirect(`/${locale}/sign-in`);
  const t = await getTranslations("account");

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-muted mb-2">
          {t("title")}
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-light tracking-tight">
          {session.user.name ?? session.user.email}
        </h1>
      </header>
      <div className="grid lg:grid-cols-[240px_1fr] gap-12">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <AccountSidebar />
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
