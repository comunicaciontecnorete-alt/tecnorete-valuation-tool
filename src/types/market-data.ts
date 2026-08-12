export type BedroomCount = 1 | 2 | 3 | 4;

export interface PriceMetrics {
  averageSalePrice: number;
  pricePerUsefulSqm: number;
  pricePerBuiltSqm: number;
}

export interface UsualPriceRange {
  averagePricePerUsefulSqm: number;
  salePriceMin: number;
  pricePerUsefulSqmMin: number;
  pricePerUsefulSqmMax: number;
  salePriceMax: number;
  averageSalePrice: number;
}

export interface ApartmentMarketData extends PriceMetrics {
  elevator: {
    yes: PriceMetrics;
    no: PriceMetrics;
  };

  bedrooms: Record<BedroomCount, PriceMetrics>;

  age: {
    under40Years: PriceMetrics;
    over40Years: PriceMetrics;
  };

  usualRange: UsualPriceRange;
}

export interface HouseMarketData extends PriceMetrics {
  size: {
    under70Sqm: PriceMetrics;
    over70Sqm: PriceMetrics;
  };

  subtypes: {
    attached: PriceMetrics;
    detached: PriceMetrics;
    semiDetached: PriceMetrics;
    singleFamily: PriceMetrics;
  };

  condition: {
    recentlyRenovated: PriceMetrics;
    renovated: PriceMetrics;
    moveInReady: PriceMetrics;
    needsRenovation: PriceMetrics;
  };

  age: {
    under40Years: PriceMetrics;
    over40Years: PriceMetrics;
  };

  usualRange: UsualPriceRange;
}

export interface BedroomDemand {
  1: number;
  2: number;
  3: number;
  4: number;
}

export interface PriceRangeDemand extends BedroomDemand {
  total: number;
}

export interface ApartmentDemand {
  totalPotentialBuyers: number;

  byBedrooms: BedroomDemand;

  byPriceRange: {
    upTo100000: PriceRangeDemand;
    from100000To150000: PriceRangeDemand;
    from150000To200000: PriceRangeDemand;
    from200000To300000: PriceRangeDemand;
    from300000To400000: PriceRangeDemand;
    over400000: PriceRangeDemand;
  };
}

export interface DemandData {
  totalBuyers: number;
  apartments: ApartmentDemand;
}

export interface MarketContext {
  averageDiscountPercent: number;
  overvaluationPercent: number;
}

export interface MarketReportSource {
  report: string;
  organization: string;
  location: string;

  period: {
    from: string;
    to: string;
  };

  importedAt: string;
}

export interface MarketData {
  source: MarketReportSource;
  apartments: ApartmentMarketData;
  houses: HouseMarketData;
  demand: DemandData;
  market: MarketContext;
}