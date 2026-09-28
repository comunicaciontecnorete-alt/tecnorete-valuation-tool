import type { Metadata } from "next";
import Link from "next/link";
import {
  getChildZones,
  getTopLevelZones,
  zones,
} from "@/config/zones";
import { siteConfig } from "@/config/site";
import { ZoneValuationEntry } from "@/components/ZoneValuationEntry";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MotionReveal } from "@/components/motion/MotionReveal";
import {
  MotionStaggerGroup,
  MotionStaggerItem,
} from "@/components/motion/MotionStagger";

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
    images: [
      {
        url: "/images/og-tecnorete-toledo.png",
        width: 1200,
        height: 630,
        alt: "Valora tu vivienda en Toledo con Tecnorete Toledo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Valoración de vivienda en Toledo y alrededores | ${siteConfig.name}`,
    description:
      "Selecciona tu zona y calcula una estimación orientativa del valor de tu vivienda con Tecnorete Toledo.",
    images: [
      {
        url: "/images/og-tecnorete-toledo.png",
        alt: "Valora tu vivienda en Toledo con Tecnorete Toledo",
      },
    ],
  },
};

export default function GeneralValuationPage() {
  const topLevelZones = getTopLevelZones();

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-[#f6f8fb]">
      <section className="bg-brand-blue px-5 py-6 text-white md:px-8 md:py-12">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-12">
          <div>
            <h1 className="max-w-2xl text-3xl font-bold tracking-tight max-[360px]:text-2xl md:text-5xl">
              Descubre cuánto vale tu vivienda en Toledo
            </h1>
            <p className="mt-3 max-w-xl text-base leading-6 text-white/85 md:mt-5 md:text-lg">
              Obtén una valoración orientativa gratuita basada en datos del mercado de tu zona.
            </p>
          </div>
          <ZoneValuationEntry zones={zones.filter((zone) => zone.valuationEnabled !== false).map((zone) => ({
            slug: zone.slug,
            name: zone.name,
            group: zones.find((parent) => parent.slug === zone.parentZoneSlug)?.name,
          }))} />
        </div>
      </section>
      <section aria-label="Ventajas de la valoración" className="border-b border-border bg-white px-5 py-5 md:px-8">
        <ul className="mx-auto flex max-w-6xl flex-col gap-2 text-sm text-brand-blue sm:flex-row sm:justify-between">
          <li>✓ Adaptada a tu zona</li>
          <li>✓ Referencias reales de mercado</li>
          <li>✓ Estimación en pocos pasos</li>
        </ul>
      </section>

      <section className="px-5 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl">
          <MotionReveal trigger="viewport" className="max-w-3xl">
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
          </MotionReveal>

          <MotionStaggerGroup
            trigger="viewport"
            staggerDelay={0.06}
            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {topLevelZones.map((zone) => {
              const childZones = getChildZones(zone.slug);

              return (
                <MotionStaggerItem
                  key={zone.slug}
                  className={
                    childZones.length > 0
                      ? "sm:col-span-2 lg:col-span-3"
                      : undefined
                  }
                >
                  {childZones.length > 0 ? (
                    <section className="rounded-3xl border border-[#033b79]/10 bg-[#eaf1f8] p-4 shadow-sm md:p-6">
                      <Link
                        href={`/valora-tu-vivienda/${zone.slug}`}
                        className="group grid overflow-hidden rounded-2xl bg-white md:grid-cols-[0.8fr_1.2fr]"
                      >
                        <div
                          className="min-h-[190px] bg-[#033b79] bg-cover bg-center"
                          style={{
                            backgroundImage: `linear-gradient(180deg, rgba(3, 59, 121, 0.2), rgba(3, 59, 121, 0.88)), url(${zone.heroImage})`,
                          }}
                        />

                        <div className="p-6 md:p-8">
                          <p className="text-xs font-semibold uppercase tracking-wide text-[#ec8a36]">
                            Área · CP {zone.postalCode}
                          </p>

                          <h2 className="mt-2 text-3xl font-bold text-[#033b79]">
                            {zone.name}
                          </h2>

                          <p className="mt-3 text-sm leading-6 text-slate-600">
                            {zone.subheadline}
                          </p>

                          <p className="mt-5 text-sm font-bold text-[#033b79]">
                            Ver área y elegir subzona →
                          </p>
                        </div>
                      </Link>

                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {childZones.map((childZone) => (
                          <Link
                            key={childZone.slug}
                            href={`/valora-tu-vivienda/${childZone.slug}`}
                            className="rounded-2xl border border-white bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#033b79]/20 hover:shadow-sm"
                          >
                            <h3 className="font-bold text-[#033b79]">
                              {childZone.name}
                            </h3>

                            <p className="mt-2 text-xs leading-5 text-slate-600">
                              {childZone.subheadline}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </section>
                  ) : (
                    <Link
                      href={`/valora-tu-vivienda/${zone.slug}`}
                      className="group block overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg active:scale-[0.99]"
                    >
                      <div className="relative min-h-[220px] overflow-hidden bg-[#033b79]">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
                          style={{
                            backgroundImage: `linear-gradient(180deg, rgba(3, 59, 121, 0.15), rgba(3, 59, 121, 0.9)), url(${zone.heroImage})`,
                          }}
                        />

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
                  )}
                </MotionStaggerItem>
              );
            })}
          </MotionStaggerGroup>
        </div>
      </section>

      <section className="px-5 pb-16 md:px-8 md:pb-24">
        <MotionReveal
          trigger="viewport"
          className="mx-auto max-w-6xl rounded-3xl bg-white p-6 shadow-sm md:p-10"
        >
          <div className="mb-8 max-w-3xl space-y-3 text-base leading-7 text-slate-600">
            <p>Selecciona la zona en la que se encuentra tu vivienda y obtén una primera estimación orientativa de su valor en pocos pasos.</p>
            <p>Nuestra herramienta combina referencias reales y recientes de compraventas, datos de mercado y las características concretas de la vivienda para calcular un rango estimado.</p>
          </div>
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
        </MotionReveal>
      </section>
      </main>

      <SiteFooter />
      <div aria-hidden="true" className="h-[calc(5rem+env(safe-area-inset-bottom))] md:hidden" />
    </>
  );
}
