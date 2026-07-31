import { valuationConfig } from "@/config/valuation";
import { getZoneBySlug } from "@/config/zones";
import type {
  AppliedCoefficient,
  ValuationInput,
  ValuationResult,
} from "@/types/valuation";

function roundToNearest(value: number, nearest: number) {
  return Math.round(value / nearest) * nearest;
}

export function calculateValuation(input: ValuationInput): ValuationResult {
  const zone = getZoneBySlug(input.zoneSlug);

  if (!zone) {
    throw new Error(`No existe configuración para la zona: ${input.zoneSlug}`);
  }

  if (!input.squareMeters || input.squareMeters <= 0) {
    throw new Error("Los metros cuadrados deben ser mayores que 0.");
  }

  const basePrice = zone.basePricePerSqm * input.squareMeters;

  const propertyTypeCoefficient =
    valuationConfig.propertyTypeCoefficients[input.propertyType];

  const conditionCoefficient =
    valuationConfig.conditionCoefficients[input.condition];

  const elevatorCoefficient = input.hasElevator
    ? valuationConfig.elevatorCoefficients.yes
    : valuationConfig.elevatorCoefficients.no;

  const floorCoefficient = valuationConfig.floorCoefficients[input.floor];

  const extrasCoefficient =
    1 +
    (input.extras.garage ? valuationConfig.extrasCoefficients.garage : 0) +
    (input.extras.terrace ? valuationConfig.extrasCoefficients.terrace : 0) +
    (input.extras.storage ? valuationConfig.extrasCoefficients.storage : 0);

  const adjustedPrice =
    basePrice *
    propertyTypeCoefficient *
    conditionCoefficient *
    elevatorCoefficient *
    floorCoefficient *
    extrasCoefficient;

  const minPrice = roundToNearest(
    adjustedPrice * valuationConfig.range.min,
    valuationConfig.roundTo
  );

  const maxPrice = roundToNearest(
    adjustedPrice * valuationConfig.range.max,
    valuationConfig.roundTo
  );

  const appliedCoefficients: AppliedCoefficient[] = [
    {
      label: "Tipo de inmueble",
      value: propertyTypeCoefficient,
    },
    {
      label: "Estado",
      value: conditionCoefficient,
    },
    {
      label: "Ascensor",
      value: elevatorCoefficient,
    },
    {
      label: "Planta",
      value: floorCoefficient,
    },
    {
      label: "Extras",
      value: extrasCoefficient,
    },
  ];

  return {
    zoneName: zone.name,
    postalCode: zone.postalCode,
    basePrice: Math.round(basePrice),
    adjustedPrice: Math.round(adjustedPrice),
    minPrice,
    maxPrice,
    appliedCoefficients,
  };
}