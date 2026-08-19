import { NextResponse } from "next/server";
import { lerConfigSupabase } from "@/lib/env";

export const dynamic = "force-dynamic";

const TIMEOUT_MS = 5000;

type EstadoBanco =
  | { estado: "ok" }
  | { estado: "nao_configurado"; faltando: readonly string[] }
  | { estado: "erro"; detalhe: string };

/**
 * Bate na raiz da API REST do Supabase. Nao depende de nenhuma tabela existir,
 * entao serve como prova de conectividade desde o primeiro deploy.
 */
async function checarBanco(): Promise<EstadoBanco> {
  const resultado = lerConfigSupabase({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  if (!resultado.ok) {
    return { estado: "nao_configurado", faltando: resultado.faltando };
  }

  try {
    const resposta = await fetch(`${resultado.config.url}/rest/v1/`, {
      headers: { apikey: resultado.config.chaveAnonima },
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    return resposta.ok
      ? { estado: "ok" }
      : { estado: "erro", detalhe: `HTTP ${resposta.status}` };
  } catch (erro) {
    const detalhe = erro instanceof Error ? erro.message : String(erro);
    return { estado: "erro", detalhe };
  }
}

/**
 * GET /api/health
 *
 * Prova a cadeia inteira: a Vercel serviu, o codigo rodou, o Supabase respondeu.
 * Enquanto as chaves nao existirem responde 200 com banco "nao_configurado" —
 * a app sobe antes do banco existir, de proposito.
 */
export async function GET() {
  const banco = await checarBanco();
  const status = banco.estado === "erro" ? 503 : 200;

  return NextResponse.json(
    {
      app: "ok",
      banco,
      ambiente: process.env.VERCEL_ENV ?? "local",
    },
    { status },
  );
}
