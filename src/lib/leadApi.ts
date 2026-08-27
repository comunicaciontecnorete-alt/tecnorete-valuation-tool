import type { HybridValuationResult } from "@/lib/calculateValuationHybrid";
import type { PropertyType } from "@/types/valuation";

export const PROPERTY_TYPES = [
  "piso",
  "atico",
  "duplex",
  "casa",
  "chalet",
] as const satisfies readonly PropertyType[];

export type PublicValuationResult =
  | {
      zoneName: string;
      postalCode: string;
      minPrice: number;
      maxPrice: number;
      valuationEngine: "v2-apartment";
      demandLabel: string;
      demand: {
        buyers: number;
        bedrooms: 1 | 2 | 3 | 4;
      };
    }
  | {
      zoneName: string;
      postalCode: string;
      minPrice: number;
      maxPrice: number;
      valuationEngine: "v2-house";
    };

export function isPropertyType(
  value: unknown
): value is PropertyType {
  return (
    typeof value === "string" &&
    (PROPERTY_TYPES as readonly string[]).includes(value)
  );
}

export function isPropertyTypeAllowed(
  propertyType: PropertyType,
  allowedPropertyTypes?: readonly PropertyType[]
) {
  return (
    !allowedPropertyTypes ||
    allowedPropertyTypes.includes(propertyType)
  );
}

export function hasStrictConsent(
  value: unknown
): value is true {
  return value === true;
}

export function toPublicValuationResult(
  result: HybridValuationResult
): PublicValuationResult {
  const publicBase = {
    zoneName: result.zoneName,
    postalCode: result.postalCode,
    minPrice: result.minPrice,
    maxPrice: result.maxPrice,
  };

  if (result.valuationEngine === "v2-apartment") {
    return {
      ...publicBase,
      valuationEngine: result.valuationEngine,
      demandLabel: result.demandLabel,
      demand: {
        buyers: result.demand.buyers,
        bedrooms: result.demand.bedrooms,
      },
    };
  }

  return {
    ...publicBase,
    valuationEngine: result.valuationEngine,
  };
}
