import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { emptyCart } from "@/lib/actions/cart";
import { IconCircleCheck } from "@tabler/icons-react";

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  if (sp.order) {
    await prisma.order
      .update({ where: { id: sp.order }, data: { status: "paid" } })
      .catch(() => null);
  }
  await emptyCart();

  return (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <IconCircleCheck size={48} stroke={1.5} className="text-accent mx-auto mb-8" />
      <h1 className="font-display-italic text-4xl md:text-5xl font-light tracking-tight">
        Merci pour votre commande
      </h1>
      <p className="text-muted mt-4">
        Un e-mail de confirmation vous a été envoyé. Notre équipe revient vers vous sous 24h.
      </p>
      <div className="mt-12 flex justify-center gap-4">
        <Link href="/account" className="btn-primary">
          Mes commandes
        </Link>
        <Link href="/shop" className="btn-ghost">
          Continuer
        </Link>
      </div>
    </div>
  );
}
