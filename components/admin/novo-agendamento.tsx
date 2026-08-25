"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { criarAgendamentoManual } from "@/lib/admin-actions";
import { categorias, servicos, servicosPorCategoria } from "@/lib/services";

const campo = "rounded-lg border border-creme-300 bg-creme-200/40 px-3 py-2 text-sm";

/** Agendamento feito por telefone, WhatsApp direto ou presencial — não passou pelo site. */
export function NovoAgendamento() {
  const [aberto, setAberto] = useState(false);
  const [servicoId, setServicoId] = useState(servicos[0]?.id ?? "");
  const servico = servicos.find((s) => s.id === servicoId) ?? servicos[0];

  if (!aberto) {
    return (
      <button
        onClick={() => setAberto(true)}
        className="flex items-center gap-1.5 rounded-full bg-terracota px-4 py-2 text-sm font-medium text-creme transition hover:bg-terracota-dark"
      >
        <Plus className="h-4 w-4" /> Lançar agendamento
      </button>
    );
  }

  return (
    <form
      action={async (fd) => {
        await criarAgendamentoManual(fd);
        setAberto(false);
      }}
      className="rounded-2xl border border-creme-300 bg-white p-5"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-ink">Lançar agendamento manual</h3>
        <button type="button" onClick={() => setAberto(false)} aria-label="Fechar">
          <X className="h-4 w-4 text-ink/40" />
        </button>
      </div>
      <p className="mt-1 text-xs text-ink/50">
        Para quem marcou por telefone, direto no WhatsApp ou presencial — sem passar pelo site.
      </p>

      <input type="hidden" name="servicoId" value={servico.id} />
      <input type="hidden" name="servicoNome" value={servico.nome} />
      <input type="hidden" name="servicoCategoria" value={servico.categoria} />
      <input type="hidden" name="duracaoMin" value={servico.duracaoMin} />

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-ink/70">
          Serviço
          <select
            value={servicoId}
            onChange={(e) => setServicoId(e.target.value)}
            className={`mt-1 w-full ${campo}`}
          >
            {categorias.map((cat) => {
              const lista = servicosPorCategoria(cat.id);
              if (lista.length === 0) return null;
              return (
                <optgroup key={cat.id} label={cat.nome}>
                  {lista.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nome}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
        </label>

        {servico.opcoes && (
          <label className="text-sm text-ink/70">
            Técnica
            <select name="servicoOpcao" className={`mt-1 w-full ${campo}`}>
              {servico.opcoes.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="text-sm text-ink/70">
          Nome da cliente
          <input name="clienteNome" required className={`mt-1 w-full ${campo}`} />
        </label>

        <label className="text-sm text-ink/70">
          Preço combinado (R$)
          <input
            name="preco"
            type="number"
            step="0.01"
            min="0"
            defaultValue={servico.preco ?? ""}
            placeholder="Sob consulta"
            className={`mt-1 w-full ${campo}`}
          />
        </label>

        <label className="text-sm text-ink/70">
          Dia
          <input name="data" type="date" required className={`mt-1 w-full ${campo}`} />
        </label>

        <label className="text-sm text-ink/70">
          Horário
          <input name="hora" type="time" required className={`mt-1 w-full ${campo}`} />
        </label>

        <label className="text-sm text-ink/70 sm:col-span-2">
          Observação
          <input name="observacao" className={`mt-1 w-full ${campo}`} />
        </label>
      </div>

      <button
        type="submit"
        className="mt-4 rounded-full bg-terracota px-5 py-2 text-sm font-medium text-creme transition hover:bg-terracota-dark"
      >
        Salvar agendamento
      </button>
    </form>
  );
}
