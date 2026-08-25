"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente do navegador — usado pelo site público para registrar o pedido de
 * agendamento antes de abrir o WhatsApp. A chave é a anon pública: a política
 * de segurança do banco só deixa esse cliente *inserir* um pedido pendente,
 * nunca ler ou alterar agendamentos.
 */
export function criarClienteNavegador() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
