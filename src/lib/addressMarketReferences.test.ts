import assert from "node:assert/strict";
import test from "node:test";

import {
  addressMarketReferences,
  buildAddressKey,
  findAddressMarketReference,
  normalizeStreetName,
  normalizeStreetNumber,
  type AddressMarketReference,
  type AddressPropertyCategory,
} from "@/lib/addressMarketReferences";
import { calculateHouseValuationV2 } from "@/lib/calculateHouseValuationV2";
import { calculateValuationV2 } from "@/lib/calculateValuationV2";

import type { ValuationInput } from "@/types/valuation";

const zoneSlug = "santa-maria-de-benquerencia";

const apartmentReference: AddressMarketReference = {
  zoneSlug,
  street: "Calle Río Cigüela",
  streetNumber: "7",
  propertyCategory: "apartment",
  pricePerSqm: 1999,
  basis: "neutralized",
  referenceId: "test-apartment-rio-ciguela-7",
};

const houseReference: AddressMarketReference = {
  ...apartmentReference,
  propertyCategory: "house",
  pricePerSqm: 1201,
  referenceId: "test-house-rio-ciguela-7",
};

function lookup(
  street: string,
  streetNumber = "7",
  propertyCategory: AddressPropertyCategory = "apartment",
  references: readonly AddressMarketReference[] = [
    apartmentReference,
  ],
  requestedZoneSlug = zoneSlug
) {
  return findAddressMarketReference(
    {
      zoneSlug: requestedZoneSlug,
      street,
      streetNumber,
      propertyCategory,
    },
    references
  );
}

function createApartmentInput(
  overrides: Partial<ValuationInput> = {}
): ValuationInput {
  return {
    zoneSlug,
    street: "Calle de prueba",
    streetNumber: "1",
    propertyType: "piso",
    squareMeters: 100,
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
    ...overrides,
  };
}

test("normaliza el nombre sin perder el tipo de vía", () => {
  assert.deepEqual(normalizeStreetName(" C/ Río Cigüela "), {
    roadType: "calle",
    name: "rio ciguela",
  });
  assert.deepEqual(normalizeStreetName("Avda. Río Cigüela"), {
    roadType: "avenida",
    name: "rio ciguela",
  });
  assert.deepEqual(normalizeStreetName("Río Cigüela"), {
    roadType: null,
    name: "rio ciguela",
  });
});

test("Río Cigüela 7 hace match exacto", () => {
  const result = lookup("Río Cigüela");

  assert.equal(result.matched, true);
  assert.equal(
    result.matched && result.referenceId,
    "test-apartment-rio-ciguela-7"
  );
});

test("Rio Ciguela 7 sin tildes hace el mismo match", () => {
  assert.equal(lookup("Rio Ciguela").matched, true);
});

test("C/ Río Cigüela 7 hace el mismo match", () => {
  assert.equal(lookup("C/ Río Cigüela").matched, true);
});

test("Calle Río Cigüela 7 hace el mismo match", () => {
  assert.equal(lookup("Calle Río Cigüela").matched, true);
});

test("24A y 24 A normalizan al mismo número", () => {
  assert.equal(normalizeStreetNumber("24A"), "24A");
  assert.equal(normalizeStreetNumber("N.º 24 A"), "24A");

  assert.equal(
    buildAddressKey({
      zoneSlug,
      street: "Calle Lago Azul",
      streetNumber: "24A",
      propertyCategory: "apartment",
    }),
    buildAddressKey({
      zoneSlug,
      street: "C/ Lago Azul",
      streetNumber: "24 A",
      propertyCategory: "apartment",
    })
  );
});

test("3 Bis y 3BIS normalizan al mismo número", () => {
  assert.equal(normalizeStreetNumber("3 Bis"), "3BIS");
  assert.equal(normalizeStreetNumber("Número 3BIS"), "3BIS");
});

test("una dirección desconocida usa fallback de zona", () => {
  assert.deepEqual(lookup("Calle Desconocida"), {
    matched: false,
    source: "zone",
  });
});

test("la misma calle con otro número no hace match", () => {
  assert.equal(lookup("Calle Río Cigüela", "8").matched, false);
});

