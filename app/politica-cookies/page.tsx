import Link from "next/link";

import { CookieSettingsButton } from "@/components/CookieSettingsButton";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Política de cookies",
  description: `Información sobre el uso de cookies en ${siteConfig.name}.`,
};

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-[#f6f8fb] px-5 py-8 md:px-8">
      <article className="mx-auto max-w-4xl rounded-3xl bg-white px-6 py-10 shadow-sm md:px-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#ec8a36]">
          {siteConfig.name}
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-[#033b79]">
          Política de cookies
        </h1>
        <p className="mt-4 text-sm text-slate-500">
          Última actualización: 15 de septiembre de 2026
        </p>

        <div className="mt-8 space-y-7 text-sm leading-7 text-slate-700">
          <section>
            <h2 className="text-xl font-bold text-[#033b79]">
              Qué cookies utilizamos
            </h2>
            <p className="mt-2">
              La web guarda una cookie técnica, necesaria para recordar si has
              aceptado o rechazado la analítica. Esta preferencia se conserva
              durante 180 días.
            </p>
            <p className="mt-2">
              Si aceptas, cargamos Google Analytics 4, un servicio prestado por
              Google Ireland Limited. GA4 puede crear cookies como{" "}
              <code>_ga</code> y <code>_ga_*</code> para distinguir sesiones y
              usuarios de forma seudónima. Estas cookies pueden conservarse
              hasta dos años.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#033b79]">
              Finalidad y datos excluidos
            </h2>
            <p className="mt-2">
              La analítica nos ayuda a entender qué páginas se visitan y cómo
              se navega por la web. No enviamos a Google los valores introducidos
              en la calculadora ni datos personales como nombre, email,
              teléfono, calle o número del inmueble. También mantenemos
              desactivadas las señales y la personalización publicitarias.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#033b79]">
              Consentimiento y retirada
            </h2>
            <p className="mt-2">
              Google Analytics no se descarga ni envía datos antes de que
              aceptes las cookies de analítica. Rechazarlas no limita el uso de
              la calculadora.
            </p>
            <div className="mt-4 inline-flex rounded-xl border border-[#033b79] px-4 py-2 font-semibold text-[#033b79]">
              <CookieSettingsButton />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#033b79]">
              Más información
            </h2>
            <p className="mt-2">
              Consulta también nuestra{" "}
              <Link
                className="font-semibold text-[#033b79] underline"
                href={siteConfig.privacyPath}
              >
                política de privacidad
              </Link>
              .
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}

