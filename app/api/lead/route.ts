import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import { calculateValuationHybrid } from "@/lib/calculateValuationHybrid";
import type { ValuationInput } from "@/types/valuation";
import { siteConfig } from "@/config/site";

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

    const { contact, valuation, sourceUrl } = body;

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
     * → V1 protegida temporalmente
     */
    const result = calculateValuationHybrid(valuation);

    const lead = {
      createdAt: new Date().toISOString(),
      sourceUrl: sourceUrl ?? null,
      priority: contact.wantsToSell,
      contact,
      property: valuation,
      valuationResult: result,
    };

    console.log("NUEVO LEAD TECNORETE TOLEDO");
    console.log(JSON.stringify(lead, null, 2));

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
            Modelo provisional de casas
          </p>
        `;

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
          ${contact.name}
        </p>

        <p>
          <strong>Teléfono:</strong>
          ${contact.phone}
        </p>

        <p>
          <strong>Email:</strong>
          ${contact.email}
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
          <strong>Tipo:</strong>
          ${valuation.propertyType}
        </p>

        <p>
          <strong>Metros:</strong>
          ${valuation.squareMeters} m²
        </p>

        <p>
          <strong>Habitaciones:</strong>
          ${valuation.bedrooms}
        </p>

        <p>
          <strong>Baños:</strong>
          ${valuation.bathrooms}
        </p>

        <p>
          <strong>Planta:</strong>
          ${valuation.floor}
        </p>

        <p>
          <strong>Ascensor:</strong>
          ${yesNo(valuation.hasElevator)}
        </p>

        <p>
          <strong>Estado:</strong>
          ${valuation.condition}
        </p>

        <p>
          <strong>Año/tramo:</strong>
          ${valuation.constructionPeriod}
        </p>

        <p>
          <strong>Garaje:</strong>
          ${yesNo(valuation.extras.garage)}
        </p>

        <p>
          <strong>Terraza:</strong>
          ${yesNo(valuation.extras.terrace)}
        </p>

        <p>
          <strong>Trastero:</strong>
          ${yesNo(valuation.extras.storage)}
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
          ${sourceUrl ?? "No disponible"}
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

    const { error } = await resend.emails.send({
      from: leadEmailFrom,
      to: emailRecipients,
      subject,
      html,
      replyTo: contact.email,
    });

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