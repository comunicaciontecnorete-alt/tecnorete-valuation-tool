import {
  calculateValuationV2,
  type ValuationResultV2,
} from "@/lib/calculateValuationV2";

import {
  calculateHouseValuationV2,
  type HouseValuationResultV2,
} from "@/lib/calculateHouseValuationV2";

import {
  getApartmentDemand,
  getDemandLevelLabel,
  type DemandResult,
} from "@/lib/demandLevel";

import type {
  PropertyType,
  ValuationInput,
} from "@/types/valuation";

export type ApartmentHybridValuationResult =
  ValuationResultV2 & {
    valuationEngine: "v2-apartment";
    demand: DemandResult;
    demandLabel: string;
  };

export type HouseHybridValuationResult =
  HouseValuationResultV2 & {
    demand: null;
    demandLabel: null;
  };

export type HybridValuationResult =
  | ApartmentHybridValuationResult
  | HouseHybridValuationResult;

function isApartmentFamily(
  propertyType: PropertyType
): propertyType is "piso" | "atico" | "duplex" {
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
    const valuation = calculateValuationV2(input);

    const demand = getApartmentDemand(
      input.bedrooms,
      valuation.adjustedPrice
    );

    return {
      ...valuation,
      valuationEngine: "v2-apartment",
      demand,
      demandLabel: getDemandLevelLabel(
        demand.level
      ),
    };
  }

  const valuation = calculateHouseValuationV2(
    input,
    input.houseSubtype ?? "unknown"
  );

  return {
    ...valuation,
    demand: null,
    demandLabel: null,
  };
}