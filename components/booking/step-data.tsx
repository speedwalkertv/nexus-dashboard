"use client";

import { useMemo } from "react";
import { cn } from "@/lib/cn";
import { diaSemanaCurto, horariosDoDia, proximosDias, type Dia } from "@/lib/booking";
import { useBooking } from "./booking-context";

type Props = { hoje: Date; duracaoMin: number };

export function StepData({ hoje, duracaoMin }: Props) {
  const { diaIso, escolherDia } = useBooking();

  // Só entram dias que ainda comportam o serviço inteiro dentro do expediente.
  const meses = useMemo(() => {
    const disponiveis = proximosDias(hoje).filter(
      (d) => d.aberto && horariosDoDia(d.data, duracaoMin, hoje).length > 0,
    );

    const grupos: { rotulo: string; dias: Dia[] }[] = [];
    for (const dia of disponiveis) {
      const rotulo = dia.data.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
      const ultimo = grupos[grupos.length - 1];
      if (ultimo?.rotulo === rotulo) ultimo.dias.push(dia);
      else grupos.push({ rotulo, dias: [dia] });
    }
    return grupos;
  }, [hoje, duracaoMin]);

  if (meses.length === 0) {
    return (
      <p className="rounded-2xl border border-creme/15 bg-white/[0.03] p-6 text-creme/70">
        Não encontramos dias livres para esse serviço nas próximas semanas. Fale direto no WhatsApp
        que a gente encaixa você.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {meses.map((grupo) => (
        <div key={grupo.rotulo}>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-dourado">
            {grupo.rotulo}
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
            {grupo.dias.map((dia) => {
              const ativo = dia.iso === diaIso;
              return (
                <button
                  key={dia.iso}
                  type="button"
                  aria-pressed={ativo}
                  onClick={() => escolherDia(dia.iso)}
                  className={cn(
                    "rounded-xl border py-3 text-center transition duration-200 ease-suave",
                    ativo
                      ? "border-dourado bg-dourado/15"
                      : "border-creme/15 bg-white/[0.03] hover:border-dourado/50 hover:bg-white/[0.06]",
                  )}
                >
                  <span className="block text-[0.7rem] uppercase tracking-wide text-creme/50">
                    {diaSemanaCurto(dia.data)}
                  </span>
                  <span className="mt-0.5 block font-display text-2xl leading-none text-creme">
                    {dia.data.getDate()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
