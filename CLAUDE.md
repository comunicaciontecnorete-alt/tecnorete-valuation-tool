@AGENTS.md

# PROYECTO TECNORETE

Herramienta independiente de las webs corporativas de Tecnorete para la valoración inmobiliaria en Toledo.

## Estado actual

- La rama estable y de producción es `main`.
- El rediseño UI/UX está terminado, validado y publicado. No continuar rediseñando salvo petición expresa.
- Dominio definitivo: [https://www.valoratuviviendatoledo.es](https://www.valoratuviviendatoledo.es).
- El dominio raíz redirige a [www](http://www).
- Vercel y GitHub están configurados con despliegue automático desde `main`.
- Search Console está configurado.
- El sitemap se ha procesado correctamente con 9 URLs.
- Se ha solicitado la indexación del hub y de las 8 landings.

## Oficinas

### Tecnorete Toledo 1 / Buenavista

- Teléfono: 663543464
- Web: [https://toledo1.tecnorete.es/toledo/toledo/](https://toledo1.tecnorete.es/toledo/toledo/)

### Tecnorete Toledo 2 / Polígono

- Teléfono: 606125139
- Web: [https://toledo2.tecnorete.es/](https://toledo2.tecnorete.es/)

## Guardrails

- No tocar el motor de valoración salvo bug o autorización expresa.
- No modificar coeficientes, cálculos ni datos de mercado sin autorización.
- No alterar `ValuationForm` ni la lógica de captación salvo petición expresa.
- No modificar `/api/lead`, Resend, Make o Google Sheets salvo petición expresa.
- No modificar variables de entorno sin autorización.
- No hacer rediseños generales.
- Mantener el sistema visual actual de Tecnorete.
- No hacer `git commit`, `git push` ni despliegues automáticamente.
- Ejecutar el build cuando se hagan cambios de código relevantes.
- Hacer cambios pequeños y delimitados.

## Siguiente tarea prevista

Añadir de forma controlada las redes sociales oficiales en el header y el footer: Instagram, Facebook, YouTube y TikTok. No instalar nuevas dependencias.
