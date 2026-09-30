export type ZoneMarketReferenceBreakdown = {
  label: string;
  sales: number;
  pricePerSqm: number;
};

export type ZoneMarketReferenceData = {
  location: string;
  totalSales: number;
  averageSalePrice: number;
  averagePricePerSqm: number;
  propertyTypes: ZoneMarketReferenceBreakdown[];
  apartmentFeatures: ZoneMarketReferenceBreakdown[];
  conditions: ZoneMarketReferenceBreakdown[];
};

export const zoneMarketReferenceData: Record<
  string,
  ZoneMarketReferenceData
> = {
  "santa-maria-de-benquerencia": {
    location: "Santa María de Benquerencia",
    totalSales: 11,
    averageSalePrice: 187327,
    averagePricePerSqm: 2072,
    propertyTypes: [
      { label: "Pisos", sales: 10, pricePerSqm: 2046 },
      { label: "Casa/chalet", sales: 1, pricePerSqm: 2333 },
    ],
    apartmentFeatures: [
      { label: "Pisos con ascensor", sales: 7, pricePerSqm: 2314 },
      { label: "Pisos sin ascensor", sales: 3, pricePerSqm: 1420 },
    ],
    conditions: [
      { label: "A actualizar", sales: 1, pricePerSqm: 1499 },
      { label: "Buen estado", sales: 7, pricePerSqm: 2001 },
      { label: "Reformado", sales: 3, pricePerSqm: 2429 },
    ],
  },
};

export function getZoneMarketReferenceData(zoneSlug: string) {
  return zoneMarketReferenceData[zoneSlug];
}
