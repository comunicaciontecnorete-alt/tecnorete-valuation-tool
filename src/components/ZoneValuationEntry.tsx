"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { trackZoneSelected } from "@/lib/analytics";
import { captureInitialMarketingAttribution } from "@/lib/marketingAttribution";

type ZoneOption = { slug: string; name: string; group?: string };

export function ZoneValuationEntry({ zones }: { zones: ZoneOption[] }) {
  const [selectedZone, setSelectedZone] = useState("");
  const selector = useRef<HTMLSelectElement>(null);
  const router = useRouter();

  function continueValuation() {
    if (!zones.some((zone) => zone.slug === selectedZone)) {
      selector.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        block: "center",
      });
      selector.current?.focus({ preventScroll: true });
      return;
    }

    captureInitialMarketingAttribution();
    router.push(`/valora-tu-vivienda/${selectedZone}${window.location.search}#calculadora-valoracion`);
  }

  return (
    <>
      <div id="seleccionar-zona" className="scroll-mt-6 rounded-2xl bg-white p-5 text-brand-blue md:p-6">
        <label htmlFor="valuation-zone" className="block text-base font-bold">
          ¿Dónde está tu vivienda?
        </label>
        <select
          ref={selector}
          id="valuation-zone"
          value={selectedZone}
          onChange={(event) => {
            setSelectedZone(event.target.value);
            if (event.target.value) trackZoneSelected(event.target.value);
          }}
          className="mt-3 min-h-12 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 text-base text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
        >
          <option value="">Selecciona tu zona</option>
          {zones.filter((zone) => !zone.group).map((zone) => (
            <option key={zone.slug} value={zone.slug}>{zone.name}</option>
          ))}
          {Array.from(new Set(zones.map((zone) => zone.group).filter(Boolean))).map((group) => (
            <optgroup key={group} label={group!}>
              {zones.filter((zone) => zone.group === group).map((zone) => (
                <option key={zone.slug} value={zone.slug}>{zone.name}</option>
              ))}
            </optgroup>
          ))}
        </select>
        <button type="button" disabled={!selectedZone} onClick={continueValuation}
          className="mt-3 min-h-12 w-full rounded-xl bg-brand-blue px-4 py-3 font-bold text-white hover:bg-brand-blue-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue disabled:cursor-not-allowed disabled:opacity-50">
          Empezar valoración
        </button>
        <p className="mt-3 text-center text-xs text-ink-muted">Gratis · Sin compromiso</p>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-lg md:hidden">
        <button type="button" onClick={continueValuation}
          className="min-h-12 w-full rounded-xl bg-brand-blue px-4 py-3 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue">
          Valorar mi vivienda
        </button>
      </div>
    </>
  );
}
