import { getTranslations } from "next-intl/server";
import { IconArrowRight } from "@tabler/icons-react";

export async function Newsletter() {
  const t = await getTranslations("footer");

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="font-display-italic text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
            {t("newsletter")}
          </h2>
          <p className="mt-4 text-muted max-w-md">{t("newsletterBody")}</p>
        </div>
        <form className="flex items-center border-b border-foreground/60 focus-within:border-accent transition-colors">
          <input
            type="email"
            required
            placeholder="your@email.com"
            className="flex-1 bg-transparent py-3 text-base outline-none placeholder:text-muted/60"
          />
          <button
            type="button"
            className="px-2 py-3 hover:text-accent transition-colors"
            aria-label={t("subscribe")}
          >
            <IconArrowRight size={20} stroke={1.5} />
          </button>
        </form>
      </div>
    </section>
  );
}
