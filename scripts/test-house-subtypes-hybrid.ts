import { calculateValuationHybrid } from "../src/lib/calculateValuationHybrid";

import type {
  HouseSubtype,
  ValuationInput,
} from "../src/types/valuation";

const subtypes: HouseSubtype[] = [
  "attached",
  "detached",
  "semiDetached",
  "singleFamily",
  "unknown",
];

const baseInput: ValuationInput = {
  zoneSlug: "arges",
  street: "Calle de prueba",
  streetNumber: "1",
  propertyType: "casa",

  squareMeters: 150,
  bedrooms: 3,
  bathrooms: 2,

  floor: "bajo",
  hasElevator: false,

  condition: "buen-estado",
  constructionPeriod: "1991-2005",

  extras: {
    garage: false,
    terrace: false,
    storage: false,
  },
};

console.log("");
console.log("========================================");
console.log("PRUEBA SUBTIPOS V2 CASAS");
console.log("========================================");

for (const houseSubtype of subtypes) {
  const result = calculateValuationHybrid({
    ...baseInput,
    houseSubtype,
  });

  console.log("");
  console.log("----------------------------------------");
  console.log(houseSubtype.toUpperCase());
  console.log("----------------------------------------");

  console.log(
    "Motor:",
    result.valuationEngine
  );

  console.log(
    "Precio central:",
    `${result.adjustedPrice.toLocaleString("es-ES")} €`
  );

  console.log(
    "Rango:",
    `${result.minPrice.toLocaleString("es-ES")} €`,
    "→",
    `${result.maxPrice.toLocaleString("es-ES")} €`
  );

  if (result.valuationEngine !== "v2-house") {
    throw new Error(
      `${houseSubtype}: debería utilizar v2-house`
    );
  }

  console.log(
    "Subtipo recibido:",
    result.houseSubtype
  );

  console.log(
    "Coeficiente subtipo:",
    result.subtypeCoefficient
  );

  if (result.houseSubtype !== houseSubtype) {
    throw new Error(
      `${houseSubtype}: el subtipo no ha llegado correctamente al motor`
    );
  }

  if (result.demand !== null) {
    throw new Error(
      `${houseSubtype}: una casa no debe recibir demanda de pisos`
    );
  }
}

console.log("");
console.log("========================================");
console.log("✓ SUBTIPOS V2 DE CASAS VALIDADOS");
console.log("========================================");
