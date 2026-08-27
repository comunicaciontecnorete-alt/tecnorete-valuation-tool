import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import { calculateValuationHybrid } from "@/lib/calculateValuationHybrid";
import type { ValuationInput } from "@/types/valuation";
import { siteConfig } from "@/config/site";
import { getZoneBySlug } from "@/config/zones";

type LeadContactData = {
  name: string;
  phone: string;
  email: string;
  consent: boolean;
  wantsToSell: boolean;
};

type LeadRequestBody = {
  valuation: ValuationInput;
  contact: LeadContactData;
  sourceUrl?: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function yesNo(value: boolean) {
  return value ? "Sí" : "No";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function sendLeadToSheets(payload: unknown) {
  const webhookUrl = process.env.MAKE_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn(
      "MAKE_WEBHOOK_URL no configurada. Se omite el registro en Google Sheets."
    );
    return;
  }

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 5000);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(
        `Make respondió con ${response.status} ${response.statusText}`
      );
    }

    console.log(
      "Lead enviado correctamente a Make / Google Sheets"
    );
  } catch (error) {
    console.error(
      "Error enviando lead a Make / Google Sheets:",
      error
    );
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LeadRequestBody;

    if (!body.valuation) {
      return NextResponse.json(
        {
          ok: false,
          message: "Faltan los datos de valoración.",
        },
        { status: 400 }
      );
    }

    if (!body.contact) {
      return NextResponse.json(
        {
          ok: false,
          message: "Faltan los datos de contacto.",
        },
        { status: 400 }
      );
    }

    const {
      contact,
      valuation: submittedValuation,
      sourceUrl,
    } = body;

    if (typeof submittedValuation.street !== "string") {
      return NextResponse.json(
        {
          ok: false,
          message: "La calle de la vivienda es obligatoria.",
        },
        { status: 400 }
      );
    }

    if (
      typeof submittedValuation.streetNumber !==
      "string"
    ) {
      return NextResponse.json(
        {
          ok: false,
          message: "El número de la vivienda es obligatorio.",
        },
        { status: 400 }
      );
    }

    const street = submittedValuation.street.trim();
    const streetNumber =
      submittedValuation.streetNumber.trim();

    if (!street) {
      return NextResponse.json(
        {
          ok: false,
          message: "La calle de la vivienda es obligatoria.",
        },
        { status: 400 }
      );
    }

    if (!streetNumber) {
      return NextResponse.json(
        {
          ok: false,
          message: "El número de la vivienda es obligatorio.",
        },
        { status: 400 }
      );
    }

    if (street.length > 120) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "La calle no puede superar los 120 caracteres.",
        },
        { status: 400 }
      );
    }

    if (streetNumber.length > 20) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "El número no puede superar los 20 caracteres.",
        },
        { status: 400 }
      );
    }

    const normalizedValuation: ValuationInput = {
      ...submittedValuation,
      street,
      streetNumber,
    };

    const zone =
      typeof normalizedValuation.zoneSlug === "string"
        ? getZoneBySlug(normalizedValuation.zoneSlug)
        : undefined;

    if (!zone) {
      return NextResponse.json(
        {
          ok: false,
          message: "La zona indicada no existe.",
        },
        { status: 400 }
      );
    }

    if (zone.valuationEnabled === false) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Selecciona una subzona concreta para realizar la valoración.",
        },
        { status: 400 }
      );
    }

    if (
      zone.allowedPropertyTypes &&
      !zone.allowedPropertyTypes.includes(
        normalizedValuation.propertyType
      )
    ) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "El tipo de inmueble no está disponible para la zona seleccionada.",
        },
        { status: 400 }
      );
    }

    if (!contact.name?.trim()) {
      return NextResponse.json(
        {
          ok: false,
          message: "El nombre es obligatorio.",
        },
        { status: 400 }
      );
    }

    if (!contact.phone?.trim()) {
      return NextResponse.json(
        {
          ok: false,
          message: "El teléfono es obligatorio.",
        },
        { status: 400 }
      );
    }

    if (!contact.email?.trim()) {
      return NextResponse.json(
        {
          ok: false,
          message: "El email es obligatorio.",
        },
        { status: 400 }
      );
    }

    if (!contact.consent) {
      return NextResponse.json(
        {
          ok: false,
          message: "El consentimiento RGPD es obligatorio.",
        },
        { status: 400 }
      );
    }

   /*
 * SISTEMA HÍBRIDO
 *
 * piso / ático / dúplex
 * → V2 basada en informe dinámico
 *
 * casa / chalet
 * → V2 específica de casas
 */
    const result = calculateValuationHybrid(
      normalizedValuation
    );

    const lead = {
      createdAt: new Date().toISOString(),
      sourceUrl: sourceUrl ?? null,
      priority: contact.wantsToSell,
      contact,
      property: normalizedValuation,
      valuationResult: result,
    };
const isHouse =
  normalizedValuation.propertyType === "casa" ||
  normalizedValuation.propertyType === "chalet";

