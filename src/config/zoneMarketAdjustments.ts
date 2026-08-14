export type ZoneMarketAdjustment = {
  apartment: number;
  house: number;
};

const APARTMENT_REFERENCE = 1437.5;

/**
 * Referencia del primer informe dinámico utilizado
 * para construir el índice local provisional de casas.
 *
 * No es un precio fijo de valoración.
 * Sirve únicamente como punto de calibración territorial.
 */
const HOUSE_REFERENCE = 633;

export const zoneMarketAdjustments: Record<
  string,
  ZoneMarketAdjustment
> = {
  "santa-maria-de-benquerencia": {
    apartment: 1350 / APARTMENT_REFERENCE,
    house: 1350 / HOUSE_REFERENCE,
  },

  "santa-teresa": {
    apartment: 1700 / APARTMENT_REFERENCE,
    house: 1700 / HOUSE_REFERENCE,
  },

  "toledo-sur": {
    apartment: 1450 / APARTMENT_REFERENCE,
    house: 1450 / HOUSE_REFERENCE,
  },

  azucaica: {
    apartment: 1250 / APARTMENT_REFERENCE,
    house: 1250 / HOUSE_REFERENCE,
  },

  polan: {
    apartment: 900 / APARTMENT_REFERENCE,
    house: 900 / HOUSE_REFERENCE,
  },

  layos: {
    apartment: 1000 / APARTMENT_REFERENCE,
    house: 1000 / HOUSE_REFERENCE,
  },

  arges: {
    apartment: 1150 / APARTMENT_REFERENCE,
    house: 1150 / HOUSE_REFERENCE,
  },

  nambroca: {
    apartment: 1050 / APARTMENT_REFERENCE,
    house: 1050 / HOUSE_REFERENCE,
  },
};

export function getZoneMarketAdjustment(
  zoneSlug: string
): ZoneMarketAdjustment {
  const adjustment =
    zoneMarketAdjustments[zoneSlug];

  if (!adjustment) {
    throw new Error(
      `No existe ajuste de mercado para la zona: ${zoneSlug}`
    );
  }

  return adjustment;
}