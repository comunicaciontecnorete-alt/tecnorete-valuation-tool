import { siteConfig } from "@/config/site";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f6f8fb] px-5 py-8 md:px-8">
      <article className="mx-auto max-w-4xl rounded-3xl bg-white px-6 py-10 shadow-sm md:px-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#ec8a36]">
          {siteConfig.name}
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-[#033b79]">
          Política de privacidad
        </h1>

        <p className="mt-4 text-sm text-slate-500">
          Última actualización: 1 de agosto de 2026
        </p>

        <div className="mt-8 space-y-7 text-sm leading-7 text-slate-700">
          <section>
            <h2 className="text-xl font-bold text-[#033b79]">
              Responsable del tratamiento
            </h2>

            <p className="mt-2">
              El responsable del tratamiento de los datos personales es{" "}
              <strong>{siteConfig.companyName}</strong>, CIF{" "}
              <strong>{siteConfig.cif}</strong>, con domicilio en{" "}
              <strong>{siteConfig.address}</strong>.
            </p>

            <p className="mt-2">
              Email de contacto:{" "}
              <a
                className="font-semibold text-[#033b79] underline"
                href={`mailto:${siteConfig.legalEmail}`}
              >
                {siteConfig.legalEmail}
              </a>
            </p>

            <p className="mt-2">
              Teléfono: <strong>{siteConfig.phone}</strong>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#033b79]">
              Datos personales que tratamos
            </h2>

            <p className="mt-2">
              A través de la calculadora podemos tratar datos identificativos y
              de contacto, como nombre, teléfono y correo electrónico.
            </p>

            <p className="mt-2">
              También podemos tratar la dirección del inmueble objeto de
              valoración, específicamente la calle y el número, así como la zona
              y el código postal, el tipo de inmueble, los metros cuadrados
              construidos, el número de habitaciones, el número de baños, la
              planta, la existencia de ascensor, el estado de conservación, el
              año o tramo de construcción y extras como garaje, terraza o
              trastero.
            </p>

            <p className="mt-2">
              No solicitamos datos especialmente protegidos ni información
              sensible.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#033b79]">
              Finalidades del tratamiento
            </h2>

            <p className="mt-2">
              Tratamos tus datos para gestionar tu solicitud de valoración
              orientativa de vivienda, mostrarte una estimación aproximada y
              contactar contigo en relación con dicha solicitud.
            </p>

            <p className="mt-2">
              Si marcas la casilla opcional “Quiero que me contacten para
              valorar la posible venta de mi vivienda”, trataremos tu solicitud
              como prioritaria y podremos contactarte con mayor urgencia.
            </p>

            <p className="mt-2">
              También podremos tratar datos técnicos mínimos para garantizar el
              correcto funcionamiento de la herramienta y prevenir usos
              fraudulentos o automatizados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#033b79]">Legitimación</h2>

            <p className="mt-2">
              La base jurídica principal para el tratamiento de tus datos es tu
              consentimiento, prestado mediante la aceptación de la política de
              privacidad antes de enviar el formulario.
            </p>

            <p className="mt-2">
              Puedes retirar tu consentimiento en cualquier momento escribiendo a{" "}
              <a
                className="font-semibold text-[#033b79] underline"
                href={`mailto:${siteConfig.legalEmail}`}
              >
                {siteConfig.legalEmail}
              </a>
              . La retirada del consentimiento no afectará a la licitud del
              tratamiento realizado con anterioridad.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#033b79]">Destinatarios</h2>

            <p className="mt-2">
              Tus datos no serán vendidos ni cedidos a terceros con fines
              comerciales.
            </p>

            <p className="mt-2">
              Podrán acceder a los datos proveedores tecnológicos necesarios
              para el funcionamiento de la herramienta, alojamiento web, envío
              de correos electrónicos, automatización de leads, mantenimiento o
              cumplimiento de obligaciones legales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#033b79]">
              Transferencias internacionales
            </h2>

            <p className="mt-2">
              Con carácter general, no se prevén transferencias internacionales
              de datos, salvo que alguno de los proveedores tecnológicos
              utilizados para alojamiento, envío de emails, automatización o
              gestión técnica implique tratamiento fuera del Espacio Económico
              Europeo. En ese caso, se aplicarán las garantías legalmente
              exigibles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#033b79]">
              Plazo de conservación
            </h2>

            <p className="mt-2">
              Conservaremos tus datos durante el tiempo necesario para gestionar
              tu solicitud de valoración y contacto. Como criterio general, los
              datos de leads podrán conservarse durante un plazo máximo de 24
              meses desde la última interacción, salvo que solicites su supresión
              antes o exista obligación legal de conservación durante un plazo
              superior.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#033b79]">
              Derechos del usuario
            </h2>

            <p className="mt-2">
              Puedes ejercer tus derechos de acceso, rectificación, supresión,
              oposición, limitación, portabilidad y retirada del consentimiento
              escribiendo a{" "}
              <a
                className="font-semibold text-[#033b79] underline"
                href={`mailto:${siteConfig.legalEmail}`}
              >
                {siteConfig.legalEmail}
              </a>
              .
            </p>

            <p className="mt-2">
              También tienes derecho a presentar una reclamación ante la Agencia
              Española de Protección de Datos si consideras que el tratamiento de
              tus datos no se ajusta a la normativa aplicable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#033b79]">
              Aviso sobre la estimación
            </h2>

            <p className="mt-2">{siteConfig.legal.resultDisclaimer}</p>
          </section>
        </div>
      </article>
    </main>
  );
}
