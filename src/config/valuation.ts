export const valuationConfig = {
  conditionCoefficients: {
    "a-reformar": 0.88,
    "buen-estado": 1,
    reformado: 1.12,
  },

  propertyTypeCoefficients: {
    piso: 1,
    atico: 1.08,
    duplex: 1.04,
    casa: 1.05,
    chalet: 1.1,
  },

  elevatorCoefficients: {
    yes: 1.03,
    no: 0.97,
  },

  floorCoefficients: {
    bajo: 0.96,
    primera: 0.99,
    intermedia: 1,
    ultima: 1.02,
    atico: 1.08,
  },

  extrasCoefficients: {
    garage: 0.05,
    terrace: 0.04,
    storage: 0.02,
  },

  range: {
    min: 0.93,
    max: 1.07,
  },

  roundTo: 1000,
} as const;