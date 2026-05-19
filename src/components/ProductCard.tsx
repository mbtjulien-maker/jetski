import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/format";
import { getTranslations } from "next-intl/server";

type Props = {
  product: {
    slug: string;
    brand: string;
    model: string;
    year: number;
    priceCents: number;
    power: number;
    condition: string;
    heroImage: string;
  };
  locale: string;
};

export async function ProductCard({ product, locale }: Props) {
  const t = await getTranslations("product");
  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-[4/3] bg-surface overflow-hidden">
        <Image
          src={product.heroImage}
          alt={`${product.brand} ${product.model}`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.condition === "occasion" && (
          <span className="absolute top-3 left-3 bg-foreground text-background text-[10px] uppercase tracking-wider px-2 py-1">
            {t("condition")}
          </span>
        )}
      </div>
      <div className="pt-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted">{product.brand}</p>
          <h3 className="text-base font-medium mt-1 group-hover:text-accent transition-colors">
            {product.model}
          </h3>
          <p className="text-xs text-muted mt-1">
            {product.year} · {product.power} {t("hp")}
          </p>
        </div>
        <p className="text-base font-medium whitespace-nowrap">
          {formatPrice(product.priceCents, locale)}
        </p>
      </div>
    </Link>
  );
}
