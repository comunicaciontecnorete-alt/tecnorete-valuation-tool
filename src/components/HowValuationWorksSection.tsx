export function HowValuationWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Partimos de la ubicación",
      text: "La zona seleccionada establece el contexto inicial de la valoración. Cada localización se analiza con criterios específicos para evitar aplicar exactamente la misma referencia a todas las viviendas.",
    },
    {
      number: "02",
      title: "Analizamos la vivienda",
      text: "La herramienta tiene en cuenta la tipología del inmueble, superficie, dormitorios, baños, estado de conservación y otros elementos relevantes como planta, ascensor, garaje, terraza o trastero cuando corresponda.",
    },
    {
      number: "03",
      title: "Contrastamos con el mercado",
      text: "La estimación utiliza referencias procedentes del informe de mercado disponible y las adapta según el tipo de vivienda. Los pisos y las casas se valoran mediante criterios diferentes.",
    },
    {
      number: "04",
      title: "Calculamos un rango orientativo",
      text: "En lugar de mostrar una cifra cerrada, la herramienta devuelve un rango estimado. Esto refleja mejor que el precio final de una vivienda depende también de factores que requieren una revisión profesional.",
    },
  ];

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm md:p-10">
      <div className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#ec8a36]">
          Nuestra metodología
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#033b79] md:text-3xl">
          ¿Cómo calculamos la valoración de tu vivienda?
        </h2>

        <p className="mt-5 text-base leading-7 text-slate-600">
          La calculadora combina información de mercado con las
          características concretas de cada inmueble. El objetivo no es
          sustituir una valoración profesional, sino ofrecer una primera
          referencia coherente antes de tomar una decisión sobre una posible
          venta.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {steps.map((step) => (
          <article
            key={step.number}
            className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#033b79] text-sm font-bold text-white">
                {step.number}
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#033b79]">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {step.text}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-[#ec8a36]/30 bg-[#ec8a36]/5 p-5">
        <p className="text-sm leading-6 text-slate-700">
          <strong className="text-slate-900">
            Importante:
          </strong>{" "}
          el resultado es una estimación automática y orientativa. No
          constituye una tasación oficial, hipotecaria, judicial, fiscal ni
          pericial, y puede ser necesario revisar presencialmente el inmueble
          para establecer un precio de venta adecuado.
        </p>
      </div>
    </section>
  );
}