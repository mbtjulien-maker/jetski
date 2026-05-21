import Image from "next/image";
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
    <div className="relative isolate">
      {/* Background photo of the jetskis showroom */}
      <div className="fixed inset-0 -z-10" aria-hidden="true">
        <Image
          src="/hero-alt.webp"
          alt=""
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-background/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background/85" />
      </div>

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
            <div className="border border-border/60 bg-background/55 backdrop-blur-md p-3">
              <AccountSidebar />
            </div>
          </aside>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
