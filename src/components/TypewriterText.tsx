"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  className?: string;
  speed?: number; // ms per character (type)
  eraseSpeed?: number; // ms per character (erase)
  startDelay?: number; // ms before first character
  holdMs?: number; // how long to hold fully-typed before erasing/looping
  cursor?: boolean;
  loop?: boolean;
};

export function TypewriterText({
  text,
  className = "",
  speed = 90,
  eraseSpeed = 35,
  startDelay = 600,
  holdMs = 5000,
  cursor = true,
  loop = true,
}: Props) {
  const [count, setCount] = useState(0);
  const [erasing, setErasing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    const clear = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
    };

    const schedule = (fn: () => void, ms: number) => {
      clear();
      timer.current = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
    };

    const type = (i: number) => {
      setErasing(false);
      setCount(i);
      if (i < text.length) {
        schedule(() => type(i + 1), speed);
      } else if (loop) {
        // hold fully-typed, then start erasing
        schedule(() => erase(text.length), holdMs);
      }
    };

    const erase = (i: number) => {
      setErasing(true);
      setCount(i);
      if (i > 0) {
        schedule(() => erase(i - 1), eraseSpeed);
      } else {
        // brief pause with empty text, then re-type
        schedule(() => type(1), 400);
      }
    };

    schedule(() => type(1), startDelay);

    return () => {
      cancelled = true;
      clear();
    };
  }, [text, speed, eraseSpeed, startDelay, holdMs, loop]);

  // Caret is visible while typing or erasing; never disappears in loop mode.
  const showCaret = cursor;

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, count)}</span>
      {showCaret && (
        <span
          aria-hidden="true"
          className={`type-caret ${erasing ? "" : ""}`}
        >
          {"▌"}
        </span>
      )}
    </span>
  );
}
