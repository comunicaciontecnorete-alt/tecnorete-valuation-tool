import {
  calculateHouseValuationV2,
  type HouseSubtype,
} from "../src/lib/calculateHouseValuationV2";

import type {
  PropertyCondition,
  ValuationInput,
} from "../src/types/valuation";

const baseInput: ValuationInput = {
  zoneSlug: "arges",
  propertyType: "casa",
  squareMeters: 140,
  bedrooms: 3,
  bathrooms: 2,
  floor: "bajo",
  hasElevator: false,
  condition: "buen-estado",
  constructionPeriod: "1991-2005",
  extras: {
    garage: true,
    terrace: true,
    storage: false,
  },
};

const subtypes: {
  value: HouseSubtype;
  label: string;
}[] = [
  {
    value: "unknown",
    label: "Desconocido",
  },
  {
    value: "attached",
    label: "Adosada",
  },
  {
    value: "detached",
    label: "Independiente",
  },
  {
    value: "semiDetached",
    label: "Pareada",
  },
  {
    value: "singleFamily",
    label: "Unifamiliar",
  },
];

const conditions: {
  value: PropertyCondition;
  label: string;
}[] = [
  {
    value: "a-reformar",
    label: "A reformar",
  },
  {
    value: "buen-estado",
    label: "Buen estado",
  },
  {
    value: "reformado",
    label: "Reformado",
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

console.log("");
console.log("==========================================");
console.log("MATRIZ DE CONTROL V2 CASAS");
console.log("Casa de referencia: Argés · 140 m²");
console.log("==========================================");

console.log("");
console.log("SUBTIPOS");
console.log("------------------------------------------");

for (const subtype of subtypes) {
  const result = calculateHouseValuationV2(
    baseInput,
    subtype.value
  );

  console.log(
    `${subtype.label.padEnd(14)} → ${formatCurrency(
      result.adjustedPrice
    )} | ${formatCurrency(
      result.minPrice
    )} - ${formatCurrency(result.maxPrice)}`
  );
}

console.log("");
console.log("ESTADOS");
console.log("------------------------------------------");

for (const condition of conditions) {
  const input: ValuationInput = {
    ...baseInput,
    condition: condition.value,
  };

  const result = calculateHouseValuationV2(
    input,
    "unknown"
  );

  console.log(
    `${condition.label.padEnd(14)} → ${formatCurrency(
      result.adjustedPrice
    )} | ${formatCurrency(
      result.minPrice
    )} - ${formatCurrency(result.maxPrice)}`
  );
}

console.log("");
console.log("==========================================");
console.log("✓ MATRIZ DE CONTROL COMPLETADA");
console.log("==========================================");
console.log("");