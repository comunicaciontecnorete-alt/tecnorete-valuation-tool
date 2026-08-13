import { calculateValuation } from "../src/lib/calculateValuation";
import {
  calculateValuationV2,
} from "../src/lib/calculateValuationV2";

import type {
  ValuationInput,
} from "../src/types/valuation";

type ComparisonCase = {
  name: string;
  input: ValuationInput;
};

const cases: ComparisonCase[] = [
  {
    name: "Piso Santa Teresa",
    input: {
      zoneSlug: "santa-teresa",
      propertyType: "piso",
      squareMeters: 90,
      bedrooms: 3,
      bathrooms: 2,
      floor: "intermedia",
      hasElevator: true,
      condition: "buen-estado",
      constructionPeriod: "1991-2005",
      extras: {
        garage: false,
        terrace: false,
        storage: false,
      },
    },
  },

  {
    name: "Piso Polán a reformar",
    input: {
      zoneSlug: "polan",
      propertyType: "piso",
      squareMeters: 80,
      bedrooms: 2,
      bathrooms: 1,
      floor: "primera",
      hasElevator: false,
      condition: "a-reformar",
      constructionPeriod: "antes-1970",
      extras: {
        garage: false,
        terrace: false,
        storage: true,
      },
    },
  },

  {
    name: "Ático Benquerencia reformado",
    input: {
      zoneSlug: "santa-maria-de-benquerencia",
      propertyType: "atico",
      squareMeters: 85,
      bedrooms: 2,
      bathrooms: 2,
      floor: "atico",
      hasElevator: true,
      condition: "reformado",
      constructionPeriod: "1991-2005",
      extras: {
        garage: false,
        terrace: true,
        storage: true,
      },
    },
  },

  {
    name: "Dúplex Toledo Sur",
    input: {
      zoneSlug: "toledo-sur",
      propertyType: "duplex",
      squareMeters: 110,
      bedrooms: 3,
      bathrooms: 2,
      floor: "ultima",
      hasElevator: true,
      condition: "reformado",
      constructionPeriod: "2006-2015",
      extras: {
        garage: true,
        terrace: true,
        storage: true,
      },
    },
  },

  {
    name: "Casa Argés",
    input: {
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
    },
  },

  {
    name: "Chalet Layos",
    input: {
      zoneSlug: "layos",
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
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

console.log("");
console.log("========================================");
console.log("COMPARACIÓN VALORACIÓN V1 vs V2");
console.log("========================================");

for (const testCase of cases) {
  const v1 = calculateValuation(testCase.input);
  const v2 = calculateValuationV2(testCase.input);

  const difference =
    v2.adjustedPrice - v1.adjustedPrice;

  const differencePercent =
    (difference / v1.adjustedPrice) * 100;

  console.log("");
  console.log("----------------------------------------");
  console.log(testCase.name.toUpperCase());
  console.log("----------------------------------------");

  console.log(
    `Tipo: ${testCase.input.propertyType}`
  );

  console.log(
    `Metros: ${testCase.input.squareMeters} m²`
  );

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
  console.log("V2 NUEVA");

  console.log(
    `Familia: ${v2.propertyFamily}`
  );

  console.log(
    `Base mercado Toledo: ${formatCurrency(
      v2.marketBasePricePerSqm
    )}/m²`
  );

  console.log(
    `Ajuste zona: ${v2.zoneAdjustment.toFixed(3)}`
  );

  console.log(
    `Base localizada: ${formatCurrency(
      v2.localizedPricePerSqm
    )}/m²`
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
console.log("========================================");
console.log("FIN DE LA COMPARACIÓN");
console.log("========================================");
console.log("");