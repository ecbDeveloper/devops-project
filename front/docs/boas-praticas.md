# Boas Práticas

## Organização de código

- Manter separação `pages -> stores -> services -> composables`
- Centralizar contratos em `interface/`
- Reaproveitar constantes em `constants/` (ex.: `Permissao`)

## Componentes

- Reutilizar componentes base (`Input`, `Modal`, `Tabela`, `Section/*`)
- Evitar duplicar UI que já exista em `components/`

## Formulários

- Definir schema no `forms/<Modulo>`
- Reaproveitar `ValidateForm`
- Manter transformação de payload em utilitários (`FormDataTransform`, `FormatarParaForm`)

## Consumo de API

- Encapsular endpoint em service
- Orquestrar fluxo na store
- Evitar chamadas HTTP diretas em componentes

## Erros e feedback

- Exibir feedback via `alertStore`
- Tratar falhas com `try/catch` e mensagens consistentes

## Evitar duplicação

- Use `BaseService` quando o recurso for CRUD padrão
- Compartilhe tipos e helpers entre módulos
