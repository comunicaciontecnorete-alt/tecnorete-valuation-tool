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
  },
  {
    postalCode: "45004",
    name: "Santa Teresa",
    slug: "santa-teresa",
    headline: "¿Cuánto vale tu vivienda en Santa Teresa?",
    subheadline:
      "Obtén una primera referencia de valor antes de vender tu vivienda.",
    basePricePerSqm: 1700,
  },
  {
    postalCode: "45005",
    name: "Toledo Sur",
    slug: "toledo-sur",
    headline: "Calcula el valor de tu piso en Toledo Sur",
    subheadline:
      "Una estimación rápida y orientativa basada en la zona y las características del inmueble.",
    basePricePerSqm: 1450,
  },
  {
    postalCode: "45008",
    name: "Azucaica",
    slug: "azucaica",
    headline: "¿Cuánto vale tu vivienda en Azucaica?",
    subheadline:
      "Introduce los datos principales de tu vivienda y recibe un rango estimado.",
    basePricePerSqm: 1250,
  },
  {
    postalCode: "45161",
    name: "Polán",
    slug: "polan",
    headline: "Descubre el valor orientativo de tu vivienda en Polán",
    subheadline:
      "Calcula un rango aproximado de valoración antes de tomar una decisión.",
    basePricePerSqm: 900,
  },
  {
    postalCode: "45123",
    name: "Layos",
    slug: "layos",
    headline: "¿Quieres saber cuánto puede valer tu casa en Layos?",
    subheadline:
      "Completa la calculadora y recibe una estimación orientativa al momento.",
    basePricePerSqm: 1000,
  },
  {
    postalCode: "45122",
    name: "Argés",
    slug: "arges",
    headline: "Calcula el valor de tu vivienda en Argés",
    subheadline:
      "Una primera estimación para saber en qué rango puede moverse tu vivienda.",
    basePricePerSqm: 1150,
  },
  {
    postalCode: "45190",
    name: "Nambroca",
    slug: "nambroca",
    headline: "¿Cuánto vale tu vivienda en Nambroca?",
    subheadline:
      "Conoce un rango orientativo de valor según zona, metros y características.",
    basePricePerSqm: 1050,
  },
];

export function getZoneBySlug(slug: string) {
  return zones.find((zone) => zone.slug === slug);
}