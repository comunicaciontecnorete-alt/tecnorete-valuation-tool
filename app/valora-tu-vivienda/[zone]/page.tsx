import { ValuationForm } from "@/components/ValuationForm";
import { notFound } from "next/navigation";
import { getZoneBySlug, zones } from "@/config/zones";
import { getZoneSeoContent } from "@/config/zoneSeoContent";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";
import { MarketReferenceSection } from "@/components/MarketReferenceSection";
import { DemandInsightsSection } from "@/components/DemandInsightsSection";
import { HowValuationWorksSection } from "@/components/HowValuationWorksSection";
import { FinalValuationCta } from "@/components/FinalValuationCta";

type ZonePageProps = {
  params: Promise<{
    zone: string;
  }>;
};

export function generateStaticParams() {
  return zones.map((zone) => ({
    zone: zone.slug,
  }));
}

export async function generateMetadata({
  params,
}: ZonePageProps): Promise<Metadata> {
  const { zone: zoneSlug } = await params;
  const zone = getZoneBySlug(zoneSlug);

  if (!zone) {
    return {
      title: "Zona no encontrada",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const seoContent = getZoneSeoContent(zone.slug);
  const canonicalPath = `/valora-tu-vivienda/${zone.slug}`;

  const title = seoContent?.seoTitle ?? zone.headline;
  const description = seoContent?.seoDescription ?? zone.subheadline;

  return {
    title,
    description,

    alternates: {
      canonical: canonicalPath,
    },

    openGraph: {
      type: "website",
      locale: "es_ES",
      title,
      description,
      url: canonicalPath,
      images: [
        {
          url: zone.heroImage,
          alt: `Valoración de vivienda en ${zone.name}`,
        },
      ],
    },
  };
}

export default async function ZoneValuationPage({
  params,
}: ZonePageProps) {
  const { zone: zoneSlug } = await params;
  const zone = getZoneBySlug(zoneSlug);

  if (!zone) {
    notFound();
  }

  const seoContent = getZoneSeoContent(zone.slug);

  return (
    <main className="min-h-screen bg-[#f6f8fb] px-5 py-8 md:px-8">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div
            className="relative min-h-[260px] bg-[#033b79] bg-cover bg-center p-6 md:min-h-[340px] md:p-10"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(3, 59, 121, 0.35), rgba(3, 59, 121, 0.92)), url(${zone.heroImage})`,
            }}
          >
            <div className="relative z-10 flex h-full min-h-[220px] flex-col justify-end md:min-h-[280px]">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#ec8a36]">
                {siteConfig.name} · CP {zone.postalCode}
              </p>

              <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                {zone.headline}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-white/90 md:text-lg">
                {zone.subheadline}
              </p>
            </div>
          </div>

          <div className="px-6 py-7 md:px-10">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-800">
                Zona seleccionada
              </p>

              <p className="mt-1 text-2xl font-bold text-[#033b79]">
                {zone.name}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Código postal {zone.postalCode}
              </p>
            </div>

            <p className="mt-6 text-xs leading-5 text-slate-500">
              Estimación orientativa. No constituye una tasación oficial ni una
              oferta vinculante.
            </p>
          </div>
        </div>

<div id="calculadora-valoracion">
  <ValuationForm initialZoneSlug={zone.slug} />
</div>      </section>

      {seoContent && (
        <div className="mx-auto mt-14 max-w-6xl space-y-8 pb-10 md:mt-20">
          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-10">
            <h2 className="text-2xl font-bold tracking-tight text-[#033b79] md:text-3xl">
              Valoración de vivienda en {zone.name}
            </h2>

            <p className="mt-5 max-w-4xl text-base leading-7 text-slate-600">
              {seoContent.intro}
            </p>
          </section>

          <section className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-xl font-bold text-[#033b79] md:text-2xl">
                El mercado de vivienda en {zone.name}
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-600">
                {seoContent.marketContext}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-xl font-bold text-[#033b79] md:text-2xl">
                Tipos de vivienda en {zone.name}
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-600">
                {seoContent.propertyTypes}
              </p>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-10">
            <h2 className="text-2xl font-bold tracking-tight text-[#033b79]">
              ¿Qué influye en el valor de una vivienda en {zone.name}?
            </h2>

            <p className="mt-4 max-w-4xl text-base leading-7 text-slate-600">
              Para obtener una estimación más ajustada no utilizamos únicamente
              la superficie del inmueble. La calculadora tiene en cuenta
              diferentes características que pueden modificar su valoración.
            </p>

            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {seoContent.valuationFactors.map((factor) => (
                <li
                  key={factor}
                  className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700"
                >
                  <span
                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#ec8a36]"
                    aria-hidden="true"
                  />

                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </section>
<MarketReferenceSection />
<DemandInsightsSection />
<HowValuationWorksSection />


          <FinalValuationCta
  zoneName={zone.name}
  title={seoContent.ctaTitle}
  text={seoContent.ctaText}
/>
        </div>
      )}
    </main>
  );
}