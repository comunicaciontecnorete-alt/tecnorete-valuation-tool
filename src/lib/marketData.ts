import rawMarketData from "../data/market-data.json";

import type {
  ApartmentMarketData,
  BedroomDemand,
  DemandData,
  HouseMarketData,
  MarketContext,
  MarketData,
  MarketReportSource,
  PriceMetrics,
  PriceRangeDemand,
  UsualPriceRange,
} from "../types/market-data";

function assertObject(
  value: unknown,
  name: string
): asserts value is Record<string, unknown> {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    throw new Error(
      `Datos de mercado inválidos: "${name}" debe ser un objeto.`
    );
  }
}

function assertString(
  value: unknown,
  name: string
): asserts value is string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(
      `Datos de mercado inválidos: "${name}" debe ser un texto válido.`
    );
  }
}

function assertPositiveNumber(
  value: unknown,
  name: string
): asserts value is number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value <= 0
  ) {
    throw new Error(
      `Datos de mercado inválidos: "${name}" debe ser un número positivo.`
    );
  }
}

function assertNonNegativeNumber(
  value: unknown,
  name: string
): asserts value is number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    throw new Error(
      `Datos de mercado inválidos: "${name}" debe ser un número igual o superior a 0.`
    );
  }
}

function validatePriceMetrics(
  value: unknown,
  name: string
): asserts value is PriceMetrics & Record<string, unknown> {
  assertObject(value, name);

  assertPositiveNumber(
    value.averageSalePrice,
    `${name}.averageSalePrice`
  );

  assertPositiveNumber(
    value.pricePerUsefulSqm,
    `${name}.pricePerUsefulSqm`
  );

  assertPositiveNumber(
    value.pricePerBuiltSqm,
    `${name}.pricePerBuiltSqm`
  );
}

function validateUsualPriceRange(
  value: unknown,
  name: string
): asserts value is UsualPriceRange {
  assertObject(value, name);

  assertPositiveNumber(
    value.averagePricePerUsefulSqm,
    `${name}.averagePricePerUsefulSqm`
  );

  assertPositiveNumber(
    value.salePriceMin,
    `${name}.salePriceMin`
  );

  assertPositiveNumber(
    value.pricePerUsefulSqmMin,
    `${name}.pricePerUsefulSqmMin`
  );

  assertPositiveNumber(
    value.pricePerUsefulSqmMax,
    `${name}.pricePerUsefulSqmMax`
  );

  assertPositiveNumber(
    value.salePriceMax,
    `${name}.salePriceMax`
  );

  assertPositiveNumber(
    value.averageSalePrice,
    `${name}.averageSalePrice`
  );

  if (value.salePriceMin > value.salePriceMax) {
    throw new Error(
      `Datos de mercado inválidos: el precio mínimo de "${name}" es superior al máximo.`
    );
  }

  if (
    value.pricePerUsefulSqmMin >
    value.pricePerUsefulSqmMax
  ) {
    throw new Error(
      `Datos de mercado inválidos: el €/m² mínimo de "${name}" es superior al máximo.`
    );
  }
}

function validateApartmentMarketData(
  value: unknown
): asserts value is ApartmentMarketData {
  validatePriceMetrics(value, "apartments");

  const elevator = value.elevator;
  assertObject(elevator, "apartments.elevator");

  validatePriceMetrics(
    elevator.yes,
    "apartments.elevator.yes"
  );

  validatePriceMetrics(
    elevator.no,
    "apartments.elevator.no"
  );

  const bedrooms = value.bedrooms;
  assertObject(bedrooms, "apartments.bedrooms");

  validatePriceMetrics(
    bedrooms["1"],
    "apartments.bedrooms.1"
  );

  validatePriceMetrics(
    bedrooms["2"],
    "apartments.bedrooms.2"
  );

  validatePriceMetrics(
    bedrooms["3"],
    "apartments.bedrooms.3"
  );

  validatePriceMetrics(
    bedrooms["4"],
    "apartments.bedrooms.4"
  );

  const age = value.age;
  assertObject(age, "apartments.age");

  validatePriceMetrics(
    age.under40Years,
    "apartments.age.under40Years"
  );

  validatePriceMetrics(
    age.over40Years,
    "apartments.age.over40Years"
  );

  validateUsualPriceRange(
    value.usualRange,
    "apartments.usualRange"
  );
}

