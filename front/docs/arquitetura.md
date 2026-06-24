# Arquitetura do Software

## Visão arquitetural

O frontend usa arquitetura por camadas em Nuxt:

- **Pages**: entrada de cada rota (`pages/`)
- **Components**: UI reutilizável (`components/`)
- **Stores**: estado global e ações assíncronas (Pinia, `stores/`)
- **Services**: encapsulamento de endpoints (`service/`)
- **Composables**: cliente HTTP e utilidades de integração (`composables/`)
- **Middleware**: autenticação e autorização (`middleware/`)
- **Forms + Utils**: definição declarativa de formulários e validações (`forms/`, `utils/ValidateForm.ts`)

## Fluxo básico da aplicação

1. Requisições de páginas/componentes acionam ações de store.
2. Stores chamam services.
3. Services usam `useHttp`/`useHttpPagarMe`/`useCep`.
4. Middlewares (`auth.global.ts`, `permissao.ts`) controlam acesso por sessão e permissão.
5. UI exibe feedback via `alertStore` e componentes de carregamento/tabela.

## Comunicação frontend-backend

- API principal WeGIA via proxy `/api-wegia` (client) e URL direta no server (`BASE_URL_API_WEGIA`)
- Upload via `/api/upload/`
- Gateway Pagar.me via `/api-pagar-me`
- Consulta CEP via ViaCEP (`BASE_URL_API_CEP`)

Mais detalhes em [Integração com API](integracao-api.md).

## Organização por domínio

A estrutura repete o mesmo padrão para módulos como Pessoa, Funcionário, Atendido, Pet, Saúde, Material, Contribuição, Configuração e Memorando:

- `service/<Modulo>`
- `stores/<Modulo>`
- `forms/<Modulo>`
- `interface/<Modulo>`
- `pages/<modulo>`

!!! tip
    A consistência entre domínios facilita criação de novos recursos reaproveitando padrões existentes.
