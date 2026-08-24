import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { business } from "@/lib/business";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const sans = Jost({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const titulo = `${business.nome} — ${business.assinatura}`;
const descricao =
  "Agende online sobrancelhas, cílios, unhas, maquiagem, spa dos pés, cabelo e tranças. Escolha o serviço, o dia e o horário — a confirmação chega no WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: titulo, template: `%s — ${business.nome}` },
  description: descricao,
  keywords: [
    "salão de beleza",
    "agendamento online",
    "design de sobrancelhas",
    "extensão de cílios",
    "alongamento de unhas",
    "maquiagem",
    "tranças",
  ],
  openGraph: {
    title: titulo,
    description: descricao,
    type: "website",
    locale: "pt_BR",
    images: [{ url: "/geovana-hero.jpg", width: 1451, height: 1084, alt: business.nome }],
  },
  icons: { icon: "/logo.jpg", apple: "/logo.jpg" },
};

export const viewport: Viewport = {
  themeColor: "#17100D",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
