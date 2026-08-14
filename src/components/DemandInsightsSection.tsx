import { getMarketData } from "@/lib/marketData";

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-ES").format(value);
}

export function DemandInsightsSection() {
  const marketData = getMarketData();

  const demand = marketData.demand.apartments;

  const bedroomDemand = [
    {
      label: "1 dormitorio",
      value: demand.byBedrooms[1],
    },
    {
      label: "2 dormitorios",
      value: demand.byBedrooms[2],
    },
    {
      label: "3 dormitorios",
      value: demand.byBedrooms[3],
    },
    {
      label: "4 dormitorios",
      value: demand.byBedrooms[4],
    },
  ];

  const priceDemand = [
    {
      label: "Hasta 100.000 €",
      value: demand.byPriceRange.upTo100000.total,
    },
    {
      label: "100.000 – 150.000 €",
      value: demand.byPriceRange.from100000To150000.total,
    },
    {
      label: "150.000 – 200.000 €",
      value: demand.byPriceRange.from150000To200000.total,
    },
    {
      label: "200.000 – 300.000 €",
      value: demand.byPriceRange.from200000To300000.total,
    },
    {
      label: "300.000 – 400.000 €",
      value: demand.byPriceRange.from300000To400000.total,
    },
    {
      label: "Más de 400.000 €",
      value: demand.byPriceRange.over400000.total,
    },
  ];

  const maxBedroomDemand = Math.max(
    ...bedroomDemand.map((item) => item.value)
  );

  const maxPriceDemand = Math.max(
    ...priceDemand.map((item) => item.value)
  );

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm md:p-10">
      <div className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#ec8a36]">
          Demanda de compradores
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#033b79] md:text-3xl">
          ¿Qué viviendas concentran más demanda?
        </h2>

        <p className="mt-5 text-base leading-7 text-slate-600">
          El informe de mercado utilizado por la herramienta permite analizar
          también la demanda potencial de compradores de pisos en Toledo. Estos
          datos son una referencia general del mercado analizado y no deben
          interpretarse como demanda específica de esta zona o municipio.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-[#033b79]">
            Demanda por número de dormitorios
          </h3>

          <div className="mt-6 space-y-5">
            {bedroomDemand.map((item) => {
              const width =
                (item.value / maxBedroomDemand) * 100;

              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium text-slate-700">
                      {item.label}
                    </p>

                    <p className="text-sm font-bold text-[#033b79]">
                      {formatNumber(item.value)}
                    </p>
                  </div>

                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#ec8a36]"
                      style={{
                        width: `${width}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-xs leading-5 text-slate-500">
            Número de compradores potenciales registrados en el informe para
            pisos según dormitorios.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-[#033b79]">
            Demanda por rango de precio
          </h3>

          <div className="mt-6 space-y-5">
            {priceDemand.map((item) => {
              const width =
                (item.value / maxPriceDemand) * 100;

              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium text-slate-700">
                      {item.label}
                    </p>

                    <p className="text-sm font-bold text-[#033b79]">
                      {formatNumber(item.value)}
                    </p>
                  </div>

                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#033b79]"
                      style={{
                        width: `${width}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-xs leading-5 text-slate-500">
            Número de compradores potenciales de pisos agrupados por rango de
            precio.
          </p>
        </div>
      </div>
    </section>
  );
}
