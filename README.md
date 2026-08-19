# app-fabs

Web app full-stack rodando inteiramente no free tier: **Next.js** hospedado na **Vercel**,
com **Postgres, autenticação e storage no Supabase**.

## Rodar localmente

```bash
npm install
cp .env.example .env.local   # preencha com as chaves do Supabase
npm run dev
```

Abra <http://localhost:3000/api/health>. A resposta diz em que pé está a cadeia:

```json
{ "app": "ok", "banco": { "estado": "ok" }, "ambiente": "local" }
```

Enquanto as chaves não estiverem preenchidas, `banco` responde
`{ "estado": "nao_configurado", "faltando": [...] }` e a app continua de pé.

## Verificação

```bash
npm test          # suíte
npm run typecheck # tipos
npm run lint      # eslint
npm run build     # o mesmo build que a Vercel roda
```

O CI no GitHub Actions roda os quatro a cada push em `main` e em cada pull request.

## Publicar

1. **Supabase** — crie um projeto em <https://supabase.com>. Em *Project Settings → API*,
   copie a *Project URL* e a chave *anon public*.
2. **Vercel** — importe este repositório em <https://vercel.com/new> (login pelo GitHub).
   Em *Environment Variables*, cadastre `NEXT_PUBLIC_SUPABASE_URL` e
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` com os mesmos valores do `.env.local`.
3. Cada `git push` na `main` publica sozinho.

## Tetos do free tier

Os limites de cada serviço, o que acontece ao estourar e a ordem de criação das contas
estão no documento da stack. Os dois que mordem primeiro:

- **Vercel Hobby é não-comercial.** Anúncio, afiliado, doação ou qualquer cobrança
  exigem o plano Pro.
- **Supabase pausa após 7 dias sem query** e leva cerca de 30 segundos para acordar.

## Segurança

A chave `anon` é pública por design — ela vai para o browser, e quem protege o dado é a
**Row Level Security** do Postgres. Antes de guardar qualquer dado real, ative RLS em
toda tabela. A chave `service_role` ignora RLS e nunca deve aparecer em variável
`NEXT_PUBLIC_`, no `.env.example` ou em qualquer código que chegue ao cliente.
