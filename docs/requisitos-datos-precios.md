# Requisitos de datos de precios - Fase futura

## Objetivo

Conectar la calculadora de valoración con un documento real de precios de vivienda por zona, para evitar depender de valores ficticios o editados directamente en código.

## Situación actual

Actualmente los precios base por metro cuadrado están definidos manualmente en:

src/config/zones.ts

Campo actual:

basePricePerSqm

Estos valores son provisionales y editables, pero no están conectados a una fuente externa.

## Objetivo futuro

Crear una fuente de datos editable que permita actualizar los precios de cada zona sin tocar código.

La calculadora debería poder leer de una tabla externa o archivo estructurado con los precios por zona.

## Opción recomendada

Usar un Google Sheet como documento maestro de precios.

Columnas recomendadas:

- Zona
- Slug
- Código postal
- Precio €/m² base
- Precio €/m² mínimo
- Precio €/m² máximo
- Fuente del dato
- Fecha de actualización
- Notas internas
- Activo

## Zonas iniciales

- Santa María de Benquerencia
- Santa Teresa
- Toledo Sur
- Azucaica
- Polán
- Layos
- Argés
- Nambroca

## Fuentes recomendadas

Prioridad 1:

- Datos internos de Tecnorete Toledo.
- Valoraciones reales realizadas por la oficina.
- Operaciones cerradas.
- Inmuebles captados.
- Comparables reales por zona.

Prioridad 2:

- Revisión manual de portales inmobiliarios.
- Informes de mercado.
- Datos públicos o fuentes estadísticas disponibles.

## Funcionamiento deseado

La calculadora debería usar el precio €/m² correspondiente a la zona seleccionada.

Ejemplo:

Si el usuario entra en:

/valora-tu-vivienda/santa-teresa

la calculadora debería buscar en el documento la fila con:

slug = santa-teresa

y usar su precio €/m² base.

## Campos mínimos necesarios

Para cada zona debe existir:

- slug
- nombre de zona
- código postal
- precio €/m² base
- fecha de actualización

## Campos recomendados

Además del precio base, sería recomendable tener:

- precio mínimo €/m²
- precio máximo €/m²
- nivel de confianza del dato
- fuente
- notas internas
- fecha de última revisión

## Fallback

Si el documento externo falla o no está disponible, la calculadora debe seguir funcionando con los precios definidos localmente en:

src/config/zones.ts

Esto evita que la landing deje de funcionar por un problema externo.

## Frecuencia de actualización

Revisión recomendada:

- Mensual si la campaña está activa.
- Trimestral si la herramienta queda estable.
- Revisión manual cuando Tecnorete detecte cambios relevantes de mercado.

## Pendiente técnico

Decidir implementación:

1. Google Sheets como fuente externa.
2. CSV publicado.
3. JSON interno editable.
4. Google Sheets + sincronización manual a JSON.

La opción más sencilla para empezar sería mantener un documento maestro en Google Sheets y copiar los valores revisados a src/config/zones.ts.

La opción más avanzada sería que la app lea automáticamente esos datos desde una API o archivo externo.