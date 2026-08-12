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
    const apartments = extractApartmentSummary(text);
    const houses = extractHouseSummary(text);
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
    console.log("CASAS");
    console.log(`✓ Precio medio: ${houses.averageSalePrice} €`);
    console.log(`✓ €/m² útil: ${houses.pricePerUsefulSqm} €`);
    console.log(`✓ €/m² construido: ${houses.pricePerBuiltSqm} €`);

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