"use client";

import { useEffect, useState } from "react";

type Props = {
  text: string;
  className?: string;
  stagger?: number; // ms between each letter
  duration?: number; // ms per letter
};

export function FallingText({
  text,
  className = "",
  stagger = 45,
  duration = 700,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Split into words first, then characters. Preserves word boundaries.
  const words = text.split(" ");

  return (
    <span
      className={className}
      aria-label={text}
      style={{ display: "inline-block" }}
    >
      {words.map((word, wIdx) => {
        // Compute char offset across all previous words (incl. spaces).
        const charsBefore = words
          .slice(0, wIdx)
          .reduce((sum, w) => sum + w.length + 1, 0);

        return (
          <span
            key={wIdx}
            className="inline-block whitespace-nowrap"
            style={{ marginRight: wIdx < words.length - 1 ? "0.25em" : 0 }}
          >
            {[...word].map((ch, cIdx) => {
              const i = charsBefore + cIdx;
              return (
                <span
                  key={cIdx}
                  className="falling-letter"
                  aria-hidden="true"
                  style={
                    mounted
                      ? {
                          animationDelay: `${i * stagger}ms`,
                          animationDuration: `${duration}ms`,
                        }
                      : { opacity: 0 }
                  }
                >
                  {ch}
                </span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}