function validateHouseMarketData(
  value: unknown
): asserts value is HouseMarketData {
  validatePriceMetrics(value, "houses");

  const size = value.size;
  assertObject(size, "houses.size");

  validatePriceMetrics(
    size.under70Sqm,
    "houses.size.under70Sqm"
  );

  validatePriceMetrics(
    size.over70Sqm,
    "houses.size.over70Sqm"
  );

  const subtypes = value.subtypes;
  assertObject(subtypes, "houses.subtypes");

  validatePriceMetrics(
    subtypes.attached,
    "houses.subtypes.attached"
  );

  validatePriceMetrics(
    subtypes.detached,
    "houses.subtypes.detached"
  );

  validatePriceMetrics(
    subtypes.semiDetached,
    "houses.subtypes.semiDetached"
  );

  validatePriceMetrics(
    subtypes.singleFamily,
    "houses.subtypes.singleFamily"
  );

  const condition = value.condition;
  assertObject(condition, "houses.condition");

  validatePriceMetrics(
    condition.recentlyRenovated,
    "houses.condition.recentlyRenovated"
  );

  validatePriceMetrics(
    condition.renovated,
    "houses.condition.renovated"
  );

  validatePriceMetrics(
    condition.moveInReady,
    "houses.condition.moveInReady"
  );

  validatePriceMetrics(
    condition.needsRenovation,
    "houses.condition.needsRenovation"
  );

  const age = value.age;
  assertObject(age, "houses.age");

  validatePriceMetrics(
    age.under40Years,
    "houses.age.under40Years"
  );

  validatePriceMetrics(
    age.over40Years,
    "houses.age.over40Years"
  );

  validateUsualPriceRange(
    value.usualRange,
    "houses.usualRange"
  );
}

function validateBedroomDemand(
  value: unknown,
  name: string
): asserts value is BedroomDemand & Record<string, unknown> {
  assertObject(value, name);

  assertNonNegativeNumber(
    value["1"],
    `${name}.1`
  );

  assertNonNegativeNumber(
    value["2"],
    `${name}.2`
  );

  assertNonNegativeNumber(
    value["3"],
    `${name}.3`
  );

  assertNonNegativeNumber(
    value["4"],
    `${name}.4`
  );
}

function validatePriceRangeDemand(
  value: unknown,
  name: string
): asserts value is PriceRangeDemand {
  validateBedroomDemand(value, name);

  assertNonNegativeNumber(
    value.total,
    `${name}.total`
  );

  const calculatedTotal =
    value["1"] +
    value["2"] +
    value["3"] +
    value["4"];

  if (calculatedTotal !== value.total) {
    throw new Error(
      `Datos de mercado inválidos: el total de "${name}" no coincide con la suma por dormitorios.`
    );
  }
}

