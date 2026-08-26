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
      street: "Calle de prueba",
      streetNumber: "1",
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
      street: "Calle de prueba",
      streetNumber: "1",
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
      street: "Calle de prueba",
      streetNumber: "1",
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
    name: "Dúplex Buenavista",
    input: {
      zoneSlug: "buenavista",
      street: "Calle de prueba",
      streetNumber: "1",
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
    name: "Chalet Layos",
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
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

console.log("");
console.log("========================================");
console.log("PRUEBA SISTEMA HÍBRIDO + DEMANDA");
console.log("========================================");

for (const testCase of cases) {
  const result = calculateValuationHybrid(
    testCase.input
  );

  console.log("");
  console.log("----------------------------------------");
  console.log(testCase.name.toUpperCase());
  console.log("----------------------------------------");

  console.log(
    `Motor: ${result.valuationEngine}`
  );

  console.log(
    `Precio central: ${formatCurrency(
      result.adjustedPrice
    )}`
  );

  console.log(
    `Rango: ${formatCurrency(
      result.minPrice
    )} → ${formatCurrency(result.maxPrice)}`
  );

  if (result.valuationEngine === "v2-apartment") {
    if (!result.demand) {
      throw new Error(
        `${testCase.name}: debería tener información de demanda.`
      );
    }

    console.log("");
    console.log("DEMANDA");

    console.log(
      `Nivel: ${result.demandLabel}`
    );

    console.log(
      `Compradores del segmento: ${result.demand.buyers}`
    );

    console.log(
      `Dormitorios usados: ${result.demand.bedrooms}`
    );

    console.log(
      `Rango de demanda: ${result.demand.priceRange}`
    );

    console.log(
      `Peso sobre compradores de pisos: ${formatPercent(
        result.demand.shareOfApartmentDemand
      )}`
    );
  } else {
    if (
      result.demand !== null ||
      result.demandLabel !== null
    ) {
      throw new Error(
        `${testCase.name}: una casa/chalet no debería tener demanda de pisos.`
      );
    }

    console.log("");
    console.log(
      "✓ Casa/chalet sin dato de demanda de pisos"
    );
  }
}

console.log("");
console.log("========================================");
console.log("✓ SISTEMA HÍBRIDO + DEMANDA VALIDADO");
console.log("========================================");
console.log("");
