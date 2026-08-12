export type ZoneMarketAdjustment = {
  apartment: number;
  house: number;
};

export const zoneMarketAdjustments: Record<
  string,
  ZoneMarketAdjustment
> = {
  "santa-maria-de-benquerencia": {
    apartment: 1350 / 1437.5,
    house: 1350 / 1437.5,
  },

  "santa-teresa": {
    apartment: 1700 / 1437.5,
    house: 1700 / 1437.5,
  },

  "toledo-sur": {
    apartment: 1450 / 1437.5,
    house: 1450 / 1437.5,
  },

  azucaica: {
    apartment: 1250 / 1437.5,
    house: 1250 / 1437.5,
  },

  polan: {
    apartment: 900 / 1437.5,
    house: 900 / 1437.5,
  },

  layos: {
    apartment: 1000 / 1437.5,
    house: 1000 / 1437.5,
  },

  arges: {
    apartment: 1150 / 1437.5,
    house: 1150 / 1437.5,
  },

  nambroca: {
    apartment: 1050 / 1437.5,
    house: 1050 / 1437.5,
  },
};

export function getZoneMarketAdjustment(
  zoneSlug: string
): ZoneMarketAdjustment {
  const adjustment = zoneMarketAdjustments[zoneSlug];

  if (!adjustment) {
    throw new Error(
      `No existe ajuste de mercado para la zona: ${zoneSlug}`
    );
  }

  return adjustment;
}