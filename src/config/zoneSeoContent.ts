export type ZoneSeoContent = {
  seoTitle: string;
  seoDescription: string;
  intro: string;
  marketContext: string;
  propertyTypes: string;
  valuationFactors: string[];
  ctaTitle: string;
  ctaText: string;
};

export const zoneSeoContent: Record<string, ZoneSeoContent> = {
  "santa-teresa": {
    seoTitle: "Valoración de vivienda en Santa Teresa, Toledo",
    seoDescription:
      "Calcula una estimación orientativa del valor de tu piso o vivienda en Santa Teresa, Toledo, según sus características y la zona.",

    intro:
      "Si estás pensando en vender una vivienda en Santa Teresa, conocer un rango de valor aproximado puede ayudarte a tomar una primera decisión con más información. Nuestra calculadora analiza las principales características del inmueble y las combina con referencias de mercado y criterios de localización para obtener una estimación orientativa.",

    marketContext:
      "Santa Teresa es una de las zonas residenciales consolidadas de Toledo y cuenta con un mercado inmobiliario en el que pueden existir diferencias importantes entre viviendas aparentemente similares. La superficie, el estado de conservación, la planta, la existencia de ascensor o las mejoras realizadas en el inmueble pueden modificar de forma significativa su valoración.",

    propertyTypes:
      "En Santa Teresa encontramos principalmente pisos de distintas superficies y antigüedades. Por eso, para estimar correctamente una vivienda no basta con aplicar un único precio por metro cuadrado: es necesario valorar también sus características concretas.",

    valuationFactors: [
      "Superficie útil y construida de la vivienda",
      "Número de dormitorios y baños",
      "Estado de conservación o reforma",
      "Planta en la que se encuentra",
      "Disponibilidad de ascensor",
      "Garaje, terraza o trastero",
      "Tipología concreta del inmueble",
    ],

    ctaTitle: "¿Quieres conocer mejor el valor de tu vivienda en Santa Teresa?",
    ctaText:
      "La calculadora ofrece una primera estimación orientativa. Si estás pensando realmente en vender, un profesional de Tecnorete puede revisar personalmente las características de tu vivienda y ayudarte a definir una valoración más precisa.",
  },

  "santa-maria-de-benquerencia": {
    seoTitle: "Valoración de vivienda en Santa María de Benquerencia",
    seoDescription:
      "Calcula cuánto puede valer tu vivienda en Santa María de Benquerencia con una estimación basada en sus características y la zona.",

    intro:
      "El valor de una vivienda en Santa María de Benquerencia puede variar considerablemente según el tipo de inmueble, su superficie, su estado y las características del edificio. Nuestra calculadora permite obtener una primera estimación introduciendo los datos principales de la vivienda.",

    marketContext:
      "Santa María de Benquerencia dispone de un parque inmobiliario amplio y diverso. Dentro de una misma zona pueden encontrarse viviendas de distintas épocas, tamaños y estados de conservación, por lo que utilizar únicamente una media general puede ofrecer resultados demasiado imprecisos.",

    propertyTypes:
      "La zona cuenta principalmente con pisos, aunque las características de cada edificio y vivienda pueden ser muy diferentes. Aspectos como el ascensor, la planta, una reforma reciente o disponer de garaje pueden influir en el valor final.",

    valuationFactors: [
      "Metros cuadrados de la vivienda",
      "Número de dormitorios",
      "Número de baños",
      "Estado actual del inmueble",
      "Ascensor y planta",
      "Garaje, terraza y trastero",
      "Características generales del edificio",
    ],

    ctaTitle:
      "¿Estás valorando vender tu vivienda en Santa María de Benquerencia?",
    ctaText:
      "Puedes utilizar esta estimación como una primera referencia. Si quieres estudiar una posible venta, el equipo de Tecnorete puede realizar una valoración profesional más detallada.",
  },

  "toledo-sur": {
    seoTitle: "Valoración de vivienda en Toledo Sur",
    seoDescription:
      "Encuentra la valoración correspondiente a Buenavista, La Legua o Valparaíso, las tres subzonas del área Toledo Sur.",

    intro:
      "Toledo Sur es el área que comprende Buenavista, La Legua y Valparaíso. Como cada subzona dispone de una referencia propia y no comparte la misma tipología residencial, esta página permite identificar primero la ubicación concreta antes de iniciar una valoración.",

    marketContext:
      "Buenavista, La Legua y Valparaíso tienen referencias de mercado diferenciadas. Por ese motivo no se aplica una valoración genérica a todo Toledo Sur: la estimación comienza seleccionando la subzona en la que se encuentra la vivienda.",

    propertyTypes:
      "La configuración distingue Buenavista de las zonas de vivienda unifamiliar de La Legua y Valparaíso. Esta separación permite utilizar en cada landing solamente los tipos de inmueble que corresponden.",

    valuationFactors: [
      "Superficie del inmueble",
      "Tipología de vivienda",
      "Dormitorios y baños",
      "Estado de conservación",
      "Planta y ascensor",
      "Garaje o trastero",
      "Terraza y otros espacios exteriores",
    ],

    ctaTitle: "Selecciona tu subzona de Toledo Sur",
    ctaText:
      "Elige Buenavista, La Legua o Valparaíso para acceder a una estimación adaptada a la ubicación y tipología de la vivienda.",
  },

  buenavista: {
    seoTitle: "Valoración de vivienda en Buenavista, Toledo",
    seoDescription:
      "Calcula una estimación orientativa de tu vivienda en Buenavista, subzona de Toledo Sur con código postal 45005.",

    intro:
      "Buenavista es una de las tres subzonas que forman Toledo Sur. La calculadora utiliza la ubicación concreta y las características introducidas para ofrecer una primera estimación orientativa de la vivienda.",

    marketContext:
      "La referencia local aprobada para pisos en Buenavista es de 2.000 € por metro cuadrado construido. Esta referencia territorial actúa como punto de partida antes de aplicar los ajustes correspondientes al inmueble.",

    propertyTypes:
      "La referencia local disponible corresponde a pisos. La herramienta mantiene la diferenciación por tipo de inmueble y considera además superficie, estado, planta, ascensor y extras cuando proceda.",

    valuationFactors: [
      "Referencia local de la subzona",
      "Metros cuadrados construidos",
      "Tipo de inmueble",
      "Estado de conservación",
      "Planta y ascensor cuando corresponda",
      "Garaje, terraza o trastero",
    ],

    ctaTitle: "Conoce el valor orientativo de tu vivienda en Buenavista",
    ctaText:
      "Introduce los datos de la vivienda para obtener un rango inicial. Si estás valorando vender, Tecnorete puede revisar posteriormente el inmueble de forma individual.",
  },

  "la-legua": {
    seoTitle: "Valoración de casa en La Legua, Toledo",
    seoDescription:
      "Obtén una estimación orientativa para una casa o chalet en La Legua, subzona de Toledo Sur con código postal 45005.",

    intro:
      "La Legua forma parte de Toledo Sur y, según la información aportada por Tecnorete, su mercado corresponde a vivienda unifamiliar. Por ello la calculadora de esta subzona se limita a casas y chalets.",

    marketContext:
      "La referencia local aprobada para La Legua es de 1.600 € por metro cuadrado construido. Entre las operaciones aportadas figuran Francisco de Pisa, con 1.600 €/m², y Jerónimo Cevallos, con 1.650 €/m².",

    propertyTypes:
      "La valoración está configurada exclusivamente para casa y chalet. No se ofrecen opciones de piso, ático o dúplex en esta subzona.",

    valuationFactors: [
      "Referencia local de La Legua",
      "Superficie construida",
      "Subtipo de vivienda unifamiliar",
      "Estado de conservación",
      "Tamaño de la vivienda",
      "Garaje, terraza o trastero",
    ],

    ctaTitle: "Calcula el valor orientativo de tu casa en La Legua",
    ctaText:
      "Completa las características de la casa o chalet para obtener un rango inicial adaptado a esta subzona de Toledo Sur.",
  },

  valparaiso: {
    seoTitle: "Valoración de casa en Valparaíso, Toledo",
    seoDescription:
      "Calcula una estimación orientativa para una casa o chalet en Valparaíso, subzona de Toledo Sur con código postal 45005.",

    intro:
      "Valparaíso es una subzona de Toledo Sur cuyo mercado, según la información aportada por Tecnorete, corresponde a vivienda unifamiliar. La herramienta permite valorar casas y chalets con una configuración propia.",

    marketContext:
      "La referencia local aprobada para Valparaíso es de 1.800 € por metro cuadrado construido. Los ejemplos aportados para la revisión se sitúan entre 1.675 y 2.000 €/m², mostrando la necesidad de considerar las características de cada vivienda.",

    propertyTypes:
      "La calculadora de Valparaíso admite exclusivamente casa y chalet. Las opciones de piso, ático y dúplex permanecen deshabilitadas para esta subzona.",

    valuationFactors: [
      "Referencia local de Valparaíso",
      "Superficie construida",
      "Subtipo de casa o chalet",
      "Estado de conservación",
      "Tamaño del inmueble",
      "Garaje, terraza o trastero",
    ],

    ctaTitle: "Calcula el valor orientativo de tu casa en Valparaíso",
    ctaText:
      "Indica las características de la vivienda unifamiliar para obtener una primera estimación específica de Valparaíso.",
  },

  azucaica: {
    seoTitle: "Valoración de vivienda en Azucaica, Toledo",
    seoDescription:
      "Calcula una estimación del valor de tu vivienda en Azucaica según superficie, tipología, estado y características del inmueble.",

    intro:
      "Si tienes una vivienda en Azucaica y quieres conocer cuánto podría valer actualmente, nuestra calculadora te permite obtener una primera estimación a partir de los datos principales del inmueble.",

    marketContext:
      "La valoración de una vivienda en Azucaica depende especialmente de su tipología y características concretas. La superficie, los espacios exteriores, el estado de conservación o la presencia de garaje pueden producir diferencias relevantes entre inmuebles de la misma zona.",

    propertyTypes:
      "En Azucaica existe una combinación de distintas soluciones residenciales, por lo que resulta especialmente importante distinguir entre pisos y viviendas con características propias de casas o chalets.",

    valuationFactors: [
      "Tipología de la vivienda",
      "Superficie útil y construida",
      "Estado de conservación",
      "Dormitorios y baños",
      "Garaje y zonas exteriores",
      "Terraza u otros espacios adicionales",
      "Características específicas del inmueble",
    ],

    ctaTitle: "¿Quieres valorar una vivienda en Azucaica?",
    ctaText:
      "Obtén primero una estimación automática y, si estás planteándote vender, solicita después una valoración profesional para estudiar las características particulares de la vivienda.",
  },

  polan: {
    seoTitle: "Valoración de vivienda en Polán",
    seoDescription:
      "Calcula cuánto puede valer tu vivienda en Polán con una estimación orientativa basada en sus características y localización.",

    intro:
      "El precio de una vivienda en Polán puede depender de numerosos factores, especialmente cuando hablamos de casas, chalets o inmuebles con superficies y características muy diferentes. Nuestra herramienta permite obtener una referencia inicial antes de tomar una decisión sobre una posible venta.",

    marketContext:
      "Para calcular la estimación utilizamos referencias generales de mercado junto con criterios internos de localización y las características introducidas por el propietario. No presentamos como datos específicos de Polán cifras que proceden de estudios generales de otros ámbitos geográficos.",

    propertyTypes:
      "En municipios como Polán es especialmente importante diferenciar entre pisos, casas adosadas, viviendas independientes y otras tipologías, ya que la superficie construida, los espacios exteriores y el estado del inmueble pueden tener un peso considerable.",

    valuationFactors: [
      "Tipo y subtipo de vivienda",
      "Superficie construida",
      "Número de dormitorios y baños",
      "Estado de conservación o reforma",
      "Garaje",
      "Terraza o espacios exteriores",
      "Características propias de la parcela o inmueble",
    ],

    ctaTitle: "¿Estás pensando en vender tu vivienda en Polán?",
    ctaText:
      "La estimación automática puede ayudarte a situarte en un primer rango de valor. Para fijar un precio de venta conviene realizar posteriormente una valoración individual del inmueble.",
  },

  layos: {
    seoTitle: "Valoración de vivienda en Layos",
    seoDescription:
      "Obtén una estimación orientativa del valor de tu casa o vivienda en Layos según superficie, estado y características.",

    intro:
      "Valorar una vivienda en Layos requiere tener en cuenta las particularidades del inmueble. Dos casas situadas en la misma localidad pueden presentar valores muy distintos dependiendo de su superficie, conservación, distribución y espacios exteriores.",

    marketContext:
      "Nuestra calculadora combina referencias generales de mercado con ajustes de localización y con los datos concretos introducidos para cada vivienda. De esta forma evitamos utilizar un único precio por metro cuadrado como respuesta para todos los inmuebles.",

    propertyTypes:
      "En Layos tienen especial relevancia las viviendas unifamiliares, chalets y casas con características muy distintas entre sí. Por este motivo, la tipología y el subtipo de vivienda forman parte del cálculo de valoración.",

    valuationFactors: [
      "Tipo de casa o vivienda",
      "Metros construidos",
      "Estado de conservación",
      "Dormitorios y baños",
      "Garaje",
      "Terrazas y zonas exteriores",
      "Características adicionales del inmueble",
    ],

    ctaTitle: "Obtén una primera valoración de tu vivienda en Layos",
    ctaText:
      "Utiliza la calculadora para conocer un rango aproximado y, si estás pensando en vender, solicita una revisión profesional de la vivienda para estudiar su situación concreta.",
  },

  arges: {
    seoTitle: "Valoración de vivienda en Argés",
    seoDescription:
      "Calcula una estimación orientativa del valor de tu vivienda en Argés según tipología, metros, estado y características.",

    intro:
      "Si quieres saber cuánto puede valer una vivienda en Argés, nuestra calculadora permite obtener una primera referencia mediante el análisis de las principales características del inmueble.",

    marketContext:
      "El mercado residencial de Argés incluye viviendas con superficies y tipologías muy diferentes. Esto hace que aspectos como el estado de conservación, el tipo de vivienda, los metros construidos o los espacios exteriores sean especialmente relevantes para realizar una estimación.",

    propertyTypes:
      "Además de pisos, en Argés tienen una presencia importante las viviendas unifamiliares y chalets. Nuestra herramienta diferencia estas tipologías para evitar aplicar los mismos criterios de valoración a inmuebles que funcionan de manera distinta.",

    valuationFactors: [
      "Tipología y subtipo del inmueble",
      "Superficie",
      "Dormitorios y baños",
      "Estado de la vivienda",
      "Garaje",
      "Terraza y espacios exteriores",
      "Otros elementos que aportan valor",
    ],

    ctaTitle: "¿Quieres vender una vivienda en Argés?",
    ctaText:
      "Empieza obteniendo una estimación orientativa y, si estás considerando una venta, solicita una valoración profesional para analizar el inmueble de manera individual.",
  },

  nambroca: {
    seoTitle: "Valoración de vivienda en Nambroca",
    seoDescription:
      "Descubre un rango orientativo del valor de tu vivienda en Nambroca según superficie, tipología, estado y características.",

    intro:
      "Conocer el posible valor de una vivienda en Nambroca es un buen punto de partida antes de plantearse una venta. Nuestra calculadora analiza las características principales del inmueble y devuelve un rango estimado de valoración.",

    marketContext:
      "Las diferencias entre viviendas pueden ser relevantes incluso dentro de una misma localidad. Por eso, el cálculo considera tanto referencias de mercado y criterios de localización como los datos concretos aportados sobre cada inmueble.",

    propertyTypes:
      "En Nambroca conviven diferentes tipos de viviendas, incluyendo casas y chalets con superficies y características propias. Diferenciar correctamente cada tipología permite obtener una estimación más coherente.",

    valuationFactors: [
      "Tipo de vivienda",
      "Superficie construida",
      "Dormitorios y baños",
      "Estado de conservación",
      "Garaje",
      "Terraza y zonas exteriores",
      "Características particulares del inmueble",
    ],

    ctaTitle: "Conoce el valor aproximado de tu vivienda en Nambroca",
    ctaText:
      "La calculadora ofrece una referencia inicial. Si existe una intención real de venta, una valoración profesional permitirá analizar de forma más precisa el inmueble y su situación.",
  },
};

export function getZoneSeoContent(slug: string) {
  return zoneSeoContent[slug];
}
