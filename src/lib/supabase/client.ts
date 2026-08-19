"use client";

import { createBrowserClient } from "@supabase/ssr";
import { lerConfigSupabase, mensagemConfigFaltando } from "@/lib/env";

/**
 * Cliente Supabase para uso no browser.
 *
 * As variaveis sao citadas uma a uma de proposito: o Next substitui
 * `process.env.NEXT_PUBLIC_X` literalmente no bundle, entao passar o objeto
 * `process.env` inteiro resultaria em undefined no browser.
 */
export function criarClienteBrowser() {
  const resultado = lerConfigSupabase({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  if (!resultado.ok) {
    throw new Error(mensagemConfigFaltando(resultado.faltando));
  }

  return createBrowserClient(resultado.config.url, resultado.config.chaveAnonima);
}
