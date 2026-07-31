import Link from "next/link";
import { zones } from "@/config/zones";
import { siteConfig } from "@/config/site";

export default function GeneralValuationPage() {
  return (
    <main className="min-h-screen bg-[#f6f8fb] px-5 py-8 md:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-3xl bg-white px-6 py-10 shadow-sm md:px-10 md:py-14">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#ec8a36]">
            {siteConfig.name}
          </p>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-[#033b79] md:text-5xl">
            Calcula el valor orientativo de tu vivienda
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Selecciona la zona de tu vivienda y completa unos datos básicos para
            recibir una estimación orientativa. No es una tasación oficial.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {zones.map((zone) => (
            <Link
              key={zone.slug}
              href={`/valora-tu-vivienda/${zone.slug}`}
              className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-sm font-semibold text-[#ec8a36]">
                CP {zone.postalCode}
              </p>

              <h2 className="mt-2 text-xl font-bold text-[#033b79]">
                {zone.name}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {zone.subheadline}
              </p>

              <span className="mt-5 inline-flex text-sm font-bold text-[#033b79]">
                Calcular valoración →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}