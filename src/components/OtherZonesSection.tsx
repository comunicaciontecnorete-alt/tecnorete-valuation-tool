import Link from "next/link";
import { zones } from "@/config/zones";

type OtherZonesSectionProps = {
  currentZoneSlug: string;
};

export function OtherZonesSection({
  currentZoneSlug,
}: OtherZonesSectionProps) {
  const otherZones = zones.filter(
    (zone) => zone.slug !== currentZoneSlug
  );

  return (
    <section className="rounded-3xl border border-[#033b79]/10 bg-[#eaf1f8] p-6 md:p-10">
      <div className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#ec8a36]">
          Otras zonas
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#033b79] md:text-3xl">
          Valora una vivienda en otra zona
        </h2>

        <p className="mt-4 text-base leading-7 text-slate-600">
          También puedes calcular una estimación orientativa para viviendas
          situadas en otras zonas en las que trabaja Tecnorete Toledo.
        </p>
      </div>

     <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {otherZones.map((zone) => (
          <Link
            key={zone.slug}
            href={`/valora-tu-vivienda/${zone.slug}`}
            className="group rounded-2xl border border-white bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#033b79]/20 hover:shadow-md"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-[#ec8a36]">
              CP {zone.postalCode}
            </p>

            <h3 className="mt-2 text-lg font-bold text-[#033b79]">
              {zone.name}
            </h3>

            <p className="mt-3 text-sm font-semibold text-slate-600 transition group-hover:text-[#033b79]">
              Calcular valoración →
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-7 border-t border-slate-200 pt-6">
        <Link
          href="/valora-tu-vivienda"
          className="text-sm font-bold text-[#033b79] hover:underline"
        >
          Ver todas las zonas de valoración →
        </Link>
      </div>
    </section>
  );
}