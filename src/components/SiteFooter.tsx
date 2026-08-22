import Link from "next/link";

import { siteConfig } from "@/config/site";
import { SocialLinks } from "@/components/SocialLinks";

/**
 * Footer corporativo sencillo para las páginas de valoración.
 * Usa únicamente datos ya existentes en src/config/site.ts, sin
 * inventar contacto, dirección ni datos legales adicionales.
 *
 * No debe usarse en /embed/[zone].
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-base font-bold text-brand-blue">
              {siteConfig.name}
            </p>

            <p className="mt-2 text-sm leading-6 text-ink-muted">
              {siteConfig.address}
            </p>
          </div>

          <div className="flex flex-col gap-1 text-sm text-ink-muted md:items-end">
            <a
              href={`tel:${siteConfig.phone}`}
              className="font-semibold text-brand-blue hover:underline"
            >
              {siteConfig.phone}
            </a>

            <a
              href={`mailto:${siteConfig.legalEmail}`}
              className="hover:underline"
            >
              {siteConfig.legalEmail}
            </a>

            <Link href={siteConfig.privacyPath} className="hover:underline">
              Política de privacidad
            </Link>

            <SocialLinks className="mt-3 md:justify-end" />
          </div>
        </div>

        {siteConfig.offices && siteConfig.offices.length > 0 && (
          <div className="mt-6 grid gap-6 border-t border-border pt-6 sm:grid-cols-2">
            {siteConfig.offices.map((office) => (
              <div key={office.phone}>
                <p className="text-sm font-bold text-brand-blue">
                  {office.name}
                </p>

                <a
                  href={`tel:${office.phone}`}
                  className="mt-1 block text-sm text-ink-muted hover:underline"
                >
                  {office.phone}
                </a>

                <a
                  href={office.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block text-sm text-ink-muted hover:underline"
                >
                  Web oficial
                </a>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 border-t border-border pt-6 text-xs leading-5 text-ink-muted">
          © {year} {siteConfig.companyName} · CIF {siteConfig.cif}
        </div>
      </div>
    </footer>
  );
}
