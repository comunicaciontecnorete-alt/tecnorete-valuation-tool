import assert from "node:assert/strict";
import test from "node:test";

import type { HybridValuationResult } from "@/lib/calculateValuationHybrid";
import {
  hasStrictConsent,
  isPropertyType,
  isPropertyTypeAllowed,
  PROPERTY_TYPES,
  toPublicValuationResult,
} from "@/lib/leadApi";

test("rechaza un propertyType arbitrario", () => {
  assert.equal(isPropertyType("local-comercial"), false);
});

test("acepta todos los PropertyType reales en la validación global", () => {
  for (const propertyType of PROPERTY_TYPES) {
    assert.equal(isPropertyType(propertyType), true);
  }
});

test("mantiene la restricción territorial después de la validación global", () => {
  assert.equal(isPropertyType("piso"), true);
  assert.equal(
    isPropertyTypeAllowed("piso", ["casa", "chalet"]),
    false
  );
  assert.equal(
    isPropertyTypeAllowed("casa", ["casa", "chalet"]),
    true
  );
});

test("solo acepta el booleano true como consentimiento", () => {
  assert.equal(hasStrictConsent(true), true);

  for (const invalidConsent of [
    false,
    undefined,
    null,
    "true",
    "yes",
    1,
    {},
    [],
  ]) {
    assert.equal(hasStrictConsent(invalidConsent), false);
  }
});

test("serializa por allowlist únicamente los datos que consume la UI", () => {
  const internalResult = {
    zoneName: "Santa Teresa",
    postalCode: "45004",
    basePrice: 180000,
    adjustedPrice: 190000,
    minPrice: 175000,
    maxPrice: 205000,
    appliedCoefficients: [{ label: "Interno", value: 1.05 }],
    coeficientes: { debugging: true },
    marketBasePricePerSqm: 2000,
    zoneAdjustment: 1.1,
    localizedPricePerSqm: 2200,
    pricingReference: {
      source: "address",
      pricePerSqm: 2200,
      addressMatched: true,
      referenceId: "internal-reference",
    },
    addressMatched: true,
    referenceId: "internal-reference",
    propertyFamily: "apartment",
    valuationEngine: "v2-apartment",
    demandLabel: "Alta",
    demand: {
      level: "high",
      buyers: 321,
      shareOfApartmentDemand: 0.04,
      bedrooms: 3,
      priceRange: "from150000To200000",
    },
  } as unknown as HybridValuationResult;

  const publicResult = toPublicValuationResult(internalResult);

  assert.deepEqual(publicResult, {
    zoneName: "Santa Teresa",
    postalCode: "45004",
    minPrice: 175000,
    maxPrice: 205000,
    valuationEngine: "v2-apartment",
    demandLabel: "Alta",
    demand: {
      buyers: 321,
      bedrooms: 3,
    },
  });

  assert.equal("pricingReference" in publicResult, false);
  assert.equal("addressMatched" in publicResult, false);
  assert.equal("referenceId" in publicResult, false);
  assert.equal("appliedCoefficients" in publicResult, false);
  assert.equal("coeficientes" in publicResult, false);
  assert.equal("localizedPricePerSqm" in publicResult, false);
  assert.equal("marketBasePricePerSqm" in publicResult, false);
  assert.equal("basePrice" in publicResult, false);
  assert.equal("adjustedPrice" in publicResult, false);
});
