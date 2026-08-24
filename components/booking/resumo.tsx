"use client";

import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";
import { dataPorExtenso } from "@/lib/booking";
import { duracaoLabel, precoLabel, type Servico } from "@/lib/services";
import { useBooking, type Etapa } from "./booking-context";

type Props = { servico: Servico | null; dia: Date | null };

export function Resumo({ servico, dia }: Props) {
  const { hora, opcao, escolherOpcao, irPara, recomecar } = useBooking();

  const linhas: { rotulo: string; valor: string | null; etapa: Etapa }[] = [
    { rotulo: "Serviço", valor: servico?.nome ?? null, etapa: "servico" },
    { rotulo: "Dia", valor: dia ? dataPorExtenso(dia) : null, etapa: "data" },
    { rotulo: "Horário", valor: hora, etapa: "horario" },
  ];

  return (
    <aside className="rounded-3xl border border-creme/15 bg-white/[0.04] p-6 lg:sticky lg:top-24">
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-2xl text-creme">Seu agendamento</h3>
        {servico && (
          <button
            type="button"
            onClick={recomecar}
            className="flex items-center gap-1.5 text-xs text-creme/50 transition hover:text-dourado"
          >
            <RotateCcw className="h-3 w-3" aria-hidden />
            recomeçar
          </button>
        )}
      </div>

      <dl className="mt-5 space-y-3">
        {linhas.map((linha) => (
          <div key={linha.rotulo} className="border-b border-creme/10 pb-3 last:border-0">
            <dt className="text-xs uppercase tracking-[0.15em] text-creme/40">{linha.rotulo}</dt>
            <dd className="mt-1">
              {linha.valor ? (
                <button
                  type="button"
                  onClick={() => irPara(linha.etapa)}
                  className="text-left text-creme underline-offset-4 transition hover:text-dourado hover:underline"
                >
                  {linha.valor}
                </button>
              ) : (
                <span className="text-creme/30">a escolher</span>
              )}
            </dd>
          </div>
        ))}
      </dl>

      {servico?.opcoes && (
        <div className="mt-5">
          <p className="text-xs uppercase tracking-[0.15em] text-creme/40">Técnica</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {servico.opcoes.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={item === opcao}
                onClick={() => escolherOpcao(item)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition",
                  item === opcao
                    ? "border-dourado bg-dourado/15 text-creme"
                    : "border-creme/15 text-creme/60 hover:border-dourado/50",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {servico && (
        <div className="mt-6 flex items-end justify-between border-t border-creme/10 pt-5">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-creme/40">Valor</p>
            <p className="mt-1 font-display text-3xl text-dourado-claro">{precoLabel(servico)}</p>
          </div>
          <p className="text-sm text-creme/50">≈ {duracaoLabel(servico.duracaoMin)}</p>
        </div>
      )}
    </aside>
  );
}
