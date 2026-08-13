import { getMarketData } from "@/lib/marketData";

export type DemandLevel =
  | "low"
  | "medium"
  | "high"
  | "veryHigh";

export type DemandResult = {
  level: DemandLevel;
  buyers: number;
  shareOfApartmentDemand: number;
  bedrooms: 1 | 2 | 3 | 4;
  priceRange:
    | "upTo100000"
    | "from100000To150000"
    | "from150000To200000"
    | "from200000To300000"
    | "from300000To400000"
    | "over400000";
};

function getPriceRange(
  valuationPrice: number
): DemandResult["priceRange"] {
  if (valuationPrice <= 100000) {
    return "upTo100000";
  }

  if (valuationPrice <= 150000) {
    return "from100000To150000";
  }

  if (valuationPrice <= 200000) {
    return "from150000To200000";
  }

  if (valuationPrice <= 300000) {
    return "from200000To300000";
  }

  if (valuationPrice <= 400000) {
    return "from300000To400000";
  }

  return "over400000";
}

function normalizeBedrooms(
  bedrooms: number
): 1 | 2 | 3 | 4 {
  if (bedrooms <= 1) {
    return 1;
  }

  if (bedrooms === 2) {
    return 2;
  }

  if (bedrooms === 3) {
    return 3;
  }

  return 4;
}

function calculateDemandLevel(
  buyers: number,
  allSegmentValues: number[]
): DemandLevel {
  const sorted = [...allSegmentValues].sort(
    (a, b) => a - b
  );

  const percentile = (position: number) => {
    const index = Math.floor(
      (sorted.length - 1) * position
    );

    return sorted[index];
  };

  const q1 = percentile(0.25);
  const q2 = percentile(0.5);
  const q3 = percentile(0.75);

  if (buyers <= q1) {
    return "low";
  }

  if (buyers <= q2) {
    return "medium";
  }

  if (buyers <= q3) {
    return "high";
  }

  return "veryHigh";
}

export function getApartmentDemand(
  bedroomsInput: number,
  valuationPrice: number
): DemandResult {
  const marketData = getMarketData();

  const bedrooms =
    normalizeBedrooms(bedroomsInput);

  const priceRange =
    getPriceRange(valuationPrice);

  const demand =
    marketData.demand.apartments;

  const buyers =
    demand.byPriceRange[priceRange][bedrooms];

  const ranges = Object.values(
    demand.byPriceRange
  );

  const allSegmentValues: number[] = [];

  for (const range of ranges) {
    allSegmentValues.push(
      range[1],
      range[2],
      range[3],
      range[4]
    );
  }

  const level = calculateDemandLevel(
    buyers,
    allSegmentValues
  );

  const shareOfApartmentDemand =
    buyers / demand.totalPotentialBuyers;

  return {
    level,
    buyers,
    shareOfApartmentDemand,
    bedrooms,
    priceRange,
  };
}

export function getDemandLevelLabel(
  level: DemandLevel
): string {
  switch (level) {
    case "low":
      return "Baja";

    case "medium":
      return "Media";

    case "high":
      return "Alta";

    case "veryHigh":
      return "Muy alta";
  }
}