"use server";

import Stripe from "stripe";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readCart } from "@/lib/cart";
import { auth } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

export async function createCheckoutSession(formData: FormData) {
  const cart = await readCart();
  if (cart.length === 0) redirect("/cart");

  const products = await prisma.product.findMany({
    where: { id: { in: cart.map((i) => i.productId) } },
  });

  const email = String(formData.get("email") ?? "");
  const fullName = String(formData.get("fullName") ?? "");
  const address = String(formData.get("address") ?? "");
  const city = String(formData.get("city") ?? "");
  const postalCode = String(formData.get("postalCode") ?? "");
  const country = String(formData.get("country") ?? "");
  const locale = String(formData.get("locale") ?? "fr");

  const session = await auth().catch(() => null);

  const items = cart.map((ci) => {
    const p = products.find((pp) => pp.id === ci.productId);
    if (!p) throw new Error("Product missing");
    return { product: p, quantity: ci.quantity };
  });
  const totalCents = items.reduce(
    (s, i) => s + i.product.priceCents * i.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      userId: session?.user?.id ?? null,
      email,
      fullName,
      address,
      city,
      postalCode,
      country,
      totalCents,
      items: {
        create: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          priceCents: i.product.priceCents,
        })),
      },
    },
  });

  if (!process.env.STRIPE_SECRET_KEY?.startsWith("sk_")) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "paid" },
    });
    redirect(`/${locale}/checkout/success?order=${order.id}`);
  }

  const stripeSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items: items.map((i) => ({
      quantity: i.quantity,
      price_data: {
        currency: "eur",
        unit_amount: i.product.priceCents,
        product_data: {
          name: `${i.product.brand} ${i.product.model}`,
          images: [i.product.heroImage],
        },
      },
    })),
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/checkout/success?order=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/checkout`,
    metadata: { orderId: order.id },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: stripeSession.id },
  });

  redirect(stripeSession.url!);
}