test("la misma dirección en otra zona no hace match", () => {
  assert.equal(
    lookup(
      "Calle Río Cigüela",
      "7",
      "apartment",
      [apartmentReference],
      "santa-teresa"
    ).matched,
    false
  );
});

test("una referencia apartment no afecta a house", () => {
  assert.equal(
    lookup(
      "Calle Río Cigüela",
      "7",
      "house",
      [apartmentReference]
    ).matched,
    false
  );
});

test("una referencia house no afecta a apartment", () => {
  assert.equal(
    lookup(
      "Calle Río Cigüela",
      "7",
      "apartment",
      [houseReference]
    ).matched,
    false
  );
});

test("Calle y Avenida con el mismo nombre no colisionan", () => {
  const references: AddressMarketReference[] = [
    apartmentReference,
    {
      ...apartmentReference,
      street: "Avenida Río Cigüela",
      pricePerSqm: 2100,
      referenceId: "test-avenida-rio-ciguela-7",
    },
  ];

  const calleMatch = lookup(
    "Calle Río Cigüela",
    "7",
    "apartment",
    references
  );
  const avenidaMatch = lookup(
    "Avenida Río Cigüela",
    "7",
    "apartment",
    references
  );

  assert.equal(
    calleMatch.matched && calleMatch.pricePerSqm,
    1999
  );
  assert.equal(
    avenidaMatch.matched && avenidaMatch.pricePerSqm,
    2100
  );
});

test("una calle sin tipo y con dos candidatos es ambigua", () => {
  const references: AddressMarketReference[] = [
    apartmentReference,
    {
      ...apartmentReference,
      street: "Avenida Río Cigüela",
      pricePerSqm: 2100,
    },
  ];

  assert.deepEqual(
    lookup("Río Cigüela", "7", "apartment", references),
    { matched: false, source: "zone" }
  );
});

test("una calle sin tipo y con un solo candidato hace match", () => {
  assert.equal(lookup("rio ciguela").matched, true);
});

test("un match sustituye la base localizada sin reaplicar el ajuste de zona", () => {
  const result = calculateValuationV2(
    createApartmentInput({
      street: "Rio Ciguela",
      streetNumber: "7",
    }),
    { addressReferences: [apartmentReference] }
  );

  assert.equal(result.localizedPricePerSqm, 1999);
  assert.equal(result.basePrice, 199900);
  assert.deepEqual(result.pricingReference, {
    source: "address",
    pricePerSqm: 1999,
    addressMatched: true,
    referenceId: "test-apartment-rio-ciguela-7",
  });
  assert.equal(
    result.appliedCoefficients.some(
      ({ label }) => label === "Ajuste local de zona"
    ),
    false
  );
});

test("el motor de casas utiliza solo una referencia house exacta", () => {
  const input = createApartmentInput({
    street: "Calle Río Cigüela",
    streetNumber: "7",
    propertyType: "casa",
    floor: "bajo",
    hasElevator: false,
  });

  const result = calculateHouseValuationV2(
    input,
    "unknown",
    { addressReferences: [houseReference] }
  );

  assert.equal(result.localizedPricePerSqm, 1201);
  assert.equal(result.basePrice, 120100);
  assert.equal(result.pricingReference.source, "address");
});

test("el dataset productivo vacío conserva el resultado previo del motor", () => {
  assert.deepEqual(addressMarketReferences, []);

  const result = calculateValuationV2(
    createApartmentInput({
      street: "Calle de prueba",
      streetNumber: "1",
      propertyType: "atico",
      squareMeters: 85,
      floor: "atico",
      condition: "reformado",
      extras: {
        garage: false,
        terrace: true,
        storage: true,
      },
    })
  );

  assert.equal(result.localizedPricePerSqm, 1482);
  assert.equal(result.basePrice, 125966);
  assert.equal(result.adjustedPrice, 163275);
  assert.equal(result.minPrice, 152000);
  assert.equal(result.maxPrice, 175000);
  assert.equal(result.pricingReference.source, "zone");
  assert.equal(result.pricingReference.addressMatched, false);
});
