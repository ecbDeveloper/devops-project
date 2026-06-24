# Formulários e Validações

## Estrutura de formulários

Formulários são declarados em `forms/<Modulo>/*.ts` com arrays de seções e itens, por exemplo:

- `forms/Funcionario/cadastrarFuncionario.ts`
- `forms/Pessoa/cadastrarPessoa.ts`

Cada item costuma definir:

- `nome`, `label`, `type`, `value`, `erro`
- `validacao` (métodos de `ValidateForm`)
- `mask`, `regex`, `formatarParaEnviar`
- `storeOpcoes` para selects dinâmicos

## Renderização

- `components/Forms/index.vue`
- `components/Forms/VariasSessoes.vue`
- `components/Input/index.vue` (resolve input por `type`)

## Validação

Centralizada em `utils/ValidateForm.ts`.

Validações identificadas incluem:

- obrigatório
- CPF/CNPJ
- CEP
- datas (menor/maior que hoje)
- RG, PIS, CTPS
- CID
- email, telefone
- arquivo (tipo e tamanho)
- validação de regras de meio de pagamento
- validação completa de formulário (`ValidateForm.validate`)

## Exibição de erro

Mensagens de campo ficam no próprio item (`item.erro`) e alertas gerais usam `alertStore`.

## Padrão para novo formulário

1. Criar estrutura em `forms/<Modulo>/...`.
2. Reaproveitar `ValidateForm` e utilitários de transformação.
3. Renderizar com `Forms`/`VariasSessoes`.
4. Enviar via store -> service.
