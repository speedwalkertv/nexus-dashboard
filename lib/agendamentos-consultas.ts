import "server-only";

import { criarClienteServidor } from "./supabase/server";
import {
  agoraHHMM,
  hojeISO,
  limitesDoMes,
  normalizarNome,
  type Agendamento,
  type StatusAgendamento,
} from "./agendamentos-tipos";

function relatarErro(contexto: string, error: { message: string } | null) {
  if (error) throw new Error(`${contexto}: ${error.message}`);
}

export async function listarAgendamentosDoMes(deslocamentoMeses = 0): Promise<Agendamento[]> {
  const { inicio, fim } = limitesDoMes(deslocamentoMeses);
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from("agendamentos")
    .select("*")
    .gte("data_agendada", inicio)
    .lte("data_agendada", fim)
    .order("data_agendada")
    .order("hora_agendada")
    .returns<Agendamento[]>();
  relatarErro("Falha ao listar agendamentos do mês", error);
  return data ?? [];
}

export async function listarProximos(limite = 40): Promise<Agendamento[]> {
  const hoje = hojeISO();
  const agora = agoraHHMM();
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from("agendamentos")
    .select("*")
    .in("status", ["pendente", "confirmado"])
    .or(`data_agendada.gt.${hoje},and(data_agendada.eq.${hoje},hora_agendada.gte.${agora}:00)`)
    .order("data_agendada")
    .order("hora_agendada")
    .limit(limite)
    .returns<Agendamento[]>();
  relatarErro("Falha ao listar próximos agendamentos", error);
  return data ?? [];
}

export async function listarDoDia(dataISO: string): Promise<Agendamento[]> {
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from("agendamentos")
    .select("*")
    .eq("data_agendada", dataISO)
    .order("hora_agendada")
    .returns<Agendamento[]>();
  relatarErro("Falha ao listar agendamentos do dia", error);
  return data ?? [];
}

type FiltrosLista = {
  status?: StatusAgendamento;
  de?: string;
  ate?: string;
  busca?: string;
};

export async function listarComFiltros(filtros: FiltrosLista): Promise<Agendamento[]> {
  const supabase = await criarClienteServidor();
  let consulta = supabase
    .from("agendamentos")
    .select("*")
    .order("data_agendada", { ascending: false })
    .order("hora_agendada", { ascending: false })
    .limit(500);
  if (filtros.status) consulta = consulta.eq("status", filtros.status);
  if (filtros.de) consulta = consulta.gte("data_agendada", filtros.de);
  if (filtros.ate) consulta = consulta.lte("data_agendada", filtros.ate);
  if (filtros.busca) consulta = consulta.ilike("cliente_nome", `%${filtros.busca}%`);
  const { data, error } = await consulta.returns<Agendamento[]>();
  relatarErro("Falha ao listar agendamentos", error);
  return data ?? [];
}

export type MetricasDashboard = {
  mesAtual: Agendamento[];
  hoje: Agendamento[];
  proximos: Agendamento[];
  receitaMes: number;
  receitaMesAnterior: number;
  variacaoReceita: number | null;
  contagemStatus: Record<StatusAgendamento, number>;
  totalMes: number;
  taxaCancelamento: number;
  taxaFalta: number;
  rankingServicos: { nome: string; quantidade: number; receita: number }[];
  mapaCalor: number[][];
  clientesNovos: number;
  clientesRecorrentes: number;
};

const STATUSES: StatusAgendamento[] = ["pendente", "confirmado", "concluido", "cancelado", "faltou"];

/** Blocos de 2h cobrindo o expediente (09h–21h) — deve casar com lib/business.ts. */
const BLOCOS_HORA = ["09-11", "11-13", "13-15", "15-17", "17-19", "19-21"];
const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function blocoDaHora(hhmmss: string) {
  const h = Number(hhmmss.slice(0, 2));
  return Math.min(BLOCOS_HORA.length - 1, Math.max(0, Math.floor((h - 9) / 2)));
}

function diaDaSemanaLocal(dataISO: string) {
  const [ano, mes, dia] = dataISO.split("-").map(Number);
  return new Date(ano, mes - 1, dia).getDay();
}

