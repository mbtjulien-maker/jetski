import { setRequestLocale } from "next-intl/server";
import { IconMail, IconPhone, IconMapPin } from "@tabler/icons-react";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const labels: Record<string, { title: string; lead: string; name: string; email: string; message: string; send: string }> = {
    fr: { title: "Contact", lead: "Une question, un besoin spécifique ? Notre équipe vous répond sous 24h.", name: "Nom", email: "E-mail", message: "Message", send: "Envoyer" },
    en: { title: "Contact", lead: "A question, a specific need? Our team replies within 24h.", name: "Name", email: "Email", message: "Message", send: "Send" },
    de: { title: "Kontakt", lead: "Eine Frage, ein spezifisches Bedürfnis? Unser Team antwortet innerhalb von 24 Stunden.", name: "Name", email: "E-Mail", message: "Nachricht", send: "Senden" },
    it: { title: "Contatti", lead: "Una domanda, un'esigenza specifica? Il nostro team risponde entro 24 ore.", name: "Nome", email: "Email", message: "Messaggio", send: "Invia" },
  };
  const l = labels[locale] ?? labels.en;

  return (
    <div className="mx-auto max-w-5xl px-6 py-24 grid lg:grid-cols-[1fr_360px] gap-16">
      <div>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight">{l.title}</h1>
        <p className="text-muted mt-4 max-w-md">{l.lead}</p>

        <form className="mt-12 space-y-5 max-w-md">
          <label className="block">
            <span className="block text-xs text-muted mb-1.5">{l.name}</span>
            <input
              className="w-full bg-surface border border-border px-3 py-2.5 text-sm focus:border-accent outline-none"
              required
            />
          </label>
          <label className="block">
            <span className="block text-xs text-muted mb-1.5">{l.email}</span>
            <input
              type="email"
              className="w-full bg-surface border border-border px-3 py-2.5 text-sm focus:border-accent outline-none"
              required
            />
          </label>
          <label className="block">
            <span className="block text-xs text-muted mb-1.5">{l.message}</span>
            <textarea
              rows={5}
              className="w-full bg-surface border border-border px-3 py-2.5 text-sm focus:border-accent outline-none resize-none"
              required
            />
          </label>
          <button type="button" className="btn-primary w-full">
            {l.send}
          </button>
        </form>
      </div>

      <aside className="space-y-6 text-sm">
        <div className="flex items-start gap-3">
          <IconMapPin size={20} stroke={1.5} className="text-accent shrink-0 mt-0.5" />
          <div>
            <p>Riderz Europe</p>
            <p className="text-muted">12 Quai des Voiles<br />06600 Antibes, France</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <IconPhone size={20} stroke={1.5} className="text-accent shrink-0 mt-0.5" />
          <a href="tel:+33493000000" className="link-underline">+33 4 93 00 00 00</a>
        </div>
        <div className="flex items-start gap-3">
          <IconMail size={20} stroke={1.5} className="text-accent shrink-0 mt-0.5" />
          <a href="mailto:hello@riderz.eu" className="link-underline">hello@riderz.eu</a>
        </div>
      </aside>
    </div>
  );
}
