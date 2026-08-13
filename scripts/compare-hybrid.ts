import { calculateValuation } from "../src/lib/calculateValuation";
import { calculateValuationHybrid } from "../src/lib/calculateValuationHybrid";

import type { ValuationInput } from "../src/types/valuation";

type TestCase = {
  name: string;
  input: ValuationInput;
};

const cases: TestCase[] = [
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
    name: "Ático Benquerencia",
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
console.log("COMPARACIÓN V1 vs SISTEMA HÍBRIDO");
console.log("========================================");

for (const testCase of cases) {
  const v1 = calculateValuation(testCase.input);
  const hybrid = calculateValuationHybrid(testCase.input);

  const difference =
    hybrid.adjustedPrice - v1.adjustedPrice;

  const differencePercent =
    v1.adjustedPrice !== 0
      ? (difference / v1.adjustedPrice) * 100
      : 0;

  const isHouse =
    testCase.input.propertyType === "casa" ||
    testCase.input.propertyType === "chalet";

  console.log("");
  console.log("----------------------------------------");
  console.log(testCase.name.toUpperCase());
  console.log("----------------------------------------");

  console.log(
    `V1:       ${formatCurrency(v1.adjustedPrice)}`
  );

  console.log(
    `HÍBRIDO:  ${formatCurrency(
      hybrid.adjustedPrice
    )}`
  );

  console.log(
    `Diferencia: ${
      difference >= 0 ? "+" : ""
    }${formatCurrency(difference)} (${
      differencePercent >= 0 ? "+" : ""
    }${differencePercent.toFixed(1)}%)`
  );

  if (isHouse) {
    if (
      hybrid.adjustedPrice !== v1.adjustedPrice ||
      hybrid.minPrice !== v1.minPrice ||
      hybrid.maxPrice !== v1.maxPrice
    ) {
      throw new Error(
        `ERROR: ${testCase.name} debería seguir usando exactamente la V1.`
      );
    }

    console.log(
      "✓ Casa/chalet protegido: mantiene exactamente V1"
    );
  } else {
    console.log(
      "✓ Apartamento: utiliza la nueva lógica V2"
    );
  }
}

console.log("");
console.log("========================================");
console.log("✓ SISTEMA HÍBRIDO VALIDADO");
console.log("========================================");
console.log("");