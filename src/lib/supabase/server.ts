import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { lerConfigSupabase, mensagemConfigFaltando } from "@/lib/env";

/**
 * Cliente Supabase para Server Components, Route Handlers e Server Actions.
 *
 * A sessao do usuario vive em cookie: por isso o cliente precisa ler e escrever
 * o cookie store da requisicao atual, e por isso ele nunca deve ser reaproveitado
 * entre requisicoes.
 */
export async function criarClienteServidor() {
  const resultado = lerConfigSupabase({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  if (!resultado.ok) {
    throw new Error(mensagemConfigFaltando(resultado.faltando));
  }

  const cookieStore = await cookies();

  return createServerClient(resultado.config.url, resultado.config.chaveAnonima, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesParaGravar) {
        try {
          for (const { name, value, options } of cookiesParaGravar) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Component nao pode gravar cookie. O middleware renova a
          // sessao, entao aqui o silencio e intencional e nao esconde bug.
        }
      },
    },
  });
}
