import { describe, it, expect } from "vitest";
import {
  lerConfigSupabase,
  mensagemConfigFaltando,
  VARIAVEIS_SUPABASE,
} from "@/lib/env";

const COMPLETO = {
  NEXT_PUBLIC_SUPABASE_URL: "https://exemplo.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "chave-anonima",
} as const;

describe("lerConfigSupabase", () => {
  it("aceita uma configuracao completa", () => {
    const resultado = lerConfigSupabase(COMPLETO);

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.config.url).toBe("https://exemplo.supabase.co");
    expect(resultado.config.chaveAnonima).toBe("chave-anonima");
  });

  it("remove a barra final da URL para nao gerar // ao concatenar caminho", () => {
    const resultado = lerConfigSupabase({
      ...COMPLETO,
      NEXT_PUBLIC_SUPABASE_URL: "https://exemplo.supabase.co///",
    });

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.config.url).toBe("https://exemplo.supabase.co");
  });

  it("apara espacos em volta dos valores", () => {
    const resultado = lerConfigSupabase({
      NEXT_PUBLIC_SUPABASE_URL: "  https://exemplo.supabase.co  ",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "  chave-anonima  ",
    });

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.config.chaveAnonima).toBe("chave-anonima");
  });

  it("reporta todas as variaveis ausentes de uma vez", () => {
    const resultado = lerConfigSupabase({});

    expect(resultado.ok).toBe(false);
    if (resultado.ok) return;
    expect(resultado.faltando).toEqual([...VARIAVEIS_SUPABASE]);
  });

  it("trata string vazia e so-espacos como ausente", () => {
    const resultado = lerConfigSupabase({
      NEXT_PUBLIC_SUPABASE_URL: "",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "   ",
    });

    expect(resultado.ok).toBe(false);
    if (resultado.ok) return;
    expect(resultado.faltando).toEqual([...VARIAVEIS_SUPABASE]);
  });
});

describe("mensagemConfigFaltando", () => {
  it("nomeia a variavel e diz o que fazer", () => {
    const mensagem = mensagemConfigFaltando(["NEXT_PUBLIC_SUPABASE_URL"]);

    expect(mensagem).toContain("NEXT_PUBLIC_SUPABASE_URL");
    expect(mensagem).toContain(".env.local");
  });
});
