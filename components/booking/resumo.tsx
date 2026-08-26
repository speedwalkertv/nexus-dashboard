"use client";

import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";
import { duracaoLabel, precoLabel, type Servico } from "@/lib/services";
import { useBooking } from "./booking-context";

type Props = { servico: Servico | null };

export function Resumo({ servico }: Props) {
  const { opcao, escolherOpcao, recomecar } = useBooking();

  return (
    <aside className="rounded-3xl border border-creme/15 bg-white/[0.04] p-6 lg:sticky lg:top-24">
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-2xl text-creme">Seu pedido</h3>
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

      <div className="mt-5 border-b border-creme/10 pb-3">
        <p className="text-xs uppercase tracking-[0.15em] text-creme/40">Serviço</p>
        <p className="mt-1">
          {servico ? (
            <span className="text-creme">{servico.nome}</span>
          ) : (
            <span className="text-creme/30">a escolher</span>
          )}
        </p>
      </div>

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
