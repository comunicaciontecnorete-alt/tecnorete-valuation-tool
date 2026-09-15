const ATTRIBUTION_STORAGE_KEY = "tecnorete_marketing_attribution_v1";
const UTM_MAX_LENGTH = 200;
const URL_MAX_LENGTH = 500;

const UTM_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

type UtmField = (typeof UTM_FIELDS)[number];

export type MarketingAttribution = Partial<
  Record<UtmField | "landing_page" | "referrer", string>
>;

let inMemoryAttribution: MarketingAttribution | undefined;

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return undefined;
  }

  const cleaned = value
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);

  return cleaned || undefined;
}

function sanitizeUrl(value: unknown, originOnly: boolean) {
  const cleaned = cleanText(value, URL_MAX_LENGTH);

  if (!cleaned) {
    return undefined;
  }

  try {
    const url = new URL(cleaned);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return undefined;
    }

    return originOnly ? url.origin : `${url.origin}${url.pathname}`;
  } catch {
    return undefined;
  }
}

export function sanitizeMarketingAttribution(
  value: unknown
): MarketingAttribution {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const input = value as Record<string, unknown>;
  const attribution: MarketingAttribution = {};

  for (const field of UTM_FIELDS) {
    const cleaned = cleanText(input[field], UTM_MAX_LENGTH);

    if (cleaned) {
      attribution[field] = cleaned;
    }
  }

  const landingPage = sanitizeUrl(input.landing_page, false);
  const referrer = sanitizeUrl(input.referrer, true);

  if (landingPage) {
    attribution.landing_page = landingPage;
  }

  if (referrer) {
    attribution.referrer = referrer;
  }

  return attribution;
}

function readStoredAttribution() {
  try {
    const stored = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);

    return stored === null
      ? undefined
      : sanitizeMarketingAttribution(JSON.parse(stored));
  } catch {
    return undefined;
  }
}

export function captureInitialMarketingAttribution() {
  if (typeof window === "undefined") {
    return {};
  }

  if (inMemoryAttribution !== undefined) {
    return inMemoryAttribution;
  }

  const storedAttribution = readStoredAttribution();

  if (storedAttribution !== undefined) {
    inMemoryAttribution = storedAttribution;
    return storedAttribution;
  }

  const query = new URLSearchParams(window.location.search);
  const candidate: Record<string, string> = {
    landing_page: window.location.href,
  };

  for (const field of UTM_FIELDS) {
    const value = query.get(field);

    if (value) {
      candidate[field] = value;
    }
  }

  if (document.referrer) {
    candidate.referrer = document.referrer;
  }

  const attribution = sanitizeMarketingAttribution(candidate);
  inMemoryAttribution = attribution;

  try {
    window.sessionStorage.setItem(
      ATTRIBUTION_STORAGE_KEY,
      JSON.stringify(attribution)
    );
  } catch {
    // El respaldo en memoria mantiene la atribución durante la navegación SPA.
  }

  return attribution;
}

export function getMarketingAttribution() {
  return captureInitialMarketingAttribution();
}

