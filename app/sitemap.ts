import type { MetadataRoute } from "next";
import { zones } from "@/config/zones";
import { getSiteUrl } from "@/config/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  const generalValuationPage: MetadataRoute.Sitemap[number] = {
    url: `${siteUrl}/valora-tu-vivienda`,
    changeFrequency: "monthly",
    priority: 0.9,
  };

  const zonePages: MetadataRoute.Sitemap = zones.map((zone) => ({
    url: `${siteUrl}/valora-tu-vivienda/${zone.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [generalValuationPage, ...zonePages];
}