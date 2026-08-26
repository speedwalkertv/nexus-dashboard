"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/cn";
import { etapas, useBooking, type Etapa } from "./booking-context";
import { Resumo } from "./resumo";
import { StepDados } from "./step-dados";
import { StepServico } from "./step-servico";

export function BookingSection() {
  const { etapa, selecionados, irPara } = useBooking();

  // Nunca deixa a pessoa cair na etapa de dados sem ter escolhido serviço.
  const atual: Etapa = selecionados.length > 0 ? etapa : "servico";

  const indiceAtual = etapas.findIndex((e) => e.id === atual);
  const anterior = indiceAtual > 0 ? etapas[indiceAtual - 1].id : null;

  return (
    <section id="agendar" className="dark-section scroll-mt-20 bg-ink py-20 text-creme sm:py-28">
      <div className="container-x">
        <header className="max-w-2xl">
          <p className="rotulo">Agende online</p>
          <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
            Escolha os serviços e mande seu pedido
          </h2>
          <p className="mt-4 text-creme/60">
            São dois passos. Dá pra marcar mais de um serviço no mesmo pedido — o dia e o horário
            são combinados direto no WhatsApp.
          </p>
        </header>

        <ol className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
          {etapas.map((item, i) => {
            const concluida = i < indiceAtual;
            const ativa = i === indiceAtual;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  disabled={i > indiceAtual}
                  onClick={() => irPara(item.id)}
                  aria-current={ativa ? "step" : undefined}
                  className={cn(
                    "flex items-center gap-2 text-sm transition",
                    ativa && "text-creme",
                    concluida && "text-creme/60 hover:text-dourado",
                    !ativa && !concluida && "text-creme/25",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full border text-xs tabular-nums",
                      ativa && "border-dourado bg-dourado text-ink",
                      concluida && "border-dourado/50 text-dourado",
                      !ativa && !concluida && "border-creme/20",
                    )}
                  >
                    {i + 1}
                  </span>
                  {item.titulo}
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_20rem] lg:gap-12">
          <div>
            {anterior && (
              <button
                type="button"
                onClick={() => irPara(anterior)}
                className="mb-5 inline-flex items-center gap-1 text-sm text-creme/50 transition hover:text-dourado"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
                Voltar
              </button>
            )}

            <ConteudoEtapa etapa={atual}>
              {atual === "servico" && <StepServico />}
              {atual === "dados" && <StepDados />}
            </ConteudoEtapa>
          </div>

          <Resumo />
        </div>
      </div>
    </section>
  );
}

function ConteudoEtapa({ etapa, children }: { etapa: Etapa; children: React.ReactNode }) {
  const semMovimento = useReducedMotion();
  if (semMovimento) return <div>{children}</div>;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={etapa}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
