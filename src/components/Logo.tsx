import { Link } from "@/i18n/navigation";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 text-lg font-medium tracking-tight ${className}`}
    >
      <span className="inline-block w-2 h-2 bg-accent" />
      <span className="uppercase">Riderz</span>
    </Link>
  );
}
