import { valuationConfig } from "@/config/valuation";
import { getZoneBySlug } from "@/config/zones";
import { getZoneMarketAdjustment } from "@/config/zoneMarketAdjustments";
import { getMarketData } from "@/lib/marketData";


import type {
  AppliedCoefficient,
  HouseSubtype,
  ValuationInput,
  ValuationResult,
} from "@/types/valuation";

export type { HouseSubtype } from "@/types/valuation";

export type HouseValuationResultV2 =
  ValuationResult & {
    valuationEngine: "v2-house";
    marketBasePricePerSqm: number;
    zoneAdjustment: number;
    localizedPricePerSqm: number;
    houseSubtype: HouseSubtype;
    sizeCoefficient: number;
    subtypeCoefficient: number;
  };

function roundToNearest(
  value: number,
  nearest: number
) {
  return Math.round(value / nearest) * nearest;
}

function getConditionCoefficient(
  condition: ValuationInput["condition"]
) {
  switch (condition) {
    case "a-reformar":
      return 0.88;

    case "buen-estado":
      return 1;

    case "reformado":
      return 1.15;
  }
}

function getSizeCoefficient(
  squareMeters: number
) {
  /*
   * Informe:
   *
   * <70 m²  → 494 €/m² construido
   * >70 m²  → 644 €/m² construido
   *
   * No aplicamos literalmente 494/633 y 644/633,
   * porque tamaño y €/m² están correlacionados.
   * Usamos un ajuste deliberadamente suave.
   */
  return squareMeters < 70 ? 0.97 : 1.01;
}

function getSubtypeCoefficient(
  subtype: HouseSubtype
) {
  /*
   * Informe:
   *
   * Adosada       → 578 €/m²
   * Independiente → 638 €/m²
   * Pareada       → 828 €/m²
   * Unifamiliar   → 370 €/m²
   *
   * Los valores no se convierten literalmente
   * en multiplicadores porque pueden estar afectados
   * por tamaño, ubicación, estado y muestra.
   */
  switch (subtype) {
    case "attached":
      return 0.96;

    case "detached":
      return 1;

    case "semiDetached":
      return 1.12;

    case "singleFamily":
      return 0.85;

    case "unknown":
      return 1;
  }
}

export function calculateHouseValuationV2(
  input: ValuationInput,
  houseSubtype: HouseSubtype = "unknown"
): HouseValuationResultV2 {
  if (
    input.propertyType !== "casa" &&
    input.propertyType !== "chalet"
  ) {
    throw new Error(
      "calculateHouseValuationV2 solo puede utilizarse con casas o chalets."
    );
  }

  const zone = getZoneBySlug(input.zoneSlug);

  if (!zone) {
    throw new Error(
      `No existe configuración para la zona: ${input.zoneSlug}`
    );
  }

  if (
    !input.squareMeters ||
    input.squareMeters <= 0
  ) {
    throw new Error(
      "Los metros cuadrados deben ser mayores que 0."
    );
  }

  const marketData = getMarketData();

  const zoneAdjustment =
    getZoneMarketAdjustment(input.zoneSlug);

  const marketBasePricePerSqm =
    marketData.houses.pricePerBuiltSqm;

  const localAdjustment =
    zoneAdjustment.house;

  const localizedPricePerSqm =
    marketBasePricePerSqm *
    localAdjustment;

  const basePrice =
    localizedPricePerSqm *
    input.squareMeters;

  const conditionCoefficient =
    getConditionCoefficient(input.condition);

  const sizeCoefficient =
    getSizeCoefficient(input.squareMeters);

  const subtypeCoefficient =
    getSubtypeCoefficient(houseSubtype);

  /*
   * Mantenemos provisionalmente los extras.
   *
   * No aplicamos:
   * - ascensor
   * - planta
   * - antiguo +5% por casa
   * - antiguo +10% por chalet
   *
   * El subtipo específico sustituirá progresivamente
   * esa distinción genérica.
   */
  const extrasCoefficient =
    1 +
    (input.extras.garage
      ? valuationConfig.extrasCoefficients.garage
      : 0) +
    (input.extras.terrace
      ? valuationConfig.extrasCoefficients.terrace
      : 0) +
    (input.extras.storage
      ? valuationConfig.extrasCoefficients.storage
      : 0);

  const adjustedPrice =
    basePrice *
    conditionCoefficient *
    sizeCoefficient *
    subtypeCoefficient *
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
      label: "Ajuste local de zona",
      value: localAdjustment,
    },
    {
      label: "Estado",
      value: conditionCoefficient,
    },
    {
      label: "Tamaño",
      value: sizeCoefficient,
    },
    {
      label: "Subtipo de casa",
      value: subtypeCoefficient,
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

    valuationEngine: "v2-house",

    marketBasePricePerSqm,

    zoneAdjustment: localAdjustment,

    localizedPricePerSqm: Math.round(
      localizedPricePerSqm
    ),

    houseSubtype,
    sizeCoefficient,
    subtypeCoefficient,
  };
}