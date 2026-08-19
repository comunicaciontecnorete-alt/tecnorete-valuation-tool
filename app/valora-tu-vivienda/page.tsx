import type { Metadata } from "next";
import Link from "next/link";
import { zones } from "@/config/zones";
import { siteConfig } from "@/config/site";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Valoración de vivienda en Toledo y alrededores",
  description:
    "Calcula una estimación orientativa del valor de tu vivienda en Toledo, Santa Teresa, Santa María de Benquerencia, Argés, Layos, Polán, Nambroca y otras zonas.",
  alternates: {
    canonical: "/valora-tu-vivienda",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    title: `Valoración de vivienda en Toledo y alrededores | ${siteConfig.name}`,
    description:
      "Selecciona tu zona y calcula una estimación orientativa del valor de tu vivienda con Tecnorete Toledo.",
    url: "/valora-tu-vivienda",
  },
};

export default function GeneralValuationPage() {
  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-[#f6f8fb]">
      <section className="bg-[#033b79] px-5 py-16 text-white md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#ec8a36]">
            {siteConfig.name}
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
            ¿Cuánto vale tu vivienda?
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-7 text-white/85 md:text-lg">
            Selecciona la zona en la que se encuentra tu vivienda y obtén una
            primera estimación orientativa de su valor en pocos pasos.
          </p>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-white/65">
            Nuestra herramienta combina referencias de mercado con la
            localización y las principales características del inmueble para
            calcular un rango estimado.
          </p>
        </div>
      </section>

      <section className="px-5 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#ec8a36]">
              Selecciona tu zona
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#033b79]">
              ¿Dónde se encuentra tu vivienda?
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600">
              Cada zona utiliza criterios específicos de localización dentro de
              nuestra herramienta de valoración. Elige la correspondiente a tu
              inmueble para comenzar.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {zones.map((zone) => (
              <Link
                key={zone.slug}
                href={`/valora-tu-vivienda/${zone.slug}`}
                className="group overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className="relative min-h-[220px] bg-[#033b79] bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(3, 59, 121, 0.15), rgba(3, 59, 121, 0.9)), url(${zone.heroImage})`,
                  }}
                >
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#f4a45f]">
                      CP {zone.postalCode}
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-white">
                      {zone.name}
                    </h2>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-sm leading-6 text-slate-600">
                    {zone.subheadline}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm font-bold text-[#033b79]">
                    Calcular valor
                    <span
                      className="transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 md:px-8 md:pb-24">
        <div className="mx-auto max-w-6xl rounded-3xl bg-white p-6 shadow-sm md:p-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#033b79] md:text-3xl">
                Una primera referencia antes de vender
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                Saber en qué rango puede encontrarse el valor de una vivienda
                ayuda a tomar decisiones con más información. Nuestra
                calculadora analiza diferentes variables del inmueble para
                ofrecer una estimación inicial.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#033b79] md:text-3xl">
                No utilizamos solo los metros cuadrados
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                Dependiendo del tipo de vivienda, se consideran aspectos como
                superficie, dormitorios, baños, estado de conservación,
                tipología, planta, ascensor, garaje, terraza o trastero, además
                de criterios específicos de localización.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-[#f6f8fb] p-5">
            <p className="text-sm leading-6 text-slate-600">
              La estimación obtenida es orientativa y no constituye una
              tasación oficial ni sustituye una valoración profesional
              presencial del inmueble.
            </p>
          </div>
        </div>
      </section>
      </main>

      <SiteFooter />
    </>
  );
}