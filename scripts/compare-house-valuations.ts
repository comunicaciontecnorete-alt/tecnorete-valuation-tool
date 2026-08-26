import { calculateValuation } from "../src/lib/calculateValuation";
import {
  calculateHouseValuationV2,
  type HouseSubtype,
} from "../src/lib/calculateHouseValuationV2";

import type { ValuationInput } from "../src/types/valuation";

type HouseTestCase = {
  name: string;
  input: ValuationInput;
  subtype: HouseSubtype;
};

const cases: HouseTestCase[] = [
  {
    name: "Casa Argés - subtipo desconocido",
    subtype: "unknown",
    input: {
      zoneSlug: "arges",
      street: "Calle de prueba",
      streetNumber: "1",
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
    },
  },

  {
    name: "Casa Argés - adosada",
    subtype: "attached",
    input: {
      zoneSlug: "arges",
      street: "Calle de prueba",
      streetNumber: "1",
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
    },
  },

  {
    name: "Casa Argés - pareada",
    subtype: "semiDetached",
    input: {
      zoneSlug: "arges",
      street: "Calle de prueba",
      streetNumber: "1",
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
    },
  },

  {
    name: "Chalet Layos - independiente",
    subtype: "detached",
    input: {
      zoneSlug: "layos",
      street: "Calle de prueba",
      streetNumber: "1",
      propertyType: "chalet",
      squareMeters: 180,
      bedrooms: 4,
      bathrooms: 3,
      floor: "bajo",
      hasElevator: false,
      condition: "buen-estado",
      constructionPeriod: "2006-2015",
      extras: {
        garage: true,
        terrace: true,
        storage: true,
      },
    },
  },

  {
    name: "Chalet Layos - pareado",
    subtype: "semiDetached",
    input: {
      zoneSlug: "layos",
      street: "Calle de prueba",
      streetNumber: "1",
      propertyType: "chalet",
      squareMeters: 180,
      bedrooms: 4,
      bathrooms: 3,
      floor: "bajo",
      hasElevator: false,
      condition: "buen-estado",
      constructionPeriod: "2006-2015",
      extras: {
        garage: true,
        terrace: true,
        storage: true,
      },
    },
  },

  {
    name: "Casa Polán - adosada a reformar",
    subtype: "attached",
    input: {
      zoneSlug: "polan",
      street: "Calle de prueba",
      streetNumber: "1",
      propertyType: "casa",
      squareMeters: 120,
      bedrooms: 3,
      bathrooms: 1,
      floor: "bajo",
      hasElevator: false,
      condition: "a-reformar",
      constructionPeriod: "antes-1970",
      extras: {
        garage: false,
        terrace: true,
        storage: true,
      },
    },
  },

  {
    name: "Casa Nambroca - independiente reformada",
    subtype: "detached",
    input: {
      zoneSlug: "nambroca",
      street: "Calle de prueba",
      streetNumber: "1",
      propertyType: "casa",
      squareMeters: 160,
      bedrooms: 4,
      bathrooms: 2,
      floor: "bajo",
      hasElevator: false,
      condition: "reformado",
      constructionPeriod: "1991-2005",
      extras: {
        garage: true,
        terrace: true,
        storage: true,
      },
    },
  },

  {
    name: "Casa pequeña Argés - menos de 70 m²",
    subtype: "unknown",
    input: {
      zoneSlug: "arges",
      street: "Calle de prueba",
      streetNumber: "1",
      propertyType: "casa",
      squareMeters: 65,
      bedrooms: 2,
      bathrooms: 1,
      floor: "bajo",
      hasElevator: false,
      condition: "buen-estado",
      constructionPeriod: "1970-1990",
      extras: {
        garage: false,
        terrace: false,
        storage: false,
      },
    },
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
console.log("============================================");
console.log("COMPARACIÓN V1 vs V2 EXPERIMENTAL DE CASAS");
console.log("============================================");

for (const testCase of cases) {
  const v1 = calculateValuation(testCase.input);

  const v2 = calculateHouseValuationV2(
    testCase.input,
    testCase.subtype
  );

  const difference =
    v2.adjustedPrice - v1.adjustedPrice;

  const differencePercent =
    (difference / v1.adjustedPrice) * 100;

  console.log("");
  console.log("--------------------------------------------");
  console.log(testCase.name.toUpperCase());
  console.log("--------------------------------------------");

  console.log(`Subtipo: ${testCase.subtype}`);
  console.log(`Metros: ${testCase.input.squareMeters} m²`);
  console.log(`Estado: ${testCase.input.condition}`);

  console.log("");
  console.log("V1 ACTUAL");

  console.log(
    `Precio central: ${formatCurrency(
      v1.adjustedPrice
    )}`
  );

  console.log(
    `Rango: ${formatCurrency(
      v1.minPrice
    )} → ${formatCurrency(v1.maxPrice)}`
  );

  console.log("");
  console.log("V2 CASA EXPERIMENTAL");

  console.log(
    `Base mercado casas Toledo: ${v2.marketBasePricePerSqm} €/m²`
  );

  console.log(
    `Ajuste local: ${v2.zoneAdjustment.toFixed(3)}`
  );

  console.log(
    `Base localizada: ${v2.localizedPricePerSqm} €/m²`
  );

  console.log(
    `Coef. tamaño: ${v2.sizeCoefficient.toFixed(3)}`
  );

  console.log(
    `Coef. subtipo: ${v2.subtypeCoefficient.toFixed(3)}`
  );

  console.log(
    `Precio central: ${formatCurrency(
      v2.adjustedPrice
    )}`
  );

  console.log(
    `Rango: ${formatCurrency(
      v2.minPrice
    )} → ${formatCurrency(v2.maxPrice)}`
  );

  console.log("");
  console.log(
    `Diferencia V2 vs V1: ${
      difference >= 0 ? "+" : ""
    }${formatCurrency(difference)} (${
      differencePercent >= 0 ? "+" : ""
    }${differencePercent.toFixed(1)}%)`
  );
}

console.log("");
console.log("============================================");
console.log("FIN COMPARACIÓN CASAS");
console.log("============================================");
console.log("");
