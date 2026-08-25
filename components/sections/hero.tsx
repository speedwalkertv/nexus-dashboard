import Image from "next/image";
import { CalendarCheck, Clock, MessageCircle } from "lucide-react";
import { classesBotao } from "@/components/ui/botao";
import { business } from "@/lib/business";

const garantias = [
  { icone: Clock, texto: "Atendimento com hora marcada" },
  { icone: CalendarCheck, texto: "Preços na mesa, sem surpresa" },
  { icone: MessageCircle, texto: "Confirmação no WhatsApp" },
];

export function Hero() {
  return (
    <section id="topo" className="dark-section relative overflow-hidden bg-ink text-creme">
      {/* Brilho quente atrás do conteúdo — puramente decorativo. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-0 h-[36rem] w-[36rem] rounded-full bg-terracota/20 blur-[120px]"
      />

      <div className="container-x relative grid gap-12 pb-20 pt-28 sm:pb-28 sm:pt-36 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="max-w-xl">
          <p className="rotulo">{business.assinatura}</p>

          <h1 className="mt-5 font-display text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
            Sua beleza
            <span className="block text-dourado-claro">com hora marcada.</span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-creme/70">
            Sobrancelhas, cílios, unhas, maquiagem, cabelo e tranças no mesmo lugar. Escolha o
            serviço e o horário aqui — leva menos de um minuto.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#agendar" className={classesBotao("primario", "lg")}>
              Agendar horário
            </a>
            <a href="#servicos" className={classesBotao("secundario", "lg")}>
              Ver serviços e preços
            </a>
          </div>

          <ul className="mt-10 flex flex-col gap-3 text-sm text-creme/60 sm:flex-row sm:flex-wrap sm:gap-x-6">
            {garantias.map(({ icone: Icone, texto }) => (
              <li key={texto} className="flex items-center gap-2">
                <Icone className="h-4 w-4 text-dourado" aria-hidden />
                {texto}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-black ring-1 ring-dourado/25 sm:aspect-[3/4] lg:aspect-[4/5]">
            <Image
              src="/geovana-hero.jpg"
              alt={`${business.profissional}, profissional responsável pelo espaço`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover object-[center_25%]"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent"
            />
            <p className="absolute bottom-6 left-6 font-display text-2xl text-creme">
              {business.profissional}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
