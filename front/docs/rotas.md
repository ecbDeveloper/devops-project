# Rotas

## Como as rotas são definidas

As rotas são geradas automaticamente pelo Nuxt a partir de `pages/`.

## Rotas públicas identificadas

No middleware global (`auth.global.ts`), a lista explícita de rotas públicas é:

- `/contribuicao`
- `/contribuicao/segunda-via`
- `/contribuicao/gerar-comprovante`
- `/login`

## Rotas com proteção por permissão

As páginas abaixo usam `definePageMeta({ middleware: ['permissao'], permission: ... })`:

- `/funcionario`, `/funcionario/cadastrar`, `/funcionario/:id`
- `/atendido`, `/atendido/cadastrar`, `/atendido/:id`, `/atendido/aceitacao`, `/atendido/aceitacao/:id`
- `/pet`, `/pet/cadastrar`, `/pet/:id`, `/pet/cadastrar/medicamento`, `/pet/medicamento`, `/pet/medicamento/:id`
- `/saude/cadastrar/ficha-medica`, `/saude/ficha-medica`, `/saude/ficha-medica/:id`
- `/material/*` (entrada, saída, produto, almoxarifado, categoria, tipo, unidade, origem-saida, relatório)
- `/memorando`, `/memorando/cadastrar`, `/memorando/:id`, `/memorando/despacho`
- `/socio`, `/socio/relatorio`, `/socio/gerar-carne-boleto`, `/socio/controle-contribuicao`, `/socio/tag`
- `/contribuicao/meio-pagamento`, `/contribuicao/meio-pagamento/regra`
- `/configuracao/permissao`
- `/dependente/:id`

## Observações de layout

Páginas com `layout: false`:

- `/login`
- `/contribuicao`
- `/contribuicao/segunda-via`
- `/contribuicao/gerar-comprovante`