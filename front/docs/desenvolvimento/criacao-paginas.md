# Criação de Páginas

## Estrutura

Crie páginas em `pages/` respeitando o mapeamento automático do Nuxt.

Exemplos:

- `pages/modulo/index.vue` -> `/modulo`
- `pages/modulo/[id].vue` -> `/modulo/:id`

## Controle de layout

- Padrão: `layouts/default.vue`
- Para página sem layout: `definePageMeta({ layout: false })`

## Controle de acesso

Para rotas restritas por permissão:

```ts
definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.VISUALIZAR_X
})
```

## Título da sessão

Páginas autenticadas costumam atualizar cabeçalho com `menuSectionsStore.setTitulo` e `setComplemento`.

## Fluxo recomendado

1. Definir `definePageMeta`.
2. Carregar dados via store.
3. Exibir loading quando aplicável.
4. Usar componentes base de formulário/tabela/modal.
