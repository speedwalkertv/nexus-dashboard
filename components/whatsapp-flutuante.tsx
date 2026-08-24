import { MessageCircle } from "lucide-react";
import { linkWhatsApp } from "@/lib/booking";
import { business } from "@/lib/business";

/** Atalho permanente no mobile, onde o CTA do topo sai de vista rápido. */
export function WhatsAppFlutuante() {
  const conversa = linkWhatsApp(`Olá, ${business.nome}! Vim pelo site.`);

  return (
    <a
      href={conversa}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-terracota text-creme shadow-lg transition hover:bg-terracota-dark active:scale-95 md:hidden"
    >
      <MessageCircle className="h-6 w-6" aria-hidden />
    </a>
  );
}
