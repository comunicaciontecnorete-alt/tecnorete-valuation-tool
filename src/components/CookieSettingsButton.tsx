"use client";

import { OPEN_COOKIE_SETTINGS_EVENT } from "@/components/AnalyticsConsent";

export function CookieSettingsButton() {
  return (
    <button
      className="text-left hover:underline md:text-right"
      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}
      type="button"
    >
      Configurar cookies
    </button>
  );
}

