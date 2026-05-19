import { setRequestLocale } from "next-intl/server";
import Image from "next/image";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const copy: Record<string, { title: string; lead: string; body: string }> = {
    fr: {
      title: "Riderz, distributeur jetski premium en Europe.",
      lead: "Nous croyons que le luxe sportif doit être simple : la meilleure machine, livrée et garantie chez vous.",
      body: "Fondé en 2019 par d'anciens pilotes de course, Riderz sélectionne et distribue les meilleurs jetskis Sea-Doo, Yamaha et Kawasaki dans 14 pays européens. Notre atelier certifié constructeur prend en charge la mise en service, la maintenance et la reprise.",
    },
    en: {
      title: "Riderz — Europe's premium jetski distributor.",
      lead: "We believe sport luxury should be simple: the best machine, delivered and warranted at home.",
      body: "Founded in 2019 by former racing riders, Riderz curates and distributes the finest Sea-Doo, Yamaha and Kawasaki jetskis across 14 European countries. Our manufacturer-certified workshop handles commissioning, maintenance and trade-ins.",
    },
    de: {
      title: "Riderz — Europas Premium-Jetski-Händler.",
      lead: "Wir glauben, Sportluxus sollte einfach sein: die beste Maschine, geliefert und garantiert bei Ihnen zu Hause.",
      body: "2019 von ehemaligen Rennfahrern gegründet, kuratiert und vertreibt Riderz die feinsten Sea-Doo-, Yamaha- und Kawasaki-Jetskis in 14 europäischen Ländern. Unsere herstellerzertifizierte Werkstatt übernimmt Inbetriebnahme, Wartung und Inzahlungnahme.",
    },
    it: {
      title: "Riderz — distributore premium di moto d'acqua in Europa.",
      lead: "Crediamo che il lusso sportivo debba essere semplice: la migliore macchina, consegnata e garantita a casa tua.",
      body: "Fondata nel 2019 da ex piloti, Riderz seleziona e distribuisce le migliori moto d'acqua Sea-Doo, Yamaha e Kawasaki in 14 paesi europei. La nostra officina certificata dal costruttore gestisce messa in servizio, manutenzione e permute.",
    },
  };
  const c = copy[locale] ?? copy.en;

  return (
    <div>
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <Image
          src="https://picsum.photos/seed/about-hero/2400/1400"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </section>
      <article className="mx-auto max-w-3xl px-6 py-24">
        <h1 className="text-4xl md:text-5xl font-light tracking-tight leading-tight">
          {c.title}
        </h1>
        <p className="text-xl text-muted mt-8 leading-relaxed">{c.lead}</p>
        <p className="text-base leading-relaxed mt-8">{c.body}</p>
      </article>
    </div>
  );
}
