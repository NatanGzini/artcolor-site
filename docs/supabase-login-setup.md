# Integração Supabase Auth - Artcolor

Este guia conecta a tela de login do site ao Supabase Free.

## 1. Criar o projeto

1. Acesse https://supabase.com/dashboard.
2. Crie uma organização ou use uma existente.
3. Crie um projeto no plano Free.
4. Guarde a senha do banco em local seguro. Ela não deve ir para o site.

## 2. Configurar o site

No painel do Supabase, abra:

`Project Settings > API`

Copie:

- Project URL
- anon public key

Cole em `extensao-produtos/supabase-config.js`:

```js
export const SUPABASE_CONFIG = {
  url: "https://SEU-PROJETO.supabase.co",
  anonKey: "SUA_ANON_PUBLIC_KEY",
};
```

Nunca use `service_role` no frontend. A chave `service_role` é privada e só pode ficar em backend seguro.

## 3. URLs de autenticação

No Supabase, abra:

`Authentication > URL Configuration`

Configure:

- Site URL: `https://artcolorcv.com.br`
- Redirect URLs:
  - `https://artcolorcv.com.br/login.html`
  - `https://artcolorcv.com.br/reset-password.html`
  - `http://127.0.0.1:4173/login.html`
  - `http://127.0.0.1:4173/reset-password.html`

As URLs locais servem para teste durante desenvolvimento.

## 4. Rodar SQL inicial

Abra:

`SQL Editor`

Execute o arquivo:

`docs/supabase-profiles.sql`

Ele cria a tabela `profiles`, ativa Row Level Security e garante que cada cliente veja e edite apenas o próprio perfil.

## 5. Fluxo esperado

- Cliente cria conta em `login.html`.
- Supabase envia e-mail de confirmação.
- Cliente confirma o e-mail.
- Cliente entra com e-mail e senha.
- Recuperação de senha envia link para `reset-password.html`.

## 6. Segurança

- Senhas são tratadas pelo Supabase Auth.
- O frontend usa somente a chave pública anon.
- Regras de acesso ficam no banco com RLS.
- Administradores, produtos, pedidos e pagamentos devem ter políticas próprias antes de produção real.
