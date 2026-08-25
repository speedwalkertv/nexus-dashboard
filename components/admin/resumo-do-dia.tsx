"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { horaCurta, precoLabelSimples, type Agendamento } from "@/lib/agendamentos-tipos";

function montarTexto(hoje: Agendamento[]) {
  const validos = hoje.filter((a) => a.status !== "cancelado");
  if (validos.length === 0) return "Agenda de hoje: nenhum horário marcado.";

  const linhas = [`*Agenda de hoje — ${validos.length} atendimento${validos.length > 1 ? "s" : ""}*`, ""];
  for (const a of validos) {
    const marca = a.status === "pendente" ? " (a confirmar)" : "";
    linhas.push(`${horaCurta(a.hora_agendada)} — ${a.cliente_nome} — ${a.servico_nome}${marca}`);
  }
  return linhas.join("\n");
}

export function ResumoDoDia({ hoje }: { hoje: Agendamento[] }) {
  const [copiado, setCopiado] = useState(false);
  const texto = montarTexto(hoje);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      alert(texto);
    }
  }

  return (
    <div className="rounded-2xl border border-creme-300 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-xl text-ink">Resumo de hoje</h3>
        <button
          onClick={copiar}
          className="flex items-center gap-1.5 rounded-full border border-creme-300 px-3 py-1.5 text-xs font-medium text-ink/70 transition hover:border-terracota hover:text-terracota"
        >
          {copiado ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copiado ? "Copiado" : "Copiar pro WhatsApp"}
        </button>
      </div>

      {hoje.length === 0 ? (
        <p className="mt-4 text-sm text-ink/50">Nenhum horário marcado para hoje.</p>
      ) : (
        <ul className="mt-4 divide-y divide-creme-200">
          {hoje.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{a.cliente_nome}</p>
                <p className="truncate text-ink/50">{a.servico_nome}</p>
              </div>
              <div className="text-right">
                <p className="tabular-nums font-medium text-ink">{horaCurta(a.hora_agendada)}</p>
                <p className="text-xs text-ink/40">{precoLabelSimples(a)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
