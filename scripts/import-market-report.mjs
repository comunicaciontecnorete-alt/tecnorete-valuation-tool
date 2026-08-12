import { readFile, writeFile, mkdir } from "node:fs/promises";
import { PDFParse } from "pdf-parse";

const pdfPath = new URL("../data/market-report/current.pdf", import.meta.url);
const textPath = new URL("../data/market-report/current.txt", import.meta.url);
const jsonPath = new URL("../src/data/market-data.json", import.meta.url);

function cleanInteger(value) {
  if (!value) {
    throw new Error("Se ha intentado convertir un valor vacío.");
  }

  // El informe puede devolver:
  // 120.519 €
  // 120,519 €
  // 1.816 €
  // 1,816 €
  //
  // Para estos campos monetarios siempre trabajamos con enteros.
  return Number(value.replace(/[^\d]/g, ""));
}

function cleanPercent(value) {
  if (!value) {
    throw new Error("Se ha intentado convertir un porcentaje vacío.");
  }

  return Number(
    value
      .replace("%", "")
      .replace(",", ".")
      .trim()
  );
}

function getSection(text, heading, nextHeading) {
  const start = text.indexOf(heading);

  if (start === -1) {
    throw new Error(`No se ha encontrado la sección: ${heading}`);
  }

  if (!nextHeading) {
    return text.slice(start);
  }

  const end = text.indexOf(nextHeading, start + heading.length);

  if (end === -1) {
    return text.slice(start);
  }

  return text.slice(start, end);
}

function extractPeriod(text) {
  const match = text.match(
    /(\d{2}\/\d{2}\/\d{4})\s+(\d{2}\/\d{2}\/\d{4})\s+Desde el:/i
  );

  if (!match) {
    throw new Error("No se ha podido extraer el periodo del informe.");
  }

  return {
    from: match[1],
    to: match[2],
  };
}

function extractApartmentSummary(text) {
  const heading =
    "RESUMEN DE PRECIOS POR TIPOLOGÍA DE VIVIENDA - PISOS";

  const headingIndex = text.indexOf(heading);

  if (headingIndex === -1) {
    throw new Error(
      "No se ha encontrado el resumen de precios de pisos."
    );
  }

  // Power BI coloca los valores principales justo ANTES del título.
  // Tomamos una pequeña ventana anterior al encabezado.
  const context = text.slice(
    Math.max(0, headingIndex - 300),
    headingIndex
  );

  const match = context.match(
    /Piso\s+([\d.,]+)\s*€\s+([\d.,]+)\s*€\s+Útil\s+Construido\s+([\d.,]+)\s*€/i
  );

  if (!match) {
    throw new Error(
      "No se ha podido extraer el resumen principal de precios de pisos."
    );
  }

  return {
    pricePerUsefulSqm: cleanInteger(match[1]),
    pricePerBuiltSqm: cleanInteger(match[2]),
    averageSalePrice: cleanInteger(match[3]),
  };
}
function extractApartmentDetails(text) {
  const section = getSection(
    text,
    "RESUMEN DE PRECIOS POR TIPOLOGÍA DE VIVIENDA - PISOS",
    "RANGO DE PRECIOS MÁS HABITUALES EN LA ZONA - PISOS"
  );

  const values = [
    ...section.matchAll(/([\d.,]+)\s*€/g),
  ].map((match) => cleanInteger(match[1]));

  /*
    El orden que devuelve actualmente Power BI es:

    0  115630  precio 1 dormitorio
    1  107965  precio 2 dormitorios
    2  136599  precio 3 dormitorios
    3  116667  precio 4 dormitorios

    4  115735  precio <40 años
    5  122342  precio >40 años
    6  155087  precio con ascensor
    7  104964  precio sin ascensor

    8  2112    €/m² útil con ascensor
    9  1682    €/m² útil sin ascensor

    10 2269    €/m² útil 1 dormitorio
    11 1963    €/m² útil 2 dormitorios
    12 1700    €/m² útil 3 dormitorios
    13 1196    €/m² útil 4 dormitorios

    14 1665    €/m² útil <40 años
    15 1873    €/m² útil >40 años

    16 1831    €/m² construido con ascensor
    17 1464    €/m² construido sin ascensor

    18 1794    €/m² construido 1 dormitorio
    19 1750    €/m² construido 2 dormitorios
    20 1486    €/m² construido 3 dormitorios
    21 1013    €/m² construido 4 dormitorios

    22 1418    €/m² construido <40 años
    23 1639    €/m² construido >40 años
  */

  if (values.length < 24) {
    throw new Error(
      `Datos de pisos incompletos. Se esperaban al menos 24 valores y se han encontrado ${values.length}.`
    );
  }

  return {
    elevator: {
      yes: {
        averageSalePrice: values[6],
        pricePerUsefulSqm: values[8],
        pricePerBuiltSqm: values[16],
      },
      no: {
        averageSalePrice: values[7],
        pricePerUsefulSqm: values[9],
        pricePerBuiltSqm: values[17],
      },
    },

    bedrooms: {
      1: {
        averageSalePrice: values[0],
        pricePerUsefulSqm: values[10],
        pricePerBuiltSqm: values[18],
      },
      2: {
        averageSalePrice: values[1],
        pricePerUsefulSqm: values[11],
        pricePerBuiltSqm: values[19],
      },
      3: {
        averageSalePrice: values[2],
        pricePerUsefulSqm: values[12],
        pricePerBuiltSqm: values[20],
      },
      4: {
        averageSalePrice: values[3],
        pricePerUsefulSqm: values[13],
        pricePerBuiltSqm: values[21],
      },
    },

    age: {
      under40Years: {
        averageSalePrice: values[4],
        pricePerUsefulSqm: values[14],
        pricePerBuiltSqm: values[22],
      },
      over40Years: {
        averageSalePrice: values[5],
        pricePerUsefulSqm: values[15],
        pricePerBuiltSqm: values[23],
      },
    },
  };
}

