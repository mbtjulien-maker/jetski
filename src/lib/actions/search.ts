"use server";

import { prisma } from "@/lib/prisma";

export type SearchResult = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  priceCents: number;
  heroImage: string;
  condition: string;
};

export async function searchProductsAction(
  query: string
): Promise<SearchResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const lower = q.toLowerCase();
  const results = await prisma.product.findMany({
    where: {
      OR: [
        { brand: { contains: lower } },
        { model: { contains: lower } },
        { slug: { contains: lower } },
      ],
    },
    orderBy: { priceCents: "desc" },
    take: 8,
    select: {
      id: true,
      slug: true,
      brand: true,
      model: true,
      year: true,
      priceCents: true,
      heroImage: true,
      condition: true,
    },
  });

  return results;
}
