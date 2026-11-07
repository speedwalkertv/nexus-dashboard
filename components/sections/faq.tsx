import { Plus } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const perguntas = [
  {
    pergunta: "O horário que eu escolho já fica garantido?",
    resposta:
      "Ainda não. O site envia o seu pedido com serviços e preferência de dia e período. A reserva só vale quando a Geovana confirma o horário exato no WhatsApp, normalmente em poucos minutos dentro do horário de funcionamento.",
  },
  {
    pergunta: "Posso remarcar ou cancelar?",
    resposta:
      "Pode. Avise na própria conversa de confirmação com a maior antecedência possível: assim o horário fica livre para outra pessoa e dá para encaixar você em outro dia.",
  },
  {
    pergunta: "Quanto tempo leva cada serviço?",
    resposta:
      "O tempo aparece em cada serviço e no resumo do pedido. É a reserva que fica na agenda e pode variar um pouco conforme o seu cabelo, unha ou pele. Serviços longos, como tranças, pedem horários com mais folga antes do fechamento.",
  },
  {
    pergunta: "O preço pode mudar?",
    resposta:
      "Os valores da tabela são fixos. Em cachos e serviços com 'a partir de', o valor final depende do comprimento e do volume do cabelo — isso é combinado antes de começar.",
  },
  {
    pergunta: "É a primeira vez que vou. Preciso levar algo?",
    resposta:
      "Só as referências que você gostou, se tiver. Se houver alergia ou algum cuidado especial, escreva no campo de observação do agendamento.",
  },
];

export function Faq() {
  return (
    <section className="bg-ink-800 py-20 sm:py-24">
      <div className="container-x grid gap-10 lg:grid-cols-[20rem_1fr] lg:gap-16">
        <Reveal>
          <div>
            <h2 className="font-display text-4xl leading-tight text-creme sm:text-5xl">
              Antes de agendar
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="divide-y divide-creme/10 border-y border-creme/10">
            {perguntas.map((item) => (
              <details key={item.pergunta} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-creme marker:hidden">
                  <span className="font-medium">{item.pergunta}</span>
                  <Plus
                    className="mt-1 h-4 w-4 shrink-0 text-terracota transition-transform duration-200 ease-suave group-open:rotate-45"
                    aria-hidden
                  />
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-creme/75">
                  {item.resposta}
                </p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
