"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { IconX, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const next = useCallback(
    () => setLightbox((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );
  const prev = useCallback(
    () =>
      setLightbox((i) =>
        i === null ? null : (i - 1 + images.length) % images.length
      ),
    [images.length]
  );

  useEffect(() => {
    if (lightbox === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, next, prev]);

  return (
    <>
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setLightbox(active)}
          className="relative aspect-[4/3] bg-surface overflow-hidden w-full cursor-zoom-in group"
          aria-label="Zoom"
        >
          <Image
            src={images[active]}
            alt={alt}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </button>
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {images.slice(0, 4).map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                onDoubleClick={() => setLightbox(i)}
                className={`relative aspect-[4/3] bg-surface overflow-hidden transition-opacity ${
                  i === active ? "ring-1 ring-accent" : "opacity-70 hover:opacity-100"
                }`}
                aria-label={`Photo ${i + 1}`}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 12vw, 25vw"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 hover:text-accent transition-colors z-10"
            aria-label="Close"
          >
            <IconX size={28} stroke={1.5} />
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 hover:text-accent transition-colors z-10"
                aria-label="Previous"
              >
                <IconChevronLeft size={36} stroke={1.5} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 hover:text-accent transition-colors z-10"
                aria-label="Next"
              >
                <IconChevronRight size={36} stroke={1.5} />
              </button>
            </>
          )}
          <div
            className="relative w-[92vw] h-[80vh] max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightbox]}
              alt={alt}
              fill
              sizes="92vw"
              className="object-contain"
              priority
            />
          </div>
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted uppercase tracking-wider">
            {lightbox + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}
