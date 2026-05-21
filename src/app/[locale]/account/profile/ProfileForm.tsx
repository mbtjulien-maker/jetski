"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { updateProfileAction, type ProfileState } from "@/lib/actions/profile";

type UserShape = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  country: string;
};

const initial: ProfileState = {};

export function ProfileForm({ user }: { user: UserShape }) {
  const t = useTranslations("account.profile");
  const [state, action, pending] = useActionState(updateProfileAction, initial);

  return (
    <form action={action} className="space-y-10">
      <fieldset className="space-y-5">
        <legend className="text-xs uppercase tracking-[0.25em] text-muted mb-4">
          {t("personal")}
        </legend>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label={t("firstName")} name="firstName" defaultValue={user.firstName} />
          <Field label={t("lastName")} name="lastName" defaultValue={user.lastName} />
        </div>
        <Field label={t("email")} name="email" defaultValue={user.email} disabled />
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label={t("phone")} name="phone" defaultValue={user.phone} />
          <Field
            label={t("dateOfBirth")}
            name="dateOfBirth"
            type="date"
            defaultValue={user.dateOfBirth}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-xs uppercase tracking-[0.25em] text-muted mb-4">
          {t("addressTitle")}
        </legend>
        <Field label={t("addressLine1")} name="addressLine1" defaultValue={user.addressLine1} />
        <Field label={t("addressLine2")} name="addressLine2" defaultValue={user.addressLine2} />
        <div className="grid sm:grid-cols-3 gap-5">
          <Field label={t("postalCode")} name="postalCode" defaultValue={user.postalCode} />
          <Field label={t("city")} name="city" defaultValue={user.city} />
          <Field label={t("country")} name="country" defaultValue={user.country} />
        </div>
      </fieldset>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="btn-primary disabled:opacity-50">
          {t("save")}
        </button>
        {state.saved && (
          <span className="text-sm text-accent">{t("saved")}</span>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  disabled,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs text-muted mb-1.5">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        disabled={disabled}
        className="w-full bg-surface border border-border px-3 py-2.5 text-sm focus:border-accent outline-none disabled:opacity-60"
      />
    </label>
  );
}
