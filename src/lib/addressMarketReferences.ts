import rawAddressMarketReferences from "@/data/address-market-references.json";

export type AddressPropertyCategory =
  | "apartment"
  | "house";

export type AddressReferenceConfidence =
  | "low"
  | "medium"
  | "high";

export type AddressMarketReference = {
  zoneSlug: string;
  street: string;
  streetNumber: string;
  propertyCategory: AddressPropertyCategory;
  pricePerSqm: number;
  basis: "neutralized";
  referenceId?: string;
  source?: string;
  referenceDate?: string;
  confidence?: AddressReferenceConfidence;
  notes?: string;
  observedPricePerSqm?: number;
  observedSalePrice?: number;
  daysToBuyer?: number;
  knownFeatures?: {
    hasElevator?: boolean;
    garage?: boolean;
    storage?: boolean;
  };
};

export type AddressReferenceLookup = {
  zoneSlug: string;
  street: string;
  streetNumber: string;
  propertyCategory: AddressPropertyCategory;
};

export type AddressReferenceMatch =
  | {
      matched: true;
      source: "address";
      pricePerSqm: number;
      referenceId?: string;
    }
  | {
      matched: false;
      source: "zone";
    };

export type PricingReference = {
  source: "address" | "zone";
  pricePerSqm: number;
  addressMatched: boolean;
  referenceId?: string;
};

type RoadType = "calle" | "avenida";

export type NormalizedStreetName = {
  roadType: RoadType | null;
  name: string;
};

const ENABLED_ADDRESS_REFERENCE_ZONE_SLUGS = new Set([
  "santa-maria-de-benquerencia",
]);

function normalizeDiacritics(value: string) {
  return value
    .toLocaleLowerCase("es-ES")
    .normalize("NFD")
    .replace(/n\u0303/g, "ñ")
    .replace(/[\u0300-\u036f]/g, "");
}

