import Link from "next/link";

import { siteConfig } from "@/config/site";

function formatPhoneForDisplay(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
}

/**
 * Header corporativo ligero para las páginas de valoración.
 *
 * Objetivo: que se perciba de inmediato que la herramienta pertenece a
 * Tecnorete Toledo, sin reproducir el menú completo de la web corporativa
 * (pensado para una herramienta de conversión, no para navegación general).
 *
 * No debe usarse en /embed/[zone], que debe permanecer compacto.
 */
export function SiteHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link
          href="/valora-tu-vivienda"
          className="text-lg font-bold tracking-tight text-brand-blue md:text-xl"
        >
          {/*
            Identidad textual mientras no exista un asset de logo
            aprobado. Sustituir este bloque por <Image src="/logo-..." />
            en cuanto Tecnorete facilite el logotipo oficial.
          */}
          {siteConfig.name}
        </Link>

        {siteConfig.phone && (
          <a
            href={`tel:${siteConfig.phone}`}
            className="inline-flex items-center rounded-full bg-brand-orange px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 md:px-5"
          >
            {formatPhoneForDisplay(siteConfig.phone)}
          </a>
        )}
      </div>
    </header>
  );
}
