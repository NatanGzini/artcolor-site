# Templates de e-mail - Supabase Auth

Estes modelos foram preparados para os e-mails gratuitos do fluxo de login da Artcolor. Em projetos Free novos, o Supabase so libera a edicao dos templates quando um SMTP proprio esta configurado em `Authentication > Emails > SMTP Settings`.

Variavel principal usada pelo Supabase:

```txt
{{ .ConfirmationURL }}
```

Ela deve permanecer exatamente assim, porque o Supabase troca esse valor pelo link real de confirmacao, recuperacao ou verificacao.

## Confirmar cadastro

Assunto:

```txt
Confirme seu cadastro na Artcolor
```

HTML:

```html
<div style="margin:0;padding:0;background:#111111;font-family:Inter,Arial,sans-serif;color:#f7f7f7;">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
    <div style="border:1px solid #f4c21b;background:#1b1a16;border-radius:8px;overflow:hidden;">
      <div style="padding:24px 24px 12px;">
        <h1 style="margin:0;color:#ffffff;font-size:26px;line-height:1.2;">Entre pro time Artcolor</h1>
        <p style="margin:14px 0 0;color:#d8d8d8;font-size:15px;line-height:1.6;">
          Falta so confirmar seu e-mail para liberar sua conta no site da Artcolor.
        </p>
      </div>
      <div style="padding:12px 24px 24px;">
        <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#ffcc29;color:#111111;text-decoration:none;font-weight:800;border-radius:6px;padding:14px 20px;font-size:15px;">
          Confirmar cadastro
        </a>
        <p style="margin:18px 0 0;color:#bdbdbd;font-size:13px;line-height:1.5;">
          Se voce nao criou uma conta na Artcolor, pode ignorar este e-mail com seguranca.
        </p>
      </div>
    </div>
  </div>
</div>
```

## Recuperar senha

Assunto:

```txt
Recupere sua senha da Artcolor
```

HTML:

```html
<div style="margin:0;padding:0;background:#111111;font-family:Inter,Arial,sans-serif;color:#f7f7f7;">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
    <div style="border:1px solid #f4c21b;background:#1b1a16;border-radius:8px;overflow:hidden;">
      <div style="padding:24px 24px 12px;">
        <h1 style="margin:0;color:#ffffff;font-size:26px;line-height:1.2;">Recuperacao de senha</h1>
        <p style="margin:14px 0 0;color:#d8d8d8;font-size:15px;line-height:1.6;">
          Recebemos uma solicitacao para redefinir a senha da sua conta Artcolor.
        </p>
      </div>
      <div style="padding:12px 24px 24px;">
        <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#ffcc29;color:#111111;text-decoration:none;font-weight:800;border-radius:6px;padding:14px 20px;font-size:15px;">
          Criar nova senha
        </a>
        <p style="margin:18px 0 0;color:#bdbdbd;font-size:13px;line-height:1.5;">
          Se voce nao pediu a recuperacao, ignore este e-mail. Sua senha atual continua a mesma.
        </p>
      </div>
    </div>
  </div>
</div>
```

## Magic link ou codigo

Assunto:

```txt
Seu acesso Artcolor
```

HTML:

```html
<div style="margin:0;padding:0;background:#111111;font-family:Inter,Arial,sans-serif;color:#f7f7f7;">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
    <div style="border:1px solid #f4c21b;background:#1b1a16;border-radius:8px;overflow:hidden;">
      <div style="padding:24px 24px 12px;">
        <h1 style="margin:0;color:#ffffff;font-size:26px;line-height:1.2;">Acesse sua conta Artcolor</h1>
        <p style="margin:14px 0 0;color:#d8d8d8;font-size:15px;line-height:1.6;">
          Use o botao abaixo para entrar com seguranca.
        </p>
      </div>
      <div style="padding:12px 24px 24px;">
        <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#ffcc29;color:#111111;text-decoration:none;font-weight:800;border-radius:6px;padding:14px 20px;font-size:15px;">
          Entrar na Artcolor
        </a>
        <p style="margin:18px 0 0;color:#bdbdbd;font-size:13px;line-height:1.5;">
          Se voce nao solicitou este acesso, ignore este e-mail.
        </p>
      </div>
    </div>
  </div>
</div>
```