function collapseSpaces(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function normalizeStreetName(
  street: string
): NormalizedStreetName {
  let normalized = collapseSpaces(
    normalizeDiacritics(street)
  );

  let roadType: RoadType | null = null;

  const callePrefix = /^(?:calle\b|c\s*\/|c\s*\.)\s*/;
  const avenidaPrefix =
    /^(?:avenida\b|avda\s*\.?|av\s*\.)\s*/;

  if (callePrefix.test(normalized)) {
    roadType = "calle";
    normalized = normalized.replace(callePrefix, "");
  } else if (avenidaPrefix.test(normalized)) {
    roadType = "avenida";
    normalized = normalized.replace(avenidaPrefix, "");
  }

  const name = collapseSpaces(
    normalized.replace(/[-_,.;:()[\]{}'"´`/\\]+/g, " ")
  );

  return { roadType, name };
}

export function normalizeStreetNumber(
  streetNumber: string
) {
  let normalized = normalizeDiacritics(streetNumber)
    .toLocaleUpperCase("es-ES")
    .trim();

  normalized = normalized.replace(
    /^(?:N\s*\.\s*[º°O]|N\s*[º°O]|NUMERO)\s*[:.,-]?\s*/,
    ""
  );

  normalized = collapseSpaces(normalized);

  return normalized.replace(
    /^(\d+)\s+(BIS|[A-Z])$/,
    "$1$2"
  );
}

export function buildAddressKey(
  lookup: AddressReferenceLookup
) {
  const normalizedStreet = normalizeStreetName(
    lookup.street
  );

  return [
    lookup.zoneSlug.trim().toLocaleLowerCase("es-ES"),
    lookup.propertyCategory,
    normalizedStreet.roadType ?? "",
    normalizedStreet.name,
    normalizeStreetNumber(lookup.streetNumber),
  ].join("|");
}

function assertOptionalString(
  value: unknown,
  field: string
): asserts value is string | undefined {
  if (
    value !== undefined &&
    (typeof value !== "string" || value.trim() === "")
  ) {
    throw new Error(
      `Referencia por dirección inválida: "${field}" debe ser un texto no vacío.`
    );
  }
}

function assertOptionalPositiveNumber(
  value: unknown,
  field: string
): asserts value is number | undefined {
  if (
    value !== undefined &&
    (typeof value !== "number" ||
      !Number.isFinite(value) ||
      value <= 0)
  ) {
    throw new Error(
      `Referencia por dirección inválida: "${field}" debe ser un número positivo.`
    );
  }
}

function assertOptionalKnownFeatures(
  value: unknown
): asserts value is AddressMarketReference["knownFeatures"] {
  if (value === undefined) {
    return;
  }

  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    throw new Error(
      'Referencia por dirección inválida: "knownFeatures" debe ser un objeto.'
    );
  }

  const knownFeatures = value as Record<string, unknown>;

  for (const field of [
    "hasElevator",
    "garage",
    "storage",
  ] as const) {
    if (
      knownFeatures[field] !== undefined &&
      typeof knownFeatures[field] !== "boolean"
    ) {
      throw new Error(
        `Referencia por dirección inválida: "knownFeatures.${field}" debe ser booleano.`
      );
    }
  }
}

function parseAddressMarketReferences(
  value: unknown
): readonly AddressMarketReference[] {
  if (!Array.isArray(value)) {
    throw new Error(
      "Las referencias por dirección deben ser un array."
    );
  }

  const references = value.map((item, index) => {
    if (
      typeof item !== "object" ||
      item === null ||
      Array.isArray(item)
    ) {
      throw new Error(
        `Referencia por dirección inválida en la posición ${index}.`
      );
    }

    const reference = item as Record<string, unknown>;

    for (const field of [
      "zoneSlug",
      "street",
      "streetNumber",
    ] as const) {
      if (
        typeof reference[field] !== "string" ||
        reference[field].trim() === ""
      ) {
        throw new Error(
          `Referencia por dirección inválida: "${field}" debe ser un texto no vacío.`
        );
      }
    }

    if (
      reference.propertyCategory !== "apartment" &&
      reference.propertyCategory !== "house"
    ) {
      throw new Error(
        'Referencia por dirección inválida: "propertyCategory" debe ser "apartment" o "house".'
      );
    }

    if (
      typeof reference.pricePerSqm !== "number" ||
      !Number.isFinite(reference.pricePerSqm) ||
      reference.pricePerSqm <= 0
    ) {
      throw new Error(
        'Referencia por dirección inválida: "pricePerSqm" debe ser un número positivo.'
      );
    }

    if (reference.basis !== "neutralized") {
      throw new Error(
        'Referencia por dirección inválida: "basis" debe ser "neutralized".'
      );
    }

    assertOptionalString(reference.referenceId, "referenceId");
    assertOptionalString(reference.source, "source");
    assertOptionalString(reference.referenceDate, "referenceDate");
    assertOptionalString(reference.notes, "notes");
    assertOptionalPositiveNumber(
      reference.observedPricePerSqm,
      "observedPricePerSqm"
    );
    assertOptionalPositiveNumber(
      reference.observedSalePrice,
      "observedSalePrice"
    );
    assertOptionalPositiveNumber(
      reference.daysToBuyer,
      "daysToBuyer"
    );
    assertOptionalKnownFeatures(reference.knownFeatures);

    if (
      reference.confidence !== undefined &&
      reference.confidence !== "low" &&
      reference.confidence !== "medium" &&
      reference.confidence !== "high"
    ) {
      throw new Error(
        'Referencia por dirección inválida: "confidence" debe ser "low", "medium" o "high".'
      );
    }

    return reference as AddressMarketReference;
  });

  const seenKeys = new Set<string>();

  for (const reference of references) {
    const key = buildAddressKey(reference);

    if (seenKeys.has(key)) {
      throw new Error(
        `Referencia por dirección duplicada tras normalización: ${key}`
      );
    }

    seenKeys.add(key);
  }

  return references;
}

export const addressMarketReferences =
  parseAddressMarketReferences(
    rawAddressMarketReferences as unknown
  );

export function findAddressMarketReference(
  lookup: AddressReferenceLookup,
  references: readonly AddressMarketReference[] =
    addressMarketReferences
): AddressReferenceMatch {
  const normalizedZoneSlug = lookup.zoneSlug
    .trim()
    .toLocaleLowerCase("es-ES");

  if (
    !ENABLED_ADDRESS_REFERENCE_ZONE_SLUGS.has(
      normalizedZoneSlug
    )
  ) {
    return { matched: false, source: "zone" };
  }

  const normalizedInputStreet = normalizeStreetName(
    lookup.street
  );
  const normalizedInputNumber = normalizeStreetNumber(
    lookup.streetNumber
  );

  const compatibleCandidates = references.filter(
    (reference) => {
      const normalizedReferenceStreet =
        normalizeStreetName(reference.street);

      return (
        reference.zoneSlug.trim().toLocaleLowerCase("es-ES") ===
          normalizedZoneSlug &&
        reference.propertyCategory ===
          lookup.propertyCategory &&
        normalizeStreetNumber(reference.streetNumber) ===
          normalizedInputNumber &&
        normalizedReferenceStreet.name ===
          normalizedInputStreet.name &&
        (normalizedInputStreet.roadType === null ||
          normalizedReferenceStreet.roadType ===
            normalizedInputStreet.roadType)
      );
    }
  );

  if (compatibleCandidates.length !== 1) {
    return { matched: false, source: "zone" };
  }

  const reference = compatibleCandidates[0];

  return {
    matched: true,
    source: "address",
    pricePerSqm: reference.pricePerSqm,
    ...(reference.referenceId
      ? { referenceId: reference.referenceId }
      : {}),
  };
}
