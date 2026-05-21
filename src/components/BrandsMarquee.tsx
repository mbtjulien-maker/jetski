import type { ReactNode } from "react";

/**
 * Brand wordmarks — stylized SVGs that evoke each marque's identity.
 * Replace with official brand kits when available (dealer agreements
 * usually grant access to the manufacturer's SVG resources).
 */

const SeaDoo = () => (
  <svg viewBox="0 0 220 60" className="h-9 w-auto" fill="currentColor" aria-label="Sea-Doo">
    <text
      x="0"
      y="44"
      fontFamily="var(--font-impact), Impact, sans-serif"
      fontSize="46"
      letterSpacing="-1"
      fontStyle="italic"
    >
      SEA-DOO
    </text>
  </svg>
);

const Yamaha = () => (
  <svg viewBox="0 0 240 60" className="h-9 w-auto" fill="currentColor" aria-label="Yamaha">
    <text
      x="0"
      y="44"
      fontFamily="var(--font-impact), Impact, sans-serif"
      fontSize="46"
      letterSpacing="4"
    >
      YAMAHA
    </text>
  </svg>
);

const Kawasaki = () => (
  <svg viewBox="0 0 280 60" className="h-9 w-auto" fill="currentColor" aria-label="Kawasaki">
    <text
      x="0"
      y="44"
      fontFamily="var(--font-impact), Impact, sans-serif"
      fontSize="46"
      letterSpacing="2"
      fontStyle="italic"
    >
      KAWASAKI
    </text>
  </svg>
);

const BRP = () => (
  <svg viewBox="0 0 110 60" className="h-9 w-auto" fill="currentColor" aria-label="BRP">
    <text
      x="0"
      y="44"
      fontFamily="var(--font-impact), Impact, sans-serif"
      fontSize="46"
      letterSpacing="2"
    >
      BRP
    </text>
  </svg>
);

const Krash = () => (
  <svg viewBox="0 0 170 60" className="h-9 w-auto" fill="currentColor" aria-label="Krash">
    <text
      x="0"
      y="44"
      fontFamily="var(--font-impact), Impact, sans-serif"
      fontSize="46"
      letterSpacing="3"
    >
      KRASH
    </text>
  </svg>
);

const HSR = () => (
  <svg viewBox="0 0 130 60" className="h-9 w-auto" fill="currentColor" aria-label="HSR">
    <text
      x="0"
      y="44"
      fontFamily="var(--font-impact), Impact, sans-serif"
      fontSize="46"
      letterSpacing="4"
    >
      HSR
    </text>
  </svg>
);

const Honda = () => (
  <svg viewBox="0 0 200 60" className="h-9 w-auto" fill="currentColor" aria-label="Honda">
    <text
      x="0"
      y="44"
      fontFamily="var(--font-impact), Impact, sans-serif"
      fontSize="46"
      letterSpacing="3"
    >
      HONDA
    </text>
  </svg>
);

const BRANDS: { name: string; Mark: () => ReactNode }[] = [
  { name: "Sea-Doo", Mark: SeaDoo },
  { name: "Yamaha", Mark: Yamaha },
  { name: "Kawasaki", Mark: Kawasaki },
  { name: "BRP", Mark: BRP },
  { name: "Krash", Mark: Krash },
  { name: "HSR", Mark: HSR },
  { name: "Honda", Mark: Honda },
];

export function BrandsMarquee({ title }: { title?: string }) {
  // We render the list twice so the loop is seamless when translating -50%.
  const Row = () => (
    <div className="flex items-center gap-x-20 px-10 shrink-0">
      {BRANDS.map(({ name, Mark }) => (
        <span
          key={name}
          className="flex items-center text-foreground/70 hover:text-foreground transition-colors"
        >
          <Mark />
        </span>
      ))}
    </div>
  );

  return (
    <section className="border-y border-border py-12 overflow-hidden">
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
        {/* Side fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  );
}
