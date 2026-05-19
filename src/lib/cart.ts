import { cookies } from "next/headers";

export type CartItem = { productId: string; quantity: number };
export type Cart = CartItem[];

const COOKIE = "cart";

export async function readCart(): Promise<Cart> {
  const c = (await cookies()).get(COOKIE)?.value;
  if (!c) return [];
  try {
    const parsed = JSON.parse(c);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i): i is CartItem =>
        typeof i?.productId === "string" && typeof i?.quantity === "number"
    );
  } catch {
    return [];
  }
}

export async function writeCart(cart: Cart) {
  (await cookies()).set(COOKIE, JSON.stringify(cart), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearCart() {
  (await cookies()).delete(COOKIE);
}

export function cartCount(cart: Cart) {
  return cart.reduce((sum, i) => sum + i.quantity, 0);
}
