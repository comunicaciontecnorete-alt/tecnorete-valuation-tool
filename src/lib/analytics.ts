import { sendGAEvent } from "@next/third-parties/google";

import type { PropertyType } from "@/types/valuation";

export const ANALYTICS_CONSENT_COOKIE = "tecnorete_analytics_consent";

export type AnalyticsConsent = "granted" | "denied";

type ValuationEventName =
  | "valuation_start"
  | "valuation_result_view"
  | "lead_submit"
  | "lead_success";

type ValuationEventParameters = Readonly<{
  zone: string;
  property_type: PropertyType;
}>;

export function readAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof document === "undefined") {
    return null;
  }

  const consent = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${ANALYTICS_CONSENT_COOKIE}=`))
    ?.split("=")[1];

  return consent === "granted" || consent === "denied" ? consent : null;
}

export function trackValuationEvent(
  eventName: ValuationEventName,
  parameters: ValuationEventParameters
) {
  if (readAnalyticsConsent() !== "granted") {
    return;
  }

  // Construir la carga mediante allowlist evita que datos del formulario de
  // contacto o de la dirección puedan llegar accidentalmente a Analytics.
  sendGAEvent("event", eventName, {
    zone: parameters.zone,
    property_type: parameters.property_type,
  });
}

