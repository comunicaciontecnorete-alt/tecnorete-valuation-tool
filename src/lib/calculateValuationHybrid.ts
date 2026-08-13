import { calculateValuation } from "@/lib/calculateValuation";
import { calculateValuationV2 } from "@/lib/calculateValuationV2";

import type {
  PropertyType,
  ValuationInput,
  ValuationResult,
} from "@/types/valuation";

type HybridValuationResult = ValuationResult;

function isApartmentFamily(propertyType: PropertyType) {
  return (
    propertyType === "piso" ||
    propertyType === "atico" ||
    propertyType === "duplex"
  );
}

export function calculateValuationHybrid(
  input: ValuationInput
): HybridValuationResult {
  if (isApartmentFamily(input.propertyType)) {
    return calculateValuationV2(input);
  }

  return calculateValuation(input);
}