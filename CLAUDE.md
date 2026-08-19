@AGENTS.md 
# TECNORETE — Rediseño UI/UX

## Objetivo actual

Este proyecto es una herramienta de valoración inmobiliaria para Tecnorete Toledo.

El bloque funcional ya está terminado, validado y funcionando en producción.

La fase actual es EXCLUSIVAMENTE un rediseño UI/UX.

El objetivo es modernizar la aplicación manteniendo una identidad claramente reconocible como Tecnorete Toledo.

Referencia principal de marca:
https://toledo1.tecnorete.es/toledo/toledo/

Producción actual:
https://tecnorete-valuation-tool.vercel.app

---

## REGLA CRÍTICA

NO modificar la lógica funcional del sistema de valoración salvo que el usuario indique expresamente que existe un bug.

El rediseño debe mantener exactamente el comportamiento actual de la aplicación.

El trabajo debe centrarse en:

- interfaz
- experiencia de usuario
- jerarquía visual
- responsive
- accesibilidad
- conversión
- confianza
- consistencia visual

---

## NO MODIFICAR

No modificar sin autorización explícita:

- motor de valoración de pisos
- motor de valoración de casas/chalets
- calculateValuationV2
- calculateHouseValuationV2
- calculateValuationHybrid
- zoneMarketAdjustments
- fórmulas de valoración
- coeficientes
- datos de mercado
- market-data.json
- importación del informe de mercado
- demanda
- HouseSubtype
- tipos relacionados con el motor
- estructura de ValuationInput
- estructura de ValuationResult
- valores enviados al motor desde ValuationForm
- /api/lead
- lógica de captación del lead
- Resend
- Make
- Google Sheets
- variables de entorno
- funcionamiento del envío de emails
- funcionamiento de webhooks

No cambiar nombres de propiedades, valores internos de formularios ni estructuras de datos únicamente por motivos visuales.

---

## VALUATIONFORM

ValuationForm puede rediseñarse visualmente.

Se permite modificar:

- distribución
- apariencia de inputs
- selects
- botones
- tarjetas seleccionables
- barra de progreso
- espaciados
- iconografía
- estados hover/focus/selected
- responsive
- transiciones visuales
- mensajes y jerarquía visual

Pero debe conservar:

- los mismos datos recogidos
- los mismos valores enviados al motor
- las mismas validaciones funcionales
- las mismas condiciones
- el mismo cálculo
- el mismo envío del lead
- el mismo funcionamiento para pisos y casas

Antes de cambiar la estructura interna de ValuationForm, comprobar qué partes tienen implicaciones funcionales.

---

## GIT Y PRODUCCIÓN

La rama estable es:

main

La rama actual de trabajo para el rediseño es:

redesign-ui

No hacer:

- git merge
- git push a main
- deploy a Production
- cambios de configuración de Vercel
- cambios de variables de entorno

sin autorización explícita del usuario.

No realizar commits automáticamente salvo que el usuario lo solicite.

---

## STACK Y ARQUITECTURA

Proyecto:

- Next.js
- TypeScript
- Tailwind CSS

IMPORTANTE:

Las rutas y páginas están en:

app/

NO están en:

src/app/

La carpeta src/ se utiliza principalmente para:

- components
- config
- lib
- types
- data

No reorganizar la arquitectura del proyecto durante el rediseño salvo necesidad justificada y aprobada previamente.

---

## IDENTIDAD TECNORETE

La aplicación debe seguir pareciendo Tecnorete Toledo.

Mantener como base:

- azul oscuro Tecnorete
- naranja Tecnorete
- blanco
- fotografía inmobiliaria/local
- sensación de cercanía
- conocimiento de la zona
- profesionalidad
- confianza
- valoración inmobiliaria
- presencia de una oficina y profesionales reales

Colores actualmente utilizados en el proyecto:

- azul principal: #033b79
- naranja principal: #ec8a36

Estos colores pueden integrarse en un sistema visual más completo, pero no realizar un rebranding de Tecnorete.

---

## DIRECCIÓN VISUAL

Objetivo conceptual:

"¿Cómo sería una herramienta digital moderna de valoración creada por Tecnorete Toledo?"

Debe sentirse:

