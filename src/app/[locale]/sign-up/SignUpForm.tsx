"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { signUpAction, type AuthState } from "@/lib/actions/auth";

const initial: AuthState = {};

export function SignUpForm() {
  const t = useTranslations("auth");
  const [state, action, pending] = useActionState(signUpAction, initial);

  return (
    <form action={action} className="mt-10 space-y-5">
      <label className="block">
        <span className="block text-xs text-muted mb-1.5">{t("name")}</span>
        <input
          name="name"
          required
          className="w-full bg-surface border border-border px-3 py-2.5 text-sm focus:border-accent outline-none"
        />
      </label>
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
          minLength={8}
          className="w-full bg-surface border border-border px-3 py-2.5 text-sm focus:border-accent outline-none"
        />
      </label>
      {state.error === "exists" && (
        <p className="text-xs text-accent">{t("errorExists")}</p>
      )}
      {state.error === "invalid" && (
        <p className="text-xs text-accent">{t("errorInvalid")}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full disabled:opacity-50"
      >
        {t("signUpButton")}
      </button>
      <p className="text-xs text-muted text-center">
        {t("hasAccount")}{" "}
        <Link href="/sign-in" className="text-foreground link-underline">
          {t("signInButton")}
        </Link>
      </p>
    </form>
  );
}
