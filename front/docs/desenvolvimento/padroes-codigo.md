# Padrões de Código

## Convenções observadas

- TypeScript em páginas, stores, services e interfaces
- `script setup` em componentes Vue
- Stores com estrutura `state/getters/actions`
- Services separados por domínio

## Fluxo padrão por funcionalidade

1. Interface em `interface/`
2. Service em `service/`
3. Store em `stores/`
4. Página/componente consumindo store

## Nomeação

- `*Store.ts` para store
- `*Service.ts` para serviço
- `*Interface.ts` para tipagem
- páginas seguindo convenção de rota do Nuxt

## Estilo e UI

- SCSS com variáveis globais
- componentes reutilizáveis antes de customização local

## Erros e feedback

- `try/catch` nas ações assíncronas
- feedback visual via `alertStore`