const demandData =
  result.valuationEngine === "v2-apartment"
    ? {
        demandLabel: result.demandLabel,
        potentialBuyers:
          result.demand.buyers,
        demandBedrooms:
          result.demand.bedrooms,
      }
    : {
        demandLabel: "",
        potentialBuyers: "",
        demandBedrooms: "",
      };

const sheetsLead = {
  createdAt: lead.createdAt,

  priority: contact.wantsToSell
    ? "Sí"
    : "No",

  name: contact.name.trim(),
  phone: contact.phone.trim(),
  email: contact.email.trim(),

  zone: result.zoneName,
  postalCode: result.postalCode,
  street: normalizedValuation.street,
  streetNumber:
    normalizedValuation.streetNumber,

  propertyType:
    normalizedValuation.propertyType,

  houseSubtype: isHouse
    ? normalizedValuation.houseSubtype ??
      "unknown"
    : "",

  squareMeters:
    normalizedValuation.squareMeters,

  bedrooms: normalizedValuation.bedrooms,
  bathrooms: normalizedValuation.bathrooms,

  condition: normalizedValuation.condition,

  constructionPeriod:
    normalizedValuation.constructionPeriod,

  floor: isHouse
    ? ""
    : normalizedValuation.floor,

  hasElevator: isHouse
    ? ""
    : yesNo(
        normalizedValuation.hasElevator
      ),

  garage: yesNo(
    normalizedValuation.extras.garage
  ),

  terrace: yesNo(
    normalizedValuation.extras.terrace
  ),

  storage: yesNo(
    normalizedValuation.extras.storage
  ),

  minPrice: result.minPrice,
  maxPrice: result.maxPrice,

  valuationEngine:
    result.valuationEngine,

  ...demandData,

  sourceUrl: sourceUrl ?? "",

  consent: yesNo(
    contact.consent
  ),
};

    console.log("NUEVO LEAD TECNORETE TOLEDO");

    const resendApiKey = process.env.RESEND_API_KEY;
    const leadEmailTo = process.env.LEAD_EMAIL_TO;
    const leadEmailFrom = process.env.LEAD_EMAIL_FROM;

    if (!resendApiKey || !leadEmailTo || !leadEmailFrom) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Faltan variables de entorno para enviar el email. Revisa RESEND_API_KEY, LEAD_EMAIL_TO y LEAD_EMAIL_FROM.",
        },
        { status: 500 }
      );
    }

    const resend = new Resend(resendApiKey);

    const subject = contact.wantsToSell
      ? `URGENTE - Lead quiere vender vivienda en ${result.zoneName}`
      : `Nuevo lead de valoración - ${result.zoneName}`;

    const demandHtml =
      result.valuationEngine === "v2-apartment"
        ? `
          <h2>Demanda del segmento</h2>

          <p>
            <strong>Nivel de demanda:</strong>
            ${result.demandLabel}
          </p>

          <p>
            <strong>Compradores potenciales del segmento:</strong>
            ${result.demand.buyers}
          </p>

          <p>
            <strong>Peso sobre la demanda total de pisos:</strong>
            ${formatPercent(
              result.demand.shareOfApartmentDemand
            )}
          </p>

          <p>
            <strong>Dormitorios utilizados para el análisis:</strong>
            ${result.demand.bedrooms}
          </p>

          <p>
            <strong>Segmento de precio:</strong>
            ${result.demand.priceRange}
          </p>

          <p style="font-size:12px;color:#64748b;">
            Este indicador procede de la demanda registrada
            en el informe de mercado y no modifica directamente
            el precio de valoración.
          </p>
        `
        : `
          <h2>Demanda del segmento</h2>

          <p>
            No se muestra indicador de demanda para casas o chalets,
            ya que el informe actual no proporciona una matriz
            equivalente a la disponible para pisos.
          </p>
        `;

    const valuationEngineHtml =
  result.valuationEngine === "v2-apartment"
    ? `
      <p>
        <strong>Motor de valoración:</strong>
        Mercado dinámico de pisos
      </p>
    `
    : `
      <p>
        <strong>Motor de valoración:</strong>
        Mercado dinámico de casas
      </p>
    `;

