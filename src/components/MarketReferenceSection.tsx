import { getMarketData } from "@/lib/marketData";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-ES").format(value);
}

export function MarketReferenceSection() {
  const marketData = getMarketData();

  const {
    source,
    apartments,
    houses,
    demand,
    market,
  } = marketData;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm md:p-10">
      <div className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#ec8a36]">
          Datos de referencia
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#033b79] md:text-3xl">
          Referencias del mercado inmobiliario de Toledo
        </h2>

        <p className="mt-5 text-base leading-7 text-slate-600">
          Estos datos generales proceden del informe de mercado de Toledo
          utilizado como referencia por nuestra herramienta. No representan
          precios específicos de esta zona o municipio. La estimación de cada
          vivienda aplica además criterios de localización y las
          características concretas del inmueble.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm font-semibold text-[#ec8a36]">
            Pisos
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">
                Precio medio de compraventa
              </p>

              <p className="mt-1 text-2xl font-bold text-[#033b79]">
                {formatCurrency(apartments.averageSalePrice)}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Precio medio construido
              </p>

              <p className="mt-1 text-2xl font-bold text-[#033b79]">
                {formatNumber(apartments.pricePerBuiltSqm)} €/m²
              </p>
            </div>
          </div>

          <div className="mt-5 border-t border-slate-200 pt-5">
            <p className="text-sm text-slate-500">
              Rango habitual de compraventa analizado
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              {formatCurrency(apartments.usualRange.salePriceMin)}
              {" – "}
              {formatCurrency(apartments.usualRange.salePriceMax)}
            </p>
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm font-semibold text-[#ec8a36]">
            Casas
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">
                Precio medio de compraventa
              </p>

              <p className="mt-1 text-2xl font-bold text-[#033b79]">
                {formatCurrency(houses.averageSalePrice)}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Precio medio construido
              </p>

              <p className="mt-1 text-2xl font-bold text-[#033b79]">
                {formatNumber(houses.pricePerBuiltSqm)} €/m²
              </p>
            </div>
          </div>

          <div className="mt-5 border-t border-slate-200 pt-5">
            <p className="text-sm text-slate-500">
              Rango habitual de compraventa analizado
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              {formatCurrency(houses.usualRange.salePriceMin)}
              {" – "}
              {formatCurrency(houses.usualRange.salePriceMax)}
            </p>
          </div>
        </article>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 p-5">
          <p className="text-3xl font-bold text-[#033b79]">
            {formatNumber(demand.totalBuyers)}
          </p>

          <p className="mt-2 text-sm leading-5 text-slate-600">
            compradores registrados en la demanda total analizada
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 p-5">
          <p className="text-3xl font-bold text-[#033b79]">
            {formatNumber(demand.apartments.totalPotentialBuyers)}
          </p>

          <p className="mt-2 text-sm leading-5 text-slate-600">
            compradores potenciales de pisos
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 p-5">
          <p className="text-3xl font-bold text-[#033b79]">
            {market.averageDiscountPercent}%
          </p>

          <p className="mt-2 text-sm leading-5 text-slate-600">
            negociación media registrada
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 p-5">
          <p className="text-3xl font-bold text-[#033b79]">
            {market.overvaluationPercent}%
          </p>

          <p className="mt-2 text-sm leading-5 text-slate-600">
            sobrevaloración media observada
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-[#f6f8fb] p-5">
        <p className="text-sm leading-6 text-slate-600">
          <strong className="text-slate-800">Fuente:</strong>{" "}
          {source.organization} · {source.report} · {source.location}.
          Periodo analizado: {source.period.from} – {source.period.to}.
        </p>
      </div>
    </section>
  );
}
