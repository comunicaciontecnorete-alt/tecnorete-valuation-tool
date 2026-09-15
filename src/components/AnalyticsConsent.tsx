"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import Clarity from "@microsoft/clarity";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ANALYTICS_CONSENT_COOKIE,
  readAnalyticsConsent,
  type AnalyticsConsent,
} from "@/lib/analytics";

const GA_MEASUREMENT_ID = "G-K54SHW8NE9";
const CLARITY_PROJECT_ID = "yiryi2h781";
const CONSENT_MAX_AGE = 60 * 60 * 24 * 180;

export const OPEN_COOKIE_SETTINGS_EVENT = "tecnorete:open-cookie-settings";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function writeConsentCookie(consent: AnalyticsConsent) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${ANALYTICS_CONSENT_COOKIE}=${consent}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}

function queueGooglePrivacySettings() {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  window.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("set", {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    ads_data_redaction: true,
    url_passthrough: false,
  });
}

function initializeAnalyticsServices() {
  queueGooglePrivacySettings();
  Clarity.init(CLARITY_PROJECT_ID);
  Clarity.consentV2({
    ad_Storage: "denied",
    analytics_Storage: "granted",
  });
}

function deleteAnalyticsCookies() {
  const analyticsCookies = document.cookie
    .split("; ")
    .map((entry) => entry.split("=")[0])
    .filter(
      (name) =>
        name === "_ga" ||
        name.startsWith("_ga_") ||
        name === "_clck" ||
        name === "_clsk"
    );

  const hostnameParts = window.location.hostname.split(".");
  const domains = hostnameParts
    .map((_, index) => `.${hostnameParts.slice(index).join(".")}`)
    .filter((domain) => domain.includes("."));

  for (const name of analyticsCookies) {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;

    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${domain}; SameSite=Lax`;
    }
  }
}

export function AnalyticsConsentManager() {
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null);
  const [hasLoadedPreference, setHasLoadedPreference] = useState(false);
  const [settingsAreOpen, setSettingsAreOpen] = useState(false);

  useEffect(() => {
    const openSettings = () => setSettingsAreOpen(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);

    const preferenceTimer = window.setTimeout(() => {
      const storedConsent = readAnalyticsConsent();

      if (storedConsent === "granted") {
        initializeAnalyticsServices();
      }

      setConsent(storedConsent);
      setHasLoadedPreference(true);
    }, 0);

    return () => {
      window.clearTimeout(preferenceTimer);
      window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
    };
  }, []);

  function grantAnalyticsConsent() {
    initializeAnalyticsServices();
    writeConsentCookie("granted");
    setConsent("granted");
    setSettingsAreOpen(false);
  }

  function denyAnalyticsConsent() {
    const analyticsWasActive = consent === "granted";

    window.gtag?.("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    if (analyticsWasActive) {
      Clarity.consentV2({
        ad_Storage: "denied",
        analytics_Storage: "denied",
      });
    }
    writeConsentCookie("denied");
    deleteAnalyticsCookies();
    setConsent("denied");
    setSettingsAreOpen(false);

    // Next.js mantiene los scripts del layout entre rutas. Tras retirar un
    // consentimiento ya concedido, la recarga elimina por completo gtag.js.
    if (analyticsWasActive) {
      window.location.reload();
    }
  }

  const shouldShowDialog =
    hasLoadedPreference && (consent === null || settingsAreOpen);

  return (
    <>
      {consent === "granted" && (
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      )}

      {shouldShowDialog && (
        <section
          aria-label="Preferencias de cookies"
          aria-live="polite"
          className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl md:bottom-6 md:p-6"
          role="dialog"
        >
          <h2 className="text-lg font-bold text-brand-blue">
            Cookies de analítica
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-muted">
            Usamos Google Analytics 4 y Microsoft Clarity para conocer el uso
            agregado de la web. Solo se cargarán después de que aceptes. Los
            datos personales del formulario, como email, teléfono o dirección,
            no se envían a GA4 y quedan enmascarados en Clarity.
          </p>
          <p className="mt-2 text-xs leading-5 text-ink-muted">
            Puedes cambiar tu elección cuando quieras. Consulta la{" "}
            <Link
              className="font-semibold text-brand-blue underline"
              href="/politica-cookies"
            >
              política de cookies
            </Link>
            .
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              className="min-h-11 rounded-xl border border-brand-blue px-4 py-2.5 text-sm font-semibold text-brand-blue transition-colors hover:bg-brand-blue-tint"
              onClick={denyAnalyticsConsent}
              type="button"
            >
              Rechazar analítica
            </button>
            <button
              className="min-h-11 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue-dark"
              onClick={grantAnalyticsConsent}
              type="button"
            >
              Aceptar analítica
            </button>
          </div>
        </section>
      )}
    </>
  );
}
