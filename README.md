# Minhas Finanças

Controle de despesas fixas mensais: o que já foi pago e o que falta pagar em cada mês.

**Stack:** Next.js (front e back), Supabase (login com Google + Postgres com RLS), shadcn/ui.

## Rodando localmente

1. `npm install`
2. Copie `.env.example` para `.env.local` e preencha a URL e a chave publishable do Supabase.
3. No Supabase, rode [`supabase/schema.sql`](./supabase/schema.sql) no SQL Editor e ative o provedor Google em Authentication → Providers.
4. `npm run dev` e abra http://localhost:3000.

## Adicionando módulos

Crie `app/(admin)/<rota>/page.tsx` e registre o item em [`lib/nav.ts`](./lib/nav.ts).

## Ideias futuras

### Privacidade dos dados (criptografia)

Hoje o administrador do projeto Supabase consegue ler os dados de todos os usuários. Se o app for aberto a outras pessoas e elas não quiserem isso, as opções são:

| Opção | Quem lê os dados | Observação |
|---|---|---|
| **A. Ponta a ponta** | Só o usuário | Senha de "cofre" separada do Google; chave derivada no navegador (PBKDF2/Argon2) e dados cifrados com AES-GCM. Totais e filtros passam a ser calculados no cliente. Esqueceu a senha, perdeu os dados (mitigar com chave de recuperação). |
| **B. Só no dispositivo** | Só o usuário | Nada no servidor; perde acesso multi-aparelho e backup. |
| **C. Chave do servidor** | Administrador (decifra), mas o painel do banco mostra só texto cifrado | Simples; protege de vazamento do banco, não do dono do app. |
| **D. Manter como está** | Administrador | Documentar em política de privacidade. |

O login do Google continua só identificando o usuário; ele não pode servir de chave de criptografia. Decisão pendente.
