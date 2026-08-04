# Requisitos de diseño - Fase 2

Proyecto: Calculadora de valoración de vivienda Tecnorete Toledo.

## Objetivo

Mejorar el diseño visual de la herramienta una vez que la funcionalidad principal esté estable: formulario, cálculo, envío de leads por email y reenvío a las cuentas de Tecnorete.

La prioridad de la primera versión es que funcione bien. La fase 2 buscará mejorar conversión, estética y facilidad de edición.

## Requisitos generales

- Diseño más profesional y visual.
- Mobile-first real, pensando en tráfico desde anuncios y redes sociales.
- Mejorar la percepción de confianza de la landing.
- Mantener carga rápida.
- Mantener arquitectura editable y replicable para otras oficinas.
- No convertirlo en una app compleja.
- No añadir base de datos, login ni dashboard salvo que se decida más adelante.

## Sistema visual editable

El diseño debe poder editarse desde configuración, evitando tocar muchos componentes.

Crear o ampliar configuración para:

- Colores principales.
- Color de fondo.
- Color de botones.
- Logo.
- Tipografías si se decide.
- Bordes.
- Sombras.
- Textos principales.
- CTAs.
- Imágenes por zona.
- Bloques de confianza.
- Datos de contacto de la oficina.

## Imágenes por zona

Cada landing de zona debe poder tener una imagen propia.

Estructura prevista:

public/images/zones/

Nombres previstos:

- santa-maria-de-benquerencia.jpg
- santa-teresa.jpg
- toledo-sur.jpg
- azucaica.jpg
- polan.jpg
- layos.jpg
- arges.jpg
- nambroca.jpg

Pendiente revisar por qué no están apareciendo actualmente en la landing.

Requisitos de imagen:

- JPG o WebP.
- Horizontal.
- Recomendado 1600x900 px.
- Peso ideal inferior a 400-600 KB.
- Overlay oscuro o degradado para asegurar legibilidad del texto.

## Landing por zona

Cada landing debería incluir:

- Hero visual con imagen de la zona.
- Titular personalizado.
- Subtítulo claro.
- Formulario visible en primer scroll en escritorio.
- En móvil, formulario después del texto principal sin demasiada distancia.
- Aviso de estimación orientativa.
- Elementos de confianza.
- CTA claro: “Calcular valoración”.
- CTA secundario: “Solicitar valoración profesional gratuita”.

## Elementos de confianza

Valorar añadir:

- Logo de Tecnorete Toledo.
- Datos de oficina.
- Teléfono visible.
- Frase tipo: “Especialistas en vivienda en Toledo”.
- Bloque breve explicando que la estimación no es una tasación oficial.
- Posible bloque de “Cómo funciona” en 3 pasos.
- Posible bloque de “Valoración profesional gratuita”.

## Formulario

Mejoras futuras:

- Hacerlo más visual con botones tipo cards.
- Evitar exceso de selects.
- Mejorar inputs numéricos con controles + / -.
- Usar iconos para tipo de vivienda, ascensor, garaje, terraza y trastero.
- Mejorar validaciones de teléfono y email.
- Mejorar pantalla de resultado con CTA comercial.
- Añadir mensaje posterior tipo: “Un asesor de Tecnorete podrá contactar contigo para afinar la valoración”.

## Configuración editable

La fase 2 debería tender a que gran parte del diseño pueda modificarse desde archivos de configuración.

Archivos actuales relevantes:

- src/config/site.ts
- src/config/zones.ts
- src/config/valuation.ts

Posibles ampliaciones:

- src/config/theme.ts
- src/config/content.ts
- src/config/design.ts

## Pendientes técnicos de diseño

- Revisar carga de imágenes por zona.
- Revisar rutas en public/images/zones.
- Valorar usar componente Image de Next.js.
- Añadir fallback visual si una imagen no existe.
- Revisar responsive en móvil real.
- Mejorar contraste de inputs y selects.
- Añadir logo real en cabecera.
- Crear layout más comercial para landings independientes.
- Crear layout más compacto para embed.

## Prioridad

Primero cerrar:

1. Envío de email a comunicaciontecnorete@gmail.com.
2. Reenvío automático desde Gmail a to002 y to003.
3. Deploy en Vercel.
4. Prueba real online.
5. Luego fase 2 de diseño.