import { BookingProvider } from "@/components/booking/booking-context";
import { BookingSection } from "@/components/booking/booking-section";
import { ComoFunciona } from "@/components/sections/como-funciona";
import { Contato } from "@/components/sections/contato";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Servicos } from "@/components/sections/servicos";
import { Sobre } from "@/components/sections/sobre";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppFlutuante } from "@/components/whatsapp-flutuante";
import { business } from "@/lib/business";
import { servicos } from "@/lib/services";

export default function Home() {
  return (
    <BookingProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dadosEstruturados()) }}
      />
      <SiteHeader />
      <main>
        <Hero />
        <Servicos />
        <ComoFunciona />
        <BookingSection />
        <Sobre />
        <Faq />
        <Contato />
      </main>
      <SiteFooter />
      <WhatsAppFlutuante />
    </BookingProvider>
  );
}

/** Ajuda o Google a mostrar endereço, horário e serviços direto na busca. */
function dadosEstruturados() {
  return {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: `${business.nome} — ${business.assinatura}`,
    image: "/geovana-hero.jpg",
    telephone: `+${business.whatsapp}`,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: business.endereco.linha1,
      addressLocality: business.endereco.linha2,
      addressCountry: "BR",
    },
    sameAs: [business.instagramUrl],
    openingHoursSpecification: Object.entries(business.expediente)
      .filter(([, h]) => h !== null)
      .map(([dia, h]) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: diasSchema[Number(dia)],
        opens: h!.abre,
        closes: h!.fecha,
      })),
    makesOffer: servicos.map((servico) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: servico.nome },
      ...(servico.preco !== null && { price: servico.preco, priceCurrency: "BRL" }),
    })),
  };
}

const diasSchema = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
