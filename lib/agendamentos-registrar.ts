"use client";

import { criarClienteNavegador } from "./supabase/client";
import type { Servico } from "./services";

type PedidoParaRegistrar = {
  servico: Servico;
  opcao?: string;
  diaIso: string;
  hora: string;
  nome: string;
  observacao: string;
};

/**
 * Registra o pedido no banco antes do WhatsApp abrir, via uma função (RPC)
 * — o site nunca toca a tabela `agendamentos` diretamente: o anônimo não tem
 * nenhum privilégio nela, só a permissão de executar esta função, que valida
 * e insere como 'pendente'/'site'.
 *
 * Nunca lança erro nem bloqueia a navegação — o WhatsApp é o caminho
 * principal de conversão e continua funcionando mesmo se o banco cair. O
 * admin também pode lançar o agendamento manualmente se um pedido não
 * chegar a ser salvo.
 */
export function registrarPedido(pedido: PedidoParaRegistrar) {
  try {
    const supabase = criarClienteNavegador();
    void supabase
      .rpc("registrar_agendamento", {
        p_servico_id: pedido.servico.id,
        p_servico_nome: pedido.servico.nome,
        p_servico_categoria: pedido.servico.categoria,
        p_servico_opcao: pedido.opcao ?? null,
        p_preco_reais: pedido.servico.preco,
        p_duracao_min: pedido.servico.duracaoMin,
        p_data_agendada: pedido.diaIso,
        p_hora_agendada: pedido.hora,
        p_cliente_nome: pedido.nome,
        p_cliente_observacao: pedido.observacao.trim() || null,
      })
      .then(({ error }) => {
        if (error) console.warn("Não foi possível registrar o pedido no painel:", error.message);
      });
  } catch (erro) {
    console.warn("Não foi possível registrar o pedido no painel:", erro);
  }
}
