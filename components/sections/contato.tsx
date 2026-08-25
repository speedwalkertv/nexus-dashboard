import { Instagram, MapPin, MessageCircle } from "lucide-react";
import { classesBotao } from "@/components/ui/botao";
import { Reveal } from "@/components/ui/reveal";
import { linkWhatsApp } from "@/lib/booking";
import { business, horarioResumo } from "@/lib/business";

export function Contato() {
  const conversa = linkWhatsApp(`Olá, ${business.nome}! Vim pelo site e queria tirar uma dúvida.`);

  return (
    <section id="contato" className="scroll-mt-20 bg-ink py-20 sm:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div>
            <p className="rotulo">Onde e quando</p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-creme sm:text-5xl">
              Venha tomar um café
            </h2>

            <div className="mt-8 flex items-start gap-3 text-creme/70">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-terracota" aria-hidden />
              <p>
                {business.endereco.linha1}
                <br />
                {business.endereco.linha2}
                <br />
                <a
                  href={business.endereco.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm text-terracota underline underline-offset-4"
                >
                  Abrir no mapa
                </a>
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={conversa}
                target="_blank"
                rel="noopener noreferrer"
                className={classesBotao("primario", "lg")}
              >
                <MessageCircle className="h-5 w-5" aria-hidden />
                Falar no WhatsApp
              </a>
              <a
                href={business.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={classesBotao("secundario", "lg")}
              >
                <Instagram className="h-5 w-5" aria-hidden />@{business.instagram}
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-3xl border border-creme/10 bg-white/[0.03] p-8">
            <h3 className="font-display text-2xl text-creme">Horário de funcionamento</h3>
            <dl className="mt-6 space-y-3">
              {horarioResumo.map((linha) => (
                <div
                  key={linha.dias}
                  className="flex items-baseline justify-between gap-4 border-b border-creme/10 pb-3 last:border-0 last:pb-0"
                >
                  <dt className="text-creme/70">{linha.dias}</dt>
                  <dd className="tabular-nums text-creme">{linha.horas}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm text-creme/50">
              Atendimento só com hora marcada, para ninguém esperar.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
