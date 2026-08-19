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

        {siteConfig.phone && (
          <a
            href={`tel:${siteConfig.phone}`}
            className="inline-flex items-center rounded-full bg-brand-orange px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-px hover:opacity-90 active:scale-[0.98] md:px-5"
          >
            {formatPhoneForDisplay(siteConfig.phone)}
          </a>
        )}
      </MotionReveal>
    </header>
  );
}