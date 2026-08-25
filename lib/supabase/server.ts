import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Cliente de servidor — usado nas páginas e ações do painel admin. Lê a
 * sessão dos cookies; a autorização real vem das políticas de RLS no banco,
 * amarradas ao usuário autenticado (`to authenticated`).
 */
export async function criarClienteServidor() {
  const cookieStore = await cookies();

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(paraDefinir) {
        try {
          for (const { name, value, options } of paraDefinir) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Chamado de um Server Component (sem permissão de escrever cookie).
          // O middleware já cuida de renovar a sessão a cada requisição.
        }
      },
    },
  });
}
