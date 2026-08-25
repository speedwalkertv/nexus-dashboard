import type { Metadata } from "next";
import { TrendingDown, TrendingUp, Calendar, Users, XCircle, UserX } from "lucide-react";
import { obterMetricasDashboard } from "@/lib/agendamentos-consultas";
import { formatarDataLonga, formatarReais, hojeISO, horaCurta } from "@/lib/agendamentos-tipos";
import { StatusBadge } from "@/components/admin/status-badge";
import { AcoesAgendamento } from "@/components/admin/acoes-agendamento";
import { ResumoDoDia } from "@/components/admin/resumo-do-dia";
import { MapaCalor } from "@/components/admin/mapa-calor";

export const metadata: Metadata = { title: "Painel", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function PainelAdmin() {
  const m = await obterMetricasDashboard();
  const hojePorExtenso = formatarDataLonga(hojeISO());

  return (
    <div className="space-y-8">
      <div>
        <p className="rotulo">{hojePorExtenso}</p>
        <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">Como o mês está indo</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CartaoReceita receita={m.receitaMes} variacao={m.variacaoReceita} />

        <Cartao
          icone={<Calendar className="h-4 w-4" />}
          rotulo="Agendamentos no mês"
          valor={String(m.totalMes)}
          nota={`${m.contagemStatus.concluido} concluídos · ${m.contagemStatus.pendente + m.contagemStatus.confirmado} em aberto`}
        />

        <Cartao
          icone={<XCircle className="h-4 w-4" />}
          rotulo="Cancelamentos"
          valor={`${m.taxaCancelamento.toFixed(0)}%`}
          nota={`${m.contagemStatus.cancelado} de ${m.totalMes} pedido${m.totalMes === 1 ? "" : "s"}`}
          alerta={m.taxaCancelamento > 20}
        />

        <Cartao
          icone={<UserX className="h-4 w-4" />}
          rotulo="Faltas"
          valor={`${m.taxaFalta.toFixed(0)}%`}
          nota={`${m.contagemStatus.faltou} não apareceu`}
          alerta={m.taxaFalta > 15}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <ResumoDoDia hoje={m.hoje} />

        <div className="rounded-2xl border border-creme-300 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-xl text-ink">Clientes do mês</h3>
            <Users className="h-4 w-4 text-ink/30" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="font-display text-3xl text-terracota">{m.clientesNovos}</p>
              <p className="text-sm text-ink/50">novos</p>
            </div>
            <div>
              <p className="font-display text-3xl text-ink">{m.clientesRecorrentes}</p>
              <p className="text-sm text-ink/50">voltaram</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-ink/40">
            &quot;Voltaram&quot; conta quem já teve um agendamento em qualquer mês anterior.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-creme-300 bg-white p-5">
        <h3 className="font-display text-xl text-ink">Próximos agendamentos</h3>
        {m.proximos.length === 0 ? (
          <p className="mt-4 text-sm text-ink/50">Nada marcado pela frente ainda.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-creme-200">
                {m.proximos.map((a) => (
                  <tr key={a.id}>
                    <td className="whitespace-nowrap py-3 pr-4 align-top">
                      <p className="font-medium tabular-nums text-ink">
                        {formatarDataLonga(a.data_agendada).split(",")[0]}{" "}
                        <span className="text-ink/40">·</span> {horaCurta(a.hora_agendada)}
                      </p>
                    </td>
                    <td className="py-3 pr-4 align-top">
                      <p className="font-medium text-ink">{a.cliente_nome}</p>
                      <p className="text-ink/50">{a.servico_nome}</p>
                    </td>
                    <td className="whitespace-nowrap py-3 pr-4 align-top">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="py-3 align-top">
                      <AcoesAgendamento agendamento={a} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-2xl border border-creme-300 bg-white p-5">
          <h3 className="font-display text-xl text-ink">Serviços do mês</h3>
          {m.rankingServicos.length === 0 ? (
            <p className="mt-4 text-sm text-ink/50">Ainda sem pedidos este mês.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {m.rankingServicos.map((s, i) => (
                <li key={s.nome} className="flex items-center gap-3">
                  <span className="font-display text-lg text-terracota/40">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{s.nome}</p>
                    <p className="text-xs text-ink/50">
                      {s.quantidade} pedido{s.quantidade === 1 ? "" : "s"}
                      {s.receita > 0 ? ` · ${formatarReais(s.receita)}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-creme-300 bg-white p-5">
          <h3 className="font-display text-xl text-ink">Horário nobre</h3>
          <p className="mt-1 text-xs text-ink/50">
            Quando os pedidos deste mês mais caem — ajuda a decidir onde abrir mais horário.
          </p>
          <div className="mt-4">
            <MapaCalor dados={m.mapaCalor} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CartaoReceita({ receita, variacao }: { receita: number; variacao: number | null }) {
  const subiu = variacao != null && variacao >= 0;
  return (
    <div className="rounded-2xl border border-terracota/30 bg-gradient-to-br from-terracota to-terracota-dark p-5 text-creme">
      <p className="text-xs font-medium uppercase tracking-wider text-creme/70">Receita do mês</p>
      <p className="mt-2 font-display text-3xl">{formatarReais(receita)}</p>
      {variacao != null && (
        <p className="mt-2 flex items-center gap-1 text-xs text-creme/80">
          {subiu ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {Math.abs(variacao).toFixed(0)}% que o mês passado
        </p>
      )}
    </div>
  );
}

function Cartao({
  icone,
  rotulo,
  valor,
  nota,
  alerta,
}: {
  icone: React.ReactNode;
  rotulo: string;
  valor: string;
  nota: string;
  alerta?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-creme-300 bg-white p-5">
      <div className="flex items-center justify-between text-ink/40">
        <p className="text-xs font-medium uppercase tracking-wider">{rotulo}</p>
        {icone}
      </div>
      <p className={`mt-2 font-display text-3xl ${alerta ? "text-terracota" : "text-ink"}`}>{valor}</p>
      <p className="mt-2 text-xs text-ink/50">{nota}</p>
    </div>
  );
}
