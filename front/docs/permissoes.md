# Permissões

## Mecanismo utilizado

Permissões são controladas por:

- constante `constants/Permissao.ts`
- método `pessoaStore.possuiPermissao(...)`
- middleware `middleware/permissao.ts`
- filtros de menu em `Menu/NavBar.vue` e `pages/index.vue`

## Como funciona

1. Página define `definePageMeta({ middleware: ['permissao'], permission: Permissao.X })`.
2. Middleware carrega `pessoaStore.fetchMe(...)` quando necessário.
3. Se a permissão não existir no perfil, exibe alerta e redireciona para `/`.

## Fonte de permissões

As permissões vêm de `pessoa.funcionario.perfil.permissoes` e são comparadas via slug (`FormatString.slugify`).

## Menu dinâmico por permissão

A árvore de navegação (`mixins/menuConfigMixin.ts`) inclui campo `permissao` por item/subitem.

- Itens são filtrados recursivamente antes de renderização.
- Itens sem permissão explícita são exibidos.

!!! warning
    Algumas páginas privadas não usam middleware `permissao` explícito (ex.: `/aviso`), mas continuam protegidas por autenticação global.
