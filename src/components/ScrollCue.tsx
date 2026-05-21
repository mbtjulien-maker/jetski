import { IconChevronDown } from "@tabler/icons-react";

export function ScrollCue({ label }: { label: string }) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted/80">
      <span className="text-[10px] uppercase tracking-[0.3em]">{label}</span>
      <IconChevronDown
        size={18}
        stroke={1.5}
        className="animate-scroll-bounce"
      />
    </div>
  );
}
