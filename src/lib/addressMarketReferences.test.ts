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

const productionReferenceCases = [
  {
    street: "Calle Lagunas de Ruidera",
    normalizedStreet: "Lagunas de Ruidera",
    streetNumber: "1",
    pricePerSqm: 2009,
  },
  {
    street: "Calle Río Estenilla",
    normalizedStreet: "Rio Estenilla",
    streetNumber: "15",
    pricePerSqm: 2031,
  },
  {
    street: "Calle Río Fresnedoso",
    normalizedStreet: "Rio Fresnedoso",
    streetNumber: "28",
    pricePerSqm: 1887,
  },
  {
    street: "Calle Río Guadarrama",
    normalizedStreet: "Rio Guadarrama",
    streetNumber: "36",
    pricePerSqm: 2670,
  },
  {
    street: "Calle Río Valdemarías",
    normalizedStreet: "Rio Valdemarias",
    streetNumber: "34",
    pricePerSqm: 1951,
  },
  {
    street: "Calle Río Cigüela",
    normalizedStreet: "Rio Ciguela",
    streetNumber: "7",
    pricePerSqm: 1660,
  },
] as const;

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

test("el dataset productivo contiene solo las seis operaciones auditadas", () => {
  assert.equal(addressMarketReferences.length, 6);

  assert.deepEqual(
    addressMarketReferences.map(
      ({
        street,
        streetNumber,
        propertyCategory,
        pricePerSqm,
        observedPricePerSqm,
        observedSalePrice,
        daysToBuyer,
        knownFeatures,
      }) => ({
        street,
        streetNumber,
        propertyCategory,
        pricePerSqm,
        observedPricePerSqm,
        observedSalePrice,
        daysToBuyer,
        knownFeatures,
      })
    ),
    [
      {
        street: "Calle Lagunas de Ruidera",
        streetNumber: "1",
        propertyCategory: "apartment",
        pricePerSqm: 2009,
        observedPricePerSqm: 2214,
        observedSalePrice: 214900,
        daysToBuyer: 15,
        knownFeatures: {
          hasElevator: true,
          garage: true,
          storage: true,
        },
      },
      {
        street: "Calle Río Estenilla",
        streetNumber: "15",
        propertyCategory: "apartment",
        pricePerSqm: 2031,
        observedPricePerSqm: 2238,
        observedSalePrice: 235000,
        daysToBuyer: 5,
        knownFeatures: {
          hasElevator: true,
          garage: true,
          storage: true,
        },
      },
      {
        street: "Calle Río Fresnedoso",
        streetNumber: "28",
        propertyCategory: "apartment",
        pricePerSqm: 1887,
        observedPricePerSqm: 1944,
        observedSalePrice: 175000,
        daysToBuyer: 40,
        knownFeatures: {
          hasElevator: true,
          garage: false,
          storage: false,
        },
      },
      {
        street: "Calle Río Guadarrama",
        streetNumber: "36",
        propertyCategory: "apartment",
        pricePerSqm: 2670,
        observedPricePerSqm: 2888,
        observedSalePrice: 260000,
        daysToBuyer: 7,
        knownFeatures: {
          hasElevator: true,
          garage: true,
          storage: false,
        },
      },
      {
        street: "Calle Río Valdemarías",
        streetNumber: "34",
        propertyCategory: "apartment",
        pricePerSqm: 1951,
        observedPricePerSqm: 2110,
        observedSalePrice: 189900,
        daysToBuyer: 7,
        knownFeatures: {
          hasElevator: true,
          garage: true,
          storage: false,
        },
      },
      {
        street: "Calle Río Cigüela",
        streetNumber: "7",
        propertyCategory: "apartment",
        pricePerSqm: 1660,
        observedPricePerSqm: 1610,
        observedSalePrice: 135000,
        daysToBuyer: 30,
        knownFeatures: {
          hasElevator: false,
          garage: false,
          storage: false,
        },
      },
    ]
  );
});