const houseSubtypeLabel =
  normalizedValuation.houseSubtype === "attached"
    ? "Adosada"
    : normalizedValuation.houseSubtype === "detached"
      ? "Independiente"
      : normalizedValuation.houseSubtype === "semiDetached"
        ? "Pareada"
        : normalizedValuation.houseSubtype === "singleFamily"
          ? "Unifamiliar"
          : normalizedValuation.houseSubtype === "unknown"
            ? "No especificado"
            : null;

    const escapedStreet = escapeHtml(
      normalizedValuation.street
    );
    const escapedStreetNumber = escapeHtml(
      normalizedValuation.streetNumber
    );
    const escapedContactName = escapeHtml(contact.name);
    const escapedContactPhone = escapeHtml(contact.phone);
    const escapedContactEmail = escapeHtml(contact.email);
    const escapedSourceUrl = escapeHtml(
      sourceUrl ?? "No disponible"
    );

    const html = `
      <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.5;">

        <h1 style="color: #033b79;">
          Nuevo lead de valoración - ${siteConfig.name}
        </h1>

        ${
          contact.wantsToSell
            ? `
              <p style="
                display:inline-block;
                background:#ec8a36;
                color:#ffffff;
                padding:8px 12px;
                border-radius:999px;
                font-weight:bold;
              ">
                LEAD PRIORITARIO: quiere que le contacten para vender
              </p>
            `
            : ""
        }

        <h2>Datos de contacto</h2>

        <p>
          <strong>Nombre:</strong>
          ${escapedContactName}
        </p>

        <p>
          <strong>Teléfono:</strong>
          ${escapedContactPhone}
        </p>

        <p>
          <strong>Email:</strong>
          ${escapedContactEmail}
        </p>

        <p>
          <strong>Consentimiento RGPD:</strong>
          ${yesNo(contact.consent)}
        </p>

        <p>
          <strong>Quiere vender:</strong>
          ${yesNo(contact.wantsToSell)}
        </p>


        <h2>Datos del inmueble</h2>

        <p>
          <strong>Zona:</strong>
          ${result.zoneName} - CP ${result.postalCode}
        </p>

        <p>
          <strong>Calle:</strong>
          ${escapedStreet}
        </p>

        <p>
          <strong>Número:</strong>
          ${escapedStreetNumber}
        </p>

        <p>
          <strong>Tipo:</strong>
          ${normalizedValuation.propertyType}
        </p>
        ${
  houseSubtypeLabel
    ? `
      <p>
        <strong>Subtipo de casa:</strong>
        ${houseSubtypeLabel}
      </p>
    `
    : ""
}

        <p>
          <strong>Metros:</strong>
          ${normalizedValuation.squareMeters} m²
        </p>

        <p>
          <strong>Habitaciones:</strong>
          ${normalizedValuation.bedrooms}
        </p>

        <p>
          <strong>Baños:</strong>
          ${normalizedValuation.bathrooms}
        </p>

        ${
  normalizedValuation.propertyType === "piso" ||
  normalizedValuation.propertyType === "atico" ||
  normalizedValuation.propertyType === "duplex"
    ? `
      <p>
        <strong>Planta:</strong>
        ${normalizedValuation.floor}
      </p>

      <p>
        <strong>Ascensor:</strong>
        ${yesNo(normalizedValuation.hasElevator)}
      </p>
    `
    : ""
}

        <p>
          <strong>Estado:</strong>
          ${normalizedValuation.condition}
        </p>

        <p>
          <strong>Año/tramo:</strong>
          ${normalizedValuation.constructionPeriod}
        </p>

        <p>
          <strong>Garaje:</strong>
          ${yesNo(normalizedValuation.extras.garage)}
        </p>

        <p>
          <strong>Terraza:</strong>
          ${yesNo(normalizedValuation.extras.terrace)}
        </p>

        <p>
          <strong>Trastero:</strong>
          ${yesNo(normalizedValuation.extras.storage)}
        </p>


        <h2>Estimación orientativa</h2>

        <p style="
          font-size:22px;
          font-weight:bold;
          color:#033b79;
        ">
          ${formatCurrency(result.minPrice)}
          -
          ${formatCurrency(result.maxPrice)}
        </p>

        <p>
          <strong>Valor base:</strong>
          ${formatCurrency(result.basePrice)}
        </p>

        <p>
          <strong>Valor ajustado:</strong>
          ${formatCurrency(result.adjustedPrice)}
        </p>

        ${valuationEngineHtml}

        ${demandHtml}


        <h2>Origen</h2>

        <p>
          <strong>URL:</strong>
          ${escapedSourceUrl}
        </p>

        <p>
          <strong>Fecha:</strong>
          ${new Date().toLocaleString("es-ES")}
        </p>

        <hr
          style="
            border:0;
            border-top:1px solid #e2e8f0;
            margin:24px 0;
          "
        />

        <p style="font-size:12px;color:#64748b;">
          ${siteConfig.legal.resultDisclaimer}
        </p>

      </div>
    `;

    const emailRecipients = leadEmailTo
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);

    const emailPromise =
  resend.emails.send({
    from: leadEmailFrom,
    to: emailRecipients,
    subject,
    html,
    replyTo: contact.email,
  });

const sheetsPromise =
  sendLeadToSheets(sheetsLead);

const [
  { error },
] = await Promise.all([
  emailPromise,
  sheetsPromise,
]);

    if (error) {
      console.error(
        "Error enviando email con Resend:",
        error
      );

      return NextResponse.json(
        {
          ok: false,
          message:
            "El lead se ha recibido, pero no se ha podido enviar el email.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message:
        "Lead recibido y email enviado correctamente.",
      result,
    });
  } catch (error) {
    console.error(
      "Error procesando lead:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        message:
          "No se ha podido procesar el lead.",
      },
      { status: 500 }
    );
  }
}
