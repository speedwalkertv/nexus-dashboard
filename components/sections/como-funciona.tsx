import { Reveal } from "@/components/ui/reveal";

const passos = [
  {
    titulo: "Escolha o serviço",
    texto: "Com o valor e a duração na tela, sem precisar perguntar antes.",
  },
  {
    titulo: "Escolha dia e horário",
    texto: "A agenda mostra só os horários em que o serviço cabe inteiro.",
  },
  {
    titulo: "Confirme no WhatsApp",
    texto: "O pedido sai pronto na conversa. A confirmação vem por lá.",
  },
];

export function ComoFunciona() {
  return (
    <section id="como-funciona" className="scroll-mt-20 bg-ink-800 py-20 sm:py-24">
      <div className="container-x">
        <Reveal>
          <p className="rotulo">Como funciona</p>
          <h2 className="mt-4 max-w-xl font-display text-4xl leading-tight text-creme sm:text-5xl">
            Três passos até o seu horário
          </h2>
        </Reveal>

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {passos.map((passo, i) => (
            <Reveal key={passo.titulo} delay={i * 0.08}>
              <li className="h-full rounded-2xl border border-creme/10 bg-white/[0.03] p-7">
                <span className="font-display text-5xl text-terracota/40">0{i + 1}</span>
                <h3 className="mt-4 font-medium text-creme">{passo.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-creme/60">{passo.texto}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
