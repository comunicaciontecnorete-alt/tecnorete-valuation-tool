export const siteConfig = {
  name: "Tecnorete Toledo",
  url: "https://www.valoratuviviendatoledo.es",
  logoPath: "/images/tecnorete-logo.png",
  companyName: "Distrito Ciudad de Toledo, SL",
  cif: "B75708727",
  address: "Ronda de Buenavista, 33/35 - 45005 (Toledo)",
  phone: "663543464",
  offices: [
    {
      name: "Tecnorete Toledo 1 - Buenavista",
      shortName: "Buenavista",
      phone: "663543464",
      website: "https://toledo1.tecnorete.es/toledo/toledo/",
    },
    {
      name: "Tecnorete Toledo 2 - Polígono",
      shortName: "Polígono",
      phone: "606125139",
      website: "https://toledo2.tecnorete.es/",
    },
  ],
  socialLinks: [
    {
      name: "Instagram",
      href: "https://www.instagram.com/tecnoretetoledo/",
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61592482239927",
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/@TecnoreteToledo",
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@tecnorete.toledo",
    },
  ],
  legalEmail: "to002@tecnorete.es",
  testLeadEmail: "danielglop@gmail.com",
  privacyPath: "/politica-privacidad",
  colors: {
    blue: "#033b79",
    orange: "#ec8a36",
    white: "#ffffff",
    light: "#f6f8fb",
    dark: "#0f172a",
  },
  legal: {
    shortNotice:
      "Antes de mostrarte la estimación orientativa de tu vivienda, necesitamos tus datos de contacto para poder enviarte el resultado y, si lo solicitas, contactar contigo para ampliar la valoración.",
    checkboxText:
      "He leído y acepto la política de privacidad y consiento que Tecnorete Toledo trate mis datos para mostrarme una estimación orientativa de mi vivienda y contactar conmigo en relación con esta solicitud.",
    priorityCheckboxText:
      "Quiero que me contacten para valorar la posible venta de mi vivienda.",
    requiredConsentError:
      "Para poder mostrarte la estimación y gestionar tu solicitud, necesitamos que aceptes la política de privacidad.",
    resultDisclaimer:
      "La estimación mostrada es meramente orientativa y se ha calculado automáticamente a partir de los datos introducidos por el usuario y de criterios internos de valoración. No constituye una tasación oficial, no tiene validez hipotecaria, judicial, fiscal ni pericial, y no sustituye una valoración profesional presencial realizada por un especialista inmobiliario.",
  },
} as const;