function extractApartmentRange(text) {
  const section = getSection(
    text,
    "RANGO DE PRECIOS MÁS HABITUALES EN LA ZONA - PISOS",
    "PRECIO POR TIPOLOGÍAS DE PISOS"
  );

  const values = [
    ...section.matchAll(/([\d.,]+)\s*€/g),
  ].map((match) => cleanInteger(match[1]));

  /*
    Power BI devuelve actualmente este orden:

    0 → promedio €/m² útil
    1 → precio inferior habitual
    2 → €/m² útil inferior
    3 → €/m² útil superior
    4 → precio superior habitual
    5 → precio medio de la zona

    Los números pueden cambiar en futuros informes,
    pero la estructura puede mantenerse.
  */

  if (values.length < 6) {
    throw new Error(
      `Rango de pisos incompleto. Se esperaban al menos 6 valores y se han encontrado ${values.length}.`
    );
  }

  return {
    usualRange: {
      averagePricePerUsefulSqm: values[0],
      salePriceMin: values[1],
      pricePerUsefulSqmMin: values[2],
      pricePerUsefulSqmMax: values[3],
      salePriceMax: values[4],
      averageSalePrice: values[5],
    },
  };
}

function extractHouseSummary(text) {
  const heading =
    "RESUMEN DE PRECIOS POR TIPOLOGÍA DE VIVIENDA - CASAS";

  const headingIndex = text.indexOf(heading);

  if (headingIndex === -1) {
    throw new Error(
      "No se ha encontrado el resumen de precios de casas."
    );
  }

  const context = text.slice(
    Math.max(0, headingIndex - 300),
    headingIndex
  );

  const match = context.match(
    /Casa\s+([\d.,]+)\s*€\s+([\d.,]+)\s*€\s+Útil\s+Construido\s+([\d.,]+)\s*€/i
  );

  if (!match) {
    throw new Error(
      "No se ha podido extraer el resumen principal de precios de casas."
    );
  }

  return {
    pricePerUsefulSqm: cleanInteger(match[1]),
    pricePerBuiltSqm: cleanInteger(match[2]),
    averageSalePrice: cleanInteger(match[3]),
  };
}
function extractHouseDetails(text) {
  const section = getSection(
    text,
    "RESUMEN DE PRECIOS POR TIPOLOGÍA DE VIVIENDA - CASAS",
    "RANGO DE PRECIOS MÁS HABITUALES EN LA ZONA - CASAS"
  );

const values = [
  ...section.matchAll(/^\s*([\d.,]+)\s*€?\s*$/gm),
].map((match) => cleanInteger(match[1]));

  /*
    Orden actual de Power BI:

    ANTIGÜEDAD
    0  128354  precio <40 años
    1   68666  precio >40 años
    2     839  €/m² útil <40 años
    3     677  €/m² útil >40 años
    4     740  €/m² construido <40 años
    5     579  €/m² construido >40 años

    PRECIOS
    6   33950  <70 m²
    7   92931  >70 m²

    8   77218  adosada
    9   90180  independiente
    10 120538  pareada
    11  50950  unifamiliar

    12  94900  reforma reciente
    13 115299  reformado
    14  88079  para entrar a vivir
    15  88468  a reformar

    €/M² ÚTIL
    16 548
    17 746

    18 615
    19 744
    20 996
    21 477

    22 703
    23 1100
    24 604
    25 526

    €/M² CONSTRUIDO
    26 494
    27 644

    28 578
    29 638
    30 828
    31 370

    32 703
    33 986
    34 513
    35 420
  */

  if (values.length < 36) {
    throw new Error(
      `Datos de casas incompletos. Se esperaban al menos 36 valores y se han encontrado ${values.length}.`
    );
  }

  return {
    size: {
      under70Sqm: {
        averageSalePrice: values[6],
        pricePerUsefulSqm: values[16],
        pricePerBuiltSqm: values[26],
      },
      over70Sqm: {
        averageSalePrice: values[7],
        pricePerUsefulSqm: values[17],
        pricePerBuiltSqm: values[27],
      },
    },

    subtypes: {
      attached: {
        averageSalePrice: values[8],
        pricePerUsefulSqm: values[18],
        pricePerBuiltSqm: values[28],
      },
      detached: {
        averageSalePrice: values[9],
        pricePerUsefulSqm: values[19],
        pricePerBuiltSqm: values[29],
      },
      semiDetached: {
        averageSalePrice: values[10],
        pricePerUsefulSqm: values[20],
        pricePerBuiltSqm: values[30],
      },
      singleFamily: {
        averageSalePrice: values[11],
        pricePerUsefulSqm: values[21],
        pricePerBuiltSqm: values[31],
      },
    },

    condition: {
      recentlyRenovated: {
        averageSalePrice: values[12],
        pricePerUsefulSqm: values[22],
        pricePerBuiltSqm: values[32],
      },
      renovated: {
        averageSalePrice: values[13],
        pricePerUsefulSqm: values[23],
        pricePerBuiltSqm: values[33],
      },
      moveInReady: {
        averageSalePrice: values[14],
        pricePerUsefulSqm: values[24],
        pricePerBuiltSqm: values[34],
      },
      needsRenovation: {
        averageSalePrice: values[15],
        pricePerUsefulSqm: values[25],
        pricePerBuiltSqm: values[35],
      },
    },

    age: {
      under40Years: {
        averageSalePrice: values[0],
        pricePerUsefulSqm: values[2],
        pricePerBuiltSqm: values[4],
      },
      over40Years: {
        averageSalePrice: values[1],
        pricePerUsefulSqm: values[3],
        pricePerBuiltSqm: values[5],
      },
    },
  };
}

