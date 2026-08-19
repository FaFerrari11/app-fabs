/**
 * Leitura e validacao das variaveis de ambiente do Supabase.
 *
 * A funcao recebe a fonte por parametro em vez de ler `process.env` direto:
 * assim ela e testavel sem sujar o ambiente do processo.
 */

export const VARIAVEIS_SUPABASE = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

export type VariavelSupabase = (typeof VARIAVEIS_SUPABASE)[number];

export type ConfigSupabase = {
  url: string;
  chaveAnonima: string;
};

export type ResultadoConfig =
  | { ok: true; config: ConfigSupabase }
  | { ok: false; faltando: VariavelSupabase[] };

export function lerConfigSupabase(
  fonte: Partial<Record<VariavelSupabase, string | undefined>>,
): ResultadoConfig {
  const faltando = VARIAVEIS_SUPABASE.filter(
    (nome) => !fonte[nome] || fonte[nome]!.trim() === "",
  );

  if (faltando.length > 0) {
    return { ok: false, faltando };
  }

  return {
    ok: true,
    config: {
      url: fonte.NEXT_PUBLIC_SUPABASE_URL!.trim().replace(/\/+$/, ""),
      chaveAnonima: fonte.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim(),
    },
  };
}

/** Mensagem unica para quando faltar configuracao, usada em client e server. */
export function mensagemConfigFaltando(faltando: readonly string[]): string {
  return (
    `Faltam variaveis de ambiente: ${faltando.join(", ")}. ` +
    `Copie .env.example para .env.local e preencha com as chaves do seu projeto Supabase.`
  );
}
