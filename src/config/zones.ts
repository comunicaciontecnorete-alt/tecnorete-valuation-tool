import type { Zone } from "@/types/valuation";

export const zones: Zone[] = [
  {
    postalCode: "45007",
    name: "Santa María de Benquerencia",
    slug: "santa-maria-de-benquerencia",
    headline: "¿Cuánto vale tu piso en Santa María de Benquerencia?",
    subheadline:
      "Calcula una estimación orientativa del valor de tu vivienda en pocos pasos.",
    basePricePerSqm: 1350,
    heroImage: "/images/zones/santa-maria-de-benquerencia.jpg",
  },
  {
    postalCode: "45004",
    name: "Santa Teresa",
    slug: "santa-teresa",
    headline: "¿Cuánto vale tu vivienda en Santa Teresa?",
    subheadline:
      "Obtén una primera referencia de valor antes de vender tu vivienda.",
    basePricePerSqm: 1700,
    heroImage: "/images/zones/santa-teresa.jpg",
  },
  {
    postalCode: "45005",
    name: "Toledo Sur",
    slug: "toledo-sur",
    valuationEnabled: false,
    headline: "Valoración de vivienda en Toledo Sur",
    subheadline:
      "Selecciona Buenavista, La Legua o Valparaíso para obtener una estimación adaptada a tu subzona.",
    basePricePerSqm: 1450,
    heroImage: "/images/zones/toledo-sur.jpg",
  },
  {
    postalCode: "45005",
    name: "Buenavista",
    slug: "buenavista",
    parentZoneSlug: "toledo-sur",
    headline: "¿Cuánto vale tu vivienda en Buenavista?",
    subheadline: "Zona residencial con valoración específica.",
    basePricePerSqm: 2000,
    heroImage: "/images/zones/toledo-sur.jpg",
  },
  {
    postalCode: "45005",
    name: "La Legua",
    slug: "la-legua",
    parentZoneSlug: "toledo-sur",
    allowedPropertyTypes: ["casa", "chalet"],
    headline: "Calcula el valor de tu casa en La Legua",
    subheadline: "Vivienda unifamiliar.",
    basePricePerSqm: 1600,
    heroImage: "/images/zones/toledo-sur.jpg",
  },
  {
    postalCode: "45005",
    name: "Valparaíso",
    slug: "valparaiso",
    parentZoneSlug: "toledo-sur",
    allowedPropertyTypes: ["casa", "chalet"],
    headline: "Calcula el valor de tu casa en Valparaíso",
    subheadline: "Vivienda unifamiliar.",
    basePricePerSqm: 1800,
    heroImage: "/images/zones/toledo-sur.jpg",
  },
  {
    postalCode: "45008",
    name: "Azucaica",
    slug: "azucaica",
    headline: "¿Cuánto vale tu vivienda en Azucaica?",
    subheadline:
      "Introduce los datos principales de tu vivienda y recibe un rango estimado.",
    basePricePerSqm: 1250,
    heroImage: "/images/zones/azucaica.jpg",
  },
  {
    postalCode: "45161",
    name: "Polán",
    slug: "polan",
    headline: "Descubre el valor orientativo de tu vivienda en Polán",
    subheadline:
      "Calcula un rango aproximado de valoración antes de tomar una decisión.",
    basePricePerSqm: 900,
    heroImage: "/images/zones/polan.jpg",
  },
  {
    postalCode: "45123",
    name: "Layos",
    slug: "layos",
    headline: "¿Quieres saber cuánto puede valer tu casa en Layos?",
    subheadline:
      "Completa la calculadora y recibe una estimación orientativa al momento.",
    basePricePerSqm: 1000,
    heroImage: "/images/zones/layos.jpg",
  },
  {
    postalCode: "45122",
    name: "Argés",
    slug: "arges",
    headline: "Calcula el valor de tu vivienda en Argés",
    subheadline:
      "Una primera estimación para saber en qué rango puede moverse tu vivienda.",
    basePricePerSqm: 1150,
    heroImage: "/images/zones/arges.jpg",
  },
  {
    postalCode: "45190",
    name: "Nambroca",
    slug: "nambroca",
    headline: "¿Cuánto vale tu vivienda en Nambroca?",
    subheadline:
      "Conoce un rango orientativo de valor según zona, metros y características.",
    basePricePerSqm: 1050,
    heroImage: "/images/zones/nambroca.jpg",
  },
];

export function getZoneBySlug(slug: string) {
  return zones.find((zone) => zone.slug === slug);
}

export function getChildZones(parentSlug: string) {
  return zones.filter(
    (zone) => zone.parentZoneSlug === parentSlug
  );
}

export function getTopLevelZones() {
  return zones.filter((zone) => !zone.parentZoneSlug);
}
