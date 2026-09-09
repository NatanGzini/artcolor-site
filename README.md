# Artcolor Comunicação Visual

Site institucional da Artcolor Comunicação Visual, com catálogo de produtos, vídeo institucional, página de orçamento rápido e documentação pública para leitura por IAs.

## Estrutura

- `extensao-produtos/index.html`: página principal do site.
- `extensao-produtos/styles.css`: estilos visuais e responsivos.
- `extensao-produtos/script.js`: navegação, catálogo, busca e controles da página principal.
- `extensao-produtos/orcamento.html`: página separada de orçamento rápido.
- `extensao-produtos/orcamento.js`: validação local e montagem segura da mensagem para WhatsApp.
- `extensao-produtos/login.html`: tela de login, cadastro e recuperação preparada para Supabase Auth.
- `extensao-produtos/area-cliente.html`: área autenticada para clientes.
- `extensao-produtos/painel-interno.html`: área autenticada para equipe, admin e desenvolvedor.
- `extensao-produtos/account-area.js`: valida sessão, lê o cargo no Supabase e protege as áreas autenticadas.
- `extensao-produtos/reset-password.html`: página de redefinição de senha para links de recuperação.
- `extensao-produtos/supabase-config.js`: configuração pública do Supabase, usando apenas URL e anon key.
- `extensao-produtos/llms.txt`: resumo do site para sistemas de IA.
- `extensao-produtos/assets/`: imagens, marca e vídeo institucional.
- `docs/supabase-login-setup.md`: passo a passo para conectar o Supabase Free.
- `docs/supabase-profiles.sql`: SQL inicial de perfis com Row Level Security.
- `docs/access-control-plan.md`: plano de separação de cargos e permissões.
- `docs/supabase-email-templates.md`: modelos de e-mail para usar quando houver SMTP próprio.

## Como abrir localmente

Abra `extensao-produtos/index.html` no navegador.

## Observações de segurança

O formulário de orçamento monta uma mensagem para WhatsApp no navegador, sem salvar os dados no site.

O login está preparado para Supabase Auth. Use somente a URL do projeto e a chave pública `anon` no frontend. Nunca coloque `service_role`, senha de banco, token de gateway ou qualquer segredo em arquivos públicos.

Quando o projeto evoluir para loja online com gateway de pagamento, recomenda-se adicionar backend seguro, variáveis de ambiente para chaves privadas, validação no servidor, proteção contra CSRF, rate limit e integração oficial do provedor de pagamento.
