import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { MotionReveal } from "@/components/motion/MotionReveal";

function formatPhoneForDisplay(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
}

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <MotionReveal
        y={8}
        duration={0.4}
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8"
      >
        <Link
          href="/valora-tu-vivienda"
          aria-label="Tecnorete Toledo - Valoración de vivienda"
          className="inline-flex items-center"
        >
          <Image
            src="/images/tecnorete-logo.png"
            alt="Tecnorete Toledo"
            width={180}
            height={48}
            className="h-8 w-auto md:h-9"
            priority
          />
        </Link>

        {siteConfig.offices && siteConfig.offices.length > 0 && (
          <div className="flex min-w-0 flex-shrink flex-wrap items-center justify-end gap-2">
            {siteConfig.offices.map((office) => (
              <div
                key={office.phone}
                className="inline-flex items-center gap-1 rounded-full bg-brand-orange px-3 py-2 text-xs font-bold text-white transition hover:-translate-y-px hover:opacity-90 md:px-5 md:text-sm"
              >
                <span className="hidden sm:inline">{office.shortName}</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="hidden h-3.5 w-3.5 flex-shrink-0 fill-current sm:inline"
                >
                  <path d="M12.01 2C6.48 2 2 6.48 2 12.01c0 1.87.5 3.63 1.38 5.14L2 22l4.98-1.35a9.95 9.95 0 0 0 5.03 1.35h.01c5.52 0 10-4.48 10-10.01C22.01 6.48 17.53 2 12.01 2Zm5.85 14.15c-.25.7-1.24 1.28-2.02 1.44-.54.11-1.24.2-3.6-.77-3.02-1.25-4.96-4.32-5.11-4.52-.15-.2-1.22-1.62-1.22-3.1 0-1.47.77-2.19 1.05-2.49.25-.27.6-.35.86-.35.22 0 .43 0 .62.01.2.01.46-.08.72.55.26.63.9 2.18.98 2.34.08.16.13.35.03.56-.1.2-.15.33-.3.5-.15.18-.31.4-.44.53-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.02 1.12 1 2.06 1.31 2.36 1.46.3.15.48.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.66-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.08.13.08.71-.18 1.4Z" />
                </svg>
                <a
                  href={`tel:${office.phone}`}
                  className="active:scale-[0.98]"
                >
                  {formatPhoneForDisplay(office.phone)}
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href={office.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-blue underline underline-offset-2 active:scale-[0.98]"
                >
                  Web
                </a>
              </div>
            ))}
          </div>
        )}
      </MotionReveal>
    </header>
  );
}