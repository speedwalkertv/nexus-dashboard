import { Reveal } from "@/components/ui/reveal";

const passos = [
  {
    titulo: "Escolha os serviços",
    texto: "Com valor e duração na tela, sem precisar perguntar antes. Pode marcar mais de um.",
  },
  {
    titulo: "Diga o melhor dia",
    texto: "Informe o dia e o período que prefere. É opcional.",
  },
  {
    titulo: "Envie o pedido",
    texto: "O WhatsApp abre com tudo escrito e a Geovana confirma o horário exato.",
  },
];

export function ComoFunciona() {
  return (
    <section id="como-funciona" className="scroll-mt-20 bg-ink-800 py-20 sm:py-24">
      <div className="container-x">
        <Reveal>
          <h2 className="max-w-xl font-display text-4xl leading-tight text-creme sm:text-5xl">
            Três passos até o seu horário
          </h2>
        </Reveal>

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {passos.map((passo, i) => (
            <Reveal key={passo.titulo} delay={i * 0.08}>
              <li className="h-full rounded-2xl border border-creme/10 bg-white/[0.03] p-7">
                <span className="font-display text-5xl text-terracota">0{i + 1}</span>
                <h3 className="mt-4 font-medium text-creme">{passo.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-creme/75">{passo.texto}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
