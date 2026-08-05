"use client";

import { useState } from "react";
import Link from "next/link";
import { calculateValuation } from "@/lib/calculateValuation";
import { siteConfig } from "@/config/site";
import type {
  ConstructionPeriod,
  FloorType,
  PropertyCondition,
  PropertyType,
  ValuationInput,
  ValuationResult,
} from "@/types/valuation";

type ValuationFormProps = {
  initialZoneSlug: string;
};

type ContactData = {
  name: string;
  phone: string;
  email: string;
  consent: boolean;
  wantsToSell: boolean;
};

const propertyTypeOptions: { value: PropertyType; label: string }[] = [
  { value: "piso", label: "Piso" },
  { value: "atico", label: "Ático" },
  { value: "duplex", label: "Dúplex" },
  { value: "casa", label: "Casa" },
  { value: "chalet", label: "Chalet" },
];

const conditionOptions: { value: PropertyCondition; label: string }[] = [
  { value: "a-reformar", label: "A reformar" },
  { value: "buen-estado", label: "Buen estado" },
  { value: "reformado", label: "Reformado" },
];

const floorOptions: { value: FloorType; label: string }[] = [
  { value: "bajo", label: "Bajo" },
  { value: "primera", label: "Primera planta" },
  { value: "intermedia", label: "Planta intermedia" },
  { value: "ultima", label: "Última planta" },
  { value: "atico", label: "Ático" },
];

const constructionPeriodOptions: {
  value: ConstructionPeriod;
  label: string;
}[] = [
  { value: "antes-1970", label: "Antes de 1970" },
  { value: "1970-1990", label: "Entre 1970 y 1990" },
  { value: "1991-2005", label: "Entre 1991 y 2005" },
  { value: "2006-2015", label: "Entre 2006 y 2015" },
  { value: "despues-2015", label: "Después de 2015" },
  { value: "no-lo-se", label: "No lo sé" },
];

const initialFormData: ValuationInput = {
  zoneSlug: "",
  propertyType: "piso",
  squareMeters: 90,
  bedrooms: 3,
  bathrooms: 1,
  floor: "intermedia",
  hasElevator: true,
  condition: "buen-estado",
  constructionPeriod: "no-lo-se",
  extras: {
    garage: false,
    terrace: false,
    storage: false,
  },
};

