# Layouts

## Layouts existentes

**Layout principal**:

- `layouts/default.vue`

## O que o `default.vue` entrega

- `Header`
- `Menu` lateral com colapso e comportamento responsivo
- título/complemento da sessão (via `menuSectionsStore`)
- `Loading` central enquanto `pessoaStore.getCarregandoMe` está ativo

## Páginas sem layout padrão

Definem `definePageMeta({ layout: false })`:

- `pages/login.vue`
- `pages/contribuicao/index.vue`
- `pages/contribuicao/segunda-via.vue`
- `pages/contribuicao/gerar-comprovante.vue`
