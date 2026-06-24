# Serviços

## Organização

Serviços ficam em `service/` e são separados por domínio (`Pessoa`, `Pet`, `Saude`, `Material`, `Contribuicao`, etc.).

## Padrão de implementação

- Métodos com nome de ação de negócio (`buscar`, `cadastrar`, `atualizar`, `deletar`)
- Chamada HTTP via `useHttp` (ou `useHttpPagarMe` / `useCep`)
- Uso frequente de query string com `URLSearchParams`

## Serviço base

`service/Base/BaseService.ts` oferece um CRUD genérico:

- `criar`
- `listar`
- `buscarPorId`
- `atualizar`
- `deletar`

Alguns módulos usam serviços específicos sem herança direta, mantendo o mesmo estilo de acesso.

## Exemplo real

`AuthService` implementa:

- `POST /auth/login`
- `POST /auth/logout`

`PessoaService` implementa, entre outros:

- `GET /pessoa/logada`
- `PUT /pessoa/senha`
- `GET /pessoa/:cpf`

## Convenção recomendada para novos serviços

1. Criar arquivo em `service/<Modulo>/<Recurso>Service.ts`.
2. Encapsular endpoints do recurso.
3. Expor métodos tipados com interfaces de `interface/`.
4. Consumir via store (evitar acesso direto no componente).
