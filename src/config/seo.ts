export function getSiteUrl() {
  const explicitUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelProductionUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();

  const url =
    explicitUrl ||
    (vercelProductionUrl
      ? `https://${vercelProductionUrl}`
      : "http://localhost:3000");

  return url.replace(/\/+$/, "");
}