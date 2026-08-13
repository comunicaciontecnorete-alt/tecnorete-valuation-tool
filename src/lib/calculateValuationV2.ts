import { valuationConfig } from "@/config/valuation";
import { getZoneBySlug } from "@/config/zones";
import { getZoneMarketAdjustment } from "@/config/zoneMarketAdjustments";
import { getMarketData } from "@/lib/marketData";

import type {
  AppliedCoefficient,
  PropertyType,
  ValuationInput,
  ValuationResult,
} from "@/types/valuation";

type PropertyFamily = "apartment" | "house";

export type ValuationResultV2 = ValuationResult & {
  propertyFamily: PropertyFamily;
  marketBasePricePerSqm: number;
  zoneAdjustment: number;
  localizedPricePerSqm: number;
};

function roundToNearest(value: number, nearest: number) {
  return Math.round(value / nearest) * nearest;
}

function getPropertyFamily(
  propertyType: PropertyType
): PropertyFamily {
  switch (propertyType) {
    case "piso":
    case "atico":
    case "duplex":
      return "apartment";

    case "casa":
    case "chalet":
      return "house";
  }
}

/**
 * Ajustes provisionales dentro de la familia de pisos.
 *
 * No utilizamos los antiguos coeficientes de casa/chalet,
 * porque la V2 ya parte de una base de mercado independiente
 * para casas.
 */
function getPropertyTypeCoefficient(
  propertyType: PropertyType
) {
  switch (propertyType) {
    case "piso":
      return 1;

    case "atico":
      return 1.06;

    case "duplex":
      return 1.03;

    case "casa":
    case "chalet":
      return 1;
  }
}

export function calculateValuationV2(
  input: ValuationInput
): ValuationResultV2 {
  const zone = getZoneBySlug(input.zoneSlug);

  if (!zone) {
    throw new Error(
      `No existe configuración para la zona: ${input.zoneSlug}`
    );
  }

  if (!input.squareMeters || input.squareMeters <= 0) {
    throw new Error(
      "Los metros cuadrados deben ser mayores que 0."
    );
  }

  const marketData = getMarketData();

  const propertyFamily = getPropertyFamily(
    input.propertyType
  );

  const zoneAdjustment =
    getZoneMarketAdjustment(input.zoneSlug);

  /**
   * Base dinámica del informe.
   *
   * PISOS:
   * marketData.apartments.pricePerBuiltSqm
   *
   * CASAS:
   * marketData.houses.pricePerBuiltSqm
   */
  const marketBasePricePerSqm =
    propertyFamily === "apartment"
      ? marketData.apartments.pricePerBuiltSqm
      : marketData.houses.pricePerBuiltSqm;

  const localAdjustment =
    propertyFamily === "apartment"
      ? zoneAdjustment.apartment
      : zoneAdjustment.house;

  const localizedPricePerSqm =
    marketBasePricePerSqm * localAdjustment;

  const basePrice =
    localizedPricePerSqm * input.squareMeters;

  const propertyTypeCoefficient =
    getPropertyTypeCoefficient(input.propertyType);

  const conditionCoefficient =
    valuationConfig.conditionCoefficients[
      input.condition
    ];

  /**
   * Ascensor solo influye en pisos.
   * No tiene sentido aplicarlo automáticamente
   * a casas y chalets.
   */
  const elevatorCoefficient =
    propertyFamily === "apartment"
      ? input.hasElevator
        ? valuationConfig.elevatorCoefficients.yes
        : valuationConfig.elevatorCoefficients.no
      : 1;

  /**
   * Planta solo influye en pisos.
   *
   * Si el inmueble ya está marcado como ático,
   * no volvemos a aplicar el +8% de planta ático,
   * evitando la doble bonificación de la V1.
   */
  const floorCoefficient =
    propertyFamily === "apartment"
      ? input.propertyType === "atico"
        ? 1
        : valuationConfig.floorCoefficients[
            input.floor
          ]
      : 1;

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
      label: "Ajuste local de zona",
      value: localAdjustment,
    },
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

    propertyFamily,

    marketBasePricePerSqm,
    zoneAdjustment: localAdjustment,

    localizedPricePerSqm: Math.round(
      localizedPricePerSqm
    ),
  };
}