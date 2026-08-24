"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { categorias, duracaoLabel, precoLabel, servicosPorCategoria } from "@/lib/services";
import { useBooking } from "./booking-context";

export function StepServico() {
  const { servicoId, escolherServico } = useBooking();

  return (
    <div className="space-y-8">
      {categorias.map((categoria) => {
        const lista = servicosPorCategoria(categoria.id);
        if (lista.length === 0) return null;

        return (
          <fieldset key={categoria.id}>
            <legend className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-dourado">
              {categoria.nome}
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {lista.map((servico) => {
                const ativo = servico.id === servicoId;
                return (
                  <button
                    key={servico.id}
                    type="button"
                    aria-pressed={ativo}
                    onClick={() => escolherServico(servico.id)}
                    className={cn(
                      "group flex items-start justify-between gap-3 rounded-2xl border p-4 text-left transition duration-200 ease-suave",
                      ativo
                        ? "border-dourado bg-dourado/10"
                        : "border-creme/15 bg-white/[0.03] hover:border-dourado/50 hover:bg-white/[0.06]",
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block font-medium text-creme">{servico.nome}</span>
                      <span className="mt-1 block text-sm text-creme/50">
                        {duracaoLabel(servico.duracaoMin)} · {precoLabel(servico)}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition",
                        ativo ? "border-dourado bg-dourado text-ink" : "border-creme/30",
                      )}
                    >
                      {ativo && <Check className="h-3 w-3" aria-hidden />}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}
