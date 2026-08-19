@AGENTS.md

# app-fabs

Web app full-stack no free tier: Next.js na Vercel, Postgres e autenticação no Supabase.
Continuação do `teste-fabs` — lá o objeto de estudo era o ciclo agêntico numa biblioteca
sem dependências; aqui é o mesmo ciclo numa stack de produção de verdade.

## Comandos

```bash
npm run dev        # servidor de desenvolvimento
npm test           # suíte (Vitest, uma passada)
npm run test:watch # suíte em modo watch
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run build      # build de produção (o que a Vercel roda)
```

## Configuração

Copie `.env.example` para `.env.local` e preencha com as chaves do painel do Supabase
(Project Settings → API). Sem isso a app **sobe assim mesmo**: `/api/health` responde
`banco: nao_configurado` em vez de quebrar. Isso é intencional — o deploy não depende
de o banco existir primeiro.

A chave `service_role` nunca entra em variável `NEXT_PUBLIC_`, nem no `.env.example`.

## Convenções

- **Documentação e código em português.** Nomes de função e variável em português;
  pastas canônicas e nomes de framework em inglês (`src/app`, `route.ts`, `tests/`).
- **TypeScript estrito.** Nada de `any` para calar o compilador — se o tipo está
  difícil, o desenho provavelmente está errado.
- **Um arquivo, uma responsabilidade.** `src/lib/env.ts` só valida ambiente;
  `src/lib/supabase/` só constrói clientes; a rota só orquestra. Regra de negócio
  não mora em Route Handler.
- **Ambiente lido por parâmetro, não por `process.env` direto.** `lerConfigSupabase`
  recebe a fonte, e é isso que a torna testável sem sujar o processo.
- **Cliente Supabase por requisição.** `criarClienteServidor()` lê o cookie da
  requisição atual — nunca guarde o retorno em variável de módulo.

## Fluxo de trabalho

- Toda mudança começa por um teste que falha. Escreve o teste, roda, vê falhar,
  implementa o mínimo, roda, vê passar, commita.
- **Um commit por tarefa do plano**, com a mensagem que o próprio plano especifica.
- Specs em `docs/superpowers/specs/`, planos em `docs/superpowers/plans/`.
  Antes de mexer no código, leia o plano vigente — ele diz quais arquivos tocar.
- Ao terminar uma tarefa, marque o checkbox dela no arquivo do plano.

## Estrutura

```
src/lib/env.ts            validação das variáveis de ambiente (pura, testada)
src/lib/supabase/client.ts  cliente de browser
src/lib/supabase/server.ts  cliente de servidor, com sessão em cookie
src/app/api/health/         prova de vida: app + banco
tests/                      suíte Vitest
docs/superpowers/           specs e planos do ciclo
.github/workflows/ci.yml    lint, tipos, testes e build a cada push
```

## Onde olhar primeiro

1. `README.md` — como rodar e como publicar
2. `src/app/api/health/route.ts` — a cadeia inteira em um arquivo
3. `docs/superpowers/specs/` — a spec vigente, quando existir
