"use client";

import { useEffect, useState } from "react";

type Props = {
  text: string;
  className?: string;
  speed?: number; // ms per character
  startDelay?: number; // ms before first character
  cursor?: boolean; // show blinking caret
};

export function TypewriterText({
  text,
  className = "",
  speed = 55,
  startDelay = 250,
  cursor = true,
}: Props) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setCount(0);
    setDone(false);
    let i = 0;
    const startTimer = setTimeout(() => {
      const tick = () => {
        i += 1;
        setCount(i);
        if (i < text.length) {
          timer = setTimeout(tick, speed);
        } else {
          setDone(true);
        }
      };
      let timer = setTimeout(tick, speed);
      return () => clearTimeout(timer);
    }, startDelay);
    return () => clearTimeout(startTimer);
  }, [text, speed, startDelay]);

  // Once the fade-out is finished, drop the caret from the DOM entirely.
  const [caretGone, setCaretGone] = useState(false);
  useEffect(() => {
    if (!done) {
      setCaretGone(false);
      return;
    }
    const t = setTimeout(() => setCaretGone(true), 800);
    return () => clearTimeout(t);
  }, [done]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, count)}</span>
      {cursor && !caretGone && (
        <span
          aria-hidden="true"
          className={`type-caret ${done ? "type-caret-fade" : ""}`}
        >
          {"▌"}
        </span>
      )}
    </span>
  );
}
