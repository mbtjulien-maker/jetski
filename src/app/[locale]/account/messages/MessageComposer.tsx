"use client";

import { useRef, useTransition } from "react";

export function MessageComposer({
  action,
  placeholder,
  sendLabel,
}: {
  action: (formData: FormData) => Promise<unknown>;
  placeholder: string;
  sendLabel: string;
}) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      action={(fd) => {
        startTransition(async () => {
          await action(fd);
          formRef.current?.reset();
        });
      }}
      className="flex items-end gap-3"
    >
      <textarea
        name="body"
        rows={2}
        required
        placeholder={placeholder}
        className="flex-1 glass border border-border/60 px-4 py-3 text-sm resize-none focus:border-accent outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="btn-primary disabled:opacity-50"
      >
        {sendLabel}
      </button>
    </form>
  );
}
