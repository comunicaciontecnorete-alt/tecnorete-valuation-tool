import type { MetadataRoute } from "next";
import { zones } from "@/config/zones";
import { getSiteUrl } from "@/config/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return zones.map((zone) => ({
    url: `${siteUrl}/valora-tu-vivienda/${zone.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
}