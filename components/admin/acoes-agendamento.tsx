"use client";

import { useState } from "react";
import { Check, MessageSquareX, UserX, RotateCcw, Trash2 } from "lucide-react";
import { atualizarStatus, apagarAgendamento } from "@/lib/admin-actions";
import type { Agendamento } from "@/lib/agendamentos-tipos";

const botao =
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition disabled:opacity-50";

type Props = {
  agendamento: Pick<Agendamento, "id" | "status" | "preco_reais">;
  /** Mostra o botão de apagar — só faz sentido na lista completa, não no painel. */
  permiteApagar?: boolean;
};

export function AcoesAgendamento({ agendamento, permiteApagar }: Props) {
  const [modo, setModo] = useState<"idle" | "cancelar" | "concluir">("idle");
  const [carregando, setCarregando] = useState(false);
  const [valor, setValor] = useState(agendamento.preco_reais?.toString() ?? "");
  const [motivo, setMotivo] = useState("");

  async function mudarStatus(status: string, extra?: Record<string, string>) {
    setCarregando(true);
    const fd = new FormData();
    fd.set("id", agendamento.id);
    fd.set("status", status);
    for (const [k, v] of Object.entries(extra ?? {})) fd.set(k, v);
    try {
      await atualizarStatus(fd);
      setModo("idle");
    } finally {
      setCarregando(false);
    }
  }

  async function apagar() {
    if (!confirm("Apagar este agendamento? Não é possível desfazer.")) return;
    setCarregando(true);
    const fd = new FormData();
    fd.set("id", agendamento.id);
    try {
      await apagarAgendamento(fd);
    } finally {
      setCarregando(false);
    }
  }

  if (modo === "cancelar") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <input
          autoFocus
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Motivo (opcional)"
          className="w-40 rounded-full border border-creme-300 bg-white px-3 py-1.5 text-xs"
        />
        <button
          disabled={carregando}
          onClick={() => mudarStatus("cancelado", { motivo })}
          className={`${botao} bg-rose-600 text-white hover:bg-rose-700`}
        >
          Confirmar cancelamento
        </button>
        <button onClick={() => setModo("idle")} className={`${botao} text-ink/50 hover:text-ink`}>
          Voltar
        </button>
      </div>
    );
  }

  if (modo === "concluir") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-ink/50">R$</span>
        <input
          autoFocus
          type="number"
          step="0.01"
          min="0"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="Valor recebido"
          className="w-28 rounded-full border border-creme-300 bg-white px-3 py-1.5 text-xs"
        />
        <button
          disabled={carregando}
          onClick={() => mudarStatus("concluido", { valorRecebido: valor })}
          className={`${botao} bg-emerald-600 text-white hover:bg-emerald-700`}
        >
          Confirmar valor
        </button>
        <button onClick={() => setModo("idle")} className={`${botao} text-ink/50 hover:text-ink`}>
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {agendamento.status === "pendente" && (
        <button
          disabled={carregando}
          onClick={() => mudarStatus("confirmado")}
          className={`${botao} bg-sky-600 text-white hover:bg-sky-700`}
        >
          <Check className="h-3.5 w-3.5" /> Confirmar
        </button>
      )}

      {(agendamento.status === "pendente" || agendamento.status === "confirmado") && (
        <>
          {agendamento.status === "confirmado" && (
            <button
              disabled={carregando}
              onClick={() => setModo("concluir")}
              className={`${botao} bg-emerald-600 text-white hover:bg-emerald-700`}
            >
              <Check className="h-3.5 w-3.5" /> Concluir
            </button>
          )}
          <button
            disabled={carregando}
            onClick={() => setModo("cancelar")}
            className={`${botao} bg-rose-100 text-rose-700 hover:bg-rose-200`}
          >
            <MessageSquareX className="h-3.5 w-3.5" /> Cancelar
          </button>
          {agendamento.status === "confirmado" && (
            <button
              disabled={carregando}
              onClick={() => mudarStatus("faltou")}
              className={`${botao} bg-zinc-200 text-zinc-700 hover:bg-zinc-300`}
            >
              <UserX className="h-3.5 w-3.5" /> Faltou
            </button>
          )}
        </>
      )}

      {(agendamento.status === "cancelado" ||
        agendamento.status === "concluido" ||
        agendamento.status === "faltou") && (
        <button
          disabled={carregando}
          onClick={() => mudarStatus("pendente")}
          className={`${botao} bg-creme-200 text-ink/60 hover:bg-creme-300`}
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reabrir
        </button>
      )}

      {permiteApagar && (
        <button
          disabled={carregando}
          onClick={apagar}
          className={`${botao} text-ink/30 hover:text-rose-600`}
          aria-label="Apagar agendamento"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