const initialContactData: ContactData = {
  name: "",
  phone: "",
  email: "",
  consent: false,
  wantsToSell: false,
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ValuationForm({ initialZoneSlug }: ValuationFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ValuationInput>({
    ...initialFormData,
    zoneSlug: initialZoneSlug,
  });
  const [contactData, setContactData] =
    useState<ContactData>(initialContactData);
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const totalSteps = 5;
  const progress = Math.round((step / totalSteps) * 100);

  async function goNext() {
    setError("");

    if (step === 1 && formData.squareMeters <= 0) {
      setError("Indica los metros cuadrados construidos de la vivienda.");
      return;
    }

    if (step === 4) {
      if (!contactData.name.trim()) {
        setError("Indica tu nombre.");
        return;
      }

      if (!contactData.phone.trim()) {
        setError("Indica tu teléfono.");
        return;
      }

      if (!contactData.email.trim()) {
        setError("Indica tu email.");
        return;
      }

      if (!contactData.consent) {
        setError(siteConfig.legal.requiredConsentError);
        return;
      }

     try {
  setIsSubmitting(true);

  const response = await fetch("/api/lead", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      valuation: formData,
      contact: contactData,
      sourceUrl:
        typeof window !== "undefined" ? window.location.href : undefined,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.message || "No se ha podido enviar el lead.");
  }

  setResult(data.result);
  setStep(5);
} catch (submitError) {
  setError(
    submitError instanceof Error
      ? submitError.message
      : "No se ha podido calcular la valoración."
  );
} finally {
  setIsSubmitting(false);
}

      return;
    }

    setStep((currentStep) => Math.min(currentStep + 1, totalSteps));
  }

  function goBack() {
    setError("");
    setStep((currentStep) => Math.max(currentStep - 1, 1));
  }

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm md:p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Paso {step} de {totalSteps}</span>
          <span>{progress}%</span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-[#ec8a36] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {step === 1 && (
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#ec8a36]">
            Datos básicos
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#033b79]">
            ¿Qué tipo de vivienda quieres valorar?
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Tipo de inmueble
              </label>

              <select
                value={formData.propertyType}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    propertyType: event.target.value as PropertyType,
                  })
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#033b79]"
              >
                {propertyTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Metros construidos
              </label>

              <input
                type="number"
                min="1"
                value={formData.squareMeters}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    squareMeters: Number(event.target.value),
                  })
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#033b79]"
              />
            </div>
          </div>
        </section>
      )}

      {step === 2 && (
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#ec8a36]">
            Distribución
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#033b79]">
            Cuéntanos cómo es la vivienda
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Habitaciones
              </label>

              <input
                type="number"
                min="0"
                value={formData.bedrooms}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    bedrooms: Number(event.target.value),
                  })
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#033b79]"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Baños
              </label>

              <input
                type="number"
                min="0"
                value={formData.bathrooms}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    bathrooms: Number(event.target.value),
                  })
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#033b79]"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Planta
              </label>

              <select
                value={formData.floor}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    floor: event.target.value as FloorType,
                  })
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#033b79]"
              >
                {floorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                ¿Tiene ascensor?
              </label>

              <div className="mt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, hasElevator: true })
                  }
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                    formData.hasElevator
                      ? "border-[#033b79] bg-[#033b79] text-white"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  Sí
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, hasElevator: false })
                  }
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                    !formData.hasElevator
                      ? "border-[#033b79] bg-[#033b79] text-white"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {step === 3 && (
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#ec8a36]">
            Estado y extras
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#033b79]">
            Ajustamos mejor la estimación
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Estado de la vivienda
              </label>

              <select
                value={formData.condition}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    condition: event.target.value as PropertyCondition,
                  })
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#033b79]"
              >
                {conditionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Año de construcción
              </label>

              <select
                value={formData.constructionPeriod}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    constructionPeriod: event.target
                      .value as ConstructionPeriod,
                  })
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#033b79]"
              >
                {constructionPeriodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Extras
              </label>

              <div className="mt-3 grid gap-3 md:grid-cols-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 p-4 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.extras.garage}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        extras: {
                          ...formData.extras,
                          garage: event.target.checked,
                        },
                      })
                    }
                  />
                  Garaje
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 p-4 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.extras.terrace}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        extras: {
                          ...formData.extras,
                          terrace: event.target.checked,
                        },
                      })
                    }
                  />
                  Terraza
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 p-4 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.extras.storage}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        extras: {
                          ...formData.extras,
                          storage: event.target.checked,
                        },
                      })
                    }
                  />
                  Trastero
                </label>
              </div>
            </div>
          </div>
        </section>
      )}

      {step === 4 && (
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#ec8a36]">
            Datos de contacto
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#033b79]">
            Te mostramos la estimación en el siguiente paso
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {siteConfig.legal.shortNotice}
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Nombre
              </label>

              <input
                type="text"
                value={contactData.name}
                onChange={(event) =>
                  setContactData({
                    ...contactData,
                    name: event.target.value,
                  })
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#033b79]"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Teléfono
              </label>

              <input
                type="tel"
                value={contactData.phone}
                onChange={(event) =>
                  setContactData({
                    ...contactData,
                    phone: event.target.value,
                  })
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#033b79]"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Email
              </label>

              <input
                type="email"
                value={contactData.email}
                onChange={(event) =>
                  setContactData({
                    ...contactData,
                    email: event.target.value,
                  })
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#033b79]"
              />
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 text-sm leading-6 text-slate-700">
              <input
                type="checkbox"
                checked={contactData.consent}
                onChange={(event) =>
                  setContactData({
                    ...contactData,
                    consent: event.target.checked,
                  })
                }
                className="mt-1"
              />

              <span>
                {siteConfig.legal.checkboxText}{" "}
                <Link
                  href={siteConfig.privacyPath}
                  target="_blank"
                  className="font-semibold text-[#033b79] underline"
                >
                  Ver política de privacidad
                </Link>
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#ec8a36]/40 bg-[#ec8a36]/5 p-4 text-sm font-semibold leading-6 text-slate-800">
              <input
                type="checkbox"
                checked={contactData.wantsToSell}
                onChange={(event) =>
                  setContactData({
                    ...contactData,
                    wantsToSell: event.target.checked,
                  })
                }
                className="mt-1"
              />

              <span>{siteConfig.legal.priorityCheckboxText}</span>
            </label>
          </div>
        </section>
      )}

      {step === 5 && result && (
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#ec8a36]">
            Estimación orientativa
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#033b79]">
            Tu vivienda podría estar en este rango
          </h2>

          <div className="mt-6 rounded-3xl bg-[#033b79] p-6 text-white">
            <p className="text-sm opacity-80">
              {result.zoneName} · CP {result.postalCode}
            </p>

            <p className="mt-3 text-4xl font-bold">
              {formatCurrency(result.minPrice)} - {formatCurrency(result.maxPrice)}
            </p>

            <p className="mt-4 text-sm leading-6 opacity-85">
              Esta cifra es una referencia inicial. Para ajustar el valor real
              es necesario revisar la vivienda, su ubicación exacta, estado,
              demanda y comparables reales de mercado.
            </p>
          </div>

          {contactData.wantsToSell && (
            <div className="mt-5 rounded-2xl border border-[#ec8a36]/40 bg-[#ec8a36]/10 p-4 text-sm font-semibold text-slate-800">
              Has indicado que quieres que te contacten para valorar la posible venta.
              El equipo de Tecnorete recibirá tu solicitud con prioridad.
            </div>
          )}

          <p className="mt-5 text-xs leading-5 text-slate-500">
            {siteConfig.legal.resultDisclaimer}
          </p>
        </section>
      )}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between gap-3">
        {step > 1 && step < 5 ? (
          <button
            type="button"
            onClick={goBack}
            className="rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Atrás
          </button>
        ) : (
          <div />
        )}

        {step < 5 && (
  <button
    type="button"
    onClick={goNext}
    disabled={isSubmitting}
    className="ml-auto rounded-full bg-[#ec8a36] px-6 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
  >
    {isSubmitting
      ? "Calculando..."
      : step === 4
        ? "Ver mi estimación"
        : "Siguiente"}
  </button>
)}

        {step === 5 && (
          <button
            type="button"
            onClick={() => {
              setStep(1);
              setResult(null);
              setError("");
              setContactData(initialContactData);
              setFormData({
                ...initialFormData,
                zoneSlug: initialZoneSlug,
              });
            }}
            className="ml-auto rounded-full bg-[#ec8a36] px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
          >
            Calcular otra vivienda
          </button>
        )}
      </div>
    </div>
  );
}