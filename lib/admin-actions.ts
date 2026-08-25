"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { criarClienteServidor } from "./supabase/server";
import type { StatusAgendamento } from "./agendamentos-tipos";

const STATUSES_VALIDOS: StatusAgendamento[] = ["pendente", "confirmado", "concluido", "cancelado", "faltou"];

function numeroOuNulo(valor: FormDataEntryValue | null) {
  if (!valor) return null;
  const texto = String(valor).replace(",", ".").trim();
  if (!texto) return null;
  const n = Number(texto);
  return Number.isFinite(n) ? n : null;
}

export async function atualizarStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !STATUSES_VALIDOS.includes(status as StatusAgendamento)) {
    throw new Error("Dados inválidos para atualizar o agendamento.");
  }

  const supabase = await criarClienteServidor();
  const atualizacao: Record<string, unknown> = { status };

  if (status === "concluido") {
    atualizacao.valor_recebido_reais = numeroOuNulo(formData.get("valorRecebido"));
    atualizacao.motivo_cancelamento = null;
  } else if (status === "cancelado") {
    const motivo = String(formData.get("motivo") ?? "").trim();
    atualizacao.motivo_cancelamento = motivo || "Sem motivo informado";
    atualizacao.valor_recebido_reais = null;
  } else {
    atualizacao.motivo_cancelamento = null;
    atualizacao.valor_recebido_reais = null;
  }

  const { error } = await supabase.from("agendamentos").update(atualizacao).eq("id", id);
  if (error) throw new Error(`Não foi possível atualizar: ${error.message}`);

  revalidatePath("/admin");
  revalidatePath("/admin/agendamentos");
}

export async function apagarAgendamento(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Agendamento inválido.");

  const supabase = await criarClienteServidor();
  const { error } = await supabase.from("agendamentos").delete().eq("id", id);
  if (error) throw new Error(`Não foi possível apagar: ${error.message}`);

  revalidatePath("/admin");
  revalidatePath("/admin/agendamentos");
}

export async function criarAgendamentoManual(formData: FormData) {
  const obrigatorio = (chave: string) => {
    const valor = String(formData.get(chave) ?? "").trim();
    if (!valor) throw new Error(`Preencha o campo "${chave}".`);
    return valor;
  };

  const supabase = await criarClienteServidor();
  const { error } = await supabase.from("agendamentos").insert({
    servico_id: obrigatorio("servicoId"),
    servico_nome: obrigatorio("servicoNome"),
    servico_categoria: obrigatorio("servicoCategoria"),
    servico_opcao: String(formData.get("servicoOpcao") ?? "").trim() || null,
    preco_reais: numeroOuNulo(formData.get("preco")),
    duracao_min: Number(formData.get("duracaoMin")) || 60,
    data_agendada: obrigatorio("data"),
    hora_agendada: obrigatorio("hora"),
    cliente_nome: obrigatorio("clienteNome"),
    cliente_observacao: String(formData.get("observacao") ?? "").trim() || null,
    status: "confirmado",
    origem: "manual",
  });
  if (error) throw new Error(`Não foi possível lançar o agendamento: ${error.message}`);

  revalidatePath("/admin");
  revalidatePath("/admin/agendamentos");
}

export async function entrar(_estadoAnterior: { erro?: string } | undefined, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const senha = String(formData.get("senha") ?? "");

  if (!email || !senha) return { erro: "Preencha e-mail e senha." };

  const supabase = await criarClienteServidor();
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (error) return { erro: "E-mail ou senha incorretos." };

  redirect("/admin");
}

export async function sair() {
  const supabase = await criarClienteServidor();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