export async function obterMetricasDashboard(): Promise<MetricasDashboard> {
  const hoje = hojeISO();
  const { inicio: inicioMesAnterior, fim: fimMesAnterior } = limitesDoMes(-1);
  const { inicio: inicioJanela } = limitesDoMes(-24);
  const { inicio: inicioMesAtual } = limitesDoMes(0);

  const supabase = await criarClienteServidor();

  const [mesAtual, mesAnteriorRes, proximos, nomesAntigosRes] = await Promise.all([
    listarAgendamentosDoMes(0),
    supabase
      .from("agendamentos")
      .select("valor_recebido_reais, preco_reais, status")
      .gte("data_agendada", inicioMesAnterior)
      .lte("data_agendada", fimMesAnterior)
      .returns<Pick<Agendamento, "valor_recebido_reais" | "preco_reais" | "status">[]>(),
    listarProximos(40),
    supabase
      .from("agendamentos")
      .select("cliente_nome")
      .gte("data_agendada", inicioJanela)
      .lt("data_agendada", inicioMesAtual)
      .returns<Pick<Agendamento, "cliente_nome">[]>(),
  ]);
  relatarErro("Falha ao consultar o mês anterior", mesAnteriorRes.error);
  relatarErro("Falha ao consultar clientes anteriores", nomesAntigosRes.error);

  const hojeLista = mesAtual.filter((a) => a.data_agendada === hoje);

  const contagemStatus = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<StatusAgendamento, number>;
  for (const a of mesAtual) contagemStatus[a.status]++;
  const totalMes = mesAtual.length;

  const receitaMes = mesAtual
    .filter((a) => a.status === "concluido")
    .reduce((soma, a) => soma + Number(a.valor_recebido_reais ?? a.preco_reais ?? 0), 0);

  const receitaMesAnterior = (mesAnteriorRes.data ?? [])
    .filter((a) => a.status === "concluido")
    .reduce((soma, a) => soma + Number(a.valor_recebido_reais ?? a.preco_reais ?? 0), 0);

  const variacaoReceita =
    receitaMesAnterior > 0 ? ((receitaMes - receitaMesAnterior) / receitaMesAnterior) * 100 : null;

  const taxaCancelamento = totalMes > 0 ? (contagemStatus.cancelado / totalMes) * 100 : 0;
  const taxaFalta = totalMes > 0 ? (contagemStatus.faltou / totalMes) * 100 : 0;

  const porServico = new Map<string, { quantidade: number; receita: number }>();
  for (const a of mesAtual) {
    if (a.status === "cancelado") continue;
    const atual = porServico.get(a.servico_nome) ?? { quantidade: 0, receita: 0 };
    atual.quantidade++;
    if (a.status === "concluido") atual.receita += Number(a.valor_recebido_reais ?? a.preco_reais ?? 0);
    porServico.set(a.servico_nome, atual);
  }
  const rankingServicos = [...porServico.entries()]
    .map(([nome, v]) => ({ nome, ...v }))
    .sort((a, b) => b.receita - a.receita || b.quantidade - a.quantidade)
    .slice(0, 6);

  const mapaCalor: number[][] = Array.from({ length: 7 }, () => Array(BLOCOS_HORA.length).fill(0));
  for (const a of mesAtual) {
    if (a.status === "cancelado") continue;
    mapaCalor[diaDaSemanaLocal(a.data_agendada)][blocoDaHora(a.hora_agendada)]++;
  }

  const nomesAntigos = new Set((nomesAntigosRes.data ?? []).map((r) => normalizarNome(r.cliente_nome)));
  const clientesDoMes = new Set(mesAtual.map((a) => normalizarNome(a.cliente_nome)));
  let clientesNovos = 0;
  let clientesRecorrentes = 0;
  for (const nome of clientesDoMes) {
    if (nomesAntigos.has(nome)) clientesRecorrentes++;
    else clientesNovos++;
  }

  return {
    mesAtual,
    hoje: hojeLista,
    proximos,
    receitaMes,
    receitaMesAnterior,
    variacaoReceita,
    contagemStatus,
    totalMes,
    taxaCancelamento,
    taxaFalta,
    rankingServicos,
    mapaCalor,
    clientesNovos,
    clientesRecorrentes,
  };
}

export const BLOCOS_HORA_ROTULO = BLOCOS_HORA;
export const DIAS_SEMANA_ROTULO = DIAS_SEMANA;
