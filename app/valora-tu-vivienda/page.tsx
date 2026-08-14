import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Valora tu vivienda",
  description:
    "Calcula una estimación orientativa del valor de tu vivienda con Tecnorete Toledo.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function GeneralValuationPage() {
  return (
    <main style={{ padding: 40 }}>
      <h1>Landing general funcionando</h1>
      <p>Esta es la ruta /valora-tu-vivienda.</p>
    </main>
  );
}