import { siteConfig } from "@/config/site";

type FinalValuationCtaProps = {
  zoneName: string;
  title: string;
  text: string;
};

export function FinalValuationCta({
  zoneName,
  title,
  text,
}: FinalValuationCtaProps) {
  return (
    <section className="overflow-hidden rounded-3xl bg-[#033b79] p-6 text-white shadow-sm md:p-10">
      <div className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#f4a45f]">
          Tecnorete Toledo
        </p>

        <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
          {title}
        </h2>

        <p className="mt-4 max-w-3xl text-base leading-7 text-white/85">
          {text}
        </p>

        <p className="mt-4 text-sm leading-6 text-white/70">
          Si estás pensando en vender en {zoneName}, podemos estudiar tu
          vivienda de forma individual y ayudarte a definir una estrategia de
          venta.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="#calculadora-valoracion"
            className="inline-flex items-center justify-center rounded-2xl bg-[#ec8a36] px-6 py-4 text-sm font-bold text-white transition hover:-translate-y-px hover:opacity-90 active:scale-[0.98]"
          >
            Valorar mi vivienda
          </a>

          {siteConfig.offices.map((office) => (
            <a
              key={office.phone}
              href={`tel:${office.phone}`}
              className="inline-flex items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-6 py-4 text-sm font-bold text-white transition hover:-translate-y-px hover:bg-white/15 active:scale-[0.98]"
            >
              {office.shortName} · {office.phone}
            </a>
          ))}
        </div>

        <p className="mt-5 text-xs leading-5 text-white/60">
          Sin compromiso. La valoración automática es orientativa y puede
          complementarse con una revisión profesional del inmueble.
        </p>
      </div>
    </section>
  );
}