- moderna
- inmobiliaria
- profesional
- local
- clara
- fiable
- sencilla de utilizar
- orientada a conversión

Evitar que parezca:

- una plantilla SaaS genérica
- una fintech
- una inmobiliaria de lujo negra/dorada
- una copia de Idealista
- una plantilla genérica de WordPress
- una aplicación ajena a Tecnorete

La web oficial de Tecnorete es una referencia de IDENTIDAD, no debe copiarse literalmente.

La aplicación puede y debe verse más moderna que la web corporativa actual.

---

## PRINCIPIOS DE DISEÑO

Priorizar:

1. Claridad
2. Conversión
3. Confianza
4. Facilidad de uso
5. Jerarquía
6. Responsive
7. Consistencia

Evitar el uso excesivo de tarjetas blancas independientes.

Crear ritmo visual mediante:

- fondos de sección
- cambios de superficie
- tipografía
- espaciado
- datos destacados
- fotografía
- bloques de confianza

Utilizar el naranja principalmente para acciones y elementos importantes.

El azul debe seguir siendo el principal color institucional.

---

## JERARQUÍA DE LA LANDING DE ZONA

La arquitectura visual debe distinguir tres niveles:

### Nivel 1 — Conversión

- Hero
- ValuationForm
- Resultado
- CTA principal

### Nivel 2 — Confianza

- Tecnorete
- datos de mercado
- demanda
- metodología
- profesionales
- contacto

### Nivel 3 — Información y SEO

- contenido local
- tipologías
- factores de valoración
- otras zonas
- contenido informativo

Estos tres niveles no deben competir visualmente entre sí.

---

## RESULTADO DE VALORACIÓN

La pantalla de resultado es uno de los momentos más importantes de toda la experiencia.

Debe sentirse como:

"Mi valoración inmobiliaria"

y no simplemente como el último paso de un formulario.

Debe darse máxima jerarquía al rango estimado y después contextualizar:

- zona
- datos de mercado
- demanda cuando corresponda
- siguiente acción
- posibilidad de hablar con Tecnorete

No modificar los cálculos ni valores mostrados.

---

## RESPONSIVE

El diseño debe revisarse específicamente al menos para:

- 375 px
- 390 px
- 430 px
- 768 px
- 1024 px
- 1440 px

No considerar suficiente que Tailwind compile o que existan breakpoints.

La experiencia móvil debe diseñarse de forma intencionada.

---

## FORMA DE TRABAJO

NO rediseñar toda la aplicación de una sola vez.

Trabajar por bloques.

Orden previsto:

1. arquitectura y sistema visual
2. landing de zona / hero
3. ValuationForm
4. pantalla de resultado
5. contenido de mercado, demanda, metodología, otras zonas y CTA
6. responsive
7. conversión y confianza
8. revisión SEO final

Cada bloque debe revisarse antes de comenzar el siguiente.

---

## REGLA PARA EL PRIMER ANÁLISIS

Cuando se solicite analizar el rediseño:

NO modificar archivos.

Primero:

1. analizar la arquitectura actual
2. identificar componentes relevantes
3. analizar estilos existentes
4. estudiar la referencia visual de Tecnorete
5. detectar problemas UI/UX
6. proponer un sistema visual
7. indicar qué archivos sería necesario modificar
8. explicar riesgos funcionales si los hubiera

Esperar aprobación antes de implementar cambios.

---

## DEPENDENCIAS

No instalar nuevas librerías o paquetes únicamente por motivos estéticos sin explicar primero:

- qué librería se quiere instalar
- para qué
- qué problema resuelve
- si puede resolverse con las dependencias existentes

Esperar autorización antes de añadir dependencias.

---

## SEO

El SEO técnico actual está implementado.

Durante las primeras fases visuales:

- no eliminar contenido SEO
- no modificar canonicals
- no modificar robots
- no modificar sitemap
- no cambiar index/noindex
- no alterar metadata sin autorización

La revisión SEO se realizará al final del rediseño.

---

## CRITERIO GENERAL

Antes de modificar algo que pueda afectar a la funcionalidad:

DETENERSE Y PREGUNTAR.

Es preferible conservar una implementación funcional y mejorar su presentación que reconstruir innecesariamente componentes ya validados.