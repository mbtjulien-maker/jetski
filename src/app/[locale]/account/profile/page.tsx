import { setRequestLocale, getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("account.profile");

  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) return null;

  return (
    <section className="space-y-6">
      <header>
        <h2 className="font-display text-3xl font-light tracking-tight">
          {t("title")}
        </h2>
        <p className="text-muted mt-2">{t("subtitle")}</p>
      </header>
      <ProfileForm
        user={{
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          email: user.email,
          phone: user.phone ?? "",
          dateOfBirth: user.dateOfBirth
            ? user.dateOfBirth.toISOString().slice(0, 10)
            : "",
          addressLine1: user.addressLine1 ?? "",
          addressLine2: user.addressLine2 ?? "",
          city: user.city ?? "",
          postalCode: user.postalCode ?? "",
          country: user.country ?? "",
        }}
      />
    </section>
  );
}
