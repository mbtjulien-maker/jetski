import Image from "next/image";
import type { ReactNode } from "react";
import { promises as fs } from "fs";
import path from "path";

/**
 * Brand marks for the marquee.
 *
 * Real logos are trademarks; drop the official SVGs in `public/logos/`
 * named `<slug>.svg` (e.g. `sea-doo.svg`, `yamaha.svg`) and they will
 * be picked up automatically. Until then, each brand uses a stylized
 * fallback wordmark with its own visual treatment.
 */

type Brand = {
  slug: string;
  name: string;
  Fallback: () => ReactNode;
};

const BRANDS: Brand[] = [
  {
    slug: "sea-doo",
    name: "Sea-Doo",
    Fallback: () => (
      <span className="font-impact text-3xl italic flex items-center gap-2">
        <span className="w-2 h-2 bg-accent rotate-45" />
        SEA-DOO
      </span>
    ),
  },
  {
    slug: "yamaha",
    name: "Yamaha",
    Fallback: () => (
      <span className="font-impact text-3xl flex items-center gap-3">
        <span className="flex gap-[3px] h-6 items-end">
          <span className="w-[3px] h-4 bg-current" />
          <span className="w-[3px] h-6 bg-current" />
          <span className="w-[3px] h-4 bg-current" />
        </span>
        YAMAHA
      </span>
    ),
  },
  {
    slug: "kawasaki",
    name: "Kawasaki",
    Fallback: () => (
      <span className="font-impact text-3xl italic relative px-1">
        KAWASAKI
        <span className="absolute -bottom-1 left-0 right-2 h-[2px] bg-accent" />
      </span>
    ),
  },
];

async function brandsWithLogos() {
  const dir = path.join(process.cwd(), "public", "logos");
  let files: string[] = [];
  try {
    files = await fs.readdir(dir);
  } catch {
    // logos directory doesn't exist yet
  }
  const available = new Set(
    files
      .filter((f) => /\.(svg|png|webp)$/i.test(f))
      .map((f) => f.replace(/\.(svg|png|webp)$/i, ""))
  );
  const fileExt = (slug: string) =>
    files.find((f) => f.startsWith(slug + ".")) || "";
  return BRANDS.map((b) => ({
    ...b,
    logoFile: available.has(b.slug) ? `/logos/${fileExt(b.slug)}` : null,
  }));
}

export async function BrandsMarquee({ title }: { title?: string }) {
  const items = await brandsWithLogos();

  const Row = () => (
    <div className="flex items-center gap-x-16 px-8 shrink-0">
      {items.map(({ slug, name, logoFile, Fallback }) => (
        <span
          key={slug}
          className="flex items-center text-foreground/70 hover:text-foreground transition-colors h-10"
        >
          {logoFile ? (
            <Image
              src={logoFile}
              alt={name}
              width={140}
              height={40}
              unoptimized
              className="h-10 w-auto object-contain"
            />
          ) : (
            <Fallback />
          )}
        </span>
      ))}
    </div>
  );

  return (
    <section className="border-y border-border py-14 overflow-hidden bg-background">
      {title && (
        <p className="text-xs uppercase tracking-[0.3em] text-muted text-center mb-10">
          {title}
        </p>
      )}
      <div className="relative overflow-hidden">
        <div className="brand-marquee-track">
          <Row />
          <Row />
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background via-background/80 to-transparent" />
      </div>
    </section>
  );
}
