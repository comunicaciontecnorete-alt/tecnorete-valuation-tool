import { ValuationForm } from "@/components/ValuationForm";
import { notFound } from "next/navigation";
import { getZoneBySlug, zones } from "@/config/zones";
import { siteConfig } from "@/config/site";

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

export async function generateMetadata({ params }: ZonePageProps) {
  const { zone: zoneSlug } = await params;
  const zone = getZoneBySlug(zoneSlug);

  if (!zone) {
    return {
      title: "Zona no encontrada",
    };
  }

  return {
    title: `${zone.headline} | ${siteConfig.name}`,
    description: zone.subheadline,
  };
}

export default async function ZoneValuationPage({ params }: ZonePageProps) {
  const { zone: zoneSlug } = await params;
  const zone = getZoneBySlug(zoneSlug);

  if (!zone) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] px-5 py-8 md:px-8">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="rounded-3xl bg-white px-6 py-10 shadow-sm md:px-10 md:py-14">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#ec8a36]">
            {siteConfig.name} · CP {zone.postalCode}
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-[#033b79] md:text-5xl">
            {zone.headline}
          </h1>

          <p className="mt-5 text-base leading-7 text-slate-600 md:text-lg">
            {zone.subheadline}
          </p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
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

        <ValuationForm initialZoneSlug={zone.slug} />
      </section>
    </main>
  );
}