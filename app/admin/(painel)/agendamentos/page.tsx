import type { Metadata } from "next";
import Link from "next/link";
import { listarComFiltros } from "@/lib/agendamentos-consultas";
import { formatarDataCurta, horaCurta, precoLabelSimples, rotuloStatus, type StatusAgendamento } from "@/lib/agendamentos-tipos";
import { StatusBadge } from "@/components/admin/status-badge";
import { AcoesAgendamento } from "@/components/admin/acoes-agendamento";
import { NovoAgendamento } from "@/components/admin/novo-agendamento";

export const metadata: Metadata = { title: "Agendamentos", robots: { index: false } };
export const dynamic = "force-dynamic";

const campoFiltro = "rounded-lg border border-creme-300 bg-white px-3 py-2 text-sm";

type Props = {
  searchParams: Promise<{ status?: string; de?: string; ate?: string; busca?: string }>;
};

export default async function ListaAgendamentos({ searchParams }: Props) {
  const filtros = await searchParams;
  const statusValidos = Object.keys(rotuloStatus) as StatusAgendamento[];
  const status = statusValidos.find((s) => s === filtros.status);
  const lista = await listarComFiltros({ status, de: filtros.de, ate: filtros.ate, busca: filtros.busca });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-ink sm:text-4xl">Agendamentos</h1>
        <NovoAgendamento />
      </div>

      <form method="get" className="flex flex-wrap items-end gap-3 rounded-2xl border border-creme-300 bg-white p-4">
        <label className="text-sm text-ink/60">
          Status
          <select name="status" defaultValue={filtros.status ?? ""} className={`mt-1 block ${campoFiltro}`}>
            <option value="">Todos</option>
            {Object.entries(rotuloStatus).map(([valor, rotulo]) => (
              <option key={valor} value={valor}>
                {rotulo}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-ink/60">
          De
          <input type="date" name="de" defaultValue={filtros.de ?? ""} className={`mt-1 block ${campoFiltro}`} />
        </label>
        <label className="text-sm text-ink/60">
          Até
          <input type="date" name="ate" defaultValue={filtros.ate ?? ""} className={`mt-1 block ${campoFiltro}`} />
        </label>
        <label className="text-sm text-ink/60">
          Cliente
          <input
            name="busca"
            defaultValue={filtros.busca ?? ""}
            placeholder="Buscar por nome"
            className={`mt-1 block ${campoFiltro}`}
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-creme transition hover:bg-ink-700"
        >
          Filtrar
        </button>
        {(filtros.status || filtros.de || filtros.ate || filtros.busca) && (
          <Link href="/admin/agendamentos" className="text-sm text-ink/50 underline underline-offset-4">
            Limpar
          </Link>
        )}
      </form>

      <div className="rounded-2xl border border-creme-300 bg-white p-5">
        <p className="text-sm text-ink/50">
          {lista.length} agendamento{lista.length === 1 ? "" : "s"}
        </p>

        {lista.length === 0 ? (
          <p className="mt-6 text-sm text-ink/50">Nada encontrado com esses filtros.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-ink/40">
                  <th className="pb-2 pr-4 font-medium">Data</th>
                  <th className="pb-2 pr-4 font-medium">Cliente / serviço</th>
                  <th className="pb-2 pr-4 font-medium">Valor</th>
                  <th className="pb-2 pr-4 font-medium">Status</th>
                  <th className="pb-2 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-creme-200">
                {lista.map((a) => (
                  <tr key={a.id}>
                    <td className="whitespace-nowrap py-3 pr-4 align-top tabular-nums text-ink/70">
                      {formatarDataCurta(a.data_agendada)} · {horaCurta(a.hora_agendada)}
                    </td>
                    <td className="py-3 pr-4 align-top">
                      <p className="font-medium text-ink">{a.cliente_nome}</p>
                      <p className="text-ink/50">
                        {a.servico_nome}
                        {a.servico_opcao ? ` (${a.servico_opcao})` : ""}
                        {a.origem === "manual" && (
                          <span className="ml-1.5 rounded-full bg-creme-200 px-1.5 py-0.5 text-[0.65rem] uppercase text-ink/40">
                            manual
                          </span>
                        )}
                      </p>
                      {a.cliente_observacao && (
                        <p className="mt-0.5 text-xs italic text-ink/40">&quot;{a.cliente_observacao}&quot;</p>
                      )}
                      {a.motivo_cancelamento && (
                        <p className="mt-0.5 text-xs text-rose-600">Motivo: {a.motivo_cancelamento}</p>
                      )}
                    </td>
                    <td className="whitespace-nowrap py-3 pr-4 align-top text-ink/70">{precoLabelSimples(a)}</td>
                    <td className="whitespace-nowrap py-3 pr-4 align-top">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="py-3 align-top">
                      <AcoesAgendamento agendamento={a} permiteApagar />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
