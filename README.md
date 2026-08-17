# Artcolor Comunicação Visual

Site institucional da Artcolor Comunicação Visual, com catálogo de produtos, vídeo institucional, página de orçamento rápido e documentação pública para leitura por IAs.

## Estrutura

- `extensao-produtos/index.html`: página principal do site.
- `extensao-produtos/styles.css`: estilos visuais e responsivos.
- `extensao-produtos/script.js`: navegação, catálogo, busca e controles da página principal.
- `extensao-produtos/orcamento.html`: página separada de orçamento rápido.
- `extensao-produtos/orcamento.js`: validação local e montagem segura da mensagem para WhatsApp.
- `extensao-produtos/llms.txt`: resumo do site para sistemas de IA.
- `extensao-produtos/assets/`: imagens, marca e vídeo institucional.

## Como abrir localmente

Abra `extensao-produtos/index.html` no navegador.

## Observações de segurança

O site atual é estático e não grava dados em banco. O formulário de orçamento monta uma mensagem para WhatsApp no navegador, sem salvar os dados no site.

Quando o projeto evoluir para loja online com gateway de pagamento, recomenda-se adicionar backend seguro, variáveis de ambiente para chaves privadas, validação no servidor, proteção contra CSRF, rate limit e integração oficial do provedor de pagamento.
