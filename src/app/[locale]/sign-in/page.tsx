import { setRequestLocale, getTranslations } from "next-intl/server";
import { SignInForm } from "./SignInForm";

export default async function SignInPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");
  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <h1 className="font-display text-4xl font-light tracking-tight">{t("signInTitle")}</h1>
      <p className="text-muted mt-2">{t("signInSubtitle")}</p>
      <SignInForm />
    </div>
  );
}