function validateDemandData(
  value: unknown
): asserts value is DemandData {
  assertObject(value, "demand");

  assertPositiveNumber(
    value.totalBuyers,
    "demand.totalBuyers"
  );

  const totalBuyers = value.totalBuyers;

  const apartments = value.apartments;

  assertObject(
    apartments,
    "demand.apartments"
  );

  assertPositiveNumber(
    apartments.totalPotentialBuyers,
    "demand.apartments.totalPotentialBuyers"
  );

  const totalPotentialBuyers =
    apartments.totalPotentialBuyers;

  const byBedrooms = apartments.byBedrooms;

  validateBedroomDemand(
    byBedrooms,
    "demand.apartments.byBedrooms"
  );

  const totalByBedrooms =
    byBedrooms["1"] +
    byBedrooms["2"] +
    byBedrooms["3"] +
    byBedrooms["4"];

  if (
    totalByBedrooms !==
    totalPotentialBuyers
  ) {
    throw new Error(
      "Datos de mercado inválidos: la suma de demanda por dormitorios no coincide con el total de compradores potenciales de pisos."
    );
  }

  const byPriceRange = apartments.byPriceRange;

  assertObject(
    byPriceRange,
    "demand.apartments.byPriceRange"
  );

  const upTo100000 =
    byPriceRange.upTo100000;

  validatePriceRangeDemand(
    upTo100000,
    "demand.apartments.byPriceRange.upTo100000"
  );

  const from100000To150000 =
    byPriceRange.from100000To150000;

  validatePriceRangeDemand(
    from100000To150000,
    "demand.apartments.byPriceRange.from100000To150000"
  );

  const from150000To200000 =
    byPriceRange.from150000To200000;

  validatePriceRangeDemand(
    from150000To200000,
    "demand.apartments.byPriceRange.from150000To200000"
  );

  const from200000To300000 =
    byPriceRange.from200000To300000;

  validatePriceRangeDemand(
    from200000To300000,
    "demand.apartments.byPriceRange.from200000To300000"
  );

  const from300000To400000 =
    byPriceRange.from300000To400000;

  validatePriceRangeDemand(
    from300000To400000,
    "demand.apartments.byPriceRange.from300000To400000"
  );

  const over400000 =
    byPriceRange.over400000;

  validatePriceRangeDemand(
    over400000,
    "demand.apartments.byPriceRange.over400000"
  );

  const totalByPriceRange =
    upTo100000.total +
    from100000To150000.total +
    from150000To200000.total +
    from200000To300000.total +
    from300000To400000.total +
    over400000.total;

  if (
    totalByPriceRange !==
    totalPotentialBuyers
  ) {
    throw new Error(
      "Datos de mercado inválidos: la suma de demanda por rango de precio no coincide con el total de compradores potenciales de pisos."
    );
  }

  if (
    totalPotentialBuyers >
    totalBuyers
  ) {
    throw new Error(
      "Datos de mercado inválidos: los compradores potenciales de pisos no pueden superar el total de compradores."
    );
  }
}

function validateMarketContext(
  value: unknown
): asserts value is MarketContext {
  assertObject(value, "market");

  assertNonNegativeNumber(
    value.averageDiscountPercent,
    "market.averageDiscountPercent"
  );

  assertNonNegativeNumber(
    value.overvaluationPercent,
    "market.overvaluationPercent"
  );

  if (value.averageDiscountPercent > 100) {
    throw new Error(
      "Datos de mercado inválidos: la negociación media no puede superar el 100%."
    );
  }

  if (value.overvaluationPercent > 100) {
    throw new Error(
      "Datos de mercado inválidos: la sobrevaloración no puede superar el 100%."
    );
  }
}

function validateSource(
  value: unknown
): asserts value is MarketReportSource {
  assertObject(value, "source");

  assertString(
    value.report,
    "source.report"
  );

  assertString(
    value.organization,
    "source.organization"
  );

  assertString(
    value.location,
    "source.location"
  );

  if (
    value.location.toLowerCase() !== "toledo"
  ) {
    throw new Error(
      `Datos de mercado inválidos: se esperaba un informe de Toledo y se ha encontrado "${value.location}".`
    );
  }

  const period = value.period;

  assertObject(
    period,
    "source.period"
  );

  assertString(
    period.from,
    "source.period.from"
  );

  assertString(
    period.to,
    "source.period.to"
  );

  assertString(
    value.importedAt,
    "source.importedAt"
  );
}

function validateMarketData(
  value: unknown
): asserts value is MarketData {
  assertObject(value, "marketData");

  validateSource(
    value.source
  );

  validateApartmentMarketData(
    value.apartments
  );

  validateHouseMarketData(
    value.houses
  );

  validateDemandData(
    value.demand
  );

  validateMarketContext(
    value.market
  );
}

validateMarketData(rawMarketData);

/**
 * Datos de mercado validados procedentes del último
 * informe importado del DAI / Grupo Tecnocasa.
 *
 * El resto de la aplicación debe acceder a los datos
 * mediante este módulo y no importar directamente
 * market-data.json.
 */
export const marketData: MarketData =
  rawMarketData;

export function getMarketData(): MarketData {
  return marketData;
}