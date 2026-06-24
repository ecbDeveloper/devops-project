# Tratamento de Erros

## Padrão atual

O tratamento é majoritariamente local (store/página/componente) com `try/catch`.

## Feedback para usuário

`alertStore` controla mensagens com tipos:

- `success`
- `error`
- `warning`
- `info`

`components/Alert/index.vue` renderiza o alerta com fechamento automático (5s).

## Erros de API

Padrão comum:

- `catch` em actions da store
- repasse da exceção (`throw e`)
- decisão final de mensagem na página/componente

## Loading e estado vazio

- `Loading` é usado em várias páginas (ex.: listagens e detalhe).
- `Tabela/index.vue` mostra fallback: `Ainda não possui registros cadastrados.`

## Padrões não identificados

- handler global único para erros HTTP
- estratégia unificada de retry/backoff
- padrão universal de empty state além dos componentes atuais
