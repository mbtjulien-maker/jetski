"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const profileSchema = z.object({
  firstName: z.string().max(80).optional().nullable(),
  lastName: z.string().max(80).optional().nullable(),
  phone: z.string().max(40).optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  addressLine1: z.string().max(160).optional().nullable(),
  addressLine2: z.string().max(160).optional().nullable(),
  city: z.string().max(80).optional().nullable(),
  postalCode: z.string().max(20).optional().nullable(),
  country: z.string().max(80).optional().nullable(),
});

export type ProfileState = { saved?: boolean; error?: string };

function asStringOrNull(v: FormDataEntryValue | null) {
  if (v === null) return null;
  const s = String(v).trim();
  return s ? s : null;
}

export async function updateProfileAction(
  _prev: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "auth" };

  const parsed = profileSchema.safeParse({
    firstName: asStringOrNull(formData.get("firstName")),
    lastName: asStringOrNull(formData.get("lastName")),
    phone: asStringOrNull(formData.get("phone")),
    dateOfBirth: asStringOrNull(formData.get("dateOfBirth")),
    addressLine1: asStringOrNull(formData.get("addressLine1")),
    addressLine2: asStringOrNull(formData.get("addressLine2")),
    city: asStringOrNull(formData.get("city")),
    postalCode: asStringOrNull(formData.get("postalCode")),
    country: asStringOrNull(formData.get("country")),
  });
  if (!parsed.success) return { error: "invalid" };

  const dob = parsed.data.dateOfBirth
    ? new Date(parsed.data.dateOfBirth)
    : null;
  if (dob && Number.isNaN(dob.getTime())) return { error: "invalid" };

  const name =
    [parsed.data.firstName, parsed.data.lastName].filter(Boolean).join(" ") ||
    undefined;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      phone: parsed.data.phone,
      dateOfBirth: dob,
      addressLine1: parsed.data.addressLine1,
      addressLine2: parsed.data.addressLine2,
      city: parsed.data.city,
      postalCode: parsed.data.postalCode,
      country: parsed.data.country,
      ...(name ? { name } : {}),
    },
  });

  revalidatePath("/account", "layout");
  return { saved: true };
}
