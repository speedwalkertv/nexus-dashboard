"use client";

import { X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";
import { duracaoLabel, precoLabel, servicoPorId } from "@/lib/services";
import { useBooking } from "./booking-context";

export function Resumo() {
  const { selecionados, escolherOpcao, removerServico, recomecar } = useBooking();

  const itens = selecionados
    .map((item) => ({ item, servico: servicoPorId(item.id) }))
    .filter((x): x is { item: (typeof selecionados)[number]; servico: NonNullable<typeof x.servico> } =>
      Boolean(x.servico),
    );

  const duracaoTotal = itens.reduce((soma, { servico }) => soma + servico.duracaoMin, 0);
  const fechados = itens.filter(({ servico }) => servico.preco !== null && !servico.aPartirDe);
  const emAberto = itens.length - fechados.length;
  const totalFechado = fechados.reduce((soma, { servico }) => soma + (servico.preco ?? 0), 0);

  return (
    <aside className="rounded-3xl border border-creme/15 bg-white/[0.04] p-6 lg:sticky lg:top-24">
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-2xl text-creme">Seu pedido</h3>
        {itens.length > 0 && (
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

      {itens.length === 0 ? (
        <p className="mt-5 text-creme/30">Nenhum serviço escolhido ainda.</p>
      ) : (
        <ul className="mt-5 space-y-4">
          {itens.map(({ item, servico }) => (
            <li key={item.id} className="border-b border-creme/10 pb-4 last:border-0 last:pb-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-creme">{servico.nome}</p>
                  <p className="mt-0.5 text-sm text-creme/50">
                    {precoLabel(servico)} · {duracaoLabel(servico.duracaoMin)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removerServico(item.id)}
                  aria-label={`Remover ${servico.nome}`}
                  className="mt-0.5 shrink-0 text-creme/40 transition hover:text-terracota"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>

              {servico.opcoes && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {servico.opcoes.map((opcaoItem) => (
                    <button
                      key={opcaoItem}
                      type="button"
                      aria-pressed={opcaoItem === item.opcao}
                      onClick={() => escolherOpcao(item.id, opcaoItem)}
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-xs transition",
                        opcaoItem === item.opcao
                          ? "border-dourado bg-dourado/15 text-creme"
                          : "border-creme/15 text-creme/60 hover:border-dourado/50",
                      )}
                    >
                      {opcaoItem}
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {itens.length > 0 && (
        <div className="mt-6 flex items-end justify-between border-t border-creme/10 pt-5">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-creme/40">
              {emAberto > 0 ? "Valor parcial" : "Valor total"}
            </p>
            <p className="mt-1 font-display text-3xl text-dourado-claro">
              {fechados.length > 0 ? precoTotalLabel(totalFechado) : "Sob consulta"}
            </p>
            {emAberto > 0 && (
              <p className="mt-1 text-xs text-creme/40">
                +{emAberto} item{emAberto === 1 ? "" : "s"} combinado{emAberto === 1 ? "" : "s"} na
                conversa
              </p>
            )}
          </div>
          <p className="text-sm text-creme/50">≈ {duracaoLabel(duracaoTotal)}</p>
        </div>
      )}
    </aside>
  );
}

function precoTotalLabel(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  });
}
