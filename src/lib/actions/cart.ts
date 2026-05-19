"use server";

import { revalidatePath } from "next/cache";
import { readCart, writeCart, clearCart } from "@/lib/cart";

export async function addToCart(productId: string, quantity = 1) {
  const cart = await readCart();
  const existing = cart.find((i) => i.productId === productId);
  if (existing) existing.quantity += quantity;
  else cart.push({ productId, quantity });
  await writeCart(cart);
  revalidatePath("/", "layout");
}

export async function addToCartFormAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  if (!productId) return;
  await addToCart(productId, 1);
}

export async function updateQuantity(productId: string, quantity: number) {
  let cart = await readCart();
  if (quantity <= 0) {
    cart = cart.filter((i) => i.productId !== productId);
  } else {
    const item = cart.find((i) => i.productId === productId);
    if (item) item.quantity = quantity;
  }
  await writeCart(cart);
  revalidatePath("/", "layout");
}

export async function removeFromCart(productId: string) {
  const cart = (await readCart()).filter((i) => i.productId !== productId);
  await writeCart(cart);
  revalidatePath("/", "layout");
}

export async function removeFromCartFormAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  if (productId) await removeFromCart(productId);
}

export async function emptyCart() {
  await clearCart();
  revalidatePath("/", "layout");
}
