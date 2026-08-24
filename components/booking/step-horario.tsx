"use client";

import { useMemo } from "react";
import { cn } from "@/lib/cn";
import { horariosDoDia } from "@/lib/booking";
import { useBooking } from "./booking-context";

type Props = { hoje: Date; dia: Date; duracaoMin: number };

export function StepHorario({ hoje, dia, duracaoMin }: Props) {
  const { hora, escolherHora, irPara } = useBooking();

  const { manha, tarde } = useMemo(() => {
    const todos = horariosDoDia(dia, duracaoMin, hoje);
    return {
      manha: todos.filter((h) => Number(h.slice(0, 2)) < 12),
      tarde: todos.filter((h) => Number(h.slice(0, 2)) >= 12),
    };
  }, [dia, duracaoMin, hoje]);

  if (manha.length === 0 && tarde.length === 0) {
    return (
      <div className="rounded-2xl border border-creme/15 bg-white/[0.03] p-6">
        <p className="text-creme/70">Esse dia já está sem horário livre para o serviço escolhido.</p>
        <button
          type="button"
          onClick={() => irPara("data")}
          className="mt-3 text-sm font-medium text-dourado underline underline-offset-4"
        >
          Escolher outro dia
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {[
        { rotulo: "Manhã", lista: manha },
        { rotulo: "Tarde", lista: tarde },
      ]
        .filter((bloco) => bloco.lista.length > 0)
        .map((bloco) => (
          <div key={bloco.rotulo}>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-dourado">
              {bloco.rotulo}
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
              {bloco.lista.map((h) => {
                const ativo = h === hora;
                return (
                  <button
                    key={h}
                    type="button"
                    aria-pressed={ativo}
                    onClick={() => escolherHora(h)}
                    className={cn(
                      "rounded-xl border py-3 text-sm tabular-nums transition duration-200 ease-suave",
                      ativo
                        ? "border-dourado bg-dourado/15 text-creme"
                        : "border-creme/15 bg-white/[0.03] text-creme/80 hover:border-dourado/50 hover:bg-white/[0.06]",
                    )}
                  >
                    {h}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
}
