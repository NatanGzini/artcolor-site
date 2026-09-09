# Separacao de cargos - Artcolor

Este documento registra a primeira versao da separacao de cargos do site. A tela pode esconder ou mostrar areas, mas a seguranca real deve ficar no Supabase com RLS, policies e funcoes controladas.

## Cargos

`customer`

- Cargo padrao de toda conta criada pelo site.
- Pode acessar a area do cliente.
- Deve ver somente os proprios dados, pedidos, orcamentos e compras.
- Nao pode cadastrar produtos, mudar valores ou ver dados de outros clientes.

`staff`

- Equipe operacional.
- Pode acessar o painel interno.
- Deve acompanhar pedidos e etapas de producao.
- Nao deve aprovar produto novo sozinho nem alterar preco final sem permissao superior.

`admin`

- Administrador de alto nivel.
- Pode acessar o painel interno.
- Pode alterar produtos, valores e aprovar publicacoes.
- Deve ser uma das duas etapas para liberar produto novo.

`developer`

- Desenvolvedor responsavel pelo sistema.
- Pode acessar o painel interno.
- Pode ajustar estrutura tecnica, seguranca, banco e integracoes.
- Nao deve usar chave secreta no frontend nem contornar RLS em paginas publicas.

## Fluxo de login

1. Usuario entra em `login.html`.
2. Supabase autentica e retorna a sessao.
3. O site busca `profiles.role` pelo usuario autenticado.
4. Se o cargo for `customer`, redireciona para `area-cliente.html`.
5. Se o cargo for `staff`, `admin` ou `developer`, redireciona para `painel-interno.html`.
6. Cada pagina valida a sessao novamente ao carregar.

## Regra de seguranca

- O cargo nunca deve vir de formulario publico.
- Cliente novo sempre nasce como `customer`.
- Alteracao de cargo deve ser feita manualmente no Supabase, por alguem autorizado, ate criarmos um painel administrativo seguro.
- Qualquer tabela futura de pedidos, produtos, pagamentos e arquivos precisa ter RLS antes de uso real.

## Produtos

Fluxo planejado:

1. Admin ou developer cria rascunho do produto.
2. Outro admin ou developer revisa.
3. Produto so aparece no site quando passar por duas etapas de aprovacao.
4. Produto com preco sem alteracao por mais de 6 meses gera alerta interno.

## Pedidos

Fluxo planejado:

1. Cliente cria pedido ou orcamento.
2. Cliente visualiza apenas os proprios pedidos.
3. Equipe visualiza pedidos operacionais.
4. Admin e developer visualizam indicadores e podem corrigir problemas.
5. Pagamento futuro deve usar webhook validado no backend, nunca confirmacao vinda apenas do navegador.
