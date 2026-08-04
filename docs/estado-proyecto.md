# Estado del proyecto - Calculadora Tecnorete Toledo

## Proyecto local

Ruta:

C:\Users\danit\Desktop\tecnorete-valuation-tool

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Resend
- Vercel previsto para deploy

## Estructura importante

Las rutas y páginas están en:

app/

No están en src/app.

src/ se usa para:

- components
- config
- lib
- types

## Rutas funcionando

- /
- /valora-tu-vivienda
- /valora-tu-vivienda/[zone]
- /embed/[zone]
- /politica-privacidad

## Funcionalidades funcionando

- Landing general.
- Landings dinámicas por zona.
- Versión embed.
- Formulario multipaso.
- Cálculo de valoración.
- Puerta de contacto antes de resultado.
- Checkbox RGPD obligatorio.
- Checkbox opcional de lead prioritario.
- /api/lead recibe el lead.
- El lead se muestra en terminal.
- Resend envía correctamente a comunicaciontecnorete@gmail.com.

## Pendiente

- Terminar reenvío Gmail a to002@tecnorete.es.
- Terminar reenvío Gmail a to003@tecnorete.es.
- Confirmar filtros de Gmail.
- Revisar imágenes por zona.
- Deploy en Vercel.
- Configurar variables de entorno en Vercel.
- Probar envío real online.
- Fase 2 de diseño.

## Variables de entorno actuales

.env.local:

RESEND_API_KEY=clave privada
LEAD_EMAIL_TO=comunicaciontecnorete@gmail.com
LEAD_EMAIL_FROM=Tecnorete Toledo <onboarding@resend.dev>

## Decisión sobre Make

Make / Google Sheets queda aparcado de momento.

No es necesario para la primera versión.

El flujo mínimo será:

Calculadora → Resend → comunicaciontecnorete@gmail.com → reenvío Gmail a to002 y to003