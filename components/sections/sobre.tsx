import Image from "next/image";
import { classesBotao } from "@/components/ui/botao";
import { Reveal } from "@/components/ui/reveal";
import { business } from "@/lib/business";

export function Sobre() {
  return (
    <section id="sobre" className="scroll-mt-20 bg-creme-200 py-20 text-ink sm:py-28">
      <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-black ring-1 ring-ink/10">
            <Image
              src="/geovana-sobre.jpg"
              alt={`${business.profissional} no espaço de beleza`}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover object-[center_20%]"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="max-w-xl">
            <h2 className="font-display text-5xl leading-[1.05] text-ink sm:text-6xl">
              Prazer, sou a {business.profissional.split(" ")[0]}
            </h2>

            {/* Texto base — troque pela sua história quando quiser. */}
            <div className="mt-6 space-y-4 text-ink/80">
              <p>
                Montei este espaço para atender do jeito que eu gosto de ser atendida: com hora
                marcada, tempo suficiente e sem correria.
              </p>
              <p>
                Cada serviço tem preço definido e um tempo reservado só para você. Você chega, senta
                e sai com o resultado que combinamos — seja uma sobrancelha alinhada, uma unha bem
                estruturada ou uma trança feita para durar.
              </p>
            </div>

            <a href="#agendar" className={classesBotao("primario", "lg", "mt-8")}>
              Quero marcar meu horário
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
