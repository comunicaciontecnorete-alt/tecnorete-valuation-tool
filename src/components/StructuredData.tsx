import { siteConfig } from "@/config/site";

function formatSpanishPhone(phone: string) {
  return `+34${phone.replace(/\D/g, "")}`;
}

export function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "RealEstateAgent"],
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.logoPath}`,
    areaServed: "Toledo",
    sameAs: siteConfig.socialLinks.map((social) => social.href),
    contactPoint: siteConfig.offices.map((office) => ({
      "@type": "ContactPoint",
      telephone: formatSpanishPhone(office.phone),
      contactType: office.name,
      areaServed: "ES",
      availableLanguage: "es",
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
