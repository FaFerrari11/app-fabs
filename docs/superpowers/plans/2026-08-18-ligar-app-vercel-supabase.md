# Plano — ligar a app ao Vercel e ao Supabase

**Status:** em standby desde 18/08/2026.
**Retomar por:** bloco 1, tarefa 1.1.

## Estado atual

O que já está pronto e verificado:

- Repositório `FaFerrari11/app-fabs` público, CI verde (lint, tipos, testes, build).
- Esqueleto Next.js 16 + TypeScript, clientes Supabase de browser e de servidor,
  `/api/health` respondendo `200` com `banco: nao_configurado`.
- Projetos criados na Vercel e no Supabase — **ainda não conectados à app.**

O que falta é só fiação: as duas chaves do Supabase precisam chegar ao `.env.local`
(local) e às variáveis de ambiente da Vercel (produção).

---

## Bloco 1 — Conectar o banco localmente

- [ ] **1.1** Copiar `.env.example` para `.env.local`.
- [ ] **1.2** No painel do Supabase, em *Project Settings → API*, copiar a *Project URL*
      para `NEXT_PUBLIC_SUPABASE_URL` e a chave *anon public* para
      `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [ ] **1.3** Rodar `npm run dev` e abrir <http://localhost:3000/api/health>.
      **Critério de pronto:** a resposta traz `"banco":{"estado":"ok"}`.
      Se vier `"estado":"erro"`, o campo `detalhe` diz o que houve.

Nada a commitar neste bloco — `.env.local` é ignorado pelo git de propósito.

## Bloco 2 — Conectar a produção

- [ ] **2.1** Em <https://vercel.com/new>, importar o repositório `app-fabs`.
- [ ] **2.2** Cadastrar `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
      nos três ambientes (Production, Preview, Development).
- [ ] **2.3** Disparar o deploy e conferir `https://<projeto>.vercel.app/api/health`.
      **Critério de pronto:** `"banco":{"estado":"ok"}` e `"ambiente":"production"`.

## Bloco 3 — Fechar o banco antes de qualquer dado real

Este bloco vem **antes** de criar tabela com conteúdo de verdade, não depois.

- [ ] **3.1** Ativar Row Level Security em toda tabela criada. A chave `anon` é pública
      por design: sem RLS, qualquer visitante lê e escreve o banco inteiro.
- [ ] **3.2** Escrever as policies de leitura e escrita por tabela.
- [ ] **3.3** Confirmar que a chave `service_role` não aparece em nenhuma variável
      `NEXT_PUBLIC_`, no `.env.example` nem em código que chega ao browser.

## Bloco 4 — Decidir o que fazer com a pausa do free tier

- [ ] **4.1** O projeto Supabase pausa após 7 dias sem nenhuma query e leva ~30 s para
      acordar. Decidir entre: (a) aceitar a pausa enquanto for só estudo, ou
      (b) um cron que bate em `/api/health` a cada poucos dias.
      A opção (b) mantém a app viva mas é gambiarra — se a disponibilidade
      passar a importar de verdade, o projeto já saiu do free tier.

## Bloco 5 — Definir o que a app faz

Até aqui existe infraestrutura, não produto. Este bloco é o que dá assunto ao resto.

- [ ] **5.1** Brainstorm do domínio da aplicação: qual problema ela resolve, para quem.
- [ ] **5.2** Spec em `docs/superpowers/specs/`.
- [ ] **5.3** Plano derivado da spec, em `docs/superpowers/plans/`.
- [ ] **5.4** Implementação em TDD, um commit por tarefa.

## Bloco 6 — Só quando for publicar para outras pessoas

- [ ] **6.1** Registrar domínio no Registro.br (R$ 40/ano, exige CPF ou CNPJ).
- [ ] **6.2** Apontar o domínio para a Vercel.
- [ ] **6.3** Criar conta no Resend e verificar o domínio (necessário para enviar
      e-mail de endereço próprio; teto de 3.000/mês e **100/dia**).
- [ ] **6.4** Criar conta no Sentry e configurar amostragem antes de abrir ao público
      (teto de 5.000 erros/mês).
- [ ] **6.5** Reler a trava não-comercial do plano Hobby da Vercel. Anúncio, afiliado,
      doação ou qualquer cobrança exigem o Pro a US$ 20/assento/mês.

---

## Pendência em aberto

- **`npx plugins add vercel/vercel-plugin`** ficou sem rodar: o comando foi bloqueado
  pelo classificador de permissões. O pacote foi conferido e é legítimo
  (`plugins` v1.3.4, publicado pelo vercel-labs). Falta decidir se ele entra no nível
  do usuário — para valer em qualquer repositório — ou preso ao `app-fabs`.

## Referências

- Documento da stack, com todos os tetos do free tier e as fontes:
  <https://claude.ai/code/artifact/d88740e4-52bc-43d2-b9cd-410dd8e7395e>
- Convenções do projeto: `CLAUDE.md`
- Como rodar e publicar: `README.md`