test("las seis direcciones productivas aceptan variantes normalizadas", () => {
  for (const reference of productionReferenceCases) {
    const variants = [
      reference.street,
      reference.normalizedStreet,
      `C/ ${reference.street.replace(/^Calle /, "")}`,
    ];

    for (const street of variants) {
      const result = findAddressMarketReference({
        zoneSlug,
        street,
        streetNumber: reference.streetNumber,
        propertyCategory: "apartment",
      });

      assert.equal(result.matched, true, street);
      assert.equal(
        result.matched && result.pricePerSqm,
        reference.pricePerSqm,
        street
      );
    }
  }
});

test("las referencias productivas exigen número, categoría y zona exactos", () => {
  for (const reference of productionReferenceCases) {
    assert.equal(
      findAddressMarketReference({
        zoneSlug,
        street: reference.street,
        streetNumber: `${Number(reference.streetNumber) + 1}`,
        propertyCategory: "apartment",
      }).matched,
      false
    );

    assert.equal(
      findAddressMarketReference({
        zoneSlug,
        street: reference.street,
        streetNumber: reference.streetNumber,
        propertyCategory: "house",
      }).matched,
      false
    );

    assert.equal(
      findAddressMarketReference({
        zoneSlug: "santa-teresa",
        street: reference.street,
        streetNumber: reference.streetNumber,
        propertyCategory: "apartment",
      }).matched,
      false
    );
  }
});

test("Río Cigüela 7 reaplica características sin doble ajuste territorial", () => {
  const result = calculateValuationV2(
    createApartmentInput({
      street: "C/ Río Cigüela",
      streetNumber: "7",
      hasElevator: false,
      extras: {
        garage: false,
        terrace: false,
        storage: false,
      },
    })
  );

  assert.equal(result.localizedPricePerSqm, 1660);
  assert.equal(result.pricingReference.source, "address");
  assert.equal(result.pricingReference.addressMatched, true);
  assert.equal(
    result.appliedCoefficients.some(
      ({ label }) => label === "Ajuste local de zona"
    ),
    false
  );
  assert.equal(
    result.appliedCoefficients.find(
      ({ label }) => label === "Ascensor"
    )?.value,
    0.97
  );
  assert.ok(
    Math.abs(result.adjustedPrice / 100 - 1610) <= 1
  );
});

test("una dirección desconocida usa el fallback recalibrado de pisos", () => {
  const result = calculateValuationV2(
    createApartmentInput({
      street: "Calle Río Inventado",
      streetNumber: "99",
    })
  );

  assert.equal(result.localizedPricePerSqm, 2000);
  assert.equal(result.basePrice, 200000);
  assert.equal(result.pricingReference.source, "zone");
  assert.equal(result.pricingReference.addressMatched, false);
  assert.equal(
    result.appliedCoefficients.some(
      ({ label }) => label === "Ajuste local de zona"
    ),
    true
  );
});

test("el fallback de casas de Benquerencia permanece en 1350 €/m²", () => {
  const result = calculateHouseValuationV2(
    createApartmentInput({
      street: "Calle Río Inventado",
      streetNumber: "99",
      propertyType: "casa",
      floor: "bajo",
      hasElevator: false,
    }),
    "unknown"
  );

  assert.equal(result.localizedPricePerSqm, 1350);
  assert.equal(result.pricingReference.source, "zone");
});

test("el fallback productivo recalibrado conserva el resto del cálculo", () => {

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

  assert.equal(result.localizedPricePerSqm, 2000);
  assert.equal(result.basePrice, 170000);
  assert.equal(result.adjustedPrice, 220351);
  assert.equal(result.minPrice, 205000);
  assert.equal(result.maxPrice, 236000);
  assert.equal(result.pricingReference.source, "zone");
  assert.equal(result.pricingReference.addressMatched, false);
});
