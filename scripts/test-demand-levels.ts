import {
  getApartmentDemand,
  getDemandLevelLabel,
} from "../src/lib/demandLevel";

type DemandTestCase = {
  name: string;
  bedrooms: number;
  valuationPrice: number;
  expectedBuyers: number;
};

const cases: DemandTestCase[] = [
  {
    name: "1 dormitorio - hasta 100.000 €",
    bedrooms: 1,
    valuationPrice: 90000,
    expectedBuyers: 147,
  },

  {
    name: "2 dormitorios - 100.000 a 150.000 €",
    bedrooms: 2,
    valuationPrice: 125000,
    expectedBuyers: 885,
  },

  {
    name: "3 dormitorios - 150.000 a 200.000 €",
    bedrooms: 3,
    valuationPrice: 175000,
    expectedBuyers: 871,
  },

  {
    name: "4 dormitorios - 200.000 a 300.000 €",
    bedrooms: 4,
    valuationPrice: 250000,
    expectedBuyers: 169,
  },

  {
    name: "3 dormitorios - 300.000 a 400.000 €",
    bedrooms: 3,
    valuationPrice: 350000,
    expectedBuyers: 32,
  },

  {
    name: "4 dormitorios - más de 400.000 €",
    bedrooms: 4,
    valuationPrice: 450000,
    expectedBuyers: 7,
  },

  {
    name: "2 dormitorios - más de 400.000 €",
    bedrooms: 2,
    valuationPrice: 450000,
    expectedBuyers: 5,
  },

  {
    name: "5 dormitorios se agrupa como 4",
    bedrooms: 5,
    valuationPrice: 90000,
    expectedBuyers: 10,
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
console.log("PRUEBA DE NIVELES DE DEMANDA");
console.log("========================================");

for (const testCase of cases) {
  const result = getApartmentDemand(
    testCase.bedrooms,
    testCase.valuationPrice
  );

  if (result.buyers !== testCase.expectedBuyers) {
    throw new Error(
      `${testCase.name}: se esperaban ${testCase.expectedBuyers} compradores y se han obtenido ${result.buyers}.`
    );
  }

  console.log("");
  console.log("----------------------------------------");
  console.log(testCase.name.toUpperCase());
  console.log("----------------------------------------");

  console.log(
    `Valoración: ${formatCurrency(
      testCase.valuationPrice
    )}`
  );

  console.log(
    `Dormitorios introducidos: ${testCase.bedrooms}`
  );

  console.log(
    `Dormitorios usados en informe: ${result.bedrooms}`
  );

  console.log(
    `Rango: ${result.priceRange}`
  );

  console.log(
    `Compradores del segmento: ${result.buyers}`
  );

  console.log(
    `Peso sobre demanda total de pisos: ${formatPercent(
      result.shareOfApartmentDemand
    )}`
  );

  console.log(
    `Nivel: ${getDemandLevelLabel(result.level)}`
  );
}

console.log("");
console.log("========================================");
console.log("✓ DATOS DE DEMANDA LEÍDOS CORRECTAMENTE");
console.log("========================================");
console.log("");