function extractHouseRange(text) {
  const section = getSection(
    text,
    "RANGO DE PRECIOS MÁS HABITUALES EN LA ZONA - CASAS",
    "METODOLOGÍA DEL INFORME"
  );

  const values = [
    ...section.matchAll(/([\d.,]+)\s*€/g),
  ].map((match) => cleanInteger(match[1]));

  /*
    Orden actual:

    0 → promedio €/m²
    1 → precio inferior habitual
    2 → €/m² inferior
    3 → €/m² superior
    4 → precio superior habitual
    5 → precio medio de venta
  */

  if (values.length < 6) {
    throw new Error(
      `Rango de casas incompleto. Se esperaban al menos 6 valores y se han encontrado ${values.length}.`
    );
  }

  return {
    usualRange: {
      averagePricePerUsefulSqm: values[0],
      salePriceMin: values[1],
      pricePerUsefulSqmMin: values[2],
      pricePerUsefulSqmMax: values[3],
      salePriceMax: values[4],
      averageSalePrice: values[5],
    },
  };
}
function extractDemand(text) {
  const clientsSection = getSection(
    text,
    "NUESTROS CLIENTES - SOLICITUDES DE COMPRA Y PRECIO OFERTADO",
    "NÚMERO DE SOLICITUDES DE COMPRA SEGÚN PRECIO POR HABITACIONES"
  );

  const totalBuyersMatch = clientsSection.match(
    /Total de compradores\s+([\d.,]+)/i
  );

  if (!totalBuyersMatch) {
    throw new Error(
      "No se ha podido extraer el número total de compradores."
    );
  }

  const totalBuyers = cleanInteger(totalBuyersMatch[1]);

  const section = getSection(
    text,
    "NÚMERO DE SOLICITUDES DE COMPRA SEGÚN PRECIO POR HABITACIONES",
    "PERFIL DEL COMPRADOR"
  );

  const apartmentTotalMatch = section.match(
    /Número de potenciales\s+compradores de pisos en\s+esta oficina\s+([\d.,]+)/i
  );

  if (!apartmentTotalMatch) {
    throw new Error(
      "No se ha podido extraer el total de compradores potenciales de pisos."
    );
  }

  const totalApartmentBuyers = cleanInteger(
    apartmentTotalMatch[1]
  );

  /*
    Power BI no devuelve la tabla en el mismo orden visual.

    Actualmente pdf-parse devuelve:

    341 279 10 147
    161 340 169 5
    4 32 10 (En blanco)
    5 2 7 1
    36 521 871 215
    267 885 1.202 222

    Después aparecen varios totales y finalmente:

    633 1.917 2.726 456

    La correspondencia real es:

    0 -> 0 - 100.000 €
    1 -> 200.000 - 300.000 €
    2 -> 300.000 - 400.000 €
    3 -> Más de 400.000 €
    4 -> 150.000 - 200.000 €
    5 -> 100.000 - 150.000 €

    Además, en las cuatro primeras filas el orden de columnas es:

    2 dormitorios
    3 dormitorios
    4 dormitorios
    1 dormitorio

    En las dos últimas es:

    1 dormitorio
    2 dormitorios
    3 dormitorios
    4 dormitorios

    Por eso la extracción debe tratar expresamente
    el orden generado por Power BI.
  */

  const matrixPart = section.split(
    "Número de potenciales"
  )[0];

  function parseMatrixLine(line) {
    const normalized = line.replace(
      /\(En blan[^\r\n]*/i,
      "0"
    );

    const matches = normalized.match(/\d[\d.]*/g);

    if (!matches) {
      return [];
    }

    return matches.map((value) => cleanInteger(value));
  }

  const fourValueLines = matrixPart
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parseMatrixLine)
    .filter((values) => values.length === 4);

  /*
    Esperamos exactamente:

    6 filas de la matriz
    +
    1 fila de totales por dormitorios
  */

  if (fourValueLines.length !== 7) {
    throw new Error(
      `Estructura de demanda inesperada. Se esperaban 7 filas de cuatro valores y se han encontrado ${fourValueLines.length}.`
    );
  }

  const [
    rawUpTo100000,
    raw200000To300000,
    raw300000To400000,
    rawOver400000,
    raw150000To200000,
    raw100000To150000,
    rawBedroomTotals,
  ] = fourValueLines;

  function reorderedPowerBiRow(values) {
    const [bedroom2, bedroom3, bedroom4, bedroom1] =
      values;

    return {
      1: bedroom1,
      2: bedroom2,
      3: bedroom3,
      4: bedroom4,
    };
  }

  function naturalRow(values) {
    const [bedroom1, bedroom2, bedroom3, bedroom4] =
      values;

    return {
      1: bedroom1,
      2: bedroom2,
      3: bedroom3,
      4: bedroom4,
    };
  }

  const priceRanges = {
    upTo100000: reorderedPowerBiRow(rawUpTo100000),

    from100000To150000: naturalRow(
      raw100000To150000
    ),

    from150000To200000: naturalRow(
      raw150000To200000
    ),

    from200000To300000: reorderedPowerBiRow(
      raw200000To300000
    ),

    from300000To400000: reorderedPowerBiRow(
      raw300000To400000
    ),

    over400000: reorderedPowerBiRow(
      rawOver400000
    ),
  };

  /*
    Power BI devuelve los totales finales actualmente como:

    633 1917 2726 456

    que corresponden a:

    4 dormitorios
    2 dormitorios
    3 dormitorios
    1 dormitorio
  */

  const [
    totalBedroom4,
    totalBedroom2,
    totalBedroom3,
    totalBedroom1,
  ] = rawBedroomTotals;

  const sourceBedroomTotals = {
    1: totalBedroom1,
    2: totalBedroom2,
    3: totalBedroom3,
    4: totalBedroom4,
  };

  function sumRow(row) {
    return row[1] + row[2] + row[3] + row[4];
  }

  const rangeTotals = {
    upTo100000: sumRow(priceRanges.upTo100000),

    from100000To150000: sumRow(
      priceRanges.from100000To150000
    ),

    from150000To200000: sumRow(
      priceRanges.from150000To200000
    ),

    from200000To300000: sumRow(
      priceRanges.from200000To300000
    ),

    from300000To400000: sumRow(
      priceRanges.from300000To400000
    ),

    over400000: sumRow(
      priceRanges.over400000
    ),
  };

  const calculatedBedroomTotals = {
    1:
      priceRanges.upTo100000[1] +
      priceRanges.from100000To150000[1] +
      priceRanges.from150000To200000[1] +
      priceRanges.from200000To300000[1] +
      priceRanges.from300000To400000[1] +
      priceRanges.over400000[1],

    2:
      priceRanges.upTo100000[2] +
      priceRanges.from100000To150000[2] +
      priceRanges.from150000To200000[2] +
      priceRanges.from200000To300000[2] +
      priceRanges.from300000To400000[2] +
      priceRanges.over400000[2],

    3:
      priceRanges.upTo100000[3] +
      priceRanges.from100000To150000[3] +
      priceRanges.from150000To200000[3] +
      priceRanges.from200000To300000[3] +
      priceRanges.from300000To400000[3] +
      priceRanges.over400000[3],

    4:
      priceRanges.upTo100000[4] +
      priceRanges.from100000To150000[4] +
      priceRanges.from150000To200000[4] +
      priceRanges.from200000To300000[4] +
      priceRanges.from300000To400000[4] +
      priceRanges.over400000[4],
  };

  for (const bedrooms of [1, 2, 3, 4]) {
    if (
      calculatedBedroomTotals[bedrooms] !==
      sourceBedroomTotals[bedrooms]
    ) {
      throw new Error(
        `La demanda de ${bedrooms} dormitorios no cuadra. Calculado: ${calculatedBedroomTotals[bedrooms]}. Informe: ${sourceBedroomTotals[bedrooms]}.`
      );
    }
  }

  const calculatedTotal =
    calculatedBedroomTotals[1] +
    calculatedBedroomTotals[2] +
    calculatedBedroomTotals[3] +
    calculatedBedroomTotals[4];

  if (calculatedTotal !== totalApartmentBuyers) {
    throw new Error(
      `La demanda total de pisos no cuadra. Matriz: ${calculatedTotal}. Informe: ${totalApartmentBuyers}.`
    );
  }

  /*
    Comprobación adicional de cinco totales de fila
    que Power BI sí devuelve de forma coherente.

    Hay seis valores sueltos:

    691
    675
    46
    15
    1643
    2576

    El primer valor (691) es inconsistente con la
    propia matriz y no se utiliza.

    Los otros cinco sí coinciden con sus respectivas
    filas y nos sirven para detectar cambios de orden
    en futuras exportaciones.
  */

  const singleValueLines = matrixPart
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^\d[\d.]*$/.test(line))
    .map((line) => cleanInteger(line));

  if (singleValueLines.length !== 6) {
    throw new Error(
      `Estructura de totales de demanda inesperada. Se esperaban 6 valores y se han encontrado ${singleValueLines.length}.`
    );
  }

  const [
    ignoredFirstSourceTotal,
    source200000To300000,
    source300000To400000,
    sourceOver400000,
    source150000To200000,
    source100000To150000,
  ] = singleValueLines;

  if (
    rangeTotals.from200000To300000 !==
    source200000To300000
  ) {
    throw new Error(
      "El total de demanda entre 200.000 € y 300.000 € no coincide."
    );
  }

  if (
    rangeTotals.from300000To400000 !==
    source300000To400000
  ) {
    throw new Error(
      "El total de demanda entre 300.000 € y 400.000 € no coincide."
    );
  }

  if (
    rangeTotals.over400000 !== sourceOver400000
  ) {
    throw new Error(
      "El total de demanda superior a 400.000 € no coincide."
    );
  }

  if (
    rangeTotals.from150000To200000 !==
    source150000To200000
  ) {
    throw new Error(
      "El total de demanda entre 150.000 € y 200.000 € no coincide."
    );
  }

  if (
    rangeTotals.from100000To150000 !==
    source100000To150000
  ) {
    throw new Error(
      "El total de demanda entre 100.000 € y 150.000 € no coincide."
    );
  }

  return {
    totalBuyers,

    apartments: {
      totalPotentialBuyers: totalApartmentBuyers,

      byBedrooms: calculatedBedroomTotals,

      byPriceRange: {
        upTo100000: {
          ...priceRanges.upTo100000,
          total: rangeTotals.upTo100000,
        },

        from100000To150000: {
          ...priceRanges.from100000To150000,
          total: rangeTotals.from100000To150000,
        },

        from150000To200000: {
          ...priceRanges.from150000To200000,
          total: rangeTotals.from150000To200000,
        },

        from200000To300000: {
          ...priceRanges.from200000To300000,
          total: rangeTotals.from200000To300000,
        },

        from300000To400000: {
          ...priceRanges.from300000To400000,
          total: rangeTotals.from300000To400000,
        },

        over400000: {
          ...priceRanges.over400000,
          total: rangeTotals.over400000,
        },
      },
    },
  };
}
function extractNegotiation(text) {
  const section = getSection(
    text,
    "NEGOCIACIÓN DEL PRECIO INICIAL EN LA ZONA - VIVIENDAS",
    "OFERTA DE INMUEBLES A LA VENTA"
  );

  const match = section.match(/(\d+(?:[.,]\d+)?)\s*%/g);

  if (!match || match.length === 0) {
    throw new Error(
      "No se ha podido extraer el porcentaje de negociación."
    );
  }

  const percentages = match.map(cleanPercent);

  // En esta sección aparecen 0%, 9% y 74%.
  // El dato que buscamos como negociación media es 9%.
  const averageNegotiation = percentages.find(
    (value) => value > 0 && value < 50
  );

  if (averageNegotiation === undefined) {
    throw new Error(
      "No se ha podido identificar la negociación media."
    );
  }

  return {
    averageDiscountPercent: averageNegotiation,
  };
}

