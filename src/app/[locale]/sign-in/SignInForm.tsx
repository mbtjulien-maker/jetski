"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { signInAction, type AuthState } from "@/lib/actions/auth";

const initial: AuthState = {};

export function SignInForm() {
  const t = useTranslations("auth");
  const [state, action, pending] = useActionState(signInAction, initial);

  return (
    <form action={action} className="mt-10 space-y-5">
      <label className="block">
        <span className="block text-xs text-muted mb-1.5">{t("email")}</span>
        <input
          name="email"
          type="email"
          required
          className="w-full bg-surface border border-border px-3 py-2.5 text-sm focus:border-accent outline-none"
        />
      </label>
      <label className="block">
        <span className="block text-xs text-muted mb-1.5">{t("password")}</span>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          className="w-full bg-surface border border-border px-3 py-2.5 text-sm focus:border-accent outline-none"
        />
      </label>
      {state.error === "invalid" && (
        <p className="text-xs text-accent">{t("errorInvalid")}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full disabled:opacity-50"
      >
        {t("signInButton")}
      </button>
      <p className="text-xs text-muted text-center">
        {t("noAccount")}{" "}
        <Link href="/sign-up" className="text-foreground link-underline">
          {t("signUpButton")}
        </Link>
      </p>
    </form>
  );
}
