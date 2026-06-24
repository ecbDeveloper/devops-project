# Estado da Aplicação

## Gerenciamento de estado

O projeto usa **Pinia** (`@pinia/nuxt`) com stores em `stores/`.

`nuxt.config.ts` inclui:

- `modules: ['@pinia/nuxt']`
- `pinia.storesDirs: ['./stores/**']`

## Stores centrais

- `authStore`: login/logout e token em cookie
- `pessoaStore`: usuário logado (`fetchMe`), permissões e dados de pessoa
- `alertStore`: feedback global (success/error/warning/info)
- `menuSectionsStore`: título, subtítulo e estado do menu lateral

## Stores por domínio

Há stores específicas por módulo em subpastas:

- `stores/Funcionario/*`
- `stores/Pessoa/*`
- `stores/Pet/*`
- `stores/Saude/*`
- `stores/Material/*`
- `stores/Contribuicao/*`
- `stores/Configuracao/*`
- `stores/Atendido/*`
- `stores/Socio/*`
- `stores/Memorando/*`

## Padrão observado

- state + getters + actions
- actions assíncronas chamando services
- tratamento com `try/catch` e propagação de erro
