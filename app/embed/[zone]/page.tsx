import { ValuationForm } from "@/components/ValuationForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getChildZones,
  getZoneBySlug,
  zones,
} from "@/config/zones";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

type EmbedPageProps = {
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
}: EmbedPageProps): Promise<Metadata> {
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

  return {
    title: zone.headline,
    description: zone.subheadline,

    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
      },
    },

    alternates: {
      canonical: `/valora-tu-vivienda/${zone.slug}`,
    },
  };
}

export default async function EmbedZonePage({
  params,
}: EmbedPageProps) {
  const { zone: zoneSlug } = await params;
  const zone = getZoneBySlug(zoneSlug);

  if (!zone) {
    notFound();
  }

  const childZones = getChildZones(zone.slug);

  return (
    <main className="min-h-screen bg-white px-4 py-5">
      <section className="mx-auto max-w-xl">
        <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#ec8a36]">
            {siteConfig.name} · CP {zone.postalCode}
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#033b79]">
            {zone.headline}
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {zone.subheadline}
          </p>
        </div>

        {zone.valuationEnabled === false ? (
          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-xl font-bold text-[#033b79]">
              ¿Dónde está tu vivienda?
            </h2>

            <div className="mt-4 grid gap-3">
              {childZones.map((childZone) => (
                <Link
                  key={childZone.slug}
                  href={`/embed/${childZone.slug}`}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[#033b79] transition hover:border-[#033b79]/30"
                >
                  {childZone.name} →
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <ValuationForm
            initialZoneSlug={zone.slug}
            allowedPropertyTypes={
              zone.allowedPropertyTypes
            }
          />
        )}
      </section>
    </main>
  );
}
