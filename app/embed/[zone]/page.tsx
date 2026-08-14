import { ValuationForm } from "@/components/ValuationForm";
import { notFound } from "next/navigation";
import { getZoneBySlug, zones } from "@/config/zones";
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

        <ValuationForm initialZoneSlug={zone.slug} />
      </section>
    </main>
  );
}