function extractSellerOvervaluation(text) {
  const section = getSection(
    text,
    "OFERTA DE INMUEBLES A LA VENTA",
    "CASAS"
  );

  const match = section.match(
    /% de sobrevaloración\s+(\d+(?:[.,]\d+)?)/i
  );

  if (!match) {
    throw new Error(
      "No se ha podido extraer el porcentaje de sobrevaloración."
    );
  }

  return {
    overvaluationPercent: cleanPercent(match[1]),
  };
}

async function main() {
  console.log("Leyendo informe de mercado...");

  const buffer = await readFile(pdfPath);
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();
    const text = result.text;

    if (!text.includes("Toledo")) {
      throw new Error(
        "El PDF no parece corresponder al informe de mercado de Toledo."
      );
    }

    if (!text.includes("PISOS")) {
      throw new Error("No se ha localizado la sección de pisos.");
    }

    if (!text.includes("CASAS")) {
      throw new Error("No se ha localizado la sección de casas.");
    }

    await writeFile(textPath, text, "utf8");

    const period = extractPeriod(text);

const apartmentSummary = extractApartmentSummary(text);
const apartmentDetails = extractApartmentDetails(text);
const apartmentRange = extractApartmentRange(text);

const apartments = {
  ...apartmentSummary,
  ...apartmentDetails,
  ...apartmentRange,
};

const houseSummary = extractHouseSummary(text);
const houseDetails = extractHouseDetails(text);
const houseRange = extractHouseRange(text);

const houses = {
  ...houseSummary,
  ...houseDetails,
  ...houseRange,
};

const demand = extractDemand(text);

const negotiation = extractNegotiation(text);
const sellerMarket = extractSellerOvervaluation(text);

const marketData = {
  source: {
    report: "Informe del mercado de la vivienda - compraventas",
    organization: "DAI - Grupo Tecnocasa",
    location: "Toledo",
    period,
    importedAt: new Date().toISOString(),
  },

  apartments,

  houses,

  demand,

  market: {
    ...negotiation,
    ...sellerMarket,
  },
};

    await mkdir(new URL("../src/data/", import.meta.url), {
      recursive: true,
    });

    await writeFile(
      jsonPath,
      JSON.stringify(marketData, null, 2),
      "utf8"
    );

    console.log("");
    console.log("✓ PDF leído correctamente");
    console.log("✓ Informe de Toledo detectado");
    console.log(`✓ Periodo: ${period.from} → ${period.to}`);

    console.log("");
    console.log("PISOS");
    console.log(`✓ Precio medio: ${apartments.averageSalePrice} €`);
    console.log(`✓ €/m² útil: ${apartments.pricePerUsefulSqm} €`);
    console.log(`✓ €/m² construido: ${apartments.pricePerBuiltSqm} €`);
    console.log("");
console.log("PISOS - ASCENSOR");
console.log(
  `✓ Con ascensor: ${apartments.elevator.yes.pricePerBuiltSqm} €/m² construido`
);
console.log(
  `✓ Sin ascensor: ${apartments.elevator.no.pricePerBuiltSqm} €/m² construido`
);

console.log("");
console.log("PISOS - DORMITORIOS");
console.log(
  `✓ 1 dormitorio: ${apartments.bedrooms[1].pricePerBuiltSqm} €/m² construido`
);
console.log(
  `✓ 2 dormitorios: ${apartments.bedrooms[2].pricePerBuiltSqm} €/m² construido`
);
console.log(
  `✓ 3 dormitorios: ${apartments.bedrooms[3].pricePerBuiltSqm} €/m² construido`
);
console.log(
  `✓ 4 dormitorios: ${apartments.bedrooms[4].pricePerBuiltSqm} €/m² construido`
);

console.log("");
console.log("PISOS - RANGO HABITUAL");
console.log(
  `✓ Precio: ${apartments.usualRange.salePriceMin} € → ${apartments.usualRange.salePriceMax} €`
);
console.log(
  `✓ €/m² útil: ${apartments.usualRange.pricePerUsefulSqmMin} € → ${apartments.usualRange.pricePerUsefulSqmMax} €`
);

    console.log("");
    console.log("CASAS");
    console.log(`✓ Precio medio: ${houses.averageSalePrice} €`);
    console.log(`✓ €/m² útil: ${houses.pricePerUsefulSqm} €`);
    console.log(`✓ €/m² construido: ${houses.pricePerBuiltSqm} €`);
    console.log("");
console.log("CASAS - TIPOLOGÍA");
console.log(
  `✓ Adosada: ${houses.subtypes.attached.pricePerBuiltSqm} €/m² construido`
);
console.log(
  `✓ Independiente: ${houses.subtypes.detached.pricePerBuiltSqm} €/m² construido`
);
console.log(
  `✓ Pareada: ${houses.subtypes.semiDetached.pricePerBuiltSqm} €/m² construido`
);
console.log(
  `✓ Unifamiliar: ${houses.subtypes.singleFamily.pricePerBuiltSqm} €/m² construido`
);

console.log("");
console.log("CASAS - ESTADO");
console.log(
  `✓ Reforma reciente: ${houses.condition.recentlyRenovated.pricePerBuiltSqm} €/m² construido`
);
console.log(
  `✓ Reformado: ${houses.condition.renovated.pricePerBuiltSqm} €/m² construido`
);
console.log(
  `✓ Para entrar a vivir: ${houses.condition.moveInReady.pricePerBuiltSqm} €/m² construido`
);
console.log(
  `✓ A reformar: ${houses.condition.needsRenovation.pricePerBuiltSqm} €/m² construido`
);

console.log("");
console.log("CASAS - TAMAÑO");
console.log(
  `✓ Menos de 70 m²: ${houses.size.under70Sqm.pricePerBuiltSqm} €/m² construido`
);
console.log(
  `✓ Más de 70 m²: ${houses.size.over70Sqm.pricePerBuiltSqm} €/m² construido`
);

console.log("");
console.log("CASAS - RANGO HABITUAL");
console.log(
  `✓ Precio: ${houses.usualRange.salePriceMin} € → ${houses.usualRange.salePriceMax} €`
);
console.log(
  `✓ €/m² útil: ${houses.usualRange.pricePerUsefulSqmMin} € → ${houses.usualRange.pricePerUsefulSqmMax} €`
);
console.log("");
console.log("DEMANDA");

console.log(
  `✓ Total compradores: ${demand.totalBuyers}`
);

console.log(
  `✓ Potenciales compradores de pisos: ${demand.apartments.totalPotentialBuyers}`
);

console.log("");
console.log("DEMANDA - PISOS POR PRECIO");

console.log(
  `✓ Hasta 100.000 €: ${demand.apartments.byPriceRange.upTo100000.total}`
);

console.log(
  `✓ 100.000 € - 150.000 €: ${demand.apartments.byPriceRange.from100000To150000.total}`
);

console.log(
  `✓ 150.000 € - 200.000 €: ${demand.apartments.byPriceRange.from150000To200000.total}`
);

console.log(
  `✓ 200.000 € - 300.000 €: ${demand.apartments.byPriceRange.from200000To300000.total}`
);

console.log(
  `✓ 300.000 € - 400.000 €: ${demand.apartments.byPriceRange.from300000To400000.total}`
);

console.log(
  `✓ Más de 400.000 €: ${demand.apartments.byPriceRange.over400000.total}`
);

console.log("");
console.log("DEMANDA - PISOS POR DORMITORIOS");

console.log(
  `✓ 1 dormitorio: ${demand.apartments.byBedrooms[1]}`
);

console.log(
  `✓ 2 dormitorios: ${demand.apartments.byBedrooms[2]}`
);

console.log(
  `✓ 3 dormitorios: ${demand.apartments.byBedrooms[3]}`
);

console.log(
  `✓ 4 dormitorios: ${demand.apartments.byBedrooms[4]}`
);
    console.log("");
    console.log("MERCADO");
    console.log(
      `✓ Negociación media: ${negotiation.averageDiscountPercent}%`
    );
    console.log(
      `✓ Sobrevaloración media: ${sellerMarket.overvaluationPercent}%`
    );

    console.log("");
    console.log("✓ src/data/market-data.json generado correctamente");
  } finally {
    await parser.destroy();
  }
}

main().catch((error) => {
  console.error("");
  console.error("ERROR AL IMPORTAR EL INFORME");
  console.error(error.message);
  console.error("");
  console.error(
    "market-data.json no debe utilizarse hasta corregir este error."
  );
  process.exit(1);
});