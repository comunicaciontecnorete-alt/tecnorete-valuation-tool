export type PropertyType = "piso" | "atico" | "duplex" | "casa" | "chalet";

export type PropertyCondition = "a-reformar" | "buen-estado" | "reformado";

export type FloorType = "bajo" | "primera" | "intermedia" | "ultima" | "atico";

export type ConstructionPeriod =
  | "antes-1970"
  | "1970-1990"
  | "1991-2005"
  | "2006-2015"
  | "despues-2015"
  | "no-lo-se";

export type Zone = {
  postalCode: string;
  name: string;
  slug: string;
  headline: string;
  subheadline: string;
  basePricePerSqm: number;
};

export type PropertyExtras = {
  garage: boolean;
  terrace: boolean;
  storage: boolean;
};

export type ValuationInput = {
  zoneSlug: string;
  propertyType: PropertyType;
  squareMeters: number;
  bedrooms: number;
  bathrooms: number;
  floor: FloorType;
  hasElevator: boolean;
  condition: PropertyCondition;
  constructionPeriod: ConstructionPeriod;
  extras: PropertyExtras;
};

export type AppliedCoefficient = {
  label: string;
  value: number;
};

export type ValuationResult = {
  zoneName: string;
  postalCode: string;
  basePrice: number;
  adjustedPrice: number;
  minPrice: number;
  maxPrice: number;
  appliedCoefficients: AppliedCoefficient[];
};