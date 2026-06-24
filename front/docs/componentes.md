# Componentes

## Estrutura de componentes

A pasta `components/` concentra componentes base e por domínio.

## Componentes globais importantes

- `Alert/index.vue`: notificação global controlada por `alertStore`
- `Loading/index.vue`: estado de carregamento visual
- `Header/index.vue`: notificações, perfil, troca de senha e logout
- `Menu/*`: navegação lateral com filtro por permissão
- `Butao/index.vue`: botão padrão do projeto
- `Modal/index.vue`: container base de modal

## Componentes de formulário

- `Input/index.vue`: componente dinâmico (text, select, checkbox, file, autocomplete, etc.)
- `Forms/index.vue`: renderização declarativa com estrutura de `forms/*`
- `Forms/VariasSessoes.vue`: formulário com múltiplas seções
- `Section/SimplesForm.vue`: base visual de formulários

## Componentes de listagem/tabela

- `Tabela/index.vue`: tabela desktop + cards mobile, ordenação e ações
- `Section/TabelaFiltroPaginacao.vue`: integração de filtro, busca e paginação
- `Filtro/index.vue`: modal lateral de filtros
- `Paginador/index.vue`: paginação

## Reutilização

Reutilize primeiro componentes base (`Input`, `Modal`, `Tabela`, `Section/*`). Só crie componente específico quando houver regra de domínio forte.

Veja [Criação de Componentes](desenvolvimento/criacao-componentes.md).
