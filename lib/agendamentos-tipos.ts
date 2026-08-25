export type StatusAgendamento = "pendente" | "confirmado" | "concluido" | "cancelado" | "faltou";

export type Agendamento = {
  id: string;
  criado_em: string;
  atualizado_em: string;
  servico_id: string;
  servico_nome: string;
  servico_categoria: string;
  servico_opcao: string | null;
  preco_reais: number | null;
  duracao_min: number;
  data_agendada: string; // AAAA-MM-DD
  hora_agendada: string; // HH:MM:SS
  cliente_nome: string;
  cliente_observacao: string | null;
  status: StatusAgendamento;
  valor_recebido_reais: number | null;
  motivo_cancelamento: string | null;
  origem: "site" | "manual";
};

export const rotuloStatus: Record<StatusAgendamento, string> = {
  pendente: "Pendente",
  confirmado: "Confirmado",
  concluido: "Concluído",
  cancelado: "Cancelado",
  faltou: "Faltou",
};

/** Fuso fixo do espaço — Quixeramobim (CE) não observa horário de verão. */
const FUSO = "America/Fortaleza";

export function hojeISO(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: FUSO }).format(new Date());
}

export function agoraHHMM(): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: FUSO,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

/** AAAA-MM do primeiro dia deste mês e do mês anterior, no fuso do espaço. */
export function limitesDoMes(deslocamentoMeses = 0) {
  const hoje = new Date(`${hojeISO()}T12:00:00`);
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth() + deslocamentoMeses;
  const inicio = new Date(ano, mes, 1);
  const fim = new Date(ano, mes + 1, 0);
  const paraISO = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return { inicio: paraISO(inicio), fim: paraISO(fim) };
}

export function formatarReais(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Preço a exibir num agendamento: valor recebido > preço combinado > "sob consulta". */
export function precoLabelSimples(a: { preco_reais: number | null; valor_recebido_reais?: number | null }) {
  const valor = a.valor_recebido_reais ?? a.preco_reais;
  return valor != null ? formatarReais(Number(valor)) : "Sob consulta";
}

export function formatarDataCurta(iso: string) {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export function formatarDataLonga(iso: string) {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

export function horaCurta(hhmmss: string) {
  return hhmmss.slice(0, 5);
}

/** Nome normalizado — usado só para agrupar "o mesmo cliente", nunca exibido. */
export function normalizarNome(nome: string) {
  return nome
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
